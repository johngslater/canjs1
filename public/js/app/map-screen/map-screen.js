define(function(require){
    'use strict';

    var Component = require('can/component');
    var appState = require('app/models/appstate');
    var Farm = require('app/models/farm');
    var MarkerMapViewModel = require('app/map/map');

    require('can/view/stache');

    var template = require('text!./map-screen.stache');

    var viewModel = can.Map.extend({});

    Component.extend({
        tag: 'app-map-screen',
        template: can.stache(template),
        scope: viewModel,
        events: {}
    });

    return viewModel;

});