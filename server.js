var port_defaut = 8024;

var express = require('express'),
	exphbs = require('express-handlebars'),
	body_parser = require('body-parser'),
	routes = require('./routes/index'),
	mkdirp = require('mkdirp'),
	session = require('express-session');

mkdirp(__dirname + "/tmp", function(err) {});
 
var app = express();
app.engine('.html', exphbs({defaultLayout: 'default_layout', extname: '.html'}));
app.set('view engine', '.html');

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: 'BrahimMichael',
  	truecookie: { maxAge: 60000 }, 
  	resave: false,
  	saveUninitialized: false
}));

app.use(express.static(__dirname + '/public'));

app.use('/', routes);

app.listen(port_defaut);
console.log("Serveur lancé : http://localhost:" + port_defaut + "/");

module.exports = app;