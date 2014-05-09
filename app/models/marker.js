define(['can/model', 'maputils', 'markerwithlabel', 'can/map/define', 'can/construct/super', './fixture'], function(Model, MapUtils){

	return can.Model.extend({
		findAll: 'GET /markers',
		findOne: 'GET /markers/{id}',
		create: 'POST /markers',
		update: 'PUT /markers/{id}',
		destroy: 'DELETE /markers/{id}',
		model: function(data) {
			return can.extend(data, {
				marker: {
					draggable: true,
					icon: 'green-dot.png',
					title: data.name,
					labelContent: data.name,
					position: MapUtils.latLng(data.latLng)
				}
			});
		}
	}, {
		define: {
			marker: {
				type: function(newVal) {
					return new MarkerWithLabel(newVal);
				},
				serialize: false
			},
			latLng: {
				type: function(newVal) {
					if(!can.isArray(newVal)){
						return newVal;
					} else {
						return MapUtils.latLng(newVal);
					}
				},
				serialize: function(currentValue){
					return [val.ob, val.pb];
				}
			}
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
})