var express = require('express'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session');

module.exports = function(app, config){
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({ secret: "shades"}));
    app.use(express.static(config.rootPath + '/public'));
};