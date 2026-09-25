/**
 * TWO CHECKERS THE READS OF 2026-09-22 ASKED FOR.
 *
 * ── 1. INSTRUCTION ECHO ───────────────────────────────────────────────────────────────────────
 *
 * A phrase from the writer's INSTRUCTIONS — the brief's asks and the chapter contract's template
 * wording — appearing verbatim in the manuscript. Not a list: the instructions are the list, so a
 * new operation added to the brief is covered the day it is written.
 *
 * MEASURED before building, on the three read manuscripts: a checker drawn from the WHOLE ask
 * (bible + contracts) is useless — its top hits are "manor hall clock" x15 and "the detent lever"
 * x7, the case's own facts, which the prose must contain. The leaks the reader named are
 * instruction vocabulary: "flat answer", "six words or fewer", "delivered a speech", "unmeant joke",
 * "the outcome was settled". So the sources are the instruction lines only, and any phrase that
 * also occurs in the bible is case vocabulary and is skipped.
 *
 * ── 2. CATCHPHRASE ────────────────────────────────────────────────────────────────────────────
 *
 * A quoted line of two to six words said three or more times in the book. The reader on A: *"Use
 * each once or twice, not every chapter"* — and listed five. The probe with this rule listed the
 * same five, in the same order: "fact first" 6, "torque says otherwise" 5, "that would be
 * unfortunate" 4, "as it must be" 3, "if only they knew" 3. On B it caught "agatha's answer was
 * flat" — the flat-answer label leaking as narration, which is checker 1's job too.
 */
import { splitSentences } from "./sentences.js";
import type { ProseChapterLike } from "./types.js";

/**
 * Function words. A CLOSED class by definition — English does not coin modals or pronouns — so this
 * list is not the closed-vocabulary trap, which is about open-class words deciding a pass.
 *
 * The first cut lacked the modals and indefinite pronouns, and on the three read books it reported
 * "would have", "nothing to do with" and "next question" as our wording on the page.
 */
const STOP = new Set(
  (
    "the a an of in on at to and or but is was were be been it its this that these those he she they them " +
    "his her their with for from by as into than then there here who whom which what when where how not no " +
    "one two three four five six seven eight nine ten each every any some all more most much very so if " +
    "because before after while until up down out over under again once only same own other such " +
    "would could should might must shall will can may have has had do does did done being " +
    "nothing something anything everything nobody somebody anybody everybody next"
  ).split(" "),
);

/**
 * A short phrase used ONCE is coincidence; the reader's complaints were all repetitions ("x7",
 * "repeated too often"). So a phrase of two or three words is an echo only if the book uses it at
 * least this many times. Four words or more verbatim is an echo on sight.
 */
const SHORT_ECHO_MINIMUM = 2;

