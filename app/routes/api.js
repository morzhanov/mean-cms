var mongoose = require('mongoose');
var Page = require('../models/page.js');
var adminUser = require('../models/admin-users.js');
var jwt = require('jsonwebtoken');
var config = require('../../config');

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
        "use strict";

        var id = request.body.id;

        Page.remove({
                _id: id
            },
            function (err) {
                return console.log(err);
            });
        return response.send('Page id- ' + id + 'has been deleted');
    });

    /**
     * displaying a single record
     */
    apiRouter.get('/pages/admin-details/:id', function (request, response) {

        var id = request.body.id;

        Page.findOne({
                _id: id
            },

            function (err, page) {
                if (err) {
                    return console.log(err);
                }
                return response.send(page);

            });
    });

    //return apiRouter to app
    return apiRouter;

};


//    /**
//     * route for authenticating users
//     */
//    apiRouter.post('/authenticate', function (req, res) {
//        //find the user
//        User.findOne(
//            {
//                username: req.body.username
//            })
//            .select('name username password').exec(function (err, user) {
//            if (err) throw err;
//
//            //no user with that username was found
//            if (!user) {
//                res.json(
//                    {
//                        success: false,
//                        message: 'Authentication failed. User not found'
//                    });
//            }
//            else if (user) {
//                //check if passwords matches
//                var validPassword = user.comparePassword(req.body.password);
//                if (!validPassword) {
//                    res.json(
//                        {
//                            success: false,
//                            message: 'Authentication failed. Wrong password.'
//                        });
//                }
//                else {
//                    // if user is found and password is right
//                    // create a token
//                    var token = jwt.sign(
//                        {
//                            name: user.name,
//                            username: user.username
//                        }, secret, {
//                            expiresInMinutes: 1440       //expires in 24 hours
//                        });
//
//                    //return the information including token as JSON
//                    res.json(
//                        {
//                            success: true,
//                            message: 'Enjoy your token!',
//                            token: token
//                        });
//                }
//            }
//        });
//    });
//
////route middleware to verify a token
//    apiRouter.use(function (req, res, next) {
//        //check header or url params or post params for token
//        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//
//        //decode token
//        if (token) {
//
//            console.log('token is avaliable');
//
//            //verify secret and checks exp
//            jwt.verify(token, secret, function (err, decoded) {
//                if (err) {
//                    return res.status(403).send(
//                        {
//                            success: false,
//                            message: 'Failed to authenticate token.'
//                        });
//                }
//                else {
//
//                    //if everithing is good, save to request for use in other routes
//                    req.decoded = decoded;
//
//                    next();
//                }
//            });
//        }
//        else {
//            //if there is no token
//            // return an HTTP response of 403 (access forbidden) and an error message
//            return res.status(403).send(
//                {
//                    success: false,
//                    message: 'No token provided.'
//                });
//        }
//    });
//
////on routes that end in /users
//    apiRouter.route('/users')
//        //create a user (accessed at POST http://localhost:8080/api/users)
//        .post(function (req, res) {
//            //create new instance of User model
//            var user = new User();
//
//            //set the user information (comes from request)
//            user.name = req.body.name;
//            user.username = req.body.username;
//            user.password = req.body.password;
//
//            //save the user and check for errors
//            user.save(function (err) {
//                if (err) {
//                    //duplicate entry
//                    if (err.code == 11000) {
//                        return res.json({success: false, message: 'A user with that username already exists'});
//                    }
//                    else {
//                        return res.send(err);
//                    }
//                }
//                res.json({message: 'User created!'});
//            })
//        })
//
//        //get all the users (accessed at GET http://localhost:8080/api/users)
//        .get(function (req, res) {
//            User.find(function (err, users) {
//                //return the users
//                res.json(users);
//            })
//        });
//
////on routes that end in /users/:user_id
//    apiRouter.route('/users/:user_id')
//
//        //get user with that user id
//        //accessed at GET http://localhost:8080/api/users/:user_id
//        .get(function (req, res) {
//            User.findById(req.params.user_id, function (err, user) {
//                if (err) {
//                    res.send(err);
//                }
//
//                res.json(user);
//            })
//        })
//
//        //update the user with that id
//        //accessed at PUT http://localhost:8080/api/users/:user_id
//        .put(function (req, res) {
//
//            //use our model to find the user we want
//            User.findById(req.params.user_id, function (err, user) {
//                if (err) {
//                    res.send(err);
//                }
//
//                //update the users info only if its new
//                if (req.body.name) user.name = req.body.name;
//                if (req.body.username) user.username = req.body.username;
//                if (req.body.password) user.password = req.body.password;
//
//                //save the user
//                user.save(function (err) {
//                    if (err) {
//                        res.send(err);
//                    }
//
//                    res.json({message: 'User updated!'});
//                })
//            })
//        })
//
//        //delete the user with this id
//        //accessed at DELETE http://localhost:8080/api/users/:user_id
//
//        .delete(function (req, res) {
//            User.remove({
//                    _id: req.params.user_id
//                },
//                function (err, user) {
//                    if (err) {
//                        res.sern(err);
//                    }
//
//                    res.json({message: "Successfully deleted!"});
//                })
//        });
//
//    /**
//     * test router
//     */
//    apiRouter.get('/', function (req, res) {
//        res.json({message: 'welcome to our api!'});
//    });
//
//// api endpoint to get user information
//    apiRouter.get('/me', function (req, res) {
//        res.send(req.decoded);
//    });