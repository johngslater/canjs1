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
        }
    };

    Component.extend({
        tag: 'app-placement-screen',
        template: can.stache(template),
        scope: ViewModel,
        events: {
            '.graph click': function() {
                this.scope.gotoGraph();
            }
        }
    });

    return ViewModel;
});