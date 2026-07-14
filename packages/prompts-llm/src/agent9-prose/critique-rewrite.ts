/**
 * The critique→rewrite-at-creative-temperature pass (first-principles LLD §6.5 / phase P5).
 *
 * The current post-pass runs at temp 0.2 with a "prefer no change" prompt — it structurally CANNOT lift
 * craft (dramatization, idiolect, atmosphere, de-repetition). This is the missing craft engine: for the
 * lowest-scoring chapters, an LLM critiques against the rubric dimensions, then rewrites at temp 0.7–0.9
 * — with deterministic re-validation and rollback so the rewrite can never drop a clue, alter a locked
 * fact, re-gender a character, or smuggle scaffold (the facts/fairness are protected; only craft moves).
 *
 * Scoped to the lowest ~3–4 chapters to stay inside the 2× cost ceiling (§8). Two LLM calls per chapter
 * (critique + rewrite). The client is injected so the prompts/parse/rollback are unit-testable with a
 * mock; default-off behind AGENT9_CRITIQUE_REWRITE at the call-site.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { ValidatorResult } from "@cml/prose-guard";
import { parseExpandedChapterResponse } from "./repair.js";
import type { ChapterValidator } from "./regen-repair.js";
import { resolveStageModel } from "./model-tiering.js";
import type { ProseChapter } from "./types.js";

export interface ChapterScoreRef {
  /** 0-based index into the chapters array. */
  index: number;
  /** the chapter's quality score (lower = more in need of rewrite). */
  score: number;
}

/**
 * Pick the indices of the lowest-scoring chapters to rewrite, capped at `k`. Ties broken by index
 * (earlier first) for determinism. Chapters at or above `skipAtOrAbove` are never selected (already
 * good enough — don't spend a rewrite on them).
 */
export function selectLowestScoringChapters(
  scored: ReadonlyArray<ChapterScoreRef>,
  k: number,
  skipAtOrAbove = Infinity,
): number[] {
  return [...scored]
    .filter((s) => s.score < skipAtOrAbove)
    .sort((a, b) => (a.score !== b.score ? a.score - b.score : a.index - b.index))
    .slice(0, Math.max(0, k))
    .map((s) => s.index);
}

const REWRITE_DIMENSIONS = ["prose", "dialogue", "character voice", "atmosphere", "de-repetition"];

/**
 * Constraints handed to the rewrite prompt. Locked facts are PRESERVATION-ONLY: the rewrite must keep
 * verbatim any value the chapter already states, but must never insert one the chapter does not state
 * (a flat "reproduce these" imperative made the temp-0.8 rewrite INSERT absent values side-by-side —
 * the dualValueNoContrast defect). `contradictionPair` names the staged-vs-true reading pair: when the
 * chapter states BOTH values they must read as one explicit contradiction, never two disconnected
 * readings; with one or neither present the pair imposes nothing.
 */
export interface RewriteConstraints {
  lockedFacts: ReadonlyArray<string>;
  pronouns: Record<string, string>;
  requiredClues: ReadonlyArray<string>;
  contradictionPair?: { stagedValue: string; trueValue: string } | null;
}

/** Build the critique prompt (read-only analysis against the rubric dimensions). Pure. */
export function buildCritiquePrompt(chapter: ProseChapter): { system: string; user: string } {
  const system =
    "You are a demanding editor of Golden-Age detective fiction. Critique the chapter against the named " +
    "dimensions. Identify only concrete, fixable craft problems — do not propose plot, clue, or logic " +
    "changes. Output JSON only.";
  const user = [
    `Critique this chapter on: ${REWRITE_DIMENSIONS.join(", ")}.`,
    "Return EXACTLY: {\"issues\":[\"...\",\"...\"]} — each issue a specific, local craft fix (no plot/logic changes).",
    "CHAPTER:",
    (chapter.paragraphs ?? []).join("\n\n"),
  ].join("\n\n");
  return { system, user };
}

