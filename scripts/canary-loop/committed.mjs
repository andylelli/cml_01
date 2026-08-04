/**
 * N5 (architecture/REVIEW_05.md §10.5, REVIEW_04 §11.3 C1) — WHICH ATTEMPT DID THE RUN KEEP?
 *
 * The prompt log records every attempt an agent made and marks none of them as the one that
 * shipped. Hydrating "the highest sequence" is a GUESS, and on `run_20260802-1654` it is the wrong
 * one: Agent 7 produced three outlines — 10 beats, 10 with a duplicated `revelation`, then 9 — and
 * the run committed the FIRST. A replay hydrated from the last hands the arm a 9-chapter outline
 * where the original had 10, which is one of the two variables a matched pair exists to hold fixed.
 *
 * This module resolves the question from what the run COMMITTED, in the order the evidence is
 * strongest:
 *
 *   1. THE ARTIFACT STORE. `data/store.json` is what the API's `onArtifact` callback wrote as each
 *      stage completed — the committed payload itself, no inference. Available whenever the run
 *      recorded a `projectId`.
 *
 *   2. THE SHIPPED MANUSCRIPT'S SHAPE. Runs before artifact persistence (`projectId: ""` — five of
 *      the thirteen archived runs, including 1654) have no store rows. But Agent 9's checkpoint
 *      records the chapters that were actually written, and those chapters come from the committed
 *      outline. Matching chapter count and titles identifies the attempt.
 *
 *   3. THE GUESS, said out loud. Highest sequence, with the ambiguity reported — which is all the
 *      previous version could do.
 *
 * MEASURED 2026-08-04: across the seven archived runs that have store rows, resolution (1) agrees
 * with the highest-sequence guess every time — so this changes nothing for modern runs and is not
 * a behaviour change dressed as a fix. It changes 1654-class runs, which is the entire point.
 */

import path from "path";
import { readFile } from "fs/promises";
import { parseAgentCode } from "./config.mjs";

/**
 * Agent code → the artifact name `onArtifact` writes.
 *
 * Agent 4 is deliberately absent: the revision stage has no artifact of its own, it rewrites `cml`
 * in place, so a store lookup for code "4" would hand the replay the POST-revision CML as if it
 * were the pre-revision input.
 */
export const COMMITTED_TYPE_BY_AGENT_CODE = {
  "1": "setting",
  "2": "cast",
  "2e": "background_context",
  "2b": "character_profiles",
  "2c": "location_profiles",
  "2d": "temporal_context",
  "3b": "hard_logic_devices",
  "3": "cml",
  "5": "clues",
  "6": "fair_play_report",
  "65": "world_document",
  "7": "outline",
  "75": "story_geometry",
  "9": "prose",
};

/**
 * Two artifacts are stored WRAPPED and consumed UNWRAPPED.
 *
 * The store holds `{setting: {...}, rawResponse, attempt, latencyMs, cost}` while the prompt-log
 * response body — the shape every consumer of this path expects — is the bare `{era, location, …}`.
 * Every other type is a superset of its response body (extra `cost`/`durationMs`/`status` keys that
 * consumers ignore), so only these two need touching. Verified key-by-key against run 08-04 1916.
 */
const UNWRAP_KEY_BY_TYPE = { setting: "setting", cast: "cast" };

export const unwrapCommitted = (type, payload) => {
  const key = UNWRAP_KEY_BY_TYPE[type];
  if (!key) return payload;
  const inner = payload && typeof payload === "object" ? payload[key] : undefined;
  return inner && typeof inner === "object" ? inner : payload;
};

/**
 * The committed payload for an agent, or null.
 *
 * The store reader is imported from the worker's `artifact-store.js` rather than reimplemented:
 * that module exists precisely because a second private copy of `loadStore`/`latestArtifact` is
 * this codebase's most expensive defect shape, and it carries the shape tolerance (`project_id` vs
 * `projectId`, `payload` vs `payload_json`, payloads stored as JSON strings) that 14 MB of history
 * needs. It is imported LAZILY so that this module — and the hydration path that depends on it —
 * stays usable when `apps/worker/dist` has not been built.
 */
