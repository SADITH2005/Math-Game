const questionSection = document.querySelector("#question-section");
const questionElement = document.querySelector("#question"); // Renamed for clarity
const answerInput = document.querySelector("#answer"); // Renamed for clarity
const startButton = document.querySelector("#start");
const scoreElement = document.querySelector("#score"); // Renamed for clarity
const submitButton = document.querySelector("#submit-button");
const questionCounterElement = document.querySelector("#q"); // Renamed for clarity (span inside #q-counter)
const timeOutput = document.querySelector("#time");

let correctAnswer = 0;
let currentQuestionCount = 0; // Renamed for clarity
let timerInterval; // Renamed for clarity
let timeElapsed; // Renamed for clarity
let currentDuration = 10; // Renamed for clarity and initial value

const totalQuestions = 10; // Define total questions

function startGame() {
    startButton.classList.add("hidden");
    questionSection.classList.remove("hidden");
    scoreElement.textContent = 0;
    currentQuestionCount = 0; // Reset count
    // No need to call clearInterval here, startTimer does it
    generateQuestion();
}

// JS Random number function
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    answerInput.value = ""; // Clear previous answer
    answerInput.focus(); // Set focus to the input field

    if (currentQuestionCount >= totalQuestions) {
        // Game is over, handle here before generating a new question
        endGame();
        return; // Stop execution
    }

    currentQuestionCount++;
    questionCounterElement.textContent = currentQuestionCount;

    let questType = randomNumber(1, 4);
    let num1, num2;

    switch (questType) {
        case 1: // Addition
            num1 = randomNumber(10, 100);
            num2 = randomNumber(10, 100);
            questionElement.textContent = `${num1} + ${num2}`; // Use template literals
            correctAnswer = num1 + num2;
            currentDuration = 10; // Duration for addition
            break;
        case 2: // Subtraction
            num1 = randomNumber(20, 150); // Slightly larger range for subtraction
            num2 = randomNumber(10, num1 - 10); // Ensure positive result and decent difference
            questionElement.textContent = `${num1} - ${num2}`;
            correctAnswer = num1 - num2;
            currentDuration = 15; // Duration for subtraction
            break;
        case 3: // Multiplication
            num1 = randomNumber(2, 12); // Smaller numbers for multiplication
            num2 = randomNumber(2, 12);
            questionElement.textContent = `${num1} x ${num2}`;
            correctAnswer = num1 * num2;
            currentDuration = 20; // Duration for multiplication
            break;
        case 4: // Division
            num2 = randomNumber(2, 10); // Divisor
            let quotient = randomNumber(2, 10); // Ensure a whole number result
            num1 = num2 * quotient; // Dividend
            questionElement.textContent = `${num1} / ${num2}`;
            correctAnswer = quotient;
            currentDuration = 25; // Duration for division
            break;
        default:
            // Should not happen, but handle defensively
            questionElement.textContent = "Error generating question";
            correctAnswer = null;
            currentDuration = 10;
            break;
    }

    console.log("Correct Answer:", correctAnswer, "Duration:", currentDuration); // Debugging
    startTimer(); // Start the timer for the *new* question with its duration
}

function nextQuestion() {
    // **FIX: Clear the timer immediately when nextQuestion is triggered**
    clearInterval(timerInterval);

    // Check answer only if a valid answer was submitted (or time ran out)
    // Also check if the input is not empty when submitting
    if (answerInput.value !== "" && parseInt(answerInput.value) === correctAnswer) {
        scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
    }

    // Now generate the next question (which will handle game over check internally)
    generateQuestion();
}

function startTimer() {
    timeElapsed = 0;
    timeOutput.textContent = currentDuration - timeElapsed; // Display initial time left

    // Clear any existing timer before starting a new one
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        timeElapsed++;
        const timeLeft = currentDuration - timeElapsed;
        timeOutput.textContent = timeLeft;

        if (timeLeft <= 5) {
             timeOutput.parentElement.style.color = 'red'; // Highlight time low
        } else {
             timeOutput.parentElement.style.color = '#007bff'; // Reset timer color
        }


        if (timeElapsed >= currentDuration) {
            // Timer ran out, move to the next question (clearInterval is called inside nextQuestion)
            nextQuestion();
        }
    }, 1000); // Update every 1 second
}

function endGame() {
    clearInterval(timerInterval); // Ensure timer is stopped

    alert("Game over! Your final score is " + scoreElement.textContent + "/" + totalQuestions);

    // Reset UI and state
    questionElement.textContent = "Game Finished!"; // Or a final message
    answerInput.value = "";
    answerInput.disabled = true; // Disable input after game over
    submitButton.disabled = true; // Disable button after game over

    startButton.classList.remove('hidden'); // Show start button again
    questionSection.classList.add('hidden'); // Hide question section
    questionCounterElement.textContent = 0; // Reset counter display
    scoreElement.textContent = 0; // Reset score display
    timeOutput.textContent = 0; // Reset timer display
    timeOutput.parentElement.style.color = '#007bff'; // Reset timer color

    // Re-enable controls for the next game
    answerInput.disabled = false;
    submitButton.disabled = false;
}


// Event Listeners
startButton.addEventListener('click', startGame);
submitButton.addEventListener('click', nextQuestion);

// Allow submitting answer by pressing Enter in the input field
answerInput.addEventListener('keypress', function(event) {
    // Check if the key pressed was 'Enter' (key code 13) and question section is visible
    if (event.key === 'Enter' && !questionSection.classList.contains('hidden')) {
        event.preventDefault(); // Prevent default form submission if applicable
        nextQuestion(); // Trigger next question logic
    }
});