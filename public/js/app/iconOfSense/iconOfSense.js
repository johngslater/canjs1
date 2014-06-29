define(function(require){
	'use strict';

	var Component = require('can/component');

	var template = require('text!./iconofsense.stache');

	require('ui/iconcanvas/iconcanvas'); // jun 26

	var ViewModel = {}; // sense property will be inserted automatically becuz ...

	Component.extend({
		tag: 'gt-iconofsense',
		template: can.stache(template),
		scope: ViewModel,
		events: {
			'inserted': function(){
			// whenever ui-senseicons' is inserted - the scope is not empty, scope has a 'sense' property
				console.log('ui-senseicons inserted', this.scope.serialize());
			}
		}
	});
	return ViewModel;
});