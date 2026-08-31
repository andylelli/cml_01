#!/usr/bin/env node
/**
 * A_79 Phase E — the calibration corpus.
 *
 *   node scripts/calibration-measure.mjs [--write]
 *
 * ── WHAT THIS IS FOR ─────────────────────────────────────────────────────────────────────────────
 *
 * A_75 found `prose` is the lowest-scoring of the ten categories, has never been given a 9, and that
 * **every prose signal we own counts defects** — so the category has no gradient above zero. We now
 * hold 719,552 words of real Golden Age prose in `library/texts/`. These are the first
 * upward-pointing measures this project owns: not "you did this wrong" but "the canon does this much
 * of this, and you do that much".
 *
 * Every measure is deterministic and costs nothing. Every one reports CANON vs US, because a number
 * on its own is not a target — the gap is the finding.
 *
 * ── THE CORRECTION TO §6, WHICH MATTERS MORE THAN ANY SINGLE NUMBER ──────────────────────────────
 *
 * A_79 §6 argues that a sentence-length target "drawn from Father Brown has a shape behind it;
 * voice-spec's arbitrary 22.0 words/sentence did not, and was ignored in 10 chapters out of 10". The
 * implication is that a canon-derived rate would be obeyed where an invented one was not.
 *
 * **That is not what was measured.** A_75's matched pair asked for 19.5-word sentences and got 15.01
 * — SHORTER than the unguided arm — while the same prompt asking for semicolon-linked clauses moved
 * semicolons from 5 to 13. CLAUDE.md states the rule outright: this model complies with OPERATIONS
 * and ignores STATISTICS. Where a target comes from does not change that; a canon-derived 22.0 will
 * be ignored exactly as an invented 22.0 was.
 *
 * So the register measure below reports **countable operations** — semicolons, em-dashes, sentences
 * opened on a subordinate clause, paragraphs opened on dialogue — alongside the distributions. The
 * distributions are for diagnosis. The operations are the only part that can become an instruction.
 *
 * ── WHAT IS DELIBERATELY NOT EMITTED ─────────────────────────────────────────────────────────────
 *
 * No verbatim sentence of any source novel appears in any output. The openings measure reports what
 * an opening DOES — names a person, states a time, opens on speech — never what it says. Phase D's
 * gate exists because Phase E could put period prose near a prompt; the cheapest way to honour that
 * is for Phase E to emit no prose at all.
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/CML";
const TEXTS = `${ROOT}/library/texts`;
const STORIES = `${ROOT}/stories`;
const OUT = `${ROOT}/library/calibration`;
const WRITE = process.argv.includes("--write");

// ── corpora ──────────────────────────────────────────────────────────────────────────────────────
const canon = {};
for (const f of readdirSync(TEXTS).filter((x) => x.endsWith(".txt"))) {
  canon[f.replace(/\.txt$/, "")] = readFileSync(join(TEXTS, f), "utf8");
}
const ours = {};
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md") && statSync(p).size > 4000) ours[p.replace(`${STORIES}/`, "")] = readFileSync(p, "utf8");
  }
};
if (existsSync(STORIES)) walk(STORIES);

// ── shared tokenising ────────────────────────────────────────────────────────────────────────────
/** Strip Gutenberg front/back matter and markdown chrome so the measures see prose, not furniture. */
const body = (text) => {
  let t = String(text);
  const start = t.search(/\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG/i);
  const end = t.search(/\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG/i);
  if (start >= 0) t = t.slice(t.indexOf("\n", start) + 1);
  if (end >= 0) t = t.slice(0, end > start ? end - (start >= 0 ? start : 0) : undefined);
  return t
    .replace(/^#{1,6} .*$/gm, "")          // markdown headings
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")    // rules
    .replace(/^\s*>.*$/gm, "");            // block quotes
};

const sentences = (text) =>
  body(text)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])["'\u2019\u201d]?\s+(?=[A-Z"'\u2018\u201c])/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);

const words = (text) => body(text).toLowerCase().match(/[a-z][a-z'-]*/g) ?? [];

const per1000 = (count, total) => (total === 0 ? 0 : Number(((1000 * count) / total).toFixed(2)));
const pct = (a, b) => (b === 0 ? 0 : Number(((100 * a) / b).toFixed(1)));
const median = (xs) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const quantile = (xs, q) => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
};

// ── 2. REGISTER — distributions for diagnosis, OPERATIONS for instruction ────────────────────────
const SUBORDINATORS =
  /\b(although|though|because|since|while|whereas|unless|until|before|after|when|whenever|if|as|once|whilst)\b/gi;

const registerOf = (text) => {
  const sents = sentences(text);
  const w = words(text);
  const lens = sents.map((s) => s.split(/\s+/).length);
  const raw = body(text);
  /**
   * Curly quotes are written as unicode escapes ON PURPOSE. The first version used literal curly
   * characters; they were flattened to straight quotes on the way to disk, and since the Gutenberg
   * texts contain ZERO straight double quotes the measure reported the canon as 1.02% dialogue
   * while, three lines below, 59.7% of its paragraphs were opening on speech. A probe that
   * contradicts itself is a probe bug (CLAUDE.md) — and this one would have shipped a number saying
   * Golden Age novels barely use dialogue.
   */
  const inQuotes = (raw.match(/[\u201C\u201D][^\u201C\u201D]{2,400}[\u201C\u201D]|"[^"]{2,400}"/g) ?? []).join(" ");
  const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 40);

  return {
    // ── distributions: DIAGNOSIS ONLY. A rate is not an instruction this model obeys.
    sentences: sents.length,
    words: w.length,
    meanSentenceWords: Number((lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length)).toFixed(2)),
    medianSentenceWords: median(lens),
    p10SentenceWords: quantile(lens, 0.1),
    p90SentenceWords: quantile(lens, 0.9),
    dialogueDensityPct: pct((inQuotes.match(/[a-z][a-z'-]*/gi) ?? []).length, w.length),

    // ── operations: COUNTABLE THINGS DONE. These are the only part that can become an instruction.
    semicolonsPer1000Words: per1000((raw.match(/;/g) ?? []).length, w.length),
    emDashesPer1000Words: per1000((raw.match(/—|--/g) ?? []).length, w.length),
    colonsPer1000Words: per1000((raw.match(/:/g) ?? []).length, w.length),
    subordinatorsPer1000Words: per1000((raw.match(SUBORDINATORS) ?? []).length, w.length),
    sentencesOpeningOnSubordinatePct: pct(
      sents.filter((s) => new RegExp(`^(${SUBORDINATORS.source.slice(2, -2)})\\b`, "i").test(s)).length,
      sents.length,
    ),
    paragraphsOpeningOnSpeechPct: pct(paras.filter((p) => /^["\u201C\u2018']/.test(p)).length, paras.length),
    longSentencesOver30WordsPct: pct(lens.filter((l) => l > 30).length, lens.length),
    shortSentencesUnder8WordsPct: pct(lens.filter((l) => l < 8).length, lens.length),
  };
};

const aggregate = (corpus) => {
  const rows = Object.entries(corpus).map(([k, v]) => [k, registerOf(v)]);
  const keys = Object.keys(rows[0]?.[1] ?? {});
  const totalWords = rows.reduce((a, [, r]) => a + r.words, 0);
  const out = {};
  for (const k of keys) {
    if (k === "sentences" || k === "words") { out[k] = rows.reduce((a, [, r]) => a + r[k], 0); continue; }
    // Word-weighted, so a 195k-word Moonstone is not outvoted by a 2.6k-word short story.
    out[k] = Number(
      (rows.reduce((a, [, r]) => a + r[k] * r.words, 0) / Math.max(1, totalWords)).toFixed(2),
    );
  }
  return { works: rows.length, ...out, perWork: Object.fromEntries(rows) };
};

const canonReg = aggregate(canon);
const oursReg = aggregate(ours);

// ── 1. OPENINGS — what an opening DOES, never what it says ───────────────────────────────────────
const openingFeatures = (text) => {
  const first = sentences(text)[0] ?? "";
  const w = first.split(/\s+/).filter(Boolean);
  return {
    words: w.length,
    opensOnSpeech: /^["\u201C\u2018']/.test(first),
    namesAPerson: /\b(?:Mr|Mrs|Miss|Dr|Sir|Lady|Lord|Inspector|Captain|Colonel)\b\.?/.test(first)
      || /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/.test(first),
    statesATime: /\b(morning|afternoon|evening|night|o'clock|autumn|winter|spring|summer|january|february|march|april|may|june|july|august|september|october|november|december|year|month|week|day)\b/i.test(first),
    statesAPlace: /\b(house|street|road|hall|room|london|village|station|hotel|manor|inn|church|garden|moor|lane)\b/i.test(first),
    opensOnI: /^(?:I|We)\b/.test(first),
    hasSubordinateOpener: new RegExp(`^(${SUBORDINATORS.source.slice(2, -2)})\\b`, "i").test(first),
  };
};

const openingsAgg = (corpus) => {
  const rows = Object.entries(corpus).map(([k, v]) => [k, openingFeatures(v)]);
  const n = rows.length || 1;
  const share = (f) => pct(rows.filter(([, r]) => r[f]).length, n);
  return {
    works: rows.length,
    meanOpeningWords: Number((rows.reduce((a, [, r]) => a + r.words, 0) / n).toFixed(1)),
    medianOpeningWords: median(rows.map(([, r]) => r.words)),
    opensOnSpeechPct: share("opensOnSpeech"),
    namesAPersonPct: share("namesAPerson"),
    statesATimePct: share("statesATime"),
    statesAPlacePct: share("statesAPlace"),
    opensOnFirstPersonPct: share("opensOnI"),
    subordinateOpenerPct: share("hasSubordinateOpener"),
  };
};

// ── 3. PERIOD LEXICON — and the anachronism direction, which is the useful one ───────────────────
/**
 * Proper nouns are tracked so they can be EXCLUDED.
 *
 * The first anachronism list came back as "beatrice, finch, eleanor's, mallory, ivor, voss" — our own
 * characters' names, which are of course absent from novels that do not contain them. A list of our
 * cast is not a list of anachronisms, and it buried the real hits ("timeline", "lobby") underneath.
 */
const properNouns = (corpus) => {
  const caps = new Map();
  const lower = new Map();
  for (const text of Object.values(corpus)) {
    for (const tok of body(text).match(/[A-Za-z][a-z'-]{2,}/g) ?? []) {
      const k = tok.toLowerCase();
      if (/^[A-Z]/.test(tok)) caps.set(k, (caps.get(k) ?? 0) + 1);
      else lower.set(k, (lower.get(k) ?? 0) + 1);
    }
  }
  const out = new Set();
  for (const [w, c] of caps) if (c >= 3 && (lower.get(w) ?? 0) / (c + (lower.get(w) ?? 0)) < 0.2) out.add(w);
  return out;
};

/**
 * Function words dominate any raw frequency ratio, so they are separated rather than discarded.
 * "which" at 17.6x the canon rate is not noise — it is a REGISTER signal (relative clauses), and it
 * belongs with the operations, not in a period vocabulary an anachronism linter would consume.
 */
const FUNCTION_WORDS = new Set(
  ("the of and to in that was his had with for not you but her she him they this from are were been " +
   "have has said which will would could should must upon very some there their what when where who whom " +
   "then than them these those such more most other another your mine ours over into about after before " +
   "under again only also just even much many little well being does did done shall may might can " +
   "himself herself myself itself themselves nothing something anything everything").split(" "),
);

const freq = (corpus) => {
  const m = new Map();
  let total = 0;
  for (const text of Object.values(corpus)) {
    for (const w of words(text)) {
      if (w.length < 4) continue;
      m.set(w, (m.get(w) ?? 0) + 1);
      total += 1;
    }
  }
  return { m, total };
};
const canonFreq = freq(canon);
const oursFreq = freq(ours);

const ourNames = properNouns(ours);
const canonNames = properNouns(canon);

/**
 * Words WE use that the canon never does — anachronism candidates, with our own cast excluded. This
 * is the direction that feeds `period-kb`'s linter: a word absent from 720,000 words of period prose
 * but frequent in ours is either an anachronism or a tell.
 */
const anachronismCandidates = [...oursFreq.m.entries()]
  .filter(([w, c]) => c >= 25 && !canonFreq.m.has(w) && !ourNames.has(w) && !w.includes("'"))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 120)
  .map(([w, c]) => ({ word: w, oursPer1M: Math.round((1e6 * c) / oursFreq.total) }));

/** Words the canon leans on that we barely touch — the open period lexicon X95's closed list needed. */
const periodLexicon = [...canonFreq.m.entries()]
  .filter(([, c]) => c >= 40)
  .map(([w, c]) => {
    const canonRate = (1e6 * c) / canonFreq.total;
    const ourRate = (1e6 * (oursFreq.m.get(w) ?? 0)) / Math.max(1, oursFreq.total);
    return { word: w, canonPer1M: Math.round(canonRate), oursPer1M: Math.round(ourRate), ratio: Number((canonRate / Math.max(1, ourRate)).toFixed(1)) };
  })
  .filter((r) => r.ratio >= 4 && !FUNCTION_WORDS.has(r.word) && !canonNames.has(r.word))
  .sort((a, b) => b.canonPer1M - a.canonPer1M)
  .slice(0, 200);

/** The function words the canon leans on. Register evidence, not vocabulary — kept, but separated. */
const registerWords = [...canonFreq.m.entries()]
  .filter(([w, c]) => c >= 40 && FUNCTION_WORDS.has(w))
  .map(([w, c]) => {
    const canonRate = (1e6 * c) / canonFreq.total;
    const ourRate = (1e6 * (oursFreq.m.get(w) ?? 0)) / Math.max(1, oursFreq.total);
    return { word: w, ratio: Number((canonRate / Math.max(1, ourRate)).toFixed(1)) };
  })
  .filter((r) => r.ratio >= 2)
  .sort((a, b) => b.ratio - a.ratio)
  .slice(0, 40);

// ── 4. SCENE INVENTORY — what a Golden Age mystery is made of ────────────────────────────────────
const SCENE_MARKERS = {
  inquest: /\b(inquest|coroner|jury returned|verdict)\b/gi,
  interview: /\b(questioned|interrogat|asked him|asked her|put the question)\b/gi,
  search_of_a_room: /\b(searched the|ransack|went through the drawers|examined the room)\b/gi,
  timetable: /\b(timetable|time-table|train left|the \d[\d.:]* train|by the clock)\b/gi,
  medical_evidence: /\b(post-mortem|autopsy|the surgeon|divisional surgeon|cause of death)\b/gi,
  will_and_inheritance: /\b(the will|testament|legatee|inherit|bequeath)\b/gi,
  correspondence: /\b(the letter|telegram|the note|envelope|postmark)\b/gi,
  servants_hall: /\b(butler|housekeeper|the maid|footman|servants)\b/gi,
  drawing_room_gathering: /\b(drawing-room|drawing room|assembled|the company|after dinner)\b/gi,
  night_watch: /\b(that night|by lantern|in the dark|kept watch|small hours)\b/gi,
  travel: /\b(the train|cab|carriage|motor-car|dog-cart|station platform)\b/gi,
  confession_or_reveal: /\b(confess|admitted that|the truth was|I killed|it was I who)\b/gi,
};
const sceneProfile = (corpus) => {
  const totalWords = Object.values(corpus).reduce((a, t) => a + words(t).length, 0);
  const out = {};
  for (const [name, re] of Object.entries(SCENE_MARKERS)) {
    const hits = Object.values(corpus).reduce((a, t) => a + (body(t).match(re) ?? []).length, 0);
    out[name] = per1000(hits, totalWords);
  }
  return out;
};

// ── report ───────────────────────────────────────────────────────────────────────────────────────
const canonOpen = openingsAgg(canon);
const oursOpen = openingsAgg(ours);
const canonScenes = sceneProfile(canon);
const oursScenes = sceneProfile(ours);

const gapRow = (label, c, o, unit = "") => {
  const gap = Number((o - c).toFixed(2));
  const arrow = Math.abs(gap) < 0.005 ? "  =" : gap > 0 ? "  ▲" : "  ▼";
  return `  ${label.padEnd(38)} ${String(c).padStart(9)}${unit}  ${String(o).padStart(9)}${unit}  ${String(gap).padStart(9)}${arrow}`;
};

console.log(`canon: ${canonReg.works} works, ${canonReg.words.toLocaleString()} words`);
console.log(`ours:  ${oursReg.works} manuscripts, ${oursReg.words.toLocaleString()} words\n`);

console.log("── 2. REGISTER ─────────────────────────────────────────────────────────────────────");
console.log(`  ${"".padEnd(38)} ${"canon".padStart(9)}  ${"ours".padStart(9)}  ${"gap".padStart(9)}`);
console.log("  -- distributions (DIAGNOSIS ONLY — this model ignores rate targets) --");
for (const k of ["meanSentenceWords", "medianSentenceWords", "p10SentenceWords", "p90SentenceWords", "dialogueDensityPct"]) {
  console.log(gapRow(k, canonReg[k], oursReg[k]));
}
console.log("  -- operations (COUNTABLE — the only part that can become an instruction) --");
for (const k of [
  "semicolonsPer1000Words", "emDashesPer1000Words", "colonsPer1000Words", "subordinatorsPer1000Words",
  "sentencesOpeningOnSubordinatePct", "paragraphsOpeningOnSpeechPct",
  "longSentencesOver30WordsPct", "shortSentencesUnder8WordsPct",
]) {
  console.log(gapRow(k, canonReg[k], oursReg[k]));
}

console.log("\n── 1. OPENINGS (what the first sentence DOES) ──────────────────────────────────────");
for (const k of Object.keys(canonOpen).filter((k) => k !== "works")) {
  console.log(gapRow(k, canonOpen[k], oursOpen[k]));
}

console.log("\n── 4. SCENE INVENTORY (marker hits per 1000 words) ─────────────────────────────────");
for (const k of Object.keys(canonScenes)) console.log(gapRow(k, canonScenes[k], oursScenes[k]));

console.log("\n── 3. PERIOD LEXICON ───────────────────────────────────────────────────────────────");
console.log(`  canon-leaning words (ratio >= 4x, top 12 of ${periodLexicon.length}):`);
console.log(`    ${periodLexicon.slice(0, 12).map((r) => `${r.word}(${r.ratio}x)`).join(", ")}`);
console.log(`  register words the canon leans on (function words, top 10 of ${registerWords.length}):`);
console.log(`    ${registerWords.slice(0, 10).map((r) => `${r.word}(${r.ratio}x)`).join(", ")}`);
console.log(`  anachronism candidates — frequent in OURS, absent from canon, our cast excluded (top 20 of ${anachronismCandidates.length}):`);
console.log(`    ${anachronismCandidates.slice(0, 20).map((r) => r.word).join(", ")}`);

if (WRITE) {
  mkdirSync(OUT, { recursive: true });
  const meta = {
    generated_by: "scripts/calibration-measure.mjs",
    canon_works: canonReg.works,
    canon_words: canonReg.words,
    our_manuscripts: oursReg.works,
    our_words: oursReg.words,
    note: "No verbatim sentence of any source novel appears in these files. Aggregates only.",
  };
  const { perWork: canonPerWork, ...canonFlat } = canonReg;
  const { perWork: oursPerWork, ...oursFlat } = oursReg;
  writeFileSync(`${OUT}/register.json`, JSON.stringify({ ...meta, canon: canonFlat, ours: oursFlat, canonPerWork }, null, 1), "utf8");
  writeFileSync(`${OUT}/openings.json`, JSON.stringify({ ...meta, canon: canonOpen, ours: oursOpen }, null, 1), "utf8");
  writeFileSync(`${OUT}/lexicon.json`, JSON.stringify({ ...meta, periodLexicon, registerWords, anachronismCandidates }, null, 1), "utf8");
  writeFileSync(`${OUT}/scenes.json`, JSON.stringify({ ...meta, canon: canonScenes, ours: oursScenes }, null, 1), "utf8");
  console.log(`\nwrote 4 files to library/calibration/`);
} else {
  console.log("\n(dry run — pass --write to persist to library/calibration/)");
}
