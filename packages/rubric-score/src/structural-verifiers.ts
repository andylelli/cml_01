/**
 * Deterministic structural verifiers (ANALYSIS_51 K2 §1 — "make the measuring stick honest").
 *
 * The final-story LLM judge (gpt-4o-mini) issues *templated, false* structural flags — it flagged
 * "the reveal uses evidence not planted earlier" on the triad run that demonstrably planted the
 * means-discriminator in Ch3, and "clock explained too early" when the mechanism was withheld to the
 * test scene. These verifiers compute the *checkable* facts deterministically so the cap engine can
 * **veto** (drop) a judge flag the structure contradicts, or **confirm** one the structure supports —
 * the judge proposes, the checker decides for anything it can actually measure.
 *
 * Everything here is pure: it reads the frozen CASE artifact and the assembled prose (split into
 * chapters). No LLM call. The CASE-level planted-evidence check reuses the *logic* of
 * `findUnplantedDiscriminatingClues` (@cml/prompts-llm, A_50 §9.3 #2) — to keep this package lean and
 * acyclic, the real function is injected by the orchestrator and a faithful local fallback runs in
 * tests / when no injector is supplied.
 */

import { nameAppearsInProse } from "./facts.js";

/** Result of the three structural verifiers + the per-flag citation check. */
export interface StructuralVerdict {
  /** undefined = could not determine; true = every cited piece of reveal evidence is planted earlier. */
  allRevealEvidencePlanted?: boolean;
  /** The evidence clues the reveal leans on that are NOT planted before the test/reveal (CASE + prose). */
  unplantedEvidence: string[];
  /** undefined = could not determine; true = the mechanism is first fully explained AT or AFTER the test scene. */
  mechanismExplainedAtOrAfterTest?: boolean;
  /** 1-based chapter index where the mechanism is first fully explained, or null when undetectable. */
  mechanismExplainedChapter: number | null;
  /** 1-based chapter index of the discriminating-test scene, or null when undetectable. */
  testChapter: number | null;
  /** undefined = could not determine; true = the resolved victim name appears in the prose. */
  victimNamedInProse?: boolean;
  /** A_68 FIX B — true = a self-contradictory reveal time ("before T1 … in fact T2>T1") is present. */
  temporalContradiction?: boolean;
  /** The verbatim contradicting clause (telemetry). */
  temporalContradictionEvidence?: string;
  /** A_68 FIX C — true = the reveal is fully re-staged in ≥2 late chapters. */
  duplicateReveal?: boolean;
  /** 1-based chapters that each re-stage the full reveal (telemetry). */
  duplicateRevealChapters?: number[];
}

/** Minimal shape of `findUnplantedDiscriminatingClues`'s return — the CASE-level structural ordering check. */
export interface UnplantedCluesLike {
  unplanted: string[];
  unmapped: string[];
  testSceneKey: number | null;
}

/** Injectable seam: the real `findUnplantedDiscriminatingClues` from @cml/prompts-llm, or the local fallback. */
export type FindUnplantedFn = (caseInput: unknown) => UnplantedCluesLike;

export interface VerifyStructureInput {
  cml: unknown;
  /** The assembled prose, split into chapters in order (chapters[0] is Chapter 1). */
  chapters: string[];
  victimName?: string;
  /** Injected `findUnplantedDiscriminatingClues`; falls back to the local mirror when absent. */
  findUnplanted?: FindUnplantedFn;
}

const sceneOrderKey = (actNumber: unknown, sceneNumber: unknown): number => {
  const act = Number(actNumber);
  const scene = Number(sceneNumber);
  return (Number.isFinite(act) ? act : 0) * 100 + (Number.isFinite(scene) ? scene : 0);
};

/**
 * Local mirror of `@cml/prompts-llm.findUnplantedDiscriminatingClues` (A_50 §9.3 #2). Kept byte-for-byte
 * faithful to its placement logic so the package needs no heavy dependency; the orchestrator injects the
 * real function in production so the two never drift on a live run.
 */
