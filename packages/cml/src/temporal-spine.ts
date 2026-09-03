/**
 * THE TEMPORAL SPINE — Phase 0 (measurement only; nothing in the pipeline reads this yet).
 *
 * WHY THIS EXISTS, measured on run mystery-1788457673117 (external read 76/100, timing named as the
 * central defect):
 *
 *   call_sheet_date            = "a quarter to six on the evening prior"
 *   actual_call_sheet_creation = "twenty minutes past three on the murder day"
 *                                 derivedFrom: [call_sheet_date, call_sheet_creation_delay]
 *   call_sheet_creation_delay  = "one hour and fifty-five minutes"
 *
 * Three separate failures follow from those three strings, and all three are the same root cause:
 *
 *  1. `parseClockTime("a quarter to six on the evening prior")` returns **345** — 5:45 AM. It does
 *     not fail; it silently discards "evening" (12 hours) and "prior" (a day). Its own docblock is
 *     honest about the assumption — *"a mystery's events sit inside one evening"* — and this case
 *     breaks it. A dial-relative 0..719 value CANNOT represent either quantity.
 *  2. `isAtomicLockedFactValue` returns false for the same string, so the checks that DO respect the
 *     qualifier skip the fact entirely. One string, simultaneously readable to one consumer and
 *     unreadable to another.
 *  3. `reconcileDeviceArithmetic` (X38) knows exactly ONE relation — `duration = |A − B|`. This case
 *     declared `instant = instant + duration`, the inverse, so it hit `continue` and emitted nothing.
 *     The one time a device finally declared its dependency, the reconciler could not read the
 *     direction.
 *
 * THE PRINCIPLE: **compute time, do not validate it.** Today an LLM authors times as prose in three
 * places and every consumer reverse-engineers numbers back out. Here the number is authoritative and
 * the words are rendered from it, so a value and its forbidden-alternatives list cannot drift apart
 * (they are one function), and a day boundary is arithmetic rather than decoration.
 *
 * WHAT THIS MODULE DELIBERATELY DOES NOT DO: guess. Where the case does not state enough to fix a
 * time — "twenty minutes past three" with no daypart is 03:20 or 15:20 and the text says which
 * nowhere — `meridiem` is reported as `"unknown"` rather than defaulted. An underspecified case is a
 * finding about the CASE, and the current pipeline's habit of returning a confident 200 is precisely
 * what hides it.
 */

/** Minutes in a day. Absolute times here are 0..1439, NOT the dial-relative 0..719 of parseClockTime. */
export const MINUTES_PER_DAY = 1440;

export type Meridiem = "am" | "pm" | "unknown";

export interface TemporalReading {
  /** Minutes since midnight on its own day, 0..1439 when `meridiem` is known; 0..719 when unknown. */
  minutes: number;
  /** Days relative to the murder day: 0 = the murder day, -1 = the day/evening before, +1 = after. */
  dayOffset: number;
  meridiem: Meridiem;
  /** The daypart or day phrase actually found in the text, for rendering and for diagnosis. */
  qualifier: string | null;
  /** The bare clock phrase, with any qualifier stripped. */
  clockPhrase: string;
}

const WORD_HOURS: Record<string, number> = {
  twelve: 12, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, midnight: 12, noon: 12,
};

const HOUR_WORDS = [
  "twelve", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven",
];

const MINUTE_WORDS = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five",
  "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine",
];

/**
 * Day-offset vocabulary. A CLOSED list, and that is a deliberate difference from the wordlists this
 * repo keeps widening: an unrecognised day phrase yields `dayOffset: 0` AND a null qualifier, which
 * the spine reports as underspecified rather than silently treating as the murder day.
 */
const DAY_PHRASES: Array<{ re: RegExp; offset: number }> = [
  { re: /\bon\s+the\s+(?:evening|night|day|afternoon|morning)\s+(?:prior|before)\b/, offset: -1 },
  { re: /\bthe\s+(?:previous|preceding|prior)\s+(?:evening|night|day|afternoon|morning)\b/, offset: -1 },
  { re: /\b(?:the\s+)?(?:evening|night|day)\s+before\b/, offset: -1 },
  { re: /\bthe\s+(?:following|next)\s+(?:morning|day|evening|afternoon)\b/, offset: 1 },
  { re: /\bthe\s+(?:morning|day)\s+after\b/, offset: 1 },
  { re: /\bon\s+the\s+murder\s+day\b/, offset: 0 },
  { re: /\bon\s+the\s+day\s+of\s+the\s+murder\b/, offset: 0 },
  { re: /\b(?:that|the\s+same)\s+(?:day|evening|night|afternoon|morning)\b/, offset: 0 },
];

