var auth = require('../controllers/authentication.controller');
var comment = require('../controllers/comments.controller');

module.exports = function (app) {
	
	app.post('/comment', auth.authenticatedAccess, comment.create);
	app.delete('/comment/:id', auth.authenticatedAccess, comment.interactionComment, comment.hasAuthorization, comment.delete);
}