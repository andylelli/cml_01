/**
 * ANALYSIS_109 M2 — WHO DOES THE READER SUSPECT AFTER EACH CHAPTER?
 *
 * Suspense, after Cheong & Young (Suspenser), is a function of how many solutions the reader still
 * holds open. For a whodunit that is a posterior over the suspects: start uniform, and let each clue the
 * reader is shown multiply the odds of the people it implicates and clears. The Shannon entropy
 * H = −Σ p·log₂p of that posterior is the reader's uncertainty; a fair mystery keeps it up until the
 * discriminating test and lets it fall there.
 *
 * MEASURED before this was built: in 4 of 4 golden contracts, clues naming the culprit are owned by
 * chapters 4–7 with the test at 8. The reviews call the culprit too obvious in 1 of 72 — the rubric has
 * no misdirection category, and A_95 M6 found the defect lands as "chapters circle the same
 * information" — so this is a report on the SCHEDULE, not a predictor of the score (A_109 step 6).
 *
 * The likelihoods are deliberately COARSE (ASSUMED): each implicating clue multiplies the odds of the
 * people it implicates by IMPLICATE_RATIO, each clearing clue or clearance multiplies theirs by
 * CLEAR_RATIO. The model's job is to catch "this chapter hands the reader the culprit", not to simulate a
 * reader; every verdict is relative to the same constants, so two schedules of one case compare fairly.
 */
import type { CaseModel } from "./model.js";

export const IMPLICATE_RATIO = 4;
/**
 * A clue shown WITHOUT its conclusion — the screwdriver among a watchmaker's effects, not "only
 * Fenwick had the tools". Still evidence, so above 1; far weaker than the stated conclusion.
 */
export const WITHHELD_RATIO = 1.5;
export const CLEAR_RATIO = 0.05;
/** Two equally live suspects. Below it before the test, the reader has one answer. */
export const FLOOR_BITS = 1;
/** The culprit as the reader's clear favourite. */
export const LEAD_P = 0.5;

export interface ReaderInput {
  /** clue id → the chapter it is first shown in (the contract's ownership). */
  ownership: ReadonlyMap<string, number>;
  /** suspect name → the chapter a stated clearance clears them in, when the contract places one. */
  clearances?: ReadonlyMap<string, number>;
  chapters: ReadonlyArray<number>;
  testChapter: number;
  revealChapter: number;
  /** Clues shown before the test without their conclusion (weaker: `WITHHELD_RATIO`). */
  withheld?: ReadonlySet<string>;
  /** Evidence the contract shows that is not a clue — the false solution's points, owned (A_109 step 6). */
  leads?: ReadonlyArray<{ chapter: number; implicates: string }>;
  /** Override the likelihood ratios — for the sensitivity check only; the report uses the constants. */
  ratios?: { implicate?: number; withheld?: number; clear?: number };
}

export interface ReaderChapter {
  chapter: number;
  posterior: Record<string, number>;
  entropy: number;
  leader: string;
  leaderP: number;
}

export interface ReaderAnalysis {
  walk: ReaderChapter[];
  /** The first chapter before the test where the reader holds fewer than two live suspects. */
  floorBrokenAt: number | null;
  /** The first chapter before the test where the culprit is the reader's clear favourite. */
  culpritLeadsAt: number | null;
  /** At the midpoint, is the false solution's accused the favourite? null when there is none. */
  falseLeadAtMidpoint: boolean | null;
  /** After the reveal, is the culprit ≥ 0.9? */
  collapsed: boolean;
  /** Clues that implicate the culprit, with their chapters — what re-scheduling can move. */
  culpritClues: Array<{ id: string; chapter: number }>;
}

const entropy = (p: Record<string, number>): number =>
  -Object.values(p).reduce((sum, x) => (x > 0 ? sum + x * Math.log2(x) : sum), 0);

export const walkReader = (model: CaseModel, input: ReaderInput): ReaderAnalysis => {
  const names = model.suspects.map((s) => s.name);
  const odds: Record<string, number> = Object.fromEntries(names.map((n) => [n, 1]));
  const culprits = new Set(model.culprits);
  const chapters = [...input.chapters].sort((a, b) => a - b);
  const walk: ReaderChapter[] = [];
  const implicate = input.ratios?.implicate ?? IMPLICATE_RATIO;
  const withheldRatio = input.ratios?.withheld ?? WITHHELD_RATIO;
  const clear = input.ratios?.clear ?? CLEAR_RATIO;

  for (const chapter of chapters) {
    for (const clue of model.clues) {
      if (input.ownership.get(clue.id) !== chapter) continue;
      const ratio = input.withheld?.has(clue.id) && chapter < input.testChapter ? withheldRatio : implicate;
      for (const n of clue.implicates) if (n in odds) odds[n] = odds[n]! * ratio;
      for (const n of clue.clears) if (n in odds) odds[n] = odds[n]! * clear;
    }
    for (const lead of input.leads ?? []) {
      if (lead.chapter === chapter && lead.implicates in odds) odds[lead.implicates] = odds[lead.implicates]! * implicate;
    }
    for (const [name, at] of input.clearances ?? []) {
      if (at === chapter && name in odds) odds[name] = odds[name]! * clear;
    }
    const total = Object.values(odds).reduce((a, b) => a + b, 0) || 1;
    const posterior = Object.fromEntries(names.map((n) => [n, odds[n]! / total]));
    // A leader only when strictly ahead: at a tie there is no favourite, whatever the cast order.
    const ranked = Object.entries(posterior).sort((a, b) => b[1] - a[1]);
    const strict = ranked.length > 1 ? ranked[0]![1] - ranked[1]![1] > 1e-9 : true;
    const [leader, leaderP] = strict && ranked[0] ? ranked[0] : ["", ranked[0]?.[1] ?? 0];
    walk.push({ chapter, posterior, entropy: entropy(posterior), leader, leaderP });
  }

  const beforeTest = walk.filter((w) => w.chapter < input.testChapter);
  const mid = beforeTest[Math.floor((beforeTest.length - 1) / 2)];
  const atReveal = walk.find((w) => w.chapter === input.revealChapter) ?? walk[walk.length - 1];
  return {
    walk,
    floorBrokenAt: beforeTest.find((w) => w.entropy < FLOOR_BITS)?.chapter ?? null,
    culpritLeadsAt: beforeTest.find((w) => culprits.has(w.leader) && w.leaderP >= LEAD_P)?.chapter ?? null,
    falseLeadAtMidpoint: model.falseAccused && mid ? mid.leader === model.falseAccused : null,
    collapsed: atReveal ? model.culprits.some((c) => (atReveal.posterior[c] ?? 0) >= 0.9) : false,
    culpritClues: model.clues
      .filter((c) => c.implicates.some((n) => culprits.has(n)) && input.ownership.has(c.id))
      .map((c) => ({ id: c.id, chapter: input.ownership.get(c.id)! }))
      .sort((a, b) => a.chapter - b.chapter),
  };
};

