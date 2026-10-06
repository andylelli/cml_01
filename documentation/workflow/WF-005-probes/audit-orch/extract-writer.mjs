// Extract first writer prompt per segment for given runIds into a JSON file
import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
const [file, out, ...runs] = process.argv.slice(2);
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
const res = {};
for await (const line of rl) {
  if (!line.includes("Agent9v2-") ) continue;
  if (!runs.some(r => line.includes(r))) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (r.operation !== "chat_request_full_prompt") continue;
  res[r.runId] ??= {};
  const key = r.agent + (r.retryAttempt === 2 ? "#soft" : "");
  if (!(key in res[r.runId])) res[r.runId][key] = { system: r.messages?.[0]?.content, user: r.messages?.[1]?.content, ts: r.timestamp };
}
writeFileSync(out, JSON.stringify(res));
for (const [k, v] of Object.entries(res)) console.log(k, Object.keys(v).length);
