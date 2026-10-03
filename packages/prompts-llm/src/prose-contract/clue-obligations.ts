/**
 * Clue obligations and the CML→outline scene-ref join: which clues a chapter owes, whether its text carries them, and the outline scene a CML reference resolves to.
 *
 * Moved out of the v1 engine's `agent9-prose/clue-validation.ts` by owner decision 1 (2026-09-30), which deleted that
 * engine; these are the declarations the v2 engine, Agent 7 or scoring still read (with every helper they
 * reference, moved by `scripts/move-declarations.mjs --closure`). Nothing in them changed.
 */
import { readBooleanFlag } from "@cml/cml";
import { deriveClueObservable } from "../shared/clue-observable.js";
import type { ClueDistributionResult } from "../types/clue-distribution.js";

const normalizeSceneSignalText = (scene: any): string => {
  const purpose = String(scene?.purpose ?? "");
  const summary = String(scene?.summary ?? "");
  const title = String(scene?.title ?? "");
  const dramatic = [
    scene?.dramaticElements?.revelation,
    scene?.dramaticElements?.conflict,
    scene?.dramaticElements?.tension,
  ].map((value) => String(value ?? "")).join(" ");
  return `${purpose} ${summary} ${title} ${dramatic}`.toLowerCase();
};

export const getPerActSceneNumber = (scene: any, allOutlineScenes?: any[]): number => {
  const sceneAct = Number(scene?.act);
  const globalSceneNumber = Number(scene?.sceneNumber);
  if (!Number.isFinite(globalSceneNumber)) return 0;
  if (!Array.isArray(allOutlineScenes) || !Number.isFinite(sceneAct)) return globalSceneNumber;
  return globalSceneNumber - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length;
};

/**
 * ── A_87: HOW a scene ref resolved, not merely whether ───────────────────────────────────────────
 *
 * `scene_number` IS A GLOBAL SCENE INDEX. That is what Agent 3 emits and what resolves; the schema
 * and the prompt now say so (A_87 P2/P3). `act_number` is advisory context, and when the two
 * disagree the number is the half to trust.
 *
 * WHY THIS TYPE EXISTS. A keyword match returned `true` in exactly the same way an exact coordinate
 * match did, so a join that had NEVER resolved was indistinguishable from a working one — for 45
 * runs. MEASURED by replaying this matcher over all 45 stored (cml, outline) pairs:
 *
 *   culprit_revelation_scene   resolves exactly    0/45   (0%)
 *   discriminating_test_scene  resolves exactly    1/45   (2%)
 *   suspect_clearance_scenes   resolves exactly    4/179  (2%)
 *   clue_to_scene_mapping      resolves exactly  320/368  (87%)   <- the control
 *
 * The last row is what makes this a COORDINATE defect and not a matcher defect: the matcher works
 * when it is given real coordinates. Consequence of the other rows: chapter-contract assignment ran
 * on the `signal` fallback for the life of the project, and on 11 of 45 runs (24%) the reveal
 * contract was emitted on NO chapter, because the discriminating-test keyword claimed the reveal
 * scene first (`isRevealChapter = !isDiscriminatingTestChapter`).
 *
 * The rule this encodes, for the next cross-agent reference: report the PATH, never just the result.
 */
export type SceneRefPath = "exact" | "global-scene" | "signal" | "none";

/**
 * A_87 P2 — trust a resolving global scene number over a disagreeing act number.
 *
 * Agent 3 emits `act3/sc6` in 45 of 45 archived runs, because that pair is the worked example in its
 * own prompt. Read as a GLOBAL index `scene_number` resolves 45/45; read as per-act, 0/45. The act
 * half is simply wrong — global scene 6 lives in act 2 under the usual 3/4/3 shape — and the matcher
 * required both halves to agree, so it rejected a coordinate whose useful half was correct.
 *
 * OFF: byte-identical to the historical matcher, asserted by test. Env read at CALL time (ADR-0004).
 */
export const isGlobalSceneRefEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_SCENE_REF_RESOLUTION ?? "").trim());

/**
 * Resolve a CML scene ref against one outline scene, returning HOW it matched.
 *
 * `exact`        the act agrees and the scene number matches (global or per-act)
 * `global-scene` the act disagrees but the GLOBAL scene number matches — P2, flag-gated
 * `signal`       neither; the caller's keyword pattern matched the scene's text
 * `none`         no match
 */
