/**
 * ── T2: THE ALIBI WINDOW, STRUCTURED AT BIRTH ────────────────────────────────────────────────────
 *
 * WHY THIS EXISTS, in one sentence: every temporal defect this project has had came from an LLM
 * writing a time as prose and a parser reverse-engineering a number back out of it.
 *
 * `alibi_window` is the worst instance. It is ONE free-text field carrying a time range AND a place —
 * `"2:00 to 2:40 PM in the smoking room"`, `"twelve to three, at the village green"` — and it is the
 * sole input to `checkCaseTimelineDeception`, the only check that verifies the concealment actually
 * protects the culprit.
 *
 * MEASURED 2026-09-05 over the 52 stored cases: every culprit has an alibi window string, and in 6
 * (12%) none of them parses, so that check has been SILENT on one case in eight. The four blind
 * windows failed for four different reasons — a comma, an unhyphenated "thirty five", a dash with no
 * spaces, and `"Before 9:15"` which is not a range at all. Run 89022 scored 85/100 with its staged
 * time of death (3:20) sitting OUTSIDE the culprit's own alibi (12:00–3:00) — the fake incriminated
 * him — and nothing said so.
 *
 * Enumerating the forms has not worked and will not: four unknown shapes in fifty-two cases, and the
 * next is unknown too. `temporal-spine.ts` already states the answer in its own docblock:
 *
 *   > compute time, do not validate it ... the number is authoritative and the words are rendered
 *   > from it
 *
 * ── WHAT THIS MODULE DOES, AND WHAT IT DELIBERATELY DOES NOT ─────────────────────────────────────
 *
 * The span is authoritative FOR CHECKS. The prose stays for reading, because a rendered window reads
 * worse than the model's own sentence and the location phrasing is part of the story's texture.
 *
 * That is not a compromise so much as the safe half of the trade: the number is what the arithmetic
 * uses, and `alibiSpanDisagreesWithProse` exists so the two cannot drift apart silently — the drift
 * that this project has now been bitten by in three separate places (locked-fact values vs their own
 * forbidden lists, the spine's clock reader vs `parseClockTime`, and this).
 *
 * The parse still happens ONCE, at Agent 3, where a failure is cheap and visible. Everything
 * downstream reads numbers.
 */

import { alibiSpanToWindow as toWindow, isValidAlibiSpan as isValid, parseTimeWindow } from "./timeline-deception.js";

import type { AlibiSpan } from "./timeline-deception.js";
export type { AlibiSpan } from "./timeline-deception.js";
export { isValidAlibiSpan, alibiSpanToWindow } from "./timeline-deception.js";

/** Minutes on a 12-hour dial, 0..719 — the same scale `parseClockTime` returns. */
const DIAL = 720;

/**
 * Recover a span from a prose window. The ONE place a parse is allowed, and its failure is a
 * reported outcome rather than a silent null — see `AGENT3_ALIBI_UNREADABLE_GATE`.
 *
 * Uses the WIDE vocabulary unconditionally: this is a migration path for text that already exists,
 * so reading as much of it as possible is the whole point, and a value it gets wrong would have been
 * wrong at the gate too.
 */
export const alibiSpanFromWindow = (raw?: string): AlibiSpan | null => {
  const window = parseTimeWindow(raw, { wide: true });
  if (!window) return null;
  const [start, end] = window;
  return {
    startHour: Math.floor(start / 60) % 12,
    startMinute: start % 60,
    endHour: Math.floor(end / 60) % 12,
    endMinute: end % 60,
    ...(extractSpanLocation(raw) ? { location: extractSpanLocation(raw)! } : {}),
  };
};

/**
 * The place from an alibi window, or null.
 *
 * Deliberately a separate, forgiving reader: the location is never used for arithmetic, so a wrong
 * answer here costs a slightly odd rendering and nothing else. `case-locked-facts.ts` has its own
 * stricter extractor for the locked-fact registry; this one is not a second authority over that.
 */
export const extractSpanLocation = (raw?: string): string | null => {
  const text = String(raw ?? "").trim();
  const match = /\b(?:in|at|near|inside|outside|within|beside|on)\s+(.+)$/i.exec(text);
  if (!match) return null;
  const place = match[1]!.replace(/[.,;]+$/, "").trim();
  return place.length > 1 ? place : null;
};

const HOUR_WORDS = [
  "twelve", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten", "eleven",
];
const MINUTE_WORDS: Record<number, string> = {
  5: "five", 10: "ten", 15: "a quarter", 20: "twenty", 25: "twenty-five", 30: "half",
};

/** One endpoint, in words. Kept private: a half-rendered span is not a useful export. */
const renderPoint = (hour: number, minute: number): string => {
  const h12 = hour % 12;
  const word = HOUR_WORDS[h12] ?? String(h12);
  if (minute === 0) return `${word} o'clock`;
  if (minute === 30) return `half past ${word}`;
  if (MINUTE_WORDS[minute]) return `${MINUTE_WORDS[minute]} past ${word}`;
  if (MINUTE_WORDS[60 - minute]) return `${MINUTE_WORDS[60 - minute]} to ${HOUR_WORDS[(h12 + 1) % 12]}`;
  return `${word} ${minute < 10 ? `oh ${minute}` : String(minute)}`;
};

/**
 * The prose form of a span — used when the model gave a span but no window, so the two are one
 * function and cannot disagree.
 *
 * NOT used to overwrite a window the model authored. A rendered sentence reads worse than the
 * model's own, and the point of the span is to make the ARITHMETIC exact, not to flatten the prose.
 */
export const renderAlibiWindow = (span: AlibiSpan): string => {
  const body = `${renderPoint(span.startHour, span.startMinute)} to ${renderPoint(span.endHour, span.endMinute)}`;
  return span.location ? `${body} in ${span.location}` : body;
};

/**
 * Do the structured span and the prose window disagree about the numbers?
 *
 * Returns null when they agree, when there is no span, or when the prose cannot be read at all —
 * an unreadable window is `culprit_alibi_unreadable`'s business, not this one, and reporting it
 * twice would double-count a single defect.
 *
 * This is the guard that makes keeping both representations safe. Value and words drifting apart is
 * the defect this project has now hit three times in different clothes.
 */
export const alibiSpanDisagreesWithProse = (
  span: unknown,
  window?: string,
): { spanSays: [number, number]; proseSays: [number, number] } | null => {
  if (!isValid(span)) return null;
  const prose = parseTimeWindow(window, { wide: true });
  if (!prose) return null;
  const fromSpan = toWindow(span);
  const same = fromSpan[0] % DIAL === prose[0] % DIAL && fromSpan[1] % DIAL === prose[1] % DIAL;
  return same ? null : { spanSays: fromSpan, proseSays: prose };
};
