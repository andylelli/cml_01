/**
 * A5-09 — `buildCluePrompt` split into named section builders. Each returns exactly the text its section
 * contributes (including the blank-line separator that follows it); `buildCluePrompt` concatenates them in
 * the original order. Static sections are constants.
 *
 * Behaviour-preserving split: every literal and expression is the one `buildCluePrompt` used inline. The
 * byte-equality proof is old-dist vs new-dist over the archived CMLs (flag off and on).
 */
import { SOURCE_PATH_PROMPT_ROOTS } from "@cml/cml";
import type { ClueExtractionInputs } from "../agent5-clues.js";

// ---------------------------------------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------------------------------------

export const CLUE_SYSTEM_PROMPT = `You are a clue extraction specialist for Golden Age mystery fiction.
Extract clues ONLY from existing CML facts.
Do not invent facts.
Keep clues reader-observable and fair play ordered.
Return valid JSON only.

Clue categories:
- Temporal
- Spatial
- Physical
- Behavioral
- Testimonial`;

// ---------------------------------------------------------------------------------------------------------
// Developer prompt sections, in assembly order
// ---------------------------------------------------------------------------------------------------------

export function buildCmlSummarySection(s: {
  title: unknown;
  category: unknown;
  primaryAxis: string;
  castCount: number;
  clueDensity: string;
  effectiveDensity: string;
  requiredCount: number;
}): string {
  return `## CML Summary
**Title**: ${s.title}
**Crime**: ${s.category}
**Primary axis**: ${s.primaryAxis}
**Cast**: ${s.castCount} characters
**Requested density**: ${s.clueDensity}
**Effective density**: ${s.effectiveDensity}${s.effectiveDensity !== s.clueDensity ? " (auto-escalated to satisfy mandatory requirements)" : ""}

## Mandatory Clue Requirements (${s.requiredCount} required)
`;
}

export interface RequirementLine {
  requirement: string;
  evidenceType: string;
  criticality: string;
  suggestedPlacement: string;
  category: string;
  supportsInferenceStep?: number;
  keyTerms: string[];
}

/** The numbered list under "## Mandatory Clue Requirements". */
export function buildMandatoryRequirementsList(requiredClues: RequirementLine[]): string {
  let out = "";
  requiredClues.forEach((req, idx) => {
    out += `${idx + 1}. ${req.requirement}\n`;
    out += `   → ${req.evidenceType} | ${req.criticality} | ${req.suggestedPlacement} | ${req.category}`;
    if (req.supportsInferenceStep) out += ` | step ${req.supportsInferenceStep}`;
    if (req.keyTerms.length > 0) out += ` | terms: ${req.keyTerms.join(', ')}`;
    out += `\n\n`;
  });
  return out;
}

export const FIRST_PASS_REQUIRED_SLOTS = [
  {
    id: "clue_mechanism_visibility_core",
    placement: "early|mid",
    criticality: "essential",
    evidenceType: "observation",
    contract: "Reader-visible mechanism detail appears before the discriminating test.",
  },
  {
    id: "clue_core_contradiction_chain",
    placement: "early|mid",
    criticality: "essential",
    evidenceType: "contradiction",
    contract: "Explicitly overturns the false assumption using concrete reader-observable evidence.",
  },
  {
    id: "clue_core_elimination_chain",
    placement: "early|mid",
    criticality: "essential",
    evidenceType: "elimination",
    contract: "Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.",
  },
] as const;

export function buildFirstPassSlotsSection(): string {
  return `## First-pass Required Output Slots (non-negotiable IDs)
${FIRST_PASS_REQUIRED_SLOTS
  .map(
    (slot, idx) =>
      `${idx + 1}. id=${slot.id} | placement=${slot.placement} | criticality=${slot.criticality} | evidenceType=${slot.evidenceType}\n` +
      `   contract: ${slot.contract}`,
  )
  .join("\n")}

`;
}

