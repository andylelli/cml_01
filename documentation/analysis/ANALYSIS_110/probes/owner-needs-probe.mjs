// A_110 IMPLEMENTATION PLAN item 0.7 — the owner's needs as counts, for ANY book (rule G8).
//
// `owner-read-probe.mjs` is Part I's record of one book: its tables are that book's own words. This probe
// measures P.4's predictions on any manuscript, taking every expected value from that case's own artifacts in
// data/store.json — the place and date from its location profile and temporal context, the people, the victim,
// the detective and the culprit from its cast and CML, the trait labels from its profiles. It holds no noun of
// any case. The manuscript is matched to its stored case by the cast names it prints.
//
//   node documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs <manuscript.md>   # one book
//   node documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs --all [YYYYMMDD]  # every book since (default 20260925, v2)
//
// Proxies, stated (a lower bound on what a reader would credit; two people whose names share every token, e.g. a
// father and a son named for him, cannot be told apart and the second counts as un-introduced). An introduction is "met" when the paragraph where a person is first named (or the next one)
// carries a word of their occupation AND names the victim; a reaction is a quoted paragraph in the discovery
// chapter that names the person and a word of death. Each is a lower bound on what a reader would credit.
import fs from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const store = JSON.parse(fs.readFileSync(join(ROOT, "data/store.json"), "utf8"));
const byProject = new Map();
for (const a of store.artifacts ?? []) { if (!a?.projectId) continue; if (!byProject.has(a.projectId)) byProject.set(a.projectId, {}); byProject.get(a.projectId)[a.type] = a.payload; }

const STOP = new Set("and the of a an to in for with former retired local occasional young old family head chief senior junior assistant victim".split(" "));
const MONTHS = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const DEATH = /\b(dead|death|died|dies|killed|murder\w*|corpse|body)\b/i;
const GUILT = /\b(killed|murdered|poisoned|stabbed|strangled|shot|smothered|drowned|struck (him|her) down|did it|is guilty|was guilty|the murderer|the killer)\b/i;
// N9's page counter: a clue's CONCLUSION stated about the culprit — "only she could", "had the means", "points to".
const IMPLICATES = /\b(only (he|she|they|[A-Z][a-z]+) (could|had|would)|had (the )?(means|opportunity|access|motive)|points? (to|at|towards)|implicat\w*|could have (done|reached|killed|struck|slipped)|no one else (could|had)|nobody else (could|had))\b/i;
const AUTHORITY = /\b(sent for|send for|fetch(ed)?|telephon\w*|wired?|summon\w*|rang for)\b[^.!?]{0,80}\b(police|constable|inspector|sergeant|doctor|coroner)\b|\b(police|constable|inspector|sergeant|doctor|coroner)\b[^.!?]{0,60}\b(sent for|summoned|telephoned|on (his|her|their) way|arriv\w*)\b/i;
const POLICE = /\b(inspector|constable|sergeant|superintendent|police|scotland yard|detective inspector|chief inspector)\b/i;

export const caseOf = (art) => {
  const cast = (art.cast?.cast ?? art.cast)?.characters ?? [];
  const C = art.cml?.CASE ?? art.cml ?? {};
  const role = (c) => `${c.role ?? ""} ${c.roleArchetype ?? c.role_archetype ?? ""}`.toLowerCase();
  const victim = cast.find((c) => /\bvictim\b/.test(role(c)));
  const detective = cast.find((c) => /\bdetective\b/.test(role(c)));
  const profiles = art.character_profiles?.profiles ?? art.character_profiles?.characters ?? (Array.isArray(art.character_profiles) ? art.character_profiles : []);
  return {
    title: C.meta?.title ?? "",
    people: cast.filter((c) => c.name).map((c) => ({ name: c.name, occupation: c.occupation ?? "", isVictim: c === victim })),
    victim: victim?.name ?? null,
    culprits: C.culpability?.culprits ?? [],
    amateur: detective ? !POLICE.test(`${detective.occupation ?? ""} ${role(detective)}`) : null,
    place: art.location_profiles?.primary?.place ?? null,
    placeName: art.location_profiles?.primary?.name ?? null,
    month: art.temporal_context?.specificDate?.month ?? null,
    year: art.temporal_context?.specificDate?.year ?? null,
    traits: [...new Set(profiles.map((p) => p?.humourStyle).filter((s) => s && s !== "none"))],
  };
};

