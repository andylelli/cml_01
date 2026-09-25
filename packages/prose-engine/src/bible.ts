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

const field = (source: unknown, ...keys: string[]): string => {
  const s = source as Record<string, unknown> | null;
  for (const key of keys) {
    const v = text(s?.[key]);
    if (v) return v;
  }
  return "";
};

/** Trim a section's body to its budget on a line boundary, so a truncated entry is never half-read. */
const toBudget = (lines: string[], budget: number): string => {
  const kept: string[] = [];
  let tokens = 0;
  for (const line of lines) {
    const cost = estimateTokens(line) + 1;
    if (tokens + cost > budget) break;
    kept.push(line);
    tokens += cost;
  }
  return kept.join("\n");
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
    for (const point of asArray(fs.supporting_points)) {
      const p = typeof point === "string" ? text(point) : field(point, "point", "description");
      if (p) lines.push(`  - ${p}`);
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

const castSection = (
  caseBlock: Record<string, unknown>,
  input: ContractInput,
  core: ContractCore,
): string[] => {
  const cast = asArray(input.cast?.characters);
  const profiles = asArray(input.profiles?.profiles);
  const profileByName = new Map(profiles.map((p) => [field(p, "name"), p as Record<string, unknown>]));
  const lines: string[] = [];
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
    if (mannerisms) bits.push(`  Speech: ${mannerisms}`);
    const tic = field(profile, "signatureTic");
    if (tic) bits.push(`  Says, in their own way: ${tic}`);
    // A_96 F9 — the TRAIT clause only. The cause is withheld on purpose: run 50862 narrated the whole
    // formative incident as a label seven times, because the whole of it was in the prompt.
    const trait = core.scenes.find((s) => s.beats.depth?.name === name)?.beats.depth?.trait;
    if (trait) bits.push(`  One thing about them, shown never explained: ${trait}`);
    lines.push(...bits);
  }
  return lines;
};

const worldSection = (input: ContractInput): string[] => {
  const lines: string[] = [];
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

const chronologySection = (
  core: ContractCore,
  lockedFacts: ReadonlyArray<Record<string, unknown>>,
): string[] => {
  const lines: string[] = [];
  for (const row of core.chronology.rows) {
    lines.push(`  ${row.value} — ${row.label}`);
  }
  const values = new Set(core.chronology.rows.map((r) => r.value));
  for (const fact of lockedFacts) {
    const value = text(fact.value);
    const description = text(fact.description);
    if (!value || values.has(value)) continue;
    lines.push(`  ${value} — ${description || String(fact.id ?? "")}`);
  }
  if (lines.length > 0) {
    lines.unshift("Every one of these is written the same way every time it appears:");
  }
  return lines;
};

const cluesSection = (core: ContractCore): string[] => {
  const lines: string[] = [];
  for (const scene of core.scenes) {
    for (const surface of scene.mustSurface) {
      const observable = surface.observable || surface.keyTerms.join(", ");
      if (!observable) continue;
      const unlocked = surface.unlockedBy ? ` — ${surface.unlockedBy.name} reads it because they know ${surface.unlockedBy.skill}` : "";
      lines.push(`  [${surface.id}] chapter ${scene.chapter}: ${observable}${unlocked}`);
    }
  }
  if (lines.length > 0) {
    lines.unshift("Each is shown once, in the chapter named, as something somebody sees, finds or says:");
  }
  return lines;
};

const relationshipsSection = (input: ContractInput): string[] => {
  const relationships = input.cast?.relationships as Record<string, unknown> | undefined;
  const pairs = asArray(relationships?.pairs ?? relationships);
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
    const body = [relationship, history].filter(Boolean).join(" ");
    lines.push(`  ${a} & ${b}${tension && tension !== "none" ? ` (${tension} tension)` : ""}: ${body}`);
  }
  return lines;
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
    { key: "case", lines: caseSection(caseBlock, core) },
    { key: "cast", lines: castSection(caseBlock, input, core) },
    { key: "world", lines: worldSection(input) },
    { key: "chronology", lines: chronologySection(core, input.lockedFacts ?? []) },
    { key: "clues", lines: cluesSection(core) },
    { key: "relationships", lines: relationshipsSection(input) },
  ];

  let sections = built
    .map(({ key, lines }) => {
      const body = toBudget(lines, BIBLE_BUDGETS[key]);
      return { key, title: SECTION_TITLES[key], body, tokens: estimateTokens(body) };
    })
    .filter((s) => s.body.length > 0);

  const truncated: BibleSectionKey[] = [];
  const total = () => sections.reduce((sum, s) => sum + s.tokens + estimateTokens(s.title) + 2, 0);
  for (const key of DROPPABLE) {
    if (total() <= BIBLE_BUDGET) break;
    if (!sections.some((s) => s.key === key)) continue;
    sections = sections.filter((s) => s.key !== key);
    truncated.push(key);
  }

  const bodyText = sections.map((s) => `## ${s.title}\n${s.body}`).join("\n\n");
  return { sections, text: bodyText, tokens: estimateTokens(bodyText), truncated };
};
