define([
  'require',
  'can/component',
  'app/models/appstate',
  'app/iconofsense/iconofsense',

  'text!./graph-screen.stache',
  'app/graph/graph',  //  w/Curtis Monday
  'can/view/stache'
], function (require, Component, appState,iconOfSense) {
  'use strict';

  var template = require('text!./graph-screen.stache');
	var ViewModel = {};

  var inserted =false;
  var sense    =undefined;
  var placement=undefined;
  var fsm=function(){
    if(inserted&&placement&&sense){
      console.log('in graph-screen plot ',placement.gnode_serial_num,sense);
      $('#graphLabel').html(placement.gnode_serial_num+' > '+sense); // xyplot code TBD
    }
    else{
      $('#graphLabel').html('--------------------');
    }
  };
  appState.bind('sense'    , function(ev, newVal, oldVal) { sense    =newVal; fsm(); });
  appState.bind('placement', function(ev, newVal, oldVal) { placement=newVal; fsm(); });

  Component.extend({
    tag     :'app-graph-screen',
    template:can.stache(template),
    scope   :ViewModel,
    events  :{
      'inserted':function () {
        inserted=true; fsm();
      }
    }
  });

  return ViewModel;
});