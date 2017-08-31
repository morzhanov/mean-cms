/**
 * Main NodeJS server application file
 */

//Import all required packages
var express = require('express');
var app = express();
var path = require('path');
var config = require('../config');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

/**
 * use body-parser so we can grab information from POST requets
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * configure our app to handle CORS requests
 */
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
    next();
});

/**
 * log all requests to console
 */
app.use(morgan('dev'));

/**
 * connect to mongoose
 */
mongoose.connect(config.database);

//set static files location
//user for requests that our frontend will make
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());

//Router Middlewares
var apiRoutes = require('./app/routes/admin')(app, express);
var pageRoutes = require('./app/routes/pages')(app, express);
var postRoutes = require('./app/routes/posts')(app, express);
var userRoutes = require('./app/routes/users')(app, express);

//Admin routers
app.use('/api/admin', apiRoutes);

//Public routers
app.use('/pages', pageRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

//MAIN CATCHHALL ROUTE
//SEND USERS TO FRONTEND
//has to be registered after API ROUTES
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

/**
 * START THE SERVER
 */
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
