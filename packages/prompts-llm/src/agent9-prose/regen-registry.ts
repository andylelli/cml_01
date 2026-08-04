/**
 * S3 (architecture/REVIEW_01.md) — the regen pass registry.
 *
 * THE PROBLEM IT SOLVES. Twelve regen passes live in `regen-integration.ts`, all with the same
 * shape: a detector fires, a defect kind is reported, an instruction goes to the model, a flag gates
 * the whole thing. Spread across 1,273 lines, that means answering "which obligations have an LLM
 * repair path, and what turns each one on?" requires reading the entire file — and, worse, that a
 * defect can quietly acquire a SECOND repair body without anyone noticing. This codebase has paid
 * for that shape repeatedly (two clearance injectors, two SHIPPED definitions, the A_66 vandal with
 * three bodies across two packages).
 *
 * WHAT THIS IS. One table. Every pass, its defect kinds, its gating flag, and which family it
 * belongs to. It is the answer to the enumerability question, and — because the tests below assert
 * it against the real exports and the real flag names — it cannot silently drift from the code.
 *
 * WHAT THIS IS NOT. It does not replace the detectors. Twelve detectors doing genuinely different
 * work (regex over a chapter, ledger lookup, cross-chapter scan, locked-fact comparison) are twelve
 * pieces of real logic, not duplication. What collapses is the identical WRAPPER around them:
 * `finishRegenPass` below is the tail every one of them used to repeat.
 */

import type { ProseChapter } from "./types.js";
import type { ProseDefect } from "./regen-repair.js";

/**
 * How a pass changes a chapter. The distinction is load-bearing, not cosmetic:
 *
 *   insertion — may only ADD paragraphs. Guarded by `preserveOriginalParagraphsValidator`, which
 *               exists because a free rewrite once re-gendered existing prose (repair.ts:153).
 *   rewrite   — may MODIFY existing paragraphs. Needs its own fidelity guard (locked facts, length)
 *               because the insertion guard cannot be applied.
 *
 * Getting this wrong is not a style error — an insertion pass reclassified as a rewrite loses the
 * only thing standing between a targeted repair and collateral damage to shipped prose.
 */
export type RegenPassFamily = "insertion" | "rewrite";

export interface RegenPassSpec {
  /** Stable id — used in telemetry and in the S3 coverage tests. */
  id: string;
  /** The exported function that runs this pass. */
  runner: string;
  /** Defect kinds this pass can produce and repair. */
  defectKinds: ReadonlyArray<ProseDefect["kind"]>;
  /**
   * Environment flag gating the pass, or null when it is unconditional.
   * Cross-checked against architecture/FLAG-AUDIT.md — a pass whose flag is not in the register is
   * a flag with no exit condition, which is the lifecycle failure S1 identified.
   */
  flag: string | null;
  family: RegenPassFamily;
  /** One line: what has to be true for this pass to fire at all. */
  detects: string;
}

/**
 * THE REGISTRY. Ordered as the pipeline runs them, so reading top-to-bottom is reading the repair
 * ladder in execution order.
 */
