angular.module('mainApp')

/**
 * Controller that manage logic admin dashboard view and processes
 */
    .controller('aDashboardCtrl', ['$rootScope',
        'Auth',
        '$window',
        '$location',
        'aUser',
        'siteService',
        function ($rootScope, Auth, $window, $location, aUser, siteService) {

            var vm = this;

            vm.contentUrl = 'app/views/admin/home.html';

            if($location.path().substr(0,6) === '/admin')
            {
                $rootScope.$emit('hide-nav-menu');
            }
            else
            {
                $rootScope.$emit('show-nav-menu');
            }

            //to justify viewport height
            $(".height-detect").css("height", $(window).height());

            //if user not logged in go to login page
            if (!Auth.isLoggedIn())
                $location.path('/admin/login');
            
            localStorage.setItem('top-nav', 'app/views/admin/topNav.html');

            //Admin user Log Out method
            vm.doLogout = function () {

                Auth.logout();
                // reset all user info
                vm.user = {};
                $location.path('/admin/login');

            };

            console.log('in admin dashboard controller');

            //set current content view as Home
            if (!localStorage.getItem('dashboard-content')) {
                vm.contentUrl = 'app/views/admin/home.html';
                localStorage.setItem('dashboard-content', vm.contentUrl);
            }
            else
                vm.contentUrl = localStorage.getItem('dashboard-content');

            //get site settings
            vm.siteSettings = {
                title: siteService.getSiteTitle(),
                url: siteService.getSiteUrl()
            };

            //get data of current user
            aUser.current()
                .success(function (data) {
                    vm.userData = data;
                });

            vm.toSiteHome = function () {
                $rootScope.$emit('show-nav-menu');
                $location.path('/');
            };

            vm.toDashboard = function () {
                $rootScope.$emit('hide-nav-menu');
                $location.path('/admin/dashboard');
            };

            //methods toggles styles of dashboard menu items
            vm.toggleActiveClass = function (element) {

                angular.element('.dshd-menu-child-item a')
                    .css('color', '#fff');

                angular.element(element)
                    .css('color', '#ff904e');
            };

            /**
             * Dashboard menu selectors methods
             */

            //Home menu section

            //go to home screen
            vm.toHome = function () {

                vm.toggleActiveClass('.btn-home');

                vm.contentUrl = 'app/views/admin/home.html';

                localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            //Pages menu section

            //show all pages
            vm.allPages = function () {

                vm.toggleActiveClass('.btn-all-pages');

                vm.contentUrl = "app/views/admin/page/all.html";

                localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            //create new page
            vm.createPage = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                vm.toggleActiveClass('.btn-create-page');

                vm.contentUrl = "app/views/admin/page/single.html";

                localStorage.setItem('single-page-edit-type', "create");

                localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            //Posts menu section

            //get all posts
            vm.allPosts = function () {

                vm.toggleActiveClass('.btn-all-posts');

                vm.contentUrl = "app/views/admin/post/all.html";

                localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            //create new post
            vm.createPost = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPostView');

                vm.toggleActiveClass('.btn-create-post');

                vm.contentUrl = "app/views/admin/post/single.html";

                localStorage.setItem('single-post-edit-type', "create");

                localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            //Settings menu items

            //All Users
            vm.allUsers = function () {

                vm.contentUrl = "app/views/admin/user/all.html";

                localStorage.setItem('dashboard-content', vm.contentUrl);

                aUser.all()
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
                    });
            };

            vm.createNewUser = function () {

                vm.contentUrl = "app/views/admin/user/single.html";

                localStorage.setItem('dashboard-content', vm.contentUrl);
                localStorage.setItem('user-edit-type', 'create');
            };

            vm.editUser = function (id) {

                vm.contentUrl = "app/views/admin/user/single.html";

                localStorage.setItem('user-id-to-edit', id);
                localStorage.setItem('dashboard-content', vm.contentUrl);
                localStorage.setItem('user-edit-type', 'edit');
            };

            //PAGE EVENTS
            $rootScope.$on('changeDashboardContent', function (event, data) {
                vm.contentUrl = localStorage.getItem('dashboard-content');
            });
        }]);