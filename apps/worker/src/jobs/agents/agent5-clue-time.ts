/**
 * Agent 5 clue contracts — clock times in clue text: era time style (digit times to words) and locked-fact
 * time transpositions. Split from agent5-contracts.ts (code review A5-05), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { parseClockTime } from "@cml/cml";
import {
  type ClueGuardrailIssue,
} from "./shared.js";

export const normalizeTokens = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export const nameAppearsInText = (name: string, text: string): boolean => {
  const nameTokens = normalizeTokens(name).filter((t) => t.length > 2);
  if (nameTokens.length === 0) return false;
  const haystack = ` ${normalizeTokens(text).join(" ")} `;
  // A_53 P4 (a5-namesappearsintext-substring-collision): require the full name as an ORDERED phrase
  // (so "Mary …" and "… Vane" in separate sentences no longer match "Mary Vane"), or a distinctive
  // surname token (the last name token, length ≥3). The old "every token appears anywhere" over-matched.
  if (haystack.includes(` ${nameTokens.join(" ")} `)) return true;
  const surnameToken = nameTokens[nameTokens.length - 1];
  return surnameToken.length >= 3 && haystack.includes(` ${surnameToken} `);
};

/**
 * Does this text contain the value as a WHOLE ORDERED PHRASE? No last-token fallback.
 *
 * `nameAppearsInText` exists for CAST NAMES and falls back to the final token so that "… Vane"
 * matches "Mary Vane". Applied to a locked-fact VALUE that fallback is catastrophic:
 *
 *     "a quarter past seven"  -> last token "seven"
 *     "a quarter to seven"    -> last token "seven"
 *
 * so each fact matched the OTHER fact's clue, the gate compared 435 against 405, and reported a
 * contradiction in a case that was perfectly consistent. MEASURED: this killed a live run on
 * 2026-08-21 (PLAN-TO-90 0b.1, first attempt) at Agent 5, before a word of prose — and it fires for
 * any case whose locked times share a final word, which for clock values ("seven", "o'clock",
 * "night", "morning") is the common case rather than the exotic one.
 *
 * A value is not a name: it has no distinctive surname, and every token of it is generic. The only
 * safe test is the whole phrase.
 */
const valueAppearsInText = (value: string, text: string): boolean => {
  const valueTokens = normalizeTokens(value).filter((token) => token.length > 0);
  if (valueTokens.length === 0) return false;
  return ` ${normalizeTokens(text).join(" ")} `.includes(` ${valueTokens.join(" ")} `);
};