/** Daypart vocabulary → meridiem. Also a closed list; anything else leaves meridiem "unknown". */
const DAYPART_PHRASES: Array<{ re: RegExp; meridiem: Meridiem }> = [
  // FIRST, and it must stay first: the small hours are AM. Rendering 03:20 as "at night" and reading
  // it back gave 15:20 — a silent 12-hour error, in the one module whose entire purpose is to stop
  // exactly that. Caught by the renderer round-trip, not by reading the list.
  { re: /\bin\s+the\s+small\s+hours\b/, meridiem: "am" },
  { re: /\b(?:in\s+the\s+)?morning\b/, meridiem: "am" },
  { re: /\b(?:in\s+the\s+)?(?:afternoon|evening)\b/, meridiem: "pm" },
  { re: /\bat\s+night\b|\bnight\b/, meridiem: "pm" },
  { re: /\bp\.?m\.?\b/, meridiem: "pm" },
  { re: /\ba\.?m\.?\b/, meridiem: "am" },
];

const foldApostrophes = (s: string): string => s.replace(/[‘’ʼ]/g, "'");

/**
 * Read a locked-fact time value into a structure, KEEPING the day and daypart the existing parser
 * discards. Returns null when there is no clock phrase at all.
 *
 * This is not a widened `parseClockTime` and must not become one: it answers a different question.
 * `parseClockTime` asks "where on a 12-hour dial", which is the right question for reading the
 * MODEL's prose, where no meridiem is stated. This asks "which absolute instant does the CASE
 * declare", which is the only question arithmetic can be done on.
 */
export const parseTemporalValue = (raw?: string): TemporalReading | null => {
  const text = foldApostrophes(String(raw ?? "").toLowerCase()).replace(/\s+/g, " ").trim();
  if (!text) return null;

  /**
   * ORDER MATTERS, and the first version got it wrong. The day phrase is matched and STRIPPED before
   * the daypart is looked for, because "on the evening prior" contains "evening" and the two
   * searches ran independently over the same text — so the qualifier came back as the nonsense
   * "on the evening prior evening" and the meridiem was set by accident rather than by rule.
   *
   * A day phrase that names a daypart supplies the meridiem itself ("the evening prior" IS pm), so
   * the hint is read off the matched phrase rather than left to a second search that has just had
   * its evidence removed.
   */
  let dayOffset = 0;
  let dayQualifier: string | null = null;
  let meridiem: Meridiem = "unknown";
  for (const { re, offset } of DAY_PHRASES) {
    const hit = re.exec(text);
    if (hit) {
      dayOffset = offset;
      dayQualifier = hit[0];
      if (/\b(?:evening|night|afternoon)\b/.test(dayQualifier)) meridiem = "pm";
      else if (/\bmorning\b/.test(dayQualifier)) meridiem = "am";
      break;
    }
  }

  const withoutDay = dayQualifier ? text.replace(dayQualifier, " ").replace(/\s+/g, " ").trim() : text;

  let daypartQualifier: string | null = null;
  for (const { re, meridiem: m } of DAYPART_PHRASES) {
    const hit = re.exec(withoutDay);
    if (hit) {
      meridiem = m;
      daypartQualifier = hit[0];
      break;
    }
  }

  // Strip the qualifiers so only the clock phrase is matched against.
  let clockPhrase = withoutDay;
  if (daypartQualifier) clockPhrase = clockPhrase.replace(daypartQualifier, " ");
  clockPhrase = clockPhrase.replace(/\s+/g, " ").trim();

  const dial = readDialMinutes(clockPhrase);
  if (dial === null) return null;

  // "midnight"/"noon" fix the meridiem themselves.
  let minutes = dial;
  if (/\bmidnight\b/.test(clockPhrase)) {
    minutes = 0;
    meridiem = "am";
  } else if (/\bnoon\b|\bmidday\b/.test(clockPhrase)) {
    minutes = 12 * 60;
    meridiem = "pm";
  } else if (meridiem === "pm") {
    minutes = (dial % 720) + 720;
  } else if (meridiem === "am") {
    minutes = dial % 720;
  }

  return {
    minutes,
    dayOffset,
    meridiem,
    qualifier: [dayQualifier, daypartQualifier].filter(Boolean).join(" ").trim() || null,
    clockPhrase,
  };
};

