define([
	'can/util/fixture',
	'json!./farm.json',
], function(Fixture, farmData){

	Fixture('GET http://secure.gthrive.com/api/v1/gauges.json', function(){   // EEEEE
		return farmData;
	});

});