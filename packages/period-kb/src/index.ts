/**
 * @cml/period-kb — Period Knowledge Base + EraOracle + anachronism linter.
 *
 * Phase 0 of the Agent 1 redesign
 * (documentation/12_system_redesign/01_agent_1_era_setting.md §9.3).
 *
 * The bet: period facts are reference data, not creative work. This package is the
 * deterministic, versioned, year-keyed source of truth for "what was possible in year Y,
 * place P" — shared (later) across the pipeline as a fairness oracle. NOT yet wired into
 * any agent: it is pure, tested, and reversible.
 */

export const packageName = "@cml/period-kb";

// Oracle (binder + availability oracle)
export {
  KB_VERSION,
  DEFAULT_ARCHETYPE,
  bindEra,
  bindPlace,
  checkAvailability,
  isAvailable,
  pickNearestYear,
} from "./oracle.js";

// Loaders (for callers that already hold a resolved year/archetype)
export {
  loadEraEntry,
  loadPlaceEntry,
  listEraYears,
  listPlaceArchetypes,
  hasEraYear,
  hasPlaceArchetype,
} from "./loader.js";

// Anachronism linter (checker, not generator)
export { lint } from "./anachronism-linter.js";
export type { AnachronismViolation, LintResult, LintOptions } from "./anachronism-linter.js";

// Legacy projection (Phase 1/2 migration bridge)
export {
  decadeLabel,
  representativeYearForDecade,
  buildEraConstraintsForDecade,
  projectEraFields,
  buildEraConstraintsFromKb,
  projectLocationFields,
  buildLocationConstraintsFromKb,
} from "./legacy-projection.js";
export type { ProjectedEraFields, ProjectedLocationFields } from "./legacy-projection.js";

// Term resolution (shared availability primitive)
export { normalizeTerm, resolveTermAvailability, ANACHRONISM_SURFACE_TERMS } from "./internal.js";
export type { TermResolution } from "./internal.js";

// Types
export type {
  EraEntry,
  PlaceEntry,
  EraBinding,
  PlaceBinding,
  AvailabilityResult,
  BindOptions,
  ForensicCapability,
  ForensicStatus,
  CommunicationCapability,
  PolicingFacts,
  LightingFacts,
  TechnologyFacts,
  AccessPoint,
  ObservabilityEdge,
  IsolationFacts,
} from "./types.js";
