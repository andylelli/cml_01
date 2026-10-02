/**
 * A5-09 — the retry-mode half of `buildCluePrompt`: one normaliser for the `fairPlayFeedback` payload (it was
 * 14 inline array normalisations) and one builder for the "Retry mode (bounded delta repair)" user block.
 *
 * Behaviour-preserving split: every expression, cap and render string is the one `buildCluePrompt` used inline.
 * The byte-equality proof is old-dist vs new-dist over the archived CMLs (flag off and on).
 */
import type { ClueExtractionInputs } from "../agent5-clues.js";
import { extractKeyTerms } from "./key-terms.js";

type FairPlayFeedback = NonNullable<ClueExtractionInputs["fairPlayFeedback"]>;

/** Trim every entry, drop the empty ones. Order and duplicates kept. */
function trimmedList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((t) => String(t).trim()).filter(Boolean) : [];
}

/** Trim every entry, drop the empty ones, de-duplicate (first wins), keep at most `limit`. */
function uniqueTrimmedList(value: unknown, limit: number): string[] {
  return Array.isArray(value) ? [...new Set(value.map((t) => String(t).trim()).filter(Boolean))].slice(0, limit) : [];
}

export interface NormalizedRetryFeedback {
  correctionTargets: string[];
  forbiddenTerms: string[];
  preferredTerms: string[];
  requiredReplacements: string[];
  violationCodes: string[];
  targetedClueIds: string[];
  preserveClueIds: string[];
  rewriteTargets: string[];
  requiredCluePhrases: string[];
  castPathBindingRules: string[];
  /** The payload's own cast map when it has valid entries, else the CML's. */
  effectiveCastIndexMap: Array<{ index: number; name: string }>;
  strictSourcePaths: string[];
  requiredIdToSourceMappings: Array<{ id: string; sourceInCML: string }>;
  requiredStepCoverageFloors: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>;
  requiredLateClueSlot?: { id: string; placement: string; criticality: string };
  requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] };
}

/**
 * Normalise the retry payload. Returns `undefined` when the retry block does not render: no feedback, or a
 * feedback with no violations and no warnings (the first pass, whatever else it carries).
 */
export function normalizeRetryFeedback(
  fairPlayFeedback: FairPlayFeedback | undefined,
  caseData: any,
  castIndexMap: Array<{ name: string; index: number }>,
): NormalizedRetryFeedback | undefined {
  if (!(fairPlayFeedback && (fairPlayFeedback.violations?.length || fairPlayFeedback.warnings?.length))) {
    return undefined;
  }
  const correctionTargets = [
    ...(fairPlayFeedback.violations || []).map((v) => `[${v.severity}] ${v.rule}: ${v.description}`),
    ...(fairPlayFeedback.warnings || []).map((w) => `[warning] ${w}`),
  ];
  if (correctionTargets.length === 0) return undefined;

  const explicitForbiddenTerms = trimmedList(fairPlayFeedback.forbiddenTerms);
  const correctionTerms = Array.isArray(caseData?.inference_path?.steps)
    ? caseData.inference_path.steps.flatMap((s: any) => extractKeyTerms(String(s?.correction ?? "")))
    : [];
  const forbiddenTerms = [...new Set([...explicitForbiddenTerms, ...correctionTerms])].slice(0, 18);

  const payloadCastIndexMap = Array.isArray(fairPlayFeedback.castPathNameIndexMap)
    ? fairPlayFeedback.castPathNameIndexMap
        .map((entry) => ({ index: Number(entry?.index), name: String(entry?.name ?? "").trim() }))
        .filter((entry) => Number.isInteger(entry.index) && entry.index >= 0 && entry.name.length > 0)
        .slice(0, 20)
    : [];
  const requiredIdToSourceMappings = Array.isArray(fairPlayFeedback.requiredIdToSourceMappings)
    ? fairPlayFeedback.requiredIdToSourceMappings
        .map((entry) => ({
          id: String(entry?.id ?? "").trim(),
          sourceInCML: String(entry?.sourceInCML ?? "").trim(),
        }))
        .filter((entry) => entry.id.length > 0 && entry.sourceInCML.length > 0)
        .slice(0, 24)
    : [];
  const requiredStepCoverageFloors = Array.isArray(fairPlayFeedback.requiredStepCoverageFloors)
    ? fairPlayFeedback.requiredStepCoverageFloors
        .map((entry) => ({
          step: Number(entry?.step),
          requireContradiction: Boolean(entry?.requireContradiction),
          requireMapped: Boolean(entry?.requireMapped),
        }))
        .filter((entry) => Number.isInteger(entry.step) && entry.step > 0)
        .slice(0, 16)
    : [];
  const lateSlot = fairPlayFeedback.requiredLateClueSlot;
  const requiredLateClueSlot = lateSlot
    ? {
        id: String(lateSlot.id ?? "").trim(),
        placement: String(lateSlot.placement ?? "").trim(),
        criticality: String(lateSlot.criticality ?? "").trim(),
      }
    : undefined;
  const directCulprit = fairPlayFeedback.requiredDirectCulpritClue;
  const requiredDirectCulpritClue = directCulprit
    ? {
        id: String(directCulprit.id ?? "").trim(),
        culpritName: String(directCulprit.culpritName ?? "").trim(),
        allowedSourcePaths: trimmedList(directCulprit.allowedSourcePaths).slice(0, 12),
        requiredPhrases: trimmedList(directCulprit.requiredPhrases).slice(0, 12),
      }
    : undefined;

  return {
    correctionTargets,
    forbiddenTerms,
    preferredTerms: uniqueTrimmedList(fairPlayFeedback.preferredTerms, 18),
    requiredReplacements: trimmedList(fairPlayFeedback.requiredReplacements),
    violationCodes: uniqueTrimmedList(fairPlayFeedback.violationCodes, 12),
    targetedClueIds: uniqueTrimmedList(fairPlayFeedback.targetedClueIds, 18),
    preserveClueIds: uniqueTrimmedList(fairPlayFeedback.preserveClueIds, 24),
    rewriteTargets: trimmedList(fairPlayFeedback.redHerringIdsToRewrite),
    requiredCluePhrases: uniqueTrimmedList(fairPlayFeedback.requiredCluePhrases, 12),
    castPathBindingRules: uniqueTrimmedList(fairPlayFeedback.castPathBindingRules, 12),
    effectiveCastIndexMap: payloadCastIndexMap.length > 0 ? payloadCastIndexMap : castIndexMap,
    strictSourcePaths: uniqueTrimmedList(fairPlayFeedback.strictSourcePaths, 40),
    requiredIdToSourceMappings,
    requiredStepCoverageFloors,
    requiredLateClueSlot,
    requiredDirectCulpritClue,
  };
}

