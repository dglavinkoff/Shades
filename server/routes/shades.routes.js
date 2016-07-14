var auth = require('../controllers/authentication.controller');
var shades = require('../controllers/shades.controller');

module.exports = function (app) {

	app.post('/shades', auth.authenticatedAccess, shades.create);
	app.delete('/shades/:id', auth.authenticatedAccess, shades.interactionShades, shades.delete);
}