/**
 * PROSE ENGINE v2 — THE BIBLE (ANALYSIS_99 §10.3).
 *
 * ── WHAT IT IS, AND WHY IT IS FIRST ──────────────────────────────────────────────────────────────
 *
 * Everything the writer needs that does not change between chapters, assembled once and placed at
 * the head of every Writer, Critic and Editor prompt. Two reasons, and the second is the one that
 * matters:
 *
 * 1. CACHING. v1's cross-chapter prompt prefix is **7.6%** (15_llm §5.1) because chapter-specific
 *    content is injected early, so the prefix diverges almost immediately and naive caching buys
 *    10-15%. A stable-first assembly moves most of the prompt into a cacheable prefix, which is what
 *    makes a frontier writer affordable in §10.10.
 *
 * 2. THE BUDGET CANNOT EAT THE CRAFT. v1 has 31 blocks with priorities, and the budgeter's drop
 *    order is `["optional", "medium", "high"]`. WP-001 §4.2 measured the consequence: `humour_guide`
 *    was the only `optional` block in the whole prompt — not one candidate among several, the entire
 *    first tier — and it reached **10 of 10 chapters on one run and 0 of 10 on each of the next two**.
 *    v2 has no budgeter. The bible is built TO its budget, section by section, so there is nothing
 *    to drop at prompt time and no priority field for a future reader to get wrong.
 *
 * ── THE SANITISATION RULES, EACH WITH ITS RECEIPT ────────────────────────────────────────────────
 *
 *   - No internal field name and no schema fragment reaches prose-facing text. A_84 traced every
 *     "generated line" a reader named to our own templates, and the register instrument exists
 *     because the reader recognises a REGISTER, not a string.
 *   - Clue ids appear in the clue register and nowhere else; a checker rejects any id in the prose.
 *   - A locked value is spelled exactly once, the way the locked fact spells it. Two spellings of
 *     one hour read to a reader as two different times (A_90).
 *   - Nothing here is an example of prose. A_67: illustrative content in a prompt is reproduced, not
 *     adapted — 45 of 45 for a scene coordinate, 31 of 44 for a retired schoolteacher, 10 of 10 for
 *     an opening sentence.
 */

import type { Bible, BibleSectionKey, ContractCore, ContractInput } from "./types.js";
import { humourMove } from "./humour-move.js";
import { auditFixesEnabled, contractFixesEnabled, verifiedFixesEnabled } from "@cml/cml";
import { fragmentObservable } from "./clue-shape.js";

/**
 * The same arithmetic as v1's `estimateTokenCount` (`prompt-builder.ts:1496`), deliberately
 * re-stated rather than imported: a pure package must not pull in a 2,985-line prompt builder for
 * `length / 4`. It is a convention, not a fact about the story, so the two cannot meaningfully
 * diverge — and if the client ever gains a real tokenizer, this is the one place v2 changes.
 */
export const estimateTokens = (value: string): number => Math.ceil(String(value ?? "").length / 4);

/** Per-section budgets, in the order the sections appear. Their sum is the bible's budget. */
export const BIBLE_BUDGETS: Record<BibleSectionKey, number> = {
  case: 1_800,
  cast: 2_400,
  world: 1_800,
  chronology: 600,
  clues: 900,
  relationships: 600,
};

export const BIBLE_BUDGET = Object.values(BIBLE_BUDGETS).reduce((a, b) => a + b, 0);

/** Sections that may be dropped whole when the total still exceeds the budget, in drop order. */
const DROPPABLE: BibleSectionKey[] = ["relationships", "clues"];

const SECTION_TITLES: Record<BibleSectionKey, string> = {
  case: "THE CASE — the truth, which only you know",
  cast: "THE PEOPLE",
  world: "THE WORLD",
  chronology: "THE CLOCK — every time value in this book, in this spelling",
  clues: "THE EVIDENCE — what each piece looks like on the page",
  relationships: "WHO IS WHAT TO WHOM",
};

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/**
 * A setting field may be an object — Agent 1 writes `location: { type, description, … }` and `era: { decade, … }`.
 * MEASURED on run mystery-1790960614933 (seed 82094): the brief said "Where and when: [object Object]." With
 * CML_VERIFIED_FIXES on, an object yields its first naming field instead; OFF keeps the old stringification.
 */
