define([
	'jquery',
	'funcunit',
    'app/models/appstate',
	'app/map-screen/map-screen'
], function($, F, appState, ViewModel){
	'use strict';

	module('app-map-screen', {
		setup: function() {
			appState.attr({
				farmId: 1
			});
			$('#qunit-test-area').html(can.stache('<app-map-screen farmId="{farmId}"></app-map-screen>')(appState));
		},
		teardown: function() {
			$('#qunit-test-area').empty();
			appState.attr({}, true);
		}
	});

	test('map is present', function(){
		F("app-map").exists('map exists');
	});

});