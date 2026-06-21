/**
 * Device library — type definitions (mirror of schema/device_library.schema.yaml).
 *
 * A "pattern" is a curated, era-annotated hard-logic mechanism the 3b step retrieves and
 * recombines from (Agent 3b redesign §4.1). The schema is the runtime source of truth (ajv-
 * validated at load); these types are the compile-time mirror, kept honest by the data test.
 */

export type MechanismFamily = "timing" | "spatial_routing" | "identity" | "behavioral" | "authority";

export type CmlAxis = "temporal" | "spatial" | "identity" | "behavioral" | "authority";

export type PrincipleType = "physical_law" | "math" | "cognitive_bias" | "social_logic";

export interface PatternFeasibility {
  /** Decades the pattern is plausible in (e.g. [1900, 1910, 1920, 1930]). */
  eras: number[];
  /** Place archetypes it fits (optional; empty = any). */
  places?: string[];
  /** Capabilities the mechanism NEEDS — every one must be available in the era. */
  requires: string[];
  /** Capabilities whose PRESENCE in the era would defeat the trick (e.g. voice authentication). */
  forbids: string[];
}

export interface PatternUsage {
  run_id: string;
  novelty_variation?: string;
}

export interface DevicePattern {
  pattern_id: string;
  title: string;
  family: MechanismFamily;
  axes: CmlAxis[];
  principle: string;
  principleType: PrincipleType;
  surface_illusion_template: string;
  underlying_reality_template: string;
  feasibility: PatternFeasibility;
  /** The kinds of observable trace the device leaves (Agent 5's clue contract). */
  clue_archetypes: string[];
  sources: string[];
  usage_log?: PatternUsage[];
}

// ── retrieval ────────────────────────────────────────────────────────────────

export interface RetrievalQuery {
  /** Run decade (e.g. 1930). Year inputs are rounded down to the decade. */
  decade: number;
  primaryAxis: CmlAxis;
  /** Restrict to these mechanism families; empty/omitted = any family. */
  mechanismFamilies?: MechanismFamily[];
  /** Restrict to patterns that fit this place archetype (optional). */
  place?: string;
}

export interface RankedPattern {
  pattern: DevicePattern;
  /** 1 = never used (most novel); decreases with usage_log length. */
  noveltyScore: number;
  matchedFamily: boolean;
  matchedAxis: boolean;
}

// ── feasibility ──────────────────────────────────────────────────────────────

/** The era-capability oracle (Agent 1 / period-kb is the intended real one). */
export interface EraCapabilityOracle {
  isAvailable(capability: string): boolean;
}

export interface FeasibilityResult {
  feasible: boolean;
  /** Required capabilities the era does NOT provide (anachronistic dependency). */
  missingRequires: string[];
  /** Forbidden capabilities the era DOES provide (the era defeats the trick). */
  defeatedByEra: string[];
  /** A capability listed in both requires and forbids (malformed pattern). */
  internalConflicts: string[];
  reason: string;
}
