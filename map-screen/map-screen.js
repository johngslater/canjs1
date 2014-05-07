define(['can/component'], function(Component){
    return Component.extend({
        tag: 'map-screen',
        template: '<map></map>' +
            '{{#marker}}<strong>Name:</strong> {{marker.name}}<br>' +
            '<strong>Moves:</strong> {{marker.moves}}<br>' +
            '<strong>Lat:</strong> {{marker.lat}}<br>' +
            '<strong>Lng:</strong> {{marker.lng}}{{/marker}}',
        scope: function(attrs, parentScope, element){
            return {
                marker: can.compute(function(){
                    return clientState.attr('selected');
                })
            }
        }
    });
});