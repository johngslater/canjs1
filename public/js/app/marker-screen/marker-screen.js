define([
    'require',
    'can/component',
    'app/models/appstate',
    'text!./marker-screen.stache',
    'can/view/stache'
], function(require, Component, appState){
    'use strict';

    var template = require('text!./marker-screen.stache');

	var ViewModel = {
        goBack: function() {
            appState.attr('editing', false);
        }
    };

    Component.extend({
        tag: 'gt-marker-screen',
        template: can.stache(template),
        scope: ViewModel,
        events: {
            'input change': function(el, ev){
                var marker = this.scope.attr('marker');
                marker.attr('name');
                marker.marker.set('name', el.val());
                marker.marker.set('labelContent', el.val());
            }
        }
    });

    return ViewModel;
});