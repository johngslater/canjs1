define([
	'can/component',
    'app/models/appstate',
	'app/models/marker',
	'googlemap',
	'maputil',
	'css!./marker-map.css'
], function(Component, appState, MarkerModel, Map, MapUtils){
	'use strict';

	var viewModel = can.Map.extend({
		center: MapUtils.latLng(36.913812,  -121.827072),
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		map: null,
		markers: new MarkerModel.List({}),
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
		}
	});

	can.Component.extend({
		tag: 'gt-marker-map',
		template: '<div class="marker-map"></div>',
		scope: viewModel,
		events: {
			'inserted': function(){
				var self = this;
				this.element.width(Math.min($('body').width(), 300));

				this.scope.attr('map', new google.maps.Map(this.element.find('.marker-map')[0], this.scope.getMapOptions()));
				//TODO: Rebind and call show
			},
			'{MarkerModel} created': function(Marker, ev, newMarker) {
				this.scope.markers.push(newMarker);
			},
			'{scope.markers} add': function(markers, ev, added, index) {
				var scope = this.scope;
				can.each(added, function(m){
					//Play nice with Google
					m.bindMapEvents(markers);
					m.show(scope.map);
				});
			},
			'{scope.markers} remove': function(markers, ev, removed, index) {
				can.each(removed, function(m){
					//Play nice with Google
					m.unbindMapEvents();
					m.remove();
				});
			},
			'{scope.markers} click': function(markers, ev, mapEv, marker) {
				appState.attr('activeMarker', marker);
				appState.attr('editing', true);
			},
			'{scope.markers} dragstart': function(markers, ev, mapEv, marker) {
				marker.attr('moves', marker.attr('moves') + 1);
				appState.attr('activeMarker', marker);
			},
			'{scope.markers} drag': function(markers, ev, mapEv, marker) {
				marker.attr('latLng', [mapEv.latLng.lat(), mapEv.latLng.lng()]);
			}
		}
	});

	return viewModel;

});