/**
 * timeline-deception.ts — directional coherence for false-time concealments.
 *
 * WHY (external review, 2026-07-31, story_20260731-1750 — the reviewer's headline defect):
 *   "The timeline is backwards. The hands were forced to ten minutes past nine, but the true time of
 *    death was a quarter past ten … the story does not clearly explain why Hale would set the clock
 *    to an earlier time than the murder."
 *
 * A false-time concealment is not merely "a staged time different from the real one". It only works
 * — and only makes sense — when it moves suspicion OFF the culprit:
 *
 *   THE INVARIANT
 *     apparent time  ∈ a window the culprit CAN account for   (so the staged time exonerates them)
 *     actual time    ∉ any window the culprit can account for (so the real time would expose them)
 *
 * Staging a time that lands inside the culprit's own unaccounted gap incriminates them, which is the
 * opposite of a cover-up. That is exactly what shipped: staged 9:10 while Hale was alone on the
 * terrace, real death 10:15.
 *
 * Everything here is pure and total: unparseable or absent input yields NO violation. A generator
 * that omits the fields is never blocked by this — it degrades to today's behaviour.
 */

export interface TimelineDeceptionInput {
  /** Time the staged evidence implies (clock face, chime, forged log). */
  apparentTime?: string;
  /** Time the victim actually died. */
  actualTime?: string;
  /** The culprit's accountable span(s), e.g. "9:00 to 9:45 in the bar". */
  culpritAlibiWindows?: ReadonlyArray<string>;
}

export interface TimelineDeceptionViolation {
  code: "apparent_not_covered" | "actual_covered" | "times_identical";
  message: string;
}

const WORD_NUMBERS: Record<string, number> = {
  twelve: 12, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11,
  // FOUND BY REVIEW, 2026-08-20. The Agent 3b prompt lists "twenty past midnight" among its
  // CORRECT examples of a locked time value, and this parser returned null for it — so the
  // pipeline was instructing the model to write a form every temporal gate downstream is blind to.
  // Same for "noon", "half past midnight" and "ten minutes to midnight". On a 12-hour dial both
  // words sit at twelve, which is the position this parser measures; the meridiem they imply is
  // exactly what dial-relative comparison deliberately does not model.
  midnight: 12, noon: 12,
};

const MINUTE_WORDS: Record<string, number> = {
  quarter: 15, half: 30, "ten minutes": 10, "five minutes": 5, "twenty minutes": 20,
  "twenty-five minutes": 25, ten: 10, five: 5, twenty: 20, "twenty-five": 25,
};

/**
 * Spelled numbers, shared by the POSITION parser below and the OFFSET parser further down.
 *
 * The two parsers stay separate on purpose (an offset is not a position, and conflating them would
 * hide exactly the defect X38 exists to catch) — but they have no reason to disagree about what the
 * word "fourteen" means, and keeping two lists is how one of them came to be missing it.
 */
const SPELLED_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  // A duration is not bounded by a dial. "eighty minutes" is in the archived corpus and returned
  // null; the POSITION parser is unaffected, because its own branch lists its minute words inline
  // and bounds them at `mins < 60`.
  seventy: 70, eighty: 80, ninety: 90,
};

/**
 * A minute COUNT, for the "N minutes past/to HOUR" shapes: "fourteen", "twenty-three", "23".
 *
 * FOUND BY PROBE, 2026-08-19 (REVIEW_13 §7). `MINUTE_WORDS` above is a closed list of six values, so
 * `parseClockTime("fourteen minutes past four")` returned null — and that string is the 08-19 case's
 * OWN `actual_time_of_death`. The offset parser could already read "fourteen minutes"; only the
 * position parser could not, so every temporal check downstream was blind to the true time of death
 * while reading the false one perfectly.
 */
const parseMinuteCount = (raw: string): number | null => {
  const text = raw.trim();
  const digits = text.match(/^(\d{1,2})$/);
  if (digits) return Number(digits[1]);
  const compound = text.match(/^(twenty|thirty|forty|fifty)[-\s]([a-z]+)$/);
  if (compound) {
    const tens = SPELLED_NUMBERS[compound[1]!];
    const units = SPELLED_NUMBERS[compound[2]!];
    return tens !== undefined && units !== undefined && units < 10 ? tens + units : null;
  }
  const word = SPELLED_NUMBERS[text];
  return word === undefined ? null : word;
};

