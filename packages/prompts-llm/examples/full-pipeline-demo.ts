/**
 * Full Pipeline Demo
 *
 * Demonstrates the complete 8-agent mystery generation pipeline.
 * Run: npx tsx examples/full-pipeline-demo.ts
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import { generateMystery, type MysteryGenerationProgress } from "../../../apps/worker/src/jobs/mystery-orchestrator.js";

async function main() {
  console.log("=".repeat(80));
  console.log("FULL PIPELINE DEMO: 8-Agent Mystery Generation");
  console.log("=".repeat(80));
  console.log();

  // Initialize client with config from environment
  const config = {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
    apiKey: process.env.AZURE_OPENAI_API_KEY || "",
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "",
    apiVersion: "2024-10-21",
  };

  if (!config.endpoint || !config.apiKey || !config.deploymentName) {
    console.error("❌ Missing Azure OpenAI configuration!");
    console.error("Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT_NAME");
    process.exit(1);
  }

  const client = new AzureOpenAIClient(config);

  // Define mystery theme
  const theme = "A wealthy industrialist is found dead in his locked study during a dinner party. The murder weapon is missing, and all guests have motives.";

  console.log("Theme:", theme);
  console.log();
  console.log("Starting pipeline...");
  console.log("-".repeat(80));
  console.log();

  // Progress tracking
  const progressCallback = (progress: MysteryGenerationProgress) => {
    const timestamp = progress.timestamp.toLocaleTimeString();
    const bar = "█".repeat(Math.floor(progress.percentage / 2)) + "░".repeat(50 - Math.floor(progress.percentage / 2));
    console.log(`[${timestamp}] ${bar} ${progress.percentage}%`);
    console.log(`  Stage: ${progress.stage} - ${progress.message}`);
    console.log();
  };

  const startTime = Date.now();

  try {
    const result = await generateMystery(
      client,
      {
        theme,
        targetLength: "medium",
        narrativeStyle: "classic",
        primaryAxis: "temporal",
        castSize: 8,
        skipNoveltyCheck: false,
        runId: `demo-${Date.now()}`,
      },
      progressCallback
    );

    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    console.log("=".repeat(80));
    console.log("PIPELINE COMPLETE");
    console.log("=".repeat(80));
    console.log();

    // Status
    console.log(`Status: ${result.status.toUpperCase()}`);
    if (result.status === "failure") {
      console.log("\n❌ ERRORS:");
      result.errors.forEach((e) => console.log(`  - ${e}`));
    }
    if (result.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      result.warnings.forEach((w) => console.log(`  - ${w}`));
    }
    console.log();

    // Metadata
    console.log("METADATA:");
    console.log(`  Run ID: ${result.metadata.runId}`);
    console.log(`  Total Duration: ${durationSeconds}s`);
    console.log(`  Total Cost: $${result.metadata.totalCost.toFixed(4)}`);
    console.log(`  Revised by Agent 4: ${result.metadata.revisedByAgent4 ? "Yes" : "No"}`);
    if (result.metadata.revisionAttempts) {
      console.log(`  Revision Attempts: ${result.metadata.revisionAttempts}`);
    }
    console.log();

    // Agent breakdown
    console.log("AGENT COSTS:");
    Object.entries(result.metadata.agentCosts).forEach(([agent, cost]) => {
      const duration = result.metadata.agentDurations[agent];
      console.log(`  ${agent}: $${cost.toFixed(4)} (${Math.floor(duration)}ms)`);
    });
    console.log();

    // Outputs
    console.log("GENERATED MYSTERY:");
    console.log(`  Title: ${result.cml.meta?.title || "Untitled"}`);
    console.log(`  Era: ${result.setting.era.year} - ${result.setting.location.name}`);
    console.log(`  Primary Axis: ${result.cml.meta?.primary_axis || "unknown"}`);
    console.log(`  Cast Size: ${result.cast.characters.length} characters`);
    console.log(`  Clues: ${result.clues.clues.length} (${result.clues.clues.filter((c) => c.criticality === "essential").length} essential)`);
    console.log(`  Red Herrings: ${result.clues.redHerrings.length}`);
    console.log(`  Scenes: ${result.narrative.totalScenes}`);
    console.log(`  Estimated Words: ${result.narrative.estimatedTotalWords.toLocaleString()}`);
    console.log();

    // Fair play audit
    console.log("FAIR PLAY AUDIT:");
    console.log(`  Status: ${result.fairPlayAudit.overallStatus}`);
    console.log(`  Checks: ${result.fairPlayAudit.checks.length} performed`);
    const passedChecks = result.fairPlayAudit.checks.filter((c) => c.status === "pass").length;
    console.log(`  Passed: ${passedChecks}/${result.fairPlayAudit.checks.length}`);
    if (result.fairPlayAudit.violations.length > 0) {
      console.log(`  Violations: ${result.fairPlayAudit.violations.length}`);
    }
    console.log();

    // Novelty audit
    if (result.noveltyAudit) {
      console.log("NOVELTY AUDIT:");
      console.log(`  Status: ${result.noveltyAudit.status}`);
      console.log(`  Overall Novelty: ${(result.noveltyAudit.overallNovelty * 100).toFixed(1)}%`);
      console.log(`  Most Similar Seed: ${result.noveltyAudit.mostSimilarSeed}`);
      console.log(`  Highest Similarity: ${(result.noveltyAudit.highestSimilarity * 100).toFixed(1)}%`);
      console.log();
    }

    // Cast
    console.log("CAST:");
    result.cast.characters.forEach((char) => {
      console.log(`  - ${char.name} (${char.role}): ${char.profile.personality.join(", ")}`);
    });
    console.log();

    // Narrative structure
    console.log("NARRATIVE STRUCTURE:");
    result.narrative.acts.forEach((act) => {
      console.log(`  Act ${act.actNumber}: ${act.title} (${act.scenes.length} scenes, ~${act.estimatedWordCount} words)`);
      console.log(`    Purpose: ${act.purpose}`);
    });
    console.log();

    console.log("=".repeat(80));
    console.log("✅ Demo complete!");
    console.log("=".repeat(80));
  } catch (error) {
    console.error("\n❌ Pipeline failed:");
    console.error(error);
    process.exit(1);
  }
}

main();
