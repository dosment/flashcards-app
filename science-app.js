// Science Flashcards - Main Application

import * as Storage from './storage.js';
import { UNITS } from './science-data.js';

// Celebration colors
const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];

// Application state
const user = {
    name: null,
    history: [],
    mastery: {},
    masteryDirty: false
};

const game = {
    isActive: false,
    unit: null,
    cards: [],
    currentCardIndex: 0,
    correct: 0,
    total: 0,
    score: 0,
    streak: 0,
    startTime: null,
    questionStartTime: null,
    showingAnswer: false
};

const question = {
    id: null,
    front: null,
    back: null
};

// DOM Elements cache
const elements = {
    userList: null,
    newUserInput: null,
    addUserBtn: null,
    levelBtns: null,
    quitBtn: null,
    progressBtn: null,
    switchUserBtn: null,
    historyBackBtn: null,
    playAgainBtn: null,
    resultMenuBtn: null,
    screens: {},
    welcomeMsg: null,
    score: null,
    cardFront: null,
    answerDisplay: null,
    cardBack: null,
    showAnswerBtn: null,
    answerButtons: null,
    feedback: null,
    streakDisplay: null,
    masteryGrid: null,
    historyList: null,
    resultTitle: null,
    resultStats: null,
    celebration: null
};

// Utility function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialization
function init() {
    if (!cacheElements()) {
        console.error('Failed to initialize: missing DOM elements');
        return;
    }

    bindEvents();
    renderUserList();
}

function cacheElements() {
    try {
        elements.userList = document.getElementById('user-list');
        elements.newUserInput = document.getElementById('new-user-input');
        elements.addUserBtn = document.getElementById('add-user-btn');
        elements.levelBtns = document.querySelectorAll('.level-btn');
        elements.quitBtn = document.getElementById('quit-btn');
        elements.progressBtn = document.getElementById('progress-btn');
        elements.switchUserBtn = document.getElementById('switch-user-btn');
        elements.historyBackBtn = document.getElementById('history-back-btn');
        elements.playAgainBtn = document.getElementById('play-again-btn');
        elements.resultMenuBtn = document.getElementById('result-menu-btn');

        // Cache all screens
        document.querySelectorAll('.screen').forEach(screen => {
            elements.screens[screen.id] = screen;
        });

        elements.welcomeMsg = document.getElementById('welcome-msg');
        elements.score = document.getElementById('score');
        elements.cardFront = document.getElementById('card-front');
        elements.answerDisplay = document.getElementById('answer-display');
        elements.cardBack = document.getElementById('card-back');
        elements.showAnswerBtn = document.getElementById('show-answer-btn');
        elements.answerButtons = document.getElementById('answer-buttons');
        elements.feedback = document.getElementById('feedback');
        elements.streakDisplay = document.getElementById('streak-display');
        elements.masteryGrid = document.getElementById('mastery-grid');
        elements.historyList = document.getElementById('history-list');
        elements.resultTitle = document.getElementById('result-title');
        elements.resultStats = document.getElementById('result-stats');
        elements.celebration = document.getElementById('celebration');

        return true;
    } catch (e) {
        console.error('Error caching elements:', e);
        return false;
    }
}

function bindEvents() {
    elements.addUserBtn.addEventListener('click', handleAddUser);
    elements.newUserInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddUser();
    });

    elements.levelBtns.forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.unit));
    });

    elements.quitBtn.addEventListener('click', handleEndGame);
    elements.progressBtn.addEventListener('click', showProgressScreen);
    elements.switchUserBtn.addEventListener('click', showUserScreen);
    elements.historyBackBtn.addEventListener('click', showStartScreen);
    elements.playAgainBtn.addEventListener('click', () => startGame(game.unit));
    elements.resultMenuBtn.addEventListener('click', showStartScreen);
    elements.showAnswerBtn.addEventListener('click', showAnswer);

    const backBtn = document.getElementById('back-to-home-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.location.href = 'index.html');
    }
}

// User management - uses shared storage with math app
function renderUserList() {
    const users = Storage.loadUsers();
    const names = Object.keys(users);

    elements.userList.innerHTML = '';
    if (names.length === 0) {
        elements.userList.innerHTML = '<p>No students yet. Add one below!</p>';
        return;
    }

    const userGrid = document.createElement('div');
    userGrid.className = 'user-grid';

    names.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'user-btn';
        btn.textContent = name;
        btn.addEventListener('click', () => selectUser(name));
        userGrid.appendChild(btn);
    });

    elements.userList.appendChild(userGrid);
}

function handleAddUser() {
    const name = elements.newUserInput.value.trim();
    if (!name) return;
    selectUser(name);
}

function selectUser(name) {
    user.name = name;
    user.history = loadScienceHistory(name);
    user.mastery = loadScienceMastery(name);
    user.masteryDirty = false;

    // Ensure user exists in shared user storage
    const users = Storage.loadUsers();
    if (!users[name]) {
        users[name] = [];
        Storage.saveUsers(users);
    }

    elements.newUserInput.value = '';
    showStartScreen();
}

