var config = require('./server/config/config'),
mongoose = require('./server/config/mongoose')(config),
express = require('express'),
app = express(),
server = app.listen(config.port),
io  = require('socket.io').listen(server),
newsFeedSocket = require(config.rootPath + 'server/sockets/newsFeed.socket')(io),
chatSocket = require(config.rootPath + 'server/sockets/chat.socket')(io),
auth = require(config.rootPath + 'server/controllers/authentication.controller');

require(config.rootPath + 'server/config/express')(app, config);
require(config.rootPath + 'server/routes/user.routes')(app);
require(config.rootPath + 'server/routes/post.routes')(app);
require(config.rootPath + 'server/routes/message.routes')(app, chatSocket);
require(config.rootPath + 'server/routes/shades.routes')(app);
require(config.rootPath + 'server/routes/comment.routes')(app);

app.get('/partials/:partialArea/:partialName', function (req, res) {
	res.render('../../public/partials/' + req.params.partialArea + '/' + req.params.partialName);
})

//Default route
app.get('*', auth.checkDeviceToken,  auth.unauthenticatedAccess,  function (req, res) {
	res.render('index', {currentUser: req.user});
})

console.log('Server listenning on port ' + config.port);