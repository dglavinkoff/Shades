app.factory('newsFeedService', function (Authentication, newsFeedSocket) {
	return {
		posts: [],
		loadMorePosts: function (shades, toSkip) {
			newsFeedSocket.loadPosts(shades, Authentication.currentUser, toSkip);
		}
	}
})