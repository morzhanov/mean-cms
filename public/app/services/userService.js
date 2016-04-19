angular.module('mainApp')

    .factory('User', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var userFactory = {};

        userFactory.currentUser = {};

        // get a single user
        userFactory.get = function (id) {

            return $http.get('/api/users/' + id);
        };

        // get all users
        userFactory.all = function () {
            return $http.get('/api/users/');
        };

        // create a user
        userFactory.create = function (userData) {
            return $http.post('/api/users/', userData);
        };

        // update a user
        userFactory.update = function (id, userData) {
            return $http.put('/api/users/' + id, userData);
        };

        // delete a user
        userFactory.delete = function (id) {
            return $http.delete('/api/users/' + id);
        };

        //get current user
        userFactory.current = function () {
            return $http.get('/api/me/');
        };

        userFactory.getCurrentUser = function () {

            var vm = this;

            var deferred = $q.defer();

            if (Auth.isLoggedIn()) {

                userFactory.all().success(function (res) {

                    deferred.resolve(res);
                    });
            }

            return deferred.promise;
        };

        // return our entire userFactory object
        return userFactory;

    }]);