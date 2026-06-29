/**
 * Obligation collection (Agent 7 redesign §4.1 step 1).
 *
 * Reads the must-occur beats directly from the structured CML + Agent-5 clue distribution — not from
 * prose-y inference. Everything here is a field lookup: `culpability.culprits`, `cast` roles, the clue
 * distribution, `discriminating_test`, `prose_requirements`. The output is the flat obligation set the
 * scheduler lays into the grid.
 */

import type {
  DetectiveType,
  Obligation,
  SchedulerCase,
  SchedulerClue,
  TestTiming,
} from "./types.js";

function unwrapCase(cml: unknown): SchedulerCase {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, unknown>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as SchedulerCase;
    return obj as SchedulerCase;
  }
  return {};
}

const VICTIM_RE = /victim/i;
const DETECTIVE_RE = /detective|sleuth|investigator|inspector/i;

function detectiveType(cast: SchedulerCase["cast"]): DetectiveType {
  const det = (cast ?? []).find((c) => DETECTIVE_RE.test(`${c.role ?? ""} ${c.role_archetype ?? ""}`));
  const blob = `${det?.role ?? ""} ${det?.role_archetype ?? ""}`.toLowerCase();
  if (/police|inspector|constable|yard|official/.test(blob)) return "police";
  if (/private|p\.i\.|agency|hired|consulting/.test(blob)) return "private";
  return "amateur";
}

/** The clue ids the discriminating test turns on (declared `evidence_clues`, else the essential clues). */
function testSupportingClues(caseData: SchedulerCase, clues: SchedulerClue[]): string[] {
  const declared = (caseData.discriminating_test?.evidence_clues ?? [])
    .map((e) => (typeof e === "string" ? e : e?.id))
    .filter((id): id is string => Boolean(id));
  if (declared.length) return declared;
  return clues.filter((c) => c.criticality === "essential").map((c) => c.id);
}

function testTiming(caseData: SchedulerCase): TestTiming {
  return (
    caseData.quality_controls?.discriminating_test_requirements?.timing ??
    caseData.discriminating_test?.timing ??
    "early_act3"
  );
}

export interface CollectedObligations {
  obligations: Obligation[];
  /** Names of suspects (for the introduce + clear passes) and the culprit set, for the scheduler. */
  suspectNames: string[];
  culprits: string[];
  hasFalseSolution: boolean;
}

export function collectObligations(cml: unknown, clues: SchedulerClue[], redHerrings?: Array<{ id?: string }>): CollectedObligations {
  const caseData = unwrapCase(cml);
  const cast = caseData.cast ?? [];
  const culprits = caseData.culpability?.culprits ?? [];

  // Suspects = eligible cast + culprits, excluding the victim/detective roles.
  const suspectNames: string[] = [];
  for (const c of cast) {
    const blob = `${c.role ?? ""} ${c.role_archetype ?? ""}`;
    if (!c.name || VICTIM_RE.test(blob) || DETECTIVE_RE.test(blob)) continue;
    const isSuspect = c.culprit_eligibility === "eligible" || c.culprit_eligibility === "locked" || culprits.includes(c.name);
    if (isSuspect) suspectNames.push(c.name);
  }
  // ensure culprits are always introduced even if cast flags are missing
  for (const name of culprits) if (name && !suspectNames.includes(name)) suspectNames.push(name);

  const obligations: Obligation[] = [];
  obligations.push({ kind: "introduce_victim" });
  obligations.push({ kind: "discover_crime" });
  obligations.push({ kind: "detective_entry", type: detectiveType(cast) });
  for (const name of suspectNames) obligations.push({ kind: "introduce_suspect", name });

  for (const clue of clues) {
    obligations.push({
      kind: "reveal_clue",
      id: clue.id,
      criticality: clue.criticality ?? (clue.supportsInferenceStep != null ? "essential" : "supporting"),
      placement: clue.placement ?? "mid",
    });
  }

  const herrings = (redHerrings ?? caseData.red_herrings ?? []).map((h) => h?.id).filter((id): id is string => Boolean(id));
  for (const id of herrings) obligations.push({ kind: "plant_red_herring", id });

  // Clearances: every eligible non-culprit suspect. supportingClues from prose_requirements if present.
  const clearanceClues = new Map<string, string[]>();
  for (const sc of caseData.prose_requirements?.suspect_clearance_scenes ?? []) {
    if (sc.suspect_name) clearanceClues.set(sc.suspect_name, (sc.supporting_clues ?? []).filter(Boolean));
  }
  for (const name of suspectNames) {
    if (culprits.includes(name)) continue;
    obligations.push({ kind: "clear_suspect", name, supportingClues: clearanceClues.get(name) ?? [] });
  }

  // A_53 P5 (false-solution-empty-object-truthy): an empty stub `false_solution: {}` is truthy but
  // carries no beat — require a meaningful field (an accused suspect, or any non-empty key) so the
  // scheduler doesn't have to place a phantom obligation on tight grids.
  const fs = caseData.false_solution as Record<string, unknown> | undefined | null;
  const hasFalseSolution = Boolean(
    fs && typeof fs === "object" && !Array.isArray(fs) &&
    (String((fs as any).accused_suspect ?? "").trim().length > 0 || Object.keys(fs).length > 0),
  );
  if (hasFalseSolution) obligations.push({ kind: "false_solution" });

  obligations.push({ kind: "discriminating_test", supportingClues: testSupportingClues(caseData, clues), timing: testTiming(caseData) });
  obligations.push({ kind: "reveal_solution" });
  obligations.push({ kind: "denouement" });

  return { obligations, suspectNames, culprits, hasFalseSolution };
}
