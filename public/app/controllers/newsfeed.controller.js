app.controller('newsfeedController', function ($scope, newsFeedService, shadesService, Authentication, $sce, $routeParams, userResource) {

	console.log('controller used');

	$scope.shadesService = shadesService;
	$scope.Authentication = Authentication;
	$scope.user = undefined;

	$scope.$on('$routeChangeSuccess', function () {
		if($routeParams.username) {
		var user = new userResource({username: $routeParams.username});
		user.$get().then(function(user){$scope.user = user;}, function(reason){$scope.reason = reason});
		}
		if(Authentication.isAuthenticated()){
            newsFeedService.posts = [];
            $scope.loadMorePosts();
        }
	});

	$scope.$on('change', function () {
		newsFeedService.posts = [];
        $scope.loadMorePosts();
	})

	$scope.loadMorePosts = function () {
		if(!!$routeParams.username){
			var shadesCopy = {};
			angular.extend(shadesCopy, shadesService.currentShades);
			shadesCopy.filterByPeople = [$routeParams.username];
			newsFeedService.loadMorePosts(shadesCopy, newsFeedService.posts.length);
		}
		else newsFeedService.loadMorePosts(shadesService.currentShades, newsFeedService.posts.length);
	}

	$scope.changeShades = function(newShades){
        shadesService.currentShades = newShades;
        newsFeedService.posts = [];
        $scope.loadMorePosts();
    };

	$scope.$on('socket:posts', function (ev, posts) {
		posts.forEach(function(post){
           post.fullState = false;
           newsFeedService.posts.push(post);
        });
        $scope.posts = newsFeedService.posts;
		console.log($scope.posts);
	});

	$scope.$on('socket:deleted post', function (ev, post) {
		var indexOfpost = newsFeedService.posts.map(function (post){return post._id}).indexOf(post._id);
		if(indexOfpost > -1){
			newsFeedService.posts.splice(indexOfpost, 1);
		}
	});

	$scope.$on('socket:post', function (ev, post) {
		var currentShades = shadesService.currentShades;
		if(currentShades.filterByType.indexOf(post.type) > -1 && currentShades.filterByPeople.indexOf(post.author) > -1){
			newsFeedService.posts.unshift(post);
		}
	});

	$scope.filterTags = function(post){
        var processedString = "";
        if(!!post.tags && post.tags.length > 0){
        	post.tags.forEach(function(tag){
            	if(tag.type == 'person') {
               	 processedString = post.text.replace(post.text.substring(tag.startIndex, tag.endIndex), '<a href="#/' + tag.text + '">' + '@' + tag.text + '</a>');
            	}
        	});
        }
        
        if(processedString == "") processedString = post.text;
        return $sce.trustAsHtml(processedString);
    };

    $scope.toggleFullState = function(post){
        post.fullState = !post.fullState;
    };
})