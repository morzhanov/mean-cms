var mongoose = require('mongoose');
var Page = require('../models/page.js');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config');
var Image = require('../models/image.js');
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

    apiRouter.get('/image', function (req, res) {
        var image = new Image();

        //image.img.data = fs.readFileSync(imgPath);

        image.img.url = "assets/img/users-photos/mary.jpg";

        image.save(function (err, a) {
            if (err) throw err;

            var imgRes = Image.findById(a, function (err, doc) {
                if (err) return next(err);

                //send image to frontend
                res.send(doc.img.url);
            });
        });
    });

    /**
     * Get all pages
     */
    apiRouter.get('/pages', function (request, response) {

        return Page.find(function (err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

    /**
     * Create new page in DB
     */
    apiRouter.post('/page/add', function (request, response) {

        var page = new Page({
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        });


        page.save(function (err) {
            if (!err) {
                return response.send(200, page);
            }
            else {
                return response.send(500, err);
            }
        });
    });

    /**
     * update a page
     */
    apiRouter.post('/pages/update', function (request, response) {
        var id = request.body._id;

        Page.update(
            {
                _id: id
            },
            {
                $set: {
                    title: request.body.title,
                    url: request.body.url,
                    content: request.body.content,
                    menuIndex: request.body.menuIndex,
                    date: new Date(Date.now())
                }
            }).exec();
        response.send("Page updated");
    });

    /**
     * delete a single page
     */
    apiRouter.get('/pages/delete/:id', function (request, response) {

        var id = request.params.id;

        Page.remove({
                _id: id
            },
            function (err) {
                return console.log(err);
            });
        return response.send('Page id- ' + id + 'has been deleted');
    });

    /**
     * Get single page details
     */
    apiRouter.get('pages/details/:url', function (req, res) {
        var url = request.params.url;

        Page.findOne({
            url: url
        }, function (err, page) {
            if (err)
                return console.log(err);
            return response.send(page);
        });
    });

    /**
     * Get all posts
     */
    apiRouter.get('/posts', function (request, response) {

        return Page.find(function (err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

    /**
     * Get all posts of curtain page
     */
    apiRouter.get('/posts/:id', function (request, response) {

        return Page.find(function (err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

    /**
     * Get single post
     */
    apiRouter.get('/post/:id', function (request, response) {

        return Page.find(function (err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

    /**
     * Create new post in DB
     * id - ID of page
     */
    apiRouter.post('/post/add/:id', function (request, response) {

        var page = new Page({
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        });

        page.save(function (err) {
            if (!err) {
                return response.send(200, page);
            }
            else {
                return response.send(500, err);
            }
        });
    });

    /**
     * update a post
     * id - ID of post
     */
    apiRouter.post('/post/update/:id', function (request, response) {
        var id = request.body._id;

        Page.update(
            {
                _id: id
            },
            {
                $set: {
                    title: request.body.title,
                    url: request.body.url,
                    content: request.body.content,
                    menuIndex: request.body.menuIndex,
                    date: new Date(Date.now())
                }
            }).exec();
        response.send("Page updated");
    });

    /**
     * delete all posts of page
     * id - ID of page
     */
    apiRouter.get('/posts/delete/:id', function (request, response) {

        var id = request.params.id;

        Page.remove({
                _id: id
            },
            function (err) {
                return console.log(err);
            });
        return response.send('Page id- ' + id + 'has been deleted');
    });

    /**
     * delete a single post
     * id - ID of post
     */
    apiRouter.get('/post/delete/:id', function (request, response) {

        var id = request.params.id;

        Page.remove({
                _id: id
            },
            function (err) {
                return console.log(err);
            });
        return response.send('Page id- ' + id + 'has been deleted');
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

    apiRouter.get('/login', function (req, res) {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        if (token)
            res.redirect("/");
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

    /**
     * Route middleware to verify a token
     */
    apiRouter.use(function (req, res, next) {
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

    /**
     * Router for simple Users
     * On routes that end in /user
     */
    apiRouter.route('/user')

        //create a user (accessed at POST http://localhost:8080/api/users)
        .post(function (req, res) {
            //create new instance of User model
            var user = new User();

            //set the user information (comes from request)
            user.firstName = req.body.firstName;
            user.secondName = req.body.secondName;
            user.email = req.body.email;
            user.site = req.body.site;
            user.role = "user";
            user.image = req.body.image;
            user.username = req.body.username;
            user.password = req.body.password;

            //save the user and check for errors
            user.save(function (err) {
                if (err) {
                    //duplicate entry
                    if (err.code == 11000) {
                        return res.json({success: false, message: 'A user with that username already exists'});
                    }
                    else {
                        return res.send(err);
                    }
                }
                res.json({message: 'User created!'});
            })
        })

        //get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {
            User.find(function (err, users) {
                //return the users
                res.json(users);
            })
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
     * On routes that end in /user/:id
     */
    apiRouter.route('/user/:id')

        //get user with that user id
        //accessed at GET http://localhost:8080/api/user/:id
        .get(function (req, res) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    res.send(err);
                }

                res.json(user);
            })
        })

        //update the user with that id
        //accessed at PUT http://localhost:8080/api//user/:id
        .put(function (req, res) {

            var currentUser;

            User.findById(req.params.id, function (err, user) {
                currentUser = user;

                //update the users info only if its new
                if (req.body.firstName) user.firstName = req.body.firstName;
                if (req.body.secondName) user.secondName = req.body.secondName;
                if (req.body.email) user.email = req.body.email;
                if (req.body.site) user.site = req.body.site;
                if (req.body.role) user.role = req.body.role;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

                //save the user
                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({message: 'User updated!'});
                });
            })
        })

        //delete the user with this id
        //accessed at DELETE http://localhost:8080/api/user/:id
        .delete(function (req, res) {
            User.remove({
                    _id: req.params.id
                },
                function (err, user) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({message: "Successfully deleted!"});
                })
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

}