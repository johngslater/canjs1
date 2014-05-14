define(['can/component', 'text!./markerscreen.stache'], function(Component, template){

	var viewModel = {
        goBack: function() {
            appState.attr('editing', false);
        }
    };

    Component.extend({
        tag: 'marker-screen',
        template: can.stache(template),
        scope: viewModel,
        events: {
            'input change': function(el, ev){
                var marker = this.scope.attr('marker');
                marker.attr('name');
                marker.marker.set('name', el.val());
                marker.marker.set('labelContent', el.val());
            }
        }
    });
});