// Analyzer/verdict CLI for the AGENT9_REGEN_CLUE N≥4 A/B (see
// documentation/plan/regen-clue-n4-experiment.md). Pure/offline — safe to run without LLM once the
// paired records exist. Reads <in>/<runId>.control.json + <runId>.treatment.json, prints the
// per-pair + aggregate verdict, exits 0 on PASS and 1 on FAIL.
//
//   node scripts/exp-regen-clue-analyze.mjs [--in results/regen-clue-ab]

import path from "path";
import fs from "fs/promises";
import { comparePair, aggregate } from "./exp-regen-clue/analyze-lib.mjs";

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

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inDir = path.resolve(root, String(args.in ?? "results/regen-clue-ab"));

  let entries;
  try {
    entries = await fs.readdir(inDir);
  } catch {
    console.error(`Input directory not found: ${inDir}. Run exp-regen-clue-ab.mjs first.`);
    process.exit(2);
  }

  const runIds = entries
    .filter((f) => f.endsWith(".control.json"))
    .map((f) => f.slice(0, -".control.json".length))
    .sort();

  if (runIds.length === 0) {
    console.error(`No *.control.json records found in ${inDir}.`);
    process.exit(2);
  }

  const pairs = [];
  let flagName = "AGENT9_REGEN_CLUE"; // fallback for legacy records without a `flag` field
  for (const runId of runIds) {
    const control = await readJson(path.join(inDir, `${runId}.control.json`));
    const treatment = await readJson(path.join(inDir, `${runId}.treatment.json`));
    if (typeof treatment?.flag === "string" && treatment.flag) flagName = treatment.flag;
    pairs.push(comparePair(control, treatment));
  }

  console.log(`${flagName} A/B verdict — ${pairs.length} matched pairs from ${path.relative(root, inDir)}\n`);

  const perPair = pairs.map((p) => ({
    runId: p.runId,
    ok: p.ok,
    a1_ctl: p.control.scaffold?.a1 ?? null,
    a1_trt: p.treatment.scaffold?.a1 ?? null,
    scaffold_ctl: p.control.scaffold?.total ?? null,
    scaffold_trt: p.treatment.scaffold?.total ?? null,
    planted: p.treatment.regen?.plantedCount ?? 0,
    unresolved: p.treatment.regen?.unresolvedCount ?? 0,
    cost_ctl: p.control.costUsd,
    cost_trt: p.treatment.costUsd,
  }));
  console.table(perPair);

  // Surface the specific failing checks for any regressing pair.
  for (const p of pairs) {
    const failed = p.checks.filter((c) => !c.ok);
    if (failed.length > 0) {
      console.log(`\n  ✗ ${p.runId} failing checks:`);
      for (const c of failed) console.log(`      - ${c.name}: ${c.detail ?? ""}`);
    }
  }

  const agg = aggregate(pairs);
  console.log("\nAggregate gates:");
  for (const g of agg.gates) {
    const mark = g.ok ? "✔" : g.advisory ? "•" : "✗";
    const tag = g.advisory && !g.ok ? " (advisory)" : "";
    console.log(`  ${mark} ${g.name}: ${g.detail ?? ""}${tag}`);
  }
  console.log(
    `\nRegen: planted=${agg.totals.plantedTotal} unresolved=${agg.totals.unresolvedTotal} | ` +
      `A1 scaffold ${agg.totals.controlA1} → ${agg.totals.treatmentA1} | ` +
      `cost $${agg.totals.controlCost.toFixed(4)} → $${agg.totals.treatmentCost.toFixed(4)}`,
  );

  console.log(`\nVERDICT: ${agg.pass ? `PASS ✅ — safe to flip ${flagName} on (then confirm K2 on a scored full run)` : "FAIL ❌ — inspect regressing pairs above; flag stays off"}`);
  process.exit(agg.pass ? 0 : 1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
