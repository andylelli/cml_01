/**
 * Agent 6 — Reveal Gate (ANALYSIS_50 P2.1, flag AGENT6_REVEAL_GATE, default OFF).
 *
 * Three deterministic-or-cheap fair-play checks that the legacy auditor never made:
 *   - T2.1 "fooled-then-convinced": a reader who names the true culprit from early+mid
 *          clues alone is too obvious. (The "convinced" stage — full-clue solvability — is
 *          already enforced by the legacy blind-reader gate; this adds the "fooled" stage.)
 *   - T2.2 herring → culprit: fail if any red herring's `points_at_suspect` is the real culprit.
 *   - T2.3 manner-of-death deducibility: at least one essential early|mid clue must surface the
 *          death-method, distinct from the concealment mechanism.
 *
 * Everything here is pure (no LLM, no IO) and unit-tested; the runner supplies the early+mid
 * blind-reader guess and decides shadow (warn) vs enforce (block, never throw).
 */

import type { CaseData } from "@cml/cml";
// A_53 P4 (Pattern D): the word-boundary/surname matcher lives in a shared module now; re-exported
// here for this file's existing importers.
import { namesMatch } from "./identity-match.js";
export { namesMatch } from "./identity-match.js";

export type RevealGateMode = "off" | "shadow" | "enforce";

/**
 * Mirror of AGENT2B_VOICE_CHECK parsing: empty/off/false/0/unknown-falsey → off,
 * "enforce" → enforce, any other non-empty truthy value → shadow.
 */
export const parseRevealGateMode = (raw: string | undefined): RevealGateMode => {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v || v === "off" || v === "false" || v === "0") return "off";
  if (v === "enforce") return "enforce";
  return "shadow";
};

const caseOf = (cml: CaseData | undefined | null): any => (cml as any)?.CASE ?? cml ?? {};

const culpritsOf = (cml: CaseData | undefined | null): string[] =>
  (Array.isArray(caseOf(cml)?.culpability?.culprits) ? caseOf(cml).culpability.culprits : [])
    .map((c: unknown) => String(c ?? "").trim())
    .filter(Boolean);

// ── T2.2 — red herring points at the real culprit ───────────────────────────

export interface HerringTargetOffender {
  id: string;
  pointsAtSuspect: string;
}

export interface HerringTargetAuditResult {
  ok: boolean;
  offenders: HerringTargetOffender[];
}

/**
 * Reads CASE.red_herrings[].points_at_suspect (the canonical CML field — NOT the runtime
 * ctx.clues.redHerrings, which has no such field) and fails if any herring targets a culprit.
 */
export const auditRedHerringTargets = (cml: CaseData | undefined | null): HerringTargetAuditResult => {
  const culprits = culpritsOf(cml);
  const herrings = Array.isArray(caseOf(cml)?.red_herrings) ? caseOf(cml).red_herrings : [];
  const offenders: HerringTargetOffender[] = [];
  for (const rh of herrings) {
    const target = String(rh?.points_at_suspect ?? "").trim();
    if (!target) continue;
    if (culprits.some((c) => namesMatch(c, target))) {
      offenders.push({ id: String(rh?.id ?? "(unnamed)").trim() || "(unnamed)", pointsAtSuspect: target });
    }
  }
  return { ok: offenders.length === 0, offenders };
};

// ── T2.3 — manner-of-death deducibility ─────────────────────────────────────

const DEATH_TOKEN_STOPWORDS = new Set([
  "with", "from", "into", "that", "this", "death", "dying", "died", "murder", "murdered",
  "killed", "killing", "victim", "method", "cause", "manner", "means", "fatal", "fatally",
]);

/**
 * Curated death-method → synonym-stem map (mirrors `resolveDeathMethodTokens` in
 * packages/rubric-score/src/facts.ts; kept local to avoid a worker→rubric-score dependency). This
 * fixes both the false negatives (a "stabbing" deduced via "knife") and the false positives that a
 * blind 4-char-prefix match produced ("gunshot"→"guns" matching "the guns were locked away"). NB:
 * "wound" is deliberately excluded — it collides with the past tense of "wind" (clock tampering).
 */
const DEATH_METHOD_TOKENS: Array<[RegExp, string[]]> = [
  [/stab|knif|blade/i, ["stab", "blade", "knife", "dagger"]],
  [/shoot|shot|gun|firearm|pistol|revolver/i, ["shot", "gunshot", "bullet", "firearm", "pistol"]],
  [/strangl|garrot|throttl/i, ["strangl", "throttl", "garrot"]],
  [/poison|arsenic|cyanide|toxin/i, ["poison", "arsenic", "cyanide", "toxin"]],
  [/bludgeon|blunt|cudgel/i, ["bludgeon", "blunt", "blow"]],
  [/drown/i, ["drown"]],
  [/smother|suffocat|asphyxiat/i, ["smother", "suffocat", "asphyxiat"]],
  [/electrocut/i, ["electrocut"]],
  [/burn|arson/i, ["burn"]],
];

