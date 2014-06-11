define([
	'can/component',
  'app/models/appstate',
	'googlemap',
	'maputil',
	'can/map/define',
	'css!./map.css'
], function(Component, appState, Map, MapUtils){
	'use strict';

	var viewModel = can.Map.extend({
		map: null,
		mapReady: false,
		getMapOptions: function() {
			return {
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		},
		updateBounds: function(marker) {
			var map = this.attr('map'),
				bounds = map.getBounds(),
				farm = this.attr('farm');
			//check for null or undefined with == null
			if(bounds == null) {
				bounds = new google.maps.LatLngBounds(marker.getPosition());
			} else {
				bounds.extend(marker.getPosition());
			}
			map.fitBounds(bounds);
		},
		createMap: function(el) {
			var map = this.attr('map');
			if(!map) {
				this.attr('map', new google.maps.Map(el, this.getMapOptions()));
			}
		},
		addMarker: function(placement) {
			var map = this.attr('map');
			var list = this.attr('farm.placements');

			placement.bindMapEvents(list);
			this.updateBounds(placement.marker);
			placement.show(map);
		},
		removeMarker: function(placement) {
			var map = this.attr('map');

			placement.unbindMapEvents(list);
			// Completely recompute bounds?
			placement.remove(map);
		}
	});
	//Need to trigger resize on the map if we hide it then show it again
	can.Component.extend({
		tag: 'app-map',
		template: '<div class="map"></div>',
		scope: viewModel,
		events: {
			'inserted': function(){  ;
			},
			'{scope.farm.placements} remove': function(Scope, ev, added) {
				//TODO: Cleanup map events and remove from map
				console.log('remove', arguments);
			},
			'{scope.farm.placements} add': function(Scope, ev, added) {
				//Bind map events and add to map
				console.log('add', arguments);
			},
			//TODO: Handle changing farm and changing the map
			'{scope} farm': function() {
				var self = this;
				this.scope.createMap(this.element.find('.map')[0]);
				this.map = this.scope.attr('map');
				this.farm = this.scope.attr('farm');
				google.maps.event.addListenerOnce(this.map, 'idle', function(){
					self.scope.attr('mapReady', true);
				});
			},
			'{scope} mapReady': function(Scope, ev, newVal){
				var scope = this.scope;
				var bounds = new google.maps.LatLngBounds(MapUtils.latLng(this.farm.lat, this.farm.lng));
				if(newVal) {
					scope.attr('farm.placements').each(function(placement) {
						scope.addMarker(placement);
					});
				} else {
					//would this ever happen, maybe when we hide the map?
				}
			},
			'{scope.farm.placements} click': function(markers, ev, mapEv, placement) {
				// appState.attr('activePlacement', placement);
				appState.attr('placementId', placement.id);
				appState.attr('screen', 'placement');
			},
			'{scope.farm.placements} dragstart': function(markers, ev, mapEv, placement) {
				placement.attr('moves', placement.attr('moves') + 1);
				appState.attr('placementId', placement.id);
			},
			'{scope.farm.placements} drag': function(markers, ev, mapEv, placement) {
				var position = mapEv.latLng;
				placement.attr({
					latitude: position.lat(),
					longitude: position.lng()
				});
			},
            '{appState} showMap': function(appState, ev, newVal) {
				//Prevent half loaded tiles
				//TODO: Reset zoom?
				if(newVal) {
					var map = this.scope.attr('map');
					google.maps.event.trigger(map, 'resize');
				}
			}
		}
	});

	return viewModel;

});