angular.module('mainApp')

    .controller('dashboardController', ['$rootScope', 'HeightDetect', '$window',
        function ($rootScope, HeightDetect, $window) {

            var vm = this;

            if ($window.localStorage.getItem('dashboard-content') !== "undefined")
                vm.contentUrl = $window.localStorage.getItem('dashboard-content');
            else
            {
                vm.contentUrl = "app/views/pages/admin/home.html";
                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            }

            $rootScope.$on('changeDashboardContent', function () {
                vm.contentUrl = $window.localStorage.getItem('dashboard-content');
            });

            HeightDetect.heightDetect();

            vm.home = function () {

                vm.contentUrl = "app/views/pages/admin/home.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPages = function () {

                vm.contentUrl = "app/views/pages/admin/page/pages.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);

            };

            vm.allPosts = function () {

                vm.contentUrl = "app/views/pages/admin/post/posts.html";

                $window.localStorage.setItem('dashboard-content', vm.contentUrl);
            };
        }]);