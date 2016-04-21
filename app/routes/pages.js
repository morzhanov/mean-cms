/**
 * PAGES ROUTES
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
    var pageRouter = express.Router();

    /**
     * Page routes for /pages/ reference
     */
    pageRouter.route('/')

        /**
         * Get all pages
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
         * Create new page in DB
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
        });

    /**
     * Page routes for /pages/:id reference
     */
    pageRouter.route('/:id')

        /**
         * Get a specific page
         */
        .get(function (request, response) {

            return Page.findById(req.params.id, function (err, page) {
                if (!err) {
                    return response.send(page);
                } else {
                    return response.send(500, err);
                }
            });
        })

        /**
         * update a page
         * id - ID of page
         */
        .put(function (request, response) {
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
        })

        /**
         * delete a single page
         */
        .delete(function (request, response) {

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
     * Return pagesRouter to app
     */
    return pageRouter;

};