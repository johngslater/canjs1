define(['can', './googlemap'], function(can, Map) {
	return {
		latLng: function(lat, lng) {
			//support taking an Array
			if (can.isArray(lat)) {
				lng = lat[1];
				lat = lat[0];
			}
			return new Map.LatLng(lat, lng);
		}
	};
})