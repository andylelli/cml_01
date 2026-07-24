/**
 * The orchestration (aligning-the-scoring-system.md §2). `scoreStory` is the seam: it builds the
 * prompt, calls an **injectable** judge (so it is testable offline with a stub and wireable to the
 * Azure structured-output client later — the LLM call is the only non-deterministic part), then
 * **deterministically applies the hard caps** so the final /100 is reproducible and consistent with
 * the story's facts.
 */

import { applyHardCaps } from "./hard-caps.js";
import { extractStoryFacts, mergeFacts, type ScoringCaseInput } from "./facts.js";
import { buildRubricSystemPrompt, buildRubricUserMessage } from "./prompt.js";
import { RUBRIC_SCHEMA } from "./schema.js";
import {
  splitProseIntoChapters,
  verifyCitations,
  verifyStructure,
  type FindUnplantedFn,
  type FlagCitation,
} from "./structural-verifiers.js";
import type { CappedScore, RubricScore, StoryFacts, StructuralAdjustments } from "./types.js";

export interface JudgeRequest {
  systemPrompt: string;
  userMessage: string;
  schema: typeof RUBRIC_SCHEMA;
}

/** What the LLM critic returns: the rubric score + the structural conditions it observed + its citations. */
export interface JudgeResult {
  rubric: RubricScore;
  flags?: StoryFacts;
  /** K2 §2: per-flag chapter+sentence the model claims proves each flag it set. */
  flagCitations?: FlagCitation[];
}

/** The injectable judge — a stub in tests, the Azure structured-output call in production. */
export type RubricJudge = (req: JudgeRequest) => Promise<JudgeResult>;

export interface ScoreStoryInput {
  prose: string;
  cml: unknown;
  judge: RubricJudge;
  /**
   * The finished story split into chapters in order (chapters[0] = Chapter 1). When omitted, `scoreStory`
   * splits the assembled `prose` on chapter headings. Pass it from the structured prose object when you
   * have it — the structural verifiers and citation checks are sharper with true chapter boundaries.
   */
  chapters?: string[];
  /**
   * The real `findUnplantedDiscriminatingClues` (@cml/prompts-llm). Injected by the orchestrator so the
   * planted-evidence verifier reuses the live A_50 §9.3 logic; a faithful local fallback runs without it.
   */
  findUnplanted?: FindUnplantedFn;
  /**
   * A_57 D2 — the discriminating clue's canonical staged/true value pair (from the world-state ledger).
   * When supplied, enables the high-precision dual-value-without-contrast detector (caps *clues* when the
   * two values are stated as flat parallel truths instead of one contradiction).
   */
  discriminatingPair?: { values: [string, string] } | null;
}

export interface ScoreStoryResult extends CappedScore {
  rubric: RubricScore;
  facts: StoryFacts;
}

/**
 * Score a finished story: extract the verified facts, ask the critic to score the prose (knowing
 * those facts), run the deterministic structural verifiers + citation check to **veto** the judge's
 * false/unsupported structural flags, then enforce the hard caps in code. The number the pipeline
 * ships is `final`.
 */
