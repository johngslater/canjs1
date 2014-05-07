define(['can'], function(can){
    var myControl = can.Control.extend({
        init: function() {
            console.log('here', this)
            this.element.append('<h1>Hello World</h1>');
        }
    });
    return myControl
})