export const checkEraTimeStyleInClues = (clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const digitTimePattern = /\b\d{1,2}:\d{2}\s*(?:am|pm|a\.m\.|p\.m\.)?\b|\b\d{1,2}\s*(?:am|pm|a\.m\.|p\.m\.)\b/i;
  for (const clue of clues.clues as any[]) {
    const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
    if (digitTimePattern.test(text)) {
      issues.push({
        severity: "warning",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} uses digit-based time notation; use era-style worded time expressions`,
      });
    }
  }
  return issues;
};

const SMALL_NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];

const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty"];

const numberToWords = (n: number): string => {
  if (n < 0) return String(n);
  if (n < 20) return SMALL_NUMBER_WORDS[n] || String(n);
  if (n < 60) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return ones === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]} ${SMALL_NUMBER_WORDS[ones]}`;
  }
  return String(n);
};

const toEraWordedTime = (hour24: number, minute: number): string => {
  const normalizedHour = ((hour24 % 24) + 24) % 24;
  const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
  const period = normalizedHour < 12 ? "in the morning" : normalizedHour < 18 ? "in the afternoon" : "in the evening";
  if (minute === 0) return `${numberToWords(hour12)} o'clock ${period}`;
  return `${numberToWords(hour12)} ${numberToWords(minute)} ${period}`;
};

export const replaceDigitTimesWithEraWords = (text: string): string => {
  let next = text;

  next = next.replace(
    /\b(\d{1,2}):(\d{2})\s*(am|pm|a\.m\.|p\.m\.)?\b/gi,
    (_full, hRaw, mRaw, suffixRaw) => {
      let hour = Number(hRaw);
      const minute = Number(mRaw);
      const suffix = String(suffixRaw || "").toLowerCase().replace(/\./g, "");
      if (Number.isNaN(hour) || Number.isNaN(minute) || minute < 0 || minute > 59) return _full;
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      return toEraWordedTime(hour, minute);
    },
  );

  next = next.replace(
    /\b(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)\b/gi,
    (_full, hRaw, suffixRaw) => {
      let hour = Number(hRaw);
      const suffix = String(suffixRaw || "").toLowerCase().replace(/\./g, "");
      if (Number.isNaN(hour)) return _full;
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      return toEraWordedTime(hour, 0);
    },
  );

  return next;
};

export function sanitizeEraTimeStyleInClues(clues: ClueDistributionResult): string[] {
  const repairs: string[] = [];
  for (const clue of clues.clues as any[]) {
    const clueId = String(clue?.id ?? "(unknown-id)");
    const originalDescription = String(clue?.description ?? "");
    const originalPointsTo = String(clue?.pointsTo ?? "");
    const nextDescription = replaceDigitTimesWithEraWords(originalDescription);
    const nextPointsTo = replaceDigitTimesWithEraWords(originalPointsTo);

    if (nextDescription !== originalDescription || nextPointsTo !== originalPointsTo) {
      clue.description = nextDescription;
      clue.pointsTo = nextPointsTo;
      repairs.push(`${clueId}: converted digit-based time notation to era-worded style`);
    }
  }
  return repairs;
}

/**
 * ONE clock parser, injected from `@cml/cml` — this file no longer keeps its own.
 *
 * FOUND BY REVIEW, 2026-08-20. `parseWordFormTime` was a private third body of a parser that
 * `@cml/cml` already owns, and it had drifted badly: **it has no "to" branch at all**, and its
 * "quarter past" pattern is anchored with `^`, so a leading article breaks it. None of the widenings
 * that parser has received — X61's any-minute-count, X67's hour-minutes, daypart and meridiem forms,
 * the curly-apostrophe fold — ever reached this copy.
 *
 * MEASURED over the archived registries: of the 36 locked facts that ARE clock times, this function
 * read 15 and **silently skipped 21 — 58%**, including every "a quarter to X" (13 of them, the most
 * common time form in the corpus) and every "a quarter past X" carrying an article.
 *
 * The check below is a real fair-play gate — a clue whose stated time contradicts a locked fact is a
 * defect a reader WILL catch — and `if (!parsedFact) continue;` meant it declined in silence on more
 * cases than it examined.
 */
const parseFactClockMinutes = (value: string): number | null => parseClockTime(value);

/**
 * Does this text STATE a meridiem, as opposed to what time it means?
 *
 * A separate question from parsing, and the only reason the old copies returned a struct at all. It
 * stays local because it is one predicate over free text, not a second reader of the time vocabulary.
 */
/**
 * A_88 — this predicate was `/<0x08>(am|pm|a.m.|p.m.)<0x08>/i`: two LITERAL BACKSPACE characters
 * where `\b` word boundaries were meant. It therefore returned false for every input ever given to
 * it, and both gates built on it have been dead for the life of the project:
 *
 *   - the AM/PM ambiguity violation ("mismatched AM/PM specificity") compares two always-false
 *     values, so it can never fire. CONFIRMED: the string appears 0 times across every file in
 *     `logs/`.
 *   - the transposition repair's guard `if (statesExplicitMeridiem(a) !== statesExplicitMeridiem(b))
 *     continue;` never skips, so the repair also runs on the meridiem mismatches it means to leave
 *     to the gate.
 *
 * A literal control character is invisible in review, compiles without complaint, and leaves a regex
 * that still "works" — it just never matches. `clearance-vocabulary-parity.test.ts` now asserts no
 * regex carries one.
 *
 * FLAG-GATED rather than simply corrected: this switches a never-fired VIOLATION live, and a
 * violation can block a run. MEASURED over the archive — 89 locked-fact values, of which **0** state
 * an explicit meridiem, and 4 of 1,132 clue texts do — so the corrected gate would fire on a handful
 * of pairs, not none and not many. Off is byte-identical to every run to date.
 */
const statesExplicitMeridiem = (text: string): boolean => {
  const corrected = /^(1|true|yes|on)$/i.test(String(process.env.AGENT5_MERIDIEM_CHECK ?? "").trim());
  if (!corrected) return false;   // the historical behaviour, stated plainly instead of by accident
  return /\b(am|pm|a\.m\.|p\.m\.)\b/i.test(String(text));
};

/**
 * Repair a locked-fact/clue time TRANSPOSITION — the two canonical values swapped — and nothing else.
 *
 * WHY THIS EXISTS (X86). `findLockedFactClueTimeConflicts` threw and killed the run, alone among its
 * neighbours in `runClueGuardrails`: `checkCastNamePathConsistency` gets `repairCastNamePathConsistency`,
 * `checkEraTimeStyleInClues` gets `sanitizeEraTimeStyleInClues`, and `findCulpritDiscriminatingGaps`
 * gets `synthesizeMissingCulpritDiscriminatingClues`. Each repairs, re-checks, and only then throws.
 * This one did not, and it cost a live run on 2026-08-21: the registry held
 * `clock_displayed_time="a quarter past seven"` and `chime_time="a quarter to seven"` while the clues
 * put the face at 6:45 and the chimes at 7:15 — the two values **transposed**. The parsers were
 * correct; the gate was right that the case contradicted itself; the run died anyway.
 *
 * WHAT IT WILL AND WILL NOT DO, and the line is deliberate. *A detector may guess; a repairer may not.*
 * So this repairs on ONE provable condition: the clue text literally contains **another locked fact's
 * canonical value**, where this fact's value belongs. The locked-fact registry is canonical by
 * construction — Pillar 1 exists so these values cannot drift — so a clue carrying a different
 * REGISTRY value in this slot is definitionally a transposition, not a new fact the story is asserting.
 * Rewriting it to canonical is what the registry is for, and is the same move
 * `repairCastNamePathConsistency` already makes against a wrong cast name.
 *
 * Everything else still throws. A clue whose time merely disagrees — a value the registry has never
 * heard of — is not a transposition, and guessing which side is right there would be exactly the
 * over-reach this comment refuses. Matching on the literal string rather than on parsed minutes is the
 * same restraint: an equivalent time phrased differently is not demonstrably the other fact's value.
 */
export const repairLockedFactClueTimeTranspositions = (
  cml: CaseData,
  clues: ClueDistributionResult,
  lockedFactsOverride?: any[],
): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const mapping = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  const lockedFacts = Array.isArray(lockedFactsOverride)
    ? lockedFactsOverride
    : Array.isArray(caseBlock?.locked_facts)
      ? caseBlock.locked_facts
      : [];
  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return [];

  /** Every OTHER registry value that parses as a clock time — the only strings we may substitute away. */
  const timeFacts = lockedFacts
    .map((f: any) => ({ id: String(f?.id ?? ""), value: String(f?.value ?? "").trim() }))
    .filter((f) => f.value.length > 0 && parseFactClockMinutes(f.value) !== null);
  if (timeFacts.length < 2) return [];

  const clueById = new Map(clues.clues.map((c) => [String(c.id), c]));
  const mappedClueIds: string[] = mapping
    .map((m: any) => String(m?.clue_id ?? ""))
    .filter((id: string) => id.length > 0);
  const repairs: string[] = [];

  for (const fact of lockedFacts) {
    const factId = String(fact?.id ?? "");
    const factDesc = String(fact?.description ?? "");
    const factValue = String(fact?.value ?? "").trim();
    if (!factValue) continue;
    const factMinutes = parseFactClockMinutes(factValue);
    if (factMinutes === null) continue;

    for (const clueId of mappedClueIds) {
      const clue = clueById.get(clueId);
      if (!clue) continue;
      const description = String((clue as any).description ?? "");
      const pointsTo = String((clue as any).pointsTo ?? "");
      const clueText = `${description} ${pointsTo}`;
      // Same reachability test the detector uses — repair exactly the pairs it would have flagged.
      if (!nameAppearsInText(factDesc, clueText) && !valueAppearsInText(factValue, clueText)) continue;

      const clueMinutes = parseFactClockMinutes(clueText);
      if (clueMinutes === null || clueMinutes === factMinutes) continue;
      // Meridiem mismatches are a DIFFERENT violation with a different remedy; leave them to the gate.
      if (statesExplicitMeridiem(factValue) !== statesExplicitMeridiem(clueText)) continue;

      // The provable case: the clue literally carries another registry value here.
      const other = timeFacts.find(
        (t) => t.value !== factValue && parseFactClockMinutes(t.value) === clueMinutes && clueText.includes(t.value),
      );
      if (!other) continue;

      if (description.includes(other.value)) {
        (clue as any).description = description.split(other.value).join(factValue);
      }
      if (pointsTo.includes(other.value)) {
        (clue as any).pointsTo = pointsTo.split(other.value).join(factValue);
      }
      repairs.push(
        `${clueId}: carried "${other.value}" (the canonical value of locked fact "${other.id}") where ` +
          `locked fact "${factId || factDesc}" requires "${factValue}" — transposition rewritten to canonical`,
      );
    }
  }

  return repairs;
};

/**
 * Exported with its repairer so the X86 contract can be pinned as a PAIR.
 *
 * `enforceAgent5DeterministicContracts` runs a dozen gates before this one, so a test driving the
 * whole chain would need a fully-valid case and would fail in `checkSourcePathValidity` long before
 * reaching the behaviour under test — testing everything except the thing that changed.
 */
export const findLockedFactClueTimeConflicts = (
  cml: CaseData,
  clues: ClueDistributionResult,
  lockedFactsOverride?: any[],
): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const mapping = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  const lockedFacts = Array.isArray(lockedFactsOverride)
    ? lockedFactsOverride
    : Array.isArray(caseBlock?.locked_facts)
      ? caseBlock.locked_facts
      : [];

  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return [];

  const clueById = new Map(clues.clues.map((c) => [String(c.id), c]));
  const violations: string[] = [];
  /** A_80 F14 — reported, never fatal. See the block below for why the distinction matters. */
  const softViolations: string[] = [];

  for (const fact of lockedFacts) {
    const factId = String(fact?.id ?? "");
    const factDesc = String(fact?.description ?? "");
    const factValue = String(fact?.value ?? "").trim();
    if (!factValue) continue;

    const factMinutes = parseFactClockMinutes(factValue);
    if (factMinutes === null) continue;
    const factStatesMeridiem = statesExplicitMeridiem(factValue);

    const mappedClueIds = mapping
      .map((m: any) => String(m?.clue_id ?? ""))
      .filter((id: string) => id.length > 0);

    for (const clueId of mappedClueIds) {
      const clue = clueById.get(clueId);
      if (!clue) continue;
      const clueText = `${String(clue.description ?? "")} ${String((clue as any).pointsTo ?? "")}`;
      if (!nameAppearsInText(factDesc, clueText) && !valueAppearsInText(factValue, clueText)) continue;

      const clueMinutes = parseFactClockMinutes(clueText);
      if (clueMinutes === null) continue;

      /**
       * A_80 F14 — MENTIONING AN EVENT IS NOT THE SAME AS TIMING IT.
       *
       * This gate aborted run mystery-1788285698781 (2026-09-01) on a locked fact
       * `staff_shift_change_time = "half past ten"` versus a clue about the KITCHEN SERVICE BELL
       * ringing at a quarter past ten. Those are two different events. The clue paired with the fact
       * only because it mentioned the shift change in passing — "…Captain Hale was seen near the
       * lobby during the staff shift change" — and the gate then read the clue's only time as if it
       * were the fact's time.
       *
       * The case being destroyed was built on exactly that disagreement: its own discriminating test
       * reads "comparing the lobby clock's displayed time with the independently timed kitchen
       * service bell … the displayed time remains twenty minutes behind the bell's chime". **The gate
       * aborted a clock-tampering mystery for containing a second, disagreeing timepiece**, which is
       * the mechanism of the entire sub-genre.
       *
       * A clue that carries MORE THAN ONE time expression is describing a relationship between times,
       * not restating one fact's value — which is what a discriminating test looks like. The
       * confident case, and the only one worth aborting a paid run for, is a clue that states exactly
       * one time and is unambiguously ABOUT this fact. Anything looser is reported and the run
       * continues, because a false abort costs a whole run and a false warning costs a log line.
       */
      const timeExpressions = countClockTimeExpressions(clueText);
      const factValueRestated = valueAppearsInText(factValue, clueText);
      const attributionGap = timeAttributionGap(factDesc, clueText);
      // Confident only when the clue restates this fact's value, or states a time right beside a
      // mention of this fact's event. A clue carrying several times is describing a RELATIONSHIP
      // between them — the shape of a discriminating test — and is never a restatement of one fact.
      const confidentlyAboutThisFact =
        factValueRestated || (timeExpressions === 1 && attributionGap <= MAX_ATTRIBUTION_GAP_WORDS);
      if (!confidentlyAboutThisFact) {
        softViolations.push(
          `CML time NOTE (not a conflict): clue "${clueId}" states ${timeExpressions} time(s), the nearest ` +
            `${attributionGap === Infinity ? "unrelated to" : `${attributionGap} words from`} any mention of ` +
            `"${factDesc}", and does not restate its value "${factValue}". Reads as a clue that MENTIONS this ` +
            `event rather than one that TIMES it, so it is not treated as a contradiction (A_80 F14).`,
        );
        continue;
      }
      const clueStatesMeridiem = statesExplicitMeridiem(clueText);

      // AM/PM ambiguity guard: do not silently infer when only one side is explicit.
      if (factStatesMeridiem !== clueStatesMeridiem) {
        violations.push(
          `CML time ambiguity: locked fact "${factId || factDesc}" value "${factValue}" and clue "${clueId}" include mismatched AM/PM specificity. Make both explicit (or both implicit) before prose generation.`
        );
        continue;
      }

      if (factMinutes !== clueMinutes) {
        violations.push(
          `CML time contradiction: locked fact "${factId || factDesc}" canonical "${factValue}" conflicts with clue "${clueId}" time expression (parsed ${Math.floor(clueMinutes / 60)}:${String(clueMinutes % 60).padStart(2, "0")} on the dial).`
        );
      }
    }
  }

  for (const note of softViolations) console.warn(`[Agent 5] ${note}`);
  return violations;
};