export function findUnplantedDiscriminatingCluesLocal(caseInput: any): UnplantedCluesLike {
  const caseBlock = caseInput?.CASE ?? caseInput ?? {};
  const evidenceClues: string[] = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues.map((x: unknown) => String(x ?? "").trim()).filter(Boolean)
    : [];

  const testScene = caseBlock?.prose_requirements?.discriminating_test_scene;
  const testSceneKey =
    testScene && (testScene.act_number !== undefined || testScene.scene_number !== undefined)
      ? sceneOrderKey(testScene.act_number, testScene.scene_number)
      : null;

  const placement = new Map<string, number>();
  const mapping: any[] = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (const entry of mapping) {
    const id = String(entry?.clue_id ?? "").trim();
    if (id) placement.set(id, sceneOrderKey(entry?.act_number, entry?.scene_number));
  }

  const unplanted: string[] = [];
  const unmapped: string[] = [];
  for (const clue of evidenceClues) {
    if (!placement.has(clue)) {
      unmapped.push(clue);
      unplanted.push(clue);
      continue;
    }
    if (testSceneKey !== null && placement.get(clue)! >= testSceneKey) {
      unplanted.push(clue);
    }
  }
  return { unplanted, unmapped, testSceneKey };
}

function unwrapCase(cml: unknown): Record<string, any> {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, any>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as Record<string, any>;
    return obj;
  }
  return {};
}

const norm = (s: string): string =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Turn a clue id / description into the salient prose tokens to scan for (drop stopwords + short bits). */
function clueSearchTerms(clue: unknown, caseData: Record<string, any>): string[] {
  const id = String(clue ?? "").trim();
  // Prefer the clue's prose-facing description if the CASE carries one; fall back to the id text.
  const clueDefs: any[] = Array.isArray(caseData?.clues)
    ? caseData.clues
    : Array.isArray(caseData?.clues?.clues)
      ? caseData.clues.clues
      : [];
  const match = clueDefs.find((c) => String(c?.id ?? c?.clue_id ?? "").trim() === id);
  const text = String(match?.description ?? match?.text ?? match?.summary ?? id);
  const STOP = new Set([
    "the", "and", "for", "with", "that", "this", "from", "into", "clue", "evidence",
    "was", "had", "has", "her", "his", "him", "she", "they", "their", "about", "which",
  ]);
  return norm(text)
    .split(" ")
    .filter((w) => w.length >= 4 && !STOP.has(w));
}

/**
 * Prose-level planted-evidence scan: for each clue the reveal/test leans on, do its salient terms appear
 * in some chapter STRICTLY before the test chapter? A clue counts as planted-in-prose if ≥1 of its salient
 * terms surfaces earlier — that is the reader-facing "was this shown before it was used?" question.
 */
function termsAppearBeforeTest(
  terms: string[],
  chaptersLower: string[],
  testChapterIdx: number | null,
): boolean {
  const lastEarlierIdx = testChapterIdx !== null ? testChapterIdx - 1 : chaptersLower.length - 1;
  for (let i = 0; i <= lastEarlierIdx && i < chaptersLower.length; i++) {
    if (terms.some((t) => chaptersLower[i].includes(t))) return true;
  }
  return false;
}

const TEST_SCENE_PROSE_RE = /\bdiscriminating[\s-]?test\b|\bthe (?:final |decisive )?test\b/i;

/**
 * Resolve the 1-based chapter index of the discriminating-test scene. Priority:
 *  1. an explicit `discriminating_test_scene.chapter` on the CASE (authoritative when present),
 *  2. the chapter whose prose carries the discriminating-test marker (the reader-facing signal),
 *  3. the act/scene rank over the full scene plan (only when it spans all chapters — i.e. the pipeline's
 *     one-scene-per-chapter plan, not a sparse clue-only mapping), else null.
 */
function resolveTestChapter(
  caseData: Record<string, any>,
  chaptersLower: string[],
  chapterCount: number,
): number | null {
  const ts = caseData?.prose_requirements?.discriminating_test_scene;
  const direct = Number(ts?.chapter ?? ts?.chapter_number);
  if (Number.isFinite(direct) && direct >= 1) return direct;

  // Prose marker: scan from the END (the test is late-story) for the discriminating-test language.
  for (let i = chaptersLower.length - 1; i >= 0; i--) {
    if (TEST_SCENE_PROSE_RE.test(chaptersLower[i])) return i + 1;
  }

  // Scene-rank fallback — only trustworthy when the mapping covers (nearly) every chapter.
  const tsKey =
    ts && (ts.act_number !== undefined || ts.scene_number !== undefined)
      ? sceneOrderKey(ts.act_number, ts.scene_number)
      : null;
  if (tsKey === null) return null;
  const mapping: any[] = Array.isArray(caseData?.prose_requirements?.clue_to_scene_mapping)
    ? caseData.prose_requirements.clue_to_scene_mapping
    : [];
  const keys = new Set<number>([tsKey]);
  for (const e of mapping) keys.add(sceneOrderKey(e?.act_number, e?.scene_number));
  if (keys.size < chapterCount) return null; // sparse mapping → can't rank reliably
  const sorted = [...keys].sort((a, b) => a - b);
  const rank = sorted.indexOf(tsKey) + 1; // 1-based
  return rank >= 1 && rank <= chapterCount ? rank : null;
}

// Causal / method / agentive language that distinguishes EXPLAINING the mechanism ("she had reset
// the clock to fake the time of death", "the trick was…") from merely PLANTING the clue or naming the
// suspicious object ("fresh scratches, as though someone had fumbled with it", "the clock's hands
// pointed to ten past nine"). Without this, a crime-scene chapter that introduces the clock-tampering
// CLUE trips the term-density check and is falsely scored as "mechanism explained too early" — the
// over-detection observed in run mystery-1782585273377 (ch1 plants beautifully, explains nothing).
const MECHANISM_EXPLANATION_MARKER =
  /\b(?:in order to|so as to|so that|this (?:gave|created|allowed|meant|explained|produced)|which (?:gave|created|allowed|meant)|to (?:fake|conceal|disguise|fabricate|stage|simulate|forge)\b|(?:had|then|she|he|they) (?:reset|rewound|wound back|set back|moved|advanced|adjusted|altered|rigged|tampered with) the|the (?:trick|method|mechanism|scheme|deception) (?:was|lay|had been)|explained (?:how|that|the)|how (?:the )?(?:murder|crime|killer|culprit|trick|mechanism|clock))\b/;

/**
 * Mechanism-timing: find the first chapter that FULLY explains the mechanism. A chapter explains the
 * mechanism only when (a) a majority of the description's salient terms co-occur there AND (b) the
 * chapter carries causal/method/agentive EXPLANATION language — not merely the mechanism's terms as
 * scene-setting or a planted clue. A *false* "explained too early" flag is one where that chapter is
 * at or after the discriminating-test chapter (the withhold gate held).
 */
function resolveMechanismExplainedChapter(
  caseData: Record<string, any>,
  chaptersLower: string[],
): number | null {
  const desc = String(caseData?.hidden_model?.mechanism?.description ?? "").trim();
  if (!desc) return null;
  const STOP = new Set([
    "the", "and", "for", "with", "that", "this", "from", "into", "was", "had", "has",
    "her", "his", "him", "she", "they", "their", "about", "which", "then", "been",
  ]);
  const terms = norm(desc)
    .split(" ")
    .filter((w) => w.length >= 5 && !STOP.has(w));
  if (terms.length === 0) return null;
  // A chapter "fully explains" the mechanism when a majority of its salient terms co-occur there AND
  // the chapter actually explains (not just names) the mechanism.
  const need = Math.max(2, Math.ceil(terms.length * 0.5));
  for (let i = 0; i < chaptersLower.length; i++) {
    const hits = terms.filter((t) => chaptersLower[i].includes(t)).length;
    if (hits >= need && MECHANISM_EXPLANATION_MARKER.test(chaptersLower[i])) return i + 1; // 1-based
  }
  return null;
}

// ── A_68 FIX B: temporal reveal-ordering contradiction ────────────────────────
// Ultra-high-precision: fires ONLY on an explicit "<before/after> <T1> … (in fact|the true time was) <T2>"
// where T2 numerically contradicts the stated ordering (the shipped sundial defect: "died before twenty
// minutes past ten. In fact, the true time of death was ten minutes to eleven"). A CORRECT reveal ("died
// at ten minutes to eleven, not twenty past ten as the shadow suggested") has no before/after relation and
// never fires. Parses digit ("10:20") and word-form ("twenty minutes past ten", "ten minutes to eleven",
// "quarter past ten", "half past ten", "ten o'clock") times.
const CLOCK_WORD_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, "twenty-five": 25, "twenty five": 25, thirty: 30,
  "thirty-five": 35, "thirty five": 35, forty: 40, "forty-five": 45, "forty five": 45, fifty: 50,
  "fifty-five": 55, "fifty five": 55, quarter: 15, half: 30,
};

const clockWordNum = (w: string): number | null => {
  const key = String(w ?? "").toLowerCase().replace(/\s+/g, " ").trim();
  if (key in CLOCK_WORD_NUM) return CLOCK_WORD_NUM[key];
  return /^\d+$/.test(key) ? Number(key) : null;
};

