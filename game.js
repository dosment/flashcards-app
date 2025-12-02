// Game module - core game logic

const GAME_CONFIG = {
    ANSWER_COUNT: 4,
    CORRECT_DELAY_MS: 1000,
    WRONG_DELAY_MS: 2200,
    BASE_SCORE: 10,
    STREAK_BONUS: 2,
    STREAK_MILESTONE: 5,
    SESSION_BREAK_MS: 10 * 60 * 1000,
    RESPONSE_FAST_MS: 3000
};

const LEVEL_NAMES = {
    5: 'Beginner',
    10: 'Explorer',
    12: 'Champion'
};

function createGameState() {
    return {
        score: 0,
        streak: 0,
        maxNumber: 10,
        correct: 0,
        total: 0,
        isActive: false,
        sessionStart: null,
        breakSuggested: false,
        questionStart: null
    };
}

function createQuestionState() {
    return {
        num1: 0,
        num2: 0,
        answer: 0
    };
}

function resetGame(game, maxNumber) {
    game.maxNumber = maxNumber;
    game.score = 0;
    game.streak = 0;
    game.correct = 0;
    game.total = 0;
    game.isActive = true;
    game.sessionStart = Date.now();
    game.breakSuggested = false;
}

function setQuestion(questionState, num1, num2) {
    questionState.num1 = num1;
    questionState.num2 = num2;
    questionState.answer = num1 * num2;
}

function startQuestionTimer(game) {
    game.questionStart = Date.now();
}

function getResponseTime(game) {
    return Date.now() - game.questionStart;
}

function shouldSuggestBreak(game) {
    if (game.breakSuggested) return false;
    return Date.now() - game.sessionStart > GAME_CONFIG.SESSION_BREAK_MS;
}

function markBreakSuggested(game) {
    game.breakSuggested = true;
}

function recordCorrectAnswer(game) {
    game.streak++;
    game.correct++;
    game.total++;
    game.score += GAME_CONFIG.BASE_SCORE + (game.streak - 1) * GAME_CONFIG.STREAK_BONUS;
}

function recordWrongAnswer(game) {
    game.streak = 0;
    game.total++;
}

function endGame(game) {
    game.isActive = false;
}

function getAccuracy(game) {
    if (game.total === 0) return 0;
    return Math.round((game.correct / game.total) * 100);
}

function generateChoices(correctAnswer, maxNumber, randomInt) {
    const wrong = new Set();
    const maxProduct = maxNumber * maxNumber;
    const needed = GAME_CONFIG.ANSWER_COUNT - 1;

    while (wrong.size < needed) {
        const candidate = generateDistractor(correctAnswer, maxNumber, maxProduct, randomInt);
        if (isValidDistractor(candidate, correctAnswer, maxProduct, wrong)) {
            wrong.add(candidate);
        }
    }

    return shuffle([correctAnswer, ...Array.from(wrong)], randomInt);
}

function generateDistractor(correctAnswer, maxNumber, maxProduct, randomInt) {
    const strategy = Math.random();

    if (strategy < 0.4) {
        const offset = randomInt(1, 8) * (Math.random() < 0.5 ? 1 : -1);
        return correctAnswer + offset;
    }

    if (strategy < 0.7) {
        return randomInt(1, maxNumber) * randomInt(1, maxNumber);
    }

    return randomInt(1, maxProduct);
}

function isValidDistractor(candidate, correctAnswer, maxProduct, existing) {
    return candidate > 0 &&
           candidate <= maxProduct &&
           candidate !== correctAnswer &&
           !existing.has(candidate);
}

function shuffle(array, randomInt) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function getFeedbackMessage(responseTime, streak, isFastResponse) {
    if (streak >= GAME_CONFIG.STREAK_MILESTONE) {
        return `${streak} in a row!`;
    }

    if (isFastResponse) {
        const messages = ['Fast and sure!', 'Quick thinking!', 'Automatic!', 'Sharp!'];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    const messages = ['Yes!', 'Got it!', 'Correct!', 'Right!'];
    return messages[Math.floor(Math.random() * messages.length)];
}

function isFastResponse(responseTime) {
    return responseTime < GAME_CONFIG.RESPONSE_FAST_MS;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
    GAME_CONFIG,
    LEVEL_NAMES,
    createGameState,
    createQuestionState,
    resetGame,
    setQuestion,
    startQuestionTimer,
    getResponseTime,
    shouldSuggestBreak,
    markBreakSuggested,
    recordCorrectAnswer,
    recordWrongAnswer,
    endGame,
    getAccuracy,
    generateChoices,
    getFeedbackMessage,
    isFastResponse,
    randomInt
};
