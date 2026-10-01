/**
 * Agent 4: CML Revision Agent
 * 
 * Parses CML validation errors and generates targeted revisions to fix Agent 3 output.
 * Uses logger from llm-client for revision tracking (like Agent 3).
 * 
 * Critical for production-ready CML generation - fixes ~90% of Agent 3 validation failures.
 */

import { ensureObject, normalizeCmlForRevision } from "./cml/normalize.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import type { PromptComponents } from "./types.js";
import { validateCml, verifiedFixesEnabled } from "@cml/cml";
import { resolveDesignModel } from "./utils/model-tiers.js";
import yaml from "js-yaml";
import { loadYamlReply, parseLlmJson } from "./shared/llm-json.js";

export interface RevisionInputs {
  originalPrompt: PromptComponents;  // Original Agent 3 prompt for context
  invalidCml: string;                // YAML string that failed validation
  validationErrors: string[];        // List of validation error messages
  attempt: number;                   // Current revision attempt (1-5)
  maxAttempts?: number;              // Max revision attempts for prompt context
  runId?: string;                    // For logging
  projectId?: string;                // For logging
  /** A34-08: the case's primary axis, printed as "Mystery Axis" when CML_VERIFIED_FIXES is on. */
  primaryAxis?: string;
}

/**
 * A34-08 (owner decision 12, CML_VERIFIED_FIXES): the "Mystery Axis" line printed the first 200 characters of Agent
 * 3's user prompt (its setting block, not the axis). ON, and when the caller passes the axis, it prints the axis.
 */
function mysteryAxisLine(inputs: RevisionInputs): string {
  if (verifiedFixesEnabled() && inputs.primaryAxis) return inputs.primaryAxis;
  return `${inputs.originalPrompt.user.substring(0, 200)}...`;
}

