/**
 * Agent 2: Cast & Motive Designer
 *
 * Extracted from mystery-orchestrator.ts. Runs designCast(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.cast.
 */
import { designCast, generateCastNames, } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { CastDesignScorer } from "@cml/story-validation";
import { adaptCastForScoring } from "../scoring-adapters/index.js";
import { executeAgentWithRetry, appendRetryFeedback, } from "./shared.js";
export async function runAgent2(ctx) {
    ctx.reportProgress("cast", "Designing cast and motives...", 12);
    const setting = ctx.setting;
    const totalCastSize = ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1;
    const nameContext = {
        decade: parseInt(String(setting.setting.era.decade), 10) || undefined,
        locationType: setting.setting.location.type,
        locationDescription: setting.setting.location.description,
        socialContext: setting.setting.era.socialNorms.join(", "),
    };
    const effectiveCastNames = ctx.inputs.castNames ?? generateCastNames(ctx.runId, totalCastSize, nameContext);
    if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
        const { result, duration, cost } = await executeAgentWithRetry("agent2_cast", "Cast Design", async (retryFeedback) => {
            const castResult = await designCast(ctx.client, {
                characterNames: effectiveCastNames,
                castSize: totalCastSize,
                setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
                crimeType: "Murder",
                tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
                socialContext: setting.setting.era.socialNorms.join(", "),
                detectiveType: ctx.inputs.detectiveType,
                runId: ctx.runId,
                projectId: ctx.projectId || "",
            });
            return { result: castResult, cost: castResult.cost };
        }, async (castResult) => {
            const scorer = new CastDesignScorer();
            const adapted = adaptCastForScoring(castResult.cast);
            const scorerInput = {
                cast_size: ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1,
            };
            const score = await scorer.score(scorerInput, adapted, {
                previous_phases: { agent1_setting: setting.setting },
                cml: undefined,
                threshold_config: { mode: "standard" },
            });
            return { adapted, score };
        }, ctx.retryManager, ctx.scoreAggregator, ctx.scoringLogger, ctx.runId, ctx.projectId || "", ctx.warnings, ctx.savePartialReport);
        ctx.cast = result;
        ctx.agentCosts["agent2_cast"] = cost;
        ctx.agentDurations["agent2_cast"] = duration;
    }
    else {
        const castStart = Date.now();
        ctx.cast = await designCast(ctx.client, {
            characterNames: effectiveCastNames,
            castSize: totalCastSize,
            setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
            crimeType: "Murder",
            tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
            socialContext: setting.setting.era.socialNorms.join(", "),
            detectiveType: ctx.inputs.detectiveType,
            runId: ctx.runId,
            projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent2_cast"] = ctx.cast.cost;
        ctx.agentDurations["agent2_cast"] = Date.now() - castStart;
    }
    const cast = ctx.cast;
    if (cast.cast.diversity.stereotypeCheck.length > 0) {
        ctx.errors.push(...cast.cast.diversity.stereotypeCheck.map((w) => `Agent 2: ${w}`));
        throw new Error("Cast design failed stereotype guardrails");
    }
    const castValidationPayload = {
        ...cast.cast,
        cost: cast.cost,
        latencyMs: cast.latencyMs,
    };
    let castSchemaValidation = validateArtifact("cast_design", castValidationPayload);
    if (!castSchemaValidation.valid) {
        ctx.warnings.push("Cast design failed schema validation on first attempt; retrying cast generation with schema repair guardrails");
        const schemaRepairGuardrails = [
            "Return a valid cast_design artifact that strictly matches required schema fields and types.",
            ...castSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
        ];
        const castSchemaRetryStart = Date.now();
        const retriedCast = await designCast(ctx.client, {
            characterNames: effectiveCastNames,
            castSize: totalCastSize,
            setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
            crimeType: "Murder",
            tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
            socialContext: setting.setting.era.socialNorms.join(", "),
            detectiveType: ctx.inputs.detectiveType,
            qualityGuardrails: schemaRepairGuardrails,
            runId: ctx.runId,
            projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent2_cast"] = (ctx.agentCosts["agent2_cast"] || 0) + retriedCast.cost;
        ctx.agentDurations["agent2_cast"] = (ctx.agentDurations["agent2_cast"] || 0) + (Date.now() - castSchemaRetryStart);
        const retriedPayload = {
            ...retriedCast.cast,
            cost: retriedCast.cost,
            latencyMs: retriedCast.latencyMs,
        };
        const retryValidation = validateArtifact("cast_design", retriedPayload);
        if (!retryValidation.valid) {
            retryValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
            throw new Error("Cast artifact failed schema validation");
        }
        ctx.cast = retriedCast;
        castSchemaValidation = retryValidation;
        ctx.warnings.push("Cast design schema-repair retry succeeded");
    }
    castSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Cast schema warning: ${warning}`));
    ctx.reportProgress("cast", `Cast designed (${ctx.cast.cast.characters.length} characters)`, 25);
}
//# sourceMappingURL=agent2-run.js.map