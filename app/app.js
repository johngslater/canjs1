require.config({
	baseUrl: '/',
	paths : {
		'jquery' : 'bower_components/jquery/jquery',
		'can': 'bower_components/canjs/amd/can',
		'gmap': 'google/map',
		'maputils': 'google/utils',
		'markerwithlabel': 'google/markerwithlabel',
		'async': 'bower_components/requirejs-plugins/src/async',
		'text': 'bower_components/requirejs-text/text',
		'css': 'bower_components/require-css/css'
	},
	shim: {
		'markerwithlabel': ['gmap']
	}
});

/*
  require(['can', 'can/view/stache', 'app/models/appstate'], function(can, stache, appState){
    can === stache //->
  })

  Always require plugins at the end of your dependency list
  require(['can', 'app/models/appstate', 'can/view/stache'], function(can, appState){
  })
*/

//CC: stache!, ejs! and mustache! plugins are being developed so we don't have to use text! then run can.stache
require(['can', 'text!app/index.stache', 'app/models/appstate', 'can/view/stache', 'app/mapscreen/mapscreen', 'app/markerscreen/markerscreen', 'css!app/app.css'], function(can, indexTemplate, AppState){

	$(function(){

		var appState = window.appState = new AppState({
			editing: false
		});
		var indexView = can.stache(indexTemplate);
		var screens = [{
			template: can.stache('<map-screen class="screen {{#if isActive}}active{{/if}}" selected="{appState.activeMarker}"></map-screen>'),
			isActive: function(){
				return appState.attr('editing') === false;
			}
		},
		{
			template: can.stache('<marker-screen class="screen {{#if isActive}}active{{/if}}" marker="{appState.activeMarker}"></marker-screen>'),
			isActive: function(){
				return appState.attr('editing') === true;
			}
		}];

		$('#app').append(can.stache(indexTemplate)(appState));

		can.each(screens, function(screen){
			$('#content').append(screen.template({
				appState: appState,
				isActive: screen.isActive
			}));
		});

	});

});