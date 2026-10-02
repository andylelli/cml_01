#!/usr/bin/env node
// Retire a default-OFF boolean: every `if (<expr>)` / `if (X && <expr>)` whose guard is the retired value is
// replaced by what runs when it is false (its else branch, unwrapped; or nothing). AST-located, text-rewritten.
//   node scripts/retire-flag-branches.mjs --expr run.llmRetriesEnabled [--dry] files…
import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const expr = args[args.indexOf("--expr") + 1];
const dry = args.includes("--dry");
const files = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--expr");
if (!expr || files.length === 0) throw new Error("usage: --expr <guard> [--dry] files…");

const isGuard = (n) => n.getText() === expr;
const guardIsFalse = (cond) => isGuard(cond) ||
  (ts.isBinaryExpression(cond) && cond.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
    (isGuard(cond.right) || isGuard(cond.left) || guardIsFalse(cond.left) || guardIsFalse(cond.right)));

const dedentBlock = (block, src) => {
  const inner = src.slice(block.getStart() + 1, block.getEnd() - 1).replace(/^\n/, "").replace(/\n[ \t]*$/, "");
  return inner.split("\n").map((l) => l.replace(/^  /, "")).join("\n").replace(/^[ \t]+/, "");
};

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let src = raw.replace(/\r\n/g, "\n");
  let count = 0;
  for (;;) {
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    let target;
    const visit = (n) => { if (!target && ts.isIfStatement(n) && guardIsFalse(n.expression)) target = n; else ts.forEachChild(n, visit); };
    visit(sf);
    if (!target) break;
    const els = target.elseStatement;
    const replacement = !els ? "" : ts.isBlock(els) ? dedentBlock(els, src) : els.getText();
    let start = target.getStart();
    let end = target.getEnd();
    if (!replacement) { // drop the whole line(s)
      start = src.lastIndexOf("\n", start - 1) + 1;
      if (src[end] === "\n") end += 1;
    }
    src = src.slice(0, start) + replacement + src.slice(end);
    count += 1;
  }
  console.log(`${file}: ${count} branch(es) retired`);
  if (!dry && count) writeFileSync(file, crlf ? src.replace(/\n/g, "\r\n") : src);
}
