var mongoose = require('mongoose'),
tagSchema = require('./tagSchema');

var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
	author: String,
	text: String,
	date: {type: Date, default: Date.now()},
	tags: [tagSchema],
	image: String,
	post: {type: Schema.Types.ObjectId, ref: 'Post'}
})

mongoose.model('Comment', commentSchema);