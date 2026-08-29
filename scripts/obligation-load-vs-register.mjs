// Does a chapter carrying MORE obligations write more abstractly?
//
// The ch3 retry storm (A_75 §10) showed one chapter absorbing 20 of 33 regen calls, all failing,
// after which the injector pasted. If obligation load also degrades the PROSE of that chapter, then
// clue-load balance at outline time is a prose lever and not only a cost lever.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const store = await import(pathToFileURL(join(ROOT, "apps/worker/dist/jobs/artifact-store.js")).href);
const { machineRegisterRate } = await import(pathToFileURL(join(ROOT, "packages/prose-guard/dist/machine-register.js")).href);

const rows = store.loadArtifactStore(ROOT);
const projects = [...new Set(rows.map((r) => r.project_id ?? r.projectId).filter(Boolean))];

// Find a manuscript for a project by matching the CML title against the file's heading.
const manuscripts = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (e.name.endsWith(".md") && !/readme|review|notes|debrief/i.test(e.name) && statSync(f).size > 8000) manuscripts.push(f);
  }
};
walk(join(ROOT, "stories"));
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
const headings = manuscripts.map((f) => ({ f, h: norm(readFileSync(f, "utf8").split("\n")[0].replace(/^#+\s*/, "")) }));

const points = [];
let joined = 0;

for (const p of projects) {
  const cml = store.latestArtifact(rows, p, "cml");
  const title = norm((cml?.CASE ?? cml)?.meta?.title);
  const outline = store.latestArtifact(rows, p, "outline");
  if (!title || !outline) continue;
  const hit = headings.find((x) => x.h && (x.h.includes(title.slice(0, 22)) || title.includes(x.h.slice(0, 22))));
  if (!hit) continue;

  const scenes = (outline.acts ?? []).flatMap((a) => a.scenes ?? []);
  if (scenes.length < 6) continue;
  const chapters = readFileSync(hit.f, "utf8").split(/^##\s+/m).slice(1);
  if (chapters.length !== scenes.length) continue;
  joined += 1;

  scenes.forEach((scene, i) => {
    const clues = Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed.length : 0;
    const r = machineRegisterRate(chapters[i], 3);
    if (r.sentences < 15) return;
    points.push({ load: clues, rate: r.rate * 100, pos: i / scenes.length });
  });
}

const spearman = (xs, ys) => {
  const rank = (v) => {
    const s = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const out = new Array(v.length);
    s.forEach(([, i], k) => { out[i] = k + 1; });
    return out;
  };
  const rx = rank(xs), ry = rank(ys), n = xs.length;
  const d2 = rx.reduce((a, x, i) => a + (x - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
};

console.log(`\n  books joined (outline scenes == manuscript chapters): ${joined}`);
console.log(`  chapter datapoints: ${points.length}\n`);
if (points.length < 30) { console.log("  too few to correlate.\n"); process.exit(0); }

const rho = spearman(points.map((d) => d.load), points.map((d) => d.rate));
const crit = 1.96 / Math.sqrt(points.length - 1);
console.log(`  clue obligations vs register rate: rho = ${rho.toFixed(3)}  (|rho| > ${crit.toFixed(3)} to signify)`);
console.log(`  ${Math.abs(rho) < crit ? "NOT SIGNIFICANT" : rho > 0 ? "SIGNAL: more obligations -> more abstract" : "wrong direction"}\n`);

// Bucketed view, because a monotone effect can hide in a rank correlation.
const buckets = new Map();
for (const d of points) {
  const k = Math.min(5, d.load);
  const b = buckets.get(k) ?? [];
  b.push(d.rate);
  buckets.set(k, b);
}
console.log(`    clues in chapter   n     mean register`);
for (const k of [...buckets.keys()].sort((a, b) => a - b)) {
  const v = buckets.get(k);
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  console.log(`      ${k === 5 ? "5+" : String(k).padStart(1)}                ${String(v.length).padStart(4)}   ${m.toFixed(1).padStart(5)}%  ${"#".repeat(Math.round(m))}`);
}

// WHERE do the zero-obligation chapters sit? If they are all the finale, this is section 13 again.
// If they are spread, it is a broader law: a chapter with no concrete job writes abstractly.
const zero = points.filter((d) => d.load === 0);
const bypos = new Map();
for (const d of zero) {
  const k = Math.min(9, Math.floor(d.pos * 10));
  bypos.set(k, (bypos.get(k) ?? 0) + 1);
}
console.log(`  the ${zero.length} zero-obligation chapters, by position through the book:`);
for (const k of [...bypos.keys()].sort((a, b) => a - b)) {
  console.log(`    ${String(k * 10).padStart(3)}-${String(k * 10 + 10).padEnd(3)}%  ${"*".repeat(bypos.get(k))} (${bypos.get(k)})`);
}
const late = zero.filter((d) => d.pos >= 0.8).length;
console.log(`
  in the final fifth: ${late}/${zero.length}`);
const nonZeroLate = points.filter((d) => d.load > 0 && d.pos >= 0.8);
const mean = (xs) => xs.reduce((a, b) => a + b.rate, 0) / (xs.length || 1);
console.log(`  late chapters WITH a clue job   : ${mean(nonZeroLate).toFixed(1)}%  (n=${nonZeroLate.length})`);
console.log(`  late chapters with NO clue job  : ${mean(zero.filter((d) => d.pos >= 0.8)).toFixed(1)}%  (n=${late})`);
console.log("");

// Welch's t on the position-controlled comparison, because a 3-point gap at n=18 could be noise.
const stats = (xs) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return { m, v, n: xs.length, sd: Math.sqrt(v) };
};
const welch = (A, B) => {
  const a = stats(A), b = stats(B);
  const t = (b.m - a.m) / Math.sqrt(a.v / a.n + b.v / b.n);
  return { a, b, t };
};
const lateAll = points.filter((d) => d.pos >= 0.8);
const w = welch(lateAll.filter((d) => d.load > 0).map((d) => d.rate), lateAll.filter((d) => d.load === 0).map((d) => d.rate));
console.log(`  LATE CHAPTERS ONLY (position controlled)`);
console.log(`    with a clue job : ${w.a.m.toFixed(2)}%  n=${w.a.n}  sd=${w.a.sd.toFixed(1)}`);
console.log(`    with NO clue job: ${w.b.m.toFixed(2)}%  n=${w.b.n}  sd=${w.b.sd.toFixed(1)}`);
console.log(`    difference      : ${(w.b.m - w.a.m).toFixed(2)} points, Welch t = ${w.t.toFixed(2)}  ${Math.abs(w.t) > 2 ? "SIGNIFICANT" : "not significant"}`);

const wa = welch(points.filter((d) => d.load > 0).map((d) => d.rate), points.filter((d) => d.load === 0).map((d) => d.rate));
console.log(`
  ALL CHAPTERS`);
console.log(`    with a clue job : ${wa.a.m.toFixed(2)}%  n=${wa.a.n}`);
console.log(`    with NO clue job: ${wa.b.m.toFixed(2)}%  n=${wa.b.n}`);
console.log(`    difference      : ${(wa.b.m - wa.a.m).toFixed(2)} points, Welch t = ${wa.t.toFixed(2)}  ${Math.abs(wa.t) > 2 ? "SIGNIFICANT" : "not significant"}
`);
