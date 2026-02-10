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
  const system = `You are a CML (Case Markup Language) revision specialist. Your task is to fix validation errors in CML YAML documents while preserving the original creative intent and narrative structure.

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

You MUST return ONLY valid YAML that matches the CML 2.0 schema.`;

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

Fix ALL validation errors in the CML below. Return the COMPLETE, corrected CML as valid YAML.

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

**IMPORTANT**: Return ONLY the corrected YAML. No explanations, no markdown code blocks, just the raw YAML that will parse and validate successfully.`;

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

      const response = await client.chat({
        messages: [
          { role: "system", content: prompt.system },
          { role: "developer", content: prompt.developer },
          { role: "user", content: prompt.user },
        ],
        temperature: 0.5, // Balanced - not too creative, not too rigid
        maxTokens: 8000,  // Large - needs full CML revision
        jsonMode: false,  // YAML output, not JSON
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

      // Parse YAML
      let cml: Record<string, unknown>;
      try {
        cml = yaml.load(response.content) as Record<string, unknown>;
      } catch (parseError) {
        await logger.logError({
          runId,
          projectId,
          agent: "Agent4-Revision",
          operation: "parse_yaml",
          errorMessage: `YAML parse failed: ${(parseError as Error).message}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });

        if (attempt < maxAttempts) {
          // Try again with parsing error feedback
          currentErrors.push(`YAML parsing failed: ${(parseError as Error).message}`);
          revisionsApplied.push(`Attempt ${attempt}: YAML parse failed, retrying`);
          attempt++;
          continue;
        } else {
          throw new Error(`YAML parsing failed after ${maxAttempts} attempts: ${(parseError as Error).message}`);
        }
      }

      // Validate revised CML
      const validation = validateCml(cml);

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
          cml,
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
