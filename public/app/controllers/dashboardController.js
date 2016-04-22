angular.module('mainApp')

    .controller('dashboardController', ['$rootScope', 'HeightDetect', '$window',
        function ($rootScope, HeightDetect, $window) {

            var vm = this;

            if ($window.localStorage.getItem('dashboard-content') !== "undefined")
                vm.contentUrl = $window.localStorage.getItem('dashboard-content');
            else {
                vm.contentUrl = "app/views/pages/admin/home.html";
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

                vm.contentUrl = "app/views/pages/admin/home.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPages = function () {

                vm.toggleActiveClass('.btn-all-pages');

                vm.contentUrl = "app/views/pages/admin/page/pages.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPosts = function () {

                vm.toggleActiveClass('.btn-all-posts');

                vm.contentUrl = "app/views/pages/admin/post/posts.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            vm.createPost = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPostView');

                vm.toggleActiveClass('.btn-create-post');

                vm.contentUrl = "app/views/pages/admin/post/post.html";

                $window.localStorage.setItem('single-post-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };

            vm.createPage = function ($event) {

                //to stop bubbles effect
                if ($event != undefined)
                    $event.stopPropagation();

                $rootScope.$emit('toggleEditPageView');

                vm.toggleActiveClass('.btn-create-page');

                vm.contentUrl = "app/views/pages/admin/page/page.html";

                $window.localStorage.setItem('single-page-edit-type', "create");

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };
        }]);