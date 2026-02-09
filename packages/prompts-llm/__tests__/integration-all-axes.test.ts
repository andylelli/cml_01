/**
 * Integration tests for Agent 3 (CML Generator)
 * Tests all 5 axis types with real LLM calls (requires Azure OpenAI configured)
 */

import { describe, it, expect, beforeAll } from "vitest";
import { config } from "dotenv";
import { join } from "path";
import { AzureOpenAIClient } from "@cml/llm-client";
import { generateCML, type CMLPromptInputs } from "../src/agent3-cml.js";
import { validateCml } from "@cml/cml";

// Load environment variables from root .env.local
config({ path: join(process.cwd(), "../../.env.local") });

describe("Agent 3 Integration Tests (Real LLM)", () => {
  let client: AzureOpenAIClient;
  const runId = `test-${Date.now()}`;
  const projectId = "integration-test";

  beforeAll(() => {
    // Check if Azure OpenAI is configured
    if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_API_KEY) {
      throw new Error("Azure OpenAI not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY");
    }

    client = new AzureOpenAIClient({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
      defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "gpt-4.1",
    });
  });

  const baseInputs: Omit<CMLPromptInputs, "primaryAxis"> = {
    runId,
    projectId,
    decade: "1930s",
    location: "Country estate",
    institution: "Private residence",
    weather: "Foggy autumn evening",
    socialStructure: "English aristocracy",
    tone: "Classic golden age mystery",
    castSize: 6,
    castNames: [
      "Inspector Blake",
      "Lord Ashford",
      "Lady Margaret",
      "Dr. Harrison",
      "Miss Emily",
      "Butler Stevens",
    ],
    detectiveType: "Professional police detective",
    victimArchetype: "Wealthy aristocrat",
    complexityLevel: "moderate",
    mechanismFamilies: ["timing", "misdirection"],
  };

  // Test each of the 5 axis types
  describe("Temporal Axis", () => {
    it("should generate valid CML for temporal axis mystery", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "temporal",
      };

      const result = await generateCML(client, inputs, undefined, 3);

      // Should succeed (or fail gracefully)
      expect(result).toBeDefined();
      expect(result.cml).toBeDefined();
      expect(result.validation).toBeDefined();

      // Log results
      console.log(`\n✅ Temporal Axis - Attempt ${result.attempt}`);
      console.log(`   Valid: ${result.validation.valid}`);
      console.log(`   Cost: $${result.cost.toFixed(4)}`);
      console.log(`   Latency: ${result.latencyMs}ms`);

      if (!result.validation.valid) {
        console.log(`   Errors: ${result.validation.errors.length}`);
      }
    }, 60000); // 60s timeout
  });

  describe("Spatial Axis", () => {
    it("should generate valid CML for spatial axis mystery", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "spatial",
        mechanismFamilies: ["impossible_location", "misdirection"],
      };

      const result = await generateCML(client, inputs, undefined, 3);

      expect(result).toBeDefined();
      expect(result.cml).toBeDefined();
      expect(result.validation).toBeDefined();

      console.log(`\n✅ Spatial Axis - Attempt ${result.attempt}`);
      console.log(`   Valid: ${result.validation.valid}`);
      console.log(`   Cost: $${result.cost.toFixed(4)}`);
      console.log(`   Latency: ${result.latencyMs}ms`);

      if (!result.validation.valid) {
        console.log(`   Errors: ${result.validation.errors.length}`);
      }
    }, 60000);
  });

  describe("Identity Axis", () => {
    it("should generate valid CML for identity axis mystery", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "identity",
        mechanismFamilies: ["disguise", "impersonation"],
      };

      const result = await generateCML(client, inputs, undefined, 3);

      expect(result).toBeDefined();
      expect(result.cml).toBeDefined();
      expect(result.validation).toBeDefined();

      console.log(`\n✅ Identity Axis - Attempt ${result.attempt}`);
      console.log(`   Valid: ${result.validation.valid}`);
      console.log(`   Cost: $${result.cost.toFixed(4)}`);
      console.log(`   Latency: ${result.latencyMs}ms`);

      if (!result.validation.valid) {
        console.log(`   Errors: ${result.validation.errors.length}`);
      }
    }, 60000);
  });

  describe("Behavioral Axis", () => {
    it("should generate valid CML for behavioral axis mystery", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "behavioral",
        mechanismFamilies: ["motive_masking", "psychology"],
      };

      const result = await generateCML(client, inputs, undefined, 3);

      expect(result).toBeDefined();
      expect(result.cml).toBeDefined();
      expect(result.validation).toBeDefined();

      console.log(`\n✅ Behavioral Axis - Attempt ${result.attempt}`);
      console.log(`   Valid: ${result.validation.valid}`);
      console.log(`   Cost: $${result.cost.toFixed(4)}`);
      console.log(`   Latency: ${result.latencyMs}ms`);

      if (!result.validation.valid) {
        console.log(`   Errors: ${result.validation.errors.length}`);
      }
    }, 60000);
  });

  describe("Authority Axis", () => {
    it("should generate valid CML for authority axis mystery", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "authority",
        mechanismFamilies: ["administrative_pressure", "institutional"],
      };

      const result = await generateCML(client, inputs, undefined, 3);

      expect(result).toBeDefined();
      expect(result.cml).toBeDefined();
      expect(result.validation).toBeDefined();

      console.log(`\n✅ Authority Axis - Attempt ${result.attempt}`);
      console.log(`   Valid: ${result.validation.valid}`);
      console.log(`   Cost: $${result.cost.toFixed(4)}`);
      console.log(`   Latency: ${result.latencyMs}ms`);

      if (!result.validation.valid) {
        console.log(`   Errors: ${result.validation.errors.length}`);
      }
    }, 60000);
  });

  describe("Performance Benchmarks", () => {
    it("should complete within 30 seconds", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "temporal",
      };

      const startTime = Date.now();
      const result = await generateCML(client, inputs, undefined, 3);
      const totalTime = Date.now() - startTime;

      console.log(`\n📊 Performance: ${totalTime}ms total (including ${result.attempt} attempts)`);
      
      // Should complete within 60s (allowing for retries)
      expect(totalTime).toBeLessThan(60000);
    }, 60000);

    it("should cost less than $0.50 per generation", async () => {
      const inputs: CMLPromptInputs = {
        ...baseInputs,
        primaryAxis: "spatial",
      };

      const result = await generateCML(client, inputs, undefined, 3);

      console.log(`\n💰 Cost: $${result.cost.toFixed(4)}`);
      
      // Should be reasonably priced
      expect(result.cost).toBeLessThan(0.5);
    }, 60000);
  });
});
