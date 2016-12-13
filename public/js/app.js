var app = angular.module('monumentFranceApp', ['uiGmapgoogle-maps', 'ngMaterial', 'ngMessages', 'ngAnimate','ui.bootstrap', 'isteven-multi-select']);

app.config(function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyACBLIZJMvaPf_rhWPQGvaxhaWxCRAPRJo',
        v: '3.22', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});