define(function(require){
	'use strict';

	var Component = require('can/component');
	var appState = require('app/models/appstate');
	var PlacementModel = require('app/models/placement');
	var Map = require('googlemap');
	var MapUtils = require('maputil');

	require('can/map/define');
	require('css!./map.css');

	var viewModel = can.Map.extend({
		map: null,
		mapReady: false,
		placements: [],
		updatePlacements: function() {
			var self = this;
			PlacementModel.findAll({
				start_time: appState.attr('startTime'),
                end_time: appState.attr('endTime'),
                src: 'map'
			}).then(function(placements){
				self.attr('placements', placements);
			});
		},
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
			var list = this.attr('placements');

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
			'inserted': function(){
				this.scope.updatePlacements();
			},
			//TODO: Handle changing farm and changing the map
			'{scope} placements': function() {
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
				var bounds = new google.maps.LatLngBounds(MapUtils.latLng(appState.farm.lat, appState.farm.lng));
				if(newVal) {
					scope.attr('placements').each(function(placement) {
						scope.addMarker(placement);
					});
				} else {
					//would this ever happen, maybe when we hide the map?
				}
			},
			'{scope.placements} click': function(markers, ev, mapEv, placement) {
				// appState.attr('activePlacement', placement);
				appState.attr('placement', placement);
				appState.attr('screen', 'placement');
			},
			'{scope.placements} dragstart': function(markers, ev, mapEv, placement) {
				placement.attr('moves', placement.attr('moves') + 1);
				appState.attr('placement', placement);
			},
			'{scope.placements} drag': function(markers, ev, mapEv, placement) {
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