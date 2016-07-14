var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
	type: String,
	startIndex: Number,
	endIndex: Number,
	text: String
})

module.exports = tagSchema;