// Science-specific storage (separate from math mastery)
function loadScienceHistory(name) {
    try {
        const data = localStorage.getItem('scienceHistory');
        const all = data ? JSON.parse(data) : {};
        return all[name] || [];
    } catch {
        return [];
    }
}

function saveScienceHistory(name, history) {
    try {
        const data = localStorage.getItem('scienceHistory');
        const all = data ? JSON.parse(data) : {};
        all[name] = history;
        localStorage.setItem('scienceHistory', JSON.stringify(all));
    } catch {
        // Silent fail
    }
}

function loadScienceMastery(name) {
    try {
        const data = localStorage.getItem('scienceMastery');
        const all = data ? JSON.parse(data) : {};
        return all[name] || {};
    } catch {
        return {};
    }
}

function saveScienceMastery(name, mastery) {
    try {
        const data = localStorage.getItem('scienceMastery');
        const all = data ? JSON.parse(data) : {};
        all[name] = mastery;
        localStorage.setItem('scienceMastery', JSON.stringify(all));
    } catch {
        // Silent fail
    }
}

// Screen navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

function showUserScreen() {
    renderUserList();
    showScreen('user-screen');
}

function showStartScreen() {
    elements.welcomeMsg.textContent = `Science Flashcards - ${user.name}`;
    showScreen('start-screen');
}

function showGameScreen() {
    showScreen('game-screen');
}

function showResultScreen() {
    const accuracy = game.total > 0 ? Math.round((game.correct / game.total) * 100) : 0;

    elements.resultTitle.textContent = getResultTitle(accuracy, game.total);
    elements.resultStats.innerHTML = `
        <div class="stat-row">
            <span class="stat-label">Unit</span>
            <span class="stat-value">${UNITS[game.unit].name}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Cards</span>
            <span class="stat-value">${game.correct} / ${game.total}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value">${accuracy}%</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Score</span>
            <span class="stat-value highlight">${game.score}</span>
        </div>
    `;

    showScreen('result-screen');
}

function getResultTitle(accuracy, total) {
    if (accuracy === 100 && total >= 5) return 'Perfect Score!';
    if (accuracy >= 80) return 'Great Job!';
    if (accuracy >= 60) return 'Good Effort!';
    return 'Session Complete';
}

function showProgressScreen() {
    renderMasteryGrid();
    renderHistory();
    showScreen('history-screen');
}

// Mastery grid for science cards
function renderMasteryGrid() {
    const cards = UNITS[game.unit || 'unit4'].cards;
    const mastery = user.mastery;

    let cellsHtml = '';
    let masteredCount = 0;
    let learningCount = 0;
    let needsWorkCount = 0;
    let untestedCount = 0;

    cards.forEach((card, index) => {
        const cardMastery = mastery[card.id];
        let cls = 'untested';
        let pctText = '-';
        let pct = null;

        if (cardMastery && cardMastery.attempts > 0) {
            pct = Math.round((cardMastery.correct / cardMastery.attempts) * 100);
            pctText = `${pct}%`;

            if (pct >= 85) {
                cls = 'mastered';
                masteredCount++;
            } else if (pct >= 60) {
                cls = 'learning';
                learningCount++;
            } else {
                cls = 'struggling';
                needsWorkCount++;
            }
        } else {
            untestedCount++;
        }

        cellsHtml += `
            <div class="mastery-cell ${cls}" title="${card.front}">
                <span class="table-num">${index + 1}</span>
                <span class="pct">${pctText}</span>
            </div>
        `;
    });

    elements.masteryGrid.innerHTML = cellsHtml + `
        <div class="mastery-legend" style="grid-column: 1 / -1;">
            <span><div class="legend-dot green"></div> Mastered (${masteredCount})</span>
            <span><div class="legend-dot yellow"></div> Learning (${learningCount})</span>
            <span><div class="legend-dot red"></div> Needs Work (${needsWorkCount})</span>
        </div>
        <div class="mastery-summary" style="grid-column: 1 / -1; text-align: center; color: #666; font-size: 0.85rem; margin-top: 5px;">
            ${cards.length - untestedCount} of ${cards.length} cards studied
        </div>
    `;
}

function renderHistory() {
    if (!user.history || user.history.length === 0) {
        elements.historyList.innerHTML = '<p class="history-empty">No sessions yet. Start studying!</p>';
        return;
    }

    elements.historyList.innerHTML = user.history.map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString();
        const accuracy = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;

        return `
            <div class="history-item">
                <div>
                    <div class="history-level">${UNITS[entry.unit]?.name || entry.unit}</div>
                    <div class="history-date">${dateStr}</div>
                </div>
                <div>
                    <div class="history-score">${entry.score} pts</div>
                    <div class="history-accuracy">${entry.correct}/${entry.total} (${accuracy}%)</div>
                </div>
            </div>
        `;
    }).join('');
}

// Game flow
function startGame(unit) {
    game.unit = unit;
    game.cards = [...UNITS[unit].cards];
    game.currentCardIndex = 0;
    game.correct = 0;
    game.total = 0;
    game.score = 0;
    game.streak = 0;
    game.isActive = true;
    game.startTime = Date.now();

    // Shuffle cards
    for (let i = game.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [game.cards[i], game.cards[j]] = [game.cards[j], game.cards[i]];
    }

    updateDisplay();
    showGameScreen();
    nextQuestion();
}

