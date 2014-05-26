define([
	'can/map',
	'can/map/define'
], function(Map){
	'use strict';

	var AppState = Map.extend({
		define: {
			loggedIn: {
				type: 'boolean',
				value: false,
				serialize: false
			},
			farmId: {
				type: 'number',
				value: null
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
			activePlacement: {
				serialize: false
			},
			activeFarm: {
				serialize: false
			}
		}
	});

	return new AppState();
});