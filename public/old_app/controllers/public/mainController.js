angular.module('mainApp')

    .controller('mainController', ['$rootScope',
        '$location',
        'Auth',
        'HeightDetect',
        '$http',
        'pPage',
        function ($rootScope, $location, Auth, HeightDetect, $http, pPage, ngParallax) {

            var vm = this;

            HeightDetect.heightDetect();

            /**
             * admin controller section
             */
            vm.isAdmin = false;

            /**
             * all pages for navbar
             */
            pPage.all()
                .success(function (res) {
                    vm.pages = res;
                });

            vm.invalidatePanelUsername = function () {
                $http.get('/api/admin')
                    .success(function () {
                        vm.isAdmin = true;
                    })
                    .error(function () {
                        vm.isAdmin = false;
                    });
            };

            angular.element(document).ready(function () {
                angular.element('.loader_inner').fadeOut();
                angular.element('.loader').delay(400).fadeOut("slow");

                if (Auth.isLoggedIn()) {
                    if ($location.$$path == '/login' || $location.$$path == '/signup') {
                        $location.path('/');
                    }

                    vm.invalidatePanelUsername();
                }
            });

            vm.siteSettings = {};
            vm.siteSettings.title = 'CMS';
            vm.siteSettings.url = 'localhost:8080/';

            /**
             * public navbar
             */
            vm.menuUrl = "app/views/public/navbar-menu.html";

            console.log(vm.siteSettings.title);

            vm.user = {};

            // get info if a person is logged in
            vm.loggedIn = Auth.isLoggedIn();

            // check to see if a user is logged in on every request
            $rootScope.$on('$routeChangeStart', function () {
                vm.loggedIn = Auth.isLoggedIn();

                HeightDetect.heightDetect();

                if (vm.loggedIn) {
                    // get user information on route change
                    Auth.getUser()
                        .then(function (data) {
                            vm.user = data;
                        });
                }
                else {
                    $location.path('/login');
                }
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
                            vm.invalidatePanelUsername();
                            $location.path('/');
                        }
                        else
                            vm.error = data.message;
                    });
            };

            vm.facebookLogin = function () {
                vm.processing = true;

                //clear the error
                vm.error = '';

                Auth.facebookLogin()
                    .success(function () {
                        console.log('logged in via Facebook');
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            };

            // function to handle logging out
            vm.doLogout = function () {
                Auth.logout();
                // reset all user info
                vm.user = {};
                $location.path('/login');

                vm.isAdmin = false;
            };
        }]);