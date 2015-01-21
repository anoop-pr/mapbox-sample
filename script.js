
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5vb3AiLCJhIjoiV0tqb1kyWSJ9.uBBu486az8nPqccvivIZsA';
var map = L.mapbox.map('map', 'anoop.kp5d791l', {zoomControl: false}).setView([0,0], 16);

		// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

// Disable tap handler, if present.
if (map.tap) map.tap.disable();


// Generate a GeoJSON line. You could also load GeoJSON via AJAX
// or generate it some other way.
var geojson = { type: 'LineString', coordinates: [] };

geojson.coordinates = [[76.527842,9.592318],[76.523035,9.594585], [76.521962, 9.592724], [76.519902, 9.595093], [76.514624, 9.594712]];

// Add this generated geojson object to the map.
L.geoJson(geojson).addTo(map);

// Create a counter with a value of 0.
var j = 0;

// Create a marker and add it to the map.
var marker = L.circleMarker([0, 0], {color: '#FFE642', fillOpacity: 0.5}).setRadius(50).addTo(map);

tick();

function tick() {
    // Set the marker to be at the same point as one
    // of the segments or the line.
    marker.setLatLng(L.latLng(
        geojson.coordinates[j][1],
        geojson.coordinates[j][0]));

    $('.latlng').html("[" + geojson.coordinates[j][1].toFixed(5) + ", " + geojson.coordinates[j][0].toFixed(5) + "]");


    map.setView([geojson.coordinates[j][1], geojson.coordinates[j][0]]);

    var marker2 = L.marker([geojson.coordinates[j][1], geojson.coordinates[j][0]], {
		  icon: L.mapbox.marker.icon({
		    'marker-color': '#15B0ED',
		    'marker-size': 'large',
			'marker-symbol': 'bus'
		  })
		}).bindPopup("23 People");

    if(geojson.coordinates[j][0] == 76.8540001) {
    	marker2.addTo(map);
		marker2.openPopup();
    } else {
    	map.removeLayer(marker2);
    }

    // Move to the next point of the line
    // until `j` reaches the length of the array.
    if (++j < geojson.coordinates.length) setTimeout(tick, 500);
}