angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", ($scope) => {
        $scope.greeting = "Hello Angular!";
    }]);