/**
 * The user-prompt retry block (appended to the rules), including the red-herring rewrite line. `trims`
 * (CML_PROMPT_TRIMS, A5-10) drops the two lines that ask for `audit`/`status` output nobody reads.
 */
export function buildRetryModeBlock(n: NormalizedRetryFeedback, trims = false): string {
  const {
    correctionTargets,
    forbiddenTerms,
    preferredTerms,
    requiredReplacements,
    violationCodes,
    targetedClueIds,
    preserveClueIds,
    rewriteTargets,
    requiredCluePhrases,
    castPathBindingRules,
    effectiveCastIndexMap,
    strictSourcePaths,
    requiredIdToSourceMappings,
    requiredStepCoverageFloors,
    requiredLateClueSlot,
    requiredDirectCulpritClue,
  } = n;
  let block = `

    Retry mode (bounded delta repair):
    - Retry scope: use violation_codes[], targeted_clue_ids[], and preserve_clue_ids[] below as the authoritative delta contract.
    - Do not reopen unaffected clues or red herrings beyond the bounded scope declared below.
- Preserve unaffected clues unless changes are needed for consistency.
${trims ? "" : "- Populate audit arrays to show no unresolved critical defects.\n"}- If any target mentions red-herring overlap, include rewrite table entries as: old phrase -> replacement phrase.
${requiredCluePhrases.length > 0 ? `- REQUIRED CLUE CONTENT (must be covered by essential early/mid clues):\n${requiredCluePhrases.map((p) => `  - ${p}`).join("\n")}` : ""}

    Structured correction payload (bounded delta; apply exactly):
    - violation_codes[]:
    ${violationCodes.length > 0 ? violationCodes.map((code) => `  - ${code}`).join("\n") : "  - none"}
- must_fix[]:
${correctionTargets.map((t) => `  - ${t}`).join("\n")}
    - targeted_clue_ids[]:
    ${targetedClueIds.length > 0 ? targetedClueIds.map((id) => `  - ${id}`).join("\n") : "  - none"}
    - preserve_clue_ids[]:
    ${preserveClueIds.length > 0 ? preserveClueIds.map((id) => `  - ${id}`).join("\n") : "  - none"}
- strict_source_paths[]:
${strictSourcePaths.length > 0 ? strictSourcePaths.map((path) => `  - ${path}`).join("\n") : "  - none"}
- required_id_to_source_mappings[]:
${requiredIdToSourceMappings.length > 0
  ? requiredIdToSourceMappings.map((entry) => `  - ${entry.id} -> ${entry.sourceInCML}`).join("\n")
  : "  - none"}
- required_step_coverage_floors[]:
${requiredStepCoverageFloors.length > 0
  ? requiredStepCoverageFloors.map((entry) => `  - step ${entry.step} | contradiction=${entry.requireContradiction} | mapped=${entry.requireMapped}`).join("\n")
  : "  - none"}
- required_late_clue_slot:
${requiredLateClueSlot?.id
  ? `  - id=${requiredLateClueSlot.id} | placement=${requiredLateClueSlot.placement} | criticality=${requiredLateClueSlot.criticality}`
  : "  - none"}
- required_direct_culprit_clue:
${requiredDirectCulpritClue?.id
  ? [
      `  - id=${requiredDirectCulpritClue.id} | culprit=${requiredDirectCulpritClue.culpritName}`,
      `  - allowed_source_paths=${requiredDirectCulpritClue.allowedSourcePaths.length > 0 ? requiredDirectCulpritClue.allowedSourcePaths.join(", ") : "none"}`,
      `  - required_phrases=${requiredDirectCulpritClue.requiredPhrases.length > 0 ? requiredDirectCulpritClue.requiredPhrases.join(", ") : "none"}`,
    ].join("\n")
  : "  - none"}
- cast_index_to_name_map[] (authoritative for CASE.cast[N].*):
${effectiveCastIndexMap.length > 0 ? effectiveCastIndexMap.map((c) => `  - [${c.index}] ${c.name}`).join("\n") : "  - none"}
${castPathBindingRules.length > 0 ? `- cast_path_binding_rules[]:\n${castPathBindingRules.map((rule) => `  - ${rule}`).join("\n")}` : "- cast_path_binding_rules[]: none"}
${forbiddenTerms.length > 0 ? `- forbidden_terms[] (do not use in red herring description/misdirection):\n${forbiddenTerms.map((t) => `  - ${t}`).join("\n")}` : "- forbidden_terms[]: none"}
- preferred_terms[] (use these instead when possible):
${preferredTerms.length > 0 ? preferredTerms.map((t) => `  - ${t}`).join("\n") : "  - none"}
- required_replacements[]:
${requiredReplacements.length > 0
  ? requiredReplacements.map((r) => `  - ${r}`).join("\n")
  : "  - old phrase -> replacement phrase (for every overlap-triggering phrase)\n  - old phrase -> replacement phrase (for every invalid source path token)"}

Hard retry contract:
- Rewrite targeted_clue_ids[] only; add missing IDs from targeted_clue_ids[] when must_fix[] requires them.
- Preserve preserve_clue_ids[] unchanged unless a targeted dependency forces a paired update.
- If targeted_clue_ids[] is empty, limit changes to the minimum new IDs required by must_fix[].
- strict_source_paths[] are the authoritative legal retry sourceInCML leaves; do not emit any clue outside that whitelist.
- Keep every required_id_to_source_mappings[] clue ID exact, early|mid, and essential.
- Satisfy every required_step_coverage_floors[] entry in the same output; do not defer contradiction coverage to a later retry.
- If required_late_clue_slot is present, keep that exact ID late and non-essential.
- If required_direct_culprit_clue is present, keep that exact ID, name the culprit explicitly, and use one of its allowed_source_paths.
- If forbidden_terms[] is non-empty, none of those terms may appear in redHerrings[].description or redHerrings[].misdirection.
- Retry CAST PATH BINDING CONTRACT (MANDATORY): for each clue with sourceInCML=CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name from cast_index_to_name_map[].
- Mandatory pre-output self-check: iterate every clue and verify cast-path binding, source-path legality, and discriminating evidence ID coverage before final output.${trims ? "" : `
- If that cannot be satisfied while keeping red herring coherence, return status=\"fail\" with the blocking term list in audit.invalidSourcePaths.`}`;
  if (rewriteTargets.length > 0 || correctionTargets.some((t) => /red\s*herring\s*(rh_1|rh_2)|rh_1|rh_2/i.test(t))) {
    block += `
- Explicitly rewrite ${rewriteTargets.length > 0 ? rewriteTargets.join(", ") : "both rh_1 and rh_2"} and include a non-overlap justification sentence in each misdirection field.`;
  }
  return block;
}