let storeCache = null;

/**
 * The store is ~16 MB and a boundary replay asks about a dozen agents. Parsing it once per question
 * is the difference between milliseconds and seconds, so it is cached — keyed on the file's size
 * and mtime, because a canary loop is long-lived and a run that finishes mid-loop appends to it.
 */
async function loadStoreOnce(workspaceRoot) {
  const store = await import("../../apps/worker/dist/jobs/artifact-store.js");
  const { statSync } = await import("fs");
  const file = store.artifactStorePath(workspaceRoot);
  const stat = statSync(file);
  const key = `${file}:${stat.size}:${stat.mtimeMs}`;
  if (storeCache?.key !== key) {
    storeCache = { key, rows: store.loadArtifactStore(workspaceRoot), latestArtifact: store.latestArtifact };
  }
  return storeCache;
}

export async function loadCommittedArtifact({ workspaceRoot, projectId, agentCode }) {
  const type = COMMITTED_TYPE_BY_AGENT_CODE[agentCode];
  if (!type || !projectId) return null;
  try {
    const { rows, latestArtifact } = await loadStoreOnce(workspaceRoot);
    const payload = latestArtifact(rows, projectId, type);
    if (payload === undefined || payload === null) return null;
    return { type, payload: unwrapCommitted(type, payload) };
  } catch {
    // No store, no build, or no row — fall through to the next resolution. A replay that cannot
    // read the store must degrade to the guess it used to make, not fail.
    return null;
  }
}

const stripChapterPrefix = (title) =>
  String(title ?? "").replace(/^\s*chapter\s+\d+\s*[:.\-–—]\s*/i, "").trim();

/**
 * The shape of the manuscript the run actually shipped: how many chapters, and their titles.
 *
 * Read from Agent 9's checkpoint, which exists for every archived run including the ones that
 * predate artifact persistence. The chapters in it were written FROM the committed outline, so
 * their count and titles are downstream evidence of which outline that was.
 */
export async function committedManuscriptShape({ workspaceRoot, runId }) {
  if (!runId) return null;
  try {
    const file = path.join(workspaceRoot, "logs", `agent9-checkpoint-${runId}.json`);
    const parsed = JSON.parse(await readFile(file, "utf8"));
    const chapters = Array.isArray(parsed?.completedChapters) ? parsed.completedChapters : [];
    if (chapters.length === 0) return null;
    return {
      chapterCount: chapters.length,
      titles: chapters.map((c) => stripChapterPrefix(c?.title)),
    };
  } catch {
    return null;
  }
}

const outlineTitles = (outline) => {
  const acts = Array.isArray(outline?.acts) ? outline.acts : [];
  return acts.flatMap((act) => (Array.isArray(act?.scenes) ? act.scenes : [])).map((s) => String(s?.title ?? "").trim());
};

/**
 * Which candidate outline produced this manuscript?
 *
 * Chapter count filters first — it is the variable that actually corrupts a matched pair — and
 * positional title agreement breaks the remaining ties. On 1654 that is decisive rather than
 * marginal: attempt 18 agrees on 8 of 10 titles, attempt 19 on 2, and attempt 20 has the wrong
 * count altogether.
 *
 * TITLE AGREEMENT IS NOT EXPECTED TO BE PERFECT and must not be required to be: Agent 9 renames
 * chapters as it writes (1654's "Discovery" shipped as "The Frozen Clock"). A rule demanding an
 * exact match would reject the right attempt and fall back to the wrong one.
 */
