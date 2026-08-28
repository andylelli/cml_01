/**
 * A_75 §6.2 (P2) — score the REGISTER, stop enumerating templates.
 *
 * ── WHY A SCORE AND NOT ANOTHER LIST ─────────────────────────────────────────────────────────────
 *
 * `register.ts` next door is a FROZEN FAMILY of five phrasings, and its own header states the law it
 * lives under: *"a rising count under NEW phrasings means the generation contract failed — fix the
 * contract, never grow this list."* That law is correct and it is also the ceiling. Every leakage
 * pattern this project owns was derived from a template we wrote, so the detectors converge on our
 * own output and nowhere else.
 *
 * THE CASE THAT PROVES IT (A_75 §2.1, MEASURED): `story_20260825-1838` scored `prose` 6 with the
 * external note *"Chapter 10 contains major validation leakage"*, and a probe over every registered
 * template pattern found NOTHING in that chapter. Reading it, there is no template match — the
 * closing paragraphs are simply written in a summarising, valedictory register:
 *
 *     "The truth was out, but innocence, once lost, would not return."
 *
 * Abstract subject, stative verb, no concrete noun, no sensory word. **The reader is recognising a
 * REGISTER and we are detecting STRINGS.** No list of known templates converges on that sentence,
 * because we never wrote it — the model did, in our voice.
 *
 * ── THE FOUR FEATURES, AND WHY THESE FOUR ────────────────────────────────────────────────────────
 *
 * Each is a property of the SENTENCE'S GRAMMAR, not of its wording, so a new phrasing scores the same
 * as an old one. That is the whole point: the instrument cannot be evaded by rewording.
 *
 *   1. `abstractSubject`   — the subject is a proposition-word (the truth / the record / that detail
 *                            / the evidence), not a person or a thing in the room.
 *   2. `stativeVerb`       — the main verb asserts a state (was / remained / stood / became) rather
 *                            than depicting an action.
 *   3. `noConcreteNoun`    — nothing in the sentence can be touched, held, or pointed at.
 *   4. `noSensoryWord`     — nothing can be seen, heard, smelled, felt or tasted.
 *
 * A sentence with all four is not describing a scene; it is summarising one. Golden Age narration
 * does that occasionally and on purpose. Machine text does it because it has nothing to describe.
 *
 * ── MEASURED, BEFORE THIS SHIPPED — AND THE HALF THAT FAILED ────────────────────────────────────
 *
 * A_75 §6.2 proposed this as "telemetry at 3, regeneration trigger at 4", on figures from an ad-hoc
 * probe. Re-derived properly against the 40 manuscripts a human has read and marked for `prose`
 * (`node scripts/register-score-probe.mjs`), HALF OF THAT PROPOSAL IS FALSE:
 *
 *     prose  books  sentences   rate@3    rate@4
 *         4      8       2458    15.9%     1.10%
 *         5     10       5048    15.6%     1.45%
 *         6     11       6372    13.6%     1.27%
 *         7      9       4825    12.7%     1.41%
 *         8      2       1013    10.0%     1.09%
 *
 *     per-book Spearman (prose mark vs rate), n = 40, |rho| > 0.314 to signify:
 *        threshold 3 : rho = -0.421   SIGNAL
 *        threshold 4 : rho = +0.207   NOT SIGNIFICANT, and the wrong sign
 *
 * **Threshold 3 is the first prose instrument this project owns that tracks the human mark.** The
 * rate falls monotonically from 15.9% at prose 4 to 10.0% at prose 8, and the per-book correlation
 * clears the 5% critical value. It ships as an always-on COUNT reported as a RATE — never a gate, on
 * [B1](../../../documentation/analysis/ANALYSIS_74/ANALYSIS_74.md)'s measured reasoning that a check
 * firing on one sentence in seven of a GOOD book is an off switch with extra steps.
 *
 * **Threshold 4 does not ship as a trigger, and the reason is worth keeping.** Its rate is flat
 * across the whole quality range (1.1%–1.45%) and its correlation points the WRONG WAY. Reading what
 * it flags in the two books a reader gave prose 8 explains why — *"The evidence, on the surface, was
 * impeccable."*, *"The implication was clear, but the accusation hung unspoken."* Those are good
 * sentences. A high score means a sentence is ABSTRACT, and abstraction at the right moment is
 * craft; what the mark responds to is the RATE of it, not any single instance. A trigger built on the
 * per-sentence score would have rewritten prose the reader liked.
 *
 * HONEST LIMIT: this measures a rate, and a rate is a health signal, not a defect list. It cannot
 * tell you WHICH sentence to fix, and the probe above is the standing check that it still tracks the
 * mark at all.
 */

