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
	'text!./index.stache',
	'can/view/stache',
	'app/map-screen/map-screen',
	'app/placement-screen/placement-screen',
	'app/graph-screen/graph-screen',
	//TODO: Remove these for production builds
	//TODO: look into excluding module ids in r.js
	'app/fixtures/farm',
	'css!./app.css'
], function(require, can, appState){
	'use strict';

	var indexTemplate = require('text!./index.stache');

	$(function(){

		appState.attr({
			editing: false,
			showGraph: false,
			farmId: 1
		});
		var indexView = can.stache(indexTemplate);
		var screens = [{
			template: can.stache('<gt-map-screen class="screen {{#if isActive}}active{{/if}}" selected="{appState.activePlacement}" farm-id="{appState.farmId}"></gt-map-screen>'),
			isActive: function(){
				return appState.attr('editing') === false;
			}
		},
		{
			template: can.stache('<gt-placement-screen class="screen {{#if isActive}}active{{/if}}" placement="{appState.activePlacement}" farm-id="{appState.farmId}"></gt-placement-screen>'),
			isActive: function(){
				return appState.attr('editing') === true && appState.attr('showGraph') === false;
			}
		},
		{
			template: can.stache('<gt-graph-screen class="screen {{#if isActive}}active{{/if}}"></gt-placement-screen>'),
			isActive: function(){
				return appState.attr('editing') === true && appState.attr('showGraph') === true;
			}
		}];

		$('#app').append(can.stache(indexTemplate)(appState));

		can.each(screens, function(screen){
			$('#content').append(screen.template({
				appState: appState,
				isActive: screen.isActive
			}));
		});

	});

});