/**
 * SPECIFIC PAGE POSTS ROUTES
 */

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
    var pagePostsRouter = express.Router();

    /**
     * For posts routes with reference (/api/page/:id/posts)
     */
    pagePostsRouter.route('/')
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
        })
        /**
         * Create new post in DB and add it to this page's posts array
         * id - ID of page
         */
        .post(function (request, response) {

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
        })
        /**
         * delete all posts from page's posts array
         * id - ID of post
         */
        .delete(function (request, response) {

        });

    /**
     * For posts routes with reference (/api/page/:id/posts/:id)
     */
    pagePostsRouter.route('/:id')

        /**
         * Get single post of specific page
         */
        .get(function (request, response) {

            return Page.find(function (err, pages) {
                if (!err) {
                    return response.send(pages);
                } else {
                    return response.send(500, err);
                }
            });
        })

        /**
         * delete a single post from specific page
         * id - ID of post
         */
        .delete(function (request, response) {

        });

    /**
     * Return pageRouter to app
     */
    return pagePostsRouter;

};