angular.module('mainApp')

.controller('pageController', ['$rootScope', '$window', function ($rootScope,$window) {

    var vm = this;

    vm.pages = [{
        _id: 1,
        title: "first page",
        url: "http://someurl.com"
    },{
        _id: 2,
        title: "second page",
        url: "http://someotherurl.com"
    }];

    vm.editPage = function (id) {
        $window.localStorage.setItem('edit-page-id', id);

        $window.localStorage.setItem('dashboard-content',  "app/views/pages/admin/page/page.html");

        $window.localStorage.setItem('single-page-edit-type',  "edit");

        $rootScope.$emit('changeDashboardContent');
    }

}])

.controller('pageEditController', ['$window', function ($window) {
    //also for page creating
    var vm = this;

    vm.pageId = $window.localStorage.getItem('edit-page-id');

    vm.type = $window.localStorage.getItem('single-page-edit-type');

    //get page from server and fill fields

    //get page's posts and fill model
    vm.posts = [
        {
            _id: 1,
            title: "first post",
            desc: "some first description"
        },{
            _id: 2,
            title: "second post",
            desc: "some second description"
        }
    ];
}]);