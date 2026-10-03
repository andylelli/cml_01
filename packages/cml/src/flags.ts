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
