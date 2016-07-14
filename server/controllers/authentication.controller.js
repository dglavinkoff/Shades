var q = require('q');
var uuid = require('node-uuid');
var User = require('mongoose').model('User');

module.exports = {
	signin: function (req, res) {
		passCheck(req.body.username, req.body.password).then(function success (user) {
			//Adds the device to the user's device list and if successful, sends the user info to the client
			user.addDevice(req.cookies.device_token, function (success) {
				if(success){
					if(req.cookies.rememberMe){
						res.cookie('auth_token', user.auth_token, {expires: passCheckResult.currentDate.getFullYear + 1});
						res.send(user);
					}
					else {
						res.cookie('auth_token', user.auth_token);
						res.send(user);
					}
				}
				else {
					res.status(400).send('An error occured. Please try again later.');
				}
			});
		}, function error (reason) {
			res.status(400).send(reason);
		});		
	},

	signout: function (req, res) {
		req.user.removeDevice(req.cookies.device_token, function (success) {
			if(success) {
				res.clearCookie('auth_token');
				res.send(true);
			}
			else {
				res.status(400).send('An error occured. Please try again later.');
			}
		})

	},

	authenticatedAccess: function (req, res, next) {
		if(req.cookies.auth_token){
			User.findOne({auth_token: req.cookies.auth_token})
			.populate('shades')
			.exec(function (err, user) {
				if(!!user){
					req.user = user;
					next();						
				}
				else {
					res.status(400).send('Error');
				}
			})
		}		
		else{
			res.status(401).send('Not authorized');
		}		
	},

	unauthenticatedAccess: function (req, res, next){
		if(req.cookies.auth_token){
			User.findOne({auth_token: req.cookies.auth_token})
			.populate('shades')
			.exec(function (err, user) {
				if(!!err) {
					res.status(400).send('Error');
				}
				if(!!user){
					req.user = user;
					next();
				}
			})
		}
		else next();		
	},

	checkDeviceToken: function (req, res, next) {
		if(!req.cookies.device_token){
			res.cookies = {};
			res.cookie('device_token', uuid.v4(), {expires: new Date(Date.now() + 3600 * 1000 * 24 * 365 * 3)});
		}
		next();
	}

}

function passCheck  (username, password) {

	var deferred = q.defer();

	User.findOne({username: username}).populate('shades').exec(function (err, user) {
		if(err){
			deferred.reject(err);
		}
		if(!user){
			deferred.reject('User does not exist');
		}
		else{			
			if(user.authenticate(password)){
				deferred.resolve(user);
			}
			else{
				deferred.reject('Wrong password');
			}
		}
	})

	return deferred.promise;
}