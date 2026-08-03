/**
 * R5 (architecture/REVIEW_01.md) — the ONE reader for the file-backed artifact store.
 *
 * `data/store.json` is the durable record of every artifact a run produced: the API's `onArtifact`
 * callback writes into it as each stage completes, so it is already the checkpoint substrate that
 * durable execution needs. What it lacked was a read path anyone but the API could use.
 *
 * WHY THIS IS A MODULE AND NOT A COPY-PASTE. `agent9-replay.ts` already carried a private
 * `loadStore` / `latestArtifact` pair. Adding a second private copy for production resume would
 * reproduce this codebase's most expensive defect shape — one concept with several bodies, where a
 * fix lands on one and the others carry on being wrong. Both consumers now import from here.
 *
 * Shape tolerance is deliberate and load-bearing: the store has been written by more than one
 * generation of the repository layer, so entries appear as `project_id`/`projectId`,
 * `artifact_type`/`type`, and `payload`/`payload_json` (the latter sometimes as a JSON *string*).
 * Normalising on read is cheaper than migrating 14 MB of history, and a reader that understood only
 * today's spelling would silently find nothing rather than fail — the exact silent-miss class
 * REVIEW §2.4 is about.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** One row as it may appear in `data/store.json`, across every spelling the file has used. */
export interface StoreArtifact {
  id?: string;
  projectId?: string;
  project_id?: string;
  type?: string;
  artifact_type?: string;
  payload?: unknown;
  payload_json?: unknown;
  created_at?: string;
  createdAt?: string;
}

/**
 * Where the artifact store actually lives.
 *
 * FOUND BY THE RESUME DRILL (REVIEW_03 item 7, 2026-08-02). This resolved
 * `<workspaceRoot>/data/store.json` unconditionally and ignored `CML_JSON_DB_PATH` — the variable
 * `.env.local` sets, and whose comment there says it exists "so the API uses the same store
 * regardless of which working directory it is launched from."
 *
 * So the API wrote to the configured store while `resume-run` read the default one. They happen to
 * be the same file today, which is why nothing had noticed. Point the config anywhere else and
 * resume reads an unrelated store, finds no artifacts, and re-runs the whole pipeline at full cost —
 * looking exactly like "the artifacts were never persisted", which is the misdiagnosis this module's
 * own comment warns about two lines below.
 *
 * The drill was run against a copy of the store with the prose artifact removed; resume reported
 * prose RESTORED, because it had never opened the copy.
 */
export const artifactStorePath = (workspaceRoot: string): string => {
  const configured = (process.env.CML_JSON_DB_PATH ?? "").trim();
  return configured.length > 0 ? configured : join(workspaceRoot, "data", "store.json");
};

/**
 * Read every artifact row. Throws when the store is absent or malformed — a resume built on an
 * empty read would look like "nothing to restore" and quietly re-run the whole pipeline at full
 * cost, which is precisely the outcome resume exists to prevent.
 */
export function loadArtifactStore(workspaceRoot: string): StoreArtifact[] {
  const path = artifactStorePath(workspaceRoot);
  if (!existsSync(path)) throw new Error(`Artifact store not found at ${path}`);
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  const rows = parsed.artifacts ?? parsed.artifact_versions;
  if (!Array.isArray(rows)) throw new Error(`No 'artifacts' array in ${path}`);
  return rows as StoreArtifact[];
}

const rowProjectId = (row: StoreArtifact): string | undefined => row.project_id ?? row.projectId;
const rowType = (row: StoreArtifact): string | undefined => row.artifact_type ?? row.type;

const rowPayload = (row: StoreArtifact): unknown => {
  const raw = row.payload !== undefined ? row.payload : row.payload_json;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw; // genuinely a string payload; leave it alone
    }
  }
  return raw;
};

/**
 * Latest payload for (projectId, type).
 *
 * The store carries no version column, so "latest" means LAST WINS BY ARRAY ORDER — the same rule
 * the replay bench has always used, and the same rule the append-only writer produces. Stated here
 * rather than left implicit because it is the kind of assumption that reads as arbitrary later.
 */
export function latestArtifact(
  store: StoreArtifact[],
  projectId: string,
  type: string,
): unknown {
  let found: unknown;
  for (const row of store) {
    if (rowProjectId(row) !== projectId) continue;
    if (rowType(row) !== type) continue;
    found = rowPayload(row);
  }
  return found;
}

/** Project ids that have at least one artifact of `type`. Used to discover replayable runs. */
export function projectIdsWithArtifact(store: StoreArtifact[], type: string): string[] {
  const seen = new Set<string>();
  for (const row of store) {
    if (rowType(row) !== type) continue;
    const pid = rowProjectId(row);
    if (pid) seen.add(pid);
  }
  return [...seen];
}

/**
 * The generation spec a project was created from — theme, era, cast size, tone.
 *
 * Resume and replay both need it: the orchestrator's inputs are derived from the spec, and a resumed
 * run that invented a different theme would be a different story wearing the dead run's artifacts.
 * Falls back to the last spec in the file when the project has none, matching the replay bench's
 * long-standing behaviour rather than introducing a second rule.
 */
export function loadProjectSpec(workspaceRoot: string, projectId: string): Record<string, unknown> {
  const parsed = JSON.parse(readFileSync(artifactStorePath(workspaceRoot), "utf8"));
  const specs = Array.isArray(parsed.specs) ? parsed.specs : Object.values(parsed.specs ?? {});
  const mine = (specs as any[]).filter((s) => s && (s.project_id ?? s.projectId) === projectId);
  const rec = mine[mine.length - 1] ?? (specs as any[])[(specs as any[]).length - 1];
  return (rec?.spec ?? rec ?? {}) as Record<string, unknown>;
}

/** Every artifact type present for a project, in first-seen order. Used by resume diagnostics. */
export function artifactTypesForProject(store: StoreArtifact[], projectId: string): string[] {
  const seen = new Set<string>();
  for (const row of store) {
    if (rowProjectId(row) !== projectId) continue;
    const type = rowType(row);
    if (type) seen.add(type);
  }
  return [...seen];
}
