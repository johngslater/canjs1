require(['../../config.js'], function(){
	require.config({
		shim: {
			'funcunit': {
				deps: ['jquery'],
				exports: 'FuncUnit'
			}
		}
	});
});