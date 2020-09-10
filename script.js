// Set the necessary elements from the DOM
let body = document.body;
let container = document.querySelector(".container");
let pages = document.querySelectorAll(".page");
let startQuizBtn = document.querySelector("#start-quiz");
let h2El = document.querySelector("#question-header");
let choices = document.querySelectorAll(".choice");
let message = document.querySelector("#out-of-time-page");
let yesBtn = document.querySelector("#yes");
let noBtn = document.querySelector("#no");
let bye = document.querySelector("#bye-bye");
let score = document.querySelector("#score");
let formInput = document.querySelector("#initials");
let submitBtn = document.querySelector("#submit");
let ulEl = document.querySelector("ul");
let backBtn = document.querySelector("#back-btn");
let clearBtn = document.querySelector("#clear-btn");
let error = document.querySelector("#error");
let highscores = document.querySelector("#highscores");

// Set letiable for which page user is currently on
let currentPage = 0;

// Set letiable for which question user is currently on
let currentQuestion = 0;

// Setting evaluating letiables
let evaluateDiv = document.createElement("div");
evaluateDiv.setAttribute("class", "evaluate off");
let hrEl = document.createElement("hr");
let rightOrWrongEl = document.createElement("p");
rightOrWrongEl.setAttribute("id", "right-or-wrong");
container.appendChild(evaluateDiv);
evaluateDiv.appendChild(hrEl);
evaluateDiv.appendChild(rightOrWrongEl);

// Create an array of users
let users = [];

// Set index for which user
let userNum;
// If there are no users, set userNum = 1
if (JSON.parse(localStorage.getItem("users")) === null) {
  userNum = 1;
} // If there are users, userNum = the number of users + 1
else {
  userNum = JSON.parse(localStorage.getItem("users")).length + 1;
}

// Create questions array.
let questions = [
  {
    title: "What does HTML stand for?",
    choices: ["How Time Marks Life", "How To Make Lettuce", "Hyper Text Markup Language", "How To Make Lasagna"],
    answer: "Hyper Text Markup Language",
  },
  {
    title: "JavaScript is considered?",
    choices: ["The Bones", "The Muscle", "The Skin", "A Fruity Beverage"],
    answer: "The Muscle",
  },
  {
    title:
      "console.log does what?",
    choices: ["Consoles the user", "Logs out alerts", "Keeps track of progress", "Gathers data"],
    answer: "Logs out alerts",
  },
  {
    title:
      "forloops lets a user?",
    choices: [
      "Eat fruity loops",
      "Go back to a previous page",
      "Ring-A-Ring-A-Roses",
      "Repeat Code",
    ],
    answer: "Repeat Code",
  },
  {
    title:
      'In what season is "DRY means the following?',
    choices: ["Don't Repeat Yourself", "Don't Remind Yourself", "The opposite of WET", "A lack of moisture"],
    answer: "Don't Repeat Yourself",
  },
];

// Setting the time in the top right corner
let timeEl = document.querySelector("#time-left");
let secondsLeft = questions.length * 15;
let timer;

// FUNCTIONS

function loadPage(n) {
  pages[currentPage].classList.remove("active");
  pages[n].classList.add("active");
  currentPage = n;
}

function loadNextPage() {
  loadPage(currentPage + 1);
  timeEl.textContent = secondsLeft;

  // Starts the clock
  if (currentPage === 1) {
    setTime();
  }

  // This is the "All done!" page
  if (currentPage === 6) {
    // Setting user's score
    score.textContent = secondsLeft;

    // Stops the clock
    clearInterval(timer);
  }
}

// Checks to see if the answer is right or wrong
function evaluateAnswer(event) {
  event.preventDefault();

  evaluateDiv.classList.remove("off");
  evaluateDiv.classList.add("on");

  // If answer is right, show "Correct!" for a second.
  if (event.target.textContent === questions[currentQuestion].answer) {
    rightOrWrongEl.textContent = "Correct!";
  } // If answer is wrong, show "Wrong!" for a second.
  else {
    rightOrWrongEl.textContent = "Wrong!";

    // Time penalty for getting the answer wrong.
    if (secondsLeft > 10) {
      secondsLeft -= 10;
      timeEl.textContent = secondsLeft;
    }
  }
  currentQuestion++;

  // Make the evaluate div disappear
  setRightOrWrongTime();
}

