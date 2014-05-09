require.config({
	baseUrl: '/',
	paths : {
		'jquery' : 'bower_components/jquery/dist/jquery',
		'can': 'bower_components/canjs/amd/can',
		'gmap': 'google/map',
		'maputils': 'google/utils',
		'markerwithlabel': 'google/markerwithlabel',
		'async': 'bower_components/requirejs-plugins/src/async',
		'text': 'bower_components/requirejs-text/text',
		'css': 'bower_components/require-css/css'
	},
	shim: {
		'markerwithlabel': ['gmap']
	}
});

//CC: stache!, ejs! and mustache! plugins are being developed so we don't have to use text! then run can.stache
require(['can', 'text!app/index.stache', 'app/models/appstate', 'can/view/stache', 'css!app/app.css'], function(can, indexTemplate, AppState){

	$(function(){

		var appState = window.appState = new AppState();
		var rendered = {
			'map': false,
			'marker': false
		}

		var indexView = can.stache(indexTemplate);
		var mapScreenView = can.stache('<map-screen selected="{activeMarker}"></map-screen>');
		var markerScreenView = can.stache('<marker-screen marker="{activeMarker}"></marker-screen>');

		//Change screens when appState updates
		appState.bind('screen', function(ev, newScreen){

			if(newScreen === 'map') {
				if(rendered[newScreen]) {
					$('map-screen').removeClass('hide');
				} else {
					require(['app/mapscreen/mapscreen'], function(){

						$('#content').append(mapScreenView(appState));

					});
				}
				$('marker-screen').addClass('hide');
			}

			if(newScreen === 'marker') {

				if(rendered[newScreen]) {
					$('marker-screen').removeClass('hide');
				} else {
					require(['app/markerscreen/markerscreen'], function(){

						$('#content').append(markerScreenView(appState));

					});
				}
				$('map-screen').addClass('hide');

			}
			rendered[newScreen] = true;

		});

		$('#app').html(indexView(appState));

		appState.attr('screen', 'map');

	});

});
/*
(function($, can, undefined) {
	var MapUtils = {
		latLng: function(lat, lng) {
			//support taking an Array
			if (can.isArray(lat)) {
				lng = lat[1];
				lat = lat[0];
			}
			return new google.maps.LatLng(lat, lng);
		}
	};

	// Using an Object to store markers instead of a List
	// -> http://canjs.com/docs/can.Model.models.html  jgs: can you do this?!!!

	// Long polling
	// -> http://canjs.com/docs/can.Model.makeFindAll.html
	// -> http://canjs.com/docs/can.Model.findAll.html

	// RequireJS + CanJS
	// -> http://canjs.com/guides/using-loading.html#section_AMD

	// Make Require and Google play nices
	// -> https://github.com/millermedeiros/requirejs-plugins
	Marker = can.Model.extend({
		findAll: 'GET /markers',
		findOne: 'GET /markers/{id}',
		create: 'POST /markers',
		update: 'PUT /markers/{id}',
		destroy: 'DELETE /markers/{id}',
		//http://canjs.com/docs/can.Map.attributes.html
		attributes: {
			'latLng': 'latlng',
			'marker': 'marker'
		},
		convert: {
			latlng: function(raw){
				if(!can.isArray(raw)){
					return raw;
				} else {
					return MapUtils.latLng(raw);
				}
			}
		},
		serialize: {
			latlng: function(val) {
				return [val.ob, val.pb]
			},
			marker: function(val) {
				return null;
			}
		}
	}, {
		setup: function(data){
			// Create a Map Marker
			data.marker = new MarkerWithLabel({
				draggable: true,
				icon: 'green-dot.png',
				title: data.name,
				labelContent: data.name,
				position: MapUtils.latLng(data.latLng)
			});
			this._super(data);
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
		},
		lat: function() {
			return this.attr('latLng').ob;
		},
		lng: function() {
			return this.attr('latLng').pb;
		}
	});

	// Simulate AJAX responses
	var MARKERS = [
		{
			name:'foo',
			latLng:[36.913, -121.826],
			moves:0
		},
		{
			name:'bar',
			latLng:[36.914, -121.827],
			moves:0
		}
	];

	// http://canjs.com/docs/can.fixture.types.Store.html
	var markerStore = can.fixture.store(MARKERS.length, function(i) {
		var data = MARKERS[i] ? MARKERS[i]: {};
		data.id = i + 1;
		return data;
	});

	can.fixture({
		'GET /markers': markerStore.findAll,
		'GET /markers/{id}': markerStore.findOne,
		'POST /markers': function(settings){
			return settings.data;
		},
		'PUT /markers/{id}': markerStore.update,
		'DELETE /markers/{id}': markerStore.destroy
	});

	// App Component
	can.Component.extend({
		tag: 'demo-app',
		template: '<map-screen class="{{^showMap}}hidden{{/showMap}}"></map-screen><marker-screen class="{{^showEdit}}hidden{{/showEdit}}"></marker-screen>',
		scope: function(attrs, parentScope, element){
			return {
				showMap: can.compute(function(){
					return !(!!clientState.attr('editing'));
				}),
				showEdit: can.compute(function(){
					return !!clientState.attr('editing');
				})
			};
		}
	});

	// Map Screen
	can.Component.extend({
		tag: 'map-screen',
		template: '<map></map>' +
				   '{{#marker}}<strong>Name:</strong> {{marker.name}}<br>' +
				   '<strong>Moves:</strong> {{marker.moves}}<br>' +
				   '<strong>Lat:</strong> {{marker.lat}}<br>' +
				   '<strong>Lng:</strong> {{marker.lng}}{{/marker}}',
		scope: function(attrs, parentScope, element){
			return {
				marker: can.compute(function(){
					return clientState.attr('selected');
				})
			}
		}
	});

	can.Component.extend({
		tag: 'marker-screen',
		template: '{{#marker}}<strong>Name:</strong> <input type="text" value="{{marker.name}}"><br>' +
				   '<strong>Moves:</strong> {{marker.moves}}<br>' +
				   '<strong>Lat:</strong> {{marker.lat}}<br>' +
				   '<strong>Lng:</strong> {{marker.lng}}<br>{{/marker}}<br>' +
				   '<button class="back" can-click="goBack">Back</button>',
		scope: function(attrs, parentScope, element){
			return {
				marker: can.compute(function(){
					return clientState.attr('editing');
				}),
				goBack: function() {
					clientState.removeAttr('editing');
				}
			}
		},
		events: {
			'input change': function(el, ev){
				var marker = this.scope.attr('marker');
				marker.attr('name')
				marker.marker.set('name', el.val());
				marker.marker.set('labelContent', el.val());
			}
		}
	});

	//Construct -> Map -> Model -> Marker
	//Construct -> Map -> List -> Marker.List
	can.Component.extend({
		tag: 'map',
		template: '<div class="map"></div>',
		scope: {
			center: MapUtils.latLng(36.913812,  -121.827072),
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			map: null,
			markers: new Marker.List(),
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
		},
		events: {
			'inserted': function(){
				var self = this;
				this.element.width(Math.min($('body').width(), 300));

				this.scope.attr('map', new google.maps.Map(this.element.find('.map')[0], this.scope.getMapOptions()));

				this.scope.markers.replace(Marker.findAll({}));
			},
			'{Marker} created': function(Marker, ev, newMarker) {
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
				clientState.attr('selected', marker);
				clientState.attr('editing', marker);
			},
			'{scope.markers} dragstart': function(markers, ev, mapEv, marker) {
				marker.attr('moves', marker.attr('moves') + 1)
				clientState.attr('selected', marker);
			},
			'{scope.markers} drag': function(markers, ev, mapEv, marker) {
				marker.attr('latLng', [mapEv.latLng.lat(), mapEv.latLng.lng()])
			}
		}
	});

	clientState = new can.Map({
		selected: null,
		editing: null
	});

	$('.addMarker').click(function() {
		var marker = new Marker({
			name: 'baz',
			latLng:[36.915, -121.828],
			moves: 0
		})
		marker.save();
	})

	$('#demo').html(can.view('app', {}));

}(jQuery, can));
*/