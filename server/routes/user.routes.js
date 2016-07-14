var auth = require('../controllers/authentication.controller');
var profile = require('../controllers/profile.controller');

module.exports = function (app) {

	//Authentication routes
	app.post('/user/signin', auth.signin);
	app.get('/user/signout', auth.authenticatedAccess, auth.signout);

	//Profile routes
	app.post('/user', profile.signup);
	app.get('/user/:username', auth.authenticatedAccess, profile.interactionUser, profile.details);
	app.get('/user/follow/:username', auth.authenticatedAccess, profile.interactionUser, profile.follow);
	app.get('/user/unfollow/:username', auth.authenticatedAccess, profile.interactionUser, profile.unfollow);
	app.get('/user/block/:username', auth.authenticatedAccess, profile.interactionUser, profile.block);
	app.get('/user/unblock/:username', auth.authenticatedAccess, profile.interactionUser, profile.unblock);
	app.get('/user/search/:query', auth.authenticatedAccess, profile.search);
	app.put('/user', auth.authenticatedAccess, profile.update);
}