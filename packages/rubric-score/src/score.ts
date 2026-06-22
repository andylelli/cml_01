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
import type { CappedScore, RubricScore, StoryFacts } from "./types.js";

export interface JudgeRequest {
  systemPrompt: string;
  userMessage: string;
  schema: typeof RUBRIC_SCHEMA;
}

/** What the LLM critic returns: the rubric score + the structural conditions it observed. */
export interface JudgeResult {
  rubric: RubricScore;
  flags?: StoryFacts;
}

/** The injectable judge — a stub in tests, the Azure structured-output call in production. */
export type RubricJudge = (req: JudgeRequest) => Promise<JudgeResult>;

export interface ScoreStoryInput {
  prose: string;
  cml: unknown;
  judge: RubricJudge;
}

export interface ScoreStoryResult extends CappedScore {
  rubric: RubricScore;
  facts: StoryFacts;
}

/**
 * Score a finished story: extract the verified facts, ask the critic to score the prose (knowing
 * those facts), then enforce the hard caps in code. The number the pipeline ships is `final`.
 */
export async function scoreStory(input: ScoreStoryInput): Promise<ScoreStoryResult> {
  const deterministic = extractStoryFacts(input.cml, input.prose);
  const caseData = unwrapCase(input.cml);

  const userMessage = buildRubricUserMessage(input.prose, {
    ...deterministic,
    victimName: caseData.cast?.find((c) => /victim/i.test(`${c.role ?? ""} ${c.role_archetype ?? ""}`))?.name,
    culprit: caseData.culpability?.culprits?.[0],
  });

  const { rubric, flags } = await input.judge({
    systemPrompt: buildRubricSystemPrompt(),
    userMessage,
    schema: RUBRIC_SCHEMA,
  });

  const facts = mergeFacts(deterministic, flags ?? {});
  const capped = applyHardCaps(rubric, facts);
  return { ...capped, rubric, facts };
}

function unwrapCase(cml: unknown): ScoringCaseInput {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, unknown>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as ScoringCaseInput;
    return obj as ScoringCaseInput;
  }
  return {};
}
