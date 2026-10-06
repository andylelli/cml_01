import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
const [pfile, rfile, runId] = process.argv.slice(2);
const want = ["Agent9v2-Editor-Ch1-R1", "Agent9v2-Editor-Ch1-R2"];
const prompts = {}, responses = {};
for (const [file, sink, op] of [[pfile, prompts, "chat_request_full_prompt"], [rfile, responses, "chat_response"]]) {
  const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes(runId) || !line.includes("Agent9v2-Editor-Ch1-R")) continue;
    const r = JSON.parse(line);
    if (r.runId !== runId || !want.includes(r.agent) || r.operation !== op) continue;
    sink[`${r.agent}#${r.retryAttempt}`] = op === "chat_response" ? r.response : r.messages[1].content;
  }
}
for (const a of want) {
  const orig = prompts[`${a}#1`], soft = prompts[`${a}#2`], resp = responses[`${a}#2`];
  if (!orig || !soft || !resp) { console.log(a, "missing", !!orig, !!soft, !!resp); continue; }
  const chOrig = orig.slice(orig.indexOf("THE CHAPTER\n")), chSoft = soft.slice(soft.indexOf("THE CHAPTER\n"));
  const list = pe.parseEditList(resp);
  let inOrig = 0, onlySoft = 0, neither = 0; const ex = [];
  for (const e of list.edits) {
    const o = chOrig.includes(e.find), s = chSoft.includes(e.find);
    if (o) inOrig++; else if (s) { onlySoft++; ex.push(e.find.slice(0, 140)); } else neither++;
  }
  console.log(a, "edits", list.edits.length, "find matches ORIGINAL chapter", inOrig, "matches only SOFTENED text", onlySoft, "neither", neither);
  for (const x of ex.slice(0, 3)) console.log("   only-softened find:", JSON.stringify(x));
}
