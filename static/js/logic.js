// Initialize & Create Two Separate LayerGroups: earthquakesLayer & tectonicplatesLayer
var earthquakesLayer = new L.LayerGroup();
var tectonicplatesLayer = new L.LayerGroup();

  
// Adding tile layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "light-v10",
accessToken: API_KEY
});

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "satellite-streets-v9",
accessToken: API_KEY
});

var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "outdoors-v9",
accessToken: API_KEY
});

// Create a baseMaps object to hold all the tile(map) layers
var baseMaps = {
    "Satellite":satelliteMap,
    "Light Map": lightmap,
    "Outdoors":outdoorMap
};

//Create the base map to load everyting
var myMap = L.map("map", {
    center: [39.1461903,-122.3971198],
    zoom: 4,
    //initial the page with the following
    layers: [lightmap,earthquakesLayer,tectonicplatesLayer]
});
  

//URL to geoJSON files
const earthquakesURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const tectonicplatesURL="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//create the function to select colors based on magnitude values
function chooseColor(magnitude){
    if (magnitude<=0){
        color="white"
    }
    else if (magnitude>0 && magnitude<=0.999){
        color="lime";
    }
    else if (magnitude>=1 && magnitude<1.999){
        color="greenyellow"
    }
    else if (magnitude>=2 && magnitude<2.999){
        color="lightpink"
    }
    else if (magnitude>=3 && magnitude<3.999){
        color="salmon"
    }
    else if (magnitude>=4 && magnitude<4.999){
        color="orangered"
    }
    else if (magnitude>5){
        color="maroon"
    }
    else{
        color="red"
    }
    return color;
};


// Grabbing our GeoJSON data to the earthquake info for the past 7 days..
d3.json(earthquakesURL, function(data) {

    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
       pointToLayer:function (feature,latlng) {

        //create the markers radius and color based on magnitude valeus
         var geojsonMarkerOptions = {
            radius: (feature.properties.mag)*10000,
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
         };
        //write back to make circles
        return L.circle(latlng,geojsonMarkerOptions).bindPopup("<h3>Place: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
        }
    //add to the earthquake layer group we predefined
    }).addTo(earthquakesLayer);
});


// Grabbing our GeoJSON data..
d3.json(tectonicplatesURL, function(data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        style: function() {
          return {
            color: "orange",
            weight: 1.5
          };
        }
    //add to the tectonic plate layer group we predefined
    }).addTo(tectonicplatesLayer);
});

//Create an overlayMaps object to hold the marker and line layers
var overlayMaps = {
    "Fault Lines": tectonicplatesLayer,
    "Earthquakes": earthquakesLayer
};

//add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    //labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    colors=["lime","greenyellow","lightpink","salmon","orangered","maroon"]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

