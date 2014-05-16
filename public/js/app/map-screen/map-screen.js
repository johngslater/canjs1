define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/marker-map/marker-map',
    'text!./map-screen.stache',
    'can/view/stache'
], function(require, Component, appState, MarkerMapViewModel){
    'use strict';

    var template = require('text!./map-screen.stache');

    var viewModel = function(attrs, parentScope, element){
        return {
            marker: can.compute(function(){
                return appState.attr('activeMarker');
            })
        };
    };

    Component.extend({
        tag: 'gt-map-screen',
        template: can.stache(template),
        scope: viewModel
    });

    return viewModel;

});