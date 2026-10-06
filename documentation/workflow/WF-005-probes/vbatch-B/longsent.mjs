// The selector's long-sentence share: how many of its ">30-word sentences" are two sentences glued across a closing quote?
import fs from 'node:fs';
const PE = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js');
const files = [
  'C:/CML/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json',
  'C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.json',
  'C:/CML/apps/worker/logs/agent9v2-checkpoint-proj_d0ee7b26-7e02-43f2-98a6-2c4993d9d59e.json',
];
const selectorSplit = (t) => t.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
const fixedSplit = (t) => t.split(/(?<=[.!?]["”’']?)\s+/).filter((s) => s.trim());
let drafts = 0, longSel = 0, longGlued = 0, longFixed = 0, flips = 0, segs = 0;
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const s of c.segments) {
    const shares = [];
    for (const d of s.drafts) {
      drafts++;
      const body = d.chapters.map((ch) => (ch.paragraphs ?? []).join('\n\n')).join('\n\n');
      const sel = selectorSplit(body);
      const L = sel.filter((x) => x.split(/\s+/).filter(Boolean).length > 30);
      longSel += L.length;
      longGlued += L.filter((x) => /\n\n/.test(x) || /[”"]\s+[“"A-Z]/.test(x)).length;
      const fx = fixedSplit(body);
      const LF = fx.filter((x) => x.split(/\s+/).filter(Boolean).length > 30);
      longFixed += LF.length;
      shares.push({ a: d.attempt, sel: L.length / sel.length, fix: LF.length / fx.length, recorded: d.score.vector.longSentenceShare });
    }
    // does the order of drafts on this instrument change?
    segs++;
    const order = (k) => [...shares].sort((x, y) => y[k] - x[k]).map((x) => x.a).join('');
    if (order('sel') !== order('fix')) flips++;
  }
}
console.log({ drafts, longBySelector: longSel, ofWhichGluedAcrossAClosingQuoteOrParagraph: longGlued, longWithQuoteAwareSplit: longFixed, segmentsWhereDraftOrderOnThisInstrumentChanges: `${flips} of ${segs}` });
// Re-choose with the long-sentence term measured by a quote-aware split.
const CAL = PE.CALIBRATION.longSentenceShare;
for (const mode of ['0', '1']) {
  process.env.PROSE_V2_SELECTOR_RANKS = mode;
  let changed = 0, total = 0;
  for (const f of files) {
    const c = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const s of c.segments) {
      const mk = (fix) => s.drafts.map((d) => {
        const body = d.chapters.map((ch) => (ch.paragraphs ?? []).join('\n\n')).join('\n\n');
        const sp = fix ? fixedSplit(body) : selectorSplit(body);
        const share = sp.filter((x) => x.split(/\s+/).filter(Boolean).length > 30).length / sp.length;
        const contrib = CAL.weight * (share - CAL.mean) / CAL.sd;
        const old = d.score.contributions.longSentenceShare;
        return { draft: { attempt: d.attempt, chapters: d.chapters, missing: [] }, score: { ...d.score, composite: d.score.composite - old + contrib, contributions: { ...d.score.contributions, longSentenceShare: contrib } } };
      });
      total++;
      const a = PE.chooseDraft(mk(false)).draft.attempt, b = PE.chooseDraft(mk(true)).draft.attempt;
      if (a !== b) changed++;
    }
  }
  console.log(`ranks=${mode}: chosen draft changes in ${changed} of ${total} segments when long sentences are counted with a quote-aware split`);
}
// vbatch-B, V-16a: the BUILT instrument (PE.measureInstruments) OFF vs ON — per paragraph, after a closing quote — and
// the re-choice with only the long-sentence term changed.
{
  const shareOf = (flag, chapters) => {
    if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
    const v = PE.measureInstruments(chapters).longSentenceShare;
    delete process.env.PROSE_V2_AUDIT_FIXES;
    return v;
  };
  for (const mode of ['0', '1']) {
    process.env.PROSE_V2_SELECTOR_RANKS = mode;
    let changed = 0, total = 0;
    for (const f of files) {
      for (const s of JSON.parse(fs.readFileSync(f, 'utf8')).segments) {
        const mk = (flag) => s.drafts.map((d) => {
          const contrib = CAL.weight * (shareOf(flag, d.chapters) - CAL.mean) / CAL.sd;
          const old = d.score.contributions.longSentenceShare;
          return { draft: { attempt: d.attempt, chapters: d.chapters, missing: [] }, score: { ...d.score, composite: d.score.composite - old + contrib, contributions: { ...d.score.contributions, longSentenceShare: contrib } } };
        });
        total++;
        if (PE.chooseDraft(mk(false)).draft.attempt !== PE.chooseDraft(mk(true)).draft.attempt) changed++;
      }
    }
    console.log(`BUILT instrument, ranks=${mode}: chosen draft changes in ${changed} of ${total} segments OFF -> ON`);
  }
  delete process.env.PROSE_V2_SELECTOR_RANKS;
  let longOff = 0, longOn = 0, sentOff = 0, sentOn = 0;
  for (const f of files) for (const s of JSON.parse(fs.readFileSync(f, 'utf8')).segments) for (const d of s.drafts) {
    const body = d.chapters.map((ch) => (ch.paragraphs ?? []).join('\n\n')).join('\n\n');
    const off = body.split(/(?<=[.!?])\s+/).filter((x) => x.trim());
    const on = body.split(/\n\s*\n/).flatMap((p) => p.split(/(?<=[.!?]["”']?)\s+/)).filter((x) => x.trim());
    sentOff += off.length; sentOn += on.length;
    longOff += off.filter((x) => x.split(/\s+/).filter(Boolean).length > 30).length;
    longOn += on.filter((x) => x.split(/\s+/).filter(Boolean).length > 30).length;
  }
  console.log({ sentencesOFF: sentOff, sentencesON: sentOn, over30wordsOFF: longOff, over30wordsON: longOn });
}
