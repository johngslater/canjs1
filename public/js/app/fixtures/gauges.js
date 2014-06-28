define(function(require){

	var Fixture = require('can/util/fixture');
	var gaugesData = require('json!app/fixtures/gauges.json');

	Fixture('GET /api/v1/gauges.json', function(request, response){
		var delay = Math.random() * 5000 | 0;
		setTimeout(function(){
			response(200, gaugesData);
		}, delay);
	});
});