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

	var appSettings = require('app/settings');
	var can = require('can');
	var appState = require('app/models/appstate');
	var getPlacements = require('app/models/placement/getPlacements');
	var getReadings = require('app/models/reading/getReadings');
	var getFarm = require('app/models/farm/getFarm');

	window.appState = appState;

	var indexTemplate = require('text!./index.stache');

	require('can/view/stache');
	require('app/map-screen/map-screen');
	require('app/placement-screen/placement-screen');
	require('app/graph-screen/graph-screen');

	require('css!./app.css');

	$(function(){

		// appState.attr('token', 'LCz7ugSWYT8SuWzQWF4A');
		appState.attr('token', 'xq998Xz4mLmEYzZHqndu');

		//http://canjs.com/docs/can.route.map.html
		can.route.map(appState);

		can.route('', {
			'screen': 'map'
		});

		// can.route('graph/:placementId', {
		// 	'screen': 'graph'
		// });

		var indexView = can.stache(indexTemplate);

		var screens = [{
			template: can.stache('<app-map-screen class="screen {{#if showMap}}active{{/if}}" farm="{farm}" placement="{placement}"></app-map-screen>')
		},
		{
			template: can.stache('<app-placement-screen class="screen {{#if showPlacement}}active{{/if}}" placement="{placement}" farm="{farm}"></app-placement-screen>')
		},
		{
			template: can.stache('<app-graph-screen class="screen {{#if showGraph}}active{{/if}}"></app-placement-screen>')
		}
		];

		$('#app').append(can.stache(indexTemplate)(appState));

		can.route.ready();

		//Need to get configuration to Bootstrap the app
		var farm = getFarm({
            start_time: appState.attr('startTime'),
            end_time: appState.attr('endTime'),
            src: 'main'
        }).then(function(farm){
        	debugger
            appState.attr('farm', farm);

            can.each(screens, function(screen){
				$('#content').append(screen.template(appState));
			});

        });

	});

});