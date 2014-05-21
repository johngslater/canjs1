define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/models/farm',
    'app/marker-map/marker-map',
    'text!./map-screen.stache',
    'can/view/stache'
], function(require, Component, appState, FarmModel, MarkerMapViewModel){
    'use strict';

    var template = require('text!./map-screen.stache');

    var viewModel = can.Map.extend({
        farmId: null,
        updateFarm: function(){
            var self = this;
            var id = this.attr('farmId');
            if(!id) {
                return;
            }

            FarmModel.findOne({id: id}).then(function(farm){
                self.attr({
                    farm: farm
                });
            });
        },
        marker: can.compute(function(){
            return appState.attr('activeMarker');
        })
    });

    Component.extend({
        tag: 'gt-map-screen',
        template: can.stache(template),
        scope: viewModel,
        events: {
            'inserted': function() {
                this.scope.updateFarm();
            },
            '{scope} farmId': function() {
                this.scope.updateFarm();
            }
        }
    });

    return viewModel;

});