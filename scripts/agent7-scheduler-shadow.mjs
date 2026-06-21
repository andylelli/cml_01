/**
 * Agent 7 redesign — Spike 1: the Beat Scheduler emits a valid grid, offline, with no LLM (§9.1).
 *
 * The whole redesign rests on one claim: for a real validated CML, the obligatory beats are a
 * satisfiable constraint set a small deterministic solver can lay into a grid. This harness runs
 * `buildSceneGrid` over every already-shipped run (cml + clues + the live outline's scene count) and
 * asserts the three §4.3 invariants directly — COMPLETE (every obligation placed), ORDERED (every
 * precedence edge holds), COVERED (≥60% clue-bearing) — at the SAME scene count the live LLM outline
 * used. Each infeasible case is a real signal (and is reported with its precise unmet constraint),
 * not a silent failure.
 *
 * Read-only. No pipeline wiring.
 *   node scripts/agent7-scheduler-shadow.mjs                    # the live data/store.json
 *   node scripts/agent7-scheduler-shadow.mjs a.json b.json ...  # aggregate a wider corpus
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildSceneGrid,
  collectObligations,
  checkComplete,
  checkOrdered,
  checkCoverage,
  SchedulerInfeasibleError,
} from "../packages/beat-scheduler/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadCases(storePaths) {
  const byProject = new Map();
  for (const sp of storePaths) {
    let store;
    try {
      store = JSON.parse(fs.readFileSync(sp, "utf8"));
    } catch {
      continue;
    }
    const arts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts ?? {});
    for (const a of arts) {
      if (!["cml", "clues", "outline"].includes(a.type)) continue;
      const slot = byProject.get(a.projectId) ?? {};
      if (!slot[a.type]) slot[a.type] = a;
      byProject.set(a.projectId, slot);
    }
  }
  const cases = [];
  for (const [projectId, s] of byProject) {
    if (!s.cml || !s.clues || !s.outline) continue;
    const caseData = s.cml.payload?.CASE ?? s.cml.payload;
    const cluesPayload = s.clues.payload ?? {};
    const outline = s.outline.payload ?? {};
    const liveSceneCount = outline.totalScenes ?? (outline.acts ?? []).reduce((n, a) => n + (a.scenes?.length ?? 0), 0);
    cases.push({
      projectId,
      caseData,
      clues: (cluesPayload.clues ?? []).map((c) => ({
        id: c.id,
        placement: c.placement,
        criticality: c.criticality,
        supportsInferenceStep: c.supportsInferenceStep,
      })),
      redHerrings: cluesPayload.redHerrings ?? [],
      liveSceneCount,
    });
  }
  return cases;
}

function main() {
  const argv = process.argv.slice(2);
  const storePaths = argv.filter((a) => a.endsWith(".json"));
  if (storePaths.length === 0) storePaths.push(path.join(repoRoot, "data", "store.json"));

  const cases = loadCases(storePaths);
  console.log(`\n=== Agent 7 Spike 1 — deterministic scheduler over ${cases.length} shipped run(s) ===\n`);

  let feasible = 0, complete = 0, ordered = 0, ratioOk = 0, pacingOk = 0;
  const infeasible = [];

  for (const c of cases) {
    const n = c.liveSceneCount && c.liveSceneCount >= 4 ? c.liveSceneCount : 10;
    try {
      const grid = buildSceneGrid({ cml: c.caseData, clues: c.clues, redHerrings: c.redHerrings }, n);
      const obs = collectObligations(c.caseData, c.clues, c.redHerrings).obligations;
      const comp = checkComplete(grid, obs);
      const ord = checkOrdered(grid);
      const cov = checkCoverage(grid);
      feasible++;
      if (comp.ok) complete++;
      if (ord.ok) ordered++;
      if (cov.ratioOk) ratioOk++;
      if (cov.pacingOk) pacingOk++;
      const flags = `${comp.ok ? "complete" : "INCOMPLETE"} · ${ord.ok ? "ordered" : "UNORDERED"} · ${Math.round(cov.ratio * 100)}% clue${cov.pacingOk ? "" : " (run>2)"}`;
      console.log(`  ✓ ${c.projectId.slice(0, 13)}…  ${n} scenes (${grid.actCounts.act1}/${grid.actCounts.act2}/${grid.actCounts.act3}), ${obs.length} obligations → ${flags}`);
      if (!ord.ok) console.log(`      ordering: ${ord.violations[0]}`);
    } catch (e) {
      if (e instanceof SchedulerInfeasibleError) {
        infeasible.push({ projectId: c.projectId, reason: e.unmet, n });
        console.log(`  ✗ ${c.projectId.slice(0, 13)}…  INFEASIBLE @${n}: ${e.unmet}`);
      } else {
        throw e;
      }
    }
  }

  const total = cases.length;
  console.log(`\n=== AGGREGATE (${total} run(s)) ===`);
  console.log(`  scheduler emits a grid (feasible):  ${feasible}/${total}  (${pct(feasible, total)})`);
  console.log(`  of those — COMPLETE:                 ${complete}/${feasible}  (${pct(complete, feasible)})`);
  console.log(`             ORDERED:                  ${ordered}/${feasible}  (${pct(ordered, feasible)})`);
  console.log(`             ≥60% COVERAGE (hard):     ${ratioOk}/${feasible}  (${pct(ratioOk, feasible)})`);
  console.log(`             no >2 clueless run (soft): ${pacingOk}/${feasible}  (${pct(pacingOk, feasible)})`);
  if (infeasible.length) {
    console.log(`\n  ${infeasible.length} infeasible case(s) — each a real upstream signal, surfaced at the logic layer not at scene 14:`);
    for (const i of infeasible) console.log(`   · ${i.projectId.slice(0, 16)}…  ${i.reason}`);
  }
  console.log(
    `\n>> Spike 1 ${ordered === feasible && complete === feasible && ratioOk === feasible && infeasible.length === 0 ? "GREEN" : "MIXED"}: ` +
      `the deterministic scheduler ${complete === feasible && ordered === feasible ? "lays a complete, correctly-ordered grid" : "had gaps"} ` +
      `for the corpus at the live scene counts — the property the live runner spends ~700 lines of band-aids retrofitting.\n`,
  );
}

const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);

main();
