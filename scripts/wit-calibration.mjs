/**
 * WIT CALIBRATION — regenerate the constants in `packages/prose-guard/src/wit-density.ts`.
 *
 *     node scripts/wit-calibration.mjs
 *
 * Prints every canon novel and every shipped manuscript with its four shape densities, then the
 * medians the module's constants are set from. Run it after ANY change to the four detectors: the
 * vocabulary and the constants have to move together, or the module reports a book against a
 * baseline measured by different code.
 *
 * The shapes here are a mirror of the module's, kept deliberately standalone so the calibration does
 * not depend on a built dist.
 *
 * Four candidate shapes, all deterministic. The question is not "do they detect wit" — it is whether
 * they SEPARATE 12 real Golden Age novels from our own manuscripts. A measure that does not
 * discriminate is not an instrument, and this probe is written to find that out before anything ships.
 */
import fs from "node:fs";
import path from "node:path";

const DIMINISHER = /\b(?:somewhat|rather|a little|a trifle|hardly|scarcely|barely|not entirely|not altogether|slightly|mildly|moderately|tolerably|passably|not wholly)\b/i;
const GRAVE = /\b(?:dead|death|died|murder|murdered|murdering|killed|killing|corpse|body|blood|poison|poisoning|stabbed|stabbing|shot|shooting|strangled|strangling|drowned|drowning|hanging|disaster|ruin|ruined|catastrophe|tragedy|fatal|hanged|grave|funeral|inquest|post-mortem)\b/i;
const COURTESY = /\b(?:i am sure|i'm sure|no doubt|of course|how kind|how very|if you say so|delightful|charming|most obliging|by all means|naturally|to be sure|quite so|indeed)\b/i;
const HOSTILE = /\b(?:lie|lied|lying|liar|fool|foolish|stupid|idiot|absurd|ridiculous|nonsense|useless|incompetent|vulgar|tiresome|insufferable|impertinent|disgrace|shameful|worthless|contempt)\b/i;

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

/** Quoted speeches in order, with the gap of narration between them. */
const speeches = (text) => {
  const out = [];
  const re = /[“"]([^”"]{2,600})[”"]/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push({ body: m[1].trim(), at: m.index });
  return out;
};

export const witShapes = (text) => {
  const sp = speeches(text);
  let retort = 0, understate = 0, savagery = 0, flatAnswer = 0;

  for (let i = 0; i < sp.length; i++) {
    const cur = sp[i], prev = i > 0 ? sp[i - 1] : null;
    const w = words(cur.body);
    // 1. THE SHORT RETORT — a <=6-word speech immediately after a >=15-word one, close by.
    if (prev && w <= 6 && words(prev.body) >= 15 && cur.at - prev.at < 700) retort++;
    // 4. THE FLAT ANSWER — a <=4-word speech answering a question.
    if (prev && /\?[”"]?\s*$/.test(prev.body) && w <= 4) flatAnswer++;
  }
  // 2. UNDERSTATEMENT — a diminisher and a grave word in one sentence.
  // 3. POLITE SAVAGERY — a courtesy marker and a hostile word in one sentence.
  for (const s of text.split(/(?<=[.!?])\s+/)) {
    if (DIMINISHER.test(s) && GRAVE.test(s)) understate++;
    if (COURTESY.test(s) && HOSTILE.test(s)) savagery++;
  }
  const total = words(text);
  const per10k = (n) => +((10000 * n) / Math.max(1, total)).toFixed(1);
  return {
    words: total,
    retort, understate, savagery, flatAnswer,
    per10k: {
      retort: per10k(retort), understate: per10k(understate),
      savagery: per10k(savagery), flatAnswer: per10k(flatAnswer),
      all: per10k(retort + understate + savagery + flatAnswer),
    },
  };
};

const rows = [];
for (const f of fs.readdirSync("library/texts").filter((x) => x.endsWith(".txt"))) {
  const t = fs.readFileSync(path.join("library/texts", f), "utf8");
  const r0 = witShapes(t);
  if (r0.words < 6000) continue;  // a fragment cannot be measured; same floor as our books
  rows.push({ kind: "CANON", name: f.replace(/\.txt$/, "").slice(0, 30), ...r0 });
}
for (const d of fs.readdirSync("stories")) {
  let st; try { st = fs.statSync(path.join("stories", d)); } catch { continue; }
  if (!st.isDirectory()) continue;
  const f = fs.readdirSync(path.join("stories", d)).find((x) => x.endsWith(".md"));
  if (!f) continue;
  const t = fs.readFileSync(path.join("stories", d, f), "utf8");
  const r = witShapes(t);
  if (r.words < 6000) continue;
  rows.push({ kind: "OURS", name: d.replace("story_", ""), ...r });
}

const fmt = (n) => String(n).padStart(6);
console.log("kind   book                            words  retort  under  savage   flat    ALL /10k");
for (const r of rows.sort((a, b) => a.kind.localeCompare(b.kind) || b.per10k.all - a.per10k.all)) {
  console.log(`${r.kind.padEnd(6)} ${r.name.padEnd(30)} ${String(r.words).padStart(6)} ${fmt(r.per10k.retort)} ${fmt(r.per10k.understate)} ${fmt(r.per10k.savagery)} ${fmt(r.per10k.flatAnswer)} ${fmt(r.per10k.all)}`);
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : +(((s[s.length / 2 - 1] + s[s.length / 2]) / 2).toFixed(1)); };
for (const k of ["retort", "understate", "savagery", "flatAnswer", "all"]) {
  const c = rows.filter((r) => r.kind === "CANON").map((r) => r.per10k[k]);
  const o = rows.filter((r) => r.kind === "OURS").map((r) => r.per10k[k]);
  const ratio = med(o) === 0 ? "inf" : (med(c) / med(o)).toFixed(2);
  console.log(`${k.padEnd(12)} canon median ${String(med(c)).padStart(6)}   ours median ${String(med(o)).padStart(6)}   canon/ours ${ratio}`);
}
