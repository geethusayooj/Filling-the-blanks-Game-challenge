document.addEventListener("DOMContentLoaded", () => {
  const questionElement = document.querySelector("#question");
  const lettersElement = document.querySelector("#letters");
  const messageElement = document.querySelector("#message");
  const timeRemainingContainer = document.querySelector("#timeRemaining");
  const restartButton = document.querySelector("#restartButton");

  const questionsList = [
    new Question("APP_E", ["K", "L", "T", "K"], "APPLE"),
    new Question("B_LL", ["M", "O", "H", "A"], "BALL"),
    new Question("DO_", ["G", "A", "O", "Y"], "DOG"),
    new Question("C_T", ["R", "Z", "A", "X"], "CAT"),
  ];
  const quizDuration = 40; // Duration in seconds
  const game = new Game();

  game.addQuestion(structuredClone(questionsList));
  game.timeRemaining = quizDuration;

  let timer;
  showQuestion();
  startTimer();
  // Restart button click event to reset the game
  restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    resetGame();
  });

  function showQuestion() {
    const currentQn = game.questions[game.currentQuestion];
    const letters = currentQn.choices;
    const question = currentQn.question;

    // Clear the previous question and choices
    questionElement.innerHTML = "";
    lettersElement.innerHTML = "";

    // Display the question
    for (let i = 0; i < question.length; i++) {
      if (question[i] === "_") {
        // Create a box for the missing letter
        const box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("dataindex", i);
        // Add dragover and drop event handlers
        box.addEventListener("dragover", (event) => {
          event.preventDefault(); // Allow dropping
        });
        box.addEventListener("drop", (event) => {
          const selectedLetter = event.dataTransfer.getData("text/plain");
          checkAnswer(selectedLetter, i);
        });
        questionElement.appendChild(box);
      } else {
        // Display letters as they are
        const letterElement = document.createElement("span");
        letterElement.innerText = question[i];
        questionElement.appendChild(letterElement);
      }
    }

    // Display the choices
    for (let i = 0; i < letters.length; i++) {
      const showchoices = document.createElement("span");
      showchoices.innerText = letters[i];
      showchoices.classList.add("choice");

      showchoices.setAttribute("draggable", true); // Makes the letter draggable
      showchoices.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", event.target.innerText); // Store the letter being dragged
      });

      lettersElement.appendChild(showchoices);
    }
  }

  function checkAnswer(selectedLetter, i) {
    const currentQn = game.questions[game.currentQuestion];
    const indexOfMissingLetter = currentQn.question.indexOf("_");

    if (currentQn.answer[indexOfMissingLetter] === selectedLetter) {
      // If the selected letter is correct, update the question display
      const updatedQuestion = currentQn.question.replace("_", selectedLetter);
      game.questions[game.currentQuestion].question = updatedQuestion;

      // Refresh the display with the updated question
      showQuestion();

      // Check if the question is completely filled
      if (updatedQuestion === currentQn.answer) {
        game.currentQuestion++;

        // Check if there are more questions
        if (game.currentQuestion < game.questions.length) {
          displayMessage("Correct! Moving to the next question.", 1000);
          setTimeout(showQuestion, 1000);
        } else {
          displayMessage(
            "Congratulations! You've completed all questions.",
            2000
          );
          clearInterval(timer)
          timeRemainingContainer.innerText = "";
          restartButton.style.display = "block";
        }
      }
    } else {
      displayMessage("Incorrect choice,Try again!", 1000);
    }
  }

  function displayMessage(text, duration = 2000) {
    const message = document.createElement("p");
    message.innerText = text;
    if (text.includes("Congratulations")) {
      message.style.color = "red";
      message.style.fontWeight = "bold";
      message.style.fontSize = "24px";
    }
    messageElement.appendChild(message);
    setTimeout(() => {
      messageElement.removeChild(message);
    }, duration);
  }
  function startTimer() {
    timer = setInterval(() => {
      game.timeRemaining--;

      timeRemainingContainer.innerText = formatTime(game.timeRemaining);

      if (game.timeRemaining === 0) {
        clearInterval(timer);
        showResults();
      }
    }, 1000);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function showResults() {
    displayMessage("Time's up! Try again.", 2000);
    restartButton.style.display = "block";
  }

  function resetGame() {
    game.currentQuestion = 0;
    game.timeRemaining = quizDuration;
    game.addQuestion(structuredClone(questionsList));
    showQuestion();
    startTimer();
  }
});
