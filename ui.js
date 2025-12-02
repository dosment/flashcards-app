// UI module - DOM manipulation and rendering

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];

const elements = {};

function cacheElements() {
    const ids = [
        'user-screen',
        'user-list',
        'new-user-input',
        'add-user-btn',
        'start-screen',
        'welcome-msg',
        'progress-btn',
        'switch-user-btn',
        'game-screen',
        'num1',
        'num2',
        'answer-display',
        'answer-grid',
        'feedback',
        'score',
        'streak-display',
        'quit-btn',
        'result-screen',
        'result-title',
        'result-stats',
        'play-again-btn',
        'result-menu-btn',
        'history-screen',
        'history-list',
        'history-back-btn',
        'mastery-grid',
        'celebration'
    ];

    for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) {
            console.error(`Missing element: ${id}`);
            return false;
        }
        elements[id] = el;
    }

    elements['level-btns'] = document.querySelectorAll('.level-btn');
    if (elements['level-btns'].length === 0) {
        console.error('Missing level buttons');
        return false;
    }

    return true;
}

function getElement(id) {
    return elements[id];
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    elements[screenId].classList.add('active');
}

function setWelcomeMessage(name) {
    elements['welcome-msg'].textContent = `Hi, ${name}!`;
}

function setQuestion(num1, num2) {
    elements['num1'].textContent = num1;
    elements['num2'].textContent = num2;
    elements['answer-display'].textContent = '?';
}

function setAnswerDisplay(answer) {
    elements['answer-display'].textContent = answer;
}

function setFeedback(text, className = '') {
    elements['feedback'].textContent = text;
    elements['feedback'].className = className;
}

function setFeedbackHtml(html, className = '') {
    elements['feedback'].innerHTML = html;
    elements['feedback'].className = className;
}

function setScore(score) {
    elements['score'].textContent = score;
}

function renderStreakDisplay(streak, maxDots = 10) {
    const container = elements['streak-display'];

    if (streak === 0) {
        container.innerHTML = '';
        return;
    }

    const dotsToShow = Math.min(streak, maxDots);
    let html = '<div class="streak-indicator">';

    for (let i = 1; i <= dotsToShow; i++) {
        const isMilestone = i % 5 === 0;
        html += `<div class="streak-dot${isMilestone ? ' milestone' : ''}"></div>`;
    }

    if (streak > maxDots) {
        html += `<span class="streak-count">${streak}</span>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

function renderAnswerButtons(choices, onSelect) {
    const grid = elements['answer-grid'];
    grid.innerHTML = '';

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = choice;
        btn.addEventListener('click', () => onSelect(choice, btn));
        grid.appendChild(btn);
    });
}

function disableAnswerButtons() {
    const buttons = elements['answer-grid'].querySelectorAll('.answer-btn');
    buttons.forEach(b => b.style.pointerEvents = 'none');
}

function markButtonCorrect(btn) {
    btn.classList.add('correct-choice');
}

function markButtonWrong(btn) {
    btn.classList.add('wrong-choice');
}

function highlightCorrectAnswer(correctAnswer) {
    const buttons = elements['answer-grid'].querySelectorAll('.answer-btn');
    buttons.forEach(b => {
        if (parseInt(b.textContent) === correctAnswer) {
            b.classList.add('correct-choice');
        }
    });
}

function renderUserList(names, onSelect) {
    const container = elements['user-list'];
    container.innerHTML = '';

    names.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'user-btn';
        btn.textContent = name;
        btn.addEventListener('click', () => onSelect(name));
        container.appendChild(btn);
    });
}

function getNewUserInput() {
    const input = elements['new-user-input'];
    const value = input.value.trim();
    input.value = '';
    return value;
}

function renderResultStats(levelName, correct, total, accuracy, score) {
    elements['result-title'].textContent = getResultTitle(accuracy, total);
    elements['result-stats'].innerHTML = `
        <div class="stat-row">
            <span class="stat-label">Level</span>
            <span class="stat-value">${levelName}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Questions</span>
            <span class="stat-value">${correct} / ${total}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value">${accuracy}%</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Score</span>
            <span class="stat-value highlight">${score}</span>
        </div>
    `;
}

function getResultTitle(accuracy, total) {
    if (accuracy === 100 && total >= 5) return 'Perfect Score!';
    if (accuracy >= 80) return 'Great Job!';
    if (accuracy >= 60) return 'Good Effort!';
    return 'Quiz Complete';
}

function renderMasteryGrid(tableMastery) {
    let cellsHtml = '';

    for (let i = 2; i <= 12; i++) {
        const pct = tableMastery[i];
        let cls = 'untested';
        let pctText = '-';

        if (pct !== undefined) {
            pctText = `${pct}%`;
            if (pct >= 85) {
                cls = 'mastered';
            } else if (pct >= 60) {
                cls = 'learning';
            } else {
                cls = 'struggling';
            }
        }

        cellsHtml += `
            <div class="mastery-cell ${cls}">
                <span class="table-num">${i}s</span>
                <span class="pct">${pctText}</span>
            </div>
        `;
    }

    elements['mastery-grid'].innerHTML = cellsHtml + `
        <div class="mastery-legend" style="grid-column: 1 / -1;">
            <span><div class="legend-dot green"></div> 85%+</span>
            <span><div class="legend-dot yellow"></div> 60-84%</span>
            <span><div class="legend-dot red"></div> &lt;60%</span>
        </div>
    `;
}

function renderHistory(history, levelNames) {
    const container = elements['history-list'];

    if (history.length === 0) {
        container.innerHTML = '<p class="history-empty">No quizzes yet. Start playing!</p>';
        return;
    }

    container.innerHTML = history.map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString();
        const accuracy = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;

        return `
            <div class="history-item">
                <div>
                    <div class="history-level">${levelNames[entry.level]}</div>
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

function celebrateCorrect(randomInt) {
    showCelebration(5, 12, randomInt);
}

function celebrateMilestone(randomInt) {
    showCelebration(10, 24, randomInt, true);
}

function showCelebration(starCount, confettiCount, randomInt, isBig = false) {
    const container = elements['celebration'];
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

export {
    cacheElements,
    getElement,
    showScreen,
    setWelcomeMessage,
    setQuestion,
    setAnswerDisplay,
    setFeedback,
    setFeedbackHtml,
    setScore,
    renderStreakDisplay,
    renderAnswerButtons,
    disableAnswerButtons,
    markButtonCorrect,
    markButtonWrong,
    highlightCorrectAnswer,
    renderUserList,
    getNewUserInput,
    renderResultStats,
    renderMasteryGrid,
    renderHistory,
    celebrateCorrect,
    celebrateMilestone
};
