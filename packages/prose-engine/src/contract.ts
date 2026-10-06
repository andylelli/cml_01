/**
 * PROSE ENGINE v2 — THE BOOK CONTRACT (ANALYSIS_99 §10.2).
 *
 * ── WHAT A CONTRACT IS FOR ───────────────────────────────────────────────────────────────────────
 *
 * v1 asks the model to infer its obligations from a 31-block, 40KB context blob, then checks whether
 * it guessed right with seven lint types and twelve regeneration families. The June redesign's first
 * move (`12_system_redesign/15` §4.1) was to make the obligations EXPLICIT and MACHINE-CHECKABLE
 * instead, and it was never wired. This is that, derived rather than authored:
 *
 *   - every obligation in this file comes from an upstream artifact by a pure function;
 *   - the same object is read by the prompt builder, the selector's hard gates, the checkers and the
 *     edit guards — so "what the chapter owes" has ONE owner (L6), where v1 has four that disagree;
 *   - nothing here writes prose, and nothing here is a prohibition.
 *
 * ── THE THREE DERIVATIONS THAT MATTER, EACH WITH ITS RECEIPT ─────────────────────────────────────
 *
 * 1. ROLES come from the outline's beats (`assignChapterRoles`), not from a CML coordinate. The
 *    coordinate resolves on 0 of 45 archived runs (A_87); the keyword fallback was the
 *    implementation and was never written down as one.
 *
 * 2. CLUE OWNERSHIP is A_89 B1's: the first scene that requires a clue dramatizes it, every later
 *    one refers to it. MEASURED: a 41% re-mandate rate across 47 runs, and the repeated spans in the
 *    worst book ARE the evidence list. The reveal and the discriminating test never retire a clue
 *    (A_90 §13 — the matched pair that retired the reveal's own evidence came back with two rubric
 *    caps), so there every decisive clue is offered for re-citation.
 *
 * 3. CLEARANCE PLACEMENT is the roles', not the case's coordinates. `suspect_clearance_scenes`
 *    resolves at 4 of 179 (A_87), and clearances landing after the arrest is a defect the reader has
 *    named in 8 of the last 16 reviews. v2 distributes the case's clearances across the chapters the
 *    roles call `clearances`, in order, and never at or after the reveal — which makes A_94 R1 and
 *    A_96 F2's strippers unnecessary rather than necessary.
 */

import {
  getRequiredClueIdsForScene,
  resolveClueOwnership,
  deriveClueObservable,
  tokenizeForClueObligation,
  selectWitBeat,
  selectDepthBeat,
  traitOnly,
  chapterCarriesWitBeat,
  humourBand,
  beatJobFor,
  UNDERSTATED_STYLES,
  SHARP_STYLES,
  type BeatCandidate,
  provesTheAct,
  splitMeansLinkTrace,
} from "@cml/prompts-llm";
import {
  a110UpstreamEnabled,
  auditFixesEnabled,
  contractFixesEnabled,
  deriveCaseChronology,
  identifyPeople,
  namesIn,
  parseClockTime,
  readInference,
  renderClockWords,
  scheduleEnabled,
} from "@cml/cml";
import { holdCulpritCluesLate, namesCulprit, rebalanceEvidence, withoutCulprit } from "./schedule.js";

import { assignChapterRoles } from "./roles.js";
import { assignTexture } from "./depth.js";
import { assignOpening, clearTheOpening } from "./opening.js";
import { applyFalseLead } from "./false-lead.js";
import type {
  AftermathJob,
  BeatJobFields,
  ChronologyRow,
  ChronologyTable,
  ClueRef,
  ClueSurface,
  ContractCore,
  ContractInput,
  Elimination,
  OwnedShape,
  SceneContract,
  Withheld,
} from "./types.js";

/** The short-book targets from `story_length_policy`, used when the caller states none. */
const DEFAULT_WORD_TARGETS = { chapters: 10, min: 7_500, max: 12_500, chapterIdeal: 1_000 };

/** Key terms a presence checker can use. Capped: a clue described in twelve words is not a clue. */
const keyTermsOf = (text: string, max = 8): string[] =>
  Array.from(new Set(tokenizeForClueObligation(String(text ?? "")))).slice(0, max);

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const nameOf = (value: unknown): string => String((value as { name?: unknown } | null)?.name ?? "").trim();

const roleTextOf = (member: unknown): string => {
  const m = member as Record<string, unknown> | null;
  return String(m?.role_archetype ?? m?.roleArchetype ?? m?.role ?? "").toLowerCase();
};

/** The CASE block, whether the caller passed the envelope or the bare case. */
export const unwrapCase = (cml: unknown): Record<string, unknown> => {
  const c = cml as Record<string, unknown> | null;
  const inner = c?.CASE as Record<string, unknown> | undefined;
  return (inner && typeof inner === "object" ? inner : c) ?? {};
};

/** Every scene of the outline, flattened in act order. */
export const flattenScenes = (outline: ContractInput["outline"]): Record<string, unknown>[] =>
  asArray(outline?.acts)
    .flatMap((act) => asArray((act as { scenes?: unknown })?.scenes))
    .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object");

/**
 * The settled clock, as rows the prose copies. A_90: the case's own values in the spelling the
 * LOCKED FACT uses, because the prose prints them verbatim and two spellings of one hour read to a
 * reader as two different times. Durations the device fixes but places nowhere are reported, never
 * guessed — A_89 A1's first design guessed and had a 94% false-positive rate.
 */
export const buildChronologyTable = (
  caseBlock: unknown,
  lockedFacts: ReadonlyArray<Record<string, unknown>>,
): ChronologyTable => deriveChronology(caseBlock, lockedFacts).table;

/** An interval row of THE CLOCK with the dial ends and the source it was read from (A_111 V-1). */
export interface ChronologyInterval {
  value: string;
  label: string;
  /** Minutes on the 12-hour dial (0..719), as `deriveCaseChronology` places them. */
  start: number;
  end: number;
  /** "case" — a window or alibi the case declares; "locked" — a device duration placed between two events. */
  source: string;
}

/** The table, and its interval rows with their dial ends. One derivation, so the two cannot disagree. */
const deriveChronology = (
  caseBlock: unknown,
  lockedFacts: ReadonlyArray<Record<string, unknown>>,
): { table: ChronologyTable; intervals: ChronologyInterval[] } => {
  const rows: ChronologyRow[] = [];
  const unplaced: string[] = [];
  const intervals: ChronologyInterval[] = [];
  try {
    const chrono = deriveCaseChronology(caseBlock, lockedFacts as never);
    const byId = new Map(chrono.events.map((e) => [e.id, e] as const));
    for (const event of chrono.events) {
      if (event.source === "case" && rows.some((r) => r.value === (event.raw ?? ""))) continue;
      const value = String(event.raw ?? renderClockWords(event.dial)).trim();
      if (!value) continue;
      if (rows.some((r) => r.kind === "instant" && r.value === value)) continue;
      rows.push({ kind: "instant", value, label: String(event.label ?? event.id) });
    }
    for (const interval of chrono.intervals) {
      const start = byId.get(interval.start);
      const end = byId.get(interval.end);
      if (!start || !end) continue;
      const from = String(start.raw ?? renderClockWords(start.dial));
      const to = String(end.raw ?? renderClockWords(end.dial));
      const length = interval.lengthRaw ?? `${interval.minutes} minutes`;
      const row: ChronologyRow = { kind: "interval", value: `${from} to ${to} (${length})`, label: String(interval.label ?? interval.id) };
      rows.push(row);
      intervals.push({ value: row.value, label: row.label, start: start.dial, end: end.dial, source: String(interval.source ?? "") });
    }
    for (const u of chrono.unplaced) unplaced.push(`${u.id} ("${u.raw}") — ${u.reason}`);
  } catch {
    // A chronology that cannot be derived is a book with no clock rows, not a failed run.
  }
  return { table: { rows, unplaced }, intervals };
};

