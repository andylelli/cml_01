import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
const [file, runId, agent] = process.argv.slice(2);
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
const got = {};
for await (const line of rl) {
  if (!line.includes(runId) || !line.includes(agent)) continue;
  const r = JSON.parse(line);
  if (r.agent !== agent || r.operation !== "chat_request_full_prompt") continue;
  got[r.retryAttempt] ??= r.messages;
}
const a = got[1]?.[1]?.content ?? "", b = got[2]?.[1]?.content ?? "";
console.log("try1 len", a.length, "try2 len", b.length, "system2 starts:", (got[2]?.[0]?.content ?? "").slice(0, 70));
const la = a.split("\n"), lb = b.split("\n");
let n = 0;
for (let i = 0; i < Math.min(la.length, lb.length); i++) if (la[i] !== lb[i]) { n++; if (n <= 12) console.log(`- ${la[i].slice(0, 220)}\n+ ${lb[i].slice(0, 220)}`); }
console.log("changed lines", n, "of", la.length);
