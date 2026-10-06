// A_111 V-12 (V2K-01). variants.mjs re-pointed at THIS checkout's dist, plus two rows that run the REAL applyEditList
// with PROSE_V2_AUDIT_FIXES unset and "1". Mirror modes: rate (= the guard as shipped), exempt (P-2), count, off.
// The 'rate' mirror also reports how many register rollbacks kept the register HIT count (the audit's 44 of 45).
import { ROOT, editorCalls, parsePrompt, RUNS } from './vA-ctx.mjs';
import { buildContract } from './vA-contract.mjs';
const PE = await import(new URL('packages/prose-engine/dist/index.js', ROOT));
const PG = await import(new URL('packages/prose-guard/dist/index.js', ROOT));
const CML = await import(new URL('packages/cml/dist/index.js', ROOT));
delete process.env.PROSE_V2_AUDIT_FIXES;
const { contract, castNames } = buildContract('2026-10-06T17:43');
const calls = editorCalls(RUNS.B).filter(c => c.response);
const bodyOf = (ch) => (ch.paragraphs ?? []).join('\n\n');
const words = (ch) => bodyOf(ch).split(/\s+/).filter(Boolean).length;
const dials = (ch) => CML.extractClockValues(bodyOf(ch)).map(v => v.dial).sort((a,b)=>a-b).join(',');
const hits = (ch) => PG.machineRegisterRate((ch.paragraphs ?? []).join(' '), PG.REGISTER_TELEMETRY_THRESHOLD).hits;
const NEVER = ['lockedValuesIntact','clockValuesIntact','castNamesIntact','clueCoverageNotWorse','noNewScaffold','noMalformedSplice','noNewDuplicate','registerNotWorse','noOrphanedTag'];

const report = (label, finalByChapter, applied, skipped, rolled, extra = '') => {
  const book = [...finalByChapter.entries()].sort((a,b)=>a[0]-b[0]).map(([,c]) => bodyOf(c)).join('\n\n');
  const shape = PG.measurePageShape(book);
  const reg = PG.machineRegisterRate(book.replace(/\n\n/g,' '), 3);
  const nRolled = Object.values(rolled).reduce((a,b)=>a+b,0);
  console.log(`${label.padEnd(8)} applied ${applied} skipped ${skipped} rolled ${nRolled} ${JSON.stringify(rolled)} | tail/10k ${shape.tailPer10k} | register ${reg.hits}/${reg.sentences}=${reg.rate.toFixed(4)}${extra}`);
};

const run = (mode) => {
  const finalByChapter = new Map();
  let applied = 0, rolled = {}, skipped = 0, regRollbacks = 0, regKeptHits = 0;
  for (const c of calls) {
    const p = parsePrompt(c.user);
    const scene = contract.scenes.find(s => s.chapter === p.chapterNumber);
    const start = finalByChapter.get(p.chapterNumber) ?? { paragraphs: p.paragraphs };
    const opts = { scene, lockedValues: [], castNames, findings: p.findings };
    const optsNoReg = { ...opts, ignoreRegister: true };
    const measure = (ch, o) => {
      const m = PE.measureGuards(ch, o);
      if (mode === 'count') m.registerNotWorse = -hits(ch);
      if (mode === 'off') m.registerNotWorse = 0;
      return m;
    };
    const { validator: v0 } = PE.buildGuards(opts);
    const validatorFor = (o) => (ch) => { const base = v0(ch); const m = measure(ch, o); return { ...base, score: NEVER.reduce((s,k)=>s+m[k],0) }; };
    const list = PE.parseEditList(c.response);
    let cur = start; const ow = words(start), od = dials(start);
    for (const e of list.edits) {
      const body = bodyOf(cur);
      if (body.split(e.find).length - 1 !== 1 || cur.paragraphs.filter(x => x.includes(e.find)).length !== 1) { skipped++; continue; }
      const mutate = (i) => ({ ...i, paragraphs: i.paragraphs.map(x => x.includes(e.find) ? x.replace(e.find, e.replace) : x) });
      const exempt = mode === 'exempt' && PE.isStrictDeletion(e.find, e.replace);
      const o = exempt ? optsNoReg : opts;
      const before = measure(cur, o);
      const out = PG.mutateThenValidate(cur, mutate, validatorFor(o));
      if (!out.applied || out.reverted) {
        const g = PE.guardThatFell(before, measure(mutate(cur), o)) ?? 'registerNotWorse'; rolled[g] = (rolled[g] ?? 0) + 1;
        if (g === 'registerNotWorse') { regRollbacks++; if (hits(mutate(cur)) <= hits(cur)) regKeptHits++; }
        continue;
      }
      const cand = out.value;
      if (dials(cand) !== od) { rolled.clockValuesIntact = (rolled.clockValuesIntact ?? 0) + 1; continue; }
      if (Math.abs(words(cand) - ow) / Math.max(1, ow) > 0.15) { rolled.lengthWithin = (rolled.lengthWithin ?? 0) + 1; continue; }
      if (bodyOf(cand) === body) { skipped++; continue; }
      cur = cand; applied++;
    }
    finalByChapter.set(p.chapterNumber, cur);
  }
  report(mode, finalByChapter, applied, skipped, rolled, mode === 'rate' ? ` | register rollbacks ${regRollbacks}, of them hit count NOT raised ${regKeptHits}` : '');
};

// The REAL applyEditList, same R1 -> R2 chaining as the mirror.
const real = (flag) => {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
  const finalByChapter = new Map();
  let applied = 0, skipped = 0; const rolled = {};
  for (const c of calls) {
    const p = parsePrompt(c.user);
    const scene = contract.scenes.find(s => s.chapter === p.chapterNumber);
    const start = finalByChapter.get(p.chapterNumber) ?? { paragraphs: p.paragraphs };
    const r = PE.applyEditList(start, PE.parseEditList(c.response), { scene, lockedValues: [], castNames, findings: p.findings });
    applied += r.outcome.applied; skipped += r.outcome.skipped;
    for (const [g, n] of Object.entries(r.outcome.rolledBack)) rolled[g] = (rolled[g] ?? 0) + n;
    finalByChapter.set(p.chapterNumber, r.chapter);
  }
  report(flag ? 'REAL ON' : 'REAL OFF', finalByChapter, applied, skipped, rolled);
  delete process.env.PROSE_V2_AUDIT_FIXES;
};

const pre = new Map(); for (const c of calls) { const p = parsePrompt(c.user); if (!pre.has(p.chapterNumber)) pre.set(p.chapterNumber, p.paragraphs.join('\n\n')); }
const preBook = [...pre.entries()].sort((a,b)=>a[0]-b[0]).map(([,t])=>t).join('\n\n');
const s0 = PG.measurePageShape(preBook), r0 = PG.machineRegisterRate(preBook.replace(/\n\n/g,' '),3);
console.log(`env: PROSE_V2_CONTRACT_FIXES=${process.env.PROSE_V2_CONTRACT_FIXES ?? '(unset)'} PROSE_V2_TAIL_FINDING=${process.env.PROSE_V2_TAIL_FINDING ?? '(unset)'}`);
console.log(`pre-edit                                       | tail/10k ${s0.tailPer10k} | register ${r0.hits}/${r0.sentences}=${r0.rate.toFixed(4)}`);
for (const mode of ['rate','exempt','count','off']) run(mode);
real(false);
real(true);
