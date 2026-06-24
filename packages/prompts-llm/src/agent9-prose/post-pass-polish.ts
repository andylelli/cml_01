/**
 * agent9-prose/post-pass-polish.ts
 * Guarded quality-only polish for chapters that already satisfy hard validators.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import { parseProseResponse } from "./sanitization.js";
import { assessNarrativeBalanceSignals, buildNarrativeBalanceBlock } from "./narrative-balance.js";
import { formatStageModeLabel } from "./clue-validation.js";
import type { ProseChapter } from "./types.js";
import type { ChapterRepairContext } from "./deterministic-repair.js";

export interface PostPassPolishResult {
  chapter: ProseChapter;
  applied: boolean;
  keptPolishedVersion: boolean;
  rollbackReason?: "validation_regression" | "obligation_regression" | "quality_no_gain";
}

const OBLIGATION_TOKEN_STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "by", "is", "was", "were", "be", "as", "at", "from",
]);

const tokenizeObligation = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !OBLIGATION_TOKEN_STOPWORDS.has(token));

const hasFuzzyObligationMatch = (haystackLower: string, phrase: string): boolean => {
  const tokens = Array.from(new Set(tokenizeObligation(phrase))).slice(0, 8);
  if (tokens.length === 0) return true;
  const minHits = tokens.length <= 3 ? tokens.length : Math.max(2, Math.ceil(tokens.length * 0.4));
  const hits = tokens.reduce((count, token) => (haystackLower.includes(token) ? count + 1 : count), 0);
  return hits >= minHits;
};

const countWords = (value: string): number => {
  const matches = value.match(/[A-Za-z0-9']+/g);
  return matches ? matches.length : 0;
};

const RAW_CLUE_ID_RE = /^clue_[a-z0-9_]+$/i;

export const hasPolishRegression = (args: {
  original: ProseChapter;
  polished: ProseChapter;
  repairContext: ChapterRepairContext;
}): boolean => {
  const originalText = (args.original.paragraphs ?? []).join(" ");
  const polishedText = (args.polished.paragraphs ?? []).join(" ");
  const originalLower = originalText.toLowerCase();
  const polishedLower = polishedText.toLowerCase();

  // Guard against over-compression that can silently remove validated obligations.
  const originalWords = countWords(originalText);
  const polishedWords = countWords(polishedText);
  if (originalWords >= 120 && polishedWords < Math.floor(originalWords * 0.8)) {
    return true;
  }

  for (const clueSummary of args.repairContext.requiredClueSummaries) {
    const normalizedSummary = String(clueSummary ?? "").trim();
    if (!normalizedSummary || RAW_CLUE_ID_RE.test(normalizedSummary)) continue;
    if (!hasFuzzyObligationMatch(originalLower, clueSummary)) continue;
    if (!hasFuzzyObligationMatch(polishedLower, clueSummary)) {
      return true;
    }
  }

  for (const clearance of args.repairContext.matchingClearances) {
    const suspect = String(clearance?.suspect_name ?? "").trim();
    if (!suspect) continue;
    const suspectLower = suspect.toLowerCase();
    if (!originalLower.includes(suspectLower)) continue;
    if (!polishedLower.includes(suspectLower)) {
      return true;
    }
  }

  return false;
};

export const buildPostPassPolishPrompt = (args: {
  chapter: ProseChapter;
  repairContext: ChapterRepairContext;
}): string => {
  const requiredClues = args.repairContext.requiredClueSummaries.slice(0, 6);
  const clearances = args.repairContext.matchingClearances
    .map((entry) => entry.suspect_name)
    .filter(Boolean)
    .slice(0, 5);
  const balanceBlock = buildNarrativeBalanceBlock(args.repairContext.stageMode);
  const balanceAssessment = assessNarrativeBalanceSignals(args.chapter, args.repairContext.stageMode);
  const lines: string[] = [];
  lines.push("QUALITY-ONLY POLISH PASS");
  lines.push("You are editing a chapter that already passes hard logic and validation gates.");
  lines.push("Make only local prose improvements: rhythm, clarity, transitions, sentence variety, and naturalness.");
  lines.push("Do not reorder events, add new facts, remove evidence, or change who is implicated or cleared.");
  // ROADMAP_TO_80 M3: dialogue subtext + de-redundancy targets. These are LOCAL rewrites that must
  // preserve every named fact/clue/alibi/clearance in meaning (the pass re-validates and rolls back).
  lines.push("- DIALOGUE SUBTEXT: rewrite any line that reads as a flat exposition dump — an alibi, time, or clearance stated as a plain report (\"I was in the kitchen at eleven, the cook will confirm\") — into a line with subtext: the speaker deflects, hedges, qualifies, or implies, and the investigator infers the rest. Preserve every named fact, clue, alibi, and clearance verbatim in meaning; invent nothing.");
  lines.push("- DE-REDUNDANCY: cut repeated atmospheric/setting phrasing and vary sentence openings across the chapter; never repeat a sensory sentence near-verbatim.");
  lines.push("");
  lines.push("LOCKED STORY CONTRACT");
  lines.push(`- Stage mode remains ${formatStageModeLabel(args.repairContext.stageMode)}.`);
  lines.push(`- Investigator anchor: ${args.repairContext.investigatorName}.`);
  if (args.repairContext.culpritName) {
    lines.push(`- Culprit logic remains anchored to: ${args.repairContext.culpritName}.`);
  }
  if (requiredClues.length > 0) {
    lines.push(`- Preserve these required clue observations on-page: ${requiredClues.join("; ")}.`);
  }
  if (clearances.length > 0) {
    lines.push(`- Preserve suspect-clearance outcomes for: ${clearances.join(", ")}.`);
  }
  if (balanceBlock) {
    lines.push(balanceBlock);
  }
  if (balanceAssessment.hints.length > 0) {
    lines.push("SOFT BALANCE HINTS (ADVISORY ONLY)");
    for (const hint of balanceAssessment.hints.slice(0, 2)) {
      lines.push(`- ${hint}`);
    }
  }
  lines.push("");
  lines.push("OUTPUT RULES");
  lines.push("- Return full corrected JSON for exactly one chapter.");
  lines.push("- Keep the same title unless there is a minor punctuation or capitalization cleanup.");
  lines.push("- Prefer sentence-level or paragraph-local edits over rewrites of the whole chapter.");
  lines.push("- If a possible improvement would risk a logic change, keep the original wording instead.");
  return lines.join("\n");
};

export const polishPassingChapter = async (args: {
  chapter: ProseChapter;
  client: AzureOpenAIClient;
  repairContext: ChapterRepairContext;
  model?: string;
  runId?: string;
  projectId?: string;
  validateCandidate: (candidate: ProseChapter) => Promise<{ chapter: ProseChapter; hardErrors: string[] }> | { chapter: ProseChapter; hardErrors: string[] };
}): Promise<PostPassPolishResult> => {
  if (!Array.isArray(args.chapter?.paragraphs) || args.chapter.paragraphs.length === 0) {
    return { chapter: args.chapter, applied: false, keptPolishedVersion: false };
  }

  const response = await args.client.chat({
    messages: [
      {
        role: "system",
        content: "Polish prose without changing story facts, logic, clue obligations, or chapter structure.",
      },
      {
        role: "user",
        content: `${buildPostPassPolishPrompt({
          chapter: args.chapter,
          repairContext: args.repairContext,
        })}\n\nSOURCE CHAPTER JSON\n${JSON.stringify({
          status: "draft",
          chapters: [args.chapter],
        }, null, 2)}`,
      },
    ],
    model: args.model,
    temperature: 0.2,
    maxTokens: 5000,
    jsonMode: true,
    logContext: {
      runId: args.runId ?? "",
      projectId: args.projectId ?? "",
      agent: `Agent9-PostPassPolish-Ch${args.repairContext.chapterNumber}`,
      retryAttempt: 1,
    },
  });

  let candidate: ProseChapter;
  try {
    const parsed = parseProseResponse(response.content);
    candidate = parsed.chapters?.[0];
  } catch {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  if (!candidate || !Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  const validated = await args.validateCandidate(candidate);
  if (validated.hardErrors.length > 0) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "validation_regression",
    };
  }

  if (hasPolishRegression({
    original: args.chapter,
    polished: validated.chapter,
    repairContext: args.repairContext,
  })) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "obligation_regression",
    };
  }

  const originalText = JSON.stringify(args.chapter);
  const polishedText = JSON.stringify(validated.chapter);
  if (originalText === polishedText) {
    return {
      chapter: args.chapter,
      applied: true,
      keptPolishedVersion: false,
      rollbackReason: "quality_no_gain",
    };
  }

  return {
    chapter: validated.chapter,
    applied: true,
    keptPolishedVersion: true,
  };
};