/**
 * A_80 F14 — how many distinct clock times a text states.
 *
 * Deliberately a CLOSED vocabulary, for the reason A_80 §2 documents at length: an open `[a-z-]+`
 * class matched "required to set" when this same shape was written for the retry guard, and an
 * over-matching pattern inside a gate that ABORTS is the most expensive kind.
 */
/**
 * A_80 F14 — the clock-time vocabulary, written as a LITERAL and shared by both helpers below.
 *
 * The first version assembled it with `new RegExp("(?:a\s+)?…")`. Inside a JS string literal `\s` is
 * not an escape — it collapses to a bare `s` — and the template literal's `\b` became a backspace
 * character. The gate matched nothing, which would have silently turned every conflict into a soft
 * note: an abort that was disabled while still looking present. It was caught only because a probe
 * disagreed with what the code was supposed to do. Both halves are CLOSED vocabularies for the reason
 * A_80 §2 documents: an open `[a-z-]+` class matched "required to set" when this same shape was
 * written for the retry guard.
 */
const CLOCK_TIME_LITERAL =
  /\b(?:(?:a\s+)?(?:quarter|half|five|ten|fifteen|twenty|twenty-five|twenty-two|one|two|three|four|six|seven|eight|nine|eleven|twelve|forty|fifty|fifty-five)\s+(?:minutes?\s+)?(?:past|to)\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon)|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon)\s+o'clock|\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.|am|pm))\b/gi;

