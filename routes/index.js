var express = require('express');
var basex = require("basex");
var session = require('express-session');
var fs = require("fs");
var exec = require('child_process').exec;
var db_name = "merimee-MH",
	default_elements_per_pages = 25,
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

/* Route pour la création des graphes (HTML) */
router.post('/graph', function(req,res) {
	/* On récupere les params de la requetes */
	var critere = req.body.critere;
	var sorting = req.body.sorting;
	var filtering = req.body.filtering;
	/*
		path : path du template xquery à utiliser
		sortingParamter : clause de tri
		str_where : clause where
		title : titre de la page 
	*/
	var request, sortingParameter, str_where, title;
	/* COnstrcution des params */
	if(critere == 'Longitude' || critere == 'Latitude') {
		request = queryGraphHistogram;
		if(critere == 'Longitude') {
			title = "Est / Ouest";
		} else {
			title = "Nord / Sud";
		}
		str_where="";
		if(filtering !== "" && filtering !== "none") {
			var filtering = JSON.parse(filtering);
			for (var key in filtering) {
			    if (filtering.hasOwnProperty(key)) {
					str_where += " and ";
					str_where += " ( ";
					var values = filtering[key];
			        for (var i = 0; i < values.length; i++) {
			        	var value = values[i];
			        	if(i != 0) {
							str_where += " or ";
						}
			        	str_where += " "+key+" = \"" + value.replace(/'/g,'&#39;')+"\" ";
			        }
			        str_where += " ) ";
			    }
			}		
		} else {
			str_where = '';
		}
	} else {
		request = queryGraphPiechart;
		title = "par " + critere;
		if(sorting == "sort") {
			sortingParameter = 'order by count($x) descending';
		} else {
			sortingParameter = '';
		}
		if(filtering !== "" && filtering !== "none") {
			var filtering = JSON.parse(filtering);
			str_where = " where ";
			var index = 0;
			for (var key in filtering) {
			    if (filtering.hasOwnProperty(key)) {
			    	if(index != 0) {
						str_where += " and ";
					}
					str_where += " ( ";
					var values = filtering[key];
			        for (var i = 0; i < values.length; i++) {
			        	var value = values[i];
			        	if(i != 0) {
							str_where += " or ";
						}
			        	str_where += " $x/"+key+" = \"" + value.replace(/'/g,'&#39;')+"\" ";
			        }
			        str_where += " ) ";
			    }
				index++;
			}		
		} else {
			str_where = '';
		}
	}
	/* Lecture du template xquery, remplacement des params, et execution de la requete */
	/* Renvoit du template template handlebars svg.hbs */
	var input_query = request.replace(/_#_CRITERE_#_/g, dataAdaptater[critere])
		.replace(/_#_SORTINGPARAMETER_#_/g, sortingParameter)
		.replace(/_#_SPECIALCRITERE_#_/g, critere)
		.replace(/_#_WHERE_CLAUSE_#_/g, str_where);
	var query = basex_session.query(input_query);
	query.results(function(err, query_result) {
		if (err) throw err;
		res.render('svg' , { data : query_result.result, critere : title});
	});
});

/* Route pour la création des graphes (HTML), même principe de fonctionnement que le dernier routeur */
router.post('/pdf_graph', function(req,res) {
	
	/* Param PDF */
	var timestamp = new Date().getTime();
	var fileName = "pdf" + timestamp;
	var filePathXquery = __dirname + "/../temp/" + fileName;
	var filePathJS = "./temp/" + fileName;
	var critere = req.body.critere;
	var sorting = req.body.sorting;
	var filtering = req.body.filtering;
	var request, title;
	if(critere == 'Longitude' || critere == 'Latitude') {
		request = queryGraphPHistogramPDF;
		if(critere == 'Longitude') {
			title = 'Est/Ouest';
		} else {
			title = 'Nord/Sud';
		}
	} else {
		request = queryGraphPiechartPDF;
		title = critere;
	}
	var input_query = request.replace(/_#_CRITERE_#_/g, dataAdaptater[critere])
		.replace(/_#_FILEPATH_#_/g, filePathXquery)
		.replace(/_#_TITLE_#_/g, title)
		.replace(/_#_SORTINGPARAMETER_#_/g, sorting)
		.replace(/_#_WHERE_CLAUSE_#_/g, filtering);
	var query = basex_session.query(input_query);
	query.results(function(err, query_result) {
		if (err) throw err;
		/* Execution FOP */
		function puts(error, stdout, stderr) {
			res.render('pdf' , { link : filePathJS + ".pdf"});
		};
		var cmd = "fop " + filePathJS + ".fo " + filePathJS + ".pdf";
		exec(cmd, puts);
	});
});

/* Route pour récupérer un pdf */
router.get('/temp/:file', function(req,res) {
	var file = req.params.file;
	var path = __dirname + "/../temp/" + file;
	res.download(path);
});


router.get('/lookup', function(req, res) {


		var query = req.query.query.toLowerCase();
		var filter = req.query.filter.toLowerCase();
		var xquery = "(for $x in distinct-values(/csv_data/row/"+ filter +"[contains(lower-case(.), \""+ query +"\")]) order by $x "+
					" return json:serialize($x))[position() = 1 to 5]";

		basex_session.query(xquery).results(function (err, query_result) {
			if (err) throw err;

			var results = [];	
			for(var i = 0; i < query_result.result.length; i++) {
				results[i] = JSON.parse(query_result.result[i]);
			}

			res.end(JSON.stringify( { data: results }));
		});
});

module.exports = router;