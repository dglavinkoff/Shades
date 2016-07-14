var mongoose = require('mongoose'),
tagSchema = require('./tagSchema');

var Schema = mongoose.Schema;

var messageSchema = mongoose.Schema({
	sender: String,
	receiver: String,
	text: String,
	tags: [tagSchema],
	image: String,
	date: {type: Date, default: Date.now}
})

mongoose.model('Message', messageSchema);