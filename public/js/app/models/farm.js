define([
	'can/model',
	'app/models/placement',
	'can/map/define',
], function(Model, Placement){
	'use strict';

	var Farm = can.Model.extend({
		findOne: 'GET /gauges',
		//BUG: parseModel calls model which calls parseModel again!?
		model: function(data, xhr) {
			var parsed = {
				name: data.farm_name,
				lat: +data.farm_latitude,
				lng: +data.farm_longitude,
				placements: []
			};
			for(var placement in data.placement) {
				parsed.placements.push(data.placement[placement]);
			}
			return new Farm(parsed);
		}
	}, {
		define: {
			placements: {
				Type: Placement.List
			}
		}
	});

	return Farm;
});