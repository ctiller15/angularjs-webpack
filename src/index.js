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
        this.board = new Board();
        this.createBoard = (data) => {
            this.board.boardData = data;
        }
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

class Board {
    constructor(data) {
        this.display = true;
        this.boardData = [];
    }
}

angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {
        $scope.greeting = "Hello Angular!";
        $scope.games = [];
        $scope.playerCount = 1;
        $scope.currentGame = 0;
        $scope.categoryIDs = [];
        $scope.categoryData = [];
        $scope.showQuestion = (question) => {
            console.log(question);
            console.log($scope.games);
            // $scope.games[$scope.currentGame].board.display = false;
        }

        // creating the game with the individual players.
        $scope.games[$scope.currentGame] = new Game($scope.playerCount);
        console.log($scope.games[$scope.currentGame]);

        for(let i = 0; i < 5; i++) {
            $http({
                method: "GET",
                url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
            }).then((response) => {
                console.log(response.data);
                $scope.categoryData.push(response.data);
                // $scope.games[$scope.currentGame].board.push(response.data);
                // console.log($scope.games[$scope.currentGame].board);
            }).then(() => {
                $scope.games[$scope.currentGame].createBoard($scope.categoryData);
                console.log($scope.games);
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