export const resolveSceneRef = (
  scene: any,
  ref: any,
  allOutlineScenes?: any[],
  signalPattern?: RegExp,
): SceneRefPath => {
  if (!scene || !ref) return "none";
  const sceneAct = Number(scene?.act);
  const refAct = Number(ref?.act_number);
  const actDisagrees = Number.isFinite(refAct) && Number.isFinite(sceneAct) && sceneAct !== refAct;

  const refSceneNumber = Number(ref?.scene_number);
  const globalSceneNumber = Number(scene?.sceneNumber);
  const perActSceneNumber = getPerActSceneNumber(scene, allOutlineScenes);
  const numberMatches =
    Number.isFinite(refSceneNumber) &&
    refSceneNumber > 0 &&
    (refSceneNumber === globalSceneNumber || refSceneNumber === perActSceneNumber);

  if (actDisagrees) {
    // P2. Without the flag this is the historical early `return false`, before the number or the
    // signal is ever consulted — which is precisely how a correct scene number was thrown away.
    if (
      isGlobalSceneRefEnabled() &&
      Number.isFinite(refSceneNumber) &&
      refSceneNumber > 0 &&
      refSceneNumber === globalSceneNumber
    ) {
      return "global-scene";
    }
    return "none";
  }

  if (numberMatches) return "exact";
  return signalPattern && signalPattern.test(normalizeSceneSignalText(scene)) ? "signal" : "none";
};

/**
 * A_87 P1 — audit every scene ref in a case against the outline that was actually produced.
 *
 * Telemetry, not a gate: B1 forbids gating something that fires on 98% of runs, and the honest first
 * move is to make the rate visible. ONE summary line per run, because 30% of a run's warnings were
 * already schema noise and this must not become more of it.
 */
export interface SceneRefAudit {
  total: number;
  exact: number;
  globalScene: number;
  unresolved: number;
  /** `kind act/scene` for each ref that did not resolve by coordinate. */
  unresolvedRefs: string[];
}

export const auditCmlSceneRefs = (cmlCase: any, allOutlineScenes: any[]): SceneRefAudit => {
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  const audit: SceneRefAudit = { total: 0, exact: 0, globalScene: 0, unresolved: 0, unresolvedRefs: [] };
  if (scenes.length === 0) return audit;
  // The archive ships both the bare case and the `{CASE: …}` wrapper; a bare read silently
  // audits zero refs and reports a clean join — the exact failure this audit exists to catch.
  const pr = cmlCase?.prose_requirements ?? cmlCase?.CASE?.prose_requirements ?? {};
  const refs: Array<{ kind: string; ref: any }> = [];
  if (pr.culprit_revelation_scene) refs.push({ kind: "culprit_revelation_scene", ref: pr.culprit_revelation_scene });
  if (pr.discriminating_test_scene) refs.push({ kind: "discriminating_test_scene", ref: pr.discriminating_test_scene });
  for (const r of (Array.isArray(pr.suspect_clearance_scenes) ? pr.suspect_clearance_scenes : [])) {
    refs.push({ kind: "suspect_clearance_scene", ref: r });
  }
  for (const r of (Array.isArray(pr.clue_to_scene_mapping) ? pr.clue_to_scene_mapping : [])) {
    refs.push({ kind: "clue_to_scene_mapping", ref: r });
  }

  for (const { kind, ref } of refs) {
    audit.total += 1;
    // No signal pattern here on purpose: this audits the COORDINATE, which is the thing that rots.
    const paths = scenes.map((s) => resolveSceneRef(s, ref, scenes));
    if (paths.includes("exact")) audit.exact += 1;
    else if (paths.includes("global-scene")) audit.globalScene += 1;
    else {
      audit.unresolved += 1;
      if (audit.unresolvedRefs.length < 6) {
        audit.unresolvedRefs.push(`${kind} act${ref?.act_number}/sc${ref?.scene_number}`);
      }
    }
  }
  return audit;
};

/** The one-line run summary. Empty string when every ref resolved by coordinate. */
/**
 * One compact line per run. The archive's typical run has SIX unresolved refs, four of them the
 * identical `suspect_clearance_scene act3/sc5`, so the list is deduped with counts — an unreadable
 * warning is a warning nobody reads (the WARNINGS-noise lesson, CLAUDE.md).
 *
 * Always returns a line, including when the join is clean: the defect this exists to catch was
 * precisely that a broken join and a working one looked identical in every log.
 */
