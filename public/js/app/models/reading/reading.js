define(function(require){
	'use strict';

	var Map = require('can/map');
	require('can/map/define');

	var Reading = Map.extend({
		define: {}
	});

	Reading.List.extend({
		//http://canjs.com/docs/can.List.Map.html
		Map: Reading
	}, {});

	return Reading;
});