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
	var getPlacements = require('app/models/placement/getPlacements');
	var getReadings = require('app/models/reading/getReadings');
	var getFarm = require('app/models/farm/getFarm');

	$(function(){

		// appState.attr('token', 'LCz7ugSWYT8SuWzQWF4A');
		appState.attr('token', 'xq998Xz4mLmEYzZHqndu');

		//## Readings

		//getPlacements immediately returns a can.Map
		//It will initially contain cached data
		var readings = getReadings({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		});

		//If any new data from requests is added, readings will be updated
		readings.bind('change', function(){
			console.log('readings change', arguments);
		});

		//readings also has promise methods that tell you when all
		//underlying requests are finished
		readings.then(function(){
			console.log('All readings updates done', readings);
		});

		//## Placements

		//getPlacements immediately returns a can.Map
		//It will initially contain cached data
		var placements = getPlacements({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		});

		//If any new data from requests is added, placements will be updated
		placements.bind('change', function(){
			console.log('placements change', arguments);
		});

		//placements also has promise methods that tell you when all
		//underlying requests are finished
		placements.then(function(){
			console.log('All placements updates done', placements);
		});

		//## FARM

		//getFarm immediately returns a can.Map
		//It will initially contain cached data
		var farm = getFarm({
			start_time: appState.attr('startTime'),
			end_time: appState.attr('endTime'),
			resolution: 900
		});

		//If any new data from requests is added, farm will be updated
		farm.bind('change', function(){
			console.log('farm change', arguments);
		});

		//farm also has promise methods that tell you when all
		//underlying requests are finished
		farm.then(function(){
			console.log('All farm updates done', farm);
		});

	});

});