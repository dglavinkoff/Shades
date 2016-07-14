var path = require('path'),
rootPath = path.normalize(__dirname + '/../../');

module.exports = {
	db: 'mongodb://admin2:123qwe@ds027505.mlab.com:27505/shades',
	//db: 'mongodb://localhost/shades',
	rootPath: rootPath,
	port: process.env.PORT || 3000
}