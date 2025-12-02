// Mastery module - adaptive learning logic

const MASTERY_CONFIG = {
    THRESHOLD: 0.85,
    ROLLING_WINDOW: 20,
    TARGET_ACCURACY: 0.75
};

function getFactKey(a, b) {
    return a <= b ? `${a}x${b}` : `${b}x${a}`;
}

function createEmptyFactRecord() {
    return { attempts: [], correct: 0, total: 0 };
}

function recordAttempt(mastery, a, b, correct, responseTimeMs) {
    const key = getFactKey(a, b);
    if (!mastery[key]) {
        mastery[key] = createEmptyFactRecord();
    }

    const fact = mastery[key];
    fact.attempts.push({ correct, time: responseTimeMs, date: Date.now() });
    fact.total++;
    if (correct) fact.correct++;

    // Keep only last N attempts for rolling accuracy
    if (fact.attempts.length > MASTERY_CONFIG.ROLLING_WINDOW) {
        const removed = fact.attempts.shift();
        if (removed.correct) fact.correct--;
        fact.total--;
    }

    return mastery;
}

function getAccuracy(mastery, a, b) {
    const key = getFactKey(a, b);
    const fact = mastery[key];
    if (!fact || fact.total === 0) return null;
    return fact.correct / fact.total;
}

function getFactsNeedingPractice(mastery, maxNum) {
    const weak = [];
    const untested = [];

    for (let i = 1; i <= maxNum; i++) {
        for (let j = i; j <= maxNum; j++) {
            const acc = getAccuracy(mastery, i, j);
            if (acc === null) {
                untested.push([i, j]);
            } else if (acc < MASTERY_CONFIG.THRESHOLD) {
                weak.push({ fact: [i, j], accuracy: acc });
            }
        }
    }

    weak.sort((a, b) => a.accuracy - b.accuracy);
    return { weak: weak.map(f => f.fact), untested };
}

function selectAdaptiveQuestion(mastery, maxNum, randomInt) {
    const { weak, untested } = getFactsNeedingPractice(mastery, maxNum);

    // 60% weak facts, 20% untested, 20% review
    const roll = Math.random();

    if (roll < 0.6 && weak.length > 0) {
        const pool = weak.slice(0, Math.max(3, Math.ceil(weak.length / 3)));
        const [a, b] = pool[randomInt(0, pool.length - 1)];
        return Math.random() < 0.5 ? [a, b] : [b, a];
    }

    if (roll < 0.8 && untested.length > 0) {
        const [a, b] = untested[randomInt(0, untested.length - 1)];
        return Math.random() < 0.5 ? [a, b] : [b, a];
    }

    const a = randomInt(1, maxNum);
    const b = randomInt(1, maxNum);
    return [a, b];
}

function getTableMastery(mastery, maxNum) {
    const tables = {};
    for (let i = 2; i <= maxNum; i++) {
        let correctSum = 0;
        let total = 0;
        for (let j = 1; j <= maxNum; j++) {
            const acc = getAccuracy(mastery, i, j);
            if (acc !== null) {
                correctSum += acc;
                total++;
            }
        }
        if (total > 0) {
            tables[i] = Math.round((correctSum / total) * 100);
        }
    }
    return tables;
}

export {
    MASTERY_CONFIG,
    getFactKey,
    recordAttempt,
    getAccuracy,
    getFactsNeedingPractice,
    selectAdaptiveQuestion,
    getTableMastery
};