/** Minutes forward from `from` to `to` on the 12-hour dial. */
const dialForward = (from: number, to: number): number => (((to - from) % 720) + 720) % 720;

/** The words that say an interval is the act itself or the chance at it — genre words, never case nouns. */
const ACT_WINDOW_RE = /\b(?:murder\w*|kill\w*|death|died|the act|opportunit\w*|access|entry)\b/i;

/**
 * A_111 V-1 (WF-005 V2C-01) — "the chance to do it", chosen by what the window CONTAINS, not by a keyword.
 *
 * MEASURED over the 64 stored cases: OFF picks by a keyword regex and else the first interval — 26 of 64 fall back,
 * one regex hit was "access" inside "inaccessible", and 30 of 64 state a window that misses the case's actual time of
 * death (21) or is a living innocent's alibi (10) (WF-005 probe p17). ON:
 *   - the window must contain the case's actual time of death (when the case states one the dial can read), and
 *     name no living person but a culprit — an innocent's alibi is never the chance to do it;
 *   - a case that states no readable time of death accepts only a window the case itself labels as the act;
 *   - among those: a case window labelled as the act, then any other case window, then a device duration labelled
 *     as the act (a device duration that is not about the act measures a trick, not an opening); narrowest first;
 *   - none: no window, and the reveal says nothing about one. Never the first interval.
 */
export const chooseOpportunityWindow = (args: {
  intervals: ReadonlyArray<ChronologyInterval>;
  actualTimeOfDeath: string;
  culprits: ReadonlyArray<string>;
  victim: string;
  castNames: ReadonlyArray<string>;
}): { value: string; label: string } | undefined => {
  const people = identifyPeople([...args.castNames]);
  const namesAnInnocent = (label: string): boolean =>
    namesIn(label, people).some((n) => !args.culprits.includes(n) && n !== args.victim);
  const tod = parseClockTime(args.actualTimeOfDeath);
  const rank = (i: ChronologyInterval): number | null => {
    const act = ACT_WINDOW_RE.test(i.label);
    if (i.source === "case") return act ? 0 : tod === null ? null : 1;
    return act && tod !== null ? 2 : null;
  };
  const ranked = args.intervals
    .map((i, index) => ({ i, index, rank: rank(i), width: dialForward(i.start, i.end) }))
    .filter((x) => x.rank !== null && !namesAnInnocent(x.i.label))
    .filter((x) => tod === null || dialForward(x.i.start, tod) <= x.width)
    .sort((a, b) => a.rank! - b.rank! || a.width - b.width || a.index - b.index);
  const best = ranked[0]?.i;
  if (!best) return undefined;
  // The same span as a locked fact spells it, when one does: the prose copies the value, and A_90's rule is the locked
  // fact's spelling (a case window's ends are rendered from the dial, "twenty minutes past ten" beside the locked
  // "twenty minutes past ten at night").
  const locked = args.intervals.find((i) => i.source === "locked" && i.start === best.start && i.end === best.end && !namesAnInnocent(i.label));
  return { value: (locked ?? best).value, label: best.label };
};

/**
 * A_111 V-2 (WF-005 V2C-02) — the crime chapter's clock as two facts in clock order, each in THE CLOCK's spelling.
 *
 * MEASURED: "The clock: between {actual} and {apparent}" read backwards ("between 7:45 and 7:15") in 31 of the 58
 * stored cases that state one — every case whose trick makes the death look EARLIER than it was (29 by the raw dial,
 * and 2 across midnight that the raw dial reads forwards: "between 12:10 AM and 11:55 PM"). A window was never
 * the fact: the case states two instants, the true one and the one it was made to seem. ON: both, earlier first on
 * the dial (the shorter way round, so eleven fifty comes before twelve ten), each spelled as THE CLOCK's row is.
 */
export const deathClockOf = (
  actual: string,
  apparent: string,
  rows: ReadonlyArray<ChronologyRow>,
): NonNullable<SceneContract["deathClock"]> => {
  const spelled = (value: string): string => {
    const instants = rows.filter((r) => r.kind === "instant");
    if (instants.some((r) => r.value === value)) return value;
    const dial = parseClockTime(value);
    return (dial === null ? undefined : instants.find((r) => parseClockTime(r.value) === dial)?.value) ?? value;
  };
  const a = parseClockTime(actual);
  const p = parseClockTime(apparent);
  const forward = a === null || p === null ? null : dialForward(p, a);
  const order = forward === 0 ? "same" : forward !== null && forward < 360 ? "apparent-first" : "actual-first";
  return { actual: spelled(actual), apparent: spelled(apparent), order };
};

