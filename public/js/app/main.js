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

	var can = require('can');
	var appState = require('app/models/appstate');

	window.appState = appState;

	var indexTemplate = require('text!./index.stache');

	require('can/view/stache');
	require('app/map-screen/map-screen');
	require('app/placement-screen/placement-screen');
	require('css!./app.css');

	//TODO: look at how we can conditionally load fixtures with a loader plugin
	//https://github.com/jrburke/requirejs/issues/451
	require('app/fixtures/farm');

	$(function(){

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
			template: can.stache('<app-map-screen class="screen {{#if showMap}}active{{/if}}" placement="{placement}" farm="{farm}"></app-map-screen>')
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

		can.each(screens, function(screen){
			$('#content').append(screen.template(appState));
		});

	});

});