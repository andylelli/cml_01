/**
 * The Story Bible — the single canonical, frozen object every Agent 9 prompt dereferences
 * (first-principles LLD §5.1 / §6.1, phases P1–P2).
 *
 * `world-state.ts` already lands the coherence ROOT (typed locked facts D1, the staged/true
 * contradiction D2, mechanism↔environment D3, identity substrate D5) and the contradiction gate. The
 * Bible is its completion: it folds the upstream artifacts that today live scattered across
 * `storyContract`, `characterBundle`, `clueDistribution`, and `macroArcPlan` into ONE typed object so
 * that times (staged & true), per-character placement, locked voices, the structured discriminating
 * test, and the per-chapter beat-sheet are all dereferenced from a single source — nothing re-derived
 * in a prompt. That is what removes drift at the source (the prose-scraped time anchor and the
 * shape-based locked-fact re-classification) instead of chasing it across ten chapters.
 *
 * Pure, null-safe, additive: `buildStoryBible` extends `buildStoryWorldState`; the gates
 * (`runContradictionGate`, `verifyDiscriminator`) run over the Bible unchanged. No prose is written.
 */

import { buildStoryWorldState, runContradictionGate } from "./world-state.js";
import type { StoryWorldState, WorldStateInputs, ContradictionGateResult } from "./world-state.js";
import { verifyDiscriminator } from "./discriminator-verifier.js";
import type { DiscriminatorVerdict } from "./discriminator-verifier.js";
import type { MacroArcEntry } from "./agent9-prose/types.js";

const norm = (s: unknown): string => String(s ?? "").trim();
const lc = (s: unknown): string => norm(s).toLowerCase();

// ── Bible-only typed fields (additive over StoryWorldState) ──────────────────

export interface BibleClock {
  /**
   * The central staged/true contradiction values, in registry order — UNLABELLED. The world-state pair
   * is deliberately order-neutral (the discriminating test, not the data, determines which reading is
   * the appearance and which the truth — see prompt-builder `DiscriminatingContradictionPair`), so the
   * Bible does not fabricate a staged↔true assignment. Resolving the labelled triple is a follow-up
   * that needs Agent 3b to emit explicit `staged_value`/`true_value` (today's schema has neither).
   */
  contradictionValues: [string, string] | null;
  /** staged value per event id — populated ONLY from an explicit upstream triple (empty today). */
  staged: Record<string, string>;
  /** true value per event id — deterministic ground-truth anchors from the G5 oracle. */
  true: Record<string, string>;
  /** the murder moment's true value, when resolvable from the crime-time anchors. */
  murderMoment: string | null;
}

export interface BibleVoice {
  register: string;
  humourStyle: string;
  humourLevel: number;
  forbiddenCliché: string;
  speechMannerisms: string;
}

export interface BibleDiscriminatingTest {
  /** the unlabelled central contradiction values (see BibleClock.contradictionValues). */
  contradictionValues: [string, string] | null;
  /** the action that exposes the truth — CASE.discriminating_test.design / pass_condition. */
  exposingAction: string;
  evidenceClueIds: string[];
  eliminatedSuspects: string[];
}

export interface ChapterBeat {
  chapter: number;
  /** archetype label from the macro-arc plan (DISCOVERY…RESOLUTION). */
  archetype: string;
  /** stage-mode key, when the upstream supplied one. */
  stageMode?: string;
  /** what happens, as obligations (not prose). */
  beats: string[];
  /** clue ids to plant in this chapter (resolved upstream; may be empty at build time). */
  cluesToPlant: string[];
  cluesPaidOff: string[];
  charactersPresent: string[];
  suspectPressured?: string;
  arcPosition: string;
  emotionalTurn?: string;
  mustNotReveal: { clues: string[]; solutionCulprit: boolean };
}

export interface StoryBible extends StoryWorldState {
  clock: BibleClock;
  /** per-character location keyed by time-slot label; best-available from alibi windows today. */
  placement: Record<string, Record<string, string>>;
  voices: Record<string, BibleVoice>;
  discriminatingTest: BibleDiscriminatingTest;
  beatSheet: ChapterBeat[];
}

export interface StoryBibleInputs extends WorldStateInputs {
  /** the G5 oracle — crime time anchors, alibi windows, macro-arc, locked facts. */
  storyContract?: {
    macroArcPlan?: ReadonlyArray<MacroArcEntry>;
    culpritAlibiWindows?: Record<string, string>;
    crimeTimeAnchors?: ReadonlyArray<string>;
  } | null;
  /** per-character voice/humour bundle. */
  characterBundle?: {
    characters?: ReadonlyArray<{
      name?: string;
      voiceFragments?: ReadonlyArray<{ register?: string; text?: string }>;
      humourStyle?: string;
      humourLevel?: number;
      forbiddenCliché?: string;
      speechMannerisms?: string;
    }>;
  } | null;
  /** primary CASE block — discriminating_test + cast for placement/pressure. */
  cmlCase?: any;
  /** macro-arc plan (when not on storyContract). */
  macroArcPlan?: ReadonlyArray<MacroArcEntry>;
  /** pre-resolved clue ids per chapter (from the obligation scheduler), when available. */
  cluesByChapter?: Record<number, ReadonlyArray<string>>;
}

const contradictionValues = (ws: StoryWorldState): [string, string] | null => {
  const v = ws.contradiction?.values;
  if (Array.isArray(v) && v.length === 2 && norm(v[0]) && norm(v[1])) return [norm(v[0]), norm(v[1])];
  return null;
};

