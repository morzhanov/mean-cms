/**
 * Service for managing page's from admin dashboard
 */

angular.module('mainApp')

    .factory('Page', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var pageFactory = {};

        // get a single page
        pageFactory.get = function (id) {

            return $http.get('/api/admin/pages/' + id);
        };

        // get all pages
        pageFactory.all = function () {
            return $http.get('/api/admin/pages/');
        };

        // create a page
        pageFactory.create = function (userData) {
            return $http.post('/api/admin/pages/', userData);
        };

        // update a page
        pageFactory.update = function (id, userData) {
            return $http.put('/api/admin/pages/' + id, userData);
        };

        // delete a page
        pageFactory.delete = function (id) {
            return $http.delete('/api/admin/pages/' + id);
        };

        // get a single post
        pageFactory.getSinglePost = function (page_id, post_id) {

            return $http.get('/api/admin/pages/' + page_id + "/posts/" + post_id);
        };

        // get all posts
        pageFactory.allPosts = function (page_id) {
            return $http.get('/api/admin/pages/' + page_id + "/posts/");
        };

        // create a post
        pageFactory.createPost = function (page_id, userData) {
            return $http.post('/api/admin/pages/' + page_id + '/posts/', userData);
        };

        // update a post
        // post of page updates via PostService update method

        // delete a post from page's posts array
        pageFactory.deletePostFromPage = function (page_id, post_id) {
            return $http.delete('/api/admin/pages/' + page_id + '/posts/' + post_id);
        };

        // return our entire pageFactory object
        return pageFactory;

    }]);