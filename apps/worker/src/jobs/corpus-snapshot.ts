import fs from "node:fs";
import path from "node:path";

/**
 * A_67 FIX-3 — best-effort per-run corpus snapshot.
 *
 * The live JSON-file store (data/store.json) retains only the LATEST project, so the coverage harnesses
 * (scripts/reveal-cites-plants-coverage.mjs — the plant→payoff measure — and scripts/agent5-derive-
 * coverage.mjs) have no corpus to aggregate over time. When `CORPUS_SNAPSHOT_DIR` is set, each completed
 * run writes a store-shaped snapshot of its cml / clues / outline / prose there, so:
 *
 *   node scripts/reveal-cites-plants-coverage.mjs <dir>/*.json
 *
 * prices the reveal-citation gap across the accumulated corpus. The snapshot shape mirrors the store
 * exactly — `{ artifacts: [{ type, projectId, payload }] }` — so the existing scripts read it unchanged.
 *
 * Pure, synchronous, and defensive: returns the written path or null; never throws into the caller
 * (the orchestrator also wraps the call). Gated entirely by the env var — a no-op when it is unset.
 */
export function writeCorpusSnapshot(args: {
  dir: string | undefined;
  projectId: string | undefined;
  runId: string;
  cml: unknown;
  clues: unknown;
  outline: unknown;
  prose: unknown;
}): string | null {
  const { dir, projectId, runId, cml, clues, outline, prose } = args;
  if (!dir || !projectId || !cml || !clues || !outline || !prose) return null;
  try {
    const artifacts = [
      { type: "cml", projectId, payload: cml },
      { type: "clues", projectId, payload: clues },
      { type: "outline", projectId, payload: outline },
      { type: "prose", projectId, payload: prose },
    ];
    fs.mkdirSync(dir, { recursive: true });
    const safe = (s: string): string => String(s).replace(/[^a-zA-Z0-9._-]/g, "_");
    const file = path.join(dir, `${safe(runId)}__${safe(projectId)}.json`);
    fs.writeFileSync(file, JSON.stringify({ artifacts }), "utf8");
    return file;
  } catch {
    return null; // best-effort: never affect the run
  }
}
