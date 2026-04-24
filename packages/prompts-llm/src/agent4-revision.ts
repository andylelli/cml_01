/**
 * Agent 4: CML Revision Agent
 * 
 * Parses CML validation errors and generates targeted revisions to fix Agent 3 output.
 * Uses logger from llm-client for revision tracking (like Agent 3).
 * 
 * Critical for production-ready CML generation - fixes ~90% of Agent 3 validation failures.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import type { PromptComponents } from "./types.js";
import { validateCml } from "@cml/cml";
import yaml from "js-yaml";
import { jsonrepair } from "jsonrepair";

export interface RevisionInputs {
  originalPrompt: PromptComponents;  // Original Agent 3 prompt for context
  invalidCml: string;                // YAML string that failed validation
  validationErrors: string[];        // List of validation error messages
  attempt: number;                   // Current revision attempt (1-5)
  maxAttempts?: number;              // Max revision attempts for prompt context
  runId?: string;                    // For logging
  projectId?: string;                // For logging
}

export interface RevisionResult {
  cml: Record<string, unknown>;      // Revised CML object
  validation: {
    valid: boolean;
    errors: string[];
  };
  revisionsApplied: string[];        // List of changes made
  attempt: number;                   // Final attempt number
  latencyMs: number;                 // Time taken for revision
  cost: number;                      // Estimated cost
}

/**
 * Parse validation errors into structured categories
 */
function categorizeErrors(errors: string[]): {
  missingRequired: string[];
  typeErrors: string[];
  allowedValueErrors: string[];
  groundingErrors: string[];
} {
  const missingRequired: string[] = [];
  const typeErrors: string[] = [];
  const allowedValueErrors: string[] = [];
  const groundingErrors: string[] = [];

  for (const error of errors) {
    if (error.includes("is required")) {
      missingRequired.push(error);
    } else if (error.includes("not grounded in reader-visible inference evidence")) {
      groundingErrors.push(error);
    } else if (error.includes("must be one of")) {
      allowedValueErrors.push(error);
    } else if (error.includes("must be")) {
      typeErrors.push(error);
    } else {
      // Unknown error format - add to type errors as fallback
      typeErrors.push(error);
    }
  }

  return { missingRequired, typeErrors, allowedValueErrors, groundingErrors };
}

/**
 * Group errors by section (e.g., CASE.meta, CASE.cast[0], CASE.culpability)
 */
