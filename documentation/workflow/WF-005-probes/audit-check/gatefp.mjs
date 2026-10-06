// For every stored prose artifact with a story_geometry culprit: which sentences satisfy namesAsCulprit, and are any
// books satisfied ONLY by a figurative kill-verb sentence (cut/struck/pushed/shot with no person object)?
import { loadStore } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const store = loadStore();
const arts = Object.values(store.artifacts);
const byProject = new Map();
for (const a of arts) {
  if (!a.projectId) continue;
  const v = byProject.get(a.projectId) ?? {};
  if (a.type === 'story_geometry' && a.payload?.culprit) v.culprit = a.payload.culprit;
  if (a.type === 'prose' && Array.isArray(a.payload?.chapters)) (v.prose ??= []).push(a.payload);
  byProject.set(a.projectId, v);
}
const FIG = /\b(cut|struck|pushed|shot)\b(?!\s+(?:him|her|them|[A-Z][a-z]+\b))/i;
const split = (t) => t.split(/(?<=[.!?]["”’]?)\s+/);
let books = 0, onlyFig = 0, someFig = 0;
for (const [pid, v] of byProject) {
  if (!v.culprit || !v.prose) continue;
  for (const prose of v.prose) {
    books++;
    const culprits = String(v.culprit).split(/\s*(?:,| and )\s*/).filter(Boolean);
    const hits = [];
    prose.chapters.forEach((ch, i) => {
      for (const s of split((ch.paragraphs ?? []).join(' '))) for (const c of culprits) if (PE.namesAsCulprit(s, c)) hits.push({ ch: i + 1, s, fig: FIG.test(s) && !/\b(killed|murdered|poisoned|strangled|stabbed|drowned|smothered|confess|custody|arrest|guilty|responsible|murderer|killer)\b/i.test(s) });
    });
    const figHits = hits.filter(h => h.fig);
    if (figHits.length) someFig++;
    if (hits.length > 0 && figHits.length === hits.length) { onlyFig++; console.log('ONLY FIGURATIVE', pid, prose.engine ?? 'v1', culprits.join('/'), figHits.map(h => `ch${h.ch}: ${h.s.slice(0, 120)}`).join(' || ')); }
    for (const h of figHits) console.log('  fig', pid.slice(0, 14), prose.engine ?? 'v1', `ch${h.ch}`, `[${culprits.join('/')}]`, h.s.slice(0, 150));
  }
}
console.log({ books, booksWithAFigurativeCulpritMatch: someFig, booksWhoseOnlyMatchesAreFigurative: onlyFig });
