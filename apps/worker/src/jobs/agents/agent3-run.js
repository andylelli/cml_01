/**
 * Agent 3: CML Generator (+ Agent 4 auto-revision, + Agent 8 Novelty Auditor)
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCML(), handles the
 * built-in Agent 4 auto-revision, records CML scoring, then runs the novelty
 * audit (Agent 8) with one retry on failure, and writes ctx.cml + ctx.noveltyAudit.
 */
import { generateCML, auditNovelty } from "@cml/prompts-llm";
export async function runAgent3(ctx) {
    ctx.reportProgress("cml", "Generating mystery structure (CML) grounded in novel devices...", 31);
    const setting = ctx.setting;
    const cast = ctx.cast;
    const backgroundContext = ctx.backgroundContext;
    const hardLogicDevices = ctx.hardLogicDevices;
    const hardLogicDirectives = ctx.hardLogicDirectives;
    // ── Agent 3: CML generation ────────────────────────────────────────────────
    const cmlStart = Date.now();
    let cmlResult = await generateCML(ctx.client, {
        decade: setting.setting.era.decade,
        location: setting.setting.location.description,
        institution: setting.setting.location.type,
        tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
        weather: setting.setting.atmosphere.weather,
        socialStructure: setting.setting.era.socialNorms.join(", "),
        theme: ctx.inputs.theme && ctx.inputs.theme.trim().length > 0
            ? `${ctx.inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
            : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
        castSize: cast.cast.characters.length,
        castNames: cast.cast.characters.map((c) => c.name),
        castGenders: Object.fromEntries(cast.cast.characters.map((c) => [c.name, c.gender ?? "non-binary"])),
        detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
        victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
        complexityLevel: hardLogicDirectives.complexityLevel,
        mechanismFamilies: hardLogicDirectives.mechanismFamilies,
        primaryAxis: ctx.primaryAxis,
        hardLogicModes: hardLogicDirectives.hardLogicModes,
        difficultyMode: hardLogicDirectives.difficultyMode,
        hardLogicDevices: hardLogicDevices.devices,
        backgroundContext,
        noveltyConstraints: ctx.noveltyConstraints,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
    }, ctx.examplesRoot);
    ctx.agentCosts["agent3_cml"] = cmlResult.cost;
    ctx.agentDurations["agent3_cml"] = Date.now() - cmlStart;
    if (!cmlResult.validation.valid) {
        ctx.errors.push("Agent 3: Generated invalid CML after all attempts");
        throw new Error("CML generation failed validation");
    }
    if (cmlResult.revisedByAgent4) {
        ctx.revisedByAgent4 = true;
        ctx.revisionAttempts = cmlResult.revisionDetails?.attempts;
        ctx.warnings.push(`Agent 4: Auto-revision triggered after ${cmlResult.attempt} attempts (${ctx.revisionAttempts} revisions)`);
    }
    ctx.cml = cmlResult.cml;
    ctx.reportProgress("cml", "Mystery structure generated and validated", 50);
    // ── CML quality score ─────────────────────────────────────────────────────
    if (ctx.enableScoring && ctx.scoreAggregator) {
        const cmlRevisedByAgent4 = cmlResult.revisedByAgent4 ?? false;
        const cmlAttemptCount = cmlResult.attempt ?? 1;
        const cmlQualityScore = cmlRevisedByAgent4 ? 60 : 100;
        const cmlTotal = Math.round(100 * 0.5 + cmlQualityScore * 0.3 + 100 * 0.2);
        ctx.scoreAggregator.upsertPhaseScore("agent3_cml", "CML Generation", {
            agent: "agent3-cml-generation",
            validation_score: 100,
            quality_score: cmlQualityScore,
            completeness_score: 100,
            consistency_score: 100,
            total: cmlTotal,
            grade: (cmlTotal >= 90 ? "A" : cmlTotal >= 80 ? "B" : cmlTotal >= 70 ? "C" : cmlTotal >= 60 ? "D" : "F"),
            passed: true,
            tests: [
                {
                    name: "Schema validation",
                    category: "validation",
                    passed: true,
                    score: 100,
                    weight: 2,
                    message: `Valid after ${cmlAttemptCount} attempt(s)`,
                },
                {
                    name: "Structural revision (Agent 4)",
                    category: "quality",
                    passed: !cmlRevisedByAgent4,
                    score: cmlQualityScore,
                    weight: 1,
                    message: cmlRevisedByAgent4
                        ? `Required structural revision (${cmlResult.revisionDetails?.attempts ?? 1} revision(s))`
                        : "No structural revision needed",
                },
            ],
        }, ctx.agentDurations["agent3_cml"] ?? 0, ctx.agentCosts["agent3_cml"] ?? 0);
        try {
            await ctx.savePartialReport();
        }
        catch { /* best-effort */ }
    }
    // ── Agent 8: Novelty Audit ─────────────────────────────────────────────────
    const similarityThreshold = typeof ctx.inputs.similarityThreshold === "number"
        ? ctx.inputs.similarityThreshold
        : Number(process.env.NOVELTY_SIMILARITY_THRESHOLD || 0.9);
    const shouldSkipNovelty = Boolean(ctx.inputs.skipNoveltyCheck) || similarityThreshold >= 1;
    if (!shouldSkipNovelty) {
        ctx.reportProgress("novelty", "Checking novelty vs seed patterns...", 52);
        const runNoveltyAudit = async (candidate) => {
            const noveltyStart = Date.now();
            const result = await auditNovelty(ctx.client, {
                generatedCML: candidate,
                seedCMLs: ctx.seedEntries.map((s) => s.cml),
                similarityThreshold,
                runId: ctx.runId,
                projectId: ctx.projectId || "",
            });
            ctx.agentCosts["agent8_novelty"] = result.cost;
            ctx.agentDurations["agent8_novelty"] = Date.now() - noveltyStart;
            return result;
        };
        ctx.noveltyAudit = await runNoveltyAudit(ctx.cml);
        if (ctx.noveltyAudit.status === "fail") {
            ctx.warnings.push("Agent 8: Novelty audit failed; regenerating CML with stronger divergence constraints");
            ctx.noveltyAudit.violations.forEach((v) => ctx.warnings.push(`  - ${v}`));
            const strongerConstraints = {
                ...ctx.noveltyConstraints,
                areas: Array.from(new Set([
                    ...ctx.noveltyConstraints.areas,
                    "culprit identity and motive structure",
                    "constraint-space shape and contradictions",
                    "discriminating test trigger conditions",
                ])),
                avoidancePatterns: Array.from(new Set([
                    ...ctx.noveltyConstraints.avoidancePatterns,
                    ...ctx.noveltyAudit.violations,
                    ...ctx.noveltyAudit.warnings,
                    ...ctx.noveltyAudit.recommendations,
                    `Most similar seed: ${ctx.noveltyAudit.mostSimilarSeed}`,
                ])).slice(0, 16),
            };
            ctx.reportProgress("cml", "Regenerating CML with stronger novelty constraints...", 54);
            const cmlRetryStart = Date.now();
            cmlResult = await generateCML(ctx.client, {
                decade: setting.setting.era.decade,
                location: setting.setting.location.description,
                institution: setting.setting.location.type,
                tone: ctx.inputs.narrativeStyle || "Golden Age Mystery",
                weather: setting.setting.atmosphere.weather,
                socialStructure: setting.setting.era.socialNorms.join(", "),
                theme: ctx.inputs.theme && ctx.inputs.theme.trim().length > 0
                    ? `${ctx.inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
                    : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
                castSize: cast.cast.characters.length,
                castNames: cast.cast.characters.map((c) => c.name),
                castGenders: Object.fromEntries(cast.cast.characters.map((c) => [c.name, c.gender ?? "non-binary"])),
                detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
                victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
                complexityLevel: hardLogicDirectives.complexityLevel,
                mechanismFamilies: hardLogicDirectives.mechanismFamilies,
                primaryAxis: ctx.primaryAxis,
                hardLogicModes: hardLogicDirectives.hardLogicModes,
                difficultyMode: hardLogicDirectives.difficultyMode,
                hardLogicDevices: hardLogicDevices.devices,
                backgroundContext,
                noveltyConstraints: strongerConstraints,
                runId: ctx.runId,
                projectId: ctx.projectId || "",
            }, ctx.examplesRoot);
            ctx.agentCosts["agent3_cml"] = cmlResult.cost;
            ctx.agentDurations["agent3_cml"] += Date.now() - cmlRetryStart;
            if (!cmlResult.validation.valid) {
                ctx.errors.push("Agent 3: Generated invalid CML after novelty retry");
                throw new Error("CML generation failed validation after novelty retry");
            }
            ctx.cml = cmlResult.cml;
            ctx.noveltyAudit = await runNoveltyAudit(ctx.cml);
        }
        if (ctx.noveltyAudit.status === "fail") {
            const hardFail = String(process.env.NOVELTY_HARD_FAIL || "false").toLowerCase() === "true";
            if (hardFail) {
                ctx.errors.push("Agent 8: Novelty audit FAILED - too similar to seed patterns");
                ctx.noveltyAudit.violations.forEach((v) => ctx.errors.push(`  - ${v}`));
                throw new Error("Novelty audit failed");
            }
            ctx.warnings.push("Agent 8: Novelty audit failed; continuing with warning");
            ctx.noveltyAudit.violations.forEach((v) => ctx.warnings.push(`  - ${v}`));
            ctx.noveltyAudit = { ...ctx.noveltyAudit, status: "warning" };
        }
        else if (ctx.noveltyAudit.status === "warning") {
            ctx.warnings.push("Agent 8: Moderate similarity detected");
            ctx.noveltyAudit.warnings.forEach((w) => ctx.warnings.push(`  - ${w}`));
        }
        ctx.reportProgress("novelty_math", `Novelty math: weights plot 0.30, character 0.25, setting 0.15, solution 0.25, structural 0.05 | threshold ${similarityThreshold.toFixed(2)} | most similar ${ctx.noveltyAudit.mostSimilarSeed} (${ctx.noveltyAudit.highestSimilarity.toFixed(2)})`, 57);
        ctx.reportProgress("novelty", `Novelty check: ${ctx.noveltyAudit.status}`, 58);
    }
    else {
        ctx.reportProgress("novelty", similarityThreshold >= 1 ? "Novelty check skipped (threshold >= 1.0)" : "Novelty check skipped", 58);
    }
    // ── Novelty phase score ───────────────────────────────────────────────────
    if (ctx.enableScoring && ctx.scoreAggregator) {
        if (ctx.noveltyAudit) {
            const highestSim = ctx.noveltyAudit.highestSimilarity ?? 0;
            const noveltyStatus = ctx.noveltyAudit.status;
            const noveltyTotal = noveltyStatus === "pass"
                ? Math.max(80, Math.round((1 - highestSim) * 100))
                : noveltyStatus === "warning" ? 70 : 45;
            const noveltyViolationTests = ctx.noveltyAudit.violations.map((v) => ({
                name: "Novelty violation",
                category: "quality",
                passed: false,
                score: 0,
                weight: 0.5,
                message: v,
            }));
            ctx.scoreAggregator.upsertPhaseScore("agent8_novelty", "Novelty Audit", {
                agent: "agent8-novelty-audit",
                validation_score: Math.round((1 - highestSim) * 100),
                quality_score: ctx.noveltyAudit.violations.length === 0 ? 100 : Math.max(0, 100 - ctx.noveltyAudit.violations.length * 20),
                completeness_score: 100,
                consistency_score: 100,
                total: noveltyTotal,
                grade: (noveltyTotal >= 90 ? "A" : noveltyTotal >= 80 ? "B" : noveltyTotal >= 70 ? "C" : noveltyTotal >= 60 ? "D" : "F"),
                passed: noveltyStatus !== "fail",
                failure_reason: noveltyStatus === "fail"
                    ? `Too similar to seed patterns (${Math.round(highestSim * 100)}% match with "${ctx.noveltyAudit.mostSimilarSeed}")`
                    : undefined,
                tests: [
                    {
                        name: "Similarity below threshold",
                        category: "validation",
                        passed: noveltyStatus !== "fail",
                        score: Math.round((1 - highestSim) * 100),
                        weight: 2,
                        message: `${Math.round(highestSim * 100)}% similar to "${ctx.noveltyAudit.mostSimilarSeed}" — ${noveltyStatus}`,
                    },
                    ...noveltyViolationTests,
                ],
            }, ctx.agentDurations["agent8_novelty"] ?? 0, ctx.agentCosts["agent8_novelty"] ?? 0);
        }
        else {
            // Novelty check skipped
            ctx.scoreAggregator.upsertPhaseScore("agent8_novelty", "Novelty Audit", {
                agent: "agent8-novelty-audit",
                validation_score: 100,
                quality_score: 100,
                completeness_score: 100,
                consistency_score: 100,
                total: 100,
                grade: "A",
                passed: true,
                tests: [
                    {
                        name: "Novelty check",
                        category: "validation",
                        passed: true,
                        score: 100,
                        weight: 1,
                        message: "Skipped (threshold ≥ 1.0 or skipNoveltyCheck set)",
                    },
                ],
            }, 0, 0);
        }
        try {
            await ctx.savePartialReport();
        }
        catch { /* best-effort */ }
    }
}
//# sourceMappingURL=agent3-run.js.map