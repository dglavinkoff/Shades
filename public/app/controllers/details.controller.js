app.controller('detailsController', function ($scope, $routeParams, $rootScope, userResource) {
	$scope.user = undefined;
	$scope.reason = '';

	$scope.$on('$routeChangeSuccess', function () {
		var user = new userResource({username: $routeParams.username});
		user.$get().then(function(user){$scope.user = user;}, function(reason){$scope.reason = reason});
		$rootScope.$broadcast('details');
	})
})