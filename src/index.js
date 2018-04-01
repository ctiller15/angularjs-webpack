// const app = angular.module("main", ["customFilters"]);

// app.controller("mainController", ($scope) => {
//     $scope.title = "Hello World!"
// })

// TODO: Clean up code a bit. Refactor!

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

// class BoardQuestion {
//     constructor() {
//         this.question = "";
//         this.asked = false;
//     }
// }

angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {
        let currentAnswer = "";
        let currentAskedQuestion;
        $scope.greeting = "Hello Angular!";
        $scope.games = [];
        $scope.playerCount = 1;
        $scope.currentGame = 0;
        $scope.currentQuestion = "";
        $scope.currentScore = 0;
        $scope.categoryIDs = [];
        $scope.categoryData = [];
        $scope.showQuestion = (question, answer, score, parentID, indexID) => {
            console.log(question);
            console.log($scope.games);
            $scope.games[$scope.currentGame].board.display = false;
            $scope.currentQuestion = question;
            $scope.currentScore = score;
            currentAnswer = answer;
            console.log(currentAnswer);
            console.log(parentID, indexID);
            currentAskedQuestion = $scope.games[$scope.currentGame].board.boardData[parentID].clues[indexID];
            console.log(currentAskedQuestion);
        }

        $scope.playerAnswer = "";

        $scope.submitPlayerAnswer = () => {
            console.log($scope.playerAnswer, currentAnswer);
            if($scope.playerAnswer == currentAnswer) {
                console.log("Sweet! You got it!!!");
                $scope.games[$scope.currentGame].players[0].score += $scope.currentScore;
                console.log($scope.games);
            }
            // Now, reset the board.
            $scope.games[$scope.currentGame].board.display = true;
            currentAnswer = "";
            $scope.currentQuestion = "";
            $scope.playerAnswer = "";   
            currentAskedQuestion.asked = true;
            // $scope.games[$scope.currentGame].board.boardData[]         
        }

        // creating the game with the individual players.
        $scope.games[$scope.currentGame] = new Game($scope.playerCount);

        for(let i = 0; i < 5; i++) {
            $http({
                method: "GET",
                url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
            }).then((response) => {
                console.log(response.data);
                // response.data.asked = false;
                response.data.clues.forEach((question) => {
                    question.asked = false;
                });
                $scope.categoryData.push(response.data);
            }).then(() => {
                $scope.games[$scope.currentGame].createBoard($scope.categoryData);
                console.log($scope.games);
            });
        }
    }]);