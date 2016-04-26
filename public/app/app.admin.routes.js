/**
 * Angular routes management
 */
angular.module('app.admin.routes', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider

            .when('/admin-dashboard',
                {
                    templateUrl: 'app/views/pages/admin/dashboard.html',
                    controller: 'dashboardController',
                    controllerAs: 'dashboard'
                })

            //show all users
            .when('/users',
                {
                    templateUrl: 'app/views/pages/admin/users/all.html',
                    controller: 'adminUserController',
                    controllerAs: 'adminUser'
                })
            .otherwise({
                redirectTo: '/'
            });
    });