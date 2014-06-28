define(function(require){
	'use strict';

	var Map = require('can/map');
	require('can/map/define');

	var Farm = Map.extend({
		define: {}
	});

	return Farm;
});