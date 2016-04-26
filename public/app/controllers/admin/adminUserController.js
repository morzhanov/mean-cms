angular.module('mainApp')
    .controller('adminUserController', ['User',
        function (User) {

            var vm = this;

            //grab all users at page load
            User.all()
                .success(function (data) {

                    //bind the users that come back to vm.users
                    vm.users = data;

                    //set a processing variable to show loading things
                    vm.processing = true;

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
        }]);