/**
 * Period KB — type definitions.
 *
 * These mirror the strict YAML schemas in `schema/`. The schemas are the runtime
 * source of truth (validated by ajv at load time); these types are the compile-time
 * mirror. `kb-data.test.ts` guarantees they stay in agreement by validating every
 * data file against the schema.
 */

export type ForensicStatus =
  | "routine"
  | "established"
  | "basic"
  | "emerging"
  | "typing_only"
  | "nonexistent";

export interface ForensicCapability {
  status: ForensicStatus;
  caveat?: string;
  note?: string;
  detectable?: string[];
  blind_to?: string[];
}

export interface CommunicationCapability {
  status?: string;
  availability?: string;
  caveat?: string;
  note?: string;
  latency_hours?: number;
  latency_days?: number;
}

export interface PolicingFacts {
  forensic_labs: string;
  amateur_detective_plausible: boolean;
  formal_rights_caution: boolean;
  national_database: string;
  note?: string;
}

export interface LightingFacts {
  domestic: string[];
  absent: string[];
}

export interface TechnologyFacts {
  present: string[];
  absent: string[];
}

/** A single year anchor in the knowledge base. */
export interface EraEntry {
  year: number;
  label: string;
  forensics: Record<string, ForensicCapability>;
  communication: Record<string, CommunicationCapability>;
  policing: PolicingFacts;
  transport: Record<string, string>;
  lighting: LightingFacts;
  technology: TechnologyFacts;
  /** Named means/technologies that must NOT appear as available in this year. */
  not_yet_invented: string[];
  social_norms: string[];
  sources: string[];
}

export interface AccessPoint {
  id: string;
  kind: string;
  control: string;
}

export interface ObservabilityEdge {
  from: string;
  sees: string[];
}

export interface IsolationFacts {
  profile: "low" | "moderate" | "high" | "extreme";
  summary: string;
  outside_help_latency_hours?: number;
}

/** A single location archetype in the knowledge base. */
export interface PlaceEntry {
  archetype: string;
  display_name: string;
  isolation: IsolationFacts;
  access_points: AccessPoint[];
  observability: ObservabilityEdge[];
  key_areas: string[];
  movement_constraints: string[];
  social_rules: string[];
  typical_summary: string;
  sources: string[];
}

/** Result of binding an era — carries provenance and any nearest-anchor fallback. */
export interface EraBinding {
  entry: EraEntry;
  requestedYear: number;
  resolvedYear: number;
  /** true when an exact `<year>.yaml` existed; false when a nearest anchor was used. */
  exact: boolean;
  fallback?: {
    reason: string;
    distanceYears: number;
  };
  /** e.g. "kb:v0.1.0/1931" */
  provenance: string;
}

/** Result of binding a place archetype. */
export interface PlaceBinding {
  entry: PlaceEntry;
  requestedArchetype: string;
  resolvedArchetype: string;
  exact: boolean;
  fallback?: {
    reason: string;
  };
  /** e.g. "kb:v0.1.0/country_manor" */
  provenance: string;
}

/** Whether a named means/technology was available in a given year. */
export interface AvailabilityResult {
  term: string;
  normalizedTerm: string;
  year: number;
  resolvedYear: number;
  /** true = available; false = absent; "unknown" = not represented in the KB. */
  available: boolean | "unknown";
  basis: string;
  caveat?: string;
}

export interface BindOptions {
  /** Sink for nearest-anchor / fallback warnings. Defaults to console.warn. */
  onWarn?: (message: string) => void;
}