/**
 * Parse a clock time to minutes-since-midnight on a 12-hour dial (0..719), or null.
 * Deliberately dial-relative: prose says "a quarter past ten" without am/pm, and a mystery's events
 * sit inside one evening — comparing on the dial avoids inventing a meridiem the text never states.
 */
export const parseClockTime = (raw?: string): number | null => {
  // The curly apostrophe is not a different time. `accept.ts` folds its own input for exactly this
  // reason — "two o’clock" returned null while the folded prose parsed cleanly, and the manuscript
  // was accused of inventing the very hour the case declared. Folding here means no caller has to.
  const text = String(raw ?? "").toLowerCase().replace(/[‘’ʼ]/g, "'").trim();
  if (!text) return null;

  const digital = text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (digital) {
    const h = Number(digital[1]) % 12;
    const m = Number(digital[2]);
    if (m > 59) return null;
    return h * 60 + m;
  }

  // "fourteen minutes past four", "twenty-three minutes to nine", "23 minutes past four" — ANY minute
  // count, not just the six the two branches below happen to name.
  //
  // The literal word "minutes" is required, and that is the whole guard against ordinary prose: a
  // bare number word is why the bare-hour branch further down carries a guard of its own, but
  // nothing says "fourteen minutes past four" except a clock.
  //
  // RUNS FIRST, ahead of the six-value branches, because `\b` matches after a hyphen and so
  // "forty-five minutes past one" used to match their "five minutes past one" and return 1:05.
  // The same hyphen is why this branch opens with a lookbehind rather than `\b`: without it,
  // "sixty-one minutes past four" reads its tail as "one" and answers 4:01 for a minute that does
  // not exist. Both were found by running the parser over the corpus, not by reading it.
  const counted = text.match(
    /(?<![-\w])((?:twenty|thirty|forty|fifty)[-\s](?:one|two|three|four|five|six|seven|eight|nine)|twenty|thirty|forty|fifty|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|one|two|three|four|five|six|seven|eight|nine|\d{1,2})\s+minutes?\s+(past|to)\s+(twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/,
  );
  if (counted) {
    const mins = parseMinuteCount(counted[1]!);
    const hour = WORD_NUMBERS[counted[3]!];
    if (mins !== null && mins < 60 && hour !== undefined) {
      return counted[2] === "past"
        ? (hour % 12) * 60 + mins
        : (((hour % 12) * 60 - mins) + 720) % 720;
    }
  }

  // "a quarter past ten", "ten minutes past nine", "half past eight"
  const past = text.match(
    /\b(?:a\s+)?(quarter|half|ten minutes|five minutes|twenty minutes|twenty-five minutes|ten|five|twenty|twenty-five)\s+past\s+(twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/,
  );
  if (past) {
    const mins = MINUTE_WORDS[past[1]];
    const hour = WORD_NUMBERS[past[2]];
    if (mins === undefined || hour === undefined) return null;
    return (hour % 12) * 60 + mins;
  }

  // "a quarter to ten", "ten minutes to nine"
  const to = text.match(
    /\b(?:a\s+)?(quarter|half|ten minutes|five minutes|twenty minutes|twenty-five minutes|ten|five|twenty|twenty-five)\s+to\s+(twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/,
  );
  if (to) {
    const mins = MINUTE_WORDS[to[1]];
    const hour = WORD_NUMBERS[to[2]];
    if (mins === undefined || hour === undefined) return null;
    return (((hour % 12) * 60 - mins) + 720) % 720;
  }

  // "seven twenty", "eight oh five", "seven twenty-five" — the spoken HOUR-MINUTES form, which has
  // no "past" or "to" to key on.
  //
  // FOUND BY A PAID RUN, 2026-08-19 (mystery-1787167692140). X61 taught this parser to read
  // "fourteen minutes past four" and the very next case wrote its `actual_time_of_death` as
  // "seven twenty" instead — unreadable again, so X38 stayed silent on a device 25 minutes apart
  // that declares twenty. Fourth consecutive run with wrong device arithmetic, third distinct
  // surface form the parser could not read. A silent temporal gate still means UNPARSEABLE more
  // often than it means clean.
  //
  // A trailing daypart is allowed ("seven twenty in the evening", "two forty pm") because the corpus
  // writes anchors that way and the first version rejected them — measured over 15 archived runs.
  // Otherwise accepted ONLY when the whole segment is the time. Two bare number words are ordinary prose
  // ("one two men"), and this runs against free text as well as structured fields — the same reason
  // the bare-hour branch below carries a guard. Anchoring to the whole string is that guard.
  const hourMinutes = text.match(
    /^(twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\s+(?:oh\s+)?([a-z]+(?:-[a-z]+)?|\d{1,2})(?:\s+(?:a\.?m\.?|p\.?m\.?|in the (?:morning|afternoon|evening)|at night))?$/,
  );
  if (hourMinutes) {
    const hour = WORD_NUMBERS[hourMinutes[1]!];
    const mins = parseMinuteCount(hourMinutes[2]!);
    if (hour !== undefined && mins !== null && mins < 60) return (hour % 12) * 60 + mins;
  }

  // Bare hour words. This branch needs a GUARD: number words are ordinary prose, and matching them
  // unconditionally made "one of the guests" parse as 1:00 and "two others in the lounge" as 2:00 —
  // so `parseTimeWindow("spoke to one of the guests through two doors")` fabricated the window
  // [1:00, 2:00] from a sentence containing no time at all. An alibi_window is free text, so that
  // false window would have produced spurious violations the moment this fed a gate.
  //
  // Accept a bare hour only when the text actually commits to being a time:
  //   • it carries an explicit marker ("nine o'clock", "nine pm"), OR
  //   • a time preposition introduces it ("at nine", "until nine"), OR
  //   • the whole segment IS the hour ("nine") — the shape a split window yields ("nine to ten").
  const HOURS = "twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven";
  const bare = text.match(
    new RegExp(`\\b(?:(at|by|around|about|near|until|till|from|before|after|since)\\s+)?(${HOURS})\\b\\s*(o'?clock|a\\.?m\\.?|p\\.?m\\.?)?`),
  );
  if (bare) {
    const hour = WORD_NUMBERS[bare[2]];
    const committed = Boolean(bare[1]) || Boolean(bare[3]) || new RegExp(`^(?:${HOURS})$`).test(text);
    if (hour !== undefined && committed) return (hour % 12) * 60;
  }

  return null;
};

/** Extract a [start, end] dial span from free text like "9:00 to 9:45 in the bar". */
export const parseTimeWindow = (raw?: string): [number, number] | null => {
  const text = String(raw ?? "").toLowerCase();
  if (!text.trim()) return null;

  // A naive split on the separator alternation also splits INSIDE a time — "half past eight until a
  // quarter to nine" broke on both "until" and the "to" of "quarter to nine", yielding three
  // fragments and a silently wrong end time. Instead, try each separator position in turn and accept
  // the first split whose two halves BOTH parse as clock times.
  const separator = /\s+(?:until|till|through|to|-|–|—)\s+/g;
  for (let match = separator.exec(text); match !== null; match = separator.exec(text)) {
    const start = parseClockTime(text.slice(0, match.index));
    const end = parseClockTime(text.slice(match.index + match[0].length));
    if (start !== null && end !== null) return [start, end];
  }
  return null;
};

const withinAnyWindow = (minute: number, windows: ReadonlyArray<[number, number]>): boolean =>
  windows.some(([start, end]) =>
    // A window may wrap the dial (e.g. 11:40 → 00:20).
    start <= end ? minute >= start && minute <= end : minute >= start || minute <= end,
  );

/**
 * A_76 §16 — SAY THE NUMBERS.
 *
 * These messages diagnosed precisely and reported vaguely: *"the real time of death falls INSIDE a
 * span the culprit can account for"*, without naming the time, the span, or where the gaps are. The
 * check had all three and threw them away.
 *
 * A run on 2026-08-31 died on exactly that. Attempt 1 failed `apparent_not_covered`; the model moved
 * the staged time into the alibi window and thereby pushed the REAL time inside one too, producing
 * `actual_covered`; three further attempts oscillated without ever being told where the gaps were,
 * and the last one broke `delivery_path` while guessing. Five paid attempts to satisfy an arithmetic
 * constraint whose numbers we already knew.
 *
 * `formatDial` and `describeGaps` exist so the message can hand the model the answer instead of the
 * complaint.
 */
const formatDial = (minute: number): string => {
  const m = ((minute % 720) + 720) % 720;
  const hour = Math.floor(m / 60) === 0 ? 12 : Math.floor(m / 60);
  return `${hour}:${String(m % 60).padStart(2, "0")}`;
};

const describeWindows = (windows: ReadonlyArray<[number, number]>): string =>
  windows.map(([s, e]) => `${formatDial(s)}–${formatDial(e)}`).join(", ");

/** The spans on a 12-hour dial that NO window covers — where the real time of death may sit. */
const describeGaps = (windows: ReadonlyArray<[number, number]>): string => {
  const covered = new Array(720).fill(false);
  for (const [start, end] of windows) {
    for (let i = 0; i < 720; i += 1) {
      const inside = start <= end ? i >= start && i <= end : i >= start || i <= end;
      if (inside) covered[i] = true;
    }
  }
  const gaps: string[] = [];
  let openedAt: number | null = null;
  for (let i = 0; i < 720; i += 1) {
    if (!covered[i] && openedAt === null) openedAt = i;
    if ((covered[i] || i === 719) && openedAt !== null) {
      const end = covered[i] ? i - 1 : i;
      if (end - openedAt >= 4) gaps.push(`${formatDial(openedAt)}–${formatDial(end)}`);
      openedAt = null;
    }
  }
  return gaps.length > 0 ? gaps.join(", ") : "(none — the alibi windows cover the whole dial)";
};

/**
 * Check the directional invariant. Returns [] when it holds, or when there is not enough parseable
 * information to judge — this never manufactures a failure from missing data.
 */
export const checkTimelineDeception = (input: TimelineDeceptionInput): TimelineDeceptionViolation[] => {
  const apparent = parseClockTime(input.apparentTime);
  const actual = parseClockTime(input.actualTime);
  if (apparent === null || actual === null) return [];

  const violations: TimelineDeceptionViolation[] = [];

  if (apparent === actual) {
    violations.push({
      code: "times_identical",
      message:
        "The staged time and the real time of death are the same, so the concealment hides nothing. Move the apparent time into a span the culprit can account for.",
    });
    return violations;
  }

  const windows = (input.culpritAlibiWindows ?? [])
    .map(parseTimeWindow)
    .filter((w): w is [number, number] => w !== null);
  if (windows.length === 0) return violations;

  if (!withinAnyWindow(apparent, windows)) {
    violations.push({
      code: "apparent_not_covered",
      message:
        `The staged time of death (${formatDial(apparent)}) falls OUTSIDE every span the culprit can account for `
        + `(${describeWindows(windows)}), so the deception incriminates them instead of protecting them. `
        + `Move the APPARENT time to somewhere inside ${describeWindows(windows)} — that is the whole point of faking it. `
        + `Leave the real time of death where it is: it must stay in a gap the culprit cannot account for `
        + `(${describeGaps(windows)}).`,
    });
  }

  if (withinAnyWindow(actual, windows)) {
    violations.push({
      code: "actual_covered",
      message:
        `The real time of death (${formatDial(actual)}) falls INSIDE a span the culprit can account for `
        + `(${describeWindows(windows)}), so they could not have committed the murder at all. `
        + `Move the ACTUAL time into one of these gaps: ${describeGaps(windows)}. `
        + `Leave the staged time where it is: it must stay inside ${describeWindows(windows)}.`,
    });
  }

  return violations;
};

/**
 * Convenience adapter: pull the three inputs out of a CML case and run the check.
 *
 * Reads the culprit's alibi window through the camelCase/snake_case dual accessor — `cast` entries
 * carry `role_archetype` from CML but `roleArchetype` from Agent 2's design object, and a bare
 * snake_case read silently matches nobody.
 */
/**
 * ── DID THE ARITHMETIC CHECK ACTUALLY RUN? ───────────────────────────────────────────────────────
 *
 * `checkDeviceArithmetic` needs a SHAPE: two clock-valued locked facts and one duration-valued one
 * (or, via X61, the mechanism's apparent/actual pair plus a locked duration). When the shape is
 * absent it returns nothing — and nothing is indistinguishable from "the numbers agree".
 *
 * MEASURED 2026-08-27 over the 28 stored cases (`node scripts/mechanism-arithmetic-probe.mjs`):
 * 5 caught, and at least 6 MORE demonstrably broken and shipped, e.g. apparent 8:30 vs actual 9:00 —
 * 30 minutes apart — against a device declaring 20. On `canary_1787512796199` the mechanism named
 * both clocks (10:45 / 11:10, a 25-minute gap) while the hourglass is a twenty-minute device; the
 * check saw no locked duration, declined silently, and geometry caught the same defect at Agent 9
 * where it can only warn. BOTH external readers of that manuscript spent their entire review on it,
 * and `clues` scored 5 and 7 — the category with the most recoverable headroom in the ledger.
 *
 * WHY THIS REPORTS RATHER THAN GUESSES. The obvious fix — scrape the duration out of the mechanism
 * text — was built and measured, and it does not work: that case's text contains "takes twenty
 * minutes" (the device period) AND "about ten minutes" (elapsed time), and nothing distinguishes them
 * without inventing a pairing. The existing check is right to demand a DECLARED value. So this does
 * not weaken it; it makes the decline VISIBLE, so an unverifiable device is a known unknown instead
 * of a silent pass.
 *
 * Deliberately NOT a violation: it returns a separate type, so it cannot reach `validateCml`'s error
 * list and cannot abort a run. Over the stored cases the unreadable shape is the majority, and B1's
 * rule is that a check firing on most runs is an off switch with extra steps.
 */
export interface TimelineArithmeticCoverage {
  /** True when the case fakes a time at all — both mechanism anchors parse. */
  fakesATime: boolean;
  /** True when the shape was complete enough for the arithmetic to be checked. */
  verified: boolean;
  /** What was missing, in the words an operator needs to fix it. */
  reason?: string;
}

export const describeTimelineArithmeticCoverage = (cmlCase: any): TimelineArithmeticCoverage => {
  const mechanism = cmlCase?.hidden_model?.mechanism ?? {};
  const apparent = parseClockTime(mechanism?.apparent_time_of_death ?? mechanism?.apparentTime);
  const actual = parseClockTime(mechanism?.actual_time_of_death ?? mechanism?.actualTime);
  if (apparent === null || actual === null) {
    return { fakesATime: false, verified: false };
  }

  const facts: any[] = Array.isArray(cmlCase?.locked_facts)
    ? cmlCase.locked_facts
    : Array.isArray(cmlCase?.lockedFacts) ? cmlCase.lockedFacts : [];
  let clocks = 0;
  let durations = 0;
  for (const f of facts) {
    const raw = String(f?.value ?? "").trim();
    if (!raw) continue;
    if (parseDurationMinutes(raw) !== null) durations += 1;
    else if (parseClockTime(raw) !== null) clocks += 1;
  }

  if (durations === 1 && (clocks === 2 || (apparent !== null && actual !== null))) {
    return { fakesATime: true, verified: true };
  }
  return {
    fakesATime: true,
    verified: false,
    reason:
      `the device's period is not a locked fact (${durations} duration-valued locked fact(s), ${clocks} clock-valued). `
      + `apparent "${String(mechanism?.apparent_time_of_death ?? "")}" and actual `
      + `"${String(mechanism?.actual_time_of_death ?? "")}" are ${dialGapMinutes(apparent, actual)} minutes apart, `
      + `and NOTHING CHECKED that against the device's declared duration. Lock the period as a duration-valued `
      + `fact and the existing arithmetic check covers this case.`,
  };
};

export const checkCaseTimelineDeception = (cmlCase: any): TimelineDeceptionViolation[] => {
  const mechanism = cmlCase?.hidden_model?.mechanism ?? {};
  const culprits: string[] = (cmlCase?.culpability?.culprits ?? [])
    .map((n: unknown) => String(n ?? "").trim())
    .filter(Boolean);
  if (culprits.length === 0) return [];

  const cast: any[] = Array.isArray(cmlCase?.cast) ? cmlCase.cast : [];
  const culpritWindows = cast
    .filter((member) => culprits.includes(String(member?.name ?? "").trim()))
    .map((member) => String(member?.alibi_window ?? member?.alibiWindow ?? "").trim())
    .filter(Boolean);

  return checkTimelineDeception({
    apparentTime: mechanism.apparent_time_of_death,
    actualTime: mechanism.actual_time_of_death,
    culpritAlibiWindows: culpritWindows,
  });
};

// ── X38/X39 — the case's own clock, checked BEFORE any prose is written ───────

/**
 * A duration in minutes, which is not a clock reading and must not be parsed as one.
 *
 * "fourteen minutes" is an OFFSET; "a quarter past seven" is a POSITION. The defect this exists to
 * catch is those two being asserted about each other without agreeing, so conflating the parsers
 * would hide exactly what it is looking for.
 */
const DURATION_WORDS: Record<string, number> = SPELLED_NUMBERS;

/**
 * The tens words a duration compound can open with, as ONE source for the parser and the rewriter.
 *
 * Not a style preference. Written twice, they drifted immediately: the rewriter kept a list ending at
 * *fifty* while the parser's reached *ninety*, so "eighty-nine minutes" missed the compound branch,
 * fell to the bare-word branch, and was rewritten to **"eighty-twenty-five minutes"** — a string that
 * parses back to twenty-five, passes the round-trip assertion, and would be printed into the prose
 * verbatim. The assertion cannot catch this class, because the garbage reads correctly. Only one list
 * can.
 */
const DURATION_TENS = "twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety";
const durationCompoundRe = (): RegExp => new RegExp(`\\b(${DURATION_TENS})[-\\s]([a-z]+)[-\\s]+minutes?\\b`);

export const parseDurationMinutes = (raw: unknown): number | null => {
  const text = String(raw ?? "").toLowerCase().trim();
  if (!text) return null;
  if (/\b(?:past|to|o'?clock)\b/.test(text)) return null; // a position, not an offset
  const digits = text.match(/\b(\d{1,3})\s*[-\s]?\s*minutes?\b/);
  if (digits) return Number(digits[1]);
  const compound = text.match(durationCompoundRe());
  if (compound && DURATION_WORDS[compound[1]!] !== undefined && DURATION_WORDS[compound[2]!] !== undefined) {
    // The units word must BE a unit. Without this, "twenty-twenty minutes" reads as forty — the
    // same slack `parseMinuteCount` already refuses with the identical guard.
    const units = DURATION_WORDS[compound[2]!]!;
    if (units < 10) return DURATION_WORDS[compound[1]!]! + units;
  }
  // `\b` matches after a hyphen, so this branch used to read a compound's TAIL as the whole number:
  // "eighty-nine minutes" returned NINE and "seventy-five minutes" returned FIVE, because the tens
  // list above stopped at fifty and left them to fall through here. A wrong number is worse than
  // none, since X38 compares this value against a measured gap — the tail-read made coherent cases
  // look broken and broken ones look coherent by the wrong amount.
  //
  // Fixed by completing the tens list, NOT by the lookbehind the clock parser uses. Backtested over
  // the corpus, that lookbehind refused nine real manuscript sentences in which an em-dash had been
  // flattened to a hyphen — "a faint chime sounded-five minutes before the hour" — where the number
  // it rejects is a genuine duration. The two parsers differ here on purpose: `parseClockTime` is
  // run against free prose by `accept.ts` and must be strict about what it volunteers; this one is
  // only ever pointed at a locked-fact value, and refusing a legible duration costs more than it saves.
  const words = text.match(/\b([a-z]+)[-\s]+minutes?\b/);
  if (words && DURATION_WORDS[words[1]!] !== undefined) return DURATION_WORDS[words[1]!]!;
  return null;
};

/**
 * A minute count as an era word-form numeral: 25 → "twenty-five", 40 → "forty", 14 → "fourteen".
 *
 * Locked-fact values are printed into the prose VERBATIM, and this project's era rule forbids digits
 * there (`wordifyLockedFactValue`, agent3b-run.ts). A repair that wrote "25 minutes" would satisfy the
 * arithmetic and break the register, which is the trade this function exists to refuse.
 */
export const spellMinuteCount = (n: number): string | null => {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (!Number.isInteger(n) || n < 1 || n > 99) return null;
  if (n < 20) return ones[n]!;
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? tens[t]! : `${tens[t]}-${ones[o]}`;
};

/**
 * X38-AT-SOURCE — restate a duration at a new number, keeping every other word.
 *
 * The counterpart to `parseDurationMinutes`, and deliberately its neighbour: it recognises the SAME
 * three shapes in the SAME order, so the token it rewrites is by construction the token the parser
 * read. Two functions that disagree about which number a duration states would produce a value that
 * still fails the check it was repaired to pass — and this file's own history (X61, X67) is a list of
 * defects that entered exactly that way, through a second reader of the same vocabulary.
 *
 * Surrounding wording is preserved, because a locked fact is a sentence fragment the prose prints:
 * "a pause of forty minutes" becomes "a pause of twenty-five minutes", not "twenty-five minutes".
 *
 * Returns `null` — never a guess — when the parser cannot read the input, when the target is outside
 * 1–99, or when the rewritten string does not parse back to the requested number. That last check is
 * the X64/X65 lesson: a substitution applied without an assertion silently no-opped for a whole run.
 *
 * The round-trip is necessary and NOT sufficient, which is why the tens list is shared rather than
 * copied. With two lists, "eighty-nine minutes" rewrote to "eighty-twenty-five minutes" — which
 * parses back to twenty-five and passes the assertion clean. See `DURATION_TENS`.
 */
export const rewriteDurationMinutes = (raw: unknown, minutes: number): string | null => {
  const src = String(raw ?? "").trim();
  if (!src) return null;
  if (parseDurationMinutes(src) === null) return null; // only ever rewrite what the parser could read
  const word = spellMinuteCount(minutes);
  if (word === null) return null;

  const text = src.toLowerCase();
  const splice = (start: number, end: number): string => src.slice(0, start) + word + src.slice(end);

  // Same three shapes, same order, and the same tens list as parseDurationMinutes.
  const digits = /\b(\d{1,3})\s*[-\s]?\s*minutes?\b/.exec(text);
  const compound = durationCompoundRe().exec(text);
  const words = /\b([a-z]+)[-\s]+minutes?\b/.exec(text);

  let out: string | null = null;
  if (digits) {
    const start = digits.index + digits[0]!.indexOf(digits[1]!);
    out = splice(start, start + digits[1]!.length);
  } else if (compound) {
    const start = compound.index;
    const tail = compound[0]!.lastIndexOf(compound[2]!) + compound[2]!.length;
    out = splice(start, start + tail);
  } else if (words) {
    const start = words.index + words[0]!.indexOf(words[1]!);
    out = splice(start, start + words[1]!.length);
  }

  if (out === null) return null;
  return parseDurationMinutes(out) === minutes ? out : null;
};

/**
 * The interval between two positions on a 12-hour dial.
 *
 * `parseClockTime` is dial-relative (0..719) by design — prose says "a quarter past ten" without a
 * meridiem — so a plain subtraction measures the LONG way round whenever a pair straddles twelve.
 *
 * FOUND BY REVIEW, 2026-08-20. An ordinary late-night device — clock stopped at *"ten minutes to
 * twelve"*, chime at *"ten minutes past twelve"*, twenty minutes apart — was reported by X38 as
 * **700 minutes apart**, a false positive on a case that is perfectly coherent. Every archived run
 * is a 7-to-9pm evening crime, so the corpus has never crossed the boundary and nothing caught it;
 * it would fire on the first midnight story this generator is asked for.
 *
 * The short arc is the right reading: a mechanism interval is minutes, not eleven hours, and
 * `parseDurationMinutes` cannot express anything above ninety-nine in any case.
 */
export const dialGapMinutes = (a: number, b: number): number => {
  const raw = Math.abs(a - b) % 720;
  return Math.min(raw, 720 - raw);
};

export interface CaseTimeCoherenceViolation {
  code: "locked_time_arithmetic" | "time_spines_disagree";
  message: string;
}

/**
 * X38/X39 (REVIEW_09 §3) — does the case agree with ITSELF about time?
 *
 * FOUND BY A COLD READ, 2026-08-15, whose first and largest complaint was *"the timing math does not
 * work"*. It was right, and the defect was authored three agents before the prose:
 *
 *   Agent 3b's device, as LOCKED FACTS   displayed 7:15 · chime 7:05 · delay "fourteen minutes"
 *   Agent 3's hidden_model.mechanism     apparent 8:15 · actual 8:45
 *
 * 7:15 − 7:05 is TEN. And the mechanism's two anchors appeared in the finished manuscript zero times,
 * because locked facts are injected verbatim and the prose kept time by those instead. So the case
 * carried two temporal spines, the reader met the one that contradicts itself, and every geometry
 * check was reasoning about the one that never reached the page.
 *
 * **Agent 9 cannot repair either of these.** Locked facts are contractual — rewriting a chapter to
 * reconcile them would put the prose at odds with the registry. The repair belongs to the CASE, which
 * is why this runs before the prose exists rather than after it ships.
 *
 * Both checks are narrow, and stay silent on anything they cannot read unambiguously:
 *   • `locked_time_arithmetic` — exactly two clock-valued facts and exactly one duration. Three times
 *     or two durations have no single pairing, and a duration may legitimately be about neither.
 *   • `time_spines_disagree` — both mechanism anchors parse, the device declares two clock values, and
 *     NEITHER anchor is among them. One shared value is a case telling one story about time.
 */
export const checkCaseTimeCoherence = (args: {
  lockedFacts?: ReadonlyArray<{ id?: string; value?: string }>;
  apparentTime?: unknown;
  actualTime?: unknown;
}): CaseTimeCoherenceViolation[] => {
  const violations: CaseTimeCoherenceViolation[] = [];
  const facts = (args.lockedFacts ?? []).filter((f) => String(f?.value ?? "").trim().length > 0);

  const clocks: Array<{ id: string; raw: string; minutes: number }> = [];
  const durations: Array<{ id: string; raw: string; minutes: number }> = [];
  for (const fact of facts) {
    const raw = String(fact.value).trim();
    const id = String(fact.id ?? "").trim() || "(unnamed)";
    const asDuration = parseDurationMinutes(raw);
    if (asDuration !== null) {
      durations.push({ id, raw, minutes: asDuration });
      continue;
    }
    const asClock = parseClockTime(raw);
    if (asClock !== null) clocks.push({ id, raw, minutes: asClock });
  }

  const apparent = parseClockTime(args.apparentTime as string | undefined);
  const actual = parseClockTime(args.actualTime as string | undefined);

  if (clocks.length === 2 && durations.length === 1) {
    const gap = dialGapMinutes(clocks[0]!.minutes, clocks[1]!.minutes);
    const declared = durations[0]!;
    if (gap !== declared.minutes) {
      violations.push({
        code: "locked_time_arithmetic",
        message:
          `The device's own numbers disagree: ${clocks[0]!.id} "${clocks[0]!.raw}" and ${clocks[1]!.id} ` +
          `"${clocks[1]!.raw}" are ${gap} minutes apart, while ${declared.id} declares ` +
          `"${declared.raw}" (${declared.minutes}). Locked facts are injected into the prose verbatim, ` +
          `so a reader will meet both numbers and neither explains the other. Repair the CASE.`,
      });
    }
  }

  // X61 — THE SECOND CLOCK IS IN THE MECHANISM, NOT THE REGISTRY (found 2026-08-19, REVIEW_13 §7).
  //
  // The branch above needs two clock-valued LOCKED facts. The 08-19 case locked exactly one —
  // `false_display_time` "a quarter to three" — alongside `disengagement_duration` "forty-five
  // minutes", and left the other anchor in hidden_model.mechanism as `actual_time_of_death`
  // "fourteen minutes past four". So the shape gate declined in silence and the device shipped
  // EIGHTY-NINE minutes apart while declaring forty-five, on the third consecutive run to carry the
  // same defect. The manuscript then invented a third time of its own ("eight fifty-six"), because
  // the true one was never locked and so never reached the page.
  //
  // This is not a guess at a pairing, which is what the branch above refuses to do when it sees three
  // clocks. The mechanism NAMES the two times the device relates — apparent and actual are the
  // displacement, definitionally — so it is the pairing, read from the only place the case states it.
  //
  // Strictly a fallback: when the branch above could read the shape, it has already spoken, and a
  // case must not be reported twice for one defect.
  const primaryCouldRead = clocks.length === 2 && durations.length === 1;
  if (!primaryCouldRead && durations.length === 1 && apparent !== null && actual !== null) {
    const gap = dialGapMinutes(apparent, actual);
    const declared = durations[0]!;
    if (gap !== declared.minutes) {
      violations.push({
        code: "locked_time_arithmetic",
        message:
          `The device's own numbers disagree: the mechanism's anchors "${String(args.apparentTime)}" ` +
          `and "${String(args.actualTime)}" are ${gap} minutes apart, while ${declared.id} declares ` +
          `"${declared.raw}" (${declared.minutes}). The registry locks only one of the two clocks, so ` +
          `the prose prints that one and the duration, and a reader can do the subtraction the case ` +
          `never did. Repair the CASE.`,
      });
    }
  }

  if (apparent !== null && actual !== null && clocks.length >= 2) {
    const anchors = new Set([apparent, actual]);
    const shared = clocks.some((c) => anchors.has(c.minutes));
    if (!shared) {
      violations.push({
        code: "time_spines_disagree",
        message:
          `The case keeps time twice and the two do not meet: the mechanism's anchors are ` +
          `"${String(args.apparentTime)}" and "${String(args.actualTime)}", while the device locks ` +
          `${clocks.map((c) => `${c.id} "${c.raw}"`).join(" and ")}. The locked values are what the ` +
          `prose prints, so the anchors every temporal check is built on will not appear on the page.`,
      });
    }
  }

  return violations;
};
