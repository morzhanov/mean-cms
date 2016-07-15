/**
 * Service for managing post's routes
 */

angular.module('mainApp')

    .factory('Post', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var postFactory = {};

        // get a single post
        postFactory.get = function (id) {

            return $http.get('/api/posts/' + id);
        };

        // get all posts
        postFactory.all = function () {
            return $http.get('/api/posts/');
        };

        // return our entire postFactory object
        return postFactory;

    }]);