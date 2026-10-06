// Every stored v2 checkpoint on this machine (main checkout and every worktree), with its run id and shape.
// Usage: node ckpts.mjs [--paths]   (--paths prints only the paths, one per line, for the other probes)
import fs from "node:fs";
import path from "node:path";
const roots = ["C:/CML", ...fs.readdirSync("C:/CML/.claude/worktrees").map((d) => `C:/CML/.claude/worktrees/${d}`)];
const out = [];
const seen = new Set();
for (const r of roots) {
  const dir = `${r}/apps/worker/logs`;
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /^agent9v2-checkpoint-.*\.json$/.test(x))) {
    const p = path.posix.join(dir, f);
    let c;
    try { c = JSON.parse(fs.readFileSync(p, "utf8")); } catch { continue; }
    const key = `${c.runId}|${c.segments?.length}|${(c.segments ?? []).reduce((n, s) => n + s.drafts.length, 0)}`;
    if (seen.has(key)) continue; // the same checkpoint copied into a worktree
    seen.add(key);
    out.push({ p, runId: c.runId, segs: c.segments?.length, drafts: (c.segments ?? []).reduce((n, s) => n + s.drafts.length, 0), perSeg: (c.segments ?? []).map((s) => s.chapters.length).join("") });
  }
}
if (process.argv.includes("--paths")) for (const o of out) console.log(o.p);
else for (const o of out) console.log(o.runId, "segs", o.segs, "drafts", o.drafts, "chapters/segment", o.perSeg, "|", o.p);
