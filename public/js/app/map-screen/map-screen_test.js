define([
	'jquery',
	'funcunit',
    'app/models/appstate',
	'app/map-screen/map-screen',
	'app/fixtures/marker'
], function($, F, appState, ViewModel){
	'use strict';

	var viewModel;

	module('map-screen: initial render', {
		setup: function() {
			appState.attr({
				activeMarker: 1
			});
			$('#qunit-test-area').html(can.stache('<gt-map-screen></gt-map-screen>')());
		},
		teardown: function() {
			$('#qunit-test-area').empty();
			appState.attr({}, true);
		}
	});

	test('marker-map is present', function(){
		F("gt-marker-map").exists('marker-map exists');
	});

	module('map-screen: view model', {
		setup: function(){
			appState.attr({
				activeMarker: 1
			});
			viewModel = can.Map.extend(ViewModel());
		}
	});

	test('marker is present', function(){
		var myVM = new viewModel();
		equal(myVM.attr('marker'), 1);
	});

	test('marker gets updated', function(){
		var myVM = new viewModel();
		appState.attr('activeMarker', 2);
		equal(myVM.attr('marker'), 2);
	});

});