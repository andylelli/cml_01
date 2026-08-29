/**
 * Agent 2b: Character Profile Generator
 *
 * Expands cast details into full narrative profiles.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import type { CastDesign } from "./agent2-cast.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface CharacterProfileOutput {
  name: string;
  summary?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  motiveStrength?: "weak" | "moderate" | "strong" | "compelling";
  alibiWindow?: string;
  accessPlausibility?: string;
  stakes?: string;
  humourStyle?: "understatement" | "dry_wit" | "polite_savagery" | "self_deprecating" | "observational" | "deadpan" | "sardonic" | "blunt" | "none";
  humourLevel?: number;
  speechMannerisms?: string;
  signatureTic?: string;
  internalConflict?: string;
  personalStakeInCase?: string;
  paragraphs: string[];
  order?: number;
}

export interface CharacterProfilesResult {
  status: "draft" | "final";
  tone?: string;
  targetWordCount?: number;
  profiles: CharacterProfileOutput[];
  note?: string;
  cost: number;
  durationMs: number;
}

export interface CharacterProfilesInputs {
  caseData: CaseData;
  cast: CastDesign;
  tone?: string;
  targetWordCount?: number;
  runId?: string;
  projectId?: string;
}

// A_53 P10 (subagent-prompt-ships-full-artifacts): project each cast member down to the
// slim whitelist of fields this prompt actually references when authoring a profile. This
// bounds the per-character serialized payload to a known shape (token cost no longer scales
// with whatever extra keys the upstream cast artifact carries now or later), while keeping
// every field the writer needs (identity grounding + the persona/secret/motive/alibi/access/
// stakes source material it is asked to preserve and expand). Holistic: pure projection of the
// artifact's own data, no story-specific content.
const PROFILE_SOURCE_FIELDS = [
  "name",
  "ageRange",
  "occupation",
  "roleArchetype",
  "gender",
  "role",
  "publicPersona",
  "privateSecret",
  "motiveSeed",
  "motiveStrength",
  "alibiWindow",
  "accessPlausibility",
  "stakes",
  "characterArcPotential",
] as const;

const pickProfileSource = (character: Record<string, unknown> | undefined): Record<string, unknown> => {
  const slim: Record<string, unknown> = {};
  if (!character) return slim;
  for (const field of PROFILE_SOURCE_FIELDS) {
    const value = character[field];
    if (value !== undefined) slim[field] = value;
  }
  return slim;
};

/** Exported so both sides of `AGENT2B_OBSERVABLE_DETAIL` can be asserted against the REAL prompt. */
export const buildProfilesPrompt = (inputs: CharacterProfilesInputs, previousErrors?: string[]) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const castNames = inputs.cast.characters.map((c) => c.name).join(", ");
  const tone = inputs.tone ?? "Cozy";
  const targetWordCount = inputs.targetWordCount ?? 1000;

  const system = `You are a character biography writer for classic mystery fiction. Your task is to expand the provided cast details into full narrative profiles with distinct voices, humour styles, and speech mannerisms.\n\nRules:\n- Do not introduce new facts beyond the provided cast and CML.\n- Preserve private secrets and motives as given.\n- Avoid stereotypes or reductive framing.\n- Output valid JSON only.`;

  // Rewrite JSON-path error references to character names so the model can act on them precisely
  const namedErrors = (previousErrors ?? []).map((err) => {
    const match = err.match(/^profiles\[(\d+)\]\.(.*)/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const character = inputs.cast.characters[idx];
      const name = character?.name ?? `character at index ${idx}`;
      return `The profile for "${name}" is missing or incomplete: ${match[2]} — ensure this character has a full "paragraphs" array of 4–6 narrative paragraphs (~${inputs.targetWordCount ?? 1000} words total).`;
    }
    return err;
  });
  const validationFeedback = buildValidationFeedback(namedErrors.length > 0 ? namedErrors : undefined);

  /**
   * ── A_75 §12.4 — WRITE WHAT CAN BE SEEN ──────────────────────────────────────────────────────────
   *
   * MEASURED across 27 stored runs: `character_profiles` is the most ABSTRACT artifact this pipeline
   * produces — a 28.9% machine-register rate against 4.5% for `location_profiles`, 6.4x the most
   * concrete, and above the manuscripts themselves (~12%). By field:
   *
   *     personalStakeInCase 42.9% · publicPersona 32.3% · motiveSeed 31.5% · stakes 25.8%
   *     privateSecret 24.7% · speechMannerisms 23.1% · internalConflict 22.6% · summary 7.8%
   *
   * `summary` sits at 7.8% because the schema tells it what to be ("1-2 sentence overview"). The rest
   * are given `"..."` or an abstract example, and the prompt's OWN EXAMPLES taught the register:
   * `internalConflict` was illustrated as "guilt, conflicted loyalty, fear of what the truth means" —
   * three propositions, nothing a writer can put on a page.
   *
   * This artifact feeds `character_clarity` and `dialogue`, TWO OF THE THREE CATEGORIES THAT HAVE
   * NEVER EXCEEDED 8 in 44 external reads. The correlation is not significant at n=14 (rho -0.407 and
   * -0.218, critical 0.544), so this is a hypothesis and is flagged as one — but it is the largest
   * effect in that table, both rows point the right way, and the artifact is a consistent extreme
   * outlier.
   *
   * ── AXIS-NEUTRAL BY CONSTRUCTION ─────────────────────────────────────────────────────────────────
   *
   * Every example below is a habit, an object or a thing said. None assumes a clock, a locked room, a
   * mistaken identity, a chain of command or a behavioural tell, so this reads identically on all five
   * `false_assumption` axes. An example built from a timing case would quietly bias four of them.
   *
   * ── WHAT IT DELIBERATELY EXEMPTS ─────────────────────────────────────────────────────────────────
   *
   * `alibiWindow` scores 30.6% and is NOT included: it is a record of where someone was between two
   * times, and a record should stay a record. Rewriting it as sensory prose would corrupt the field
   * the fair-play machinery reads. Same for `accessPlausibility` and every enum.
   *
   * Flag-gated `AGENT2B_OBSERVABLE_DETAIL` (default OFF), read at call time. Off, the prompt is
   * byte-identical to today. Its test costs no external read: re-run Agent 2b and measure the rate.
   */
  const observableEnabled = /^(1|true|yes|on)$/i.test(process.env.AGENT2B_OBSERVABLE_DETAIL ?? "");
  const observableBlock = observableEnabled
    ? `OBSERVABLE, NOT ABSTRACT (applies to publicPersona, privateSecret, motiveSeed, stakes, internalConflict, personalStakeInCase):
- Write what a reader could SEE, HEAR or HANDLE in a scene: a habit, an object, something said or pointedly not said.
- A proposition ABOUT a character is not usable by the writer. A thing the character DOES is.
    abstract   -> "Her career would be destroyed if the inquiry reopened."
    observable -> "She keeps the inquiry file in her own desk and reads it twice a day."
    abstract   -> "He is torn between loyalty and duty."
    observable -> "He answers for his superior in company, and writes to the board alone at night."
    abstract   -> "She resents being overlooked."
    observable -> "She corrects the spelling of her name on every list she is handed."
- Each of those six fields must name at least one concrete noun — a thing with edges.
- This does NOT apply to alibiWindow, accessPlausibility, or any enum field. Those are records, and a
  record stays a record: state them plainly and do not dramatise them.

`
    : "";

  const developer = `# Character Profiles Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "${tone}",\n  "targetWordCount": ${targetWordCount},\n  "profiles": [\n    {\n      "name": "Name",\n      "summary": "1-2 sentence overview",\n      "publicPersona": "...",\n      "privateSecret": "...",\n      "motiveSeed": "...",\n      "motiveStrength": "weak|moderate|strong|compelling",\n      "alibiWindow": "...",\n      "accessPlausibility": "...",\n      "stakes": "...",
      "humourStyle": "understatement|dry_wit|polite_savagery|self_deprecating|observational|deadpan|sardonic|blunt|none",
      "humourLevel": 0.0,
      "speechMannerisms": "Brief description of speech patterns, verbal tics, and dialogue mannerisms",\n      "signatureTic": "ONE short quotable verbal tic unique to this character (a recurring phrase or habit Agent 9 can put in their mouth)",\n      "internalConflict": "Psychological tension or moral struggle (e.g. guilt, conflicted loyalty, fear of what the truth means)",\n      "personalStakeInCase": "Why this crime matters personally — REQUIRED for detective, recommended for others",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"],\n      "order": 1\n    }\n  ],\n  "note": ""\n}\n\nRequirements:\n- One profile per cast member (${inputs.cast.characters.length}).\n- 4-6 paragraphs per profile (target ~${targetWordCount} words each).\n- Use tone: ${tone}.\n- Keep all facts consistent with the cast details and CML.

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

${observableBlock}CHARACTER HUMOUR REQUIREMENTS:
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
- The detective should typically have dry_wit or observational style at 0.4-0.6 (restrained, precise, never a comedian).

VOICE DISTINCTNESS (critical — the dialogue must not all sound the same):
- Give each speaking character a DISTINCT speech register. Do NOT make everyone "measured / precise /
  formal / restrained" — that is the #1 dialogue failure. Deliberately spread them across contrasting
  registers, e.g. one terse and clipped, one florid and digressive, one warm and plain-spoken, one
  cold and exact, one nervous and hedging. No two characters should share the same register.
- Give each character ONE concrete, quotable verbal tic (a recurring phrase, a habit of answering
  questions with questions, a regional idiom, dropping into jargon) that is theirs alone — something
  Agent 9 can literally put in their mouth, not an abstract description. Record it in the "signatureTic" field.

Quality bar:
- Every profile must create a usable prose voice (speechMannerisms + internalConflict + personalStakeInCase all concrete, not placeholders).
- The cast's speechMannerisms, taken together, must show CONTRAST — at least three clearly different registers across the speaking characters, and at least two distinct humourStyles.
- Paragraphs must reveal character through action/choice, not just static biography summary.
- Keep motive/alibi/access fields coherent with cast input and avoid contradictions.

Micro-exemplars:
- Weak internalConflict: "has doubts"
- Strong internalConflict: "fears exposing the forged ledger will ruin the daughter she secretly supports"
- Weak speechMannerisms: "talks formally"
- Strong speechMannerisms: "answers in clipped legal phrases, then softens into provincial idioms when pressed"

Before finalizing, run a silent checklist:
- Exactly one profile per cast member
- Enum values are exact
- Detective has personalStakeInCase
- paragraphs arrays exist and contain 4-6 entries
- JSON only, no markdown fences`;

  // A_53 P10 (subagent-prompt-ships-full-artifacts): serialize the slim per-character
  // projection instead of the full cast array to avoid token bloat scaling with cast size.
  const slimCast = inputs.cast.characters.map((c) => pickProfileSource(c as unknown as Record<string, unknown>));
  const user = `Write narrative character profiles for the following mystery.\n\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCast: ${castNames}\n\nCast details:\n${JSON.stringify(slimCast, null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
};

/**
 * Targeted repair for a single profile that is missing its paragraphs array.
 * Uses a minimal prompt focused only on that one character, avoiding the token
 * ceiling that causes the full N-profile call to truncate the last profile.
 */
async function repairMissingParagraphs(
  client: AzureOpenAIClient,
  inputs: CharacterProfilesInputs,
  profile: CharacterProfileOutput,
  characterIndex: number
): Promise<CharacterProfileOutput> {
  const character = inputs.cast.characters[characterIndex];
  const tone = inputs.tone ?? "Cozy";
  const targetWordCount = inputs.targetWordCount ?? 1000;
  const title = (inputs.caseData as any)?.CASE?.meta?.title ?? "Untitled Mystery";

  const messages = [
    {
      role: "system" as const,
      content: `You are a character biography writer for classic mystery fiction. Output valid JSON only.`,
    },
    {
      role: "user" as const,
      content:
        `Write narrative paragraphs for this character in "${title}".\n\n` +
        `Return JSON with this exact structure: {"paragraphs": ["Paragraph 1", "Paragraph 2", ...]}\n\n` +
        `Requirements:\n- 4-6 paragraphs totalling ~${targetWordCount} words\n- Tone: ${tone}\n` +
        `- Keep all facts consistent with the character details and existing profile fields below.\n\n` +
        // A_53 P10 (subagent-prompt-ships-full-artifacts): slim the single-character payload too.
        `Character: ${JSON.stringify(pickProfileSource(character as unknown as Record<string, unknown>), null, 2)}\n\n` +
        `Existing profile (paragraphs missing — supply them): ${JSON.stringify({ ...profile, paragraphs: [] }, null, 2)}`,
    },
  ];

  const response = await client.chat({
    messages,
    temperature: 0.6,
    maxTokens: 2000,
    jsonMode: true,
    logContext: {
      runId: inputs.runId ?? "",
      projectId: inputs.projectId ?? "",
      agent: "Agent2b-ProfileRepair",
      retryAttempt: 1,
    },
  });

  let parsed: { paragraphs?: string[] };
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = JSON.parse(jsonrepair(response.content));
  }

  if (!Array.isArray(parsed.paragraphs) || parsed.paragraphs.length === 0) {
    throw new Error(
      `Profile repair for "${character?.name ?? `index ${characterIndex}`}" returned no paragraphs`
    );
  }

  return { ...profile, paragraphs: parsed.paragraphs };
}

export async function generateCharacterProfiles(
  client: AzureOpenAIClient,
  inputs: CharacterProfilesInputs,
  maxAttempts?: number
): Promise<CharacterProfilesResult> {
  const start = Date.now();
  const config = getGenerationParams().agent2b_profiles.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  const retryResult = await withValidationRetry({
    maxAttempts: resolvedMaxAttempts,
    agentName: "Agent 2b (Character Profiles)",
    validationFn: (data) => {
      // Validate against character_profiles schema
      const validationPayload = {
        ...(data as Record<string, unknown>),
        cost: typeof (data as any)?.cost === "number" ? (data as any).cost : 0,
        durationMs: typeof (data as any)?.durationMs === "number" ? (data as any).durationMs : 0,
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

      let profiles: Omit<CharacterProfilesResult, "cost" | "durationMs">;
      try {
        profiles = JSON.parse(response.content);
      } catch (error) {
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
    console.warn(
      `[Agent 2b] Character profiles validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 2b] Character profiles failed validation after ${resolvedMaxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  const durationMs = Date.now() - start;
  const validatedResult = retryResult.result as CharacterProfilesResult;

  // Targeted repair: if any profile is still missing paragraphs (e.g. due to token
  // budget truncation on the last profile), repair each one with a focused single-profile call
  if (Array.isArray(validatedResult.profiles)) {
    for (let i = 0; i < validatedResult.profiles.length; i++) {
      const p = validatedResult.profiles[i];
      if (!p.paragraphs || p.paragraphs.length === 0) {
        try {
          validatedResult.profiles[i] = await repairMissingParagraphs(client, inputs, p, i);
          console.log(
            `[Agent 2b] Repaired missing paragraphs for "${inputs.cast.characters[i]?.name ?? `profile[${i}]`}"`
          );
        } catch (repairErr) {
          console.error(
            `[Agent 2b] Could not repair paragraphs for profile[${i}]: ${repairErr}`
          );
        }
      }
    }
  }

  return {
    ...validatedResult,
    cost: retryResult.totalCost,
    durationMs,
  };
}
