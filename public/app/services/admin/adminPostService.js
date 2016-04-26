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

        // create a post
        postFactory.create = function (userData) {
            return $http.post('/api/posts/', userData);
        };

        // update a post
        postFactory.update = function (id, userData) {
            return $http.put('/api/posts/' + id, userData);
        };

        // delete a post
        postFactory.delete = function (id) {
            return $http.delete('/api/posts/' + id);
        };

        // return our entire postFactory object
        return postFactory;

    }]);