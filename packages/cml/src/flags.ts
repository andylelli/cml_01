/**
 * Owner decision 9 (2026-10-01, ORC-Q05) — ONE boolean-flag vocabulary.
 *
 * The code review counted eight: some reads accepted only "true", some only "1", one also "y"/"n", most
 * `1|true|yes|on` — so `AGENT7_STRUCTURED_OUTPUT=on` read as OFF. Now every converted read accepts
 * `1|true|yes|on` as on and `0|false|no|off` as off (case-insensitive, trimmed); anything else is warned
 * about once per flag and falls back to the flag's default. The raw value each run saw is recorded in the run's
 * flag record (CR-22), so the change is auditable run by run. Read at call time (ADR-0004).
 */
export const FLAG_ON_VALUES: readonly string[] = ["1", "true", "yes", "on"];
export const FLAG_OFF_VALUES: readonly string[] = ["0", "false", "no", "off"];

const warned = new Set<string>();

export function readBooleanFlag(name: string, defaultValue: boolean, env: Record<string, string | undefined> = process.env): boolean {
  const raw = String(env[name] ?? "").trim().toLowerCase();
  if (!raw) return defaultValue;
  if (FLAG_ON_VALUES.includes(raw)) return true;
  if (FLAG_OFF_VALUES.includes(raw)) return false;
  if (!warned.has(name)) {
    warned.add(name);
    console.warn(`[flags] ${name}=${JSON.stringify(env[name])} is not a recognised value (1|true|yes|on or 0|false|no|off); using its default (${defaultValue ? "on" : "off"}).`);
  }
  return defaultValue;
}

/**
 * Owner decision 12 (CR-07 / CR-29, 2026-10-01): ONE flag for the batch of verified-bug fixes that change a prompt or
 * a run outcome on the default path, so a single matched pair can read them together (OWNER-DECISIONS §12). Each
 * gated site names its ledger item; the list is documentation/code-review/DECISION-12.md. Default OFF: with it
 * unset every prompt and outcome is byte-identical (the replay fixtures pin this).
 */
export function verifiedFixesEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("CML_VERIFIED_FIXES", false, env);
}

/**
 * Owner decision 12, CR-28 deferrals (built 2026-10-02): token trims in the NON-prose prompts — Agent 5 (A5-16
 * static-first ordering, A5-10/A5-Q03 unread status/audit output dropped and each contract stated once, the two
 * first-attempt contract lines shipped on the first pass), Agent 3 (A34-14 required_evidence contract once, the
 * uniqueness seed after the static rules), Agent 2c / Agent 8 / Agent 2b (A1X-11 a, c, e). Default OFF: with it
 * unset every prompt is byte-identical. Each trim changes a prompt on every run, so the read is a paid probe.
 * Read at call time (ADR-0004).
 */
export function promptTrimsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("CML_PROMPT_TRIMS", false, env);
}

/**
 * A5-15 / A5-Q07 (owner: build the promotion now, read it later). ON: Agent 5's "Mandatory Clue Requirements"
 * checklist is a projection of `@cml/clue-spec`'s `deriveClueSpec(cml).clueSlots` — the deriver the worker runs
 * only in shadow — instead of `generateExplicitClueRequirements`. Measured over the 69 archived CMLs, the two
 * derivations agree on slot count in 7 and on per-step category in 379 of 566 slots, so ON changes the checklist
 * of every case. Default OFF: with it unset the prompt is byte-identical. Read at call time (ADR-0004).
 */
export function clueSpecChecklistEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("AGENT5_CLUE_SPEC_CHECKLIST", false, env);
}

/**
 * ANALYSIS_110 step 0 — the v2 contract's deterministic defects, one switch so one matched pair reads them together:
 * the victim never among the suspects to clear (D6); wit beats only where the humour map allows and carried by people
 * on the page (D4); no example lists in the custody, aftermath, exchange and clearance lines (D5); the culprit's
 * pre-reveal mask resolved to the person (P5); THE WORLD read from the real artifact shapes (W1); every relationship
 * pair, the detective's first (R2); the trait line out of the every-call bible and owned by one chapter (L1); the
 * Speech line cut to its first sentence (L4); two instruction lines that leaked reworded, and "chapter N" in
 * narration a finding (L8); `register_sentence` counted, not sent to the editor (A_110 §30.1). Default OFF: with it
 * unset every prompt is byte-identical. Read at call time (ADR-0004).
 */
export function contractFixesEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_CONTRACT_FIXES", false, env);
}

/**
 * ANALYSIS_110 step 1 — the opening the owner asked for: the place before anybody speaks (W2), a room described on
 * its first visit (W3), each person introduced where they first appear (P1), the death met by everybody present and
 * by the world outside (D1, D2), the long line of the second exchange capped (L3). Default OFF. Read at call time.
 */
export function openingEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_OPENING", false, env);
}

/**
 * ANALYSIS_110 M6 / WP-006 K14, K16 — the v2 draft selector ranks drafts on its own scale. MEASURED on the 20 logged
 * three-draft selections: the composite standardises on 49 v1 BOOKS but chooses between DRAFTS of one chapter, so the
 * written weights do not mean what they say (speech-opening share pulls 2.9, long sentences 2.8, register 2.2,
 * repetition 0.1), and no weight on repetition changes a single pick. ON: among the drafts with the fewest ranking
 * failures, each instrument ranks the drafts and the weighted ranks decide; register carries no weight (its slope
 * against the reads is zero since 1 September, WP-006 §3.2) and repetition none (it never moved a pick); a tie goes to
 * the draft that repeats the book so far least (L5). Default OFF. Read at call time (ADR-0004).
 */
export function selectorRanksEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_SELECTOR_RANKS", false, env);
}

