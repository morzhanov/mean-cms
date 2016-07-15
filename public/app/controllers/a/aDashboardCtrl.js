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

            //to justify viewport height
            $(".height-detect").css("height", $(window).height());

            //if user not logged in go to login page
            if (!Auth.isLoggedIn())
                $location.path('/admin/login');

            console.log('in admin dashboard controller');

            //set current content view as Home
            vm.contentUrl = 'app/views/admin/home.html';

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
                $location.path('/');
            };

            /**
             * Dashboard menu selectors methods
             */

            //Home menu section

            //go to home screen
            vm.toHome = function () {

                vm.toggleActiveClass('.btn-home');

                vm.contentUrl = 'app/views/admin/home.html';

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            //Pages menu section

            //show all pages
            vm.allPages = function () {

                vm.toggleActiveClass('.btn-all-pages');

                vm.contentUrl = "app/views/admin/page/all.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            //create new page
            vm.createPage = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                vm.toggleActiveClass('.btn-create-page');

                vm.contentUrl = "app/views/admin/page/single.html";

                $window.localStorage.setItem('single-page-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            //Posts menu section

            //get all posts
            vm.allPosts = function () {

                vm.toggleActiveClass('.btn-all-posts');

                vm.contentUrl = "app/views/admin/post/all.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            //create new post
            vm.createPost = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPostView');

                vm.toggleActiveClass('.btn-create-post');

                vm.contentUrl = "app/views/admin/post/single.html";

                $window.localStorage.setItem('single-post-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

        }]);