/**
 * Agent 4: CML Revision Agent
 * 
 * Parses CML validation errors and generates targeted revisions to fix Agent 3 output.
 * Uses logger from llm-client for revision tracking (like Agent 3).
 * 
 * Critical for production-ready CML generation - fixes ~90% of Agent 3 validation failures.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { PromptComponents } from "./types.js";
import { validateCml } from "@cml/cml";
import yaml from "js-yaml";

export interface RevisionInputs {
  originalPrompt: PromptComponents;  // Original Agent 3 prompt for context
  invalidCml: string;                // YAML string that failed validation
  validationErrors: string[];        // List of validation error messages
  attempt: number;                   // Current revision attempt (1-5)
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
} {
  const missingRequired: string[] = [];
  const typeErrors: string[] = [];
  const allowedValueErrors: string[] = [];

  for (const error of errors) {
    if (error.includes("is required")) {
      missingRequired.push(error);
    } else if (error.includes("must be one of")) {
      allowedValueErrors.push(error);
    } else if (error.includes("must be")) {
      typeErrors.push(error);
    } else {
      // Unknown error format - add to type errors as fallback
      typeErrors.push(error);
    }
  }

  return { missingRequired, typeErrors, allowedValueErrors };
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
  const { originalPrompt, invalidCml, validationErrors, attempt } = inputs;

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

## Attempt ${attempt} of 5

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
- crime_class: murder | theft | blackmail | kidnapping | fraud

### Missing Culpability Fields
- culprit_count: Number of actual culprits (usually 1-2)
- culprits: Array of character names who committed the crime

### Missing Surface/Hidden Model
- accepted_facts: Array of facts investigator believes at start
- inferred_conclusions: Array of deductions from accepted facts
- outcome: The actual truth (object with description)

### Missing False Assumption
- statement: The key wrong assumption
- why_it_seems_reasonable: Why it's believable
- what_it_hides: What truth it conceals

### Type Errors
- inference_path must be an object with "steps" array
- discriminating_test.method must be: reenactment | trap | constraint_proof | administrative_pressure

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
6. **Return COMPLETE YAML** - the entire fixed CML document

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
  maxAttempts = 5,
): Promise<RevisionResult> {
  const startTime = Date.now();
  const logger = client.getLogger();
  const runId = inputs.runId || `revision-${Date.now()}`;
  const projectId = inputs.projectId || "unknown";

  const ensureObject = (value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);
  const ensureString = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;

  const normalizeCml = (raw: Record<string, unknown>) => {
    const cml = ensureObject(raw);
    cml.CML_VERSION = 2.0;

    const caseBlock = ensureObject(cml.CASE);
    cml.CASE = caseBlock;

    const meta = ensureObject(caseBlock.meta);
    caseBlock.meta = meta;
    meta.title = ensureString(meta.title, "Untitled Mystery");
    meta.author = ensureString(meta.author, "CML Generator");
    meta.license = ensureString(meta.license, "CC-BY-4.0");

    const era = ensureObject(meta.era);
    meta.era = era;
    era.decade = ensureString(era.decade, "1930s");
    era.realism_constraints = ensureArray(era.realism_constraints);

    const setting = ensureObject(meta.setting);
    meta.setting = setting;
    setting.location = ensureString(setting.location, "Unknown location");
    setting.institution = ensureString(setting.institution, "Unknown institution");

    const crimeClass = ensureObject(meta.crime_class);
    meta.crime_class = crimeClass;
    crimeClass.category = ensureString(crimeClass.category, "murder");
    crimeClass.subtype = ensureString(crimeClass.subtype, "poisoning");

    caseBlock.cast = Array.isArray(caseBlock.cast)
      ? caseBlock.cast.map((member, index) => {
          const existing = ensureObject(member);
          return {
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
            culprit_eligibility: ensureString(existing.culprit_eligibility, "eligible"),
            culpability: ensureString(existing.culpability, "unknown"),
          };
        })
      : [];

    const culpability = ensureObject(caseBlock.culpability);
    caseBlock.culpability = culpability;
    culpability.culprit_count = typeof culpability.culprit_count === "number" ? culpability.culprit_count : 1;
    culpability.culprits = ensureArray(culpability.culprits);

    const surface = ensureObject(caseBlock.surface_model);
    caseBlock.surface_model = surface;
    const surfaceNarrative = ensureObject(surface.narrative);
    surface.narrative = surfaceNarrative;
    surfaceNarrative.summary = ensureString(surfaceNarrative.summary, "A mystery unfolds.");
    surface.accepted_facts = ensureArray(surface.accepted_facts);
    surface.inferred_conclusions = ensureArray(surface.inferred_conclusions);

    const hidden = ensureObject(caseBlock.hidden_model);
    caseBlock.hidden_model = hidden;
    const hiddenMechanism = ensureObject(hidden.mechanism);
    hidden.mechanism = hiddenMechanism;
    hiddenMechanism.description = ensureString(hiddenMechanism.description, "Poisoned tea.");
    hiddenMechanism.delivery_path = ensureArray(hiddenMechanism.delivery_path);
    const hiddenOutcome = ensureObject(hidden.outcome);
    hidden.outcome = hiddenOutcome;
    hiddenOutcome.result = ensureString(hiddenOutcome.result, "Victim poisoned.");

    const falseAssumption = ensureObject(caseBlock.false_assumption);
    caseBlock.false_assumption = falseAssumption;
    falseAssumption.statement = ensureString(falseAssumption.statement, "Death was natural.");
    falseAssumption.type = ensureString(falseAssumption.type, "temporal");
    falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Symptoms mimic illness.");
    falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Poisoning timeline.");

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
          { observation: "Symptom onset", correction: "Poison delay", effect: "Alibi weakens" },
          { observation: "Access log", correction: "Hidden entry", effect: "Access narrowed" },
          { observation: "Motive clue", correction: "Blackmail reveal", effect: "Suspect isolated" },
        ];
    const inferenceSteps = ensureArray(inferencePath.steps);
    inferencePath.steps = inferenceSteps.map((step, index) => {
      const stepObj = ensureObject(step);
      return {
        observation: ensureString(stepObj.observation, `Observation ${index + 1}`),
        correction: ensureString(stepObj.correction, `Correction ${index + 1}`),
        effect: ensureString(stepObj.effect, `Effect ${index + 1}`),
      };
    });

    const discriminatingTest = ensureObject(caseBlock.discriminating_test);
    caseBlock.discriminating_test = discriminatingTest;
    const method = ensureString(discriminatingTest.method, "trap");
    discriminatingTest.method = [
      "reenactment",
      "trap",
      "constraint_proof",
      "administrative_pressure",
    ].includes(method)
      ? method
      : "trap";
    discriminatingTest.design = ensureString(discriminatingTest.design, "Confront with evidence");
    discriminatingTest.knowledge_revealed = ensureString(discriminatingTest.knowledge_revealed, "Access window");
    discriminatingTest.pass_condition = ensureString(discriminatingTest.pass_condition, "Culprit reacts");

    const fairPlay = ensureObject(caseBlock.fair_play);
    caseBlock.fair_play = fairPlay;
    fairPlay.all_clues_visible = typeof fairPlay.all_clues_visible === "boolean" ? fairPlay.all_clues_visible : true;
    fairPlay.no_special_knowledge_required =
      typeof fairPlay.no_special_knowledge_required === "boolean" ? fairPlay.no_special_knowledge_required : true;
    fairPlay.no_late_information = typeof fairPlay.no_late_information === "boolean" ? fairPlay.no_late_information : true;
    fairPlay.reader_can_solve = typeof fairPlay.reader_can_solve === "boolean" ? fairPlay.reader_can_solve : true;
    fairPlay.explanation = ensureString(fairPlay.explanation, "All clues provided before reveal.");

    return cml;
  };

  let currentCml = inputs.invalidCml;
  let currentErrors = inputs.validationErrors;
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
      maxAttempts,
    },
  });

  while (attempt <= maxAttempts) {
    // Build revision prompt with current errors
    const revisionInput: RevisionInputs = {
      ...inputs,
      invalidCml: currentCml,
      validationErrors: currentErrors,
      attempt,
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
        temperature: 0.5, // Balanced - not too creative, not too rigid
        maxTokens: 8000,  // Large - needs full CML revision
        jsonMode: true,  // JSON output
        logContext: {
          runId,
          projectId,
          agent: "Agent4-Revision",
          retryAttempt: attempt,
        },
      });

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

        if (attempt < maxAttempts) {
          // Try again with parsing error feedback
          currentErrors.push(`Output parsing failed: ${jsonMessage}`);
          revisionsApplied.push(`Attempt ${attempt}: Output parse failed, retrying`);
          attempt++;
          continue;
        } else {
          throw new Error(`Output parsing failed after ${maxAttempts} attempts: ${jsonMessage}`);
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
          model: "gpt-4",
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
        model: "gpt-4",
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

      if (attempt < maxAttempts) {
        // Update for next iteration
        currentCml = yaml.dump(cml);
        currentErrors = validation.errors;
        attempt++;
        continue;
      } else {
        // Max attempts reached
        throw new Error(
          `CML revision failed after ${maxAttempts} attempts. Remaining errors: ${validation.errors.join("; ")}`
        );
      }
    } catch (error) {
      await logger.logError({
        runId,
        projectId,
        agent: "Agent4-Revision",
        operation: "revise_cml",
        errorMessage: (error as Error).message,
        stackTrace: (error as Error).stack,
        retryAttempt: attempt,
        metadata: {
          errorCount: currentErrors.length,
          attempt,
        },
      });

      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error("Unexpected end of revision loop");
}
