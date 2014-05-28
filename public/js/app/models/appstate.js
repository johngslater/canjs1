define([
	'can/map',
    'app/models/farm',
	'can/map/define'
], function(Map, FarmModel){
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
				set: function(newId) {
					var self = this;
					if(this.attr('farmId') !== newId) {
						FarmModel.findOne({id: newId}).then(function(farm){
							self.attr('farm', farm);
						});
					}
					return newId;
				}
			},
			placementId: {
				type: 'number',
				set: function(newId) {
					var self = this;
					var farm = this.attr('farm');
					if(!farm) {
						FarmModel.findOne({id: newId}).then(function(farm){
			                self.attr('farm', farm);
			                self.attr('placement', farm.getPlacement(newId));
			            });
					} else {
						this.attr('placement', farm.getPlacement(newId));
					}
					return newId;
				}
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
			//Objects stored in appState should not serialize
			//if they do, at the most you want an id or some other identifier
			farm: {
				serialize: false
			},
			placement: {
				serialize: false
			}
		}
	});

	return new AppState();
});