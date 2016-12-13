var express = require('express');
var basex = require("basex");
var session = require('express-session');
var fs = require("fs");
var exec = require('child_process').exec;
var db_name = "merimee-MH",
	default_elements_per_pages = 20,
	default_order_by = 'REF';

var dataAdaptater = {
	'Region' : 'REG',
	'Departement' : 'DPT',
	'Commune' : 'COM',
	'Insee' : 'INSEE',
	'Tico' : 'TICO',
	'Adresse' : 'ADRS',
	'Statut' : 'STAT',
	'Description' : 'PPRO',
	'Annee' : 'DPRO',
	'Siecle' : 'SCLE',
};

var default_parameters = {
	where: '',
	orderBy: default_order_by,
	critere: '',
	sorting: '',
	filtres: '',
	filtering : '',
	nbItemPerPage: default_elements_per_pages,
	current_page: 1,
	last_json_result: []
}

var parameters = {};

var magicQuery = '';
fs.readFile('./queries/magicQuery.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	magicQuery = data;
});
var magicQueryXML = '';
fs.readFile('./queries/magicQuery_xml.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	magicQueryXML = data;
});
var queryGraphPiechart = '';
fs.readFile('./queries/piechart.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	queryGraphPiechart = data;
});
var queryGraphHistogram = '';
fs.readFile('./queries/histogram.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	queryGraphHistogram = data;
});
var queryGraphPiechartPDF = '';
fs.readFile('./queries/piechart_pdf.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	queryGraphPiechartPDF = data;
});
var queryGraphPHistogramPDF = '';
fs.readFile('./queries/histogram_pdf.xquery', 'utf8', function (err, data) {
	if (err) throw err;
	queryGraphPHistogramPDF = data;
});

function constructWhereClause(filter) {
	if(filter == "none"){
		return "";
	}

	var str_where = " where ";
	var filtres = JSON.parse(filter);
	var index = 0;
	for (var key in filtres) {
	    if (filtres.hasOwnProperty(key)) {
	    	if(index != 0) {
				str_where += " and ";
			}

			str_where += " ( ";
			var values = filtres[key];
	        for (var i = 0; i < values.length; i++) {
	        	var value = values[i];
	        	if(i != 0) {
					str_where += " or ";
				}
	        	str_where += " $x/"+key+" = \"" + value+"\" ";
	        }
	        str_where += " ) ";
	    }
		index++;
	}
	return str_where;
}

function truncateList(list, start, end) {
	listeMonuments = [];
	var ii = 0;
	for(var i = start; i < end; i++) {
		listeMonuments[ii] = JSON.parse(list[i]);
		ii++;
	}
	return listeMonuments;
}

function checkAndGetSessionParameters(session) {
	if(! session.parameters) {
		session.parameters = default_parameters;
	}
	return session.parameters;
}

var basex_session = new basex.Session();
basex_session.execute('open ' + db_name);

var router = express.Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/get', function(req, res) {
	parameters = checkAndGetSessionParameters(req.session);

	parameters.orderBy = (req.query.orderBy) ? req.query.orderBy : parameters.orderBy;
	parameters.where = (req.query.filter) ? constructWhereClause(req.query.filter) : parameters.where;
	parameters.current_page = (req.query.page) ? req.query.page : parameters.current_page;
	parameters.nbItemPerPage = (req.query.nbItemPerPage) ? req.query.nbItemPerPage : parameters.nbItemPerPage;
	
	var str_query = magicQuery.replace('$$__WHERE__$$', parameters.where).replace('$$__ORDERBY__$$', "order by $x/" + parameters.orderBy);

	basex_session.query(str_query).results(function (err, query_result) {
		if (err) throw err;

		var start = (parameters.nbItemPerPage == 'seeAll') ? 0 : (parameters.current_page - 1 ) * parameters.nbItemPerPage;
		var end = (parameters.nbItemPerPage == 'seeAll') ? query_result.result.length : parameters.current_page * parameters.nbItemPerPage;
		end = (query_result.result.length < end) ? query_result.result.length : end;

		parameters.last_json_result = query_result.result;
		var listeMonuments = truncateList(query_result.result, start, end);

		res.end(
			JSON.stringify( { 
				data: listeMonuments, 
				orderBy : parameters.orderBy, 
				nbTotalElem : query_result.result.length, 
				nbItemPerPage : parameters.nbItemPerPage,
				page : parameters.current_page
			})
		);
	});
});

router.get('/export/json', function(req, res) {
	parameters = checkAndGetSessionParameters(req.session);
	res.end(JSON.stringify( truncateList(parameters.last_json_result, 0, parameters.last_json_result.length) ));
});

router.get('/export/xml', function(req, res) {
	parameters = checkAndGetSessionParameters(req.session);
	var str_query = magicQueryXML.replace('$$__WHERE__$$', parameters.where).replace('$$__ORDERBY__$$', "order by $x/" + parameters.orderBy);
	basex_session.query(str_query).execute(function (err, query_result) {
		if (err) throw err;
		res.end("<csv_data>\n" + query_result.result + "\n</csv_data>");
	});
});

router.get('/maps', function(req, res) {
	res.render('maps');
});




module.exports = router;