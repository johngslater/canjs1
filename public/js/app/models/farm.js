define(function(require){
	'use strict';

	var Model = require('can/model');
	var Placement = require('app/models/placement');

	require('can/map/define');

	var Farm = can.Model.extend({
		findOne: 'GET http://secure.gthrive.com/api/v1/gauges.json', // options go into { }
//  findOne: 'GET /gauges',  // does not want '.json'  --> must match  EEEEE in fixtures/farm.js
		//BUG: parseModel calls model which calls parseModel again!?
		model: function(gauges, xhr) {
			var data = gauges.configuration;
			var parsed = {
				name: data.farm_name,
				lat: +data.farm_latitude,
				lng: +data.farm_longitude,
				placements: []
			};
			for(var id in data.placement) {
				var placement = data.placement[id];
				var gnode_model_id = placement.gnode_model_id;
				var senses = can.map(gauges.configuration.gnode_model[gnode_model_id], function(obj, key){
					return key;
				});
				placement.senses = senses;
				parsed.placements.push(placement);
			}
			return new Farm(parsed);
		}
	}, {
		//http://canjs.com/docs/can.Map.prototype.define.html
		define: {
			placements: {
				Type: Placement.List
			}
		},
		getPlacement: function(id) {
			var found;
			var needle = +id;
			this.attr('placements').each(function(placement){
				if(placement.id === needle) {
					found = placement;
					return false;
				}
			});
			return found;
		}
	});

	return Farm;
});