/**
 * A_67 FIX-3 — plant→payoff coverage dry-run (§6 FIX 3: "deterministically measurable; a corpus
 * dry-run over the stories prices it for free before any lever is built").
 *
 * For every project in a store snapshot that shipped cml + clues + outline + prose, this measures
 * whether the ENDGAME (the reveal chapter onward) actually CITES the essential clues that were planted
 * earlier — the plant→payoff gap the reviewers flag ("clues planted then never used", "the method is
 * revealed, not planted"). It reuses the SAME auditRevealCitesPlants / chapterMentionsRequiredClue
 * token-match the missing_clue regen channel keys on, so the measure and any future hard lever agree.
 *
 * Pure read-only analysis. No pipeline wiring.
 *   node scripts/reveal-cites-plants-coverage.mjs                    # the live data/store.json
 *   node scripts/reveal-cites-plants-coverage.mjs a.json b.json ...  # aggregate a wider corpus
 * Projects are de-duplicated by projectId across all stores (first complete cml+clues+outline+prose wins).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { auditRevealCitesPlants } from "../packages/prompts-llm/dist/agent9-prose/clue-validation.js";
import { deathMethodTellHints } from "../packages/prompts-llm/dist/agent5-clues.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);

const REVEAL_BEATS = new Set(["revelation", "final_trap"]);
const REVEAL_KEYWORDS = /\b(reveal|confront|accus|expos|final trap|unmask|denouement|solution)\b/i;

/**
 * Best-effort index where the reveal ENDGAME begins (outline scene ↔ prose chapter are 1:1 by order).
 * The endgame = this index through the end (covers the final_trap + revelation/aftermath split).
 */
function findRevealIdx(scenes, crs) {
  // 1. Beats are authoritative on the Golden-Age path: the endgame begins at the FIRST final_trap
  //    (else the first revelation). This is the reveal region; earlier scenes are "planted before".
  const beat = (s) => String(s?.beat ?? "").toLowerCase();
  let i = scenes.findIndex((s) => beat(s) === "final_trap");
  if (i < 0) i = scenes.findIndex((s) => beat(s) === "revelation");
  if (i >= 0) return i;
  // 2. Coordinate (per-act scene number, then global) — off the beat path (medium/long formats).
  const priorActCount = (act) => scenes.filter((s) => Number(s?.act) < act).length;
  if (crs && crs.act_number != null && crs.scene_number != null) {
    const a = Number(crs.act_number), n = Number(crs.scene_number);
    let j = scenes.findIndex((s) => Number(s?.act) === a && Number(s?.sceneNumber) - priorActCount(a) === n);
    if (j < 0) j = scenes.findIndex((s) => Number(s?.sceneNumber) === n && Number(s?.act) === a);
    if (j >= 0) return j;
  }
  // 3. Keyword: the FIRST reveal-ish scene in the back half (so its aftermath is in the endgame).
  for (let k = Math.floor(scenes.length / 2); k < scenes.length; k++) {
    const s = scenes[k];
    if (REVEAL_BEATS.has(beat(s)) || REVEAL_KEYWORDS.test(`${s?.title ?? ""} ${s?.summary ?? ""} ${s?.purpose ?? ""}`)) return k;
  }
  return Math.max(0, scenes.length - 2); // fallback: penultimate (assume the last chapter is aftermath)
}

function collectProjects(storePaths) {
  const byProject = new Map();
  for (const sp of storePaths) {
    let store;
    try {
      store = JSON.parse(fs.readFileSync(sp, "utf8"));
    } catch {
      console.warn(`(skipped unreadable store: ${sp})`);
      continue;
    }
    const artifacts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts ?? {});
    for (const a of artifacts) {
      if (!["cml", "clues", "outline", "prose", "prose_short"].includes(a.type)) continue;
      const slot = byProject.get(a.projectId) ?? {};
      const key = a.type === "prose_short" ? "prose" : a.type;
      if (!slot[key]) slot[key] = a; // first wins
      byProject.set(a.projectId, slot);
    }
  }
  return [...byProject.entries()].filter(([, s]) => s.cml && s.clues && s.outline && s.prose);
}

