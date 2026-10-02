/**
 * The PURE locked-fact registry logic (A34-03): wording normalisation of a locked value, and the shape
 * test for a device's single implied interval. No ctx, no I/O — the worker's
 * `apps/worker/src/jobs/agents/agent3b/locked-fact-registry.ts` builds the registry, pushes the
 * warnings and writes the artifact, and re-exports these from its old path.
 *
 * Moved verbatim (code review A34-03, R1). `numberToWordsSmall` is NOT unified with
 * `spellMinuteCount` (timeline-deception.ts): they differ on 0 ("zero" vs null) and on 100..999
 * (the digits vs null), pinned by `apps/worker/src/__tests__/r1-locked-facts-move.test.ts`.
 */

// A_53 P6 (lockedfact-digit-form-not-repaired): convert digit/metric values in a locked-fact value to
// era word-form at REGISTRY BUILD, so the enforced ground truth matches era-word prose (a digit value
// like "10:50 PM" never substring-matches "ten-fifty" prose → permanent false warning + Agent 9 told
// to inject the era-violating digits). Holistic + parameter-free: pure number→word conversion.
export const numberToWordsSmall = (n: number): string => {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 0 || n >= 100) return String(n); // leave large/negative numbers as-is
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
};

export const wordifyLockedFactValue = (value: string): string => {
  let out = value;
  // Clock times: "10:50 PM", "10:50 p.m.", "10:50" → "ten-fifty" / "ten o'clock" (era word-form;
  // surrounding prose carries the meridiem, which the canonical value omits).
  out = out.replace(/\b(\d{1,2}):(\d{2})\s*(?:a\.?m\.?|p\.?m\.?)?/gi, (_m, h: string, min: string) => {
    const hour = parseInt(h, 10);
    const minute = parseInt(min, 10);
    if (hour > 23 || minute > 59) return _m;
    const hour12 = ((hour + 11) % 12) + 1;
    const hourWord = numberToWordsSmall(hour12);
    return minute === 0 ? `${hourWord} o'clock` : `${hourWord}-${numberToWordsSmall(minute)}`;
  });
  // Standalone small number before a measurement word: "4 metres" → "four metres".
  out = out.replace(/\b(\d{1,2})\b(?=\s+[a-zA-Z])/g, (_m, d: string) => numberToWordsSmall(parseInt(d, 10)));
  return out;
};

/**
 * A_72 C1 — the article belongs to the SENTENCE, never to the locked value.
 *
 * ── WHAT THIS COST, MEASURED ─────────────────────────────────────────────────────────────────────
 *
 * The 2026-08-23 run registered two locked times side by side:
 *
 *     high_tide_time        "ten minutes past eleven"
 *     weapon_release_time   "a quarter past eleven"     <- the article is INSIDE the value
 *
 * Both reach Agent 9 under a HARD verbatim contract — *"reproduce those exact words"*. They are not
 * parallel, so the model regularises them, and the shipped manuscript says **"a ten minutes past
 * eleven" about ten times**, including the line the external reader quoted back:
 *
 *     "By then it was a ten minutes past eleven. It had taken fifteen minutes in all.
 *      By then it was a ten minutes past eleven."
 *
 * That read scored `prose` **6/10** — the lowest of its ten categories and the drag on the whole book
 * (A_72 §5). The reader's own forecast for fixing this class was **86-89** against an actual 81.
 *
 * ── WHY AT REGISTRATION, AND ONLY HERE ───────────────────────────────────────────────────────────
 *
 * `wordifyLockedFactValue` above already establishes the principle: the registry is where a value is
 * made canonical, because every downstream consumer — the prose contract, the validator's substring
 * match, the artifact on disk — reads the same string. Stripping the article in a prompt would leave
 * the validator hunting for a form nobody was told to write.
 *
 * ── DELIBERATELY NARROW ──────────────────────────────────────────────────────────────────────────
 *
 * Only a leading `a` / `an` / `the`, and only when what follows still carries the value. A locked fact
 * whose whole value is an article is left alone rather than emptied, and nothing inside the phrase is
 * touched: "half past ten" keeps its shape, "the ledger for the second week" loses only its first word.
 * Grammar is not corrected and words are not reordered — this removes one leading token or does
 * nothing, so it cannot invent a value the device never declared.
 */
const LEADING_ARTICLE_RE = /^(?:a|an|the)\s+(?=\S)/i;

export const stripLeadingArticleFromLockedValue = (value: string): string => {
  const trimmed = value.trim();
  const stripped = trimmed.replace(LEADING_ARTICLE_RE, "");
  // Never empty a fact, and never return something so short it stops being a usable anchor.
  return stripped.trim().length >= 2 ? stripped.trim() : trimmed;
};

/**
 * The single unambiguous implied derivation in a device: exactly two clocks and exactly one duration.
 * Returns the duration fact's id, or null when the shape is anything else.
 *
 * Exported for the test, which asserts the ambiguous shapes are refused rather than guessed at.
 */
export const impliedIntervalFactId = (
  facts: ReadonlyArray<{ id?: unknown; value?: unknown; derivedFrom?: unknown }>,
  parseClock: (v: string) => number | null,
  parseDuration: (v: string) => number | null,
): string | null => {
  const clocks: string[] = [];
  const durations: string[] = [];
  for (const f of facts) {
    const value = String(f?.value ?? "").trim();
    const id = String(f?.id ?? "").trim();
    if (!value || !id) continue;
    if (parseDuration(value) !== null) { durations.push(id); continue; }
    if (parseClock(value) !== null) clocks.push(id);
  }
  if (clocks.length !== 2 || durations.length !== 1) return null;
  return durations[0]!;
};
