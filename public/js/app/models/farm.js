define([
	'can/model',
	'app/models/placement',
	'maputil',
	'markerwithlabel',
	'can/map/define',
	'can/construct/super'
], function(Model, PlacementList, MapUtils){
	'use strict';

	var Farm = can.Model.extend({
		findOne: 'GET /gauges',
		//parseModel calls model which calls parseModel again!?
		model: function(data, xhr) {
			var parsed = {
				name: data.configuration.farm_name,
				lat: +data.configuration.farm_latitude,
				lng: +data.configuration.farm_longitude,
				placements: []
			};
			for(var placement in data.configuration.placement) {
				parsed.placements.push(data.configuration.placement[placement]);
			}
			return new Farm(parsed);
		}
	}, {
		define: {
			placements: {
				Type: PlacementList
			}
		}
	});

	return Farm;
});