/** Temporal Constraints, Access Constraints and Physical Evidence (CASE.constraint_space). */
export function buildConstraintSpaceSections(c: {
  timeAnchors: string[];
  timeContradictions: string[];
  accessActors: string[];
  accessObjects: string[];
  physicalTraces: string[];
}): string {
  return `## Temporal Constraints
${[...c.timeAnchors, ...c.timeContradictions].map(a => `- ${a}`).join('\n') || 'None'}

## Access Constraints
Actors: ${c.accessActors.join(', ') || 'None'}
Objects: ${c.accessObjects.join(', ') || 'None'}

## Physical Evidence
${c.physicalTraces.map(t => `- ${t}`).join('\n') || 'None'}

`;
}

/** Empty when no cast member carries evidence_sensitivity. */
export function buildEvidenceSensitiveSection(evidenceSensitiveChars: any[]): string {
  if (evidenceSensitiveChars.length === 0) return "";
  let out = `## Evidence-Sensitive Characters\n`;
  for (const char of evidenceSensitiveChars) {
    out += `- ${(char as any).name}: sensitive items: ${((char as any).evidence_sensitivity as string[]).join(', ')}\n`;
  }
  out += `\n`;
  return out;
}

export const HARD_PRECEDENCE_AND_GENERATION_ORDER = `## Hard Precedence (resolve in order)
1. sourceInCML legality
2. index bounds and cast name-index correctness
3. discriminating-test clue ID coverage
4. suspect elimination quality
5. red-herring separation
6. optional texture

## Generation Order (Critical)
1. Build clues[].id and clues[].sourceInCML first.
2. Validate source paths against valid_source_paths[] when available; otherwise allowed roots + bounds.
3. Populate clue description/pointsTo text.
4. Build elimination details.
5. Generate red herrings last.
6. Set status based on unresolved hard-rule defects.

`;

export interface DeterministicBounds {
  stepPathMin: number;
  stepPathMax: number;
  supportsStepMin: number;
  supportsStepMax: number;
  anchorMin: number;
  anchorMax: number;
  contradictionMin: number;
  contradictionMax: number;
  castMin: number;
  castMax: number;
}

export function buildDeterministicBoundsSection(bounds: DeterministicBounds): string {
  return `## Deterministic Bounds (use exactly)
- inference_path steps path index range: ${bounds.stepPathMin}..${bounds.stepPathMax}
- supportsInferenceStep valid range: ${bounds.supportsStepMin}..${bounds.supportsStepMax}
- constraint_space.time.anchors index range: ${bounds.anchorMin}..${bounds.anchorMax}
- constraint_space.time.contradictions index range: ${bounds.contradictionMin}..${bounds.contradictionMax}
- cast index range: ${bounds.castMin}..${bounds.castMax}

`;
}

export function buildCastIndexMapSection(castIndexMap: Array<{ name: string; index: number }>): string {
  return `## Cast Name -> Index Map (for CASE.cast[N] paths)
${castIndexMap.length > 0 ? castIndexMap.map((c) => `- ${c.name} -> ${c.index}`).join("\n") : "- None"}

`;
}

export function buildClueDensitySection(
  densityInfo: { label: string; count: string; range: string },
  densityOverflow: boolean,
  requiredCount: number,
): string {
  return `## Clue Density: ${densityInfo.label}
Generate ${densityOverflow ? `at least ${requiredCount} clues (mandatory requirements exceed dense target range)` : `${densityInfo.count} total`}.
Additional optional clues (${densityInfo.range} extra) for texture.

`;
}

/** "## Red Herring Budget" plus, when the budget is positive, the lexical guardrails. */
export function buildRedHerringSection(
  redHerringBudget: number,
  falseAssumptionStatement: unknown,
  correctionLexicon: unknown[],
  falseAssumptionLexicon: string[],
): string {
  let out = `## Red Herring Budget: ${redHerringBudget}
`;
  if (redHerringBudget > 0) {
    out += `Create ${redHerringBudget} red herrings that support the false assumption: "${falseAssumptionStatement}"\n\n`;
    out += `## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
${correctionLexicon.length > 0 ? correctionLexicon.map((t) => `  - ${t}`).join("\n") : "  - none"}
- preferred_false_assumption_terms:
${falseAssumptionLexicon.length > 0 ? falseAssumptionLexicon.map((t) => `  - ${t}`).join("\n") : "  - none"}
- red_herring_contract:
  - Use preferred_false_assumption_terms where possible.
  - Avoid correction_terms_forbidden_in_red_herrings in redHerrings[].description and redHerrings[].misdirection.
  - Include one sentence in each misdirection explicitly justifying non-overlap with true-solution mechanism language.\n\n`;
  } else {
    out += `No red herrings requested.\n\n`;
  }
  return out;
}