export interface RegisterFeatures {
  abstractSubject: boolean;
  stativeVerb: boolean;
  noConcreteNoun: boolean;
  noSensoryWord: boolean;
}

export interface RegisterScore {
  sentence: string;
  /** 0–4 — how many features are present. See the header for what each one means. */
  score: number;
  features: RegisterFeatures;
}

/**
 * The threshold that MEASURES. Counted every run and reported as a rate; it never gates. rho = -0.421
 * against the human `prose` mark over 40 read manuscripts — see the header.
 */
export const REGISTER_TELEMETRY_THRESHOLD = 3;
/**
 * Exported for the probe and for anyone tempted to build a lever on it. **It is not a lever.** rho =
 * +0.207, not significant and the wrong sign: a score of 4 marks an ABSTRACT sentence, and abstraction
 * at the right moment is craft. Nothing in the pipeline acts on this, deliberately.
 */
export const REGISTER_SIGNAL_THRESHOLD = 4;

/**
 * Proposition-words. A sentence whose subject is one of these is talking ABOUT the case rather than
 * showing it. Deliberately abstract-only and short: adding concrete nouns here would make the feature
 * fire on ordinary narration and flatten the rate difference that makes threshold 3 an instrument.
 */
const ABSTRACT_SUBJECT_HEADS = [
  "truth", "record", "detail", "details", "evidence", "fact", "facts", "matter", "case",
  "account", "reasoning", "inference", "conclusion", "proof", "testimony", "statement",
  "statements", "innocence", "guilt", "justice", "answer", "question", "explanation",
  "possibility", "implication", "significance", "meaning", "result", "outcome", "sequence",
  "timeline", "alibi", "motive", "pattern", "connection", "discrepancy", "contradiction",
];

/**
 * The subject is the noun head of the opening noun phrase. Determiner-led only — "The truth was out"
 * scores, "Eleanor was tired" does not.
 */
const SUBJECT_RE = new RegExp(
  "^(?:the|that|this|those|these|its|his|her|their)\\s+"
  + "(?:\\w+\\s+){0,2}?(?:" + ABSTRACT_SUBJECT_HEADS.join("|") + ")\\b",
  "i",
);

const STATIVE_VERBS = [
  "was", "were", "is", "are", "had been", "have been", "has been", "would be", "will be",
  "remained", "remains", "stood", "stands", "became", "becomes", "seemed", "seems",
  "appeared", "appears", "held", "holds", "lay", "meant", "means", "amounted",
];
const STATIVE_RE = new RegExp("\\b(?:" + STATIVE_VERBS.join("|") + ")\\b", "i");

/**
 * Things a hand can reach or a body occupies. The list is broad ON PURPOSE — this feature fires on
 * ABSENCE, so a word MISSING here produces a FALSE POSITIVE. Under-listing costs precision, which is
 * the expensive direction. Period furniture is included because that is what these books are made of.
 */
