/**
 * Service for managing post's from admin dashboard
 */

angular.module('mainApp')

    .factory('Post', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var postFactory = {};

        // get a single post
        postFactory.get = function (id) {

            return $http.get('/api/admin/posts/' + id);
        };

        // get all posts
        postFactory.all = function () {
            return $http.get('/api/admin/posts/');
        };

        // create a post
        postFactory.create = function (userData) {
            return $http.post('/api/admin/posts/', userData);
        };

        // update a post
        postFactory.update = function (id, userData) {
            return $http.put('/api/admin/posts/' + id, userData);
        };

        // delete a post
        postFactory.delete = function (id) {
            return $http.delete('/api/admin/posts/' + id);
        };

        // return our entire postFactory object
        return postFactory;

    }]);