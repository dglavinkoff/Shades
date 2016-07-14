app.controller('AuthController', function ($scope, userResource, Authentication, $rootScope, shadesService, newsFeedSocket, chatSocket, $location) {

	$scope.user = {};
	$scope.Authentication = Authentication;
	$scope.passwordsMatch = true;

	$scope.signin = function (username, password) {
		var user = new userResource({username: $scope.user.username, password: $scope.user.password});
		user.$signin().then(function success (user) {

			//Initialize services and authenticating to the sockets
			Authentication.currentUser = user;
			if(Authentication.currentUser.shades.length > 0){
				shadesService.currentShades = Authentication.currentUser.shades[0];
			}
			newsFeedSocket.authenticate(Authentication.currentUser.username);
			chatSocket.authenticate(Authentication.currentUser.username);
			$rootScope.$broadcast('change');

		}, function error (reason) {
			console.log(reason);
		})
	};

	$scope.signout = function () {
		var user = new userResource(Authentication.currentUser);

		user.$signout().then(function success () {
			Authentication.currentUser = undefined;
			$location.path('/');
		}, function error (reason) {
			console.log(reason);
		})
	};

	$scope.signup = function () {

		if($scope.user.password != $scope.user.confirmPassword) {
			$scope.passwordsMatch = false;
		}
		else {

		var user = new userResource($scope.user);

			user.$signup().then(function (user) {

				Authentication.currentUser = user;
				//Initialize services and authenticating to the sockets
				Authentication.currentUser = user;
				if(Authentication.currentUser.shades.length > 0){
					shadesService.currentShades = Authentication.currentUser.shades[0];
				}
				newsFeedSocket.authenticate(Authentication.currentUser.username);
				chatSocket.authenticate(Authentication.currentUser.username);
				$rootScope.$broadcast('change');


			}, function error (reason) {
				console.log(reason);
			});
		}
	};

});