  console.log(cities)
  console.log(point)
  
  // haversine formula to calculate the the shortest distance over the earth's surface
  /**
   * 
   * @param {number} lon1 
   * @param {number} lat1 
   * @param {number} lon2 
   * @param {number} lat2 
   * @returns {number}
   */
  function getDistance(lon1,lat1,lon2,lat2){

    //let lon1 = param1[0];
    //let lat1 = param2[1];
    //let lon2 = param1[0];
    //let lat2 = param2[1];

    const R = 6371; // kilometres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c; // in kilometres
    return d;
    }

    // empty array that should be filled with the sorted distances
    var sorted = [];
    // calculating the distances of the 11 cities to the point
    cities.forEach(element => {
        var result=(getDistance(element[0], element[1], point[0], point[1]))
        // fill empty array
        sorted.push(result)
        //console.log(result)
        //console.log(sorted)
        // sort filled array
        sorted.sort((a, b) => a - b);
        console.log(sorted);
    })
   
   var MyList = document.getElementById("ul");
    MyList.innerHTML += "<li>"+sorted[0]+" Koeln"+"</li>"
    MyList.innerHTML += "<li>"+sorted[1]+" Amsterdam"+"</li>"
    MyList.innerHTML += "<li>"+sorted[2]+" Kassel"+"</li>"
    MyList.innerHTML += "<li>"+sorted[3]+" Barcelona"+"</li>"
    MyList.innerHTML += "<li>"+sorted[4]+" Dublin"+"</li>"
    MyList.innerHTML += "<li>"+sorted[5]+" Oslo"+"</li>"
    MyList.innerHTML += "<li>"+sorted[6]+" Bukarest"+"</li>"
    MyList.innerHTML += "<li>"+sorted[7]+" Graz"+"</li>"
    MyList.innerHTML += "<li>"+sorted[8]+" Tunis"+"</li>"
    MyList.innerHTML += "<li>"+sorted[9]+" Kairo"+"</li>"
    MyList.innerHTML += "<li>"+sorted[10]+" Kyoto"+"</li>"

    var x = document.getElementById("demo");

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    
    function showPosition(position) {
      x.innerHTML = "Latitude: " + position.coords.latitude +
      "<br>Longitude: " + position.coords.longitude;
    }
    var pois = [];
    pointsOfInterest.features.forEach(feature => {
      pois.push(feature.geometry.coordinates)
      console.log(pois)

    })
    
    function poiCoordinates() {
      var point = JSON.parse(document.getElementById("Geojson").value)
      console.log(point.geometry.coordinates)
      
    }
    var myLocation = [7.5955423, 51.969262]
    var distance = getDistance(element[0], element[1], myLocation[0], myLocation[1])
    console.log(distance)
   
     console.log(pois)


     /* TO DO:
     An dieser Stelle hätte ich es gerne geschafft, die von dem Button ausgegeben "My Location"
     mit den extrahierten Koordinaten, die ich in dem pois Array gespeichert habe, mithilfe 
     der getDistance Funktion zu berechnen und auch auf der Website anzuzeigen */