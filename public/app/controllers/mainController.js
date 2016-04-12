angular.module('mainApp')

    .controller('mainController', ['$rootScope',
        '$location',
        'Auth',
        'HeightDetect',
        'User',
        '$routeParams',
        function ($rootScope, $location, Auth, HeightDetect, User, ngParallax, $routeParams) {

            var vm = this;

            vm.user = {};

            HeightDetect.heightDetect();

            // get info if a person is logged in
            vm.loggedIn = Auth.isLoggedIn();

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();

                // get user information on route change
                Auth.getUser()
                    .then(function (data) {
                        vm.user = data;
                    });
            });

            // function to handle login form
            vm.doLogin = function () {

                console.log(vm.loginData.username);

                vm.processing = true;

                //clear the error
                vm.error = '';

                // call the Auth.login() function
                Auth.login(vm.loginData.username, vm.loginData.password)
                    .success(function (data) {

                        vm.processing = false;

                        // if a user successfully logs in, redirect to users page
                        if (data.success) {
                            $rootScope.$emit('changeUser');
                            $location.path('/users');
                        }
                        else
                            vm.error = data.message;
                    });
            };

            vm.doRegistration = function () {

            };

            // function to handle logging out
            vm.doLogout = function () {
                Auth.logout();
                // reset all user info
                vm.user = {};
                $location.path('/login');
            };
        }]);