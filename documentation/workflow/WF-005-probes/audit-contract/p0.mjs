import { cases } from "./cases.mjs";
const t = {}; for (const c of cases) t[c.lfSource] = (t[c.lfSource] ?? 0) + 1;
console.log("cases", cases.length, t);
const castKey = (c) => (c.input.cast?.characters ?? []).map((x) => x.name).sort().join("|");
console.log("distinct casts", new Set(cases.map(castKey)).size);
console.log("humour", JSON.stringify(cases.reduce((m, c) => (m[c.input.humourLevel] = (m[c.input.humourLevel] ?? 0) + 1, m), {})));
