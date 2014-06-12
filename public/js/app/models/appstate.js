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
		},

    // routing and the browser keep track of this - so Curtis commented out my pseudo code
    // state:'same as currentScreen at this moment',
    // currentScreen:'loginScreen',  // TODO: should be a screen, not a string
    //     // maybe currentScreen is a fn that returns the top of screenHistory
    //    // login,farm,map,newPlacement w/WR,placement,graph
    // lastScreen:'from localStorage',
    // screenHistory:[], // setScreen pushes on to, back pops w/o setScreen
    //    // when close prgm, what do we put in localStorage


    editing:false,
    showGraph:false,
    activePlacement:undefined
  }); // editing showGraph activePlacement

  // TODO: implement setScreen, back
	return new AppState();
});