/** Pillar 1: canonical locked facts, honoured verbatim. Empty when there are none. */
export function buildLockedFactsSection(lockedFacts: ClueExtractionInputs["lockedFacts"]): string {
  if (!(Array.isArray(lockedFacts) && lockedFacts.length > 0)) return "";
  let out = `## CANONICAL LOCKED FACTS — Honour Verbatim\nThe following values are ground truth established by the hard-logic device generator.\nAny clue description that references these concepts MUST use these exact values (in word form, not digits).\nDo not write a different time, distance, quantity, or measurement in any clue description.\n\n`;
  for (const fact of lockedFacts) {
    out += `- **${fact.id}**: "${fact.value}" — ${fact.description}\n`;
  }
  out += `\n`;
  return out;
}

export const CLUE_PLACEMENT_STRATEGY = `## Clue Placement Strategy
- Early (Act I): essential clues, set up the puzzle, introduce key observations
- Mid (Act II): supporting clues, deepen investigation, complicate the picture
- Late (Act III): optional clues, final revelations, confirm the solution

Criticality levels:
- essential: reader must see this to follow the detective's logic
- supporting: reinforces key deductions without being critical
- optional: adds texture and atmosphere

`;

/** CASE.quality_controls targets. Empty when the CML has no quality_controls keys. */
export function buildQualityControlsSection(qualityControls: any): string {
  const clueTargets = qualityControls?.clue_visibility_requirements ?? {};
  if (Object.keys(qualityControls).length === 0) return "";
  return `## Quality Controls (from CML)
- Essential clues minimum: ${clueTargets.essential_clues_min ?? "N/A"}
- Essential clues before test: ${String(clueTargets.essential_clues_before_test ?? "N/A")}
- Early clues minimum: ${clueTargets.early_clues_min ?? "N/A"}
- Mid clues minimum: ${clueTargets.mid_clues_min ?? "N/A"}
- Late clues minimum: ${clueTargets.late_clues_min ?? "N/A"}

If targets conflict with clue density, prioritize fair play (essential clues and early placement).
If mandatory requirements exceed requested density, satisfy mandatory requirements first and keep optional clues minimal.

`;
}

/** The developer-side echo of the fair-play feedback. Empty unless it carries violations or warnings. */
export function buildFairPlayAuditSection(fairPlayFeedback: ClueExtractionInputs["fairPlayFeedback"]): string {
  const feedbackViolations = Array.isArray(fairPlayFeedback?.violations)
    ? fairPlayFeedback.violations
    : [];
  const feedbackWarnings = Array.isArray(fairPlayFeedback?.warnings)
    ? fairPlayFeedback.warnings
    : [];
  const feedbackRecommendations = Array.isArray(fairPlayFeedback?.recommendations)
    ? fairPlayFeedback.recommendations
    : [];

  if (!(feedbackViolations.length > 0 || feedbackWarnings.length > 0)) return "";
  const overallStatus = fairPlayFeedback?.overallStatus;
  return `## Fair Play Audit Feedback
Status: **${overallStatus ?? "needs-review"}**

Violations: ${feedbackViolations.length > 0 ? feedbackViolations.map((v, i) => `${i + 1}. [${v.severity}] ${v.rule}: ${v.description}`).join('; ') : 'None'}
Warnings: ${feedbackWarnings.join('; ') || 'None'}
Recommendations: ${feedbackRecommendations.join('; ') || 'None'}

Regeneration: Adjust placement so essential clues appear before the discriminating test.

`;
}

export const QUALITY_BAR = `## Quality Bar
- Essential clues must form a solvable chain, not disconnected facts.
- Clue wording should be concrete enough for scene-level prose rendering.
- Placement should enforce fair-play timing rather than clustering clues at reveal.

`;

