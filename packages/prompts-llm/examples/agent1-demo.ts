/**
 * Agent 1 (Era & Setting Refiner) Integration Demo
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import { refineSetting, type SettingInputs } from "../src/agent1-setting.js";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config({ path: join(process.cwd(), "../../.env.local") });

async function main() {
  console.log("=== Agent 1: Era & Setting Refiner Demo ===\n");

  // Check configuration
  if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
    console.error("❌ Azure OpenAI not configured");
    process.exit(1);
  }

  // 1. Setup client
  console.log("1. Setting up Azure OpenAI client...");
  const client = new AzureOpenAIClient({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "gpt-4.1",
  });
  console.log("✅ Client configured\n");

  // 2. Define setting specifications
  console.log("2. Defining mystery setting...");
  const inputs: SettingInputs = {
    runId: `demo-${Date.now()}`,
    projectId: "agent1-demo",
    decade: "1930s",
    location: "Country manor",
    institution: "Private residence",
    weather: "Stormy autumn night",
    socialStructure: "English aristocracy",
    tone: "Classic golden age mystery",
  };
  console.log("✅ Setting defined");
  console.log(`   Era: ${inputs.decade}`);
  console.log(`   Location: ${inputs.location}`);
  console.log(`   Weather: ${inputs.weather}\n`);

  // 3. Refine setting
  console.log("3. Refining setting with Agent 1...");
  console.log("   (This may take 5-15 seconds)\n");

  try {
    const result = await refineSetting(client, inputs, 3);

    console.log("✅ Setting refined successfully!\n");

    // Display results
    console.log("=== REFINEMENT RESULTS ===\n");

    console.log("📅 Era Constraints:");
    console.log(`   Decade: ${result.setting.era.decade}`);
    console.log(`   Technology: ${result.setting.era.technology.join(", ")}`);
    console.log(`   Forensics: ${result.setting.era.forensics.join(", ")}`);
    console.log(`   Communication: ${result.setting.era.communication.join(", ")}`);
    console.log(`   Social Norms: ${result.setting.era.socialNorms.join(", ")}\n`);

    console.log("📍 Location Details:");
    console.log(`   Type: ${result.setting.location.type}`);
    console.log(`   Description: ${result.setting.location.description}`);
    console.log(`   Physical Constraints: ${result.setting.location.physicalConstraints.join(", ")}`);
    console.log(`   Isolation: ${result.setting.location.geographicIsolation}`);
    console.log(`   Access Control: ${result.setting.location.accessControl.join(", ")}\n`);

    console.log("🌧️ Atmosphere:");
    console.log(`   Weather: ${result.setting.atmosphere.weather}`);
    console.log(`   Time: ${result.setting.atmosphere.timeOfDay}`);
    console.log(`   Mood: ${result.setting.atmosphere.mood}`);
    console.log(`   Visual: ${result.setting.atmosphere.visualDescription}\n`);

    console.log("✅ Realism Check:");
    if (result.setting.realism.anachronisms.length > 0) {
      console.log(`   ⚠️  Anachronisms to avoid: ${result.setting.realism.anachronisms.join(", ")}`);
    } else {
      console.log("   ✅ No anachronisms detected");
    }
    if (result.setting.realism.implausibilities.length > 0) {
      console.log(`   ⚠️  Implausibilities: ${result.setting.realism.implausibilities.join(", ")}`);
    }
    console.log("   📝 Recommendations:");
    result.setting.realism.recommendations.forEach((rec, i) => {
      console.log(`      ${i + 1}. ${rec}`);
    });

    console.log("\n📊 Performance:");
    console.log(`   Attempt: ${result.attempt}`);
    console.log(`   Latency: ${result.latencyMs}ms`);
    console.log(`   Cost: $${result.cost.toFixed(4)}`);

    console.log("\n✅ Demo complete!\n");
  } catch (error) {
    console.error("\n❌ Refinement failed:", {
      code: (error as any).code,
      message: (error as Error).message,
    });
    console.error("\nCheck Azure OpenAI configuration and try again.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
