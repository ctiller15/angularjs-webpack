// const app = angular.module("main", ["customFilters"]);

// app.controller("mainController", ($scope) => {
//     $scope.title = "Hello World!"
// })

const max = 18418;

const randomizeCategory = () => {
    return(Math.floor(Math.random() * max));
}

angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {
        $scope.greeting = "Hello Angular!";
        $scope.categoryIDs = [];
        $scope.categoryData = [];

        for(let i = 0; i < 5; i++) {
            $http({
                method: "GET",
                url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
            }).then((response) => {
                console.log(response.data);
                $scope.categoryData.push(response.data);
            });
        }

        // for(let i = 0; i < 5; i++) {
        //     $http({
        //         method: "GET",
        //         url: "http://jservice.io/api/random?"
        //     }).then(response => {
        //         // console.log(response.data);
        //         $scope.categoryIDs.push(response.data[0].category_id);
        //         return response.data[0].category_id;
        //     }).then((cat_id) => {
        //         console.log(cat_id);
        //         $http({
        //             method: "GET",
        //             url: `http://jservice.io/api/category?&id=${cat_id}`
        //         }).then(response => {
        //             console.log(response.data);
        //             $scope.categoryData.push(response.data);
        //         })
        //     });
        // }


    }]);