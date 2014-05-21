define([
	'can/list',
	'can/map',
	'maputil',
	'markerwithlabel',
	'can/map/define',
	'can/construct/super'
], function(List, Map, MapUtils){
	'use strict';

	var Placement = Map.extend({
		setup: function(attrs){
			this._super(can.extend(attrs, {
				marker: new MarkerWithLabel({
					draggable: true,
					icon: '/img/green-dot.png',
					title: attrs.display_name,
					labelContent: attrs.display_name,
					position: MapUtils.latLng(attrs.latitude, attrs.longitiude)
				})
			}));
		},
		bindMapEvents: function(list) {
			this.mapEvents = [];
			// http://api.jquery.com/jQuery.proxy/
			this.mapEvents.push(google.maps.event.addListener(this.marker, 'click', $.proxy(this.forwardEvent, this, 'click', list)));
			this.mapEvents.push(google.maps.event.addListener(this.marker, 'dragstart', $.proxy(this.forwardEvent, this, 'dragstart', list)));
			this.mapEvents.push(google.maps.event.addListener(this.marker, 'drag', $.proxy(this.forwardEvent, this, 'drag', list)));
		},
		unbindMapEvents: function() {
			can.each(this.mapEvents, function(ev) {
				google.maps.event.removeListener(ev);
			});
			this.mapEvents = [];
		},
		forwardEvent: function(type, list, ev) {
			//this triggers events on the Marker.List instance (list)
			can.trigger(list, type, [ev, this]);
		},
		show: function(map) {
			this.marker.setMap(map);
		},
		hide: function() {
			this.marker.setMap(null);
		},
		remove: function() {
			this.hide();
			this.marker = null;
		}
		// lat: function() {
		// 	// return this.attr('marker.latLng').ob;
		// },
		// lng: function() {
		// 	// return this.attr('marker.latLng').pb;
		// }
	});

	var List = List.extend({
		//http://canjs.com/docs/can.List.Map.html
		Map: Placement
	}, {});

	return List;
});