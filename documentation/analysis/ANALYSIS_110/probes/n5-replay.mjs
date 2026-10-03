// A_110 N5 — replay the checkers on run bcc0d637's chosen chapters (the editor's input), PROSE_V2_CONTRACT_FIXES OFF
// and ON, and show where each `clue_early` finding is anchored and whether it reaches the editor. Read-only.
//   node documentation/analysis/ANALYSIS_110/probes/n5-replay.mjs [projectId]
import fs from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
process.env.CML_VERIFIED_FIXES = "true";
const ROOT = process.cwd();
const pe = await import(pathToFileURL(join(ROOT, "packages/prose-engine/dist/index.js")).href);
const PROJECT = process.argv[2] ?? "proj_5eb8c115-ca42-4e66-997d-74fff1b327db";
const store = JSON.parse(fs.readFileSync(join(ROOT, "data/store.json"), "utf8"));
const art = {}; for (const a of store.artifacts) if (a.projectId === PROJECT) art[a.type] = a.payload;
const input = { cml: art.cml, clues: art.clues, outline: art.outline, cast: art.cast?.cast ?? art.cast, profiles: art.character_profiles, world: art.world_document, locations: art.location_profiles, temporal: art.temporal_context, setting: art.setting, lockedFacts: [], humourLevel: "classic" };
const cp = JSON.parse(fs.readFileSync(join(ROOT, `apps/worker/logs/agent9v2-checkpoint-${PROJECT}.json`), "utf8"));
const chapters = []; for (const seg of cp.segments) chapters.push(...(seg.drafts.find((d) => d.attempt === seg.chosen)?.chapters ?? []));
const expected = chapters.map((c, i) => c.chapterNumber ?? c.number ?? i + 1);
for (const on of [false, true]) {
  process.env.PROSE_V2_CONTRACT_FIXES = on ? "1" : "";
  const contract = pe.buildBookContract(input);
  const early = pe.collectCheckerFindings(chapters, contract, expected).filter((f) => f.class === "clue_early");
  const firstSentence = (n) => String(chapters[expected.indexOf(n)]?.paragraphs?.[0] ?? "").slice(0, 40);
  const onFirst = early.filter((f) => f.quote.startsWith(firstSentence(f.chapter).replace(/\s+/g, " ").slice(0, 30)));
  console.log(`${on ? "ON " : "OFF"}: clue_early findings ${early.length} · to the editor ${early.filter((f) => f.severity !== "report").length} · anchored on the chapter's first sentence ${onFirst.length}`);
  for (const f of early) console.log(`   ch${f.chapter} [${f.severity}] ${f.quote.slice(0, 70)}…  — ${f.note.slice(0, 260)}`);
}
