define(['can/component'], function(Component){
    return Component.extend({
        tag: 'marker-screen',
        template: '{{#marker}}<strong>Name:</strong> <input type="text" value="{{marker.name}}"><br>' +
            '<strong>Moves:</strong> {{marker.moves}}<br>' +
            '<strong>Lat:</strong> {{marker.lat}}<br>' +
            '<strong>Lng:</strong> {{marker.lng}}<br>{{/marker}}<br>' +
            '<button class="back" can-click="goBack">Back</button>',
        scope: function(attrs, parentScope, element){
            return {
                marker: can.compute(function(){
                    return clientState.attr('editing');
                }),
                goBack: function() {
                    clientState.removeAttr('editing');
                }
            }
        },
        events: {
            'input change': function(el, ev){
                var marker = this.scope.attr('marker');
                marker.attr('name')
                marker.marker.set('name', el.val());
                marker.marker.set('labelContent', el.val());
            }
        }
    });
});