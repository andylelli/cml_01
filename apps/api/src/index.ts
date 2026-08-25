import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server.js";
import { installProcessGuards } from "@cml/worker/process-guards.js";

// A_73 Part IV §1 — the API runs `generateMystery` IN PROCESS (see server.ts), so an unhandled
// rejection here kills a live run, not just a request. Installed before anything can reject.
installProcessGuards("@cml/api");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * A_73 Part IV — the API loaded ONLY `.env.local`; the worker loads `.env` first and then
 * `.env.local` with `override: true`. Two entry points into the same pipeline disagreed about
 * where configuration comes from, so a variable living in `.env` was visible to one and invisible
 * to the other. Same order as the worker now, so both processes resolve identical config.
 */
config({ path: path.resolve(__dirname, "../../..", ".env") });
config({ path: path.resolve(__dirname, "../../..", ".env.local"), override: true });

const port = Number(process.env.PORT || 3005);

const app = createServer();

app.listen(port, "0.0.0.0", () => {
	console.log(`@cml/api listening on 0.0.0.0:${port}`);
});
