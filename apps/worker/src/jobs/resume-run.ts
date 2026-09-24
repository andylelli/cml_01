/**
 * R5 (architecture/REVIEW_01.md) — resume CLI. The operator-facing end of durable execution.
 *
 * A run that dies at Agent 9 has already produced thirteen stages of artifacts and spent ~£1.40 of
 * its ~£1.50. Today the only recovery is to start again from stage 1. This entry point restores what
 * the dead run persisted and continues from the first stage that is missing.
 *
 * WHY A CLI AND NOT AN API ROUTE. The failures this exists for — a hung socket, a Windows process
 * abort, a laptop entering standby — kill the API process too. The recovery tool has to be something
 * an operator can run afterwards from a shell, against the artifacts on disk. The orchestrator input
 * (`resumeArtifacts`) is generic, so an API route can be added later without touching the pipeline.
 *
 * Usage (from repo root, after `npm run build:all`):
 *   node --use-system-ca apps/worker/dist/jobs/resume-run.js <projectId> [originalRunId]
 *
 * Env:
 *   RESUME_DRY=1              load + report what would be skipped, then exit before any LLM call
 *   RESUME_IGNORE_BUILD=1     proceed despite a build-fingerprint mismatch (records why in warnings)
 *   RESUME_REDO=<artifact>    DELIBERATELY re-run a stage that DID survive, plus everything after it
 *   CML_WORKSPACE_ROOT        override workspace root (default: process.cwd())
 *
 * A_75 P1v — `RESUME_REDO` is what makes a MATCHED PAIR executable. A_74 §6.1 measured that no judge
 * model resolves a gap under ~7 marks here, so the only instrument that resolves a single mark is a
 * human reading two books that differ in exactly one thing. Two fresh runs give two different books;
 * this re-runs ONE stage against byte-identical persisted upstream:
 *
 *   RESUME_REDO=prose AGENT9_VOICE_SPEC=false node ... resume-run.js <projectId> <runId>   # arm A
 *   RESUME_REDO=prose AGENT9_VOICE_SPEC=true  node ... resume-run.js <projectId> <runId>   # arm B
 *
 * Same case, same cast, same clues, same outline, same geometry contract — one flag apart.
 */

import { join } from "node:path";

import { generateMystery, type MysteryGenerationInputs } from "./mystery-orchestrator.js";
import { loadArtifactStore, resolveProjectSpec, specToInputs } from "./artifact-store.js";
import { makeJsonArtifactPersister } from "./json-artifact-store.js";
import { buildClient, loadEnvFiles } from "./cli-runtime.js";
import {
  checkBuildFingerprint,
  computeBuildFingerprint,
  dropFromArtifact,
  loadResumeBundle,
  readRunFingerprint,
  RESUME_ARTIFACT_NAMES,
  RESUME_FIELD_BY_ARTIFACT,
  type ResumeArtifactName,
} from "./resume-hydration.js";
import { saveReadableStory, storyFolderName } from "./story-output.js";

/**
 * Enough of the pipeline to be worth resuming. Below `cml` there is nothing expensive to preserve —
 * agents 1–3 are a small fraction of run cost — and resuming from a sliver invites the subtler
 * failure of a run that is neither fresh nor faithful.
 */
const MINIMUM_USEFUL_ARTIFACT: ResumeArtifactName = "cml";

