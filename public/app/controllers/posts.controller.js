app.controller('postsController', function ($scope, newsFeedService, Authentication, postResource, Upload) {

    $scope.wait = false;

	$scope.createPost = function (textContent, image, video) {
        	//Defining type
        	var type = undefined;
        	if(!!image){
                $scope.wait = true;
                type = 'image';
            	Upload.upload({
                	url: '/post',
                	data: {
                    	text: textContent,
                    	author: Authentication.currentUser.username,
                    	type: type,
                        image: image
                	}
            	}).success(function(post){
                    $scope.wait = false;
                	$scope.textContent = '';
                	newsFeedService.posts.unshift(post);
            	}, function (reason) {console.log(reason)});
        	}
            if(!!video){
                $scope.wait = true;
                type = 'video'
                Upload.upload({
                    url: '/post',
                    data: {
                        text: textContent,
                        author: Authentication.currentUser.username,
                        type: type,
                        video: video
                    }
                }).success(function(post){
                    $scope.wait = false;
                    $scope.textContent = '';
                    newsFeedService.posts.unshift(post);
                }, function (reason) {console.log(reason)});
            }
        	else {
                type = 'text';
            	var newPost = new postResource({
                	text: textContent,
                	author: Authentication.currentUser.username,
                	type: type
            	});

            	newPost.$save().then(function (post){
            		$scope.image = '';
                	$scope.textContent = '';
                	newsFeedService.posts.unshift(post);
            	}, function (reason) { console.log(reason)});
        	}
		};

	$scope.deletePost = function (id) {
		var postToDelete = new postResource({id: id});

			postToDelete.$delete().then(function (post) {
				var indexOfPost = newsFeedService.posts.map(function(postFromService){return postFromService._id}).indexOf(post._id);
                    newsFeedService.posts.splice(indexOfPost, 1);
				console.log(post);
			}, function (reason) { console.log(reason)});
	}
})