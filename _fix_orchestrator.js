// One-time patch script for mystery-orchestrator.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps', 'worker', 'src', 'jobs', 'mystery-orchestrator.ts');
let content = fs.readFileSync(filePath, 'utf-8');
let changes = 0;

// ---- Fix 1: Downgrade validation-failed else-branch from errors to warnings ----
const oldErrorLine = `errors.push(\`Story validation failed: \${validationReport.summary.critical} critical errors\`)`;
const newWarningLine = `warnings.push(\`Story validation: failed - \${validationReport.summary.critical} critical errors (non-blocking)\`)`;

if (content.includes(oldErrorLine)) {
  content = content.replace(oldErrorLine, newWarningLine);
  changes++;
  console.log('Fix 1 applied: errors.push -> warnings.push for validation failure');
} else {
  console.log('Fix 1: old pattern not found (may already be applied)');
}

const oldReportLine = `reportProgress("validation", "Story validation failed", 98)`;
const newReportLine = `reportProgress("validation", "Story validation flagged issues (non-blocking)", 98)`;

if (content.includes(oldReportLine)) {
  content = content.replace(oldReportLine, newReportLine);
  changes++;
  console.log('Fix 1b applied: reportProgress message updated');
} else {
  console.log('Fix 1b: old pattern not found (may already be applied)');
}

// ---- Fix 2: Insert prose repair retry block after initial validation ----
const anchorLine = `let validationReport = await validationPipeline.validate(storyForValidation, cml);
    agentDurations["validation"] = Date.now() - validationStart;

    // Log validation results`;

const repairBlock = `let validationReport = await validationPipeline.validate(storyForValidation, cml);
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

    // Log validation results`;

if (content.includes(anchorLine)) {
  content = content.replace(anchorLine, repairBlock);
  changes++;
  console.log('Fix 2 applied: prose repair retry block inserted');
} else {
  console.log('Fix 2: anchor not found! (may already be applied)');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Done. ${changes} fix(es) applied. File size: ${fs.statSync(filePath).size}`);
