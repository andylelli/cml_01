// Validate the harness: rebuild the writer prompt for proj_5eb8c115 chapter N and diff it against the logged prompt.
import fs from "node:fs";
import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
const run = await import(new URL("../../../../apps/worker/dist/jobs/agents/agent9-v2/run.js", import.meta.url).href);
const arm = process.argv[2] ?? "OFF";
const seg = Number(process.argv[3] ?? 0);
setEnv(arm); const LF0 = process.argv[4] === "nolf";
const c = cases.find((x) => x.id.startsWith("proj_5eb8c115"));
console.log("humour", c.input.humourLevel, "lf source", c.lfSource, "lf n", c.input.lockedFacts.length);
const k = pe.buildBookContract(LF0 ? { ...c.input, lockedFacts: [] } : c.input);
const user = run.assembleWriterPrompt({ bible: k.bible.text, brief: k.brief.text, contracts: run.renderSceneContract(k, seg + 1), soFar: "", format: pe.writerFormatInstruction([seg + 1]) });
const logged = fs.readFileSync(`prompt-run${arm === "OFF" ? 0 : 1}-Agent9v2-Writer-S${seg}-D1.txt`, "utf8").split("### user\n")[1];
const cut = (t) => t.split("\nTHE BOOK SO FAR")[0];
const a = cut(user).split("\n"), b = cut(logged).split("\n");
let diffs = 0;
for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) { if (diffs < 8) console.log(`line ${i}\n  mine:   ${a[i]}\n  logged: ${b[i]}`); diffs++; }
console.log(`arm ${arm} seg ${seg}: ${diffs} differing lines of ${b.length}`);
