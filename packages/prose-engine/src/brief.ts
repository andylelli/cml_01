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
    const style = text(profile.humourStyle).replace(/_/g, " ");
    const strength = Number(profile.humourLevel ?? 0);
    if (style && style !== "none" && strength > 0) {
      add("register", `${name} is funny in one way only: ${style}.`);
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
    add(
      "shapes",
      "THE FLAT ANSWER: the named character answers a question in four words or fewer, and the next sentence moves on.",
    );
    add(
      "shapes",
      "THE SHORT RETORT: somebody makes a speech of twenty-five words or more — write that speech, it is half the joke — and the named character answers it in six words or fewer.",
    );
    add(
      "shapes",
      "The sentence after a short answer is what somebody ELSE does: a movement, an object handled, a look away, the next question. The shortness stays in the line itself.",
    );
  }

  // ── the page ───────────────────────────────────────────────────────────────────────────────────
  const openings = speechOpenings(level);
  add("page", `${openings} paragraphs in each chapter open on a line somebody speaks.`);
  add("page", "At least four sentences in each chapter run past thirty words, because the thought they carry is that long.");
  add("page", "At least three em-dashes in each chapter, where a sentence turns on itself.");
  add(
    "page",
    "One paragraph in each chapter is there for its own sake: a detail, a gesture or an exchange that carries nothing the plot needs.",
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
      `In chapter ${dt} a named witness first says what they believe, then the test is performed on the page by named people, and only after it is watched does anyone say how it works.`,
    );
  }
  add(
    "tests",
    `Chapter ${core.roles.reveal} names ${core.fairPlay.culprits.join(", ") || "the culprit"}, states the act in a verb they own, and closes in the scene.`,
  );
  if (core.roles.aftermath !== null) {
    const aftermath = core.scenes.find((s) => s.chapter === core.roles.aftermath)?.aftermath;
    add(
      "tests",
      `Chapter ${core.roles.aftermath} opens on the outcome as a settled fact, gives two named survivors one concrete change each, carries one memory of the dead that is nothing to do with how they died, and ends on the place resuming ordinary use.`,
    );
    if (aftermath?.repairTarget) {
      add("tests", `Chapter ${core.roles.aftermath} also shows one thing outside a person put right: ${aftermath.repairTarget}.`);
    }
  }
  const closure = core.roles.clearances.filter((c) => c > core.roles.reveal);
  for (const chapter of closure) {
    add(
      "tests",
      `Chapter ${chapter} gives each suspect the arrest has already cleared one human beat — an apology, a thanks, a resentment said aloud, an assumption admitted — and their legal position is settled in a clause.`,
    );
  }

  // ── length ─────────────────────────────────────────────────────────────────────────────────────
  const preferred = core.scenes[0]?.words.preferred ?? 1_000;
  add("length", `Each chapter runs to about ${preferred} words. The book runs to ${core.book.words.min}-${core.book.words.max}.`);

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
