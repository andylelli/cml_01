#!/usr/bin/env node
/**
 * THE FREE FLAG REHEARSAL — does each flag actually change what the model is asked to do?
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * Ten flags are built, tested, registered and have never executed. REVIEW_05 §6: *a detector that has
 * never been run against real prose is a hypothesis.* The obvious cure is a £1.10 run — but a run only
 * answers the question if the flags reached the prompt at all, and this project has twice shipped a
 * lever that was silently unsettable (ADR-0004; N6's own lever was unsettable from `.env.local`).
 *
 * ── WHY IT DRIVES BUILDERS, NOT THE PIPELINE ─────────────────────────────────────────────────────
 *
 * The first version of this script captured Agent 9's prompts through the replay bench with a stub
 * client. It reported four flags SILENT — and every one of those verdicts was WRONG. These flags are
 * CONDITIONAL: the aftermath requirements only build for a chapter whose stage mode is
 * `aftermath_consequence`, the length directive only at `overshootRatio >= 1.25` (which needs a
 * chapter already generated and measured), the clue grammar only when the injector runs after a
 * validation failure. A first-pass prompt reaches none of those states, so "absent" meant "not
 * applicable", not "broken". Worse, setting REPLAY_PROSE_BATCH=10 to reach the finale SUPPRESSED the
 * per-chapter aftermath path entirely — the real prompt log shows the aftermath contract on Ch10 of
 * 80 archived runs, always as its own call.
 *
 * So each flag is driven at ITS OWN GATE, with inputs that put it in the state where it is supposed
 * to fire. That is the only arrangement in which "absent" is evidence.
 *
 *   node scripts/rehearse-flag-firing.mjs <projectId>
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const projectId = process.argv[2] || "canary_1787953182108";

const need = (p) => {
  const f = join(ROOT, p);
  if (!existsSync(f)) { console.error(`\n  build first — ${p} missing\n`); process.exit(1); }
  return pathToFileURL(f).href;
};

const store = await import(need("apps/worker/dist/jobs/artifact-store.js"));
const obligation = await import(need("packages/prompts-llm/dist/agent9-prose/obligation-block.js"));
const injection = await import(need("packages/prompts-llm/dist/agent9-prose/injection-templates.js"));
const context = await import(need("packages/prompts-llm/dist/agent9-prose/context-management.js"));
const voice = await import(need("packages/prompts-llm/dist/agent9-prose/voice-spec-engine.js"));

const rows = store.loadArtifactStore(ROOT);
const cml = store.latestArtifact(rows, projectId, "cml");
const outline = store.latestArtifact(rows, projectId, "outline");
if (!cml || !outline) { console.error(`\n  no cml/outline for ${projectId}\n`); process.exit(2); }
const scenes = (outline.acts ?? []).flatMap((a) => a.scenes ?? []);
const cse = cml.CASE ?? cml;

/** Run `fn` with the flag forced off, then on, and return both outputs. */
const withFlag = (env, fn) => {
  const prev = process.env[env];
  delete process.env[env];
  const off = fn();
  process.env[env] = "true";
  const on = fn();
  if (prev === undefined) delete process.env[env]; else process.env[env] = prev;
  return { off, on };
};

const results = [];
const record = (env, what, off, on, marker) => {
  const o = String(off ?? ""), n = String(on ?? "");
  const fires = marker ? (!o.includes(marker) && n.includes(marker)) : o !== n;
  results.push({ env, what, fires, delta: n.length - o.length });
};

// ── 1. AGENT9_AFTERMATH_GROUNDING — at its gate: resolution + aftermath_consequence ─────────────
{
  const last = [scenes[scenes.length - 1]];
  const { off, on } = withFlag("AGENT9_AFTERMATH_GROUNDING", () =>
    obligation.buildChapterObligationBlock(
      last, scenes.length, cse, undefined, undefined, undefined, undefined, undefined,
      undefined, "resolution", undefined, undefined, scenes, "aftermath_consequence",
    ));
  record("AGENT9_AFTERMATH_GROUNDING", "finale grounding requirements 5 & 6", off, on, "PUT THE CONSEQUENCE IN THE ROOM");
}

// ── 2. AGENT9_CLUE_LIST_GRAMMAR — the injector's own builder ─────────────────────────────────────
{
  // Compare ONLY the paragraph. An earlier version folded the `enabled` boolean into the compared
  // string, so "false|…" and "true|…" always differed and the check reported FIRES unconditionally —
  // a test that cannot fail, which is worse than no test.
  // The flag gates buildClueInferenceSentence, NOT buildClueObservationParagraph. Aiming at the
  // observation builder reported the flag SILENT when it was the probe that was pointed wrong.
  const { off, on } = withFlag("AGENT9_CLUE_LIST_GRAMMAR", () =>
    injection.buildClueInferenceSentence({ description: "a bent cuff-link", pointsTo: "the steward" }));
  record("AGENT9_CLUE_LIST_GRAMMAR", "clue-list grammar in the injected paragraph", off, on, null);
  console.log(`    (clue paragraph off) ${String(off).slice(0, 96)}`);
  console.log(`    (clue paragraph on ) ${String(on).slice(0, 96)}`);
}

