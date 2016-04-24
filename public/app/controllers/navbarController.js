angular.module('mainApp')

    .controller('navbarController', ['$rootScope', 'User', 'Auth', '$q', '$location',
        function ($rootScope, User, Auth, $q, $location) {

            var vm = this;

            vm.user = {};

            vm.toDashboard = function () {
                $location.path('/admin-dashboard');
            };

            vm.toSiteHome = function () {
                $location.path('/');
            };

            var deferred = $q.defer();

            vm.currentUser = User.getCurrentUser().then(function (res) {
                //bind the users that come back to vm.users
                vm.users = res;

                User.current().success(function (data) {
                    //bind the users that come back to vm.users
                    deferred.resolve(data);
                });

                return deferred.promise;
            }).then(function (res) {
                vm.user.username = res.username;

                for (var i = 0; i < vm.users.length; ++i) {
                    if (vm.users[i].username == vm.user.username) {
                        vm.user.firstName = vm.users[i].firstName;
                        vm.user.secondName = vm.users[i].secondName;
                    }
                }

                console.log(vm.user);
            });

            vm.user = User.currentUser;

            $rootScope.$on('changeUser', function () {
                var deferred = $q.defer();

                vm.currentUser = User.getCurrentUser().then(function (res) {
                    //bind the users that come back to vm.users
                    vm.users = res;

                    User.current().success(function (data) {
                        //bind the users that come back to vm.users
                        deferred.resolve(data);
                    });

                    return deferred.promise;
                }).then(function (res) {
                    vm.user.username = res.username;

                    for (var i = 0; i < vm.users.length; ++i) {
                        if (vm.users[i].username == vm.user.username) {
                            vm.user.firstName = vm.users[i].firstName;
                            vm.user.secondName = vm.users[i].secondName;
                        }
                    }

                    console.log(vm.user);
                });

                vm.user = User.currentUser;
            });
        }]);