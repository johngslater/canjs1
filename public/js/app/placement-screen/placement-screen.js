define([
    'require',
    'can/component',
    'app/models/farm',
    'app/models/appstate',
    'app/placement-form/placement-form',
    'text!./placement-screen.stache',
    'can/view/stache'
], function(require, Component, FarmModel, appState){
    'use strict';

    var template = require('text!./placement-screen.stache');

	var ViewModel = {
        gotoGraph: function() {
            appState.attr('screen', 'graph');
        },
        updatePlacement: function() {
            var scope = this;
            var farmId = appState.attr('farmId');
            var placementId = appState.attr('placementId');
            console.log('I need an id')
            FarmModel.findOne({id: farmId}).then(function(farm){
                //TODO: Clean this up
                appState.attr('activeFarm', farm);
                appState.attr('activePlacement', farm.getPlacement(placementId));
                scope.attr('placement', farm.getPlacement(placementId));
            });
        }
    };

    Component.extend({
        tag: 'gt-placement-screen',
        template: can.stache(template),
        scope: ViewModel,
        events: {
            'inserted': function() {
                this.scope.updatePlacement();
            },
            '{scope} placement': function() {
            }
        }
    });

    return ViewModel;
});