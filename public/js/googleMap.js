var geocode = "Point(7.05085 43.62431)";

var pstart = geocode.indexOf("(");
var pend = geocode.lastIndexOf(")");

// Tableau de longitude, latitude
var geoposition = (geocode.slice(pstart+1,pend)).split(" "); 

var position = {longitude: geoposition[0], latitude: geoposition[1]};
//mlat=46.163&mlon=-1.1533&zoom=11&layers=M";

/*var urlMap = openStreetMap + "mlat=" + position.latitude + "&mlon=" + position.longitude +"&zoom=11&layers=M";*/

var geopos = {lat: parseFloat(position.latitude), lng: parseFloat(position.longitude)};


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: geopos,
    zoom: 15
  });
    
    
    var marker = new google.maps.Marker({
            position: geopos, 
            map: map
    });

}





