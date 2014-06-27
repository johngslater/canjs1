define(function(require){
	'use strict';

	var $ = require('jquery');
	var Construct = require('can/construct');
	var Map = require('can/map');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var Farm = Construct.extend({
		init: function(params) {
			var self = this,
				deferred = $.Deferred();

			cacheModel.find(params, false).then(function(data) {
				deferred.resolve(new Map(self.parseData(data)));
			}, function(){
				deferred.reject();
			});

			//Give this Construct instance everything a promise has
			can.extend(this, deferred.promise());
		},
		parseData: function(data) {
			return {
				name: data.farm_name,
				lat: +data.farm_latitude,
				lng: +data.farm_longitude
			};
		}
	});

	return Farm;
});