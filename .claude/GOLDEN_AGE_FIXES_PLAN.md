# Golden Age Crime Generator — Fix Plan & Implementation Roadmap

**Status:** Draft v2 for review (now grounded in a full pipeline trace)
**Author:** Code review (2026-06-17)
**Scope:** Make the pipeline produce a readable, fair-play Golden Age mystery in the correct style.
**Reference spec:** [documentation/Golden Age Crime.txt](../documentation/Golden%20Age%20Crime.txt)

> v2 update: This revision follows a full end-to-end trace of the generation pipeline (orchestration,
> design agents, clue/fair-play subsystem, narrative outline, prose engine). It corrects several v1
> assumptions, gives precise insertion points, and adds the larger architectural recommendations the
> goal requires.

---

## 0. Implementation Status (2026-06-17) — ALL ITEMS IMPLEMENTED

All fixes and sweeps below are implemented and validated: every package typechecks, the full
workspace builds, and all test suites pass (prompts-llm 302, story-validation 218 + new genre tests,
worker 162). The one remaining step — a **live regeneration to verify acceptance criteria §8** — is
gated on the model decision (see §1 below) because it requires an Azure deployment + spend.

| Item | Status | Key changes |
|------|--------|-------------|
| FIX 1 (hybrid model) | ✅ wired, **awaiting model pick** | `utils/model-tiers.ts`; design tier threaded into Agents 3/3b/5/6/7; `AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN` env (commented `gpt-4.1` default in `.env.local`) |
| FIX 2 (best-attempt + leak) | ✅ | `generate.ts` retains best LLM attempt over the template at both exhaustion paths; `summarizeClueForFallback` no longer emits raw `clue_id_*` |
| FIX 3 (prompt slim) | ✅ | prose-prompt token ceiling 32000→24000, env-tunable (`AGENT9_PROMPT_TOKEN_CEILING`) |
| FIX 4 (gender) | ✅ | guaranteed gender backfill in Agent 2 (`inferGenderFromName` + alternation), schema `required: true`, prose pronoun-map no longer silently drops |
| SWEEP A (genre schema) | ✅ | `false_solution`, structured `red_herrings`, `closed_circle` in CASE schema; Agent 3 generates+normalises; `validateGenreStructure` in story-validation, wired into Agent 6 |
| SWEEP B (10-beat arc) | ✅ | `GOLDEN_AGE_BEATS` + `beat` Scene/schema field; Agent 7 prompt maps 10 chapters→beats in order; soft beat-order check; short=10 length inconsistency fixed |
| SWEEP C (no confession) | ✅ | `final_reveal` rebalanced (confession optional, evidence_chain dominant); deduction-led reveal required; false-solution refutation required |
| SWEEP D (prose blind reader) | ✅ behind `ENABLE_PROSE_BLIND_READER` | `prose-blind-reader.ts`; release-gate check that the culprit is solvable from prose minus the reveal |

**Operator switches added:** `AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN`, `AGENT9_PROMPT_TOKEN_CEILING`,
`ENABLE_PROSE_BLIND_READER`. Premium tiers fall back to the base deployment when unset, so behaviour
is unchanged until opted in.

**Note on `LLM_TIMEOUT_MS`:** currently 30000 (30s) in `.env.local`. A premium model on long prose
may exceed this — raise it (e.g. 120000) when switching the prose tier.

---

## 1. Problem Statement

The pipeline is large and sophisticated (~15k lines in the agent layer, a ~4k-line `generate.ts`,
scoring, validators, NSD lattices, token budgeting), but the **finished stories are not readable**
and do not meet the genre spec. The latest run
([stories/story_20260616-2130](../stories/story_20260616-2130)) exhibits reader-visible failures in
nearly every paragraph.

Two distinct problem classes emerged from the trace:
- **Prose-engine failures** (pronouns, repetition, template leakage) — fixable with model + retry/prompt changes.
- **Design-model gaps** (no red herrings, no false solution, no 10-beat arc, confession ending allowed)
  — these are *structural*: the underlying data model (CML 2.0) does not represent the genre's
  required machinery, so no amount of prose tuning can produce it. This is the deeper root cause.

