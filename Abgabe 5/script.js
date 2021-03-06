"use strict";

//declaration of global variables
var pointcloud;
var point;

/**
* @function onLoad function that is executed when the page is loaded
*/
function onLoad() {
  //event listener
  document.getElementById("refreshBtn").addEventListener("click",
    () => {
      refresh()
    }
  );
  document.getElementById("getLocationBtn").addEventListener("click",
    () => {
      var x = document.getElementById("userPosition");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
  );

  //daten vorbereiten und main ausführen
  pois = JSON.parse(pois);
  main(point, pointcloud);
}

//##############################################################################
//## FUNCTIONS
//##############################################################################

/**
* @function main the main function
*/
function main(point, pointcloud) {
  //sortiere Daten nach distanz und mach damit eine Tabelle auf der HTML
  let results = sortByDistance(point, pois);
  drawTable(results);
}

/**
* @function refresh
* @desc is called when new coordinates are inserted. refreshes the data on the site
*/
function refresh() {
  let positionGeoJSON = document.getElementById("userPosition").value;

  //remove all table rows
  var tableHeaderRowCount = 1;
  var table = document.getElementById('resultTable');
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
  }

  try {
    positionGeoJSON = JSON.parse(positionGeoJSON);
    //check validity of the geoJSON. it can only be a point
    if (validGeoJSONPoint(positionGeoJSON)) {
      point = positionGeoJSON.features[0].geometry.coordinates;
      main(point, pointcloud);
    } else {
      alert("invalid input.please input a single valid point in a feature collection");
    }
  }
  catch (error) {
    console.log(error);
    alert("invalid input. see console for more info.");
  }
}

/**
* @function sortByDistance
* @desc takes a point and an array of points and sorts them by distance ascending
* @param point array of [lon, lat] coordinates
* @param pointArray array of points to compare to
* @returns Array with JSON Objects, which contain coordinate and distance
*/
function sortByDistance(point, pointArray) {
  let output = [];

  for (let i = 0; i < pointArray.features.length; i++) {
    let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
    let j = 0;
    //Searches for the Place
    while (j < output.length && distance > output[j].distance) {
      j++;
    }
    let newPoint = {
      coordinates: pointArray.features[i].geometry.coordinates,
      distance: distance,
      name: pointArray.features[i].properties.name
    };
    output.splice(j, 0, newPoint);
  }

  return output;
}

/**
* @function twoPointDistance
* @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
* @param start array of [lon, lat] coordinates
* @param end array of [lon, lat] coordinates
* @returns the distance between 2 points on the surface of a sphere with earth's radius
*/
function twoPointDistance(start, end) {
  //variable declarations
  var earthRadius; //the earth radius in meters
  var phi1;
  var phi2;
  var deltaLat;
  var deltaLong;

  var a;
  var c;
  var distance; //the distance in meters

  //function body
  earthRadius = 6371e3; //Radius
  phi1 = toRadians(start[1]); //latitude at starting point. in radians.
  phi2 = toRadians(end[1]); //latitude at end-point. in radians.
  deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = earthRadius * c;

  return distance;
}

/**
* @function validGeoJSONPoint
* @desc funtion that validates the input GeoJSON so it's only a point
* @param geoJSON the input JSON that is to be validated
* @returns boolean true if okay, false if not
*/
function validGeoJSONPoint(geoJSON) {
  if (geoJSON.features.length == 1
    && geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
  ) {
    return true;
  } else {
    return false;
  }
}

/**
* @function toRadians
* @desc helping function, takes degrees and converts them to radians
* @returns a radian value
*/
function toRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

/**
* @function toDegrees
* @desc helping function, takes radians and converts them to degrees
* @returns a degree value
*/
function toDegrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}

/**
 * @function drawTable
 * @desc inserts the calculated data into the table that's displayed on the page
 * @param {*} results array of JSON with contains
 */
function drawTable(results) {
  var table = document.getElementById("resultTable");
  //creates the Table with the direction an distances
  for (var j = 0; j < results.length; j++) {
    var newRow = table.insertRow(j + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    cel1.innerHTML = results[j].coordinates;
    cel2.innerHTML = results[j].name;
    cel3.innerHTML = results[j].distance;
  }
}

/**
* @function arrayToGeoJSON
* @desc function that converts a given array of points into a geoJSON feature collection.
* @param inputArray Array that is to be converted
* @returns JSON of a geoJSON feature collectio
*/
function arrayToGeoJSON(inputArray) {
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = { "type": "FeatureCollection", "features": [] };
  //skelly of a (point)feature
  let pointFeature = { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [] } };

  //turn all the points in the array into proper features and append
  for (const element of inputArray) {
    let newFeature = pointFeature;
    newFeature.geometry.coordinates = element;
    outJSON.features.push(JSON.parse(JSON.stringify(newFeature)));
  }

  return outJSON;
}

/**
 * @function showPosition
 * @desc Shows the position of the user in the textares
 * @param {*} position Json object of the user
 */
function showPosition(position) {
  var x = document.getElementById("userPosition");
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = { "type": "FeatureCollection", "features": [] };
  //skelly of a (point)feature
  let pointFeature = {"type": "Feature","properties": {},"geometry": {"type": "Point","coordinates": []}};
  pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //add the coordinates to the geoJson
  outJSON.features.push(pointFeature);
  x.innerHTML = JSON.stringify(outJSON);
}