export const summariseSceneRefAudit = (audit: SceneRefAudit): string => {
  if (audit.total === 0) return "no CML scene refs to resolve";
  const tally = new Map<string, number>();
  for (const r of audit.unresolvedRefs) tally.set(r, (tally.get(r) ?? 0) + 1);
  const listed = [...tally.entries()]
    .map(([r, n]) => (n > 1 ? `${r} x${n}` : r))
    .join("; ");
  const head =
    `${audit.exact}/${audit.total} exact, ${audit.globalScene} global-scene, ` +
    `${audit.unresolved} unresolved`;
  if (audit.unresolved === 0 && audit.globalScene === 0) return `${head} — join clean`;
  return `${head} -> keyword fallback (${listed})`;
};

const GOLDEN_AGE_FINAL_TRAP_BEAT = "final_trap";

const GOLDEN_AGE_REVELATION_BEAT = "revelation";

const readSceneBeat = (scene: any): string => String(scene?.beat ?? "").trim().toLowerCase();

// A_68 FIX C: beat-independent aftermath fallback. The beat-based guard below only fires when the
// outline scenes carry LLM-emitted `.beat` strings; when those are absent (common — the field is
// Optional and set only for the exact-10-scene format), the guard returns false, getCulpritRevealChapter
// falls back to `totalScenes`, and the final chapter gets a second MANDATORY RESOLUTION → the recurring
// duplicate "Clearance and Culprit Revealed" chapter. This fallback recovers the aftermath decision from
// scene title/purpose SIGNALS when (and only when) no beats are present. Flag-gated, default-OFF,
// probe-first (per §2.8). Runtime getter — never a module const (dotenv-freeze trap).
const isAftermathFinalSignalFallbackEnabled = (): boolean =>
  readBooleanFlag("AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK", false);

// The final chapter reads as an aftermath/denouement close.
const REVELATION_SIGNAL_RE = /(revelation|aftermath|denouement|reckoning|culprit\s+(?:is\s+)?revealed|unmask|case\s+closed|confession|resolution|epilogue|clearance)/;

// An earlier chapter stages the on-page naming (the real reveal): final trap / discriminating test /
// confrontation where the culprit is named. This is the guard that prevents suppressing a genuinely
// late (last-chapter-only) reveal.
const FINAL_TRAP_SIGNAL_RE = /(final\s+trap|discriminating\s+test|confront|expos(?:e|es|ed|ing|ure)|named\s+as|accus|trap\s+is\s+sprung|culprit\s+(?:is\s+)?revealed)/;

// Never treat a false-solution / red-herring chapter as the naming trap.
const FALSE_SOLUTION_SIGNAL_RE = /(false\s+solution|red\s+herring|wrong\s+suspect|mistaken|misdirection|false\s+accus)/;

const isGoldenAgeAftermathFinalChapter = (
  chapterEnd: number,
  totalScenes: number,
  batchScenes: any[],
  allOutlineScenes: any[],
): boolean => {
  // Only the final chapter can be the aftermath close.
  if (chapterEnd < totalScenes) return false;
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  if (scenes.length === 0) return false;
  // The current chapter (or, defensively, the last outline scene) must be authored
  // `revelation`. Absent beats (non-Golden-Age arcs) never satisfy this → no behaviour change.
  const finalIsRevelation =
    (Array.isArray(batchScenes) &&
      batchScenes.some((scene) => readSceneBeat(scene) === GOLDEN_AGE_REVELATION_BEAT)) ||
    readSceneBeat(scenes[scenes.length - 1]) === GOLDEN_AGE_REVELATION_BEAT;
  // And an EARLIER chapter must carry the on-page naming (`final_trap`), so we never
  // suppress a legitimately-late reveal in a story with no separate trap chapter.
  const earlierFinalTrap = scenes.some(
    (scene, idx) => idx < scenes.length - 1 && readSceneBeat(scene) === GOLDEN_AGE_FINAL_TRAP_BEAT,
  );
  if (finalIsRevelation && earlierFinalTrap) return true;

  // A_68 signal fallback — only when NO scene carries a beat at all (never override present beats).
  if (!isAftermathFinalSignalFallbackEnabled()) return false;
  const anyBeatPresent = scenes.some((scene) => readSceneBeat(scene) !== "");
  if (anyBeatPresent) return false;
  const finalScene =
    Array.isArray(batchScenes) && batchScenes.length > 0
      ? batchScenes[batchScenes.length - 1]
      : scenes[scenes.length - 1];
  const finalIsRevelationBySignal = REVELATION_SIGNAL_RE.test(normalizeSceneSignalText(finalScene));
  const earlierTrapBySignal = scenes.some((scene, idx) => {
    if (idx >= scenes.length - 1) return false;
    const signal = normalizeSceneSignalText(scene);
    return FINAL_TRAP_SIGNAL_RE.test(signal) && !FALSE_SOLUTION_SIGNAL_RE.test(signal);
  });
  return finalIsRevelationBySignal && earlierTrapBySignal;
};

