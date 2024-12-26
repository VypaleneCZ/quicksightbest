// Odkazy na HTML prvky
const mainMenu = document.getElementById('mainMenu');
const startButton = document.getElementById('startButton');
const leaderboardButton = document.getElementById('leaderboardButton');
const gameArea = document.getElementById('gameArea');
const gameContainer = document.getElementById('gameContainer');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const backFromLeaderboard = document.getElementById('backFromLeaderboard');
const submitScoreButton = document.getElementById('submitScoreButton');
const playerNameInput = document.getElementById('playerName');
const restartGameButton = document.getElementById('restartGameButton');

let score = 0;
let timeLeft = 60;
let timerInterval;
let gameActive = false;
let leaderboardData = [];

// Funkce pro spuštění hry
function startGame() {
    mainMenu.classList.add('hidden');
    leaderboard.classList.add('hidden');
    gameOver.classList.add('hidden');
    gameArea.classList.remove('hidden');
    resetGame();
    spawnPositiveTargets(5); // Na obrazovce je více pozitivních cílů
    spawnNegativeTargets(); // Spuštění negativních cílů
    startTimer();
}

// Funkce pro reset hry
function resetGame() {
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = `⭐ Skóre: ${score}`;
    timerElement.textContent = `⏳ Čas: ${timeLeft}`;
    gameContainer.innerHTML = '';
}

// Funkce pro spuštění časovače
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `⏳ Čas: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Funkce pro ukončení hry
function endGame() {
    gameActive = false;
    gameArea.classList.add('hidden');
    gameOver.classList.remove('hidden');
    finalScore.textContent = score;
}

// Funkce pro vytvoření více pozitivních cílů
function spawnPositiveTargets(count) {
    for (let i = 0; i < count; i++) {
        spawnPositiveTarget();
    }
}

// Funkce pro vytvoření pozitivního cíle
function spawnPositiveTarget() {
    const target = document.createElement('div');
    target.classList.add('target', Math.random() < 0.5 ? 'big' : 'small');
    target.textContent = target.classList.contains('big') ? '😊' : '😁';

    setRandomPosition(target);

    target.addEventListener('click', () => {
        score += target.classList.contains('big') ? 1 : 2;
        scoreElement.textContent = `⭐ Skóre: ${score}`;
        gameContainer.removeChild(target);
        spawnPositiveTarget(); // Po kliknutí se objeví nový pozitivní cíl
    });

    gameContainer.appendChild(target);
}

// Funkce pro spuštění negativních cílů
function spawnNegativeTargets() {
    setInterval(() => {
        if (gameActive && Math.random() < 0.3) { // Negativní cíl se objeví s nízkou pravděpodobností
            const target = document.createElement('div');
            target.classList.add('target', 'negative');
            target.textContent = '😡';

            setRandomPosition(target);

            // Negativní cíl mizí po 2.5 sekundách
            const timeout = setTimeout(() => {
                if (gameContainer.contains(target)) {
                    gameContainer.removeChild(target);
                }
            }, 2500);

            target.addEventListener('click', () => {
                score -= 5;
                scoreElement.textContent = `⭐ Skóre: ${score}`;
                gameContainer.removeChild(target);
                clearTimeout(timeout); // Zrušíme timeout, pokud hráč klikne
            });

            gameContainer.appendChild(target);
        }
    }, 1500); // Každých 1.5 sekundy kontrolujeme možnost vytvoření negativního cíle
}

// Funkce pro nastavení náhodné pozice cíle
function setRandomPosition(target) {
    const size = target.classList.contains('big') ? 60 : target.classList.contains('small') ? 40 : 50;
    const x = Math.random() * (gameContainer.offsetWidth - size);
    const y = Math.random() * (gameContainer.offsetHeight - size);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
}

// Funkce pro uložení skóre do leaderboardu
function saveScore(name, score) {
    leaderboardData.push({ name, score });
    leaderboardData.sort((a, b) => b.score - a.score); // Řazení od nejvyššího skóre
    leaderboardData = leaderboardData.slice(0, 10); // Uchováme jen top 10
    updateLeaderboard();
}

// Funkce pro aktualizaci leaderboardu
function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboardData.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Event listeners
startButton.addEventListener('click', () => {
    gameActive = true;
    startGame();
});

restartButton.addEventListener('click', () => {
    gameActive = true;
    startGame();
});

restartGameButton.addEventListener('click', () => {
    gameActive = true;
    startGame();
});

leaderboardButton.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    leaderboard.classList.remove('hidden');
    updateLeaderboard();
});

backFromLeaderboard.addEventListener('click', () => {
    leaderboard.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

submitScoreButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        saveScore(playerName, score);
        playerNameInput.value = '';
        gameOver.classList.add('hidden');
        leaderboard.classList.remove('hidden');
    } else {
        alert('Prosím, zadejte své jméno.');
    }
});

backToMenuButton.addEventListener('click', () => {
    gameOver.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});
