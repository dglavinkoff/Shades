var messagesController = require('../controllers/messages.controller');

module.exports = function (io) {
	var chatNamespace = io.of('/chat');

	return new chatSocket(chatNamespace);
}

function chatSocket (io) {
	var self = this;
	self.connected = [];

	io.on('connection', function (socket) {
		socket.on('authentication', function (username) {
			self.connected[username] = socket;
		});

		socket.on('load messages', function (data) {
			messagesController.load(data.usernames, data.toSkip, socket);
		})
	})

	self.emitMessage = function (message, usersToEmit) {
		connected.forEach(function (user) {
			if(usersToEmit.indexOf(user.username) > -1){
				user.socket.emit('receiveMessage', message);
			}
		})
	}
}