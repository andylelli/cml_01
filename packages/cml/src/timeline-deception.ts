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
};

const MINUTE_WORDS: Record<string, number> = {
  quarter: 15, half: 30, "ten minutes": 10, "five minutes": 5, "twenty minutes": 20,
  "twenty-five minutes": 25, ten: 10, five: 5, twenty: 20, "twenty-five": 25,
};

/**
 * Parse a clock time to minutes-since-midnight on a 12-hour dial (0..719), or null.
 * Deliberately dial-relative: prose says "a quarter past ten" without am/pm, and a mystery's events
 * sit inside one evening — comparing on the dial avoids inventing a meridiem the text never states.
 */
export const parseClockTime = (raw?: string): number | null => {
  const text = String(raw ?? "").toLowerCase().trim();
  if (!text) return null;

  const digital = text.match(/\b(\d{1,2}):(\d{2})\b/);
  if (digital) {
    const h = Number(digital[1]) % 12;
    const m = Number(digital[2]);
    if (m > 59) return null;
    return h * 60 + m;
  }

  // "a quarter past ten", "ten minutes past nine", "half past eight"
  const past = text.match(
    /\b(?:a\s+)?(quarter|half|ten minutes|five minutes|twenty minutes|twenty-five minutes|ten|five|twenty|twenty-five)\s+past\s+(twelve|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/,
  );
  if (past) {
    const mins = MINUTE_WORDS[past[1]];
    const hour = WORD_NUMBERS[past[2]];
    if (mins === undefined || hour === undefined) return null;
    return (hour % 12) * 60 + mins;
  }

  // "a quarter to ten", "ten minutes to nine"
  const to = text.match(
    /\b(?:a\s+)?(quarter|half|ten minutes|five minutes|twenty minutes|twenty-five minutes|ten|five|twenty|twenty-five)\s+to\s+(twelve|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/,
  );
  if (to) {
    const mins = MINUTE_WORDS[to[1]];
    const hour = WORD_NUMBERS[to[2]];
    if (mins === undefined || hour === undefined) return null;
    return (((hour % 12) * 60 - mins) + 720) % 720;
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
  const HOURS = "twelve|one|two|three|four|five|six|seven|eight|nine|ten|eleven";
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
        "The staged time of death falls OUTSIDE every span the culprit can account for, so the deception incriminates them instead of protecting them. The apparent time must land inside the culprit's alibi window — that is the whole point of faking it.",
    });
  }

  if (withinAnyWindow(actual, windows)) {
    violations.push({
      code: "actual_covered",
      message:
        "The real time of death falls INSIDE a span the culprit can account for, so they could not have committed the murder at all. The actual time must fall in a gap the culprit cannot account for.",
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
const DURATION_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
};

export const parseDurationMinutes = (raw: unknown): number | null => {
  const text = String(raw ?? "").toLowerCase().trim();
  if (!text) return null;
  if (/\b(?:past|to|o'?clock)\b/.test(text)) return null; // a position, not an offset
  const digits = text.match(/\b(\d{1,3})\s*[-\s]?\s*minutes?\b/);
  if (digits) return Number(digits[1]);
  const compound = text.match(/\b(twenty|thirty|forty|fifty)[-\s]([a-z]+)[-\s]+minutes?\b/);
  if (compound && DURATION_WORDS[compound[1]!] !== undefined && DURATION_WORDS[compound[2]!] !== undefined) {
    return DURATION_WORDS[compound[1]!]! + DURATION_WORDS[compound[2]!]!;
  }
  const words = text.match(/\b([a-z]+)[-\s]+minutes?\b/);
  if (words && DURATION_WORDS[words[1]!] !== undefined) return DURATION_WORDS[words[1]!]!;
  return null;
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

  if (clocks.length === 2 && durations.length === 1) {
    const gap = Math.abs(clocks[0]!.minutes - clocks[1]!.minutes);
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

  const apparent = parseClockTime(args.apparentTime as string | undefined);
  const actual = parseClockTime(args.actualTime as string | undefined);
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
