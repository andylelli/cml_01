/**
 * Run Logger
 *
 * Writes a single JSON file per run to apps/worker/logs/run_{YYYYMMDD}_{shortRunId}.json.
 * Updated incrementally — the file is flushed after every mutation so that if
 * the run crashes the last-known state is already on disk.
 *
 * Tracks: errors, warnings, per-chapter word counts, pipeline stage timeline.
 * Always active — not gated on ENABLE_SCORING.
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface RunLogChapter {
  chapter: number;
  words: number;
}

export interface RunLogStage {
  stage: string;
  message: string;
  completedAt: string;
}

export interface RunLogState {
  runId: string;
  projectId: string | undefined;
  startedAt: string;
  completedAt: string | null;
  status: "running" | "complete" | "failed";
  durationMs: number | null;
  stages: RunLogStage[];
  wordCounts: {
    chapters: RunLogChapter[];
    total: number;
  };
  warnings: string[];
  errors: string[];
}

export class RunLogger {
  private filePath: string;
  private state: RunLogState;

  private static formatRunLogFileName(runId: string): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    // Prefer compact ID in filename while keeping full runId in JSON payload.
    const normalizedId = String(runId).replace(/^run_/, "");
    const shortRunId = normalizedId.slice(0, 8) || "unknown";
    return `run_${date}_${shortRunId}.json`;
  }

  constructor(logsDir: string, runId: string, projectId: string | undefined) {
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    this.filePath = join(logsDir, RunLogger.formatRunLogFileName(runId));

    this.state = {
      runId,
      projectId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: "running",
      durationMs: null,
      stages: [],
      wordCounts: { chapters: [], total: 0 },
      warnings: [],
      errors: [],
    };

    this.flush();
  }

  /**
   * Called at every reportProgress() boundary. Snapshots the current stage,
   * message, and the full warnings/errors arrays collected so far.
   */
  logProgress(
    stage: string,
    message: string,
    warnings: string[],
    errors: string[]
  ): void {
    // Overwrite the entry for this stage if it already exists (e.g. re-entrant calls)
    const existing = this.state.stages.findIndex((s) => s.stage === stage);
    const entry: RunLogStage = {
      stage,
      message,
      completedAt: new Date().toISOString(),
    };
    if (existing >= 0) {
      this.state.stages[existing] = entry;
    } else {
      this.state.stages.push(entry);
    }

    // Snapshot warnings — deduplicate so repeated calls don't bloat the list
    for (const w of warnings) {
      if (!this.state.warnings.includes(w)) {
        this.state.warnings.push(w);
      }
    }
    for (const e of errors) {
      if (!this.state.errors.includes(e)) {
        this.state.errors.push(e);
      }
    }

    this.flush();
  }

  /**
   * Called from agent9 onBatchComplete to record word counts per committed chapter.
   */
  logChapterWords(chapterNumber: number, words: number): void {
    const existing = this.state.wordCounts.chapters.findIndex(
      (c) => c.chapter === chapterNumber
    );
    if (existing >= 0) {
      this.state.wordCounts.chapters[existing].words = words;
    } else {
      this.state.wordCounts.chapters.push({ chapter: chapterNumber, words });
    }
    this.state.wordCounts.total = this.state.wordCounts.chapters.reduce(
      (sum, c) => sum + c.words,
      0
    );
    this.flush();
  }

  /**
   * Call once when the pipeline finishes (success or failure).
   */
  logComplete(
    status: "complete" | "failed",
    durationMs: number,
    warnings: string[],
    errors: string[]
  ): void {
    this.state.status = status;
    this.state.completedAt = new Date().toISOString();
    this.state.durationMs = durationMs;

    for (const w of warnings) {
      if (!this.state.warnings.includes(w)) {
        this.state.warnings.push(w);
      }
    }
    for (const e of errors) {
      if (!this.state.errors.includes(e)) {
        this.state.errors.push(e);
      }
    }

    this.flush();
  }

  private flush(): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), "utf8");
    } catch {
      // Never let logging failure surface to the caller
    }
  }
}
