angular.module('mainApp')

    .controller('postController', ['$rootScope', '$window',
        function ($rootScope, $window) {

        var vm = this;

        vm.posts = [{
            _id: 1,
            title: "first post",
            desc: "some first description"
        }, {
            _id: 2,
            title: "second post",
            desc: "some second description"
        }];

        vm.editPost = function (id) {
            $window.localStorage.setItem('edit-post-id', id);

            $window.localStorage.setItem('dashboard-content', "app/views/pages/admin/post/post.html");

            $window.localStorage.setItem('single-post-edit-type', "edit");

            $rootScope.$emit('changeDashboardContent');
        }

    }])

    .controller('postEditController', ['$window', function ($window) {
        //also for post creating
        var vm = this;

        vm.postId = $window.localStorage.getItem('edit-post-id');

        vm.type = $window.localStorage.getItem('single-post-edit-type');

        //get post from server and fill fields

    }]);