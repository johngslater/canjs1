require.config({
    paths : {
        "jquery" : "bower_components/jquery/dist/jquery",
        "can": "bower_components/canjs/amd/can",
        //create alias to plugins (not needed if plugins are on the baseUrl)
        'async': 'bower_components/requirejs-plugins/src/async'
    }
});

define(['async!http://maps.googleapis.com/maps/api/js?sensor=false&libraries=geometry&v=3.3'], function(){
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
});