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
import { a110UpstreamEnabled, contractFixesEnabled, deriveCaseChronology, identifyPeople, readInference, renderClockWords, scheduleEnabled } from "@cml/cml";
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
): ChronologyTable => {
  const rows: ChronologyRow[] = [];
  const unplaced: string[] = [];
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
      rows.push({ kind: "interval", value: `${from} to ${to} (${length})`, label: String(interval.label ?? interval.id) });
    }
    for (const u of chrono.unplaced) unplaced.push(`${u.id} ("${u.raw}") — ${u.reason}`);
  } catch {
    // A chronology that cannot be derived is a book with no clock rows, not a failed run.
  }
  return { rows, unplaced };
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
  const byChapter = new Map<number, Elimination[]>();
  if (stated.length === 0) return byChapter;
  const before = clearanceChapters.filter((c) => c < revealChapter);
  // A chapter BETWEEN the reveal and the aftermath is a CLOSURE chapter (see `roles.ts`): its
  // suspects are cleared by the arrest already, so what it owes is a human beat each, not an alibi.
  // The brief reads the chapter number against the reveal to decide which it asks for.
  const closure = clearanceChapters.filter(
    (c) => c > revealChapter && (aftermathChapter === null || c < aftermathChapter),
  );
  const targets = before.length > 0 ? before : closure;
  if (targets.length === 0) {
    // Neither: they belong to the chapter immediately before the reveal, which is where the outline
    // would have put them had it carried an `alibis` beat.
    const fallback = Math.max(1, revealChapter - 1);
    byChapter.set(fallback, stated);
    return byChapter;
  }
  stated.forEach((entry, i) => {
    const chapter = targets[i % targets.length]!;
    byChapter.set(chapter, [...(byChapter.get(chapter) ?? []), entry]);
  });
  return byChapter;
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

  const chronology = buildChronologyTable(caseBlock, input.lockedFacts ?? []);
  const chronologyValues = chronology.rows.map((r) => r.value);
  const onTheTable = (value: string): boolean =>
    value.length > 0 && chronologyValues.some((v) => v.includes(value));

  const decisive = decisiveClueIds(caseBlock, clues);
  const fixes = contractFixesEnabled();

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
  const clearanceByChapter = distributeClearances(
    caseBlock,
    roles.clearances,
    roles.reveal,
    roles.aftermath,
    fixes ? new Set([victim, ...culprits].filter(Boolean)) : new Set(),
  );

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
  const opportunityWindow =
    intervals.find((r) => /murder|entry|the act|opportunit|window|access/i.test(r.label)) ?? intervals[0];

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
          asArray(scene.characters)
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
      if (consequenceFor && !(fixes && culprits.includes(consequenceFor))) aftermath.consequenceFor = consequenceFor;
      const repairTarget = String(scene.repairTarget ?? "").trim();
      if (repairTarget) aftermath.repairTarget = repairTarget;
      contract.aftermath = aftermath;
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
          contract.timeWindow = { from: actual, to: apparent };
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
