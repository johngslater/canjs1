define(function(require){
	'use strict';

	var $ = require('jquery');
	var Model = require('can/model');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');
	var MapUtils = require('maputil');
	require('markerwithlabel');
	require('can/construct/super');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var Reading = Model.extend({
		findAll: function(params) {
			return cacheModel.find(params, true);
		},
		models: function(data) {
			var readings = [];
			can.each(data, function(d){
				delete d.message;
				delete d.status;
				readings.push(d);
			});
			return new Reading.List(readings);
		}
	}, {
		//TODO: What data needs to be Observable?
		//We can exlude it here or use LazyMap
		define: {},
	});

	Reading.List.extend({
		//http://canjs.com/docs/can.List.Map.html
		Map: Reading
	}, {});

	return Reading;
});