const NAMING_KEYS = ["place", "name", "decade", "period", "type", "description"] as const;
const fieldValue = (value: unknown): string => {
  if (value && typeof value === "object" && !Array.isArray(value) && verifiedFixesEnabled()) {
    const o = value as Record<string, unknown>;
    for (const k of NAMING_KEYS) {
      const v = text(o[k]);
      if (v && typeof o[k] !== "object") return v;
    }
    return "";
  }
  return text(value);
};

const field = (source: unknown, ...keys: string[]): string => {
  const s = source as Record<string, unknown> | null;
  for (const key of keys) {
    const v = fieldValue(s?.[key]);
    if (v) return v;
  }
  return "";
};

/** Trim a section's body to its budget on a line boundary, so a truncated entry is never half-read. */
const toBudget = (lines: string[], budget: number): string => keptToBudget(lines, budget).join("\n");

/** The lines `toBudget` keeps: a prefix, cut at the first line that would cross the budget. */
const keptToBudget = (lines: string[], budget: number): string[] => {
  const kept: string[] = [];
  let tokens = 0;
  for (const line of lines) {
    const cost = estimateTokens(line) + 1;
    if (tokens + cost > budget) break;
    kept.push(line);
    tokens += cost;
  }
  return kept;
};

const pronounsFor = (gender: unknown): string => {
  const g = text(gender).toLowerCase();
  if (g === "female") return "she/her";
  if (g === "male") return "he/him";
  return "";
};

// ── the sections ─────────────────────────────────────────────────────────────────────────────────

const caseSection = (caseBlock: Record<string, unknown>, core: ContractCore): string[] => {
  const lines: string[] = [];
  const mech = (caseBlock.hidden_model as Record<string, unknown> | undefined)?.mechanism as
    | Record<string, unknown>
    | undefined;
  const victim = core.fairPlay.victim || field(caseBlock, "victim");
  const death = field(caseBlock, "death_method");
  if (victim) lines.push(`The dead: ${victim}${death ? `, ${death}` : ""}.`);
  const mechanismText = text(mech?.description) || core.fairPlay.mechanismSummary;
  if (mechanismText) lines.push(`How it was hidden: ${mechanismText}`);
  for (const step of asArray(mech?.delivery_path)) {
    const s = typeof step === "string" ? text(step) : field(step, "step", "description");
    if (s) lines.push(`  - ${s}`);
  }
  if (core.fairPlay.culprits.length > 0) {
    const culprit = core.fairPlay.culprits.join(", ");
    const entry = asArray(caseBlock.cast).find((c) => core.fairPlay.culprits.includes(field(c, "name")));
    const motive = field(entry, "motive_seed", "motiveSeed") || field(caseBlock, "motive");
    lines.push(`Who did it: ${culprit}${motive ? ` — ${motive}` : ""}.`);
    lines.push(`They are named in chapter ${core.fairPlay.revealChapter}, and not before.`);
  }
  const fs = caseBlock.false_solution as Record<string, unknown> | undefined;
  if (fs) {
    const accused = field(fs, "accused_suspect", "accusedSuspect");
    const flaw = field(fs, "the_one_flaw", "theOneFlaw");
    if (accused) lines.push(`The wrong answer the book argues first: ${accused}.`);
    // A_109 step 6 — when a chapter owns a point, the bible says which, as it does for clues.
    const ownedIn = new Map(core.scenes.flatMap((s) => (s.falseLeads ?? []).map((l) => [l.point, s.chapter] as const)));
    for (const point of asArray(fs.supporting_points)) {
      const p = typeof point === "string" ? text(point) : field(point, "point", "description");
      if (p) lines.push(`  - ${p}${ownedIn.has(p) ? ` — shown in chapter ${ownedIn.get(p)}` : ""}`);
    }
    if (flaw) lines.push(`  The one thing that breaks it: ${flaw}`);
  }
  const herrings = asArray(caseBlock.red_herrings);
  if (herrings.length > 0) {
    lines.push("Details that look wrong and are not:");
    for (const herring of herrings) {
      const detail = field(herring, "detail", "description", "herring");
      const innocent = field(herring, "innocent_explanation", "innocentExplanation");
      if (detail) lines.push(`  - ${detail}${innocent ? ` — in fact: ${innocent}` : ""}`);
    }
  }
  return lines;
};

