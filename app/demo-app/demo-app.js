define(['can/component'], function(Component){
    return Component.extend({
        tag: 'demo-app',
        template: '<map-screen class="{{^showMap}}hidden{{/showMap}}"></map-screen><marker-screen class="{{^showEdit}}hidden{{/showEdit}}"></marker-screen>',
        scope: function(attrs, parentScope, element){
            return {
                showMap: can.compute(function(){
                    return !(!!clientState.attr('editing'));
                }),
                showEdit: can.compute(function(){
                    return !!clientState.attr('editing');
                })
            };
        }
    });
});