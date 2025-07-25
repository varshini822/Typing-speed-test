// Sentences database with difficulty levels
const sentences = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is fun and rewarding when you practice regularly.",
        "JavaScript is a popular language for web development.",
        "Coding can be learned by anyone with dedication and persistence.",
        "Practice makes perfect when it comes to typing speed.",
        "Keep your fingers on the home row for better typing technique.",
        "Typing without looking at the keyboard is called touch typing.",
        "Regular practice will help you improve your typing speed.",
        "Accuracy is just as important as speed in typing tests.",
        "The best way to learn is by doing and practicing consistently."
    ],
    medium: [
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
        "JavaScript is a high-level programming language that conforms to the ECMAScript specification.",
        "Coding is today's language of creativity. All our children deserve a chance to become creators.",
        "The best way to predict the future is to invent it. Start coding today and build your own future.",
        "Every great developer you know got there by solving problems they were unqualified to solve.",
        "The computer was born to solve problems that did not exist before.",
        "In the digital age, coding is not just a skill, it is a new form of literacy.",
        "Technology is best when it brings people together.",
        "The function of good software is to make the complex appear to be simple.",
        "Learning to write programs stretches your mind and helps you think better."
    ],
    hard: [
        "Algorithmic complexity is a measure of how efficient an algorithm is in terms of time and space.",
        "Asynchronous programming allows for non-blocking operations in JavaScript using promises and async/await.",
        "Object-oriented programming is a paradigm based on the concept of objects containing data and methods.",
        "Functional programming emphasizes pure functions and immutable data structures for predictable code.",
        "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.",
        "Closures in JavaScript allow functions to remember the environment in which they were created.",
        "Prototypal inheritance is a fundamental concept in JavaScript where objects inherit properties from other objects.",
        "Memoization is an optimization technique used to speed up programs by storing results of expensive function calls.",
        "The Document Object Model represents the structure of a web page as a tree of objects.",
        "Regular expressions are patterns used to match character combinations in strings with powerful matching capabilities."
    ]
};

// DOM elements
const sentenceElement = document.getElementById('sentence');
const typingInput = document.getElementById('typing-input');
const wpmElement = document.querySelector('#wpm .stat-value');
const errorsElement = document.querySelector('#errors .stat-value');
const timerElement = document.querySelector('#timer .stat-value');
const accuracyElement = document.querySelector('#accuracy .stat-value');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const highScoreElement = document.getElementById('high-score-value');
const wpmProgress = document.querySelector('#wpm .progress-bar');
const errorsProgress = document.querySelector('#errors .progress-bar');
const timerProgress = document.querySelector('#timer .progress-bar');
const accuracyProgress = document.querySelector('#accuracy .progress-bar');

// Game state
let currentSentence = '';
let startTime;
let timerInterval;
let errors = 0;
let totalTyped = 0;
let gameActive = false;
let timeLeft = 60;
let highScore = 0;
let currentDifficulty = 'medium';

// Initialize the game
function initGame() {
    // Clear any existing timer
    clearInterval(timerInterval);
    
    // Reset game state
    errors = 0;
    totalTyped = 0;
    timeLeft = 60;
    gameActive = false;
    
    // Reset UI
    wpmElement.textContent = '0';
    errorsElement.textContent = '0';
    timerElement.textContent = timeLeft;
    accuracyElement.textContent = '100%';
    typingInput.value = '';
    typingInput.disabled = true;
    startBtn.disabled = false;
    
    // Update progress bars
    wpmProgress.style.width = '0%';
    errorsProgress.style.width = '0%';
    timerProgress.style.width = '100%';
    accuracyProgress.style.width = '100%';
    
    // Get current difficulty
    currentDifficulty = difficultySelect.value;
    
    // Select a random sentence based on difficulty
    const difficultySentences = sentences[currentDifficulty];
    currentSentence = difficultySentences[Math.floor(Math.random() * difficultySentences.length)];
    
    // Display the sentence with individual character spans
    sentenceElement.innerHTML = '';
    for (let i = 0; i < currentSentence.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.textContent = currentSentence[i];
        sentenceElement.appendChild(charSpan);
    }
    
    // Highlight first character
    if (sentenceElement.firstChild) {
        sentenceElement.firstChild.classList.add('current');
    }
}

