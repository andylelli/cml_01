#!/usr/bin/env node
/**
 * PLAN-TO-90 **0b.0** — can a stronger judge tell an 86 from an 81?
 *
 * THE QUESTION THIS SETTLES. §2 of PLAN-TO-90 is the spine of the whole plan: *"there is currently no
 * instrument in this project that can tell an 86 from an 81."* Three internal numbers were checked and
 * all three failed — the headline gave 96.71 vs 97.29 (it ranks the 81 HIGHER), the prose phase gave
 * 99 vs 100 (no discrimination), and the shadow rubric gave 70 vs 76 (also backwards). Every decision
 * about what moves the score therefore routes through a paid external read, which is why the board has
 * been stuck on "needs a run" for three review documents.
 *
 * The judge is one small call over a finished manuscript — ~15K in, ~1K out — against the writer's ten
 * calls carrying the full bible. That is why upgrading the JUDGE costs pennies and upgrading the WRITER
 * costs +180%. Nobody had tried it because the judge was never the thing under discussion.
 *
 * WHY THIS IS A NEW SCRIPT AND NOT A FLAG ON eval-rescore.mjs. Two reasons, both structural:
 *
 *   1. `eval-rescore.mjs` scores the entries in `eval/results/external-read/manifest.json`, and the two
 *      manuscripts this experiment is about are NOT in it — the manifest's top pair is a 2026-08-06
 *      86/73. The 86 and 81 that §2 argues from are the 08-17 and 08-19 runs. Adding them to the
 *      manifest would mutate the calibration ledger as a side effect of an experiment, and that ledger
 *      feeds `eval:calibrate`.
 *   2. `eval-rescore.mjs` hard-wires `AzureOpenAIClient`, so `RUBRIC_JUDGE_MODEL` can only ever name an
 *      Azure deployment. Same in the orchestrator: the judge is built from `args.client.chat`, the
 *      run's Azure client. Setting `RUBRIC_JUDGE_MODEL=claude-opus-5` today sends "claude-opus-5" to
 *      Azure as a deployment name and fails. `createLLMRubricJudge` itself wraps ANY chat function —
 *      the package was always provider-agnostic; only the two call sites were not.
 *
 * WHAT SEPARATION ACTUALLY REQUIRES, and why one score per story would not have answered it. M1c
 * measured a single rubric score at ±3 with a spread of 6 on ONE story. The external gap here is 5
 * marks. A judge that returns 86 → 74 and 81 → 71 has not separated them if either story's own repeats
 * range over 6. So this reports the within-story spread beside the between-story gap and calls it
 * separated only when the gap clears the noise. That is the same standard M1c set and the reason 0.3
 * exists; running them together costs one extra repeat and answers both.
 *
 *   node scripts/judge-ab.mjs --dry                          free; proves the wiring and the subjects
 *   node scripts/judge-ab.mjs                                default: mini vs opus, 3 repeats
 *   node scripts/judge-ab.mjs --judge claude-opus-5 --repeats 5
 *   node scripts/judge-ab.mjs --judge gpt-4.1-mini --judge claude-opus-5
 *
 * Cost is printed per judge before any spending, and `--dry` stops before the first call.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { deriveStoryGeometry, checkManuscriptGeometry } from "../packages/story-geometry/dist/index.js";
import {
  checkCaseTimelineDeception,
  parseClockTime,
  parseDurationMinutes,
} from "../packages/prompts-llm/dist/timeline-deception.js";
import { INJECTED_SENTENCE_PATTERNS } from "../packages/prompts-llm/dist/agent9-prose/injection-templates.js";
import { createLLMRubricJudge, scoreStory } from "../packages/rubric-score/dist/index.js";
import { lastResponseFor, lockedFactsFrom, readManuscript, shippedOutline } from "./corpus-artifacts.mjs";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const PROMPTS = join(ROOT, "documentation", "prompts", "actual");
const DRY = process.argv.includes("--dry");

const flagValue = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : dflt;
};
const flagValues = (name) => {
  const out = [];
  for (let i = 0; i < process.argv.length; i += 1) {
    if (process.argv[i] === name && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) out.push(process.argv[i + 1]);
  }
  return out;
};

// `.env.local` first, then `.env`, first-wins — the precedence every production loader has had since X7.
for (const name of [".env.local", ".env"]) {
  const p = join(ROOT, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").replace(/\s+#.*$/, "").trim();
  }
}

/**
 * The two manuscripts §2 argues from, matched to their run folders by CONTENT, not by timestamp
 * proximity. `run_20260819-2019_0a61b082` sits between them and contains neither title; the mapping
 * below was confirmed by grepping the device name through each candidate folder.
 */
const SUBJECTS = [
  {
    label: "08-17",
    external: 86,
    story: "stories/story_20260817-2209/the_reversed_pendulum_at_seacliff_hotel.md",
    runFolder: "run_20260817-2052_mystery",
  },
  {
    label: "08-19",
    external: 81,
    story: "stories/story_20260819-2047/the_delayed_strike_at_cliffhaven_hotel.md",
    runFolder: "run_20260819-1928_mystery",
  },
];

