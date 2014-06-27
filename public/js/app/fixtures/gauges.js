define(function(require){

	var Fixture = require('can/util/fixture');
	var gaugesData = require('json!app/fixtures/gauges.json');

	Fixture('GET /api/v1/gauges.json', function(){
		return gaugesData;
	});

});