var post = require('../controllers/posts.controller');
var auth = require('../controllers/authentication.controller');
var multipart = require('connect-multiparty');
var middleware = multipart();

module.exports = function (app) {

	app.post('/post', auth.authenticatedAccess, middleware, post.create);
	app.delete('/post/:id', auth.authenticatedAccess, post.interactionPost, post.delete);

}