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
        let currentAnswer = "";
        $scope.greeting = "Hello Angular!";
        $scope.games = [];
        $scope.playerCount = 1;
        $scope.currentGame = 0;
        $scope.currentQuestion = "";
        $scope.categoryIDs = [];
        $scope.categoryData = [];
        $scope.showQuestion = (question, answer) => {
            console.log(question);
            console.log($scope.games);
            $scope.games[$scope.currentGame].board.display = false;
            $scope.currentQuestion = question;
            currentAnswer = answer;
            console.log(currentAnswer);
        }

        // creating the game with the individual players.
        $scope.games[$scope.currentGame] = new Game($scope.playerCount);

        for(let i = 0; i < 5; i++) {
            $http({
                method: "GET",
                url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
            }).then((response) => {
                console.log(response.data);
                $scope.categoryData.push(response.data);
            }).then(() => {
                $scope.games[$scope.currentGame].createBoard($scope.categoryData);
                console.log($scope.games);
            });
        }
    }]);