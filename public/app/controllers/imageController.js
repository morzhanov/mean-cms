angular.module('mainApp')

    .controller('imageController', ['$scope', '$http', 'Image', function ($scope, $http, Image) {

        var vm  = this;

        $scope.stepsModel = [];

        $scope.LoadFilePath = function (element) {

            $scope.$apply(function (scope) {

                var files = element.files;

                var filePath = $scope.filePath;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();

                    reader.onload = $scope.imageIsLoaded;
                    reader.readAsDataURL(file);
                }
            });
        };

        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.stepsModel.push(e.target.result);
            });
        };
    }]);