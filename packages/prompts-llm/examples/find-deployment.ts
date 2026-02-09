/**
 * Auto-detect working Azure OpenAI deployment name
 */

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), "../../.env.local") });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview";

// Common deployment names to try
const commonNames = [
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4-32k",
  "gpt-35-turbo",
  "gpt-35-turbo-16k",
  "gpt4",
  "gpt4o",
  "gpt4-turbo",
  "gpt-4o-deployment",
  "openai-gpt4o",
  "default"
];

async function testDeployment(deploymentName: string): Promise<boolean> {
  try {
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    
    const result = await client.getChatCompletions(
      deploymentName,
      [{ role: "user", content: "Hi" }],
      { maxTokens: 5 }
    );
    
    return result.choices.length > 0;
  } catch (error: any) {
    if (error.code === "DeploymentNotFound") {
      return false;
    }
    // Other errors (auth, rate limit, etc.) suggest deployment exists
    console.log(`  ℹ️  ${deploymentName}: ${error.code || error.message}`);
    return false;
  }
}

async function findWorkingDeployment() {
  console.log("=== Auto-detecting Azure OpenAI Deployment ===\n");
  console.log(`Testing endpoint: ${endpoint}\n`);
  
  for (const name of commonNames) {
    process.stdout.write(`Testing "${name}"... `);
    const works = await testDeployment(name);
    
    if (works) {
      console.log(`✅ FOUND!\n`);
      console.log(`Update your .env.local with:`);
      console.log(`AZURE_OPENAI_DEPLOYMENT_GPT4=${name}\n`);
      return name;
    } else {
      console.log(`❌`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n❌ None of the common deployment names worked.`);
  console.log(`You'll need to check Azure portal: https://portal.azure.com`);
  console.log(`Resource: openai-ds1sweden → Deployments\n`);
  return null;
}

findWorkingDeployment()
  .then(name => {
    if (!name) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });
