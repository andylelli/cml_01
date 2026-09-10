/**
 * ── A_86 item 5 — ONE json-store writer, used by every path that runs outside the API ───────────
 *
 * WHY THIS FILE EXISTS. `resume-run.ts` ended with a standing apology:
 *
 *   > regenerated stages were not written back to data/store.json (the API owns that writer).
 *   > A second failure would resume from the same point as this run, not from where it reached.
 *
 * That was true of the API and false of the pipeline: `scripts/canary-core.mjs` has persisted
 * artifacts from outside the API since REVIEW_03 item 7, with its own inline copy of the writer. So
 * the choice was never "one writer or two" — it was already two, and the resume path was the one
 * that went without.
 *
 * MEASURED, 2026-09-08: run 24901 died at Agent 3 (network), was resumed, and the resume's own
 * regenerated stages were then unpersisted — so the story cost £0.45 + £1.15, and had the resume
 * also failed it would have restarted from the same point a third time.
 *
 * This module is that writer, once. `canary-core.mjs` now imports it instead of carrying its copy,
 * so the count of bodies goes DOWN while the resume path gains the capability (the
 * one-concept-several-bodies trap the resume docblock was rightly worried about, resolved in the
 * direction that removes a body).
 *
 * SAFE BY CONSTRUCTION for resume: `loadResumeBundle` reads through `latestArtifact`, so a second
 * copy of a stage is the one that wins — which is exactly what a regenerated stage should do.
 * Failures are swallowed: persistence must never abort a run that is otherwise fine.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface JsonArtifactPersisterOptions {
  workspaceRoot: string;
  projectId: string;
  /** Overrides `CML_JSON_DB_PATH` and the default `<workspaceRoot>/data/store.json`. */
  dbPath?: string;
  /** Defaults to `console.log`; tests pass a collector. */
  onError?: (type: string, message: string) => void;
}

export const resolveJsonStorePath = (workspaceRoot: string, dbPath?: string): string =>
  dbPath || process.env.CML_JSON_DB_PATH || join(workspaceRoot, "data", "store.json");

/**
 * Returns the `onArtifact` callback `generateMystery` expects: `(type, payload) => Promise<void>`.
 */
export const makeJsonArtifactPersister = (
  options: JsonArtifactPersisterOptions,
): ((type: string, payload: unknown) => Promise<void>) => {
  const report =
    options.onError ??
    ((type: string, message: string) => console.log("ARTIFACT_PERSIST_FAILED", type, message));

  return async (type: string, payload: unknown): Promise<void> => {
    try {
      const dbPath = resolveJsonStorePath(options.workspaceRoot, options.dbPath);
      mkdirSync(dirname(dbPath), { recursive: true });
      const store: Record<string, unknown> = existsSync(dbPath)
        ? JSON.parse(readFileSync(dbPath, "utf8"))
        : {};
      const artifacts = Array.isArray(store.artifacts) ? (store.artifacts as unknown[]) : [];
      artifacts.push({
        id: `${options.projectId}_${type}_${artifacts.length}`,
        projectId: options.projectId,
        type,
        payload,
        createdAt: new Date().toISOString(),
      });
      store.artifacts = artifacts;
      writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf8");
    } catch (error) {
      report(type, String((error as { message?: string })?.message ?? error));
    }
  };
};