/**
 * 17-hitting-90 §06 F9 — the stock line, owned by one chapter.
 *
 * It read "Says, in their own way: <tic>" in the bible every chapter call sees, and nothing owned it.
 * Written one chapter a call (P1.1), a line available to every call is a line said in every chapter:
 * run 98dec72a said "that's the way of things" x5, "cut to the chase" x5 and "Order, Mr. Wentworth
 * insists" x3, and the reader called them "assigned catchphrases". WP-001 §4.3 at the scale of a
 * character. Clues are owned the same way ("shown once, in the chapter named").
 *
 * The chapter is one the character is on the page in, never the reveal (A_101 §14.3: a confession
 * built from the culprit's catchphrase was "too cute") nor the aftermath, and the least loaded so the
 * lines spread. The dead speak only in the scene set before the death, if there is one.
 */
const stockLineChapter = (name: string, core: ContractCore, load: Map<number, number>): number | null => {
  if (name === core.fairPlay.victim) {
    return core.scenes.find((s) => s.wound?.victim === name)?.chapter ?? null;
  }
  const candidates = core.scenes
    .filter((s) => s.present.includes(name))
    .map((s) => s.chapter)
    .filter((c) => c !== core.roles.reveal && c !== core.roles.aftermath);
  if (candidates.length === 0) return null;
  const chosen = [...candidates].sort((a, b) => (load.get(a) ?? 0) - (load.get(b) ?? 0) || a - b)[0]!;
  load.set(chosen, (load.get(chosen) ?? 0) + 1);
  return chosen;
};

/**
 * A_109 M3 — THE PROOF, the case's own inference path, in its order. The bible never carried it: the
 * writer had the answer and the clues but not the chain between them, and the reveal came out as an
 * inventory ("the reveal is list-like", "the accusation jumps from scarf, pass, dust, key to Pike").
 * Each step: what was found, and what it shows — first sentence of each, so nothing is a paragraph.
 */
const proofLines = (caseBlock: Record<string, unknown>): string[] => {
  const steps = asArray((caseBlock.inference_path as Record<string, unknown> | undefined)?.steps);
  const first = (value: unknown): string => {
    const t = text(value);
    const m = t.match(/^.{12,240}?[.!?](?=\s|$)/);
    return (m ? m[0] : t).trim();
  };
  const lines = steps
    .map((step, i) => {
      const s = step as Record<string, unknown>;
      const found = first(s.observation);
      const shows = first(s.effect || s.correction);
      return found ? `  ${i + 1}. ${found}${shows ? ` It shows: ${shows}` : ""}` : "";
    })
    .filter(Boolean);
  return lines.length > 0 ? ["THE PROOF, in the order the case builds it:", ...lines] : [];
};

const castSection = (
  caseBlock: Record<string, unknown>,
  input: ContractInput,
  core: ContractCore,
): string[] => {
  const cast = asArray(input.cast?.characters);
  const profiles = asArray(input.profiles?.profiles);
  const profileByName = new Map(profiles.map((p) => [field(p, "name"), p as Record<string, unknown>]));
  const lines: string[] = [];
  const stockLineLoad = new Map<number, number>();
  for (const member of cast) {
    const name = field(member, "name");
    if (!name) continue;
    const profile = profileByName.get(name);
    const bits: string[] = [];
    const pronouns = pronounsFor((member as Record<string, unknown>).gender);
    const role = field(member, "roleArchetype", "role_archetype", "role");
    const occupation = field(member, "occupation");
    lines.push(`${name}${pronouns ? ` (${pronouns})` : ""}${role ? ` — ${role}` : ""}${occupation ? `, ${occupation}` : ""}`);
    const persona = field(profile, "publicPersona") || field(member, "publicPersona");
    const secret = field(profile, "privateSecret") || field(member, "privateSecret");
    const stakes = field(profile, "stakes") || field(member, "stakes");
    if (persona) bits.push(`  In company: ${persona}`);
    if (secret) bits.push(`  Keeps hidden: ${secret}`);
    if (stakes) bits.push(`  Stands to lose: ${stakes}`);
    const style = field(profile, "humourStyle");
    const level = Number((profile as Record<string, unknown> | undefined)?.humourLevel ?? 0);
    // P4.2: the move, not the label — the label was printed twelve times and the reader quoted it.
    if (style && style !== "none" && level > 0) bits.push(`  Humour: ${humourMove(style)}`);
    else if (style === "none") bits.push("  Humour: plays it straight, and is the contrast the others land against");
    const mannerisms = field(profile, "speechMannerisms");
    // A_110 L4: Agent 2b is asked to say "how their humour manifests in dialogue" here, so the field carries the
    // humour labels P4.2 took out of the Humour line ("self-deprecat*" x10, "understate*" x5 on run bcc0d637). The
    // first sentence is HOW they speak; the rest restates the label.
    if (mannerisms) bits.push(`  Speech: ${contractFixesEnabled() ? firstSentenceOf(mannerisms) : mannerisms}`);
    const tic = field(profile, "signatureTic");
    if (tic) {
      const owner = stockLineChapter(name, core, stockLineLoad);
      if (owner !== null) bits.push(`  Says this once in the book, in chapter ${owner}: ${tic}`);
    }
    // A_96 F9 — the TRAIT clause only. The cause is withheld on purpose: run 50862 narrated the whole
    // formative incident as a label seven times, because the whole of it was in the prompt.
    const trait = core.scenes.find((s) => s.beats.depth?.name === name)?.beats.depth?.trait;
    // A_110 L1: the trait is owned by one chapter contract; in the bible every call reads it, and run bcc0d637 printed
    // "gambling loss" x9 and "the loss of a high-profile case" x10. depth.ts's own rule: never the bible.
    if (trait && !contractFixesEnabled()) bits.push(`  One thing about them, shown never explained: ${trait}`);
    lines.push(...bits);
  }
  return lines;
};