// ── 3. AGENT9_RECAP_STRIP_INJECTED — the recap cleaner ───────────────────────────────────────────
{
  const injected = "The record now held: a bent cuff-link; a torn ticket. She pressed on to the next concrete detail.";
  const { off, on } = withFlag("AGENT9_RECAP_STRIP_INJECTED", () =>
    (context.isRecapStripInjectedEnabled(process.env) ? context.stripInjectedFromRecap(injected) : injected));
  record("AGENT9_RECAP_STRIP_INJECTED", "strips our own injected text from the recap", off, on, null);
}

// ── 4. AGENT9_VOICE_SPEC — the block the writer sees ─────────────────────────────────────────────
{
  const spec = {
    sentenceLength: { mean: 20.4, sd: 8 },
    syntacticHabit: "long periodic sentences that withhold the verb",
    diction: "latinate-formal",
    narrationDistance: "wry-companion",
    signatureMove: "the detective notices what is absent before what is present",
    avoid: ["the word faint"],
  };
  const { off, on } = withFlag("AGENT9_VOICE_SPEC", () =>
    (voice.isVoiceSpecEnabled(process.env) ? voice.buildVoiceSpecBlock(spec) : ""));
  record("AGENT9_VOICE_SPEC", "the committed voice spec reaches the writer", off, on, "words per sentence");
}

// ── 5. AGENT2B_OBSERVABLE_DETAIL — upstream, but rehearsable: the prompt builder is exported ─────
{
  // The stored artifact wraps the design: `{ cast: { characters }, attempt, latencyMs, cost }`.
  // Reading `.characters` off the envelope throws — the same shape trap as the camelCase/snake_case
  // one this repo has paid for before.
  const castArtifact = store.latestArtifact(rows, projectId, "cast");
  const cast = castArtifact?.cast?.characters ? castArtifact.cast : castArtifact;
  if (cast?.characters) {
    const profiles = await import(need("packages/prompts-llm/dist/agent2b-character-profiles.js"));
    const { off, on } = withFlag("AGENT2B_OBSERVABLE_DETAIL", () => {
      const p = profiles.buildProfilesPrompt({ caseData: cse, cast, tone: "wry", targetWordCount: 40000 });
      // The builder returns { system, developer, user, messages }. Concatenating only system+user
      // missed the block entirely and reported the flag SILENT — read EVERY field, or the probe
      // decides the verdict by which key it happened to name.
      return typeof p === "string" ? p : ["system", "developer", "user"].map((k) => p?.[k] ?? "").join("");
    });
    record("AGENT2B_OBSERVABLE_DETAIL", "asks Agent 2b for behaviour, not summary", off, on, null);
  }
}

console.log(`\n  FLAG REHEARSAL — project ${projectId} · no network, no cost\n`);
console.log(`    ${"flag".padEnd(32)} ${"verdict".padEnd(10)} ${"delta".padStart(7)}   what it adds`);
console.log(`    ${"-".repeat(98)}`);
for (const r of results) {
  console.log(`    ${r.env.padEnd(32)} ${(r.fires ? "FIRES" : "SILENT").padEnd(10)} ${String(r.delta > 0 ? `+${r.delta}` : r.delta).padStart(7)}   ${r.what}`);
}

const silent = results.filter((r) => !r.fires);
console.log(`\n  ${results.length - silent.length}/${results.length} verified to change the model's instructions.`);
if (silent.length) {
  console.log(`  SILENT is the ADR-0004 failure — fix before spending a run:`);
  for (const r of silent) console.log(`    · ${r.env}`);
}

console.log(`
  NOT COVERED HERE, and why:
    AGENT9_LENGTH_COUNTERPRESSURE   needs a generated chapter measured at >=1.25x preferred; it is a
                                    feedback directive on a REGENERATION prompt, so only a real run
                                    that overshoots exercises it.
    AGENT9_REGEN_CONVERGENCE_STOP   loop control — visible as a retry count, not as text.
    AGENT9_CROSS_CHAPTER_ECHO       post-processing — verified on the manuscript.
    AGENT9_CLEARANCE_TRIM           post-processing — verified on the manuscript.
    AGENT2B_OBSERVABLE_DETAIL       upstream (Agent 2b), outside Agent 9's prompt path.
    AGENT3B_ARITHMETIC_REGEN        upstream (Agent 3b), correctness not prose.

  A run READ FOR THESE must not treat "did not fire" as failure: four of them are conditional on
  states a clean run may never reach.
`);
