define(function(require){
	'use strict';

	var Map = require('can/map');
	var MapUtils = require('maputil');
	require('markerwithlabel');
	require('can/map/define');
	require('can/construct/super');

	var Placement = Map.extend({
		//TODO: What data needs to be Observable?
		//We can exlude it here or use LazyMap
		define: {
			moves: {
				value: 0
			}
		},
		setup: function(attrs){
			var data = can.extend({}, attrs);
			this._super(can.extend(data, {
				marker: new MarkerWithLabel({
					draggable: true,
					icon: '/img/green-dot.png',
					title: data.display_name,
					labelContent: data.display_name,
					position: MapUtils.latLng(data.latitude, data.longitude)
				})
			}));
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