// function createMap(){
//     // Create the tile layer that will be the background of our map
//     var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "light-v10",
//     accessToken: API_KEY
//     });

//     var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "satellite-streets-v9",
//     accessToken: API_KEY
//     });

//     var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "outdoors-v9",
//     accessToken: API_KEY
//     });

//     // Create a baseMaps object to hold the lightmap layer
//     var baseMaps = {
//        "Satellite":satelliteMap,
//        "Light Map": lightmap,
//        "Outdoors":outdoorMap
//     };
    
//     // Create an overlayMaps object to hold the bikeStations layer
//     var overlayMaps = {
//        "Fault Lines": faultLines,
//        //"Earthquakes": earthquakeMarkers
//     };

//     // Create the map object with options
//     var map = L.map("map", {
//     center: [39.1461903,-122.3971198],
//     zoom: 4,
//     layers: [satelliteMap,faultLines]
//     });

//     // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(map);

//     //add legend
//     var legend = L.control({position: 'bottomright'});

//     legend.onAdd = function (map) {

//         var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 1, 2, 3, 4, 5],
//         //labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
//         colors=["lime","greenyellow","lightpink","lightsalmon","orangered","maroon"]

//         // loop through our density intervals and generate a label with a colored square for each interval
//         for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + colors[i] + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }

//         return div;
//     };

//     legend.addTo(map);
// }

// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
var earthquakesLayer = new L.LayerGroup();
var tectonicplatesLayer = new L.LayerGroup();

  
// Adding tile layer
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

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
    "Satellite":satelliteMap,
    "Light Map": lightmap,
    "Outdoors":outdoorMap
};

var myMap = L.map("map", {
    center: [39.1461903,-122.3971198],
    zoom: 4,
    layers: [satelliteMap,earthquakesLayer,tectonicplatesLayer]
});
  

// Perform an API call to the API to get station information. Call createMarkers when complete
const earthquakesURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const tectonicplatesURL="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

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
        color="lightsalmon"
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


// Grabbing our GeoJSON data..
d3.json(earthquakesURL, function(data) {

    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
       pointToLayer:function (feature,latlng) {

         var geojsonMarkerOptions = {
            radius: (feature.properties.mag)*10000,
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
         };

        return L.circle(latlng,geojsonMarkerOptions).bindPopup("<h3>Place: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3>");
        }
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
    }).addTo(tectonicplatesLayer);
});

//Create an overlayMaps object to hold the bikeStations layer
var overlayMaps = {
    "Fault Lines": tectonicplatesLayer,
    "Earthquakes": earthquakesLayer
};

//add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    //labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    colors=["lime","greenyellow","lightpink","lightsalmon","orangered","maroon"]

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

