#!/usr/bin/env node
// Builds documentation/code-review/LEDGER.md: one row per finding (§3), incidental defect (§9) and
// owner question (§11) in the twelve area reports, joined to tools/ledger-state.tsv (CR item, status,
// commit, note). The reports are the source of the items; the state file is the only thing edited by
// hand. `--check` fails if LEDGER.md is stale, the state names an item no report has, or any item has
// no CR assignment.
//
//   node documentation/code-review/tools/build-ledger.mjs          # write LEDGER.md
//   node documentation/code-review/tools/build-ledger.mjs --check  # CI / pre-commit
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AREAS = join(ROOT, 'areas');
const STATE = join(ROOT, 'tools', 'ledger-state.tsv');
const OUT = join(ROOT, 'LEDGER.md');
const STATUSES = ['todo', 'wip', 'done', 'decided', 'deferred', 'withdrawn', 'dup'];

const clean = (s) => s
  .replace(/\*\*/g, '').replace(/`/g, '').replace(/\|/g, '/')
  .replace(/\s+/g, ' ').trim();
const short = (s, n = 150) => { const c = clean(s); return c.length > n ? c.slice(0, n - 1).trimEnd() + '…' : c; };
const pad = (n) => String(n).padStart(2, '0');

function section(lines, num) {
  const start = lines.findIndex((l) => new RegExp(`^## ${num}\\.`).test(l));
  if (start < 0) return [];
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start + 1, end < 0 ? lines.length : end);
}

// Top-level numbered items or table rows; continuation lines are dropped (the title is the first line).
function listItems(body) {
  const items = [];
  for (const l of body) {
    const num = l.match(/^(\d+)\.\s+(.*)$/);
    const row = l.match(/^\|\s*(D?\d+)\s*\|\s*(.*?)\s*\|/);
    const dash = l.match(/^- (.*)$/);
    if (num) items.push(num[2]);
    else if (row) items.push(row[2]);
    else if (dash) items.push(dash[1]);
  }
  return items;
}

function parseArea(file) {
  const lines = readFileSync(join(AREAS, file), 'utf8').split(/\r?\n/);
  const area = file.slice(0, 2);
  const findings = [];
  for (const l of section(lines, 3)) {
    const m = l.match(/^\|\s*([A-Z0-9]+-\d+)\s*\|\s*(P\d)\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|\s*([^|]*)\|/);
    if (m) findings.push({ key: m[1], kind: 'finding', area, p: m[2], title: m[4], risk: clean(m[5]), effort: clean(m[6]) });
  }
  if (!findings.length) throw new Error(`${file}: no findings table in §3`);
  const prefix = findings[0].key.split('-')[0];
  const defects = listItems(section(lines, 9)).map((t, i) => ({ key: `${prefix}-D${pad(i + 1)}`, kind: 'defect', area, title: t }));
  const questions = listItems(section(lines, 11)).map((t, i) => ({ key: `${prefix}-Q${pad(i + 1)}`, kind: 'question', area, title: t }));
  return { file, prefix, items: [...findings, ...defects, ...questions] };
}

function readState() {
  const state = new Map();
  if (!existsSync(STATE)) return state;
  for (const [i, line] of readFileSync(STATE, 'utf8').split(/\r?\n/).entries()) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [key, cr = '', status = 'todo', commit = '', note = ''] = line.split('\t');
    if (!STATUSES.includes(status)) throw new Error(`ledger-state.tsv:${i + 1}: unknown status "${status}"`);
    state.set(key, { cr, status, commit, note });
  }
  return state;
}

// CR items and the findings they name, from the README tracker (used only to seed an empty state).
function trackerCr() {
  const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
  const map = new Map();
  for (const l of readme.split(/\r?\n/)) {
    const m = l.match(/^\|\s*(CR-\d+)\s*\|[^|]*\|[^|]*\|[^|]*\|\s*([^|]*)\|/);
    if (!m) continue;
    for (const ref of m[2].matchAll(/\b([A-Z][A-Z0-9]*\d?[A-Z]?)-(\d+)((?:\/\d+)*)/g)) {
      const nums = [ref[2], ...ref[3].split('/').filter(Boolean)];
      for (const n of nums) {
        const k = `${ref[1]}-${pad(Number(n))}`;
        if (!map.has(k)) map.set(k, m[1]);
      }
    }
  }
  return map;
}

const areas = readdirSync(AREAS).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map(parseArea);
const items = areas.flatMap((a) => a.items);
const state = readState();
const errors = [];