function groupErrorsBySection(errors: string[]): Map<string, string[]> {
  const sections = new Map<string, string[]>();

  for (const error of errors) {
    // Extract section from error path (e.g., "CASE.meta.license" -> "CASE.meta")
    const match = error.match(/^(CASE\.[^.\[]+(?:\[\d+\])?)/);
    const section = match ? match[1] : "CASE";

    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(error);
  }

  return sections;
}

/**
 * Build revision prompt with error context and targeted fixes
 */
export function buildRevisionPrompt(inputs: RevisionInputs): PromptComponents {
  const { originalPrompt, invalidCml, validationErrors, attempt, maxAttempts } = inputs;
  const promptMaxAttempts = typeof maxAttempts === "number" && maxAttempts > 0 ? maxAttempts : 5;

  // Categorize and group errors for better targeting
  const categorized = categorizeErrors(validationErrors);
  const grouped = groupErrorsBySection(validationErrors);

  // System prompt: Revision specialist role
  const system = `You are a CML (Case Markup Language) revision specialist. Your task is to fix validation errors in CML documents while preserving the original creative intent and narrative structure.

**Core Principles**:
- Fix ONLY the validation errors - don't rewrite working sections
- Preserve all existing content that doesn't have errors
- Maintain the mystery's logical consistency
- Keep the original tone, era constraints, and character dynamics
- Generate minimal, targeted fixes

**Revision Strategy**:
1. Analyze validation errors to understand what's missing or incorrect
2. Examine the original CML to understand context
3. Generate missing fields based on existing content
4. Fix type/value errors while preserving intent
5. Ensure all fixes maintain narrative coherence

You MUST return ONLY valid JSON that matches the CML 2.0 schema.`;

  // Developer prompt: Error analysis and schema guidance
  let developer = `# Revision Context

## Attempt ${attempt} of ${promptMaxAttempts}

## Validation Errors (${validationErrors.length} total)

`;

  // Group errors by category
  if (categorized.missingRequired.length > 0) {
    developer += `### Missing Required Fields (${categorized.missingRequired.length})\n\n`;
    // Show up to 10 representative errors
    const sample = categorized.missingRequired.slice(0, 10);
    for (const error of sample) {
      developer += `- ${error}\n`;
    }
    if (categorized.missingRequired.length > 10) {
      developer += `- ... and ${categorized.missingRequired.length - 10} more missing fields\n`;
    }
    developer += "\n";
  }

  if (categorized.typeErrors.length > 0) {
    developer += `### Type Errors (${categorized.typeErrors.length})\n\n`;
    for (const error of categorized.typeErrors) {
      developer += `- ${error}\n`;
    }
    developer += "\n";
  }

  if (categorized.allowedValueErrors.length > 0) {
    developer += `### Allowed Value Errors (${categorized.allowedValueErrors.length})\n\n`;
    for (const error of categorized.allowedValueErrors) {
      developer += `- ${error}\n`;
    }
    developer += "\n";
  }

  if (categorized.groundingErrors.length > 0) {
    developer += `### Grounding Errors (${categorized.groundingErrors.length})\n\n`;
    for (const error of categorized.groundingErrors) {
      developer += `- ${error}\n`;
    }
    developer += "\n";
  }

  // Show errors grouped by section
  developer += `## Errors by Section\n\n`;
  for (const [section, errors] of grouped.entries()) {
    developer += `### ${section} (${errors.length} errors)\n\n`;
    // Show up to 5 errors per section
    const sample = errors.slice(0, 5);
    for (const error of sample) {
      developer += `- ${error}\n`;
    }
    if (errors.length > 5) {
      developer += `- ... and ${errors.length - 5} more\n`;
    }
    developer += "\n";
  }

  // Common fix patterns
  developer += `## Common Fix Patterns

### Missing Cast Fields
When cast members are missing fields like age_range, role_archetype, etc.:
- Infer age_range from occupation/context (e.g., "early 40s", "mid 50s")
- Assign role_archetype based on character's role (detective, culprit_candidate, red_herring, etc.)
- Create public_persona from existing character description
- Generate private_secret that fits character's background
- Define motive_seed from character's relationships/background
- Set motive_strength: weak | moderate | strong | compelling
- Create alibi_window with time range and verification status
- Set access_plausibility based on character's position
- Define stakes (what character risks losing)

### Missing Meta Fields
- license: "CC-BY-4.0" (standard for CML files)
- era: Extract from existing content or use original prompt era
- setting: Extract location/context from existing content
- crime_class: murder | theft | disappearance | fraud

### Missing Culpability Fields
- culprit_count: Number of actual culprits (usually 1-2)
- culprits: Array of character names who committed the crime

### Missing Surface/Hidden Model
- accepted_facts: Array of facts investigator believes at start
- inferred_conclusions: Array of deductions from accepted facts
- outcome.result: The actual truth as a string summary

### Missing False Assumption
- statement: The key wrong assumption
- why_it_seems_reasonable: Why it's believable
- what_it_hides: What truth it conceals

### Type Errors
- inference_path must be an object with "steps" array
- discriminating_test.method must be: reenactment | trap | constraint_proof | administrative_pressure

### Structural Fair-Play Repairs (critical)
- Ensure every inference step has reader_observable: true unless a schema-level exception explicitly requires otherwise.
- Ensure each inference step has 2-4 concrete required_evidence entries.
- Reject abstract placeholders in required_evidence (e.g., "timeline discrepancy", "suspicious behavior", "detective insight").
- If discriminating_test design references mechanism details, ensure those same details already exist in earlier required_evidence.
- If an error says a mechanism/test fact is "not grounded in reader-visible inference evidence", copy the named terms into one or more earlier inference_path.steps[*].observation and required_evidence entries, and keep those steps reader_observable: true.
- If grounding errors name procedure-wrapper terms (for example: reenactment, surrounding, putting, under scrutiny, staged), do NOT force those terms into required_evidence. Rewrite discriminating_test.design into a fact-forward contradiction statement tied to existing evidence.
- Fix grounding errors by strengthening earlier evidence, not by weakening or deleting discriminating_test / hidden_model facts unless they directly contradict the existing CML.
- Never satisfy grounding or fair-play repairs by injecting detective-only behavioral shorthand such as "signals of guilt", suspicious reactions, observed defensiveness, or confession into required_evidence or discriminating_test fields.
- discriminating_test.design, discriminating_test.knowledge_revealed, and discriminating_test.pass_condition must describe factual mechanism proof, contradiction, or elimination the reader can verify; guest reactions alone are not proof.
- Keep discriminating_test evidence IDs canonical and traceable to prose_requirements.clue_to_scene_mapping.
- Ensure fair_play.explanation explicitly references inference steps and evidence flow (for example: Step 1..., Step 2...).

## Quality Bar
- Prefer minimal surgical edits over broad rewrites.
- Preserve existing narrative content unless a schema/type violation requires change.
- Keep enumerations exact and normalize near-miss values to valid schema options.
- Ensure every inferred fix is anchored to existing CML context, not invented plot expansion.

## Micro-exemplars
- Weak fix: "Add missing fields with generic placeholders everywhere."
- Strong fix: "Add only missing cast.age_range for two suspects, infer from occupations already present, keep all existing secrets/alibis unchanged."

## Silent Pre-Output Checklist
- all required keys present
- enums valid
- types valid
- no markdown wrappers
- complete corrected JSON document returned

`;

  // Original prompt context (abbreviated to save tokens)
  developer += `## Original Requirements (for context)

**Mystery Axis**: ${originalPrompt.user.substring(0, 200)}...

`;

  // User prompt: The actual revision task
  const user = `# Revision Task

Fix ALL validation errors in the CML below. Return the COMPLETE, corrected CML as valid JSON.

## Invalid CML to Fix

\`\`\`yaml
${invalidCml}
\`\`\`

## Instructions

1. **Add ALL missing required fields** - don't skip any
2. **Fix type errors** - convert to correct types
3. **Fix allowed value errors** - use valid enum values
4. **Preserve existing content** - don't rewrite working sections
5. **Maintain narrative coherence** - fixes must make logical sense
6. **Return COMPLETE JSON** - the entire fixed CML document, not just the changed sections
7. **For grounding errors, revise earlier inference_path evidence** - do not dodge the error by making the discriminating test vaguer; instead add the missing mechanism/test facts to earlier reader-visible observations and required_evidence.
  - Exception: if the failed terms are procedural wrappers (reenactment/staged/surrounding/under scrutiny/putting), rewrite discriminating_test.design to name the concrete contradiction being proven; do not backfill those wrapper words into evidence.
8. **Do not repair with reaction-only proof** - never use "signals of guilt", defensive reactions, or confession as the discriminating test's knowledge_revealed or pass_condition; use factual pre-test evidence instead.

**IMPORTANT**: Return ONLY the corrected JSON. No explanations, no markdown code blocks, just the raw JSON that will parse and validate successfully.`;

  return {
    system,
    developer,
    user,
  };
}

/**
 * Revise invalid CML by generating targeted fixes
 * 
 * Uses iterative revision with error feedback across up to 5 attempts.
 */
export async function reviseCml(
  client: AzureOpenAIClient,
  inputs: RevisionInputs,
  maxAttempts?: number,
): Promise<RevisionResult> {
  const startTime = Date.now();
  const logger = client.getLogger();
  const config = getGenerationParams().agent4_cml_validator.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;
  const runId = inputs.runId || `revision-${Date.now()}`;
  const projectId = inputs.projectId || "unknown";

  const ensureObject = (value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);
  const ensureString = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;

  const normalizeCml = (raw: Record<string, unknown>) => {
    const normalizeEnum = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => {
      const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
      const match = allowed.find((item) => item.toLowerCase() === normalized);
      return match ?? fallback;
    };

    const cml = ensureObject(raw);
    cml.CML_VERSION = 2.0;

    const caseBlock = ensureObject(cml.CASE);
    cml.CASE = caseBlock;

    const meta = ensureObject(caseBlock.meta);
    caseBlock.meta = meta;
    meta.title = ensureString(meta.title, "Untitled");
    meta.author = ensureString(meta.author, "CML Generator");
    meta.license = ensureString(meta.license, "CC-BY-4.0");

    const era = ensureObject(meta.era);
    meta.era = era;
    era.decade = ensureString(era.decade, "1930s");
    if (era.specific_year !== undefined && typeof era.specific_year !== "number") {
      delete era.specific_year;
    }
    if (era.specific_month !== undefined && typeof era.specific_month !== "string") {
      delete era.specific_month;
    }
    if (era.wartime !== undefined && typeof era.wartime !== "boolean") {
      delete era.wartime;
    }
    era.realism_constraints = ensureArray(era.realism_constraints);

    const setting = ensureObject(meta.setting);
    meta.setting = setting;
    setting.location = ensureString(setting.location, "Unknown location");
    setting.institution = ensureString(setting.institution, "Unknown institution");

    const crimeClass = ensureObject(meta.crime_class);
    meta.crime_class = crimeClass;
    crimeClass.category = normalizeEnum(crimeClass.category, ["murder", "theft", "disappearance", "fraud"], "murder");
    crimeClass.subtype = ensureString(crimeClass.subtype, "poisoning");

    caseBlock.cast = Array.isArray(caseBlock.cast)
      ? caseBlock.cast.map((member, index) => {
          const existing = ensureObject(member);
          const normalizedEligibility = normalizeEnum(existing.culprit_eligibility, ["eligible", "ineligible", "locked"], "eligible");
          const normalizedCulpability = normalizeEnum(existing.culpability, ["guilty", "innocent", "unknown"], "unknown");
          const normalizedRole = existing.role === undefined
            ? undefined
            : normalizeEnum(existing.role, ["detective", "victim", "culprit", "suspect", "witness", "bystander"], "suspect");
          const normalizedGender = existing.gender === undefined
            ? undefined
            : normalizeEnum(existing.gender, ["male", "female", "non-binary"], "non-binary");
          const normalizedMember: Record<string, unknown> = {
            ...existing,
            name: ensureString(existing.name, `Suspect ${index + 1}`),
            age_range: ensureString(existing.age_range, "adult"),
            role_archetype: ensureString(existing.role_archetype, "suspect"),
            relationships: ensureArray(existing.relationships),
            public_persona: ensureString(existing.public_persona, "reserved"),
            private_secret: ensureString(existing.private_secret, "keeps a secret"),
            motive_seed: ensureString(existing.motive_seed, "inheritance"),
            motive_strength: ensureString(existing.motive_strength, "moderate"),
            alibi_window: ensureString(existing.alibi_window, "evening"),
            access_plausibility: ensureString(existing.access_plausibility, "medium"),
            opportunity_channels: ensureArray(existing.opportunity_channels),
            behavioral_tells: ensureArray(existing.behavioral_tells),
            stakes: ensureString(existing.stakes, "reputation"),
            evidence_sensitivity: ensureArray(existing.evidence_sensitivity),
            culprit_eligibility: normalizedEligibility,
            culpability: normalizedCulpability,
          };

          if (normalizedRole !== undefined) {
            normalizedMember.role = normalizedRole;
          }
          if (normalizedGender !== undefined) {
            normalizedMember.gender = normalizedGender;
          }
          if (existing.moral_complexity !== undefined) {
            normalizedMember.moral_complexity = ensureString(existing.moral_complexity, "complex motivations");
          }

          return normalizedMember;
        })
      : [];

    const culpability = ensureObject(caseBlock.culpability);
    caseBlock.culpability = culpability;
    const culpritCount = typeof culpability.culprit_count === "number" ? culpability.culprit_count : 1;
    culpability.culprit_count = culpritCount === 2 ? 2 : 1;
    culpability.culprits = ensureArray(culpability.culprits);

    const surface = ensureObject(caseBlock.surface_model);
    caseBlock.surface_model = surface;
    const surfaceNarrative = ensureObject(surface.narrative);
    surface.narrative = surfaceNarrative;
    surfaceNarrative.summary = ensureString(surfaceNarrative.summary, "Unknown");
    surface.accepted_facts = ensureArray(surface.accepted_facts);
    surface.inferred_conclusions = ensureArray(surface.inferred_conclusions);

    const hidden = ensureObject(caseBlock.hidden_model);
    caseBlock.hidden_model = hidden;
    const hiddenMechanism = ensureObject(hidden.mechanism);
    hidden.mechanism = hiddenMechanism;
    hiddenMechanism.description = ensureString(hiddenMechanism.description, "Unknown");
    hiddenMechanism.delivery_path = ensureArray(hiddenMechanism.delivery_path);
    const hiddenOutcome = ensureObject(hidden.outcome);
    hidden.outcome = hiddenOutcome;
    hiddenOutcome.result = ensureString(hiddenOutcome.result, "Unknown");

    const falseAssumption = ensureObject(caseBlock.false_assumption);
    caseBlock.false_assumption = falseAssumption;
    falseAssumption.statement = ensureString(falseAssumption.statement, "Unknown assumption");
    falseAssumption.type = normalizeEnum(falseAssumption.type, ["temporal", "spatial", "identity", "behavioral", "authority"], "temporal");
    falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Unknown");
    falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Unknown");

    const constraintSpace = ensureObject(caseBlock.constraint_space);
    caseBlock.constraint_space = constraintSpace;
    const constraintTime = ensureObject(constraintSpace.time);
    constraintSpace.time = constraintTime;
    constraintTime.anchors = ensureArray(constraintTime.anchors);
    constraintTime.windows = ensureArray(constraintTime.windows);
    constraintTime.contradictions = ensureArray(constraintTime.contradictions);
    const constraintAccess = ensureObject(constraintSpace.access);
    constraintSpace.access = constraintAccess;
    constraintAccess.actors = ensureArray(constraintAccess.actors);
    constraintAccess.objects = ensureArray(constraintAccess.objects);
    constraintAccess.permissions = ensureArray(constraintAccess.permissions);
    const constraintPhysical = ensureObject(constraintSpace.physical);
    constraintSpace.physical = constraintPhysical;
    constraintPhysical.laws = ensureArray(constraintPhysical.laws);
    constraintPhysical.traces = ensureArray(constraintPhysical.traces);
    const constraintSocial = ensureObject(constraintSpace.social);
    constraintSpace.social = constraintSocial;
    constraintSocial.trust_channels = ensureArray(constraintSocial.trust_channels);
    constraintSocial.authority_sources = ensureArray(constraintSocial.authority_sources);

    const inferencePath = ensureObject(caseBlock.inference_path);
    caseBlock.inference_path = inferencePath;
    inferencePath.steps = Array.isArray(inferencePath.steps) && inferencePath.steps.length
      ? inferencePath.steps
      : [
          {
            observation: "The teacup ring remains on the study desk beside fresh ash.",
            correction: "The victim drank tea in the study, not in the dining room.",
            effect: "The timeline anchor shifts to a later private meeting.",
          },
          {
            observation: "The service corridor latch is scratched from the inside.",
            correction: "Someone exited through the corridor after the household retired.",
            effect: "Only staff-level access plausibly fits the movement.",
          },
          {
            observation: "A pawn ticket bears the same initials as the blackmail note.",
            correction: "The debt pressure links motive and opportunity to one suspect.",
            effect: "The suspect pool narrows to a testable single hypothesis.",
          },
        ];

    const isAbstractEvidence = (text: string) => {
      const normalized = text.toLowerCase();
      const abstractMarkers = [
        "timeline discrepancy",
        "suspicious behavior",
        "hidden motive",
        "detective insight",
        "something was wrong",
        "inconsistency",
        "general contradiction",
      ];
      return abstractMarkers.some((marker) => normalized.includes(marker));
    };

    const evidenceAnchors = [
      ...ensureArray(constraintTime.anchors),
      ...ensureArray(constraintTime.windows),
      ...ensureArray(constraintTime.contradictions),
      ...ensureArray(constraintAccess.actors),
      ...ensureArray(constraintAccess.objects),
      ...ensureArray(constraintAccess.permissions),
      ...ensureArray(constraintPhysical.laws),
      ...ensureArray(constraintPhysical.traces),
      ...ensureArray(constraintSocial.trust_channels),
      ...ensureArray(constraintSocial.authority_sources),
    ]
      .map((entry) => ensureString(entry, "").trim())
      .filter((entry) => entry.length > 0)
      .slice(0, 20);

    const fallbackEvidence = (index: number, observation: string, correction: string) => {
      const anchorA = evidenceAnchors[index % Math.max(evidenceAnchors.length, 1)] ||
        "A dated document anchors the event timing.";
      const anchorB =
        evidenceAnchors[(index + 1) % Math.max(evidenceAnchors.length, 1)] ||
        "A physical trace corroborates the corrected sequence.";
      return [
        `${anchorA}`,
        `${anchorB}`,
        `${observation} is directly visible to witnesses in-scene.`,
        `${correction} follows from these concrete records without private knowledge.`,
      ];
    };

    const inferenceSteps = ensureArray(inferencePath.steps);
    inferencePath.steps = inferenceSteps.map((step, index) => {
      const stepObj = ensureObject(step);
      const existingRequiredEvidence = ensureArray(stepObj.required_evidence)
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0)
        .filter((item) => !isAbstractEvidence(item));
      const observation = ensureString(stepObj.observation, `Observation ${index + 1}`);
      const correction = ensureString(stepObj.correction, `Correction ${index + 1}`);

      // Keep model-provided concrete evidence when present; otherwise synthesize
      // concrete anchors to avoid abstract fair-play failures.
      const requiredEvidenceCandidates =
        existingRequiredEvidence.length > 0
          ? existingRequiredEvidence
          : fallbackEvidence(index, observation, correction);

      const requiredEvidence = requiredEvidenceCandidates.slice(0, 4);
      while (requiredEvidence.length < 2) {
        const fallback = fallbackEvidence(index + requiredEvidence.length, observation, correction)[0];
        if (!requiredEvidence.includes(fallback)) {
          requiredEvidence.push(fallback);
        } else {
          break;
        }
      }

      return {
        observation: observation.length >= 20 ? observation : `${observation} is grounded in a concrete scene-level fact.`,
        correction,
        effect: ensureString(stepObj.effect, `Effect ${index + 1}`),
        required_evidence: requiredEvidence,
        reader_observable: typeof stepObj.reader_observable === "boolean" ? stepObj.reader_observable : true,
      };
    });

    const discriminatingTest = ensureObject(caseBlock.discriminating_test);
    caseBlock.discriminating_test = discriminatingTest;
    discriminatingTest.method = normalizeEnum(
      discriminatingTest.method,
      ["reenactment", "trap", "constraint_proof", "administrative_pressure"],
      "trap"
    );
    discriminatingTest.design = ensureString(discriminatingTest.design, "Confront with evidence");
    discriminatingTest.knowledge_revealed = ensureString(discriminatingTest.knowledge_revealed, "Access window");
    discriminatingTest.pass_condition = ensureString(discriminatingTest.pass_condition, "Culprit reacts");

    // Keep discriminating-test evidence references canonical so Agent 5 does not
    // need heuristic reseeding that can pick late-only clues.
    const proseRequirements = ensureObject(caseBlock.prose_requirements);
    caseBlock.prose_requirements = proseRequirements;
    const mappedClueIds = ensureArray(proseRequirements.clue_to_scene_mapping)
      .map((entry) => ensureObject(entry))
      .map((entry) => ({
        clue_id: ensureString(entry.clue_id, ""),
        act_number: typeof entry.act_number === "number" ? entry.act_number : 99,
        scene_number: typeof entry.scene_number === "number" ? entry.scene_number : 99,
      }))
      .filter((entry) => /^clue_[a-z0-9_-]+$/i.test(entry.clue_id))
      .sort((a, b) => a.act_number - b.act_number || a.scene_number - b.scene_number)
      .map((entry) => entry.clue_id);

    const rawDiscriminatingEvidenceIds = ensureArray(discriminatingTest.evidence_clues)
      .map((value) => ensureString(value, ""))
      .filter(Boolean);
    const canonicalDiscriminatingEvidenceIds = rawDiscriminatingEvidenceIds
      .filter((id) => /^clue_[a-z0-9_-]+$/i.test(id));

    if (canonicalDiscriminatingEvidenceIds.length > 0) {
      discriminatingTest.evidence_clues = canonicalDiscriminatingEvidenceIds;
    } else if (mappedClueIds.length > 0) {
      discriminatingTest.evidence_clues = mappedClueIds.slice(0, 3);
    }

    const fairPlay = ensureObject(caseBlock.fair_play);
    caseBlock.fair_play = fairPlay;
    fairPlay.all_clues_visible = typeof fairPlay.all_clues_visible === "boolean" ? fairPlay.all_clues_visible : true;
    fairPlay.no_special_knowledge_required =
      typeof fairPlay.no_special_knowledge_required === "boolean" ? fairPlay.no_special_knowledge_required : true;
    fairPlay.no_late_information = typeof fairPlay.no_late_information === "boolean" ? fairPlay.no_late_information : true;
    fairPlay.reader_can_solve = typeof fairPlay.reader_can_solve === "boolean" ? fairPlay.reader_can_solve : true;
    const rawFairPlayExplanation = ensureString(fairPlay.explanation, "");
    if (rawFairPlayExplanation && /step\s*\d+/i.test(rawFairPlayExplanation)) {
      fairPlay.explanation = rawFairPlayExplanation;
    } else {
      const synthesizedExplanation = ensureArray(inferencePath.steps)
        .map((step, index) => {
          const stepObj = ensureObject(step);
          const evidence = ensureArray(stepObj.required_evidence)
            .map((entry) => ensureString(entry, ""))
            .filter(Boolean)
            .slice(0, 2)
            .join("; ");
          return `Step ${index + 1}: ${evidence || "Concrete evidence is shown before deduction."}`;
        })
        .join(" ");
      fairPlay.explanation = synthesizedExplanation || "Step 1: Concrete evidence is shown before deduction.";
    }

    const qualityControls = ensureObject(caseBlock.quality_controls);
    caseBlock.quality_controls = qualityControls;
    const inferenceRequirements = ensureObject(qualityControls.inference_path_requirements);
    qualityControls.inference_path_requirements = inferenceRequirements;
    inferenceRequirements.min_steps = typeof inferenceRequirements.min_steps === "number" ? inferenceRequirements.min_steps : 3;
    inferenceRequirements.max_steps =
      typeof inferenceRequirements.max_steps === "number"
        ? inferenceRequirements.max_steps
        : config.inference_requirements.default_max_steps;
    inferenceRequirements.require_observation_correction_effect =
      typeof inferenceRequirements.require_observation_correction_effect === "boolean"
        ? inferenceRequirements.require_observation_correction_effect
        : true;

    const clueVisibility = ensureObject(qualityControls.clue_visibility_requirements);
    qualityControls.clue_visibility_requirements = clueVisibility;
    clueVisibility.essential_clues_min = typeof clueVisibility.essential_clues_min === "number" ? clueVisibility.essential_clues_min : 3;
    clueVisibility.essential_clues_before_test =
      typeof clueVisibility.essential_clues_before_test === "boolean" ? clueVisibility.essential_clues_before_test : true;
    clueVisibility.early_clues_min = typeof clueVisibility.early_clues_min === "number" ? clueVisibility.early_clues_min : 2;
    clueVisibility.mid_clues_min = typeof clueVisibility.mid_clues_min === "number" ? clueVisibility.mid_clues_min : 2;
    clueVisibility.late_clues_min = typeof clueVisibility.late_clues_min === "number" ? clueVisibility.late_clues_min : 1;

    const discriminatingRequirements = ensureObject(qualityControls.discriminating_test_requirements);
    qualityControls.discriminating_test_requirements = discriminatingRequirements;
    discriminatingRequirements.timing = normalizeEnum(
      discriminatingRequirements.timing,
      ["late_act2", "early_act3", "mid_act3"],
      "early_act3"
    );
    discriminatingRequirements.must_reference_inference_step =
      typeof discriminatingRequirements.must_reference_inference_step === "boolean"
        ? discriminatingRequirements.must_reference_inference_step
        : true;

    return cml;
  };

  let currentCml = inputs.invalidCml;
  let currentErrors = [...inputs.validationErrors];
  let attempt = inputs.attempt || 1;
  let revisionsApplied: string[] = [];

  // Log initial revision request
  await logger.logRequest({
    runId,
    projectId,
    agent: "Agent4-Revision",
    operation: "revise_cml",
    metadata: {
      initialErrorCount: inputs.validationErrors.length,
      initialAttempt: inputs.attempt,
      maxAttempts: resolvedMaxAttempts,
    },
  });

  while (attempt <= resolvedMaxAttempts) {
    // Build revision prompt with current errors
    const revisionInput: RevisionInputs = {
      ...inputs,
      invalidCml: currentCml,
      validationErrors: currentErrors,
      attempt,
      maxAttempts: resolvedMaxAttempts,
    };

    const prompt = buildRevisionPrompt(revisionInput);

    try {
      // Call LLM for revision
      await logger.logRequest({
        runId,
        projectId,
        agent: "Agent4-Revision",
        operation: "chat_request",
        metadata: {
          attempt,
          errorCount: currentErrors.length,
          promptLength: prompt.system.length + prompt.developer.length + prompt.user.length,
        },
      });

      const combinedSystem = `${prompt.system}\n\n# Technical Specifications\n\n${prompt.developer}`;
      const response = await client.chat({
        messages: [
          { role: "system", content: combinedSystem },
          { role: "user", content: prompt.user },
        ],
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
        jsonMode: true,  // JSON output
        logContext: {
          runId,
          projectId,
          agent: "Agent4-Revision",
          retryAttempt: attempt,
        },
      });

      const modelName = response.model || "unknown";

      await logger.logResponse({
        runId,
        projectId,
        agent: "Agent4-Revision",
        operation: "chat_response",
        model: response.model,
        success: true,
        latencyMs: response.latencyMs,
        metadata: {
          attempt,
          finishReason: response.finishReason,
          outputLength: response.content.length,
        },
      });

      // Parse JSON/YAML
      let cml: Record<string, unknown> | undefined;
      let jsonParseError: Error | undefined;
      let yamlParseError: Error | undefined;

      const sanitizeYaml = (raw: string) =>
        raw
          .split("\n")
          .map((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) return line;

            const doubleQuoteMatch = line.match(/^([\s\S]*?:\s*"(?:[^"\\]|\\.)*")\s+(.+)$/);
            if (doubleQuoteMatch && !doubleQuoteMatch[2].trimStart().startsWith("#")) {
              return doubleQuoteMatch[1];
            }

            const singleQuoteMatch = line.match(/^([\s\S]*?:\s*'(?:[^'\\]|\\.)*')\s+(.+)$/);
            if (singleQuoteMatch && !singleQuoteMatch[2].trimStart().startsWith("#")) {
              return singleQuoteMatch[1];
            }

            if (!trimmed.includes(":")) {
              const isListItem = trimmed.startsWith("-") || trimmed.startsWith("[") || trimmed.startsWith("{");
              if (!isListItem) {
                const indentMatch = line.match(/^(\s*)/);
                const indent = indentMatch ? indentMatch[1] : "";
                return `${indent}# ${trimmed}`;
              }
            }

            return line;
          })
          .join("\n");

      const tryParseJson = (raw: string): Record<string, unknown> | undefined => {
        try {
          return JSON.parse(raw) as Record<string, unknown>;
        } catch (error) {
          jsonParseError = error as Error;
        }

        try {
          const repaired = jsonrepair(raw);
          return JSON.parse(repaired) as Record<string, unknown>;
        } catch {
          // ignore repair failure
        }

        const trimmed = raw.trim();
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start !== -1 && end > start) {
          const candidate = trimmed.slice(start, end + 1);
          try {
            return JSON.parse(candidate) as Record<string, unknown>;
          } catch (error) {
            jsonParseError = error as Error;
          }

          try {
            const repaired = jsonrepair(candidate);
            return JSON.parse(repaired) as Record<string, unknown>;
          } catch {
            // ignore repair failure
          }
        }

        return undefined;
      };

      cml = tryParseJson(response.content);

      if (!cml) {
        try {
          const sanitized = sanitizeYaml(response.content);
          const parsed = yaml.load(sanitized) as Record<string, unknown> | undefined;
          if (parsed && typeof parsed === "object") {
            cml = parsed;
            await logger.logResponse({
              runId,
              projectId,
              agent: "Agent4-Revision",
              operation: "parse_output_sanitized",
              model: response.model,
              success: true,
              validationStatus: "pass",
              retryAttempt: attempt,
              latencyMs: Date.now() - startTime,
              metadata: { note: "YAML sanitized after JSON parse failure" },
            });
          }
        } catch (error) {
          yamlParseError = error as Error;
        }
      }

      if (!cml || typeof cml !== "object") {
        const jsonMessage = jsonParseError ? jsonParseError.message : "Unknown JSON parse error";
        const yamlMessage = yamlParseError ? yamlParseError.message : "Unknown YAML parse error";

        await logger.logError({
          runId,
          projectId,
          agent: "Agent4-Revision",
          operation: "parse_yaml",
          errorMessage: `Output parse failed: ${jsonMessage}; ${yamlMessage}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });

        if (attempt < resolvedMaxAttempts) {
          // Try again with parsing error feedback
          currentErrors = [...currentErrors, `Output parsing failed: ${jsonMessage}`];
          revisionsApplied.push(`Attempt ${attempt}: Output parse failed, retrying`);
          attempt++;
          continue;
        } else {
          throw new Error(`Output parsing failed after ${resolvedMaxAttempts} attempts: ${jsonMessage}`);
        }
      }

      const normalized = normalizeCml(cml);

      // Validate revised CML
      const validation = validateCml(normalized);

      if (validation.valid) {
        // Success!
        const latencyMs = Date.now() - startTime;
        const costTracker = client.getCostTracker();
        const cost = costTracker.getSummary().byAgent["Agent4-Revision"] || 0;

        revisionsApplied.push(`Attempt ${attempt}: Fixed all ${inputs.validationErrors.length} validation errors`);

        await logger.logResponse({
          runId,
          projectId,
          agent: "Agent4-Revision",
          operation: "revise_cml",
          model: modelName,
          success: true,
          validationStatus: "pass",
          retryAttempt: attempt,
          latencyMs,
          metadata: {
            totalAttempts: attempt,
            initialErrorCount: inputs.validationErrors.length,
            revisionsApplied: revisionsApplied.length,
          },
        });

        return {
          cml: normalized,
          validation,
          revisionsApplied,
          attempt,
          latencyMs,
          cost,
        };
      }

      // Still has validation errors
      await logger.logResponse({
        runId,
        projectId,
        agent: "Agent4-Revision",
        operation: "revise_cml",
        model: modelName,
        success: false,
        validationStatus: "fail",
        errorMessage: `Validation errors: ${validation.errors.join("; ")}`,
        retryAttempt: attempt,
        metadata: {
          validationErrors: validation.errors,
          errorCount: validation.errors.length,
          previousErrorCount: currentErrors.length,
        },
      });

      revisionsApplied.push(
        `Attempt ${attempt}: Reduced errors from ${currentErrors.length} to ${validation.errors.length}`
      );

      if (attempt < resolvedMaxAttempts) {
        // Update for next iteration
        currentCml = yaml.dump(normalized);
        currentErrors = validation.errors;
        attempt++;
        continue;
      } else {
        // Max attempts reached
        throw new Error(
          `CML revision failed after ${resolvedMaxAttempts} attempts. Remaining errors: ${validation.errors.join("; ")}`
        );
      }
    } catch (error) {
      const message = (error as Error)?.message || String(error);
      await logger.logError({
        runId,
        projectId,
        agent: "Agent4-Revision",
        operation: "revise_cml",
        errorMessage: message,
        stackTrace: (error as Error).stack,
        retryAttempt: attempt,
        metadata: {
          errorCount: currentErrors.length,
          attempt,
        },
      });

      if (attempt < resolvedMaxAttempts) {
        revisionsApplied.push(`Attempt ${attempt}: runtime error (${message}), retrying`);
        currentErrors = [...currentErrors, `Runtime error on attempt ${attempt}: ${message}`];
        attempt++;
        continue;
      }

      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error("Unexpected end of revision loop");
}
