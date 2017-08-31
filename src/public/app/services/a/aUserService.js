/**
 * Service for managing user's from admin dashboard
 */

angular.module('mainApp')

    .factory('aUser', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var userFactory = {};

        userFactory.currentUser = {};

        // get a single user
        userFactory.get = function (id) {

            return $http.get('/api/admin/users/' + id);
        };

        // get all users
        userFactory.all = function () {
            return $http.get('/api/admin/users/');
        };

        // create a user
        userFactory.create = function (userData) {
            return $http.post('/api/admin/users/', userData);
        };

        // update a user
        userFactory.update = function (id, userData) {
            return $http.put('/api/admin/users/' + id, userData);
        };

        // delete a user
        userFactory.delete = function (id) {
            return $http.delete('/api/admin/users/' + id);
        };

        //get current user
        userFactory.current = function () {
            return $http.get('/api/admin/me');
        };

        // return our entire userFactory object
        return userFactory;

    }]);