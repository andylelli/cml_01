import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
const run = await import(new URL("../../../../apps/worker/dist/jobs/agents/agent9-v2/run.js", import.meta.url).href);
setEnv(process.argv[2] ?? "OFF");
const fields = {}; const after = []; let casesWithJob = 0;
for (const c of cases) {
  const k = pe.buildBookContract(c.input); let any = false;
  for (const s of k.scenes) {
    if (!s.job) continue; any = true;
    for (const [f, v] of Object.entries(s.job)) {
      if (f === "beat") continue;
      fields[`${s.beat}.${f}`] = (fields[`${s.beat}.${f}`] ?? 0) + 1;
      if (s.chapter > k.roles.reveal && k.fairPlay.culprits.some((x) => String(v).includes(x))) after.push(`${c.id.slice(5, 13)} ch${s.chapter}(${s.role}) ${f}: ${v}`);
    }
  }
  if (any) casesWithJob++;
}
console.log("cases with job fields:", casesWithJob, JSON.stringify(fields));
console.log("job lines after the reveal naming a culprit:", after.length); for (const a of after) console.log("  " + a);