export const REGEN_PASS_REGISTRY: ReadonlyArray<RegenPassSpec> = [
  {
    id: "clue",
    runner: "runClueRegenPass",
    defectKinds: ["missing_clue", "clue_too_late"],
    flag: "AGENT9_REGEN_CLUE",
    family: "insertion",
    detects: "a required clue is absent from the chapter, or present but after the first quarter",
  },
  {
    id: "clearance",
    runner: "runClearanceRegenPass",
    defectKinds: ["missing_clearance"],
    flag: "AGENT9_REGEN_SUSPECT_ELIM",
    family: "insertion",
    detects: "a suspect needing co-located clearance has none in this chapter",
  },
  {
    id: "suspect_elimination",
    runner: "runSuspectEliminationRegenPass",
    defectKinds: ["missing_clearance"],
    flag: "AGENT9_REGEN_SUSPECT_ELIM",
    family: "insertion",
    detects: "the suspect-closure register still lists an uncleared suspect at ship scope",
  },
  {
    id: "culprit_evidence",
    runner: "runCulpritEvidenceRegenPass",
    defectKinds: ["culprit_unlinked"],
    flag: "AGENT9_REGEN_CULPRIT_EVIDENCE",
    family: "insertion",
    detects: "the culprit is named without evidence language binding them to means/method",
  },
  {
    id: "resolution",
    runner: "runResolutionRegenPass",
    defectKinds: ["missing_resolution"],
    flag: "AGENT9_REGEN_RESOLUTION",
    family: "insertion",
    detects: "the FINAL chapter does not close in-scene while naming the culprit's surname",
  },
  {
    id: "case_transition",
    runner: "runCaseTransitionRegenPass",
    defectKinds: ["missing_case_transition_bridge"],
    flag: "AGENT9_REGEN_TRANSITION",
    family: "rewrite",
    detects: "a missing-person frame shifts to murder language with no body-discovery bridge",
  },
  {
    id: "mechanism_reveal",
    runner: "runMechanismRevealRegenPass",
    defectKinds: ["mechanism_revealed_early"],
    flag: "AGENT9_REGEN_MECHANISM",
    family: "rewrite",
    detects: "the concealment mechanism is causally explained before the discriminating test",
  },
  {
    id: "dual_value_contrast",
    runner: "runDualValueContrastRegenPass",
    defectKinds: ["dual_value_no_contrast"],
    flag: "AGENT9_REGEN_DUAL_VALUE",
    family: "rewrite",
    detects: "both discriminating values appear but are stated as flat parallel facts, uncontrasted",
  },
  {
    id: "dual_value_full_story_residual",
    runner: "runDualValueFullStoryResidualPass",
    defectKinds: ["dual_value_no_contrast"],
    flag: "AGENT9_REGEN_DUAL_VALUE",
    family: "rewrite",
    detects: "the same defect surviving at SHIP scope after per-chapter passes have run",
  },
  {
    id: "scaffold",
    runner: "runScaffoldRegenPass",
    defectKinds: ["scaffold_not_prose"],
    flag: "AGENT9_REGEN_SCAFFOLD",
    family: "rewrite",
    detects: "machine-inserted template text (the deterministic floor's own wording) survives in prose",
  },
  {
    id: "template_leakage",
    runner: "runTemplateLeakageRegenPass",
    defectKinds: ["leakage", "early_spoiler"],
    flag: "AGENT9_REGEN_LEAKAGE",
    family: "rewrite",
    detects: "pipeline vocabulary or a premature reveal leaked into shipped prose",
  },
  {
    /**
     * The thirteenth pass, and the first NEGATIVE one (GEOMETRY-AGENT-DESIGN §8.5/§8.6).
     *
     * Geometry's other violations map onto passes that already exist — the reveal not disclosing is
     * `resolution`, the clincher missing from the reveal is `culprit_evidence`, a clearance register
     * is `clearance`/`suspect_elimination`. Only this one had nothing to reuse, because nothing in
     * this registry expresses "must not contain". It is `rewrite` family for the same reason: a
     * negative constraint cannot be satisfied by insertion.
     */
    id: "aftermath_repeat",
    runner: "runAftermathRepeatRegenPass",
    defectKinds: ["aftermath_repeat"],
    flag: "AGENT9_REGEN_AFTERMATH_REPEAT",
    family: "rewrite",
    detects: "the aftermath chapter re-delivers the culprit, method, motive, concealment or a clearance",
  },
  {
    id: "voice_leakage",
    runner: "runVoiceLeakageRegenPass",
    defectKinds: ["voice_tic_leakage"],
    flag: "AGENT9_VOICE_ENFORCE",
    family: "rewrite",
    detects: "a speaker uses another character's signature phrase in their own dialogue",
  },
];

/** Defect kinds with an LLM repair path. Everything else falls to the deterministic floor. */
export const REPAIRABLE_DEFECT_KINDS: ReadonlySet<ProseDefect["kind"]> = new Set(
  REGEN_PASS_REGISTRY.flatMap((spec) => [...spec.defectKinds]),
);

/** Every flag that gates a regen pass. Cross-checked against FLAG-AUDIT.md by test. */
export const REGEN_PASS_FLAGS: ReadonlyArray<string> = [
  ...new Set(REGEN_PASS_REGISTRY.map((s) => s.flag).filter((f): f is string => f !== null)),
];

export const regenPassById = (id: string): RegenPassSpec | undefined =>
  REGEN_PASS_REGISTRY.find((spec) => spec.id === id);

/** Which pass repairs this defect kind? More than one is legal (per-chapter + ship-scope residual). */
export const passesForDefectKind = (kind: ProseDefect["kind"]): ReadonlyArray<RegenPassSpec> =>
  REGEN_PASS_REGISTRY.filter((spec) => spec.defectKinds.includes(kind));

// ============================================================================
// The shared tail every pass used to repeat
// ============================================================================

export interface RegenPassOutcome {
  chapter: ProseChapter;
  repaired: string[];
  unresolved: string[];
  ran: boolean;
  floored?: string[];
}

/** The no-op result. Twelve passes each built this literal inline; it is one thing, so it is here once. */
export const regenPassDidNotRun = (chapter: ProseChapter): RegenPassOutcome => ({
  chapter,
  repaired: [],
  unresolved: [],
  ran: false,
});

/**
 * Map a `runRegenRepair` result into the pass result shape.
 *
 * Every pass ended with the same six lines: pull obligationRefs off the unresolved defects, treat
 * everything else as repaired, return. Two subtle rules were re-expressed by hand each time and are
 * now stated once:
 *
 *   - an obligationRef missing from a defect is dropped, not recorded as an empty-string repair;
 *   - `repaired` is derived by SUBTRACTING unresolved from attempted, never assumed from a success
 *     flag — a pass that resolved two of three defects must report exactly that.
 */
export const finishRegenPass = (
  chapter: ProseChapter,
  attempted: ReadonlyArray<ProseDefect>,
  unresolvedDefects: ReadonlyArray<ProseDefect>,
  extra?: { floored?: string[] },
): RegenPassOutcome => {
  const unresolved = unresolvedDefects.map((d) => d.obligationRef ?? "").filter(Boolean);
  const repaired = attempted
    .map((d) => d.obligationRef ?? "")
    .filter((ref) => ref && !unresolved.includes(ref));
  return {
    chapter,
    repaired,
    unresolved,
    ran: true,
    ...(extra?.floored ? { floored: extra.floored } : {}),
  };
};
