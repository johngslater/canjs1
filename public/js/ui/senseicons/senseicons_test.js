define([
	'jquery',
	'funcunit'
], function($, F){
	'use strict';

	module('senseicons', {
		setup: function() {
		},
		teardown: function() {
			$('#qunit-test-area').empty();
		}
	});

	test('ok', function(){
		ok(true, 'works!');
	});

});