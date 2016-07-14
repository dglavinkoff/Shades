var auth = require('../controllers/authentication.controller');
var message = require('../controllers/messages.controller');

module.exports = function (app, chatSocket) {
	
	app.post('/messages', auth.authenticatedAccess, function (req, res) {
		message.create(req, res, chatSocket);
	});
	app.delete('/messages/:id', auth.authenticatedAccess, function (req, res) {
		message.delete(req, res, chatSocket)
	});
}