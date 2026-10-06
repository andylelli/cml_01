import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const rl = createInterface({ input: createReadStream(process.argv[2]), crlfDelay: Infinity });
const runs = {};
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer")) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (!String(r.agent).startsWith("Agent9v2-Writer")) continue;
  const R = runs[r.runId] ??= { firstOK: 0, refused400: 0, softOK: 0, softErr: 0, e429: 0, errCost: 0, latErr: 0 };
  if (r.operation === "chat_response" && r.retryAttempt === 1) R.firstOK++;
  if (r.operation === "chat_response" && r.retryAttempt === 2) R.softOK++;
  if (r.operation === "chat_error" && r.errorCode === "HTTP_400" && r.retryAttempt === 1) R.refused400++;
  if (r.operation === "chat_error" && r.retryAttempt === 2 && r.errorCode !== "429") R.softErr++;
  if (r.operation === "chat_error" && r.errorCode === "429") R.e429++;
  if (r.operation === "chat_error") { R.errCost += r.estimatedCost ?? 0; R.latErr += r.latencyMs ?? 0; }
}
for (const [k, v] of Object.entries(runs)) if (v.refused400 || v.softOK) console.log(k, JSON.stringify(v));
