import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
const keys = new Set(); rows.forEach(r => Object.keys(r).forEach(k => keys.add(k)));
console.log("keys", [...keys].join(","));
const ops = {}; rows.forEach(r => { const k = r.operation + "|" + (r.level ?? ""); ops[k] = (ops[k]||0)+1; });
console.log(ops);
