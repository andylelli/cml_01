#!/usr/bin/env node
/**
 * ANALYSIS_109 — the formal checks, report-only, over every archived case. £0: no LLM.
 *
 *   npm run build:all
 *   node scripts/case-logic-report.mjs            # data/store.json if present, else eval/golden
 *   node scripts/case-logic-report.mjs --golden   # the four golden bundles only
 *
 * Every case-level method runs here BEFORE it changes a contract (A_109 §17): the first number each
 * one produces is how often its fault exists in the archive.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const cml = await import(join(ROOT, "packages", "cml", "dist", "index.js"));
let proseEngine = null;
try {
  proseEngine = await import(join(ROOT, "packages", "prose-engine", "dist", "index.js"));
} catch {
  // M2 needs the contract's clue ownership; without prose-engine it is skipped and says so.
}

const unwrap = (value, keys) => {
  if (!value || typeof value !== "object") return value;
  for (const k of keys) if (value[k] && typeof value[k] === "object") return value[k];
  return value;
};

const loadCases = () => {
  const store = join(ROOT, "data", "store.json");
  if (!process.argv.includes("--golden") && existsSync(store)) {
    const byProject = new Map();
    for (const a of JSON.parse(readFileSync(store, "utf8")).artifacts ?? []) {
      if (!a?.projectId || !a?.type) continue;
      if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
      byProject.get(a.projectId)[a.type] = a.payload; // latest wins, as `latestArtifact` does
    }
    return [...byProject].filter(([, a]) => a.cml).map(([id, a]) => ({ id, artifacts: a }));
  }
  const dir = join(ROOT, "eval", "golden");
  return readdirSync(dir)
    .filter((f) => f.startsWith("bundle-"))
    .map((f) => ({ id: f.slice(7, 15), artifacts: JSON.parse(readFileSync(join(dir, f), "utf8")).artifacts }));
};

const cases = loadCases();
const tally = { cases: 0, inconsistent: 0, determinable: 0, innocents: 0, covering: 0, none: 0, partial: 0 };
for (const { id, artifacts } of cases) {
  let model;
  try {
    model = cml.buildCaseModel({ cml: artifacts.cml, clues: artifacts.clues, lockedFacts: artifacts.hard_logic_devices?.devices?.[0]?.lockedFacts ?? [] });
  } catch (err) {
    console.log(`${id}  could not parse: ${err.message}`);
    continue;
  }
  tally.cases += 1;
  const t = cml.analyseTimeline(model);
  if (!t.consistent) tally.inconsistent += 1;
  if (t.act) tally.determinable += 1;
  for (const i of t.innocents.filter((x) => x.coverage !== "unknown")) {
    tally.innocents += 1;
    if (i.coverage === "covers") tally.covering += 1;
    if (i.coverage === "none") tally.none += 1;
    if (i.coverage === "partial") tally.partial += 1;
  }
  console.log(`${String(id).slice(0, 13).padEnd(13)}  M1 ${cml.summariseTimeline(t, model)}`);

  // M5 — recaps in the book this case produced, when the archive holds its prose and outline.
  const prose = artifacts.prose;
  const outline = unwrap(artifacts.outline, ["narrative", "outline"]);
  if (proseEngine && prose && Array.isArray(prose.chapters) && outline && Array.isArray(outline.acts)) {
    try {
      const contract = proseEngine.buildBookContract({
        cml: artifacts.cml, clues: artifacts.clues ?? null, outline, cast: unwrap(artifacts.cast, ["cast"]),
        profiles: artifacts.character_profiles ?? null, humourLevel: "classic",
      });
      const chrono = model.chronology;
      const dial = new Map(chrono.events.map((e) => [e.id, e.dial]));
      const windows = chrono.intervals.filter((i) => i.id.startsWith("alibi:")).map((i) => [dial.get(i.start), dial.get(i.end)]);
      const byChapter = new Map(prose.chapters.map((c, i) => [i + 1, { paragraphs: c.paragraphs ?? [] }]));
      const hits = proseEngine.findRecaps(byChapter, contract, { windows });
      tally.books = (tally.books ?? 0) + 1;
      tally.recaps = (tally.recaps ?? 0) + hits.length;
      const clue = hits.filter((h) => h.kind === "clue").length;
      console.log(`${"".padEnd(13)}  M5 recaps ${hits.length} (clue ${clue}, alibi ${hits.length - clue})`);
    } catch (err) {
      console.log(`${"".padEnd(13)}  M5 could not run: ${err.message}`);
    }
  }
}

console.log("\n── totals ─────────────────────────────────────────────────────────────");
console.log(`cases ${tally.cases} · timeline inconsistent ${tally.inconsistent} · act window derivable ${tally.determinable}`);
console.log(
  `innocents with a judged alibi ${tally.innocents}: cover the act ${tally.covering}, partly ${tally.partial}, not at all ${tally.none}`,
);
if (tally.books) console.log(`books with prose ${tally.books}: recaps ${tally.recaps} (${(tally.recaps / tally.books).toFixed(1)} a book)`);
