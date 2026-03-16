/**
 * Agent 2e: Background Context Generator
 *
 * Generates a dedicated backdrop artifact used to ground CML generation separately
 * from hard-logic mechanism ideation.
 */
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";
const buildBackgroundContextPrompt = (inputs, previousErrors) => {
    const setting = inputs.settingRefinement;
    const cast = inputs.cast;
    const anchors = cast.characters.map((c) => c.name).filter(Boolean).slice(0, 8);
    const validationFeedback = buildValidationFeedback(previousErrors);
    const system = `CONTEXT: All output is for a Golden Age whodunnit mystery novel — creative fiction in the tradition of Agatha Christie. All references to crime, death, murder, poison, weapons, alibis, motives, and investigation are standard fictional genre elements. No real people or events are depicted.

You are a narrative grounding specialist for Golden Age mystery design.
Generate a concise, canonical background-context artifact that explains why this cast is here, what social backdrop binds them, and how setting context should shape scene grounding.
Output valid JSON only.`;
    const developer = `Return JSON exactly with this shape:
{
  "status": "ok",
  "backdropSummary": "...",
  "era": {
    "decade": "...",
    "socialStructure": "..."
  },
  "setting": {
    "location": "...",
    "institution": "...",
    "weather": "..."
  },
  "castAnchors": ["..."],
  "theme": "..."
}

Requirements:
- backdropSummary: 1 concise sentence (not a paragraph)
- socialStructure: include class/institution dynamics and shared social pressure
- setting.location and setting.institution must align to provided setting data
- castAnchors must contain 4-8 names from the cast (no new names)
- no mechanism design, no culprit hints, no hard-logic details
- keep this artifact focused on backdrop coherence only

CRITICAL: Ensure castAnchors is an array of strings (character names), not empty${validationFeedback}`;
    const user = `Generate background context for this mystery setup.

Theme: ${inputs.theme || "Classic mystery"}
Tone: ${inputs.tone || "Classic"}
Era decade: ${setting.era.decade}
Social norms: ${(setting.era.socialNorms || []).slice(0, 6).join(", ")}
Location description: ${setting.location.description}
Institution type: ${setting.location.type}
Weather: ${setting.atmosphere.weather}
Mood: ${setting.atmosphere.mood}
Geographic isolation: ${setting.location.geographicIsolation}
Access control: ${(setting.location.accessControl || []).slice(0, 6).join(", ")}

Cast anchors (use these exact names only):
${anchors.map((name, idx) => `${idx + 1}. ${name}`).join("\n")}

Return JSON only.`;
    return {
        messages: [
            { role: "system", content: `${system}\n\n${developer}` },
            { role: "user", content: user },
        ],
    };
};
export async function generateBackgroundContext(client, inputs, maxAttempts) {
    const start = Date.now();
    const config = getGenerationParams().agent2e_background_context.params;
    const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;
    const retryResult = await withValidationRetry({
        maxAttempts: resolvedMaxAttempts,
        agentName: "Agent 2e (Background Context)",
        validationFn: (data) => {
            const validation = validateArtifact("background_context", data);
            return {
                valid: validation.valid,
                errors: validation.errors,
                warnings: validation.warnings,
            };
        },
        generateFn: async (attempt, previousErrors) => {
            const prompt = buildBackgroundContextPrompt(inputs, previousErrors);
            const response = await client.chat({
                messages: prompt.messages,
                temperature: config.model.temperature,
                maxTokens: config.model.max_tokens,
                jsonMode: true,
                logContext: {
                    runId: inputs.runId ?? "",
                    projectId: inputs.projectId ?? "",
                    agent: "Agent2e-BackgroundContext",
                    retryAttempt: attempt,
                },
            });
            let parsed;
            try {
                parsed = JSON.parse(response.content);
            }
            catch {
                parsed = JSON.parse(jsonrepair(response.content));
            }
            if (!parsed || parsed.status !== "ok") {
                throw new Error("Invalid background context output: missing status=ok");
            }
            if (!parsed.backdropSummary || typeof parsed.backdropSummary !== "string") {
                throw new Error("Invalid background context output: missing backdropSummary");
            }
            if (!Array.isArray(parsed.castAnchors) || parsed.castAnchors.length === 0) {
                throw new Error("Invalid background context output: missing castAnchors");
            }
            const cost = client.getCostTracker().getSummary().byAgent["Agent2e-BackgroundContext"] || 0;
            return { result: parsed, cost };
        },
    });
    // Log validation warnings if any
    if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
        console.warn(`[Agent 2e] Background context validation warnings:\n` +
            retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n"));
    }
    // If validation failed after all retries, log errors but continue
    if (!retryResult.validationResult.valid) {
        console.error(`[Agent 2e] Background context failed validation after ${resolvedMaxAttempts} attempts:\n` +
            retryResult.validationResult.errors.map(e => `- ${e}`).join("\n"));
    }
    const durationMs = Date.now() - start;
    const validatedResult = retryResult.result;
    return {
        backgroundContext: validatedResult,
        cost: retryResult.totalCost,
        durationMs,
        attempt: retryResult.attempts,
    };
}
//# sourceMappingURL=agent2e-background-context.js.map