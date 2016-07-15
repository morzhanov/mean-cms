angular.module('mainApp')

/**
 * Controller that retrieve all pages from server,
 * delete single page, display all pages on view
 */
    .controller('pageController', ['$rootScope', '$window', 'Page',
        function ($rootScope, $window, Page) {

            var vm = this;

            //get all pages
            vm.getAllPages = function () {
                Page.all()
                    .success(function (data) {
                        vm.pages = data;
                    });
            };

            vm.getAllPages();

            vm.editPage = function (id) {
                $window.localStorage.setItem('edit-page-id', id);

                $window.localStorage.setItem('dashboard-content', "app/views/admin/page/single.html");

                $window.localStorage.setItem('single-page-edit-type', "edit");

                $rootScope.$emit('changeDashboardContent');
            };

            vm.deletePage = function (id) {

                Page.delete(id)
                    .success(function () {
                        alert('page successfully deleted!');

                        vm.getAllPages();
                    });
            };

        }])

    /**
     * Controller for single page creating/editing
     * also manage all posts of single page (show all posts, delete post from page)
     */
    .controller('aPageEditCtrl', ['$rootScope', '$window', 'Page', 'Post', 'siteService',
        function ($rootScope, $window, Page, Post, siteService) {
            //also for page creating
            var vm = this;

            vm.id = $window.localStorage.getItem('edit-page-id');

            vm.type = $window.localStorage.getItem('single-page-edit-type');

            vm.message = "";

            vm.pageData = {};

            vm.allPostsTemplate = 'app/views/admin/page/pagePosts.html';

            $rootScope.$on('toggleEditPageView', function () {
                vm.pageData = {};
                vm.type = 'create';
            });

            //if it's edit type get post from server and fill fields
            if (vm.type == 'edit') {
                Page.get(vm.id)
                    .success(function (data) {

                        vm.pageData.title = data.title;
                        vm.pageData.contentHeader = data.contentHeader;
                        vm.pageData.contentFooter = data.contentFooter;
                        vm.pageData.url = data.url;
                        vm.pageData.date = data.date;

                        Page.allPosts(vm.id)
                            .success(function (posts) {
                                vm.pageData.posts = posts;
                            });
                    });
            }
            else {
                vm.pageData.title = 'Example page Title';
                vm.pageData.contentFooter = 'Example page Footer Content';
                vm.pageData.contentHeader = 'Example page Header Content';
                vm.pageData.url = siteService.getSiteUrl() + 'example_page_url';
                vm.pageData.date = new Date();
            }

            vm.deletePostFromPage = function (page_id, post_id) {

                /**
                 * remove element from angular model
                 */
                var idx = vm.pageData.posts.indexOf(post_id);

                if (idx > -1)
                    vm.pageData.posts.splice(idx, 1);

                /**
                 * remove element from servers model
                 */
                Page.deletePostFromPage(page_id, post_id)
                    .success(function (data) {

                        Page.allPosts(vm.id)
                            .success(function (posts) {
                                vm.pageData.posts = posts;
                                vm.message = "Post with id = " + post_id
                                    + " successfully deleted from current page!";
                            });
                    });
            };

            vm.savePage = function () {

                if (vm.type == 'edit')
                    Page.update(vm.id, vm.pageData)
                        .success(function () {
                            vm.message = "Page successfully edited!";
                        });
                else
                    Page.create(vm.pageData)
                        .success(function () {
                            vm.message = "Page successfully created!";
                        });

            };

            vm.toggleAddPostMenu = false;

            vm.addPost = function () {

                if (!vm.toggleAddPostMenu) {
                    angular.element('.btn-add-page-post')
                        .html('-');

                    Post.all().success(function (data) {

                        vm.allPosts = data;

                        /**
                         * delete from all posts posts, that already
                         * present on current page
                         */
                        for (var i = 0; i < vm.allPosts.length; ++i) {
                            for (var j = 0; j < vm.pageData.posts.length; ++j)
                                if (vm.allPosts[i]._id == vm.pageData.posts[j]._id) {
                                    vm.allPosts.splice(i, 1);
                                    --i;
                                    break;
                                }
                        }

                        if (vm.allPosts.length == 0)
                            vm.allPosts = undefined;
                    });
                }
                else {
                    angular.element('.btn-add-page-post')
                        .html('+');
                }

                vm.toggleAddPostMenu = !vm.toggleAddPostMenu;
            };

            vm.addThisPost = function (id) {

                if (vm.pageData.posts == undefined)
                    vm.pageData.posts = [];

                Post.get(id)
                    .success(function (post) {
                        "use strict";

                        vm.pageData.posts.push(post);

                        Page.update(vm.id, vm.pageData)
                            .success(function () {
                                vm.message = "Post successfully added to page!";
                            });
                    });
            };
        }]);