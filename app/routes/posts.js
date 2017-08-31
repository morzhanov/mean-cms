/**
 * POSTS ROUTES
 */

var Post = require('../models/post.js');
var config = require('../../config');
var fs = require('fs');
var formidable = require('formidable');

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var postRouter = express.Router();

    /**
     * For posts routes with reference (/api/posts)
     */
    postRouter.route('/')
        /**
         * Get all posts
         */
        .get(function (request, response) {

            return Post.find(function (err, posts) {
                if (!err) {
                    return response.send(posts);
                } else {
                    return response.send(500, err);
                }
            });
        })
        /**
         * Create new post in DB
         * id - ID of page
         */
        .post(function (request, response) {

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
        });

    /**
     * For posts routes with reference (/api/posts/:id)
     */
    postRouter.route('/:id')

        /**
         * Get single post
         */
        .get(function (request, response) {

            return Post.findById(request.params.id, function (err, post) {
                if (!err) {
                    return response.send(post);
                } else {
                    return response.send(500, err);
                }
            });
        })

        /**
         * update a post
         * id - ID of post
         */
        .put(function (request, response) {
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

        /**
         * delete a single post
         * id - ID of post
         */
        .delete(function (request, response) {

            var id = request.params.id;

            Post.remove({
                    _id: id
                },
                function (err) {
                    return console.log(err);
                });
            return response.send('Post id- ' + id + 'has been deleted');
        });

    /**
     * Return postRouter to app
     */
    return postRouter;

};