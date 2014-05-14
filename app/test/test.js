//TODO: Make this works
require.config({
	baseUrl: '/'
});

// var testModules = [
// 	,
// 	'app/mapscreen/marker-map/marker-map_test.js'
// ];

require(['app/mapscreen/mapscreen_test.js'], function(){
	 QUnit.load();
     QUnit.start();
});