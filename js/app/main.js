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
	'app/marker-screen/marker-screen',
	'css!./app.css',
	'app/fixtures/marker'
], function(require, can, appState){
	'use strict';

	var indexTemplate = require('text!./index.stache');

	$(function(){

		appState.attr({
			editing: false
		});
		var indexView = can.stache(indexTemplate);
		var screens = [{
			template: can.stache('<gt-map-screen class="screen {{#if isActive}}active{{/if}}" selected="{appState.activeMarker}"></gt-map-screen>'),
			isActive: function(){
				return appState.attr('editing') === false;
			}
		},
		{
			template: can.stache('<gt-marker-screen class="screen {{#if isActive}}active{{/if}}" marker="{appState.activeMarker}"></gt-marker-screen>'),
			isActive: function(){
				return appState.attr('editing') === true;
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