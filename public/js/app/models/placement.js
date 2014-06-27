define(function(require){
	'use strict';

	var $ = require('jquery');
	var Model = require('can/model');
	var appSettings = require('app/settings');
	var CacheModel = require('app/models/cachemodel');
	var MapUtils = require('maputil');
	require('markerwithlabel');
	require('can/construct/super');

	var cacheModel = new CacheModel({
		ajaxOptions: {
			url: appSettings.api.gauges
		}
	});

	var Placement = Model.extend({
		findAll: function(params) {
			return cacheModel.find(params, false);
		},
		models: function(data) {
			var placements = [];
			for(var id in data.placement) {
				var placement = data.placement[id];
				var gnode_model_id = placement.gnode_model_id;
				var senses = can.map(data.gnode_model[gnode_model_id], function(obj, key){
					return key;
				});
				placement.senses = senses;
				placements.push(placement);
			}
			return new Placement.List(placements);
		}
	}, {
		//TODO: What data needs to be Observable?
		//We can exlude it here or use LazyMap
		define: {
			moves: {
				value: 0
			}
		},
		setup: function(attrs){
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