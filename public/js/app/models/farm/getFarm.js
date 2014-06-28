define(function(require){
	'use strict';

	var $ = require('jquery');
	var can = require('can');
	var Farm = require('app/models/farm/farm');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var parseData = function(data) {
		return {
			name: data.farm_name,
			lat: +data.farm_latitude,
			lng: +data.farm_longitude
		};
	};

	var getFarm = function(params, subscribe) {
		var instance = new Farm(),
			def = $.Deferred(),
			update = function(data) {
				instance.attr(parseData(data));
			},
			lookupDef = cacheModel.getConfiguration(params, function(data){
				update(data);
			}, function(){
				console.error(arguments);
				//TODO: Handle Error
			});

			//Subscribing means we receive updates whenever configuration changes
			if(subscribe) {
				cacheModel.syncConfiguration(update);
			}

		//Make the instance have promise-like methods
		//The promise resolves when all pending requests are complete
		can.extend(instance, def.promise());

		lookupDef.then(function() {
			def.resolve(instance);
		});

		return instance;
	};

	return getFarm;
});