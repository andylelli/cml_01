const fs = require("fs");
const f = "packages/rubric-score/src/llm-judge.ts";
let t = fs.readFileSync(f, "utf8");
const eol = t.includes("\r\n") ? "\r\n" : "\n";

const old = [
  "function stripFences(s: string): string {",
  "  const m = /```(?:json)?\s*([\s\S]*?)```/.exec(s);",
  "  return (m ? m[1] : s).trim();",
  "}",
].join(eol);
if (t.indexOf(old) < 0) throw new Error("stripFences anchor");

const neu = [
  "/**",
  " * Pull the JSON object out of a judge response, tolerating anything a model puts around it.",
  " *",
  " * WAS: return the fenced group, else the WHOLE string. A model that emits a bare object followed by",
  " * one sentence of commentary therefore fed `{...} Here is my assessment.` straight to `JSON.parse`,",
  " * which throws `Unexpected non-whitespace character after JSON at position N`.",
  " *",
  " * MEASURED: that cost a paid `claude-opus-5` call (~£0.18) during the 0b.0 n=8 experiment and silently",
  " * shrank that story's sample from 8 to 7. The failure is not provider-specific — nothing stops any",
  " * model appending a line — and `AnthropicClient` already exports `extractJsonPayload` for exactly",
  " * this, which this package cannot use without becoming provider-aware.",
  " *",
  " * Scanning for a BALANCED object rather than to the last `}` matters: judge output embeds reason",
  " * strings full of prose, and `s.lastIndexOf('}')` would happily span two concatenated objects.",
  " * String literals and their escapes are tracked so a brace inside a reason cannot close the scan.",
  " */",
  "function stripFences(s: string): string {",
  "  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(s);",
  "  const body = (fenced ? fenced[1]! : s).trim();",
  "  if (body.startsWith(\"{\") && body.endsWith(\"}\")) return body;",
  "",
  "  const start = body.indexOf(\"{\");",
  "  if (start < 0) return body;",
  "",
  "  let depth = 0;",
  "  let inString = false;",
  "  let escaped = false;",
  "  for (let i = start; i < body.length; i += 1) {",
  "    const ch = body[i]!;",
  "    if (escaped) { escaped = false; continue; }",
  "    if (ch === \"\\\\\") { escaped = true; continue; }",
  "    if (ch === '\"') { inString = !inString; continue; }",
  "    if (inString) continue;",
  "    if (ch === \"{\") depth += 1;",
  "    else if (ch === \"}\") {",
  "      depth -= 1;",
  "      if (depth === 0) return body.slice(start, i + 1);",
  "    }",
  "  }",
  "  // Unbalanced — hand back what we have and let JSON.parse report it. Never invent a closing brace.",
  "  return body.slice(start);",
  "}",
].join(eol);

t = t.replace(old, neu);
fs.writeFileSync(f, t);
console.log("stripFences hardened");
