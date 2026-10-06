/**
 * PROSE ENGINE v2 — FINDINGS (ANALYSIS_99 §10.7).
 *
 * ── ONE LIST, TWO SOURCES, ONE LAW ───────────────────────────────────────────────────────────────
 *
 * v1 answers "what is wrong with this chapter?" with seven regex lint types and twelve regeneration
 * families, and pays for it twice: the redesign measured **96% of token spend on prose retries**, and
 * A_75 §16 measured that a retry costs **+2.43 register points on the retried chapter** — the
 * correction makes the prose worse on the only instrument that predicts the score.
 *
 * v2 has one list of findings. Half come from CHECKERS, which are anchored by construction because
 * they quote what they matched; half from a CRITIC, one read-only pass over the whole book, whose
 * findings are anchored or discarded (L3). Nothing here rewrites a word — `edits.ts` does that, and
 * only through an LLM.
 *
 * ── THE VOCABULARY IS THE READER'S ───────────────────────────────────────────────────────────────
 *
 * The critic's classes are the complaints the reader actually writes, counted over the 16 September
 * reviews (A_99 §1.3): timing contradictions (8 of 16), Chapter 10 recap (8), scaffold lines (6),
 * the mechanism told rather than shown (5), a motive stated as a category (4), a name collision (1).
 * A critic asked for "problems" returns the model's idea of problems; a critic given the reader's own
 * list returns the reader's, before the reader is spent on them.
 *
 * ── WHAT THE CRITIC IS NOT ASKED ─────────────────────────────────────────────────────────────────
 *
 * Never to rank, never to score. The ordinal judge resolves ten marks and cannot resolve five
 * (PLAN-TO-90 §9), and no judge separates an 86 from an 81 (`rubric-cannot-rank-two-books`). It is
 * asked to FIND and to QUOTE, which is the one thing an LLM does here at 8% false-veto (Agent 6's
 * blind reader).
 */

import {
  machineRegisterRate,
  repetitionDensity,
  repetitionWords,
  scoreSentenceRegister,
  REGISTER_TELEMETRY_THRESHOLD,
} from "@cml/prose-guard";
import { contractFixesEnabled, extractClockValues, keynessFindingEnabled, openingEnabled, tailFindingEnabled } from "@cml/cml";

import { indexChapters } from "./chapter-index.js";
import { contentStemsOf, findCatchphrases, findInstructionEchoes, instructionPhrases, instructionStemGrams } from "./instruction-echo.js";
import { narratedMove } from "./humour-move.js";
import { findRecaps } from "./recaps.js";
import { repeatedRuns, splitSentences } from "./sentences.js";
import { checkHardGates } from "./selector.js";
import { keyTermHits } from "./clue-terms.js";
import { rankHousePhrases, type KeynessReference } from "./keyness.js";
import type {
  ContractCore,
  Finding,
  FindingClass,
  FindingSeverity,
  ProseChapterLike,
} from "./types.js";
import { FINDING_CLASSES } from "./types.js";

/**
 * 17-hitting-90 P4.1 — the sentence-initial abstraction as grammatical subject, followed by its verb.
 * "The room held its breath", "The truth remained elusive", "The evidence continued to mount", "A
 * silence fell", "The air was thick". Sentence-initial only, so "He watched the room" is untouched.
 */
const ABSTRACT_SUBJECT =
  /^(?:(?:the|a|an)\s+)?(?:room|silence|hush|quiet|stillness|truth|evidence|proof|air|tension|atmosphere|pattern|answer|question|moment|weight|case|facts?|mystery|mood|darkness|night)\s+(?:itself\s+)?(?:was|were|had|has|held|hung|fell|settled|grew|lay|remained|seemed|continued|began|pressed|closed|thickened|deepened|gathered|shifted|stretched|refused|would|could)\b/i;

/**
 * 17-hitting-90 — the announced shape. Narration only in effect: every form here is a narrator's
 * report of a line's length or of the exchange's number, which is the contract's wording coming
 * back as prose (A_67), not a thing a character says.
 */
// Run 98dec72a: "Harcourt answered with four words." twice — the count said with "with", not "in".
const OPERATION_NARRATED =
  /\b(?:spoke|said|replied|answered|continued|went on|addressed [^.!?]{0,30}|speech)\s+at length\b|\bat length,\s+(?:his|her|their)\b|\bin (?:two|three|four|five|six) words\b|\b(?:answered|replied|responded|said|spoke)\s+(?:only\s+)?with\s+(?:a single word|one word|(?:two|three|four|five|six) words)\b|\b(?:answer|reply|response|line)\s+(?:came|was|arrived)\s+(?:in\s+)?(?:brief|short|clipped|minimal|curt|a single word|\w+ words)\b|\bclipped to (?:two|three|four|five) words\b|\b(?:first|second) exchange\b|\bthe line (?:minimal|brief) but\b|\bas brief as it was\b/i;

/** How each class is treated by the edit loop: round 1 takes everything, round 2 only the first two. */
export const SEVERITY: Record<FindingClass, FindingSeverity> = {
  reveal_unnamed: "fairplay",
  clue_missing: "fairplay",
  /** An ownership mismatch, not a fair-play breach: the reader got the clue EARLY, which cheats nobody. */
  clue_early: "defect",
  culprit_early: "fairplay",
  mechanism_early: "fairplay",
  /**
   * REPORT-ONLY. A `clock_off_table` finding asks for a clock value to change, and
   * `clockValuesIntact` in `edits.ts` reverts any edit that changes a chapter's set of clock dials —
   * the guard exists because a repetition pass once produced "froze at three past midnight past
   * three". MEASURED 2026-09-19: replaying the obvious repair for all eleven of this class on a real
   * book gave 11 attempted, 11 reverted, 11 by `clockValuesIntact`, and the run's own telemetry
   * agreed from the other side.
   *
   * Sending it to the editor bought nothing and cost a call per chapter carrying one. It is reported
   * so a human sees it, and no editor is asked to fix what the guards forbid.
   */
  clock_off_table: "report",
  name_collision: "defect",
  walk_on_named: "defect",
  pronoun_drift: "defect",
  victim_alive: "defect",
  scaffold_token: "defect",
  chapter_reference: "defect",
  introduction_missing: "craft",
  body_tail: "craft",
  house_phrase: "craft",
  register_sentence: "craft",
  abstract_subject: "craft",
  operation_narrated: "craft",
  repeat_passage: "craft",
  catchphrase_repeated: "craft",
  clue_recited: "craft",
  humour_move_narrated: "craft",
  summary_ending: "craft",
  recap: "craft",
  copied_sentence: "defect",
  clearance_after_reveal: "defect",
  reveal_residue_in_aftermath: "defect",
  timing_contradiction: "defect",
  mechanism_told_not_shown: "craft",
  motive_as_category: "craft",
  wound_missing: "craft",
  register_named_in_narration: "craft",
  humour_forced: "craft",
  pacing_drift: "craft",
  tonal_escalation_missing: "craft",
  motif_abandoned: "craft",
  voice_inconsistency: "craft",
  flat_reveal: "craft",
};