/**
 * ANALYSIS_110 L6 — the body-part tail (", her gaze fixed", ", his hands steady") becomes an editor finding. MEASURED: it
 * ends 28.7% of run bcc0d637's narration sentences against 0.44% of the canon's, and the canon's WORST chapter holds at
 * most 3 in 95% of 162 books (WP-006 K9). ON: a chapter with four or more sends the editor every one after the first
 * three, each a deletion of the clause after the comma. Default OFF. Read at call time (ADR-0004).
 */
export function tailFindingEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_TAIL_FINDING", false, env);
}

/**
 * ANALYSIS_111 §5 (the V batch) — the v2 engine audit's fixes (WF-005: 37 defects demonstrated on the stored contracts,
 * the 2026-10-06 pair's drafts and edit lists). ON: the contract states the solution's facts in the right chapter
 * (the reveal's window, the crime window's order, decisive evidence before the test, the test and clearances on the
 * page, no body line after the reveal); the selector's book-level checks run against the book so far; the culprit
 * predicate needs a person as the deed's object; the editor's guards compare sets and register HITS, each guard on its
 * own. Default OFF. Read at call time (ADR-0004).
 */
export function auditFixesEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_AUDIT_FIXES", false, env);
}

/**
 * ANALYSIS_110 N9 + M9 (IMPLEMENTATION PLAN 0.2) — the schedule of the evidence. MEASURED over 64 stored contracts: the
 * reader model has the culprit as favourite by chapter 6 in 64 of 64 (by chapter 4 in 52) against a test in chapter 8
 * in 57, and no single clue is necessary to the proof (WP-007 §2.2, §5.1). ON: a clue that implicates a culprit shows
 * its fact where it is scheduled and its conclusion only from the test chapter; evidence is placed to keep the busiest
 * chapter's load down, every clue before its use. Default OFF. Read at call time (ADR-0004).
 */
export function scheduleEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_SCHEDULE", false, env);
}

/**
 * A_111 F-1 — the red herrings, scheduled. MEASURED: 40 of 40 distinct stored CMLs carry `red_herrings` with an
 * `innocent_explanation` (80 in all) and the v2 contract gives none a chapter — they sit in the bible, identical in
 * every chapter. Arm D of seed 82094 put neither the herring nor its explanation on the page; the writer improvised a
 * suspect handling the weapon and the reader (89) named the muddle as the book's first fix. ON: each herring is noticed
 * in one chapter after the crime and explained in a later one no later than the reveal. Default OFF. Read at call time
 * (ADR-0004).
 */
export function herringsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_HERRINGS", false, env);
}

/**
 * ANALYSIS_110 N11 (Part V §38.3) — position in the prompt. MEASURED on run bcc0d637: the craft block sits at 70–89% of
 * the chapter-1 prompt and 19–24% of the chapter-10 prompt, because the book so far accumulates after it. ON: THE BOOK
 * SO FAR precedes the craft block and the chapter's contract, so the operations ride next to the format rules in every
 * call; chapter 1 (an empty book so far) is unchanged. Default OFF. Read at call time (ADR-0004).
 */
export function bookFirstEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_BOOK_FIRST", false, env);
}

/**
 * ANALYSIS_110 N8 (Part V §38.1) — the touch rule. MEASURED: after the v2 brief asked for "a thing somebody could touch"
 * in every paragraph, *hands*, *hand* and *set* rose 1.6–2.4 z on the canon profile while the words it does not name
 * stayed flat (WP-007 §4.2). ON: the rule is asked of one paragraph per chapter. Default OFF. Read at call time.
 */
export function touchOnceEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_TOUCH_ONCE", false, env);
}

/**
 * ANALYSIS_110 N12 (Part V §40) — presence penalty for the v2 writer. Lexical diversity of GPT-class models rises with
 * presence penalty (Martínez et al., ACM TIST 2024); our client has never sent it. The value, 0 to 2; unset, empty or
 * unparseable is "not sent", so the request is byte-identical. Read at call time (ADR-0004).
 */
export function presencePenaltyOf(env: Record<string, string | undefined> = process.env): number | undefined {
  const raw = (env.PROSE_V2_PRESENCE_PENALTY ?? "").trim();
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 && value <= 2 ? value : undefined;
}

/**
 * ANALYSIS_110 M8 (Part III §25.2) — keyness-ranked editor findings: the book's four-word phrases most over-represented
 * against the canon (Dunning's log-likelihood), ranked, so the editor cuts the worst repetition first with no word list.
 * Default OFF. Read at call time (ADR-0004).
 */
export function keynessFindingEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROSE_V2_KEYNESS_FINDING", false, env);
}

/**
 * ANALYSIS_110 step 2 — upstream, for a fresh run: the Gathering scene has the victim alive (P3), Agent 7 prefers the
 * profiled places and Agent 2c is seeded from where the clues are (W4), Agent 2b writes `appearance` and `whyHere`
 * (P2) and no longer folds humour into `speechMannerisms` (L4), and Agent 2's cast passes a name check (P4). One flag,
 * so one fresh pair reads the step. Default OFF. Read at call time (ADR-0004).
 */
export function a110UpstreamEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("CML_A110_UPSTREAM", false, env);
}

/**
 * ANALYSIS_110 0.6b — example places and names removed from the prompts. MEASURED: Agent 3's 'e.g., "Little Middleton,
 * Yorkshire"' is a place in 18 of 72 stored cases and a person in none; the case-noun guard lists eleven such
 * specimens in Agent 2, 2c, 2d and 3. ON: each specimen is replaced by the operation it illustrated. Default OFF.
 */
export function promptSpecimenTrimsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return readBooleanFlag("PROMPT_SPECIMEN_TRIMS", false, env);
}