interface FoundTime { minutes: number; start: number; end: number; raw: string; }

const MIN_ALT = "twenty-five|twenty five|thirty-five|thirty five|forty-five|forty five|fifty-five|fifty five|five|ten|fifteen|twenty|thirty|forty|fifty|quarter|half";
const HOUR_ALT = "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\\d{1,2}";

const findClockTimes = (text: string): FoundTime[] => {
  const out: FoundTime[] = [];
  const push = (minutes: number | null, m: RegExpExecArray): void => {
    if (minutes === null || !Number.isFinite(minutes)) return;
    out.push({ minutes, start: m.index, end: m.index + m[0].length, raw: m[0] });
  };
  let m: RegExpExecArray | null;
  const digit = /\b(\d{1,2}):(\d{2})\b/g;
  while ((m = digit.exec(text))) push(Number(m[1]) * 60 + Number(m[2]), m);
  const pastTo = new RegExp(`\\b(${MIN_ALT})\\s+(?:minutes?\\s+)?(past|to)\\s+(${HOUR_ALT})\\b`, "gi");
  while ((m = pastTo.exec(text))) {
    const mins = clockWordNum(m[1]);
    const h = clockWordNum(m[3]);
    if (mins === null || h === null) continue;
    push(m[2].toLowerCase() === "to" ? h * 60 - mins : h * 60 + mins, m);
  }
  const oclock = new RegExp(`\\b(${HOUR_ALT})\\s+o['’]?clock\\b`, "gi");
  while ((m = oclock.exec(text))) {
    const h = clockWordNum(m[1]);
    push(h === null ? null : h * 60, m);
  }
  return out.sort((a, b) => a.start - b.start);
};

const TEMPORAL_RELATION_RE = /\b(before|earlier than|prior to|no later than|after|later than|no earlier than)\b/gi;
const TEMPORAL_CORRECTIVE_RE = /\b(?:in fact|in truth|in reality|actually|really|the (?:true|actual|real) time(?: of death)?(?: was| had been)?|was in fact|proved to be)\b/i;

export function detectTemporalOrderingContradiction(chaptersLower: string[]): { contradiction: boolean; evidence?: string } {
  const startIdx = Math.max(0, Math.floor(chaptersLower.length * 0.55));
  for (let i = startIdx; i < chaptersLower.length; i++) {
    const text = chaptersLower[i] ?? "";
    const relRe = new RegExp(TEMPORAL_RELATION_RE.source, "gi");
    let rm: RegExpExecArray | null;
    while ((rm = relRe.exec(text))) {
      const relation = rm[1].toLowerCase();
      const isBefore = /before|earlier|prior|no later/.test(relation);
      const isAfter = /after|later|no earlier/.test(relation);
      if (!isBefore && !isAfter) continue;
      const t1s = findClockTimes(text.slice(rm.index, rm.index + 60));
      if (t1s.length === 0) continue;
      const t1 = t1s[0].minutes;
      const window = text.slice(rm.index + rm[0].length, rm.index + rm[0].length + 220);
      const corr = window.match(TEMPORAL_CORRECTIVE_RE);
      if (!corr) continue;
      const corrIdx = window.indexOf(corr[0]);
      const t2s = findClockTimes(window);
      const t2f = t2s.find((t) => t.start >= corrIdx) ?? t2s[t2s.length - 1];
      if (!t2f) continue;
      const t2 = t2f.minutes;
      const diff = Math.abs(t2 - t1);
      if (diff === 0 || diff >= 360) continue; // identical or AM/PM-wrap ambiguity → not a contradiction
      if ((isBefore && t2 > t1) || (isAfter && t2 < t1)) {
        const evidence = `${rm[0]}${window.slice(0, 130)}`.replace(/\s+/g, " ").trim().slice(0, 200);
        return { contradiction: true, evidence: `ch${i + 1}: ${evidence}` };
      }
    }
  }
  return { contradiction: false };
}

// ── A_68 FIX C: duplicate reveal (the reveal fully re-staged in ≥2 late chapters) ──
const REVEAL_ACCUSATION_RE = /\b(?:the (?:murderer|killer|culprit) (?:was|is|had been)\b|named\b[^.]{0,60}\bas the (?:murderer|killer|culprit)\b|confess(?:ed|ion|es)?\b|you (?:killed|murdered)\b|only (?:person|suspect) with[^.]{0,60}\b(?:means|motive|opportunity)\b|guilt\b)/i;

