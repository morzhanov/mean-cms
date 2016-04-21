//main angular app file
angular.module('mainApp',
    [
        'ngAnimate',          //animating
        'app.routes',         //routing
        'ui.bootstrap',
        'ngParallax',          //parallax effect
        'ngFileUpload'
    ])

    .service('HeightDetect', function () {

        var instance = this;

        // get a single user
        this.heightDetect = function () {
            $(".height-detect").css("height", $(window).height() - 70);
        };

        $(document).ready(function () {
            instance.heightDetect();
        });
    })

    //application configuration to integrate token into requests
    .config(function ($httpProvider) {
        //attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor');
    });