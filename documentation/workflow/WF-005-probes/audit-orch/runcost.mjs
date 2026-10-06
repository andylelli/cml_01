import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const [file, runId] = process.argv.slice(2);
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
let all = 0, v2 = 0, rub = 0;
for await (const line of rl) {
  if (!line.includes(runId) || !line.includes("chat_response")) continue;
  const r = JSON.parse(line);
  if (r.runId !== runId || r.operation !== "chat_response") continue;
  all += r.estimatedCost ?? 0;
  if (String(r.agent).startsWith("Agent9v2")) v2 += r.estimatedCost ?? 0;
}
console.log({ runId, all: all.toFixed(3), v2: v2.toFixed(3) });
