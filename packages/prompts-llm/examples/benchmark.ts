/**
 * Performance benchmark script for Agent 3 (CML Generator)
 * Measures latency, cost, and success rate across all 5 axes
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import { generateCML, type CMLPromptInputs } from "../src/agent3-cml.js";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config({ path: join(process.cwd(), "../../.env.local") });

interface BenchmarkResult {
  axis: string;
  success: boolean;
  attempts: number;
  latencyMs: number;
  cost: number;
  errors: number;
}

async function runBenchmark() {
  console.log("=== Agent 3: CML Generator Performance Benchmark ===\n");

  // Check configuration
  if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
    console.error("❌ Azure OpenAI not configured");
    console.error("   Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  const client = new AzureOpenAIClient({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "gpt-4.1",
  });

  const runId = `benchmark-${Date.now()}`;
  const results: BenchmarkResult[] = [];

  const baseInputs: Omit<CMLPromptInputs, "primaryAxis"> = {
    runId,
    projectId: "benchmark",
    decade: "1930s",
    location: "Country manor",
    institution: "Private estate",
    weather: "Stormy night",
    socialStructure: "English gentry",
    tone: "Classic mystery",
    castSize: 6,
    castNames: ["Inspector Blake", "Lord Ashford", "Lady Margaret", "Dr. Harrison", "Miss Emily", "Stevens"],
    detectiveType: "Professional detective",
    victimArchetype: "Wealthy landowner",
    complexityLevel: "moderate",
    mechanismFamilies: ["timing", "misdirection"],
  };

  const axes: Array<CMLPromptInputs["primaryAxis"]> = [
    "temporal",
    "spatial",
    "identity",
    "behavioral",
    "authority",
  ];

  console.log("Testing all 5 axis types...\n");

  for (const axis of axes) {
    console.log(`\n📝 Testing ${axis.toUpperCase()} axis...`);
    
    const inputs: CMLPromptInputs = {
      ...baseInputs,
      primaryAxis: axis,
    };

    try {
      const result = await generateCML(client, inputs, undefined, 3);

      results.push({
        axis,
        success: result.validation.valid,
        attempts: result.attempt,
        latencyMs: result.latencyMs,
        cost: result.cost,
        errors: result.validation.errors.length,
      });

      if (result.validation.valid) {
        console.log(`   ✅ Success on attempt ${result.attempt}`);
        console.log(`   ⏱️  Latency: ${result.latencyMs}ms`);
        console.log(`   💰 Cost: $${result.cost.toFixed(4)}`);
      } else {
        console.log(`   ⚠️  Failed validation after ${result.attempt} attempts`);
        console.log(`   ❌ Errors: ${result.validation.errors.length}`);
        console.log(`   ⏱️  Latency: ${result.latencyMs}ms`);
        console.log(`   💰 Cost: $${result.cost.toFixed(4)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${(error as Error).message}`);
      results.push({
        axis,
        success: false,
        attempts: 3,
        latencyMs: 0,
        cost: 0,
        errors: 999,
      });
    }
  }

  // Print summary
  console.log("\n\n=== BENCHMARK SUMMARY ===\n");

  const successCount = results.filter((r) => r.success).length;
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  const avgLatency = results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length;
  const avgCost = totalCost / results.length;

  console.log(`Success Rate: ${successCount}/${results.length} (${((successCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`Total Cost: $${totalCost.toFixed(4)}`);
  console.log(`Average Cost: $${avgCost.toFixed(4)}`);
  console.log(`Average Latency: ${avgLatency.toFixed(0)}ms`);

  console.log("\n📊 Per-Axis Results:\n");
  console.log("Axis        | Success | Attempts | Latency  | Cost     | Errors");
  console.log("------------|---------|----------|----------|----------|-------");
  
  for (const result of results) {
    const status = result.success ? "✅" : "❌";
    console.log(
      `${result.axis.padEnd(11)} | ${status.padEnd(7)} | ${result.attempts}        | ${result.latencyMs.toString().padEnd(6)}ms | $${result.cost.toFixed(4).padEnd(7)} | ${result.errors}`
    );
  }

  // Targets
  console.log("\n\n=== TARGET VALIDATION ===\n");
  
  const meetsLatencyTarget = avgLatency < 30000;
  const meetsCostTarget = avgCost < 0.50;
  
  console.log(`Latency Target (<30s): ${meetsLatencyTarget ? "✅ PASS" : "❌ FAIL"} (${(avgLatency / 1000).toFixed(1)}s)`);
  console.log(`Cost Target (<$0.50): ${meetsCostTarget ? "✅ PASS" : "❌ FAIL"} ($${avgCost.toFixed(4)})`);

  if (successCount < results.length) {
    console.log(`\n⚠️  Note: ${results.length - successCount} generation(s) failed validation`);
    console.log(`   This is expected during initial testing.`);
    console.log(`   Agent 4 (Revision) will handle failures in production.`);
  }

  console.log("\n✅ Benchmark complete!\n");
}

runBenchmark().catch((error) => {
  console.error("Benchmark failed:", error);
  process.exit(1);
});
