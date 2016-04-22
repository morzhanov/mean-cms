/**
 * PAGES ROUTES
 */

var Page = require('../models/page.js');
var config = require('../../config');
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
        .get(function (req, res) {

            return Page.find(function (err, pages) {
                if (!err) {
                    return res.send(pages);
                } else {
                    return res.send(500, err);
                }
            });
        })


        /**
         * Create new page in DB
         */
        .post(function (req, res) {

            var page = new Page({
                title: req.body.title,
                url: req.body.url,
                content: req.body.content,
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
        });

    /**
     * Page routes for /pages/:id reference
     */
    pageRouter.route('/:id')

        /**
         * Get a specific page
         */
        .get(function (req, res) {

            return Page.findById(req.params.id, function (err, page) {
                if (!err) {
                    return res.send(page);
                } else {
                    return res.send(500, err);
                }
            });
        })

        /**
         * update a page
         * id - ID of page
         */
        .put(function (req, res) {
            var id = req.params.id;

            Page.findById(id, function (err, page) {

                //update the pages info only if its new
                if (req.body.title) page.title = req.body.title;
                if (req.body.url) page.url = req.body.url;
                if (req.body.content) page.content = req.body.content;
                if (req.body.posts) page.posts = req.body.posts;
                if (req.body.menuIndex) page.menuIndex = req.body.menuIndex;
                page.date = new Date(Date.now());

                //save the page
                page.save(function (err) {
                    if (err) {
                        res.send(err);
                    }

                    res.send("Page updated");
                });
            });
        })

        /**
         * delete a single page
         */
        .delete(function (req, res) {

            var id = req.params.id;

            Page.remove({
                    _id: id
                },
                function (err) {
                    return console.log(err);
                });
            return res.send('Page id- ' + id + 'has been deleted');
        });

    /**
     * Return pagesRouter to app
     */
    return pageRouter;

};