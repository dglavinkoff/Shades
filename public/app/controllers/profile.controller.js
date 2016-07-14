app.controller('profileController', function ($scope, userResource, Authentication, $http, $location) {

	$scope.Authentication = Authentication;
	$scope.matched = undefined;
	if(Authentication.isAuthenticated())
	{
		$scope.data = {
		fullname: Authentication.currentUser.fullname,
		email: Authentication.currentUser.email,
		bio: Authentication.currentUser.bio
		};
	}
	else {
		$scope.data = {};
	}
	$scope.search = function (query) {
		$http.get('/user/search/' + query).success(function (users) {
				$scope.matched = users;
			}).error(function (reason) {
				console.log(reason);
			})
	}

	$scope.redirect = function(username){
		$scope.matched = undefined;
        $location.path('/' + username);
    }

	$scope.follow = function (username) {
		var userToFollow = new userResource({username: username});

		userToFollow.$follow()
			.then(function success () {
				Authentication.currentUser.following.push(username);
			}, function (reason) {console.log(reason)});	
	}

	$scope.unfollow = function (username) {
		var userToUnfollow = new userResource({username: username});

		userToUnfollow.$unfollow()
			.then(function success () {
						Authentication.currentUser.following.splice(Authentication.currentUser.following.indexOf(username), 1);
			}, function (reason) {console.log(reason)});
	}

	$scope.isFollowed = function (username) {
		return Authentication.currentUser.following.indexOf(username) > -1;
	}

	$scope.isBlocked = function (username) {
		return Authentication.currentUser.blocked.indexOf(username) > -1;
	}

	$scope.block = function (username) {
		var userToBlock = new userResource({username: username});

		userToBlock.$block()
			.then(function success () {
				Authentication.currentUser.blocked.push(username);
			}, function (reason) {console.log(reason)});
	}

	$scope.unblock = function (username) {
		var userToUnblock = new userResource({username: username});

		userToUnblock.$unblock()
			.then(function success () {
				Authentication.currentUser.blocked.splice(Authentication.currentUser.blocked.indexOf(username), 1);
			}, function (reason) {console.log(reason)});
	}

	$scope.updateProfile = function () {
		$scope.data._id = Authentication.currentUser._id;
		if($scope.data.username == undefined) $scope.data.username = Authentication.currentUser.username;
		if($scope.data.fullname == undefined) $scope.data.fullname = Authentication.currentUser.fullname;
		if($scope.data.email == undefined) $scope.data.email = Authentication.currentUser.email;
		if($scope.data.bio == undefined) $scope.data.bio = Authentication.currentUser.bio;

		var user = new userResource($scope.data);
		user.$update().then(function (user) {
			angular.extend(Authentication.currentUser, $scope.data);
			$scope.data = {};
			$scope.successfullyUpdated = 'Успешно обновяване на данните.';
		}, function (reason) { $scope.successfullyUpdated = 'Нещо се обърка.' });
	}

	$scope.changePassword = function () {
		if($scope.password.password != $scope.password.repeatPassword){
			$scope.successfullyChangedPassword = 'Паролите не съвпадат.';
		}
		else {
			delete $scope.password[repeatPassword];
			var data = {_id: Authentication.currentUser._id, password: password};

			var user = new userResource(data);

			user.$update().then(function () {
				angular.extend(Authentication.currentUser, data);
				$scope.password = {};
				$scope.successfullyChangedPassword = 'Паролата е сменена успешно.';
			}, function (reason) { $scope.successfullyChangedPassword = 'Нещо се обърка.'});
		}
	}
})