/**
 * A_89 B3 — the ONE question "is this chapter the aftermath?", asked in one place.
 *
 * ITEM 11 solved this for the STAGE MODE: in the Golden-Age arc the culprit is named on-page in the
 * `final_trap` chapter, so the closing `revelation` chapter is aftermath, not a second reveal, and
 * `isGoldenAgeAftermathFinalChapter` makes `resolveStageModeKey` return `aftermath_consequence`.
 *
 * The obligation block never learned it. `isRevealChapter` is an INDEPENDENT predicate, so the two
 * resolvers answer the same question separately and disagree. MEASURED across every run in the
 * prompt log: the reveal contract was assigned in 39 runs and shared a chapter with
 * `AFTERMATH REQUIRED` in **37 of them (95%)**. A_87's arbitration then sent the reveal to the last
 * revelation beat, which is the final scene in 44 of 45 outlines, making the collision universal —
 * and the external reader of run 88651 wrote the symptom back to us: *"Chapter 10 still recaps too
 * much evidence ... Chapter 10 should stay emotional."*
 *
 * Exported so the obligation block can defer to the same answer instead of computing its own.
 */
export const isAftermathFinalScene = (scene: any, allOutlineScenes: any[]): boolean => {
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  if (scenes.length === 0 || !scene) return false;
  const sceneNumber = Number((scene as any)?.sceneNumber);
  const finalNumber = Number((scenes[scenes.length - 1] as any)?.sceneNumber);
  if (!Number.isFinite(sceneNumber) || sceneNumber !== finalNumber) return false;
  return isGoldenAgeAftermathFinalChapter(scenes.length, scenes.length, [scene], scenes);
};

export const CLUE_TOKEN_STOPWORDS = new Set<string>([
  // Common auxiliary and preposition words that provide no discriminating signal
  "about", "after", "again", "against", "also", "been", "between", "both", "could", "does", "done",
  "each", "even", "ever", "every", "first", "found", "from", "have", "having", "here", "however",
  "into", "just", "later", "make", "made", "might", "more", "most", "much", "only", "onto",
  "other", "over", "same", "some", "such", "than", "that", "them", "then", "their", "there",
  "these", "they", "this", "those", "through", "under", "upon", "very", "were", "when", "where",
  "which", "while", "will", "with", "would", "without", "afterward", "during",
  // Discriminating-test scaffold words (folded in from the former local DT_STOP) so the one shared
  // term surface serves the design path too — these carry no discriminating signal as prose.
  "controlled", "arranged", "arrange", "demonstrating", "comparing", "confirms", "established",
  "evidence", "test", "tested", "testing",
]);

export const tokenizeForClueObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));

/**
 * Remove tokens that are proper-name words from non-cast characters.
 * A token is considered a non-cast proper-name token if it appears as a
 * capitalized word (≥ 3 chars) in `rawDescription` AND is not a substring of
 * any cast member's name. Such tokens come from Agent-5 clue descriptions that
 * reference source-text characters not present in the generated prose cast —
 * they can never match the chapter text, causing perpetual false-fail retries.
 */
export const filterNonCastProperNameTokens = (
  tokens: string[],
  rawDescription: string,
  castNames: string[],
): string[] => {
  if (castNames.length === 0) return tokens;
  const castNamesLower = castNames.map((n) => n.toLowerCase());
  // Collect all capitalized words (≥ 3 chars) from the raw description as potential proper names
  const capitalizedWords = new Set(
    (rawDescription.match(/\b[A-Z][a-z]{2,}\b/g) ?? []).map((w) => w.toLowerCase()),
  );
  return tokens.filter((token) => {
    if (!capitalizedWords.has(token)) return true; // Not a proper-name token, keep it
    // It is a proper-name token — keep only if it's a substring of some cast member's name
    return castNamesLower.some((cn) => cn.includes(token) || token.includes(cn));
  });
};

// Delivery-method genre labels that Agent 5 sometimes puts in clue.description.
// These describe HOW a clue is delivered, not WHAT is observed — their tokens
// ("direct", "observation", "hearsay", etc.) will never appear in narrative prose
// and cause the token-matcher to always fail.
export const CLUE_DELIVERY_METHOD_LABELS = new Set<string>([
  'direct observation',
  'physical evidence',
  'hearsay',
  'written record',
  'testimony',
  'forensic evidence',
  'circumstantial evidence',
  'verbal testimony',
  'documentary evidence',
  'material evidence',
  'eyewitness account',
  'confession',
  'deduction',
  'inference',
]);

