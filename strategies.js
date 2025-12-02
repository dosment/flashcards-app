// Strategies module - multiplication strategy explanations

function getOther(a, b, target) {
    return a === target ? b : a;
}

function explainDoubling(a, b) {
    const n = Math.max(a, b);
    return `Double ${n}: ${n} + ${n} = ${a * b}`;
}

function explainTripling(a, b) {
    const n = Math.max(a, b);
    return `Triple ${n}: ${n} + ${n} + ${n} = ${a * b}`;
}

function explainDoubleDouble(a, b) {
    const n = Math.max(a, b);
    return `Double twice: ${n} x 2 = ${n * 2}, then x 2 = ${a * b}`;
}

function explainHalfOfTen(a, b) {
    const n = Math.max(a, b);
    return `Half of x10: ${n} x 10 = ${n * 10}, half = ${a * b}`;
}

function explainTimesTenMinusOne(a, b) {
    const other = getOther(a, b, 9);
    return `x10 minus one group: ${other} x 10 = ${other * 10}, minus ${other} = ${a * b}`;
}

function explainAddZero(a, b) {
    const n = Math.max(a, b);
    return `Add a zero: ${n} becomes ${a * b}`;
}

function explainTimesFivePlusOne(a, b) {
    const other = getOther(a, b, 6);
    return `x5 plus one more: (${other} x 5) + ${other} = ${other * 5} + ${other} = ${a * b}`;
}

function explainTimesFivePlusTwo(a, b) {
    const other = getOther(a, b, 7);
    return `x5 plus x2: (${other} x 5) + (${other} x 2) = ${other * 5} + ${other * 2} = ${a * b}`;
}

function explainTripleDouble(a, b) {
    const other = getOther(a, b, 8);
    return `Double three times: ${other} -> ${other * 2} -> ${other * 4} -> ${a * b}`;
}

function explainTimesTenPlusOne(a, b) {
    const other = getOther(a, b, 11);
    return `x10 plus one more: ${other} x 10 + ${other} = ${other * 10} + ${other} = ${a * b}`;
}

function explainTimesTenPlusTwo(a, b) {
    const other = getOther(a, b, 12);
    return `x10 plus x2: (${other} x 10) + (${other} x 2) = ${other * 10} + ${other * 2} = ${a * b}`;
}

const STRATEGY_MAP = {
    2: explainDoubling,
    3: explainTripling,
    4: explainDoubleDouble,
    5: explainHalfOfTen,
    6: explainTimesFivePlusOne,
    7: explainTimesFivePlusTwo,
    8: explainTripleDouble,
    9: explainTimesTenMinusOne,
    10: explainAddZero,
    11: explainTimesTenPlusOne,
    12: explainTimesTenPlusTwo
};

function getStrategyExplanation(a, b) {
    // Try to find a strategy based on either factor
    const strategy = STRATEGY_MAP[a] || STRATEGY_MAP[b];
    if (strategy) {
        return strategy(a, b);
    }
    return null;
}

export { getStrategyExplanation };
