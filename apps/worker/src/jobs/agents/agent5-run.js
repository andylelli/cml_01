/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */
import { extractClues } from "@cml/prompts-llm";
import { applyClueGuardrails, } from "./shared.js";
// ============================================================================
// WP4: Inference Path Coverage Helpers (agent-5 only)
// ============================================================================
function checkInferencePathCoverage(cml, clues) {
    const issues = [];
    const caseBlock = cml?.CASE ?? cml;
    const steps = caseBlock?.inference_path?.steps ?? [];
    if (!Array.isArray(steps) || steps.length === 0) {
        issues.push({ severity: "critical", message: "No inference_path steps found in CML" });
        return { issues, coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: true };
    }
    const coverageMap = new Map();
    for (let i = 0; i < steps.length; i++) {
        coverageMap.set(i + 1, { observation: false, contradiction: false, elimination: false });
    }
    for (const clue of clues.clues) {
        const stepNum = clue.supportsInferenceStep;
        if (stepNum && coverageMap.has(stepNum)) {
            const coverage = coverageMap.get(stepNum);
            const evidenceType = clue.evidenceType || "observation";
            if (evidenceType in coverage)
                coverage[evidenceType] = true;
        }
    }
    // Fuzzy matching fallback
    for (const clue of clues.clues) {
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepNum = i + 1;
            const coverage = coverageMap.get(stepNum);
            const clueText = (String(clue.description ?? "") + " " + String(clue.sourceInCML ?? "")).toLowerCase();
            const obsText = (typeof step.observation === "string" ? step.observation : "").toLowerCase();
            const obsWords = obsText.split(/\s+/).filter((w) => w.length > 4);
            const matchCount = obsWords.filter((w) => clueText.includes(w)).length;
            if (obsWords.length > 0 && matchCount >= Math.ceil(obsWords.length * 0.4))
                coverage.observation = true;
            if (Array.isArray(step.required_evidence)) {
                for (const ev of step.required_evidence) {
                    const evWords = String(ev ?? "").toLowerCase().split(/\s+/).filter((w) => w.length > 4);
                    const evMatch = evWords.filter((w) => clueText.includes(w)).length;
                    if (evWords.length > 0 && evMatch >= Math.ceil(evWords.length * 0.4))
                        coverage.observation = true;
                }
            }
        }
    }
    const uncoveredSteps = [];
    for (const [stepNum, coverage] of coverageMap) {
        if (!coverage.observation) {
            uncoveredSteps.push(stepNum);
            const step = steps[stepNum - 1];
            issues.push({
                severity: "critical",
                message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has NO covering clue`,
            });
        }
        if (!coverage.contradiction) {
            issues.push({ severity: "warning", message: `Inference step ${stepNum} has no contradiction clue` });
        }
    }
    return { issues, coverageMap, uncoveredSteps, hasCriticalGaps: uncoveredSteps.length > 0 };
}
function checkContradictionPairs(cml, clues) {
    const issues = [];
    const caseBlock = cml?.CASE ?? cml;
    const steps = caseBlock?.inference_path?.steps ?? [];
    for (let i = 0; i < steps.length; i++) {
        const stepNum = i + 1;
        const step = steps[i];
        const stepClues = clues.clues.filter((c) => c.supportsInferenceStep === stepNum);
        const evidenceTypes = new Set(stepClues.map((c) => c.evidenceType || "observation"));
        if (stepClues.length >= 2 &&
            evidenceTypes.has("observation") &&
            (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination")))
            continue;
        if (stepClues.length < 2) {
            issues.push({
                severity: "warning",
                message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has only ${stepClues.length} mapped clue(s)`,
            });
        }
        else if (!evidenceTypes.has("contradiction") && !evidenceTypes.has("elimination")) {
            issues.push({ severity: "warning", message: `Inference step ${stepNum} has clues but no contradiction/elimination evidence` });
        }
    }
    return issues;
}
function checkFalseAssumptionContradiction(cml, clues) {
    const issues = [];
    const caseBlock = cml?.CASE ?? cml;
    const falseAssumption = caseBlock?.false_assumption?.statement || "";
    if (!falseAssumption) {
        issues.push({ severity: "critical", message: "No false_assumption.statement in CML" });
        return issues;
    }
    const contradictionClues = clues.clues.filter((c) => c.evidenceType === "contradiction");
    if (contradictionClues.length === 0) {
        issues.push({
            severity: "critical",
            message: `No clue with evidenceType="contradiction" found. Reader needs evidence challenging: "${falseAssumption.substring(0, 80)}"`,
        });
    }
    const suspiciousRedHerrings = clues.redHerrings.filter((rh) => {
        const desc = (String(rh.description ?? "") + " " + String(rh.supportsAssumption ?? "")).toLowerCase();
        return caseBlock?.inference_path?.steps?.some((step) => {
            const corrWords = (typeof step.correction === "string" ? step.correction : "")
                .toLowerCase().split(/\s+/).filter((w) => w.length > 5);
            return corrWords.some((w) => desc.includes(w));
        });
    });
    if (suspiciousRedHerrings.length > 0) {
        issues.push({ severity: "warning", message: `${suspiciousRedHerrings.length} red herring(s) may accidentally support the true solution` });
    }
    return issues;
}
function checkDiscriminatingTestReachability(cml, clues) {
    const issues = [];
    const caseBlock = cml?.CASE ?? cml;
    const discrimTest = caseBlock?.discriminating_test;
    if (!discrimTest?.design) {
        issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
        return issues;
    }
    const designText = (discrimTest.design || "").toLowerCase();
    const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
    const combinedTestText = designText + " " + knowledgeText;
    const relevantClues = clues.clues.filter((c) => {
        const clueText = c.description.toLowerCase();
        const testWords = combinedTestText.split(/\s+/).filter((w) => w.length > 4);
        const matchCount = testWords.filter((w) => clueText.includes(w)).length;
        return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
    });
    if (relevantClues.length === 0) {
        issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
    }
    const earlyMidRelevant = relevantClues.filter((c) => c.placement === "early" || c.placement === "mid");
    if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
        issues.push({ severity: "warning", message: "All clues related to the discriminating test are in late placement" });
    }
    return issues;
}
function checkSuspectElimination(cml, clues) {
    const issues = [];
    const caseBlock = cml?.CASE ?? cml;
    const castArr = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
    const culprits = caseBlock?.culpability?.culprits ?? [];
    const suspects = castArr.filter((c) => c.culprit_eligibility === "eligible" && !culprits.includes(c.name));
    if (suspects.length === 0)
        return issues;
    const allClueText = clues.clues.map((c) => c.description.toLowerCase()).join(" ");
    const uneliminable = suspects.filter((suspect) => {
        const nameWords = (suspect.name || "").toLowerCase().split(/\s+/);
        return !nameWords.some((w) => w.length > 2 && allClueText.includes(w));
    });
    if (uneliminable.length > 0) {
        issues.push({
            severity: "warning",
            message: `${uneliminable.length} suspect(s) (${uneliminable.map((s) => s.name).join(", ")}) are never referenced in any clue`,
        });
    }
    return issues;
}
// ============================================================================
// runAgent5
// ============================================================================
export async function runAgent5(ctx) {
    ctx.reportProgress("clues", "Extracting and organizing clues...", 50);
    const clueDensity = ctx.inputs.targetLength === "short" ? "minimal"
        : ctx.inputs.targetLength === "long" ? "dense"
            : "moderate";
    const cluesStart = Date.now();
    let clues = await extractClues(ctx.client, {
        cml: ctx.cml,
        clueDensity,
        redHerringBudget: 2,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent5_clues"] = clues.cost;
    ctx.agentDurations["agent5_clues"] = Date.now() - cluesStart;
    ctx.reportProgress("clues", `${clues.clues.length} clues distributed`, 62);
    // ── First guardrail pass ───────────────────────────────────────────────────
    let clueGuardrails = applyClueGuardrails(ctx.cml, clues);
    clueGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
    if (clueGuardrails.hasCriticalIssues) {
        ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
        clueGuardrails.issues.forEach((issue) => ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`));
        const retryCluesStart = Date.now();
        clues = await extractClues(ctx.client, {
            cml: ctx.cml,
            clueDensity,
            redHerringBudget: 2,
            fairPlayFeedback: {
                overallStatus: "fail",
                violations: clueGuardrails.issues
                    .filter((i) => i.severity === "critical")
                    .map((i) => ({
                    severity: "critical",
                    rule: "Deterministic Guardrail",
                    description: i.message,
                    suggestion: "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
                })),
                warnings: clueGuardrails.issues
                    .filter((i) => i.severity !== "critical")
                    .map((i) => i.message),
                recommendations: [
                    "Move essential clues to early/mid placement",
                    "Avoid private/detective-only clue phrasing",
                    "Ensure clue IDs are unique and timeline is balanced",
                ],
            },
            runId: ctx.runId,
            projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] = clues.cost;
        ctx.agentDurations["agent5_clues"] =
            (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
        const secondGuardrailPass = applyClueGuardrails(ctx.cml, clues);
        secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
        if (secondGuardrailPass.hasCriticalIssues) {
            secondGuardrailPass.issues.forEach((i) => ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`));
            throw new Error("Clue generation failed deterministic fair-play guardrails");
        }
        clueGuardrails = secondGuardrailPass;
    }
    // ── WP4: Inference Path Coverage Gate ─────────────────────────────────────
    const coverageResult = checkInferencePathCoverage(ctx.cml, clues);
    const allCoverageIssues = [
        ...coverageResult.issues,
        ...checkContradictionPairs(ctx.cml, clues),
        ...checkFalseAssumptionContradiction(ctx.cml, clues),
        ...checkDiscriminatingTestReachability(ctx.cml, clues),
        ...checkSuspectElimination(ctx.cml, clues),
    ];
    allCoverageIssues.forEach((issue) => ctx.warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`));
    const falseAssumptionIssues = checkFalseAssumptionContradiction(ctx.cml, clues);
    const discrimTestIssues = checkDiscriminatingTestReachability(ctx.cml, clues);
    if (coverageResult.hasCriticalGaps ||
        falseAssumptionIssues.some((i) => i.severity === "critical") ||
        discrimTestIssues.some((i) => i.severity === "critical")) {
        ctx.warnings.push("Inference coverage gate: critical gaps found; regenerating clues with coverage feedback");
        const coverageFeedback = {
            overallStatus: "fail",
            violations: allCoverageIssues
                .filter((i) => i.severity === "critical")
                .map((i) => ({
                severity: "critical",
                rule: "Inference Path Coverage",
                description: i.message,
                suggestion: "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
            })),
            warnings: allCoverageIssues.filter((i) => i.severity === "warning").map((i) => i.message),
            recommendations: [
                "Every inference step needs at least one observation clue and one contradiction clue",
                "Set supportsInferenceStep on every essential clue",
                "Include at least one clue that explicitly contradicts the false assumption",
                `Uncovered steps: ${coverageResult.uncoveredSteps.join(", ")}`,
            ],
        };
        ctx.reportProgress("clues", "Regenerating clues to address coverage gaps...", 58);
        const coverageRetryStart = Date.now();
        clues = await extractClues(ctx.client, {
            cml: ctx.cml,
            clueDensity,
            redHerringBudget: 2,
            fairPlayFeedback: coverageFeedback,
            runId: ctx.runId,
            projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] =
            (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
        ctx.agentDurations["agent5_clues"] =
            (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);
        const postCoverageGuardrails = applyClueGuardrails(ctx.cml, clues);
        postCoverageGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Post-coverage guardrail auto-fix: ${fix}`));
    }
    ctx.clues = clues;
    ctx.coverageResult = coverageResult;
    ctx.allCoverageIssues = allCoverageIssues;
    // ── Phase score ────────────────────────────────────────────────────────────
    if (ctx.enableScoring && ctx.scoreAggregator) {
        const guardrailTriggered = clueGuardrails.hasCriticalIssues;
        const coverageGapsFound = coverageResult.hasCriticalGaps;
        const clueCount = clues.clues.length;
        const clueCountScore = clueCount >= 8 ? 100 : Math.round((clueCount / 8) * 100);
        const guardrailScore = guardrailTriggered ? 75 : 100;
        const coverageScore = coverageGapsFound ? 75 : 100;
        const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
        const clueTotal = Math.round(clueValidation * 0.5 + clueCountScore * 0.3 + 100 * 0.2);
        ctx.scoreAggregator.upsertPhaseScore("agent5_clues", "Clue Distribution", {
            agent: "agent5-clue-distribution",
            validation_score: clueValidation,
            quality_score: 100,
            completeness_score: clueCountScore,
            consistency_score: 100,
            total: clueTotal,
            grade: (clueTotal >= 90 ? "A" : clueTotal >= 80 ? "B" : clueTotal >= 70 ? "C" : clueTotal >= 60 ? "D" : "F"),
            passed: clueTotal >= 75,
            tests: [
                {
                    name: "Clue count",
                    category: "completeness",
                    passed: clueCount >= 8,
                    score: clueCountScore,
                    weight: 1.5,
                    message: `${clueCount} clues distributed`,
                },
                {
                    name: "Guardrail compliance",
                    category: "validation",
                    passed: !guardrailTriggered,
                    score: guardrailScore,
                    weight: 2,
                    message: guardrailTriggered
                        ? `Guardrail issues detected and auto-fixed (${clueGuardrails.fixes.length} fix(es))`
                        : "All guardrails passed",
                },
                {
                    name: "Inference coverage",
                    category: "validation",
                    passed: !coverageGapsFound,
                    score: coverageScore,
                    weight: 2,
                    message: coverageGapsFound
                        ? `Coverage gaps found and addressed (${allCoverageIssues.length} issue(s))`
                        : `Full inference coverage (${allCoverageIssues.length} minor issues)`,
                },
            ],
        }, ctx.agentDurations["agent5_clues"] ?? 0, ctx.agentCosts["agent5_clues"] ?? 0);
        try {
            await ctx.savePartialReport();
        }
        catch { /* best-effort */ }
    }
}
//# sourceMappingURL=agent5-run.js.map