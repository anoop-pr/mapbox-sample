
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5vb3AiLCJhIjoiV0tqb1kyWSJ9.uBBu486az8nPqccvivIZsA';
var map = L.mapbox.map('map', 'anoop.kp5d791l', {zoomControl: false}).setView([40.7127, -74.0059], 14);

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

var tempData = {}

var viewData = {
    biker_info: {},
    data_set : {}
}


var j = 0;


var marker = L.circleMarker([0, 0], {color: '#b70edb', fillOpacity: 0.5}).setRadius(150).addTo(map);


$(document).on('click', '.load_data', function(e) {
    $(this).html('Loading..!');
    // http://localhost/mapbox/data/start.json
    $.get('/getData.do?method=getData', function(initData) {
        $('#home').hide();
        $('.box').show();
        geojson.coordinates = formatPoint(initData.intermediatePoints);
        viewData = {
            biker_info: initData.citiBikeDto,
            data_set : initData.pointDataSetMap
        };
        L.geoJson(geojson).addTo(map);
        tick();
    });

});

function formatPoint(data) {
    var points = $.map(data, function(inst) {
        var split = inst.split(',');
        return [[parseFloat(split[1]), parseFloat(split[0])]];
    });
    return points;
}

function tick() {
    if(j == 0) {
        // http://localhost/mapbox/data/data.json
        $.get('/getData.do?unique_id='+ viewData.biker_info.id +'&bike_id='+ viewData.biker_info.bikerId +'&method=getContinousDetails', function(data) {
            tempData = data;
        });    
    }

    // Set the marker to be at the same point as one
    // of the segments or the line.
    marker.setLatLng(L.latLng(
        geojson.coordinates[j][1],
        geojson.coordinates[j][0]));

    var html = [
        '<p>',
            '<h4>',
                'Biker ID: ' + viewData.biker_info.bikerId,
            '</h4>',
        '</p>',
        '<p>',
            '<h4>',
                'Start Time: ' + moment(viewData.biker_info.time).format('MMMM Do YYYY, h:mm:ss a'),
            '</h4>',
        '</p>',
        '<p>',
            '<h4>',
                'End Time:' + moment(viewData.biker_info.time).add(viewData.biker_info.travelTime, 'seconds').format('MMMM Do YYYY, h:mm:ss a'),
            '</h4>',
        '</p>'
    ].join('');

    $('.latlng').html(html);

    map.setView([geojson.coordinates[j][1], geojson.coordinates[j][0]]);

    // console.log(viewData.data_set, geojson.coordinates[j][0]+','+geojson.coordinates[j][1]);
    if(viewData.data_set.hasOwnProperty(geojson.coordinates[j][1]+','+geojson.coordinates[j][0])) {
        var v_data = viewData.data_set[geojson.coordinates[j][1]+','+geojson.coordinates[j][0]];
        if(v_data.length > 0) {
            $.each(v_data, function(key, value) {
                var int_point = value.startLocation.split(',');
                L.circleMarker([parseFloat(int_point[0]), parseFloat(int_point[1])], 
                {color: '#FF4000', fillOpacity: 1}).
                setRadius(4).
                addTo(map).
                bindPopup("311 call at " + moment(value.time).format('MMMM Do YYYY, h:mm:ss a'));
            });
        }
    }
    // Move to the next point of the line
    // until `j` reaches the length of the array.
    if (++j < geojson.coordinates.length) {
        setTimeout(tick, 100);  
    } else {      
        if(!_.isEmpty(tempData)) {
            
            geojson.coordinates = formatPoint(tempData.intermediatePoints);
            L.geoJson(geojson).addTo(map);
            viewData = {
                biker_info: tempData.citiBikeDto,
                data_set : tempData.pointDataSetMap
            }
            $.gritter.add({
                title: 'New Biker!',
                text: 'New Biker ID: ' + viewData.biker_info.bikerId
            });
            tempData = {};
            j = 1; // Need to change this
            if (++j < geojson.coordinates.length) tick();
        }
    }
}