export function chooseByManuscriptShape(candidates, shape) {
  if (!shape || !Array.isArray(candidates) || candidates.length === 0) return null;
  const sameCount = candidates.filter((c) => outlineTitles(c.outline).length === shape.chapterCount);
  if (sameCount.length === 0) return null;

  let best = null;
  for (const candidate of sameCount) {
    const titles = outlineTitles(candidate.outline);
    const agreement = titles.reduce(
      (n, title, i) => (title && title === shape.titles[i] ? n + 1 : n),
      0,
    );
    // Later attempts win ties: with no title evidence either way, the old rule is the fallback.
    if (!best || agreement > best.agreement || (agreement === best.agreement && candidate.sequence >= best.candidate.sequence)) {
      best = { candidate, agreement };
    }
  }
  return best ? { ...best, consideredCount: sameCount.length } : null;
}

export const reportHydrationSource = (agentCode, source, detail) => {
  console.log(`HYDRATION_SOURCE code=${agentCode} source=${source}${detail ? ` ${detail}` : ""}`);
};

/**
 * Which source answers for each agent, resolved ONCE per run.
 *
 * WHY THIS EXISTS SEPARATELY FROM `readLatestAgentJson`. The hydration bundle — the thing the run
 * report prints — used to name the highest-sequence file while the replay read whatever
 * `readLatestAgentJson` chose. Left alone, N5 would have made those two disagree: the report
 * naming attempt 20 while the run used attempt 18. That is the same defect class as a detector
 * reading a path the data never travelled, and it would have been introduced BY a fix for
 * mis-hydration. Both now consume this map.
 */
export async function resolveCommittedSelection({ workspaceRoot, runState, runFolder, readResponseJson }) {
  const records = Array.isArray(runState?.records) ? runState.records : [];
  const projectId = runState?.projectId;
  const runId = runState?.runId;
  const selection = {};
  if (records.length === 0) return selection;

  const byCode = new Map();
  for (const record of records) {
    const code = parseAgentCode(record?.agent);
    if (!code) continue;
    if (!byCode.has(code)) byCode.set(code, []);
    byCode.get(code).push(record);
  }

  /**
   * Agents with a committed artifact but NO prompt record must still be resolved. Agent 7.5 is
   * deterministic — it makes no LLM call, so it appears nowhere in the prompt log — and a
   * record-driven loop would report its artifact as missing on a run that persisted it.
   */
  for (const code of Object.keys(COMMITTED_TYPE_BY_AGENT_CODE)) {
    if (!byCode.has(code)) byCode.set(code, []);
  }

  let shape;
  for (const [code, all] of byCode) {
    const matches = [...all].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    const latest = matches[matches.length - 1];

    const committed = await loadCommittedArtifact({ workspaceRoot, projectId, agentCode: code });
    if (committed) {
      selection[code] = { source: "committed_artifact", committedType: committed.type, responseFile: null };
      continue;
    }

    if (code === "7" && matches.length > 1 && typeof readResponseJson === "function") {
      if (shape === undefined) shape = await committedManuscriptShape({ workspaceRoot, runId });
      const candidates = [];
      for (const record of matches) {
        if (!record.responseFile) continue;
        try {
          candidates.push({
            sequence: record.sequence ?? 0,
            responseFile: record.responseFile,
            outline: await readResponseJson(path.join(runFolder, record.responseFile)),
          });
        } catch {
          // Unparseable candidates cannot be the one that shipped.
        }
      }
      const chosen = chooseByManuscriptShape(candidates, shape);
      if (chosen) {
        selection[code] = {
          source: "committed_manuscript_shape",
          responseFile: chosen.candidate.responseFile,
          titlesAgreeing: chosen.agreement,
          chapterCount: shape?.chapterCount,
        };
        continue;
      }
    }

    if (matches.length === 0) continue; // no artifact, no records — genuinely absent from this run

    selection[code] = {
      source: matches.length > 1 ? "highest_sequence_guess" : "single_attempt",
      responseFile: latest?.responseFile ?? null,
    };
  }

  return selection;
}
