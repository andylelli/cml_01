/**
 * ANALYSIS_110 step 1 — the opening the owner asked for (PROSE_V2_OPENING).
 *
 * The owner's read of run bcc0d637: "a good scene setting near the beginning… a better introduction to the characters
 * including the victim… people need to respond to the fact someone has died… why the characters are there and what
 * their relationships are." MEASURED on that book: no paragraph of pure description in 201; the year, the village and
 * the country never named; an occupation stated where a person first appears for 1 of 5 (23% across 124 people in 25
 * v2 drafts); grief 0 and "death" once in 12,607 words; the police never sent for. And 25 of 25 v2 first chapters open
 * on a spoken line, against 16 of 149 canon openings (median 131 words of narration first).
 *
 * Every line here is a count of a simple thing or a slot filled from an artifact the pipeline already wrote, which is
 * the form this writer keeps (A_102 §7, A_110 §14). Nothing goes to the bible.
 */
import { a110UpstreamEnabled, openingEnabled } from "@cml/cml";
import type { ContractCore, ContractInput, Opening, SceneContract } from "./types.js";
import { dateOf } from "./bible.js";

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const rec = (value: unknown): Record<string, unknown> => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

/** "Retired Shipowner and Hotel Owner (Victim)" → "retired shipowner and hotel owner". */
const occupationOf = (member: Record<string, unknown>): string =>
  text(member.occupation).replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase();

/** "70-80" → "in his seventies". */
const agePhrase = (member: Record<string, unknown>): string => {
  const n = Number(String(member.ageRange ?? member.age_range ?? "").match(/\d+/)?.[0]);
  if (!Number.isFinite(n) || n < 20) return "";
  const decade = ["twenties", "thirties", "forties", "fifties", "sixties", "seventies", "eighties", "nineties"][Math.floor(n / 10) - 2];
  const g = text(member.gender).toLowerCase();
  const pronoun = g === "female" ? "her" : g === "male" ? "his" : "their";
  return decade ? `in ${pronoun} ${decade}` : "";
};

/**
 * What a person was to the dead, as the cast's own relationship sentence says it, cut before the clause that carries a
 * secret ("…, who had rewritten his will", "… and knew his secret smuggling profits"). The culprit's pair sentence is
 * the motive in other words ("coerced into being an informant"), so the culprit gets none.
 */
