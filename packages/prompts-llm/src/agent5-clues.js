/**
 * Agent 5: Clue Distribution & Red Herring Agent
 *
 * Analyzes validated CML and extracts/organizes clues for fair play.
 * Does NOT add new facts - only derives clues from existing CML structure.
 *
 * Uses logger from llm-client (like Agents 3 & 4).
 */
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
/**
 * ELEGANT SOLUTION: Pre-analyze CML to generate explicit clue requirements
 * Instead of passive "remember to cover all steps", we give a concrete checklist
 */
function generateExplicitClueRequirements(cml) {
    const requirements = [];
    const caseData = cml.CASE;
    // 1. Inference path coverage (observation + contradiction for each step)
    if (Array.isArray(caseData?.inference_path?.steps)) {
        caseData.inference_path.steps.forEach((step, idx) => {
            const stepNum = idx + 1;
            // Observation clue (makes the step visible to reader)
            requirements.push({
                requirement: `Generate a clue that makes the reader directly observe: "${(step.observation || '').substring(0, 100)}..."`,
                supportsInferenceStep: stepNum,
                evidenceType: "observation",
                criticality: "essential",
                sourceInCML: `inference_path.steps[${idx}].observation`,
                keyTerms: extractKeyTerms(step.observation),
                suggestedPlacement: stepNum <= 2 ? "early" : "mid",
                category: inferCategory(step.observation)
            });
            // Contradiction clue (challenges false assumption at this step)
            requirements.push({
                requirement: `Generate a clue that provides evidence for: "${(step.correction || '').substring(0, 100)}..."`,
                supportsInferenceStep: stepNum,
                evidenceType: "contradiction",
                criticality: "essential",
                sourceInCML: `inference_path.steps[${idx}].correction`,
                keyTerms: extractKeyTerms(step.correction),
                suggestedPlacement: stepNum <= 2 ? "early" : "mid",
                category: inferCategory(step.correction)
            });
        });
    }
    // 2. Discriminating test evidence
    // CRITICAL: These clues MUST be placed early or mid — they must reach the reader BEFORE the discriminating test scene.
    // The test should exploit already-known evidence, not introduce it for the first time.
    if (caseData?.discriminating_test?.design) {
        requirements.push({
            requirement: `Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "${(caseData.discriminating_test.design || '').substring(0, 100)}..."`,
            supportsInferenceStep: undefined, // Test synthesis, not a specific step
            evidenceType: "observation",
            criticality: "essential",
            sourceInCML: `discriminating_test.design`,
            keyTerms: extractKeyTerms(caseData.discriminating_test.design),
            suggestedPlacement: "mid", // Never late — must precede the test scene
            category: inferCategory(caseData.discriminating_test.design)
        });
    }
    // 2b. Culprit premeditation / planning evidence
    // If the culprit's guilt relies on premeditation, that must be reader-visible BEFORE confrontation.
    const culpritNames = Array.isArray(caseData?.culpability?.culprits) ? caseData.culpability.culprits : [];
    const culpritCast = Array.isArray(caseData?.cast)
        ? caseData.cast.filter((c) => culpritNames.includes(c.name))
        : [];
    culpritCast.forEach((culprit) => {
        if (culprit.motive_seed || culprit.private_secret) {
            requirements.push({
                requirement: `Generate a clue showing observable evidence of ${culprit.name}'s premeditation or planning (${culprit.motive_seed ?? culprit.private_secret ?? 'motive'}). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.`,
                supportsInferenceStep: undefined,
                evidenceType: "observation",
                criticality: "essential",
                sourceInCML: `cast[${culprit.name}].motive_seed`,
                keyTerms: extractKeyTerms(culprit.motive_seed ?? culprit.private_secret ?? ''),
                suggestedPlacement: "mid",
                category: "behavioral"
            });
        }
    });
    // 3. Suspect elimination clues
    if (Array.isArray(caseData?.cast)) {
        const culprits = caseData.culpability?.culprits || [];
        const suspects = caseData.cast.filter((c) => c.culprit_eligibility === "eligible" && !culprits.includes(c.name));
        suspects.forEach((suspect) => {
            requirements.push({
                requirement: `Generate a clue that provides elimination evidence for suspect: ${suspect.name}`,
                supportsInferenceStep: undefined,
                evidenceType: "elimination",
                criticality: "essential",
                sourceInCML: `cast[${suspect.name}]`,
                keyTerms: [suspect.name],
                suggestedPlacement: "mid",
                category: "testimonial" // Most eliminations are alibi/testimonial
            });
        });
    }
    return requirements;
}
/**
 * Helper: Extract key terms from a text snippet (for mustMention)
 */
