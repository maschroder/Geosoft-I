
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

// Funktionen für Abgabe 3. Die Funktionen hierüber in der script.js stammen aus der Musterlösung der 2. Abgabe



// Erstellt Tabelle mit Koordinaten, Haltestellenname und Entfernung der Busstops
function drawTable(res) {
  var table = document.getElementById("resultTable");
    
  for (var j = 0; j < res.features.length; j++) {
    var haltestellendistance = twoPointDistance(myLocation, res.features[j].geometry.coordinates);
    distanceArray.push(haltestellendistance);
    var newRow = table.insertRow(j + 1);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    cel1.innerHTML = res.features[j].geometry.coordinates;
    cel2.innerHTML = res.features[j].properties.lbez;
    cel3.innerHTML = haltestellendistance;
  }
  
  lowest = indexOfSmallest(distanceArray) 
  // console.log(lowest) 
  let nearestStop = res.features[lowest].properties.nr; // Haltestellennummer mit der geringsten Entfernung zum Standort
  console.log(nearestStop)

  showDepartures(nearestStop)
}


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
console.log(myLocation)
}





// Fragt Haltestellen-Informationen der API an und gibt diese mit Button aus
let stopdiv = document.getElementById("BushaltestellenButton")
function showStops() {
   let xhttp = new XMLHttpRequest()
   xhttp.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen", true)
   xhttp.send()
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200){
       let res = JSON.parse(this.responseText)
       console.log(res)
       drawTable(res)
       }
    
       
}}

// Findet den Index mit dem kleinsten Wert aus dem Array mit allen Entfernungen der Haltestelle
function indexOfSmallest(a) {
  var lowest = 0;
  for (var i = 1; i < a.length; i++) {
   if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
 }

// Fragt Abfahrt-Informationen der API an und gibt diese mit Button aus
let abfahrtdiv = document.getElementById("AbfahrtenButton")
 function showDepartures(nearestStop) {
  let xhttp = new XMLHttpRequest()
  // Abfahrten und Abfahrtszeiten bei 4710101 (aka nearestStop) mit dem Button anzeigen lassen
  xhttp.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen/"+ nearestStop +"/abfahrten?sekunden=1200", true)
  xhttp.send()
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    let res2 = JSON.parse(this.responseText)
    console.log(res2)
    var abfahrt = new Date(res2[0].tatsaechliche_abfahrtszeit * 1000);
    document.getElementById("BushaltestellenButton").innerHTML = "Linie: " + res2[0].linientext + ",        " + abfahrt
    
 }}}
   

    
    