interface RevisionResultBase {
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
 * A34-11 (R1): the revision result is a discriminated union on a REQUIRED `degraded`, so a caller cannot read
 * `cml` without the type naming the degraded arm. It was `degraded?: boolean`, and the Agent 6 caller installed
 * the CML without reading it. Values are unchanged: `degraded` was absent on a clean success (now `false`, which
 * every reader already treated the same) and `stillInvalid` on the exhaustion path.
 */
export type RevisionResult =
  | (RevisionResultBase & {
      /** A clean success, or a best-so-far that turned out valid after exhaustion. */
      degraded: false;
      unresolvedLogicWarnings?: undefined;
    })
  | (RevisionResultBase & {
      /** The budget was exhausted and best-so-far was returned instead of throwing; `validation` is invalid. */
      degraded: true;
      /** The unresolved validation errors (carried forward as warnings). */
      unresolvedLogicWarnings: string[];
    });

function hasRequiredEvidenceMissingSignal(error: string): boolean {
  const lowered = error.toLowerCase();
  return (
    lowered.includes("required_evidence")
    && (lowered.includes("is required") || lowered.includes("missing") || lowered.includes("empty"))
  );
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

  // A_53 P11 (categorize-typeerror-catchall-mislabels): the validator has no numeric codes, so we key
  // off the stable substring each `errors.push(...)` emits, ordered MOST-SPECIFIC-FIRST. The old code
  // used `else -> typeErrors` plus `includes("must be")`, which (a) swept fair-play/coverage/quality
  // messages ("is too short/abstract", "missing or empty", "relies on detective-only") into "Type
  // Errors", and (b) mis-caught allowed/quality messages whose text contains "must be" (e.g. the
  // too-short message "...must be a concrete, scene-level fact"). The earliest matching predicate wins.
  type Categorizer = (e: string) => boolean;
  const matchers: Array<[Categorizer, string[]]> = [
    // Missing required fields (schema-required + required_evidence absence).
    [(e) => e.includes("is required") || hasRequiredEvidenceMissingSignal(e), missingRequired],
    // Reader-visible grounding gap (most specific phrase, checked before any "must be" branch).
    [(e) => e.includes("not grounded in reader-visible inference evidence"), groundingErrors],
    // Fair-play / coverage / inference-quality messages — keep them OUT of "Type Errors". These all
    // carry a stable substring even when their text also contains the word "must be".
    [
      (e) =>
        e.includes("is too short")
        || e.includes("is too brief")
        || e.includes("is too abstract")
        || e.includes("is missing or empty")
        || e.includes("is a duplicate")
        || e.includes("relies on detective-only")
        || e.includes("reader_observable is false"),
      groundingErrors,
    ],
    // Allowed-value (enum) errors — must precede the generic "must be" type branch.
    [(e) => e.includes("must be one of"), allowedValueErrors],
    // Genuine schema type mismatches ("X must be <type>") — the narrow trailing case.
    [(e) => /\bmust be (string|number|boolean|object|array)\b/.test(e), typeErrors],
  ];

  for (const error of errors) {
    const matched = matchers.find(([predicate]) => predicate(error));
    if (matched) {
      matched[1].push(error);
    } else {
      // Unknown/unmatched error format — surface it as a type error so it is never silently dropped.
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
  const { invalidCml, validationErrors, attempt, maxAttempts } = inputs;
  const promptMaxAttempts = typeof maxAttempts === "number" && maxAttempts > 0 ? maxAttempts : 5;
  const requiredEvidenceGapErrors = validationErrors.filter(hasRequiredEvidenceMissingSignal);
  const hasStructuralFairPlayCoverageError = validationErrors.some((error) =>
    /fair-play clue coverage remains structurally insufficient/i.test(error),
  );
  const enforceRequiredEvidenceFirstPassContract =
    requiredEvidenceGapErrors.length > 0 || hasStructuralFairPlayCoverageError;

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

  if (enforceRequiredEvidenceFirstPassContract) {
    developer += `### First-Pass Required-Evidence Contract (non-negotiable)

- Apply this contract across the entire revision output, regardless of error-class branch.
- Do not weaken these invariants when fixing non-required_evidence errors.

- Preserve the existing \'inference_path.steps\' count and order. Do not drop, merge, or reorder steps.
- Every step MUST include \'required_evidence\' with 2-4 concrete, reader-visible entries.
- Do NOT return any step without \'required_evidence\'.
- Do NOT use abstract placeholders in \'required_evidence\' (e.g., \'timeline discrepancy\', \'suspicious behavior\', \'detective insight\').
- If a step is missing evidence, synthesize concrete entries from that step's observation/correction plus existing constraint-space anchors.
- Keep the revision surgical: fix structure and evidence completeness first, then preserve all unaffected narrative content.

`;
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

**Mystery Axis**: ${mysteryAxisLine(inputs)}

`;

  // User prompt: The actual revision task
  const structuralInvariantsBlock = `

## Non-Negotiable Inference-Step Structural Invariants (FIRST PASS)

- These invariants apply to every revision pass regardless of validation error category.
- Never drop or dilute these invariants to satisfy an unrelated branch fix.

- For EVERY \'inference_path.steps[i]\', retain \'required_evidence\'.
- For EVERY \'inference_path.steps[i]\', \'required_evidence\' MUST contain 2-4 entries.
- Every \'required_evidence\' entry MUST be concrete and reader-visible (objects, traces, timestamps, witness statements, document details).
- Forbidden abstract placeholders in \'required_evidence\': "timeline discrepancy", "suspicious behavior", "detective insight", "inconsistency", "anomaly".
- If any step has missing, empty, or abstract \'required_evidence\', replace it with concrete evidence sourced from that step's observation/correction and existing CML facts.
- Do NOT remove steps, collapse steps, or delete \'required_evidence\' to force validation.

`;

  const requiredEvidenceContractBlock = enforceRequiredEvidenceFirstPassContract
    ? `

## First-Pass Required-Evidence Contract (MANDATORY)

- Preserve the current \'inference_path.steps\' count and order exactly.
- Every \'inference_path.steps[i]\' MUST include \'required_evidence\' with 2-4 non-empty, concrete entries.
- Do NOT output any step that omits \'required_evidence\'.
- Do NOT use abstract placeholders such as: "timeline discrepancy", "suspicious behavior", "detective insight".
- If evidence is missing, synthesize concrete evidence from the same step's observation/correction and existing CML constraint anchors.

## Required Self-Check (perform internally before final output)

1. Iterate all \'inference_path.steps[i]\'.
2. Verify \'required_evidence\' exists and length is between 2 and 4.
3. Verify each evidence entry is concrete and reader-visible.
4. If any check fails, self-correct before emitting final JSON.
`
    : "";

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
${structuralInvariantsBlock}
${requiredEvidenceContractBlock}

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

  const normalizeCml = (raw: Record<string, unknown>) => {
    return normalizeCmlForRevision(raw, config);
  };

  let currentCml = inputs.invalidCml;
  let currentErrors = [...inputs.validationErrors];
  // A_53 P11 (parse-error-feedback-bloats-prompt): transient parse/runtime failures are tracked in a
  // SINGLE replaced note (not accumulated into `currentErrors`), so the schema-error list fed to the
  // prompt stays clean across attempts instead of growing with stale "Output parsing failed: ..." and
  // "Runtime error on attempt N: ..." lines that the model would treat as schema errors to fix.
  let lastAttemptFailureNote: string | undefined;
  let attempt = inputs.attempt || 1;
  let revisionsApplied: string[] = [];
  // A_53 P2 convergence guard: consecutive passes that fail to reduce the error count.
  let noProgressStreak = 0;

  // Phase 0 (graceful degrade — documentation/12_system_redesign/09_agent_4_cml_revision.md §9.2):
  // budget/attempt exhaustion returns the best CML we have plus structured warnings instead of
  // throwing — a CML that merely "ran out of revisions" no longer kills the whole run.
  // A_53 P2 (graceful-degrade-default-off-kills-runs): default ON; set AGENT4_GRACEFUL_DEGRADE to
  // off/false/0/disabled to restore the strict throw-on-exhaustion behavior for reproducible eval.
  const gracefulDegrade = !["0", "false", "off", "disabled", "no"].includes(
    (process.env.AGENT4_GRACEFUL_DEGRADE ?? "").trim().toLowerCase(),
  );

  // A_53 P3 (cost-budget-not-enforced): an optional hard $ ceiling on Agent 4 spend. The cost tracker
  // was read for reporting only; now spend exceeding AGENT4_MAX_COST_USD breaks to degrade (unset =
  // no ceiling, today's behavior). Only enforced when graceful degrade is available to fall back to.
  const maxCostUsd = (() => {
    const raw = Number.parseFloat((process.env.AGENT4_MAX_COST_USD ?? "").trim());
    return Number.isFinite(raw) && raw > 0 ? raw : Infinity;
  })();

  let bestNormalized: Record<string, unknown> | undefined;
  let bestValidation: { valid: boolean; errors: string[] } = { valid: false, errors: [...inputs.validationErrors] };
  const recordCandidate = (candidate: Record<string, unknown>, validation: { valid: boolean; errors: string[] }) => {
    if (!bestNormalized || validation.errors.length < bestValidation.errors.length) {
      bestNormalized = candidate;
      bestValidation = validation;
    }
  };
  if (gracefulDegrade) {
    // seed the baseline from the original invalid CML, normalized, so degrade always has something
    try {
      const original = yaml.load(inputs.invalidCml) as Record<string, unknown> | undefined;
      if (original && typeof original === "object") {
        // A_53 P11 (degrade-seed-double-normalize-mutation): normalizeCml mutates in place, so calling
        // it twice meant the candidate object stored differed from the object that was validated.
        // Normalize once and reuse the SAME reference for both the candidate and its validation.
        const normalizedOriginal = normalizeCml(original);
        recordCandidate(normalizedOriginal, validateCml(normalizedOriginal));
      }
    } catch {
      // ignore — bestNormalized may stay undefined; degrade falls back to the raw parse
    }
  }

  const degrade = async (reason: string): Promise<RevisionResult> => {
    return await degradeRevision({ attempt, bestNormalized, bestValidation, client, inputs, logger, normalizeCml, projectId, reason, revisionsApplied, runId, startTime });
  };

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

    // A_53 P11 (parse-error-feedback-bloats-prompt): inject the SINGLE most-recent transient-failure
    // note (parse/runtime) as a clearly-separated heads-up, replaced every attempt — never accumulated
    // into the schema-error sections that buildRevisionPrompt categorizes.
    if (lastAttemptFailureNote) {
      prompt.user += `\n\n## Last Attempt Failed Because\n\n- ${lastAttemptFailureNote}\n- Return a single, complete, valid JSON document this time.`;
    }

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
        // A34-Q05 (owner decision 12, CR-32): the design tier, as Agents 3/3b/5/6/7 — the YAML's 5→3 attempt cut
        // assumes "a capable design model". AGENT4_MODEL outranks it (ORC-Q07).
        model: resolveDesignModel(),
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
      let { cml, jsonParseError, yamlParseError } = await parseRevisionReply(response, logger, runId, projectId, attempt, startTime);

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
          // A_53 P11 (parse-error-feedback-bloats-prompt): record the parse failure as the single
          // replaced note instead of appending it to the schema-error list (which the prompt would
          // otherwise present as a validation error to fix).
          lastAttemptFailureNote = `Output parsing failed: ${jsonMessage}`;
          revisionsApplied.push(`Attempt ${attempt}: Output parse failed, retrying`);
          attempt++;
          continue;
        } else if (gracefulDegrade) {
          return await degrade(`output parse failed: ${jsonMessage}`);
        } else {
          throw new Error(`Output parsing failed after ${resolvedMaxAttempts} attempts: ${jsonMessage}`);
        }
      }

      const normalized = normalizeCml(cml);

      // A_53 P11 (parse-error-feedback-bloats-prompt): output parsed this attempt, so any prior
      // transient parse/runtime note is resolved — clear it so the next prompt isn't told about a
      // failure that no longer applies.
      lastAttemptFailureNote = undefined;

      // Validate revised CML
      const validation = validateCml(normalized);
      recordCandidate(normalized, validation);

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
          degraded: false, // A34-11: was absent; every reader treats absent and false alike
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

      // A_53 P2 (convergence guard): if a pass fails to reduce the error count, count it; after 2
      // consecutive non-reducing passes, stop burning LLM calls and degrade to best-so-far (when
      // degrade is enabled — the default). A stuck loop that can't converge shouldn't pay full budget.
      if (validation.errors.length < currentErrors.length) {
        noProgressStreak = 0;
      } else {
        noProgressStreak += 1;
      }
      if (gracefulDegrade && noProgressStreak >= 2 && attempt < resolvedMaxAttempts) {
        revisionsApplied.push(
          `Stopping early after ${noProgressStreak} non-reducing passes (errors stuck at ${validation.errors.length}).`,
        );
        return await degrade(`no convergence (${noProgressStreak} non-reducing passes)`);
      }

      // A_53 P3 (cost-budget-not-enforced): cap total Agent 4 spend when a $ ceiling is configured.
      if (gracefulDegrade && maxCostUsd !== Infinity) {
        const spentSoFar = client.getCostTracker().getSummary().byAgent["Agent4-Revision"] || 0;
        if (spentSoFar > maxCostUsd) {
          revisionsApplied.push(
            `Cost budget exceeded ($${spentSoFar.toFixed(4)} > $${maxCostUsd.toFixed(4)}); degrading to best-so-far.`,
          );
          return await degrade(`cost budget exceeded ($${spentSoFar.toFixed(4)})`);
        }
      }

      if (attempt < resolvedMaxAttempts) {
        // Update for next iteration
        currentCml = yaml.dump(normalized);
        currentErrors = validation.errors;
        attempt++;
        continue;
      } else if (gracefulDegrade) {
        // Degrade, don't die: return best-so-far with the unresolved errors as warnings.
        return await degrade("max revision attempts reached");
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
        // A_53 P11 (parse-error-feedback-bloats-prompt): replace the single transient-failure note
        // rather than accumulating runtime-error text into the schema-error list.
        lastAttemptFailureNote = `Runtime error on attempt ${attempt}: ${message}`;
        attempt++;
        continue;
      }

      if (gracefulDegrade) {
        return await degrade(`runtime error: ${message}`);
      }
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error("Unexpected end of revision loop");
}

/**
 * A34-07 — one Agent 4 reply to a CML: the guarded JSON ladder, then the YAML fallback. Moved out
 * of the revision loop, which retries when neither parses.
 */
async function parseRevisionReply(response: Awaited<ReturnType<AzureOpenAIClient["chat"]>>, logger: ReturnType<AzureOpenAIClient["getLogger"]>, runId: string, projectId: string, attempt: number, startTime: number) {
  let cml: Record<string, unknown> | undefined;
  let jsonParseError: Error | undefined;
  let yamlParseError: Error | undefined;

  // CR-20: the one parse ladder, span strict then repaired. Guarded since owner decision 3 (ORC-Q03,
  // A34-D07): unguarded, jsonrepair turned a well-formed YAML reply into an array, so the YAML fallback below
  // never ran and a valid revision degraded; and a truncated full-CML re-emission was closed, not refused.
  const tryParseJson = (raw: string): Record<string, unknown> | undefined => {
    const parsed = parseLlmJson<Record<string, unknown>>(raw, { guard: true, extract: "strict+repair" });
    if (parsed.parseError) jsonParseError = parsed.parseError;
    return parsed.data;
  };

  cml = tryParseJson(response.content);

  if (!cml) {
    try {
      const reply = loadYamlReply(response.content, (text) => yaml.load(text));
      const parsed = reply.value as Record<string, unknown> | undefined;
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
          metadata: { note: reply.sanitized ? "YAML sanitized after JSON parse failure" : "YAML reply parsed as written" },
        });
      }
    } catch (error) {
      yamlParseError = error as Error;
    }
  }
  return { cml, jsonParseError, yamlParseError };
}

