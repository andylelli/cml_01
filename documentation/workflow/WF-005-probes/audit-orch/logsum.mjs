import { readFileSync } from "node:fs";
const lines = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean);
const rows = lines.map(l => JSON.parse(l));
const keys = new Set(); rows.forEach(r => Object.keys(r).forEach(k => keys.add(k)));
console.log("keys", [...keys].join(","));
const ops = {}; rows.forEach(r => { const k = r.operation; ops[k] = (ops[k]||0)+1; });
console.log(ops);
for (const r of rows) console.log(r.runId, r.agent, r.operation, r.retryAttempt, (r.messages?.[1]?.content?.length ?? r.response?.length ?? r.content?.length ?? ""), r.finishReason ?? "", r.usage ? JSON.stringify(r.usage) : "");
