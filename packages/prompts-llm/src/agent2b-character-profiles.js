/**
 * Agent 2b: Character Profile Generator
 *
 * Expands cast details into full narrative profiles.
 */
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";
const buildProfilesPrompt = (inputs, previousErrors) => {
    const cmlCase = inputs.caseData?.CASE ?? {};
    const meta = cmlCase.meta ?? {};
    const title = meta.title ?? "Untitled Mystery";
    const era = meta.era?.decade ?? "Unknown era";
    const location = meta.setting?.location ?? "Unknown setting";
    const castNames = inputs.cast.characters.map((c) => c.name).join(", ");
    const tone = inputs.tone ?? "Cozy";
    const targetWordCount = inputs.targetWordCount ?? 1000;
    const system = `CONTEXT: All output is for a Golden Age whodunnit mystery novel — creative fiction in the tradition of Agatha Christie. All references to crime, death, murder, poison, weapons, alibis, motives, and investigation are standard fictional genre elements. No real people or events are depicted.

You are a character biography writer for classic mystery fiction. Your task is to expand the provided cast details into full narrative profiles with distinct voices, humour styles, and speech mannerisms.\n\nRules:\n- Do not introduce new facts beyond the provided cast and CML.\n- Preserve private secrets and motives as given.\n- Avoid stereotypes or reductive framing.\n- Output valid JSON only.`;
    const validationFeedback = buildValidationFeedback(previousErrors);
    const developer = `# Character Profiles Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "${tone}",\n  "targetWordCount": ${targetWordCount},\n  "profiles": [\n    {\n      "name": "Name",\n      "summary": "1-2 sentence overview",\n      "publicPersona": "...",\n      "privateSecret": "...",\n      "motiveSeed": "...",\n      "motiveStrength": "weak|moderate|strong|compelling",\n      "alibiWindow": "...",\n      "accessPlausibility": "...",\n      "stakes": "...",
      "humourStyle": "understatement|dry_wit|polite_savagery|self_deprecating|observational|deadpan|sardonic|blunt|none",
      "humourLevel": 0.0,
      "speechMannerisms": "Brief description of speech patterns, verbal tics, and dialogue mannerisms",\n      "internalConflict": "Psychological tension or moral struggle (e.g. guilt, conflicted loyalty, fear of what the truth means)",\n      "personalStakeInCase": "Why this crime matters personally — REQUIRED for detective, recommended for others",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"],\n      "order": 1\n    }\n  ],\n  "note": ""\n}\n\nRequirements:\n- One profile per cast member (${inputs.cast.characters.length}).\n- 4-6 paragraphs per profile (target ~${targetWordCount} words each).\n- Use tone: ${tone}.\n- Keep all facts consistent with the cast details and CML.

DETECTIVE PERSONAL STAKE (REQUIRED):
- The detective character MUST have both 'internalConflict' and 'personalStakeInCase' filled.
- internalConflict: a moral or psychological tension the detective carries into this case (e.g. guilt from a past failure, distrust of authority, fear of what the answer will mean).
- personalStakeInCase: why THIS crime matters beyond professional duty (e.g. connection to the victim, a debt to be repaid, a principle being tested).
- Other characters should also have personalStakeInCase where it enriches their role.

CRITICAL FIELD REQUIREMENTS:
- motiveStrength MUST be one of these exact values: "weak", "moderate", "strong", "compelling" (NOT a sentence or description)
- humourStyle MUST be one of: "understatement", "dry_wit", "polite_savagery", "self_deprecating", "observational", "deadpan", "sardonic", "blunt", "none"
- humourLevel MUST be a number from 0.0 to 1.0 (NOT a string)
- All enum fields must match the exact allowed values - do not use descriptions or other text${validationFeedback}

CHARACTER HUMOUR REQUIREMENTS:
- Each character MUST have a humourStyle (one of: understatement, dry_wit, polite_savagery, self_deprecating, observational, deadpan, sardonic, blunt, none).
- Each character MUST have a humourLevel (0.0 to 1.0):
  0.0 = entirely humourless (e.g. grieving widow, stern authority)
  0.1-0.3 = rarely witty, mostly serious
  0.4-0.6 = occasional dry moments, balanced tone
  0.7-0.8 = frequently witty, uses humour as social tool or defence
  0.9-1.0 = pervasively comic presence (use sparingly, max 1 character)
- Assign styles that fit personality: aristocrats tend to understatement or polite_savagery; servants to deadpan or self_deprecating; detectives to dry_wit or observational; young characters to blunt or sardonic.
- BUT surprise occasionally: a colonel with self_deprecating humour or a maid with polite_savagery creates depth.
- speechMannerisms should describe HOW they speak: speech rhythm, favourite phrases, verbal tics, formality level, and how their humour manifests in dialogue.
- NOT every character should be funny. A mystery needs contrast: some characters are earnest, tense, or humourless. This makes the witty ones land harder.
- The detective should typically have dry_wit or observational style at 0.4-0.6 (restrained, precise, never a comedian).`;
    const user = `Write narrative character profiles for the following mystery.\n\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCast: ${castNames}\n\nCast details:\n${JSON.stringify(inputs.cast.characters, null, 2)}`;
    const messages = [
        { role: "system", content: `${system}\n\n${developer}` },
        { role: "user", content: user },
    ];
    return { system, developer, user, messages };
};
export async function generateCharacterProfiles(client, inputs, maxAttempts) {
    const start = Date.now();
    const config = getGenerationParams().agent2b_profiles.params;
    const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;
    const retryResult = await withValidationRetry({
        maxAttempts: resolvedMaxAttempts,
        agentName: "Agent 2b (Character Profiles)",
        validationFn: (data) => {
            // Validate against character_profiles schema
            const validationPayload = {
                ...data,
                cost: typeof data?.cost === "number" ? data.cost : 0,
                durationMs: typeof data?.durationMs === "number" ? data.durationMs : 0,
            };
            const validation = validateArtifact("character_profiles", validationPayload);
            return {
                valid: validation.valid,
                errors: validation.errors,
                warnings: validation.warnings,
            };
        },
        generateFn: async (attempt, previousErrors) => {
            const prompt = buildProfilesPrompt(inputs, previousErrors);
            const response = await client.chat({
                messages: prompt.messages,
                temperature: config.model.temperature,
                maxTokens: config.model.max_tokens,
                jsonMode: true,
                logContext: {
                    runId: inputs.runId ?? "",
                    projectId: inputs.projectId ?? "",
                    agent: "Agent2b-CharacterProfiles",
                    retryAttempt: attempt,
                },
            });
            let profiles;
            try {
                profiles = JSON.parse(response.content);
            }
            catch (error) {
                const repaired = jsonrepair(response.content);
                profiles = JSON.parse(repaired);
            }
            if (!Array.isArray(profiles.profiles) || profiles.profiles.length === 0) {
                throw new Error("Invalid character profiles output: missing profiles");
            }
            const costTracker = client.getCostTracker();
            const cost = costTracker.getSummary().byAgent["Agent2b-CharacterProfiles"] || 0;
            return { result: profiles, cost };
        },
    });
    // Log validation warnings if any
    if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
        console.warn(`[Agent 2b] Character profiles validation warnings:\n` +
            retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n"));
    }
    // If validation failed after all retries, log errors but continue
    if (!retryResult.validationResult.valid) {
        console.error(`[Agent 2b] Character profiles failed validation after ${resolvedMaxAttempts} attempts:\n` +
            retryResult.validationResult.errors.map(e => `- ${e}`).join("\n"));
    }
    const durationMs = Date.now() - start;
    const validatedResult = retryResult.result;
    return {
        ...validatedResult,
        cost: retryResult.totalCost,
        durationMs,
    };
}
//# sourceMappingURL=agent2b-character-profiles.js.map