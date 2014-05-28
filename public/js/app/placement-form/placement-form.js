define([
    'require',
    'can/component',
    'app/models/appstate',
 //   '../../ui/iconDrawers/senseIcons',  // WTF  got js/app/ui/iconDrawers/senseIcons
    'ui/iconDrawers/senseIcons',
    'text!./placement-form.stache',
    'can/view/stache',
    'can/map/define'
], function(require, Component, appState, senseIcons){
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
        scope: ViewModel,
        events: {
      			'inserted': function(){
              var target=$('.senseIcons');
              target.html('senseIcons go here');


         //     var cnt=0; make it a global
              var newCnvs=function(){cnt+=1;
                var id='cnvs'+cnt;
                console.log('placement-form.Component.events.inserted making a canvas with id:'+id);
                return $('<canvas>').attr({ id:id, width:'45', height:'45' }); };

              var cnvs=newCnvs();
              senseIcons.sun(cnvs[0],true);
              target.append(cnvs);
              var cnvs=newCnvs();
              senseIcons.thermometer(cnvs[0],true);
              target.append(cnvs);
              var cnvs=newCnvs();
              senseIcons.thermometer(cnvs[0],false);
              target.append(cnvs);
              var cnvs=newCnvs();
              senseIcons.drop(cnvs[0],true);
              target.append(cnvs);
              var cnvs=newCnvs();
              senseIcons.elec(cnvs[0],true);
              target.append(cnvs);

            }
        }

    });
    return ViewModel;
});

var cnt=0;