/**
 * A_110 W1 — where and when, read from the shapes the artifacts actually have.
 *
 * MEASURED over every v2 run in the prompt log (27 runs, 639 writer calls): this section's whole content was
 * "Where and when: [object Object]." in 26, and absent in the 27th after the verified fix, because all six reads
 * below miss: `ctx.setting` is Agent 1's outer result `{ setting: { location: {...} } }`, `historicalMoment` has no
 * `summary`, `locationRegisters[]` has `emotionalRegister` not `register`, and the location profiles hold
 * `primary`/`keyLocations`, not `profiles`. Repairing those reads would add the mood and four location registers
 * to every call ("The lobby feels claustrophobic yet charged…") — the register readers quote back — so ON this is
 * ONE line, and a place it cannot read is reported as unknown rather than silently dropped (WP-006 K4).
 */
/** The case's month, year and season, as the temporal context and setting give them; "" where absent. */
export const dateOf = (input: ContractInput): { month: string; year: string; season: string } => {
  const setting = (input.setting as Record<string, unknown> | undefined) ?? {};
  const inner = (setting.setting && typeof setting.setting === "object" ? setting.setting : setting) as Record<string, unknown>;
  const temporal = (input.temporal as Record<string, unknown> | undefined) ?? {};
  const date = (temporal.specificDate && typeof temporal.specificDate === "object" ? temporal.specificDate : {}) as Record<string, unknown>;
  const seasonal = (temporal.seasonal && typeof temporal.seasonal === "object" ? temporal.seasonal : {}) as Record<string, unknown>;
  return {
    month: text(date.month),
    year: text(date.year) || text((inner.era as Record<string, unknown> | undefined)?.decade),
    season: text(seasonal.season).toLowerCase(),
  };
};

export const whereAndWhen = (input: ContractInput): { line: string; unknown: string[] } => {
  const setting = (input.setting as Record<string, unknown> | undefined) ?? {};
  const inner = (setting.setting && typeof setting.setting === "object" ? setting.setting : setting) as Record<string, unknown>;
  const location = (inner.location && typeof inner.location === "object" ? inner.location : {}) as Record<string, unknown>;
  const locations = (input.locations as Record<string, unknown> | undefined) ?? {};
  const primary = (locations.primary && typeof locations.primary === "object" ? locations.primary : {}) as Record<string, unknown>;
  const name = text(primary.name);
  const kind = text(location.type).toLowerCase();
  const place = [text(primary.place), text(primary.country)].filter(Boolean).join(", ");
  const { month, year, season } = dateOf(input);
  const unknown: string[] = [];
  if (!name && !kind) unknown.push("the place");
  if (!place) unknown.push("its town and country");
  if (!year) unknown.push("the year");
  const where = [name, kind && name ? `a ${kind}` : kind].filter(Boolean).join(", ");
  const when = [[month, year].filter(Boolean).join(" "), season].filter(Boolean).join(", ");
  const parts = [[where, place ? `at ${place}` : ""].filter(Boolean).join(" "), when].filter(Boolean);
  return { line: parts.length > 0 ? `Where and when: ${parts.join("; ")}.` : "", unknown };
};

