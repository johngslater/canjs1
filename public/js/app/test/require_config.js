//TODO: How can we leverage the existing config and just add test specific config here
require.config({
    baseUrl: '/js/lib',
    paths : {
    'app': '../app',
		'ui':'../ui',
    'test': '../app/test',
		'jquery' : 'jquery/jquery',
		'can': 'canjs/amd/can',
		'funcunit': 'funcunit/dist/funcunit',
		'googlemap': 'googlemap/googlemap',
		'maputil': 'googlemap/util',
		'markerwithlabel': 'googlemap/markerwithlabel',
		'async': 'requirejs-plugins/src/async',
		'text': 'requirejs-text/text',
		'css': 'require-css/css',
		'json': 'requirejs-plugins/src/json'
	},
	shim: {
		'markerwithlabel': ['googlemap'],
		'funcunit': {
			deps: ['jquery'],
			exports: 'FuncUnit'
		}
	},
	fixtures: true
});