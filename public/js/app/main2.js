/*
  require(['can', 'can/view/stache', 'app/models/appstate'], function(can, stache, appState){
    can === stache //->
  })

  Always require plugins at the end of your dependency list
  require(['can', 'app/models/appstate', 'can/view/stache'], function(can, appState){
  })
*/

//CC: stache!, ejs! and mustache! plugins are being developed so we don't have to use text! then run can.stache
define(function(require){
	'use strict';

	require('css!./app.css');
	var appSettings = require('app/settings');
	var can = require('can');
	var appState = require('app/models/appstate');
	var PlacementModel = require('app/models/placement');
	var ReadingModel = require('app/models/reading');
	var Farm = require('app/models/farm');

	$(function(){

		// appState.attr('token', 'LCz7ugSWYT8SuWzQWF4A');
		appState.attr('token', 'xq998Xz4mLmEYzZHqndu');

		PlacementModel.findAll({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		}).then(function(data) {
			console.log('Got placements', data);
		}, function(){
			console.error('ERROR', arguments);
		});

		ReadingModel.findAll({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		}).then(function(data) {
			console.log('Got readings', data);
		}, function(){
			console.error('ERROR', arguments);
		});

		new Farm({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		}).then(function(data) {
			console.log('Got farm', data);
		}, function(){
			console.error('ERROR', arguments);
		});


	});

});