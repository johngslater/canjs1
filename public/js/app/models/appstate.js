define(function(require) {
	'use strict';

	var Map = require('can/map');
	require('can/map/define');

	var AppState = Map.extend({
		define: {
			token: {
				type: 'string',
				serialize: false
			},
			startTime: {
				value: 1403841600,
				serialize: false
			},
			endTime: {
				value: 1403928000,
				serialize: false
			},
			resolution: {
				value: 900,
				serialize: false
			},
			showMap: {
				get: function(){
					return this.attr('screen') === 'map';
				}
			},
			showPlacement: {
				get: function(){
					return this.attr('screen') === 'placement';
				}
			},
			showGraph: {
				get: function(){
					return this.attr('screen') === 'graph';
				}
			},
			farm: {
				serialize: false
			},
			placement: {
				value: null,
				serialize: false
			},
			placementId: {
				get: function() {
					if(this.attr('placement')) {
						return this.attr('placement').id;
					}
				}
			}
		}
	});

	return new AppState();
});