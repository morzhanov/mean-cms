angular.module('mainApp')

    .controller('dashboardController', ['$scope', 'HeightDetect',
        function ($scope, HeightDetect) {

            var vm = this;

            HeightDetect.heightDetect();

            vm.postsCollapse = false;

            $scope.isOpen = false;
        }]);