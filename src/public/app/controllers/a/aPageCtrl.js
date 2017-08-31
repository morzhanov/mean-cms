angular.module('mainApp')

/**
 * Controller that retrieve all pages from server,
 * delete single page, display all pages on view
 */
    .controller('aPageCtrl', ['$rootScope', '$window', 'aPage',
        function ($rootScope, $window, aPage) {

            var vm = this;

            vm.processing = true;

            //get all pages
            vm.getAllPages = function () {
                aPage.all()
                    .success(function (data) {
                        vm.pages = data;

                        vm.processing = false;
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

                aPage.delete(id)
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
    .controller('aPageEditCtrl', ['$rootScope', '$window', 'aPage', 'aPost', 'siteService',
        function ($rootScope, $window, aPage, aPost, siteService) {
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
                aPage.get(vm.id)
                    .success(function (data) {

                        vm.pageData.title = data.title;
                        vm.pageData.contentHeader = data.contentHeader;
                        vm.pageData.contentFooter = data.contentFooter;
                        vm.pageData.url = data.url;
                        vm.pageData.date = data.date;

                        aPage.allPosts(vm.id)
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
                aPage.deletePostFromPage(page_id, post_id)
                    .success(function (data) {

                        aPage.allPosts(vm.id)
                            .success(function (posts) {
                                vm.pageData.posts = posts;
                                vm.message = "Post with id = " + post_id
                                    + " successfully deleted from current page!";
                            });
                    });
            };

            vm.savePage = function () {

                if (vm.type == 'edit')
                    aPage.update(vm.id, vm.pageData)
                        .success(function () {
                            vm.message = "Page successfully edited!";
                        });
                else
                    aPage.create(vm.pageData)
                        .success(function () {
                            vm.message = "Page successfully created!";
                        });

            };

            vm.toggleAddPostMenu = false;

            vm.addPost = function () {

                if (!vm.toggleAddPostMenu) {
                    angular.element('.btn-add-page-post')
                        .html('-');

                    aPost.all().success(function (data) {

                        /**
                         * delete from all posts posts, that already
                         * present on current page
                         */
                        if (vm.pageData)
                            if (vm.pageData.posts)
                                if (vm.pageData.posts.length > 0)
                                    for (var i = 0; i < data.length; ++i) {
                                        for (var j = 0; j < vm.pageData.posts.length; ++j)
                                            if (data[i]._id == vm.pageData.posts[j]._id) {
                                                data.splice(i, 1);
                                                --i;
                                                break;
                                            }
                                    }

                        if (data.length == 0)
                            vm.allPosts = undefined;
                        else
                            vm.allPosts = data;
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

                aPost.get(id)
                    .success(function (post) {
                        "use strict";

                        vm.pageData.posts.push(post);

                        aPage.update(vm.id, vm.pageData)
                            .success(function () {
                                vm.message = "Post successfully added to page!";
                            });
                    });
            };
        }]);