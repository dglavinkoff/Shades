var app = angular.module('Shades', ['ngCookies','ngRoute', 'ngResource', 'ngFileUpload', 'btford.socket-io']);

app.config(function ($routeProvider, $sceProvider) {
	
	$sceProvider.enabled(false);

	$routeProvider
		.when('/', {
			templateUrl: './partials/account/home',
			controller: 'newsfeedController'
		})
		.when('/settings', {
            templateUrl: "partials/account/settings",
            controller: "profileController"
        })
		.when('/:username', {
			templateUrl: './partials/account/details',
			controller: 'newsfeedController'
		})
})