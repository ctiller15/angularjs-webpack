// const app = angular.module("main", ["customFilters"]);

// app.controller("mainController", ($scope) => {
//     $scope.title = "Hello World!"
// })

const max = 18418;

const randomizeCategory = () => {
    return(Math.floor(Math.random() * max));
}

class Game {
    constructor(playerCount) {
        this.players = [];
        this.createPlayers = () => {
            for(let i = 0; i < playerCount; i++) {
                this.players.push(new Player());
            }
        }
        this.createPlayers();
    }
}

class Player {
    constructor() {
        this.score = 0;
        this.updateScore = (points) => {
            this.score += points;
        }
    }
}

angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {
        $scope.greeting = "Hello Angular!";
        $scope.games = [];
        $scope.playerCount = 1;
        $scope.categoryIDs = [];
        $scope.categoryData = [];
        $scope.showQuestion = (question) => {
            console.log(question);
        }

        for(let i = 0; i < 5; i++) {
            $http({
                method: "GET",
                url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
            }).then((response) => {
                console.log(response.data);
                $scope.categoryData.push(response.data);
            });
        }

        // creating the game with the individual players.
        $scope.games[0] = new Game($scope.playerCount);
        console.log($scope.games[0]);
        


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