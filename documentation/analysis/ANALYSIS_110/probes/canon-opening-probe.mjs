// A_110 Part II — how the canon opens, and whether our checkers would "repair" a canon opening.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const pg = await import(pathToFileURL(process.cwd() + '/packages/prose-guard/dist/index.js').href);
const src = fs.readFileSync('packages/prose-engine/dist/findings.js', 'utf8');
const m = src.match(/const ABSTRACT_SUBJECT =\s*\/(.+)\/i;/);
const ABSTRACT = m ? new RegExp(m[1], 'i') : null;
console.log('ABSTRACT_SUBJECT loaded from dist:', Boolean(ABSTRACT));
const dir = 'library/texts';
const DEATH = /\b(corpse|dead body|the body|lay dead|found dead|was dead|been murdered|murdered|been killed|lifeless|inquest)\b/i;
const rows = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt'))) {
  const raw = fs.readFileSync(`${dir}/${f}`, 'utf8').replace(/\r/g, '');
  // start of the story: the LAST "chapter one" heading in the first 15% (after any contents list)
  const head = raw.slice(0, Math.floor(raw.length * 0.15));
  const heads = [...head.matchAll(/^\s*(?:CHAPTER\s+(?:I|1|ONE)\b[^\n]*|I\.?\s*$|PART\s+(?:I|ONE)\b[^\n]*|BOOK\s+(?:I|ONE)\b[^\n]*)$/gim)];
  if (heads.length === 0) continue;
  const start = heads[heads.length - 1].index + heads[heads.length - 1][0].length;
  const body = raw.slice(start);
  const total = (body.match(/[A-Za-z][A-Za-z'’]*/g) || []).length;
  if (total < 20000) continue;
  const q = body.search(/["“]\w/);
  const wordsBeforeQuote = (body.slice(0, q < 0 ? body.length : q).match(/[A-Za-z][A-Za-z'’]*/g) || []).length;
  const d = body.search(DEATH);
  const wordsBeforeDeath = d < 0 ? total : (body.slice(0, d).match(/[A-Za-z][A-Za-z'’]*/g) || []).length;
  const paras = body.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(p => p.length > 60);
  const firstParaQuote = /^["“]/.test(paras[0] || '');
  // the first 25 narration sentences of the opening: would our checkers flag them?
  const sents = paras.slice(0, 12).join(' ').split(/(?<=[.!?])\s+/).filter(s => !/["“”]/.test(s) && s.split(/\s+/).length >= 6).slice(0, 25);
  const reg = sents.filter(s => pg.scoreSentenceRegister(s).score >= pg.REGISTER_TELEMETRY_THRESHOLD).length;
  const abs = ABSTRACT ? sents.filter(s => ABSTRACT.test(s)).length : 0;
  rows.push({ f, total, wordsBeforeQuote, fracQuote: wordsBeforeQuote / total, wordsBeforeDeath, fracDeath: wordsBeforeDeath / total, firstParaQuote, sents: sents.length, reg, abs });
}
const med = (k) => { const a = rows.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
const pct = (k, p) => { const a = rows.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length * p)]; };
console.log(`canon texts with a findable chapter one: ${rows.length}`);
console.log(`first paragraph opens on a quotation mark: ${rows.filter(r => r.firstParaQuote).length}/${rows.length}`);
console.log(`words of narration before the first spoken line: median ${med('wordsBeforeQuote')}  p25 ${pct('wordsBeforeQuote', 0.25)}  p75 ${pct('wordsBeforeQuote', 0.75)};  under 30 words: ${rows.filter(r => r.wordsBeforeQuote < 30).length};  120 or more: ${rows.filter(r => r.wordsBeforeQuote >= 120).length}`);
console.log(`first death word (corpse / the body / murdered / found dead / inquest…): median at word ${med('wordsBeforeDeath')} = ${(med('fracDeath') * 100).toFixed(1)}% of the text;  p25 ${(pct('fracDeath', 0.25) * 100).toFixed(1)}%  p75 ${(pct('fracDeath', 0.75) * 100).toFixed(1)}%;  within the first 300 words: ${rows.filter(r => r.wordsBeforeDeath <= 300).length}/${rows.length};  within the first 2%: ${rows.filter(r => r.fracDeath <= 0.02).length}`);
console.log(`scaled to a 12,600-word book: the median canon death word falls at word ${(med('fracDeath') * 12600).toFixed(0)}; p25 at ${(pct('fracDeath', 0.25) * 12600).toFixed(0)}`);
const S = rows.reduce((s, r) => s + r.sents, 0), R = rows.reduce((s, r) => s + r.reg, 0), A = rows.reduce((s, r) => s + r.abs, 0);
console.log(`our checkers on the canon's opening narration (${S} sentences): register_sentence would fire on ${R} (${(R / S * 100).toFixed(1)}%), abstract_subject on ${A} (${(A / S * 100).toFixed(1)}%); texts with at least one hit in their first 25 narration sentences: ${rows.filter(r => r.reg + r.abs > 0).length}/${rows.length}`);
