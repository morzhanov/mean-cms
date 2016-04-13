angular.module('mainApp')

    .controller('adminController', ['$rootScope', '$http', 'Auth', function ($rootScope, $http, Auth) {
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
            else
                vm.isAdmin = false;
        };

        vm.invalidatePanelUsername();
        
        $rootScope.$on('invalidateAdminPanel', function () {
            vm.invalidatePanelUsername();
        })
    }]);