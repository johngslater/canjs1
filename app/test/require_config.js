var require = {
	paths : {
		'jquery' : 'bower_components/jquery/jquery',
		'can': 'bower_components/canjs/amd/can',
		'funcunit': 'bower_components/funcunit/dist/funcunit',
		'qunit': 'bower_components/qunit/qunit/qunit',
		'gmap': 'google/map',
		'maputils': 'google/utils',
		'markerwithlabel': 'google/markerwithlabel',
		'async': 'bower_components/requirejs-plugins/src/async',
		'text': 'bower_components/requirejs-text/text',
		'css': 'bower_components/require-css/css'
	},
	shim: {
		'markerwithlabel': ['gmap'],
		'qunit': {
			exports: 'QUnit'
		},
		'funcunit': {
			deps: ['jquery'/* Removing Qunit because it is in the page already, 'qunit'*/],
			exports: 'FuncUnit'
		}
	}
};