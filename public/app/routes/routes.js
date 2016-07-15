/**
 * Angular public routes management
 */
angular.module('routes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            //forbidden page route
            .when('/forbidden',
                {
                    templateUrl: 'app/views/public/forbidden.html'
                })

            /**
             * Routes for simple users
             */
            //home page route
            .when('/',
                {
                    templateUrl: 'app/views/public/home.html'
                })

            //donation page route
            .when('/donation',
                {
                    templateUrl: 'app/views/public/donation.html'
                })

            //login route
            .when('/login',
                {
                    templateUrl: 'app/views/public/login.html'
                })

            //sign up route
            .when('/signup',
                {
                    templateUrl: 'app/views/public/signup.html',
                    controller: 'userCreateController',
                    controllerAs: 'user'
                })

            //form to create a new user
            //same view as edit page
            .when('/users/create',
                {
                    templateUrl: 'app/views/public/signup.html',
                    controller: 'userCreateController',
                    controllerAs: 'user'
                })

            // page to edit a user
            .when('/users/:user_id', {
                templateUrl: 'app/views/admin/users/single.html',
                controller: 'userEditController',
                controllerAs: 'user'
            });


        //set our app up to have pretty URLS
        $locationProvider.html5Mode(true);
    });