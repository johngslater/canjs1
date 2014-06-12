define(function(require){
	'use strict';

	var Component = require('can/component');

	var template = require('text!./senseicons.stache');

	require('../../ui/iconcanvas/iconcanvas');

	var ViewModel = {};

	Component.extend({
		tag: 'gt-senseicons',
		template: can.stache(template),
		scope: ViewModel,
		events: {
			'inserted': function(){
			// whenever ui-senseicons' is inserted - the scope is not empty
        // **OR** something is inserted into ui-senseicons', // the scope has 'sense'
				console.log('ui-senseicons inserted', this.scope.serialize());

    //    this.element.html('foo'+this.scope.sense)

        return;  // the rest of this code used to be in placement-form.js

//        var target=this.element.find('.senseIcons');
//        target.html('senseIcons go here');
//
//            //     var cnt=0; make it a global
//              var newCnvs=function(){cnt+=1;
//                var id='cnvs'+cnt;
//                console.log('placement-form.Component.events.inserted making a canvas with id:'+id);
//                return $('<canvas>').attr({ id:id, width:'45', height:'45' });
//              };
//
//              var arr=[
//                ['sun',true],
//                ['thermometer',true],
//                ['thermometer',false],
//                ['drop',true],
//                ['elec',true]
//              ];
//              $.map(arr,function(k,iii){
//                var cnvs=newCnvs();
//                var cb=(function(){
//                  return function(ev){
//                    console.log(iii,k); // now do something - need to pass in the operation desired
//                    console.log(appState.placement);
//                    debugger;
//                  };
//                })();
//                cnvs.click(cb);
//
//            //    senseIcons[k[0]](cnvs[0],k[1]);
//                target.append(cnvs);
//              });
			}
		}
	});
	return ViewModel;
});