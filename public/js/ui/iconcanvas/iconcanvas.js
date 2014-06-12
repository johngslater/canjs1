define([
  'require',
  'app/models/appstate'
],function(require, appState){
	'use strict';

	// var mapping = {
	// 	'sun'
	// }
	var Component = require('can/component');
  require('can/view/stache');
	var ViewModel = {}; // sense is passed in by zzzzz

  var sense    =undefined;
  var placement=undefined;
  var fsm=function(){
    if(placement&&sense){
      console.log('in graph-screen plot ',placement.gnode_serial_num,sense);
      $('.foobar').html(placement.gnode_serial_num+' > '+sense);
    }
    else{
      $('.foobar').html(sense);
    }
  };
  appState.bind('sense'    , function(ev, newVal, oldVal) { sense    =newVal; fsm(); });
  appState.bind('placement', function(ev, newVal, oldVal) { placement=newVal; fsm(); });

	Component.extend({
		tag: 'ui-iconcanvas',
    // sense is set by invocation of this component
		template: can.stache('<div class="foobar">draw canvas {{sense}}</div>'),
		scope: ViewModel,
		events: {
      'click':function(){
        appState.attr('screen', 'graph');
        appState.attr('sense',this.scope.sense); // how do I access 'sense'

  //      alert(this.element.html())
        alert(this.scope.sense); // how do i get {{sense}} in here?
                ;
              },
			'inserted': function(){
				console.log('ui-iconcanvas inserted', this.scope.serialize());



    //    this.scope.sense=this.scope.sense; // is {{sense}}


        // make the canvas as the template
         // or use a helper to do the drawing
        //





			// 		var target=this.element.find('.senseIcons');
			// 		target.html('senseIcons go here');


		 // //     var cnt=0; make it a global
			// 		var newCnvs=function(){cnt+=1;
			// 			var id='cnvs'+cnt;
			// 			console.log('placement-form.Component.events.inserted making a canvas with id:'+id);
			// 			return $('<canvas>').attr({ id:id, width:'45', height:'45' }); };

			// 		var cnvs=newCnvs();
			// 		senseIcons.sun(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.thermometer(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.thermometer(cnvs[0],false);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.drop(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.elec(cnvs[0],true);
			// 		target.append(cnvs);

				// 	}
			},
      '{scope.sense} attrName': function(){},  // redrawn

      '{scope} sense': function(sense,ev,newVal,oldVal){}// -> Captures all changes to sense
		}
	});
	return ViewModel;
});