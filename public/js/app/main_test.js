//#33 appState is present
//#34 appState has proper attributes
//#36, #50 the indexView is rendered (check for presence of header, #content)
//#52-57 <map-screen> and <marker-screen> are rendered
//#39 <map-screen> is shown by default
//#45 marker-screen gets shown if editing is true

define([
	'require',
	'jquery',
	'test/common',
	'funcunit',
	'app/main'
], function(require, $, F){
	'use strict';

	module('app', {
		setup: function(){
			$('#qunit-test-area').append('<div id="app"></div>');
		},
		teardown: function(){
			$('#qunit-test-area').empty();
		}
	});

	test('ok', function(){
		ok(true);
	});

});