const normalise = (text: string): string => String(text ?? "").replace(/\s+/g, " ").trim();

const bodyOf = (chapter: ProseChapterLike | undefined): string =>
  normalise((chapter?.paragraphs ?? []).join(" "));

const sentencesOf = (text: string): string[] => splitSentences(text);

/**
 * What is inside quotation marks in one paragraph, paired IN ORDER. A pattern between any two straight
 * quotes cannot tell an opening mark from a closing one, and in `"…," Harcourt said, turning the key,
 * "…"` it captures the narration between the speeches — the narrated clue this brief asks for.
 */
const spokenSpans = (paragraph: string): string[] => {
  const text = normalise(paragraph);
  if (/[\u201c\u201d]/.test(text)) {
    return [...text.matchAll(/\u201c([^\u201c\u201d]*)\u201d/g)].map((m) => m[1]!.trim()).filter(Boolean);
  }
  return text.split('"').filter((_, i) => i % 2 === 1).map((q) => q.trim()).filter(Boolean);
};

const SUMMARY_ENDING =
  /\b(?:each|every) (?:detail|object|clue|item)s?\s*(?:touched\s*)?[—-]|\bthe (?:investigation|inquiry) (?:pressed|continued|went|moved|advanced|drew)\b|\bcloser to the truth\b/i;

/** A spoken line carrying this share of a clue's content words, and at least this many, recites it. */
export const CLUE_RECITED_SHARE = 0.7;
export const CLUE_RECITED_MIN_WORDS = 5;

/** Enough words that a quote identifies one place in the chapter and can be found again. */
export const MIN_QUOTE_WORDS = 8;

const firstWords = (sentence: string, count = 14): string =>
  sentence.split(/\s+/).slice(0, count).join(" ");

/**
 * L3 — a finding is anchored or it does not exist. Returns the survivors and the discards, and the
 * caller counts the discards per class: a class that cannot anchor is a class that comes out of the
 * critic's vocabulary, which is how `full-story-diagnostic.ts` already works.
 */
export const anchorFindings = (
  findings: ReadonlyArray<Finding>,
  chapters: ReadonlyMap<number, ProseChapterLike>,
): { anchored: Finding[]; discarded: Finding[] } => {
  const anchored: Finding[] = [];
  const discarded: Finding[] = [];
  for (const finding of findings) {
    const body = bodyOf(chapters.get(finding.chapter));
    const quote = normalise(finding.quote);
    const words = quote.split(/\s+/).filter(Boolean).length;
    if (!body || words < MIN_QUOTE_WORDS || !body.includes(quote)) discarded.push(finding);
    else anchored.push({ ...finding, quote });
  }
  return { anchored, discarded };
};

// ── the checkers ─────────────────────────────────────────────────────────────────────────────────

const finding = (
  cls: FindingClass,
  chapter: number,
  quote: string,
  note: string,
  source: Finding["source"] = "checker",
): Finding => ({ class: cls, chapter, quote: normalise(quote), note, severity: severityOf(cls), source });

/**
 * A_110 §30.1 — `register_sentence` is counted, not sent to the editor, with PROSE_V2_CONTRACT_FIXES on. MEASURED with
 * the real scorer: it fires on 25.5% of 31,414 canon narration sentences and 0.8% of run bcc0d637's, and 98% of
 * 2,500-word canon windows reach the editor's cap of eight. Its slope against the reads is zero since 1 September
 * (WP-006 §3.2). In v2 it asks the editor to turn narration into a person handling an object.
 */
const severityOf = (cls: FindingClass): FindingSeverity =>
  cls === "register_sentence" && contractFixesEnabled() ? "report" : SEVERITY[cls];

/**
 * A_110 L8 — a chapter named in narration. Fiction never refers to its own chapters; every hit is our contract wording
 * coming back ("already referenced in chapter 6", "recalled from chapter 1", "The chapter ended with…"). Narration only,
 * because a character may say "chapter and verse". A construction, not a word list.
 */
