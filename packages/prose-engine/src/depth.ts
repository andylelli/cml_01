/**
 * 17-hitting-90 §07 — depth from what the pipeline already wrote.
 *
 * MEASURED on the four golden cases: of ~41,000 words of character, place, period and relationship
 * material the upstream agents produce, about 12% reached v2's writer. Profile paragraphs (6,286
 * words), location paragraphs and time-of-day sensory variants, the era's physical constraints, each
 * character's internal conflict and personal stake: 0%.
 *
 * The rule for bringing it in is the one clues and stock lines follow: EACH PIECE IS OWNED BY ONE
 * CHAPTER, and asked for as an act. Material available to every chapter call recurs in every chapter
 * — run 98dec72a's "harsh winters" from a trait line the bible gave every call (WP-001 §4.3). Nothing
 * here goes into the bible; it goes into the one chapter contract that owns it.
 *
 * NOT used: the profile paragraphs. Read on the golden cases they re-word the case fields and carry
 * the humour label P4.2 removed ("his speech was laced with polite savagery"); WP-001 §2.2 counted
 * 1 dated origin in 378 profiles. Mining them would reintroduce labels, not depth.
 */
import { TEMPLATE } from "./contract-phrases.js";
import type { ContractCore, ContractInput, Texture } from "./types.js";

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const rec = (value: unknown): Record<string, unknown> => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

/** The first sentence: enough to act on, short enough not to be pasted as a paragraph (A_67). */
const firstSentence = (value: unknown): string => {
  const t = text(value);
  const m = t.match(/^.{20,260}?[.!?](?=\s|$)/);
  return (m ? m[0] : t.slice(0, 220)).trim();
};

const sameName = (a: string, b: string): boolean => {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return Boolean(x && y) && (x.includes(y) || y.includes(x));
};

