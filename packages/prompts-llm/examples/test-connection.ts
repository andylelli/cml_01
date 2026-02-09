/**
 * Test Azure OpenAI connection and help diagnose configuration issues
 */

import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config({ path: join(process.cwd(), "../../.env.local") });

console.log("=== Azure OpenAI Configuration Check ===\n");

console.log("Environment Variables:");
console.log(`  AZURE_OPENAI_ENDPOINT: ${process.env.AZURE_OPENAI_ENDPOINT || "❌ NOT SET"}`);
console.log(`  AZURE_OPENAI_API_KEY: ${process.env.AZURE_OPENAI_API_KEY ? "✅ SET (hidden)" : "❌ NOT SET"}`);
console.log(`  AZURE_OPENAI_DEPLOYMENT_GPT4: ${process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || "❌ NOT SET"}`);
console.log(`  AZURE_OPENAI_API_VERSION: ${process.env.AZURE_OPENAI_API_VERSION || "❌ NOT SET"}`);

console.log("\n=== Troubleshooting ===\n");

console.log("The error 'DeploymentNotFound' means:");
console.log("1. The deployment name 'gpt-4o' doesn't exist in your Azure OpenAI resource");
console.log("2. You need to check your Azure portal for the actual deployment name\n");

console.log("To fix this:");
console.log("1. Go to: https://portal.azure.com");
console.log("2. Navigate to your Azure OpenAI resource: openai-ds1sweden");
console.log("3. Go to 'Deployments' or 'Model deployments'");
console.log("4. Check the NAME of your deployed model (not the base model)");
console.log("5. Update .env.local with the correct deployment name:\n");
console.log("   AZURE_OPENAI_DEPLOYMENT_GPT4=<your-actual-deployment-name>\n");

console.log("Common deployment names:");
console.log("  - gpt-4");
console.log("  - gpt-4-turbo");
console.log("  - gpt-4o");
console.log("  - gpt-35-turbo");
console.log("  - Your custom name (e.g., 'my-gpt4-deployment')\n");

console.log("Once you have the correct deployment name, update .env.local and try again!");