export const isDeliveryMethodLabel = (description: string | null | undefined): boolean => {
  if (!description) return false;
  return CLUE_DELIVERY_METHOD_LABELS.has(description.trim().toLowerCase());
};

/**
 * Check whether `token` (already lowercase, length ≥4) is present in `loweredText`.
 * Strips common English inflection suffixes so that, e.g.:
 *   "observation" matches "observed", "observing", "observable"
 *   "direct"      matches "directly", "direction", "directed"
 *   "tamper"      matches "tampered", "tampering"
 * Suffixes are tried longest-first so "ation" beats "ion" for "observation".
 */
export const tokenMatchesText = (token: string, loweredText: string): boolean => {
  if (loweredText.includes(token)) return true;
  if (token.length < 5) return false;
  // Strip known inflection suffixes — require root ≥ 4 chars to avoid false positives
  const suffixes = ['ation', 'tion', 'ing', 'ion', 'ed', 'er'];
  for (const sfx of suffixes) {
    const rootLen = token.length - sfx.length;
    if (rootLen >= 4 && token.endsWith(sfx) && loweredText.includes(token.slice(0, rootLen))) {
      return true;
    }
  }
  // Fallback: chop one character (handles simple -s / short inflections)
  // Only fires when root is still long enough to be a meaningful stem (≥5 chars)
  return token.length >= 6 && loweredText.includes(token.slice(0, -1));
};

export const getRequiredClueIdsForScene = (
  cmlCase: any,
  scene: any,
  allOutlineScenes?: any[],
): string[] => {
  const sceneAct = Number(scene?.act);
  // P1-1: CML clue_to_scene_mapping uses per-act scene numbers (e.g. 1,2,3 per act),
  // but the narrative outline's sceneNumber is global (e.g. 1-9 across all acts).
  // Convert global → per-act by subtracting the count of scenes in prior acts.
  const perActSceneNum = allOutlineScenes
    ? Number(scene?.sceneNumber) - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length
    : Number(scene?.sceneNumber);
  const mapped = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
    .filter((entry: any) =>
      Number(entry?.act_number) === sceneAct &&
      Number(entry?.scene_number) === perActSceneNum
    )
    .map((entry: any) => String(entry?.clue_id || ""))
    .filter(Boolean);

  const sceneClues = (Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed : [])
    .map((id: unknown) => String(id || ""))
    .filter(Boolean);

  return Array.from(new Set([...mapped, ...sceneClues]));
};

/**
 * A_89 B1 — ONE OWNING CHAPTER PER CLUE.
 *
 * `getRequiredClueIdsForScene` answers "does this scene require this clue?", and a clue listed on
 * several scenes' `cluesRevealed` (or mapped to several act/scene pairs) is required by every one of
 * them. Each then receives the same CLUE OBLIGATION — "dramatize this, in your own words" — and the
 * model complies by writing the same evidence again.
 *
 * MEASURED over 47 runs in the prompt log: the median book issues 34 clue-obligations across 20
 * distinct clues, a **41% re-mandate rate**. Run 88651 issued 43 across 23 (47%), with 14 in chapter 6
 * alone. Its reader wrote the consequence back to us three times — *"Chapters 3-6 circle the same
 * evidence"*, *"the proof becomes a speech"*, *"Chapter 10 still recaps too much evidence"* — and the
 * manuscript ranks 25th worst of 212 for repeated six-word spans, at 118.8 per 10k words against a
 * corpus median of 17.3. The repeated spans ARE the evidence list.
 *
 * Ownership is the FIRST scene that requires the clue, in outline order. A later scene that requires
 * the same clue is not wrong — the evidence genuinely recurs — but it should REFER to it, not stage it
 * a second time. This function says who owns what; the obligation builder decides what to ask for.
 *
 * Deliberately not a filter on `getRequiredClueIdsForScene` itself: that function also drives
 * VALIDATION, and a clue is legitimately present in a later chapter. Narrowing what we ASK for is a
 * different thing from narrowing what we ACCEPT, and conflating them is how a formatting rule became
 * a content filter in A_89 D1.
 */
export const resolveClueOwnership = (
  cmlCase: any,
  allOutlineScenes: any[],
): Map<string, number> => {
  const owner = new Map<string, number>();
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  for (const scene of scenes) {
    const sceneNumber = Number((scene as any)?.sceneNumber);
    if (!Number.isFinite(sceneNumber)) continue;
    for (const clueId of getRequiredClueIdsForScene(cmlCase, scene, scenes)) {
      if (!owner.has(clueId)) owner.set(clueId, sceneNumber);
    }
  }
  return owner;
};

