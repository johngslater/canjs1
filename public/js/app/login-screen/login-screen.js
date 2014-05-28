define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/map/map',
    'app/placement-form/placement-form',
    'text!./map-screen.stache',
    'can/view/stache'
], function(require, Component, appState, FarmModel, MarkerMapViewModel){
    'use strict';

    var template = require('text!./map-screen.stache');

    var viewModel = can.Map.extend({
        farmId: null,
    });

    Component.extend({
        tag: 'gt-map-screen',
        template: can.stache(template),
        scope: viewModel,
        events: {
            'inserted': function() {
            }
        }
    });

    return viewModel;

});