/**
 * Complete integration example for Agent 3 (CML Generator)
 * 
 * This demonstrates the full flow from specification to validated CML.
 * Requires Azure OpenAI credentials in .env.local
 */

import { generateCML, buildCMLPrompt } from "../src/agent3-cml";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables from root .env.local
config({ path: join(process.cwd(), "../../.env.local") });

async function main() {
  console.log("=== Agent 3: CML Generator Integration Demo ===\n");

  // 1. Setup LLM client
  console.log("1. Setting up Azure OpenAI client...");
  
  // Check for credentials
  if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
    console.log("❌ Missing Azure OpenAI credentials");
    console.log("\nTo run this demo:");
    console.log("1. Copy .env.local.example to .env.local");
    console.log("2. Fill in your Azure OpenAI credentials");
    console.log("3. Run: npx tsx examples/integration-demo.ts");
    console.log("\nFor now, showing prompt structure only...\n");
    
    // Show prompt structure without API call
    const inputs = {
      decade: "1930s",
      location: "Country house",
      institution: "Private estate",
      tone: "Classic Golden Age",
      weather: "Fog",
      socialStructure: "Rigid class hierarchy",
      primaryAxis: "temporal" as const,
      castSize: 6,
      castNames: [
        "Inspector Blake",
        "Lord Ashford",
        "Lady Ashford",
        "Dr. Marsh",
        "Miss Grey",
        "Butler Stevens",
      ],
      detectiveType: "Professional police detective",
      victimArchetype: "Wealthy aristocrat",
      complexityLevel: "moderate" as const,
      mechanismFamilies: ["clock manipulation", "timeline confusion"],
      runId: "demo-run-123",
      projectId: "demo-project-456",
    };

    const examplesDir = join(process.cwd(), "../../examples");
    const prompt = buildCMLPrompt(inputs, examplesDir);

    console.log("=== Prompt Structure ===\n");
    console.log("System prompt length:", prompt.system.length, "chars");
    console.log("Developer context length:", prompt.developer.length, "chars");
    console.log("User requirements length:", prompt.user.length, "chars");
    console.log("Total messages:", prompt.messages.length);
    
    console.log("\n=== System Prompt Preview ===");
    console.log(prompt.system.substring(0, 200) + "...\n");
    
    console.log("=== User Requirements Preview ===");
    console.log(prompt.user.substring(0, 300) + "...\n");

    console.log("✅ Prompt structure ready for LLM");
    console.log("\nAdd Azure OpenAI credentials to test actual generation!");
    return;
  }

  const logger = new LLMLogger({
    logLevel: "info",
    logToConsole: true,
    logToFile: true,
    logFilePath: "./logs/agent3-demo.jsonl",
  });

  const client = new AzureOpenAIClient({
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "gpt-4o",
    requestsPerMinute: 60,
    logger,
  });

  console.log("✅ Client configured");
  console.log(`   Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`);
  console.log(`   Deployment: ${process.env.AZURE_OPENAI_DEPLOYMENT_GPT4}\n`);

  // 2. Define mystery specifications
  console.log("2. Defining mystery specifications...");
  
  const inputs = {
    // Setting
    decade: "1930s",
    location: "Country house",
    institution: "Private estate",
    tone: "Classic Golden Age",
    weather: "Fog",
    socialStructure: "Rigid class hierarchy",
    
    // Mystery structure
    primaryAxis: "temporal" as const,
    castSize: 6,
    castNames: [
      "Inspector Blake",
      "Lord Ashford",
      "Lady Ashford",
      "Dr. Marsh",
      "Miss Grey",
      "Butler Stevens",
    ],
    detectiveType: "Professional police detective",
    victimArchetype: "Wealthy aristocrat",
    
    // Complexity
    complexityLevel: "moderate" as const,
    mechanismFamilies: ["clock manipulation", "timeline confusion"],
    
    // Novelty constraints (optional)
    noveltyConstraints: {
      divergeFrom: ["study_in_scarlet", "moonstone"],
      areas: ["mechanism", "false_assumption"],
      avoidancePatterns: ["poison", "inheritance dispute"],
    },
    
    // Context
    runId: "demo-run-123",
    projectId: "demo-project-456",
  };

  console.log("✅ Specifications defined");
  console.log(`   Primary Axis: ${inputs.primaryAxis}`);
  console.log(`   Cast Size: ${inputs.castSize}`);
  console.log(`   Era: ${inputs.decade}`);
  console.log(`   Location: ${inputs.location}\n`);

  // 3. Generate CML
  console.log("3. Generating CML with Agent 3...");
  console.log("   (This may take 10-30 seconds)\n");

  const examplesDir = join(process.cwd(), "../../examples");
  
  try {
    const result = await generateCML(client, inputs, examplesDir, 3);

    console.log("\n=== Generation Results ===");
    console.log(`✅ Success after ${result.attempt} attempt(s)`);
    console.log(`⏱️  Latency: ${result.latencyMs}ms (${(result.latencyMs / 1000).toFixed(1)}s)`);
    console.log(`💰 Cost: $${result.cost.toFixed(4)}`);
    console.log(`✓  Validation: ${result.validation.valid ? "PASSED" : "FAILED"}`);

    if (!result.validation.valid) {
      console.log(`❌ Errors: ${result.validation.errors.join(", ")}`);
    }

    // Show CML structure
    console.log("\n=== Generated CML Structure ===");
    console.log(`CML Version: ${result.cml.CML_VERSION}`);
    console.log(`Title: ${result.cml.CASE?.meta?.title || "N/A"}`);
    console.log(`Primary Axis: ${result.cml.CASE?.meta?.primaryAxis || "N/A"}`);
    console.log(`Cast Size: ${result.cml.CASE?.cast?.length || 0}`);
    console.log(`Culprit: ${result.cml.CASE?.culpability?.culprit || "N/A"}`);
    console.log(`False Assumption Type: ${result.cml.CASE?.false_assumption?.type || "N/A"}`);
    console.log(`Constraint Space Size: ${result.cml.CASE?.constraint_space?.constraints?.length || 0}`);
    console.log(`Inference Path Steps: ${result.cml.CASE?.inference_path?.length || 0}`);
    console.log(`Discriminating Test: ${result.cml.CASE?.discriminating_test?.method || "N/A"}`);

    // Show cast
    console.log("\n=== Cast ===");
    result.cml.CASE?.cast?.forEach((character: any) => {
      console.log(`- ${character.name} (${character.role})`);
    });

    // Cost tracking summary
    const costTracker = client.getCostTracker();
    const costSummary = costTracker.getSummary();
    
    console.log("\n=== Cost Summary ===");
    console.log(`Total Cost: $${costSummary.totalCost.toFixed(4)}`);
    console.log("By Agent:", costSummary.byAgent);
    console.log("By Model:", costSummary.byModel);

    // Rate limit stats
    const rateLimiter = client.getRateLimiter();
    const stats = rateLimiter.getStats();
    
    console.log("\n=== Rate Limit Status ===");
    console.log(`Requests in last minute: ${stats.requestsInLastMinute}`);
    console.log(`Tokens in last minute: ${stats.tokensInLastMinute}`);

    console.log("\n✅ Demo complete!");

  } catch (error) {
    console.error("\n❌ Generation failed:", error);
    
    if ((error as Error).message.includes("rate_limit")) {
      console.log("\nRate limit exceeded. Wait 60 seconds and try again.");
    } else if ((error as Error).message.includes("validation")) {
      console.log("\nCML validation failed after max retries.");
      console.log("This is expected occasionally - Agent 4 (Revision) would handle this.");
    } else {
      console.log("\nUnexpected error. Check Azure OpenAI credentials and endpoint.");
    }
  }
}

// Run demo
main().catch(console.error);
