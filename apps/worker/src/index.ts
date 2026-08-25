import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load env from workspace root — same files the API uses.
// dist/index.js lives at apps/worker/dist — 3 levels up reaches workspace root.
const workspaceRoot = path.resolve(__dirname, "..", "..", "..");
config({ path: path.join(workspaceRoot, ".env") });
config({ path: path.join(workspaceRoot, ".env.local"), override: true });

import { startWorker } from "./runner.js";
import { installProcessGuards } from "./process-guards.js";

// A_73 Part IV §1 — before anything can reject. This entry point previously handled only a failure
// to START; a rejection escaping mid-run took the process down silently, taking the run with it.
installProcessGuards("@cml/worker");

startWorker().catch((error) => {
	console.error("@cml/worker failed to start", error);
	process.exit(1);
});
