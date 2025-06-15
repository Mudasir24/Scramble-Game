// Import an array of words and hints from an external file
// The 'words' array contains objects like { word: "apple", hint: "A common fruit" }
import { word as words } from './word.js'; // ✅ correct

const categorizedWords = {
    easy: words.filter(w => w.word.length <= 5),
    medium: words.filter(w => w.word.length > 5 && w.word.length <= 8),
    hard: words.filter(w => w.word.length > 8)
};


// Select DOM elements (parts of the webpage we want to work with)
const wordText = document.querySelector(".word");         // Where the scrambled word appears
const hinttext = document.querySelector(".hint span");    // Where the hint appears
const refreshBtn = document.querySelector(".refresh-word"); // Refresh button
const checkBtn = document.querySelector(".check-word");   // Check answer button
const inputField = document.querySelector("input");       // Where user types their answer
const timeText = document.querySelector(".time b")        // Timer display
const scoreText = document.querySelector("#score");
const streakText = document.querySelector("#streak");
const difficultySelect = document.querySelector("#difficulty");

// Variables we'll use throughout the game
let selectedWord;  // Will store the correct word for the current round
let timer;        // Will store our timer interval
let score = 0;    // Player's score
let streak = 0;   // Player's current streak of correct answers
let bonusMultiplier = 1; // Multiplier for score based on streak
// Function to shuffle an array (used to scramble the word)

/**
 * Sets up a countdown timer for the game
 * @param {number} maxTime - The starting time (in seconds) for the countdown
 */
const initTimer = (maxTime) => {
    clearInterval(timer);
    timeText.innerHTML = maxTime;
    timer = setInterval(() => {
        if (maxTime > 0) {
            maxTime--;
            timeText.innerHTML = maxTime;
            return;
        }
        clearInterval(timer);
        alert(`Time's up! The correct word was: ${selectedWord.toUpperCase()}`);
        resetStreak();
        initGame();
    }, 1000);
};


const initGame = () => {
    const difficulty = difficultySelect.value;
    let maxTime = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
    initTimer(maxTime);

    const wordsPool = categorizedWords[difficulty];
    const randomObj = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    selectedWord = randomObj.word.toLowerCase();
    const hint = randomObj.hint;

    let wordArray = selectedWord.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    wordText.innerHTML = wordArray.join("");
    hinttext.innerHTML = hint;
    inputField.value = "";
    inputField.setAttribute("maxlength", selectedWord.length);
};


/**
 * Checks if the user's answer is correct
 */
const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    if (!userWord) return alert("Please enter a word!");

    if (userWord !== selectedWord) {
        alert(`Oops! ${userWord} is incorrect.`);
        resetStreak();
        return;
    }

    streak++;
    bonusMultiplier = 1 + (streak - 1) * 0.25;
    const points = Math.floor(selectedWord.length * bonusMultiplier);
    score += points;

    alert(`Correct! ${userWord.toUpperCase()} (+${points} pts, x${bonusMultiplier.toFixed(2)} streak bonus)`);

    updateStats();
    initGame();
};

const updateStats = () => {
    scoreText.innerText = score;
    streakText.innerText = streak;
};

const resetStreak = () => {
    streak = 0;
    bonusMultiplier = 1;
    updateStats();
};




// Set up event listeners (what happens when buttons are clicked)
refreshBtn.addEventListener("click", initGame); // New word when refresh clicked
checkBtn.addEventListener("click", checkWord); // Check answer when button clicked

// Start the game when the page first loads
initGame();