/**
 * Service for managing page's routes
 */

angular.module('mainApp')

    .factory('Page', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var pageFactory = {};

        // get a single page
        pageFactory.get = function (id) {

            return $http.get('/api/pages/' + id);
        };

        // get all page
        pageFactory.all = function () {
            return $http.get('/api/pages/');
        };

        // create a page
        pageFactory.create = function (userData) {
            return $http.post('/api/pages/', userData);
        };

        // update a page
        pageFactory.update = function (id, userData) {
            return $http.put('/api/pages/' + id, userData);
        };

        // delete a page
        pageFactory.delete = function (id) {
            return $http.delete('/api/pages/' + id);
        };

        // return our entire pageFactory object
        return pageFactory;

    }]);