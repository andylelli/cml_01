/**
 * Agent 2 (Cast & Motive Designer) Integration Demo
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import { designCast, type CastInputs } from "../src/agent2-cast.js";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config({ path: join(process.cwd(), "../../.env.local") });

async function main() {
  console.log("=== Agent 2: Cast & Motive Designer Demo ===\n");

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

  // 2. Define cast specifications
  console.log("2. Defining character cast...");
  const inputs: CastInputs = {
    runId: `demo-${Date.now()}`,
    projectId: "agent2-demo",
    characterNames: [
      "Lady Margaret Ashford",
      "Professor James Hartford",
      "Miss Emily Thornton",
      "Dr. Charles Westwood",
      "Mrs. Catherine Blake",
      "Inspector Thomas Reid",
    ],
    setting: "1930s English country manor during a weekend house party",
    crimeType: "Murder of the manor's owner",
    tone: "Classic golden age mystery with gothic atmosphere",
    socialContext: "English aristocracy with household staff, strict class divisions",
  };
  console.log("✅ Cast defined");
  console.log(`   Characters: ${inputs.characterNames.length}`);
  console.log(`   Setting: ${inputs.setting}`);
  console.log(`   Crime: ${inputs.crimeType}\n`);

  // 3. Design cast
  console.log("3. Designing cast with Agent 2...");
  console.log("   (This may take 10-20 seconds)\n");

  try {
    const result = await designCast(client, inputs, 3);

    console.log("✅ Cast designed successfully!\n");

    // Display results
    console.log("=== CAST DESIGN RESULTS ===\n");

    console.log("👥 Character Profiles:\n");
    result.cast.characters.forEach((char, idx) => {
      console.log(`${idx + 1}. ${char.name}`);
      console.log(`   Age: ${char.ageRange} | Occupation: ${char.occupation}`);
      console.log(`   Role: ${char.roleArchetype}`);
      console.log(`   Public: ${char.publicPersona}`);
      console.log(`   Secret: ${char.privateSecret}`);
      console.log(`   Motive: ${char.motiveSeed} (${char.motiveStrength})`);
      console.log(`   Alibi: ${char.alibiWindow}`);
      console.log(`   Access: ${char.accessPlausibility}`);
      console.log(`   Stakes: ${char.stakes}`);
      console.log();
    });

    console.log("🔗 Key Relationships:\n");
    const topRelationships = result.cast.relationships.pairs
      .filter((r) => r.tension !== "none")
      .slice(0, 5);
    topRelationships.forEach((rel, idx) => {
      console.log(`${idx + 1}. ${rel.character1} ↔ ${rel.character2}`);
      console.log(`   Type: ${rel.relationship}`);
      console.log(`   Tension: ${rel.tension}`);
      console.log(`   History: ${rel.sharedHistory}`);
      console.log();
    });

    console.log("✅ Diversity Check:");
    if (result.cast.diversity.stereotypeCheck.length > 0) {
      console.log("   ⚠️  Stereotypes to avoid:");
      result.cast.diversity.stereotypeCheck.forEach((s) => console.log(`      - ${s}`));
    } else {
      console.log("   ✅ No obvious stereotypes detected");
    }
    if (result.cast.diversity.recommendations.length > 0) {
      console.log("   📝 Recommendations:");
      result.cast.diversity.recommendations.forEach((r) => console.log(`      - ${r}`));
    }

    console.log("\n🎭 Crime Dynamics:");
    console.log(`   Possible Culprits (${result.cast.crimeDynamics.possibleCulprits.length}):`);
    result.cast.crimeDynamics.possibleCulprits.forEach((c) => console.log(`      - ${c}`));
    console.log(`   Red Herrings (${result.cast.crimeDynamics.redHerrings.length}):`);
    result.cast.crimeDynamics.redHerrings.forEach((c) => console.log(`      - ${c}`));
    console.log(`   Victim Candidates (${result.cast.crimeDynamics.victimCandidates.length}):`);
    result.cast.crimeDynamics.victimCandidates.forEach((c) => console.log(`      - ${c}`));
    console.log(`   Detective Candidates (${result.cast.crimeDynamics.detectiveCandidates.length}):`);
    result.cast.crimeDynamics.detectiveCandidates.forEach((c) => console.log(`      - ${c}`));

    console.log("\n📊 Performance:");
    console.log(`   Attempt: ${result.attempt}`);
    console.log(`   Latency: ${result.latencyMs}ms`);

    console.log("\n✅ Demo complete!\n");
  } catch (error) {
    console.error("\n❌ Cast design failed:", {
      code: (error as any).code,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    console.error("\nCheck Azure OpenAI configuration and try again.\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
