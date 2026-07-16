#!/usr/bin/env node
// A_62 RC-4 / Item 13 — evidence pass, not a fix.
//
// THE QUESTION: all four external reads saw pronoun drift on the S0 stories, while the internal
// `pronounsUnstable` cap read 0/20. Is that (a) the cap's deliberate threshold (it needs >=2 events
// across >=2 chapters; precision-first, low-recall by design), (b) sub-threshold real events, or
// (c) drift of a shape the two detectors (attribution-flip, impossible-self-reference) cannot see?
//
// THE METHOD: run the REAL shipped detector (`detectPronounDriftEvents`, story-validation dist —
// the same function the rubric's facts.ts mirrors per chapter) standalone over saved stories, with
// the cast genders recovered from each run's Agent-2 CastDesigner response (the DESIGNED genders,
// never inferred from prose). Report every event, per chapter, plus whether the cap's threshold
// would fire. Zero events over stories externals flagged = answer (c): detector-shape gap; feed the
// externals' quoted examples in as fixtures next.
//
// Usage: node scripts/pronoun-audit.mjs [storyDirGlobDate]   e.g. 20260713 (default: all stories)

import fs from "fs";
import path from "path";

const root = process.cwd();
const storiesDir = path.join(root, "stories");
const promptsDir = path.join(root, "documentation", "prompts", "actual");
const dateFilter = process.argv[2] ?? "";

const { detectPronounDriftEvents } = await import(
  "file:///" + path.join(root, "packages", "story-validation", "dist", "index.js").replace(/\\/g, "/")
);

// ── Recover designed casts from Agent-2 responses ────────────────────────────────────────────────
const casts = [];
for (const dir of fs.readdirSync(promptsDir)) {
  const full = path.join(promptsDir, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  const agent2 = fs.readdirSync(full).find((f) => /Agent2-CastDesigner_response\.md$/i.test(f));
  if (!agent2) continue;
  const raw = fs.readFileSync(path.join(full, agent2), "utf8");
  // The response md wraps the model's JSON; character objects are large (biography, relationships…),
  // so a bounded name→gender window under-matches. Instead scan name/gender tokens IN ORDER and pair
  // each gender with the nearest preceding unpaired name — robust to nesting and field distance.
  const tokens = [...raw.matchAll(/"(name|gender)"\s*:\s*"([^"]+)"/g)].map((m) => ({ field: m[1], value: m[2] }));
  const entries = [];
  let pendingName = null;
  for (const t of tokens) {
    if (t.field === "name") pendingName = t.value;
    else if (pendingName) {
      entries.push({ name: pendingName, gender: t.value.toLowerCase() });
      pendingName = null;
    }
  }
  if (entries.length >= 3) casts.push({ run: dir, cast: entries });
}

// ── Audit each saved story ───────────────────────────────────────────────────────────────────────
const stories = fs
  .readdirSync(storiesDir)
  .filter((d) => d.startsWith("story_") && d.includes(dateFilter))
  .sort();

let totalEvents = 0;
for (const storyDir of stories) {
  const full = path.join(storiesDir, storyDir);
  const md = fs.readdirSync(full).find((f) => f.endsWith(".md"));
  if (!md) continue;
  const text = fs.readFileSync(path.join(full, md), "utf8");

  // Pair the story with its designed cast. Name-overlap ALONE mispairs: the model reuses character
  // names heavily across runs (Eleanor Voss / Dr. Finch / Captain Hale recur everywhere), so a
  // same-cast-different-run can "win". The story save time is minutes after its run finishes, so the
  // authoritative constraint is TEMPORAL: same day, run started before the story was saved, latest
  // such run — name-overlap (>=3) then confirms.
  const stamp = (s) => {
    const m = /_(\d{8})-(\d{4})/.exec(s);
    return m ? Number(m[1] + m[2]) : null;
  };
  const storyStamp = stamp(storyDir);
  let best = null;
  for (const c of casts) {
    const runStamp = stamp(c.run);
    if (storyStamp && runStamp) {
      const sameDay = String(runStamp).slice(0, 8) === String(storyStamp).slice(0, 8);
      if (!sameDay || runStamp > storyStamp) continue; // a run cannot postdate its own story
    }
    const hits = c.cast.filter((e) => text.includes(e.name)).length;
    if (hits >= 3 && (!best || (stamp(c.run) ?? 0) > (stamp(best.run) ?? 0))) best = { ...c, hits };
  }
  if (!best) {
    console.log(`\n=== ${storyDir}/${md} — NO CAST MATCH (no same-day prior run with >=3 matching names) — skipped`);
    continue;
  }

  // Chapter split mirrors the saved-story format (## Chapter N headings; fall back to whole text).
  const chapters = text.split(/^##\s+/m).filter((c) => c.trim().length > 200);
  const scan = chapters.length > 1 ? chapters : [text];

  const events = [];
  const chaptersWith = new Set();
  scan.forEach((chapterText, i) => {
    for (const ev of detectPronounDriftEvents(chapterText, best.cast)) {
      chaptersWith.add(i + 1);
      events.push(`  ch${i + 1} [${ev.kind}] ${ev.characterName}: "${String(ev.sentence ?? "").slice(0, 140)}"`);
    }
  });
  totalEvents += events.length;

  const capWouldFire = events.length >= 2 && chaptersWith.size >= 2;
  console.log(`\n=== ${storyDir}/${md}`);
  console.log(`    cast: ${best.run} (${best.cast.length} entries, ${best.hits} names matched)`);
  console.log(`    events: ${events.length} across ${chaptersWith.size} chapter(s) → cap ${capWouldFire ? "WOULD fire" : "stays SILENT"}`);
  for (const e of events) console.log(e);
}

console.log(`\nTOTAL drift events across ${stories.length} stories: ${totalEvents}`);
console.log(
  totalEvents === 0
    ? "=> answer (c): the detector sees NOTHING on stories externals flagged — detector-shape gap; collect the externals' quoted examples as fixtures (Item 13 next step)."
    : "=> events exist: check per-story whether they are sub-threshold (answer b) or above threshold with the cap silent elsewhere (wiring question).",
);
