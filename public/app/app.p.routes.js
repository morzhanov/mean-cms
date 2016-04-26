/**
 * Angular routes management
 */
angular.module('app.p.routes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/forbidden',
                {
                    templateUrl: 'app/views/pages/public/forbidden.html'
                })

            /**
             * Routes for simple users
             */
            //home page route
            .when('/',
                {
                    templateUrl: 'app/views/pages/public/home.html'
                })

            .when('/donation',
                {
                    templateUrl: 'app/views/pages/public/donation.html'
                })

            //login page
            .when('/login',
                {
                    templateUrl: 'app/views/pages/public/login.html'
                })

            //login page
            .when('/signup',
                {
                    templateUrl: 'app/views/pages/public/signup.html',
                    controller: 'userCreateController',
                    controllerAs: 'user'
                })

            //form to create a new user
            //same view as edit page
            .when('/users/create',
                {
                    templateUrl: 'app/views/pages/public/signup.html',
                    controller: 'userCreateController',
                    controllerAs: 'user'
                })

            // page to edit a user
            .when('/users/:user_id', {
                templateUrl: 'app/views/pages/admin/users/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            });


        //set our app up to have pretty URLS
        $locationProvider.html5Mode(true);
    });