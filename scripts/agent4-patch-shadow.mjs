/**
 * Agent 4 — targeted-patch shadow harness (redesign §9.1 Spike A / §9.5 shadow).
 *
 * Demonstrates "patch beats rewrite": instead of regenerating the entire CML to fix validation
 * errors, run `patchCmlNode` — node-scoped patches with the §9.2 safety contract — over a real
 * failing CML and report the §9.4 metrics (errors fixed, bytes changed per node, contract
 * rejections). Uses the live LLM proposer when Azure creds are present (run with
 * `node --use-system-ca`), else a deterministic heuristic proposer so it still demonstrates offline.
 *
 * Read-only. No pipeline wiring. Run: node scripts/agent4-patch-shadow.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateCml } from "@cml/cml";
import { patchCmlNode, makeLlmPatchProposer, pathToString } from "@cml/prompts-llm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const line = (s = "") => console.log(s);

// ── collect a CML from the corpus ───────────────────────────────────────────

function corpusCmls() {
  const out = [];
  const store = path.join(ROOT, "data", "store.json");
  if (fs.existsSync(store)) {
    for (const a of (JSON.parse(fs.readFileSync(store, "utf8")).artifacts ?? [])) {
      if (a?.payload?.CASE?.inference_path) out.push({ src: `store/${a.id ?? "?"}`, doc: { CML_VERSION: 2.0, CASE: a.payload.CASE } });
    }
  }
  const cache = path.join(ROOT, "scripts", ".corpus-cache");
  if (fs.existsSync(cache)) {
    for (const f of fs.readdirSync(cache).filter((f) => f.endsWith(".md"))) {
      const text = fs.readFileSync(path.join(cache, f), "utf8");
      const fence = text.match(/```[a-z]*\n([\s\S]*?)```/i);
      const body = fence ? fence[1] : text;
      const s = body.indexOf("{"), e = body.lastIndexOf("}");
      if (s >= 0 && e > s) {
        try {
          const obj = JSON.parse(body.slice(s, e + 1));
          const CASE = obj.CASE ?? (obj.inference_path ? obj : null);
          if (CASE) out.push({ src: f.slice(0, 30), doc: { CML_VERSION: 2.0, CASE } });
        } catch {}
      }
    }
  }
  return out;
}

function pickFailingCase() {
  const cmls = corpusCmls();
  for (const c of cmls) {
    const v = validateCml(c.doc);
    if (!v.valid) return { ...c, synthetic: false, errors: v.errors };
  }
  // none failing → synthesize defects on the first valid CML to demonstrate
  if (cmls.length) {
    const doc = JSON.parse(JSON.stringify(cmls[0].doc));
    doc.CASE.meta = doc.CASE.meta || {};
    doc.CASE.meta.crime_class = { ...(doc.CASE.meta.crime_class || {}), category: "homicide" };
    if (Array.isArray(doc.CASE?.inference_path?.steps) && doc.CASE.inference_path.steps[0]) {
      doc.CASE.inference_path.steps[0].required_evidence = ["suspicious behavior"];
    }
    return { src: `${cmls[0].src} (+synthetic defects)`, doc, synthetic: true, errors: validateCml(doc).errors };
  }
  return null;
}

// ── deterministic heuristic proposer (offline demo) ─────────────────────────

function heuristicProposer({ error, path: segs }) {
  const enumMatch = error.match(/must be one of (.+)$/);
  if (enumMatch) return enumMatch[1].split(",")[0].trim();
  if (/required_evidence is missing or empty/.test(error)) {
    return ["A dated porter's logbook entry timestamps the movement at 9:14.", "The visitors' book bears a signature in the same hand."];
  }
  if (/required_evidence\[\d+\].*(too abstract|too brief|behavioral shorthand)/.test(error)) {
    return "A dated porter's logbook entry timestamps the movement at 9:14.";
  }
  if (/observation is too short/.test(error)) {
    return "The study clock had stopped at a time inconsistent with the butler's winding schedule.";
  }
  if (/ is required$/.test(error)) {
    const key = segs[segs.length - 1];
    return typeof key === "string" ? `${key.replace(/_/g, " ")} (provisional)` : "value";
  }
  return undefined;
}

// ── run ──────────────────────────────────────────────────────────────────────

async function main() {
  line("=".repeat(78));
  line("AGENT 4 — TARGETED-PATCH SHADOW  (redesign §9.1 Spike A / §9.5)");
  line("=".repeat(78));

  const failing = pickFailingCase();
  if (!failing) {
    line("\nNo CML corpus found (data/store.json / scripts/.corpus-cache). Nothing to demonstrate.");
    return;
  }

  line(`\nFailing CML: ${failing.src}${failing.synthetic ? "  [synthetic defects injected]" : "  [real failing CML]"}`);
  line(`validateCml errors BEFORE: ${failing.errors.length}`);
  for (const e of failing.errors.slice(0, 8)) line(`  - ${e}`);
  if (failing.errors.length > 8) line(`  … and ${failing.errors.length - 8} more`);

  const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || "";
  const API_KEY = process.env.AZURE_OPENAI_API_KEY || "";
  let propose = heuristicProposer;
  let proposerName = "heuristic (offline)";
  if (ENDPOINT && API_KEY) {
    const { AzureOpenAIClient } = await import("@cml/llm-client");
    const client = new AzureOpenAIClient({
      endpoint: ENDPOINT,
      apiKey: API_KEY,
      defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    });
    propose = makeLlmPatchProposer(client, { runId: "agent4-patch-shadow" });
    proposerName = `live LLM (${process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini"})`;
  }

  line(`\nRunning patchCmlNode (proposer: ${proposerName})…\n`);
  const result = await patchCmlNode({ cml: failing.doc, propose, maxPatches: 16 });

  line(`APPLIED node patches (${result.applied.length}):`);
  for (const a of result.applied) line(`  ✓ ${a.path}   (${a.nodeBytes} bytes)`);
  line(`REJECTED by the contract (${result.rejected.length}):`);
  for (const r of result.rejected.slice(0, 8)) line(`  ✗ ${r.error.slice(0, 70)} → ${r.reason}`);

  const before = failing.errors.length;
  const after = result.validation.errors.length;
  const bytesChanged = result.applied.reduce((s, a) => s + a.nodeBytes, 0);
  const wholeCaseBytes = JSON.stringify(failing.doc.CASE).length;

  line("\n" + "-".repeat(78));
  line("METRICS (§9.4)");
  line("-".repeat(78));
  line(`  errors before ............ ${before}`);
  line(`  errors after ............. ${after}   (fixed ${before - after})`);
  line(`  fully resolved ........... ${result.validation.valid}`);
  line(`  node patches applied ..... ${result.applied.length}`);
  line(`  contract rejections ...... ${result.rejected.length}  (patches that would have broken a passing node — refused, not applied)`);
  line(`  bytes changed (patch) .... ${bytesChanged}`);
  line(`  bytes a full rewrite would touch (whole CASE block): ${wholeCaseBytes}`);
  line(`  → patch changed ${wholeCaseBytes ? ((100 * bytesChanged) / wholeCaseBytes).toFixed(1) : "?"}% of what a whole-CML regeneration would re-emit.`);
  line("\nThe contract guarantees every applied patch fixed its target and broke nothing that passed.");
  line("=".repeat(78));
}

main().catch((e) => { console.error("harness error:", e); process.exit(1); });
