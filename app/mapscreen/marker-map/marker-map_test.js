require.config({
	baseUrl: '/'
});

require(['jquery', 'funcunit', './marker-map.js'], function($, F, ViewModel){

	test('ok', function(){
		ok(true);
	});

	 QUnit.load();
     QUnit.start();
});