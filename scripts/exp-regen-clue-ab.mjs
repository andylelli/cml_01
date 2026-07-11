// Paired A/B orchestrator for ANY single Agent-9/6 flag (roadmap S11). Originally AGENT9_REGEN_CLUE-only;
// generalized to `--flag <NAME>` so every roadmap lever (AGENT9_REGEN_RESOLUTION, _CULPRIT_EVIDENCE,
// AGENT9_REGEN_MECHANISM, AGENT6_DT_EVIDENCE_COMPLETENESS, AGENT9_CRITIQUE_REWRITE, AGENT9_VOICE_ENFORCE,
// …) is A/B-able through the same matched harness. See documentation/plan/regen-clue-n4-experiment.md.
//
// For each prior run R in --runIds, replays Agent 9 over R's hydrated upstream artifacts TWICE —
// control (flag = --controlValue, default "false"/"off") then treatment (flag = --treatmentValue, default
// "true") — via scripts/canary-agent-boundary.mjs. Because the hydrated Agent-7 outline is identical
// across the two arms, the pair is matched by construction on chapter count + opening-naming (the two
// factors the canary-k2 memory says dominate). ONE flag is toggled per arm — never two. Writes one
// record per arm for exp-regen-clue-analyze.mjs.
//
// LIVE LLM — this is the manual test-run step. Nothing here runs until you invoke it.
//
//   node scripts/exp-regen-clue-ab.mjs --runIds R1,R2,R3,R4 [--flag AGENT9_REGEN_CLUE] \
//       [--treatmentValue true] [--controlValue false] [--out results/ab-<flag>]
//
// Mode-valued flag example (voice enforcement is off|shadow|enforce, not a boolean):
//   node scripts/exp-regen-clue-ab.mjs --runIds R1,R2,R3,R4 --flag AGENT9_VOICE_ENFORCE \
//       --treatmentValue enforce --controlValue off

import path from "path";
import fs from "fs/promises";
import { spawnSync } from "child_process";
import { parseRegenTelemetry } from "./exp-regen-clue/analyze-lib.mjs";

const root = process.cwd();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = "true";
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

async function readJsonIfPresent(p) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return null;
  }
}

async function runArm(runId, arm, outDir, exp) {
  const dumpPath = path.join(outDir, `${runId}.${arm}.dump.json`);
  const flagValue = arm === "treatment" ? exp.treatmentValue : exp.controlValue;
  const env = {
    ...process.env,
    [exp.flag]: flagValue,
    CANARY_PROSE_DUMP_PATH: dumpPath,
  };
  console.log(`\n=== ${runId} :: ${arm} (${exp.flag}=${flagValue}) ===`);
  const child = spawnSync(
    process.execPath,
    [path.join("scripts", "canary-agent-boundary.mjs"), "--agent", "9", "--runId", runId],
    { cwd: root, env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const stdout = String(child.stdout ?? "");
  const stderr = String(child.stderr ?? "");
  process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);

  const exitCode = typeof child.status === "number" ? child.status : 1;
  const status = exitCode === 0 && /CANARY_STATUS success/.test(stdout) ? "success" : "failure";
  const dump = await readJsonIfPresent(dumpPath);
  const regen = parseRegenTelemetry(stdout + "\n" + stderr);
  // If Agent 7 was re-synthesised (the run folder lacked a hydratable outline), the arm generated
  // its OWN outline — so control and treatment are no longer the same case and the pair is NOT
  // matched by construction. Record it so the analyzer can invalidate the pair.
  const synthesizedAgent7 = /SYNTHESIZING_CODE\s+7\b/.test(stdout);

  const record = {
    arm,
    runId,
    flag: exp.flag,
    flagValue,
    exitCode,
    status,
    synthesizedAgent7,
    regen,
    dump,
    stdoutTail: stdout.split("\n").slice(-40).join("\n"),
  };
  if (synthesizedAgent7) {
    console.log(`--- ${runId} :: ${arm} WARNING: Agent 7 was re-synthesised — pair is not matched; pick a run with a hydratable outline.`);
  }
  const recordPath = path.join(outDir, `${runId}.${arm}.json`);
  await fs.writeFile(recordPath, JSON.stringify(record, null, 2), "utf8");
  console.log(
    `--- ${runId} :: ${arm} → status=${status} exit=${exitCode} planted=${regen.plantedCount} unresolved=${regen.unresolvedCount} dump=${dump ? "yes" : "MISSING"}`,
  );
  return record;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const runIds = String(args.runIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // The lever under test. Backward-compatible default: AGENT9_REGEN_CLUE with boolean true/false.
  const flag = String(args.flag ?? "AGENT9_REGEN_CLUE").trim();
  if (!/^[A-Z][A-Z0-9_]*$/.test(flag)) {
    console.error(`--flag must be an env var NAME (got "${flag}"). Example: --flag AGENT9_VOICE_ENFORCE`);
    process.exit(2);
  }
  const treatmentValue = String(args.treatmentValue ?? "true");
  const controlValue = String(args.controlValue ?? "false");
  if (treatmentValue === controlValue) {
    console.error(`--treatmentValue and --controlValue must differ (both "${treatmentValue}") — a matched pair needs one flag to change.`);
    process.exit(2);
  }
  const exp = { flag, treatmentValue, controlValue };

  // Default the out dir off the flag so different experiments never overwrite each other; the historical
  // AGENT9_REGEN_CLUE experiment keeps its original path.
  const defaultOut = flag === "AGENT9_REGEN_CLUE"
    ? "results/regen-clue-ab"
    : `results/ab-${flag.toLowerCase()}`;
  const outDir = path.resolve(root, String(args.out ?? defaultOut));

  if (runIds.length < 4) {
    console.error(
      `Need at least 4 runIds for an N≥4 experiment (got ${runIds.length}). ` +
        `Usage: node scripts/exp-regen-clue-ab.mjs --runIds R1,R2,R3,R4 [--flag NAME] [--treatmentValue V] [--controlValue V] [--out DIR]`,
    );
    process.exit(2);
  }

  await fs.mkdir(outDir, { recursive: true });
  console.log(`${flag} A/B (treatment=${treatmentValue} vs control=${controlValue}) — ${runIds.length} matched pairs → ${outDir}`);

  const summary = [];
  for (const runId of runIds) {
    // control first, then treatment — same case, the one flag the only difference.
    const control = await runArm(runId, "control", outDir, exp);
    const treatment = await runArm(runId, "treatment", outDir, exp);
    summary.push({
      runId,
      control: control.status,
      treatment: treatment.status,
      planted: treatment.regen.plantedCount,
      unresolved: treatment.regen.unresolvedCount,
    });
  }

  console.log(`\nDone. ${runIds.length} pairs written to ${outDir}`);
  console.table(summary);
  console.log(`\nNext: node scripts/exp-regen-clue-analyze.mjs --in ${path.relative(root, outDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
