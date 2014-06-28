define(function(require){
	'use strict';

	var $ = require('jquery');
	var can = require('can');
	var Placement = require('app/models/placement/placement');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var parseData = function(data) {
		var placements = [];
		for(var id in data.placement) {
			var placement = data.placement[id];
			var gnode_model_id = placement.gnode_model_id;
			var senses = can.map(data.gnode_model[gnode_model_id], function(obj, key){
				return key;
			});
			placement.senses = senses;
			placements.push(placement);
		}
		return placements;
	};

	var getPlacements = function(params, subscribe) {
		var instance = new Placement.List(),
			def = $.Deferred(),
			update = function(data) {
				instance.attr(parseData(data));
			},
			lookupDef = cacheModel.getConfiguration(params, function(data){
				update(data);
			}, function(){
				console.error(arguments);
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

	return getPlacements;
});