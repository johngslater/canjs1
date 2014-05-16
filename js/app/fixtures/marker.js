define([
	'can/util/fixture'
], function(Fixture){
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
	var markerStore = Fixture.store(MARKERS.length, function(i) {
		var data = MARKERS[i] ? MARKERS[i]: {};
		data.id = i + 1;
		return data;
	});

	Fixture({
		'GET /markers': markerStore.findAll,
		'GET /markers/{id}': markerStore.findOne,
		'POST /markers': function(settings){
			return settings.data;
		},
		'PUT /markers/{id}': markerStore.update,
		'DELETE /markers/{id}': markerStore.destroy
	});
});