// Start the game
function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    startTime = new Date();
    typingInput.disabled = false;
    typingInput.focus();
    startBtn.disabled = true;
    
    // Start the timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        timerProgress.style.width = `${(timeLeft / 60) * 100}%`;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Handle typing input
function handleInput() {
    if (!gameActive) return;
    
    const typedText = typingInput.value;
    totalTyped = typedText.length;
    
    // Update character styling
    const chars = sentenceElement.querySelectorAll('.char');
    let newErrors = 0;
    
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        
        if (i < typedText.length) {
            if (typedText[i] === currentSentence[i]) {
                char.classList.remove('incorrect', 'current');
                char.classList.add('correct');
            } else {
                char.classList.remove('correct', 'current');
                char.classList.add('incorrect');
                newErrors++;
            }
        } else if (i === typedText.length) {
            char.classList.remove('correct', 'incorrect');
            char.classList.add('current');
        } else {
            char.classList.remove('correct', 'incorrect', 'current');
        }
    }
    
    errors = newErrors;
    
    // Update stats
    updateStats();
    
    // Check if sentence is completed
    if (typedText.length === currentSentence.length && typedText === currentSentence) {
        endGame();
    }
}

// Update game statistics
function updateStats() {
    // Calculate elapsed time in minutes
    const elapsedTime = (new Date() - startTime) / 60000; // in minutes
    
    // Calculate WPM (words per minute) - 5 characters = 1 word
    const wpm = Math.round((totalTyped / 5) / elapsedTime) || 0;
    wpmElement.textContent = wpm;
    
    // Update progress bar for WPM (scaled to 150 WPM max)
    wpmProgress.style.width = `${Math.min(wpm / 1.5, 100)}%`;
    
    // Update errors
    errorsElement.textContent = errors;
    
    // Update error progress bar (scaled to 50 errors max)
    errorsProgress.style.width = `${Math.min(errors * 2, 100)}%`;
    
    // Calculate accuracy
    const accuracy = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - errors) / totalTyped) * 100)) : 100;
    accuracyElement.textContent = `${accuracy}%`;
    
    // Update accuracy progress bar
    accuracyProgress.style.width = `${accuracy}%`;
    
    // Update high score
    if (wpm > highScore) {
        highScore = wpm;
        highScoreElement.textContent = highScore;
        localStorage.setItem('typingHighScore', highScore);
    }
}

// End the game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    typingInput.disabled = true;
    
    // Final stats update
    updateStats();
    
    // Show completion message
    if (timeLeft > 0) {
        sentenceElement.innerHTML = `
            <div style="font-size: 1.8rem; line-height: 1.4; padding: 20px;">
                <div><i class="fas fa-trophy" style="color: #feca57;"></i> Test Completed!</div>
                <div style="font-size: 1.5rem; margin-top: 15px; color: #4facfe;">
                    Your Score: ${wpmElement.textContent} WPM
                </div>
                <div style="font-size: 1.2rem; margin-top: 15px; color: #a0a0d0;">
                    Accuracy: ${accuracyElement.textContent} | Errors: ${errorsElement.textContent}
                </div>
                <div style="font-size: 1.2rem; margin-top: 10px; color: #1dd1a1;">
                    <i class="fas fa-crown"></i> High Score: ${highScore} WPM
                </div>
            </div>
        `;
    } else {
        sentenceElement.innerHTML = `
            <div style="font-size: 1.8rem; line-height: 1.4; padding: 20px;">
                <div><i class="fas fa-hourglass-end" style="color: #ff6b6b;"></i> Time's Up!</div>
                <div style="font-size: 1.5rem; margin-top: 15px; color: #4facfe;">
                    Your Score: ${wpmElement.textContent} WPM
                </div>
                <div style="font-size: 1.2rem; margin-top: 15px; color: #a0a0d0;">
                    Accuracy: ${accuracyElement.textContent} | Errors: ${errorsElement.textContent}
                </div>
                <div style="font-size: 1.2rem; margin-top: 10px; color: #1dd1a1;">
                    <i class="fas fa-crown"></i> High Score: ${highScore} WPM
                </div>
            </div>
        `;
    }
}

// Load high score from localStorage
function loadHighScore() {
    const savedHighScore = localStorage.getItem('typingHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore);
        highScoreElement.textContent = highScore;
    }
}

// Event listeners
typingInput.addEventListener('input', handleInput);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', initGame);

// Initialize the game on page load
window.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
    initGame();
});