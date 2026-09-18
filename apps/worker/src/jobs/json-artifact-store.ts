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

import { rowPayload, rowProjectId, rowType, type StoreArtifact } from "./artifact-store.js";

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
 * Does this payload carry no content?
 *
 * Judged only on the shapes this store actually holds — a bare array, or an object whose
 * `chapters` / `acts` / `clues` array IS the content. Anything else returns false: "I cannot tell"
 * has to read as "not empty", or the guard below would start dropping real work.
 */
export const isEmptyArtifactPayload = (payload: unknown): boolean => {
  if (Array.isArray(payload)) return payload.length === 0;
  if (!payload || typeof payload !== "object") return false;
  const record = payload as Record<string, unknown>;
  for (const key of ["chapters", "acts", "clues"]) {
    const value = record[key];
    if (Array.isArray(value)) return value.length === 0;
  }
  return false;
};

/**
 * ── WHY AN EMPTY ARTIFACT IS NOT APPENDED OVER A FULL ONE ───────────────────────────────────────
 *
 * Every reader of this store takes the LAST row for a project and type (`latestArtifact`), so an
 * appended empty row is a silent delete of the run it lands on top of.
 *
 * MEASURED, 2026-09-18: two `PROSE_V2_DRY=1` dry runs — which make no LLM call and are documented
 * as costing nothing — appended two 0-chapter `prose` rows over seed 50862's 10-chapter book, and
 * the store then reported that project as having no prose. The same shape is reachable without any
 * flag: a run that dies inside Agent 9 persists what it has, which is nothing.
 *
 * The guard is on the DATA, not on the flag that exposed it. A first empty artifact still writes —
 * only an empty one landing on a non-empty one of the same type is refused, and it is reported
 * rather than swallowed.
 */
const wouldEraseContent = (
  artifacts: readonly unknown[],
  projectId: string,
  type: string,
  payload: unknown,
): boolean => {
  if (!isEmptyArtifactPayload(payload)) return false;
  return artifacts.some((row) => {
    const artifact = row as StoreArtifact;
    if (rowProjectId(artifact) !== projectId || rowType(artifact) !== type) return false;
    return !isEmptyArtifactPayload(rowPayload(artifact));
  });
};

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
      if (wouldEraseContent(artifacts, options.projectId, type, payload)) {
        report(
          type,
          `refused to append an empty '${type}' over the non-empty one already stored for ` +
            `${options.projectId} — every reader takes the last row, so this would have erased it`,
        );
        return;
      }
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