const buildClock = (ws: StoryWorldState, inputs: StoryBibleInputs): BibleClock => {
  const staged: Record<string, string> = {}; // empty until an explicit upstream staged/true triple exists
  const truth: Record<string, string> = {};
  // True-time anchors from the G5 oracle — deterministic ground truth, never prose-scraped.
  const anchors = inputs.storyContract?.crimeTimeAnchors ?? [];
  anchors.forEach((a, i) => {
    const v = norm(a);
    if (v) truth[`crime_anchor_${i}`] = v;
  });
  return {
    contradictionValues: contradictionValues(ws),
    staged,
    true: truth,
    murderMoment: truth.crime_anchor_0 ?? null,
  };
};

const buildPlacement = (inputs: StoryBibleInputs): Record<string, Record<string, string>> => {
  const out: Record<string, Record<string, string>> = {};
  // Best-available placement today: the culprit alibi windows (character → claimed whereabouts).
  const windows = inputs.storyContract?.culpritAlibiWindows ?? {};
  for (const [name, window] of Object.entries(windows)) {
    const n = norm(name);
    if (n && norm(window)) out[n] = { alibi_window: norm(window) };
  }
  return out;
};

const buildVoices = (inputs: StoryBibleInputs): Record<string, BibleVoice> => {
  const out: Record<string, BibleVoice> = {};
  for (const c of inputs.characterBundle?.characters ?? []) {
    const name = norm(c?.name);
    if (!name) continue;
    out[name] = {
      register: norm(c?.voiceFragments?.[0]?.register) || "neutral",
      humourStyle: norm(c?.humourStyle),
      humourLevel: Number.isFinite(c?.humourLevel) ? Number(c?.humourLevel) : 0,
      forbiddenCliché: norm(c?.forbiddenCliché),
      speechMannerisms: norm(c?.speechMannerisms),
    };
  }
  return out;
};

const buildDiscriminatingTest = (ws: StoryWorldState, inputs: StoryBibleInputs): BibleDiscriminatingTest => {
  const dt = inputs.cmlCase?.discriminating_test ?? {};
  const evidenceClueIds = (Array.isArray(dt?.evidence_clues) ? dt.evidence_clues : [])
    .map((e: any) => (typeof e === "string" ? e : norm(e?.clue_id ?? e?.id)))
    .filter(Boolean);
  const eliminatedSuspects = (Array.isArray(dt?.eliminated_suspects) ? dt.eliminated_suspects : [])
    .map((e: any) => (typeof e === "string" ? norm(e) : norm(e?.name)))
    .filter(Boolean);
  return {
    contradictionValues: contradictionValues(ws),
    exposingAction: norm(dt?.design ?? dt?.pass_condition ?? dt?.exposing_action),
    evidenceClueIds,
    eliminatedSuspects,
  };
};

const ARC_POSITIONS = [
  "opening", "early", "first_turn", "mid", "second_turn", "pre_climax", "climax", "resolution",
];
const arcPositionFor = (chapter: number, total: number): string => {
  if (total <= 1) return "opening";
  const idx = Math.round(((chapter - 1) / (total - 1)) * (ARC_POSITIONS.length - 1));
  return ARC_POSITIONS[Math.min(ARC_POSITIONS.length - 1, Math.max(0, idx))];
};

const buildBeatSheet = (inputs: StoryBibleInputs): ChapterBeat[] => {
  const plan = inputs.macroArcPlan ?? inputs.storyContract?.macroArcPlan ?? [];
  const total = plan.length;
  const cast = Array.isArray(inputs.cmlCase?.cast) ? inputs.cmlCase.cast : [];
  const charactersPresent = cast.map((c: any) => norm(c?.name)).filter(Boolean);
  return plan.map((entry) => {
    const beats: string[] = [];
    if (norm(entry.mustContain)) beats.push(norm(entry.mustContain));
    const isResolution = lc(entry.archetype).includes("resolution") || lc(entry.archetype).includes("confrontation");
    return {
      chapter: entry.chapter,
      archetype: norm(entry.archetype),
      beats,
      cluesToPlant: (inputs.cluesByChapter?.[entry.chapter] ?? []).map(norm).filter(Boolean),
      cluesPaidOff: [],
      charactersPresent,
      arcPosition: arcPositionFor(entry.chapter, total),
      mustNotReveal: {
        clues: [],
        // the culprit must not be revealed before a confrontation/resolution archetype
        solutionCulprit: !isResolution,
      },
    };
  });
};

/** Build the canonical Story Bible. Pure; null-safe; extends `buildStoryWorldState`. */
export function buildStoryBible(inputs: StoryBibleInputs): StoryBible {
  const ws = buildStoryWorldState(inputs);
  return {
    ...ws,
    clock: buildClock(ws, inputs),
    placement: buildPlacement(inputs),
    voices: buildVoices(inputs),
    discriminatingTest: buildDiscriminatingTest(ws, inputs),
    beatSheet: buildBeatSheet(inputs),
  };
}

export interface BibleGateResult {
  ok: boolean;
  contradiction: ContradictionGateResult;
  discriminator: DiscriminatorVerdict;
}

/**
 * Run the two source-level gates over the Bible (LLD §6.1 / P2). The contradiction gate guards
 * coherence (culprit≠victim, mechanism↔environment, resolvable gender, no duplicate names); the
 * discriminator verifier guards fair-play soundness (the test excludes every suspect but the culprit
 * using already-planted clues). A case that fails here is repaired AT SOURCE, never in prose.
 */
export function runBibleGates(bible: StoryBible, suspects: ReadonlyArray<string>): BibleGateResult {
  const contradiction = runContradictionGate(bible);
  const discriminator = verifyDiscriminator({
    culprits: bible.culprits,
    suspects,
    eliminatedSuspects: bible.discriminatingTest.eliminatedSuspects,
    evidenceClueCount: bible.discriminatingTest.evidenceClueIds.length,
  });
  return { ok: contradiction.ok && discriminator.sound, contradiction, discriminator };
}