---

## 2. How Generation Actually Works (validated)

**Execution model.** A run is started by `POST /api/projects/:id/run`
([apps/api/src/server.ts:1286](../apps/api/src/server.ts#L1286)) and runs **in-process inside the API**
via `generateMystery` ([apps/worker/src/jobs/mystery-orchestrator.ts:510](../apps/worker/src/jobs/mystery-orchestrator.ts#L510)).
The worker `runner.ts`/`index.ts` are not involved in a run. All agents mutate one in-memory
**`OrchestratorContext`** ([apps/worker/src/jobs/agents/shared.ts:147](../apps/worker/src/jobs/agents/shared.ts#L147));
the mystery domain object that threads through is `ctx.cml` (`CaseData`). Artifacts are persisted via
`onArtifact` callbacks to the repository (`data/store.json`) and reports to `apps/api/data/reports/`.

**Actual agent order** (corrects v1):

| # | Agent | Consumes | Produces |
|---|-------|----------|----------|
| 1 | Agent1 Setting Refiner | inputs | `setting` |
| 2 | Agent2 Cast & Motive Designer | setting | `cast` (incl. gender, motive_seed, red herrings as free text) |
| 3 | Agent2e Background Context | setting, cast | `backgroundContext` |
| 4 | Agent3b Hard-Logic Device Ideation | background, directives | `hardLogicDevices` (the mechanism/method) |
| 5 | **Agent3 CML Generator** (embeds Agent4 revision + Agent8 novelty) | devices, cast, setting | `cml` (the CASE object) |
| 6 | Agent5 Clue Distributor | cml | `clues`, coverage |
| 7 | Agent6 Fair-Play Auditor + Blind Reader | cml, clues | `fairPlayAudit` (may rewrite clues/cml) |
| 8–10 | Agent2b/2c/2d Profiles (character/location/temporal) | cast, cml, setting | profiles |
| — | **CML Validation Gate** (discriminating-test/coverage) | | abort if broken |
| 11 | Agent65 World Builder | cml, profiles | `worldDocument` |
| 12 | Agent7 Narrative Outliner | cml, clues, world | `narrative` (3-act scene list) |
| 13 | Agent9 Prose + Release Gate | narrative, cml, clues, profiles | `prose`, `validationReport` |

**Key structural facts the trace established:**

- **1 scene = 1 chapter, strictly** ([story-length-targets.ts:11](../packages/story-validation/src/story-length-targets.ts#L11)).
- **Chapter count is variable by length, not fixed at 10.** YAML `story_length_policy` =
  short 10 / medium 20 / long 30 ([generation-params.yaml:183](../apps/worker/config/generation-params.yaml#L183)).
  Only **short** matches the spec's mandated 10 chapters / ~10,000 words. (A latent bug: the static
  fallback in [story-length-targets.ts:29](../packages/story-validation/src/story-length-targets.ts#L29)
  says 20/30/42, contradicting YAML.)
- **The spec's named 10-beat arc is not modeled anywhere as data.** Agent 7 emits a generic 3-act scene
  list ([agent7-narrative.ts:190](../packages/prompts-llm/src/agent7-narrative.ts#L190)). The chapter
  identities (Gathering / Crime / Motives / False Solution / Pattern Emerges / Final Trap / Revelation)
  exist only as a prose-time heuristic `resolveStageModeKey`
  ([agent9-prose/clue-validation.ts:181](../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L181)),
  which infers a "stage mode" by chapter position — it does not enforce the spec's ordering or beats.
- **One shared LLM client; default deployment for ALL agents** is `AZURE_OPENAI_DEPLOYMENT_NAME`
  ([server.ts:365](../apps/api/src/server.ts#L365)). The **only** per-agent override is prose
  (`AZURE_OPENAI_DEPLOYMENT_NAME_PROSE`, [agent9-run.ts:3012](../apps/worker/src/jobs/agents/agent9-run.ts#L3012)).
  Everything currently resolves to `gpt-4o-mini`.
- **The only hard fairness gate is the Blind Reader** ([agent6-run.ts:1731](../apps/worker/src/jobs/agents/agent6-run.ts#L1731)):
  an LLM given only clue *descriptions* must name the culprit. It validates the clue **set**, never the
  rendered prose, so a one-clue case can still pass.

---

## 3. Evidence (from latest output)

From [stories/story_20260616-2130/...md](../stories/story_20260616-2130/generated_in_scene_batches_7_batch_es_required_r.md):

| # | Failure | Example |
|---|---------|---------|
| E1 | Pronoun/gender collapse | Margaret (woman) → "his fingers", "his dress"; Finch (man) → "she asked" |
| E2 | Raw template/scaffold leakage | "the evidence around clue_id_1 and clue_id_2"; "The immediate pressure concerned Clear suspects based on alibis and evidence." |
| E3 | Extreme repetition | Clock clue restated in ch 1,2,3,4,6,7; one sentence repeated 5× in ch 8 |
| E4 | Genre rules violated | Confession ending; **zero** red herrings; **no** false solution; one clue for 9 chapters |
| E5 | Telling, not showing | "This discrepancy marked the first clue…" — a spec-banned construction |

Prior self-review ([chatgpt-review.txt](../stories/story_20260616-1845/chatgpt-review.txt)) scored 53/100
and independently flagged the same pronoun and clock-timeline issues.

---

## 4. Root Causes (validated against code)

### RC1 — Undersized model for both prose AND design
- `gpt-4o-mini` writes the prose ([agent9-run.ts:3012](../apps/worker/src/jobs/agents/agent9-run.ts#L3012),
  prompt log `Model: gpt-4o-mini`) **and** designs the mystery (Agents 3/3b/5 share the same default deployment).
- A small model cannot hold ~5 genders straight under a ~1,000-line prompt (→ E1), nor invent a layered
  multi-clue mystery with red herrings (→ E4). Upgrading prose alone will not fix the thin design.

### RC2 — Pronoun data is optional end-to-end and silently dropped
- `gender` is `required: false` in both the cast and CML schemas
  ([cml_2_0.schema.yaml:103](../schema/cml_2_0.schema.yaml#L103)); Agent3 copies it as
  `gender || undefined` ([agent3-cml.ts:603](../packages/prompts-llm/src/agent3-cml.ts#L603)); Agent2b
  profiles ignore gender entirely.
- Agent9 builds its pronoun lock from `castDesign.characters.filter(c => c.gender)`
  ([agent9-run.ts:2955](../apps/worker/src/jobs/agents/agent9-run.ts#L2955)). **Any character missing
  `gender` is silently excluded from the pronoun table** → the model defaults, usually to "he". The
  prose-side pronoun enforcement is actually correct *when the field is present*; the bug is upstream.

### RC3 — Deterministic fallback ships unreadable prose; no best-attempt retention
- `preferCompletionOnFailure` defaults **true** ([generate.ts:1891](../packages/prompts-llm/src/agent9-prose/generate.ts#L1891)),
  so on retry exhaustion the engine emits `buildCompletionFallbackChapter`
  ([generate.ts:3268](../packages/prompts-llm/src/agent9-prose/generate.ts#L3268),
  [generate.ts:3668](../packages/prompts-llm/src/agent9-prose/generate.ts#L3668)) — fixed template
  sentences that pad by repetition ([deterministic-repair.ts:790](../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L790))
  and interpolate raw `clue_id_*` strings (→ E2, E3).
- **Best-attempt retention does not exist.** `batchErrors`/scores are re-declared inside the attempt loop
  ([generate.ts:2368](../packages/prompts-llm/src/agent9-prose/generate.ts#L2368)); a good attempt-2 is
  discarded if attempt-3 is worse. Outcome on exhaustion is binary: latest attempt or template.

### RC4 — `scene.objective` leak traces to `scene.purpose`
- There is no `scene.objective` field; Agent9 reads `scene.objective ?? scene.purpose ?? scene.summary`
  ([deterministic-repair.ts:747](../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L747)),
  resolving to `purpose` — a free-text field that Agent7 repair code sometimes **machine-concatenates**
  with canned sentences ([agent7-run.ts:1476](../apps/worker/src/jobs/agents/agent7-run.ts#L1476)). Those
  strings then surface verbatim in fallback prose.

### RC5 — Prompt over-constraint drives retry churn
- The Ch8 prompt was **1,003 lines**; the run produced **102 prompt files**. Budget ceiling is 32k tokens
  with per-block caps ([prompt-builder.ts:1123](../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1123)).
  A small model satisfies mechanical checks robotically, fails quality checks, retries, falls back.

### RC6 (the deep one) — The data model doesn't represent the genre
The README states CML 2.0 is **"not a story generator… not a plot outline"** — it is a lean logic-proof
format built around *one mistaken belief* + a *discriminating test*. The team is generating full Golden
Age stories from it. The genre's required machinery is **absent from the data model**:
- **No `false_solution`** anywhere ([agent5 map] / schema). Only a single `false_assumption` premise
  exists ([cml_2_0.schema.yaml:174](../schema/cml_2_0.schema.yaml#L174)) — not a rival accusation against
  a named innocent suspect with one detectable flaw.
- **No structural red herrings.** They live only as an optional free-text array in the *cast* artifact
  ([cast_design.schema.yaml:103](../schema/cast_design.schema.yaml#L103)); there is **no `red_herring`
  field in CML**, **no `innocentExplanation`**, and **no ≥2 floor** (the upper-bound check at
  [agent5-clues.ts:1165](../packages/prompts-llm/src/agent5-clues.ts#L1165) is the only count check).
- **No clue-type variety enforcement.** Backstops *clone a template clue* to fill coverage
  ([agent6-run.ts:952](../apps/worker/src/jobs/agents/agent6-run.ts#L952)), enabling the "one clock clue ×9".
- **Closed circle only implicit** — no validator asserts the culprit is one of the named suspects.
- **Confession is not banned** — `generation-params.yaml` even budgets ~20% `confession_aftermath`.

This is why the output is a thin logic puzzle rather than a Golden Age mystery: **the pipeline faithfully
renders the CML it's given, and the CML never contained the genre's structure.**

---

## 5. Fixes — Tactical (assimilate into current architecture)

Each fix lists What / How (with insertion points) / Acceptance / Risk / Effort.

### FIX 1 — Use a capable model for prose AND the design agents
- **What:** Point prose at a frontier model; **also** upgrade the design agents (3, 3b, 5, and the
  fair-play 6) since they decide whether a real mystery exists.
- **How:**
  - Prose (no code): set `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE` (read [agent9-run.ts:3012](../apps/worker/src/jobs/agents/agent9-run.ts#L3012)).
  - Design agents currently share one client/`defaultModel` ([server.ts:365](../apps/api/src/server.ts#L365)).
    To upgrade them selectively, add per-agent model overrides (mirror the prose-override pattern) or
    raise the global default. If choosing Claude, confirm/extend the transport in
    [packages/llm-client](../packages/llm-client/src) (cost-tracker + logger already key on model id).
  - The in-code API call site for prose is [generate.ts:2325](../packages/prompts-llm/src/agent9-prose/generate.ts#L2325)
    (`model: inputs.model`), co-located with temperature/maxTokens if per-attempt model escalation is wanted.
- **Acceptance:** Fresh short run: 0 pronoun errors, no fallback chapters, no verbatim cross-chapter repeats.
- **Risk:** Low (config); cost/latency rise. **Effort:** S → M (if Claude transport needed).

### FIX 2 — Retain best LLM attempt; never ship template prose
- **What:** Replace "template on exhaustion" with "keep best-scoring LLM attempt, else abort."
- **How (precise):**
  1. Declare `bestCandidate`/`bestScore` **outside** the attempt loop (near [generate.ts:2144](../packages/prompts-llm/src/agent9-prose/generate.ts#L2144)).
  2. After per-attempt scoring (around [generate.ts:2893](../packages/prompts-llm/src/agent9-prose/generate.ts#L2893)),
     snapshot `proseBatch.chapters` + error count when it beats the prior best.
  3. At both exhaustion branches ([generate.ts:3241](../packages/prompts-llm/src/agent9-prose/generate.ts#L3241)
     and the catch-block at [generate.ts:3659](../packages/prompts-llm/src/agent9-prose/generate.ts#L3659)),
     prefer the retained best over `buildCompletionFallbackChapter`. Default `preferCompletionOnFailure=false`.
  4. Demote/delete `buildCompletionFallbackChapter`; independently, stop interpolating raw `clue_id_*` and
     `scene.purpose` strings ([deterministic-repair.ts](../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts), [RC4]).
- **Acceptance:** No output contains `clue_id`, stage-mode, scene-objective strings, or canned fallback beats.
- **Risk:** Medium — more aborts until FIX 1 lands (correct behaviour; track abort rate). **Effort:** M.

### FIX 3 — Slim the prose prompt; enforce mechanics post-gen
- **What:** Cut the generation prompt to craft guidance; move mechanical checks to validators with
  **single-issue** corrective retries.
- **How:** Lower `perBlockTokenCap` ([prompt-builder.ts:1123](../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1123))
  and re-tier non-craft blocks to droppable priority ([prompt-blocks.ts:1068](../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts#L1068));
  keep clue/lint validators but issue one focused retry per failure class rather than re-sending the stack.
- **Acceptance:** Median prose prompt < 400 lines; retries-per-run materially down; scores hold. **Effort:** L.

### FIX 4 — Fix gender at the source
- **What:** Make `gender` required and reliably populated so the pronoun lock can't be silently empty.
- **How:** Make `gender` required in cast + CML schemas; add a deterministic backfill + hard validation in
  Agent2 output ([agent2-run.ts](../apps/worker/src/jobs/agents/agent2-run.ts)) and propagate through Agent3
  ([agent3-cml.ts:603](../packages/prompts-llm/src/agent3-cml.ts#L603)) and Agent2b; remove the silent
  `.filter(c => c.gender)` drop at [agent9-run.ts:2955](../apps/worker/src/jobs/agents/agent9-run.ts#L2955)
  (replace with a hard error if any speaking character lacks gender).
- **Acceptance:** No run reaches prose with a genderless named character. **Effort:** S–M.

---

## 6. Sweeping Changes (recommended — to actually hit the goal)

These address RC6. Without them, FIX 1–4 yield *readable* prose of a *thin* mystery.

### SWEEP A — Add a genre "Story Bible" structure between CML and prose
Introduce a first-class **mystery design object** that carries the Golden Age machinery CML omits, either
by extending the CML CASE schema or adding a new artifact produced by a dedicated agent after Agent3:
- `false_solution`: `{ accused_suspect, supporting_clues[], the_one_flaw, refuted_in_chapter }`.
- `red_herrings[]`: each `{ id, description, points_at_suspect, innocent_explanation, resolved_in_chapter }`
  — with a **hard ≥2 floor** and a validator that every herring gets an innocent explanation on the page.
- `clue_ledger[]` with a **clue-type taxonomy** (physical/verbal/timing/behavioural/document/etc.) and a
  **variety requirement** (≥N distinct types) so the "one clock clue" case is structurally impossible.
- `closed_circle`: explicit suspect list + a validator asserting the culprit ∈ suspects and no outsiders.
- This object becomes a hard input to Agent7 (outline) and Agent9 (prose).

### SWEEP B — Model the 10-beat arc as data, not a prose-time guess
Replace the generic 3-act scene list with a **beat-typed outline** for the short/spec format: each of the
10 chapters carries an explicit `beat` (`gathering | crime | first_enquiries | motives | alibis |
false_solution | secrets | pattern | final_trap | revelation`), and Agent7 must emit one scene per beat in
order. Validate beat presence and ordering. This makes the spec's structure a guarantee, not an emergent
property of `resolveStageModeKey` ([clue-validation.ts:181](../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L181)).
Fix the short/medium/long inconsistency ([story-length-targets.ts:29](../packages/story-validation/src/story-length-targets.ts#L29)
vs [generation-params.yaml:183](../apps/worker/config/generation-params.yaml#L183)) and default the
Golden Age product to the 10-chapter short format.

### SWEEP C — Ban the confession ending; require logic-based reveal
Remove `confession_aftermath` budgeting from `generation-params.yaml`; add a final-chapter validator and a
fair-play-auditor check that the reveal is driven by the discriminating test / deduction, not a confession.
Replace the `final_reveal` fallback confession language
([deterministic-repair.ts:560](../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L560)).

### SWEEP D — Validate fairness against the PROSE, not just the clue set
The Blind Reader currently reads clue descriptions ([agent6-run.ts:1731](../apps/worker/src/jobs/agents/agent6-run.ts#L1731)).
Add a post-prose blind-reader pass over the actual chapters (minus the reveal) to confirm the reader could
solve it from what's *on the page* — the genre's real fairness test.

### SWEEP E — Reposition CML as the logic core, with genre as a layer
Strategic framing: keep CML 2.0 as the airtight logic kernel (one deception + discriminating test), and
treat SWEEP A/B as a **genre enrichment layer** built on top. This respects the README's stated scope for
CML while giving the story generator the structure the goal demands. Document the two layers so future work
doesn't keep bolting genre requirements onto prose prompts (the current anti-pattern that produced the
70-line changelog of guardrail patches).

---

## 7. Phased Rollout

| Phase | Work | Gate before proceeding |
|-------|------|------------------------|
| 0 | Baseline: regenerate 1 **short** story on current config; archive as control | Control saved |
| 1 | FIX 1 (model: prose **and** design agents) + FIX 4 (gender required) | Pronoun errors → 0; richer clue set appears |
| 2 | FIX 2 (best-attempt retention; kill template prose; leak fix) | No `clue_id`/scaffold in any output |
| 3 | FIX 3 (prompt slimming + single-issue retries) | Prompt < 400 lines; retries down; scores hold |
| 4 | SWEEP A + C (false solution, red herrings w/ innocent explanations, no confession) | These appear on the page |
| 5 | SWEEP B (10-beat arc as data) + length fix | 10 ordered named beats in output |
| 6 | SWEEP D (prose-level blind reader) | Reader can solve from prose |

> Do **FIX 1 first and regenerate a short story** before deeper work — a capable model on both prose and
> design changes what the later phases must compensate for, and may make several anti-`gpt-4o-mini`
> guardrails redundant.

---

## 8. Acceptance Criteria (whole-project "done")

A fresh **short (10-chapter)** run must satisfy:
1. **Pronouns:** zero gender errors; no run reaches prose with a genderless named character.
2. **No leakage:** no `clue_id`, stage-mode, scene-objective strings, or canned fallback beats.
3. **No repetition:** no sentence repeated verbatim across chapters; central clue not re-explained each chapter.
4. **Genre backbone:** closed circle (validated); ≥8 clues across ≥4 distinct types; ≥2 red herrings each
   given an innocent explanation; a false solution (ch 6) with one flaw, refuted by ch 10.
5. **Structure:** 10 chapters mapped to the named beats, in order, ~1,000 words each (~10,000 total).
6. **Fair-play reveal:** solution by deduction/discriminating test, **not** confession; no banned telling phrases.
7. **Solvability:** a prose-level blind reader can name the culprit before the reveal.
8. **Independent score:** ≥ 80/100 on the rubric used in the prior ChatGPT review (vs current 53).

---

## 9. Open Questions for Owner

1. **Model choice** for prose and for design agents: Claude (Opus/Sonnet 4.x) vs `gpt-4.1`? Determines
   whether an Anthropic transport is needed in `llm-client`.
2. **Cost/latency budget** per story — sets how widely to apply the larger model.
3. **CML scope decision (SWEEP E):** extend the CML CASE schema with genre fields, or add a separate
   genre-enrichment artifact/agent on top of CML? (Affects schema, validators, and many prompts.)
4. **Default product format:** lock the Golden Age product to the 10-chapter short format, or keep
   medium/long (which violate the spec's ~10,000-word / 10-chapter mandate)?
5. **Abort vs best-effort** while FIX 1 is in flight: hard abort on unmet checks short-term (recommended),
   or must every run always produce something?
