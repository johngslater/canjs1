//##How to have virtual properties that depend on user-defined preferences

// In util
var convertTemp = function(value, type){
	if(type === 'c') {
		return value;
	} else {
		return value * 9/5 + 32;
	}
}

//In models
can.Map.extend({
	temp: 45.6
	define: {
		displayTemp: {
			get: function() {
				return convertTemp(this.attr('temp'), appState.attr('tempUnit'));
			}
		}
	}
})