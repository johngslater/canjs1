define(function(require){
	'use strict';

	var $ = require('jquery');
	var can = require('can');
	var appState = require('app/models/appstate');

	//http://api.jquery.com/jquery.ajaxprefilter/
	$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
		var data = can.deparam(options.data);

		//These are present in every request
		data.token = appState.attr('token');
		data.resolution = appState.attr('resolution');

		options.data = can.param(data);
	});

	return $;
});