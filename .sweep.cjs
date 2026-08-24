const fs = require("fs");
const f = "scripts/axis-sweep.mjs";
let t = fs.readFileSync(f, "utf8");

// capture the inputs line and the run id
const oldScan = `        else if (/^PROGRESS /.test(line)) process.stdout.write(\`      \${line}\n\`);`;
if (t.indexOf(oldScan) < 0) throw new Error("scan anchor");
t = t.replace(
  oldScan,
  [
    `        else if (line.startsWith("CANARY_INPUTS ")) found.inputs = line.slice(14).trim();`,
    `        else if (line.startsWith("CANARY_PROJECT_ID ")) found.projectId = line.slice(18).trim();`,
    `        else if (/^PROGRESS /.test(line)) process.stdout.write(\`      \${line}\n\`);`,
  ].join("\n"),
);

t = t.replace(
  "    const found = { runId: null, status: null, warnings: 0, clueStatus: null, story: null };",
  "    const found = { runId: null, status: null, warnings: 0, clueStatus: null, story: null, inputs: null, projectId: null };",
);

// after each run, read back the axis the CASE actually came out as
const marker = `    child.on("close", (code) => {
      resolve({ axis, code, minutes: (Date.now() - started) / 60000, ...found, tail });
    });`;
if (t.indexOf(marker) < 0) throw new Error("close anchor");
t = t.replace(
  marker,
  [
    `    child.on("close", (code) => {`,
    `      resolve({ axis, code, minutes: (Date.now() - started) / 60000, ...found, tail, produced: producedAxis(found.runId) });`,
    `    });`,
  ].join("\n"),
);

// the reader itself
const helperAnchor = "const runOne = (axis, yamlPath) =>";
if (t.indexOf(helperAnchor) < 0) throw new Error("runOne anchor");
t = t.replace(
  helperAnchor,
  [
    "/**",
    " * What axis did the CASE actually come out as? Read from Agent 3's own response, not from the input.",
    " *",
    " * THE POINT OF THE WHOLE SWEEP, and it was unobservable until now. The 2026-08-21 run asked for",
    " * `identity` and Agent 3 received `authority` (X88), and nothing in this script's output said so —",
    " * only a hand-grep of logs/llm.jsonl caught it. A sweep that cannot tell you which axis it actually",
    " * generated reports five successes whatever happens, which is the failure X70 already made once.",
    " */",
    "const producedAxis = (runId) => {",
    "  if (!runId) return null;",
    "  try {",
    "    const dirs = readdirSync(PROMPTS)",
    "      .filter((d) => /^run_\d{8}-\d{4}/.test(d))",
    "      .sort();",
    "    for (const dir of dirs.reverse()) {",
    "      const files = readdirSync(join(PROMPTS, dir)).filter((n) => /Agent3-CMLGenerator_response/.test(n));",
    "      if (files.length === 0) continue;",
    "      const text = readFileSync(join(PROMPTS, dir, files[files.length - 1]), \"utf8\");",
    "      const m = /\"false_assumption\"\s*:\s*\{[^}]*?\"type\"\s*:\s*\"([a-z_]+)\"/.exec(text);",
    "      if (m) return m[1];",
    "    }",
    "  } catch {",
    "    /* reported as null; never abort a completed run over telemetry */",
    "  }",
    "  return null;",
    "};",
    "",
    helperAnchor,
  ].join("\n"),
);

// imports + PROMPTS path
t = t.replace(
  'import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";',
  'import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";',
);
t = t.replace(
  'const OUT_DIR = join(ROOT, "scratchpad", "axis-sweep");',
  'const OUT_DIR = join(ROOT, "scratchpad", "axis-sweep");\nconst PROMPTS = join(ROOT, "documentation", "prompts", "actual");',
);

// report it, per run and in the summary
t = t.replace(
  '      `\n  ${c.axis.padEnd(11)} ${ok ? "OK " : "FAIL"}  status ${String(r.status)}  ` +\n        `clues ${String(r.clueStatus)}  warnings ${r.warnings}  ${r.minutes.toFixed(1)} min  ${r.runId ?? ""}`,',
  '      `\n  ${c.axis.padEnd(11)} ${ok ? "OK " : "FAIL"}  status ${String(r.status)}  ` +\n        `produced ${String(r.produced)}${r.produced && r.produced !== c.axis ? "  <<< NOT THE AXIS REQUESTED" : ""}  ` +\n        `clues ${String(r.clueStatus)}  warnings ${r.warnings}  ${r.minutes.toFixed(1)} min  ${r.runId ?? ""}`,',
);
t = t.replace(
  'console.log(`  axis         status      clues   warns   minutes   runId`);',
  'console.log(`  requested    produced     status      clues   warns   minutes   runId`);',
);
t = t.replace(
  '    `  ${r.axis.padEnd(12)} ${String(r.status ?? "-").padEnd(11)} ${String(r.clueStatus ?? "-").padEnd(7)} ` +\n      `${String(r.warnings).padEnd(7)} ${r.minutes.toFixed(1).padStart(7)}   ${r.runId ?? "-"}`,',
  '    `  ${r.axis.padEnd(12)} ${String(r.produced ?? "-").padEnd(12)} ${String(r.status ?? "-").padEnd(11)} ${String(r.clueStatus ?? "-").padEnd(7)} ` +\n      `${String(r.warnings).padEnd(7)} ${r.minutes.toFixed(1).padStart(7)}   ${r.runId ?? "-"}`,',
);

fs.writeFileSync(f, t);
console.log("sweep now records the axis actually produced");
