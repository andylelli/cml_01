import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const rl = createInterface({ input: createReadStream(process.argv[2]), crlfDelay: Infinity });
const t = {};
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer") || !line.includes("chat_request_full_prompt")) continue;
  const r = JSON.parse(line);
  if (r.operation !== "chat_request_full_prompt" || !String(r.agent).startsWith("Agent9v2-Writer")) continue;
  const k = `try${r.retryAttempt} temp=${r.temperature}`;
  t[k] = (t[k] ?? 0) + 1;
}
console.log(t);
