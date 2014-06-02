define([
    'require',
    'can/component',
    'app/models/appstate',
    'app/models/placement',  // JGS
    'app/models/farm', // JGS
 //   '../../ui/iconDrawers/senseIcons',  // WTF  got js/app/ui/iconDrawers/senseIcons
    'ui/iconDrawers/senseIcons',
    'text!./placement-form.stache',
    'can/view/stache',
    'can/map/define'
], function(require, Component, appState, placement,farm,senseIcons){
    'use strict';

    var template = require('text!./placement-form.stache');

	  var ViewModel = function(attrs, parentScope, element) { // JGS : what is attrs
//      debugger;   // attrs looks like the template
        return can.Map.extend({
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
        });
    };

    Component.extend({
        tag: 'gt-placement-form',
        template: can.stache(template),
        scope: ViewModel,
        events: {
      			'inserted': function(){

              var target=this.element.find('.senseIcons');
              target.html('senseIcons go here');

         //     var cnt=0; make it a global
              var newCnvs=function(){cnt+=1;
                var id='cnvs'+cnt;
                console.log('placement-form.Component.events.inserted making a canvas with id:'+id);
                return $('<canvas>').attr({ id:id, width:'45', height:'45' });
              };

              var arr=[
                ['sun',true],
                ['thermometer',true],
                ['thermometer',false],
                ['drop',true],
                ['elec',true]
              ];
              $.map(arr,function(k,iii){
                var cnvs=newCnvs();
                var cb=(function(){
                  return function(ev){
                    console.log(iii,k); // now do something - need to pass in the operation desired
                    console.log(appState.placement);
                    debugger;
                  };
                })();
                cnvs.click(cb);

                senseIcons[k[0]](cnvs[0],k[1]);
                target.append(cnvs);
              });


              console.log('placement form inserted');

            }
        }

    });
    return ViewModel;
});

var cnt=0;