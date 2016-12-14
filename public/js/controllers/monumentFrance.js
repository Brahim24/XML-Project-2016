app.controller('monumentFrance',  function($rootScope, $scope, $http, $uibModal, $q, $log, uiGmapIsReady) {

	uiGmapIsReady.promise(1).then(function(instances) {
        $scope.mapReady = true;
        $scope.refreshMap();
    });

	$scope.$log = $log;
	$scope.monu = {};
	
	$scope.listeMonument = [];
	$scope.nbItemPerPage = 30;
	$scope.orderBy = 'REF';
	$scope.filtersStr = "none";
	$scope.isCollapsed = true;
	$scope.currentPage = 1;

	$scope.all_collumns = [ 
		{ name : 'REF', label: 'REF', ticked : true }, 
		{ name : 'TICO', label: 'Titre Courant', ticked : true }, 
		{ name : 'STAT', label: 'Statut', ticked : true }, 
		{ name : 'REG', label: 'Région', ticked : true },
		{ name : 'PPRO', label: 'Précisions sur la protection MH', ticked : false }, 
		{ name : 'DPRO', label: 'Date de Protection', ticked : true }, 
		{ name : 'SCLE', label: 'Siècle', ticked : false }, 
		{ name : 'COM', label: 'Commune', ticked : true }, 
		{ name : 'DPT', label: 'Département', ticked : false },
		{ name : 'ADRS', label: 'Adresse', ticked : false }, 
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
	$scope.monuMarkers = [];
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
                $scope.monu = row;
                $scope.colonnes = colonnes;

                $scope.close = function() {
                	$uibModalInstance.close();
                };
            },
			size: 'md',
			resolve: {
				monu: function () {
				  	return row;
				}, 
				colonnes: function() {
					return this
				}
			}
		});
        
    };

		
	$scope.refreshMap = function(){	
		if(!$scope.mapReady) return;
		var map = $scope.map.control.getGMap();
		google.maps.event.trigger(map, 'resize');
		$scope.buildMarkers();
	}

	$scope.onClick = function(marker, eventName, model) {
		$scope.showModal(model.monu)
	}

	$scope.onMouseOver = function(marker, eventName, model){
		marker.setAnimation(google.maps.Animation.BOUNCE);
		angular.element(document.querySelector(model.id)).trigger('mouseover');
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


