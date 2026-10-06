import { readFileSync, writeFileSync } from "node:fs";
const store = JSON.parse(readFileSync(process.argv[2], "utf8"));
const arts = Object.values(store.artifacts).filter(a => a.projectId === "proj_5eb8c115-ca42-4e66-997d-74fff1b327db" && /prose/.test(a.type));
for (const a of arts) {
  const p = a.payload;
  console.log(a.id, a.type, a.createdAt ?? "", "chapters", p?.chapters?.length, "keys", Object.keys(p||{}).join(","), "cost", p?.cost, "engine", p?.engine);
}
writeFileSync(process.argv[3], JSON.stringify(arts.map(a => ({ id: a.id, type: a.type, createdAt: a.createdAt, payload: a.payload }))));
