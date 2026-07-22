#!/usr/bin/env node
// A_65 P5 + A_65b Ph3 — THE standing measures harness. One TSV row per run: craft and
// reliability read the same probes. Usage:
//   node scratchpad/a65/derive-a65-measures.mjs <runId> <chainLogPath>
//   node scratchpad/a65/derive-a65-measures.mjs --baseline     (the 5 planted-era runs)
// Appends to scratchpad/a65/measures.tsv (append-only — the era's longitudinal record).
import fs from "fs";
import path from "path";
import { bandRunWarnings } from "file:///C:/CML/apps/worker/dist/jobs/run-warnings.js";
import { detectScaffoldNotProse } from "file:///C:/CML/packages/prose-guard/dist/scaffold.js";

const root = "C:/CML";
const outTsv = path.join(root, "scratchpad/a65/measures.tsv");
const archivesRoot = path.join(root, "documentation/prompts/actual");

// A_65 Ph1.5 landed — the register detector is now single-sourced from prose-guard.
import { detectEvidentiaryRegister } from "file:///C:/CML/packages/prose-guard/dist/register.js";
// Inference density: sentences carrying explicit deductive connectives. Frozen measure list.
const INFERENCE_CONNECTIVES =
  /\b(?:therefore|which (?:meant|proved|proves|implied)|this (?:meant|proved|suggested)|could only (?:mean|have)|if\b[^.!?]{5,120}\bthen\b|deduced|concluded that|it followed that)\b/i;

const BASELINE = [
  { rid: "mystery-1784662295274", log: "scratchpad/a64-probe/probe_tide.log" },
  { rid: "mystery-1784663896191", log: "scratchpad/m3/m3_clock.log" },
  { rid: "mystery-1784664846932", log: "scratchpad/m3/m3_poison.log" },
  { rid: "mystery-1784665751813", log: "scratchpad/m3/m3_identity.log" },
  { rid: "mystery-1784667048584", log: "scratchpad/m3/m3_tide.log" },
];

function archiveDirFor(rid) {
  return fs.readdirSync(archivesRoot).find((d) => {
    const idx = path.join(archivesRoot, d, "INDEX.md");
    return fs.existsSync(idx) && fs.readFileSync(idx, "utf8").includes(rid);
  });
}

function churn(dir) {
  const files = fs.readdirSync(path.join(archivesRoot, dir)).filter((f) => f.endsWith("_request.md"));
  const c = { total: files.length, retries: 0, regens: 0, repairs: 0, rewrites: 0, byCause: {} };
  for (const f of files) {
    const name = f.replace(/^\d+_/, "");
    if (name.includes("retry")) { c.retries++; bump(c, "retry:" + (name.match(/^(Agent\d+[a-z]*)/)?.[1] ?? "?")); }
    else if (name.includes("Regen")) { c.regens++; bump(c, "regen:" + (name.match(/Regen-Ch\d+-(\w+)/)?.[1] ?? "?")); }
    else if (name.includes("Repair")) { c.repairs++; bump(c, "repair:" + (name.match(/(\w+Repair)/)?.[1] ?? "?")); }
    else if (name.includes("Rewrite")) { c.rewrites++; bump(c, "rewrite"); }
  }
  c.corrective = c.retries + c.regens + c.repairs + c.rewrites;
  return c;
}
const bump = (c, k) => (c.byCause[k] = (c.byCause[k] ?? 0) + 1);

function chaptersOf(md) {
  const parts = md.split(/^#{1,3}\s+Chapter\s+(\d+)[^\n]*$/m);
  const out = {};
  for (let i = 1; i < parts.length; i += 2) out[+parts[i]] = parts[i + 1] ?? "";
  return out;
}

function measureRun(rid, logPath) {
  const log = fs.readFileSync(path.join(root, logPath), "utf8");
  const rep = JSON.parse(fs.readFileSync(path.join(root, "apps/api/data/reports", rid, `${rid}.json`), "utf8"));
  const rub = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? {};
  const rw = (rep.diagnostics ?? []).find((d) => d.key === "run_warnings")?.details ?? {};
  // Banded live if the artifact predates Ph2; else use its own bands.
  const bands = rw.warn ? { info: rw.info, warn: rw.warn } : bandRunWarnings(rw.warnings ?? []);
  const gate = (log.match(/^CANARY_RELEASE_GATE (\S+)/m) ?? [])[1] ?? rep.release_gate_outcome?.status ?? "?";
  const dir = archiveDirFor(rid);
  const c = churn(dir);

  // story-level measures
  const sp = (log.match(/^STORY_SAVED (.+)$/m) ?? [])[1]?.trim();
  let plantOk = "", scaffoldShip = "", registerCount = "", inferenceDense = "";
  if (sp && fs.existsSync(sp)) {
    const md = fs.readFileSync(sp, "utf8");
    const chapters = chaptersOf(md);
    scaffoldShip = detectScaffoldNotProse(md).length;
    registerCount = Object.values(chapters).reduce((n, t) => n + detectEvidentiaryRegister(t).length, 0);
    // inference density: % of chapters whose sentence set trips the connective family ≥3 times
    const dens = Object.entries(chapters).map(([ch, t]) => {
      const sents = t.match(/[^.!?]+[.!?]+/g) ?? [];
      return sents.filter((s) => INFERENCE_CONNECTIVES.test(s)).length;
    });
    inferenceDense = dens.join("/"); // per-chapter counts — the craft Phase-1 target: ~0 outside licensed beats
    // plant compliance (needs the stamp)
    const stamp = (log.match(/\[Agent 7 plant-before-reveal\] ([^\n]+)/) ?? [])[1] ?? "";
    const plants = [...stamp.matchAll(/([\w-]+)→scene (\d+) \(reveal (\d+)\)/g)];
    plantOk = plants.length ? `${plants.length} stamped` : "0";
  }

  const caps = (rub.caps_applied ?? []).length;
  const row = [
    new Date(rep.generated_at ?? Date.now()).toISOString().slice(0, 10),
    rid, gate, rub.final ?? "", caps,
    c.total, c.corrective, (100 * c.corrective / Math.max(1, c.total)).toFixed(0) + "%",
    c.retries, c.regens, c.repairs,
    Object.entries(c.byCause).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}=${v}`).join(","),
    (bands.warn ?? []).length, (bands.info ?? []).length,
    scaffoldShip, registerCount, inferenceDense, plantOk,
  ].join("\t");
  return row;
}

const HEADER = ["date","runId","gate","rubric","caps","calls","corrective","corr%","retries","regens","repairs","top_causes","warn","info","scaffold_ship","register_hits","inference_per_ch","plants"].join("\t");

const args = process.argv.slice(2);
const rows = [];
if (args[0] === "--baseline") {
  for (const b of BASELINE) rows.push(measureRun(b.rid, b.log));
} else if (args.length >= 2) {
  rows.push(measureRun(args[0], args[1]));
} else {
  console.error("usage: derive-a65-measures.mjs <runId> <chainLog> | --baseline");
  process.exit(2);
}

if (!fs.existsSync(outTsv)) fs.writeFileSync(outTsv, HEADER + "\n");
fs.appendFileSync(outTsv, rows.join("\n") + "\n");
console.log(HEADER);
for (const r of rows) console.log(r);
