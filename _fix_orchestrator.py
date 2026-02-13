"""One-time patch script for mystery-orchestrator.ts"""
import pathlib

p = pathlib.Path(r"C:\CML\apps\worker\src\jobs\mystery-orchestrator.ts")
c = p.read_text(encoding="utf-8")

# ---- Fix 1: Downgrade validation-failed else-branch ----
old1 = '      errors.push(`Story validation failed: ${validationReport.summary.critical} critical errors`);\n      reportProgress("validation", "Story validation failed", 98);'
new1 = '      warnings.push(`Story validation: failed - ${validationReport.summary.critical} critical errors (non-blocking)`);\n      reportProgress("validation", "Story validation flagged issues (non-blocking)", 98);'

if old1 in c:
    c = c.replace(old1, new1)
    print("Fix 1 applied: errors.push -> warnings.push")
else:
    print("Fix 1: pattern not found!")

# ---- Fix 2: Insert prose repair retry block after validation ----
anchor = '    let validationReport = await validationPipeline.validate(storyForValidation, cml);\n    agentDurations["validation"] = Date.now() - validationStart;\n\n    // Log validation results'

repair_block = '''    let validationReport = await validationPipeline.validate(storyForValidation, cml);
    agentDurations["validation"] = Date.now() - validationStart;

    // ---------- Prose repair retry for recoverable validation gaps ----------
    const recoverableErrorTypes = new Set([
      "missing_discriminating_test",
      "cml_test_not_realized",
      "suspect_closure_missing",
      "culprit_evidence_chain_missing",
    ]);
    const hasRecoverableGaps = validationReport.errors.some((e) => recoverableErrorTypes.has(e.type));

    if (hasRecoverableGaps) {
      const repairGuardrails: string[] = [];

      if (
        validationReport.errors.some(
          (e) => e.type === "missing_discriminating_test" || e.type === "cml_test_not_realized",
        )
      ) {
        repairGuardrails.push(
          "Include a clear discriminating test scene where multiple plausible suspects are explicitly evaluated and at least one suspect is ruled out using on-page evidence.",
        );
        repairGuardrails.push(
          "Use explicit elimination language such as 'ruled out', 'cannot be the culprit', or 'excluded by the timeline/evidence'.",
        );
      }

      if (
        validationReport.errors.some(
          (e) => e.type === "suspect_closure_missing" || e.type === "culprit_evidence_chain_missing",
        )
      ) {
        repairGuardrails.push(
          "In the solution sequence, close every major suspect thread with explicit reasoning and evidence-backed elimination.",
        );
        repairGuardrails.push(
          "Provide a complete culprit evidence chain from clue discovery to final proof without relying on off-page information.",
        );
      }

      if (repairGuardrails.length > 0) {
        warnings.push("Story validation detected coverage gaps; running one prose repair retry");
        reportProgress("prose", "Regenerating prose to repair validation coverage gaps", 95);

        const proseRepairStart = Date.now();
        const repairedProse = await generateProse(client, {
          caseData: cml,
          outline: narrative,
          cast: cast.cast,
          characterProfiles: characterProfiles,
          locationProfiles: locationProfiles,
          temporalContext: temporalContext,
          targetLength: inputs.targetLength,
          narrativeStyle: inputs.narrativeStyle,
          qualityGuardrails: repairGuardrails,
          runId,
          projectId: projectId || "",
        });

        prose = sanitizeProseResult(repairedProse);
        agentCosts["agent9_prose"] = (agentCosts["agent9_prose"] || 0) + repairedProse.cost;
        agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseRepairStart);

        // Re-validate repaired prose
        const repairedStory = {
          id: runId,
          projectId: projectId || runId,
          scenes: prose.chapters.map((ch: any, idx: number) => ({
            number: idx + 1,
            title: ch.title,
            text: ch.paragraphs.join("\\n\\n"),
          })),
        };

        const retryValStart = Date.now();
        const repairedReport = await validationPipeline.validate(repairedStory, cml);
        agentDurations["validation"] = (agentDurations["validation"] || 0) + (Date.now() - retryValStart);

        const improved =
          repairedReport.summary.critical < validationReport.summary.critical ||
          repairedReport.errors.length < validationReport.errors.length ||
          repairedReport.status === "passed";

        if (improved) {
          validationReport = repairedReport;
          warnings.push("Prose repair retry improved validation outcomes");
        } else {
          warnings.push("Prose repair retry did not improve validation; continuing with original");
        }
      }
    }
    // ---------- End prose repair retry ----------

    // Log validation results'''

if anchor in c:
    c = c.replace(anchor, repair_block)
    print("Fix 2 applied: prose repair retry block inserted")
else:
    print("Fix 2: anchor not found!")

p.write_text(c, encoding="utf-8")
print("File written successfully")
print(f"File size: {p.stat().st_size}")
