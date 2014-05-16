require.config({
    baseUrl: '/js/lib',
    paths : {
        'app': '../app',
        'test': '../app/test',
		'jquery' : 'jquery/jquery',
		'can': 'canjs/amd/can',
		'funcunit': 'funcunit/dist/funcunit',
		'googlemap': 'googlemap/googlemap',
		'maputil': 'googlemap/util',
		'markerwithlabel': 'googlemap/markerwithlabel',
		'async': 'requirejs-plugins/src/async',
		'text': 'requirejs-text/text',
		'css': 'require-css/css'
	},
	shim: {
		'markerwithlabel': ['googlemap'],
		'funcunit': {
			deps: ['jquery'],
			exports: 'FuncUnit'
		}
	}
});