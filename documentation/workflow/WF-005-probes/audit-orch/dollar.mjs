import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
const pe = await import(pathToFileURL("C:/CML/packages/prose-engine/dist/index.js").href);
let edits = 0, dollar = 0, responses = 0;
for (const file of process.argv.slice(2)) {
  const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes("Agent9v2-Editor") || !line.includes("chat_response")) continue;
    const r = JSON.parse(line);
    if (r.operation !== "chat_response") continue;
    responses++;
    for (const e of pe.parseEditList(r.response).edits) { edits++; if (e.replace.includes("$")) { dollar++; console.log("  $ in replace:", e.replace.slice(0, 120)); } }
  }
}
console.log({ responses, edits, replacesWithDollar: dollar });
// probe the mechanism on a known positive
const ch = { number: 1, title: "t", paragraphs: ["He paid the porter five shillings and left the hall at once without a word to anyone."] };
const out = pe.applyEditList(ch, { edits: [{ find: "five shillings", replace: "a dollar ($1) and $& more", addresses: [] }], cannot: [] }, { lockedValues: [], castNames: [], findings: [] });
console.log("probe result:", JSON.stringify(out.chapter.paragraphs[0]), JSON.stringify(out.outcome));
