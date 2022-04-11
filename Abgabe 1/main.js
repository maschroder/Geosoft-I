  console.log(cities)
  console.log(point)
  
  // haversine formula to calculate the the shortest distance over the earth's surface
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
    MyList.innerHTML += "<li>"+sorted[4]+" Tunis"+"</li>"
    MyList.innerHTML += "<li>"+sorted[5]+" Kyoto"+"</li>"
    MyList.innerHTML += "<li>"+sorted[6]+" Bukarest"+"</li>"
    MyList.innerHTML += "<li>"+sorted[7]+" Graz"+"</li>"
    MyList.innerHTML += "<li>"+sorted[8]+" Kairo"+"</li>"
    MyList.innerHTML += "<li>"+sorted[9]+" Dublin"+"</li>"
    MyList.innerHTML += "<li>"+sorted[10]+" Oslo"+"</li>"
    
