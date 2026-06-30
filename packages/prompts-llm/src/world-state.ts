/**
 * A_57 §9.1 — the Story World-State ledger.
 *
 * The coherence root cause (ANALYSIS_57 §9): every fact the prose references is surfaced *independently*
 * and *restated*, so each restatement is a fresh chance to drift — the staged time vs the true time, the
 * clue weather vs the atmosphere weather, a character's gender vs their pronouns. Coherence cannot be a
 * property the prose is asked to maintain across ten chapters; it must be a property of the DATA the prose
 * draws from.
 *
 * This module builds ONE canonical, typed, cross-checked world-state object after Agents 3/7, and runs a
 * contradiction gate over it BEFORE prose. It unifies the three deterministic A_57 contracts in one place
 * instead of three scattered patches:
 *   - D1 (atomic vs descriptive locked facts)  → `facts[].type`
 *   - D2 (the single staged/true contradiction) → `contradiction`
 *   - D3 (mechanism vs environment)             → `environment`
 *   - identity (name, gender, role — the substrate of D5 pronoun coherence) → `characters`
 *
 * It is a READ-MODEL + gate: it reuses the already-tested `isAtomicLockedFactValue`,
 * `findDiscriminatingContradictionPair`, and `checkMechanismEnvironmentConsistency`, and reports conflicts
 * for repair-at-source. Migrating every Agent 9 obligation to *draw from* this object (so nothing is
 * re-derived) is the follow-up (§9.5 clause 2); this lands the structure and the gate.
 */

import { isAtomicLockedFactValue, findDiscriminatingContradictionPair } from "./agent9-prose/prompt-builder.js";
import type { DiscriminatingContradictionPair } from "./agent9-prose/prompt-builder.js";
import { checkMechanismEnvironmentConsistency } from "./mechanism-environment.js";
import type { DeviceLike, AtmosphereLike, MechanismEnvironmentCheck } from "./mechanism-environment.js";

export type CharacterGender = "male" | "female" | "unknown";

export interface WorldStateFact {
  id?: string;
  description: string;
  value: string;
  /** D1 — atomic (time/number/measurement → verbatim) vs descriptive (clause/log → paraphrasable). */
  type: "atomic" | "descriptive";
}

export interface WorldStateCharacter {
  name: string;
  gender: CharacterGender;
  role: string;
}

export interface StoryWorldState {
  /** D1 — every locked fact, typed by shape. */
  facts: WorldStateFact[];
  /** D2 — the single staged/true contradiction pair, or null when there isn't an unambiguous one. */
  contradiction: DiscriminatingContradictionPair | null;
  /** D3 — the mechanism's environmental precondition checked against the setting weather. */
  environment: MechanismEnvironmentCheck;
  /** identity substrate (D5) — a character is a first-class fact, like a time or a location. */
  characters: WorldStateCharacter[];
  victim: string | null;
  culprits: string[];
}

export type WorldStateConflictKind =
  | "culprit_is_victim"
  | "mechanism_environment"
  | "character_missing_gender"
  | "duplicate_character";

export interface WorldStateConflict {
  kind: WorldStateConflictKind;
  detail: string;
}

export interface ContradictionGateResult {
  ok: boolean;
  conflicts: WorldStateConflict[];
}

export interface WorldStateInputs {
  lockedFacts?: ReadonlyArray<{ id?: string; description?: string; value?: string }>;
  /** primary hard-logic device (devices[0]) */
  device?: DeviceLike | null;
  /** setting atmosphere (weather / timeOfDay / season) */
  atmosphere?: AtmosphereLike | null;
  cast?: ReadonlyArray<{ name?: string; gender?: string; role?: string; role_archetype?: string }>;
  victim?: string | null;
  culprits?: ReadonlyArray<string>;
}

const norm = (s: unknown): string => String(s ?? "").trim().toLowerCase();

const parseGender = (g: unknown): CharacterGender => {
  const v = norm(g);
  if (v === "male" || v === "m" || v === "man") return "male";
  if (v === "female" || v === "f" || v === "woman") return "female";
  return "unknown";
};

/** Build the canonical world-state from the upstream artifacts. Pure; null-safe. */
export function buildStoryWorldState(inputs: WorldStateInputs): StoryWorldState {
  const lockedFacts = Array.isArray(inputs.lockedFacts) ? inputs.lockedFacts : [];
  const facts: WorldStateFact[] = lockedFacts
    .map((f) => ({
      id: f?.id,
      description: String(f?.description ?? "").trim(),
      value: String(f?.value ?? "").trim(),
      type: (isAtomicLockedFactValue(String(f?.value ?? "")) ? "atomic" : "descriptive") as "atomic" | "descriptive",
    }))
    .filter((f) => f.value.length > 0);

  const characters: WorldStateCharacter[] = (Array.isArray(inputs.cast) ? inputs.cast : [])
    .map((c) => ({
      name: String(c?.name ?? "").trim(),
      gender: parseGender(c?.gender),
      role: String(c?.role_archetype ?? c?.role ?? "").trim(),
    }))
    .filter((c) => c.name.length > 0);

  return {
    facts,
    contradiction: findDiscriminatingContradictionPair(lockedFacts),
    environment: checkMechanismEnvironmentConsistency(inputs.device, inputs.atmosphere),
    characters,
    victim: inputs.victim ? String(inputs.victim).trim() : null,
    culprits: (Array.isArray(inputs.culprits) ? inputs.culprits : []).map((c) => String(c).trim()).filter(Boolean),
  };
}

/**
 * Run the contradiction gate over a world-state. Reports deterministic, repair-at-source conflicts:
 *  - the culprit IS the named victim (an invalid culpability assignment);
 *  - the mechanism's environmental precondition contradicts the setting weather (D3);
 *  - a named character has no resolvable gender (pronouns cannot be locked → D5 drift waiting to happen);
 *  - two cast members share a canonical name (identity collision).
 * Conservative: a `null` discriminating contradiction is NOT a conflict (not every mystery has a
 * staged/true pair), mirroring the deliberate D2-detector deferral.
 */
export function runContradictionGate(ws: StoryWorldState): ContradictionGateResult {
  const conflicts: WorldStateConflict[] = [];

  if (ws.victim) {
    const victimKey = norm(ws.victim);
    for (const culprit of ws.culprits) {
      if (norm(culprit) === victimKey) {
        conflicts.push({
          kind: "culprit_is_victim",
          detail: `the culprit "${culprit}" is the named victim — the culpability assignment is invalid`,
        });
      }
    }
  }

  if (ws.environment.conflict) {
    conflicts.push({
      kind: "mechanism_environment",
      detail:
        `the mechanism requires ${ws.environment.precondition?.factor} but the setting is ` +
        `"${ws.environment.ambient}" (note "${ws.environment.conflictTerm}")`,
    });
  }

  for (const c of ws.characters) {
    if (c.gender === "unknown") {
      conflicts.push({
        kind: "character_missing_gender",
        detail: `character "${c.name}" has no resolvable gender — pronouns cannot be locked`,
      });
    }
  }

  const seen = new Map<string, number>();
  for (const c of ws.characters) {
    const key = norm(c.name);
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  for (const [key, count] of seen) {
    if (count > 1) {
      conflicts.push({
        kind: "duplicate_character",
        detail: `${count} cast members share the canonical name "${key}"`,
      });
    }
  }

  return { ok: conflicts.length === 0, conflicts };
}
