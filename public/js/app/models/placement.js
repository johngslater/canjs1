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
			//http://canjs.com/docs/can.Construct.super.html
			//calls can.Map.prototype.setup
			this._super(can.extend(attrs, {
				marker: new MarkerWithLabel({
					draggable: true,
					icon: '/img/green-dot.png',
					title: attrs.display_name,
					labelContent: attrs.display_name,
					position: MapUtils.latLng(attrs.latitude, attrs.longitude)
				})
			}));
		},
		define: {
			moves: {
				value: 0
			}
		},
		bindMapEvents: function(list) {
			var marker = this.marker;
			this.mapEvents = [];
			// http://api.jquery.com/jQuery.proxy/
			this.mapEvents.push(google.maps.event.addListener(marker, 'click', $.proxy(this.dispatchEvent, this, 'click', list)));
			this.mapEvents.push(google.maps.event.addListener(marker, 'dragstart', $.proxy(this.dispatchEvent, this, 'dragstart', list)));
			this.mapEvents.push(google.maps.event.addListener(marker, 'drag', $.proxy(this.dispatchEvent, this, 'drag', list)));

			this.bind('display_name', function(ev, newVal){
				marker.set('title', newVal);
				marker.set('labelContent', newVal);
			});
		},
		unbindMapEvents: function() {
			can.each(this.mapEvents, function(ev) {
				google.maps.event.removeListener(ev);
			});
			this.mapEvents = [];
		},
		dispatchEvent: function(type, list, ev) {
			can.event.dispatch.call(list, type, [ev, this]);
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
	});

	Placement.List.extend({
		//http://canjs.com/docs/can.List.Map.html
		Map: Placement
	}, {});

	return Placement;
});