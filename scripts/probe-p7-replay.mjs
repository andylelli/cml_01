// P7 pre-flight (T2 archive replay, £0): if AGENT9_CLUE_TIME_WORDFORM were ON, how many stored cases
// would Agent 9 ABORT on that it currently lets through? detectLockedFactClueTimeMismatch feeds
// cmlIntegrityViolations, which throws before prose generation (agent9-run.ts:4344).
import fs from 'node:fs';

const mod = await import('./apps/worker/dist/jobs/agents/agent9-run.js');
const detect = mod.detectLockedFactClueTimeMismatch;
if (typeof detect !== 'function') { console.log('NOT EXPORTED:', Object.keys(mod).filter(k => /Mismatch|Clue/.test(k))); process.exit(1); }

const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const walk = (o, pred, out = [], d = 0) => { if (!o || typeof o !== 'object' || d > 9) return out; if (pred(o)) out.push(o); for (const v of Array.isArray(o) ? o : Object.values(o)) walk(v, pred, out, d + 1); return out; };

// Pair by projectId — artifacts are keyed {id, projectId, type, payload}; order-pairing would misalign.
const byProject = {};
for (const a of store.artifacts ?? []) {
  if (a.type !== 'hard_logic_devices' && a.type !== 'clues') continue;
  (byProject[a.projectId] ??= {})[a.type] = a.payload;   // latest artifact per type wins
}
const pairsByProject = Object.values(byProject).filter(p => p.hard_logic_devices && p.clues);
console.log('projects with BOTH device + clue artifacts:', pairsByProject.length);

const n = pairsByProject.length;
const run = (flag) => {
  process.env.AGENT9_CLUE_TIME_WORDFORM = flag;
  let violations = 0, runsWithViolation = 0, pairs = 0;
  for (let i = 0; i < n; i++) {
    const dev = pairsByProject[i].hard_logic_devices;
    const cl = pairsByProject[i].clues;
    const devices = Array.isArray(dev?.devices) ? dev.devices : (Array.isArray(dev?.hardLogicDevices?.devices) ? dev.hardLogicDevices.devices : []);
    const facts = devices.flatMap(d => d.lockedFacts ?? []);
    const clues = Array.isArray(cl?.clues) ? cl.clues : [];
    let hit = 0;
    for (const f of facts) {
      const fv = String(f?.value ?? '');
      if (!fv) continue;
      for (const c of clues) {
        const ct = String(c?.description ?? '');
        pairs++;
        try { if (detect(fv, ct)) { violations++; hit++; } } catch {}
      }
    }
    if (hit) runsWithViolation++;
  }
  return { violations, runsWithViolation, pairs };
};
const off = run('0'); const on = run('1');
console.log('flag OFF:', JSON.stringify(off));
console.log('flag ON :', JSON.stringify(on));
console.log(`\nverdict: enabling adds ${on.violations - off.violations} mismatch detections across ${n} archived runs; runs that would newly ABORT: ${on.runsWithViolation - off.runsWithViolation}`);