function handleEndGame() {
    if (!game.isActive) return;
    game.isActive = false;

    if (user.masteryDirty) {
        saveScienceMastery(user.name, user.mastery);
        user.masteryDirty = false;
    }

    if (game.total > 0) {
        saveSessionResult();
    }

    showResultScreen();
}

function saveSessionResult() {
    if (!user.history) user.history = [];

    user.history.unshift({
        date: new Date().toISOString(),
        unit: game.unit,
        score: game.score,
        correct: game.correct,
        total: game.total
    });

    if (user.history.length > 50) {
        user.history = user.history.slice(0, 50);
    }

    saveScienceHistory(user.name, user.history);
}

function nextQuestion() {
    if (!game.isActive || game.currentCardIndex >= game.cards.length) {
        handleEndGame();
        return;
    }

    const card = game.cards[game.currentCardIndex];
    question.id = card.id;
    question.front = card.front;
    question.back = card.back;

    elements.cardFront.textContent = question.front;
    elements.answerDisplay.textContent = question.back;
    elements.feedback.textContent = '';
    elements.answerButtons.innerHTML = '';

    // Reset card state
    game.showingAnswer = false;
    elements.cardBack.classList.add('hidden');
    elements.showAnswerBtn.classList.remove('hidden');
    elements.showAnswerBtn.textContent = 'Show Answer';

    game.questionStartTime = Date.now();
}

function showAnswer() {
    game.showingAnswer = true;
    elements.cardBack.classList.remove('hidden');
    elements.showAnswerBtn.classList.add('hidden');

    // Show mark correct/incorrect buttons
    elements.answerButtons.innerHTML = `
        <button class="answer-btn correct-btn" data-correct="true">I knew it</button>
        <button class="answer-btn wrong-btn" data-correct="false">I missed it</button>
    `;

    document.querySelectorAll('[data-correct]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            recordAnswer(e.target.dataset.correct === 'true');
        });
    });
}

function recordAnswer(isCorrect) {
    if (isCorrect) {
        game.correct++;
        game.streak++;
        game.score += 10 + (game.streak >= 3 ? 5 : 0); // Bonus for streak
        elements.feedback.textContent = 'Great!';
        elements.feedback.className = 'correct';

        // Celebration!
        if (game.streak >= 5 && game.streak % 5 === 0) {
            celebrateMilestone();
        } else {
            celebrateCorrect();
        }
    } else {
        game.streak = 0;
        elements.feedback.textContent = 'Review this one';
        elements.feedback.className = 'wrong';
    }

    game.total++;
    updateDisplay();

    // Record in mastery
    user.mastery[question.id] = {
        attempts: (user.mastery[question.id]?.attempts || 0) + 1,
        correct: (user.mastery[question.id]?.correct || 0) + (isCorrect ? 1 : 0),
        lastAttempt: new Date().toISOString()
    };
    user.masteryDirty = true;

    game.currentCardIndex++;
    setTimeout(() => nextQuestion(), 1500);
}

function updateDisplay() {
    elements.score.textContent = game.score;

    const progress = Math.round((game.currentCardIndex / game.cards.length) * 100);

    // Render streak display similar to math app
    if (game.streak === 0) {
        elements.streakDisplay.innerHTML = `<span style="color: #666;">${game.currentCardIndex} / ${game.cards.length}</span>`;
    } else {
        let html = '<div class="streak-indicator">';
        const dotsToShow = Math.min(game.streak, 10);

        for (let i = 1; i <= dotsToShow; i++) {
            const isMilestone = i % 5 === 0;
            html += `<div class="streak-dot${isMilestone ? ' milestone' : ''}"></div>`;
        }

        if (game.streak > 10) {
            html += `<span class="streak-count">${game.streak}</span>`;
        }

        html += `</div><span style="color: #666; margin-left: 10px;">${game.currentCardIndex} / ${game.cards.length}</span>`;
        elements.streakDisplay.innerHTML = html;
    }
}

// Celebration animations
function celebrateCorrect() {
    showCelebration(5, 12, false);
}

function celebrateMilestone() {
    showCelebration(10, 24, true);
}

function showCelebration(starCount, confettiCount, isBig) {
    const container = elements.celebration;
    container.classList.remove('hidden');
    container.innerHTML = '';

    if (isBig) {
        container.classList.add('streak-celebration');
    } else {
        container.classList.remove('streak-celebration');
    }

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${randomInt(10, 90)}%`;
        star.style.top = `${randomInt(20, 60)}%`;
        star.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(star);
    }

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${randomInt(5, 95)}%`;
        confetti.style.top = `${randomInt(0, 30)}%`;
        confetti.style.background = COLORS[randomInt(0, COLORS.length - 1)];
        confetti.style.animationDelay = `${i * 0.03}s`;
        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.classList.add('hidden');
        container.classList.remove('streak-celebration');
    }, 1200);
}

// Start the application
init();
