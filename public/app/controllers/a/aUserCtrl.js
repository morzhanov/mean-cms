angular.module('mainApp')

/**
 * Controller that manage users data
 * retrieving all users from server
 * deleting specific user
 */
    .controller('aUserCtrl', ['aUser',
        function (aUser) {

            var vm = this;

            //set a processing variable to show loading things
            vm.processing = true;

            //grab all users at page load
            aUser.all()
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

                    //when all the users come back, remove the processing variable
                    vm.processing = false;
                });

            //function to delete a user
            vm.deleteUser = function (id) {
                vm.processing = true;

                //accepts the user id as a parameter
                aUser.delete(id)
                    .success(function (data) {
                        // get all users to update the table
                        // you can also set up your api
                        // to return the list of users with the delete call
                        aUser.all()
                            .success(function (data) {
                                vm.processing = false;
                                vm.users = data;
                            });

                        alert('User successfully deleted !');
                    });
            };
        }])

    .controller('aUserEditCtrl', ['$rootScope', '$routeParams', 'aUser', 'HeightDetect', '$window', 'Upload',
        function ($rootScope, $routeParams, aUser, HeightDetect, $window, Upload) {

            var vm = this;

            vm.defaultUserPhoto = "assets/img/default-user-photo.png";

            vm.type = localStorage.getItem('user-edit-type');

            vm.getUserPhoto = function () {
                if (vm.userData.photo === undefined) {
                    vm.userData.photo = vm.defaultUserPhoto;
                }
            };

            if (vm.type === 'edit') {

                    // get the user data for the user you want to edit
                    // $routeParams is the way we grab data from the URL
                    aUser.get(localStorage.getItem('user-id-to-edit'))
                        .success(function (data) {
                            vm.userData = data;

                            angular.element('#photo-form')
                                .attr('action', '/api/admin/upload/image/user?id='
                                    + vm.userData.id
                                    + '&token=' + localStorage.getItem('token')
                                    + '&email=' + vm.userData.email);

                            vm.getUserPhoto();
                        });
            }
            else {
                vm.userData = {};
            }

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

            vm.updateUser = function () {

                if (vm.uploadPhoto) {
                    vm.uploadPhoto = false;

                    uploadPhotoFunc();
                }
                else {

                    //call the userService function to update
                    aUser.update(localStorage.getItem('user-id-to-edit'), vm.userData)
                        .success(function (data) {

                            localStorage.setItem('userData', JSON.stringify(data.userData));

                            vm.processing = false;

                            //bind the message from our API to vm.message
                            vm.message = data.message;
                        })
                        .error(function (data) {
                            console.log(data);
                        });
                }
            };

            vm.createNewUser = function () {

                //temporary
                vm.userData.photo = null;

                aUser.create(vm.userData)
                    .success(function (data) {
                        vm.processing = false;

                        //clear the form
                        vm.userData = {};
                        vm.message = data.message;
                    })

            };

            //function to save the user
            vm.saveUser = function () {

                vm.processing = true;

                vm.message = '';

                if (vm.type === 'create')
                    vm.createNewUser();
                else
                    vm.updateUser();
            };

            var uploadPhotoFunc = function () {
                "use strict";

                /**
                 * load image on server
                 */
                Upload.upload({
                    url: '/api/admin/upload/image/user',
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

        }])
    .directive('filestyle', function () {
        return {
            restrict: 'AC',
            scope: true,
            link: function (scope, element, attrs) {
                var options = {
                    'input': attrs.input !== 'false',
                    'icon': attrs.icon !== 'false',
                    'buttonBefore': attrs.buttonbefore === 'true',
                    'disabled': attrs.disabled === 'true',
                    'size': attrs.size,
                    'buttonText': attrs.buttontext,
                    'buttonName': attrs.buttonname,
                    'iconName': attrs.iconname,
                    'badge': attrs.badge !== 'false',
                    'placeholder': attrs.placeholder
                };
                $(element).filestyle(options);
            }
        };
    });