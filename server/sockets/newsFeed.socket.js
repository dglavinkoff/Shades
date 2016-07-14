var config = require('../config/config.js');
var postController = require(config.rootPath + './server/controllers/posts.controller');

module.exports = function (io) {
	var newsFeedNamespace = io.of('/newsFeed')

	return new NewsFeedSocket(newsFeedNamespace);
}

function NewsFeedSocket (newsFeedNamespace) {
	var self = this;
	
	self.connected = [];

	newsFeedNamespace.on('connection', function (socket) {

		socket.on('authentication', function (username) {
			self.connected[username] = socket;
		});

		socket.on('load', function (data) {
			postController.loadPosts(data.shades, data.loggedUser, data.toSkip)
				.then(function (posts) {
					socket.emit('posts', posts)
				}, socket.emit('errorLoadingNewsFeed'));
		});
	})

	self.emitNewPost = function (post) {
		post.author.followers.forEach(function (user) {
			connected.forEach(function (connectedUser) {
				if(user._id === connectedUser.id) connectedUser.socket.emit('post', post);
			})
		})
	};

	self.emitDeletedPost = function (post) {
		post.author.peekedBy.forEach(function (user) {
			connected.forEach(function (connectedUser) {
				if(user._id === connectedUser.id) connectedUser.socket.emit('deleted_post', post);
			})
		})
	};
}