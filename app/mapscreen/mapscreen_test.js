require.config({
	baseUrl: '/'
});

require(['jquery', 'funcunit', './mapscreen.js'], function($, F, ViewModel){

	window.appState = new can.Map({
		activeMarker: 1
	});

	var viewModel;

	module('initial render', {
		setup: function() {
			$('#qunit-test-area').html(can.stache('<map-screen></map-screen>')());
		},
		teardown: function() {
			$('#qunit-test-area').empty();
		}
	});

	test('marker-map is present', function(){
		F("marker-map").exists('marker-map exists');
	});

	module('view model', {
		setup: function(){
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

	 QUnit.load();
     QUnit.start();
});