const words = (text: string): string[] =>
  text.toLowerCase().replace(/[^a-z'\s-]/g, " ").split(/\s+/).filter(Boolean);

const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The phrases an instruction line contributes: 2-grams of two content words, 3–6-grams with at
 * least two content words, none containing a cast token, none present in the case text.
 */
export const instructionPhrases = (
  lines: ReadonlyArray<string>,
  castNames: ReadonlyArray<string>,
  caseText: string,
): string[] => {
  const cast = new Set(castNames.flatMap(words));
  const lowerCase = caseText.toLowerCase();
  const out = new Set<string>();
  for (const line of lines) {
    const w = words(line);
    for (let n = 2; n <= 6; n += 1) {
      for (let i = 0; i + n <= w.length; i += 1) {
        const g = w.slice(i, i + n);
        if (g.some((t) => cast.has(t))) continue;
        const content = g.filter((t) => !STOP.has(t)).length;
        if (n === 2 ? content < 2 : content < 2) continue;
        const phrase = g.join(" ");
        if (lowerCase.includes(phrase)) continue;
        out.add(phrase);
      }
    }
  }
  return [...out];
};

/**
 * A crude stem: enough to make "carries"/"carried", "needs"/"needed" and "resuming"/"resumed" the
 * same word, which is all an echo needs. Not a linguistic claim — the probe is the corpus (§06 F7).
 */
export const stem = (word: string): string => {
  let t = word.toLowerCase().replace(/['’]s$/, "");
  if (t.length > 4 && /(?:ies|ied)$/.test(t)) t = `${t.slice(0, -3)}y`;
  else if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ed")) t = t.slice(0, -2);
  else if (t.length > 4 && t.endsWith("es") && !/(?:ss|us|is)es$/.test(t)) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !/(?:ss|us|is)$/.test(t)) t = t.slice(0, -1);
  if (t.length > 4 && t.endsWith("e")) t = t.slice(0, -1);
  return t;
};

const contentStems = (text: string, cast: ReadonlySet<string> = new Set()): string[] =>
  words(text)
    .filter((w) => !STOP.has(w))
    .map((w) => (cast.has(w) ? "\u0000" : stem(w)));

/** Content words, stemmed — the vocabulary two texts share once tense and function words are gone. */
export const contentStemsOf = (text: string): string[] => contentStems(text);

/** How many content words in a row, stemmed, make an echo: two is ordinary English, three is ours. */
export const STEM_ECHO_LENGTH = 3;

/**
 * The INFLECTED echo. The verbatim phrases miss our wording when the writer changes its tense: the
 * brief's "carries nothing the plot needs" came back three times on run 98dec72a as "carried nothing
 * the plot needed", and "the place resuming ordinary use" as "the study resumed its ordinary use".
 * So each instruction line also contributes every run of three content words, stemmed; a run that
 * crosses a cast name, or that the case text also contains, is not ours.
 */
export const instructionStemGrams = (
  lines: ReadonlyArray<string>,
  castNames: ReadonlyArray<string>,
  caseText: string,
): string[] => {
  const cast = new Set(castNames.flatMap(words));
  const caseStems = ` ${contentStems(caseText).join(" ")} `;
  const out = new Set<string>();
  for (const line of lines) {
    const s = contentStems(line, cast);
    for (let i = 0; i + STEM_ECHO_LENGTH <= s.length; i += 1) {
      const gram = s.slice(i, i + STEM_ECHO_LENGTH);
      if (gram.includes("\u0000")) continue;
      const joined = gram.join(" ");
      if (caseStems.includes(` ${joined} `)) continue;
      out.add(joined);
    }
  }
  return [...out];
};

export interface EchoHit {
  chapter: number;
  phrase: string;
  sentence: string;
}

/** Every instruction phrase that comes back in the prose, once per chapter per phrase, longest first. */
export const findInstructionEchoes = (
  chapters: ReadonlyMap<number, ProseChapterLike>,
  phrases: ReadonlyArray<string>,
  stemGrams: ReadonlyArray<string> = [],
): EchoHit[] => {
  const hits: EchoHit[] = [];
  const book = [...chapters.values()].map((c) => (c.paragraphs ?? []).join(" ")).join(" ").toLowerCase();
  const ordered = [...phrases]
    .filter((phrase) => {
      if (phrase.split(/\s+/).length >= 4) return true;
      const re = new RegExp(`\\b${escape(phrase).replace(/\s+/g, "\\s+")}\\b`, "g");
      return (book.match(re) ?? []).length >= SHORT_ECHO_MINIMUM;
    })
    .sort((a, b) => b.length - a.length);
  for (const [chapter, written] of chapters) {
    const body = (written.paragraphs ?? []).join(" ").replace(/\s+/g, " ");
    const lower = body.toLowerCase();
    const taken: string[] = [];
    for (const phrase of ordered) {
      if (taken.some((t) => t.includes(phrase))) continue; // a longer echo already covers it
      const re = new RegExp(`\\b${escape(phrase).replace(/\s+/g, "\\s+")}\\b`);
      if (!re.test(lower)) continue;
      const sentence = splitSentences(body).find((s) => re.test(s.toLowerCase())) ?? body.slice(0, 120);
      hits.push({ chapter, phrase, sentence });
      taken.push(phrase);
    }
    if (stemGrams.length > 0) {
      const grams = new Set(stemGrams);
      const flagged = new Set(hits.filter((h) => h.chapter === chapter).map((h) => h.sentence));
      for (const sentence of splitSentences(body)) {
        if (flagged.has(sentence)) continue; // a verbatim echo already names this sentence
        const s = contentStems(sentence);
        for (let i = 0; i + STEM_ECHO_LENGTH <= s.length; i += 1) {
          const gram = s.slice(i, i + STEM_ECHO_LENGTH).join(" ");
          if (!grams.has(gram)) continue;
          hits.push({ chapter, phrase: `~${gram}`, sentence });
          flagged.add(sentence);
          break;
        }
      }
    }
  }
  return hits;
};

export interface CatchphraseHit {
  chapter: number;
  line: string;
  count: number;
  sentence: string;
}

/**
 * Quoted lines of two to six words said three or more times. One hit per chapter from the third
 * saying on, pointing the editor at the sayings that turned a voice into a label.
 */
export const findCatchphrases = (
  chapters: ReadonlyMap<number, ProseChapterLike>,
  minimum = 3,
): CatchphraseHit[] => {
  const ordered = [...chapters.entries()].sort((a, b) => a[0] - b[0]);
  const totals = new Map<string, number>();
  const sightings: Array<{ chapter: number; key: string; sentence: string }> = [];
  for (const [chapter, written] of ordered) {
    const body = (written.paragraphs ?? []).join(" ").replace(/\s+/g, " ");
    const sentences = splitSentences(body);
    for (const sentence of sentences) {
      for (const m of sentence.matchAll(/[\u201c"]([^\u201c\u201d"]{4,60})[\u201d"]/g)) {
        const w = words(m[1] ?? "");
        if (w.length < 2 || w.length > 6) continue;
        sightings.push({ chapter, key: w.join(" "), sentence });
      }
    }
  }
  // A saying that only adds an address to a line already said is the same line: run 98dec72a had
  // "Let's cut to the chase," twice and "Let's cut to the chase, Inspector," once, and counted two.
  const keys = [...new Set(sightings.map((s) => s.key))];
  const canonical = new Map<string, string>();
  for (const key of keys) {
    const base = keys
      .filter((k) => k !== key && k.split(" ").length >= 3 && key.startsWith(`${k} `))
      .sort((a, b) => a.length - b.length)[0];
    canonical.set(key, base ?? key);
  }
  for (const s of sightings) {
    s.key = canonical.get(s.key) ?? s.key;
    totals.set(s.key, (totals.get(s.key) ?? 0) + 1);
  }
  const hits: CatchphraseHit[] = [];
  const seen = new Map<string, number>();
  const reported = new Set<string>();
  for (const s of sightings) {
    const total = totals.get(s.key) ?? 0;
    if (total < minimum) continue;
    const n = (seen.get(s.key) ?? 0) + 1;
    seen.set(s.key, n);
    if (n < minimum) continue;
    const tag = `${s.chapter}|${s.key}`;
    if (reported.has(tag)) continue;
    reported.add(tag);
    hits.push({ chapter: s.chapter, line: s.key, count: total, sentence: s.sentence });
  }
  return hits;
};