/** Same assembly as eval-rescore.mjs, so the numbers are comparable to the ledger's. */
function assemble(subject) {
  const storyAbs = join(ROOT, subject.story);
  if (!existsSync(storyAbs)) return { reason: `manuscript not on disk: ${subject.story}` };
  const runDir = join(PROMPTS, subject.runFolder);
  if (!existsSync(runDir)) return { reason: `run folder not on disk: ${subject.runFolder}` };

  // Agent 4 revises the CML, so its output supersedes Agent 3's when present.
  const cml = lastResponseFor(runDir, /Agent4-Revision/).parsed ?? lastResponseFor(runDir, /Agent3-CMLGenerator/).parsed;
  if (!cml) return { reason: "no CML in the run folder" };
  const manuscript = readManuscript(storyAbs);
  if (manuscript.chapters.length === 0) return { reason: "manuscript has no chapters" };

  // The outline is matched against the shipped text — "the last attempt wins" is measurably wrong.
  const outline = shippedOutline(runDir, manuscript).parsed;
  const caseData = cml.CASE ?? cml;

  let noResolutionVerdict = null;
  if (outline) {
    const geometry = deriveStoryGeometry({
      cml,
      clues: lastResponseFor(runDir, /Agent5-ClueExtraction/).parsed?.clues ?? [],
      narrative: outline,
      timelineViolations: checkCaseTimelineDeception(caseData).map((v) => ({ code: v.code, message: v.message })),
      lockedFacts: lockedFactsFrom(lastResponseFor(runDir, /Agent3b-HardLogicDeviceGenerator/).parsed),
    });
    const acceptance = checkManuscriptGeometry(geometry, manuscript.chapters, {
      parseClockTime,
      parseDurationMinutes,
      injectionTemplates: INJECTED_SENTENCE_PATTERNS,
    });
    const d = acceptance.manuscriptDisclosure;
    // X11 — null, never false, when the case names no culprit: a fact nobody could compute must not
    // be reported as a fact.
    noResolutionVerdict = d ? d.verdict === "unmet" : null;
  }

  const prose = manuscript.chapters.map((c) => c.paragraphs.join("\n\n")).join("\n\n");
  return { prose, cml, chapters: manuscript.chapters.length, words: prose.split(/\s+/).length, noResolutionVerdict, outlineFound: Boolean(outline) };
}

/**
 * Build a judge for a model id, picking the provider from the id itself.
 *
 * Same discrimination `cost-tracker.ts` already makes: *"Anthropic models first — their ids share no
 * substring with the GPT branches below"*. Keying on the id keeps this a one-line change at every
 * future call site rather than a second env var to keep in sync — the two-places-one-vocabulary defect
 * this repo has produced seven times.
 */
async function buildJudge(model) {
  // Wire the run logger and cost tracker in. Without them these calls land in no telemetry at all —
  // which is how an experiment ends up with no record of what it spent, the defect 0a.3 exists over.
  const { AzureOpenAIClient, AnthropicClient, LLMLogger, CostTracker } = await import("../packages/llm-client/dist/index.js");
  const logger = new LLMLogger();
  const costTracker = COST;
  const isClaude = /^claude/i.test(model);

  let client;
  if (isClaude) {
    const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
    if (!apiKey) throw new Error(`judge "${model}" needs ANTHROPIC_API_KEY`);
    client = new AnthropicClient({
      apiKey,
      defaultModel: model,
      ...(process.env.ANTHROPIC_BASE_URL ? { baseURL: process.env.ANTHROPIC_BASE_URL.trim() } : {}),
      requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 50),
      logger,
      costTracker,
    });
  } else {
    const endpoint = (process.env.AZURE_OPENAI_ENDPOINT ?? "").trim();
    const apiKey = (process.env.AZURE_OPENAI_API_KEY ?? "").trim();
    if (!endpoint || !apiKey) throw new Error(`judge "${model}" needs AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY`);
    client = new AzureOpenAIClient({
      endpoint,
      apiKey,
      defaultModel: model,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-12-01-preview",
      requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
      logger,
      costTracker,
    });
  }

  const judge = createLLMRubricJudge(
    async (args) => {
      const res = await client.chat({ ...args, model });
      return { content: res.content ?? res.text ?? "" };
    },
    { model, temperature: 0.2, maxTokens: 4000 },
  );
  return { judge, provider: isClaude ? "anthropic" : "azure" };
}

const { CostTracker: CT } = await import("../packages/llm-client/dist/index.js");
const COST = new CT();

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const spread = (xs) => Math.max(...xs) - Math.min(...xs);

// ── assemble, and say what was found before anything is spent ────────────────

const judges = flagValues("--judge");
const MODELS = judges.length > 0 ? judges : [process.env.RUBRIC_JUDGE_MODEL || "gpt-4.1-mini", "claude-opus-5"];
const REPEATS = Number(flagValue("--repeats", "3"));

