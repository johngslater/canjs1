/*
  require(['can', 'can/view/stache', 'app/models/appstate'], function(can, stache, appState){
    can === stache //->
  })

  Always require plugins at the end of your dependency list
  require(['can', 'app/models/appstate', 'can/view/stache'], function(can, appState){
  })
*/

//CC: stache!, ejs! and mustache! plugins are being developed so we don't have to use text! then run can.stache
define([
	'require',
	'can',
	'app/models/appstate',
	// 'app/models/gauges',
	'text!./index.stache',
	'can/view/stache',
	'app/map-screen/map-screen',
	'app/placement-screen/placement-screen',
	'app/graph-screen/graph-screen',
	//TODO: Remove these for production builds
	//TODO: look into excluding module ids in r.js
	'app/fixtures/farm',
	'css!./app.css'
], function(require, can, appState, Gauges){
	'use strict';
	window.Gauges = Gauges;

	var indexTemplate = require('text!./index.stache');

	$(function(){

		window.appState = appState;
		appState.attr({
			farmId: 1
		});

		//http://canjs.com/docs/can.route.map.html
		can.route.map(appState);

		can.route('', {
			'screen': 'map'
		});

		can.route('map/:farmId', {
			'screen': 'map'
		});

		can.route('map/:farmId/:placementId', {
			'screen': 'map'
		});

		can.route('placement/:farmId/:placementId', {
			'screen': 'placement'
		});

		// can.route('graph/:farmId/:placementId', {
		// 	'screen': 'graph'
		// });

		var indexView = can.stache(indexTemplate);

		var screens = [{
			template: can.stache('<gt-map-screen class="screen {{#if showMap}}active{{/if}}" placement="{placement}" farm="{farm}"></gt-map-screen>')
		},
		{
			template: can.stache('<gt-placement-screen class="screen {{#if showPlacement}}active{{/if}}" placement="{placement}" farm="{farm}"></gt-placement-screen>')
		},
		{
			template: can.stache('<gt-graph-screen class="screen {{#if showGraph}}active{{/if}}"></gt-placement-screen>')
		}
		];

		$('#app').append(can.stache(indexTemplate)(appState));

		can.route.ready();

		can.each(screens, function(screen){
			$('#content').append(screen.template(appState));
		});

	});

});