const tokensOfName = (name) => name.replace(/\b(Mr|Mrs|Miss|Dr|Sir|Lady|Lord|Jr|Sr)\.?/g, "").split(/\s+/).filter((w) => /^[A-Z][a-z]{2,}/.test(w));
const mentions = (text, name) => tokensOfName(name).some((t) => new RegExp(`\\b${t}\\b`).test(text));

/** The stored case whose cast this manuscript prints most, by full name or surname; null under three. */
export const matchCase = (text) => {
  let best = null;
  for (const [id, art] of byProject) {
    if (!art.cast || !art.cml) continue;
    const people = caseOf(art).people;
    const hits = people.filter((p) => mentions(text, p.name) && new RegExp(`\\b${tokensOfName(p.name).at(-1)}\\b`).test(text)).length;
    if (hits >= 3 && (!best || hits > best.hits)) best = { id, hits, art };
  }
  return best;
};

const chaptersOf = (raw) => raw.split(/^##\s+Chapter\s+\d+[^\n]*$/m).slice(1).map((c) => c.replace(/^---\s*$/gm, "").trim()).filter(Boolean);
const paragraphsOf = (c) => c.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const opensWithQuote = (p) => /^["“‘']/.test(p);
const narrationOf = (p) => p.replace(/["“][^"”]*["”]/g, " ");

export const measure = (raw, cs) => {
  const chapters = chaptersOf(raw);
  if (!chapters.length) return null;
  const ch1 = chapters[0];
  const p1 = paragraphsOf(ch1);
  const firstQuote = p1.findIndex(opensWithQuote);

  const placeWords = [cs.place ?? cs.placeName].filter(Boolean).flatMap((s) => s.split(/[\s,]+/)).filter((w) => /^[A-Z][a-z]{3,}/.test(w) && !/^(Hotel|Manor|House|Hall|Court|Inn|Lodge|Abbey|Castle|Estate)$/.test(w));
  const placeOnPage = placeWords.length ? placeWords.some((w) => new RegExp(`\\b${w}\\b`).test(ch1)) : null;
  const monthOnPage = cs.month ? new RegExp(`\\b${cs.month}\\b`).test(ch1) : null;
  const yearOnPage = cs.year ? new RegExp(`\\b${cs.year}\\b`).test(ch1) : null;

  // Introductions: everybody named in chapter 1.
  const present = cs.people.filter((p) => mentions(ch1, p.name));
  const intro = present.filter((p) => !p.isVictim).map((p) => {
    const i = p1.findIndex((para) => mentions(para, p.name));
    const near = [p1[i], p1[i + 1] ?? ""].join(" ").toLowerCase();
    const occ = p.occupation.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !STOP.has(w));
    const hasOcc = occ.length ? occ.some((w) => near.includes(w.slice(0, Math.max(4, w.length - 2)))) : null;
    const hasRel = cs.victim ? mentions([p1[i], p1[i + 1] ?? ""].join(" "), cs.victim) || /\bthe (dead|late) (man|woman)\b/i.test(near) : null;
    return { name: p.name, hasOcc, hasRel };
  });

  // The discovery chapter: the first chapter in which the death is stated in narration.
  const di = chapters.findIndex((c) => paragraphsOf(c).some((p) => DEATH.test(narrationOf(p))));
  const disc = di >= 0 ? chapters[di] : "";
  const presentAtDisc = cs.people.filter((p) => !p.isVictim && mentions(disc, p.name));
  const spoke = presentAtDisc.filter((p) => paragraphsOf(disc).some((para) => opensWithQuote(para) && DEATH.test(para) && mentions(para, p.name)));
  const authority = di >= 0 ? AUTHORITY.test(disc) : null;

  const chapterWord = chapters.reduce((n, c) => n + (narrationOf(c).match(/\bchapter\b/gi) ?? []).length, 0);
  const traitCounts = cs.traits.map((t) => { const stem = t.replace(/_/g, "[- ]?").replace(/(ing|ion|ism)$/, ""); return { t, n: (chapters.join("\n").match(new RegExp(`\\b${stem}\\w*`, "gi")) ?? []).length }; });

  const culpritTokens = cs.culprits.flatMap((c) => tokensOfName(c));
  const sentenceAbout = (re) => chapters.findIndex((c) => c.split(/(?<=[.!?])\s+/).some((s) => re.test(s) && culpritTokens.some((t) => new RegExp(`\\b${t}\\b`).test(s))));
  const guiltAt = sentenceAbout(GUILT);
  const implicatedAt = sentenceAbout(IMPLICATES);

  return {
    chapters: chapters.length,
    p1_firstQuotePara: firstQuote >= 0 ? firstQuote + 1 : null,
    p3_place: placeOnPage, p3_month: monthOnPage, p3_year: yearOnPage,
    p4_introduced: `${intro.filter((x) => x.hasOcc && x.hasRel).length}/${intro.length}`,
    p4_met: intro.length ? intro.every((x) => x.hasOcc && x.hasRel) : null,
    p5_discoveryChapter: di >= 0 ? di + 1 : null,
    p5_spoke: `${spoke.length}/${presentAtDisc.length}`,
    p5_authoritySent: cs.amateur === false ? "n/a (police detective)" : authority,
    p8_chapterInNarration: chapterWord,
    p9_maxTraitLabel: traitCounts.length ? Math.max(...traitCounts.map((x) => x.n)) : null,
    p12_guiltFirstChapter: guiltAt >= 0 ? guiltAt + 1 : null,
    p12_implicatedFirstChapter: implicatedAt >= 0 ? implicatedAt + 1 : null,
  };
};

const storyFiles = (since) => {
  const out = [];
  for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) {
    if (!fs.existsSync(root)) continue;
    for (const d of fs.readdirSync(root)) {
      const date = (d.match(/(\d{8})-\d{4}/) ?? [])[1];
      if (!date || date < since) continue;
      const dir = join(root, d); if (!fs.statSync(dir).isDirectory()) continue;
      const md = fs.readdirSync(dir).find((f) => f.endsWith(".md")); if (md) out.push(join(dir, md));
    }
  }
  return out.sort();
};

// The CLI runs only when invoked directly; scripts/checked-read.mjs imports the measures above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
const arg = process.argv[2];
if (!arg) { console.log("usage: owner-needs-probe.mjs <manuscript.md> | --all [YYYYMMDD]"); process.exit(1); }
const files = arg === "--all" ? storyFiles(process.argv[3] ?? "20260925") : [arg];
const rows = [];
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const match = matchCase(raw);
  if (!match) { console.log(`${f.split(/[\\/]/).slice(-2).join("/")}: no stored case matches its cast — skipped`); continue; }
  const m = measure(raw, caseOf(match.art));
  if (!m) continue;
  rows.push({ file: f.split(/[\\/]/).slice(-2, -1)[0], project: match.id.slice(0, 13), ...m });
}
for (const r of rows) console.log(JSON.stringify(r));
if (rows.length > 1) {
  const share = (pred) => `${rows.filter(pred).length}/${rows.length}`;
  console.log(`\nP.4 baseline over ${rows.length} books (rows the probe could match to a stored case):`);
  console.log(`  1  first quotation mark in paragraph 3 or later of chapter 1: ${share((r) => (r.p1_firstQuotePara ?? 99) >= 3)}`);
  console.log(`  3  place / month / year on chapter 1's page: ${share((r) => r.p3_place)} / ${share((r) => r.p3_month)} / ${share((r) => r.p3_year)}`);
  console.log(`  4  every person in chapter 1 introduced (occupation and relation to the victim): ${share((r) => r.p4_met)}`);
  console.log(`  5  authority sent for in the discovery chapter (amateur detective): ${share((r) => r.p5_authoritySent === true)} (n/a ${rows.filter((r) => String(r.p5_authoritySent).startsWith("n/a")).length})`);
  console.log(`  8  "chapter" in narration, zero: ${share((r) => r.p8_chapterInNarration === 0)}`);
  console.log(`  9  every trait label at most twice: ${share((r) => r.p9_maxTraitLabel !== null && r.p9_maxTraitLabel <= 2)}`);
  const med = (k) => { const a = rows.map((r) => r[k]).filter((v) => v != null).sort((x, y) => x - y); return a.length ? a[a.length >> 1] : "—"; };
  console.log(`  12 the culprit first implicated in a sentence (median chapter): ${med("p12_implicatedFirstChapter")} · first named with a verb of guilt: ${med("p12_guiltFirstChapter")}`);
}
}