/**
 * A_89 B2 — THE CLUE-OBLIGATION LOAD, counted and reported.
 *
 * Fourteen clue obligations in one chapter cannot be dramatized; they will be recited. Run 88651 put
 * 14 in chapter 6, 6 in chapter 8 and 8 in chapter 10 (corpus median heaviest chapter: 10, median
 * final chapter: 2), and its reader wrote back *"Chapters 3-6 circle the same evidence"*, *"the proof
 * becomes a speech"* and *"Chapter 10 still recaps too much evidence"*.
 *
 * This COUNTS rather than caps. Dropping an obligation would drop a clue from the book, and fair play
 * is the one thing the pipeline may not trade away — B1's ownership split already reduces the ask
 * without losing anything (mean 30.5 -> 24.4 per book, heaviest chapter 18 -> 9 across the archive).
 * What remains is to make a heavy schedule visible before a reader finds it, which is the move A_87
 * P1 made for the scene-ref join and A_89 A1 made for the temporal arithmetic.
 */
export interface ClueObligationLoad {
  /** Total obligations issued across the book, counting re-mandates. */
  total: number;
  /** Distinct clues involved. */
  distinct: number;
  /** Share of obligations that repeat a clue already mandated elsewhere. */
  reMandateRate: number;
  /** The heaviest chapter, and how many it carries. */
  heaviestChapter: number;
  heaviestCount: number;
  /** Chapters carrying more than `budget` obligations. */
  overBudget: Array<{ chapter: number; count: number }>;
}

export const DEFAULT_CLUE_OBLIGATION_BUDGET = 8;

export const measureClueObligationLoad = (
  cmlCase: any,
  allOutlineScenes: any[],
  budget: number = DEFAULT_CLUE_OBLIGATION_BUDGET,
): ClueObligationLoad => {
  const scenes = Array.isArray(allOutlineScenes) ? allOutlineScenes : [];
  const seen = new Set<string>();
  const overBudget: Array<{ chapter: number; count: number }> = [];
  let total = 0, heaviestChapter = 0, heaviestCount = 0;
  scenes.forEach((scene, index) => {
    const ids = getRequiredClueIdsForScene(cmlCase, scene, scenes);
    const chapter = Number((scene as any)?.sceneNumber) || index + 1;
    total += ids.length;
    for (const id of ids) seen.add(id);
    if (ids.length > heaviestCount) { heaviestCount = ids.length; heaviestChapter = chapter; }
    if (ids.length > budget) overBudget.push({ chapter, count: ids.length });
  });
  const distinct = seen.size;
  return {
    total,
    distinct,
    reMandateRate: total > 0 ? (total - distinct) / total : 0,
    heaviestChapter,
    heaviestCount,
    overBudget,
  };
};

/** One line for the run report. Always returns something: a clean schedule is worth recording too. */
export const summariseClueObligationLoad = (load: ClueObligationLoad): string => {
  const pct = Math.round(100 * load.reMandateRate);
  const head =
    `${load.total} clue obligation(s) across ${load.distinct} distinct clue(s) — ${pct}% re-mandated; ` +
    `heaviest chapter ${load.heaviestChapter} with ${load.heaviestCount}`;
  if (load.overBudget.length === 0) return `${head}. Within budget.`;
  const listed = load.overBudget.map((o) => `ch${o.chapter}=${o.count}`).join(", ");
  return `${head}. OVER BUDGET (${DEFAULT_CLUE_OBLIGATION_BUDGET}): ${listed} — a chapter asked to ` +
    `dramatize this many pieces of evidence will recite them instead.`;
};

// Behavioural/emotional clue descriptions use synonym-rich vocabulary that prose replaces
// with contextual equivalents. A 0.60 token threshold is too strict for these clues.
// If the description contains any of these markers, use 0.35 instead.
export const BEHAVIOURAL_MARKERS = new Set([
  'behaviour', 'behavioral', 'emotion', 'emotional',
  'nervous', 'anxious', 'guilty', 'frightened', 'terrified', 'panicked',
  'suspicious', 'jealous', 'jealousy', 'angry', 'anger', 'grief',
  'distressed', 'evasive', 'agitated', 'uncomfortable', 'demeanour',
  'demeanor', 'motive', 'attitude', 'secretive', 'concealing', 'deceiving',
  'observed', 'exhibiting', 'signs',
]);

