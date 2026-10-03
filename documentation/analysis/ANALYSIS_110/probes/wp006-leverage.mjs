// A_110 Part IV — WP-006's kit applied to A_110's plan. Read-only; writes nothing.
// Run from the repo root after `npm run build:all`:
//   node --max-old-space-size=6000 documentation/analysis/ANALYSIS_110/probes/wp006-leverage.mjs [budget] [witness] [dedup] [null] [k7] [k16] [specimen] [reservoir]
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
process.env.CML_VERIFIED_FIXES = process.env.CML_VERIFIED_FIXES ?? 'true';
const ROOT = process.cwd();
const parts = new Set(process.argv.slice(2));
const want = p => parts.size === 0 || parts.has(p);
const here = p => pathToFileURL(join(ROOT, p)).href;
const pe = await import(here('packages/prose-engine/dist/index.js'));
const pg = await import(here('packages/prose-guard/dist/index.js'));
const PROJECT = 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db';
const MS = 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md';
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const byProject = new Map(); for (const a of store.artifacts) { if (!byProject.has(a.projectId)) byProject.set(a.projectId, {}); byProject.get(a.projectId)[a.type] = a.payload; }
const art = byProject.get(PROJECT);
const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const sdv = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pearson = (x, y) => { const mx = mean(x), my = mean(y); let n = 0, dx = 0, dy = 0; for (let i = 0; i < x.length; i++) { n += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; } return n / Math.sqrt(dx * dy); };
const fisher = (r, n) => { const z = Math.atanh(r), se = 1 / Math.sqrt(n - 3); return [Math.tanh(z - 1.96 * se), Math.tanh(z + 1.96 * se)]; };
const wilson = (k, n) => { if (!n) return 'n/a'; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return `${k}/${n} = ${(p * 100).toFixed(0)}% [${(Math.max(0, c - h) * 100).toFixed(0)}–${(Math.min(1, c + h) * 100).toFixed(0)}]`; };
const mulberry32 = a => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const toks = s => (s.toLowerCase().replace(/[’]/g, "'").match(/[a-z]+(?:'[a-z]+)?/g) || []);
const say = (...a) => console.log(...a);
const raw = fs.readFileSync(MS, 'utf8');
const titles = [...raw.matchAll(/^## Chapter (\d+): (.*)$/gm)].map(m => m[2]);
const chapters = raw.split(/^## Chapter \d+: .*$/m).slice(1).map((c, i) => ({ number: i + 1, title: titles[i], paragraphs: c.replace(/^---\s*$/gm, '').trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) }));
const bookText = chapters.map(c => c.paragraphs.join('\n\n')).join('\n\n');
// WP-006's cast signature (unique-case-sameness.mjs): six commonest mid-sentence capitalised words; four shared = one case.
const castSignature = text => { const c = new Map(); for (const m of text.matchAll(/[a-z,;] ([A-Z][a-z]{2,})/g)) c.set(m[1], (c.get(m[1]) ?? 0) + 1); return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w); };
const cluster = items => { const parent = items.map((_, i) => i); const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i]))); for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) if (items[i].sig.filter(w => items[j].sig.includes(w)).length >= 4) parent[find(i)] = find(j); return items.map((_, i) => find(i)); };
const SENT = s => s.replace(/\s+/g, ' ').split(/(?<=[.!?]["”']?)\s+(?=["“']?[A-Z])/).filter(x => x.split(' ').length >= 3);
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/i;
const findingsSrc = fs.readFileSync('packages/prose-engine/dist/findings.js', 'utf8');
const reFrom = name => { const m = findingsSrc.match(new RegExp(`const ${name} =\\s*\\/(.+)\\/([a-z]*);`)); return m ? new RegExp(m[1], m[2].replace('g', '')) : null; };
const ABSTRACT = reFrom('ABSTRACT_SUBJECT'), OPERATION = reFrom('OPERATION_NARRATED');

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('budget')) {
  say('\n## B. WP-006 §4.4 — toBudget is a prefix rule: does it explain A_110 R2 (3 of 11 pairs missing)?');
  const pairs = (art.cast.cast ?? art.cast).relationships.pairs;
  let tokens = 0, kept = 0, firstDropped = null; const budget = pe.estimateTokens ? 600 : 600;
  const costs = pairs.map(p => { const line = `  ${p.character1} & ${p.character2} (${p.tension} tension): ${p.relationship} ${p.sharedHistory}`; return Math.ceil(line.length / 4) + 1; });
  for (const [i, c] of costs.entries()) { if (tokens + c > budget) { firstDropped ??= i; continue; } if (firstDropped === null) { tokens += c; kept++; } }
  const fitsLater = costs.map((c, i) => i > (firstDropped ?? 99) && tokens + c <= budget);
  say(`line costs (tokens): ${costs.join(', ')}  | budget 600 | prefix keeps ${kept} (${tokens} tokens), stops at pair ${firstDropped + 1}; any later line that would still fit: ${fitsLater.some(Boolean)}`);
  say(`dropped: ${pairs.slice(kept).map(p => `${p.character1.split(' ')[0]}–${p.character2.split(' ')[0]}`).join(', ')}`);
  const living = new Set(((art.cast.cast ?? art.cast).characters).filter(c => !/victim/i.test(`${c.role} ${c.roleArchetype}`)).map(c => c.name));
  const victimPairs = pairs.filter(p => !living.has(p.character1) || !living.has(p.character2)).length;
  say(`pairs involving the victim (they still matter: who he was to each person): ${victimPairs} of ${pairs.length};  pairs between two living people: ${pairs.length - victimPairs}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('witness')) {
  say('\n## W. WP-006 §2.4 / K5 — can the "passage the book has already used" finding fire on this book?');
  const whole = chapters.map(c => c.paragraphs.join(' ')).join(' ');
  const d = pg.repetitionDensity(whole);
  say(`repetitionDensity: ${d.worst.length} worst spans; their word counts: ${d.worst.slice(0, 5).map(w => w.span.split(/\s+/).length).join(', ')};  MIN_QUOTE_WORDS = ${pe.MIN_QUOTE_WORDS}`);
  say(`worst spans: ${d.worst.slice(0, 5).map(w => `"${w.span}" ×${w.count}`).join(' | ')}`);
  const fired = pe.collectCheckerFindings(chapters, pe.buildBookContract({ cml: art.cml, clues: art.clues, outline: art.outline, cast: art.cast.cast ?? art.cast, profiles: art.character_profiles, world: art.world_document, locations: art.location_profiles, temporal: art.temporal_context, setting: art.setting, lockedFacts: [], humourLevel: 'classic' }), chapters.map(c => c.number), {}).filter(f => f.class === 'repeat_passage').length;
  say(`repeat_passage findings on this book: ${fired}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('dedup')) {
  say('\n## D. WP-006 §6–§7 — effective n: A_110\'s populations counted by distinct case');
  // (a) the 64 stored projects behind the linter: cluster by cast-name set
  const projs = [];
  for (const [pid, a] of byProject) { if (!a.cml || !a.outline || !a.cast || !a.character_profiles || !a.clues) continue; const names = ((a.cast.cast ?? a.cast).characters ?? []).map(c => c.name); projs.push({ pid, a, sig: names.map(n => n.split(' ').pop()).concat(names.map(n => n.split(' ')[0])) , names }); }
  const parentP = (() => { const parent = projs.map((_, i) => i); const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i]))); for (let i = 0; i < projs.length; i++) for (let j = i + 1; j < projs.length; j++) { const sh = projs[i].names.filter(n => projs[j].names.includes(n)).length; if (sh >= Math.min(4, projs[i].names.length - 1)) parent[find(i)] = find(j); } return projs.map((_, i) => find(i)); })();
  const distinctP = [...new Map(projs.map((p, i) => [parentP[i], p])).values()];
  say(`(a) projects with a contract: ${projs.length}; distinct casts (4+ shared names): ${distinctP.length}`);
  let v1 = 0, v4 = 0, n = 0, w6 = 0, wch = 0;
  for (const p of distinctP) {
    const a = p.a; let c; try { c = pe.buildBookContract({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: 'classic' }); } catch { continue; }
    n++; const victim = c.fairPlay.victim, cul = new Set(c.fairPlay.culprits), reveal = c.roles.reveal;
    if (c.scenes.flatMap(s => s.eliminationsAllowed.map(e => e.name)).includes(victim)) v1++;
    if (!c.scenes.find(s => s.chapter === reveal)?.present.some(x => cul.has(x))) v4++;
    for (const s of c.scenes) if (s.beats.wit) { wch++; const on = s.present.filter(x => x !== victim && !(s.chapter > reveal && cul.has(x))); if ([s.beats.wit.name, ...s.beats.wit.shapes.map(x => x.name)].some(x => !on.includes(x))) w6++; }
  }
  say(`    on one project per cast: victim cleared ${wilson(v1, n)};  culprit off the reveal page ${wilson(v4, n)};  wit owner off the page ${wilson(w6, wch)} of wit chapters`);
  // (b) the 25 v2 drafts behind §14 and §22.1: distinct cases by THE CASE text
  const runs = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream('logs/llm-prompts-full.jsonl') });
  for await (const line of rl) {
    if (!line.includes('Agent9v2-')) continue; let r; try { r = JSON.parse(line); } catch { continue; }
    const key = r.runId || r.projectId; const e = runs.get(key) ?? {}; const t = (r.messages || []).map(m => typeof m.content === 'string' ? m.content : '').join('\n');
    if (/^Agent9v2-Writer/.test(r.agent) && !e.caseHash) e.caseHash = crypto.createHash('md5').update((t.match(/## THE CASE[\s\S]*?(?=\n## THE PEOPLE)/) || [''])[0]).digest('hex').slice(0, 8);
    if (/^Agent9v2-Critic/.test(r.agent) && !e.critic) e.critic = t; runs.set(key, e);
  }
  const withDraft = [...runs.values()].filter(e => e.critic && e.caseHash);
  const cases = new Set(withDraft.map(e => e.caseHash));
  say(`(b) v2 runs with a draft: ${withDraft.length}; distinct cases: ${cases.size}.  Rates in §14/§22.1 carry about ${cases.size} independent cases, not ${withDraft.length} (and chapters within a book are correlated, so "250 chapters" is fewer still).`);
  // (c) the manuscripts behind L2 and the floors: cluster by WP-006's cast signature
  const docs = [];
  for (const root of ['stories', 'stories/_archive']) for (const name of fs.readdirSync(root)) {
    const dir = join(root, name); if (name === '_archive' || !fs.statSync(dir).isDirectory()) continue; const date = (name.match(/(\d{8}-\d{4})/) || [])[1]; if (!date) continue;
    const md = fs.readdirSync(dir).find(f => f.endsWith('.md')); if (!md) continue; const text = fs.readFileSync(join(dir, md), 'utf8').replace(/^#.*$/gm, ''); const w = toks(text); if (w.length < 8000) continue;
    const g = new Map(); for (let i = 0; i + 4 <= w.length; i++) { const k = w.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
    const clock = (text.match(/\b(?:(?:a )?quarter (?:to|past)|half past|(?:five|ten|twenty|twenty-five) minutes? (?:to|past))\s+\w+|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) o'clock\b/gi) || []).length;
    const z = text.replace(/\s+/g, ' ').trim(); const gz = z.length >= 60000 ? zlib.deflateSync(Buffer.from(z.slice(0, 60000).toLowerCase()), { level: 9 }).length / 60000 : null;
    docs.push({ date, sig: castSignature(text), rep: rep / w.length * 1e4, clock: clock / w.length * 1e4, gz });
  }
  docs.sort((a, b) => a.date.localeCompare(b.date));
  const roots = cluster(docs); const newest = new Map(); docs.forEach((d, i) => newest.set(roots[i], d)); const uniq = [...newest.values()];
  const rank = a => { const s = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]); const r = Array(a.length); s.forEach(([, i], k) => r[i] = k); return r; };
  const rho = (xs, ys) => pearson(rank(xs), rank(ys));
  const recent = uniq.filter(d => d.date >= '20260918');
  say(`(c) manuscripts ≥ 8,000 words: ${docs.length}; distinct casts: ${uniq.length}; since 2026-09-18: ${docs.filter(d => d.date >= '20260918').length} manuscripts → ${recent.length} casts`);
  say(`    L2 — clock density vs repeated 4-grams, Spearman: all casts ${rho(uniq.map(d => d.clock), uniq.map(d => d.rep)).toFixed(2)} (n ${uniq.length});  casts since 09-18 ${recent.length >= 5 ? rho(recent.map(d => d.clock), recent.map(d => d.rep)).toFixed(2) : 'n<5'} (n ${recent.length})`);
  const gzU = uniq.filter(d => d.gz != null);
  say(`    §24 floor (compressed ratio < 0.346) on distinct casts: ${wilson(gzU.filter(d => d.gz < 0.346).length, gzU.length)};  since 09-18: ${wilson(gzU.filter(d => d.gz < 0.346 && d.date >= '20260918').length, gzU.filter(d => d.date >= '20260918').length)}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// canon narration sentences, shared by `null` and `k7`
const canonTexts = () => { const out = []; for (const f of fs.readdirSync('library/texts').filter(f => f.endsWith('.txt'))) { const t = fs.readFileSync(`library/texts/${f}`, 'utf8').replace(/\r/g, ''); if (t.length > 120000) out.push({ f, t }); } return out; };

if (want('null')) {
  say('\n## N. WP-006 §3.4–§3.5 / K9 — the canon as the null for the editor\'s checkers');
  const narr = s => !/["“”]/.test(s) && s.split(/\s+/).length >= 6;
  const canonSents = []; const perText = [];
  for (const { t } of canonTexts()) { const win = t.slice(60000, 100000); const ss = SENT(win).filter(narr).slice(0, 200); canonSents.push(...ss); perText.push(ss); }
  const ourSents = SENT(bookText).filter(narr);
  const reg = s => pg.scoreSentenceRegister(s).score;
  const cs = canonSents.map(reg), os = ourSents.map(reg);
  const T = pg.REGISTER_TELEMETRY_THRESHOLD;
  const rate = (xs, f) => xs.filter(f).length / xs.length;
  say(`narration sentences: canon ${canonSents.length} (from ${perText.length} texts), this book ${ourSents.length}`);
  say(`register_sentence (score ≥ ${T}):  canon ${(rate(cs, x => x >= T) * 100).toFixed(1)}%   book ${(rate(os, x => x >= T) * 100).toFixed(1)}%   ratio ${(rate(os, x => x >= T) / rate(cs, x => x >= T)).toFixed(2)}`);
  for (const th of [4, 5, 6, 7, 8]) say(`    at score ≥ ${th}: canon ${(rate(cs, x => x >= th) * 100).toFixed(1)}%   book ${(rate(os, x => x >= th) * 100).toFixed(1)}%   ratio ${(rate(os, x => x >= th) / Math.max(1e-9, rate(cs, x => x >= th))).toFixed(2)}`);
  const ab = s => ABSTRACT.test(s), op = s => OPERATION.test(s), tl = s => TAIL.test(s);
  say(`abstract_subject:   canon ${(rate(canonSents, ab) * 100).toFixed(2)}%   book ${(rate(ourSents, ab) * 100).toFixed(2)}%`);
  say(`operation_narrated: canon ${(rate(canonSents, op) * 100).toFixed(2)}%   book ${(rate(ourSents, op) * 100).toFixed(2)}%`);
  say(`body-part tail (A_110 L6 candidate): canon ${(rate(canonSents, tl) * 100).toFixed(2)}%   book ${(rate(ourSents, tl) * 100).toFixed(2)}%   ratio ${(rate(ourSents, tl) / rate(canonSents, tl)).toFixed(1)}`);
  // K9: the per-chapter cap of 8 register findings — how many canon "chapters" (2,500-word windows) would carry 8?
  const chapWin = []; for (const { t } of canonTexts()) for (let k = 0; k < 3; k++) { const w = t.slice(60000 + k * 15000, 60000 + k * 15000 + 15000); chapWin.push(SENT(w).filter(narr).filter(s => reg(s) >= T).length); }
  say(`per-chapter (~2,500-word window) register hits in the canon: median ${med(chapWin)}; windows with 8 or more (the editor's cap): ${wilson(chapWin.filter(x => x >= 8).length, chapWin.length)}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('k7')) {
  say('\n## K7. WP-006 K7/K8 — A_110\'s §24 instruments as classifiers against the reads (and the canon floor as a rule)');
  const { parseExternalRead, splitReads } = await import(here('scripts/external-read-ledger.mjs'));
  const rows = [];
  for (const root of ['stories', 'stories/_archive']) for (const name of fs.readdirSync(root)) {
    const dir = join(root, name); if (name === '_archive' || !fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir); const read = files.find(f => /^chatgpt/i.test(f)); const md = files.find(f => f.endsWith('.md')); if (!read || !md) continue;
    const rr = fs.readFileSync(join(dir, read), 'utf8'); const all = splitReads(rr).map(s => parseExternalRead(s)).filter(r => r.final != null); const p = all.length ? all[all.length - 1] : parseExternalRead(rr); if (p.final == null) continue;
    const text = fs.readFileSync(join(dir, md), 'utf8').replace(/^\*Run ID:.*$/m, '').replace(/^#.*$/gm, '').replace(/^---$/gm, '');
    const w = toks(text); if (w.length < 8000) continue; const z = text.replace(/\s+/g, ' ').trim(); if (z.length < 60000) continue;
    const win = z.slice(0, 60000); const ss = SENT(win); const lens = ss.map(x => x.split(' ').length); const mu = mean(lens), s2 = lens.reduce((a, x) => a + (x - mu) ** 2, 0) / lens.length;
    let ac = 0; for (let i = 1; i < lens.length; i++) ac += (lens[i] - mu) * (lens[i - 1] - mu); ac /= (lens.length - 1) * s2;
    const first = new Map(); for (const x of ss) { const f = (x.replace(/^["“']/, '').match(/^[A-Za-z']+/) || [''])[0].toLowerCase(); first.set(f, (first.get(f) || 0) + 1); }
    const H = -[...first.values()].reduce((a, c) => a + (c / ss.length) * Math.log2(c / ss.length), 0);
    const W8 = w.slice(0, 8000); const types8 = new Set(W8).size;
    const pts = []; const seen = new Set(); for (let i = 0; i < 8000; i++) { seen.add(W8[i]); if ((i + 1) % 500 === 0) pts.push([Math.log(i + 1), Math.log(seen.size)]); }
    const mx = mean(pts.map(p => p[0])), my = mean(pts.map(p => p[1])); const beta = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
    const g = new Map(); for (let i = 0; i + 4 <= w.length; i++) { const k = w.slice(i, i + 4).join(' '); g.set(k, (g.get(k) || 0) + 1); } let rep = 0; for (const v of g.values()) if (v >= 3) rep += v;
    const tail = (text.match(new RegExp(TAIL.source, 'gi')) || []).length / w.length * 1e4;
    rows.push({ name, date: (name.match(/(\d{8})/) || [])[1], final: p.final, prose: p.categories?.prose ?? p.categories?.Prose ?? null, sig: castSignature(text), gz: zlib.deflateSync(Buffer.from(win.toLowerCase()), { level: 9 }).length / 60000, H, ac, beta, types8, rep: rep / w.length * 1e4, tail });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  const roots = cluster(rows); const newest = new Map(); rows.forEach((r, i) => newest.set(roots[i], r)); const uniq = [...newest.values()];
  const proseKey = Object.keys(rows.find(r => r.prose != null) ?? {}).length ? 'prose' : null;
  const inst = [['gz', 'compressed ratio'], ['H', 'opener entropy'], ['ac', 'length autocorrelation'], ['beta', 'Heaps β (8k)'], ['types8', 'distinct words / 8k'], ['rep', 'repeated 4-grams /10k'], ['tail', 'body-part tail /10k']];
  // K8: simulated 95% bar for the largest |r| of k tests at n
  const bar = (n, k, B = 4000) => { const rng = mulberry32(7); const g = () => { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }; const mx = []; for (let b = 0; b < B; b++) { const y = Array.from({ length: n }, g); let m = 0; for (let j = 0; j < k; j++) { const x = Array.from({ length: n }, g); m = Math.max(m, Math.abs(pearson(x, y))); } mx.push(m); } return med(mx.sort((a, b) => a - b).slice(Math.floor(B * 0.9))); };
  for (const [label, set] of [['every full-length read', rows], ['one read per distinct cast (newest)', uniq]]) {
    const pr = set.filter(r => r.prose != null);
    const k = inst.length * 2; const b = bar(set.length, k, 1500);
    say(`\n${label}: n = ${set.length} (prose mark on ${pr.length});  K8 bar for the largest of ${k} tests ≈ ${b.toFixed(2)}`);
    for (const [key, lab] of inst) {
      const r1 = pearson(set.map(r => r[key]), set.map(r => r.final)); const ci = fisher(r1, set.length);
      const r2 = pr.length > 5 ? pearson(pr.map(r => r[key]), pr.map(r => r.prose)) : NaN;
      say(`   ${lab.padEnd(24)} r(headline) ${r1.toFixed(2)} [${ci[0].toFixed(2)}, ${ci[1].toFixed(2)}]   r(prose) ${Number.isFinite(r2) ? r2.toFixed(2) : 'n/a'}${Math.abs(r1) > b || Math.abs(r2) > b ? '   ← clears the bar' : ''}`);
    }
  }
  // the §24 floor as a rule (K7): base rate, mean difference, SE
  const rule = (set, f, lab) => { const a = set.filter(f), b = set.filter(r => !f(r)); if (a.length < 2 || b.length < 2) return say(`   ${lab}: flagged ${a.length}/${set.length} — too few to test`); const d = mean(a.map(r => r.final)) - mean(b.map(r => r.final)); const se = Math.sqrt(sdv(a.map(r => r.final)) ** 2 / a.length + sdv(b.map(r => r.final)) ** 2 / b.length); say(`   ${lab}: flagged ${a.length}/${set.length};  flagged minus unflagged headline ${d.toFixed(1)} ± ${se.toFixed(1)}`); };
  say('\nK7 — the canon floors as rules, over one read per cast:');
  rule(uniq, r => r.gz < 0.346, 'compressed ratio below the canon minimum 0.346');
  rule(uniq, r => r.H < 5.12, 'opener entropy below the canon minimum 5.12');
  rule(uniq, r => r.ac < 0.016, 'length autocorrelation below the canon minimum 0.016');
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('k16')) {
  say('\n## S. WP-006 K16 — selection margin: does a ±20% change in any weight change the winner?');
  const CAL = { register: { mean: 0.1204, sd: 0.0334, w: -3 }, repetition: { mean: 53.6857, sd: 94.3212, w: -1 }, speech: { mean: 0.1337, sd: 0.0513, w: 1.5 }, longS: { mean: 0.0402, sd: 0.0135, w: 1 }, wit: { mean: 8.7245, sd: 6.9637, w: 1 } };
  const segs = [];
  for (const ev of store.runEvents) for (const s of String(ev.message || '').split(/(?=\[Agent 9 v2\] segment \d+ drafts:)/)) {
    if (!/^\[Agent 9 v2\] segment \d+ drafts:/.test(s)) continue;
    const d = [...s.matchAll(/(\*?)\s*draft (\d+): composite ([-\d.]+), hard (\d+) ranking of (\d+), register ([\d.]+), repetition ([\d.]+), speech-open (\d+)%, tail (\d+)%, wit ([\d.]+)\/(\d+)/g)].map(m => ({ chosen: m[1] === '*', comp: +m[3], rank: +m[4], register: Math.max(+m[6], 0.058), repetition: +m[7], speech: +m[8] / 100, longS: +m[9] / 100, wit: +m[10] }));
    if (d.length >= 2) segs.push(d);
  }
  const score = (x, W, scale = 'cal', sds) => Object.keys(CAL).reduce((s, k) => s + W[k] * (x[k] - CAL[k].mean) / (scale === 'cal' ? CAL[k].sd : sds[k]), 0);
  const base = Object.fromEntries(Object.keys(CAL).map(k => [k, CAL[k].w]));
  const winner = (d, W, scale, sds) => { const minRank = Math.min(...d.map(x => x.rank)); const pool = d.map((x, i) => [x, i]).filter(([x]) => x.rank === minRank); return pool.sort((a, b) => score(b[0], W, scale, sds) - score(a[0], W, scale, sds))[0][1]; };
  let agree = 0; for (const d of segs) if (d[winner(d, base, 'cal')].chosen) agree++;
  say(`selections: ${segs.length};  probe's recomputed winner matches the logged choice in ${agree} (the logged composite also has an em-dash term the summary line omits)`);
  const flips = {}; for (const k of Object.keys(CAL)) { let f = 0; for (const d of segs) { const w0 = winner(d, base, 'cal'); for (const m of [0.8, 1.2]) { if (winner(d, { ...base, [k]: base[k] * m }, 'cal') !== w0) { f++; break; } } } flips[k] = f; }
  say(`picks that change when ONE weight moves ±20% (of ${segs.length}): ${JSON.stringify(flips)}`);
  let zero = {}; for (const k of Object.keys(CAL)) { let f = 0; for (const d of segs) if (winner(d, { ...base, [k]: 0 }, 'cal') !== winner(d, base, 'cal')) f++; zero[k] = f; }
  say(`picks that change when ONE weight is set to 0: ${JSON.stringify(zero)}`);
  const within = {}; for (const k of Object.keys(CAL)) { const dev = []; for (const d of segs) { const m = mean(d.map(x => x[k])); dev.push(...d.map(x => x[k] - m)); } within[k] = Math.sqrt(dev.reduce((a, x) => a + x * x, 0) / Math.max(1, dev.length - segs.length)) || 1; }
  let changed = 0; for (const d of segs) if (winner(d, base, 'between', within) !== winner(d, base, 'cal')) changed++;
  say(`A_110 M6 (standardise on between-draft SD, same written weights): picks that change ${changed} of ${segs.length}`);
  const noReg = { ...base, register: 0 }; let c2 = 0; for (const d of segs) if (winner(d, noReg, 'between', within) !== winner(d, base, 'cal')) c2++;
  say(`M6 plus K1 (register weight 0, because its slope is zero since 1 September): picks that change ${c2} of ${segs.length}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('specimen')) {
  say('\n## P. WP-006 K11 — specimen audit: every example list in a v2 instruction, against v2 output and the canon');
  const runs = new Map(); const instr = new Set();
  const rl = readline.createInterface({ input: fs.createReadStream('logs/llm-prompts-full.jsonl') });
  for await (const line of rl) {
    if (!line.includes('Agent9v2-')) continue; let r; try { r = JSON.parse(line); } catch { continue; }
    const key = r.runId || r.projectId; const e = runs.get(key) ?? {}; const t = (r.messages || []).map(m => typeof m.content === 'string' ? m.content : '').join('\n');
    if (/^Agent9v2-Writer/.test(r.agent)) {
      if (!e.caseHash) e.caseHash = crypto.createHash('md5').update((t.match(/## THE CASE[\s\S]*?(?=\n## THE PEOPLE)/) || [''])[0]).digest('hex').slice(0, 8);
      const brief = (t.match(/## THE BRIEF[\s\S]*?(?=## THE CHAPTERS TO WRITE)/) || [''])[0];
      const i = t.lastIndexOf('## THE CHAPTERS TO WRITE'); let end = t.indexOf('THE BOOK SO FAR', i); if (end < 0) end = t.indexOf('Write the chapters below', i);
      const contract = i >= 0 ? t.slice(i, end < 0 ? i + 4000 : end) : '';
      for (const line2 of (brief + '\n' + contract).split('\n')) {
        if (/^\s*(A reader must be able to use|Already on the page|Where:|On the page:|The clock:)/.test(line2)) continue; // case content, not instruction
        // a list after a dash or a colon: two or more comma-separated items of 2–7 words. An item with a capital
        // after its first word is a name — case content, not a specimen.
        for (const m of line2.matchAll(/[—:]\s+([^.;:—]+?,[^.;:—]+)(?=[.;—]|$)/g)) {
          const items = m[1].split(/,\s*|\s+or\s+|\s+and\s+/).map(s => s.trim().replace(/^(a|an|the)\s+/i, '')).filter(s => !/\s[A-Z]/.test(s) && !/^[A-Z][a-z]+'s\b/.test(s)).map(s => s.toLowerCase()).filter(s => s.split(/\s+/).length >= 2 && s.split(/\s+/).length <= 7);
          if (items.length >= 2) for (const it of items) instr.add(it);
        }
      }
    }
    if (/^Agent9v2-Critic/.test(r.agent) && !e.critic) e.critic = t.toLowerCase().replace(/[’]/g, "'");
    runs.set(key, e);
  }
  const byCase = new Map(); for (const e of runs.values()) if (e.critic && e.caseHash) byCase.set(e.caseHash, e.critic); // newest per case
  const drafts = [...byCase.values()];
  const canonSample = canonTexts().map(({ t }) => t.slice(30000, 130000).toLowerCase()).join(' ');
  const canonWords = toks(canonSample).length; const draftWords = drafts.reduce((a, d) => a + toks(d).length, 0);
  const rows = [];
  for (const it of instr) {
    const content = it.split(/\s+/).filter(w => w.length > 3);
    if (content.length === 0) continue;
    // each word may take a plural ("doors unlocked" is the specimen "door unlocked"); a fresh regex per test,
    // because a global regex carries lastIndex from one string to the next and undercounts
    const src = `\\b${it.split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:s|es)?').join('\\s+')}\\b`;
    const re = new RegExp(src, 'g');
    const inDrafts = drafts.filter(d => new RegExp(src).test(d)).length;
    const uses = drafts.reduce((a, d) => a + (d.match(re) || []).length, 0); const cu = (canonSample.match(re) || []).length;
    rows.push({ it, inDrafts, uses, ours: uses / draftWords * 1e4, canon: cu / canonWords * 1e4 });
  }
  rows.sort((a, b) => b.uses - a.uses);
  for (const k of ['empty chair', 'door unlocked', 'letter sent']) say(`known positive "${k}": extracted ${instr.has(k)}; uses ${rows.find(r => r.it === k)?.uses ?? 'n/a'}`);
  say(`instruction specimens found: ${instr.size};  v2 drafts, one per case: ${drafts.length} (${draftWords} words);  canon sample ${canonWords} words`);
  say('specimen (as listed in an instruction)        books  uses  ours/10k  canon/10k  ratio');
  for (const r of rows.filter(r => r.uses > 0).slice(0, 25)) say(`  ${r.it.slice(0, 44).padEnd(44)} ${String(r.inDrafts).padStart(4)}  ${String(r.uses).padStart(4)}   ${r.ours.toFixed(2).padStart(6)}   ${r.canon.toFixed(2).padStart(6)}   ${r.canon > 0 ? (r.ours / r.canon).toFixed(0) + '×' : 'canon 0'}`);
  say(`specimens never printed: ${rows.filter(r => r.uses === 0).length} of ${rows.length}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────
if (want('reservoir')) {
  say('\n## R. WP-006 §4.1 — the lexicon as a growth law: this book, and the reservoir the owner\'s points 1–4 would draw on');
  const w = toks(bookText); const W8 = w.slice(0, 8000); const seen = new Set(); const pts = [];
  for (let i = 0; i < 8000; i++) { seen.add(W8[i]); if ((i + 1) % 500 === 0) pts.push([Math.log(i + 1), Math.log(seen.size)]); }
  const mx = mean(pts.map(p => p[0])), my = mean(pts.map(p => p[1])); const beta = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
  say(`this book: Heaps β on the first 8,000 tokens ${beta.toFixed(3)} (WP-006: ours median 0.585, canon median 0.688, canon p10 0.636);  distinct words in 8,000 tokens ${seen.size} (ours median 1,670, canon median 1,806)`);
  const bookTypes = new Set(w);
  const STOP = new Set('the a an and or but of to in on at by for with from as is was were be been being had has have do did does not no this that these those it its his her hers he she they them their there then than which who whom whose what when where while if into out up down over under again once only just very can could should would will shall may might must now here all any each every some such own same other more most also both few'.split(' '));
  const ABSTRACT_W = /(ness|ity|ism|tion|sion|ment|ance|ence|ical|ally|ous|ive|ize|ise)$/;
  const concreteFrom = obj => { const out = new Set(); const walk = v => { if (typeof v === 'string') for (const t of toks(v)) { if (t.length >= 4 && !STOP.has(t) && !ABSTRACT_W.test(t)) out.add(t); } else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(obj); return out; };
  const lp = art.location_profiles, tc = art.temporal_context, st = art.setting.setting ?? art.setting;
  const sources = {
    'place (2c: primary visual + paragraphs 1–3, key-location visuals and senses)': [lp.primary.visualDescription, lp.primary.paragraphs.slice(0, 3), lp.keyLocations.map(k => [k.visualDetails, k.sensoryDetails])],
    'period (2d: fashion, daily life, prices, technology)': [tc.fashion, tc.cultural?.dailyLife, tc.cultural?.technology, tc.seasonal?.weather],
    'setting (1: location, isolation, policing, transport)': [st.location, st.era?.transportation, st.era?.policing, st.era?.communication],
    'people (2: occupations, personas)': ((art.cast.cast ?? art.cast).characters).map(c => [c.occupation, c.publicPersona]),
  };
  let union = new Set();
  for (const [lab, src] of Object.entries(sources)) { const c = concreteFrom(src); const fresh = [...c].filter(t => !bookTypes.has(t)); fresh.forEach(t => union.add(t)); say(`   ${lab.padEnd(78)} concrete types ${String(c.size).padStart(4)}, absent from the book ${String(fresh.length).padStart(4)}   e.g. ${fresh.slice(0, 8).join(', ')}`); }
  say(`   union absent from the book: ${union.size} types;  the book's whole-text vocabulary: ${bookTypes.size} types`);
}