export function buildHardConstraintsLearnedSection(stepCount: number): string {
  return `## Hard Constraints Learned from Failures
- Discriminating-test clue ID coverage is mandatory: every ID in CASE.discriminating_test.evidence_clues must appear as a clue id.
- Required discriminating-test clue IDs must be criticality: essential and placement: early|mid.
- Elimination clues must include a concrete alibi window, corroborator/evidence source, and explicit exclusion logic in pointsTo.
- sourceInCML must use legal CML paths only; do not invent path families.
- Red herrings must support the false assumption and include non-overlap justification vs true culprit mechanism facts.
- Narrative-facing time wording must be era-appropriate and written in words (for example, "quarter past nine", not "9:15 PM").
- supportsInferenceStep and step-indexed sourceInCML references must stay within actual inference-path bounds.
- Red herring text must not reuse correction-language tokens from inference_path.steps[].correction.
- If inference_path has ${stepCount} step(s), valid supportsInferenceStep/source step indices are 1..${stepCount} and 0..${Math.max(stepCount - 1, 0)} respectively.
- Cast paths must use CASE.cast[N] with N from the Name->Index map above. Do not substitute names inside brackets.

`;
}

export const FAILURE_MODE_HARDENING = `## Failure-Mode Hardening (pass-first)
- If valid_source_paths[] is provided, sourceInCML should exactly match one listed path.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- Do not reference a different suspect name when sourceInCML points to CASE.cast[N].*.
- Required discriminating-test IDs must be present in clues[].id and placed early|mid as essential.
- Elimination clues must include alibi window + corroborator + explicit exclusion logic.
- Red-herring forbidden terms apply to description/misdirection only; supportsAssumption may restate the false assumption.
- Set status="pass" only when missing discriminating IDs, weak elimination suspects, and invalid source paths are all empty.
- If cast-path binding, source-path legality, or discriminating evidence ID contracts fail, status MUST be "fail".

`;

export function buildSourcePathLegalitySection(): string {
  return `## Source Path Legality (Critical)
Allowed source roots include:
${SOURCE_PATH_PROMPT_ROOTS.map((template) => `- ${template}`).join("\n")}
Forbidden examples:
- CASE.constraint_space.access.footprints[0]
- CASE.character_behavior.*
- CASE.character_testimonial.*
- CASE.cast.Name.*

`;
}

export function buildValidSourcePathsSection(validSourcePaths: string[]): string {
  return `## valid_source_paths[] (exact match preferred)
${validSourcePaths.length > 0 ? validSourcePaths.map((p) => `- ${p}`).join("\n") : "- none"}

`;
}

export function buildDeterministicOutputContractsSection(stepCount: number): string {
  return `## Deterministic Output Contracts
- FIRST-PASS CONTRACT: satisfy every contract in the initial output; downstream deterministic guardrails are safety nets, not primary completion paths.
- REQUIRED FIELDS CONTRACT: every clue must include non-empty id, sourceInCML, pointsTo, and supportsInferenceStep.
- FIELD CONSISTENCY CONTRACT: if sourceInCML is CASE.inference_path.steps[N].*, supportsInferenceStep must equal N+1.
- PER-STEP COVERAGE CONTRACT: for each inference step in range 1..${stepCount}, include at least one mapped clue and at least one contradiction clue.
- SOURCE LEGALITY CONTRACT: sourceInCML must exactly match an entry in valid_source_paths[]; never invent or transform paths.
- SOURCE FORMAT CONTRACT: use bracket-index leaf paths only (for example CASE.inference_path.steps[1].correction). Dot-index and intermediate-node paths are forbidden.
- SUSPECT PARITY CONTRACT: if any non-culprit suspect is named, include elimination/alibi evidence parity for that suspect.
- TOP-LEVEL KEY CONTRACT: output top-level keys exactly as status, clues, redHerrings, audit.
- FORBIDDEN KEY CONTRACT: do not output red_herrings.
- STATUS DERIVATION CONTRACT: return status="pass" only when all hard contracts are satisfied and all audit arrays are empty.
- DISCRIMINATING ID EXACTNESS: preserve ID strings exactly; clue_1 must remain clue_1 (do not output clue1).
- FULL OBJECT CONTRACT: emit full clue objects only, never partial clue objects.
- ANTI-COLLAPSE OUTPUT RULE: status="fail" does not permit empty clues[] when evidence exists; output best-effort clues and put defects in audit arrays.

`;
}

