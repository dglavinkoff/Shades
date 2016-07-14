app.controller('shadesController', function ($scope, Authentication, shadesResource, shadesService, $rootScope) {
	$scope.Authentication = Authentication;
    $scope.shades = shadesService;
	$scope.currentShades = shadesService.currentShades;
	$scope.following = [];
	var selectedPeople = [];

	$scope.$watch('Authentication.currentUser', function(){
        if(Authentication.isAuthenticated()) {
            if(!!Authentication.currentUser.following){
                $scope.following = [];
                Authentication.currentUser.following.forEach(function(username){
                    $scope.following.push({
                        username: username,
                        isSelected: false
                    });
                })
            }           
        }
    });

	//Puts every selected person in the selected people array
	$scope.doSelection = function(){
        $scope.following.forEach(function(user){
            if(user.isSelected){
                selectedPeople.push(user.username);
            }
        })
    };

    $scope.createShades = function(name, includeTexts, includeImages, includeVideos){
        $scope.doSelection();

        var data = {
            name: "",
            filterByType: [],
            filterByPeople: []
        };

        data.name = name;

        if(includeImages){
            data.filterByType.push('image');
        }

        if(includeTexts){
            data.filterByType.push('text');
        }

        if(includeVideos){
            data.filterByType.push('video');
        }

        data.filterByPeople = selectedPeople;

        var shades = new shadesResource(data);

        shades.$save().then(function (shades) {
            Authentication.currentUser.shades.push(shades);
            $scope.following.forEach(function(user){
            if(user.isSelected){
                user.isSelected = false;
            }
            $scope.data = {};
        })
        }, function (reason) {deferred.reject(reason)});
    };

    $scope.deleteShades = function (id) {

        var shades = new shadesResource(id);

        shades.$delete().then(function (shades) {
            // Splice the shades from the current user
        }, console.log(reason));

    };

    $scope.change = function (shades) {
        shadesService.currentShades = shades;
        $rootScope.$broadcast('change');
    };
})