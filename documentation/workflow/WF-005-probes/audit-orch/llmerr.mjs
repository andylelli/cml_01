import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
for (const r of rows) if (r.operation === "chat_error") console.log(r.runId.slice(-6), r.agent, "try", r.retryAttempt, r.errorCode, String(r.errorMessage).slice(0, 160), "lat", r.latencyMs);
let byRun = {};
for (const r of rows) if (r.operation === "chat_response") { const k = r.runId; byRun[k] ??= { n:0, cost:0, pt:0, ct:0, fr:{} }; byRun[k].n++; byRun[k].cost += r.estimatedCost ?? 0; byRun[k].pt += r.promptTokens ?? 0; byRun[k].ct += r.completionTokens ?? 0; byRun[k].fr[r.finishReason] = (byRun[k].fr[r.finishReason]||0)+1; }
console.log(byRun);
