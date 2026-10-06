import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
const run = await import("file:///C:/CML/apps/worker/dist/jobs/agents/agent9-v2/run.js");
setEnv(process.argv[2] ?? "OFF");
const per = []; let cases2 = 0, afterReveal = 0, ex = [];
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const chs = k.scenes.filter((s) => / {2}The body: .* — found dead/.test(run.renderSceneContract(k, s.chapter))).map((s) => s.chapter);
  per.push(chs.length);
  if (chs.length >= 2) { cases2++; if (ex.length < 4) ex.push(`${c.id.slice(5, 13)}: chapters ${chs.join(",")} (reveal ${k.roles.reveal})`); }
  if (chs.some((x) => x >= k.roles.reveal)) afterReveal++;
}
per.sort((a, b) => a - b);
console.log(`"The body: … found dead" line — chapters per book: median ${per[per.length >> 1]}, max ${per[per.length - 1]}; books with it in 2+ chapters: ${cases2}/${per.length}; at/after the reveal: ${afterReveal}`);
console.log(ex.join("\n"));
