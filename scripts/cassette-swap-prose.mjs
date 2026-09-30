#!/usr/bin/env node
/**
 * Owner decision 1 (retire v1): move a full-pipeline replay fixture's prose stage onto v2.
 *
 * A fixture's cassette holds every recorded call of one run. Its Agent 9 calls were recorded under v1, and a
 * rebase never invents a reply, so once v1 is gone those fixtures would replay Agent 9 as synthetic failures.
 * This keeps the fixture's upstream entries (every agent before Agent 9), drops its v1 prose-stage entries
 * (`Agent9-*` and the post-prose `RubricScorer`), and appends a v2 recording of the same project's prose stage
 * (`Agent9v2-*` and its `RubricScorer`), renumbered after them. Then rebase the fixture under
 * `--set PROSE_ENGINE=v2`: that re-records every prompt against the current code and proves a strict MATCH.
 *
 *   node scripts/cassette-swap-prose.mjs --fixture full-d0ee7b26 --prose <v2 cassette from cassette-from-logs>
 *   node scripts/replay-fixture.mjs --name full-d0ee7b26 --rebase --set PROSE_ENGINE=v2
 */
import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync, gzipSync } from "node:zlib";
import { join } from "node:path";

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const fixture = arg("--fixture");
const prose = arg("--prose");
if (!fixture || !prose) { console.error("usage: --fixture <name> --prose <v2 cassette.jsonl.gz>"); process.exit(2); }

const read = (f) => gunzipSync(readFileSync(f)).toString("utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const file = join("eval", "replay", `${fixture}.cassette.jsonl.gz`);
const [head, ...entries] = read(file);
const [proseHead, ...proseEntries] = read(prose);
if (head.source?.projectId !== proseHead.source?.projectId) {
  console.error(`project mismatch: fixture ${head.source?.projectId}, prose ${proseHead.source?.projectId}`);
  process.exit(1);
}
const isProseStage = (e) => /^Agent9/.test(String(e.agent)) || e.agent === "RubricScorer";
const kept = entries.filter((e) => !isProseStage(e));
const dropped = entries.length - kept.length;
const v2 = proseEntries.filter(isProseStage);
if (v2.some((e) => /^Agent9-/.test(String(e.agent)))) { console.error("the prose recording contains v1 Agent 9 calls"); process.exit(1); }
const merged = [...kept, ...v2].map((e, seq) => ({ ...e, seq }));
const newHead = { source: { ...head.source, proseFrom: proseHead.source?.runId, proseSwappedAt: new Date().toISOString() } };
writeFileSync(file, gzipSync([newHead, ...merged].map((l) => JSON.stringify(l)).join("\n") + "\n", { level: 9 }));
console.log(`${fixture}: kept ${kept.length} upstream, dropped ${dropped} v1 prose-stage, added ${v2.length} v2 from ${proseHead.source?.runId}`);