const CONCRETE_NOUNS = [
  "hand", "door", "table", "chair", "window", "glass", "knife", "rope", "clock", "watch",
  "letter", "paper", "note", "lamp", "candle", "stair", "floor", "wall", "room", "hall",
  "garden", "gate", "road", "path", "cliff", "sea", "tide", "boat", "rock", "stone", "wood",
  "iron", "key", "lock", "coat", "hat", "glove", "shoe", "boot", "pocket", "cup", "bottle",
  "wine", "tea", "bread", "fire", "smoke", "ash", "blood", "wound", "body", "face", "eye",
  "mouth", "throat", "shoulder", "arm", "finger", "hair", "chest", "pipe", "cigarette",
  "book", "page", "desk", "drawer", "cabinet", "box", "trunk", "bag", "ledge", "beam", "rail",
  "post", "bell", "cord", "wire", "chain", "hook", "pendulum", "hourglass", "sand", "salt",
  "shaker", "bracket", "spring", "cog", "hinge", "curtain", "carpet", "mirror", "photograph",
  "portrait", "bed", "sheet", "pillow", "step", "ledger", "envelope", "stamp", "ink", "pen",
  "pencil", "chalk", "mud", "rain", "wind", "snow", "sun", "moon", "lantern", "torch", "gun",
  "revolver", "bullet", "poison", "phial", "vial", "cane", "stick", "umbrella", "bench",
  "wheel", "engine", "train", "carriage", "horse", "dog", "bird", "tree", "branch", "leaf",
  "grass", "hedge", "corridor", "landing", "terrace", "lawn", "kitchen", "study", "library",
  "cellar", "attic", "roof", "chimney", "railing", "balcony", "pier", "jetty", "shore",
];
const CONCRETE_RE = new RegExp(
  "\\b(?:" + [...new Set(CONCRETE_NOUNS)].join("|") + ")s?\\b",
  "i",
);

/** Same reasoning as CONCRETE_NOUNS — fires on absence, so breadth buys precision. */
const SENSORY_WORDS = [
  "saw", "see", "seen", "looked", "look", "watched", "watching", "glanced", "stared", "peered",
  "heard", "hear", "listened", "listening", "sound", "silence", "whisper", "shout", "cry",
  "creak", "clatter", "hum", "rang", "ring", "echo", "smell", "smelled", "scent", "reek",
  "stank", "taste", "tasted", "bitter", "sweet", "sour", "touch", "touched", "felt", "feel",
  "cold", "warm", "hot", "damp", "dry", "rough", "smooth", "sharp", "heavy", "light", "dark",
  "bright", "dim", "grey", "gray", "white", "black", "red", "green", "blue", "pale", "shadow",
  "gleam", "glint", "flicker", "shiver", "trembled", "breath", "breathed", "warmth", "chill",
  "ache", "pressed", "gripped", "pulled", "pushed", "knocked", "struck", "brushed", "quiet",
  "loud", "still", "thin", "thick", "wet", "soft", "hard",
];
const SENSORY_RE = new RegExp(
  "\\b(?:" + [...new Set(SENSORY_WORDS)].join("|") + ")\\b",
  "i",
);

/**
 * A leading subordinate clause hides the real subject. *"Weighed against the rest, that detail bent
 * the trail…"* has `that detail` as its subject and the clue injector writes exactly that shape.
 *
 * THE BUG THIS SHAPE EXISTS TO AVOID, found by running the probe rather than by reading: an earlier
 * version stripped everything before the first comma unconditionally, which ate the MAIN clause of
 * *"The truth was out, but innocence, once lost, would not return."* — and that sentence is the one
 * case this whole module was built to catch. The subject is therefore read from BOTH the sentence as
 * written and the sentence with its leading clause removed, and either hit counts. Stripping can then
 * only ever ADD a reading, never destroy one.
 */
const stripLeadingClause = (sentence: string): string => {
  const trimmed = sentence.trim();
  const comma = trimmed.indexOf(",");
  if (comma <= 0 || comma > 60) return trimmed;
  const rest = trimmed.slice(comma + 1).trim();
  return rest.length > 0 ? rest : trimmed;
};

export const scoreSentenceRegister = (sentence: string): RegisterScore => {
  const raw = String(sentence ?? "").trim();
  // PASS 8: an EMPTY string scored 2 of 4, because two of the four features fire on ABSENCE — no
  // concrete noun and no sensory word are both trivially true of no text at all. Nothing reaches this
  // path today (`splitSentences` drops anything under five words), but the function is exported and
  // the probe calls it directly on fixtures. "No sentence" is not "machine register"; it is no data.
  if (!raw) {
    return {
      sentence: "",
      score: 0,
      features: { abstractSubject: false, stativeVerb: false, noConcreteNoun: false, noSensoryWord: false },
    };
  }
  const body = stripLeadingClause(raw);
  const concrete = CONCRETE_RE.test(raw);
  const features: RegisterFeatures = {
    abstractSubject: SUBJECT_RE.test(raw) || SUBJECT_RE.test(body),
    // A stative verb only signals summary when there is nothing concrete for it to predicate of:
    // "the lamp was cold" is a description, "the matter was closed" is a verdict.
    stativeVerb: STATIVE_RE.test(raw) && !concrete,
    noConcreteNoun: !concrete,
    noSensoryWord: !SENSORY_RE.test(raw),
  };
  const score = Object.values(features).filter(Boolean).length;
  return { sentence: raw, score, features };
};