async function degradeRevision({ attempt, bestNormalized, bestValidation, client, inputs, logger, normalizeCml, projectId, reason, revisionsApplied, runId, startTime }: { attempt: number; bestNormalized: Record<string, unknown> | undefined; bestValidation: { valid: boolean; errors: string[] }; client: AzureOpenAIClient; inputs: RevisionInputs; logger: ReturnType<AzureOpenAIClient["getLogger"]>; normalizeCml: (raw: Record<string, unknown>) => Record<string, unknown>; projectId: string; reason: string; revisionsApplied: string[]; runId: string; startTime: number }) {
  const latencyMs = Date.now() - startTime;
  const cost = client.getCostTracker().getSummary().byAgent["Agent4-Revision"] || 0;
  // A_53 P6 (no-revalidation-after-grounding-mutation-in-degrade): when there is no recorded
  // candidate, normalize + validate the raw parse so the returned `validation` actually describes
  // the returned CML — the raw fallback was previously shipped with the ORIGINAL doc's validation,
  // a mismatch (normalize grounds + repairs, which changes the error set).
  let fallbackCml: Record<string, unknown>;
  let fallbackValidation = bestValidation;
  let noCandidate = false;
  if (bestNormalized) {
    fallbackCml = bestNormalized;
  } else {
    // No real parse candidate was ever recorded (e.g. unparseable output) — fabricate a normalized
    // skeleton so cml + validation are CONSISTENT, but this is ALWAYS a degrade (meaningless
    // defaults), never a clean success even if the skeleton happens to validate.
    noCandidate = true;
    fallbackCml = normalizeCml(ensureObject(yaml.load(inputs.invalidCml)));
    fallbackValidation = validateCml(fallbackCml);
  }
  // If the best-so-far is actually valid (e.g. the aggressive normalizer recovered a real candidate),
  // return it as a clean success; only mark `degraded` when validation genuinely remains unresolved
  // OR there was no real candidate to begin with.
  const stillInvalid = noCandidate || !fallbackValidation.valid;
  const unresolvedWarnings = !stillInvalid
    ? undefined
    : fallbackValidation.errors.length > 0
      ? fallbackValidation.errors
      : ["No parseable CML candidate after exhaustion; returned a normalized skeleton."];
  revisionsApplied.push(
    stillInvalid
      ? `Degraded after exhaustion (${reason}) — returning best-so-far with ${unresolvedWarnings!.length} unresolved warning(s).`
      : `Recovered a valid CML on the best-so-far candidate after exhaustion (${reason}).`,
  );
  await logger.logResponse({
    runId,
    projectId,
    agent: "Agent4-Revision",
    operation: "revise_cml_degraded",
    model: "n/a",
    success: !stillInvalid,
    validationStatus: stillInvalid ? "fail" : "pass",
    retryAttempt: attempt,
    latencyMs,
    metadata: { reason, unresolvedErrorCount: unresolvedWarnings?.length ?? 0 },
  });
  const base = { cml: fallbackCml, validation: fallbackValidation, revisionsApplied, attempt, latencyMs, cost };
  // A34-11: the same two values as before (`degraded: stillInvalid`, warnings only when degraded), split by arm.
  return stillInvalid
    ? { ...base, degraded: true as const, unresolvedLogicWarnings: unresolvedWarnings! }
    : { ...base, degraded: false as const, unresolvedLogicWarnings: undefined };
}

