// V-10/V-11/V-15/V-16a together, on the five stored one-chapter-per-call checkpoints (150 drafts):
// re-score every draft with this worktree's selector OFF and ON (ON gets the book so far = the chapters the run had
// chosen before that segment), count each hard-gate kind, and count the picks that change.
// Usage: node rescore.mjs
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const ROOT = "C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2";
for (const k of ["CML_VERIFIED_FIXES", "CML_PROMPT_TRIMS"]) process.env[k] = "1";
const run = await import(pathToFileURL(`${ROOT}/apps/worker/dist/jobs/agents/agent9-v2/run.js`).href);
const pe = await import(pathToFileURL(`${ROOT}/packages/prose-engine/dist/index.js`).href);
const hyd = await import(pathToFileURL(`${ROOT}/apps/worker/dist/jobs/resume-hydration.js`).href);
const store = await import(pathToFileURL(`${ROOT}/apps/worker/dist/jobs/artifact-store.js`).href);
const st = store.loadArtifactStore(ROOT);
const FILES = [
  ["C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.json", "canary_1790272530595"],
  ["C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.pair2-2026-09-25.json", "canary_1790272530595"],
  ["C:/CML/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json", "proj_5eb8c115-ca42-4e66-997d-74fff1b327db"],
  ["C:/CML/apps/worker/logs/agent9v2-checkpoint-proj_d0ee7b26-7e02-43f2-98a6-2c4993d9d59e.json", "proj_d0ee7b26-7e02-43f2-98a6-2c4993d9d59e"],
  ["C:/CML/.claude/worktrees/a110-pair/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json", "proj_5eb8c115-ca42-4e66-997d-74fff1b327db"],
];
const contractFor = (pid) => {
  const { bundle } = hyd.loadResumeBundle(st, pid, "prose");
  const spec = store.specToInputs(store.resolveProjectSpec(ROOT, pid).spec ?? {});
  const ctx = { inputs: spec, primaryAxis: spec.primaryAxis, warnings: [] };
  hyd.applyResumeBundle(ctx, bundle);
  return { contract: pe.buildBookContract(run.buildContractInput(ctx)), clues: ctx.clues };
};
const kinds = ["book_short", "reveal_unnamed", "clue_missing", "culprit_early", "chapter_missing", "scaffold"];
const tally = { recorded: {}, off: {}, on: {} };
let drafts = 0, segs = 0, pickRecordedVsOff = 0, pickOffVsOn = 0, postReveal = 0, postRevealPickChanged = 0;
const changed = [];
for (const ranks of ["0"]) process.env.PROSE_V2_SELECTOR_RANKS = ranks;
for (const [file, pid] of FILES) {
  const ck = JSON.parse(readFileSync(file, "utf8"));
  const { contract, clues } = contractFor(pid);
  const soFarChapters = [], soFarNumbers = [];
  for (const seg of ck.segments) {
    segs++;
    const score = (flag, d) => {
      if (flag) process.env.PROSE_V2_AUDIT_FIXES = "1"; else delete process.env.PROSE_V2_AUDIT_FIXES;
      const draft = { segment: seg.index, attempt: d.attempt, chapters: d.chapters, missing: [] };
      const s = pe.scoreDraft(draft, contract, seg.chapters, { witTargetPer10k: 41, clueDistribution: clues, soFar: { chapters: [...soFarChapters], numbers: [...soFarNumbers] } });
      delete process.env.PROSE_V2_AUDIT_FIXES;
      return { draft, score: s };
    };
    const off = seg.drafts.map((d) => score(false, d));
    const on = seg.drafts.map((d) => score(true, d));
    for (const d of seg.drafts) { drafts++; for (const h of d.score.hard) tally.recorded[h.kind] = (tally.recorded[h.kind] ?? 0) + 1; }
    for (const s of off) for (const h of s.score.hard) tally.off[h.kind] = (tally.off[h.kind] ?? 0) + 1;
    for (const s of on) for (const h of s.score.hard) tally.on[h.kind] = (tally.on[h.kind] ?? 0) + 1;
    const offPick = pe.chooseDraft(off).draft.attempt;
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const onPick = pe.chooseDraft(on).draft.attempt;
    delete process.env.PROSE_V2_AUDIT_FIXES;
    if (offPick !== seg.chosen) pickRecordedVsOff++;
    if (offPick !== onPick) {
      pickOffVsOn++;
      changed.push(`${ck.runId.slice(-12)} ch${seg.chapters} OFF d${offPick} [${off.find((s) => s.draft.attempt === offPick).score.hard.map((h) => h.kind)}] -> ON d${onPick} | per draft OFF ${off.map((s) => `${s.draft.attempt}:${s.score.composite.toFixed(1)}[${s.score.hard.map((h) => h.kind.replace(/_.*/, ""))}]`).join(" ")} | ON ${on.map((s) => `${s.draft.attempt}:${s.score.composite.toFixed(1)}[${s.score.hard.map((h) => h.kind.replace(/_.*/, ""))}]`).join(" ")}`);
    }
    if (seg.chapters[0] > contract.roles.reveal) { postReveal++; if (offPick !== onPick) postRevealPickChanged++; }
    // the book so far is what the RUN chose (the recorded pick), as run.ts would have had it
    const chosen = seg.drafts.find((d) => d.attempt === seg.chosen);
    soFarChapters.push(...(chosen?.chapters ?? []));
    soFarNumbers.push(...seg.chapters);
  }
}
delete process.env.PROSE_V2_SELECTOR_RANKS;
console.log({ checkpoints: FILES.length, segments: segs, drafts });
for (const k of kinds) console.log(`${k.padEnd(16)} recorded ${String(tally.recorded[k] ?? 0).padStart(4)}   re-scored OFF ${String(tally.off[k] ?? 0).padStart(4)}   ON ${String(tally.on[k] ?? 0).padStart(4)}`);
console.log({ picksWhereRescoredOffDiffersFromRecorded: pickRecordedVsOff, picksChangedOffToOn: pickOffVsOn, postRevealSegments: postReveal, postRevealPicksChanged: postRevealPickChanged });
for (const l of changed) console.log("  ", l);