/** Resolve the death-method string: CASE.death_method → crime_class.subtype → category. */
export const resolveDeathMethodString = (cml: CaseData | undefined | null): string => {
  const caseBlock = caseOf(cml);
  const direct = String(caseBlock?.death_method ?? "").trim();
  if (direct) return direct;
  const cc = caseBlock?.meta?.crime_class ?? {};
  return String(cc?.subtype ?? cc?.category ?? "").trim();
};

/** Curated synonym stems for the death method; falls back to significant literal words (>3 chars). */
export const deathMethodTokens = (deathMethod: string): string[] => {
  const text = String(deathMethod ?? "");
  for (const [re, tokens] of DEATH_METHOD_TOKENS) if (re.test(text)) return tokens;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    const t = raw.trim();
    if (t.length < 4 || DEATH_TOKEN_STOPWORDS.has(t) || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
};

export interface DeathMethodClue {
  placement?: string;
  criticality?: string;
  description?: string;
  observable?: string;
  pointsTo?: string;
}

export interface DeathMethodAuditResult {
  ok: boolean;
  deathMethod: string;
  tokens: string[];
  reason: string;
}

/**
 * A death method is "deducible" when at least one essential early|mid clue surfaces one of its
 * tokens (matched on a 4-char prefix so "poisoning"↔"poisoned", "stabbing"↔"stabbed" align), and
 * that token is not merely the concealment mechanism. Advisory by nature; the runner decides
 * whether to warn (shadow) or block (enforce). Returns ok=true when there is nothing to verify.
 */
export const auditDeathMethodDeducibility = (
  cml: CaseData | undefined | null,
  clues: { clues?: DeathMethodClue[] } | undefined | null,
): DeathMethodAuditResult => {
  const deathMethod = resolveDeathMethodString(cml);
  const tokens = deathMethodTokens(deathMethod);
  if (tokens.length === 0) {
    return { ok: true, deathMethod, tokens, reason: "no resolvable death method to verify" };
  }
  const clueList = Array.isArray(clues?.clues) ? clues!.clues! : [];
  const deducible = clueList.some((c) => {
    if (c?.criticality !== "essential") return false;
    if (c?.placement !== "early" && c?.placement !== "mid") return false;
    const text = `${c?.description ?? ""} ${c?.observable ?? ""} ${c?.pointsTo ?? ""}`.toLowerCase();
    // A_53 P5 (reveal-gate-death-method-token-prefix-false-positive): word-boundary match so a short
    // fallback token like "fall" no longer matches "befall"/"fallen leaves" and falsely reports the
    // manner of death as reader-deducible.
    return tokens.some((t) => {
      const tok = String(t ?? "").trim();
      if (!tok) return false;
      return new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
    });
  });
  return {
    ok: deducible,
    deathMethod,
    tokens,
    reason: deducible
      ? "death method is deducible from an essential early|mid clue"
      : `no essential early|mid clue surfaces the death method (${tokens.join(", ")})`,
  };
};

// ── T2.1 — fooled-then-convinced verdict ────────────────────────────────────

export interface RevealVerdictInput {
  /** What an early+mid-only blind reader guessed. */
  earlyMidGuess: string;
  /** The true culprit. */
  culprit: string;
  /** Optional: the intended false-solution suspect (CASE.false_solution.accused_suspect). */
  falseSolutionSuspect?: string;
}

export interface RevealVerdict {
  verdict: "pass" | "too_obvious";
  reasons: string[];
}

/**
 * Fail ("too_obvious") when an early+mid-only reader already names the true culprit. The
 * full-clue "convinced" stage stays the legacy gate's job, so this verdict is intentionally
 * one-sided: it only catches reveals that arrive too early.
 */
export const evaluateRevealVerdict = (input: RevealVerdictInput): RevealVerdict => {
  const reasons: string[] = [];
  if (namesMatch(input.earlyMidGuess, input.culprit)) {
    reasons.push(
      `Blind reader named the true culprit "${input.culprit}" from early+mid clues alone ` +
        `(guessed "${input.earlyMidGuess}") — the reveal is too obvious.`,
    );
    return { verdict: "too_obvious", reasons };
  }
  if (
    input.falseSolutionSuspect &&
    !namesMatch(input.earlyMidGuess, input.falseSolutionSuspect)
  ) {
    // Informational only: being misled toward something other than the intended false solution
    // is still acceptable misdirection, so this never fails the gate.
    reasons.push(
      `Blind reader was misled toward "${input.earlyMidGuess}" rather than the intended ` +
        `false solution "${input.falseSolutionSuspect}".`,
    );
  }
  return { verdict: "pass", reasons };
};
