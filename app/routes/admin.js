/**
 * Admin dashboard management routes
 */

//add dependencies
var mongoose = require('mongoose');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Page = require('../models/page.js');
var config = require('../../config');
var fs = require('fs');
var request = require('request');
var formidable = require('formidable');
var im = require('imagemagick');
var passport = require('passport');
var jwt = require('jsonwebtoken');

//secret for jwt encryption
var secret = config.secret;

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var apiRouter = express.Router();


    /***********************************************************************************************
     *
     * Main Admin Routes (/admin, /admin/login, /admin/dashboard)
     *
     ************************************************************************************************/

    // POST Login route
    apiRouter.post('/login', function (req, res) {

        var reqUser = req.body.user;

        //find the user
        User.findOne(
            {
                email: reqUser.email
            }, function (err, dbUser) {
                if (err) throw err;

                //no user with that username was found
                if (!dbUser) {
                    res.json(
                        {
                            success: false,
                            message: 'Authentication failed. User not found'
                        });
                }
                else if (dbUser) {
                    //check if passwords matches
                    var validPassword = dbUser.comparePassword(reqUser.password);
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
                                name: dbUser.firstName,
                                surname: dbUser.secondName,
                                email: dbUser.email
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

    // POST SignUp route
    apiRouter.post('/signup', function (req, res) {

        //get user data from request
        var reqUser = req.body.user;

        //create new instance of User model
        var newUser = new User();

        //set the user information (comes from request)
        newUser.name = reqUser.name;
        newUser.surname = reqUser.surname;
        newUser.email = reqUser.email;
        newUser.site = reqUser.site;
        newUser.password = reqUser.password;

        newUser.token = jwt.sign(
            {
                name: newUser.firstName,
                surname: newUser.secondName,
                email: newUser.email
            }, secret, {
                expiresInMinutes: 1440       //expires in 24 hours
            });

        //save the user and check for errors
        newUser.save(function (err) {
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

    });

    //Middleware to validate token
    apiRouter.use(function (req, res, next) {

        //check header or url params or post params for token
        var token = req.body.access_token ||
            req.query.access_token ||
            req.param('access_token') ||
            req.headers['x-access-token'];

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

                    //if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        }

        else
        //if there is no token
        // return an HTTP response of 403 (access forbidden) and an error message
        {
            return res.status(403).send(
                {
                    success: false,
                    message: 'No token provided.'
                });
        }

    });


    // GET Main Admin route
    apiRouter.get('/dashboard', function (req, res) {

        res.json({message: 'To dashboard!'});

    });

    // GET Current admin user route
    apiRouter.get('/me', function (req, res) {

        User.findById(req.decoded.id, function (err, user) {
            if (err) {
                res.send(err);
            }

            res.json(user);
        })

    });

    /***********************************************************************************************
     *
     * Admin PAGE Routes (/admin/pages/, /admin/pages/posts ...)
     *
     ***********************************************************************************************/

    //GET All Pages
    apiRouter
        .get('/pages', function (req, res) {

            return Page.find(function (err, pages) {
                if (!err) {
                    return res.send(pages);
                } else {
                    return res.send(500, err);
                }
            });
        })
        //Create New page
        .post('/pages', function (req, res) {

            var page = new Page({
                title: req.body.title,
                url: req.body.url,
                contentHeader: req.body.contentHeader,
                contentFooter: req.body.contentFooter,
                posts: req.body.posts,
                menuIndex: req.body.menuIndex,
                date: new Date(Date.now())
            });


            page.save(function (err) {
                if (!err) {
                    return res.send(200, page);
                }
                else {
                    return res.send(500, err);
                }
            });
        })

        //GET Single Page
        .get("/pages/:id", function (req, res) {

            return Page.findById(req.params.id, function (err, page) {
                if (!err) {
                    return res.send(page);
                } else {
                    return res.send(500, err);
                }
            });
        })

        //Update a page
        .put("/pages/:id", function (req, res) {
            var id = req.params.id;

            Page.findById(id, function (err, page) {

                //update the pages info only if its new
                if (req.body.title) page.title = req.body.title;
                if (req.body.url) page.url = req.body.url;
                if (req.body.contentHeader) page.contentHeader = req.body.contentHeader;
                if (req.body.contentFooter) page.contentFooter = req.body.contentFooter;
                if (req.body.posts) page.posts = req.body.posts;
                if (req.body.menuIndex) page.menuIndex = req.body.menuIndex;
                page.date = new Date(Date.now());

                //save the page
                page.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.send("Page updated");
                });
            });
        })

        //Delete a single page
        .delete("/pages/:id", function (req, res) {

            var id = req.params.id;

            Page.remove({
                    _id: id
                },
                function (err) {
                    return console.log(err);
                });
            return res.send('Page id- ' + id + 'has been deleted');
        })

        /**
         * For posts routes with reference (/admin/pages/:id/posts)
         */

        //Get all posts of specific page
        .get('/pages/:id/posts/', function (req, res) {

            var page_id = req.params.id;

            return Page.findById(page_id, function (err, page) {
                if (err) {
                    return res.send(err);
                } else {

                    var allPosts = [];

                    Post.find({_id: {$in: page.posts}}, function (err, posts) {

                        if (err)
                            res.send(err);
                        else
                            res.send(posts);

                    });
                }
            });
        })

        //Create new post in DB and add it to this page's posts array
        .post('/pages/:id/posts/', function (req, res) {

            var page = new Page({
                title: req.body.title,
                url: req.body.url,
                contentFooter: req.body.contentFooter,
                contentHeader: req.body.contentHeader,
                menuIndex: req.body.menuIndex,
                date: new Date(Date.now())
            });

            page.save(function (err) {
                if (!err) {
                    return res.send(200, page);
                }
                else {
                    return res.send(500, err);
                }
            });
        })

        //delete all posts from page's posts array
        .delete(function (request, response) {

        })

        /**
         * For posts routes with reference (/api/pages/:id/posts/:id)
         */

        //Get single post of page
        .get('/pages/:page_id/posts/:post_id', function (request, response) {

            return Page.find(function (err, pages) {
                if (!err) {
                    return response.send(pages);
                } else {
                    return response.send(500, err);
                }
            });
        })

        //delete a single post from specific page
        .delete('/pages/:page_id/posts/:post_id', function (req, res) {

            Page.findById(req.params.page_id, function (err, page) {
                if (err)
                    res.send(err);
                else {
                    Post.findById(req.params.post_id, function (err, post) {
                        if (err)
                            res.send(err);
                        else {
                            page.posts.splice(page.posts.indexOf(post._id), 1);

                            page.save(function (err) {
                                if (!err) {
                                    return res.send(200);
                                }
                                else {
                                    return res.send(500, err);
                                }
                            });
                        }
                    })
                }
            })

        })


        /***********************************************************************************************
         *
         * Admin Posts Routes
         *
         * ********************************************************************************************/

        //Get all posts
        .get('/posts/', function (request, response) {

            return Post.find(function (err, posts) {
                if (!err) {
                    return response.send(posts);
                } else {
                    return response.send(500, err);
                }
            });
        })

        //Create new post in DB
        .post('/posts/', function (request, response) {

            var post = new Post({
                title: request.body.title,
                content: request.body.content,
                date: new Date(Date.now())
            });

            post.save(function (err) {
                if (!err) {
                    return response.send(200, post);
                }
                else {
                    return response.send(500, err);
                }
            });
        })

        //Get single post
        .get('/posts/:id', function (request, response) {

            return Post.findById(request.params.id, function (err, post) {
                if (!err) {
                    return response.send(post);
                } else {
                    return response.send(500, err);
                }
            });
        })

        //Update a post
        .put('/posts/:id', function (request, response) {
            var id = request.params.id;

            Post.update(
                {
                    _id: id
                },
                {
                    $set: {
                        title: request.body.title,
                        content: request.body.content,
                        date: new Date(Date.now())
                    }
                }).exec();
            response.send("Post updated");
        })

        //Delete a single post
        .delete('/posts/:id', function (request, response) {

            var id = request.params.id;

            Post.remove({
                    _id: id
                },
                function (err) {
                    return console.log(err);
                });
            return response.send('Post id- ' + id + 'has been deleted');
        })

        /***********************************************************************************************
         *
         * Admin Users Routes
         *
         * ********************************************************************************************/

        //create a user
        .post('/users/', function (req, res) {
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

        //get all the users
        .get('/users/', function (req, res) {
            User.find(function (err, users) {
                //return the users
                res.json(users);
            })
        })

        //GET user with that user id
        .get('/users/:id', function (req, res) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    res.send(err);
                }

                res.json(user);
            })
        })

        //UPDATE user with that id
        .put('/users/:id', function (req, res) {

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

        //DELETE user with this id
        .delete('/users/:id', function (req, res) {
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


    //Return apiRouter to app
    return apiRouter;

};