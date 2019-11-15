myCookies = {};

class Thermostat {
  constructor(){
    this._defaultTemp = 20;
    this._minimumTemp = 10;
    this.powerSaving = true;
    this.status = this._defaultTemp;
    this.maxTemp = 25;
    this.usage = this.checkUsage();
    }

  up(increase = 1){

    if (this.status + increase > this.maxTemp){
      throw new Error('Cannot go above max temperature')
    }
    this.status += increase;
    this.usage = this.checkUsage();
    console.log('Temp increase')
  }

  down(decrease = 1){
    if (this.status - decrease < this._minimumTemp){
      throw new Error('Cannot go below minimum temperature');
    }
    this.status -= decrease;
    this.usage = this.checkUsage();
  }

  powerSavingToggle() {

    if (this.powerSaving == true){
      this.powerSaving = false;
      this.maxTemp = 32;
    } else if (this.powerSaving == false) {
      this.powerSaving = true;
      this.maxTemp = 25;

      if (this.status > this.maxTemp){
        this.status = this.maxTemp;
      }
    }
  }

  reset(){
    this.status = this._defaultTemp;
    this.usage = this.checkUsage();
  }

  checkUsage(){
    if(this.status < 18){
      console.log('low usage')
      return 'low-usage';
    } else if (this.status >= 18 && this.status <= 25){
      console.log('medium usage')
      return 'medium-usage';
    } else {
      console.log('high usage')
      return 'high-usage';
    }
  }
}


function update(thermostat){

  console.log('updated started')

  runWithCurrentLocation(thermostat)

}

function getLondonTemp(APIKEY,thermostat){
  var temp;
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${APIKEY}&units=metric`)
    .then(
      function(response){
        response.json().then(function(data){
          londonTemp = data.main.temp;

          var lat = myCookies['_lat']
          var lon = myCookies['_lon']
          currentLocationTemp(lat,lon,APIKEY,thermostat,londonTemp)
        })
      }
    )
  return temp;
}

function currentLocationTemp(lat, lon, APIKEY, thermostat,londonTemp){
  var locationTemp;
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`)
  .then(
    function(response){
      response.json().then(function(data){
        locationTemp = data.main.temp
        setHtml(londonTemp,locationTemp,thermostat)
      })
    }
  )
}


function runWithCurrentLocation(thermostat){
  var APIKEY = 'cd220fdebb10fcb90f5a32800d230382'
  getLondonTemp(APIKEY,thermostat);
}

function setHtml(londonTemp,currentLocationTemp,thermostat){
  $("#temp").html(thermostat.status);
  
  $("#london").html(`London - ${londonTemp}&#176;C`)
  $("#current").html(`Current location - ${currentLocationTemp}&#176;C`)

  if (thermostat.powerSaving == true){
    $("#title").html("Thermostat <i class='fas fa-battery-quarter' ></i>")

  } else if (thermostat.powerSaving == false) {
    $("#title").html("Thermostat")
  }

  if (thermostat.usage == "low-usage") {
    $(".indicator").css("background-color", "Green");
  } else if (thermostat.usage == "medium-usage") {
    $(".indicator").css("background-color", "#fccf03");
  } else {
    $(".indicator").css("background-color", "Red");
  }
}


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function loadCookies(){
  myCookies = {};
  var kv = document.cookie.split(";");

  for (var id in kv){
    var cookie = kv[id].split("=");
    myCookies[cookie[0].trim()] = cookie[1];
  }
  console.log('cookies loaded')
}


function saveCookies(){
  document.cookie = "";

  var expiresAttribute = new Date(Date.now()+ 60 * 1000).toString();
  var cookieString = "";

  for(var key in myCookies){
    cookieString = key + "=" + myCookies[key] + ";" + expiresAttribute + ";";
    document.cookie = cookieString;
  }
}

function checkIfLocationSaved(thermostat){
  loadCookies();

  var lat = myCookies['_lat']
  var lon = myCookies['_lon']

  console.log(lat)
  console.log(lon)

  if(lat == null || lon == null ){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=> {
        console.log('entered geolocator')
        myCookies["_lat"] = position.coords.latitude;
        myCookies["_lon"] = position.coords.longitude;
     
        saveCookies()
        update(thermostat)
      });
  
    } else{
      alert('Geolocation not supported by this browser')
    }
  }
}

$(document).ready(function(){
  let thermostat = new Thermostat;
  console.log('new thermostat')

  checkIfLocationSaved(thermostat);
  
  
  $("#up").click(function(){
    thermostat.up();
    update(thermostat);
  });

  $("#down").click(function(){
    thermostat.down();
    update(thermostat);
  });

  $("#reset").click(function(){
    thermostat.reset();
    update(thermostat);
  });

  $("#powerSaving").click(function(){
    update(thermostat);
    thermostat.powerSavingToggle();
    update(thermostat);
  });
  
});



