define([
    'require',
    'can/component',
    'app/models/appstate',
    'text!./placement-form.stache',
    'can/view/stache',
    'can/map/define'
], function(require, Component, appState){
    'use strict';

    var template = require('text!./placement-form.stache');

	var ViewModel = function(attrs, parentScope, element) {
        return can.Map.extend({
            define: {
                editable: {
                    value: attrs.editable || true,
                    type: "boolean"
                }
            }
        });
    };

    Component.extend({
        tag: 'gt-placement-form',
        template: can.stache(template),
        scope: ViewModel
    });
    return ViewModel;
});