// Math Champion - Main Application

import * as Storage from './storage.js';
import * as Mastery from './mastery.js';
import * as Game from './game.js';
import * as UI from './ui.js';
import { getStrategyExplanation } from './strategies.js';

// Application state
const user = {
    name: null,
    history: [],
    mastery: {},
    masteryDirty: false
};

const game = Game.createGameState();
const question = Game.createQuestionState();

// Initialization
function init() {
    if (!UI.cacheElements()) {
        console.error('Failed to initialize: missing DOM elements');
        return;
    }

    bindEvents();
    renderUserList();
}

function bindEvents() {
    UI.getElement('add-user-btn').addEventListener('click', handleAddUser);
    UI.getElement('new-user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddUser();
    });

    UI.getElement('level-btns').forEach(btn => {
        btn.addEventListener('click', () => startGame(parseInt(btn.dataset.max)));
    });

    UI.getElement('quit-btn').addEventListener('click', handleEndGame);
    UI.getElement('progress-btn').addEventListener('click', showProgressScreen);
    UI.getElement('switch-user-btn').addEventListener('click', showUserScreen);
    UI.getElement('history-back-btn').addEventListener('click', showStartScreen);
    UI.getElement('play-again-btn').addEventListener('click', () => startGame(game.maxNumber));
    UI.getElement('result-menu-btn').addEventListener('click', showStartScreen);

    const backBtn = UI.getElement('back-to-home-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.location.href = 'index.html');
    }
}

// User management
function renderUserList() {
    const users = Storage.loadUsers();
    const names = Object.keys(users);
    UI.renderUserList(names, selectUser);
}

function handleAddUser() {
    const name = UI.getNewUserInput();
    if (!name) return;
    selectUser(name);
}

function selectUser(name) {
    user.name = name;
    user.history = Storage.loadUserHistory(name);
    user.mastery = Storage.loadMastery(name);
    user.masteryDirty = false;

    // Ensure user exists in storage
    const users = Storage.loadUsers();
    if (!users[name]) {
        users[name] = [];
        Storage.saveUsers(users);
    }

    showStartScreen();
}

// Screen navigation
function showUserScreen() {
    renderUserList();
    UI.showScreen('user-screen');
}

function showStartScreen() {
    UI.setWelcomeMessage(user.name);
    UI.showScreen('start-screen');
}

function showGameScreen() {
    UI.showScreen('game-screen');
}

function showResultScreen() {
    const accuracy = Game.getAccuracy(game);
    UI.renderResultStats(
        Game.LEVEL_NAMES[game.maxNumber],
        game.correct,
        game.total,
        accuracy,
        game.score
    );
    UI.showScreen('result-screen');
}

function showProgressScreen() {
    const tableMastery = Mastery.getTableMastery(user.mastery, 12);
    UI.renderMasteryGrid(tableMastery);
    UI.renderHistory(user.history, Game.LEVEL_NAMES);
    UI.showScreen('history-screen');
}

// Game flow
function startGame(maxNumber) {
    Game.resetGame(game, maxNumber);
    updateDisplay();
    showGameScreen();
    nextQuestion();
}

function handleEndGame() {
    if (!game.isActive) return;
    Game.endGame(game);

    // Batch save mastery data
    if (user.masteryDirty) {
        Storage.saveMastery(user.name, user.mastery);
        user.masteryDirty = false;
    }

    if (game.total > 0) {
        saveQuizResult();
    }

    showResultScreen();
}

function saveQuizResult() {
    user.history.unshift({
        date: new Date().toISOString(),
        level: game.maxNumber,
        score: game.score,
        correct: game.correct,
        total: game.total
    });

    if (user.history.length > 50) {
        user.history = user.history.slice(0, 50);
    }

    Storage.saveUserHistory(user.name, user.history);
}

function nextQuestion() {
    if (!game.isActive) return;

    // Check for break suggestion
    if (Game.shouldSuggestBreak(game)) {
        Game.markBreakSuggested(game);
        UI.setFeedback('Great focus! Consider a short break.');
    } else {
        UI.setFeedback('');
    }

    const [n1, n2] = Mastery.selectAdaptiveQuestion(user.mastery, game.maxNumber, Game.randomInt);
    Game.setQuestion(question, n1, n2);
    Game.startQuestionTimer(game);

    UI.setQuestion(question.num1, question.num2);

    const choices = Game.generateChoices(question.answer, game.maxNumber, Game.randomInt);
    UI.renderAnswerButtons(choices, checkAnswer);
}

function checkAnswer(choice, btn) {
    UI.disableAnswerButtons();

    const responseTime = Game.getResponseTime(game);
    const isCorrect = choice === question.answer;

    // Record attempt (batched save later)
    user.mastery = Mastery.recordAttempt(
        user.mastery,
        question.num1,
        question.num2,
        isCorrect,
        responseTime
    );
    user.masteryDirty = true;

    if (isCorrect) {
        handleCorrect(btn, responseTime);
    } else {
        handleWrong(btn);
    }
}

function handleCorrect(btn, responseTime) {
    Game.recordCorrectAnswer(game);

    UI.markButtonCorrect(btn);
    UI.setAnswerDisplay(question.answer);

    const feedback = Game.getFeedbackMessage(
        responseTime,
        game.streak,
        Game.isFastResponse(responseTime)
    );
    UI.setFeedback(feedback, 'correct');

    updateDisplay();

    if (game.streak >= Game.GAME_CONFIG.STREAK_MILESTONE) {
        UI.celebrateMilestone(Game.randomInt);
    } else {
        UI.celebrateCorrect(Game.randomInt);
    }

    setTimeout(nextQuestion, Game.GAME_CONFIG.CORRECT_DELAY_MS);
}

function handleWrong(btn) {
    Game.recordWrongAnswer(game);

    UI.markButtonWrong(btn);
    UI.setAnswerDisplay(question.answer);

    const strategy = getStrategyExplanation(question.num1, question.num2);
    if (strategy) {
        UI.setFeedbackHtml(
            `${question.num1} x ${question.num2} = ${question.answer}<br><small>${strategy}</small>`,
            'wrong'
        );
    } else {
        UI.setFeedback(`${question.num1} x ${question.num2} = ${question.answer}`, 'wrong');
    }

    UI.highlightCorrectAnswer(question.answer);
    updateDisplay();

    setTimeout(nextQuestion, Game.GAME_CONFIG.WRONG_DELAY_MS);
}

function updateDisplay() {
    UI.setScore(game.score);
    UI.renderStreakDisplay(game.streak);
}

// Start the application
init();
