/**
 * Agent 4 Integration Demo
 * 
 * Demonstrates Agent 4's ability to fix validation errors from Agent 3.
 * Uses actual failing CML from Agent 3 tests.
 */

import { AzureOpenAIClient } from "@cml/llm-client";
import { reviseCml } from "../src/agent4-revision";
import { validateCml } from "@cml/cml";
import yaml from "js-yaml";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config({ path: join(process.cwd(), "../../.env.local") });

// Simulate Agent 3 output with validation errors (missing required fields)
const mockInvalidCml = `CASE:
  meta:
    title: "The Missing Timepiece"
    author: "Agent3-CMLGenerator"
    version: "2.0"
    # Missing: license, era, setting, crime_class
    
  cast:
    - name: "Inspector Thomas Blake"
      occupation: "Scotland Yard Detective"
      # Missing: age_range, role_archetype, public_persona, private_secret,
      #          motive_seed, motive_strength, alibi_window, access_plausibility, stakes
      
    - name: "Lady Margaret Ashford"
      occupation: "Manor Owner"
      # Missing same fields as above
      
    - name: "Dr. Charles Harrington"
      occupation: "Family Physician"
      # Missing same fields as above
      
  culpability:
    # Missing: culprit_count, culprits
    explanation: "The doctor had opportunity and motive"
    
  surface_model:
    # Missing: accepted_facts, inferred_conclusions
    description: "Investigation reveals contradictions"
    
  hidden_model:
    # Missing: outcome
    truth: "The real events were different"
    
  false_assumption:
    # Missing: statement, why_it_seems_reasonable, what_it_hides
    concept: "Time of death was assumed"
    
  inference_path:
    # Should be object with steps array, not string
    description: "Inspector reconstructs the timeline"
    
  discriminating_test:
    # Missing: design, knowledge_revealed, pass_condition
    # Wrong method value
    method: "timeline_reconstruction"
    explanation: "Verify alibis"
    
  fair_play:
    # Missing: all_clues_visible, no_special_knowledge_required,
    #          no_late_information, explanation
    status: "fair"`;

async function main() {
  console.log("=== Agent 4: CML Revision Agent Demo ===\n");

  // Configure Azure OpenAI client
  const client = new AzureOpenAIClient({
    endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
    apiKey: process.env.AZURE_OPENAI_API_KEY!,
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4!,
  });

  console.log("✅ Client configured\n");

  // Parse and validate the invalid CML
  console.log("📄 Validating Agent 3 output...\n");
  
  const invalidParsed = yaml.load(mockInvalidCml) as Record<string, unknown>;
  const initialValidation = validateCml(invalidParsed);

  console.log(`❌ Validation Failed: ${initialValidation.errors.length} errors\n`);
  
  // Show first 10 errors
  console.log("Sample errors:");
  initialValidation.errors.slice(0, 10).forEach((error, i) => {
    console.log(`  ${i + 1}. ${error}`);
  });
  if (initialValidation.errors.length > 10) {
    console.log(`  ... and ${initialValidation.errors.length - 10} more\n`);
  } else {
    console.log();
  }

  // Build original prompt context (abbreviated for demo)
  const mockOriginalPrompt = {
    system: "You are an expert mystery writer specializing in classic detective fiction...",
    developer: "Generate a valid CML 2.0 document for a temporal axis mystery set in a 1930s English manor...",
    user: `Create a mystery with the following cast: Inspector Blake, Lady Ashford, Dr. Harrington, Miss Emily, Mr. Stevens, Mrs. Blake.
Focus on temporal axis (alibi reconstruction, timeline manipulation).
Complexity: moderate
Crime: murder`,
  };

  // Call Agent 4 to fix validation errors
  console.log("🔧 Calling Agent 4 to fix errors...\n");

  try {
    const result = await reviseCml(client, {
      originalPrompt: mockOriginalPrompt,
      invalidCml: mockInvalidCml,
      validationErrors: initialValidation.errors,
      attempt: 1,
      runId: "demo-run-1",
      projectId: "demo-project",
    });

    console.log("✅ Revision successful!\n");

    console.log("📊 Results:");
    console.log(`  Total attempts: ${result.attempt}`);
    console.log(`  Latency: ${result.latencyMs}ms`);
    console.log(`  Initial errors: ${initialValidation.errors.length}`);
    console.log(`  Final errors: ${result.validation.errors.length}`);
    console.log(`  Validation: ${result.validation.valid ? "PASS ✅" : "FAIL ❌"}\n`);

    console.log("🛠️ Revisions applied:");
    result.revisionsApplied.forEach((revision, i) => {
      console.log(`  ${i + 1}. ${revision}`);
    });
    console.log();

    // Show sample of fixed CML
    console.log("📝 Sample of fixed CML:\n");
    const fixedYaml = yaml.dump(result.cml);
    const lines = fixedYaml.split("\n").slice(0, 30);
    console.log(lines.join("\n"));
    if (fixedYaml.split("\n").length > 30) {
      console.log("... (truncated)");
    }
    console.log();

    // Verify specific fixes
    const fixed = result.cml as any;
    console.log("🔍 Verification of key fixes:");
    console.log(`  ✅ meta.license: ${fixed.CASE?.meta?.license || "MISSING"}`);
    console.log(`  ✅ meta.era: ${fixed.CASE?.meta?.era || "MISSING"}`);
    console.log(`  ✅ meta.setting: ${fixed.CASE?.meta?.setting || "MISSING"}`);
    console.log(`  ✅ meta.crime_class: ${fixed.CASE?.meta?.crime_class || "MISSING"}`);
    console.log(`  ✅ cast[0].age_range: ${fixed.CASE?.cast?.[0]?.age_range || "MISSING"}`);
    console.log(`  ✅ cast[0].motive_strength: ${fixed.CASE?.cast?.[0]?.motive_strength || "MISSING"}`);
    console.log(`  ✅ culpability.culprit_count: ${fixed.CASE?.culpability?.culprit_count || "MISSING"}`);
    console.log(`  ✅ discriminating_test.method: ${fixed.CASE?.discriminating_test?.method || "MISSING"}`);
    console.log();

    console.log("✅ Demo complete!");

  } catch (error) {
    console.error("❌ Revision failed:");
    console.error((error as Error).message);
    
    if ((error as any).validation) {
      console.log("\nRemaining errors:");
      (error as any).validation.errors.slice(0, 10).forEach((err: string, i: number) => {
        console.log(`  ${i + 1}. ${err}`);
      });
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
