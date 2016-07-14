app.factory('chatSocket', function (socketFactory, Authentication) {
	var chatSocket = socketFactory({ioSocket: io.connect('/chat')});

	chatSocket.forward('message');
	chatSocket.forward('deleted message')
	chatSocket.forward('messages');
	chatSocket.forward('error loading chat');

	chatSocket.authenticate = function(username){
        chatSocket.emit('authentication', username);
    };

    chatSocket.loadMessages = function (usernames, toSkip) {
    	var data = {usernames: usernames, toSkip: toSkip};

    	chatSocket.emit('load messages', data);
    }

    return chatSocket;
})