angular.module('mainApp')

    .factory('adminControlService', ['$rootScope', 'User', 'Auth', '$location', '$http',
        function ($rootScope, User, Auth, $location, $http) {
            return {
                control: function () {
                    if (Auth.isLoggedIn()) {
                        $http.get('/api/admin')
                            .error(function () {
                                $location.path('/login');
                            });
                    }
                    else
                        $location.path('/login');
                }
            }
        }])

    //user controller for the main page
    //inject the User factory
    .controller('userController', ['$rootScope', 'User', 'adminControlService', '$q',
        function ($rootScope, User, adminControlService, $q) {

            adminControlService.control();

            var vm = this;

            vm.defaultUserPhoto = "assets/img/default-user-photo.png";

            //set a processing variable to show loading things
            vm.processing = true;

            //grab all users at page load
            User.all()
                .success(function (data) {
                    //when all the users come back, remove the processing variable
                    vm.processing = false;

                    //bind the users that come back to vm.users
                    vm.users = data;

                    for (var i = 0; i < vm.users.length; ++i) {
                        if (vm.users[i].site.length > 40)
                            vm.users[i].siteAlias = vm.users[i].site.substring(0, 40) + "...";
                        else
                            vm.users[i].siteAlias = vm.users[i].site;
                    }
                });

            var deferred = $q.defer();

            vm.user = {};

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

            vm.getUserPhoto = function () {
                if (vm.currentUser.photo) {
                    return vm.userData.photo;
                }
                else
                    return vm.defaultUserPhoto;
            };

            //function to delete a user
            vm.deleteUser = function (id) {
                vm.processing = true;

                //accepts the user id as a parameter
                User.delete(id)
                    .success(function (data) {
                        // get all users to update the table
                        // you can also set up your api
                        // to return the list of users with the delete call
                        User.all()
                            .success(function (data) {
                                vm.processing = false;
                                vm.users = data;
                            });
                    });
            }
        }])

    //controller applied to user creation page
    .controller('userCreateController', ['$rootScope', 'HeightDetect', 'User', '$location',
        function ($rootScope, HeightDetect, User, $location) {

            var vm = this;

            //variable to hide/show elements of the view
            //differentiates between create or edit pages
            vm.type = 'create';

            /**
             * resize header
             */
            HeightDetect.heightDetect();

            $(window).resize(function () {
                HeightDetect.heightDetect();
            });

            //function to create a user
            vm.saveUser = function () {
                vm.processing = true;

                //clear the message
                vm.message = '';

                //use the create function in the userService
                User.create(vm.userData)
                    .success(function (data) {
                        vm.processing = false;

                        //clear the form
                        vm.userData = {};
                        vm.message = data.message;

                        $rootScope.$emit('changeUser');
                        $rootScope.$emit('invalidateAdminPanel');

                        $location.path('/login');
                    })
            }
        }])

    //controller applied to user edit page
    .controller('userEditController', ['$routeParams', 'User', function ($routeParams, User) {

        var vm = this;

        vm.defaultUserPhoto = "assets/img/default-user-photo.png";

        // variable to hide/show elements of the view
        // differentiates between create or edit pages
        vm.type = 'edit';

        // get the user data for the user you want to edit
        // $routeParams is the way we grab data from the URL
        User.get($routeParams.user_id)
            .success(function (data) {
                vm.userData = data;
            });

        vm.getUserPhoto = function () {
            if (vm.userData.photo) {
                return vm.userData.photo;
            }
            else
                return vm.defaultUserPhoto;
        };

        //function to save the user
        vm.saveUser = function () {
            vm.processing = true;

            vm.message = '';

            //call the userService function to update
            User.update($routeParams.user_id, vm.userData)
                .success(function (data) {
                    vm.processing = false;

                    //clear the form
                    vm.userData = {};

                    //bind the message from our API to vm.message
                    vm.message = data.message;

                    $rootScope.$emit('changeUser');
                    $rootScope.$emit('invalidateAdminPanel');
                })
                .error(function (data) {
                    console.log(data);
                    $rootScope.$emit('changeUser');
                    $rootScope.$emit('invalidateAdminPanel');
                });
        };
    }]);