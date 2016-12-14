app.controller('monumentFrance',  function($rootScope, $scope, $http, $uibModal, $q, $log, uiGmapIsReady) {

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

    $scope.maxSize = 3;	

	$scope.filtres = ["INSEE", "TICO", "STAT", "REG", "PPRO", "DPRO", "SCLE", "COM", "DPT", "ADRS"];	
	
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
		
});


