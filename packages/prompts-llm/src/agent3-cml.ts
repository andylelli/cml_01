/**
 * Agent 3: CML Generator - Prompt building and generation
 * This is the CORE agent - the backbone of the mystery generation system
 */

import type { AzureOpenAIClient, LLMLogger, Message } from "@cml/llm-client";
import { parse as parseYAML } from "yaml";
import { validateCml } from "@cml/cml";
import { reviseCml } from "./agent4-revision.js";
import yaml from "js-yaml";
import type { CMLPromptInputs, CMLGenerationResult, PromptMessages } from "./types.js";
import {
  MYSTERY_EXPERT_SYSTEM,
  CML_SPECIALIST_SYSTEM,
  FAIR_PLAY_CHECKLIST,
} from "./shared/system.js";
import {
  buildEraConstraints,
  buildLocationConstraints,
} from "./shared/constraints.js";
import {
  CML_2_0_SCHEMA_SUMMARY,
  AXIS_TYPE_DESCRIPTIONS,
} from "./shared/schemas.js";
import {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "./utils/seed-loader.js";
import { join } from "path";

/**
 * Build the complete prompt for CML generation
 */
export function buildCMLPrompt(inputs: CMLPromptInputs, examplesDir?: string): PromptMessages {
  // Load seed patterns if examples directory provided
  let seedPatternsText = "No seed patterns loaded (will generate from first principles).";
  if (examplesDir) {
    try {
      const cmlFiles = loadSeedCMLFiles(examplesDir);
      const patterns = extractStructuralPatterns(cmlFiles);
      const relevantPatterns = selectRelevantPatterns(patterns, inputs.primaryAxis, 3);
      seedPatternsText = formatPatternsForPrompt(relevantPatterns);
    } catch (error) {
      console.warn("Failed to load seed patterns:", error);
    }
  }

  // Build novelty constraints section
  let noveltyText = "";
  if (inputs.noveltyConstraints) {
    noveltyText = `
**Novelty Constraints**:
You must diverge from these seed cases: ${inputs.noveltyConstraints.divergeFrom.join(", ")}

Required divergence in these areas:
${inputs.noveltyConstraints.areas.map(area => `- ${area}`).join("\n")}

Specific patterns to avoid:
${inputs.noveltyConstraints.avoidancePatterns.map(pattern => `- ${pattern}`).join("\n")}

Your mystery must be structurally novel - use seeds for CML format only, not content.`;
  }

  // System message
  const system = `${CML_SPECIALIST_SYSTEM}

${MYSTERY_EXPERT_SYSTEM}`;

  // Developer message with schema and seed patterns
  const developer = `**CML 2.0 Schema Reference**:
${CML_2_0_SCHEMA_SUMMARY}

---

**Primary Axis Types**:
${AXIS_TYPE_DESCRIPTIONS}

---

**Seed CML Structural Patterns** (for CML format inspiration only - DO NOT COPY CONTENT):
${seedPatternsText}

---

${noveltyText}

---

**Era Constraints**:
${buildEraConstraints(inputs.decade)}

---

**Location Constraints**:
${buildLocationConstraints(inputs.location, inputs.institution)}

---

${FAIR_PLAY_CHECKLIST}`;

  // User message with specific requirements
  const user = `Create a complete mystery case in CML 2.0 format with these exact specifications:

**Setting & Era**:
- Decade: ${inputs.decade}
- Location: ${inputs.location}
- Institution: ${inputs.institution}
- Weather: ${inputs.weather}
- Social Structure: ${inputs.socialStructure}
- Tone: ${inputs.tone}

**Cast Requirements**:
- Cast Size: ${inputs.castSize} characters
- Use these exact names: ${inputs.castNames.join(", ")}
- Detective Type: ${inputs.detectiveType}
- Victim Archetype: ${inputs.victimArchetype}

**Mystery Logic**:
- Primary Axis: ${inputs.primaryAxis}
- False Assumption Type: Must be ${inputs.primaryAxis} (matching axis)
- Complexity Level: ${inputs.complexityLevel}
- Mechanism Families: ${inputs.mechanismFamilies.join(", ")}

**Requirements**:
1. Generate complete CML 2.0 YAML document
2. Start with "CML_VERSION: 2.0"
3. Build entire mystery around the **${inputs.primaryAxis}** axis
4. False assumption MUST be type: ${inputs.primaryAxis}
5. Use ALL provided character names in cast section
6. Create mechanism that exploits the false assumption
7. Design constraint space with 5-8 constraints that hide the truth
8. Build inference path with 3-5 logical steps
9. Create discriminating test appropriate for ${inputs.primaryAxis} axis
10. Ensure all fair-play checklist items are true
11. Ground every clue in mechanism or constraint violations

**Output Format**:
Respond with ONLY valid CML 2.0 YAML. No explanations, no markdown code blocks, no commentary.
Start immediately with "CML_VERSION: 2.0" and continue with complete CASE structure.`;

  // Convert to Message array
  // Note: "developer" role not supported by Azure OpenAI, so merge into system message
  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}`;
  const messages: Message[] = [
    { role: "system", content: combinedSystem },
    { role: "user", content: user },
  ];

  return {
    system,
    developer,
    user,
    messages,
  };
}

/**
 * Generate CML with retry loop and validation
 */
export async function generateCML(
  client: AzureOpenAIClient,
  inputs: CMLPromptInputs,
  examplesDir?: string,
  maxAttempts = 3
): Promise<CMLGenerationResult> {
  const logger = client.getLogger();
  const startTime = Date.now();

  // Build prompt
  const prompt = buildCMLPrompt(inputs, examplesDir);

  let lastError: Error | undefined;
  let lastValidation: any = { valid: false, errors: ["No attempts made"] };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Generate CML
      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "gpt-4.1", // Deployment name, not model name
        temperature: 0.7,
        maxTokens: 8000, // gpt-4.1 supports higher token limits
        jsonMode: false, // YAML output
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          retryAttempt: attempt,
        },
      });

      // Parse YAML
      let cml: any;
      try {
        cml = parseYAML(response.content);
      } catch (parseError) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "parse_yaml",
          errorMessage: `YAML parse failed: ${(parseError as Error).message}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });
        
        if (attempt < maxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`YAML parsing failed after ${maxAttempts} attempts: ${(parseError as Error).message}`);
        }
      }

      // Validate against CML schema
      const validation = validateCml(cml);
      lastValidation = validation;

      const latencyMs = Date.now() - startTime;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent3-CMLGenerator"] || 0;

      if (validation.valid) {
        // Success!
        await logger.logResponse({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "generate_cml",
          model: "gpt-4",
          success: true,
          validationStatus: "pass",
          retryAttempt: attempt,
          latencyMs,
          metadata: {
            axis: inputs.primaryAxis,
            castSize: inputs.castSize,
            complexity: inputs.complexityLevel,
          },
        });

        return {
          cml,
          validation,
          attempt,
          latencyMs,
          cost,
        };
      }

      // Validation failed
      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3-CMLGenerator",
        operation: "generate_cml",
        model: "gpt-4",
        success: false,
        validationStatus: "fail",
        errorMessage: `Validation errors: ${validation.errors.join("; ")}`,
        retryAttempt: attempt,
        latencyMs,
        metadata: {
          validationErrors: validation.errors,
          axis: inputs.primaryAxis,
        },
      });

      if (attempt < maxAttempts) {
        // Will retry
        continue;
      } else {
        // Max attempts reached - call Agent 4 (Revision) to fix validation errors
        await logger.logRequest({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "calling_agent4_revision",
          metadata: {
            validationErrorCount: validation.errors.length,
            agent3Attempts: maxAttempts,
          },
        });

        try {
          const revisionResult = await reviseCml(client, {
            originalPrompt: { 
              system: prompt.system, 
              developer: prompt.developer || "", 
              user: prompt.user 
            },
            invalidCml: yaml.dump(cml),
            validationErrors: validation.errors,
            attempt: 1,
            runId: inputs.runId,
            projectId: inputs.projectId,
          });

          // Agent 4 succeeded! Return the fixed CML
          const totalLatency = Date.now() - startTime;
          const costTracker = client.getCostTracker();
          const totalCost = costTracker.getSummary().byAgent["Agent3-CMLGenerator"] || 0;
          const revisionCost = costTracker.getSummary().byAgent["Agent4-Revision"] || 0;

          await logger.logResponse({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "generate_cml_with_revision",
            model: "gpt-4",
            success: true,
            validationStatus: "pass",
            retryAttempt: attempt,
            latencyMs: totalLatency,
            metadata: {
              agent3Attempts: maxAttempts,
              agent4Attempts: revisionResult.attempt,
              totalRevisions: revisionResult.revisionsApplied.length,
              agent3Cost: totalCost,
              agent4Cost: revisionCost,
              totalCost: totalCost + revisionCost,
              axis: inputs.primaryAxis,
            },
          });

          return {
            cml: revisionResult.cml,
            validation: revisionResult.validation,
            attempt: maxAttempts + revisionResult.attempt,
            latencyMs: totalLatency,
            cost: totalCost + revisionCost,
            revisedByAgent4: true,
            revisionDetails: {
              attempts: revisionResult.attempt,
              revisionsApplied: revisionResult.revisionsApplied,
            },
          };
        } catch (revisionError) {
          // Agent 4 also failed - throw with context
          await logger.logError({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "agent4_revision_failed",
            errorMessage: (revisionError as Error).message,
            metadata: {
              agent3Attempts: maxAttempts,
              originalErrors: validation.errors,
            },
          });

          throw new Error(
            `CML generation failed after Agent 3 (${maxAttempts} attempts) and Agent 4 revision. ` +
            `Original errors: ${validation.errors.slice(0, 5).join("; ")}... ` +
            `Revision error: ${(revisionError as Error).message}`
          );
        }
      }
    } catch (error) {
      lastError = error as Error;
      
      await logger.logError({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3-CMLGenerator",
        operation: "generate_cml",
        errorMessage: (error as Error).message,
        retryAttempt: attempt,
        metadata: { attempt, maxAttempts },
      });

      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error(`CML generation failed: ${lastValidation.errors.join("; ")}`);
}
