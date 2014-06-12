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
				farmId: 1    // used to have activeMarker:1
			});
			$('#qunit-test-area').html(can.stache('<app-map-screen farmId="{farmId}"></app-map-screen>')(appState));
		},
		teardown: function() {
			$('#qunit-test-area').empty();
			appState.attr({}, true);
		}
	});

//  JGS: Jun 3 2014 why were these removed
//  -	test('marker-map is present', function(){
//  -		F("gt-marker-map").exists('marker-map exists');
//  -	});
//  -
//  -	module('map-screen: view model', {
//  -		setup: function(){
//  -			appState.attr({
//  -				activeMarker: 1
//  -			});
//  -			viewModel = can.Map.extend(ViewModel());
//  -		}
//  -	});
//  -
//  -	test('marker is present', function(){
//  -		var myVM = new viewModel();
//  -		equal(myVM.attr('marker'), 1);
//  -	});
//  -
//  -	test('marker gets updated', function(){
//  -		var myVM = new viewModel();
//  -		appState.attr('activeMarker', 2);
//  -		equal(myVM.attr('marker'), 2);

	test('map is present', function(){
		F("app-map").exists('map exists');
	});

});