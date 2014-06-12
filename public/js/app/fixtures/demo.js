define(function(require){
	'use strict';

	var Fixture = require('can/util/fixture');
	var moment = require('moment');

	var now = moment().subtract('days', 10);

	var DATA = [];

	for(var i = 0; i < 10; i++) {
		var date = moment(now).add('days', i).format('YYYY-MM-DD');
		var data = {
			id: i,
			date: date,
			name: date
		};
		DATA.push(data);
	}

	Fixture.delay = 2000;

	Fixture({
		'GET /gauges': function(settings){
			debugger
			var params = settings.data;
			console.log('GET /gauges', params);
			var match;
			can.each(DATA, function(item){
				if(moment(item.date).isSame(params.startDate)){
					match = item;
				}
			});
			return match;
		}
	});

});