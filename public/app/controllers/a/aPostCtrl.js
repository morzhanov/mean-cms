angular.module('mainApp')

/**
 * Controller that retrieve all posts from server,
 * delete single post, display all posts on view
 */
    .controller('aPostCtrl', ['$rootScope', '$window', 'aPost',
        function ($rootScope, $window, aPost) {

            var vm = this;

            vm.processing = true;

            //get all posts
            vm.getAllPosts = function () {
                aPost.all()
                    .success(function (data) {
                        vm.posts = data;

                        for (var i = 0; i < vm.posts.length; ++i) {
                            if (vm.posts[i].content.length > 40) {
                                vm.posts[i].desc = vm.posts[i].content.substring(0, 39);
                            }
                            else {
                                vm.posts[i].desc = vm.posts[i].content;
                            }
                        }

                        vm.processing = false;

                    });
            };

            vm.getAllPosts();

            vm.editPost = function (id) {
                $window.localStorage.setItem('edit-post-id', id);

                $window.localStorage.setItem('dashboard-content', "app/views/admin/post/single.html");

                $window.localStorage.setItem('single-post-edit-type', "edit");

                $rootScope.$emit('changeDashboardContent');
            };

            vm.deletePost = function (id) {

                aPost.delete(id)
                    .success(function () {
                        alert('post successfully deleted!');

                        vm.getAllPosts();
                    });
            };

        }])

    /**
     * Controller for single post creating/editing
     */
    .controller('aPostEditCtrl', ['$rootScope', '$window', 'aPost',
        function ($rootScope, $window, aPost) {
            //also for post creating
            var vm = this;

            vm.message = "";

            vm.postId = $window.localStorage.getItem('edit-post-id');

            vm.type = $window.localStorage.getItem('single-post-edit-type');

            vm.postData = {};

            $rootScope.$on('toggleEditPostView', function () {
                vm.postData = {};
                vm.type = 'create';
            });

            //if it's edit type get post from server and fill fields
            if (vm.type == 'edit') {
                aPost.get(vm.postId)
                    .success(function (data) {

                        vm.postData.title = data.title;
                        vm.postData.content = data.content;
                        vm.postData.date = data.date;
                    });
            }

            vm.savePost = function () {

                if (vm.type == 'edit')
                    aPost.update(vm.postId, vm.postData)
                        .success(function () {
                            vm.message = "Post successfully edited!";
                        });
                else
                    aPost.create(vm.postData)
                        .success(function () {
                            vm.message = "Post successfully created!";
                        });

            };
        }]);