const clockTimeSource = CLOCK_TIME_LITERAL.source;

/**
 * A_80 F14 — how far a stated time sits from a mention of the fact's own event.
 *
 * The distinction this exists to draw: "The staff shift change occurred at a quarter past ten" TIMES
 * the fact, while "the kitchen bell rang at a quarter past ten … during the staff shift change"
 * merely MENTIONS it. Measured on the aborting case and two hand-built genuine contradictions, the
 * gap is 16 words for the mention and 3–4 for the real ones.
 *
 * THE THRESHOLD IS FIXTURE-BASED, NOT CORPUS-MEASURED, and that is a real limitation: clue text is
 * not persisted anywhere, so the population needed to baseline it the way A_80 §15.1 baselined F5
 * does not exist on disk. It is therefore set generously, and being wrong costs a WARNING rather
 * than an abort — the safe direction for a gate with one demonstrated false positive and no
 * demonstrated true positive.
 */
const MAX_ATTRIBUTION_GAP_WORDS = 8;

const timeAttributionGap = (factDesc: string, clueText: string): number => {
  const lower = String(clueText).toLowerCase();
  const words = lower.split(/\s+/);
  const descTokens = String(factDesc).toLowerCase().replace(/[^a-z0-9\s]+/g, " ").split(/\s+/).filter((w) => w.length > 2);
  if (descTokens.length === 0) return Infinity;
  const key = descTokens[descTokens.length - 1];

  const timeIdx: number[] = [];
  const re = new RegExp(clockTimeSource, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(lower)) !== null) timeIdx.push(lower.slice(0, m.index).split(/\s+/).length - 1);

  const mentionIdx: number[] = [];
  words.forEach((w, i) => {
    if (w.replace(/[^a-z0-9]/g, "") === key) mentionIdx.push(i);
  });

  let best = Infinity;
  for (const a of timeIdx) for (const b of mentionIdx) best = Math.min(best, Math.abs(a - b));
  return best;
};

const countClockTimeExpressions = (text: string): number => {
  const re = new RegExp(clockTimeSource, "gi");
  const seen = new Set((String(text).match(re) ?? []).map((m) => m.toLowerCase().replace(/\s+/g, " ").trim()));
  return seen.size;
};
