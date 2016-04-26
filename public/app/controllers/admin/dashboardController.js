angular.module('mainApp')

    .controller('dashboardController', ['$rootScope',
        'HeightDetect',
        '$window',
        '$q',
        'User',
        '$location',
        function ($rootScope, HeightDetect, $window, $q, User,$location) {

            var vm = this;

            /**
             * navbar section
             */
            vm.user = {};

            vm.toDashboard = function () {

                $rootScope.$emit('$routeChangeStart');

                $location.path('/admin-dashboard');
            };

            vm.toSiteHome = function () {

                $location.path('/');

                $rootScope.$emit('$routeChangeStart');
            };

            var deferred = $q.defer();

            User.current().success(function (res) {
                "use strict";

                vm.currentUser = res;

                vm.user = User.currentUser;
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

            if ($window.localStorage.getItem('dashboard-content') !== "undefined")
                vm.contentUrl = $window.localStorage.getItem('dashboard-content');
            else {
                vm.contentUrl = "app/views/admin/home.html";
                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            }

            $rootScope.$on('changeDashboardContent', function () {
                vm.contentUrl = $window.localStorage.getItem('dashboard-content');
            });

            HeightDetect.heightDetect();

            vm.toggleActiveClass = function (element) {

                angular.element('.dshd-menu-child-item a')
                    .css('color', '#fff');

                angular.element(element)
                    .css('color', '#ff904e');
            };

            vm.home = function () {

                vm.toggleActiveClass('.btn-home');

                vm.contentUrl = "app/views/admin/home.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPages = function () {

                vm.toggleActiveClass('.btn-all-pages');

                vm.contentUrl = "app/views/admin/page/pages.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPosts = function () {

                vm.toggleActiveClass('.btn-all-posts');

                vm.contentUrl = "app/views/admin/post/posts.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            vm.createPost = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPostView');

                vm.toggleActiveClass('.btn-create-post');

                vm.contentUrl = "app/views/admin/post/post.html";

                $window.localStorage.setItem('single-post-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            vm.createPage = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPageView');

                vm.toggleActiveClass('.btn-create-page');

                vm.contentUrl = "app/views/admin/page/page.html";

                $window.localStorage.setItem('single-page-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };
        }]);