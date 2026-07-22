#!/usr/bin/env node
// A_65b Ph1.1 (reliability plan) — the preflight dist-check. The stale-dist class cost the A_64
// probe its C3 arm: a `npm run build` in a && chain silently didn't take, and the run consumed a
// dist missing the newest contract. This retires the class mechanically: for every buildable
// workspace package (packages/* + apps/worker), FAIL if any src file is newer than the newest
// dist file. Run at the top of every harness. Exit 0 = safe to run; exit 1 = stale, named.
import fs from "fs";
import path from "path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

function newestMtime(dir) {
  let newest = 0;
  let newestFile = null;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "node_modules" && e.name !== "__tests__") stack.push(p); continue; }
      // Only build inputs/outputs count — test files are excluded above; declaration maps etc. all count on the dist side.
      const st = fs.statSync(p);
      if (st.mtimeMs > newest) { newest = st.mtimeMs; newestFile = p; }
    }
  }
  return { newest, newestFile };
}

const candidates = [];
for (const base of ["packages", "apps"]) {
  const baseDir = path.join(root, base);
  if (!fs.existsSync(baseDir)) continue;
  for (const name of fs.readdirSync(baseDir)) {
    // Scope = the RUN surface (the plan's rule): every package + the worker the canary imports.
    // apps/web and apps/api never feed a generation run; their staleness must not block probes.
    if (base === "apps" && name !== "worker") continue;
    const pkgDir = path.join(baseDir, name);
    const src = path.join(pkgDir, "src");
    const dist = path.join(pkgDir, "dist");
    const pkgJson = path.join(pkgDir, "package.json");
    if (!fs.existsSync(src) || !fs.existsSync(pkgJson)) continue;
    let scripts = {};
    try { scripts = JSON.parse(fs.readFileSync(pkgJson, "utf8")).scripts ?? {}; } catch { /* skip */ }
    if (!scripts.build) continue; // not a buildable package — nothing to be stale
    candidates.push({ name: `${base}/${name}`, src, dist });
  }
}

let stale = 0;
for (const c of candidates) {
  if (!fs.existsSync(c.dist)) {
    console.error(`PREFLIGHT FAIL: ${c.name} has src + build script but NO dist — run its build.`);
    stale++;
    continue;
  }
  const s = newestMtime(c.src);
  const d = newestMtime(c.dist);
  if (s.newest > d.newest) {
    console.error(
      `PREFLIGHT FAIL: ${c.name} dist is STALE — ${path.relative(c.src, s.newestFile)} ` +
        `(${new Date(s.newest).toISOString()}) is newer than the newest dist file ` +
        `(${new Date(d.newest).toISOString()}). Rebuild before running.`,
    );
    stale++;
  }
}

if (stale > 0) {
  console.error(`\npreflight: ${stale} stale package(s) of ${candidates.length} checked — DO NOT RUN.`);
  process.exit(1);
}
console.log(`preflight: ${candidates.length} buildable packages checked — all dists current.`);
