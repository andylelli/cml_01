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

  const requiredSkeleton = `
**Required YAML Skeleton (do not omit any keys)**:

CML_VERSION: 2.0
CASE:
  meta:
    title: ""
    author: ""
    license: "CC-BY-4.0"
    era:
      decade: ""
      realism_constraints: []
    setting:
      location: ""
      institution: ""
    crime_class:
      category: "murder"
      subtype: ""
  cast:
    - name: ""
      age_range: ""
      role_archetype: ""
      relationships: []
      public_persona: ""
      private_secret: ""
      motive_seed: ""
      motive_strength: "moderate"
      alibi_window: ""
      access_plausibility: "medium"
      opportunity_channels: []
      behavioral_tells: []
      stakes: ""
      evidence_sensitivity: []
      culprit_eligibility: "eligible"
      culpability: "unknown"
  culpability:
    culprit_count: 1
    culprits: []
  surface_model:
    narrative:
      summary: ""
    accepted_facts: []
    inferred_conclusions: []
  hidden_model:
    mechanism:
      description: ""
      delivery_path: []
    outcome:
      result: ""
  false_assumption:
    statement: ""
    type: ""
    why_it_seems_reasonable: ""
    what_it_hides: ""
  constraint_space:
    time:
      anchors: []
      windows: []
      contradictions: []
    access:
      actors: []
      objects: []
      permissions: []
    physical:
      laws: []
      traces: []
    social:
      trust_channels: []
      authority_sources: []
  inference_path:
    steps: []
  discriminating_test:
    method: "trap"
    design: ""
    knowledge_revealed: ""
    pass_condition: ""
  fair_play:
    all_clues_visible: true
    no_special_knowledge_required: true
    no_late_information: true
    reader_can_solve: true
    explanation: ""
`;

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
Respond with ONLY valid JSON matching the CML 2.0 schema. No explanations, no markdown code blocks, no commentary.
Start immediately with the JSON object containing "CML_VERSION": 2.0 and the complete CASE structure.
Do not invent extra keys outside the schema. Do not omit any required keys. If unsure, use safe placeholder strings but keep required fields present.`;

  // Convert to Message array
  // Note: "developer" role not supported by Azure OpenAI, so merge into system message
  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}\n\n${requiredSkeleton}`;
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
    era.decade = ensureString(era.decade, inputs.decade);
    era.realism_constraints = ensureArray(era.realism_constraints);

    const setting = ensureObject(meta.setting);
    meta.setting = setting;
    setting.location = ensureString(setting.location, inputs.location);
    setting.institution = ensureString(setting.institution, inputs.institution);

    const crimeClass = ensureObject(meta.crime_class);
    meta.crime_class = crimeClass;
    crimeClass.category = ensureString(crimeClass.category, "murder");
    crimeClass.subtype = ensureString(crimeClass.subtype, "poisoning");

    const castArray = Array.isArray(caseBlock.cast) ? caseBlock.cast : [];
    const names = inputs.castNames?.length ? inputs.castNames : castArray.map((c) => (c as any)?.name).filter(Boolean);
    const normalizedCast = (names.length ? names : castArray.map((c) => (c as any)?.name).filter(Boolean)).map((name, index) => {
      const existing = ensureObject(castArray[index]);
      return {
        name: ensureString(existing.name, name || `Suspect ${index + 1}`),
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
    });
    caseBlock.cast = normalizedCast;

    const culpability = ensureObject(caseBlock.culpability);
    caseBlock.culpability = culpability;
    culpability.culprit_count = typeof culpability.culprit_count === "number" ? culpability.culprit_count : 1;
    const culpritNames = ensureArray(culpability.culprits);
    culpability.culprits = culpritNames.length ? culpritNames : [normalizedCast[0]?.name ?? "Unknown"].filter(Boolean);

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
    falseAssumption.type = ensureString(falseAssumption.type, inputs.primaryAxis);
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

    const discriminatingTest = ensureObject(caseBlock.discriminating_test);
    caseBlock.discriminating_test = discriminatingTest;
    discriminatingTest.method = ensureString(discriminatingTest.method, "trap");
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

  let lastError: Error | undefined;
  let lastValidation: any = { valid: false, errors: ["No attempts made"] };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Generate CML
      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model:
          process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
          process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 ||
          "gpt-4o",
        temperature: 0.7,
        maxTokens: 8000, // gpt-4.1 supports higher token limits
        jsonMode: true, // JSON output
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          retryAttempt: attempt,
        },
      });

      // Parse JSON/YAML
      let cml: any;
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

      const tryParseJson = (raw: string): any => {
        try {
          return JSON.parse(raw);
        } catch (error) {
          jsonParseError = error as Error;
        }

        const trimmed = raw.trim();
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start !== -1 && end > start) {
          const candidate = trimmed.slice(start, end + 1);
          try {
            return JSON.parse(candidate);
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
          cml = parseYAML(sanitized);

          await logger.logResponse({
            runId: inputs.runId,
            projectId: inputs.projectId,
            agent: "Agent3-CMLGenerator",
            operation: "parse_output_sanitized",
            model: "gpt-4",
            success: true,
            validationStatus: "pass",
            retryAttempt: attempt,
            latencyMs: Date.now() - startTime,
            metadata: { note: "YAML sanitized after parse failure" },
          });
        } catch (error) {
          yamlParseError = error as Error;
        }
      }

      if (!cml) {
        const jsonMessage = jsonParseError ? jsonParseError.message : "Unknown JSON parse error";
        const yamlMessage = yamlParseError ? yamlParseError.message : "Unknown YAML parse error";

        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3-CMLGenerator",
          operation: "parse_yaml",
          errorMessage: `Output parse failed: ${jsonMessage}; ${yamlMessage}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });

        if (attempt < maxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`Output parsing failed after ${maxAttempts} attempts: ${jsonMessage}`);
        }
      }

      const normalized = normalizeCml(cml as Record<string, unknown>);

      // Validate against CML schema
      const validation = validateCml(normalized);
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
          cml: normalized,
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
