/**
 * Agent 9 redesign — Phase-A/§7.1 shadow: derive the chapter-as-contract from the EXISTING CML +
 * Agent 7 outline + Agent 5 clues, log it, and validate the derivation against the fair-play
 * properties the pipeline already enforces implicitly. Pure observability, zero behavior change —
 * "de-risk everything downstream" (§7.1).
 *
 * For every shipped run it derives `ChapterObligationContract[]` and checks, deterministically:
 *   - CLUE COVERAGE — every clue in the distribution is surfaced by some chapter (else a real gap),
 *   - FAIR-PLAY ORDERING — every clue is `must_not_reveal` in each chapter before its first reveal,
 *   - CULPRIT HIDDEN — the culprit is `must_not_reveal` until the reveal chapter.
 *
 * Read-only.  node scripts/agent9-contract-shadow.mjs [store.json ...]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deriveChapterContracts } from "../packages/prose-guard/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadCases(storePaths) {
  const byProject = new Map();
  for (const sp of storePaths) {
    let store;
    try { store = JSON.parse(fs.readFileSync(sp, "utf8")); } catch { continue; }
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
    // flatten outline acts→scenes into chapters (1 scene == 1 chapter)
    const scenes = [];
    let chapter = 0;
    for (const act of s.outline.payload?.acts ?? []) {
      for (const sc of act.scenes ?? []) {
        chapter++;
        scenes.push({
          chapter,
          beat: sc.beat,
          present: sc.characters ?? [],
          location: sc.setting,
          cluesRevealed: (sc.cluesRevealed ?? []).map((id) => ({ id })),
        });
      }
    }
    cases.push({
      projectId,
      scenes,
      culprit: caseData?.culpability?.culprits?.[0] ?? "",
      distributedClues: (s.clues.payload?.clues ?? []).map((c) => c.id),
    });
  }
  return cases;
}

function main() {
  const argv = process.argv.slice(2);
  const storePaths = argv.filter((a) => a.endsWith(".json"));
  if (storePaths.length === 0) storePaths.push(path.join(repoRoot, "data", "store.json"));

  const cases = loadCases(storePaths);
  console.log(`\n=== Agent 9 §7.1 shadow — chapter-as-contract derived over ${cases.length} shipped run(s) ===\n`);

  let coverageOk = 0, fairPlayOk = 0, culpritOk = 0;
  for (const c of cases) {
    const contracts = deriveChapterContracts(c.scenes, { culpritName: c.culprit });
    const surfaced = new Set(contracts.flatMap((k) => k.must_surface.map((m) => m.clue)));
    const missing = c.distributedClues.filter((id) => !surfaced.has(id));
    const coverage = missing.length === 0;

    // fair-play: for each chapter, must_not_reveal.clues must be exactly the clues first-revealed later
    const firstReveal = new Map();
    for (const s of c.scenes) for (const cl of s.cluesRevealed) if (!firstReveal.has(cl.id) || s.chapter < firstReveal.get(cl.id)) firstReveal.set(cl.id, s.chapter);
    const fairPlay = contracts.every((k) => {
      const expected = [...firstReveal.entries()].filter(([, ch]) => ch > k.chapter).map(([id]) => id).sort();
      const got = k.must_not_reveal.clues.map((m) => m.clue).sort();
      return JSON.stringify(expected) === JSON.stringify(got);
    });

    const revealCh = Math.max(...contracts.map((k) => k.chapter));
    const culpritHidden = contracts.every((k) => k.must_not_reveal.solution_culprit === (k.chapter < revealCh));

    if (coverage) coverageOk++;
    if (fairPlay) fairPlayOk++;
    if (culpritHidden) culpritOk++;

    console.log(
      `  ${c.projectId.slice(0, 13)}…  ${contracts.length} chapters, ${surfaced.size} clues surfaced  ` +
        `→ coverage ${coverage ? "OK" : `MISSING [${missing.join(", ")}]`} · fair-play ${fairPlay ? "OK" : "BROKEN"} · culprit-hidden ${culpritHidden ? "OK" : "BROKEN"}`,
    );
  }

  const n = cases.length;
  console.log(`\n=== AGGREGATE (${n} run(s)) ===`);
  console.log(`  clue coverage (every distributed clue surfaced):  ${coverageOk}/${n}  (${pct(coverageOk, n)})`);
  console.log(`  fair-play ordering (future clues must_not_reveal): ${fairPlayOk}/${n}  (${pct(fairPlayOk, n)})`);
  console.log(`  culprit hidden until the reveal chapter:           ${culpritOk}/${n}  (${pct(culpritOk, n)})`);
  console.log(
    `\n>> The contract derivation is ${fairPlayOk === n && culpritOk === n ? "self-consistent on every run" : "mixed"}; ` +
      `clue-coverage gaps (if any) are real upstream signals the explicit contract surfaces that the implicit flow did not.\n`,
  );
}

const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);
main();
