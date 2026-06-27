/**
 * Agent 2c — Location distinctness + crime-scene gates (ANALYSIS_50 P2.3).
 *
 *  - T2.8: two locations must not share a sensory identity. We flag any pair whose normalized
 *          sensory-atom sets overlap by more than a threshold (Jaccard > 0.5) or that share an
 *          identical primary mood. (scoreSensoryRichness counting words is the separate T3.3 item.)
 *  - T2.7: at least one keyLocation must be profiled as the crime scene, so Agent 9 has a sensory
 *          bible for the murder room (the real run profiled a Library while the murder was in a Study).
 *
 * Pure and never-throws; the runner decides shadow (warn) vs enforce (regenerate with feedback).
 */

import type { LocationProfilesResult, KeyLocation } from "./agent2c-location-profiles.js";

export type SceneGateMode = "off" | "shadow" | "enforce";

/** Mirror of the AGENT2B_VOICE_CHECK / AGENT6_REVEAL_GATE parsing. Default OFF. */
export const parseSceneGateMode = (raw: string | undefined): SceneGateMode => {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v || v === "off" || v === "false" || v === "0") return "off";
  if (v === "enforce") return "enforce";
  return "shadow";
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isNonEmptyString) : [];

const normAtom = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Normalized set of sensory atoms for a location (sights ∪ sounds ∪ smells ∪ tactile). */
export const locationAtomSet = (loc: KeyLocation | undefined | null): Set<string> => {
  const sensory = ((loc as any)?.sensoryDetails ?? {}) as Record<string, unknown>;
  const atoms = [
    ...asStringArray(sensory.sights),
    ...asStringArray(sensory.sounds),
    ...asStringArray(sensory.smells),
    ...asStringArray(sensory.tactile),
  ]
    .map(normAtom)
    .filter(Boolean);
  return new Set(atoms);
};

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
};

/** A location's primary mood: first sensory variant's mood (the only per-location mood signal). */
const primaryMood = (loc: KeyLocation | undefined | null): string => {
  const variants = Array.isArray((loc as any)?.sensoryVariants) ? (loc as any).sensoryVariants : [];
  for (const v of variants) {
    const m = normAtom(String(v?.mood ?? ""));
    if (m) return m;
  }
  return "";
};

const labelOf = (loc: KeyLocation | undefined | null, index: number): string =>
  isNonEmptyString((loc as any)?.name)
    ? (loc as any).name.trim()
    : isNonEmptyString((loc as any)?.id)
      ? (loc as any).id.trim()
      : `location_${index}`;

export interface LocationDistinctnessIssue {
  a: string;
  b: string;
  kind: "atom_overlap" | "shared_mood";
  detail: string;
}

export interface LocationDistinctnessResult {
  ok: boolean;
  issues: LocationDistinctnessIssue[];
}

/**
 * Flag any location pair that is too similar: Jaccard atom overlap > threshold (default 0.5) or an
 * identical primary mood. Locations with no atoms at all are skipped for overlap (handled elsewhere).
 */
export const checkLocationDistinctness = (
  profiles: LocationProfilesResult | undefined | null,
  opts?: { overlapThreshold?: number; ignoreAtoms?: Iterable<string> },
): LocationDistinctnessResult => {
  const threshold = opts?.overlapThreshold ?? 0.5;
  // Deterministic fallback atoms (injected identically into every sparse room by the worker's
  // enforceLocationSensoryFallbacks) must NOT count as evidence of similarity — otherwise two
  // genuinely-distinct sparse rooms collide and the enforce loop can never converge.
  const ignore = new Set([...(opts?.ignoreAtoms ?? [])].map(normAtom).filter(Boolean));
  const locations = Array.isArray(profiles?.keyLocations) ? profiles!.keyLocations : [];
  const prepared = locations.map((loc, i) => {
    const atoms = locationAtomSet(loc);
    for (const a of ignore) atoms.delete(a);
    return { label: labelOf(loc, i), atoms, mood: primaryMood(loc) };
  });
  const issues: LocationDistinctnessIssue[] = [];
  for (let i = 0; i < prepared.length; i++) {
    for (let j = i + 1; j < prepared.length; j++) {
      const A = prepared[i];
      const B = prepared[j];
      if (A.atoms.size > 0 && B.atoms.size > 0) {
        const score = jaccard(A.atoms, B.atoms);
        if (score > threshold) {
          issues.push({
            a: A.label,
            b: B.label,
            kind: "atom_overlap",
            detail: `${(score * 100).toFixed(0)}% sensory-atom overlap (threshold ${(threshold * 100).toFixed(0)}%)`,
          });
        }
      }
      if (A.mood && B.mood && A.mood === B.mood) {
        issues.push({ a: A.label, b: B.label, kind: "shared_mood", detail: `both lead with mood "${A.mood}"` });
      }
    }
  }
  return { ok: issues.length === 0, issues };
};

const CRIME_SCENE_RE = /crime\s*scene|murder|the body|victim|where .* (died|killed)|killed|death\b/i;

export interface CrimeSceneAuditResult {
  ok: boolean;
  issue?: string;
}

/**
 * Verify at least one keyLocation is profiled as the crime scene (by id/purpose keyword). When a
 * crimeSceneHint is given, also confirm a location relates to it by name. Without a profiled murder
 * room Agent 9 has no sensory bible for the actual scene.
 */
export const checkCrimeSceneProfiled = (
  profiles: LocationProfilesResult | undefined | null,
  crimeSceneHint?: string,
): CrimeSceneAuditResult => {
  const locations = Array.isArray(profiles?.keyLocations) ? profiles!.keyLocations : [];
  if (locations.length === 0) return { ok: false, issue: "no key locations profiled at all" };

  const hasCrimeScene = locations.some((loc) => {
    const id = String((loc as any)?.id ?? "");
    const purpose = String((loc as any)?.purpose ?? "");
    return CRIME_SCENE_RE.test(id) || CRIME_SCENE_RE.test(purpose);
  });
  if (!hasCrimeScene) {
    return {
      ok: false,
      issue: "no keyLocation is profiled as the crime scene (none has a crime-scene id/purpose)",
    };
  }

  const hint = normAtom(String(crimeSceneHint ?? ""));
  if (hint && hint.length >= 3) {
    const matchesHint = locations.some((loc) => {
      const name = normAtom(String((loc as any)?.name ?? ""));
      const purpose = normAtom(String((loc as any)?.purpose ?? ""));
      return (name && (name.includes(hint) || hint.includes(name))) || purpose.includes(hint);
    });
    if (!matchesHint) {
      return {
        ok: false,
        issue: `no profiled location matches the crime scene "${crimeSceneHint}" — Agent 9 may have no sensory bible for the murder room`,
      };
    }
  }
  return { ok: true };
};

/** Compose retry feedback from the gate findings (deduped, concrete). */
export const buildSceneGateFeedback = (
  distinct: LocationDistinctnessResult,
  crimeScene: CrimeSceneAuditResult,
): string => {
  const lines: string[] = [];
  if (!crimeScene.ok && crimeScene.issue) {
    lines.push(
      `Crime scene: ${crimeScene.issue}. Profile the actual murder room as a keyLocation with purpose "Crime scene" and its own unmistakable sensory palette.`,
    );
  }
  if (!distinct.ok) {
    for (const issue of distinct.issues) {
      lines.push(
        `Distinctness: "${issue.a}" and "${issue.b}" — ${issue.detail}. Give each room a different dominant sensory signature and mood.`,
      );
    }
  }
  return lines.join("\n");
};
