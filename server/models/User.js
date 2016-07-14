var mongoose = require('mongoose'),
bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username: {type: String, index: true, required: true},
	fullname: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	following: [String],
	followers: [String],
	blocked: [String],
	blockedBy: [String],
	shades: [{type: mongoose.Schema.Types.ObjectId, ref: 'Shades'}],
	bio: String,
	auth_token: String,
	devices: [{device_token: String}]
})

userSchema.methods.hashPassword = function(){
  	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
};

userSchema.methods.authenticate = function (password) {
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.addDevice = function (device_token, callback) {
	var currentDate = Date.now();
	if(this.devices.map(function(device){return device.device_token}).indexOf(device_token) == -1) {
		this.devices.push({device_token: device_token});						
		this.save(function(err, user){
			if(err) callback(false);
			else{
				callback(true);
			}  
		})
	}
	else {
		callback(true);
	}	
}

userSchema.methods.removeDevice = function (device_token, callback) {

	var indexOfTokenPair = this.devices.map(function(token){return token.device_token}).indexOf(device_token);
	
	this.devices.splice(indexOfTokenPair, 1);
	
	this.save(function (err) {
		if(!err) callback(true);
		else callback(false);
	});
}

userSchema.methods.addShades = function (id, callback) {
	this.shades.push(id);
	this.save(function (err) {
		if(err) {
			callback(false);
		}
		else {
			callback(true);
		}
	});
}

userSchema.methods.removeShades = function (id, callback) {
	var index = this.shades.map(function (shades) {
		return shades._id
	}).indexOf(id);

	if (index > -1) {
		this.shades.splice(index, 1);
	};
	this.save(function (err) {
		if(err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.addFollower = function (id, callback) {
	
	this.followers.push(id);
	this.save(function (err) {
		if(err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.removeFollower = function (id, callback) {
	if(this.followers.indexOf(id) > -1) {
		this.followers.splice(this.followers.indexOf(id), 1);
	}
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.addToFollowing = function (id, callback) {

	this.following.push(id);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.removeFromFollowing = function (id, callback) {
	this.following.splice(this.followers.indexOf(id), 1);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.blockUser = function (id, callback) {	
	this.blocked.push(id);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.unblockUser = function (id, callback) {
	this.blocked.splice(this.blocked.indexOf(id), 1);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.addToBlockedBy = function (id, callback) {
	this.blockedBy.push(id);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.removeFromBlockedBy = function (id, callback) {
	this.blockedBy.splice(this.blockedBy.indexOf(id), 1);
	this.save(function (err) {
		if(!!err) {
			callback(false);
		}
		else {
			callback(true);
		}
	})
}

userSchema.methods.details = function () {
	return {
		username: this.username,
		fullname: this.fullname,
		bio: this.bio
	}
}

userSchema.statics.usernameExists = function (username) {
	this.findOne({username: username}).exec(function (err, user) {
		return !!user;
	});
}

mongoose.model('User', userSchema);