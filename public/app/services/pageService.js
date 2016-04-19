angular.module('mainApp')

    .factory('User', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var pageFactory = {};

        // get a single page
        pageFactory.get = function (id) {

            return $http.get('/api/user/' + id);
        };

        // get all page
        pageFactory.all = function () {
            return $http.get('/api/user/');
        };

        // create a page
        pageFactory.create = function (userData) {
            return $http.post('/api/user/', userData);
        };

        // update a page
        pageFactory.update = function (id, userData) {
            return $http.put('/api/user/' + id, userData);
        };

        // delete a page
        pageFactory.delete = function (id) {
            return $http.delete('/api/user/' + id);
        };

        //get current page
        pageFactory.current = function () {
            return $http.get('/api/me/');
        };

        // return our entire userFactory object
        return pageFactory;

    }]);