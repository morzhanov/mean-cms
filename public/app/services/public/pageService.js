/**
 * Service for managing page's routes
 */

angular.module('mainApp')

    .factory('pPage', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var pageFactory = {};

        // get a single page
        pageFactory.get = function (id) {

            return $http.get('/api/pages/' + id);
        };

        // get a single post
        pageFactory.getSinglePost = function (page_id, post_id) {

            return $http.get('/api/pages/' + page_id + "/posts/" + post_id);
        };

        // get all posts
        pageFactory.allPosts = function (page_id) {
            return $http.get('/api/pages/' + page_id + "/posts/");
        };

        // return our entire pageFactory object
        return pageFactory;

    }]);