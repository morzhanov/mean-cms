/**
 * Service for managing page's from admin dashboard
 */

angular.module('mainApp')
  .factory('aPage', ['$http', 'Auth', '$location', '$q', function ($http) {
    // create a new object
    const pageFactory = {}

    // get a single page
    pageFactory.get = function (id) {
      return $http.get('/api/admin/pages/' + id)
    }

    // get all pages
    pageFactory.all = function () {
      return $http.get('/api/admin/pages/')
    }

    // create a page
    pageFactory.create = function (userData) {
      return $http.post('/api/admin/pages/', userData)
    }

    // update a page
    pageFactory.update = function (id, userData) {
      return $http.put('/api/admin/pages/' + id, userData)
    }

    // delete a page
    pageFactory.delete = function (id) {
      return $http.delete('/api/admin/pages/' + id)
    }

    // get a single post
    pageFactory.getSinglePost = function (pageId, postId) {
      return $http.get('/api/admin/pages/' + pageId + '/posts/' + postId)
    }

    // get all posts
    pageFactory.allPosts = function (pageId) {
      return $http.get('/api/admin/pages/' + pageId + '/posts/')
    }

    // create a post
    pageFactory.createPost = function (pageId, userData) {
      return $http.post('/api/admin/pages/' + pageId + '/posts/', userData)
    }

    // update a post
    // post of page updates via PostService update method

    // delete a post from page's posts array
    pageFactory.deletePostFromPage = function (pageId, postId) {
      return $http.delete('/api/admin/pages/' + pageId + '/posts/' + postId)
    }

    // return our entire pageFactory object
    return pageFactory
  }])
