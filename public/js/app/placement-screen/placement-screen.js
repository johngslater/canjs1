define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/placement-form/placement-form',
    'text!./placement-screen.stache',
    'can/view/stache'
], function(require, Component, appState){
    'use strict';

    var template = require('text!./placement-screen.stache');

	var ViewModel = {
        goBack: function() {
            appState.attr('editing', false);
        }
    };

    Component.extend({
        tag: 'gt-placement-screen',
        template: can.stache(template),
        scope: ViewModel
    });

    return ViewModel;
});