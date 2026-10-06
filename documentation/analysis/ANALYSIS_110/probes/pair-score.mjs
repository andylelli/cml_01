// A_110 — score the three-arm matched pair on run bcc0d637 against the predictions stated before launch (2026-10-06).
// Each arm is "<label>=<manuscript.md>[,<run log>]". Run from the repo root after `npm run build:all`:
//   node documentation/analysis/ANALYSIS_110/probes/pair-score.mjs A=stories/.../x.md "A'=path.md,path.log" "B=path.md,path.log"
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const pg = await import(pathToFileURL(`${process.cwd()}/packages/prose-guard/dist/index.js`).href);
const arms = process.argv.slice(2).map((a) => { const [label, rest] = a.split(/=(.*)/s); const [md, log] = rest.split(","); return { label, md, log }; });

const store = JSON.parse(fs.readFileSync("data/store.json", "utf8"));
const art = {}; for (const a of store.artifacts) if (a.projectId === "proj_5eb8c115-ca42-4e66-997d-74fff1b327db") art[a.type] = a.payload;
const cast = (art.cast.cast ?? art.cast).characters;
const victim = cast.find((c) => /victim/i.test(`${c.role} ${c.roleArchetype}`));
const living = cast.filter((c) => c !== victim);
const stems = (occ) => String(occ).replace(/\(.*?\)/g, "").toLowerCase().split(/\s+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 5)).filter((w) => !["retir", "forme", "local", "occas", "famil", "hotel"].includes(w));

const score = ({ label, md, log }) => {
  const raw = fs.readFileSync(md, "utf8");
  const chapters = raw.split(/^## Chapter \d+: .*$/m).slice(1).map((c) => c.replace(/^---\s*$/gm, "").trim().split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean));
  const body = chapters.map((c) => c.join("\n\n")).join("\n\n").replace(/[’]/g, "'");
  const ch1 = chapters[0] ?? [];
  const ch1Text = ch1.join("\n\n");
  const firstQuote = ch1.findIndex((p) => /["“]/.test(p)) + 1;
  const count = (re, s = body) => (s.match(re) || []).length;
  // P1 (my definition): the paragraph where a living person is first named carries a word of their occupation
  const introduced = living.filter((c) => {
    const full = c.name, first = c.name.split(" ")[0];
    for (const ch of chapters) {
      const p = ch.find((x) => x.includes(full)) ?? ch.find((x) => new RegExp(`\\b${first}\\b`).test(x));
      if (p) return stems(c.occupation).some((s) => p.toLowerCase().includes(s));
    }
    return false;
  }).length;
  const victimWho = stems(victim.occupation).some((s) => ch1Text.toLowerCase().includes(s)) || /\b(seventy|seventies|eighty|old man|elderly|aged)\b/i.test(ch1Text);
  const narration = body.split(/(?<=[.!?]["”]?)\s+/).filter((s) => !/["“]/.test(s));
  const shape = pg.measurePageShape(body);
  // the run log: cost, gate, hard gates, contract notes
  let logInfo = {};
  if (log && fs.existsSync(log)) {
    const L = fs.readFileSync(log, "utf8").split("\n").filter((l) => !l.startsWith("WARNINGS "));
    const grab = (re) => (L.find((l) => re.test(l)) ?? "").trim().slice(0, 220);
    logInfo = {
      run: grab(/run[_ ]?id|runId|\[resume-run\] run/i),
      gate: grab(/release gate|release_gate|RELEASE GATE/i),
      cost: grab(/total cost|cost:|£/i),
      contractNotes: grab(/contract notes/),
      clueMissing: L.filter((l) => /clue_missing/.test(l)).length,
      shipShape: grab(/SHIP-CHECK page shape/),
    };
  }
  let owner = {};
  try { owner = JSON.parse(execFileSync("node", ["documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs", md], { encoding: "utf8" }).split("\n").find((l) => l.startsWith("{")) ?? "{}"); } catch { /* probe absent */ }
  return {
    label,
    words: shape.words,
    "1 first spoken line, ch1 paragraph": firstQuote,
    "2 Mevagissey / January / 1934": `${count(/Mevagissey/g)} / ${count(/\bJanuary\b/g)} / ${count(/\b1934\b/g)}`,
    "3 living introduced with occupation": `${introduced}/${living.length}`,
    "4 victim's job or age in ch1": victimWho,
    "5 police/doctor in ch1 · probe: spoke, authority": `${count(/\b(police|constable|doctor|inspector)\b/gi, ch1Text)} · ${owner.p5_spoke ?? "?"}, ${owner.p5_authoritySent ?? "?"}`,
    "6 empty chair · letters sent/doors unlocked": `${count(/empty chair/gi)} · ${count(/letters? sent|doors? unlocked/gi)}`,
    "7 imagined/by proxy reply": count(/by proxy|imagined by/gi),
    "8 'the period' · chapter in narration": `${count(/the period'?s?\b/gi)} · ${narration.filter((s) => /\b(?:in|from|referenced in|recalled from) chapter \w+|the chapter (?:ended|ends)/i.test(s)).length}`,
    "9 body-part tail per 10k": shape.tailPer10k,
    "10 compressed ratio · opener entropy": `${shape.compressedRatio} · ${shape.openerEntropy}`,
    "   length runs · distinct/8k": `${shape.lengthLag1} · ${shape.distinctPer8k}`,
    "   was asked · max trait label": `${count(/\bwas asked\b/g)} · ${owner.p9_maxTraitLabel ?? "?"}`,
    ...logInfo,
  };
};

const rows = arms.map(score);
const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter((k) => k !== "label");
console.log(["".padEnd(48), ...rows.map((r) => r.label.padEnd(26))].join(""));
for (const k of keys) console.log([k.padEnd(48), ...rows.map((r) => String(r[k] ?? "").slice(0, 25).padEnd(26))].join(""));
