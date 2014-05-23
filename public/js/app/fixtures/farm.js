define([
	'can/util/fixture',
	'json!./farm.json',
], function(Fixture, farmData){

	Fixture('GET /gauges', function(){
		return farmData;
	});

});