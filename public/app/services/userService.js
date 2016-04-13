angular.module('mainApp')

    .factory('User', ['$http', 'Auth', '$location', function ($http, Auth, $location) {

        // create a new object
        var userFactory = {};

        userFactory.currentUser = {};

        // get a single user
        userFactory.get = function (id) {

            return $http.get('/api/user/' + id);
        };

        // get all users
        userFactory.all = function () {
            return $http.get('/api/user/');
        };

        // create a user
        userFactory.create = function (userData) {
            return $http.post('/api/user/', userData);
        };

        // update a user
        userFactory.update = function (id, userData) {
            return $http.put('/api/user/' + id, userData);
        };

        // delete a user
        userFactory.delete = function (id) {
            return $http.delete('/api/user/' + id);
        };

        //get current user
        userFactory.current = function () {
            return $http.get('/api/me/');
        };

        userFactory.getCurrentUser = function () {

            var vm = this;

            vm.user = {};

            if (Auth.isLoggedIn()) {
                userFactory.all().success(function (res) {
                    //bind the users that come back to vm.users
                    vm.users = res;

                    userFactory.current().success(function (data) {
                        //bind the users that come back to vm.users
                        vm.user.username = data.username;

                        for (var i = 0; i < vm.users.length; ++i) {
                            if (vm.users[i].username == vm.user.username) {
                                vm.user.firstName = vm.users[i].firstName;
                                vm.user.secondName = vm.users[i].secondName;
                            }
                        }

                        console.log(vm.user);
                    });
                });

            }

            vm.currentUser = vm.user;

            return vm.user;
        };

        // return our entire userFactory object
        return userFactory;

    }]);