const restatesFullReveal = (chapterLower: string, culpritKey: string): boolean => {
  if (!culpritKey || !chapterLower.includes(culpritKey)) return false;
  if (!REVEAL_ACCUSATION_RE.test(chapterLower)) return false;
  return MECHANISM_EXPLANATION_MARKER.test(chapterLower) || TEST_SCENE_PROSE_RE.test(chapterLower);
};

export function detectDuplicateReveal(caseData: Record<string, any>, chaptersLower: string[]): { duplicate: boolean; chapters: number[] } {
  const rawCulprit = caseData?.culpability?.culprits?.[0];
  const culpritName = typeof rawCulprit === "string" ? rawCulprit : String(rawCulprit?.name ?? "").trim();
  const tokens = norm(culpritName).split(" ").filter((w) => w.length >= 3);
  const culpritKey = tokens.length ? tokens[tokens.length - 1] : "";
  if (!culpritKey) return { duplicate: false, chapters: [] };
  const chapters: number[] = [];
  for (let i = 0; i < chaptersLower.length; i++) {
    if (restatesFullReveal(chaptersLower[i] ?? "", culpritKey)) chapters.push(i + 1);
  }
  return { duplicate: chapters.length >= 2, chapters };
}

/** Run the three structural verifiers over the CASE + prose. Pure; never throws. */
export function verifyStructure(input: VerifyStructureInput): StructuralVerdict {
  const caseData = unwrapCase(input.cml);
  const chapters = Array.isArray(input.chapters) ? input.chapters : [];
  const chaptersLower = chapters.map((c) => String(c ?? "").toLowerCase());
  const find = input.findUnplanted ?? findUnplantedDiscriminatingCluesLocal;

  const verdict: StructuralVerdict = {
    unplantedEvidence: [],
    mechanismExplainedChapter: null,
    testChapter: null,
  };

  // ── Planted-evidence verifier (CASE ordering ∧ prose scan) ──────────────────
  const evidenceClues: string[] = Array.isArray(caseData?.discriminating_test?.evidence_clues)
    ? caseData.discriminating_test.evidence_clues.map((x: unknown) => String(x ?? "").trim()).filter(Boolean)
    : [];
  const testChapter = resolveTestChapter(caseData, chaptersLower, chapters.length);
  verdict.testChapter = testChapter;

  if (evidenceClues.length > 0) {
    let caseUnplanted: UnplantedCluesLike;
    try {
      caseUnplanted = find(input.cml);
    } catch {
      caseUnplanted = findUnplantedDiscriminatingCluesLocal(input.cml);
    }
    const caseUnplantedSet = new Set(caseUnplanted.unplanted.map((c) => String(c).trim()));

    const unplanted: string[] = [];
    for (const clue of evidenceClues) {
      const unplantedByCaseOrdering = caseUnplantedSet.has(clue);
      // The prose scan only contributes a verdict when it can resolve the clue's content. When
      // clueSearchTerms yields no usable terms (e.g. the CASE carries no prose-facing description, so it
      // falls back to the bare id), the scan is INDETERMINATE and must NOT veto a valid CASE-ordering
      // "planted" — that blindness was flagging well-planted clues as unplanted (run mystery-1782585273377).
      const proseTerms = clueSearchTerms(clue, caseData);
      const unplantedByProse =
        proseTerms.length > 0 && !termsAppearBeforeTest(proseTerms, chaptersLower, testChapter);
      // Flag unplanted only on POSITIVE evidence: the CASE ordering places it at/after the test, OR the
      // prose determinately lacks its content earlier. Indeterminate prose never adds a false unplanted.
      if (unplantedByCaseOrdering || unplantedByProse) unplanted.push(clue);
    }
    verdict.unplantedEvidence = unplanted;
    verdict.allRevealEvidencePlanted = unplanted.length === 0;
  }

  // ── Mechanism-timing check ──────────────────────────────────────────────────
  const mechChapter = resolveMechanismExplainedChapter(caseData, chaptersLower);
  verdict.mechanismExplainedChapter = mechChapter;
  if (mechChapter !== null && testChapter !== null) {
    verdict.mechanismExplainedAtOrAfterTest = mechChapter >= testChapter;
  }

  // ── Victim-named check ──────────────────────────────────────────────────────
  // RC4.4: match by natural short forms (surname / first+surname), not only the verbatim full name —
  // a surname-only reference ("Ashworth") must still VETO the judge's victimIdentityUnclear cap on a
  // valid story (same false-negative class as RC4.3). Genuine miss (name never appears) still yields false.
  if (input.victimName && input.victimName.trim()) {
    verdict.victimNamedInProse = nameAppearsInProse(input.victimName, chaptersLower.join(" \n "));
  }

  // ── A_68 FIX B/C: temporal reveal contradiction + duplicate reveal (deterministic, telemetry always) ──
  const temporal = detectTemporalOrderingContradiction(chaptersLower);
  if (temporal.contradiction) {
    verdict.temporalContradiction = true;
    verdict.temporalContradictionEvidence = temporal.evidence;
  }
  const dup = detectDuplicateReveal(caseData, chaptersLower);
  if (dup.duplicate) {
    verdict.duplicateReveal = true;
    verdict.duplicateRevealChapters = dup.chapters;
  }

  return verdict;
}