/** Build the rewrite prompt — lift craft, preserve every fact/clue/identity. Pure. */
export function buildRewritePrompt(
  chapter: ProseChapter,
  issues: ReadonlyArray<string>,
  constraints: RewriteConstraints,
): { system: string; user: string } {
  const system = [
    "You are a master prose stylist for Golden-Age detective fiction.",
    "Rewrite the chapter to fix the listed craft issues — sharper dramatization, distinct character voices, real atmosphere, no repetition.",
    "ABSOLUTE CONSTRAINTS: change NO facts, times, clues, alibis, who is implicated or cleared, or chapter events.",
    "Never alter any character's pronoun, gender, or name. Reproduce verbatim every locked fact value the chapter already states; never introduce locked values the chapter does not state. Keep every clue present.",
    "Do not emit instruction-shaped text, validation language, or planning notes. Output JSON only.",
  ].join(" ");
  const pronounLines = Object.entries(constraints.pronouns ?? {}).map(([n, p]) => `${n}: ${p}`).join("; ");
  // the contradiction obligation binds only when the chapter already states BOTH readings — with one
  // or neither present, adding it would pressure the rewrite to insert the missing value
  const chapterText = (chapter.paragraphs ?? []).join("\n").toLowerCase();
  const pair = constraints.contradictionPair;
  const pairBinds =
    pair != null &&
    chapterText.includes(pair.stagedValue.toLowerCase()) &&
    chapterText.includes(pair.trueValue.toLowerCase());
  const user = [
    issues.length > 0 ? `Fix these craft issues:\n${issues.map((i) => `  • ${i}`).join("\n")}` : "Lift the prose, dialogue, character voice, and atmosphere.",
    constraints.lockedFacts.length > 0
      ? `If the chapter mentions any of these measured values, reproduce the exact phrase verbatim: ${constraints.lockedFacts.join("; ")}. NEVER introduce a locked value the chapter does not already state.`
      : "",
    pairBinds && pair
      ? `CONTRADICTION OBLIGATION: the chapter states both "${pair.stagedValue}" and "${pair.trueValue}" — they must appear as ONE explicit contradiction (what claimed or appeared to be ${pair.stagedValue}, but ${pair.trueValue} was true), never as two disconnected readings.`
      : "",
    pronounLines ? `PRONOUN LOCK — never change: ${pronounLines}.` : "",
    constraints.requiredClues.length > 0 ? `Every one of these clues must remain on the page: ${constraints.requiredClues.join("; ")}.` : "",
    "Return EXACTLY: {\"chapter\":{\"title\":\"...\",\"summary\":\"...\",\"paragraphs\":[\"...\"]}}",
    "CHAPTER TO REWRITE:",
    JSON.stringify({ title: chapter.title, summary: chapter.summary, paragraphs: chapter.paragraphs }),
  ].filter(Boolean).join("\n\n");
  return { system, user };
}

const isRegression = (before: ValidatorResult, after: ValidatorResult): string | null => {
  // Report the most specific cause first (mirrors prose-guard's mutateThenValidate reason ordering): a
  // named new violation beats the generic clean→dirty message.
  const newViolations = after.violations.filter((v) => !before.violations.includes(v));
  if (newViolations.length > 0) return `rewrite introduced: ${newViolations.join("; ")}`;
  if (before.ok && !after.ok) return "rewrite made a clean property invalid";
  if (after.score < before.score) return `rewrite lowered score ${before.score} → ${after.score}`;
  return null;
};

export interface CritiqueRewriteResult {
  chapter: ProseChapter;
  /** true iff the rewrite was kept (it ran AND broke nothing). */
  rewritten: boolean;
  rollbackReason?: string;
}

export interface CritiqueRewriteChapterArgs {
  client: AzureOpenAIClient;
  chapter: ProseChapter;
  constraints: RewriteConstraints;
  /** gates the rewrite: facts/clues/pronouns/scaffold. Rewrite kept only if it does NOT regress. */
  validate: ChapterValidator;
  model?: string;
  rewriteTemperature?: number;
  runId?: string;
  projectId?: string;
}

/**
 * Critique then rewrite ONE chapter, keeping the rewrite only if it does not regress the validated
 * properties (no dropped clue, no altered fact, no re-gendering, no scaffold). Unlike repair, a rewrite
 * is NOT required to raise the deterministic score (which measures facts, not craft) — it ships on
 * "no regression", and craft gain is judged by the downstream re-score. Any LLM/parse failure leaves
 * the original untouched.
 */
