export interface PromptVariantRun {
  seedId: string;
  score: number;
  componentScores?: {
    validation?: number;
    quality?: number;
    completeness?: number;
    consistency?: number;
  };
}

export interface PromptVariantSample {
  variantId: string;
  runs: PromptVariantRun[];
}

export interface AbHarnessConfig {
  alpha?: number;
  minSampleSize?: number;
  minEffectSize?: number;
}

export interface PromptVariantComparison {
  variantA: string;
  variantB: string;
  seedsCompared: number;
  meanScoreA: number;
  meanScoreB: number;
  meanDelta: number;
  winsA: number;
  winsB: number;
  ties: number;
  pValue: number;
  statisticallySignificant: boolean;
  recommendedWinner: string | null;
  reason: string;
}

interface PairedScore {
  seedId: string;
  scoreA: number;
  scoreB: number;
}

const DEFAULT_CONFIG: Required<AbHarnessConfig> = {
  alpha: 0.05,
  minSampleSize: 8,
  minEffectSize: 1.0,
};

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function toSeedScoreMap(sample: PromptVariantSample): Map<string, number> {
  const map = new Map<string, number>();
  for (const run of sample.runs) {
    if (!run.seedId) continue;
    map.set(run.seedId, run.score);
  }
  return map;
}

function buildPairedScores(sampleA: PromptVariantSample, sampleB: PromptVariantSample): PairedScore[] {
  const mapA = toSeedScoreMap(sampleA);
  const mapB = toSeedScoreMap(sampleB);
  const paired: PairedScore[] = [];

  for (const [seedId, scoreA] of mapA.entries()) {
    const scoreB = mapB.get(seedId);
    if (typeof scoreB === 'number') {
      paired.push({ seedId, scoreA, scoreB });
    }
  }

  return paired;
}

// Two-sided sign test p-value from wins/losses (ties excluded).
function signTestPValue(winsA: number, winsB: number): number {
  const n = winsA + winsB;
  if (n === 0) return 1;

  const k = Math.min(winsA, winsB);
  let cumulative = 0;

  for (let i = 0; i <= k; i += 1) {
    cumulative += binomialProbability(n, i);
  }

  return Math.min(1, cumulative * 2);
}

function binomialProbability(n: number, k: number): number {
  return choose(n, k) * Math.pow(0.5, n);
}

function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const m = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= m; i += 1) {
    result = (result * (n - m + i)) / i;
  }
  return result;
}

export function comparePromptVariants(
  sampleA: PromptVariantSample,
  sampleB: PromptVariantSample,
  config: AbHarnessConfig = {},
): PromptVariantComparison {
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
    if (delta > 0) winsA += 1;
    else if (delta < 0) winsB += 1;
    else ties += 1;
  }

  const pValue = signTestPValue(winsA, winsB);
  const statisticallySignificant =
    paired.length >= cfg.minSampleSize &&
    Math.abs(meanDelta) >= cfg.minEffectSize &&
    pValue <= cfg.alpha;

  let recommendedWinner: string | null = null;
  let reason = 'No winner selected: insufficient statistical evidence.';

  if (statisticallySignificant) {
    recommendedWinner = meanDelta > 0 ? sampleA.variantId : sampleB.variantId;
    reason =
      `Winner ${recommendedWinner} selected with statistically significant paired result ` +
      `(p=${pValue.toFixed(4)}, mean delta=${meanDelta.toFixed(2)}).`;
  } else if (paired.length < cfg.minSampleSize) {
    reason = `No winner selected: paired sample size ${paired.length} is below minimum ${cfg.minSampleSize}.`;
  } else if (Math.abs(meanDelta) < cfg.minEffectSize) {
    reason =
      `No winner selected: mean delta ${Math.abs(meanDelta).toFixed(2)} is below effect threshold ${cfg.minEffectSize.toFixed(2)}.`;
  } else if (pValue > cfg.alpha) {
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