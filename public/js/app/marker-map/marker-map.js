define([
	'can/component',
    'app/models/appstate',
	'app/models/marker',
	'googlemap',
	'maputil',
	'can/map/define',
	'css!./marker-map.css'
], function(Component, appState, MarkerModel, Map, MapUtils){
	'use strict';

	var viewModel = can.Map.extend({
		updateCenter: function(){
			var farm = this.attr('farm');
			if(farm) {
				this.attr('center', MapUtils.latLng(farm.lat, farm.lng));
			}
		},
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		map: null,
		getMapOptions: function() {
			return {
				center: this.attr('center'),
				zoom: this.attr('zoom'),
				mapTypeId: this.attr('mapTypeId')
			}
		},
		fitBounds: function() {
			var bounds = new google.maps.LatLngBounds();
			this.markers.forEach(function(m) {
				bounds.extend(m.latLng);
			});
			return bounds;
		},
		createMap: function(el) {
			var map = this.attr('map');
			if(!map) {
				this.attr('map', new google.maps.Map(el, this.getMapOptions()));
			}
		},
		addMarker: function(marker) {
			var map = this.attr('map');
			marker.bindMapEvents(this.attr('farm.placements'));
			marker.show(map);
		}
	});

	can.Component.extend({
		tag: 'gt-marker-map',
		template: '<div class="marker-map"></div>',
		scope: viewModel,
		events: {
			'inserted': function(){
				// this.element.width(Math.min($('body').width(), 300));
			},
			// '{MarkerModel} created': function(Marker, ev, newMarker) {
			// 	this.scope.markers.push(newMarker);
			// },
			'{scope.farm.placements} add': function(Scope, ev, changed, index) {
				console.log('add', arguments);
				// can.each(added, function(m){
				// 	//Play nice with Google
				// 	m.bindMapEvents(markers);
				// 	m.show(scope.map);
				// });
			},
			'{scope.farm.placements} remove': function(Scope, ev, added) {
				console.log('remove', arguments);
				// can.each(added, function(m){
				// 	//Play nice with Google
				// 	m.bindMapEvents(markers);
				// 	m.show(scope.map);
				// });
			},
			'{scope} farm': function() {
				var self = this;
				this.on();
				this.scope.updateCenter();
				this.scope.createMap(this.element.find('.marker-map')[0]);
				this.scope.attr('farm.placements').each(function(placement) {
					self.scope.addMarker(placement);
				})
			},
			// '{scope.placements} add': function(markers, ev, added, index) {
			// 	debugger
			// 	var scope = this.scope;
			// 	can.each(added, function(m){
			// 		//Play nice with Google
			// 		m.bindMapEvents(markers);
			// 		m.show(scope.map);
			// 	});
			// },
			// '{scope.markers} remove': function(markers, ev, removed, index) {
			// 	can.each(removed, function(m){
			// 		//Play nice with Google
			// 		m.unbindMapEvents();
			// 		m.remove();
			// 	});
			// },
			'{scope.farm.placements} click': function(markers, ev, mapEv, marker) {
				appState.attr('activeMarker', marker);
				appState.attr('editing', true);
			},
			'{scope.farm.placements} dragstart': function(markers, ev, mapEv, marker) {
				marker.attr('moves', marker.attr('moves') + 1);
				appState.attr('activeMarker', marker);
			},
			'{scope.farm.placements} drag': function(markers, ev, mapEv, marker) {
				// marker.attr('latLng', [mapEv.latLng.lat(), mapEv.latLng.lng()]);
			}
		}
	});

	return viewModel;

});