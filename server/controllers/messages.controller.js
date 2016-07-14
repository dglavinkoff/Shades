var Message = require('mongoose').model('Message'),
q = require('q'),
config = require('../config/config.js');

module.exports = {
	findMessageById: function (id) {
		var deferred = q.defer();

		Message.findOne({_id: id}).exec(function (err, message) {
			if(err) deferred.reject(err);
			if(!message) deferred.reject('Message does not exist');
			else deferred.resolve(message);
		})

		return deferred.promise;
	},

	create: function (req, res, chatSocket) {
		
		req.body.sender = req.user.username;
		Message.create(req.body, function (err, message) {
			if(!!err) {
				res.status(400).send(false);
			}
			else {
				if(chatSocket.connected[message.receiver]) {
					chatSocket.connected[message.receiver].emit('message', message);
				}
				res.send(message);
			}
		})
	},

	delete: function (req, res, chatSocket) {

		Message.findOne({_id: req.params.id}).exec(function (err, message) {
			if(err) res.status(400).send(false);
			if(!message) {
				if(message.author == req.user.username){
					Message.remove(message, function (err, message) {
						if(err) res.status(400).send(false);
						else res.send(message);
					})
				}
				else res.status(403).send('Not authorized');
			}
			else res.status(400).send(false);
		})
	},

	load: function (usernames, toSkip, socket) {

        Message.find({})
        	.where('sender').in(usernames)
        	.where('receiver').in(usernames)
        	.sort('-date')        
        	.skip(toSkip)       	
            .limit(10)
            .exec(function(err, messages){
                if(err){
                    console.log(err);
                    //emit error event
                }
                else{
                    console.log('all messages');
                    console.log(messages);
                    console.log(socket.emit);
                    socket.emit('messages', messages);
                }
            });
	}
}
