console.log("step 1 is working");
// Store our API endpoint inside queryUrl

 // Define streetmap and darkmap layers
 var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  
// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
    center: [ 37.09, -95.71 ],
    zoom: 5
    });

greymap.addTo(myMap);


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    console.log(data);
  // Once we get a response, send the data.features object to the createFeatures function

    function getColor(depth){
      if (depth >= 90) {
        return "#a22408"; 
      } 
      if (depth >= 70) {
        return "#d15121"; 
      } 
      if (depth >= 50) {
        return "#d17421"; 
      } 
      if (depth >= 30) {
        return "#f0B838"; 
      } 
      else if (depth >= 10) {
        return "#f0df38";
      } 
      else {
        return "#c9f038";
      }
    };

    function getRadius(mag){
      if (mag > 0) {
        return mag*4; 
      } 
      else {
        return 1;
      }
    }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
      pointToLayer:function(feature, latlng){
          return L.circleMarker(latlng, {
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            color: "#000000",
            opacity: 1,
            fillOpacity: 1,
            weight: 0.5,
            stroke: true
          })
      },
      
      onEachFeature: function(feature, layer){
        layer.bindPopup(
            "magnitude: " + feature.properties.mag + "<br>location: " + feature.properties.place
        );

    }
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (){
      var div = L.DomUtil.create('div', 'info legend');
      var grades = [-10, 10, 30, 50, 70, 90];
      var colors = ["#c9f038", "#f0df38", "#f0B838", "#d17421", "#d15121", "#a22408"];

    // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
}

return div;
};

legend.addTo(myMap);

});