export async function critiqueAndRewriteChapter(args: CritiqueRewriteChapterArgs): Promise<CritiqueRewriteResult> {
  if (!Array.isArray(args.chapter?.paragraphs) || args.chapter.paragraphs.length === 0) {
    return { chapter: args.chapter, rewritten: false, rollbackReason: "empty_chapter" };
  }
  const before = args.validate(args.chapter);

  let issues: string[] = [];
  try {
    const critiqueRes = await args.client.chat({
      messages: (() => {
        const { system, user } = buildCritiquePrompt(args.chapter);
        return [{ role: "system", content: system }, { role: "user", content: user }];
      })(),
      model: resolveStageModel("critique", args.model),
      temperature: 0.4,
      maxTokens: 1200,
      jsonMode: true,
      logContext: { runId: args.runId ?? "", projectId: args.projectId ?? "", agent: "Agent9-Critique" },
    });
    const parsed = JSON.parse(critiqueRes.content);
    issues = Array.isArray(parsed?.issues) ? parsed.issues.filter((s: unknown) => typeof s === "string" && s.trim()).slice(0, 8) : [];
  } catch {
    // critique is advisory; a failure just means we rewrite against the generic dimension list
    issues = [];
  }

  let candidate: ProseChapter;
  try {
    const { system, user } = buildRewritePrompt(args.chapter, issues, args.constraints);
    const rewriteRes = await args.client.chat({
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      model: resolveStageModel("rewrite", args.model),
      temperature: args.rewriteTemperature ?? 0.8,
      maxTokens: 6000,
      jsonMode: true,
      logContext: { runId: args.runId ?? "", projectId: args.projectId ?? "", agent: "Agent9-Rewrite" },
    });
    candidate = parseExpandedChapterResponse(rewriteRes.content);
  } catch (err) {
    return { chapter: args.chapter, rewritten: false, rollbackReason: `rewrite_failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  const after = args.validate(candidate);
  const regressionReason = isRegression(before, after);
  if (regressionReason) {
    return { chapter: args.chapter, rewritten: false, rollbackReason: regressionReason };
  }
  return { chapter: candidate, rewritten: true };
}

export interface CritiqueRewritePassArgs {
  client: AzureOpenAIClient;
  chapters: ProseChapter[];
  scored: ReadonlyArray<ChapterScoreRef>;
  /** how many of the lowest-scoring chapters to rewrite (cost guard). */
  maxChapters?: number;
  /** chapters at/above this score are skipped (already good). */
  skipAtOrAbove?: number;
  /** per-chapter validator factory: returns the gate for chapter at `index`. */
  validatorFor: (index: number, chapter: ProseChapter) => ChapterValidator;
  /** per-chapter constraints (locked facts / pronouns / required clues / contradiction pair). */
  constraintsFor: (index: number, chapter: ProseChapter) => RewriteConstraints;
  model?: string;
  rewriteTemperature?: number;
  runId?: string;
  projectId?: string;
  onResult?: (index: number, result: CritiqueRewriteResult) => void;
}

/** Rewrite the lowest-scoring chapters in place (returns a new array). Default cost guard: 4 chapters. */
export async function runCritiqueRewritePass(args: CritiqueRewritePassArgs): Promise<{ chapters: ProseChapter[]; rewrittenIndices: number[] }> {
  const targets = selectLowestScoringChapters(args.scored, args.maxChapters ?? 4, args.skipAtOrAbove ?? Infinity);
  const chapters = [...args.chapters];
  const rewrittenIndices: number[] = [];
  for (const index of targets) {
    const chapter = chapters[index];
    if (!chapter) continue;
    const result = await critiqueAndRewriteChapter({
      client: args.client,
      chapter,
      constraints: args.constraintsFor(index, chapter),
      validate: args.validatorFor(index, chapter),
      model: args.model,
      rewriteTemperature: args.rewriteTemperature,
      runId: args.runId,
      projectId: args.projectId,
    });
    args.onResult?.(index, result);
    if (result.rewritten) {
      chapters[index] = result.chapter;
      rewrittenIndices.push(index);
    }
  }
  return { chapters, rewrittenIndices };
}