function main() {
  const argv = process.argv.slice(2);
  const storePaths = argv.length > 0 ? argv : [path.join(repoRoot, "data", "store.json")];
  const projects = collectProjects(storePaths);

  console.log(`\n=== A_67 FIX-3 — plant→payoff coverage (reveal cites planted clues?) ===`);
  console.log(`(${storePaths.length} store snapshot(s) → ${projects.length} project(s) with cml+clues+outline+prose)\n`);

  let nStories = 0, nMethodKnown = 0, nMethodCited = 0;
  let totalPlanted = 0, totalCited = 0, nFullyCited = 0;
  const worst = [];

  for (const [projectId, { cml, clues, outline, prose }] of projects) {
    const CASE = cml.payload?.CASE ?? cml.payload ?? {};
    const clueList = Array.isArray(clues.payload?.clues) ? clues.payload.clues : [];
    const clueById = new Map(clueList.map((c) => [String(c.id), c]));
    const scenes = (outline.payload?.acts ?? []).flatMap((act) => act?.scenes ?? []);
    const chapters = prose.payload?.chapters ?? [];
    if (scenes.length === 0 || chapters.length === 0) continue;

    const crs = CASE?.prose_requirements?.culprit_revelation_scene;
    const revealIdx = findRevealIdx(scenes, crs);

    // essential clues planted in scenes BEFORE the reveal chapter
    const planted = [];
    const seen = new Set();
    for (let i = 0; i < revealIdx; i++) {
      for (const id of scenes[i]?.cluesRevealed ?? []) {
        const cid = String(id);
        if (seen.has(cid)) continue;
        seen.add(cid);
        if (clueById.get(cid)?.criticality === "essential") planted.push(cid);
      }
    }

    // endgame text = reveal chapter onward (covers the reveal/aftermath split)
    const endgame = chapters.slice(revealIdx).flatMap((c) => c?.paragraphs ?? []).join("\n\n");
    const castNames = (CASE?.cast ?? []).map((c) => String(c?.name ?? "").trim()).filter(Boolean);
    const deathMethod = typeof CASE?.death_method === "string" ? CASE.death_method : "";
    const deathTokens = deathMethod ? deathMethodTellHints(deathMethod).tokens : [];

    const res = auditRevealCitesPlants(endgame, planted, { clues: clueList }, castNames, deathTokens);

    nStories++;
    totalPlanted += res.total;
    totalCited += res.cited;
    if (res.total > 0 && res.cited === res.total) nFullyCited++;
    if (res.methodCited !== null) {
      nMethodKnown++;
      if (res.methodCited) nMethodCited++;
    }
    if (res.uncited.length > 0) worst.push({ projectId, uncited: res.uncited.length, total: res.total });

    console.log(`project ${projectId}`);
    console.log(`  reveal chapter:       #${revealIdx + 1} of ${chapters.length}  (death_method: "${deathMethod || "—"}")`);
    console.log(`  method cited at reveal: ${res.methodCited === null ? "n/a (no death method)" : res.methodCited ? "YES" : "NO  <- FIX-2 gap"}`);
    console.log(`  planted essential clues cited: ${res.cited}/${res.total}  (${pct(res.cited, res.total)})`);
    if (res.uncited.length > 0) {
      console.log(`  UNCITED plants (${res.uncited.length}): ${res.uncited.slice(0, 10).join(", ")}${res.uncited.length > 10 ? " …" : ""}`);
    }
    console.log("");
  }

  console.log("=== AGGREGATE ===");
  console.log(`  stories measured:              ${nStories}`);
  console.log(`  reveal names the cause of death: ${nMethodCited}/${nMethodKnown}  (${pct(nMethodCited, nMethodKnown)})   [FIX 2]`);
  console.log(`  planted essential clues cited:   ${totalCited}/${totalPlanted}  (${pct(totalCited, totalPlanted)})   [FIX 3]`);
  console.log(`  stories citing EVERY plant:      ${nFullyCited}/${nStories}  (${pct(nFullyCited, nStories)})`);
  if (worst.length) {
    worst.sort((a, b) => b.uncited - a.uncited);
    console.log(`\n  biggest plant→payoff gaps:`);
    for (const w of worst.slice(0, 8)) console.log(`   · ${w.projectId}: ${w.uncited}/${w.total} planted essential clues never cited at the reveal`);
  }
  console.log("");
}

main();
