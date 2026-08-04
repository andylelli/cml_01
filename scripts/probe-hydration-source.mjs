/**
 * N5 acceptance probe (architecture/REVIEW_05.md §10.5).
 *
 * The single assertion the item was written around: replaying `run_20260802-1654` must hydrate the
 * 10-beat outline (attempt 18), not the 9-scene one (attempt 20). Run against every archived run so
 * that "which source answered" is a table rather than an impression.
 *
 *   node scripts/probe-hydration-source.mjs
 */

import fs from "fs/promises";
import path from "path";
import { readLatestAgentJson } from "./canary-loop/hydrate.mjs";

const workspaceRoot = process.cwd();
const runsRoot = path.join(workspaceRoot, "documentation", "prompts", "actual");

const extractResponseJson = (markdown) => {
  const block = markdown.match(/##\s+Response Body[\s\S]*?```text\s*([\s\S]*?)```/i);
  if (!block) throw new Error("no response body block");
  return JSON.parse(block[1].trim());
};

const sceneTitles = (outline) =>
  (outline?.acts ?? []).flatMap((act) => act?.scenes ?? []).map((s) => s?.title);

const runFolders = (await fs.readdir(runsRoot)).filter((n) => n.startsWith("run_")).sort();

for (const folder of runFolders) {
  const runFolder = path.join(runsRoot, folder);
  let runState;
  try {
    runState = JSON.parse(await fs.readFile(path.join(runFolder, ".actual-run-state.json"), "utf8"));
  } catch {
    continue;
  }

  const attempts = (runState.records ?? []).filter((r) => /Agent7-Narrative/.test(r.agent ?? "")).length;
  process.stdout.write(`\n${folder}  (${attempts} outline attempt(s), projectId=${runState.projectId || "none"})\n  `);

  try {
    const outline = await readLatestAgentJson(runState, runFolder, "7", async (p) =>
      extractResponseJson(await fs.readFile(p, "utf8")),
    );
    const titles = sceneTitles(outline);
    console.log(`  -> ${titles.length} chapters: ${titles.slice(0, 3).join(" / ")}…`);
  } catch (err) {
    console.log(`  -> unresolved: ${err.message}`);
  }
}
