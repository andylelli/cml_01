/**
 * PROSE ENGINE v2 — THE BRIEF (ANALYSIS_99 §10.4).
 *
 * ── ONE PAGE, AND EVERY LINE IS A COUNTABLE ACT ──────────────────────────────────────────────────
 *
 * v1's prose prompt is 31 blocks, 27 of them `critical` or `high`, and most of what it says is a
 * prohibition. The compliance law says why that fails: **this model complies with OPERATIONS and
 * ignores STATISTICS** (VoiceSpec asked for 22.0-word sentences and got 15.86 in 0 of 10 chapters;
 * the humour guide asked for one observation every three pages and a whole book carried three to
 * five), and A_96 B1 measured the second half — a prohibition that QUOTES the thing it bans gets the
 * thing it bans: *"She did not elaborate"* ten times, *"Six words."* spoken aloud.
 *
 * So this file may not emit a prohibition, an example, or a rate. `briefLawViolations` states that
 * as a function and the test asserts it, because a law nobody can check is a comment.
 *
 * ── WHERE THE NUMBERS COME FROM ──────────────────────────────────────────────────────────────────
 *
 * Every count is the canon gap from WP-001 §5, measured over 720,000 words of period canon against
 * the 24 September manuscripts (A_99 §1.4), converted to a per-chapter integer:
 *
 *   paragraphs opening on speech   canon 59.7%, ours 13.1%   ~9 paragraphs/chapter → six of them
 *   sentences over thirty words    canon 10.4%, ours  5.1%   ~60 sentences/chapter → at least four
 *   em-dashes per 1,000 words      canon 6.52,  ours  0.65   ~1,000 words/chapter → at least three
 *
 * A count is the only form of this instruction that has ever moved: asked for semicolon-linked
 * clauses, the model went from 5 to 13; asked for a 19.5-word average, it went DOWN to 15.01.
 */

import type { Brief, BriefAsk, ContractCore } from "./types.js";
import { estimateTokens } from "./bible.js";
import { humourMove } from "./humour-move.js";

export const BRIEF_BUDGET = 1_500;

export interface BriefProfile {
  name?: string;
  humourStyle?: string;
  humourLevel?: number;
}

export interface BriefInput {
  core: ContractCore;
  profiles?: ReadonlyArray<BriefProfile>;
  humourLevel?: string;
}

/**
 * The law, as a function. A brief that trips any of these is a brief that has started writing v1's
 * prompt again, and the test fails rather than the next book.
 */
