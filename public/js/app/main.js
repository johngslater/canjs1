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

	var appSettings   = require('app/settings');
	var can           = require('can');
	var appState      = require('app/models/appstate');
	var getPlacements = require('app/models/placement/getPlacements');
	var getReadings   = require('app/models/reading/getReadings');
	var getFarm       = require('app/models/farm/getFarm');

	window.appState = appState;

	var indexTemplate = require('text!./index.stache');

	require('can/view/stache');
	require('app/map-screen/map-screen');
	require('app/placement-screen/placement-screen');

	require('app/graph-screen/graph-screen');

	require('css!./app.css');

		//TODO: look at how we can conditionally load fixtures with a loader plugin
	//https://github.com/jrburke/requirejs/issues/451
//require('app/fixtures/farm');  // uncomment when need to use fixtures, // curtis removed this - file does not exist anymore

//  require('app/models/farm');  // sets up the routes  // curtis removed this cuz things were moved around

	$(function(){
    appState.attr({
      token:'LCz7ugSWYT8SuWzQWF4A'  // fresno2
      //		appState.attr('token', 'xq998Xz4mLmEYzZHqndu');

    });
    // curtis is doing this someplace else
    appState.attr({
      start_time:1399705200        // start_date=5_10_2014
    });
    appState.attr({
      end_time:1400223600        // end_date=5_10_2014
    });
    appState.attr({
      resolution:900
    });
    // setting farmID triggers a RESTful call that needs token+start_time+end_time, so must come last
		appState.attr({
			farmId: 1        // in the rest url we will see id=1
		});


// todo: can compute for  start_date<-->start_time   end_date<-->end_time


		//http://canjs.com/docs/can.route.map.html
    // if you dont have a can.route then every prop of appState is in the url
    // and any changes produce a new url
		can.route.map(appState);

		can.route('', {
			'screen': 'map'
		});

// routing is now being done elsewhere
//		// can.route('graph/:placementId', {
//		// 	'screen': 'graph'
//		// });
//=======
//		can.route('map/:farmId', {
//			'screen': 'map'
//		});
//
//		can.route('map/:farmId/:placementId', {
//			'screen': 'map'
//		});
//
//		can.route('placement/:farmId/:placementId', {
//			'screen': 'placement'
//		});
//
//		can.route('graph/:farmId/:placementId', {
//			'screen': 'graph'
//		});


		var indexView = can.stache(indexTemplate);

		var screens = [{

			template: can.stache('<app-map-screen       class="screen {{#if showMap}}active{{/if}}"       placement="{placement}" farm="{farm}"></app-map-screen>')
		},
		{
			template: can.stache('<app-placement-screen class="screen {{#if showPlacement}}active{{/if}}" placement="{placement}" farm="{farm}"></app-placement-screen>')
		},
		{
			template: can.stache('<app-graph-screen     class="screen {{#if showGraph}}active{{/if}}"     placement="{placement}" sense="{sense}"></app-graph-screen>')
		}
		];

		$('#app').append(can.stache(indexTemplate)(appState));

		can.route.ready();

		//Need to get configuration to Bootstrap the app
		var farm = getFarm({
            start_time: appState.attr('startTime'),
            end_time: appState.attr('endTime'),
            src: 'main'
        }).then(function(farm){
//        	debugger
            appState.attr('farm', farm);

            can.each(screens, function(screen){
				$('#content').append(screen.template(appState)); // so this is where appState becomes the scope
			});

    });

    $('#headerLogo').click(function(ev){ window.location.href=''; }); // we dont have a template for the header

	});

});