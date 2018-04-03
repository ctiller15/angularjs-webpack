// const app = angular.module("main", ["customFilters"]);

// app.controller("mainController", ($scope) => {
//     $scope.title = "Hello World!"
// })

// TODO: Clean up code a bit. Refactor!



angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {

        const max = 18418;

        const randomizeCategory = () => {
            return(Math.floor(Math.random() * max));
        }

        function shuffleArray(arr) { // Shuffles an array, credit given to https://stackoverflow.com/users/310500/laurens-holst
            let randArr = arr.slice();
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = randArr[i];
                randArr[i] = randArr[j];
                randArr[j] = temp;
            }
            return randArr;
        }

        const pickRandom = (arr) => {
            // Shuffle array first. (durstenfield shuffle)
            console.log(`We've shuffled now!!!`);
            let newArr = shuffleArray(arr);
            console.log(newArr);
            // Then pick a few values off of array.
            // Then return array.
        }

        const createDailyDoubles = () => {
            let tempArr = [];
            // console.log($scope.categoryData);
            for(let i = 0; i < $scope.categoryData.length; i++) {
                for(let j = 0; j < 5; j++) {
                    // console.log($scope.categoryData[i].clues[j]);
                    $scope.categoryData[i].clues[j].dailyDouble = false;
                    tempArr.push($scope.categoryData[i].clues[j]);
                }
            }
            console.log(tempArr);
            pickRandom(tempArr);
        };
        
        class Game {
            constructor(playerCount) {
                this.players = [];
                this.createPlayers = () => {
                    for(let i = 0; i < playerCount; i++) {
                        this.players.push(new Player());
                    }
                }
                this.createPlayers();
                this.currentTurn = 0;
                this.changeTurn = () => {
                    this.currentTurn += 1;
                    // If we go higher than the current number of players, switch back to the first.
                    if(this.currentTurn >= this.players.length) {
                        this.currentTurn = 0;
                    }
                    // Change the individual statuses.
                    for(let i = 0; i < this.players.length; i++) {
                        if(i !== this.currentTurn) {
                            this.players[i].isCurrentTurn = false;
                        } else {
                            this.players[i].isCurrentTurn = true;
                        }
                    }
                    console.log(this.currentTurn);
        
                }
                this.board = new Board();
                this.createBoard = (data) => {
                    this.board.boardData = data;
                    createDailyDoubles();
                }
                this.gameOver = false;
                this.checkGameStatus = () => {
                    console.log(this.board.boardData);
                    let boardLen = this.board.boardData.length;
                    for(let i = 0; i < boardLen; i++) {
                        for(let j = 0; j < 5; j++) {
                            console.log(this.board.boardData[i].clues[j].asked);
                            // If we hit at least ONE false, we're fine.
                            if(this.board.boardData[i].clues[j].asked === false){
                                console.log("We're fine! Bail out!");
                                return;
                            }
                        }
                    }
                    // If we make it to this point, not a single false was found.
                    console.log("Game over boys! We're going home!");
                    this.changeRound();
        
                    // Run a function to end the game here.
                }
                // Tells us the round of the current game. 2 is double jeopardy, 3 is final jeopardy.
                this.currentRound = 1;
                this.changeRound = () => {
                    this.currentRound++;
                    // If we've had more than 3 rounds, the game ends.
                    if(this.currentRound > 3) {
                        this.gameOver = true;
                    } else {
                        // Otherwise, reset the board for the next round.
                        $scope.categoryData = [];
                        getQuestionData();
                    }
                }
            }
        }
        
        class Player {
            constructor() {
                this.score = 0;
                this.updateScore = (points) => {
                    this.score += points;
                }
                this.isCurrentTurn = false;
            }
        }
        
        class Board {
            constructor(data) {
                this.display = true;
                this.boardData = [];
            }
        }        

        let currentAnswer = "";
        let currentAskedQuestion;
        let count = 0;


        
        const getQuestionData = () => {
            let temp = {};
            temp.val = 0;
            for(let i = 0; i < 5; i++) {

                $http({
                    method: "GET",
                    url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
                }).then((response) => {
                    console.log(response.data);
                    response.data.clues.forEach((question) => {
                        question.asked = false;
                    });
                    $scope.categoryData.push(response.data);
                }).then(() => {
                    temp.val++;
                    console.log(temp.val);
                    // if we're on the end of the loop, then we want to create the board and start the game.
                    if(temp.val === 5) {
                        $scope.games[$scope.currentGame].createBoard($scope.categoryData);
                        console.log($scope.games);
                        $scope.games[$scope.currentGame].checkGameStatus();
                    }

                });
            }
        }

        const askQuestion = (question, answer, score, parentID, indexID) => {
            $scope.games[$scope.currentGame].board.display = false;
            $scope.currentQuestion = question;
            $scope.currentScore = score;
            currentAnswer = answer;
            currentAskedQuestion = $scope.games[$scope.currentGame].board.boardData[parentID].clues[indexID];
            console.log(currentAnswer);
        }

        const resetQuestion = () => {
            $scope.games[$scope.currentGame].board.display = true;
            currentAnswer = "";
            $scope.currentQuestion = "";
            $scope.playerAnswer = "";   
            currentAskedQuestion.asked = true;
            $scope.games[$scope.currentGame].checkGameStatus();
        }

        const createGame = () => {
            $scope.games[$scope.currentGame] = new Game($scope.playerCount);

            getQuestionData();
        }

        $scope.resetGame = () => {
            $scope.currentGame += 1;
            $scope.categoryData = [];
            console.log($scope.currentGame);
            createGame();
            console.log($scope.games);
        }

        $scope.games = [];
        $scope.playerCount = 3;
        $scope.currentGame = 0;
        $scope.currentQuestion = "";
        $scope.currentScore = 0;
        $scope.categoryData = [];

        $scope.showQuestion = (question, answer, score, parentID, indexID) => {
            let questionAsked = $scope.games[$scope.currentGame].board.boardData[parentID].clues[indexID].asked;
            if(!questionAsked) {
                askQuestion(question, answer, score, parentID, indexID);
            } else {
                console.log("Question has been asked already!");
            }

        }

        $scope.playerAnswer = "";

        $scope.submitPlayerAnswer = () => {
            let solved = false;
            // If their answer is correct...
            let currentTurn = $scope.games[$scope.currentGame].currentTurn;
            if($scope.playerAnswer == currentAnswer) {
                console.log("Sweet! You got it!!!");
                solved = true;
                if($scope.games[currentGame].currentRound === 2) {
                    $scope.games[$scope.currentGame].players[currentTurn].score += $scope.currentScore * 2;
                } else {
                    $scope.games[$scope.currentGame].players[currentTurn].score += $scope.currentScore;
                }

                console.log($scope.games);
            } else {
                console.log("BZZT! WRONG!!!");
                if($scope.games[$scope.currentGame].currentRound === 2) {
                    $scope.games[$scope.currentGame].players[currentTurn].score -= $scope.currentScore * 2;
                } else {
                    $scope.games[$scope.currentGame].players[currentTurn].score -= $scope.currentScore;
                }
                count++;
                console.log(count);
                $scope.games[$scope.currentGame].changeTurn();
            }
            // Now, reset the board.
            if(solved || count >= $scope.games[$scope.currentGame].players.length) {
                count = 0;
                resetQuestion();
            }

        }

        // creating the game with the individual players.


        createGame();


    }]);