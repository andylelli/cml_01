/**
 * Debug - test exact same parameters as integration demo
 */

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), "../../.env.local") });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_GPT4!;

async function testDirectCall() {
  console.log("Testing direct Azure OpenAI call with exact parameters...\n");
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Deployment: ${deployment}\n`);

  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(apiKey),
    { apiVersion: "2024-02-15-preview" }
  );

  try {
    console.log("Test 1: Simple call (5 tokens)...");
    const result1 = await client.getChatCompletions(
      deployment,
      [{ role: "user", content: "Say hi" }],
      { maxTokens: 5 }
    );
    console.log(`✅ Success: ${result1.choices[0]?.message?.content}\n`);

    console.log("Test 2: With system message (100 tokens)...");
    const result2 = await client.getChatCompletions(
      deployment,
      [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Tell me about mysteries." }
      ],
      { maxTokens: 100, temperature: 0.7 }
    );
    console.log(`✅ Success: ${result2.choices[0]?.message?.content?.substring(0, 100)}...\n`);

    console.log("Test 3: Longer context (1000 tokens)...");
    const longPrompt = "You are a mystery expert.\n\n".repeat(50);
    const result3 = await client.getChatCompletions(
      deployment,
      [
        { role: "system", content: longPrompt },
        { role: "user", content: "Create a short mystery outline." }
      ],
      { maxTokens: 1000, temperature: 0.7 }
    );
    console.log(`✅ Success: ${result3.choices[0]?.message?.content?.substring(0, 100)}...\n`);

    console.log("Test 4: Large maxTokens (8000)...");
    const result4 = await client.getChatCompletions(
      deployment,
      [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello." }
      ],
      { maxTokens: 8000, temperature: 0.7 }
    );
    console.log(`✅ Success: ${result4.choices[0]?.message?.content}\n`);

    console.log("Test 5: Very large maxTokens (16000)...");
    const result5 = await client.getChatCompletions(
      deployment,
      [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Generate a long story." }
      ],
      { maxTokens: 16000, temperature: 0.7 }
    );
    console.log(`✅ Success: Generated ${result5.choices[0]?.message?.content?.length} characters\n`);

    console.log("✅ All tests passed! Deployment is working correctly.");

  } catch (error: any) {
    console.error(`❌ Error: ${error.code} - ${error.message}`);
    console.error(`\nFull error:`, error);
  }
}

testDirectCall();