export const assignTexture = (input: ContractInput, core: ContractCore): Map<number, Texture> => {
  const out = new Map<number, Texture>();
  const get = (chapter: number): Texture => {
    const t = out.get(chapter) ?? {};
    out.set(chapter, t);
    return t;
  };
  const victim = core.fairPlay.victim;
  // The reveal and the aftermath have their own work; texture goes to the chapters before them.
  const open = core.scenes.filter((s) => s.chapter < core.roles.reveal).map((s) => s.chapter);

  // 1. Place, by scene: one sight and one sound from the location's variant for this hour, never reused.
  //    Outline locations are free text ("Library and kitchen areas") and key locations are names
  //    ("Winthrope Manor Library"), so they meet on a shared distinctive word; the estate's own name,
  //    common to every key location, is not distinctive. A room with no key location takes one note
  //    of the setting's sensory palette instead.
  const locations = asArray(rec(input.locations).keyLocations).map(rec);
  const words = (v: string): string[] => v.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4).map((w) => w.slice(0, 5));
  const counts = new Map<string, number>();
  for (const l of locations) for (const w of new Set(words(text(l.name)))) counts.set(w, (counts.get(w) ?? 0) + 1);
  const PLAIN = new Set(["room", "areas", "area", "nearb", "adjoi", "main", "estat", "manor", "house", "corne", "withi", "groun"]);
  const distinct = (v: string): string[] => words(v).filter((w) => !PLAIN.has(w) && (counts.get(w) ?? 0) < Math.max(2, locations.length / 2));
  const weather = text(rec(rec(input.locations).atmosphere).weather).toLowerCase();
  const palette = rec(rec(rec(input.locations).atmosphere).sensoryPalette);
  const paletteNotes = asArray(palette.secondary).map(text).filter(Boolean);
  const usedSense = new Set<string>();
  const accessDone = new Set<string>();
  for (const scene of core.scenes) {
    const want = new Set(distinct(scene.location));
    const loc = locations.find((l) => distinct(text(l.name)).some((w) => want.has(w)));
    if (!loc) {
      const note = paletteNotes.find((n) => !usedSense.has(n));
      if (note && open.includes(scene.chapter)) {
        usedSense.add(note);
        get(scene.chapter).senses = [note];
      }
      continue;
    }
    const variants = asArray(loc.sensoryVariants).map(rec);
    const hour = (scene.timeOfDay ?? "").toLowerCase();
    // The book has one weather (the setting's); a variant for another would contradict the page before.
    const fits = (v: Record<string, unknown>): boolean => !text(v.weather) || weather.includes(text(v.weather).toLowerCase());
    const atHour = (v: Record<string, unknown>): boolean => Boolean(hour) && hour.includes(text(v.timeOfDay).toLowerCase());
    const ordered = [...variants.filter((v) => fits(v) && atHour(v)), ...variants.filter(fits), rec(loc.sensoryDetails)];
    const pick = (key: string): string | undefined => {
      for (const v of ordered) {
        for (const s of asArray(v[key]).map(text)) {
          if (s && !usedSense.has(s)) {
            usedSense.add(s);
            return s;
          }
        }
      }
      return undefined;
    };
    const senses = [pick("sights"), pick("sounds")].filter((s): s is string => Boolean(s));
    if (senses.length > 0) get(scene.chapter).senses = senses;
    const access = firstSentence(loc.accessControl);
    const locName = text(loc.name);
    if (access && !accessDone.has(locName) && open.includes(scene.chapter)) {
      accessDone.add(locName);
      get(scene.chapter).access = access;
    }
  }

  // 2. The period as friction: each physical constraint to one chapter, spread from chapter 2.
  // An absence ("No television", "Early aviation exists but plays little role") cannot happen to anybody.
  const constraints = asArray(rec(rec(input.world).historicalMoment).physicalConstraints)
    .map(text)
    .filter((c) => c && !/^(?:no|early)\b|\bexists\b|\blittle role\b/i.test(c));
  const frictionChapters = open.filter((c) => c > 1);
  constraints.slice(0, frictionChapters.length).forEach((constraint, i) => {
    const chapter = frictionChapters[Math.round((i * frictionChapters.length) / Math.min(constraints.length, frictionChapters.length))]!;
    if (!get(chapter).friction) get(chapter).friction = constraint;
  });

  // 3. Inner life: each living character's conflict and stake, once, on the first open chapter they
  //    are on the page in that has none yet. Never the culprit's: an internal conflict written for the
  //    murderer is often the motive in other words, and would point.
  const profiles = asArray(rec(input.profiles).profiles).map(rec);
  const profileOf = (name: string): Record<string, unknown> | undefined => profiles.find((p) => text(p.name) === name);
  for (const p of profiles) {
    const name = text(p.name);
    const conflict = firstSentence(p.internalConflict);
    if (!name || !conflict || name === victim || core.fairPlay.culprits.includes(name)) continue;
    const scene = core.scenes.find((s) => open.includes(s.chapter) && s.present.includes(name) && !out.get(s.chapter)?.conflict);
    if (!scene) continue;
    get(scene.chapter).conflict = { name, conflict, stake: firstSentence(p.personalStakeInCase) || undefined };
  }

  // 4. Relationships: a pair with a shared history, both on the page, once per pair, one per chapter.
  const cast = rec(input.cast);
  const pairs = asArray(rec(cast.relationships).pairs ?? cast.relationships).map(rec);
  const pairDone = new Set<number>();
  for (const scene of core.scenes) {
    if (!open.includes(scene.chapter)) continue;
    const living = scene.present.filter((n) => n !== victim);
    const i = pairs.findIndex(
      (p, idx) =>
        !pairDone.has(idx) &&
        text(p.sharedHistory) &&
        // A "history" that is the investigation itself is the case, not a past.
        !/\b(?:investigat|interview|inquiry|murder|the case|suspect)/i.test(text(p.sharedHistory)) &&
        living.includes(text(p.character1)) &&
        living.includes(text(p.character2)),
    );
    if (i < 0) continue;
    pairDone.add(i);
    get(scene.chapter).history = { a: text(pairs[i]!.character1), b: text(pairs[i]!.character2), past: firstSentence(pairs[i]!.sharedHistory) };
  }

  return out;
};

/** The chapter-contract lines for one chapter's texture: acts, each with a person or a thing. */
export const textureLines = (t: Texture | undefined): string[] => {
  if (!t) return [];
  const lines: string[] = [];
  if (t.senses?.length) lines.push(`Of this place at this hour, ${TEMPLATE.inPassing}: ${t.senses.join("; ")}.`);
  if (t.access) lines.push(`The rule of this place, ${TEMPLATE.runsUpAgainst}: ${t.access}`);
  if (t.friction) lines.push(`${TEMPLATE.periodInTheWay}, as a thing that happens to them: ${t.friction}.`);
  if (t.conflict) {
    lines.push(
      `${t.conflict.name} makes one choice in this chapter that ${TEMPLATE.pullsTwoWays}: ${t.conflict.conflict}` +
        (t.conflict.stake ? ` What the case means to them: ${t.conflict.stake}` : ""),
    );
  }
  if (t.history) lines.push(`${t.history.a} and ${t.history.b} share a past: ${t.history.past} ${TEMPLATE.neitherNames}.`);
  return lines;
};
