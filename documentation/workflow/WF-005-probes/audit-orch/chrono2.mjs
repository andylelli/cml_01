import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const [file, ...projs] = process.argv.slice(2);
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S0-D1")) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (r.agent !== "Agent9v2-Writer-S0-D1" || r.operation !== "chat_request_full_prompt") continue;
  if (projs.length && !projs.includes(r.projectId)) continue;
  const u = r.messages?.[1]?.content ?? "";
  const i = u.indexOf("Every one of these is written the same way");
  const block = i < 0 ? "" : u.slice(i, u.indexOf("\n\n", i));
  const lockedLike = block.split("\n").filter(l => /\(read from|\(measured|external observation|witness testimony|expert/i.test(l)).length;
  console.log(r.timestamp, r.projectId, r.runId, "chronoLines", block ? block.split("\n").length - 1 : 0, "lockedDescLines", lockedLike);
}
