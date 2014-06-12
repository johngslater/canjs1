define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/models/placement',  // JGS
    'app/models/farm', // JGS
    'app/senseicons/senseicons',
    'text!./placement-form.stache',
    'can/view/stache',
    'can/map/define'
], function(require, Component, appState, placement,farm,senseIcons){
    'use strict';

    var template = require('text!./placement-form.stache');

	  var ViewModel = function(attrs, parentScope, element) { // JGS : who calls this????
        return can.Map.extend({
          //http://canjs.com/docs/can.Map.prototype.define.html
            define: {
                editable: {
                    value: attrs.editable || true,
                    type: "boolean"
                },
              // JGS stuff added May 28
                placement: {
                  value:attrs.placement,
                  type: "object"
                }
            }

//          return can.Map.extend(
//          this is what it should be
//          can_define({
//              editable: {
//                  value: attrs.editable || true,
//                  type: "boolean"
//              },
//            // JGS stuff added May 28
//              placement: {
//                value:attrs.placement,
//                type: "object"
//              }
//          })
//
        });
    };
    Component.extend({
        tag: 'app-placement-form',
        template: can.stache(template),
        scope: ViewModel,
        events: {
      			'inserted': function(){
              //Need to use <gt-senseicons></gt-senseicons> to draw icons
              //  since senseicons is a component
              //You can configure the behavior of the component by passing in attributes
              //http://canjs.com/docs/can.Component.html

              console.log('placement form inserted');
              console.log('the gt-senseicons tag will automagically update everything')
              console.log(this); // produces an error
            //console.log(ViewModel);  // the fn defined above
              console.log(this.scope); // has values substituted
              return; // the rest of this stuff is now taken over by senseicons.js
            }
        }
    });
    return ViewModel;
});
var cnt=0;