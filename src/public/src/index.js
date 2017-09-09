require('./init')
const angular = require('angular')

angular.module('app',
  [
    'ngAnimate',          // animating
    'a.routes',
    'routes',
    'ui.bootstrap',
    'ngParallax',          // parallax effect
    'ngFileUpload'
  ])
// application configuration to integrate token into requests
  .config(function ($httpProvider, $locationProvider) {
    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor')

    $locationProvider.html5Mode(true).hashPrefix('!')
  })