if (state.size === 0) {
  const seed = trackerCr();
  for (const it of items) state.set(it.key, { cr: seed.get(it.key) ?? '', status: 'todo', commit: '', note: '' });
  const rows = items.map((it) => [it.key, state.get(it.key).cr, 'todo', '', ''].join('\t'));
  writeFileSync(STATE, ['# key\tcr\tstatus\tcommit\tnote   (edit this file; LEDGER.md is generated)', ...rows].join('\n') + '\n');
  console.log(`seeded ${STATE} with ${rows.length} items`);
}

const keys = new Set(items.map((i) => i.key));
for (const k of state.keys()) if (!keys.has(k)) errors.push(`state names ${k}, which no area report has`);
for (const it of items) if (!state.has(it.key)) errors.push(`${it.key} is in a report but not in ledger-state.tsv`);

const joined = items.map((it) => ({ ...it, ...(state.get(it.key) ?? { cr: '', status: 'todo', commit: '', note: '' }) }));
const unassigned = joined.filter((i) => !i.cr && !['withdrawn', 'dup', 'decided'].includes(i.status));

// ---- render
const count = (arr, f) => arr.filter(f).length;
const kinds = ['finding', 'defect', 'question'];
const closed = (i) => ['done', 'decided', 'withdrawn', 'dup'].includes(i.status);
const out = [];
out.push('# Code review ledger — every item, one row');
out.push('');
out.push('**GENERATED** by `tools/build-ledger.mjs` from the twelve area reports and `tools/ledger-state.tsv`.');
out.push('Do not edit this file: change the state file and re-run. `--check` fails on drift or an unassigned item.');
out.push('');
out.push('Keys: `XXX-NN` finding (§3) · `XXX-Dnn` incidental defect (§9, numbered in report order) · `XXX-Qnn` owner');
out.push('question (§11). Status: ' + STATUSES.map((s) => `\`${s}\``).join(' · ') + '.');
out.push('');
out.push('## Totals');
out.push('');
out.push('| | ' + kinds.join(' | ') + ' | all |');
out.push('|---|' + kinds.map(() => '---:').join('|') + '|---:|');
const line = (label, f) => out.push(`| ${label} | ` + kinds.map((k) => count(joined, (i) => i.kind === k && f(i))).join(' | ') + ` | ${count(joined, f)} |`);
line('items', () => true);
line('closed', closed);
line('open', (i) => !closed(i));
line('**unassigned**', (i) => unassigned.includes(i));
out.push('');

const crs = [...new Set(joined.map((i) => i.cr).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
out.push('## By CR item');
out.push('');
out.push('| CR | items | closed | keys |');
out.push('|---|---:|---:|---|');
for (const cr of crs) {
  const its = joined.filter((i) => i.cr === cr);
  out.push(`| ${cr} | ${its.length} | ${count(its, closed)} | ${its.map((i) => i.key).join(' ')} |`);
}
out.push('');

// The decision sheet: every open owner question, in the order the CR items are worked.
const openQs = joined.filter((i) => i.kind === 'question' && !closed(i))
  .sort((a, b) => a.cr.localeCompare(b.cr, 'en', { numeric: true }) || a.key.localeCompare(b.key));
out.push('## Decision sheet — open owner questions by CR');
out.push('');
out.push('Answer in `ledger-state.tsv`: set the status to `decided` and put the answer in the note.');
out.push('');
out.push('| CR | Key | Question | Answer |');
out.push('|---|---|---|---|');
for (const q of openQs) out.push(`| ${q.cr} | ${q.key} | ${short(q.title, 260)} | ${clean(q.note)} |`);
out.push('');

for (const a of areas) {
  out.push(`## ${a.file.replace(/\.md$/, '')}`);
  out.push('');
  out.push('| Key | P | Risk | CR | Status | Commit | Item | Note |');
  out.push('|---|---|---|---|---|---|---|---|');
  for (const i of joined.filter((j) => j.area === a.file.slice(0, 2))) {
    out.push(`| ${i.key} | ${i.p ?? ''} | ${i.risk ?? ''} | ${i.cr || '**—**'} | ${i.status} | ${i.commit} | ${short(i.title)} | ${clean(i.note)} |`);
  }
  out.push('');
}
const text = out.join('\n');

if (process.argv.includes('--check')) {
  if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== text) errors.push('LEDGER.md is stale: re-run build-ledger.mjs');
  if (unassigned.length) errors.push(`${unassigned.length} open items have no CR: ${unassigned.slice(0, 12).map((i) => i.key).join(' ')}${unassigned.length > 12 ? ' …' : ''}`);
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`ledger ok: ${joined.length} items, ${count(joined, closed)} closed`);
} else {
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  writeFileSync(OUT, text);
  console.log(`wrote LEDGER.md: ${joined.length} items (${kinds.map((k) => `${count(joined, (i) => i.kind === k)} ${k}s`).join(', ')}), ${unassigned.length} unassigned`);
}
