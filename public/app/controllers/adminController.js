angular.module('mainApp')

    .controller('adminController', ['$http', 'Auth', function ($http, Auth) {
        var vm = this;

        vm.isAdmin = false;

        vm.checkAdmin = function () {
            return $http.get('/api/admin');
        };

        vm.invalidatePanelUsername = function () {
            if (Auth.isLoggedIn()) {
                vm.checkAdmin()
                    .success(function () {
                        vm.isAdmin = true;
                    })
                    .error(function () {
                        vm.isAdmin = false;
                    });
            }
        };

        vm.invalidatePanelUsername();
    }]);