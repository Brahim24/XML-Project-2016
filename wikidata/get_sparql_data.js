//module necessaire
var request = require('request');


/** Recuperation des infos sur WIKIDATAS **/
function GET_SPARQL_DATA(merimeeID, callback) {

    var query = 'https://query.wikidata.org/sparql?format=json&query=SELECT ?image ?geo WHERE{?m    wdt:P380 "' + merimeeID + '".?m wdt:P18 ?image.?m wdt:P625 ?geo.}';
    
    
  //GET sur wikidata.org
  request(query, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error || {statusCode: response.statusCode});
    }
    callback(null, JSON.parse(body));  
  });
}


 GET_SPARQL_DATA("PA17000048", function(err, body) {
        if (err) {
            console.log(err);
        } else {
            console.log(body);
            //GEOLOCALISATION :
            var geo = body.results.bindings[0].geo.value;
            var image = body.results.bindings[0].image.value;
            //GEOLOCALISATION :
            console.log(geo);
            //URI IMAGE :
            console.log(image);
}});