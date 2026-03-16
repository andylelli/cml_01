const DEFAULT_CONFIG = {
    alpha: 0.05,
    minSampleSize: 8,
    minEffectSize: 1.0,
};
function mean(values) {
    if (values.length === 0)
        return 0;
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}
function toSeedScoreMap(sample) {
    const map = new Map();
    for (const run of sample.runs) {
        if (!run.seedId)
            continue;
        map.set(run.seedId, run.score);
    }
    return map;
}
function buildPairedScores(sampleA, sampleB) {
    const mapA = toSeedScoreMap(sampleA);
    const mapB = toSeedScoreMap(sampleB);
    const paired = [];
    for (const [seedId, scoreA] of mapA.entries()) {
        const scoreB = mapB.get(seedId);
        if (typeof scoreB === 'number') {
            paired.push({ seedId, scoreA, scoreB });
        }
    }
    return paired;
}
// Two-sided sign test p-value from wins/losses (ties excluded).
function signTestPValue(winsA, winsB) {
    const n = winsA + winsB;
    if (n === 0)
        return 1;
    const k = Math.min(winsA, winsB);
    let cumulative = 0;
    for (let i = 0; i <= k; i += 1) {
        cumulative += binomialProbability(n, i);
    }
    return Math.min(1, cumulative * 2);
}
function binomialProbability(n, k) {
    return choose(n, k) * Math.pow(0.5, n);
}
function choose(n, k) {
    if (k < 0 || k > n)
        return 0;
    if (k === 0 || k === n)
        return 1;
    const m = Math.min(k, n - k);
    let result = 1;
    for (let i = 1; i <= m; i += 1) {
        result = (result * (n - m + i)) / i;
    }
    return result;
}
export function comparePromptVariants(sampleA, sampleB, config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const paired = buildPairedScores(sampleA, sampleB);
    const deltas = paired.map((entry) => entry.scoreA - entry.scoreB);
    const meanDelta = mean(deltas);
    const meanScoreA = mean(paired.map((entry) => entry.scoreA));
    const meanScoreB = mean(paired.map((entry) => entry.scoreB));
    let winsA = 0;
    let winsB = 0;
    let ties = 0;
    for (const delta of deltas) {
        if (delta > 0)
            winsA += 1;
        else if (delta < 0)
            winsB += 1;
        else
            ties += 1;
    }
    const pValue = signTestPValue(winsA, winsB);
    const statisticallySignificant = paired.length >= cfg.minSampleSize &&
        Math.abs(meanDelta) >= cfg.minEffectSize &&
        pValue <= cfg.alpha;
    let recommendedWinner = null;
    let reason = 'No winner selected: insufficient statistical evidence.';
    if (statisticallySignificant) {
        recommendedWinner = meanDelta > 0 ? sampleA.variantId : sampleB.variantId;
        reason =
            `Winner ${recommendedWinner} selected with statistically significant paired result ` +
                `(p=${pValue.toFixed(4)}, mean delta=${meanDelta.toFixed(2)}).`;
    }
    else if (paired.length < cfg.minSampleSize) {
        reason = `No winner selected: paired sample size ${paired.length} is below minimum ${cfg.minSampleSize}.`;
    }
    else if (Math.abs(meanDelta) < cfg.minEffectSize) {
        reason =
            `No winner selected: mean delta ${Math.abs(meanDelta).toFixed(2)} is below effect threshold ${cfg.minEffectSize.toFixed(2)}.`;
    }
    else if (pValue > cfg.alpha) {
        reason = `No winner selected: p-value ${pValue.toFixed(4)} exceeds alpha ${cfg.alpha.toFixed(4)}.`;
    }
    return {
        variantA: sampleA.variantId,
        variantB: sampleB.variantId,
        seedsCompared: paired.length,
        meanScoreA,
        meanScoreB,
        meanDelta,
        winsA,
        winsB,
        ties,
        pValue,
        statisticallySignificant,
        recommendedWinner,
        reason,
    };
}
//# sourceMappingURL=ab-prompt-harness.js.map