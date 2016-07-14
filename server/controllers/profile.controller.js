var User = require('mongoose').model('User');
var Post = require('mongoose').model('Post');
var Comment = require('mongoose').model('Comment');
var uuid = require('node-uuid');

module.exports = {

	signup: function (req, res) {
		
		req.body.auth_token = uuid.v4();
		var newUser = new User(req.body);
		newUser.following.push(newUser.username);
		newUser.hashPassword();
		newUser.save(function (err, user) {
			if(err){
				console.log(err);
				res.status(400).send('Error');
			}
			else {
				res.cookie('auth_token', user.auth_token);
				res.send(user);
			}
		})
	},

	follow: function (req, res) {
		if(req.interactionUser.blocked.indexOf(req.user.username) == -1){
			req.interactionUser.addFollower(req.user.username, function (response) {
				if(!res) {
					res.status(400).send('Error.');
				}
				else {
					req.user.addToFollowing(req.interactionUser.username, function (response) {
						if(!res) {
							res.status(400).send('Error.');
						}
						else {
							res.send(req.interactionUser.username);
						}
					})
				}
			});
		}
		else {
			res.status(400).send('This user has blocked you.');
		}
	},

	unfollow: function (req, res) {
		if(req.interactionUser.followers.indexOf(req.user.username) > -1) {
			req.interactionUser.removeFollower(req.user.username, function (response) {
				if(!res) {
					res.status(400).send('Error.');
				}
				else {
					req.user.removeFromFollowing(req.interactionUser.username, function (response) {
						if(!res) {
							res.status(400).send('Error.');
						}
						else {
							res.send(req.interactionUser.username);
						}
					})
				}
			});
		}
		else {
			res.status(400).send('Not following user');
		}
	},

	block: function (req, res) {
		if(req.user.blocked.indexOf(req.interactionUser.username) == -1) {
			req.user.blockUser(req.interactionUser.username, function (response) {
				if(response) {
					req.interactionUser.addToBlockedBy(req.user.username, function (response) {
						if(response) {
							res.send(req.interactionUser.username);
						}
						else {
							res.status(400).send('Error');
						}
					})
				}
				else {
					res.status(400).send('Error');
				}
			})
		}
		else {
			res.status(400).send('You have already blocked this user');
		}
	},

	unblock: function (req, res) {
		if(req.user.blocked.indexOf(req.interactionUser.username) > -1) {
			req.user.unblockUser(req.interactionUser.username, function (response) {
				if(response) {
					req.interactionUser.removeFromBlockedBy(req.user.username, function (response) {
						if(response) {
							res.send(req.interactionUser.username);
						}
						else {
							res.status(400).send('Error');
						}
					})
				}
				else {
					res.status(400).send('Error');
				}
			})
		}
		else {
			res.status(400).send('You have not blocked this user');
		}
	},

	search: function (req, res) {
		if(req.params.query === ''){ 
			res.status(400).send('Type something to run a search.');
		} 

		var re = new RegExp(req.params.query, 'i');

		User.find({username: re})
		.exec(function(err, users){
            if(err){
                res.status(400).send('Database error');
            }
            else {
            	res.send(users)
            }
        })
	},

	details: function (req, res) {
		res.send(req.interactionUser.details());
	},

	update: function (req, res) {

		if(req.body._id != req.user._id){
			res.status(400).send('You do not have permissions');
		} 
		if(req.body.password){
			req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
		}

		req.user.update(req.body, function (err, user){
			if(err) {
				res.status(400).send('Error')
			}
			else {
				res.send(user);
			}
		})
	},

	//Populates the request with the interacted user
	interactionUser : function (req, res, next) {
		User.findOne({username: req.params.username}).exec(function (err, user) {
			if (!!err) {
				res.status(400);
				res.send(err);
			}
			if(!!user) { 
				req.interactionUser = user;
				next();
			}
			else {
				res.status(400);
				res.send('User not found');
			}
		});
	}
	
}