async function main(): Promise<void> {
  const projectId = process.argv[2];
  const originalRunId = (process.argv[3] || "").trim();
  if (!projectId) {
    console.error("Usage: node --use-system-ca apps/worker/dist/jobs/resume-run.js <projectId> [originalRunId]");
    process.exit(1);
    return;
  }

  const workspaceRoot = process.env.CML_WORKSPACE_ROOT || process.cwd();
  const workerAppRoot = join(workspaceRoot, "apps", "worker");
  const dry = process.env.RESUME_DRY === "1";
  loadEnvFiles(workspaceRoot);

  console.log(`[resume-run] project    : ${projectId}`);
  console.log(`[resume-run] workspace  : ${workspaceRoot}`);
  console.log(`[resume-run] mode       : ${dry ? "DRY (no LLM)" : "LIVE"}`);

  // ── what survived ──────────────────────────────────────────────────────────
  const store = loadArtifactStore(workspaceRoot);

  // A_75 P1v — the matched-pair affordance. Validated against the real artifact list rather than
  // trusted: a typo'd stage name would otherwise resume normally and silently produce a second copy
  // of the first arm, which is the worst possible outcome for a paired experiment (two identical
  // books read as evidence that the lever does nothing).
  const redoRaw = (process.env.RESUME_REDO || "").trim();
  const redoFrom = redoRaw ? (redoRaw as ResumeArtifactName) : null;
  if (redoFrom && !RESUME_ARTIFACT_NAMES.includes(redoFrom)) {
    console.error(
      `[resume-run] REFUSING: RESUME_REDO='${redoRaw}' is not a stage.
` +
        `             Valid: ${RESUME_ARTIFACT_NAMES.join(", ")}`,
    );
    process.exit(4);
    return;
  }

  const { bundle, found, missing } = loadResumeBundle(store, projectId, redoFrom);
  if (redoFrom) {
    const { drop } = dropFromArtifact(redoFrom);
    console.log(
      `[resume-run] REDO       : discarding '${redoFrom}' and ${drop.size - 1} downstream stage(s) ` +
        `that DID survive — [${[...drop].join(", ")}]`,
    );
  }

  console.log(`[resume-run] restored   : ${found.join(", ") || "(nothing)"}`);
  console.log(`[resume-run] will re-run: ${missing.join(", ") || "(nothing — run already complete)"}`);

  if (!found.includes(MINIMUM_USEFUL_ARTIFACT)) {
    console.error(
      `[resume-run] REFUSING: no '${MINIMUM_USEFUL_ARTIFACT}' artifact for this project. There is not enough ` +
        `upstream work to be worth resuming — start a fresh run instead.`,
    );
    process.exit(2);
    return;
  }
  if (missing.length === 0) {
    console.error(
      `[resume-run] REFUSING: every stage already has an artifact. Nothing to resume.
` +
        `             To re-run a completed stage deliberately (a matched pair), set ` +
        `RESUME_REDO=<stage>, e.g. RESUME_REDO=prose.`,
    );
    process.exit(2);
    return;
  }

  // ── did the code change underneath the artifacts? ──────────────────────────
  // `probe-validity-process-start-vs-dist-build` with the evidence destroyed: a rebuild between the
  // crash and the resume produces a story that is half one build and half another, and no artifact
  // records the mix. Loud refusal, with an explicit override for the operator who knows better.
  const currentFingerprint = computeBuildFingerprint(workspaceRoot);
  const recordedFingerprint = originalRunId ? readRunFingerprint(workerAppRoot, originalRunId) : null;
  const verdict = checkBuildFingerprint(recordedFingerprint, currentFingerprint);
  console.log(`[resume-run] build      : ${verdict.reason} — ${verdict.detail}`);
  if (!verdict.ok && process.env.RESUME_IGNORE_BUILD !== "1") {
    console.error(
      `[resume-run] REFUSING: ${verdict.detail}.\n` +
        `             Resume with the build that produced the artifacts, or set RESUME_IGNORE_BUILD=1 ` +
        `to accept a mixed-generation run (and say so in the ledger).`,
    );
    process.exit(3);
    return;
  }
  if (!originalRunId) {
    console.log(`[resume-run] note       : no originalRunId given, so the build check could not run.`);
  }

  // ── inputs: the dead run's spec, not a new one ─────────────────────────────
  //
  // A resume exists to hold everything upstream byte-identical while ONE stage runs again. Inputs the
  // stage reads — era, tone, axis, humour band, target length — are part of "everything upstream", so
  // a resume that cannot find this project's spec has no business inventing one. It used to: the
  // reader fell back to the last spec in the file, and canary projects (which persist artifacts but
  // no spec) all landed on an unrelated project's parameters. That is now `source: "none"` and a
  // refusal, because the run would otherwise have completed, looked fine, and measured nothing.
  const resolved = resolveProjectSpec(workspaceRoot, projectId);
  console.log(`[resume-run] spec       : ${resolved.source} — ${resolved.detail}`);
  if (resolved.source === "none" && process.env.RESUME_ALLOW_NO_SPEC !== "1") {
    console.error(
      `[resume-run] REFUSING: ${resolved.detail}.\n` +
        `             The stage would run on default inputs — a different book wearing these ` +
        `artifacts.\n` +
        `             Set RESUME_ALLOW_NO_SPEC=1 to accept defaults, and say so in the ledger.`,
    );
    process.exit(4);
    return;
  }
  const spec = specToInputs(resolved.spec);
  /**
   * A spec that EXISTS but is missing the fields the resumed stage reads.
   *
   * The refusal above catches "no spec at all". It does not catch a sidecar that was written before
   * a parameter existed — and most archived canary sidecars record `targetLength` and `primaryAxis`
   * and nothing else. `humourLevel` is the one that matters most and is missing most often: it sets
   * the wit band, which decides which chapters carry a wit beat and what rate the contract asks for.
   * A resume that defaults it writes to a DIFFERENT contract than the run being compared against,
   * and the comparison quietly stops being a matched pair.
   *
   * Not a refusal — a stated default is a usable run, an unstated one is not. This prints what is
   * falling back so the run reports its own limits, and the ledger entry can say so.
   */
  const READ_BY_AGENT_9 = ["humourLevel", "targetLength", "primaryAxis", "tone", "narrativeStyle", "eraPreference"] as const;
  const defaulted = READ_BY_AGENT_9.filter((k) => spec[k] === undefined || spec[k] === null || spec[k] === "");
  if (defaulted.length > 0) {
    console.log(
      `[resume-run] DEFAULTS   : ${defaulted.join(", ")} are not recorded for this project and fall ` +
        `back. This run is NOT a controlled matched pair on those parameters — say so in the ledger.`,
    );
  }
  const runId = `resume-${Date.now()}`;
  const redoChapter = Number(process.env.AGENT9_REDO_CHAPTER ?? "") || 0;
  const inputs: MysteryGenerationInputs = {
    ...(spec as Partial<MysteryGenerationInputs>),
    theme: (spec.theme as string) || "A classic murder mystery",
    targetLength: ((spec.targetLength as "short" | "medium" | "long") ?? "medium"),
    narrativeStyle: ((spec.narrativeStyle as "classic" | "modern" | "atmospheric") ?? "classic"),
    runId,
    projectId,
    resumeFromRunId: originalRunId || projectId,
    resumeArtifacts: bundle,
    // A_106 — ONE-CHAPTER REDO. With AGENT9_REDO_CHAPTER=N, the run is handed the project's Agent 9
    // checkpoint (the resume never passed one, so a resumed prose stage always started from scratch);
    // generate.ts then keeps chapters 1..N-1 and N+1..end and writes N again.
    ...(redoChapter
      ? {
          agent9CheckpointPath: join(workspaceRoot, "apps", "worker", "logs", `agent9-checkpoint-${projectId}.json`),
          resumeAgent9FromCheckpoint: true,
        }
      : {}),
  };
  if (redoChapter) {
    console.log(`[resume-run] REDO CHAPTER: ${redoChapter} — chapters before it stand, chapters after it are kept from the checkpoint, only chapter ${redoChapter} is written again.`);
  }

  if (dry) {
    console.log(
      `[resume-run] DRY: would skip ${found.map((n) => RESUME_FIELD_BY_ARTIFACT[n]).join(", ")} ` +
        `and start at '${missing[0]}'. Exiting before any LLM call.`,
    );
    return;
  }

  // ── run ────────────────────────────────────────────────────────────────────
  const client = buildClient(workspaceRoot);
  const startedAt = Date.now();
  console.log(`[resume-run] runId      : ${runId}`);
  console.log(
    `[resume-run] inputs     : axis=${inputs.primaryAxis ?? "-"} era=${inputs.eraPreference ?? "-"} ` +
      `location=${inputs.locationPreset ?? "-"} tone=${inputs.tone ?? "-"} length=${inputs.targetLength} ` +
      `detective=${inputs.detectiveType ?? "-"} style=${inputs.narrativeStyle} humour=${inputs.humourLevel ?? "-"} ` +
      `cast=${inputs.castSize ?? "-"}`,
  );
  console.log(`[resume-run] angle      : ${inputs.storyAngle ?? "(none)"}`);
  console.log(`[resume-run] resuming ...`);

  /**
    * A_86 item 5 — persist what this run regenerates.
    *
    * The note that used to close this file said the API owns the store writer. That was true of the
    * API and false of the pipeline: `scripts/canary-core.mjs` has written artifacts from outside the
    * API since REVIEW_03 item 7. Both now share ONE writer (`json-artifact-store.ts`), so this path
    * gains the capability while the number of writer bodies goes down.
    *
    * MEASURED: run 24901 died at Agent 3, was resumed, and the resume's own stages were unpersisted
    * — £0.45 + £1.15 for one story, and a second failure would have restarted from the same point.
    * `loadResumeBundle` reads through `latestArtifact`, so these newer copies are the ones a later
    * resume restores.
    */
  const persistArtifact = makeJsonArtifactPersister({
    workspaceRoot,
    projectId,
    onError: (type, message) =>
      console.log(`[resume-run] artifact persist failed (${type}): ${message}`),
  });

  const result = await generateMystery(
    client,
    inputs,
    (progress) => {
      console.log(`[resume-run]   ${progress.percentage}% ${progress.message}`);
    },
    persistArtifact,
  );

  /**
   * ── THE STAGE'S OWN TELEMETRY, ON THE PATH THAT MEASURES IT ───────────────────────────────────
   *
   * Agent 9 v2 reports itself through `ctx.warnings` — chapters written, the draft table, the
   * selector's numbers, the gate's verdict. The canary path prints those as a `WARNINGS` line; THIS
   * path printed nothing, so the engine's whole instrument panel was invisible on the one path the
   * design names for matched pairs.
   *
   * MEASURED 2026-09-18: the first paid v2 run shipped a 2-of-10-chapter book, and its telemetry
   * said so in a line nobody saw. The numbers had to be recovered afterwards from the prompt ledger
   * and the stored artifact. A run that cannot report itself is a run that has to be re-read.
   *
   * Errors print too, and the chapter count prints LAST, because a rate means nothing until you know
   * how much book it was measured over.
   */
  /**
   * The block is `[Agent 9 v2] …` lines PLUS the indented rows that belong to them — the per-draft
   * table is emitted as `  * draft 1: composite …`, with no prefix of its own.
   *
   * MEASURED 2026-09-19, `resume-1789846757984`: the first run with three drafts printed
   * `segment 0 drafts:` and then nothing, because this filter kept only prefixed lines. The run was
   * bought to see the spread between drafts, and the spread was the one thing it did not print. The
   * numbers were recovered from the checkpoint afterwards; they should not have needed recovering.
   */
  const v2Lines: string[] = [];
  let inBlock = false;
  for (const raw of result.warnings ?? []) {
    const line = String(raw);
    if (/^\[Agent 9 v2\]/.test(line)) {
      inBlock = true;
      v2Lines.push(line);
      continue;
    }
    if (inBlock && /^\s/.test(line)) {
      v2Lines.push(line);
      continue;
    }
    inBlock = false;
  }
  if (v2Lines.length > 0) {
    console.log(`[resume-run] ── Agent 9 v2 ──`);
    for (const line of v2Lines) console.log(`  ${line.replace(/^\[Agent 9 v2\] /, "")}`);
  }
  for (const error of result.errors ?? []) console.log(`[resume-run] ERROR      : ${error}`);

  const storyDir = join(workspaceRoot, "stories", storyFolderName(new Date()));
  const { filePath } = saveReadableStory(result.prose, runId, storyDir, `Resumed ${runId}`);
  const chapters = Array.isArray((result.prose as { chapters?: unknown[] })?.chapters)
    ? (result.prose as { chapters: unknown[] }).chapters.length
    : 0;
  const words = String((result.prose as { chapters?: Array<{ paragraphs?: string[]; content?: string }> })?.chapters
    ?.map((c) => (c.paragraphs ?? []).join(" ") || c.content || "")
    .join(" ") ?? "")
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(`[resume-run] manuscript : ${chapters} chapter(s), ${words} words`);
  const mins = ((Date.now() - startedAt) / 60000).toFixed(1);
  console.log(`[resume-run] story      : ${filePath}`);
  console.log(`[resume-run] DONE in ${mins} min — skipped ${found.length} stage(s) that had survived.`);

  // A_86 item 5 — this run IS now resumable: every stage it regenerated was persisted through the
  // shared json-store writer as it completed. The historical limitation, and why it existed, is in
  // the docblock of `json-artifact-store.ts`.
  console.log(
    `[resume-run] NOTE       : regenerated stages WERE written back to data/store.json under ` +
      `projectId '${projectId}' (A_86 item 5). A second failure resumes from where this run reached.`,
  );
}

main().catch((e) => {
  console.error("[resume-run] FAILED:", e?.stack ?? e);
  process.exit(1);
});
