/**
 * Service for managing post's routes
 */

angular.module('mainApp')
  .factory('Post', ['$http', 'Auth', '$location', '$q', function ($http) {
    // create a new object
    let postFactory = {}

    // get a single post
    postFactory.get = function (id) {
      return $http.get('/api/posts/' + id)
    }

    // get all posts
    postFactory.all = function () {
      return $http.get('/api/posts/')
    }

    // return our entire postFactory object
    return postFactory
  }])
