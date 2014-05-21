define([
	'can/util/fixture',
	'json!./farm.json',
], function(Fixture, farmData){

	// // http://canjs.com/docs/can.fixture.types.Store.html
	// var farmStore = Fixture.store(farmData.length, function(i) {
	// 	var data = farmData[i] ? farmData[i]: {};
	// 	data.id = i + 1;
	// 	return data;
	// });

	Fixture('GET /gauges', function(){
		return farmData;
	})

	// Fixture({
	// 	'GET /gauges': farmStore.findOne
	// 	// 'GET /gauges/{id}': farmStore.findOne,
	// 	// 'POST /markers': function(settings){
	// 	// 	return settings.data;
	// 	// },
	// 	// 'PUT /gauges/{id}': farmStore.update,
	// 	// 'DELETE /gauges/{id}': farmStore.destroy
	// });
});