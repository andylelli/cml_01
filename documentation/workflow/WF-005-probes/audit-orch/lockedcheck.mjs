import { createReadStream, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
const [file, proj, lockedFile] = process.argv.slice(2);
const reg = JSON.parse(readFileSync(lockedFile, "utf8")).registry;
console.log("registry values:", reg.map(f => f.value).join(" | "));
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S0-D1") || !line.includes(proj)) continue;
  const r = JSON.parse(line);
  if (r.agent !== "Agent9v2-Writer-S0-D1" || r.operation !== "chat_request_full_prompt") continue;
  const u = r.messages[1].content;
  const i = u.indexOf("Every one of these is written the same way");
  const block = i < 0 ? "" : u.slice(i, u.indexOf("\n\n", i));
  const lines = reg.filter(f => block.includes(`  ${f.value} — `)).length;
  console.log(r.timestamp, r.runId, `locked rows in bible: ${lines}/${reg.length}`);
}