// Code aus Abgabe 4

"use strict";
// Globale Variablen:
var x;
var res;
var myLocation;
var haltestellendistance;
var distanceArray = [];
var lowest;
var pointcloud;
var point;
var stopsFetch = [];

//##############################################################################
//## FUNCTIONS
//##############################################################################



/**
* @function sortByDistance 
* @desc takes a point and an array of points and sorts them by distance ascending
* @param point array of [lon, lat] coordinates
* @param pointArray array of points to compare to
* @returns Array with JSON Objects, which contain coordinate and distance
*/
function sortByDistance(point, pointArray) {
  let output = [];

  for (let i = 0; i < pointArray.features.length; i++) {
    let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
    let j = 0;
    //Searches for the Place
    while (j < output.length && distance > output[j].distance) {
      j++;
    }
    let newPoint = {
      coordinates: pointArray.features[i].geometry.coordinates,
      distance: distance,
      name: pointArray.features[i].properties.name
    };
    output.splice(j, 0, newPoint);
  }

  return output;
}

/**
* @function twoPointDistance
* @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
* @param start array of [lon, lat] coordinates
* @param end array of [lon, lat] coordinates
* @returns the distance between 2 points on the surface of a sphere with earth's radius
*/
function twoPointDistance(start, end) {
  //variable declarations
  var earthRadius; //the earth radius in meters
  var phi1;
  var phi2;
  var deltaLat;
  var deltaLong;

  var a;
  var c;
  var distance; //the distance in meters

  //function body
  earthRadius = 6371e3; //Radius
  phi1 = toRadians(start[1]); //latitude at starting point. in radians.
  phi2 = toRadians(end[1]); //latitude at end-point. in radians.
  deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = earthRadius * c;

  return distance;
}


/**
* @function toRadians
* @desc helping function, takes degrees and converts them to radians
* @returns a radian value
*/
function toRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

/**
* @function toDegrees
* @desc helping function, takes radians and converts them to degrees
* @returns a degree value
*/
function toDegrees(radians) {
  var pi = Math.PI;
  return radians * (180 / pi);
}



/**
 * @function showPosition
 * @desc Shows the position of the user in the textarea
 * @param {*} position Json object of the user
 */
function showPosition(position) {
  var x = document.getElementById("userPosition");
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = { "type": "FeatureCollection", "features": [] };
  //skelly of a (point)feature
  let pointFeature = {"type": "Feature","properties": {},"geometry": {"type": "Point","coordinates": []}};
  pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //add the coordinates to the geoJson
  outJSON.features.push(pointFeature);
  x.innerHTML = JSON.stringify(outJSON);
}

// Funktionen für Abgabe 3 und 4. 



function getLocation() {
  x = document.getElementById("location");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }

}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;

  myLocation = [lat,lng]
  // adding a green icon to disinguish the marker for the location from the bus stop markers
  var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
console.log(myLocation)
 new L.marker(myLocation, {icon: greenIcon}).addTo(map).bindPopup("Ich bin hier");
}


// Findet den Index mit dem kleinsten Wert aus dem Array mit allen Entfernungen der Haltestelle
function indexOfSmallest(a) {
  var lowest = 0;
  for (var i = 1; i < a.length; i++) {
   if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
 }




// Create a map of Muenster with draw toolbar
var map = L.map('map',{drawControl: false}, {editable: true}).setView([51.96, 7.63], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// FeatureGroup is to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    draw: {
        // disabling all shapes except for polygon to filter the markers that are in the polygon the user draws on my map
        circle: false,
        marker: false,
        rectangle: false,
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
    var coordspolygon = turf.polygon(layer.getLatLngs());
    var pt = turf.point(haltestellencoords);
    console.log(coordspolygon)
        // delete the markers that are not in the polygon the user has drawn on the map
    
    if (type === 'polygon') {
        console.log(turf.booleanPointInPolygon(pt,coordspolygon))
        
    }
    // Do whatever else you need to. (save to db; add to map etc)
    map.addLayer(layer);
 });



// getting the bus stop information via fetch API
let stopdivFetch = document.getElementById("MarkerButton")
function showStopsFetch()
{
fetch("https://rest.busradar.conterra.de/prod/haltestellen")
 .then(response => {
 let resFetch = response.json() // return a Promise as a result
 resFetch.then(data => { // get the data in the promise result
 console.log(data)
 
 for (var j = 0; j < data.features.length; j++) {
    var haltestellenname = data.features[j].properties.lbez;
    var haltestellencoords = data.features[j].geometry.coordinates;
    // creating an array with the coordinates and the name of the bus stops
    haltestellencoords.push(haltestellenname);
    stopsFetch.push(haltestellencoords);
    
 }
 console.log(haltestellencoords)
 console.log(stopsFetch)
 // create markers of the bus stops and add the name of the stop as a pop-up
    for (var i = 0; i < stopsFetch.length; i++) {
        new L.marker([stopsFetch[i][1], stopsFetch[i][0]]).addTo(map).bindPopup(stopsFetch[i][2])
      }

 })
 })

 .catch(error => console.log(error))
}