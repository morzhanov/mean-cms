/**
 * Service for managing specific page's posts managing routes
 */

angular.module('mainApp')

    .factory('PagePosts', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var pagePostsFactory = {};

        // get a single post
        pagePostsFactory.get = function (page_id, post_id) {

            return $http.get('/api/pages/' + page_id + "/posts/" + post_id);
        };

        // get all posts
        pagePostsFactory.all = function (page_id) {
            return $http.get('/api/pages/' + page_id + "/posts/");
        };

        // create a post
        pagePostsFactory.create = function (page_id, userData) {
            return $http.post('/api/pages/' + page_id + '/posts/', userData);
        };

        // update a post
        // post of page updates via PostService update method

        // delete a post from page's posts array
        pagePostsFactory.delete = function (page_id, post_id) {
            return $http.delete('/api/pages/' + page_id + '/posts/' + post_id);
        };

        // return our entire pagePostsFactory object
        return pagePostsFactory;

    }]);