var mongoose = require('mongoose');
var Page = require('../models/page.js');
var User = require('../models/user.js');
var config = require('../../config');
var fs = require('fs');
var formidable = require('formidable');

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var postRouter = express.Router();

    /**
     * POST ROUTES
     */

    /**
     * Post routes for /posts/ reference
     */
    postRouter.route('/')
        /**
         * Get all posts
         */
        .get(function (request, response) {

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
    postRouter.get('/posts/:id', function (request, response) {

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
    postRouter.get('/post/:id', function (request, response) {

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
    postRouter.post('/post/add/:id', function (request, response) {

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
    postRouter.post('/post/update/:id', function (request, response) {
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
    postRouter.get('/posts/delete/:id', function (request, response) {

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
    postRouter.get('/post/delete/:id', function (request, response) {

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
     * Return apiRouter to app
     */
    return postRouter;

};