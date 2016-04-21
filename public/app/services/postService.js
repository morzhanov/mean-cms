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

        // get all page
        postFactory.all = function () {
            return $http.get('/api/posts/');
        };

        // create a page
        postFactory.create = function (userData) {
            return $http.post('/api/posts/', userData);
        };

        // update a page
        postFactory.update = function (id, userData) {
            return $http.put('/api/posts/' + id, userData);
        };

        // delete a page
        postFactory.delete = function (id) {
            return $http.delete('/api/posts/' + id);
        };

        // return our entire postFactory object
        return postFactory;

    }]);