/**
 * A_110 Part V §38.2 / WP-007 §5.1 — SURPRISE, after Ely, Frankel & Kamenica (J. Political Economy 2015):
 * how far the reader's belief over the suspects moves in a chapter, the Euclidean distance between this
 * chapter's posterior and the last (the first chapter is measured from a uniform prior). Their
 * suspense-optimal plot holds uncertainty to the end and spends it in late, large, rare moves; a chapter
 * that moves the belief by less than `DEAD_CHAPTER_MOVE` before the test tells the reader nothing about who.
 *
 * MEASURED over the 64 stored contracts: the culprit is the favourite by chapter 6 in 64 of 64 (by
 * chapter 4 in 52), against a test in chapter 8 in 57, and the median book has 71% of its pre-test
 * chapters dead. A REPORT on the schedule — it does not predict the reader's mark (r ≤ 0.27 on 34 reads,
 * under the screen bar), so it must never gate.
 */
export const DEAD_CHAPTER_MOVE = 0.02;

export interface SurpriseLedger {
  /** Belief movement per chapter, in walk order. */
  surprise: Array<{ chapter: number; move: number }>;
  /** The first chapter the culprit is the reader's clear favourite (p ≥ `LEAD_P`), or null. */
  settledAt: number | null;
  /** Chapters before the test, and how many of them move the belief by less than `DEAD_CHAPTER_MOVE`. */
  beforeTest: number;
  deadBeforeTest: number;
  /** The share of all movement that happens before the test chapter. */
  shareBeforeTest: number;
}

export const surpriseOf = (model: CaseModel, analysis: ReaderAnalysis, testChapter: number): SurpriseLedger => {
  const names = model.suspects.map((s) => s.name);
  const culprits = new Set(model.culprits);
  let prev: Record<string, number> = Object.fromEntries(names.map((n) => [n, names.length ? 1 / names.length : 0]));
  const surprise = analysis.walk.map((w) => {
    const move = Math.sqrt(names.reduce((sum, n) => sum + ((w.posterior[n] ?? 0) - (prev[n] ?? 0)) ** 2, 0));
    prev = w.posterior;
    return { chapter: w.chapter, move };
  });
  const before = surprise.filter((s) => s.chapter < testChapter);
  const total = surprise.reduce((a, s) => a + s.move, 0);
  const settled = analysis.walk.find((w) => [...culprits].some((c) => (w.posterior[c] ?? 0) >= LEAD_P));
  return {
    surprise,
    settledAt: settled?.chapter ?? null,
    beforeTest: before.length,
    deadBeforeTest: before.filter((s) => s.move < DEAD_CHAPTER_MOVE).length,
    shareBeforeTest: total > 0 ? before.reduce((a, s) => a + s.move, 0) / total : 0,
  };
};

export const summariseSurprise = (l: SurpriseLedger, testChapter: number): string => {
  const curve = l.surprise.map((s) => s.move.toFixed(2)).join(" ");
  const settled = l.settledAt === null ? "the culprit never leads" : `the culprit leads from chapter ${l.settledAt}`;
  return `surprise by chapter: ${curve} · ${settled}, test at ${testChapter} · ${l.deadBeforeTest} of ${l.beforeTest} chapters before the test move the belief < ${DEAD_CHAPTER_MOVE}`;
};

export const summariseReader = (r: ReaderAnalysis, model: CaseModel): string => {
  const culprit = model.culprits[0] ?? "the culprit";
  const curve = r.walk.map((w) => w.entropy.toFixed(1)).join(" ");
  const parts = [`reader's uncertainty by chapter (bits): ${curve}`];
  parts.push(r.culpritLeadsAt !== null ? `${culprit} is the favourite from chapter ${r.culpritLeadsAt}, before the test` : "the culprit is not the favourite before the test");
  if (r.floorBrokenAt !== null) parts.push(`fewer than two live suspects from chapter ${r.floorBrokenAt}`);
  if (r.falseLeadAtMidpoint !== null) parts.push(r.falseLeadAtMidpoint ? "the false suspect leads at the midpoint" : "the false suspect does NOT lead at the midpoint");
  parts.push(r.collapsed ? "resolved at the reveal" : "NOT resolved at the reveal");
  return parts.join(" · ");
};
