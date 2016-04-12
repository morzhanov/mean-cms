angular.module('mainApp')

    .controller('navbarController', ['$rootScope', 'User', 'Auth', function ($rootScope, User, Auth) {

        var vm = this;

        vm.user = {};

        User.getCurrentUser();

        vm.user = User.currentUser;

        $rootScope.$on('changeUser', function () {
            User.getCurrentUser();

            vm.user = User.currentUser;
        });
    }]);