/**
 * PAGES ROUTES
 */

var Page = require('../models/page.js');
var Post = require('../models/post.js');
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
     * For posts routes with reference (/api/pages/:id/posts)
     */
    pageRouter.route('/:id/posts/')
        /**
         * Get all posts of specific page
         */
        .get(function (req, res) {

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
        /**
         * Create new post in DB and add it to this page's posts array
         * id - ID of page
         */
        .post(function (request, response) {

            var page = new Page({
                title: request.body.title,
                url: request.body.url,
                contentFooter: request.body.contentFooter,
                contentHeader: request.body.contentHeader,
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
     * For posts routes with reference (/api/pages/:id/posts/:id)
     */
    pageRouter.route('/:page_id/posts/:post_id')

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
        .delete(function (req, res) {

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

        });

    /**
     * Return pagesRouter to app
     */
    return pageRouter;

};