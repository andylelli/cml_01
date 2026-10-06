// Mirror of applyEditList with the register guard parameterised; validated against the real one in 'rate' mode.
import { editorCalls, parsePrompt, RUNS } from './ctx.mjs';
import { buildContract } from './contract.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const CML = await import('file:///C:/CML/packages/cml/dist/index.js');
const { contract, castNames } = buildContract('2026-10-06T17:43');
const calls = editorCalls(RUNS.B).filter(c => c.response);
const bodyOf = (ch) => (ch.paragraphs ?? []).join('\n\n');
const words = (ch) => bodyOf(ch).split(/\s+/).filter(Boolean).length;
const dials = (ch) => CML.extractClockValues(bodyOf(ch)).map(v => v.dial).sort((a,b)=>a-b).join(',');
const hits = (ch) => PG.machineRegisterRate((ch.paragraphs ?? []).join(' '), PG.REGISTER_TELEMETRY_THRESHOLD).hits;

const run = (mode) => {
  const finalByChapter = new Map();
  let applied = 0, rolled = {}, skipped = 0;
  for (const c of calls) {
    const p = parsePrompt(c.user);
    const scene = contract.scenes.find(s => s.chapter === p.chapterNumber);
    // R2 prompts carry the post-R1 text from the run; in a variant the R1 result differs, so R2 starts from OUR R1 result.
    const start = finalByChapter.get(p.chapterNumber) ?? { paragraphs: p.paragraphs };
    const opts = { scene, lockedValues: [], castNames, findings: p.findings };
    const optsNoReg = { ...opts, ignoreRegister: true };
    const measure = (ch, o) => {
      const m = PE.measureGuards(ch, o);
      if (mode === 'count') m.registerNotWorse = -hits(ch);
      if (mode === 'off') m.registerNotWorse = 0;
      return m;
    };
    const NEVER = ['lockedValuesIntact','clockValuesIntact','castNamesIntact','clueCoverageNotWorse','noNewScaffold','noMalformedSplice','noNewDuplicate','registerNotWorse','noOrphanedTag'];
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
      if (!out.applied || out.reverted) { const g = PE.guardThatFell(before, measure(mutate(cur), o)) ?? 'registerNotWorse'; rolled[g] = (rolled[g] ?? 0) + 1; continue; }
      const cand = out.value;
      if (dials(cand) !== od) { rolled.clockValuesIntact = (rolled.clockValuesIntact ?? 0) + 1; continue; }
      if (Math.abs(words(cand) - ow) / Math.max(1, ow) > 0.15) { rolled.lengthWithin = (rolled.lengthWithin ?? 0) + 1; continue; }
      if (bodyOf(cand) === body) { skipped++; continue; }
      cur = cand; applied++;
    }
    finalByChapter.set(p.chapterNumber, cur);
  }
  const book = [...finalByChapter.entries()].sort((a,b)=>a[0]-b[0]).map(([,c]) => bodyOf(c)).join('\n\n');
  const shape = PG.measurePageShape(book);
  const reg = PG.machineRegisterRate(book.replace(/\n\n/g,' '), 3);
  const nRolled = Object.values(rolled).reduce((a,b)=>a+b,0);
  console.log(`${mode.padEnd(7)} applied ${applied} skipped ${skipped} rolled ${nRolled} ${JSON.stringify(rolled)} | tail/10k ${shape.tailPer10k} | register ${reg.hits}/${reg.sentences}=${reg.rate.toFixed(4)}`);
  return book;
};
// original input book (pre-edit R1 texts)
const pre = new Map(); for (const c of calls) { const p = parsePrompt(c.user); if (!pre.has(p.chapterNumber)) pre.set(p.chapterNumber, p.paragraphs.join('\n\n')); }
const preBook = [...pre.entries()].sort((a,b)=>a[0]-b[0]).map(([,t])=>t).join('\n\n');
const s0 = PG.measurePageShape(preBook), r0 = PG.machineRegisterRate(preBook.replace(/\n\n/g,' '),3);
console.log(`pre-edit                                       | tail/10k ${s0.tailPer10k} | register ${r0.hits}/${r0.sentences}=${r0.rate.toFixed(4)}`);
for (const mode of ['rate','exempt','count','off']) run(mode);
