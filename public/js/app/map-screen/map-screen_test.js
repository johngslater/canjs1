define([
	'jquery',
	'funcunit',
    'app/models/appstate',
	'app/map-screen/map-screen',
	'app/fixtures/farm'
], function($, F, appState, ViewModel){
	'use strict';

	module('map-screen: initial render', {
		setup: function() {
			appState.attr({
				farmId: 1
			});
			$('#qunit-test-area').html(can.stache('<gt-map-screen farmId="{farmId}"></gt-map-screen>')(appState));
		},
		teardown: function() {
			$('#qunit-test-area').empty();
			appState.attr({}, true);
		}
	});

	test('map is present', function(){
		F("gt-map").exists('map exists');
	});

});