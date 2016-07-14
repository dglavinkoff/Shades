app.factory('newsFeedSocket', function (socketFactory) {
	var newsFeedSocket = socketFactory({ioSocket: io.connect('/newsFeed')});

	newsFeedSocket.forward('post');
	newsFeedSocket.forward('deleted post');
    newsFeedSocket.forward('posts');

	newsFeedSocket.authenticate = function(username){
        newsFeedSocket.emit('authentication', username);
    };

     newsFeedSocket.loadPosts = function (shades, loggedUser, toSkip) {
        newsFeedSocket.emit('load', {shades: shades, toSkip: toSkip, loggedUser: loggedUser});
    };

    return newsFeedSocket;
})