import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const rows = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l))
  .filter(r => r.runId === "resume-1791307885184" && r.operation === "chat_response" && /^Agent9v2-Writer-S(8|9)-D\d$/.test(r.agent));
const core = { scenes: [], fairPlay: { culprits: ["Isabel Morton"] }, roles: { reveal: 8 }, book: { words: { min: 7500 } } };
const arts = JSON.parse(readFileSync(process.argv[3], "utf8"));
const shipped = arts.find(a => a.id.endsWith("_1551")).payload;
for (const r of rows.sort((a, b) => a.agent.localeCompare(b.agent))) {
  const seg = Number(r.agent.match(/S(\d)/)[1]); const ch = seg + 1;
  const d = pe.parseWriterOutput(r.response, [ch], seg, 1);
  const hits = pe.checkHardGates(d.chapters, core, [ch]).map(h => h.kind);
  const fp = d.chapters[0].paragraphs.join(" ").split(/(?<=[.!?]["”’]?)\s+/).filter(s => pe.namesAsCulprit(s, "Isabel Morton"));
  const first = d.chapters[0].paragraphs[0].slice(0, 60);
  const isShipped = shipped.chapters[ch - 1].paragraphs[0].slice(0, 30) === d.chapters[0].paragraphs[0].slice(0, 30);
  console.log(r.agent, `[${hits}]`, isShipped ? "SHIPPED" : "", fp.map(s => s.slice(0, 110)).join(" || "));
}
