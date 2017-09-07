// Main angular app file

angular.module('mainApp',
  [
    'ngAnimate',          // animating
    'a.routes',
    'routes',
    'ui.bootstrap',
    'ngParallax',          // parallax effect
    'ngFileUpload'
  ])

  .service('HeightDetect', function () {
    const instance = this

    // get a single user
    this.heightDetect = function () {
      const h = $('.height-detect')
      h.css('height', $(window).height())
      h.attr('height', $(window).height())
      $('#dashboard-container').css('height', $(document).height())
    }

    $(document).ready(function () {
      instance.heightDetect()
    })
  })

  // application configuration to integrate token into requests
  .config(function ($httpProvider, $locationProvider) {
    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor')

    $locationProvider.html5Mode(true).hashPrefix('!')
  })
