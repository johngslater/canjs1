define(['can/map/define'], function(){

	var AppState = can.Map.extend({
		//TODO: Make this work
		// screen: can.compute(function(){
		// 	return this.attr('editing') ? 'marker' : 'map';
		// }),
		// define: {
		// 	activeMarker: {
		// 		value: null
		// 	},
		// 	editing: {
		// 		value: false
		// 	}
		// }
	});

	return AppState;
});