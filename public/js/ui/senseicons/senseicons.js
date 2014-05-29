define(function(require){
	'use strict';

	var Component = require('can/component');

	var template = require('text!./senseicons.stache');

	require('./iconcanvas/iconcanvas');

	var ViewModel = {};

	Component.extend({
		tag: 'ui-senseicons',
		template: can.stache(template),
		scope: ViewModel,
		events: {
			'inserted': function(){
				console.log('ui-senseicons inserted', this.scope.serialize());
			}
		}
	});
	return ViewModel;
});