const worldSection = (input: ContractInput): string[] => {
  const lines: string[] = [];
  if (contractFixesEnabled()) {
    const { line } = whereAndWhen(input);
    if (line) lines.push(line);
    const forbidden = asArray((input.temporal as Record<string, unknown> | undefined)?.anachronisms)
      .map((a) => (typeof a === "string" ? text(a) : field(a, "term")))
      .filter(Boolean);
    if (forbidden.length > 0) lines.push(`Out of period, so out of the book: ${forbidden.slice(0, 20).join(", ")}.`);
    return lines;
  }
  const setting = input.setting as Record<string, unknown> | undefined;
  const place = field(setting, "location", "place", "setting");
  const era = field(setting, "era", "period") || field(input.temporal, "era", "period");
  if (place || era) lines.push(`Where and when: ${[place, era].filter(Boolean).join(", ")}.`);
  const mood = field(setting, "mood", "atmosphere", "tone");
  if (mood) lines.push(`The air of the place: ${mood}`);
  const world = input.world as Record<string, unknown> | undefined;
  const moment = world?.historicalMoment as Record<string, unknown> | undefined;
  const momentText = field(moment, "summary", "description", "moment");
  if (momentText) lines.push(`What is happening in the world outside: ${momentText}`);
  for (const register of asArray(world?.locationRegisters)) {
    const name = field(register, "location", "name");
    const line = field(register, "register", "sensoryRegister", "description");
    if (name && line) lines.push(`  ${name}: ${line}`);
  }
  const profiles = asArray((input.locations as Record<string, unknown> | undefined)?.profiles);
  for (const profile of profiles) {
    const name = field(profile, "name", "location");
    const sensory = field(profile, "sensoryPalette", "sensoryDetails", "atmosphere");
    if (name && sensory) lines.push(`  ${name}: ${sensory}`);
  }
  const forbidden = asArray((input.temporal as Record<string, unknown> | undefined)?.anachronisms)
    .map((a) => (typeof a === "string" ? text(a) : field(a, "term")))
    .filter(Boolean);
  if (forbidden.length > 0) lines.push(`Out of period, so out of the book: ${forbidden.slice(0, 20).join(", ")}.`);
  return lines;
};

const CLOCK_HEADER = "Every one of these is written the same way every time it appears:";

const chronologySection = (
  core: ContractCore,
  lockedFacts: ReadonlyArray<Record<string, unknown>>,
): string[] => {
  const { rows, locked } = chronologyLines(core, lockedFacts);
  const lines = [...rows, ...locked];
  if (lines.length > 0) {
    lines.unshift(CLOCK_HEADER);
  }
  return lines;
};

/** THE CLOCK's lines in two parts: the chronology's rows, then the locked facts no row already carries. */
const chronologyLines = (
  core: ContractCore,
  lockedFacts: ReadonlyArray<Record<string, unknown>>,
): { rows: string[]; locked: string[] } => {
  const rows: string[] = [];
  const locked: string[] = [];
  // A culprit's alibi is the one the solution breaks. MEASURED on run mystery-1790960614933: THE CLOCK listed
  // "Ottoline Fairweather's alibi" (the murderer) like an innocent's, and chapter 9 said "Miss Fairweather is cleared".
  // With CML_VERIFIED_FIXES on it reads as the culprit's cover; OFF unchanged.
  const culprits = verifiedFixesEnabled() ? core.fairPlay.culprits.filter(Boolean) : [];
  const asClaimed = (label: string): string =>
    culprits.some((c) => label.includes(c)) && /\balibi\b/i.test(label)
      // "cover" is exactly as long as "alibi": THE CLOCK has a token budget, and any longer label pushed later clock
      // values out of it (measured on the archive: "claimed alibi (…)" lost 2 lines, "false alibi" 1).
      ? label.replace(/\balibi\b/gi, "cover")
      : label;
  for (const row of core.chronology.rows) {
    rows.push(`  ${row.value} — ${asClaimed(row.label)}`);
  }
  const values = new Set(core.chronology.rows.map((r) => r.value));
  for (const fact of lockedFacts) {
    const value = text(fact.value);
    const description = text(fact.description);
    if (!value || values.has(value)) continue;
    locked.push(`  ${value} — ${asClaimed(description || String(fact.id ?? ""))}`);
  }
  return { rows, locked };
};

