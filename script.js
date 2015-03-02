
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5vb3AiLCJhIjoiV0tqb1kyWSJ9.uBBu486az8nPqccvivIZsA';
var map = L.mapbox.map('map', 'anoop.kp5d791l', {zoomControl: false}).setView([0,0], 14);

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

var tempData = {"executionTime":0,"status":true,"citiBikeDto":{"endLocation":"40.687979,-73.978474","bikerId":17944,"travelTime":421,"id":2316,"typeId":1,"time":1372646723000,"startLocation":"40.75510267,-73.97498696"},"intermediatePoints":["40.75515,-73.97495","40.75535,-73.97542","40.75471,-73.9759","40.75432,-73.97619","40.75429,-73.97623","40.75429,-73.97632","40.75438,-73.97658","40.75434,-73.97676","40.75431,-73.9768","40.75333,-73.97752","40.75261,-73.97804","40.75255,-73.97803","40.75249,-73.97798","40.75241,-73.97783","40.7523,-73.9776","40.75225,-73.97759","40.75086,-73.97865","40.75065,-73.97888","40.75026,-73.97915","40.74841,-73.9805","40.74654,-73.98187","40.74582,-73.98235","40.74458,-73.98324","40.74373,-73.98386","40.74272,-73.98459","40.74148,-73.98549","40.73923,-73.98713","40.73775,-73.98822","40.73652,-73.98911","40.73528,-73.99003","40.73511,-73.99022","40.73504,-73.99033","40.73479,-73.99078","40.73245,-73.99128","40.73172,-73.99147","40.73058,-73.99242","40.72956,-73.99327","40.72839,-73.99426","40.72718,-73.99527","40.72704,-73.99542","40.72653,-73.99587","40.72593,-73.99636","40.72538,-73.99681","40.72432,-73.9977","40.72304,-73.99881","40.72043,-74.00101","40.71991,-74.00146","40.71937,-74.00191","40.71893,-74.00131","40.71799,-73.99999","40.71727,-73.99899","40.71711,-73.99872","40.71626,-73.99629","40.71622,-73.99625","40.71619,-73.99617","40.71614,-73.99607","40.7161,-73.99607","40.716,-73.99605","40.71591,-73.99602","40.7157,-73.99586","40.71562,-73.99583","40.71509,-73.99529","40.71493,-73.99511","40.71477,-73.99499","40.71429,-73.99472","40.71419,-73.99466","40.71371,-73.99439","40.71302,-73.994","40.71233,-73.99362","40.71147,-73.99314","40.71072,-73.99272","40.70975,-73.99221","40.70954,-73.99209","40.70695,-73.99063","40.7063,-73.99028","40.7047,-73.98931","40.70455,-73.98923","40.70345,-73.98862","40.70121,-73.98737","40.69996,-73.98667","40.69943,-73.98638","40.69764,-73.98542","40.69759,-73.98536","40.69722,-73.98519","40.69702,-73.9851","40.69611,-73.98466","40.69582,-73.9845","40.69422,-73.98369","40.69365,-73.98338","40.69279,-73.983","40.68951,-73.98135","40.68895,-73.98108","40.68891,-73.98089","40.68875,-73.98052","40.68817,-73.97907","40.68794,-73.9785"],"pointDataSetMap":{"40.7523,-73.9776":[],"40.74582,-73.98235":[],"40.71477,-73.99499":[],"40.73652,-73.98911":[],"40.75434,-73.97676":[],"40.70345,-73.98862":[],"40.71799,-73.99999":[],"40.68895,-73.98108":[],"40.71072,-73.99272":[],"40.72538,-73.99681":[],"40.69702,-73.9851":[],"40.75515,-73.97495":[],"40.7161,-73.99607":[],"40.73058,-73.99242":[]}}
var viewData = {
    biker_info: tempData.citiBikeDto,
    data_set : tempData.pointDataSetMap
}

geojson.coordinates = formatPoint(tempData.intermediatePoints);

// Add this generated geojson object to the map.
L.geoJson(geojson).addTo(map);

// Create a counter with a value of 0.
var j = 0;

// Create a marker and add it to the map.
var marker = L.circleMarker([0, 0], {color: '#BCF5A9', fillOpacity: 0.5}).setRadius(250).addTo(map);

tick();

function formatPoint(data) {
    var points = $.map(data, function(inst) {
        var split = inst.split(',');
        return [[parseFloat(split[1]), parseFloat(split[0])]];
    });
    return points;
}

function tick() {
    if(j == 0) {
        $.get('http://localhost/mapbox/data.json', function(data) {
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
                setRadius(6).
                addTo(map).
                bindPopup("311 call at " + moment(value.time).format('MMMM Do YYYY, h:mm:ss a'));
                //.openPopup();
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
            tempData = {};
            j = 1; // Need to change this
            if (++j < geojson.coordinates.length) tick();
        }
    }
}