/** Dialogue is exempt — a character SAYING something abstract is speech, not narration (register.ts). */
const stripDialogue = (prose: string): string =>
  String(prose ?? "")
    .replace(/"[^"]*"/g, " ")
    .replace(/[“][^”]*[”]/g, " ");

/**
 * Titles that end in a period and are not the end of a sentence. Without these, *"The truth, at last,
 * was laid bare: Dr."* is scored as a complete sentence — MEASURED, it was one of the thirteen
 * "offenders" the first probe reported in a manuscript a reader gave prose 8, and it is not a
 * sentence at all.
 */
const ABBREVIATIONS = ["Mr", "Mrs", "Ms", "Dr", "Prof", "St", "Lt", "Capt", "Col", "Sgt", "Rev", "Hon", "Jr", "Sr"];
/**
 * A negative lookbehind on the split itself, rather than a sentinel substitution. The sentinel version
 * of this needed a placeholder character and a restore step, and this codebase has already paid for
 * one invisible control character in a regex that then matched nothing (the clue-injector registry,
 * 2026-08-26). No placeholder, nothing to restore, nothing invisible.
 */
const SENTENCE_SPLIT_RE = new RegExp(
  // The lookbehind sits AFTER the period, so it must INCLUDE the period. Without it the negative
  // lookbehind tests for "…Dr" at a position whose text ends "…Dr." and can never match — which is
  // why "The truth, at last, was laid bare: Dr." survived the first version of this fix and went on
  // being scored as a complete sentence in a book a reader gave prose 8.
  "(?<!\\b(?:" + ABBREVIATIONS.join("|") + ")\\.)(?<=[.!?])\\s+",
);

/**
 * Narration in this corpus is third-person past. A "narration" sentence carrying a first-person
 * pronoun is unstripped DIALOGUE, and it gets there because the manuscripts contain mismatched quote
 * marks — MEASURED in `the_weighted_pendulum_deception`, which opens a line with `"` and closes it
 * with `'`, defeating any paired-delimiter strip. Scoring speech as narration is how a probe reports
 * *"The truth is, I have little faith in appearances tonight."* as machine register.
 */
const FIRST_PERSON_RE = /\b(?:I|I'm|I've|I'll|I'd|me|my|mine)\b/;

/** Sentences under five words are fragments and beats; scoring them is noise in both directions. */
const splitSentences = (prose: string): string[] =>
  prose
    .split(SENTENCE_SPLIT_RE)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 5)
    .filter((s) => !FIRST_PERSON_RE.test(s));

/**
 * Every narration sentence at or above `threshold`, scored. Returns the SENTENCES rather than a
 * count, so a warning can quote the offender — A_75 §1 is a table of readers quoting our sentences
 * back at us, and a bare number is not actionable against that.
 */
export const scoreMachineRegister = (
  prose: string,
  threshold: number = REGISTER_TELEMETRY_THRESHOLD,
): RegisterScore[] =>
  splitSentences(stripDialogue(prose))
    .map(scoreSentenceRegister)
    .filter((r) => r.score >= threshold);

/**
 * The RATE, which is how §6.2 requires this be reported. A bare count rises with chapter length and
 * would read as a regression on a longer book.
 */
export const machineRegisterRate = (
  prose: string,
  threshold: number = REGISTER_TELEMETRY_THRESHOLD,
): { hits: number; sentences: number; rate: number } => {
  const sentences = splitSentences(stripDialogue(prose));
  const hits = sentences.filter((s) => scoreSentenceRegister(s).score >= threshold).length;
  return { hits, sentences: sentences.length, rate: sentences.length ? hits / sentences.length : 0 };
};
