// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

function createFeatures(data) {
    console.log(data);

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
      );
    }

    // Draw marker radius
    function markerRadius(magnitude) {
        return magnitude * 20000; 
    }

    // Draw marker colours
    function markerColour(magnitude) {
        // Magnitude 1 
        if (magnitude < 1) {
            return "yellow"
        }
        // Magnitude 2 to 4
        else if (magnitude < 2) {
            return "orange"
        }
        // Magnitude 4 to 5
        else if (magnitude < 5) {
            return "red"
        }
        // Magnitude > 5
        else {
            return "brown"        
        }

    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(data, {
        pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: markerRadius(earthquakeData.properties.mag),
                color: markerColour(earthquakeData.properties.mag),
                fillOpacity: 0.6
            });
        },
        onEachFeature: onEachFeature
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
 }


function createMap(earthquakes) {

    // Define 3 map layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });
  
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite" : satellitemap,
        "Grayscale": darkmap,
        "Outdoors": outdoorsmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

  
    // Create our map, giving it the satellitemap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 3,
      layers: [satellitemap, earthquakes]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}