export async function scoreStory(input: ScoreStoryInput): Promise<ScoreStoryResult> {
  const deterministic = extractStoryFacts(input.cml, input.prose, { discriminatingPair: input.discriminatingPair });
  const caseData = unwrapCase(input.cml);

  const chapters = input.chapters && input.chapters.length ? input.chapters : splitProseIntoChapters(input.prose);
  const victimName = caseData.cast?.find((c) => /victim/i.test(`${c.role ?? ""} ${c.role_archetype ?? ""}`))?.name;

  // Run the structural verifiers BEFORE the judge so the test-chapter context can be handed to it.
  const verdict = verifyStructure({
    cml: input.cml,
    chapters,
    victimName,
    findUnplanted: input.findUnplanted,
  });

  const userMessage = buildRubricUserMessage(input.prose, {
    ...deterministic,
    victimName,
    culprit: caseData.culpability?.culprits?.[0],
    testChapter: verdict.testChapter,
  });

  const { rubric, flags, flagCitations } = await input.judge({
    systemPrompt: buildRubricSystemPrompt(),
    userMessage,
    schema: RUBRIC_SCHEMA,
  });

  // ── K2 §2: drop any flag whose cited chapter+sentence does not appear in the prose ────────────
  const judgeFlags: StoryFacts = { ...(flags ?? {}) };
  const structural: StructuralAdjustments = {
    mechanismExplainedChapter: verdict.mechanismExplainedChapter,
    testChapter: verdict.testChapter,
    unplantedEvidence: verdict.unplantedEvidence,
    // A_68 FIX B/C — raw deterministic detections are recorded for telemetry regardless of the cap gate.
    temporalContradiction: verdict.temporalContradiction,
    temporalContradictionEvidence: verdict.temporalContradictionEvidence,
    duplicateReveal: verdict.duplicateReveal,
    duplicateRevealChapters: verdict.duplicateRevealChapters,
  };
  const citationsDropped: string[] = [];
  if (flagCitations && flagCitations.length) {
    const checks = verifyCitations(flagCitations, chapters);
    const verifiedByFlag = new Map<string, boolean>();
    for (const c of checks) verifiedByFlag.set(c.flag, (verifiedByFlag.get(c.flag) ?? false) || c.verified);
    for (const [flag, verified] of verifiedByFlag) {
      if (!verified && (judgeFlags as Record<string, unknown>)[flag] === true) {
        (judgeFlags as Record<string, unknown>)[flag] = false;
        citationsDropped.push(flag);
      }
    }
  }
  if (citationsDropped.length) structural.citationsDropped = citationsDropped;

  // ── K2 §1: the structural verifiers override the judge for the things they can check ──────────
  // Planted-evidence verifier: if every cited piece of reveal evidence IS planted earlier, veto the
  // "unplanted evidence" flag; if the verifier positively finds unplanted evidence, confirm it.
  if (verdict.allRevealEvidencePlanted === true && judgeFlags.revealUsesUnplantedEvidence) {
    judgeFlags.revealUsesUnplantedEvidence = false;
    structural.unplantedEvidenceVetoed = true;
  } else if (verdict.allRevealEvidencePlanted === false && verdict.unplantedEvidence.length > 0) {
    judgeFlags.revealUsesUnplantedEvidence = true;
  }
  // Mechanism-timing check: if the explanation is at/after the test scene, veto a false "too early" flag.
  if (verdict.mechanismExplainedAtOrAfterTest === true && judgeFlags.mechanismExplainedTooEarly) {
    judgeFlags.mechanismExplainedTooEarly = false;
    structural.mechanismTimingVetoed = true;
  } else if (verdict.mechanismExplainedAtOrAfterTest === false) {
    // explanation is genuinely before the test scene → confirm a real "too early" condition
    judgeFlags.mechanismExplainedTooEarly = true;
  }
  // Victim-named check: feed the prose scan into the facts (overrides the judge's victimIdentityUnclear
  // guesswork when we can positively confirm the named victim is present).
  if (verdict.victimNamedInProse === true) judgeFlags.victimIdentityUnclear = false;

  // A_68 FIX B/C — the deterministic temporal-contradiction + duplicate-reveal CAPS are gated behind
  // RUBRIC_STRUCTURAL_CAPS_A68 (default-OFF) for the first corpus pass: the detectors always run and are
  // surfaced in `structural` for telemetry, but they only clamp the score once an A/B confirms no
  // false-positives (probe-before-default-on, §2.8). Runtime env read — never a frozen module const.
  const a68CapsOn =
    process.env.RUBRIC_STRUCTURAL_CAPS_A68 === "true" || process.env.RUBRIC_STRUCTURAL_CAPS_A68 === "1";
  if (a68CapsOn && verdict.temporalContradiction) deterministic.temporalContradiction = true;
  if (a68CapsOn && verdict.duplicateReveal) deterministic.duplicateReveal = true;

  const facts = mergeFacts(deterministic, judgeFlags);
  const capped = applyHardCaps(rubric, facts);
  return { ...capped, structural, rubric, facts };
}

function unwrapCase(cml: unknown): ScoringCaseInput {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, unknown>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as ScoringCaseInput;
    return obj as ScoringCaseInput;
  }
  return {};
}
