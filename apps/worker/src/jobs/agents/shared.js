/**
 * Orchestrator shared context, types, and utility functions.
 *
 * All runAgentN() functions accept OrchestratorContext and mutate it in place.
 * Shared low-level utilities (delay, executeAgentWithRetry, etc.) live here
 * so they are importable by every agent run file without creating circular
 * dependencies with mystery-orchestrator.ts.
 */
import { buildRetryFeedback, getFailedComponents } from "@cml/story-validation";
// ============================================================================
// Hard logic directive merger — used exclusively by Agent 3b run file
// ============================================================================
export const mergeHardLogicDirectives = (base, hardLogicDevices) => {
    const mechanismFamilies = new Set(base.mechanismFamilies);
    const hardLogicModes = new Set(base.hardLogicModes);
    for (const device of hardLogicDevices) {
        for (const family of device.mechanismFamilyHints ?? []) {
            if (family.trim().length > 0)
                mechanismFamilies.add(family.trim());
        }
        for (const mode of device.modeTags ?? []) {
            if (mode.trim().length > 0)
                hardLogicModes.add(mode.trim());
        }
        switch (device.principleType) {
            case "mathematical_principle":
                mechanismFamilies.add("quantitative contradiction");
                break;
            case "cognitive_bias":
                mechanismFamilies.add("cognitive-bias exploitation");
                break;
            case "social_logic":
                mechanismFamilies.add("authority-channel manipulation");
                break;
            default:
                mechanismFamilies.add("physical-constraint proof");
                break;
        }
    }
    return {
        mechanismFamilies: Array.from(mechanismFamilies),
        hardLogicModes: Array.from(hardLogicModes),
        complexityLevel: base.complexityLevel,
        difficultyMode: base.difficultyMode,
    };
};
// ============================================================================
// Outline quality gate helpers — used by Agent 7 and Agent 9 run files
// ============================================================================
export const buildOutlineRepairGuardrails = (issues, cml) => {
    const guardrails = [];
    const cmlCase = cml?.CASE ?? {};
    if (issues.some((i) => i.type === "missing_discriminating_test_scene")) {
        const discrimTest = cmlCase.discriminating_test;
        const method = discrimTest?.method ?? "constraint_proof";
        const design = discrimTest?.design ?? "";
        const designClause = design ? " (" + design + ")" : "";
        guardrails.push("Include a dedicated discriminating test scene in late Act II or early Act III where the detective explicitly stages a " + method + designClause + " that rules out at least one suspect using on-page evidence. The scene summary MUST contain words like test/experiment/re-enactment AND ruled out/eliminated/excluded AND evidence/proof/because.");
    }
    if (issues.some((i) => i.type === "missing_suspect_closure_scene")) {
        const culpritsList = cmlCase.culpability?.culprits ?? [];
        const culpritClause = culpritsList.length > 0 ? " (" + culpritsList.join(", ") + ")" : "";
        guardrails.push("In Act III, include at least one scene where the detective explains why each non-culprit suspect is cleared with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references. The culprit" + culpritClause + " must be identified with a complete evidence chain.");
    }
    return guardrails;
};
// ============================================================================
// Clue guardrail helpers — shared by Agent 5 and Agent 6 run files
// ============================================================================
const getCaseQualityControls = (cml) => {
    const legacy = cml;
    const cmlCase = (legacy?.CASE ?? {});
    return cmlCase.quality_controls?.clue_visibility_requirements ?? {};
};
const normalizeClueTimeline = (clues) => {
    clues.clueTimeline = {
        early: clues.clues.filter((c) => c.placement === "early").map((c) => c.id),
        mid: clues.clues.filter((c) => c.placement === "mid").map((c) => c.id),
        late: clues.clues.filter((c) => c.placement === "late").map((c) => c.id),
    };
};
export const applyClueGuardrails = (cml, clues) => {
    const requirements = getCaseQualityControls(cml);
    const issues = [];
    const fixes = [];
    const essential = clues.clues.filter((c) => c.criticality === "essential");
    const essentialMin = Number(requirements?.essential_clues_min ?? 3);
    if (essential.length < essentialMin) {
        issues.push({
            severity: "critical",
            message: `Essential clue count ${essential.length} is below required minimum ${essentialMin}`,
        });
    }
    const essentialLate = essential.filter((c) => c.placement === "late");
    if (essentialLate.length > 0) {
        essentialLate.forEach((clue, index) => {
            clue.placement = index % 2 === 0 ? "mid" : "early";
        });
        fixes.push(`Repositioned ${essentialLate.length} essential clue(s) from late to early/mid placement`);
    }
    const earlyMin = Number(requirements?.early_clues_min ?? 1);
    const midMin = Number(requirements?.mid_clues_min ?? 1);
    const lateMin = Number(requirements?.late_clues_min ?? 1);
    const counts = {
        early: clues.clues.filter((c) => c.placement === "early").length,
        mid: clues.clues.filter((c) => c.placement === "mid").length,
        late: clues.clues.filter((c) => c.placement === "late").length,
    };
    if (counts.early < earlyMin) {
        issues.push({
            severity: "critical",
            message: `Early clue count ${counts.early} is below required minimum ${earlyMin}`,
        });
    }
    if (counts.mid < midMin) {
        issues.push({
            severity: "critical",
            message: `Mid clue count ${counts.mid} is below required minimum ${midMin}`,
        });
    }
    if (counts.late < lateMin) {
        issues.push({
            severity: "warning",
            message: `Late clue count ${counts.late} is below preferred minimum ${lateMin}`,
        });
    }
    const detectiveOnlyPattern = /(detective[-\s]?only|only\s+the\s+detective|private\s+insight|withheld\s+from\s+reader)/i;
    const detectiveOnlyClues = clues.clues.filter((c) => detectiveOnlyPattern.test(c.description) || detectiveOnlyPattern.test(c.pointsTo));
    if (detectiveOnlyClues.length > 0) {
        issues.push({
            severity: "critical",
            message: `Detected ${detectiveOnlyClues.length} clue(s) implying detective-only/private information`,
        });
    }
    const duplicateIds = new Set();
    const seenIds = new Set();
    for (const clue of clues.clues) {
        if (seenIds.has(clue.id)) {
            duplicateIds.add(clue.id);
        }
        seenIds.add(clue.id);
    }
    if (duplicateIds.size > 0) {
        issues.push({
            severity: "critical",
            message: `Duplicate clue IDs detected: ${Array.from(duplicateIds).join(", ")}`,
        });
    }
    normalizeClueTimeline(clues);
    return {
        issues,
        fixes,
        hasCriticalIssues: issues.some((i) => i.severity === "critical"),
    };
};
// ============================================================================
// Utility functions (moved verbatim from mystery-orchestrator.ts)
// ============================================================================
export function describeError(error) {
    if (error instanceof Error) {
        return error.message;
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return String(error);
    }
}
export function applyAbortedRunMetadata(report, reason) {
    report.run_outcome = "aborted";
    report.run_outcome_reason = reason;
    report.passed = false;
    if (report.scoring_outcome) {
        report.scoring_outcome.passed_threshold = false;
    }
    report.in_progress = false;
    report.aborted = true;
    report.abort_reason = reason;
}
export async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function appendRetryFeedback(base, retryFeedback) {
    if (!retryFeedback || retryFeedback.trim().length === 0) {
        return base;
    }
    const prefix = base.trim().length > 0 ? base : "";
    return `${prefix}${prefix ? "\n\n" : ""}Retry guidance:\n${retryFeedback}`;
}
export function appendRetryFeedbackOptional(base, retryFeedback) {
    if (base === undefined) {
        return undefined;
    }
    return appendRetryFeedback(base, retryFeedback);
}
export async function executeAgentWithRetry(agentId, phaseName, executeAgent, scoreOutput, retryManager, scoreAggregator, scoringLogger, runId, projectId, warnings, onPhaseScored) {
    let attempts = 0;
    let totalCost = 0;
    const startTime = Date.now();
    let retryFeedback;
    while (true) {
        const attemptStart = Date.now();
        const { result, cost } = await executeAgent(retryFeedback);
        totalCost += cost;
        const attemptDuration = Date.now() - attemptStart;
        try {
            const { adapted, score } = await scoreOutput(result);
            scoreAggregator.upsertPhaseScore(agentId, phaseName, score, attemptDuration, cost);
            scoringLogger.logPhaseScore(agentId, phaseName, score, attemptDuration, cost, runId, projectId);
            if (onPhaseScored) {
                try {
                    await onPhaseScored();
                }
                catch { /* best-effort */ }
            }
            const phasePassed = scoreAggregator.passesThreshold(score);
            if (phasePassed) {
                const totalDuration = Date.now() - startTime;
                if (attempts > 0) {
                    warnings.push(`${phaseName}: ✓ Passed after ${attempts} retry(s) - ${score.grade} (${score.total}/100)`);
                }
                return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
            }
            if (!retryManager.canRetry(agentId)) {
                if (retryManager.shouldAbortOnMaxRetries()) {
                    throw new Error(`${phaseName} failed after ${attempts + 1} attempt(s) and all retries are exhausted. ` +
                        `Aborting generation. Failure reason: ${score.failure_reason || `Score ${score.total}/100 (${score.grade}) below threshold`}`);
                }
                warnings.push(`${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - Max retries exceeded`);
                const totalDuration = Date.now() - startTime;
                return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
            }
            const failedComponents = getFailedComponents(score);
            const effectiveFailureReason = score.failure_reason
                || (failedComponents.length > 0
                    ? `Component minimums not met: ${failedComponents.join('; ')}`
                    : `Score ${score.total}/100 (${score.grade}) below threshold`);
            attempts++;
            retryManager.recordRetry(agentId, effectiveFailureReason, score.total);
            const backoffMs = retryManager.getBackoffDelay(agentId);
            const maxRetries = retryManager.getMaxRetries(agentId);
            scoringLogger.logRetryAttempt(agentId, phaseName, attempts, effectiveFailureReason, backoffMs, maxRetries, runId, projectId);
            retryFeedback = buildRetryFeedback(score, attempts);
            warnings.push(`${phaseName}: ↻ Retry ${attempts}/${maxRetries} - Score: ${score.total}/100 (${score.grade}), waiting ${backoffMs}ms...`);
            if (backoffMs > 0) {
                await delay(backoffMs);
            }
        }
        catch (scoringError) {
            scoringLogger.logScoringError(agentId, phaseName, scoringError, runId, projectId);
            warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
            const totalDuration = Date.now() - startTime;
            return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
        }
    }
}
// ============================================================================
// Init-time utilities — called by generateMystery before ctx construction
// ============================================================================
export const normalizePrimaryAxis = (axis) => {
    switch (axis) {
        case "temporal":
        case "spatial":
            return axis;
        case "social":
            return "authority";
        case "psychological":
            return "behavioral";
        case "mechanical":
            return "identity";
        default:
            return "temporal";
    }
};
export const deriveHardLogicDirectives = (theme, primaryAxis, locationPreset) => {
    const text = `${theme ?? ""} ${locationPreset ?? ""}`.toLowerCase();
    const familySet = new Set();
    const modeSet = new Set();
    const addFamily = (value) => familySet.add(value);
    const addMode = (value) => modeSet.add(value);
    switch (primaryAxis) {
        case "temporal":
            addFamily("schedule contradiction");
            addFamily("timing window trap");
            break;
        case "spatial":
            addFamily("access path illusion");
            addFamily("geometry-based movement");
            break;
        case "social":
            addFamily("authority-channel manipulation");
            addFamily("status-based witness distortion");
            break;
        case "psychological":
            addFamily("cognitive bias exploitation");
            addFamily("memory anchoring misdirection");
            break;
        case "mechanical":
            addFamily("mechanical sequence trigger");
            addFamily("acoustic or pressure misread");
            break;
        default:
            break;
    }
    if (/(locked[-\s]?room|impossible crime)/.test(text)) {
        addMode("locked-room");
        addFamily("sealed-space constraint proof");
    }
    if (/train|rail|liner|ship|seaside|hotel/.test(text)) {
        addMode("transit or seaside topology");
        addFamily("timetable dependency");
    }
    if (/inheritance|will|estate/.test(text)) {
        addMode("inheritance pressure logic");
        addFamily("document-chain contradiction");
    }
    if (/(math|mathematics|geometry|probability|pure mathematics)/.test(text)) {
        addMode("mathematical principle");
        addFamily("probability misdirection");
        addFamily("geometric visibility constraint");
    }
    if (/(botanical|medical|toxin|toxicology|botany)/.test(text)) {
        addMode("botanical or medical mechanism");
        addFamily("dose-timing asymmetry");
    }
    if (/acoustic|sound|echo/.test(text)) {
        addMode("acoustics");
        addFamily("acoustic mislocalization");
    }
    if (/(multi-layer|double-bluff|double bluff|nested)/.test(text)) {
        addMode("multi-layer deception");
        addFamily("stacked false assumptions");
    }
    let difficultyMode = "standard";
    if (/make it brutal|extreme mode/.test(text)) {
        difficultyMode = "extreme";
        addMode("near-impossible construction");
        addFamily("precision timing geometry");
    }
    else if (/increase difficulty|escalation mode/.test(text)) {
        difficultyMode = "increase";
        addMode("multi-step reasoning");
        addFamily("dual-principle contradiction");
    }
    const complexityLevel = difficultyMode === "standard" ? "moderate" : "complex";
    if (familySet.size === 0) {
        addFamily("constraint contradiction");
        addFamily("inference-path trap");
    }
    return {
        mechanismFamilies: Array.from(familySet).slice(0, 6),
        complexityLevel,
        hardLogicModes: Array.from(modeSet).slice(0, 6),
        difficultyMode,
    };
};
export const buildNoveltyConstraints = (seedEntries) => {
    const titles = seedEntries
        .map((seed) => {
        const meta = seed.cml?.CASE?.meta ?? seed.cml?.meta ?? {};
        return meta?.title || seed.filename;
    })
        .filter((title) => Boolean(title));
    const avoidancePatterns = seedEntries.flatMap((seed) => {
        const cmlCase = seed.cml?.CASE ?? {};
        const meta = cmlCase.meta ?? {};
        const crimeClass = meta.crime_class ?? {};
        const era = meta?.era?.decade ?? "";
        const location = meta?.setting?.location ?? "";
        const falseAssumption = cmlCase?.false_assumption?.statement ?? "";
        const discrimMethod = cmlCase?.discriminating_test?.method ?? "";
        const discrimDesign = cmlCase?.discriminating_test?.design ?? "";
        const crimeSubtype = crimeClass?.subtype ?? "";
        const axis = cmlCase?.false_assumption?.type ?? "";
        return [
            era && location ? `Era+location combo: ${era} / ${location}` : "",
            crimeSubtype ? `Crime method/subtype: ${crimeSubtype}` : "",
            axis ? `False assumption type: ${axis}` : "",
            falseAssumption ? `False assumption statement: ${falseAssumption}` : "",
            discrimMethod ? `Discriminating test method: ${discrimMethod}` : "",
            discrimDesign ? `Discriminating test design: ${discrimDesign}` : "",
        ].filter(Boolean);
    });
    const uniqueAvoidance = Array.from(new Set(avoidancePatterns)).slice(0, 12);
    return {
        divergeFrom: titles.slice(0, 8),
        areas: [
            "crime method + motive combination",
            "false assumption statement and justification",
            "discriminating test design and trigger",
            "era + location pairing",
            "culprit access path and opportunity channel",
            "constraint-space anchors and contradictions",
        ],
        avoidancePatterns: uniqueAvoidance,
    };
};
//# sourceMappingURL=shared.js.map