//querySelectors for HTML elements
const timerElement = document.getElementById("timer-element");
const playerStats = document.getElementById("player-stats");
const playerOneMenu = document.getElementById("player-one-menu");
const playerScoreElement = document.getElementById("player-score");
const guessThisState = document.getElementById("guess-this-state");
const playerAttempts = document.getElementById("player-attempts");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

//variables use to keep track of game state
let start = Date.now();
let gameStartedCheck = false;
let guessAttempts = 3;
let playerScore = 0;
let randomStateIndex;

//nodelist used for map reference
const stateList = document.querySelectorAll(".state-name");

//iterable real array for giving states for players to guess
const randomStateList = [];
stateList.forEach((element) => {
  randomStateList.push(element);
});

//adds event listeners to highlight whatever state players hover over, by adding corresponding CSS classes
stateList.forEach((index) => {
  index.addEventListener("mouseenter", () => {
    index.classList.add("highlight");
  });
  index.addEventListener("mouseleave", () => {
    index.classList.remove("highlight");
  });
});

//ALTERNATE FORMAT FOR REMOVING INDEX FROM RANDOMSTATELIST ARRAY
// console.log(randomStateList.indexOf(document.querySelector('#MT')))

//game function
const stateClicked = (event) => {
  // get element ID of clicked state to change color
  const stateSelectElement = document.getElementById(event.target.id);
  //get element full state name
  const stateSelectName = event.target.getAttribute("data-name");
  //get element abbreviation
  const stateSelectAbbreviation = event.target.getAttribute("data-id");

  // DEBUG: reports html element on hover to the console
  // event.target.addEventListener("mouseover", () => {
  //   (console.log(stateSelectElement))
  // });

  //stops function if player doesnt click on a valid state
  if (stateSelectElement.classList.contains("state-name") == false) {
    return;
  }
  if (stateSelectElement.id == "svg") {
    return;
  }

  if (randomStateList.length < 1 && playerScore < 50) {
    timerFunction();
    guessThisState.textContent = `You got a score of ${playerScore} press the Restart Game button or the Get new state button to restart`;
  } else if (randomStateList.length < 1 && playerScore == 50) {
    guessThisState.textContent = `Wow! you must be a true patriot you got all 50 states! Press the Restart Game button or the Get new state button and see if you can get all 50 again`;
  }
  //compares stateSelectName variable and results from the generateRandomState function to check for correct answers
  const answerCheck = () => {
    if (randomState === stateSelectName) {
      guessAttempts = 3;
      if (randomStateList.length >= 1) {
        randomStateList.splice(randomStateIndex, 1);
        playerScore++;
        getRandomState();
        playerScoreElement.classList.add("correct-blink-class");
        playerScoreElement.addEventListener(
          "animationend",
          () => playerScoreElement.classList.remove("correct-blink-class"),
          { once: true }
        );
      }
      if (randomStateList.length < 1) {
        start = Date.now();
      }
      // getRandomState();
      playerScoreElement.textContent = `Score:  ${playerScore}`;
      playerAttempts.textContent = `Attempts: ${guessAttempts}`;
      stateSelectElement.classList.add("correct");
      return;
    } else {
      guessAttempts--;
      if (guessAttempts == 0) {
        guessAttempts = 3;
        randomStateList[randomStateIndex].classList.add("wrong");
        randomStateList.splice(randomStateIndex, 1);
        getRandomState();
      }
      playerAttempts.classList.add("wrong-blink-class");
      playerAttempts.addEventListener(
        "animationend",
        () => playerAttempts.classList.remove("wrong-blink-class"),
        { once: true }
      );
      playerScoreElement.textContent = `Score:  ${playerScore}`;
      playerAttempts.textContent = `Attempts: ${guessAttempts}`;
    }
    return;
  };

  answerCheck();

  return stateSelectElement, stateSelectName, stateSelectAbbreviation;
};

//generates a random number and assigns the number to randomStateIndex variable so it can be used in other functions
const getRandomState = () => {
  const randomNumber = Math.floor(Math.random() * randomStateList.length);
  randomStateIndex = randomNumber;
  if (randomStateList.length >= 1) {
    randomState = randomStateList[randomNumber].getAttribute("data-name");
  }
  guessThisState.textContent = "Where is " + randomState;
  return randomState, randomNumber;
};

//returns player attempts, score state list and UI elements to their default state
const resetGame = () => {
  getRandomState();
  guessAttempts = 3;
  playerScore = 0;
  playerScoreElement.textContent = `Score:  ${playerScore}`;
  playerAttempts.textContent = `Attempts: ${guessAttempts}`;
  stateList.forEach(() => {
    randomStateList.pop();
    start = Date.now();
  });

  stateList.forEach((element) => {
    randomStateList.push(element);
  });
  stateList.forEach((index) => {
    index.classList.remove("correct");
    index.classList.remove("wrong");
  });
};

startButton.addEventListener("click", () => {
  if (gameStartedCheck == false) {
    gameStartedCheck = true;
    start = Date.now();
  }
  if (randomStateList.length === 0) {
    return resetGame();
  }
  (gameStartedCheck = true),
    getRandomState(),
    (startButton.textContent = "Get new state");
});

resetButton.addEventListener("click", () => {
  gameStartedCheck = true;
  resetGame();
});

timerElement.addEventListener("click", () => {
  timerElement.classList.toggle("timer-hide");
});

window.addEventListener("click", stateClicked);

const timerFunction = () => {
  if (gameStartedCheck == false) {
    return;
  } else if (randomStateList.length < 1) {
    return;
  } else if (randomStateList.length >= 1) {
    const end = Date.now();
    const elapsed = end - start; // elapsed time in milliseconds
    timerElement.textContent =
      "Time: " +
      Math.floor(elapsed / 1000 / 60) +
      " : " +
      Math.floor((elapsed / 1000) % 60);
    return;
  }
};

setInterval(timerFunction, 1000);