const CHAPTER_REFERENCE =
  /\b(?:(?:in|from|of|since|by|than|after|before|referenced in|recalled from)\s+chapter\s+(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b|the (?:chapter|scene) (?:ended|ends|closed|closes|began|begins|opened|opens)\b)/i;

/** The sentence in a chapter that best evidences a term — so even a checker's finding can be quoted. */
/**
 * A_110 N5 — the sentence of a chapter that carries the most of an early clue's key terms, by the same stemmed rule the
 * hard gate counts with. `report` when no sentence carries two: the clue is spread across the chapter, there is no line
 * an edit could fix, and a finding sent to the editor would be anchored on nothing.
 */
export const anchorEarlyClue = (
  body: string,
  detail: string,
  core: Pick<ContractCore, "scenes">,
): { quote: string; note: string; report: boolean } => {
  const id = detail.split(" is owed")[0]?.trim() ?? "";
  // The case's own people and places are on every page; a sentence does not stage a clue by naming them (memory:
  // domain nouns collide with wordlists — so the exclusions come from this case's contract, never from a list).
  const ownNouns = new Set(
    core.scenes
      .flatMap((s) => [...(s.present ?? []), s.location ?? ""])
      .flatMap((v) => String(v).toLowerCase().split(/[^a-z]+/))
      .filter((w) => w.length >= 3),
  );
  const terms = (core.scenes.flatMap((s) => s.mustSurface).find((s) => s.id === id)?.keyTerms ?? []).filter(
    (t) => !String(t).toLowerCase().split(/[^a-z]+/).filter(Boolean).every((w) => ownNouns.has(w)),
  );
  let best = { sentence: "", carried: [] as string[] };
  for (const sentence of sentencesOf(body)) {
    const lowered = sentence.toLowerCase();
    const carried = terms.filter((t) => keyTermHits([t], lowered, "stemmed") > 0);
    if (carried.length > best.carried.length) best = { sentence, carried };
  }
  if (best.carried.length < 2) {
    return { quote: sentencesOf(body)[0] ?? "", note: `${detail} — spread across the chapter, no one sentence carries it (reported, not edited)`, report: true };
  }
  return { quote: best.sentence, note: `${detail} — this sentence carries ${best.carried.join(", ")}`, report: false };
};

const sentenceContaining = (body: string, needles: ReadonlyArray<string>): string => {
  const lowered = body.toLowerCase();
  for (const sentence of sentencesOf(body)) {
    const s = sentence.toLowerCase();
    if (needles.some((n) => n && s.includes(n.toLowerCase()))) return sentence;
  }
  // Nothing to point at — the first sentence locates the chapter, which is what an absence needs.
  return sentencesOf(body)[0] ?? lowered.slice(0, 120);
};

/**
 * A chapter's sentences with the repetition instrument's words laid end to end, each tagged with its
 * sentence, and each flagged when it belongs to a clock value.
 */
interface SentenceWords {
  body: string;
  sentences: string[];
  words: string[];
  owner: number[];
  clock: boolean[];
}

/** Where `needle` occurs in `words`, as start indices. */
const occurrencesOf = (words: ReadonlyArray<string>, needle: ReadonlyArray<string>): number[] => {
  const at: number[] = [];
  for (let i = 0; i + needle.length <= words.length; i += 1) {
    if (needle.every((word, k) => words[i + k] === word)) at.push(i);
  }
  return at;
};

const indexSentenceWords = (body: string): SentenceWords => {
  const sentences = sentencesOf(body);
  const words: string[] = [];
  const owner: number[] = [];
  sentences.forEach((sentence, index) => {
    for (const word of repetitionWords(sentence)) {
      words.push(word);
      owner.push(index);
    }
  });
  // The words of every clock value the project recognises (`extractClockValues`, the definition
  // `clockValuesIntact` enforces): an editor may not change them, so repeating them is not a defect
  // an edit can repair. The same rule `repeatedRuns` follows for its own runs, drawn from the
  // authoritative definition: `repeatedRuns`' pattern wants the hour after "past", and a six-word
  // window can end one word short of it — "watch stopped at ten minutes past" — MEASURED 103 such
  // spans over 231 archived books that the narrower pattern lets through.
  //
  // Compared with edge apostrophes stripped: the instrument's words keep a straight `'`, so a time in
  // single quotes — "at 'twenty minutes past nine'" — is the words `'twenty` … `nine'` and would not
  // equal the value's own words. MEASURED: 89 of 2,085 findings sat on exactly that before this.
  const bare = (word: string): string => word.replace(/^'+|'+$/g, "");
  const bareWords = words.map(bare);
  const clock: boolean[] = new Array<boolean>(words.length).fill(false);
  const seen = new Set<string>();
  for (const value of extractClockValues(body)) {
    const needle = repetitionWords(value.raw).map(bare);
    const key = needle.join(" ");
    if (needle.length === 0 || seen.has(key)) continue;
    seen.add(key);
    for (const start of occurrencesOf(bareWords, needle)) {
      for (let k = 0; k < needle.length; k += 1) clock[start + k] = true;
    }
  }
  return { body, sentences, words, owner, clock };
};

/**
 * The sentence — or sentences, when the span straddles a full stop — carrying the FIRST occurrence of
 * a repeated span, as one exact substring of the chapter. Null when the span is not in this chapter.
 * A span is matched in `repetitionWords` space because that is where it was counted.
 *
 * An occurrence that touches a clock value does not count: the locked form a time must take is not a
 * repetition to repair. A window over the REST of the same sentence still does, and is judged on its
 * own words — "the lamp failed again" is repeated prose whatever hour it failed at.
 */
const sentencesCarrying = (indexed: SentenceWords, span: string): string | null => {
  const want = span.split(" ");
  const { owner, sentences, body, clock } = indexed;
  for (const at of occurrencesOf(indexed.words, want)) {
    if (clock.slice(at, at + want.length).some(Boolean)) continue;
    const quote = normalise(sentences.slice(owner[at]!, owner[at + want.length - 1]! + 1).join(" "));
    return body.includes(quote) ? quote : null;
  }
  return null;
};

/** Spans asked of the instrument so clock-exempt ones cannot starve the five this block may use. */
const REPEAT_SPAN_POOL = 100;
const REPEAT_SPANS_REPORTED = 5;

export interface CheckerOptions {
  clueDistribution?: { clues?: unknown[] };
  /** How many register sentences to name per chapter. A_95 M1 named eight. */
  registerPerChapter?: number;
  /** The writer's instruction lines — the brief's asks and the contract's template phrases. */
  instructionLines?: ReadonlyArray<string>;
  /** The bible: anything in it is case vocabulary and is never called an echo. */
  caseText?: string;
  /** A_109 M5 — the case's alibi windows (dial pairs), so a restated alibi is a `recap`. */
  alibiWindows?: ReadonlyArray<readonly [number, number]>;
  /** A_110 M8: the house-phrase reference (data/keyness-reference.json), read only with PROSE_V2_KEYNESS_FINDING. */
  keyness?: KeynessReference;
}

/**
 * Everything v2 can find without an LLM. Each returns a QUOTE, because an unanchored complaint
 * cannot be acted on by an editor and cannot be verified by a reader of the run report.
 */
export const collectCheckerFindings = (
  chapters: ReadonlyArray<ProseChapterLike>,
  core: ContractCore,
  expected: ReadonlyArray<number>,
  options: CheckerOptions = {},
): Finding[] => {
  const out: Finding[] = [];
  const order = [...expected].sort((a, b) => a - b);
  const byChapter = indexChapters(chapters, expected);
  /**
   * A_110 W2 guard (PROSE_V2_OPENING): the first two paragraphs of the book are narration of the place, which the
   * register and abstract-subject checks would hand back to the editor as defects — MEASURED: `register_sentence`
   * fires on 28.5% of canon opening narration, and a plain establishing passage drew three findings in eight sentences.
   */
  const placeParagraphs = openingEnabled() ? (byChapter.get(1)?.paragraphs ?? []).slice(0, 2).map(normalise) : [];
  const inPlace = (sentence: string): boolean => placeParagraphs.some((p) => p.includes(normalise(sentence)));

  // 1. the hard gates, restated as findings so one list reaches the editor.
  for (const hit of checkHardGates(chapters, core, expected, options.clueDistribution)) {
    const body = bodyOf(byChapter.get(hit.chapter));
    if (hit.kind === "chapter_missing") continue; // a missing chapter is a CONTINUE, not an edit
    if (hit.kind === "book_short") continue; // a short book is a WRITER problem; no edit lengthens it
    const cls: FindingClass =
      hit.kind === "reveal_unnamed"
        ? "reveal_unnamed"
        : hit.kind === "clue_missing"
          ? "clue_missing"
          : hit.kind === "clue_early"
            ? "clue_early"
            : hit.kind === "culprit_early"
              ? "culprit_early"
              : "scaffold_token";
    // A_110 N5: `clue_early` is a CHAPTER-level hit (the clue's terms anywhere in the chapter). Its text never occurs
    // in a sentence, so `sentenceContaining` fell back to the chapter's first sentence — the fallback meant for an
    // absence — and the editor, told to remove an early clue from a line that did not carry it, cut a spoken line
    // and shipped its tag alone. Anchored now on the sentence that carries the most of the clue's terms; with none
    // carrying two, it is reported, not sent to the editor; several clues on one sentence are one finding.
    if (cls === "clue_early" && contractFixesEnabled()) {
      const placed = anchorEarlyClue(body, hit.detail, core);
      const same = out.find((f) => f.class === "clue_early" && f.chapter === hit.chapter && f.quote === normalise(placed.quote));
      if (same) same.note = `${same.note}; ${hit.detail}`;
      else out.push({ ...finding(cls, hit.chapter, placed.quote, placed.note), ...(placed.report ? { severity: "report" as const } : {}) });
      continue;
    }
    const needle = hit.detail.split(":").pop() ?? "";
    out.push(finding(cls, hit.chapter, sentenceContaining(body, [needle.trim(), hit.detail]), hit.detail));
  }

  // 2. every clock value on the page is a row of the table (A_90 — the reader does this arithmetic).
  //
  // ── WHAT THIS CHECK GOT WRONG, MEASURED ───────────────────────────────────────────────────────
  //
  // It compared the prose against `row.value` only, with a plain `includes`. On
  // `resume-1789805865810` that produced ELEVEN findings on a compliant book:
  //
  //   * the table holds `nine o'clock` with a STRAIGHT apostrophe and the prose writes `nine
  //     o’clock` with a typographic one, so five findings were the same true time called
  //     off-table;
  //   * the numeric forms the prose uses — `eight fifty`, `nine fifteen`, `nine forty-five` — live
  //     in the row's LABEL ("eight fifty to nine fifteen — Harriet cleaning rooms"), which was
  //     never read.
  //
  // So the haystack is now value AND label, and both sides are normalised for the punctuation a
  // typesetter changes and a reader does not notice.
  const normaliseClock = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[\u2018\u2019\u02bc\u2032]/g, "'")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  const tableText = core.chronology.rows.map((r) => normaliseClock(`${r.value} ${r.label}`));
  if (tableText.length > 0) {
    for (const [chapter, written] of byChapter) {
      const body = bodyOf(written);
      const seen = new Set<string>();
      for (const value of extractClockValues(body)) {
        const raw = normaliseClock(value.raw);
        if (seen.has(raw)) continue;
        seen.add(raw);
        if (tableText.some((row) => row.includes(raw))) continue;
        out.push(
          finding(
            "clock_off_table",
            chapter,
            sentenceContaining(body, [value.raw]),
            `"${value.raw}" is on no row of the chronology`,
          ),
        );
      }
    }
  }

  // 3. the chapter's own worst register sentences (A_95 M1's list, which took polish rollback 54%→0%).
  const limit = options.registerPerChapter ?? 8;
  for (const [chapter, written] of byChapter) {
    const body = bodyOf(written);
    const offenders = sentencesOf(body)
      .filter((s) => !/["“]/.test(s)) // narration only: a person may speak in abstractions
      .filter((s) => !inPlace(s)) // A_110 W2: the opening's two paragraphs of place
      .filter((s) => s.split(/\s+/).length >= 6)
      .map((s) => ({ sentence: s, score: scoreSentenceRegister(s).score }))
      .filter((s) => s.score >= REGISTER_TELEMETRY_THRESHOLD)
      .sort((a, b) => b.score - a.score || b.sentence.length - a.sentence.length)
      .slice(0, limit);
    for (const offender of offenders) {
      out.push(
        finding(
          "register_sentence",
          chapter,
          offender.sentence,
          "a state of affairs reported, with nothing anybody could see, touch or do",
        ),
      );
    }
  }

  // 4. a sentence that appears twice (A_90 §12: 16 of 24 copies came from the chapter before).
  // The same chapter counts too. The first fresh v2 book (run 98dec72a) carried three passages
  // twice inside one chapter, one of them a speech restarted mid-paragraph with a stray quotation
  // mark, and this check looked only ACROSS chapters, so none was reported. MEASURED: 0 of 3.
  const sentenceHome = new Map<string, number>();
  for (const chapter of order) {
    const body = bodyOf(byChapter.get(chapter));
    for (const sentence of sentencesOf(body)) {
      if (sentence.split(/\s+/).length < MIN_QUOTE_WORDS) continue;
      const key = sentence.toLowerCase();
      const home = sentenceHome.get(key);
      if (home === undefined) sentenceHome.set(key, chapter);
      else {
        const where = home === chapter ? "earlier in this chapter" : `also in chapter ${home}`;
        out.push(finding("copied_sentence", chapter, sentence, `${where}, word for word`));
      }
    }
  }

  // 4b. §06.8 — a run of six words said twice inside one paragraph: the doubled clause, the spoken
  // line copied to the paragraph's front, the sentence restated as the next one's opening.
  for (const [chapter, written] of byChapter) {
    for (const paragraph of (written.paragraphs ?? []).map(normalise)) {
      const runs = repeatedRuns(paragraph);
      if (runs.length === 0) continue;
      // A whole sentence said twice is already reported above; one finding per copy.
      if (out.some((f) => f.class === "copied_sentence" && f.chapter === chapter && paragraph.includes(f.quote))) continue;
      const second = sentencesOf(paragraph).filter((s) => {
        const l = s.toLowerCase().replace(/[^a-z'\s]/g, " ").replace(/\s+/g, " ");
        return runs.some((r) => l.includes(r));
      });
      const quote = second.length > 1 ? `${second[0]} ${second[1]}` : second[0] ?? paragraph;
      out.push(finding("copied_sentence", chapter, paragraph.includes(quote) ? quote : second[0] ?? paragraph, "the same words twice in one paragraph; keep one"));
    }
  }

  // 5. a passage the book has already used (the repetition instrument's own worst spans).
  //
  // ── THIS BLOCK NEVER PRODUCED A FINDING, AND HAD TWO INDEPENDENT REASONS ──────────────────────────
  //
  // `repetitionDensity` counts SIX-word spans, so every `worst.span` is six words, and the guard that
  // stood here skipped any span under `MIN_QUOTE_WORDS` (eight): 0 of 5 survived on the archived book
  // `the_clock_s_false_hour_at_lockwood_estate` (218.8 per 10k), and the same on every book.
  //
  // Take the guard away and the block was STILL wrong: a span is a window over `repetitionWords`
  // (lowercased, punctuation a space), not a substring of the prose, so `body.includes(span)` missed
  // "at twenty five minutes past three" in all seven chapters carrying "twenty-five minutes past
  // three", and `sentenceContaining` would have fallen back to the chapter's FIRST sentence — pointing
  // the editor at text that has nothing to do with the repetition.
  //
  // The eight words are for the QUOTE (`anchorFindings` discards anything shorter, because a short
  // quote may be a paraphrase). So the finding quotes the sentence carrying the span, which is exact by
  // construction and `widenQuote` lifts to eight words when the sentence is short.
  //
  // A span that touches a clock value is skipped (`sentencesCarrying`): the editor may not move a
  // clock dial (`clockValuesIntact`), so asking it to reword the locked form of a time buys a
  // rollback — and 744 of the 2,168 findings this block first produced (34%) sat on a piece of a time
  // (16 of 2,074 do now, over 230 archived books; all of them forms `extractClockValues` cannot read,
  // like "past seven in the evening"). Because the
  // instrument keeps only its worst five, and a clock passage fills them, the block asks for a pool
  // of spans and uses the first five that something OUTSIDE a clock value carries.
  const whole = order.map((c) => bodyOf(byChapter.get(c))).join(" ");
  const density = repetitionDensity(whole, 6, 3, REPEAT_SPAN_POOL);
  const carried = density.worst.length > 0 ? order.map((chapter) => indexSentenceWords(bodyOf(byChapter.get(chapter)))) : [];
  let spansUsed = 0;
  // Five spans are usually one passage seen at five offsets, so two spans landing on the same
  // sentence of the same chapter are one finding, not two asks of the editor. Overlap, not equality:
  // a span that straddles a full stop quotes two sentences, its neighbour inside the second quotes one.
  const reportedQuotes = new Map<number, string[]>();
  for (const worst of density.worst) {
    if (spansUsed >= REPEAT_SPANS_REPORTED) break;
    // Both sides, not one. A `break` here once reported only the FIRST chapter carrying a repeated
    // span, so the editor repaired one copy and the other stood — and a repetition needs two places
    // to be a repetition. Capped at three chapters so a stock phrase cannot flood the list.
    let reported = 0;
    order.forEach((chapter, at) => {
      if (reported >= 3) return;
      const quote = sentencesCarrying(carried[at]!, worst.span);
      if (quote === null) return;
      reported += 1;
      // A span costs one of the five once something outside a clock value carries it somewhere.
      if (reported === 1) spansUsed += 1;
      // Widened HERE, before the overlap test: `widenQuote` runs again at the end and would otherwise
      // grow a short sentence into its neighbour, which another finding may already be quoting.
      const widened = widenQuote(
        finding(
          "repeat_passage",
          chapter,
          quote,
          `this book has used the run of words "${worst.span}" ${worst.count} times; say it differently here`,
        ),
        carried[at]!.body,
      );
      const already = reportedQuotes.get(chapter) ?? [];
      if (already.some((q) => q.includes(widened.quote) || widened.quote.includes(q))) return;
      reportedQuotes.set(chapter, [...already, widened.quote]);
      out.push(widened);
    });
  }

  // 3b. 17-hitting-90 P4.1 — the sentence whose subject is the room, the silence, the truth or the
  // evidence. The family every one of the last four reads quoted; the repair is a person as subject.
  for (const [chapter, written] of byChapter) {
    const body = bodyOf(written);
    for (const sentence of sentencesOf(body)) {
      if (/["“]/.test(sentence)) continue; // narration only
      if (sentence.split(/\s+/).length < 5) continue;
      if (!ABSTRACT_SUBJECT.test(sentence)) continue;
      if (inPlace(sentence)) continue; // A_110 W2
      out.push(finding("abstract_subject", chapter, sentence, "the subject is a thing nobody can see act; give the sentence a named person doing something"));
    }
  }

  // 3c. 17-hitting-90 — the operation narrated as it is performed. Pair 3 said "spoke at length"
  // seven times and "answer came in four words" once: the count the contract asked for, printed.
  for (const [chapter, written] of byChapter) {
    const body = bodyOf(written);
    for (const sentence of sentencesOf(body)) {
      if (/^["“]/.test(sentence)) continue; // a character may say "at length"; the narrator may not announce it
      if (!OPERATION_NARRATED.test(sentence)) continue;
      out.push(finding("operation_narrated", chapter, sentence, "the narration announces the shape of the line instead of letting the line have it; cut the announcement and keep the line"));
    }
  }

  // 3c-bis. A_110 L8 — a chapter named in narration (PROSE_V2_CONTRACT_FIXES).
  if (contractFixesEnabled()) {
    for (const [chapter, written] of byChapter) {
      for (const sentence of sentencesOf(bodyOf(written))) {
        if (/^["“]/.test(sentence) || !CHAPTER_REFERENCE.test(sentence)) continue;
        out.push(finding("chapter_reference", chapter, sentence, "the narration names a chapter of the book; say what happened, or cut the clause"));
      }
    }
  }

  // 3c-ter. A_110 P1 (PROSE_V2_OPENING) — a person's first appearance says what they do. The contract's page list misses
  // somebody who acts or speaks in 47% of chapters, so this reads the TEXT: the first paragraph naming them must carry a
  // word of their occupation. MEASURED unasked: 28 of 124 people (23%) across 25 v2 drafts.
  if (openingEnabled()) {
    const people = new Map<string, string>();
    for (const s of core.scenes) for (const i of s.opening?.introductions ?? []) people.set(i.name, i.occupation);
    const STEMLESS = new Set(["retir", "forme", "local", "occas", "famil", "hotel", "senio", "junio"]);
    for (const [name, occupation] of people) {
      const stems = occupation.split(/\s+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 5)).filter((w) => !STEMLESS.has(w));
      if (stems.length === 0) continue;
      const first = name.split(/\s+/)[0]!;
      let found = false;
      for (const chapter of order) {
        const paragraphs = (byChapter.get(chapter)?.paragraphs ?? []).map(normalise);
        const at = paragraphs.find((p) => p.includes(name)) ?? paragraphs.find((p) => new RegExp(`\\b${first}\\b`).test(p));
        if (!at) continue;
        found = true;
        const lower = at.toLowerCase();
        if (stems.some((stem) => lower.includes(stem))) break;
        const sentence = sentencesOf(at).find((s) => s.includes(first)) ?? at;
        out.push(finding("introduction_missing", chapter, sentence, `the first time ${name} is on the page, a clause beside the name says they are ${occupation}`));
        break;
      }
      if (!found) continue;
    }
  }

  // 3c-quater. A_110 L6 (PROSE_V2_TAIL_FINDING) — the body-part tail. A threshold from the canon's worst chapter, not
  // a per-sentence rate (WP-006 K9): at four or more in a chapter (3% of canon books ever reach it), every one after
  // the first three goes to the editor as a deletion, at most twelve a chapter so one round can carry them.
  if (tailFindingEnabled()) {
    const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/i;
    for (const [chapter, written] of byChapter) {
      const tails = sentencesOf(bodyOf(written)).filter((s) => TAIL.test(s));
      if (tails.length < 4) continue;
      for (const sentence of tails.slice(3, 15)) {
        out.push(finding("body_tail", chapter, sentence, "cut the clause after the comma that names a part of the body (\", her gaze fixed…\"); end the sentence before it"));
      }
    }
  }

  // A_110 M8 (PROSE_V2_KEYNESS_FINDING): the book's own house phrases, ranked against the canon (keyness.ts). The first
  // use of each stays; up to two later uses go to the editor to be said another way; at most eight a book.
  if (keynessFindingEnabled() && options.keyness) {
    const ordered = [...byChapter.entries()].sort((a, b) => a[0] - b[0]);
    const book = ordered.map(([, w]) => bodyOf(w)).join("\n\n");
    let budget = 8;
    const flagged = new Set<string>();
    // A locked clock value is the case's, and must stay verbatim (A_90 §11.2): a phrase sharing two consecutive words
    // with any clock value the book states is not the writer's habit and is never sent — the rule N7 follows.
    const clockPairs = new Set<string>();
    for (const value of extractClockValues(book)) {
      const w = repetitionWords(value.raw);
      for (let i = 0; i + 2 <= w.length; i++) clockPairs.add(`${w[i]} ${w[i + 1]}`);
    }
    const touchesClock = (phrase: string): boolean => {
      const w = phrase.split(" ");
      return w.slice(0, -1).some((x, i) => clockPairs.has(`${x} ${w[i + 1]}`));
    };
    for (const p of rankHousePhrases(book, options.keyness, { exclude: touchesClock })) {
      const uses = ordered.flatMap(([chapter, w]) =>
        sentencesOf(bodyOf(w))
          .filter((s) => (s.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []).join(" ").includes(p.phrase))
          .map((sentence) => ({ chapter, sentence })),
      );
      // One longer habit shows up as several overlapping four-word windows; a sentence is flagged once, so the budget
      // buys different habits rather than the same one twice.
      const fresh = uses.slice(1).filter((u) => !flagged.has(u.sentence)).slice(0, 2);
      for (const use of fresh) {
        if (budget-- <= 0) break;
        flagged.add(use.sentence);
        out.push(finding("house_phrase", use.chapter, use.sentence, `"${p.phrase}" — ${p.inBook} times in this book, ${p.inCanon} in the canon's 12M words; keep the meaning and say it another way here (its first use stays)`));
      }
      for (const u of uses) flagged.add(u.sentence);
      if (budget <= 0) break;
    }
  }

  // 3d. 17-hitting-90 §06 F10 — a clue recited as a report. Run 98dec72a: 23 lines that open by
  // addressing the investigator and then say a clue's own wording — "Inspector, the ink composition of
  // forged letter unavailable before half past eleven" — against 2 on pair 3, both real questions.
  // A line of dialogue that carries most of the clue's own content words IS its observable, spoken.
  for (const [chapter, written] of byChapter) {
    const scene = core.scenes.find((s) => s.chapter === chapter);
    if (!scene || scene.mustSurface.length === 0) continue;
    const quotes = (written.paragraphs ?? []).flatMap(spokenSpans).filter((q) => q.length >= 20);
    for (const surface of scene.mustSurface) {
      const want = [...new Set(contentStemsOf(surface.observable))];
      if (want.length < CLUE_RECITED_MIN_WORDS) continue;
      const spoken = quotes.find((q) => {
        const have = new Set(contentStemsOf(q));
        const hit = want.filter((w) => have.has(w)).length;
        return hit >= CLUE_RECITED_MIN_WORDS && hit / want.length >= CLUE_RECITED_SHARE;
      });
      if (!spoken) continue;
      out.push(
        finding(
          "clue_recited",
          chapter,
          spoken,
          "a clue is recited as a report; let somebody find or handle the thing on the page, and let the speaker say what they make of it in their own words",
        ),
      );
    }
  }

  // 3e. 17-hitting-90 §06 R3 — the humour move, named by the narrator instead of performed.
  for (const [chapter, written] of byChapter) {
    for (const sentence of sentencesOf(bodyOf(written))) {
      if (/^["\u201c]/.test(sentence)) continue;
      const move = narratedMove(sentence);
      if (!move) continue;
      out.push(finding("humour_move_narrated", chapter, sentence, `the narration names the move ("${move}") instead of letting the line perform it; cut the naming and keep the line`));
    }
  }

  // 3f. 17-hitting-90 §06 R4 — the chapter that ends by summing itself up. Run 98dec72a closed eight
  // of ten chapters on "The investigation pressed on, each detail—…—drawing the group closer to the
  // truth"; pairs 2 and 3 closed none that way. The last paragraph, all narration, inventorying
  // "each detail/object/clue" or pointing at the investigation or the truth.
  for (const [chapter, written] of byChapter) {
    const paragraphs = (written.paragraphs ?? []).map(normalise).filter(Boolean);
    const last = paragraphs[paragraphs.length - 1];
    if (!last || /["\u201c\u201d]/.test(last)) continue;
    if (!SUMMARY_ENDING.test(last)) continue;
    out.push(finding("summary_ending", chapter, sentencesOf(last)[0] ?? last, "the chapter ends by summarising itself; end on the last thing somebody does or says"));
  }

  // 3g. A_109 M5 — the fact said again in new words: a clue past its owner chapter, an alibi window
  // given again after the chapter that first gave it. The test and the reveal are exempt.
  for (const hit of findRecaps(byChapter, core, { windows: options.alibiWindows ?? [] })) {
    const what = hit.kind === "clue" ? "this clue" : `the alibi ${hit.fact}`;
    const where = hit.chapter === hit.owner ? "already said twice in this chapter" : `first given in chapter ${hit.owner}`;
    out.push(finding("recap", hit.chapter, hit.sentence, `${what} is ${where}; say it here in one clause as a reference, or not at all`));
  }

  // 6. our own instructions, come back as prose (the reads of 2026-09-22 named five such phrases).
  if (options.instructionLines && options.instructionLines.length > 0) {
    const castNames = [...new Set([...core.scenes.flatMap((s) => s.present), ...core.fairPlay.culprits, core.fairPlay.victim])];
    const phrases = instructionPhrases(options.instructionLines, castNames, options.caseText ?? "");
    const grams = instructionStemGrams(options.instructionLines, castNames, options.caseText ?? "");
    for (const hit of findInstructionEchoes(byChapter, phrases, grams)) {
      const note = hit.phrase.startsWith("~")
        ? `"${hit.phrase.slice(1)}" is the brief's wording in another tense — an instruction printed, not the book`
        : `"${hit.phrase}" is the brief's wording, not the book's`;
      out.push(finding("scaffold_token", hit.chapter, hit.sentence, note));
    }
  }

  // 7. a line said so often it has become a label (the reader on A listed five; this lists the same five).
  for (const hit of findCatchphrases(byChapter)) {
    out.push(
      finding("catchphrase_repeated", hit.chapter, hit.sentence, `"${hit.line}" is said ${hit.count} times in the book; after two it reads as a label`),
    );
  }

  // 8. the aftermath re-arguing the case — 8 of the last 16 reviews ask for chapter 10 to be trimmed.
  if (core.roles.aftermath !== null) {
    const body = bodyOf(byChapter.get(core.roles.aftermath));
    // `because` was in this list and is an ordinary English word an aftermath uses for reasons that
    // are not argument — "she left because the season was over". The markers kept are ones that only
    // appear when a chapter is still PROVING something.
    const residue = sentencesOf(body).filter((s) =>
      /\b(therefore|which proves|the evidence (?:shows|proves|placed|put)|alibi|timeline|could not have|ruled out)\b/i.test(s),
    );
    for (const sentence of residue.slice(0, 4)) {
      out.push(
        finding(
          "reveal_residue_in_aftermath",
          core.roles.aftermath,
          sentence,
          "the aftermath argues the case again; it owes consequence, not proof",
        ),
      );
    }
  }

  return out.map((f) => widenQuote(f, bodyOf(byChapter.get(f.chapter))));
};

/**
 * A checker's quote is exact by construction, so when the sentence it matched is too short to anchor,
 * the quote grows by its neighbours until it is long enough — the finding is not thrown away.
 *
 * Anchoring discards any quote under `MIN_QUOTE_WORDS`, which is right for the critic (a short quote
 * may be a paraphrase) and wrong for a checker. MEASURED on run 98dec72a: five `operation_narrated`
 * hits — "Evelyn's answer was brief.", "Sir Edmund's reply was short." — were found and then
 * discarded, and the book went to the reader with all five; over the 227 saved books, 45 of that
 * class and 141 `abstract_subject` hits were lost the same way.
 */
const widenQuote = (f: Finding, body: string): Finding => {
  const count = (s: string): number => s.split(/\s+/).filter(Boolean).length;
  if (!body || count(f.quote) >= MIN_QUOTE_WORDS) return f;
  const sentences = sentencesOf(body);
  const at = sentences.findIndex((s) => normalise(s).includes(f.quote));
  if (at < 0) return f;
  let first = at;
  let last = at;
  const span = (): string => normalise(sentences.slice(first, last + 1).join(" "));
  while (count(span()) < MIN_QUOTE_WORDS && last + 1 < sentences.length) last += 1;
  while (count(span()) < MIN_QUOTE_WORDS && first > 0) first -= 1;
  const quote = span();
  return body.includes(quote) ? { ...f, quote } : f;
};

// ── the critic ───────────────────────────────────────────────────────────────────────────────────

/** The classes the CRITIC may return. The rest are the checkers' and would be two owners for one fact. */
export const CRITIC_CLASSES: FindingClass[] = [
  "timing_contradiction",
  "mechanism_told_not_shown",
  "motive_as_category",
  "wound_missing",
  "register_named_in_narration",
  "humour_forced",
  "pacing_drift",
  "tonal_escalation_missing",
  "motif_abandoned",
  "voice_inconsistency",
  "flat_reveal",
];

const CLASS_DEFINITIONS: Partial<Record<FindingClass, string>> = {
  timing_contradiction: "two statements about the clock that cannot both be true of the table above",
  mechanism_told_not_shown: "the trick is explained in narration before anybody watches it happen",
  motive_as_category: "the culprit's reason is a standing condition rather than one dated act",
  wound_missing: "a character appears in several chapters and has no life outside the case",
  register_named_in_narration: "the narrator labels how a line was said instead of letting the line say it",
  humour_forced: "a remark placed where the scene cannot carry it",
  pacing_drift: "a stretch where the book stops moving",
  tonal_escalation_missing: "the pressure does not rise between here and the reveal",
  motif_abandoned: "something the book set up and then dropped",
  voice_inconsistency: "a character who speaks in two different registers",
  flat_reveal: "the reveal states the answer rather than landing it",
};

/**
 * The critic's prompt. It receives the contract's roles and clock and the whole book, and it returns
 * findings — never prose. No example finding is shown: A_67 is that an example in a prompt is
 * reproduced, and a critic shown a specimen complaint returns that complaint.
 */
export const buildCriticPrompt = (args: {
  chapters: ReadonlyArray<ProseChapterLike>;
  core: ContractCore;
  expected: ReadonlyArray<number>;
}): string => {
  const order = [...args.expected].sort((a, b) => a - b);
  const lines: string[] = [];
  lines.push("You are reading a finished Golden Age detective novella for defects a reader would name.");
  lines.push("");
  lines.push("WHAT THIS BOOK IS FOR");
  lines.push(`  The culprit is named in chapter ${args.core.roles.reveal}.`);
  if (args.core.roles.discriminatingTest !== null) {
    lines.push(`  The test that proves it is staged in chapter ${args.core.roles.discriminatingTest}.`);
  }
  if (args.core.roles.aftermath !== null) {
    lines.push(`  Chapter ${args.core.roles.aftermath} is aftermath: consequence, not proof.`);
  }
  if (args.core.chronology.rows.length > 0) {
    lines.push("");
    lines.push("THE CLOCK — every time this book is entitled to state:");
    for (const row of args.core.chronology.rows) lines.push(`  ${row.value} — ${row.label}`);
  }
  lines.push("");
  lines.push("WHAT TO LOOK FOR — these classes and no others:");
  for (const cls of CRITIC_CLASSES) lines.push(`  ${cls}: ${CLASS_DEFINITIONS[cls]}`);
  lines.push("");
  lines.push("RULES");
  lines.push("  Quote at least eight words, copied exactly from the chapter you name. A finding whose");
  lines.push("  quote is not in that chapter is discarded, so copy rather than paraphrase.");
  lines.push("  At most three findings per chapter, and only where you would name it to the author.");
  lines.push("  Return JSON only: {\"findings\":[{\"class\":\"\",\"chapter\":0,\"quote\":\"\",\"note\":\"\"}]}");
  lines.push("");
  lines.push("THE BOOK");
  const bookByChapter = indexChapters(args.chapters, args.expected);
  order.forEach((chapter) => {
    const written = bookByChapter.get(chapter);
    if (!written) return;
    lines.push("");
    lines.push(`=== CHAPTER ${chapter}: ${written.title} ===`);
    for (const paragraph of written.paragraphs ?? []) lines.push(paragraph);
  });
  return lines.join("\n");
};

export interface CriticParseResult {
  findings: Finding[];
  /** Entries that named a class outside the vocabulary, or no chapter. */
  malformed: number;
}

/** Parse the critic's reply. Total: a reply this cannot read is zero findings, never an exception. */
export const parseCriticFindings = (raw: string): CriticParseResult => {
  let parsed: unknown;
  try {
    const text = String(raw ?? "");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    parsed = start >= 0 && end > start ? JSON.parse(text.slice(start, end + 1)) : null;
  } catch {
    return { findings: [], malformed: 0 };
  }
  const entries = (parsed as { findings?: unknown[] } | null)?.findings;
  if (!Array.isArray(entries)) return { findings: [], malformed: 0 };
  const findings: Finding[] = [];
  let malformed = 0;
  for (const entry of entries) {
    const e = entry as Record<string, unknown>;
    const cls = String(e?.class ?? "").trim() as FindingClass;
    const chapter = Number(e?.chapter);
    const quote = normalise(String(e?.quote ?? ""));
    if (!FINDING_CLASSES.includes(cls) || !CRITIC_CLASSES.includes(cls) || !Number.isFinite(chapter) || !quote) {
      malformed += 1;
      continue;
    }
    findings.push({
      class: cls,
      chapter,
      quote,
      note: normalise(String(e?.note ?? "")).slice(0, 160),
      severity: SEVERITY[cls],
      source: "critic",
    });
  }
  return { findings, malformed };
};

/** One line per class for the run report: produced, anchored, discarded. */
export const summariseFindings = (anchored: ReadonlyArray<Finding>, discarded: ReadonlyArray<Finding>): string => {
  const tally = new Map<string, { anchored: number; discarded: number }>();
  for (const f of anchored) {
    const row = tally.get(f.class) ?? { anchored: 0, discarded: 0 };
    row.anchored += 1;
    tally.set(f.class, row);
  }
  for (const f of discarded) {
    const row = tally.get(f.class) ?? { anchored: 0, discarded: 0 };
    row.discarded += 1;
    tally.set(f.class, row);
  }
  const parts = [...tally.entries()]
    .sort((a, b) => b[1].anchored + b[1].discarded - (a[1].anchored + a[1].discarded))
    .map(([cls, row]) => `${cls} ${row.anchored}${row.discarded > 0 ? `(+${row.discarded} unanchored)` : ""}`);
  return parts.length > 0 ? parts.join(", ") : "none";
};

/** The register rate of a book, for the run report beside the findings. */
export const bookRegisterRate = (chapters: ReadonlyArray<ProseChapterLike>): number =>
  machineRegisterRate(chapters.map((c) => (c.paragraphs ?? []).join(" ")).join(" "), REGISTER_TELEMETRY_THRESHOLD).rate;

/**
 * A_111 V-12 (WF-005 V2K-01) — the register HIT count: narration sentences at or over the threshold. The rate above has a
 * denominator, so an edit that shortens or removes a sentence raises it with no new register sentence (run bcc0d637 arm
 * B: 44 of 45 register rollbacks kept the hit count). The count rises only when an edit writes a register sentence.
 */
export const bookRegisterHits = (chapters: ReadonlyArray<ProseChapterLike>): number =>
  machineRegisterRate(chapters.map((c) => (c.paragraphs ?? []).join(" ")).join(" "), REGISTER_TELEMETRY_THRESHOLD).hits;
