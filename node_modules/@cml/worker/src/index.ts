import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load env from workspace root — same files the API uses.
// dist/index.js is three levels up from the workspace root.
const workspaceRoot = path.resolve(__dirname, "..", "..", "..", "..");
config({ path: path.join(workspaceRoot, ".env") });
config({ path: path.join(workspaceRoot, ".env.local") });

import { startWorker } from "./runner.js";

startWorker().catch((error) => {
	console.error("@cml/worker failed to start", error);
	process.exit(1);
});
