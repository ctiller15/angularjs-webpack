// const app = angular.module("main", ["customFilters"]);

// app.controller("mainController", ($scope) => {
//     $scope.title = "Hello World!"
// })

// TODO: Clean up code a bit. Refactor!

angular
    .module("mainAngularApp", [])
    .controller("mainAppController", ["$scope", "$http", ($scope, $http) => {

        $scope.games = [];
        $scope.playerCount = 3;
        $scope.currentGame = 0;
        $scope.currentQuestion = "";
        $scope.currentScore = 0;
        $scope.categoryData = [];
        $scope.playerAnswer = "";
        $scope.activeDailyDouble = false;
        $scope.dailyDoubleDisplay = false;

        const max = 18418;

        let currentAnswer = "";
        let currentAskedQuestion;
        let count = 0;


        $scope.resetGame = () => {
            $scope.currentGame += 1;
            $scope.categoryData = [];
            createGame();
        }

        $scope.showQuestion = (question, answer, score, parentID, indexID, dailyDouble) => {
            let questionAsked = $scope.games[$scope.currentGame].board.boardData[parentID].clues[indexID].asked;
            if(dailyDouble) {
                $scope.activeDailyDouble = true;
                $scope.dailyDoubleDisplay = true;
                console.log("Daily double is active!");
            }
            if(!questionAsked) {
                askQuestion(question, answer, score, parentID, indexID);
            } else {
                console.log("Question has been asked already!");
            }
        }

        $scope.submitPlayerAnswer = () => {
            let solved = false;
            let round = $scope.games[$scope.currentGame].currentRound; 
            let currentTurn = $scope.games[$scope.currentGame].currentTurn;
            let player = $scope.games[$scope.currentGame].players[currentTurn];
            // If their answer is correct...

            if($scope.playerAnswer == currentAnswer) {
                console.log("Sweet! You got it!!!");
                solved = true;
                updatePlayerScore(round, player, "pos");
            } else {
                console.log("BZZT! WRONG!!!");
                updatePlayerScore(round, player, "neg");                
                count++;
                $scope.games[$scope.currentGame].changeTurn();
            }
            // Now, reset the board.
            if(solved || count >= $scope.games[$scope.currentGame].players.length) {
                count = 0;
                resetQuestion();
            }
        }

        $scope.displayDDQuestion = () => {
            $scope.dailyDoubleDisplay = false;
        }

        const randomizeCategory = () => {
            return(Math.floor(Math.random() * max));
        }

        const updatePlayerScore = (round, playerObj, sign) => {
            let questionScore = sign === "pos" ? $scope.currentScore : -$scope.currentScore;
            if(round === 2) {
                playerObj.score += questionScore * 2;
            } else {
                playerObj.score += questionScore;
            }
        }

        const shuffleArray = (arr) => { // Shuffles an array, credit given to https://stackoverflow.com/users/310500/laurens-holst
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
            // Then pick a few values off of array.
            let returnedArr = newArr.slice(0,3);
            // Then return array.
            return returnedArr;
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
            let dailyDoubleQuestions = pickRandom(tempArr);
            for(let i = 0; i < dailyDoubleQuestions.length; i++) {
                dailyDoubleQuestions[i].dailyDouble = true;
            }
        };

        const getQuestionData = () => {
            let temp = {};
            temp.val = 0;
            for(let i = 0; i < 5; i++) {

                $http({
                    method: "GET",
                    url: `http://jservice.io/api/category?&id=${randomizeCategory()}`
                }).then((response) => {
                    response.data.clues.forEach((question) => {
                        question.asked = false;
                    });
                    $scope.categoryData.push(response.data);
                }).then(() => {
                    temp.val++;
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
            $scope.activeDailyDouble = false;
            $scope.dailyDoubleDisplay = true;
            $scope.currentQuestion = "";
            $scope.playerAnswer = "";   
            currentAskedQuestion.asked = true;
            $scope.games[$scope.currentGame].checkGameStatus();
        }

        const createGame = () => {
            $scope.games[$scope.currentGame] = new Game($scope.playerCount);
            getQuestionData();
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
                            // If we hit at least ONE false, we're fine.
                            if(this.board.boardData[i].clues[j].asked === false){
                                return;
                            }
                        }
                    }
                    // If we make it to this point, not a single false was found.
                    // console.log("Game over boys! We're going home!");
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
                this.wager = 0;
            }
        }
        
        class Board {
            constructor(data) {
                this.display = true;
                this.boardData = [];
            }
        }        
        // creating the game with the individual players.

        createGame();

    }]);