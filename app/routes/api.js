/**
 * API ROUTES
 */

var mongoose = require('mongoose');
var User = require('../models/user.js');
var passport = require('passport');
var config = require('../../config');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');
var fs = require('fs');
var request = require('request');
var formidable = require('formidable');
var im = require('imagemagick');

var secret = config.secret;

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var apiRouter = express.Router();

    /**
     * go to API zone
     */
    apiRouter.get('/', function (req, res) {
        res.send('Welcome to the API zone');
    });

    /**
     * Route for authenticating users
     */
    apiRouter.post('/authenticate', function (req, res) {

        //find the user
        User.findOne(
            {
                username: req.body.username
            })
            .select('name username password').exec(function (err, user) {
            if (err) throw err;

            //no user with that username was found
            if (!user) {
                res.json(
                    {
                        success: false,
                        message: 'Authentication failed. User not found'
                    });
            }
            else if (user) {
                //check if passwords matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json(
                        {
                            success: false,
                            message: 'Authentication failed. Wrong password.'
                        });
                }
                else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(
                        {
                            firstName: user.firstName,
                            secondName: user.secondName,
                            email: user.email,
                            username: user.username
                        }, secret, {
                            expiresInMinutes: 1440       //expires in 24 hours
                        });

                    //return the information including token as JSON
                    res.json(
                        {
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                }
            }
        });
    });

    // Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
    passport.use(new FacebookStrategy({
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_SECRET,
            callbackURL: 'http://localhost:8080/login/facebook/return'
        },
        function (accessToken, refreshToken, profile, cb) {
            // In this example, the user's Facebook profile is supplied as the user
            // record.  In a production-quality application, the Facebook profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.
            return cb(null, profile);
        }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    apiRouter.use(passport.initialize());

    apiRouter.get('/login/facebook',
        // authenticate with facebook
        passport.authenticate('facebook'));

    apiRouter.get('/login/facebook/return',
        passport.authenticate('facebook', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });

    /**
     * Route middleware to verify a token
     */
    apiRouter.use(function (req, res, next) {

        if (req.path === '/authenticate')
            next();

        //check header or url params or post params for token
        var token = req.body.token || req.query.token || req.param('token') || req.headers['x-access-token'];

        //decode token
        if (token) {

            console.log('token is available');

            //verify secret and checks exp
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    return res.status(403).send(
                        {
                            success: false,
                            message: 'Failed to authenticate token.'
                        });
                }
                else {

                    //if everithing is good, save to request for use in other routes
                    req.decoded = decoded;

                    next();
                }
            });
        }
        else {

            if (req.path == '/user/' && req.method == 'POST' || req.path.indexOf('/login/facebook') > -1) {
                console.log('This\'s sing up request');

                next();
            }
            else
            //if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
                return res.status(403).send(
                    {
                        success: false,
                        message: 'No token provided.'
                    });
        }
    });


    apiRouter.route('/upload/image/user')
        .post(function (req, res) {
            var form = new formidable.IncomingForm();

            var currentUser;

            form.parse(req, function (err, fields, files) {
                var photoData = fields['photo[data]'];
                var imageType = fields['photo[type]'];

                User.findById(fields['photo[userId]'], function (err, user) {
                    currentUser = user;
                    /// If there's an error

                    var photoPath = "./public/assets/img/users-photos/"
                        + currentUser.username
                        + imageType;

                    //photoData = photoData.replace(/^data:image\/png|jpeg|jpg|gif;base64,/, "");

                    var base64Data = photoData.substring(
                        photoData.indexOf(',') + 1
                    );

                    fs.writeFile(photoPath, base64Data, 'base64', function (err) {
                        if (err)
                            console.log(err);
                        else {

                            photoPath = "assets/img/users-photos/"
                                + currentUser.username
                                + imageType;

                            if (currentUser.photo != photoPath && currentUser.photo != undefined) {
                                /**
                                 * delete user photo with old extension
                                 */
                                fs.unlink(user.photo);
                            }

                            currentUser.photo = photoPath;

                            currentUser.save(function (err) {
                                if (err) {
                                    res.send(err);
                                }
                                res.send(202);
                            });
                        }
                    });
                });
            });
        });

    /**
     * API endpoint to get user information
     */
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    apiRouter.use(function (req, res, next) {

        var currentRole;

        /**
         * admin middleware
         */
        User.findOne({'username': req.decoded.username}, function (err, user) {
            if (err) {
                return console.log(err);
            }

            if (user === undefined)
                res.status(403).send();

            currentRole = user.role;

            if (req.path.indexOf('/admin') > -1 && currentRole != 'admin')
                return res.status(423).send(
                    {
                        success: false,
                        message: 'You\'re not admin.'
                    });

            next();

        });
    });

    apiRouter.route('/admin')
        .get(function (req, res) {
            res.send(200);
        });


    /**
     * Return apiRouter to app
     */
    return apiRouter;

};