import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
const [file, out, ...runs] = process.argv.slice(2);
const info = {};
const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S") || !runs.some(r => line.includes(r))) continue;
  const r = JSON.parse(line);
  if (r.operation !== "chat_request_full_prompt" || !/-D1$/.test(r.agent)) continue;
  const u = r.messages[1].content;
  const i = u.indexOf("## THE CHAPTERS TO WRITE");
  const c = u.slice(i, i + 3000);
  info[r.runId] ??= {};
  let m;
  if ((m = /comes after (.+?) (?:was|were) named in chapter (\d+)/.exec(c))) { info[r.runId].culprit ??= m[1]; info[r.runId].reveal ??= Number(m[2]); }
  if ((m = /=== CHAPTER (\d+)[^\n]*===\n(?:[^\n]*\n)?\s*This chapter is the reveal\./.exec(c))) info[r.runId].reveal = Number(m[1]);
  if ((m = /the chapter where (.+?) is named\./.exec(c))) info[r.runId].culprit = m[1];
  if ((m = /The culprit is named in chapter (\d+)\./.exec(c))) info[r.runId].revealOwed ??= Number(m[1]);
}
writeFileSync(out, JSON.stringify(info, null, 1));
console.log(info);
