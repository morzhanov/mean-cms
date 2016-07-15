angular.module('mainApp')

/**
 * Main Controller of this application
 */
    .controller('mainController', ['$rootScope',
        '$location',
        'HeightDetect',
        function ($rootScope, $location, HeightDetect) {

            var vm = this;

            HeightDetect.heightDetect();

            initLoaderView();

            vm.isA = function () {
              
                return false;
                
            };
            
        }]);

//method that manage site loader view visibility
function initLoaderView() {

    angular.element(document).ready(function () {
        angular.element('.loader_inner').fadeOut();
        angular.element('.loader').delay(400).fadeOut("slow");
    });

}