export const MICRO_EXEMPLARS = `## Micro-exemplars
- Weak clue: "Someone was nervous around dinner."
- Strong clue: "Port wine decanter seal is broken before service despite butler log marking it intact at ten past seven."
- Weak sourceInCML: "case notes"
- Strong sourceInCML: "CASE.constraint_space.time.anchors[1]"

`;

export const SILENT_PRE_OUTPUT_CHECKLIST = `## Silent Pre-Output Checklist
- every clue traceable to CML
- essential clues placed early/mid only
- supportsInferenceStep populated when applicable
- at least one contradiction clue exists for every inference step with supportsInferenceStep mapping
- red herrings support false assumption without inventing facts
- all discriminating-test evidence clue IDs present in clue list
- elimination clues include qualifying alibi/corroboration/exclusion detail
- no illegal sourceInCML paths
- every CASE.cast[N].* clue references cast[N].name consistently in description/pointsTo
- no out-of-range inference-step indices
- no digit-based clock notation in description/pointsTo
- required fixed slot IDs exist exactly once with essential early/mid placement
- if cast-path binding/source-path legality/discriminating-ID coverage fails, set status="fail"
- set status="pass" only when all audit arrays are empty and no cast-path mismatch remains
- JSON only, no markdown fences

`;

export const OUTPUT_JSON_SCHEMA = `## Output JSON Schema
\`\`\`json
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "Concrete, specific clue description",
      "observable": "The on-page surface a character can SEE/HEAR/FIND — no interpretation",
      "inference": "What that observable lets the detective conclude",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
      "first_full_reveal_chapter": null,
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Red herring description",
      "supportsAssumption": "Which false assumption it supports",
      "misdirection": "How it misleads"
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}
\`\`\``;

// ---------------------------------------------------------------------------------------------------------
// User prompt
// ---------------------------------------------------------------------------------------------------------

/**
 * A_65b Ph6 — render the strict structural contract for the FIRST-PASS prompt. These exact shapes
 * previously reached the LLM only on retry (and retries are off by default), so deterministic
 * synthesis authored them from templates on every run. Stated up front, the LLM authors them in
 * scene register and the synthesis becomes the rare, counted floor.
 */
export function buildStrictContractBlock(sc: ClueExtractionInputs["strictContract"]): string {
  if (!sc) return "";
  const lines: string[] = [];
  lines.push("- STRICT STRUCTURAL CONTRACT (author ALL of these YOURSELF, as concrete scene-register clues — a character sees/hears/finds something. NEVER meta-boilerplate like \"adds texture to the case background\"; if you omit any, a deterministic pass will synthesize flat machine text in its place, which reads as machine-made):");
  for (const m of (sc.requiredIdToSourceMappings ?? []).slice(0, 24)) {
    lines.push(`    • REQUIRED ID: "${m.id}" with sourceInCML=${m.sourceInCML}`);
  }
  const dc = sc.requiredDirectCulpritClue;
  if (dc?.id) {
    lines.push(`    • DIRECT CULPRIT CLUE: id="${dc.id}" — observable evidence tying ${dc.culpritName} uniquely to the crime` +
      (dc.allowedSourcePaths?.length ? ` (source from: ${dc.allowedSourcePaths.slice(0, 6).join(", ")})` : "") +
      (dc.requiredPhrases?.length ? `; the pointsTo must include: ${dc.requiredPhrases.slice(0, 6).join(", ")}` : "") +
      // A_102 §10.2: when the case carries a weapon-first trace naming the culprit, the observable IS
      // that trace. Sourcing this slot from the cast entry lost the weapon on seed 6325.
      (dc.weaponTrace ? `; the observable IS this trace, in the case's own words: "${dc.weaponTrace}"` : ""));
  }
  const ls = sc.requiredLateClueSlot;
  if (ls?.id) {
    lines.push(`    • LATE SLOT: id="${ls.id}" placement=late criticality=${ls.criticality} — a real, observable late-story detail (a found object, an overheard line), never filler.`);
  }
  for (const f of (sc.requiredStepCoverageFloors ?? []).slice(0, 16)) {
    if (f.requireContradiction) lines.push(`    • STEP ${f.step}: must have a CONTRADICTION-evidence clue (observable, scene-register).`);
  }
  if (sc.strictSourcePaths?.length) {
    lines.push(`    • ALLOWED SOURCE PATHS (bracket-index leaf paths): ${sc.strictSourcePaths.slice(0, 20).join(", ")}`);
  }
  return lines.length > 1 ? lines.join("\n") : "";
}

