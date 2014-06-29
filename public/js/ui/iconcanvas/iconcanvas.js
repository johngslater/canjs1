define([
  'require',
  'app/models/appstate',
  'ui/canvases/icons'
],function(require, appState,icons){
	'use strict';
	var Component = require('can/component');
  require('can/view/stache');

	var ViewModel = {};   // why isnt this a can.Map - then I dont need to call fsm everywhere

  // todo: a can.Map should do all the bookkeeping and fire fsm
  var sense    =undefined; // abbrv for appState.attr('screen')
  var placement=undefined;
  var fsm=function(change){   // we should listen directly on appState - note we aren't using templates
    if(placement&&sense){
      console.log('in graph-screen plot ',placement.gnode_serial_num,sense);
      $('.foobar_'+ViewModel.sense).html(placement.gnode_serial_num+' > '+sense);
    }
    else if(sense){
      $('.foobar_'+ViewModel.sense).html(sense);
    }
    else{
      $('.foobar_'+ViewModel.sense).html('---');
    }
  };
//appState.bind('change', function(ev, attr, how, newVal, oldVal) { //listens for everything
  appState.bind('sense'    , function(ev, newVal, oldVal) {
    sense    =newVal; fsm({sense:newVal});
  }); // CCCCC
  appState.bind('placement', function(ev, newVal, oldVal) {
    placement=newVal; fsm({placement:newVal});
  });

  var newCnvs=function(){ return $('<canvas>').attr({ width:'45', height:'45' }); };
	Component.extend({
		tag: 'ui-iconcanvas',
    // {{sense}} is set by invocation of this component - see
    // in senseicons.stache   <ui-iconcanvas sense="{.}"></ui-iconcanvas>

    // http://canjs.com/docs/can.stache.helpers.helper.html
    // http://canjs.com/docs/can.stache.helper.html
		template: can.stache('<div class="whereToDrawTheIcon {{sense}}">draw canvas {{sense}}</div>'),
		scope: ViewModel,
		events: {
			'inserted': function(){  // todo: use a helper
        	  console.log('ui-iconcanvas inserted', this.scope.serialize());
        if(icons.draw[this.scope.sense]){
          this.element  // this.element is the template result
            .find('.whereToDrawTheIcon').html('')
            .append(icons.draw[this.scope.sense](newCnvs()));
        }
      },
      'click':function(){
        // todo: how did this.scope.sense get set?
        appState.attr('sense',this.scope.sense); //access 'sense'  via CCCCC
        if(appState.attr('screen')=='placement'){ appState.attr('screen', 'graph'); }
      },
      '{scope.sense} attrName': function(){
        debugger;  // todo:wtf, never gets here
      },
      '{appState} sense': function(sense,ev,newVal,oldVal){  // -> Captures all changes to sense
        console.log('{appState} sense  in iconcanvas');  // I see this 18 times!!!!!!!!!
      },
      '{scope} sense': function(sense,ev,newVal,oldVal){  // -> Captures all changes to sense
        console.log('iconcanvas has {scope} sense of: '+sense);   //
      }
		}
	});
	return ViewModel;  // I only execute this line once
});