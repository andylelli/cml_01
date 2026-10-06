import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
setEnv(process.env.ARM ?? "OFF");
const kinds = {}; const casesBy = {};
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const test = k.roles.discriminatingTest ?? k.roles.reveal;
  const first = new Map();
  for (const s of [...k.scenes].sort((a, b) => a.chapter - b.chapter)) for (const m of s.mustSurface) if (!first.has(m.id)) first.set(m.id, s.chapter);
  for (const id of k.fairPlay.decisiveClueIds) {
    if (first.get(id) !== test) continue;
    const kind = /culprit/i.test(id) ? "culprit_*" : /discriminating|test/i.test(id) ? "discriminating/test" : "other";
    kinds[kind] = (kinds[kind] ?? 0) + 1; (casesBy[kind] ??= new Set()).add(c.id);
  }
}
console.log(JSON.stringify(kinds), JSON.stringify(Object.fromEntries(Object.entries(casesBy).map(([k, v]) => [k, v.size]))));
