/*
  require(['can', 'can/view/stache', 'app/models/appstate'], function(can, stache, appState){
    can === stache //->
  })

  Always require plugins at the end of your dependency list
  require(['can', 'app/models/appstate', 'can/view/stache'], function(can, appState){
  })
*/

//CC: stache!, ejs! and mustache! plugins are being developed so we don't have to use text! then run can.stache
define(function(require){
	'use strict';

	var Model = require('app/models/cacheModel');
	window.myStorage = require('ui/storage/storage');


	require('app/fixtures/demo');
	require('can/view/stache');

	var cachedModel = new Model({});

	var template = can.stache('<ul>{{#each .}}<li>{{name}}</li>{{/each}}</ul>');
	var list1 = cachedModel.find({startDate: '2014-06-01'});
	var list2 = cachedModel.find({startDate: '2014-05-29'});
	$('#app').append(template(list1));
	$('#app').append('<hr>');
	$('#app').append(template(list2));


});