const PROHIBITION_MARKERS =
  /\b(never|do not|don't|must not|cannot|avoid|refrain|forbidden|banned|do NOT)\b/i;
const RATE_MARKERS = /\b(per cent|percent|average|averages|rate of|frequency|roughly one|about one|occasionally)\b|%/i;
const EXAMPLE_MARKERS = /\b(for example|e\.g\.|such as|like this|for instance)\b|["“][^"”]{12,}["”]/;

export const briefLawViolations = (brief: Brief): string[] => {
  const problems: string[] = [];
  for (const ask of brief.asks) {
    if (PROHIBITION_MARKERS.test(ask.line)) problems.push(`prohibition in ${ask.section}: ${ask.line}`);
    if (RATE_MARKERS.test(ask.line)) problems.push(`rate in ${ask.section}: ${ask.line}`);
    if (EXAMPLE_MARKERS.test(ask.line)) problems.push(`example in ${ask.section}: ${ask.line}`);
  }
  if (brief.tokens > BRIEF_BUDGET) problems.push(`over budget: ${brief.tokens} > ${BRIEF_BUDGET}`);
  return problems;
};

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();

/** How many paragraphs open on speech, by band. The canon opens three in five. */
const speechOpenings = (level: string): number => (level === "none" || level === "dry" ? 4 : 6);

/**
 * How many paragraphs of four or more sentences bring a chapter to its target. At the sentence
 * lengths this pipeline writes, a four-sentence paragraph is ~80 words, so a 1,000-word chapter is
 * twelve of them plus whatever else the scene needs. Exported so the per-chapter contract states the
 * same number the brief does (L6).
 */
export const fullParagraphs = (preferredWords: number): number => Math.max(6, Math.round(preferredWords / 85));

/**
 * The one sentence a mystery owes its reader, stated so it can be counted.
 *
 * It read *"names X, states the act in a verb they own, and closes in the scene"* and the model
 * complied with the first clause and not the second: *"You mean Nora Quayle."* — *"the only person
 * who could advance the clock … was Agatha Innes"*. Three of four v2 books, and §24 measured the
 * same defect in 35% of v1's. "The act" and "a verb they own" are abstractions; a name, a verb of
 * killing and the victim in one sentence is a shape. Stated once here and again on the reveal
 * chapter's own contract, which is the text nearest the writing (L6: one function, two readers).
 */
export const revealOperation = (core: ContractCore): string => {
  const culprit = core.fairPlay.culprits.join(", ") || "the culprit";
  const victim = core.fairPlay.victim || "the victim";
  return (
    `Chapter ${core.roles.reveal} carries one sentence, spoken aloud by the person who worked it out, that states as settled fact that ${culprit} killed ${victim}: ` +
    `the culprit's name and a verb of killing in the same sentence. ` +
    // A_101 §6: asked for one countable sentence, the model wrote that sentence and little else — on A
    // the reveal listed the evidence, then gave the verdict, and the reader wanted "a clearer
    // confession or breakdown". The culprit's own line is the second countable thing.
    // A_101 §14.3 — the read of 2026-09-23 scored the ending 7/10: the answer arrived and was "a bit
    // too cute for a murder confession", built out of the culprit's catchphrase. The operation asked
    // for an answer and never said what the answer must CARRY. It carries the reason now — as a
    // shape, not as text: the motive is in the bible, and pasting it here is how A_67 puts a phrase
    // on the page word for word.
    // Positive only: "never the evidence, and never a joke" was the first wording and the brief's own
    // law rejected it as a prohibition — the law working on the hand that wrote it.
    // 17-hitting-90 P1.5. "Answers … and what they say is the reason" produced silence on arm B —
    // *"Desmond's eyes flickered, but he made no reply"* — and on the read "too brief". One answer is
    // one thing; the model does the counted thing and drops the qualifier (A_102 §7). So: two lines,
    // each with its own slot, both bound to the case the bible already states.
    `Then ${culprit} speaks twice, in their own words on the page: one line says what ${victim} was about to do to them; ` +
    `one line names what that would have cost them — a person, a position or a place, said by its name. ` +
    // Run 98dec72a: "The confrontation ended in the scene, the truth spoken aloud". Said as a thing seen.
    `The chapter ends with everybody still in the room.`
  );
};

/**
 * 17-hitting-90 P1.4 — the mechanism in one sentence, and the opportunity as a window.
 *
 * Four of four recent reads asked for this in the same words: *"the clock mechanism needs one clean
 * explanatory sentence"*; *"We treated low tide as a single moment instead of a window."* The
 * mechanism itself is in the bible; this asks for the sentence as a shape and, when the chronology
 * carries an interval, names the two values it must contain.
 */
export const mechanismOperation = (core: ContractCore): string => {
  const reveal = core.scenes.find((s) => s.chapter === core.roles.reveal);
  const window = reveal?.opportunityWindow;
  return (
    `Chapter ${core.roles.reveal} carries one sentence, spoken aloud, that says how the killer reached the victim and got away — the route and the means, in one sentence.` +
    (window
      ? ` The chance to do it was a window, not an instant: that sentence, or the one after it, gives both ends from THE CLOCK — ${window.value} — as the time it opened and the time it closed.`
      : "")
  );
};

export const buildBrief = (input: BriefInput): Brief => {
  const { core } = input;
  const level = text(input.humourLevel).toLowerCase() || "classic";
  const profiles = (input.profiles ?? []).filter((p) => text(p?.name));
  const asks: BriefAsk[] = [];
  const add = (section: BriefAsk["section"], line: string) => asks.push({ section, line: line.replace(/\s+/g, " ").trim() });

  // ── who speaks how ─────────────────────────────────────────────────────────────────────────────
  /**
   * The ASSIGNMENT only. A character's mannerisms and tic are FACTS about them and live in the
   * bible; quoting them here would be two owners for one fact (L6) and — measured by this file's own
   * law test on the first cut — it also smuggles the upstream writer's prose into an instruction:
   * Agent 2b writes "her tone is formal but never stiff" and "occasionally punctuates her
   * observations", so the brief inherited a prohibition and a rate it never wrote.
   */
  for (const profile of profiles) {
    const name = text(profile.name);
    const style = text(profile.humourStyle);
    const strength = Number(profile.humourLevel ?? 0);
    if (style && style !== "none" && strength > 0) {
      // P4.2: the move, not the label — "polite savagery" came back on the page as a tag.
      add("register", `${name} is funny in one way only: ${humourMove(style)}.`);
    } else {
      add("register", `${name} is in earnest throughout, and the others' wit lands against that.`);
    }
  }
  add(
    "register",
    "Two characters who want the same thing say it in two different shapes, and a reader who covered the names could still tell them apart.",
  );

  // ── the two shapes, owned per chapter by the contract ──────────────────────────────────────────
  const witChapters = core.scenes.filter((s) => s.beats.wit).map((s) => s.chapter);
  if (witChapters.length > 0) {
    add(
      "shapes",
      `In each chapter that names a wit beat (${witChapters.join(", ")}), two exchanges are added to the conversation the chapter would have had anyway, at its full length.`,
    );
    // The moves keep their counts and lose their NAMES: "flat answer" and "short retort" were on the
    // page of two read books, and "delivered a speech" on a third, straight from these lines.
    // 17-hitting-90 §06 F8: the counts live on the QUOTED TEXT, and no property of the line is named.
    // "speaks at length" came back as "spoke at length" x7 on pair 3 and x7 on run 98dec72a; the
    // contract's "short reply" and "very short answer" as "Sir Edmund's reply was short" and
    // "Evelyn's answer was brief" x6. The narrator reports whatever property the brief names.
    add(
      "shapes",
      "The first exchange: somebody asks the named character a question, and the named character's reply, inside its quotation marks, is four words or fewer. The next sentence moves on.",
    );
    add(
      "shapes",
      "The second exchange: somebody else's line runs to twenty-five words or more, every word of it written out, because it is half the joke; the named character's reply to it, inside its quotation marks, is six words or fewer.",
    );
    add(
      "shapes",
      "The sentence after either reply is what somebody ELSE does: a movement, an object handled, a look away, the next question. The shortness stays inside the quotation marks.",
    );
  }

  // ── the page ───────────────────────────────────────────────────────────────────────────────────
  const openings = speechOpenings(level);
  /**
   * MEASURED 2026-09-19 over three drafts of one contract: em-dashes, asked as "at least three",
   * arrived at 6-8 a chapter; this line, asked as "open on a line somebody speaks", arrived at
   * 1.5-2.8 against 6. The brief is read. The wording was ambiguous — a paragraph that runs
   * `Bertram turned. "You hold it flat," he said.` was being counted as opening on speech. So the
   * operation now names the first character.
   */
  add(
    "page",
    `${openings} paragraphs in each chapter begin with a spoken line: the first character of the paragraph is the opening quotation mark, and the speech comes before any narration.`,
  );
  add("page", "At least four sentences in each chapter run past thirty words, because the thought they carry is that long.");
  add("page", "At least three em-dashes in each chapter, where a sentence turns on itself.");
  // WP-001 O5, stated as the act. It read "…a detail, a gesture or an exchange that carries nothing
  // the plot needs", and run 98dec72a printed the purpose three times: "a gesture that carried nothing
  // the plot needed". The reason for an operation is ours; the writer is given only the operation.
  add(
    "page",
    "One paragraph in each chapter follows one person through something of their own — a habit, a possession, a letter, a piece of work — that no other paragraph in the book comes back to.",
  );
  add(
    "page",
    "Every paragraph has a thing in it somebody could touch, and a person doing something with it or to it.",
  );

  // ── the clock ──────────────────────────────────────────────────────────────────────────────────
  if (core.chronology.rows.length > 0) {
    add("clock", "Every time this book states is one of the values in THE CLOCK, spelled the way THE CLOCK spells it.");
    add(
      "clock",
      "A character who works something out from the time works it out from two of those values, and says both.",
    );
  }

  // ── what the book does, in the reader's own terms ──────────────────────────────────────────────
  const dt = core.roles.discriminatingTest;
  if (dt !== null) {
    add(
      "tests",
      `In chapter ${dt} a named witness first says what they believe, then the test is performed on the page by named people, and only after it is watched does anyone say how it works.` +
        // On B the accusation followed the test in chapter 8, a chapter before its contract, and the
        // reveal happened twice. When the test and the reveal are different chapters, the test ends on
        // its result.
        (dt !== core.roles.reveal ? ` The chapter ends on the test's result; the name comes in chapter ${core.roles.reveal}.` : ""),
    );
  }
  add("tests", revealOperation(core));
  add("tests", mechanismOperation(core));
  if (core.roles.aftermath !== null) {
    const aftermath = core.scenes.find((s) => s.chapter === core.roles.aftermath)?.aftermath;
    // 17-hitting-90 §06 F8: acts, each with a person and a thing. The categories ("two named survivors
    // one concrete change each", "the place resuming ordinary use") came back on run 98dec72a as the
    // chapter's closing summary: "the survivors changed in concrete ways", "the study resumed its
    // ordinary use". The second wording printed too, on the 74 (matched pair on 98dec72a): "something
    // he could not have done before the arrest", "the last paragraph belonged to Evelyn Marsh".
    const dead = core.fairPlay.victim || "the dead";
    add(
      "tests",
      `Chapter ${core.roles.aftermath} opens on the first ordinary thing somebody does once the arrest is made, and the proof comes up in one clause or not at all. ` +
        `Two named people are each seen taking up something the case had stopped — a door unlocked, a letter sent, a piece of work begun again. ` +
        `Somebody handles a thing that belonged to ${dead} and remembers ${dead} using it on an ordinary day. ` +
        `It ends with somebody at the everyday work of the place.`,
    );
    if (aftermath?.repairTarget) {
      add("tests", `Chapter ${core.roles.aftermath} also shows one thing outside a person put right: ${aftermath.repairTarget}.`);
    }
  }
  const closure = core.roles.clearances.filter((c) => c > core.roles.reveal);
  for (const chapter of closure) {
    add(
      "tests",
      // 17-hitting-90, pair 2 (2026-09-25): "settled in a clause" is a qualifier, and the qualifier
      // dropped — chapter 9 re-cleared all three suspects with their clock values, the complaint 3
      // of the last 4 reads made. The count of a simple thing: one sentence, the name and the word.
      `Chapter ${chapter} gives each suspect the arrest has already cleared one human beat — an apology, a thanks, a resentment said aloud, an assumption admitted. ` +
        `Their legal position is one sentence of the investigator's: the suspect's name and the word "cleared", and the next sentence is what that suspect does with their hands. The clock values belong to chapter ${core.roles.reveal} and were said there.`,
    );
  }

  // ── length ─────────────────────────────────────────────────────────────────────────────────────
  const preferred = core.scenes[0]?.words.preferred ?? 1_000;
  /**
   * "About 1,000 words" is a STATISTIC and this model does not comply with those — three drafts
   * delivered 648, 678 and 722. What it does deliver is paragraphs: 14-17 a chapter, every time. They
   * were thin (39-49 words each, against v1's 130), which is where the words went. So the ask is the
   * countable thing that fixes it: paragraphs of substance. The word figure stays as the target it
   * describes.
   */
  add(
    "length",
    `At least ${fullParagraphs(preferred)} paragraphs in each chapter run to four sentences or more. That is what brings a chapter to its ${preferred} words, and the book to ${core.book.words.min}-${core.book.words.max}.`,
  );

  const bySection = new Map<BriefAsk["section"], string[]>();
  for (const ask of asks) bySection.set(ask.section, [...(bySection.get(ask.section) ?? []), ask.line]);
  const titles: Record<BriefAsk["section"], string> = {
    register: "HOW THEY SPEAK",
    shapes: "TWO EXCHANGES",
    page: "THE PAGE",
    clock: "THE CLOCK",
    tests: "WHAT THIS BOOK DOES",
    length: "LENGTH",
  };
  const order: BriefAsk["section"][] = ["register", "shapes", "page", "clock", "tests", "length"];
  const body = order
    .filter((section) => (bySection.get(section) ?? []).length > 0)
    .map((section) => `## ${titles[section]}\n${(bySection.get(section) ?? []).map((l) => `- ${l}`).join("\n")}`)
    .join("\n\n");

  return { text: body, tokens: estimateTokens(body), asks };
};
