define(['can/component', './marker-map/marker-map', 'text!./mapscreen.stache'], function(Component, MapViewModel, template){

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