export const isBehaviouralClue = (description: string): boolean => {
  const lower = description.toLowerCase();
  for (const marker of BEHAVIOURAL_MARKERS) {
    if (lower.includes(marker)) return true;
  }
  return false;
};

export const buildClueSemanticAnchorFamilies = (
  description: string | undefined,
  pointsTo: string | undefined,
): string[][] => {
  const combined = `${description ?? ""} ${pointsTo ?? ""}`.toLowerCase();
  const families: string[][] = [];

  if (/clock|dial|chime|time|hour|minute|hall clock|watch/.test(combined)) {
    families.push(["clock", "dial", "chime", "hour", "minute", "time"]);
  }
  if (/sun|daylight|window|shadow|position|outside light/.test(combined)) {
    families.push(["sun", "daylight", "window", "shadow", "outside", "light", "position"]);
  }
  if (/tamper|wound|set back|reset|adjust|stopped|mechanism/.test(combined)) {
    families.push(["tamper", "wound", "reset", "adjust", "stopped", "mechanism"]);
  }
  if (/dust|powder|residue|fingerprint|smudge/.test(combined)) {
    families.push(["dust", "powder", "residue", "fingerprint", "smudge"]);
  }
  if (/witness|statement|testimony|heard|saw|alibi/.test(combined)) {
    families.push(["witness", "statement", "testimony", "heard", "saw", "alibi"]);
  }
  if (/poison|arsenic|toxin|dose|pharmaceutical|prescription/.test(combined)) {
    families.push(["poison", "arsenic", "toxin", "dose", "pharmaceutical", "prescription"]);
  }
  if (/financial|debt|ledger|inheritance|will|bankrupt/.test(combined)) {
    families.push(["financial", "debt", "ledger", "inheritance", "will", "bankrupt"]);
  }
  if (/document|letter|telegram|written|manuscript|envelope/.test(combined)) {
    families.push(["document", "letter", "telegram", "written", "manuscript", "envelope"]);
  }
  if (/emotional|behaviour|reaction|distress|outburst|demeanour/.test(combined)) {
    families.push(["emotional", "behaviour", "reaction", "distress", "outburst", "demeanour"]);
  }

  return families;
};

export const semanticAnchorFamiliesMatched = (
  text: string,
  families: string[][],
): number => {
  const lowered = text.toLowerCase();
  let matchedFamilies = 0;
  for (const family of families) {
    if (family.some((token) => tokenMatchesText(token, lowered))) {
      matchedFamilies += 1;
    }
  }
  return matchedFamilies;
};

/**
 * A_85 F5 — `AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL`: an early-placement clue is present in a chapter
 * when its OBSERVATION is on the page. Its conclusion words are not required.
 *
 * THE DEFECT, MEASURED 2026-09-09 on run 24901 (external read 78/100, prose 5/10): the chapter-1 clue
 * regen wrote "the entry's handwriting was oddly heavy, the pressure uneven compared to the lighter,
 * more practiced strokes" — the observation, exactly as an early clue should be planted. The presence
 * pool below is the observable PLUS `pointsTo` ("pressure, discrepancy, suggests"), ten tokens, and
 * the chapter matched five of them: entry, handwriting, pressure, heavier, chemist. The five it missed —
 * forged, discrepancy, suggests, normal, style — are the INFERENCE. A chapter-1 observation must not
 * say "forged". So the regen's correct prose was judged absent, and the deterministic floor pasted the
 * label into chapter 1: three of the seven "generator lines" the reviewer quoted.
 *
 * Reach, MEASURED with the BUILT predicate over the 40 stored books (2,444 early-clue×chapter verdicts):
 * 8 verdicts flip absent→present and 2 early clues gain an earlier first-present chapter. That is a
 * LOWER bound: the stored books are SHIPPED books, whose chapters already contain the floor's pasted
 * labels, and the old pool matches on the paste itself. (A token-pool-only estimate that ignored the
 * semantic-family fallback below said 127; the built figure is the one that counts.) The pre-paste
 * draft is where the flip lands — run 24901's chapter-1 regen output is the one such draft on disk,
 * and it flips (test, from the real sentences).
 *
 * THE RULE IS A UNION, never stricter: a chapter counts if the observable-only pool passes OR the old
 * pool passes. On the same 2,444 verdicts: 0 flip present→absent. Both callers — the regen's presence validator and the floor's `isPresent` — go
 * through these two functions, so they cannot disagree. OFF: byte-identical. Env read at call time.
 */
export const isCluePresenceObservablePoolEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL ?? "").trim());

