angular.module('mainApp')

    .factory('Image', ['$http', 'Auth', '$location', '$q', function ($http, Auth, $location, $q) {

        // create a new object
        var imageFactory = {};

        imageFactory.loadUserPhoto = function (id, imageData) {
          return $http.post('/api/image/' + id, imageData);
        };

        // get a single user
        imageFactory.downloadUserPhoto = function (id) {
            return $http.get('/api/image/' + id);
        };

        return imageFactory;
    }]);