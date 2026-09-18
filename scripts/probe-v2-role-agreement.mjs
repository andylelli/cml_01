/**
 * ANALYSIS_99 §10.14 W6 — does the v2 role table agree with v1's reveal arbitration?
 *
 * v2 replaces five mechanisms and three flags with one rule read off the outline's beats. The
 * acceptance criterion is agreement with v1's FINAL answer on all but at most one archived outline,
 * and any disagreement written down with the outline that produced it.
 *
 * v1's answer is read the only way it can be: by building the real obligation block per chapter with
 * the production flags on, and seeing which chapter carries the reveal-only obligations. Both engines
 * use `isAftermathFinalScene` for the aftermath, so the stage mode is supplied from that shared
 * predicate rather than from either engine's own conclusion.
 *
 *   node scripts/probe-v2-role-agreement.mjs
 */
import fs from "node:fs";
// `buildChapterObligationBlock` is internal to prompts-llm (no index export, and the package's
// exports map is "." only), so the probe reaches the built module by file URL. That is a probe
// privilege, not a pattern: nothing in the pipeline imports across a package's exports map.
import { pathToFileURL } from "node:url";
import path from "node:path";
const distUrl = (rel) => pathToFileURL(path.join(process.cwd(), "packages", "prompts-llm", "dist", rel)).href;
const { buildChapterObligationBlock } = await import(distUrl("agent9-prose/obligation-block.js"));
const { isAftermathFinalScene } = await import(distUrl("agent9-prose/clue-validation.js"));
import { assignChapterRoles } from "@cml/prose-engine";

for (const [k, v] of Object.entries({
  AGENT9_SCENE_REF_ARBITRATION: "true",
  AGENT9_REVEAL_ON_DT_CHAPTER: "true",
  AGENT9_EARLIEST_TRAP_WINS: "true",
})) process.env[k] = v;

const store = JSON.parse(fs.readFileSync("data/store.json", "utf8"));
const byProject = new Map();
for (const a of store.artifacts ?? []) {
  if (!a?.projectId || !a?.type) continue;
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}

const REVEAL_MARKER = "KILL STATEMENT REQUIRED";
let compared = 0;
let agree = 0;
const disagreements = [];
let v1None = 0;
let v1Many = 0;

for (const [projectId, arts] of byProject) {
  const outline = arts.outline?.narrative ?? arts.outline?.outline ?? arts.outline;
  const cml = arts.cml;
  if (!outline?.acts || !cml) continue;
  const scenes = outline.acts.flatMap((act) => act?.scenes ?? []);
  if (scenes.length === 0) continue;
  const caseBlock = cml.CASE ?? cml;

  const v2 = assignChapterRoles(scenes);
  const aftermathScene = scenes.find((s) => isAftermathFinalScene(s, scenes));

  const carrying = [];
  for (let i = 0; i < scenes.length; i += 1) {
    const scene = scenes[i];
    const chapter = Number(scene?.sceneNumber) || i + 1;
    const stageMode = aftermathScene && scene === aftermathScene ? "aftermath_consequence" : undefined;
    const arcPosition = i === scenes.length - 1 ? "resolution" : i >= scenes.length - 3 ? "climax" : "rising";
    let block = "";
    try {
      block = buildChapterObligationBlock(
        [scene], chapter, caseBlock, undefined, undefined, arts.clues, { targetWords: 1000 },
        undefined, undefined, arcPosition, undefined, undefined, scenes, stageMode, undefined, undefined, undefined,
      );
    } catch (error) {
      block = "";
    }
    if (block.includes(REVEAL_MARKER)) carrying.push(chapter);
  }

  compared += 1;
  if (carrying.length === 0) v1None += 1;
  if (carrying.length > 1) v1Many += 1;
  const v1Reveal = carrying.length > 0 ? carrying[carrying.length - 1] : null;
  if (v1Reveal === v2.roles.reveal) agree += 1;
  else {
    disagreements.push({
      projectId,
      v1: v1Reveal,
      v1All: carrying,
      v2: v2.roles.reveal,
      aftermath: v2.roles.aftermath,
      beats: scenes.map((s) => String(s?.beat ?? "-")).join(","),
    });
  }
}

console.log(`compared ${compared} archived outlines`);
console.log(`v1's reveal obligations reached NO chapter on ${v1None}; more than one on ${v1Many}`);
console.log(`v2 agrees with v1's final answer on ${agree}/${compared} (${((100 * agree) / compared).toFixed(0)}%)`);
for (const d of disagreements) {
  console.log(`  DISAGREE ${d.projectId}: v1=${d.v1} (carrying ${d.v1All.join("|") || "none"}) v2=${d.v2} aftermath=${d.aftermath}`);
  console.log(`           beats: ${d.beats}`);
}
