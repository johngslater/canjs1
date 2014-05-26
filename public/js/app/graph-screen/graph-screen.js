define([
    'require',
    'can/component',
    'app/models/appstate',
    'text!./graph-screen.stache',
    'can/view/stache'
], function(require, Component, appState){
    'use strict';

    var template = require('text!./graph-screen.stache');
	var ViewModel = {};

    Component.extend({
        tag: 'gt-graph-screen',
        template: can.stache(template),
        scope: ViewModel
    });

    return ViewModel;
});