const cluesSection = (core: ContractCore): string[] => {
  const lines: string[] = [];
  for (const scene of core.scenes) {
    for (const surface of scene.mustSurface) {
      const raw = surface.observable || surface.keyTerms.join(", ");
      if (!raw) continue;
      // Clue copying (see ./clue-shape.ts): with CML_VERIFIED_FIXES on, a long observable is given as fragments.
      const observable = verifiedFixesEnabled() ? fragmentObservable(raw) : raw;
      const unlocked = surface.unlockedBy ? ` — ${surface.unlockedBy.name} reads it because they know ${surface.unlockedBy.skill}` : "";
      lines.push(`  [${surface.id}] chapter ${scene.chapter}: ${observable}${unlocked}`);
    }
  }
  if (lines.length > 0) {
    // 17-hitting-90 §06 F10. It read "…as something somebody sees, finds or says", and an observable
    // written as a conclusion can only be SAID: run 98dec72a put 23 of them in somebody's mouth as a
    // report to the investigator (pair 3: 2). The finding is an act; the reading of it comes after.
    // §06 R5: run 98dec72a gave the culprit the finding of the evidence against him — Pike worked the
    // lock, read the dust and the ink, chapters 1–8. Who finds is now named as a set, positively.
    const culprits = core.fairPlay.culprits.filter(Boolean);
    const finder = culprits.length > 0 ? `the investigator or anyone present except ${culprits.join(" and ")}` : "a named person";
    lines.unshift(
      `Each is put on the page once, in the chapter named, by ${finder}, doing the thing that finds it — looking, handling, measuring, reading a record, or hearing a witness — and what they make of it comes after, in their own words:`,
    );
  }
  return lines;
};

const relationshipsSection = (input: ContractInput, core: ContractCore): string[] => {
  // §07: a pair whose shared history a chapter owns is given it there, once, and not here as well —
  // what every chapter call can see, every chapter repeats.
  const owned = new Set(
    core.scenes.flatMap((s) => (s.texture?.history ? [`${s.texture.history.a}|${s.texture.history.b}`] : [])),
  );
  const relationships = input.cast?.relationships as Record<string, unknown> | undefined;
  const rawPairs = asArray(relationships?.pairs ?? relationships);
  // A_110 R2: `toBudget` keeps a prefix, and run bcc0d637's eight first pairs cost 591 of the 600 tokens, so every
  // pair of the detective's — the reader's eyes — was dropped. ON: the detective's pairs, then the victim's (who he
  // was to each of them), then the rest, inside a budget that fits them (`relationshipsBudget`).
  const pairs = contractFixesEnabled() ? orderPairs(rawPairs, input, core) : rawPairs;
  const lines: string[] = [];
  for (const pair of pairs) {
    const a = field(pair, "character1", "characterA", "a");
    const b = field(pair, "character2", "characterB", "b");
    if (!a || !b) continue;
    const relationship = field(pair, "relationship");
    const history = field(pair, "sharedHistory");
    const tension = field(pair, "tension");
    // A_89 D1 — the relationship is CONTENT, at whatever length it was written. The 40-character cap
    // that used to stand here discarded 747 of 752 of them, median length 100, and what it discarded
    // was the motive-bearing half of every pair.
    const body = [relationship, owned.has(`${a}|${b}`) ? "" : history].filter(Boolean).join(" ");
    lines.push(`  ${a} & ${b}${tension && tension !== "none" ? ` (${tension} tension)` : ""}: ${body}`);
  }
  return lines;
};

/** A_110 R2: room for eleven pairs at ~75 tokens; the 600 was self-imposed (the v2 bible has no ceiling). */
const RELATIONSHIPS_BUDGET_FIXED = 1_200;

const firstSentenceOf = (value: string): string => {
  const m = text(value).match(/^.{12,260}?[.!?](?=\s|$)/);
  return (m ? m[0] : text(value)).trim();
};

const orderPairs = (pairs: unknown[], input: ContractInput, core: ContractCore): unknown[] => {
  const cast = asArray(input.cast?.characters);
  const detective = cast
    .map((m) => ({ name: field(m, "name"), role: field(m, "roleArchetype", "role_archetype", "role").toLowerCase() }))
    .find((m) => /detective|investigator|sleuth|inspector/.test(m.role))?.name ?? "";
  const victim = core.fairPlay.victim;
  const rank = (pair: unknown): number => {
    const a = field(pair, "character1", "characterA", "a");
    const b = field(pair, "character2", "characterB", "b");
    if (detective && (a === detective || b === detective)) return 0;
    if (victim && (a === victim || b === victim)) return 1;
    return 2;
  };
  return pairs.map((p, i) => ({ p, i, r: rank(p) })).sort((x, y) => x.r - y.r || x.i - y.i).map((x) => x.p);
};

