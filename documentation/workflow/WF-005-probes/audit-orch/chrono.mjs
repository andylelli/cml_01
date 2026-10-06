import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const [file, agent, proj] = process.argv.slice(2);
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.includes(agent) || !line.includes(proj)) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (r.agent !== agent || r.operation !== "chat_request_full_prompt") continue;
  const u = r.messages?.[1]?.content ?? "";
  const i = u.indexOf("Every one of these is written the same way");
  const j = u.indexOf("\n## ", i);
  console.log("=== ", r.runId, r.timestamp, "promptLen", u.length);
  console.log(i < 0 ? "(no chronology block)" : u.slice(i, Math.min(j > 0 ? j : i + 2500, i + 2500)));
}
