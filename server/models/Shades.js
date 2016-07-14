var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shadesSchema = mongoose.Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	filterByPeople: [String],
	filterByType: [String],
	description: String,
	name: String
})

mongoose.model('Shades', shadesSchema);