/** Early-placement clue whose OBSERVATION (observable-only pool, same threshold) is on the page. */
export const earlyObservationOnPage = (
  clue: { placement?: string | null; observable?: string | null } | undefined,
  loweredText: string,
  castNames?: string[],
): boolean => {
  if (!clue || clue.placement !== "early") return false;
  const observable = String(clue.observable ?? "").trim();
  if (!observable || isDeliveryMethodLabel(observable)) return false;
  const raw = Array.from(new Set(tokenizeForClueObligation(observable))).slice(0, 10);
  const tokens = castNames?.length ? filterNonCastProperNameTokens(raw, observable, castNames) : raw;
  if (tokens.length === 0) return false;
  const matched = tokens.filter((t) => tokenMatchesText(t, loweredText));
  return matched.length >= Math.max(1, Math.ceil(tokens.length * 0.55));
};

export const chapterMentionsRequiredClue = (
  chapterText: string,
  clueId: string,
  clueDistribution?: ClueDistributionResult,
  castNames?: string[],
): boolean => {
  const lowered = chapterText.toLowerCase();
  if (lowered.includes(clueId.toLowerCase())) {
    return true;
  }

  const clue = (clueDistribution?.clues ?? []).find((entry) => String(entry?.id || "") === clueId);
  if (!clue) return false;
  // A_85 F5 — the observation alone is enough for an early clue (union with the pool below).
  if (isCluePresenceObservablePoolEnabled() && earlyObservationOnPage(clue, lowered, castNames)) return true;

  // P1.2: validate against the on-page OBSERVABLE (what Agent 9 is told to write), not the spec
  // sentence. deriveClueObservable falls back to description, so this is byte-identical until P1.2.
  const onPage = deriveClueObservable(clue);
  const descIsGenreLabel = isDeliveryMethodLabel(onPage);
  // When the on-page text is a delivery-method label (e.g. "Direct observation"), its tokens
  // ("direct", "observation") never appear in narrative prose.  Use only pointsTo tokens.
  // If pointsTo is also empty, the clue metadata is incomplete — pass rather than
  // false-failing every attempt.
  const rawTokens = descIsGenreLabel
    ? Array.from(new Set(tokenizeForClueObligation(String(clue.pointsTo ?? "")))).slice(0, 10)
    : Array.from(new Set([
        ...tokenizeForClueObligation(String(onPage ?? "")),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
      ])).slice(0, 10);

  // Strip proper-name tokens from non-cast characters so that clue descriptions written
  // by Agent 5 referencing source-text characters (not in the prose cast) don't
  // perpetually fail the token-match threshold.  Only applies when castNames is provided.
  const tokens = castNames?.length
    ? filterNonCastProperNameTokens(rawTokens, String(onPage ?? ''), castNames)
    : rawTokens;

  // Genre-label clue with no usable pointsTo tokens — metadata is insufficient for
  // token-level validation.  Accept rather than perpetually failing.
  if (tokens.length === 0) return descIsGenreLabel ? true : false;
  const matched = tokens.filter((t) => tokenMatchesText(t, lowered));
  // A_73 §33 — the nominal threshold is 0.55, NOT the 0.6 this comment claimed for months. And the
  // EFFECTIVE threshold is neither: requiredMatches rounds UP over a token list capped at 10, so it
  // runs 100%, 100%, 67%, 75%, 60%, 67%, 57%, 63%, 56%, 60% for 1..10 tokens — non-monotonic, and a
  // clue yielding one or two usable tokens must be reproduced VERBATIM to count as present.
  // Behavioural/emotional clues use synonym-rich vocabulary — relax to 0.35 so e.g.
  // "nervousness" is satisfied by "fidgeted", "uneasy", "agitated" (R35 abort root cause).
  const factualThreshold = 0.55;
  const behaviouralThreshold = isBehaviouralClue(onPage ?? '') ? 0.35 : factualThreshold;
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * behaviouralThreshold));
  if (matched.length >= requiredMatches) {
    return true;
  }

  // Semantic anchor fallback: allows clues to pass when prose uses equivalent observational
  // language derived from upstream clue intent (observable + pointsTo), not brittle phrase echoes.
  const semanticFamilies = buildClueSemanticAnchorFamilies(onPage, clue?.pointsTo);
  if (semanticFamilies.length > 0) {
    const requiredFamilies = Math.min(2, semanticFamilies.length);
    const familyHits = semanticAnchorFamiliesMatched(chapterText, semanticFamilies);
    if (familyHits >= requiredFamilies) {
      return true;
    }
  }

  return false;
};
