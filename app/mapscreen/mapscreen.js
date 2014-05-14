define(['can/component', 'app/mapscreen/marker-map/marker-map', 'text!app/mapscreen/mapscreen.stache', 'can/view/stache'], function(Component, MapViewModel, template){

    var viewModel = function(attrs, parentScope, element){
        return {
            marker: can.compute(function(){
                return appState.attr('activeMarker');
            })
        };
    };

    Component.extend({
        tag: 'map-screen',
        template: can.stache(template),
        scope: viewModel
    });

    return viewModel;

});