/**
 * The two contract lines that ship only when there is no feedback at all. Every production caller passes
 * feedback, so in production this is always "" (A5-10 records the decision that is owed).
 */
export function buildFirstAttemptContracts(isFirstAttemptPrompt: boolean, redHerringBudget: number): string {
  return isFirstAttemptPrompt
    ? [
        "- CULPRIT-UNIQUE CLUE: include at least one essential early/mid clue that directly narrows to the culprit via unique evidence linkage.",
        redHerringBudget > 0
          ? "- FIRST-ATTEMPT RED HERRING CONTRACT: pre-empt lexical overlap with correction terms and keep red-herring language semantically separate from true-solution mechanism wording."
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";
}

/** The user prompt's opening directive and rules list (everything before the retry block). */
export function buildUserRulesSection(u: {
  userClueCountDirective: string | number;
  rhUserText: string;
  firstAttemptContracts: string;
  strictContractBlock: string;
  stepCount: number;
}): string {
  const { userClueCountDirective, rhUserText, firstAttemptContracts, stepCount } = u;
  return `Extract and organize clues from this mystery CML.

Generate ${userClueCountDirective} clues${rhUserText} that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- OUTPUT SHAPE CONTRACT: Include all three fixed IDs exactly once each - clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain.
- MECHANISM VISIBILITY: At least one essential early/mid clue must surface the core mechanism detail from hidden_model.mechanism.description.
${firstAttemptContracts}
${u.strictContractBlock}
- CONTRADICTION CHAIN: At least one essential early/mid contradiction clue must explicitly overturn the false assumption.
- ELIMINATION CHAIN: At least one essential early/mid elimination clue must explicitly eliminate an eligible non-culprit and narrow the solution.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- FAIL-FAST STATUS: status MUST be "fail" if any cast-path mismatch, illegal source path, or missing discriminating-test evidence clue ID remains.
- REQUIRED FIELDS CONTRACT: each clue MUST include non-empty sourceInCML, pointsTo, and supportsInferenceStep.
- PER-STEP COVERAGE CONTRACT: each inference step (1..${stepCount}) MUST have at least one mapped clue and at least one contradiction clue.
- SUSPECT PARITY CONTRACT: any named non-culprit suspect MUST have elimination/alibi evidence parity.
- TOP-LEVEL KEY CONTRACT: output exactly status, clues, redHerrings, audit; do not output red_herrings.
- FAIL-FAST STATUS EXTENSION: status MUST be fail if any required clue fields are missing, if any step lacks mapped or contradiction coverage, or if suspect parity fails.
- SOURCE FORMAT CONTRACT: sourceInCML MUST use bracket-index leaf paths only (no dot-index and no intermediate-node paths).
- DISCRIMINATING ID EXACTNESS: keep discriminating clue IDs as exact string matches, including underscores.
- FULL OBJECT CONTRACT: each clue object MUST include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- OBSERVABLE/INFERENCE SPLIT: also give each clue an "observable" (the concrete thing a character sees/hears/finds, with NO interpretation) and an "inference" (what that observable lets the detective conclude). Keep the solution/pointsTo OUT of "observable".
- POINTS-TO DISTINCTNESS: no two essential clues may share the same "pointsTo" implication — each solving clue must advance a DISTINCT step of the deduction rather than re-eliminating the same suspect.
- SELF-CHECK OUTPUT RULE: run all checks internally and output JSON only; do not output checklist commentary.
- ANTI-COLLAPSE OUTPUT RULE: if checks fail, keep status="fail" but still output a non-empty best-effort clues[] set unless CML evidence is unusable.
- If quality controls require late clues, satisfy late placement with supporting or optional clues only.
- Essential solving clues must remain early or mid.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above
`;
}