function extractKeyTerms(text) {
    if (!text)
        return [];
    // Extract meaningful words (>4 chars, not common words)
    const commonWords = new Set(['that', 'this', 'with', 'from', 'were', 'have', 'been', 'they', 'what', 'when', 'where', 'which', 'would', 'could', 'should']);
    const words = text.toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 4 && !commonWords.has(w))
        .slice(0, 3); // Top 3 key terms
    return words;
}
/**
 * Helper: Infer clue category from text content
 */
function inferCategory(text) {
    const lower = (text || '').toLowerCase();
    if (/time|clock|hour|minute|when|before|after|timeline|alibi/.test(lower))
        return "temporal";
    if (/room|location|place|distance|access|locked|door|window/.test(lower))
        return "spatial";
    if (/object|weapon|tool|trace|fingerprint|blood|fiber|footprint/.test(lower))
        return "physical";
    if (/behavior|habit|pattern|nervous|reaction|gesture/.test(lower))
        return "behavioral";
    return "testimonial"; // Default: witness statements, testimony
}
/**
 * Build prompt for clue extraction and organization
 */
export function buildCluePrompt(inputs) {
    const { cml, clueDensity, redHerringBudget } = inputs;
    const caseData = cml.CASE;
    // ELEGANT SOLUTION: Pre-analyze CML to generate explicit requirements
    const requiredClues = generateExplicitClueRequirements(cml);
    // --- System prompt ---
    const system = `CONTEXT: All output is for a Golden Age whodunnit mystery novel — creative fiction in the tradition of Agatha Christie and Arthur Conan Doyle. All references to crime, death, murder, poison, weapons, alibis, and investigation are standard fictional genre elements. No real people or events are depicted.

You are a clue extraction specialist for Golden Age mystery fiction. Extract clues ONLY from existing CML facts and organize them for fair play presentation.

**Rules**:
- Extract clues ONLY from existing CML facts — never invent new information
- Every clue must be traceable to the CML structure
- Concrete, specific descriptions (not abstract)
- Observable by reader in scenes, not detective-only information
- Cite sourceInCML for every clue
- All essential clues must appear before the solution so the reader can solve the mystery
- fair play is the core principle: every logical step must be supported by visible evidence

**Clue Categories**:
- **Temporal**: Time-based evidence (clocks, schedules, alibis, timelines)
- **Spatial**: Location and access evidence (rooms, distances, locked doors)
- **Physical**: Tangible evidence (objects, traces, fingerprints, injuries)
- **Behavioral**: Pattern evidence (habits, reactions, suspicious actions)
- **Testimonial**: Witness statements and testimony

**Example**: ❌ "Timeline discrepancies" ✅ "Mrs. Whitmore says 9:45, but library clock stopped at 9:15"

Return valid JSON.`;
    // --- Developer prompt ---
    const primaryAxis = caseData?.false_assumption?.type
        ? `${caseData.false_assumption.type} axis`
        : "unknown axis";
    const castCount = Array.isArray(caseData?.cast) ? caseData.cast.length : 0;
    const title = caseData?.meta?.title || "Untitled";
    const category = caseData?.meta?.crime_class?.category || "crime";
    const falseAssumptionStatement = caseData?.false_assumption?.statement || "N/A";
    // Constraint space
    const constraintSpace = caseData?.constraint_space ?? {};
    const timeAnchors = constraintSpace.time?.anchors ?? [];
    const timeContradictions = constraintSpace.time?.contradictions ?? [];
    const accessActors = constraintSpace.access?.actors ?? [];
    const accessObjects = constraintSpace.access?.objects ?? [];
    const physicalTraces = constraintSpace.physical?.traces ?? [];
    // Evidence-sensitive characters
    const evidenceSensitiveChars = Array.isArray(caseData?.cast)
        ? caseData.cast.filter((c) => Array.isArray(c.evidence_sensitivity) && c.evidence_sensitivity.length > 0)
        : [];
    // Density details
    const densityDetails = {
        minimal: { label: "minimal", count: "5-8 essential clues", range: "0-2" },
        moderate: { label: "moderate", count: "8-12 clues", range: "2-4" },
        dense: { label: "dense", count: "12-18 clues", range: "4-6" },
    };
    const densityInfo = densityDetails[clueDensity];
    let developer = `## CML Summary
**Title**: ${title}
**Crime**: ${category}
**Primary axis**: ${primaryAxis}
**Cast**: ${castCount} characters

## Mandatory Clue Requirements (${requiredClues.length} required)
`;
    requiredClues.forEach((req, idx) => {
        developer += `${idx + 1}. ${req.requirement}\n`;
        developer += `   → ${req.evidenceType} | ${req.criticality} | ${req.suggestedPlacement} | ${req.category}`;
        if (req.supportsInferenceStep)
            developer += ` | step ${req.supportsInferenceStep}`;
        if (req.keyTerms.length > 0)
            developer += ` | terms: ${req.keyTerms.join(', ')}`;
        developer += `\n\n`;
    });
    developer += `## Temporal Constraints
${[...timeAnchors, ...timeContradictions].map(a => `- ${a}`).join('\n') || 'None'}

## Access Constraints
Actors: ${accessActors.join(', ') || 'None'}
Objects: ${accessObjects.join(', ') || 'None'}

## Physical Evidence
${physicalTraces.map(t => `- ${t}`).join('\n') || 'None'}

`;
    if (evidenceSensitiveChars.length > 0) {
        developer += `## Evidence-Sensitive Characters\n`;
        for (const char of evidenceSensitiveChars) {
            developer += `- ${char.name}: sensitive items: ${char.evidence_sensitivity.join(', ')}\n`;
        }
        developer += `\n`;
    }
    developer += `## Clue Density: ${densityInfo.label}
Generate ${densityInfo.count} total. Additional optional clues (${densityInfo.range} extra) for texture.

## Red Herring Budget: ${redHerringBudget}
`;
    if (redHerringBudget > 0) {
        developer += `Create ${redHerringBudget} red herrings that support the false assumption: "${falseAssumptionStatement}"\n\n`;
    }
    else {
        developer += `No red herrings requested.\n\n`;
    }
    developer += `## Clue Placement Strategy
- Early (Act I): essential clues, set up the puzzle, introduce key observations
- Mid (Act II): supporting clues, deepen investigation, complicate the picture
- Late (Act III): optional clues, final revelations, confirm the solution

Criticality levels:
- essential: reader must see this to follow the detective's logic
- supporting: reinforces key deductions without being critical
- optional: adds texture and atmosphere

`;
    const qualityControls = caseData?.quality_controls ?? {};
    const clueTargets = qualityControls?.clue_visibility_requirements ?? {};
    if (Object.keys(qualityControls).length > 0) {
        developer += `## Quality Controls (from CML)
- Essential clues minimum: ${clueTargets.essential_clues_min ?? "N/A"}
- Essential clues before test: ${String(clueTargets.essential_clues_before_test ?? "N/A")}
- Early clues minimum: ${clueTargets.early_clues_min ?? "N/A"}
- Mid clues minimum: ${clueTargets.mid_clues_min ?? "N/A"}
- Late clues minimum: ${clueTargets.late_clues_min ?? "N/A"}

If targets conflict with clue density, prioritize fair play (essential clues and early placement).

`;
    }
    if (inputs.fairPlayFeedback) {
        const { overallStatus, violations = [], warnings = [], recommendations = [] } = inputs.fairPlayFeedback;
        developer += `## Fair Play Audit Feedback
Status: **${overallStatus ?? "needs-review"}**

Violations: ${violations.length > 0 ? violations.map((v, i) => `${i + 1}. [${v.severity}] ${v.rule}: ${v.description}`).join('; ') : 'None'}
Warnings: ${warnings.join('; ') || 'None'}
Recommendations: ${recommendations.join('; ') || 'None'}

Regeneration: Adjust placement so essential clues appear before the discriminating test.

`;
    }
    developer += `## Output JSON Schema
\`\`\`json
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "Concrete, specific clue description",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
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
  ]
}
\`\`\``;
    // --- User prompt ---
    const densityCountText = { minimal: "5-8", moderate: "8-12", dense: "12-18" };
    const rhUserText = redHerringBudget > 0 ? ` and ${redHerringBudget} red herrings` : "";
    const user = `Extract and organize clues from this mystery CML.

Generate ${densityCountText[clueDensity]} clues${rhUserText} that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- DISCRIMINATING TEST CLUES: Any clue that enables the discriminating test to make sense must be placed "early" or "mid". The discriminating test scene exploits knowledge the reader already has — it must NEVER be the reader's first exposure to the mechanism detail.
- PREMEDITATION CLUES: If the culprit's guilt depends on premeditation or planning, that evidence must be a separate reader-visible clue placed "early" or "mid". The detective cannot withhold this from the reader until confrontation.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above`;
    return {
        system,
        developer,
        user,
    };
}
/**
 * Extract and organize clues from validated CML
 */
