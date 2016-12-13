app.controller('monumentFrance',  function($rootScope, $scope, $http, $uibModal, $q, $log, uiGmapIsReady) {

	uiGmapIsReady.promise(1).then(function(instances) {
        $scope.mapReady = true;
        $scope.refreshMap();
    });

	$scope.$log = $log;
	$scope.mEtab = {};
	
	$scope.listeMonument = [];
	$scope.nbItemPerPage = 30;
	$scope.orderBy = 'REF';
	$scope.filtersStr = "none";
	$scope.isCollapsed = true;
	$scope.currentPage = 1;

	$scope.all_collumns = [ 
	
		{ name : 'TICO', label: 'Tico', ticked : true }, 
		{ name : 'STAT', label: 'Statut', ticked : true }, 
		{ name : 'REG', label: 'Région', ticked : true },
		{ name : 'PPRO', label: 'Description', ticked : false }, 
		{ name : 'DPRO', label: 'Année', ticked : false }, 
		{ name : 'SCLE', label: 'Siècle', ticked : false }, 
		{ name : 'COM', label: 'Commune', ticked : false }, 
		{ name : 'DPT', label: 'Département', ticked : false },
		{ name : 'ADRS', label: 'Adresse', ticked : false }, 
		{ name : 'REF', label: 'REF', ticked : true }, 
		{ name : 'INSEE', label: 'Insee', ticked : true }, 
	];

	$scope.dynamic_data = [];
	$scope.selected = new Array();
	$scope.region = new Array();

	$scope.items = ['item1', 'item2', 'item3'];
    $scope.maxSize = 3;

	$scope.map = {
		center: { 
			latitude: 47.26083,		
			longitude: 2.41889
		},
		control: {},
		zoom: 20,
		bounds: {},
		scrollwheel: true
	};	
	$scope.etabMarkers = [];
	$scope.mapReady = false;

	$scope.filtres = ["INSEE", "TICO", "STAT", "REG", "PPRO", "DPRO", "SCLE", "COM", "DPT", "ADRS"];

	$scope.refreshResults = function(){
		var temp = new Array();

		if($scope.selected.length != 0){
			temp.push({name: 'Selected', msGroup: true, disabled: true });
			temp = temp.concat($scope.selected);
			temp.push({msGroup: false });
		}

		for(var j = 0; j < $scope.filtres.length; j++) {
				var filtre = $scope.filtres[j];
			if($scope[filtre].length != 0){
				temp.push({name: filtre, msGroup: true, disabled: true });
				temp = temp.concat($scope[filtre]);
				temp.push({msGroup: false });
			}
		}

		$scope.dynamic_data = angular.copy(temp);
	};

	$scope.fClick = function( data ) {
		
		if(data.ticked){
			$scope.selected.push(data);
			$scope.selected.sort(function(a,b){
				return a.name.localeCompare(b.name);
			});
			for (var i = 0; i < $scope[data.filter].length; i++) {
				if($scope[data.filter][i].name == data.name){
					$scope[data.filter].splice(i, 1);
					break;
				}
			}
		}
		else {
			for (var i = 0; i < $scope.selected.length; i++) {
				if($scope.selected[i].name == data.name){
					$scope.selected.splice(i, 1);
					break;
				}
			}
			$scope[data.filter].push(data);
			$scope[data.filter].sort(function(a,b){
				return a.name.localeCompare(b.name);
			});
		}

		if($scope.selected.length == 0) {
			$scope.selected = new Array();
		}
		$scope.refreshResults();
	};

	$scope.fSearchChange = function( data ) {

		if(data.keyword != $scope.keyword){

			$scope.keyword = data.keyword;

			var temp = new Array();
			var names = new Array();

			var selected = $scope.output_data;

			if(selected.length != 0){
				$scope.selected = new Array();
				for (var i = 0; i < selected.length; i++) {
					$scope.selected.push(selected[i]);
					names.push(selected[i].name);
				}
			}			

			for(var j = 0; j < $scope.filtres.length; j++) {
				var filtre = $scope.filtres[j];
				var results = $scope.querySearch(data.keyword, filtre);

				$scope[filtre] = new Array();
				for (var i = 0; i < results.length; i++) {
					if(names.indexOf(results[i]) == -1){
						$scope[filtre].push({name : results[i], label: results[i], ticked : false, filter: filtre, index :i});
					}
				}

			}
			$scope.refreshResults();
		}	    
	};

	$scope.fSelectNone = function(){	
		for (var i = 0; i < $scope.selected.length; i++) {
			var data = $scope.selected[i];
			data.ticked = false;
			$scope[data.filter].push(data);
			$scope[data.filter].sort(function(a,b){
				return a.name.localeCompare(b.name);
			});
		}	
		$scope.selected = new Array();
		$scope.filtersStr = "none";
		$scope.refreshResults();
	};

	$scope.fReset = function(){
		$scope.selected = new Array();
		for(var j = 0; j < $scope.filtres.length; j++) {
			$scope[$scope.filtres[j]] = new Array();
		}
		$scope.filtersStr = "none";
		$scope.refreshResults();
	};

	$scope.fClear = function(){		
		for(var j = 0; j < $scope.filtres.length; j++) {
			$scope[$scope.filtres[j]] = new Array();
		}
		$scope.refreshResults();
	};

	$scope.filterData = function(){
		$scope.currentPage = 1;
		var output_data = $scope.output_data;
		$scope.filters = new Object();

		if(output_data !== undefined) {
			for(var i = 0; i < output_data.length; i++) {
				var name = output_data[i].name;
				var filter = output_data[i].filter;

				if(!$scope.filters[filter]){
					$scope.filters[filter] = new Array();
				}
				$scope.filters[filter].push(name);
			}
		}
		$scope.getData();
	}

	$scope.getData = function() {
		var url = ($scope.url) ? $scope.url : "/get";
		var page = $scope.currentPage;
		var nbItem = $scope.nbItemPerPage;
		var order = $scope.orderBy;
		var neBound = $scope.neBound;
		var soBound = $scope.soBound;
		var filters = $scope.filters;
		

		var query = "?page=" + page + "&nbItemPerPage=" + nbItem + "&orderBy=" + order ;
		if(filters && Object.keys(filters).length > 0){
			$scope.filtersStr = JSON.stringify(filters);
		}
		query += "&filter=" + $scope.filtersStr;
		query += (neBound) ? "&maxLng="+neBound.lng() +"&maxLat="+neBound.lat() : "";
		query += (soBound) ? "&minLng="+soBound.lng() +"&minLat="+soBound.lat() : "";		

		$http.get(url+query).then(function(response) {
			
			$scope.listeMonument = response.data.data;
			$scope.nbTotalElem = response.data.nbTotalElem;
			$scope.nbItemPerPage = response.data.nbItemPerPage;
    		$scope.orderBy = response.data.orderBy;
    		$scope.currentPage = response.data.page;
    		
    		$scope.refreshMap();
		});

	};

	$scope.showModal = function(row){
		var colonnes = $scope.all_collumns;
		var modalInstance = $uibModal.open({
			animation: true,	
			templateUrl: 'monumentModal',
			controller: function ($scope, $uibModalInstance) {
				$scope.$log = $log;
                $scope.mEtab = row;
                $scope.colonnes = colonnes;

                $scope.close = function() {
                	$uibModalInstance.close();
                };
            },
			size: 'lg',
			resolve: {
				mEtab: function () {
				  	return row;
				}, 
				colonnes: function() {
					return this
				}
			}
		});
        
    };

    $scope.querySearch = function(query, filter) {
		var q = query.toLowerCase().trim();
		var deferred = $q.defer();
		var f = filter.toLowerCase().trim();
		var results = [];
		// console.log(query);
		var request = new XMLHttpRequest();
		request.open('GET', '/lookup?query='+q+'&filter='+f, false);  // `false` makes the request synchronous
		request.send(null);

		if (request.status === 200) {
			var response = JSON.parse(request.response);
		  	for (var i = 0; i < response.data.length; i++) {
				results.push(response.data[i]);
			}
		}

        return results;
    };

    $scope.buildMarkers = function(){

		var createMarker = function(id, name, lat, lng, etab) {

			var marker = new google.maps.Marker({
				id: id,
				title: id, 
				latitude: lat,
				longitude: lng,
	            show: false,
	            events: {
	            	mouseover: $scope.onMouseOver,
	            	mouseout: $scope.onMouseOut
	            },
	            etab: etab
			});
			return marker;
		};

		
		$scope.etabMarkers = [];
		var markers = [];

		var map = $scope.map.control.getGMap();
		map.setZoom(20);
		map.setCenter(new google.maps.LatLng(47.26083,2.41889));
		var bounds = map.getBounds();


		for(var index in $scope.listeMonument) {
			var element = $scope.listeMonument[index];
			markers.push(createMarker(element.UAI, element.nom, element.latitude, element.longitude, element));

			var loc = new google.maps.LatLng(element.latitude, element.longitude);
			bounds.extend(loc) // your marker position, must be a LatLng instance
		}

		map.fitBounds(bounds); // map should be your map class
		$scope.etabMarkers = markers;
	};

	$scope.refreshMap = function(){	
		if(!$scope.mapReady) return;
		var map = $scope.map.control.getGMap();
		google.maps.event.trigger(map, 'resize');
		$scope.buildMarkers();
	}

	$scope.onClick = function(marker, eventName, model) {
		$scope.showModal(model.etab)
	}

	$scope.onMouseOver = function(marker, eventName, model){
		marker.setAnimation(google.maps.Animation.BOUNCE);
		angular.element(document.querySelector('#Etab-'+model.id)).trigger('mouseover');
	}

	$scope.onMouseOut = function(marker, eventName, model){
		marker.setAnimation(null);
		angular.element(document.querySelector('#mapCanvas')).trigger('mouseout');
	}

	$scope.$watch(
		// This function returns the value being watched. It is called for each turn of the $digest loop
		function () {return angular.element(document.querySelector('#mapCanvas')).attr('aria-expanded');},
		//This is the change listener, called when the value returned from the above function changes
	  	function(newValue, oldValue) {
		  	if(newValue || oldValue){
		    	$scope.refreshMap();
		    }
	  	}
	);
});


