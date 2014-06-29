require.config({
    baseUrl: 'js/lib',
    paths : {
      'app'      : '../app',
      'ui'       :'../ui',
      'jquery'   : 'jquery/jquery',
      'can'      : 'canjs/amd/can',
      'googlemap': 'googlemap/googlemap',
      'moment'   : 'momentjs/moment',
      'maputil'  : 'googlemap/util',
      'markerwithlabel': 'googlemap/markerwithlabel',
      'async'    : 'requirejs-plugins/src/async',
      'text'     : 'requirejs-text/text',
      'css'      : 'require-css/css',
      'json'     : 'requirejs-plugins/src/json'
    },
    shim: {
      'markerwithlabel': ['googlemap']
    }
});

require(['app/main']);