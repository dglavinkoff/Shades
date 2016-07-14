app.controller('commentsController', function ($scope, newsFeedService, commentResource, Authentication) {
	
	$scope.createComment = function (textContent, postId) {
		var comment = new commentResource({text: textContent, post: postId});

		comment.$save().then(function (comment) { 
			newsFeedService.posts.forEach(function(post){
            	if(post._id == comment.post){
                	post.comments.push(comment); 
            	}
        	})
		}, function (reason) { console.log(reason)});
	}

	$scope.deleteComment = function (id) {
		var commentToDelete = new commentResource({id: id});

		commentToDelete.$delete().then(function (comment) {
			newsFeedService.posts.forEach(function(post){
            	if(post._id == comment.post){
            		var indexOfComment = post.comments.map(function(commentFromService){return commentFromService._id}).indexOf(comment._id);
                	post.comments.splice(indexOfComment, 1);
            	}
        	})
		}, function (reason) {console.log(reason)});
	}

})