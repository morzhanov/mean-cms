/**
 * Angular admin routes management
 */
angular.module('app.admin.routes', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider
            
            //admin login route
            .when('/admin/login',{
                templateUrl: 'app/views/admin/login.html',
                controller: 'aAuthCtrl',
                controllerAs: 'auth'
            })
            
            //admin registry route
            .when('/admin/signup',
                {
                    templateUrl: 'app/views/admin/signup.html',
                    controller: 'aAuthCtrl',
                    controllerAs: 'auth'
                })
            
            //main admin dashboard route
            .when('/admin/dashboard',
                {
                    templateUrl: 'app/views/admin/dashboard.html',
                    controller: 'aDashboardCtrl',
                    controllerAs: 'dashboard'
                })
            .otherwise({
                redirectTo: '/'
            });
    });