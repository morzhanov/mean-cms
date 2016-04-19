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
    .controller('userController', ['$rootScope', 'User', 'adminControlService', '$q', 'HeightDetect',
        function ($rootScope, User, adminControlService, $q, HeightDetect) {

            adminControlService.control();

            var vm = this;

            HeightDetect.heightDetect();

            vm.defaultUserPhoto = "assets/img/default-user-photo.png";

            //set a processing variable to show loading things
            vm.processing = true;

            vm.user = {};

            //grab all users at page load
            User.all()
                .success(function (data) {

                    //bind the users that come back to vm.users
                    vm.users = data;

                    for (var i = 0; i < vm.users.length; ++i) {
                        if (vm.users[i].site === undefined)
                            continue;
                        if (vm.users[i].site.length > 40)
                            vm.users[i].siteAlias = vm.users[i].site.substring(0, 40) + "...";
                        else
                            vm.users[i].siteAlias = vm.users[i].site;
                    }

                    var deferred = $q.defer();

                    vm.currentUser = User.getCurrentUser().then(function (res) {
                        //bind the users that come back to vm.users
                        vm.forUsers = res;

                        User.current().success(function (data) {
                            //bind the users that come back to vm.users
                            deferred.resolve(data);
                        });

                        return deferred.promise;
                    }).then(function (res) {
                        vm.forUsers.username = res.username;

                        for (var i = 0; i < vm.users.length; ++i) {
                            if (vm.forUsers[i].username == vm.forUsers.username) {
                                vm.firstName = vm.forUsers[i].firstName;
                                vm.secondName = vm.forUsers[i].secondName;
                                if (vm.forUsers[i].photo === undefined)
                                    vm.photo = vm.defaultUserPhoto;
                                else
                                    vm.photo = vm.forUsers[i].photo;
                            }
                        }

                        console.log(vm.user);
                        console.log(vm.user.photo);
                    });

                    //when all the users come back, remove the processing variable
                    vm.processing = false;
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
    .controller('userCreateController', ['$rootScope', 'HeightDetect', 'User', '$location', 'Auth',
        function ($rootScope, HeightDetect, User, $location, Auth) {

            var vm = this;

            vm.processing = false;

            if ($location.$$path == '/users/create')
                $http.get('/api/admin')
                    .error(function (err) {
                        $location.path('/');
                    });

            //variable to hide/show elements of the view
            //differentiates between create or edit pages
            vm.type = 'create';

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

    .directive('filestyle', function () {
        return {
            restrict: 'AC',
            scope: true,
            link: function (scope, element, attrs) {
                var options = {
                    'input': attrs.input === 'false' ? false : true,
                    'icon': attrs.icon === 'false' ? false : true,
                    'buttonBefore': attrs.buttonbefore === 'true' ? true : false,
                    'disabled': attrs.disabled === 'true' ? true : false,
                    'size': attrs.size,
                    'buttonText': attrs.buttontext,
                    'buttonName': attrs.buttonname,
                    'iconName': attrs.iconname,
                    'badge': attrs.badge === 'false' ? false : true,
                    'placeholder': attrs.placeholder
                };
                $(element).filestyle(options);
            }
        };
    })

    //controller applied to user edit page
    .controller('userEditController', ['$rootScope', '$routeParams', 'User', 'HeightDetect', '$window', 'Upload',
        function ($rootScope, $routeParams, User, HeightDetect, $window, Upload) {

            var vm = this;

            vm.uploadPhoto = false;

            HeightDetect.heightDetect();

            vm.defaultUserPhoto = "assets/img/default-user-photo.png";

            // variable to hide/show elements of the view
            // differentiates between create or edit pages
            vm.type = 'edit';

            $rootScope.LoadFilePath = function (element) {

                $rootScope.$apply(function (scope) {

                    var file = element.files[0];

                    var reader = new FileReader();

                    reader.onload = function (e) {
                        console.log(e);
                        vm.photoData = e.target.result;

                        vm.userData.photo = e.target.result;

                        angular.element('#user-photo')
                            .html(
                                '<img ng-src="{{user.userData.photo}}" src="' + vm.userData.photo + '" alt="user photo">'
                            );

                        vm.uploadPhoto = true;
                    };
                    reader.readAsDataURL(file);
                });
            };

            // get the user data for the user you want to edit
            // $routeParams is the way we grab data from the URL
            User.get($routeParams.user_id)
                .success(function (data) {
                    vm.userData = data;

                    angular.element('#photo-form')
                        .attr('action', '/api/upload/image/user?id='
                            + $routeParams.user_id
                            + '&token=' + $window.localStorage.getItem('token')
                            + '&username=' + vm.userData.username);

                    vm.getUserPhoto();
                });


            vm.getUserPhoto = function () {
                if (vm.userData.photo === undefined) {
                    vm.userData.photo = vm.defaultUserPhoto;
                }
            };

            //function to save the user
            vm.saveUser = function () {

                vm.processing = true;

                vm.message = '';

                var uploadPhotoFunc = function()
                {
                    "use strict";

                    /**
                     * load image on server
                     */
                    Upload.upload({
                        url: '/api/upload/image/user',
                        data: {
                            photo: {
                                userId: $routeParams.user_id,
                                data: vm.photoData,
                                type: "." + vm.photoData.substring(
                                    vm.photoData.indexOf('/') + 1,
                                    vm.photoData.indexOf(';'))
                            }
                        }
                    }).then(function (response) {
                        "use strict";
                        console.log(response);

                        updateUser();
                    });
                };

                var updateUser = function () {

                    //call the userService function to update
                    User.update($routeParams.user_id, vm.userData)
                        .success(function (data) {
                            vm.processing = false;

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

                if(vm.uploadPhoto)
                {
                    vm.uploadPhoto = false;

                    uploadPhotoFunc();
                }
                else
                {
                    updateUser();
                }
            };
        }
    ]);