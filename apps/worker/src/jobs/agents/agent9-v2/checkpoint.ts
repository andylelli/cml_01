/**
 * PROSE ENGINE v2 — THE CHECKPOINT (ANALYSIS_99 §10.11).
 *
 * Every accepted segment is written to disk before the next one is asked for. The reason is the most
 * expensive loss this project has had: run 95041 wrote ten chapters and 13,928 words and saved
 * nothing, because the manuscript existed only in memory when validation refused it.
 *
 * It also stores EVERY draft and its instrument vector, not just the chosen one. That is what makes
 * the selector arguable later: a read of a v2 book can be paired with the drafts it beat, and the
 * question "would the reader have picked the same one?" becomes answerable for £0 instead of being
 * an article of faith about a weighting.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import type { Draft, DraftScore, EditOutcome, Finding, ProseChapterLike, SegmentPlan } from "@cml/prose-engine";

export interface V2Checkpoint {
  engine: "v2";
  projectId: string;
  runId: string;
  contractHash: string;
  plan?: SegmentPlan;
  segments: Array<{
    index: number;
    chapters: number[];
    drafts: Array<{ attempt: number; chapters: ProseChapterLike[]; score: DraftScore }>;
    chosen: number | null;
  }>;
  chapters: ProseChapterLike[];
  findings?: { anchored: Finding[]; discarded: Finding[] };
  edits?: EditOutcome[];
  updatedAt: string;
}

export const emptyCheckpoint = (projectId: string, runId: string, contractHash: string): V2Checkpoint => ({
  engine: "v2",
  projectId,
  runId,
  contractHash,
  segments: [],
  chapters: [],
  updatedAt: new Date().toISOString(),
});

/** Never throws: a checkpoint that cannot be written is a warning, not a lost run. */
export const writeCheckpoint = (path: string, checkpoint: V2Checkpoint): boolean => {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify({ ...checkpoint, updatedAt: new Date().toISOString() }, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
};

/**
 * Read a checkpoint, and only accept it for the SAME contract. A resumed run whose upstream changed
 * is a different book, and continuing one into the other is the fixture-drift shape this project has
 * already paid for (`fixture-drift-certifies-the-bug`).
 */
export const readCheckpoint = (path: string, contractHash: string): V2Checkpoint | null => {
  try {
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8")) as V2Checkpoint;
    if (parsed?.engine !== "v2" || parsed.contractHash !== contractHash) return null;
    return parsed;
  } catch {
    return null;
  }
};

/** A cheap, stable identity for a contract: the chapters, the roles and the clue ownership. */
export const hashContract = (input: {
  chapters: number;
  reveal: number;
  aftermath: number | null;
  clueIds: ReadonlyArray<string>;
}): string => {
  const source = `${input.chapters}|${input.reveal}|${input.aftermath ?? "-"}|${[...input.clueIds].sort().join(",")}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return `v2_${(hash >>> 0).toString(16)}_${input.chapters}`;
};

export const recordSegment = (
  checkpoint: V2Checkpoint,
  segment: { index: number; chapters: number[] },
  drafts: Array<{ draft: Draft; score: DraftScore }>,
  chosenAttempt: number | null,
  accepted: ProseChapterLike[],
): V2Checkpoint => ({
  ...checkpoint,
  segments: [
    ...checkpoint.segments.filter((s) => s.index !== segment.index),
    {
      index: segment.index,
      chapters: segment.chapters,
      drafts: drafts.map((d) => ({ attempt: d.draft.attempt, chapters: d.draft.chapters, score: d.score })),
      chosen: chosenAttempt,
    },
  ].sort((a, b) => a.index - b.index),
  chapters: [...checkpoint.chapters, ...accepted],
});
