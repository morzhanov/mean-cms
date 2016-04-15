angular.module('mainApp')

    .directive('fdnput', [function () {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function (evt) {
                    var files = evt.target.files;
                    console.log(files[0].name);
                    console.log(files[0].size);
                });
            }
        }
    }])

    .controller('imageController', ['$scope', '$http', 'Image', function ($scope, $http, Image) {

        var vm  = this;

        $scope.stepsModel = [];

        $scope.submit = function () {
          console.log("submit");
        };

        $scope.LoadFilePath = function (element) {

            $scope.$apply(function (scope) {

                var files = element.files;

                var filePath = $scope.filePath;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var reader = new FileReader();

                    var id = "570bdb3779adb798146481f9";

                    var data = {
                        "url": "file:///" + element.value,
                        "type": "text/" + element.value.substring(
                            element.value.lastIndexOf('.') + 1),
                        "filename": "username.jpg"
                    };

                    $scope.submit();

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