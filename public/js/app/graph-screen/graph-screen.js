define([
  'require',
  'can/component',
  'app/models/appstate',
  'text!./graph-screen.stache',
  'app/graph/graph',  //  w/Curtis Monday
  'can/view/stache'
], function (require, Component, appState) {
  'use strict';

    var template = require('text!./graph-screen.stache');
    var ViewModel = {};

  Component.extend({
    tag     :'app-graph-screen',
    template:can.stache(template),
    scope   :ViewModel,
    events  :{
      'inserted':function () {
      }
    }
  });

  return ViewModel;
});