/**
 * The bare 12-hour-dial reading of a clock phrase, 0..719. Intentionally a small, strict subset —
 * this module's job is to be certain, and `parseClockTime` remains the permissive reader for prose.
 */
const readDialMinutes = (phrase: string): number | null => {
  const digital = /\b(\d{1,2})[:.](\d{2})\b/.exec(phrase);
  if (digital) {
    const h = Number(digital[1]);
    const m = Number(digital[2]);
    if (m > 59 || h > 23) return null;
    return (h % 12) * 60 + m;
  }

  if (/\bmidnight\b/.test(phrase)) return 0;
  if (/\bnoon\b|\bmidday\b/.test(phrase)) return 0;

  const numberWord =
    "(?:twenty|thirty|forty|fifty)[-\\s](?:one|two|three|four|five|six|seven|eight|nine)" +
    "|twenty-five|twenty|thirty|forty|fifty|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen" +
    "|seventeen|eighteen|nineteen|one|two|three|four|five|six|seven|eight|nine|\\d{1,2}";
  const hourWord = "twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven";

  const counted = new RegExp(
    `(?<![-\\w])(${numberWord})\\s+minutes?\\s+(past|to)\\s+(${hourWord})\\b`,
  ).exec(phrase);
  if (counted) {
    const mins = spelledNumber(counted[1]!);
    const hour = WORD_HOURS[counted[3]!];
    if (mins === null || mins > 59 || hour === undefined) return null;
    return counted[2] === "past"
      ? (hour % 12) * 60 + mins
      : ((hour % 12) * 60 - mins + 720) % 720;
  }

  const fraction = new RegExp(
    `\\b(?:a\\s+)?(quarter|half)\\s+(past|to)\\s+(${hourWord})\\b`,
  ).exec(phrase);
  if (fraction) {
    const mins = fraction[1] === "quarter" ? 15 : 30;
    const hour = WORD_HOURS[fraction[3]!];
    if (hour === undefined) return null;
    return fraction[2] === "past"
      ? (hour % 12) * 60 + mins
      : ((hour % 12) * 60 - mins + 720) % 720;
  }

  const oclock = new RegExp(`\\b(${hourWord})\\s+o'clock\\b`).exec(phrase);
  if (oclock) {
    const hour = WORD_HOURS[oclock[1]!];
    return hour === undefined ? null : (hour % 12) * 60;
  }

  return null;
};

const SPELLED: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
};

const spelledNumber = (raw: string): number | null => {
  const text = raw.trim().toLowerCase();
  if (/^\d{1,2}$/.test(text)) return Number(text);
  const compound = /^(twenty|thirty|forty|fifty)[-\s]([a-z]+)$/.exec(text);
  if (compound) {
    const tens = SPELLED[compound[1]!];
    const units = SPELLED[compound[2]!];
    return tens !== undefined && units !== undefined && units < 10 ? tens + units : null;
  }
  const word = SPELLED[text];
  return word === undefined ? null : word;
};

/**
 * Read a duration ("one hour and fifty-five minutes", "twenty minutes") to a minute count.
 * Separate from the instant reader on purpose: conflating the two is exactly how X38 came to expect
 * one arithmetic shape and miss the other two.
 */