const relationTo = (name: string, victim: string, pairs: unknown[], culprits: ReadonlyArray<string>): string => {
  if (!victim || culprits.includes(name)) return "";
  const pair = pairs.map(rec).find((p) => {
    const a = text(p.character1), b = text(p.character2);
    return (a === name && b === victim) || (a === victim && b === name);
  });
  // "Jr." and "Mrs." end no sentence: run bcc0d637's "Reginald Gresham Jr. was the disinherited son…" cut to the name.
  const sentence = text(pair?.relationship).split(/(?<!\b(?:Jr|Sr|Mr|Mrs|Ms|Dr|St))[.!?]\s/)[0] ?? "";
  if (!sentence.startsWith(name)) return "";
  const cut = sentence.split(/,|;| because | and knew | and had | and was /)[0]!.trim().replace(/[.]$/, "");
  return cut.replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+(?:was|is)\\s+`), "").trim();
};

const isOfficialInvestigator = (role: string): boolean => /\b(?:inspector|police|constable|sergeant|superintendent|official)\b/i.test(role);

export const assignOpening = (input: ContractInput, core: ContractCore): Map<number, Opening> => {
  const out = new Map<number, Opening>();
  if (!openingEnabled() || core.scenes.length === 0) return out;
  const get = (chapter: number): Opening => {
    const o = out.get(chapter) ?? {};
    out.set(chapter, o);
    return o;
  };
  const victim = core.fairPlay.victim;
  const culprits = core.fairPlay.culprits;
  const cast = asArray(input.cast?.characters).map(rec);
  const pairs = asArray(rec(input.cast?.relationships).pairs ?? input.cast?.relationships);
  const profiles = asArray(input.profiles?.profiles).map(rec);
  const locations = rec(input.locations);
  const primary = rec(locations.primary);
  const setting = rec(rec(input.setting).setting ?? input.setting);

  // W2 — the place before anybody speaks, in the first chapter.
  const first = core.scenes[0]!;
  const looks = text(primary.visualDescription);
  // A_111 P-4: and when. Run bcc0d637 arm B put the place on the page and not the date (Mevagissey 2, January 0,
  // 1934 0): the where-and-when line is in the bible, and the opening asked for the place only. A decade ("1930s") is
  // not a date, so only a four-digit year is asked for.
  const { month, year } = dateOf(input);
  const when = /^\d{4}$/.test(year) ? [month, year].filter(Boolean).join(" ") : "";
  if (looks) get(first.chapter).establishing = { looks, weather: text(rec(locations.atmosphere).weather) || undefined, ...(when ? { when } : {}) };

  // W3 — each profiled room described on its first visit (the chapter whose location shares a distinctive word).
  const keyLocations = asArray(locations.keyLocations).map(rec);
  const words = (v: string): string[] => v.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4).map((w) => w.slice(0, 5));
  const common = new Map<string, number>();
  for (const l of keyLocations) for (const w of new Set(words(text(l.name)))) common.set(w, (common.get(w) ?? 0) + 1);
  const distinct = (v: string): string[] => words(v).filter((w) => (common.get(w) ?? 0) < Math.max(2, keyLocations.length / 2) && !["room", "areas", "area", "hotel", "manor", "house"].includes(w));
  const visited = new Set<string>();
  for (const scene of core.scenes) {
    if (scene.chapter >= core.roles.reveal) break;
    const want = new Set(distinct(scene.location));
    const loc = keyLocations.find((l) => distinct(text(l.name)).some((w) => want.has(w)));
    const name = text(loc?.name);
    if (!loc || !name || visited.has(name) || !text(loc.visualDetails)) continue;
    visited.add(name);
    get(scene.chapter).firstVisit = { location: name, looks: text(loc.visualDetails) };
  }

  // P1 (+R1) — each person introduced in the first chapter that lists them: what they do, and what they were to the dead.
  const seen = new Set<string>();
  for (const scene of core.scenes) {
    for (const name of scene.present) {
      if (seen.has(name) || name === victim || (scene.chapter > core.roles.reveal && culprits.includes(name))) continue;
      seen.add(name);
      const member = cast.find((m) => text(m.name) === name);
      if (!member) continue;
      const occupation = occupationOf(member);
      if (!occupation) continue;
      const g = text(member.gender).toLowerCase();
      const profile = a110UpstreamEnabled() ? profiles.find((p) => text(p.name) === name) : undefined;
      (get(scene.chapter).introductions ??= []).push({
        name,
        occupation,
        relation: relationTo(name, victim, pairs, culprits) || undefined,
        pronoun: g === "female" ? "she is" : g === "male" ? "he is" : "they are",
        ...(text(profile?.appearance) ? { appearance: text(profile?.appearance) } : {}),
        ...(text(profile?.whyHere) ? { whyHere: text(profile?.whyHere) } : {}),
      });
    }
  }

  // The body chapter: the victim introduced (D1's "who he was"), each person present speaks of the death, and — for an
  // investigator with no standing — somebody sends for the police and the place keeps them away (D2).
  const body = core.scenes.find((s) => s.present.includes(victim) && !s.wound && !s.victimAlive);
  if (body && victim) {
    const member = cast.find((m) => text(m.name) === victim);
    const detective = cast.find((m) => /detective|investigator|sleuth|inspector/i.test(`${text(m.role)} ${text(m.roleArchetype)}`));
    const witnesses = body.present.filter((n) => n !== victim);
    const g = text(member?.gender).toLowerCase();
    get(body.chapter).death = {
      victim,
      pronoun: g === "female" ? "she" : g === "male" ? "he" : "they",
      who: [member && occupationOf(member) ? withArticle(occupationOf(member)) : "", member ? agePhrase(member) : ""].filter(Boolean).join(", "),
      witnesses,
      authority: detective && isOfficialInvestigator(`${text(detective.role)} ${text(detective.roleArchetype)}`)
        ? undefined
        : text(rec(setting.location).geographicIsolation) || "the police and a doctor are some way off",
    };
  }
  return out;
};

/**
 * The opening chapter carries the place, the people and the death; its trait, inner-conflict and shared-history lines
 * move to the next chapter that has the person on the page and none of its own (A_110 §18 step 1).
 */
export const clearTheOpening = (scenes: SceneContract[]): void => {
  if (!openingEnabled() || scenes.length < 2) return;
  const first = scenes[0]!;
  const later = scenes.slice(1);
  const depth = first.beats.depth;
  if (depth) {
    delete first.beats.depth;
    const home = later.find((s) => !s.beats.depth && s.present.includes(depth.name));
    if (home) home.beats.depth = depth;
  }
  const conflict = first.texture?.conflict;
  if (conflict) {
    delete first.texture!.conflict;
    const home = later.find((s) => !s.texture?.conflict && s.present.includes(conflict.name));
    if (home) home.texture = { ...(home.texture ?? {}), conflict };
  }
  const history = first.texture?.history;
  if (history) {
    delete first.texture!.history;
    const home = later.find((s) => !s.texture?.history && s.present.includes(history.a) && s.present.includes(history.b));
    if (home) home.texture = { ...(home.texture ?? {}), history };
  }
};

const withArticle = (phrase: string): string =>
  /^(?:the|a|an)\s/i.test(phrase) ? phrase : `${/^[aeiou]/i.test(phrase) ? "an" : "a"} ${phrase}`;

/** A newcomer's facts as fields: the occupation and the relation (or the relation alone when it names the occupation). */
const introFacts = (i: NonNullable<Opening["introductions"]>[number]): string => {
  const last = i.occupation.split(/\s+/).pop() ?? "";
  const what = i.relation && last && i.relation.toLowerCase().includes(last) ? i.relation : [i.occupation, i.relation].filter(Boolean).join("; ");
  return [what, i.appearance ? `what anybody first notices: ${i.appearance}` : "", i.whyHere ? `why here: ${i.whyHere}` : ""].filter(Boolean).join("; ");
};

/** The chapter-contract lines for the opening's additions. */
export const openingLines = (o: Opening | undefined): string[] => {
  if (!o) return [];
  const lines: string[] = [];
  if (o.establishing) {
    lines.push(
      `This chapter opens on the place before anybody speaks. Its first two paragraphs are narration of what is there and how it looks` +
        `${o.establishing.weather ? `, in this weather (${o.establishing.weather})` : ""}: ${o.establishing.looks} ` +
        `${o.establishing.when ? `One of those two paragraphs says when it is: ${o.establishing.when}. ` : ""}` +
        `The first line anybody speaks is in the third paragraph or later.`,
    );
  }
  if (o.firstVisit) {
    lines.push(`The first time the book is in ${o.firstVisit.location}, two sentences show what it looks like before anything is done there: ${o.firstVisit.looks}`);
  }
  /**
   * A_111 P-3 — one operation for the chapter's newcomers, then the FACTS, never a sentence to paste. Run bcc0d637 arm B,
   * given one "X is on the page for the first time here: a clause beside the name says once that …" line per person,
   * opened five paragraphs running on "Name, appositive, verb", one of them the contract's appositive nearly word for
   * word. A count of a simple thing is the shape this model keeps (A_102 §7): one introduction to a paragraph, each in
   * the sentence where that person first does or says something.
   */
  const intros = o.introductions ?? [];
  /**
   * A_111 — the roll call. When the newcomers and the death share a chapter, its two blocks (introduce each newcomer; each
   * witness says one line about the death) were answered together, one paragraph per person: arms C and D opened four
   * paragraphs running on `"<line about the death>," X said. X, <appositive>…`, and the spacing count of P-3b was ignored.
   * Same-shape requirements collide (A_102 §8); a SEQUENCE separates them — each newcomer's first appearance is its own
   * numbered step, with another of the chapter's beats between every two, and each witness speaks after their own
   * introduction. Then one count, against the twelve name-led paragraphs arm D wrote after the introductions.
   */
  if (intros.length > 0 && o.death) {
    const d = o.death;
    const deathLine = (name: string) => `${name} says one line about ${d.victim}'s death — what it is to them, in their own words`;
    const pool: string[] = [];
    if (d.who) pool.push(`the body: the first time ${d.victim} is named, a clause says who ${d.pronoun} ${d.pronoun === "they" ? "were" : "was"} — ${d.who}`);
    if (d.authority) pool.push(`somebody sends for the police and a doctor, and they cannot come yet: ${d.authority}`);
    const newcomers = new Set(intros.map((i) => i.name));
    for (const w of d.witnesses) if (!newcomers.has(w)) pool.push(deathLine(w));
    const steps: string[] = [];
    for (const i of intros) {
      if (steps.length > 0) steps.push(pool.shift() ?? "a paragraph of what somebody already here does, with no newcomer in it");
      steps.push(`${i.name} first appears doing something, and that sentence says who ${i.pronoun}, in your own words — ${introFacts(i)}`);
      if (d.witnesses.includes(i.name)) pool.push(deathLine(i.name));
    }
    steps.push(...pool);
    lines.push("This chapter's opening, in this order — each step its own paragraph or more:");
    steps.forEach((step, k) => lines.push(`  ${k + 1}. ${step}`));
    lines.push("From a person's second mention on, call them by one name: the first name, or a title and the surname.");
    return lines;
  }
  if (intros.length > 0) {
    lines.push(
      `${intros.length === 1 ? "One person is" : `${intros.length} people are`} on the page for the first time here. ` +
        // A_111 P-3b: the count was obeyed and the roll call survived as four consecutive one-person paragraphs
        // (run resume-1791313282573) — so the count is of the SPACING, not of the unit to be split.
        `Introduce each in the sentence where they first do or say something, in your own words, from these facts, ` +
        `with at least two paragraphs between one introduction and the next:`,
    );
    for (const i of intros) {
      // A relation that already names the occupation ("the trusted family lawyer who…") is said instead of it, not after it.
      const last = i.occupation.split(/\s+/).pop() ?? "";
      const what = i.relation && last && i.relation.toLowerCase().includes(last) ? i.relation : [i.occupation, i.relation].filter(Boolean).join("; ");
      lines.push(`  ${i.name}: ${what}`);
      // A_110 P2: what a stranger sees, and why they are under this roof — said once, here, never in the bible.
      if (i.appearance) lines.push(`    what anybody first notices: ${i.appearance}`);
      if (i.whyHere) lines.push(`    why here: ${i.whyHere}`);
    }
  }
  if (o.death) {
    if (o.death.who) lines.push(`The first time ${o.death.victim} is named, a clause says who ${o.death.pronoun} ${o.death.pronoun === "they" ? "were" : "was"}: ${o.death.who}.`);
    if (o.death.witnesses.length > 0) {
      lines.push(`Before anybody handles the evidence, each of ${o.death.witnesses.join(", ")} says one line about ${o.death.victim}'s death — what it is to them, in their own words.`);
    }
    if (o.death.authority) lines.push(`Somebody sends for the police and a doctor, and they cannot come yet: ${o.death.authority}`);
  }
  return lines;
};