// Sets the timer for the quiz
function setTime() {
  timer = setInterval(function () {
    secondsLeft--;
    timeEl.textContent = secondsLeft;

    if (secondsLeft === 0) {
      clearInterval(timer);

      // Sends the "Out of time!" message
      sendMessage();
    }
  }, 1000);
}

// Send an "Out of time!" message
function sendMessage() {
  pages[currentPage].classList.remove("active");
  message.classList.remove("off");
  message.classList.add("on");

  // If yes, return to start page.
  yesBtn.addEventListener("click", function (event) {
    event.preventDefault();

    loadPage(0);
    message.classList.remove("on");
    message.classList.add("off");
    secondsLeft = questions.length * 15;
  });

  // If no, say goodbye.
  noBtn.addEventListener("click", function (event) {
    event.preventDefault();

    bye.classList.remove("off");
    bye.classList.add("on");
    message.classList.remove("on");
    message.classList.add("off");
  });
}

// Makes the "Correct!" or "Wrong!" only appear for a second
function setRightOrWrongTime() {
  let timer = setInterval(function () {
    let second = 1;
    second--;

    if (second === 0) {
      clearInterval(timer);
      evaluateDiv.classList.remove("on");
      evaluateDiv.classList.add("off");
    }
  }, 1000);
}

// Iterate through the users array to show the highscore on the page
function renderUsers() {
  // Clear the list element so that its a clean slate every time
  ulEl.innerHTML = "";

  // Render a new li for each highscore
  for (let i = 0; i < users.length; i++) {
    // Create a new user object that pulls from the user array
    let user = users[i];

    // Set the text content of the list element to the user's information
    let li = document.createElement("li");
    li.textContent = user.userNum + ". " + user.initials + " - " + user.score;

    // Append the list element to the unordered list
    ulEl.appendChild(li);
  }
}

// Store the users in local storage
function storeUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function init() {
  // Get stored past highscores from local storage
  // Parse the JSON string into an object
  let storedUsers = JSON.parse(localStorage.getItem("users"));

  // If there are users in the local storage, set the users array to that array
  if (storedUsers !== null) {
    users = storedUsers;
  }

  renderUsers();
}

// Iterate through all the choices buttons to add an "ON CLICK" event for them to
// 1. load the next page
// 2. evaluate if the answer is right or wrong
for (let i = 0; i < choices.length; i++) {
  choices[i].addEventListener("click", evaluateAnswer);
  choices[i].addEventListener("click", loadNextPage);
}

// If "Submit" button is clicked,
// load the highscores page
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // Data validation on initials form
  if (
    formInput.value !== "null" &&
    formInput.value !== "" &&
    (formInput.value.length == 2 || formInput.value.length == 3)
  ) {
    loadNextPage();
    formInput.value = formInput.value.toUpperCase();
  } else {
    error.classList.remove("off");
    error.classList.add("on");
  }

  // Create a user object to store in users array
  let user = {
    userNum: userNum,
    initials: formInput.value,
    score: secondsLeft,
  };

  // Add new highscore to users array
  users.push(user);

  renderUsers();
  storeUsers();
});

// If "Go back" button is clicked,
// load the start page
// reset all the values
// raise the userNum by one, since its a new quiz
backBtn.addEventListener("click", function (event) {
  event.preventDefault();

  loadPage(0);
  currentQuestion = 0;
  formInput.value = "";
  secondsLeft = questions.length * 15;
  userNum++;
});

// If "Clear highscores" button is clicked,
// clear the list of highscores
// reset the userNum back to 0
// clear the local storage
clearBtn.addEventListener("click", function (event) {
  event.preventDefault();

  ulEl.innerHTML = "";

  users = [];
  localStorage.setItem("users", JSON.stringify(users));
  userNum = 0;
});

// If "View Highscores" is clicked, take user to highscore page
highscores.addEventListener("click", function () {
  loadPage(7);

  // If there are no users, set userNum = 1
  if (JSON.parse(localStorage.getItem("users")) === null) {
    userNum = 1;
  } // If there are users, userNum = the number of users
  else {
    userNum = JSON.parse(localStorage.getItem("users")).length;
  }

  // Stops the clock
  clearInterval(timer);
});

// Call the functions
loadPage(0);
startQuizBtn.addEventListener("click", loadNextPage);
init();