export const parseDurationValue = (raw?: string): number | null => {
  const text = foldApostrophes(String(raw ?? "").toLowerCase()).replace(/\s+/g, " ").trim();
  if (!text) return null;
  // A clock phrase is not a duration — "twenty minutes past three" must never read as 20 minutes.
  if (/\b(past|to)\s+(twelve|midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven)\b/.test(text)) {
    return null;
  }
  if (/o'clock/.test(text)) return null;

  let total = 0;
  let matched = false;

  const hours = /(?:^|\s)((?:\d{1,2})|[a-z-]+)\s+hours?\b/.exec(text);
  if (hours) {
    const h = spelledNumber(hours[1]!);
    if (h === null) return null;
    total += h * 60;
    matched = true;
  }

  const mins = /(?:^|\s)((?:\d{1,2})|(?:twenty|thirty|forty|fifty)[-\s][a-z]+|[a-z]+)\s+minutes?\b/.exec(text);
  if (mins) {
    const m = spelledNumber(mins[1]!);
    if (m === null) return null;
    total += m;
    matched = true;
  }

  return matched ? total : null;
};

/**
 * Render a minutes-since-midnight value as the canonical Golden Age word form.
 *
 * `daypart: true` appends the period, and it is not decoration — without it the rendering is
 * 12-hour and ambiguous, so a spine that rendered its own values would hand the writer back exactly
 * the ambiguity this module exists to remove. Round-tripping a PM instant through the bare form and
 * reading it again loses 12 hours, which the module's own test pins.
 */
export const renderClockWords = (minutes: number, opts?: { daypart?: boolean }): string => {
  const norm = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  if (norm === 0) return "midnight";
  if (norm === 720) return "noon";

  const hourName = (h: number): string => HOUR_WORDS[h % 12] ?? String(h % 12);
  let base: string;
  if (m === 0) base = `${hourName(h24)} o'clock`;
  else if (m === 15) base = `a quarter past ${hourName(h24)}`;
  else if (m === 30) base = `half past ${hourName(h24)}`;
  else if (m === 45) base = `a quarter to ${hourName(h24 + 1)}`;
  else if (m < 30) base = `${MINUTE_WORDS[m]} minutes past ${hourName(h24)}`;
  else base = `${MINUTE_WORDS[60 - m]} minutes to ${hourName(h24 + 1)}`;

  if (!opts?.daypart) return base;
  // The hour the phrase NAMES, which for a "to" form is the next hour — "a quarter to six" at 05:45
  // is morning, at 17:45 is evening, and keying the daypart off h24 alone mislabels the boundary.
  if (h24 < 5) return `${base} in the small hours`;
  if (h24 < 12) return `${base} in the morning`;
  if (h24 < 17) return `${base} in the afternoon`;
  if (h24 < 22) return `${base} in the evening`;
  return `${base} at night`;
};

// ─────────────────────────────────────────────────────────────────────────────
// The spine
// ─────────────────────────────────────────────────────────────────────────────

export interface SpineFactInput {
  id?: unknown;
  value?: unknown;
  description?: unknown;
  derivedFrom?: unknown;
}

export interface SpineInstant extends TemporalReading {
  id: string;
  /** Absolute minutes including the day offset, so arithmetic crosses midnight correctly. */
  absolute: number;
}

export interface SpineDuration {
  id: string;
  minutes: number;
}

export type ArithmeticShape =
  | "duration_from_two_instants"
  | "instant_from_instant_and_duration"
  | "unsupported";

export interface SpineFinding {
  id: string;
  shape: ArithmeticShape;
  /** "closes" | "fails" | "underspecified" | "unreadable" | "undeclared" */
  status: "closes" | "fails" | "underspecified" | "unreadable" | "undeclared";
  declared?: number;
  computed?: number;
  detail: string;
}

export interface TemporalSpine {
  instants: SpineInstant[];
  durations: SpineDuration[];
  findings: SpineFinding[];
  /** Time-shaped values the strict reader could not resolve at all. */
  unreadable: string[];
}

/**
 * Build the spine from a device's locked-fact registry, and check every declared derivation.
 *
 * Every arithmetic shape is tried, not just the one X38 knows. Where a meridiem is unknown the check
 * tries BOTH readings and reports `closes` if either works — an honest "the case may be coherent but
 * does not say so" rather than a confident wrong answer.
 */
export const buildTemporalSpine = (facts: ReadonlyArray<SpineFactInput>): TemporalSpine => {
  const instants: SpineInstant[] = [];
  const durations: SpineDuration[] = [];
  const unreadable: string[] = [];

  for (const fact of facts ?? []) {
    const id = String(fact?.id ?? "").trim();
    const value = String(fact?.value ?? "").trim();
    if (!id || !value) continue;

    const duration = parseDurationValue(value);
    if (duration !== null) {
      durations.push({ id, minutes: duration });
      continue;
    }
    const reading = parseTemporalValue(value);
    if (reading) {
      instants.push({ ...reading, id, absolute: reading.dayOffset * MINUTES_PER_DAY + reading.minutes });
      continue;
    }
    // Only report values that LOOK temporal; a pendulum length is not an unreadable time.
    if (/\b(?:o'clock|past|to\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|minutes?|hours?|midnight|noon)\b/.test(value.toLowerCase())) {
      unreadable.push(`${id}="${value}"`);
    }
  }

  const instantById = new Map(instants.map((i) => [i.id, i]));
  const durationById = new Map(durations.map((d) => [d.id, d]));
  const findings: SpineFinding[] = [];

  for (const fact of facts ?? []) {
    const id = String(fact?.id ?? "").trim();
    const declaredFrom = Array.isArray(fact?.derivedFrom) ? fact.derivedFrom.map((s) => String(s).trim()) : null;
    if (!id || !declaredFrom || declaredFrom.length !== 2) continue;

    const [srcA, srcB] = declaredFrom;
    const target = instantById.get(id) ?? durationById.get(id);
    if (!target) {
      findings.push({ id, shape: "unsupported", status: "unreadable", detail: `target "${id}" is not a readable time or duration` });
      continue;
    }

    const aInstant = instantById.get(srcA!);
    const bInstant = instantById.get(srcB!);
    const aDuration = durationById.get(srcA!);
    const bDuration = durationById.get(srcB!);

    // SHAPE 1 — duration = |A − B|. The only shape X38 supports today.
    if (durationById.has(id) && aInstant && bInstant) {
      const declared = durationById.get(id)!.minutes;
      const outcomes = meridiemVariants(aInstant, bInstant).map(([x, y]) => Math.abs(x - y));
      const closes = outcomes.some((o) => o === declared);
      findings.push({
        id,
        shape: "duration_from_two_instants",
        // BINARY, and both halves were got wrong once before landing on this.
        //
        // v1 reported "underspecified" whenever a meridiem was unknown, even when NO reading closed —
        // labelling a definite failure as a gap in the wording, and handing the regeneration weaker
        // feedback than the case deserved. v2 over-corrected: it demanded that EVERY reading close,
        // which for an instant the case states once is unsatisfiable by construction, and the archive
        // firing rate went 31.8% -> 61.4% — straight into CLAUDE.md B1, a check that fires on most
        // runs being an off switch with extra steps.
        //
        // The honest question is whether the case is coherent under ANY reading. If one is, the
        // author meant that one; if none is, the arithmetic is wrong however the day is read. Daypart
        // ambiguity is a real defect but a CLARITY one, reported as telemetry rather than as broken
        // arithmetic.
        status: closes ? "closes" : "fails",
        declared,
        computed: outcomes[0],
        detail: `declared ${declared}m; computed ${[...new Set(outcomes)].join(" or ")}m from ${srcA}/${srcB}`,
      });
      continue;
    }

    // SHAPE 2 — instant = instant ± duration. What the 76/100 case declared, and X38 cannot read.
    const baseInstant = aInstant ?? bInstant;
    const offsetDuration = aDuration ?? bDuration;
    if (instantById.has(id) && baseInstant && offsetDuration) {
      const declared = instantById.get(id)!;
      const candidates: number[] = [];
      for (const [base] of meridiemVariants(baseInstant, baseInstant)) {
        candidates.push(base + offsetDuration.minutes, base - offsetDuration.minutes);
      }
      const declaredOptions = declared.meridiem === "unknown"
        ? [declared.absolute, declared.absolute + 720]
        : [declared.absolute];
      const closes = candidates.some((c) => declaredOptions.some((d) => c === d));
      findings.push({
        id,
        shape: "instant_from_instant_and_duration",
        // Same rule as the shape above, and for the same measured reason. Coherent under ANY reading
        // is coherent; coherent under none is broken regardless of the daypart.
        status: closes ? "closes" : "fails",
        declared: declared.absolute,
        computed: candidates[0],
        detail:
          `declared ${declared.absolute}m (${declared.meridiem}); ` +
          `${baseInstant.id} ± ${offsetDuration.minutes}m gives ${[...new Set(candidates)].join(" or ")}m`,
      });
      continue;
    }

    findings.push({
      id,
      shape: "unsupported",
      status: "unreadable",
      detail: `derivedFrom [${srcA}, ${srcB}] does not resolve to a shape this spine can compute`,
    });
  }

  return { instants, durations, findings, unreadable };
};

/** Both meridiem readings of an instant whose daypart the case never stated. */
const meridiemVariants = (a: SpineInstant, b: SpineInstant): Array<[number, number]> => {
  const optionsFor = (i: SpineInstant): number[] =>
    i.meridiem === "unknown" ? [i.absolute, i.absolute + 720] : [i.absolute];
  const out: Array<[number, number]> = [];
  for (const x of optionsFor(a)) for (const y of optionsFor(b)) out.push([x, y]);
  return out;
};
