angular.module('mainApp')

/**
 * Main Controller of this application
 */
    .controller('mainController', ['$rootScope',
        '$location',
        'HeightDetect',
        function ($rootScope, $location, HeightDetect) {

            var vm = this;

            if (localStorage.getItem('is-nav-menu'))
                vm.navMenuUrl = 'app/views/public/nav-menu.html';
            else
                vm.navMenuUrl = null;

            $rootScope.$on('show-nav-menu', function (event, data) {

                vm.navMenuUrl = 'app/views/public/nav-menu.html';

            });

            $rootScope.$on('hide-nav-menu', function (event, data) {

                vm.navMenuUrl = null;

            });

            vm.topNavUrl = null;

            if (localStorage.getItem('top-nav'))
                vm.topNavUrl = localStorage.getItem('top-nav');

            HeightDetect.heightDetect();

            initLoaderView();

            vm.isA = function () {

                return false;

            };

        }])

    .controller('navMenuCtrl', ['$rootScope',
        '$location',
        'HeightDetect',
        function ($rootScope, $location, HeightDetect) {


        }]);

//method that manage site loader view visibility
function initLoaderView() {

    angular.element(document).ready(function () {
        angular.element('.loader_inner').fadeOut();
        angular.element('.loader').delay(400).fadeOut("slow");
    });

}