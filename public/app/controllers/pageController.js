angular.module('mainApp')

    .controller('pageController', ['$rootScope', '$window', 'Page',
        function ($rootScope, $window, Page) {

            var vm = this;

            //get all pages
            vm.getAllPages = function () {
                Page.all()
                    .success(function (data) {
                        vm.pages = data;

                        for (var i = 0; i < vm.pages.length; ++i) {
                            if (vm.pages[i].content.length > 40) {
                                vm.pages[i].desc = vm.pages[i].content.substring(0, 39);
                            }
                            else {
                                vm.pages[i].desc = vm.pages[i].content;
                            }
                        }
                    });
            };

            vm.getAllPages();

            vm.editPage = function (id) {
                $window.localStorage.setItem('edit-page-id', id);

                $window.localStorage.setItem('dashboard-content', "app/views/pages/admin/page/page.html");

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

    .controller('pageEditController', ['$rootScope', '$window', 'Page',
        function ($rootScope, $window, Page) {
            //also for page creating
            var vm = this;

            vm.id = $window.localStorage.getItem('edit-page-id');

            vm.type = $window.localStorage.getItem('single-page-edit-type');

            vm.message = "";

            vm.pageData = {};

            $rootScope.$on('toggleEditPageView', function () {
                vm.pageData = {};
                vm.type = 'create';
            });

            //if it's edit type get post from server and fill fields
            if (vm.type == 'edit') {
                Page.get(vm.id)
                    .success(function (data) {

                        vm.pageData.title = data.title;
                        vm.pageData.content = data.content;
                        vm.pageData.url = data.url;
                        vm.pageData.date = data.date;
                    });
            }

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
        }]);