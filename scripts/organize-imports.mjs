#!/usr/bin/env node
/**
 * Remove unused imports from the named files with the TypeScript language service's organizeImports
 * (the editor's "Organize Imports"): the compiler decides what is unused, not a regex.
 *
 *   node scripts/organize-imports.mjs --project packages/prompts-llm/tsconfig.json <file.ts> [...]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ts from "typescript";

const args = process.argv.slice(2);
const pi = args.indexOf("--project");
const project = resolve(args[pi + 1]);
const files = args.filter((_, i) => i !== pi && i !== pi + 1).map((f) => resolve(f));
const cfg = ts.parseJsonConfigFileContent(ts.readConfigFile(project, ts.sys.readFile).config, ts.sys, dirname(project));
const versions = new Map();
const host = {
  getScriptFileNames: () => cfg.fileNames,
  getScriptVersion: (f) => String(versions.get(f) ?? 0),
  getScriptSnapshot: (f) => { const t = ts.sys.readFile(f); return t === undefined ? undefined : ts.ScriptSnapshot.fromString(t); },
  getCurrentDirectory: () => dirname(project),
  getCompilationSettings: () => cfg.options,
  getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
  fileExists: ts.sys.fileExists, readFile: ts.sys.readFile, readDirectory: ts.sys.readDirectory,
};
const ls = ts.createLanguageService(host, ts.createDocumentRegistry());
for (const file of files) {
  const edits = ls.organizeImports({ type: "file", fileName: file, skipDestructiveCodeActions: false }, {}, undefined);
  let text = readFileSync(file, "utf8");
  const changes = edits.flatMap((e) => e.textChanges).sort((a, b) => b.span.start - a.span.start);
  for (const c of changes) text = text.slice(0, c.span.start) + c.newText + text.slice(c.span.start + c.span.length);
  writeFileSync(file, text);
  versions.set(file, (versions.get(file) ?? 0) + 1);
  console.log(`${file}: ${changes.length} import edit(s)`);
}
