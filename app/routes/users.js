/**
 * USERS ROUTES
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var Page = require('../models/page.js');
var User = require('../models/user.js');
var config = require('../../config');
var fs = require('fs');
var request = require('request');
var formidable = require('formidable');
var im = require('imagemagick');

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var userRouter = express.Router();

    /**
     * Router for simple Users
     * On routes that end in /users
     */
    userRouter.route('/')

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

    /**
     * On routes that end in /users/:id
     */
    userRouter.route('/:id')

        //get user with that user id
        //accessed at GET http://localhost:8080/api/users/:id
        .get(function (req, res) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    res.send(err);
                }

                res.json(user);
            })
        })

        //update the user with that id
        //accessed at PUT http://localhost:8080/api//users/:id
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
        //accessed at DELETE http://localhost:8080/api/users/:id
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
     * Return userRouter to app
     */
    return userRouter;

};