// ── assembly ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the bible. Total-safe by construction: each section is built to its own budget, so the sum
 * cannot exceed `BIBLE_BUDGET`, and the drop pass below is a belt-and-braces that should never fire.
 */
export const buildBible = (input: ContractInput, core: ContractCore): Bible => {
  const caseBlock = ((): Record<string, unknown> => {
    const c = input.cml as Record<string, unknown> | null;
    const inner = c?.CASE as Record<string, unknown> | undefined;
    return (inner && typeof inner === "object" ? inner : c) ?? {};
  })();

  const built: Array<{ key: BibleSectionKey; lines: string[] }> = [
    { key: "case", lines: [...caseSection(caseBlock, core), ...(input.proofSteps ? proofLines(caseBlock) : [])] },
    { key: "cast", lines: castSection(caseBlock, input, core) },
    { key: "world", lines: worldSection(input) },
    { key: "chronology", lines: chronologySection(core, input.lockedFacts ?? []) },
    { key: "clues", lines: cluesSection(core) },
    { key: "relationships", lines: relationshipsSection(input, core) },
  ];

  const fixes = contractFixesEnabled();
  const audit = auditFixesEnabled();
  const budgetOf = (key: BibleSectionKey): number =>
    fixes && key === "relationships" ? RELATIONSHIPS_BUDGET_FIXED : BIBLE_BUDGETS[key];
  /**
   * A_111 V-17 (WF-005 V2C-07) — the locked facts are never cut, and every cut is counted.
   *
   * MEASURED over the 64 stored cases: THE CLOCK's 600 tokens cut 45 locked facts in 18 — the X51 weapon and alibi
   * facts, appended last, so they were the first to go — and THE EVIDENCE's 900 cut lines in 13, both silently. ON:
   * the chronology's rows keep the 600 and the locked facts after them have a budget of their own (what they cost,
   * added to the total so no whole section is dropped for them); each section's cut lines are counted in `dropped`.
   */
  const clock = audit ? chronologyLines(core, input.lockedFacts ?? []) : null;
  const lockedTokens = clock ? clock.locked.reduce((sum, line) => sum + estimateTokens(line) + 1, 0) : 0;
  const totalBudget = (fixes ? BIBLE_BUDGET - BIBLE_BUDGETS.relationships + RELATIONSHIPS_BUDGET_FIXED : BIBLE_BUDGET) + lockedTokens;
  const dropped: Partial<Record<BibleSectionKey, number>> = {};
  let sections = built
    .map(({ key, lines }) => {
      let body: string;
      if (!audit) {
        body = toBudget(lines, budgetOf(key));
      } else if (key === "chronology" && clock) {
        const head = clock.rows.length + clock.locked.length > 0 ? [CLOCK_HEADER] : [];
        const kept = keptToBudget([...head, ...clock.rows], budgetOf(key));
        body = [...kept, ...clock.locked].join("\n");
        const cut = head.length + clock.rows.length - kept.length;
        if (cut > 0) dropped[key] = cut;
      } else {
        const kept = keptToBudget(lines, budgetOf(key));
        body = kept.join("\n");
        if (lines.length > kept.length) dropped[key] = lines.length - kept.length;
      }
      return { key, title: SECTION_TITLES[key], body, tokens: estimateTokens(body) };
    })
    .filter((s) => s.body.length > 0);

  const truncated: BibleSectionKey[] = [];
  const total = () => sections.reduce((sum, s) => sum + s.tokens + estimateTokens(s.title) + 2, 0);
  for (const key of DROPPABLE) {
    if (total() <= totalBudget) break;
    if (!sections.some((s) => s.key === key)) continue;
    sections = sections.filter((s) => s.key !== key);
    truncated.push(key);
  }

  const bodyText = sections.map((s) => `## ${s.title}\n${s.body}`).join("\n\n");
  return { sections, text: bodyText, tokens: estimateTokens(bodyText), truncated, ...(audit ? { dropped } : {}) };
};