export async function extractClues(client, inputs) {
    const config = getGenerationParams().agent5_clues.params;
    const startTime = Date.now();
    const logger = client.getLogger();
    const runId = inputs.runId || `clues-${Date.now()}`;
    const projectId = inputs.projectId || "unknown";
    await logger.logRequest({
        runId,
        projectId,
        agent: "Agent5-ClueExtraction",
        operation: "extract_clues",
        metadata: {
            clueDensity: inputs.clueDensity,
            redHerringBudget: inputs.redHerringBudget,
        },
    });
    // Build prompt
    const prompt = buildCluePrompt(inputs);
    try {
        // Call LLM with JSON mode
        await logger.logRequest({
            runId,
            projectId,
            agent: "Agent5-ClueExtraction",
            operation: "chat_request",
        });
        const expandedMaxTokens = Math.min(12000, Math.max(config.model.max_tokens + 1200, Math.floor(config.model.max_tokens * 1.5)));
        const runClueCall = async (retryAttempt, maxTokens, userMessage) => client.chat({
            messages: [
                { role: "system", content: prompt.system },
                { role: "developer", content: prompt.developer },
                { role: "user", content: userMessage },
            ],
            temperature: config.model.temperature,
            maxTokens,
            jsonMode: true,
            logContext: {
                runId,
                projectId,
                agent: "Agent5-ClueExtraction",
                retryAttempt,
            },
        });
        let response = await runClueCall(0, config.model.max_tokens, prompt.user);
        // Prevent parse failures by proactively handling token-truncated JSON output.
        if (response.finishReason === "length") {
            await logger.logError({
                runId,
                projectId,
                agent: "Agent5-ClueExtraction",
                operation: "chat_truncated_retry",
                errorMessage: `Clue response hit token limit at ${config.model.max_tokens}; retrying with ${expandedMaxTokens}`,
                metadata: {
                    firstFinishReason: response.finishReason,
                    firstMaxTokens: config.model.max_tokens,
                    retryMaxTokens: expandedMaxTokens,
                },
            });
            response = await runClueCall(1, expandedMaxTokens, `${prompt.user}\n\nPrevious output was truncated. Return complete valid JSON only.`);
        }
        await logger.logResponse({
            runId,
            projectId,
            agent: "Agent5-ClueExtraction",
            operation: "chat_response",
            model: response.model,
            success: true,
            latencyMs: response.latencyMs,
        });
        const parseClueResponse = (raw) => {
            const tryParse = (text) => {
                if (!text || !text.trim()) {
                    throw new Error("Empty clue response");
                }
                return JSON.parse(text);
            };
            try {
                return tryParse(raw);
            }
            catch {
                // continue to repair fallback
            }
            try {
                return tryParse(jsonrepair(raw));
            }
            catch {
                // continue to object extraction fallback
            }
            const firstBrace = raw.indexOf("{");
            const lastBrace = raw.lastIndexOf("}");
            if (firstBrace >= 0 && lastBrace > firstBrace) {
                const candidate = raw.slice(firstBrace, lastBrace + 1);
                try {
                    return tryParse(candidate);
                }
                catch {
                    return tryParse(jsonrepair(candidate));
                }
            }
            throw new Error("Unable to parse clue extraction JSON payload");
        };
        let clueData;
        try {
            clueData = parseClueResponse(response.content);
        }
        catch (parseError) {
            await logger.logError({
                runId,
                projectId,
                agent: "Agent5-ClueExtraction",
                operation: "parse_clues_response",
                errorMessage: parseError.message,
                metadata: {
                    retry: "regenerate_once",
                    rawPreview: response.content.substring(0, 500),
                },
            });
            // One targeted regeneration attempt for malformed/truncated JSON payloads.
            const retryResponse = await runClueCall(2, expandedMaxTokens, `${prompt.user}\n\nPrevious output was invalid JSON (likely truncated). Return strictly valid, complete JSON only.`);
            clueData = parseClueResponse(retryResponse.content);
        }
        if (!Array.isArray(clueData?.clues)) {
            throw new Error("Clue extraction payload missing clues array");
        }
        if (!Array.isArray(clueData?.redHerrings)) {
            clueData.redHerrings = [];
        }
        // WP3D: Validate supportsInferenceStep and evidenceType on parsed clues
        for (const clue of clueData.clues) {
            if (clue.criticality === "essential" && !clue.supportsInferenceStep) {
                clue.supportsInferenceStep = 0; // Flag as unmapped for guardrail to catch
            }
            if (!clue.evidenceType) {
                clue.evidenceType = "observation"; // Default
            }
        }
        // Organize clues by placement
        const clueTimeline = {
            early: clueData.clues
                .filter((c) => c.placement === "early")
                .map((c) => c.id),
            mid: clueData.clues
                .filter((c) => c.placement === "mid")
                .map((c) => c.id),
            late: clueData.clues
                .filter((c) => c.placement === "late")
                .map((c) => c.id),
        };
        // Fair play checks
        const essentialClues = clueData.clues.filter((c) => c.criticality === "essential");
        const fairPlayChecks = {
            allEssentialCluesPresent: essentialClues.length >= 3, // Minimum viable
            noNewFactsIntroduced: clueData.clues.every((c) => c.sourceInCML && c.sourceInCML.trim() !== "" && c.sourceInCML !== "N/A"),
            redHerringsDontBreakLogic: clueData.redHerrings.length <= inputs.redHerringBudget,
        };
        const latencyMs = Date.now() - startTime;
        const costTracker = client.getCostTracker();
        const cost = costTracker.getSummary().byAgent["Agent5-ClueExtraction"] || 0;
        const modelName = response.model || "unknown";
        await logger.logResponse({
            runId,
            projectId,
            agent: "Agent5-ClueExtraction",
            operation: "extract_clues",
            model: modelName,
            success: true,
            latencyMs,
            metadata: {
                clueCount: clueData.clues.length,
                redHerringCount: clueData.redHerrings.length,
                essentialClueCount: essentialClues.length,
                fairPlayPassed: Object.values(fairPlayChecks).every(Boolean),
            },
        });
        return {
            clues: clueData.clues,
            redHerrings: clueData.redHerrings || [],
            clueTimeline,
            fairPlayChecks,
            latencyMs,
            cost,
        };
    }
    catch (error) {
        await logger.logError({
            runId,
            projectId,
            agent: "Agent5-ClueExtraction",
            operation: "extract_clues",
            errorMessage: error.message,
            stackTrace: error.stack,
        });
        throw error;
    }
}
//# sourceMappingURL=agent5-clues.js.map