console.log(`\n${"═".repeat(78)}\n0b.0 — CAN A STRONGER JUDGE TELL AN 86 FROM AN 81?\n${"═".repeat(78)}\n`);

const ONLY = flagValue("--only", null);
/**
 * `--only 08-17` scores ONE story.
 *
 * Not a convenience. The decisive question about a candidate judge is its VARIANCE, not its mean: a
 * judge whose repeats on a single story range wider than the 5-mark external gap cannot resolve that
 * gap no matter what the second story returns. Testing one story to n=8 costs half of testing two and
 * answers the falsifying half.
 */
const subjects = SUBJECTS.filter((s) => !ONLY || s.label === ONLY).map((s) => ({ ...s, ...assemble(s) }));
for (const s of subjects) {
  if (s.reason) {
    console.error(`  ${s.label}  ext ${s.external}   UNUSABLE — ${s.reason}`);
    continue;
  }
  console.log(
    `  ${s.label}  ext ${s.external}   ${s.chapters} chapters, ${s.words.toLocaleString()} words   ` +
      `noResolution: ${s.noResolutionVerdict === null ? "null (unanswerable)" : s.noResolutionVerdict}` +
      `${s.outlineFound ? "" : "   [no outline — geometry skipped]"}`,
  );
}
if (subjects.some((s) => s.reason)) {
  console.error("\n  Cannot run: a subject is missing. Nothing spent.\n");
  process.exit(1);
}

const calls = subjects.length * REPEATS;
console.log(`\n  judges  : ${MODELS.join(", ")}`);
console.log(`  repeats : ${REPEATS} per story per judge  →  ${calls} calls per judge, ${calls * MODELS.length} total`);
console.log(`  the gap to beat: external ${subjects[0].external} − ${subjects[1].external} = ${subjects[0].external - subjects[1].external} marks\n`);

if (DRY) {
  console.log(`  --dry: no judge calls made, nothing spent. Re-run without --dry to score.\n`);
  process.exit(0);
}

// ── score ────────────────────────────────────────────────────────────────────

const results = [];
for (const model of MODELS) {
  let built;
  try {
    built = await buildJudge(model);
  } catch (e) {
    console.error(`\n  ${model}: ${e.message} — skipped.\n`);
    continue;
  }
  console.log(`${"─".repeat(78)}\n  judge: ${model}  (${built.provider})\n`);

  const perStory = [];
  for (const s of subjects) {
    const totals = [];
    for (let i = 0; i < REPEATS; i += 1) {
      try {
        const r = await scoreStory({ prose: s.prose, cml: s.cml, judge: built.judge, noResolutionVerdict: s.noResolutionVerdict });
        totals.push(r.final);
        console.log(
          `    ${s.label} (ext ${s.external})  run ${i + 1}   final ${r.final}   raw ${r.rawTotal}   ` +
            `caps: ${r.capsApplied?.join("; ") || "none"}`,
        );
      } catch (e) {
        // A refused or failed scorer must be LOUD (X37) — a missing number must never look like a low one.
        console.error(`    ${s.label} run ${i + 1}   FAILED — ${e.message}`);
      }
    }
    if (totals.length > 0) perStory.push({ label: s.label, external: s.external, totals });
  }

  if (perStory.length === 2) {
    const [hi, lo] = perStory;
    const gap = mean(hi.totals) - mean(lo.totals);
    const noise = Math.max(spread(hi.totals), spread(lo.totals));
    const ranksRight = gap > 0;
    const clearsNoise = Math.abs(gap) > noise;
    console.log(
      `\n    ${hi.label}: mean ${mean(hi.totals).toFixed(1)}  spread ${spread(hi.totals)}   ` +
        `${lo.label}: mean ${mean(lo.totals).toFixed(1)}  spread ${spread(lo.totals)}`,
    );
    console.log(`    gap ${gap.toFixed(1)}   worst within-story spread ${noise}`);
    console.log(
      `    ORDER ${ranksRight ? "CORRECT" : "WRONG (ranks the 81 above the 86)"}   ` +
        `${clearsNoise ? "and the gap CLEARS its own noise" : "but the gap is INSIDE its own noise"}`,
    );
    console.log(
      `    → ${ranksRight && clearsNoise ? "SEPARATES" : "DOES NOT SEPARATE"}\n`,
    );
    results.push({ model, gap, noise, ranksRight, clearsNoise, perStory });
  }
}

console.log(`${"═".repeat(78)}\n  SUMMARY\n${"═".repeat(78)}\n`);
for (const r of results) {
  console.log(
    `  ${r.model.padEnd(20)} gap ${r.gap.toFixed(1).padStart(6)}   noise ${String(r.noise).padStart(3)}   ` +
      `${r.ranksRight && r.clearsNoise ? "SEPARATES" : "does not separate"}`,
  );
}
const spent = COST.getSummary();
console.log(`  spent this invocation: GBP ${spent.totalCost.toFixed(4)}` +
  (spent.cacheHitRate === null ? "  (no cache telemetry)" : `  cache ${(spent.cacheHitRate * 100).toFixed(0)}%`));
console.log("");
