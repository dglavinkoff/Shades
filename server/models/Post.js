var mongoose = require('mongoose'),
tagSchema = require('./tagSchema');

var Schema = mongoose.Schema;

var postSchema = mongoose.Schema({
	author: String,
	text: String,
	type: String,
	date: {type: Date, default: Date.now},
	image: String,
	video: String,
	tags: [tagSchema],
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

postSchema.methods.addComment = function (id, callback) {
	this.comments.push(id);
	this.save(function (err){
		if(err){
			callback(false);
		}
		else {
			callback(true);
		}
	});
}

postSchema.methods.removeComment = function (id, callback) {
	var indexOfComment = this.comments.indexOf(id);
	if(indexOfComment > -1){
		this.comments.splice(indexOfComment, 1);
		this.save(function (err){
			if(err){
				callback(false);
			}
			else {
				callback(true);
			}
		});
	}
	else callback(false);
}

var Post = mongoose.model('Post', postSchema);