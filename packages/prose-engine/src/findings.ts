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
  scoreSentenceRegister,
  REGISTER_TELEMETRY_THRESHOLD,
} from "@cml/prose-guard";
import { extractClockValues } from "@cml/cml";

import { indexChapters } from "./chapter-index.js";
import { findCatchphrases, findInstructionEchoes, instructionPhrases } from "./instruction-echo.js";
import { checkHardGates } from "./selector.js";
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
const OPERATION_NARRATED =
  /\b(?:spoke|said|replied|answered|continued|went on|addressed [^.!?]{0,30}|speech)\s+at length\b|\bat length,\s+(?:his|her|their)\b|\bin (?:two|three|four|five|six) words\b|\b(?:answer|reply|response|line)\s+(?:came|was|arrived)\s+(?:in\s+)?(?:brief|short|clipped|minimal|curt|a single word|\w+ words)\b|\bclipped to (?:two|three|four|five) words\b|\b(?:first|second) exchange\b|\bthe line (?:minimal|brief) but\b|\bas brief as it was\b/i;

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
  register_sentence: "craft",
  abstract_subject: "craft",
  operation_narrated: "craft",
  repeat_passage: "craft",
  catchphrase_repeated: "craft",
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

const sentencesOf = (text: string): string[] =>
  text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 0);

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
): Finding => ({ class: cls, chapter, quote: normalise(quote), note, severity: SEVERITY[cls], source });

/** The sentence in a chapter that best evidences a term — so even a checker's finding can be quoted. */
const sentenceContaining = (body: string, needles: ReadonlyArray<string>): string => {
  const lowered = body.toLowerCase();
  for (const sentence of sentencesOf(body)) {
    const s = sentence.toLowerCase();
    if (needles.some((n) => n && s.includes(n.toLowerCase()))) return sentence;
  }
  // Nothing to point at — the first sentence locates the chapter, which is what an absence needs.
  return sentencesOf(body)[0] ?? lowered.slice(0, 120);
};

export interface CheckerOptions {
  clueDistribution?: { clues?: unknown[] };
  /** How many register sentences to name per chapter. A_95 M1 named eight. */
  registerPerChapter?: number;
  /** The writer's instruction lines — the brief's asks and the contract's template phrases. */
  instructionLines?: ReadonlyArray<string>;
  /** The bible: anything in it is case vocabulary and is never called an echo. */
  caseText?: string;
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

  // 4. a sentence that appears in two chapters (A_90 §12: 16 of 24 copies came from the chapter before).
  const sentenceHome = new Map<string, number>();
  for (const chapter of order) {
    const body = bodyOf(byChapter.get(chapter));
    for (const sentence of sentencesOf(body)) {
      if (sentence.split(/\s+/).length < MIN_QUOTE_WORDS) continue;
      const key = sentence.toLowerCase();
      const home = sentenceHome.get(key);
      if (home === undefined) sentenceHome.set(key, chapter);
      else if (home !== chapter) {
        out.push(finding("copied_sentence", chapter, sentence, `also in chapter ${home}, word for word`));
      }
    }
  }

  // 5. a passage the book has already used (the repetition instrument's own worst spans).
  const whole = order.map((c) => bodyOf(byChapter.get(c))).join(" ");
  const density = repetitionDensity(whole);
  for (const worst of density.worst.slice(0, 5)) {
    if (worst.span.split(/\s+/).length < MIN_QUOTE_WORDS) continue;
    // Both sides, not one. The `break` here reported only the FIRST chapter carrying a repeated
    // span, so the editor repaired one copy and the other stood — and a repetition needs two places
    // to be a repetition. Capped at three chapters so a stock phrase cannot flood the list.
    let reported = 0;
    for (const chapter of order) {
      if (reported >= 3) break;
      const body = bodyOf(byChapter.get(chapter));
      if (!body.toLowerCase().includes(worst.span)) continue;
      out.push(
        finding("repeat_passage", chapter, sentenceContaining(body, [worst.span]), `this book has used this run of words ${worst.count} times`),
      );
      reported += 1;
    }
  }

  // 3b. 17-hitting-90 P4.1 — the sentence whose subject is the room, the silence, the truth or the
  // evidence. The family every one of the last four reads quoted; the repair is a person as subject.
  for (const [chapter, written] of byChapter) {
    const body = bodyOf(written);
    for (const sentence of sentencesOf(body)) {
      if (/["“]/.test(sentence)) continue; // narration only
      if (sentence.split(/\s+/).length < 5) continue;
      if (!ABSTRACT_SUBJECT.test(sentence)) continue;
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

  // 6. our own instructions, come back as prose (the reads of 2026-09-22 named five such phrases).
  if (options.instructionLines && options.instructionLines.length > 0) {
    const castNames = [...new Set([...core.scenes.flatMap((s) => s.present), ...core.fairPlay.culprits, core.fairPlay.victim])];
    const phrases = instructionPhrases(options.instructionLines, castNames, options.caseText ?? "");
    for (const hit of findInstructionEchoes(byChapter, phrases)) {
      out.push(finding("scaffold_token", hit.chapter, hit.sentence, `"${hit.phrase}" is the brief's wording, not the book's`));
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

  return out;
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
