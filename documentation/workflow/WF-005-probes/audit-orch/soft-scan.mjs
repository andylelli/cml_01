import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const rl = createInterface({ input: createReadStream(process.argv[2]), crlfDelay: Infinity });
const counts = {};
for await (const line of rl) {
  if (!line.includes("Agent9v2")) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (!String(r.agent).startsWith("Agent9v2")) continue;
  const role = String(r.agent).replace(/-(S\d+|Ch\d+).*/, "");
  const k = `${role}|${r.operation}|try${r.retryAttempt}|${r.errorCode ?? ""}`;
  counts[k] = (counts[k] ?? 0) + 1;
  if (r.retryAttempt === 2 && r.operation === "chat_response") console.log("SOFT OK", r.timestamp, r.runId, r.agent);
}
console.log(counts);