/** Title and role words a name may carry in an outline and the cast list may not — generic English. */
const NAME_TITLES = new Set(
  "lady lord sir dame dr doctor mr mrs miss ms master madam inspector detective sergeant constable captain colonel major reverend rev father professor prof chief superintendent the of de van von".split(
    " ",
  ),
);
const nameTokens = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/[\s-]+/)
    .map((t) => t.replace(/'s$/, ""))
    .filter((t) => t.length > 1 && !NAME_TITLES.has(t));

/**
 * A_111 V-9 (WF-005 V2C-12) — an outline name resolved to a cast name on the cast's own name tokens.
 *
 * MEASURED: `present` kept only exact cast names, so a titled name ("Detective <cast name>") fell off every page — in 4
 * of 64 cases (40 chapters), the detective in 3. WF-005 counted 5 (41): its fifth was "<cast name> (referred to)", who
 * is talked about and is not on the page. ON: an outline name is the cast member whose name it carries once its titles are
 * set aside — every remaining token is one of that member's own name tokens, and exactly one member fits. "Inspector
 * Hargrave" is Eleanor Hargrave in a cast with one Hargrave; "Lady Beatrice's maid" is nobody (the maid is not hers);
 * a surname two members share names neither. What resolves to nobody is reported, never guessed.
 */
export const resolveCastName = (raw: string, castNames: ReadonlyArray<string>): string | null => {
  const name = String(raw ?? "").trim();
  if (!name) return null;
  if (castNames.includes(name)) return name;
  const lower = name.toLowerCase();
  const exact = castNames.filter((c) => c && lower === c.toLowerCase());
  if (exact.length === 1) return exact[0]!;
  const tokens = nameTokens(name);
  if (tokens.length === 0) return null;
  const fits = castNames.filter((c) => {
    const own = new Set(nameTokens(c));
    return own.size > 0 && tokens.every((t) => own.has(t));
  });
  return fits.length === 1 ? fits[0]! : null;
};

/**
 * Which register owns each wit shape this chapter (A_95 M4). The reader ranked one cast's comic
 * voices in exactly Agent 2b's order and then asked for difference in KIND, so the flat answer goes
 * to the understated character, the retort to the sharp one, and the unmeant joke to whoever is not
 * trying to be funny.
 */
export const assignOwnedShapes = (
  profiles: ReadonlyArray<BeatCandidate>,
  chapterNumber: number,
): OwnedShape[] => {
  const pool = (profiles ?? []).filter((p) => p?.name);
  const rotate = <T,>(xs: T[]): T | undefined =>
    xs.length === 0 ? undefined : xs[(Math.max(1, chapterNumber) - 1) % xs.length];
  const styled = (styles: readonly string[]) =>
    pool.filter(
      (p) =>
        styles.includes(String(p.humourStyle ?? "").trim().toLowerCase()) && Number(p.humourLevel ?? 0) > 0,
    );
  const humourless = pool.filter(
    (p) => String(p.humourStyle ?? "none").trim().toLowerCase() === "none" || Number(p.humourLevel ?? 0) === 0,
  );
  const shapes: OwnedShape[] = [];
  const flat = rotate(styled(UNDERSTATED_STYLES));
  const retort = rotate(styled(SHARP_STYLES));
  const unmeant = rotate(humourless);
  if (flat) shapes.push({ shape: "flat_answer", name: flat.name });
  if (retort) shapes.push({ shape: "short_retort", name: retort.name });
  if (unmeant) shapes.push({ shape: "unmeant_joke", name: unmeant.name });
  return shapes;
};

/** The beat-job fields Agent 7 emits, read only where the beat has a job. Never invented. */
const readBeatJob = (scene: Record<string, unknown>, beat: string | null): BeatJobFields | null => {
  if (!beat) return null;
  const job = beatJobFor(beat);
  if (!job) return null;
  const out: BeatJobFields = { beat };
  let any = false;
  for (const field of job.fields) {
    const value = scene[field];
    if (typeof value === "string" && value.trim()) {
      (out as unknown as Record<string, unknown>)[field] = value.trim();
      any = true;
    }
  }
  return any ? out : null;
};

/**
 * The clearances the case states, distributed across the chapters the roles call `clearances`.
 * Never at or after the reveal: that is the "Chapter 9 clears suspects of a confessed crime" defect
 * A_96 B6 found on run 50862, and placing them correctly is cheaper than stripping them afterwards.
 */
const distributeClearances = (
  caseBlock: Record<string, unknown>,
  clearanceChapters: number[],
  revealChapter: number,
  aftermathChapter: number | null,
  // A_110 D6: the victim (and any culprit) is never a suspect to clear. MEASURED: 64 of 72 archived CMLs list the victim
  // in suspect_clearance_scenes, and the contract told the writer "{victim} is cleared here" in 24 of 25 v2 runs.
  notSuspects: ReadonlySet<string> = new Set(),
): Map<number, Elimination[]> => {
  const { stated, targets } = clearancePlan(caseBlock, clearanceChapters, revealChapter, aftermathChapter, notSuspects);
  const byChapter = new Map<number, Elimination[]>();
  stated.forEach((entry, i) => {
    const chapter = targets[i % targets.length]!;
    byChapter.set(chapter, [...(byChapter.get(chapter) ?? []), entry]);
  });
  return byChapter;
};

/** The clearances the case states, and the chapters they are dealt across in turn. */
const clearancePlan = (
  caseBlock: Record<string, unknown>,
  clearanceChapters: number[],
  revealChapter: number,
  aftermathChapter: number | null,
  notSuspects: ReadonlySet<string>,
): { stated: Elimination[]; targets: number[] } => {
  const pr = (caseBlock.prose_requirements ?? {}) as Record<string, unknown>;
  const stated = asArray(pr.suspect_clearance_scenes)
    .map((entry) => {
      const e = entry as Record<string, unknown>;
      return {
        name: String(e?.suspect_name ?? "").trim(),
        method: String(e?.clearance_method ?? "").trim(),
      };
    })
    .filter((e) => e.name && e.method && !notSuspects.has(e.name));
  if (stated.length === 0) return { stated, targets: [] };
  const before = clearanceChapters.filter((c) => c < revealChapter);
  // A chapter BETWEEN the reveal and the aftermath is a CLOSURE chapter (see `roles.ts`): its
  // suspects are cleared by the arrest already, so what it owes is a human beat each, not an alibi.
  // The brief reads the chapter number against the reveal to decide which it asks for.
  const closure = clearanceChapters.filter(
    (c) => c > revealChapter && (aftermathChapter === null || c < aftermathChapter),
  );
  const targets = before.length > 0 ? before : closure;
  // Neither: they belong to the chapter immediately before the reveal, which is where the outline
  // would have put them had it carried an `alibis` beat.
  return { stated, targets: targets.length > 0 ? targets : [Math.max(1, revealChapter - 1)] };
};

/**
 * A_111 V-7 + V-8 (WF-005 V2C-10, V2C-11) — each clearance where the suspect is on the page, and the false
 * solution's accused never cleared before the chapter that accuses them.
 *
 * MEASURED over the 64 stored cases: the round-robin put "X is cleared here" in a chapter whose page lacks X in 41
 * (78 rows), and the accused was cleared before the accusing chapter in 54 — `false-lead.ts` step 2 fixes the second
 * only behind `PROSE_V2_FALSE_LEAD`, with the points it schedules. ON:
 *   - V-7: the round-robin chapter when the suspect is on its page (so nothing moves that was right); else the first
 *     clearance chapter that has them on the page; else the round-robin chapter, with the suspect put on its page;
 *   - V-8: `false-lead.ts` step 2's move and nothing else of that flag — a clearance of the accused in a chapter before
 *     the false solution moves to the chapter that breaks it (`refuted_in_chapter` when that falls from the
 *     false-solution chapter to before the reveal, else the false-solution chapter), with the accused on its page.
 *     Pinned to step 2 by `a111-vbatch-c.test.ts` over every stored case.
 */
const placeClearancesOnPage = (
  scenes: SceneContract[],
  plan: { stated: Elimination[]; targets: number[] },
  falseSolution: { accused: string; chapter: number | null; refutedIn: number; reveal: number },
  isCastName: (name: string) => boolean,
): string[] => {
  const notes: string[] = [];
  const sceneAt = (chapter: number): SceneContract | undefined => scenes.find((s) => s.chapter === chapter);
  const putOnPage = (scene: SceneContract, name: string, why: string): void => {
    if (scene.present.includes(name)) return;
    if (!isCastName(name)) {
      notes.push(`${name} is cleared in chapter ${scene.chapter} but is no cast name, so is not put on its page`);
      return;
    }
    scene.present.push(name);
    notes.push(`${name} put on the page in chapter ${scene.chapter}, ${why}`);
  };
  for (const scene of scenes) scene.eliminationsAllowed = [];
  plan.stated.forEach((entry, i) => {
    const turn = plan.targets[i % plan.targets.length]!;
    const onPage = (chapter: number): boolean => sceneAt(chapter)?.present.includes(entry.name) ?? false;
    const chapter = onPage(turn) ? turn : (plan.targets.find(onPage) ?? turn);
    const scene = sceneAt(chapter);
    if (!scene) return;
    scene.eliminationsAllowed = [...scene.eliminationsAllowed, entry];
    putOnPage(scene, entry.name, "the chapter that clears them");
  });
  const { accused, chapter: fsChapter, refutedIn, reveal } = falseSolution;
  if (accused && fsChapter !== null) {
    const brokenIn =
      Number.isInteger(refutedIn) && refutedIn >= fsChapter && refutedIn < reveal && sceneAt(refutedIn) ? refutedIn : fsChapter;
    const target = sceneAt(brokenIn);
    for (const scene of scenes) {
      if (!target || scene.chapter >= fsChapter) continue;
      const found = scene.eliminationsAllowed.find((e) => e.name === accused);
      if (!found) continue;
      scene.eliminationsAllowed = scene.eliminationsAllowed.filter((e) => e !== found);
      if (!target.eliminationsAllowed.some((e) => e.name === accused)) target.eliminationsAllowed = [...target.eliminationsAllowed, found];
      notes.push(`${accused}'s clearance moved from chapter ${scene.chapter} to ${brokenIn} — after the accusation, not before it`);
      putOnPage(target, accused, "the chapter that clears them");
    }
  }
  return notes;
};

/**
 * The clues that must be on the page before the reveal, and are never retired from it.
 *
 * `decisive-trace-not-essential` (memory): the decisive trace is not always marked `essential`, so
 * criticality alone is the wrong test. The id is: A_90 §13's never-retired pattern (a clue whose id
 * names the culprit, the reveal, the discriminating test or the decisive step), and — when that is
 * empty — the essential clues the case's inference path names last.
 */
export const decisiveClueIds = (caseBlock: Record<string, unknown>, clues: unknown[]): string[] => {
  const ids = clues.map((c) => String((c as { id?: unknown })?.id ?? "")).filter(Boolean);
  const named = ids.filter((id) => /culprit|reveal|discriminating|decisive/i.test(id));
  if (named.length > 0) return named;
  const steps = asArray((caseBlock.fair_play as Record<string, unknown> | undefined)?.inference_path);
  const last = steps[steps.length - 1] as Record<string, unknown> | undefined;
  const required = asArray(last?.required_evidence).map((x) => String(x)).filter(Boolean);
  if (required.length > 0) return required.filter((id) => ids.includes(id));
  return clues
    .filter((c) => String((c as { criticality?: unknown })?.criticality ?? "") === "essential")
    .map((c) => String((c as { id?: unknown })?.id ?? ""))
    .filter(Boolean)
    .slice(-3);
};

/**
 * Derive the structural half of the contract. Pure, total, and it never throws: an input missing an
 * artifact yields a thinner contract and a note, because a run that reached the prose stage has
 * already paid for everything upstream and must not lose it to a missing optional field.
 */
export const buildContractCore = (input: ContractInput): ContractCore => {
  const notes: string[] = [];
  /** Outline clue ids the clues artifact does not hold; reported once, not once per chapter. */
  const unresolvableClueIds = new Set<string>();
  const caseBlock = unwrapCase(input.cml);
  const scenes = flattenScenes(input.outline);
  const clues = asArray(input.clues?.clues);
  const cast = asArray(input.cast?.characters);
  const profiles = asArray(input.profiles?.profiles) as BeatCandidate[];
  const targets = input.wordTargets ?? DEFAULT_WORD_TARGETS;

  if (scenes.length === 0) notes.push("the outline carried no scenes: the contract is empty");

  const assignment = assignChapterRoles(scenes);
  notes.push(...assignment.notes);
  const { roles } = assignment;

  const culprits = asArray((caseBlock.culpability as Record<string, unknown> | undefined)?.culprits)
    .map((n) => String(n ?? "").trim())
    .filter(Boolean);
  const victim = nameOf(cast.find((c) => /victim/.test(roleTextOf(c)))) || String(caseBlock.victim ?? "");
  /** Everyone who can still act: the victim carries no wit shape, no depth beat, no line. */
  const living = profiles.filter((p) => nameOf(p) !== victim);
  const mechanism = (caseBlock.hidden_model as Record<string, unknown> | undefined)?.mechanism as
    | Record<string, unknown>
    | undefined;
  const mechanismSummary = String(mechanism?.description ?? "").trim();

  const clueById = new Map(clues.map((c) => [String((c as { id?: unknown })?.id ?? ""), c] as const));
  const ownership: Map<string, number> = (() => {
    try {
      return resolveClueOwnership(caseBlock, scenes);
    } catch {
      notes.push("clue ownership could not be resolved: every required clue is owned by its own scene");
      return new Map<string, number>();
    }
  })();

  const derivedChronology = deriveChronology(caseBlock, input.lockedFacts ?? []);
  const chronology = derivedChronology.table;
  const chronologyValues = chronology.rows.map((r) => r.value);
  const onTheTable = (value: string): boolean =>
    value.length > 0 && chronologyValues.some((v) => v.includes(value));

  const decisive = decisiveClueIds(caseBlock, clues);
  const fixes = contractFixesEnabled();
  /** A_111 §5 (PROSE_V2_AUDIT_FIXES) — WF-005's contract-construction fixes, V-1…V-9 and V-17. OFF: untouched. */
  const audit = auditFixesEnabled();

  /**
   * A_110 N9 + M9 (PROSE_V2_SCHEDULE) — see schedule.ts. ON: every required clue gets ONE owner (the outline's, else the
   * first chapter that requires it), the busiest chapters hand clues to lighter earlier ones (M9), and a clue that
   * implicates a culprit shows its fact before the test and its meaning from the test on (N9). OFF: untouched.
   */
  const people = identifyPeople(asArray(input.cast?.characters).map((c) => nameOf(c)).filter(Boolean));
  const implicatesCulprit = (id: string): boolean => {
    const clue = clueById.get(id) as Record<string, unknown> | undefined;
    if (!clue || culprits.length === 0) return false;
    const inference = [clue.inference, clue.pointsTo].map((v) => String(v ?? "")).join(" ");
    return readInference(inference, people).implicates.some((n) => culprits.includes(n)) || namesCulprit(String(deriveClueObservable(clue as never) ?? ""), culprits);
  };
  const schedule = scheduleEnabled();
  const scheduleTest = roles.discriminatingTest ?? roles.reveal;
  const fullOwnership = new Map<string, number>();
  const movedInto = new Map<number, string[]>();
  if (schedule) {
    scenes.forEach((scene, index) => {
      const chapter = Number((scene as { sceneNumber?: unknown }).sceneNumber) || index + 1;
      let required: string[] = [];
      try {
        required = getRequiredClueIdsForScene(caseBlock, scene, scenes);
      } catch {
        required = [];
      }
      for (const id of required) if (clueById.has(id) && !fullOwnership.has(id)) fullOwnership.set(id, ownership.get(id) ?? chapter);
    });
    const chapterNumbers = scenes.map((s, i) => Number((s as { sceneNumber?: unknown }).sceneNumber) || i + 1);
    // N9 first: the culprit's facts into the second half; then M9 balances the rest, never moving those back early.
    const culpritClues = new Set([...fullOwnership.keys()].filter((id) => implicatesCulprit(id)));
    const moves = [
      ...holdCulpritCluesLate(fullOwnership, culpritClues, { chapters: chapterNumbers, before: scheduleTest }),
      ...rebalanceEvidence(fullOwnership, { chapters: chapterNumbers, decisive: new Set(decisive), before: scheduleTest, keepLate: culpritClues }),
    ];
    // The final owner is what counts: a clue moved twice is staged once, where it ended.
    for (const id of new Set(moves.map((m) => m.id))) {
      const to = fullOwnership.get(id)!;
      movedInto.set(to, [...(movedInto.get(to) ?? []), id]);
    }
    const moved = [...movedInto.values()].flat().length;
    if (moved > 0) notes.push(`schedule (N9 + M9): ${moved} clue(s) moved — culprit facts later, other evidence to lighter chapters`);
  }
  const deferred: Array<{ id: string; observable: string }> = [];
  // A_111 V-7 needs D6 as well: placing a clearance on the page would otherwise put the victim on it as a suspect.
  const notSuspects: ReadonlySet<string> = fixes || audit ? new Set([victim, ...culprits].filter(Boolean)) : new Set();
  const clearanceByChapter = distributeClearances(caseBlock, roles.clearances, roles.reveal, roles.aftermath, notSuspects);

  /**
   * A_110 P5 — the culprit's pre-reveal mask. Agent 7 is told to write "the mysterious guest" for the culprit before the
   * reveal (`prose_requirements.identity_rules`), and `present` kept only cast names, so the culprit was on the page
   * list of NO chapter in run bcc0d637 and of no reveal chapter in 15 of 31 archived casts. The mask resolves to the
   * person; job-field values carrying it ("suspicionShiftsTo: the mysterious guest") are rewritten the same way.
   */
  const masks = new Map<string, string>();
  if (fixes) {
    for (const rule of asArray((caseBlock.prose_requirements as Record<string, unknown> | undefined)?.identity_rules)) {
      const r = rule as Record<string, unknown>;
      const mask = String(r?.before_reveal_reference ?? "").trim();
      const name = String(r?.character_name ?? "").trim();
      if (mask && name && mask.toLowerCase() !== name.toLowerCase()) masks.set(mask.toLowerCase(), name);
    }
  }
  const unmask = (value: string): string => masks.get(value.trim().toLowerCase()) ?? value;
  const unmaskText = (value: string): string => {
    let out = value;
    for (const [mask, name] of masks) out = out.split(new RegExp(escapeRegExp(mask), "i")).join(name);
    return out;
  };

  /**
   * 17-hitting-90 P1.2–P1.4 — the reveal package, computed once from the case.
   *
   * The innocent the test is first applied to: the first suspect the case clears who is not a
   * culprit, else the first living cast member who is neither culprit nor investigator. The proof:
   * the case's own weapon-first trace naming the culprit (A_102's means-link), split into weapon,
   * finding and name so the contract can ask for the sentence as a shape and never paste the trace.
   * The window: the chronology's interval row about the act, else its first interval — both ends
   * already spelled the way THE CLOCK spells them.
   */
  const culpritSet = new Set(culprits);
  const investigatorRe = /detective|investigator|inspector|sleuth|police|constable|sergeant/;
  const clearedSuspects = asArray((caseBlock.prose_requirements as Record<string, unknown> | undefined)?.suspect_clearance_scenes)
    .map((e) => String((e as { suspect_name?: unknown })?.suspect_name ?? "").trim())
    .filter((n) => n && !culpritSet.has(n) && n !== victim);
  const livingSuspects = cast
    .filter((c) => !investigatorRe.test(roleTextOf(c)))
    .map(nameOf)
    .filter((n) => n && !culpritSet.has(n) && n !== victim);
  const testInnocent = clearedSuspects[0] ?? livingSuspects[0] ?? "";
  const proof = (() => {
    try {
      return splitMeansLinkTrace(provesTheAct(caseBlock).linkingTraces[0]);
    } catch {
      return undefined;
    }
  })();
  const intervals = chronology.rows.filter((r) => r.kind === "interval");
  const castNamesForWindow = cast.map(nameOf).filter(Boolean);
  const opportunityWindow = audit
    ? chooseOpportunityWindow({
        intervals: derivedChronology.intervals,
        actualTimeOfDeath: String(mechanism?.actual_time_of_death ?? ""),
        culprits,
        victim,
        castNames: castNamesForWindow,
      })
    : (intervals.find((r) => /murder|entry|the act|opportunit|window|access/i.test(r.label)) ?? intervals[0]);

  /**
   * 17-hitting-90 P2.1 — where the dramatised wound goes: the `motives` beat if the outline has one
   * in the first half, else the first chapter after the opening and the crime and no later than the
   * half-way mark. None if the book is too short to have a first half.
   */
  const half = Math.floor(scenes.length / 2);
  const beatOf = (scene: unknown): string => String((scene as { beat?: unknown })?.beat ?? "").trim();
  const chapterOf = (scene: unknown, index: number): number => Number((scene as { sceneNumber?: unknown })?.sceneNumber ?? index + 1);
  const woundChapter =
    scenes.map((s, i) => ({ chapter: chapterOf(s, i), beat: beatOf(s) })).find((s) => s.beat === "motives" && s.chapter <= half)?.chapter ??
    scenes.map((s, i) => ({ chapter: chapterOf(s, i), beat: beatOf(s) })).find((s) => s.chapter >= 2 && s.chapter <= half && s.beat !== "crime")?.chapter ??
    null;
  const accused = String((caseBlock.false_solution as Record<string, unknown> | undefined)?.accused_suspect ?? "").trim();
  const band = humourBand(input.humourLevel);
  const castNames = cast.map(nameOf).filter(Boolean);
  /** A_111 V-9: outline names no cast member answers to — reported once, never guessed. */
  const unmatchedOutlineNames = new Set<string>();
  /** A culprit by name; ON (A_111 V-6), also by the cast's own name tokens (a title and a surname one member carries). */
  const namesACulprit = (value: string): boolean => {
    const v = String(value ?? "").trim();
    if (culprits.includes(v)) return true;
    if (!audit) return false;
    const resolved = resolveCastName(v, castNames);
    return resolved !== null && culprits.includes(resolved);
  };

  const surfaceOf = (id: string): ClueSurface => {
    const clue = clueById.get(id) as Record<string, unknown> | undefined;
    const observable = clue ? deriveClueObservable(clue as never) : "";
    const unlockedByRaw = clue?.unlockedBy as { name?: unknown; skill?: unknown } | undefined;
    const surface: ClueSurface = {
      id,
      observable: String(observable ?? "").trim(),
      keyTerms: keyTermsOf(String(observable ?? clue?.description ?? "")),
    };
    const as = String(clue?.as ?? "").trim();
    if (as) surface.as = as;
    // WP-002 K1 — present only when Agent 5 emits it; absent means the brief says nothing about it.
    if (unlockedByRaw && String(unlockedByRaw.name ?? "").trim() && String(unlockedByRaw.skill ?? "").trim()) {
      surface.unlockedBy = { name: String(unlockedByRaw.name).trim(), skill: String(unlockedByRaw.skill).trim() };
    }
    return surface;
  };

  const refOf = (id: string, firstChapter: number): ClueRef => {
    const clue = clueById.get(id) as Record<string, unknown> | undefined;
    const text = clue ? deriveClueObservable(clue as never) : "";
    return { id, keyTerms: keyTermsOf(String(text)), firstChapter };
  };

  /**
   * A_110 P3 (CML_A110_UPSTREAM) — the Gathering keeps the victim alive. The beat label alone cannot say so: 61 of 64
   * stored outlines read "gathering > crime" and their gathering scene IS the discovery (agent7-narrative.ts:717, "the
   * body comes first"). So the victim is alive in a scene only when the outline MARKS it (Agent 7, under the same flag,
   * writes `victimAlive: true` for the Gathering) AND the scene comes before the crime beat. An old outline carries no
   * mark, so nothing is inferred from it.
   */
  const upstream = a110UpstreamEnabled();
  const crimeIndex = scenes.findIndex((s) => String((s as { beat?: unknown }).beat ?? "").trim().toLowerCase() === "crime");
  const victimAliveIn = (scene: unknown, index: number): boolean =>
    upstream &&
    // Agent 7 sometimes nests scene fields under `setting` (memory: agent7-scene-fields-nested-under-setting).
    ((scene as { victimAlive?: unknown }).victimAlive === true ||
      ((scene as { setting?: { victimAlive?: unknown } }).setting?.victimAlive ?? false) === true) &&
    (crimeIndex < 0 || index < crimeIndex);

  const sceneContracts: SceneContract[] = scenes.map((scene, index) => {
    const chapter = Number(scene.sceneNumber) || index + 1;
    const role = assignment.byChapter.get(chapter) ?? "investigation";
    const beat = String(scene.beat ?? "").trim().toLowerCase() || null;

    const required = (() => {
      try {
        return getRequiredClueIdsForScene(caseBlock, scene, scenes);
      } catch {
        return [];
      }
    })();
    const mustSurface: ClueSurface[] = [];
    const mayMention: ClueRef[] = [];
    for (const id of required) {
      /**
       * An obligation the clues artifact cannot explain is a CONTRACT defect, not a prose defect.
       *
       * MEASURED 2026-09-19 on seed 50862: 9 of 23 obligations were ids the OUTLINE invented and
       * the clues artifact never held — `time_of_death`, `compass_casing_wear`,
       * `clerk_ledger_testimony` and six more. `surfaceOf` gives each of them an empty observable
       * and no key terms, so `checkHardGates` reported `clue_missing` for every one on every run
       * (there is nothing to look for, so nothing can be found), the editor's prompt printed "the
       * reader can use: " and stopped, and `clueCoverageNotWorse` guarded zero terms.
       *
       * Requiring prose to surface a clue nobody can describe is not a thing prose can do. It is
       * recorded as a note — the run report's channel for what the derivation could not do — and
       * left out of the obligations. This is `cml-outline-scene-join-never-resolved` surfacing in
       * v2; the real repair is upstream, where the outline should name ids the clues artifact holds.
       */
      if (!clueById.has(id)) {
        unresolvableClueIds.add(id);
        continue;
      }
      const owner = (schedule ? fullOwnership : ownership).get(id);
      if (owner === undefined || owner === chapter) mustSurface.push(surfaceOf(id));
      else mayMention.push(refOf(id, owner));
    }
    if (schedule) {
      // M9: a clue moved here from a heavier chapter is staged here.
      for (const id of movedInto.get(chapter) ?? []) if (!mustSurface.some((s) => s.id === id)) mustSurface.push(surfaceOf(id));
      // N9: before the test, a culprit's clue is a fact without its meaning, and without the culprit's name.
      if (chapter < scheduleTest) {
        for (const surface of mustSurface) {
          if (!implicatesCulprit(surface.id)) continue;
          deferred.push({ id: surface.id, observable: surface.observable });
          surface.observable = withoutCulprit(surface.observable, culprits);
          surface.keyTerms = keyTermsOf(surface.observable);
          surface.conclusionAt = scheduleTest;
        }
      }
    }
    // A_90 §13 — the reveal and the discriminating test re-cite the evidence; that is the genre's
    // contract, not a repetition. Every decisive clue is offered there, never required again.
    if (role === "reveal" || role === "discriminating_test") {
      for (const id of decisive) {
        if (mustSurface.some((s) => s.id === id) || mayMention.some((r) => r.id === id)) continue;
        mayMention.push(refOf(id, ownership.get(id) ?? chapter));
      }
    }

    const mustNotReveal: Withheld[] = [];
    const namingChapter = roles.discriminatingTest !== null ? Math.min(roles.discriminatingTest, roles.reveal) : roles.reveal;
    if (chapter < roles.reveal) mustNotReveal.push({ what: "culprit", until: roles.reveal });
    if (chapter < namingChapter) mustNotReveal.push({ what: "mechanism", until: namingChapter });
    for (const [id, owner] of schedule ? fullOwnership : ownership) {
      if (owner > chapter) mustNotReveal.push({ what: id, until: owner });
    }

    const witCandidate =
      band.beatEvery > 0 && chapterCarriesWitBeat(input.humourLevel, chapter)
        ? selectWitBeat(living, chapter)
        : undefined;
    const depthCandidate = selectDepthBeat(living, chapter);

    const contract: SceneContract = {
      chapter,
      beat,
      role,
      title: String(scene.title ?? "").trim(),
      ...(victimAliveIn(scene, index) ? { victimAlive: true } : {}),
      present: [
        ...new Set(
          audit
            ? asArray(scene.characters)
                .map((c) => unmask(String(c ?? "").trim()))
                .map((n) => {
                  if (!n || castNames.length === 0) return n;
                  const resolved = resolveCastName(n, castNames);
                  if (resolved === null) unmatchedOutlineNames.add(n);
                  return resolved ?? "";
                })
                .filter(Boolean)
            : asArray(scene.characters)
                .map((c) => unmask(String(c ?? "").trim()))
                .filter((n) => n && (castNames.length === 0 || castNames.includes(n))),
        ),
      ],
      location: String((scene.setting as Record<string, unknown> | undefined)?.location ?? "").trim(),
      timeOfDay: String((scene.setting as Record<string, unknown> | undefined)?.timeOfDay ?? "").trim() || undefined,
      mustSurface,
      mayMention,
      mustNotReveal,
      eliminationsAllowed: clearanceByChapter.get(chapter) ?? [],
      job: ((): BeatJobFields | null => {
        const job = readBeatJob(scene, beat);
        if (!job || masks.size === 0) return job;
        const out = { ...job } as unknown as Record<string, unknown>;
        for (const [k, v] of Object.entries(out)) if (k !== "beat" && typeof v === "string") out[k] = unmaskText(v);
        return out as unknown as BeatJobFields;
      })(),
      beats: {},
      /**
       * THE POLICY'S TARGET, NOT THE OUTLINE'S ESTIMATE.
       *
       * MEASURED 2026-09-18 over the 48 archived books that have both an outline and a manuscript:
       * the outline estimates **19,915 words** and the book comes out at **10,870** — a ratio of
       * 0.56, on every one of the 48, with a per-scene estimate of 1,970 against ~1,090 delivered.
       * Agent 7's `estimatedWordCount` is aspirational and has never once been met.
       *
       * Planning from it would segment every short book that comfortably fits one writer call, and
       * asking for it would ask for a chapter twice the length this pipeline has ever produced. The
       * policy's `chapterIdeal` is what the books actually hit, so it is what the contract states.
       */
      words: { preferred: targets.chapterIdeal, floor: Math.round(targets.chapterIdeal * 0.75) },
    };

    if (witCandidate?.name) {
      contract.beats.wit = {
        name: witCandidate.name,
        style: String(witCandidate.humourStyle ?? "").trim(),
        // The dead do not carry a comic beat. MEASURED 2026-09-22: the victim held the "unmeant joke"
        // in all ten chapters of two books, because the unmeant joke goes to the humourless character
        // and the victim's profile is the one with humour level 0. The reader saw "Leonard's unmeant
        // joke" seven times.
        shapes: assignOwnedShapes(living, chapter),
      };
    }
    if (depthCandidate?.name && String(depthCandidate.formativeIncident ?? "").trim()) {
      contract.beats.depth = { name: depthCandidate.name, trait: traitOnly(depthCandidate.formativeIncident) };
    }

    // ── 17-hitting-90 P1.2–P1.4: the reveal package, on the chapters that carry it ─────────────────
    // The test is performed ONCE, in the test's own chapter; the reveal carries it only when it is also
    // the test chapter. It read `role === "discriminating_test" || role === "reveal"`, so with the test
    // at 8 and the reveal at 9 both contracts asked for it — 4 of 4 golden cases — and run 98dec72a
    // performed the boot test in chapter 8 and again in chapter 9 (17-hitting-90 §06 R1).
    const testChapter = roles.discriminatingTest ?? roles.reveal;
    if (chapter === testChapter) {
      if (culprits.length > 0 && testInnocent) contract.testSubjects = { innocent: testInnocent, culprit: culprits.join(", ") };
    }
    if (role === "reveal" && testChapter !== chapter) contract.testSeenIn = testChapter;
    if (role === "reveal" && input.proofSteps) {
      const steps = asArray((caseBlock.inference_path as Record<string, unknown> | undefined)?.steps).length;
      if (steps > 0) contract.proofSteps = steps;
    }
    if (role === "reveal") {
      if (proof) contract.proof = proof;
      if (opportunityWindow) contract.opportunityWindow = opportunityWindow;
    }
    if (chapter === woundChapter && victim && culprits.length > 0) {
      contract.wound = {
        victim,
        culprit: culprits.join(", "),
        ...(accused && !culpritSet.has(accused) && accused !== victim ? { accused } : {}),
      };
    }

    if (role === "aftermath") {
      const survivors = contract.present.filter((n) => !culprits.includes(n) && n !== victim).slice(0, 2);
      const aftermath: AftermathJob = {
        outcome: `${culprits.join(", ") || "the culprit"} was exposed in chapter ${roles.reveal}`,
        survivors,
        scope: input.aftermathScope ?? "household",
      };
      const consequenceFor = unmask(String(scene.consequenceFor ?? "").trim());
      // A_110 D5/N4: run.ts renders "X is the first of them we see" in the same contract that says X is in custody.
      if (consequenceFor && !((fixes || audit) && namesACulprit(consequenceFor))) aftermath.consequenceFor = consequenceFor;
      const repairTarget = String(scene.repairTarget ?? "").trim();
      if (repairTarget) aftermath.repairTarget = repairTarget;
      contract.aftermath = aftermath;
    }
    /**
     * A_111 V-6 (WF-005 V2C-09) — the job line is rendered from the FILTERED object. D5 dropped a culprit from
     * `aftermath.consequenceFor`, and the raw job field still printed "consequenceFor: <culprit>" beside "<culprit> is
     * in custody" — 7 of the 7 stored outlines that carry the field. ON: the job carries what the filter kept.
     */
    if (audit && contract.job?.consequenceFor && namesACulprit(contract.job.consequenceFor)) {
      const kept: BeatJobFields = { ...contract.job };
      delete kept.consequenceFor;
      contract.job = Object.keys(kept).some((k) => k !== "beat") ? kept : null;
    }

    // The crime chapter is the one place the case fixes a clock window, so it is the one place a
    // time window is stated. Everywhere else the brief's clock rule does the work, and inventing a
    // window would put a value on the page that no chronology row backs.
    const outlineEstimate = Number(scene.estimatedWordCount);
    if (Number.isFinite(outlineEstimate) && outlineEstimate > targets.chapterIdeal * 1.5) {
      notes.push(
        `chapter ${chapter}: the outline estimates ${outlineEstimate} words against the policy's ${targets.chapterIdeal}; the policy is what the contract states`,
      );
    }

    if (beat === "crime") {
      const apparent = String(mechanism?.apparent_time_of_death ?? "").trim();
      const actual = String(mechanism?.actual_time_of_death ?? "").trim();
      /**
       * FOUND BY THE REPLAY, 2026-09-18 — and it is the reason this check exists rather than a
       * trust. `canary_1787338578179` states an apparent time of death of "seven forty minutes",
       * which `parseClockTime` cannot read (it is neither a clock nor a duration), so the chronology
       * places it nowhere. v1 would have printed that string into the prose as a locked value and
       * the reader would have done arithmetic against a clock the book never states — the
       * `x38-blind-because-parser-could-not-read-its-own-clock` shape, one layer up.
       *
       * A window is stated only when BOTH endpoints are rows of the table. Otherwise it is omitted
       * and reported: the case has a time the pipeline cannot place, which is an Agent 3 defect, and
       * a contract that passed it on would make the manuscript carry it.
       */
      if (apparent && actual) {
        if (onTheTable(apparent) && onTheTable(actual)) {
          if (audit) contract.deathClock = deathClockOf(actual, apparent, chronology.rows);
          else contract.timeWindow = { from: actual, to: apparent };
        } else if (chronology.rows.length > 0) {
          const bad = [apparent, actual].filter((v) => !onTheTable(v));
          notes.push(
            `chapter ${chapter}: the case states a death time the chronology cannot place ` +
              `(${bad.map((v) => `"${v}"`).join(", ")}); no time window is stated for the crime`,
          );
        }
      }
    }

    return contract;
  });

  if (audit) {
    const isCast = (name: string): boolean => castNames.length === 0 || castNames.includes(name);
    const resolve = (name: string): string => (castNames.length > 0 ? resolveCastName(name, castNames) : null) ?? name;
    const sceneAt = (chapter: number): SceneContract | undefined => sceneContracts.find((s) => s.chapter === chapter);

    // V-7 + V-8: every clearance on a page that has the suspect, and the accused cleared only once accused.
    const plan = clearancePlan(caseBlock, roles.clearances, roles.reveal, roles.aftermath, notSuspects);
    const fsBlock = (caseBlock.false_solution ?? {}) as Record<string, unknown>;
    const accusedName = resolve(String(fsBlock.accused_suspect ?? fsBlock.accusedSuspect ?? "").replace(/\s+/g, " ").trim());
    const placed = placeClearancesOnPage(
      sceneContracts,
      {
        targets: plan.targets,
        stated: plan.stated.map((e) => ({ ...e, name: resolve(e.name) })).filter((e) => !notSuspects.has(e.name)),
      },
      {
        accused: accusedName && !culpritSet.has(accusedName) && accusedName !== victim ? accusedName : "",
        chapter: roles.falseSolution !== null && roles.falseSolution < roles.reveal ? roles.falseSolution : null,
        refutedIn: Number(fsBlock.refuted_in_chapter ?? fsBlock.refutedInChapter),
        reveal: roles.reveal,
      },
      isCast,
    );
    notes.push(...placed.map((n) => `audit fixes: ${n}`));

    /**
     * V-4 (WF-005 V2C-04) — "the test is applied on the page to {innocent} first" named somebody absent from the test
     * chapter's page in 36 of 64. ON: a cleared suspect on that page, else any other innocent suspect on it, else the
     * first choice put on the page; the culprit the line names is put on it too.
     */
    const testChapter = roles.discriminatingTest ?? roles.reveal;
    const testScene = sceneAt(testChapter);
    if (testScene?.testSubjects) {
      const cleared = clearedSuspects.map(resolve).filter((n) => !culpritSet.has(n) && n !== victim);
      const onPage = (n: string): boolean => testScene.present.includes(n);
      const innocent = cleared.find(onPage) ?? livingSuspects.find(onPage) ?? cleared[0] ?? livingSuspects[0] ?? testScene.testSubjects.innocent;
      testScene.testSubjects = { innocent, culprit: culprits.join(", ") };
      for (const name of [innocent, ...culprits]) {
        if (onPage(name) || !isCast(name)) continue;
        testScene.present.push(name);
        notes.push(`audit fixes: ${name} put on the page in chapter ${testChapter}, the chapter whose test they take`);
      }
    }

    /**
     * V-3 (WF-005 V2C-03) — the evidence the test turns on is on the page BEFORE the test. MEASURED: direct evidence
     * against the culprit was first staged IN the test chapter in 19 of 64 (after it in 2) while the precedence rule
     * said `holds`. ON: a decisive clue first staged at or after the test, or never, is staged in the latest chapter
     * before it; the chapters from the test on refer to it. Under N9 it keeps its meaning back like any clue there.
     */
    const ordered = [...sceneContracts].sort((a, b) => a.chapter - b.chapter);
    const firstStaged = (): Map<string, number> => {
      const first = new Map<string, number>();
      for (const s of ordered) for (const m of s.mustSurface) if (!first.has(m.id)) first.set(m.id, s.chapter);
      return first;
    };
    const latestBefore = ordered.filter((s) => s.chapter < testChapter).pop();
    const staged = firstStaged();
    for (const id of decisive) {
      if (!clueById.has(id)) continue;
      const first = staged.get(id);
      if (first !== undefined && first < testChapter) continue;
      if (!latestBefore) {
        notes.push(`audit fixes: decisive clue ${id} has no chapter before the test (${testChapter}) to be staged in`);
        continue;
      }
      for (const s of ordered) {
        if (s.chapter < testChapter || !s.mustSurface.some((m) => m.id === id)) continue;
        s.mustSurface = s.mustSurface.filter((m) => m.id !== id);
        s.mayMention.push(refOf(id, latestBefore.chapter));
      }
      const surface = surfaceOf(id);
      if (schedule && latestBefore.chapter < scheduleTest && implicatesCulprit(id)) {
        deferred.push({ id, observable: surface.observable });
        surface.observable = withoutCulprit(surface.observable, culprits);
        surface.keyTerms = keyTermsOf(surface.observable);
        surface.conclusionAt = scheduleTest;
      }
      latestBefore.mustSurface.push(surface);
      for (const s of ordered) {
        s.mustNotReveal = s.mustNotReveal.filter((w) => w.what !== id);
        if (s.chapter < latestBefore.chapter) s.mustNotReveal.push({ what: id, until: latestBefore.chapter });
      }
      notes.push(
        `audit fixes: decisive clue ${id} was first staged ${first === undefined ? "nowhere" : `in chapter ${first}`}, ` +
          `not before the test (${testChapter}); staged in chapter ${latestBefore.chapter}`,
      );
    }
    // "Already on the page" only where it is: the chapter that stages the clue is earlier than the one referring to it.
    const stagedNow = firstStaged();
    for (const s of ordered) {
      if (s.role === "reveal" || s.role === "discriminating_test") {
        for (const id of decisive) {
          if (s.mustSurface.some((m) => m.id === id) || s.mayMention.some((r) => r.id === id) || !stagedNow.has(id)) continue;
          s.mayMention.push(refOf(id, stagedNow.get(id)!));
        }
      }
      s.mayMention = s.mayMention
        .map((r) => (stagedNow.has(r.id) ? { ...r, firstChapter: stagedNow.get(r.id)! } : r))
        .filter((r) => stagedNow.has(r.id) && r.firstChapter < s.chapter);
    }
    if (unmatchedOutlineNames.size > 0) {
      notes.push(`audit fixes: outline names no cast member answers to, left off every page: ${[...unmatchedOutlineNames].sort().join(", ")}`);
    }
  }

  // A_110 N9: the test chapter is where the deferred meanings are first said aloud — a job there, not a ban earlier.
  if (schedule && deferred.length > 0) {
    const test = sceneContracts.find((s) => s.chapter === scheduleTest);
    if (test) test.conclusions = deferred;
  }

  const core: ContractCore = {
    book: { chapters: sceneContracts.length || targets.chapters, words: { min: targets.min, max: targets.max } },
    chronology,
    roles,
    scenes: sceneContracts,
    fairPlay: {
      culprits,
      victim,
      mechanismSummary,
      decisiveClueIds: decisive,
      revealChapter: roles.reveal,
    },
    notes: unresolvableClueIds.size > 0
      ? [
          ...notes,
          `${unresolvableClueIds.size} clue id(s) the outline requires are in no clues artifact and ` +
            `carry no observable, so no prose could surface them; they are not required of any ` +
            `chapter: ${[...unresolvableClueIds].sort().join(", ")}`,
        ]
      : notes,
  };
  if (fixes) {
    /**
     * A_110 P5, second half. The mask accounted for some of it; in 14 of 31 archived casts the outline's reveal scene
     * lists no culprit under any name, while the reveal operation requires the culprit to speak twice on the page. The
     * test applies to the culprit on the page too. And Agent 7's own rule is "the culprit must already be present by
     * beat crime": where no chapter before the reveal lists them, the crime chapter does.
     */
    const ensure = (scene: SceneContract | undefined): void => {
      if (!scene) return;
      for (const c of culprits) if (!scene.present.includes(c)) scene.present.push(c);
    };
    ensure(sceneContracts.find((s) => s.chapter === roles.reveal));
    if (roles.discriminatingTest !== null) ensure(sceneContracts.find((s) => s.chapter === roles.discriminatingTest));
    if (culprits.length > 0 && !sceneContracts.some((s) => s.chapter < roles.reveal && culprits.some((c) => s.present.includes(c)))) {
      ensure(sceneContracts.find((s) => s.beat === "crime" && s.chapter < roles.reveal) ?? sceneContracts.find((s) => s.chapter < roles.reveal));
    }
    reallocateBeats(sceneContracts, { living, victim, culprits, roles, humourLevel: input.humourLevel });
  }
  // §07: depth from what the pipeline already wrote, each piece owned by one chapter.
  for (const [chapter, texture] of assignTexture(input, core)) {
    const scene = core.scenes.find((s) => s.chapter === chapter);
    if (scene) scene.texture = texture;
  }
  // A_110 step 1 (PROSE_V2_OPENING): the place, the people and the death, owned by the chapters that carry them.
  for (const [chapter, opening] of assignOpening(input, core)) {
    const scene = core.scenes.find((s) => s.chapter === chapter);
    if (scene) scene.opening = opening;
  }
  clearTheOpening(core.scenes);
  // A_109 step 6 — after texture, so the flag changes nothing but the false lead and the one clearance.
  if (input.falseLead) core.notes.push(...applyFalseLead(caseBlock, core));
  return core;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A_110 D4 and L1 — wit and depth beats as an ALLOCATION over the people on each chapter's page.
 *
 * MEASURED over 64 archived contracts (31 distinct casts): a wit line's owner was off the chapter's page in 61% of
 * wit chapters, because carriers rotate as `(chapter − 1) mod n` over every living profile — the arrested culprit
 * included; and 27% of wit beats sat at the body, the test or the reveal, where the world document's humour map says
 * `forbidden`. A filter alone leaves 10% of wit chapters with nobody eligible, so a beat that cannot stand where the
 * band put it moves to the nearest chapter that can carry one (WP-005's spacing, WP-006 §4.3), and each carrier is
 * the eligible person on the page used least so far. Depth: each person's trait once in the book (L1), in the first
 * chapter before the reveal that has them on the page and no trait yet.
 */
const reallocateBeats = (
  scenes: SceneContract[],
  ctx: {
    living: ReadonlyArray<BeatCandidate>;
    victim: string;
    culprits: ReadonlyArray<string>;
    roles: ContractCore["roles"];
    humourLevel?: string;
  },
): void => {
  const { living, victim, culprits, roles } = ctx;
  const byName = new Map(living.map((p) => [String(p.name ?? ""), p] as const));
  const onPage = (s: SceneContract): BeatCandidate[] =>
    s.present
      .filter((n) => n !== victim && !(s.chapter > roles.reveal && culprits.includes(n)))
      .map((n) => byName.get(n))
      .filter((p): p is BeatCandidate => Boolean(p));
  const funny = (p: BeatCandidate): boolean =>
    Boolean(p.humourStyle) && p.humourStyle !== "none" && Number(p.humourLevel ?? 0) > 0;
  const bodyChapter = scenes.find((s) => s.present.includes(victim) && !s.wound && !s.victimAlive)?.chapter ?? null;
  const forbidden = new Set<number>(
    [bodyChapter, roles.discriminatingTest ?? roles.reveal, roles.reveal].filter((c): c is number => c !== null),
  );
  const feasible = (s: SceneContract): boolean => !forbidden.has(s.chapter) && onPage(s).length >= 2 && onPage(s).some(funny);

  const band = humourBand(ctx.humourLevel);
  const desired = scenes.filter((s) => band.beatEvery > 0 && chapterCarriesWitBeat(ctx.humourLevel, s.chapter)).map((s) => s.chapter);
  const chosen = new Set<number>();
  const sceneAt = new Map(scenes.map((s) => [s.chapter, s] as const));
  for (const chapter of desired) {
    if (feasible(sceneAt.get(chapter)!)) {
      chosen.add(chapter);
      continue;
    }
    for (const d of [1, -1, 2, -2]) {
      const alt = sceneAt.get(chapter + d);
      if (alt && !chosen.has(alt.chapter) && !desired.includes(alt.chapter) && feasible(alt)) {
        chosen.add(alt.chapter);
        break;
      }
    }
  }
  const used = new Map<string, number>();
  for (const s of scenes) {
    delete s.beats.wit;
    if (!chosen.has(s.chapter)) continue;
    const pool = onPage(s);
    const carriers = pool.filter(funny);
    const offset = (Math.max(1, s.chapter) - 1) % Math.max(1, carriers.length);
    const ranked = carriers
      .map((p, i) => ({ p, uses: used.get(String(p.name)) ?? 0, turn: (i - offset + carriers.length) % carriers.length }))
      .sort((a, b) => a.uses - b.uses || a.turn - b.turn);
    const carrier = ranked[0]?.p;
    if (!carrier?.name) continue;
    used.set(String(carrier.name), (used.get(String(carrier.name)) ?? 0) + 1);
    s.beats.wit = { name: String(carrier.name), style: String(carrier.humourStyle ?? "").trim(), shapes: assignOwnedShapes(pool, s.chapter) };
  }

  const withTrait = living.filter((p) => p.name && String(p.formativeIncident ?? "").trim().length > 12);
  for (const s of scenes) delete s.beats.depth;
  for (const p of withTrait) {
    const home = scenes.find((s) => s.chapter < roles.reveal && !s.beats.depth && onPage(s).some((q) => q.name === p.name));
    if (home) home.beats.depth = { name: String(p.name), trait: traitOnly(p.formativeIncident) };
  }
};
