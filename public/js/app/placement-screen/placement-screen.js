define([
    'require',
    'can/component',
    'app/models/appstate',
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
        scope: ViewModel,
        events: {
            'input change': function(el, ev){
                // var placement = this.scope.attr('placement');
                // placement.attr('display_name');
                // placement.marker.set('name', el.val());
                // placement.marker.set('labelContent', el.val());
            }
        }
    });

    return ViewModel;
});