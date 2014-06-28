define(function(require){
	'use strict';

	var $ = require('jquery');
	var can = require('can');
	var Reading = require('app/models/reading/reading');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var parseData = function(data) {
		//TODO: Parse this properly
		return data.data;
	};

	var getReadings = function(params) {
		var instance = new Reading.List(),
			def = $.Deferred(),
			update = function(data) {
				instance.attr(parseData(data));
			},
			lookupDef = cacheModel.getData(params, function(data){
				update(data);
			}, function(){
				console.error(arguments);
			});

		//Make the instance have promise-like methods
		//The promise resolves when all pending requests are complete
		can.extend(instance, def.promise());

		lookupDef.then(function() {
			def.resolve(instance);
		});

		return instance;
	};

	return getReadings;
});