// ── Citation verification (K2 §2) ────────────────────────────────────────────

/** A judge flag annotated with the chapter+sentence the model claims supports it. */
export interface FlagCitation {
  /** The structural condition this citation backs (matches a `StoryFacts` flag key). */
  flag: string;
  /** 1-based chapter the model cites. */
  chapter?: number;
  /** The verbatim (or near-verbatim) sentence the model cites from that chapter. */
  sentence?: string;
}

export interface CitationCheckResult {
  flag: string;
  /** true = the cited chapter exists AND the cited sentence text actually appears there. */
  verified: boolean;
  reason: string;
}

/** Loose containment: collapse whitespace + lowercase, then substring-match a meaningful slice. */
function citationAppears(sentence: string, chapterText: string): boolean {
  const norm = (s: string): string => s.toLowerCase().replace(/\s+/g, " ").trim();
  const needle = norm(sentence);
  if (needle.length < 8) return false; // too short to verify meaningfully
  const hay = norm(chapterText);
  if (hay.includes(needle)) return true;
  // Tolerate minor paraphrase: require a contiguous run of ≥6 of the sentence's content words.
  const words = needle.split(" ").filter((w) => w.length >= 4);
  if (words.length < 4) return false;
  const run = Math.min(6, words.length);
  for (let i = 0; i + run <= words.length; i++) {
    if (hay.includes(words.slice(i, i + run).join(" "))) return true;
  }
  return false;
}

/**
 * Verify each judge-supplied citation against the prose: the cited chapter must exist and the cited
 * sentence must actually appear there. A citation that fails verification means the flag is unsupported
 * (the templated false-positive) and the caller should DROP that flag.
 */
export function verifyCitations(citations: FlagCitation[], chapters: string[]): CitationCheckResult[] {
  const list = Array.isArray(citations) ? citations : [];
  return list.map((c) => {
    if (c.chapter === undefined || !Number.isFinite(c.chapter)) {
      return { flag: c.flag, verified: false, reason: "no chapter cited" };
    }
    const idx = c.chapter - 1;
    if (idx < 0 || idx >= chapters.length) {
      return { flag: c.flag, verified: false, reason: `cited chapter ${c.chapter} does not exist (story has ${chapters.length})` };
    }
    if (!c.sentence || !c.sentence.trim()) {
      return { flag: c.flag, verified: false, reason: "no sentence cited" };
    }
    if (!citationAppears(c.sentence, chapters[idx])) {
      return { flag: c.flag, verified: false, reason: `cited sentence not found in chapter ${c.chapter}` };
    }
    return { flag: c.flag, verified: true, reason: "citation matches prose" };
  });
}

/**
 * Split assembled prose back into chapters. The orchestrator joins chapters (optionally title + body)
 * with a blank line; chapters most reliably split on the "Chapter N" heading the pipeline normalizes
 * titles to. Falls back to the whole prose as one chapter when no headings are present.
 */
export function splitProseIntoChapters(prose: string): string[] {
  const text = String(prose ?? "");
  if (!text.trim()) return [];
  const re = /^\s*chapter\s+(?:\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b.*$/gim;
  const indices: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) indices.push(m.index);
  if (indices.length === 0) return [text];
  const chunks: string[] = [];
  // Preamble before the first heading (if any non-trivial) is its own chunk so nothing is lost.
  if (indices[0] > 0 && text.slice(0, indices[0]).trim()) chunks.push(text.slice(0, indices[0]));
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : text.length;
    chunks.push(text.slice(start, end));
  }
  return chunks;
}
