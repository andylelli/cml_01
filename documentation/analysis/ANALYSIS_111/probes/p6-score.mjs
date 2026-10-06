#!/usr/bin/env node
/**
 * A_111 P-6 — score a prose redo against PAIR-82094-P6.md's predictions. Generic: every case fact comes from the stored
 * case (owner-needs-probe's caseOf), never from this file.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/p6-score.mjs <label>=<book.md>[,<run.log>[,<projectId>]] ...
 */
import { readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

const here = (p) => pathToFileURL(`${process.cwd()}/${p}`).href;
const owner = await import(here("documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs"));
const pg = await import(here("packages/prose-guard/dist/index.js"));

const arms = process.argv.slice(2).map((a) => { const [label, rest] = a.split(/=(.*)/s); const [md, log, project] = rest.split(","); return { label, md, log, project }; });
const rows = [];
for (const arm of arms) {
  const raw = readFileSync(arm.md, "utf8");
  const match = arm.project ? { id: arm.project, art: owner.caseArtifactsOf(arm.project) } : owner.matchCase(raw);
  const cs = match ? owner.caseOf(match.art) : null;
  const m = match ? owner.measure(raw, cs) : null;
  const chapters = raw.split(/^##\s+Chapter\s+\d+[^\n]*$/m).slice(1).map((c) => c.replace(/^---\s*$/gm, "").trim());
  const parasOf = (c) => c.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const ch1 = parasOf(chapters[0] ?? "");
  const firstSpeech = ch1.findIndex((p) => /["“]/.test(p)) + 1;
  // introductions: a paragraph that opens on a living person's full name followed by a comma (the appositive shape)
  const living = (cs?.people ?? []).filter((p) => !p.isVictim).map((p) => p.name);
  const introParas = ch1.map((p, i) => (living.some((n) => p.startsWith(`${n},`)) ? i : -1)).filter((i) => i >= 0);
  const minGap = introParas.slice(1).reduce((g, i, k) => Math.min(g, i - introParas[k]), Infinity);
  const count = (re, text = raw) => (text.match(re) ?? []).length;
  const victim = cs?.victim ?? "";
  const lastSurname = (n) => n.split(/\s+/).filter((w) => !/^(jr|sr)\.?$/i.test(w)).at(-1) ?? n;
  const victimCleared = victim ? count(new RegExp(`${lastSurname(victim)}[^.]{0,80}\\bcleared\\b`, "gi")) : 0;
  // A sentence that is only a name and "cleared." — the clearance as a label (the self-read's "Marguerite Selwyn cleared.").
  const bareCleared = count(/(?:^|[.!?"”]\s+)(?:[A-Z][a-z]+\s){1,3}cleared\./gm);
  const culprit = (cs?.culprits ?? [])[0] ?? "";
  const lastCh = chapters.at(-1) ?? "";
  const culpritSpeaks = culprit ? parasOf(lastCh).filter((p) => /["“]/.test(p) && new RegExp(`\\b${lastSurname(culprit)}\\b`).test(p)).length : 0;
  const vic = (cs?.people ?? []).find((p) => p.isVictim);
  const discIdx = Math.max(0, (Number(m?.p5_discoveryChapter) || 1) - 1);
  const disc = chapters[discIdx] ?? "";
  const stems = String(vic?.occupation ?? "").toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 5));
  const victimWho = stems.some((st) => disc.toLowerCase().includes(st)) || /(?:aged|elderly|in (?:his|her) (?:forties|fifties|sixties|seventies|eighties)|(?:forty|fifty|sixty|seventy|eighty)[- ]w+ years? old)/i.test(disc);
  const shape = pg.measurePageShape(raw);
  let logInfo = {};
  if (arm.log && existsSync(arm.log)) {
    const L = readFileSync(arm.log, "utf8");
    logInfo = {
      ship: (L.match(/SHIP-CHECK: repetition[^\n"]*/) ?? [""])[0].replace(/ — WORTH A LOOK.*| — Normal.*/, (s) => (s.includes("WORTH") ? " WORTH A LOOK" : " Normal")).slice(0, 120),
      fallback: /forced to deterministic fallback/.test(L),
      restoredLF: (L.match(/restored (\d+) locked fact/) ?? [, "0"])[1],
      rederived: (L.match(/re-derived (\d+) discriminating/) ?? [, "0"])[1],
      words: (L.match(/manuscript : \d+ chapter\(s\), (\d+) words/) ?? [, "?"])[1],
    };
  }
  rows.push({
    arm: arm.label,
    "case": match?.id ?? "no match",
    "1 SHIP-CHECK": logInfo.ship ?? "(no log)",
    "1b fallback chapter": logInfo.fallback ?? "?",
    "2 ch1 first speech paragraph": firstSpeech,
    [`3 ch1 month/year (${cs?.month ?? "?"} ${cs?.year ?? "?"})`]: `${m?.p3_month ?? "?"} / ${m?.p3_year ?? "?"}`,
    "4 introduced with occupation": m?.p4_introduced ?? "?",
    "5 ch1 intro paragraphs · min gap": `${introParas.map((i) => i + 1).join(",") || "none"} · ${Number.isFinite(minGap) ? minGap : "-"}`,
    "6 victim job/age · authority sent": `${victimWho} · ${m?.p5_authoritySent ?? "?"}`,
    "7 victim cleared · bare 'X cleared.' · culprit speaks in last chapter": `${victimCleared} · ${bareCleared} · ${culpritSpeaks}`,
    "8 chapter-n narration · word-count leaks · 'the period'": `${count(/\b(?:in|from) chapter (?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/gi)} · ${count(/\b(?:four|five|six|seven|eight|ten|thirty|forty) words\b/gi)} · ${count(/\bthe period\b/gi)}`,
    "9 'pressed her hand against the'": count(/pressed her hand against the/gi),
    "10 body-part tail per 10k": shape.tailPer10k.toFixed(1),
    "11 locked facts restored · evidence ids re-derived": `${logInfo.restoredLF ?? "?"} · ${logInfo.rederived ?? "?"}`,
    "words": shape.words,
  });
}
const keys = Object.keys(rows[0] ?? {});
for (const k of keys) console.log(`${k.padEnd(70)} ${rows.map((r) => String(r[k]).padEnd(26)).join(" ")}`);
