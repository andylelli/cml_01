# Architecture Review 02 — the remediation, audited against the wire

**Companion to:** [REVIEW_01.md](REVIEW_01.md) — that document planned the remediation and recorded the build. This one audits what the build actually does when it runs, and says what to keep, change, and back out.

**Written:** 2026-08-02 · **Method:** every completed task re-derived from source, from the *installed* SDK in `node_modules`, and from the live `.env.local` — not from REVIEW_01's own claims. Four checks were executed rather than asserted: all six test suites, `preflight-dist-check`, `npm run eval:dry`, and a serialization trace through `@azure/openai@1.0.0-beta.13`.

**Method marking, carried from A_70/A_71:** **MEASURED** (I ran the check and quote the output) · **INFERRED** (follows from reading code or a vendor contract) · **UNVERIFIABLE** (no read path exists to settle it).

**Bias to declare, and it is the opposite of REVIEW_01's.** REVIEW_01 declared a bias toward measurement problems. This document was written by re-checking that document's own conclusions, so it is biased toward finding *it* wrong. Weight [§5](#5-what-worked-and-should-be-left-alone) — what worked — accordingly: most of the remediation is sound, and the failures cluster in one place.

---

## 0. Verdict up front

> **REVIEW_01's tracker reads 13 / 17 complete. By capability the number is 11 / 17.** Two completed tasks — R3 and R4, structured outputs — cannot function against the transport this project actually uses, and a third, R8, cannot be measured by the probe assigned to it. All three passed type-checking, unit tests, `build:all` and `preflight-dist-check`. **All three fail on the wire.**

That is not a new failure class. It is [A_71 §9](../documentation/analysis/ANALYSIS_71/ANALYSIS_71.md)'s rule pointed the other way down the pipe:

| Board | The rule |
|---|---|
| A_68 | A craft fix without a **detector** doesn't stick |
| A_70 | A detector without a verified **read path** is worse than no number |
| A_71 | A read path must be verified against **real data**, not the declared contract |
| **A_72 (this)** | An **outbound** path must be verified against the **wire**, not the type system |

`resolveResponseFormat` carries this comment: *"the whole value of structured outputs is that the schema actually reaches the API, and that is exactly the kind of wiring this codebase has repeatedly got wrong silently."* The schema does not reach the API. The comment is correct and the code beneath it is not.

| Verdict | Tasks |
|---|---|
| **Worked — keep** | R1, R2, R5, R6, R9, R10, S1, S2, S3, S5 + the whole A_71 measurement sweep |
| **Worked but mis-specified** | R8 (change the probe, not the code) |
| **Did not work — do not probe as written** | **R3, R4** |
| **Back out** | the `rewrite` model tier · the `AGENT9_MODEL_GENERATE` / `AGENT9_MODEL_REWRITE` entries in `.env.local` |
| **Change before the next run** | R9 × R5 interaction · `AGENT9_PROSE_BATCH_SIZE` bound · `npm test` coverage · `package-lock.json` · 25 dangling doc links |

---

## 0b. Remediation of this audit — **built 2026-08-02**

Everything in §4 items 1–5 is implemented. This section is the build record; §2–§4 below are left as
written, because a board that edits its own findings after fixing them loses the evidence trail.

| § | Finding | Status | What was built |
|---|---|---|---|
| 2.1 | Schema never leaves the process | ✅ **fixed** | [`azure-http-transport.ts`](../packages/llm-client/src/azure-http-transport.ts) — a direct POST that carries `response_format` verbatim, behind `LLM_HTTP_TRANSPORT` (runtime getter, default OFF). **No new vendor dependency**: retry, circuit breaker, rate limiting, deadline, cost and content-filter tallying already lived in our client, so the SDK was contributing an auth header and the defective serializer |
| 2.1 | Nothing could ever have caught it | ✅ **fixed** | `llm-prompts-full.jsonl` now records `responseFormat` and `transport` per request. FLAG-AUDIT's verification rule finally has the field it needs to read |
| 2.1 | The probe destroys the run it measures | ✅ **fixed** | `assertFlagCapabilities` at the top of `generateMystery` refuses an impossible flag combination at **t=0**, before the first LLM call; `AzureOpenAIClient.chat` carries the same refusal as a backstop for harnesses that bypass the orchestrator. It **throws rather than falling back** — a silent downgrade would let a probe report "flag ON" while running the control arm, which is the defect class this whole document is about |
| 2.2 | R8's metric unreadable | ✅ **fixed** | `usage.prompt_tokens_details.cached_tokens` parsed into `TokenUsage.cachedPromptTokens` and logged. **Absent ≠ 0**: the SDK path leaves it undefined rather than writing a zero, so "we cannot see" never renders as "we looked and there was nothing" |
| 2.3 | Two more flags read by nothing | ✅ **fixed** | `rewrite` tier deleted (stage, env var, doc comment, `.env.local` line); `generate` wired at both `generateProse` call sites — a no-op at today's config, which is why it ships unflagged |
| 3.1 | R9 bypasses R5's resume gate | ✅ **fixed** | `ResumeSkipTracker.selectPending()` — the same decision for a concurrent group, preserving Rule 1 (contiguous prefix) inside it. The parallel branch now skips restored stages and copies back only what ran |
| 3.2 | Batch size doc ≠ code | ✅ **fixed** | `MAX_PROSE_BATCH_SIZE = 2` clamps at the source, so the artifact records the value actually used; preflight warns when a larger configured value is clamped |
| 3.3 | `npm test` ran 3 of 6 suites | ✅ **fixed** | All six workspaces in the root script |
| 3.4 | Lockfile / doc links | ✅ **fixed** | Stale `packages/utils` record removed (npm marked it `extraneous` rather than pruning it — the stale `node_modules/@cml/utils` symlink had to go first); 26 references retargeted to `REVIEW_01.md` |
| 3.4 | `run-resume.ts` vs `resume-run.ts` | ✅ **fixed** | The library is now `resume-hydration.ts`; the pair reads as `resume-run` (the verb, an entry point) and `resume-hydration` (the noun, a mechanism) |
| 2.3 | Nothing compares config ↔ code ↔ register | ✅ **built** | `npm run flags:check` — [flag-register-check.mjs](../scripts/flag-register-check.mjs). See §0c |
| — | R7's human is unequipped | ✅ **built** | `npm run eval:calibrate` — the labelling instrument and the agreement maths. See §0d |

**Verified 2026-08-02** — `build:all` 15 packages, `preflight-dist-check` 14 dists current, and all six
suites green with the new tests included:

```
api 27 · worker 431 · web 174 · llm-client 96 · prompts-llm 1008 (+7 skipped) · story-validation 430
```

**New tests, 31 in total, all failing before the fix:** 18 in
[`azure-http-transport.test.ts`](../packages/llm-client/src/__tests__/azure-http-transport.test.ts) —
including body assertions that a schema survives `JSON.stringify`, that the api key never enters a
URL or a request value, and that a `jsonSchema` call is REFUSED rather than sent malformed; 8 on the
t=0 guard; 5 on the concurrent resume decision.

**What is still owed, and it is the same thing as before:** none of this has run against Azure.
`LLM_HTTP_TRANSPORT` is registered in [FLAG-AUDIT](FLAG-AUDIT.md) with its probe — one run per arm,
artifacts equivalent, `cachedPromptTokens` present in the log. **It is the precondition for the
`AGENT7_STRUCTURED_OUTPUT` probe and for R8's metric**, so it should be the first arm of the next
run rather than a separate errand.

---

## 0c. The flag-drift check — and the 39 it found

§2.3 said the generated flag table was "no longer a nice-to-have". It is built:
**`npm run flags:check`** compares the three lists that must agree — *what the code reads · what
`.env.local` sets · what FLAG-AUDIT documents* — and gates on the expensive class immediately.

**Building the instrument found a bigger problem than the one it was built for.**

- **Config set, code reads nothing:** now **clean**. This is the `AGENT9_MODEL_REGEN` / `_REWRITE` /
  `_GENERATE` class, and it gates at exit 1.
- **Code reads, register documents nothing: 39 flags.** FLAG-AUDIT scoped itself to `AGENT9_*`, so
  every lever on Agents 1–7, novelty and the rubric has been running unregistered — including
  `AGENT3B_PLAUSIBILITY_JUDGE`, `AGENT6_REVEAL_GATE` and `AGENT7_PLANT_BEFORE_REVEAL`, all SET in
  `.env.local` today. The inventory is in [FLAG-AUDIT Addendum 4](FLAG-AUDIT.md); it is **reported,
  not gated** (`--strict` gates), because failing every build on day one is how a check becomes
  furniture. No verdicts were assigned to those 39: doing that from a code read alone would produce
  register entries that look like evidence and are guesses.

**The instrument needed auditing too, twice.** A first version understood only `process.env.X` and
declared `AGENT9_MODEL_GENERATE` unread — it resolves through `process.env[ENV_BY_STAGE[stage]]` — so
a checker blind to indirection would have sent someone to delete a live config line. Adding
string-literal matching then invented seven flags out of `console.log("AGENT5_FAILURE_CLASS", …)` in
the canary harness. Both are fixed and both are commented at the site. **A measurement tool is not
exempt from the rule it enforces**, which is the whole subject of this board.

## 0d. R7 — the half an agent can do

R7 is marked 👤 because **only a human can supply the ground truth**. That is still true. What was
missing is everything on either side of the labelling, and that is now built:

- **`npm run eval:external`** already emitted the stories and a cold-read instruction. It now also
  carries `internalCategories` and an `externalCategories` stub, so the read produces per-category
  marks rather than one total.
- **`npm run eval:calibrate`** computes the verdict from the filled manifest, so the labeller never
  hand-tallies (the A_62 lesson).

**The metric it leads with is deliberately not the obvious one.** Absolute agreement — "does the
judge give the same mark?" — is destroyed by a constant bias, and we have one of −9.5. It would
condemn a judge that is perfectly usable. What every actual use of this judge depends on is
**decision agreement**: when the judge says A beats B, does the reader agree? A judge running 9.5 low
that *orders* stories correctly makes internal A/B deltas trustworthy; a judge unbiased on the total
that scrambles the order does not, however good its mean looks. The tool reports bias, spread,
per-category bias, and pairwise ranking agreement against the published 85% bar — and separates
**offset-usable** (consistent bias, subtractable) from **erratic** (sd too wide for any correction),
which is the state the S0 batch's per-run −16/−3/−13/−6 actually describes.

It **refuses to print a verdict below 6 labelled pairs** and writes no record, because a calibration
figure from a handful of stories would read as evidence and carry none
(`canary-k2-single-run-confounded`). Seven tests cover the maths, including the case that matters
most: a judge with a near-zero mean bias and a scrambled order must come back NOT CALIBRATED.

**What remains for R7 is exactly one thing: read 6+ stories cold and fill in the manifest.**

---

## 1. Scoreboard

Every row re-verified in this pass. "Evidence" is what I actually checked, not what the task claimed.

| ID | REVIEW_01 | **Audited** | Evidence |
|---|---|---|---|
| R1 | done | ✅ **done** | MEASURED — `RUBRIC_JUDGE_MODEL=gpt-4.1-mini` at `.env.local:19`; `judge_model_source` still owed by a run |
| R2 | done | ✅ **done** | MEASURED — `agent2c-run.ts` guarded; `agent2c-narrative-ordering.test.ts` green |
| R3 | done | ❌ **non-functional** | MEASURED — [§2.1](#21-r3--r4-the-schema-never-leaves-the-process-critical) |
| R4 | done | ❌ **non-functional** | MEASURED — depends on R3; flag-ON arm cannot succeed |
| R5 | done | ✅ **done**, 1 defect | MEASURED — contiguous prefix at `run-resume.ts:185-195`; defeated by R9, [§3.1](#31-r9-bypasses-r5s-resume-gate) |
| R6 | done | ✅ **done** | MEASURED — `npm run eval:dry` → *"DRY complete — 4/4 bundles assembled a context"* |
| R7 | todo | ⬜ **todo** | Unchanged. 👤 needs a human |
| R8 | done | ⚠️ **code fine, probe impossible** | MEASURED — [§2.2](#22-r8-the-probe-metric-does-not-exist-in-this-sdk) |
| R9 | done | ⚠️ **done**, 1 defect | MEASURED — isolation design is sound; skips the resume gate |
| R10 | done | ✅ **done** | MEASURED — 11 ADRs + README in [decisions/](decisions/); 👤 ratification owed |
| S1 | done | ✅ **done**, incomplete sweep | MEASURED — audit missed two dead flags of the class it closed, [§2.3](#23-two-more-flags-read-by-nothing--instances-4-and-5) |
| S2 | done | ⚠️ **done in source, not in lock** | MEASURED — `package-lock.json:9488` still declares `packages/utils` |
| S3 | done | ✅ **done** | MEASURED — `finishRegenPass` / `regenPassDidNotRun` imported by `regen-integration.ts:31`; drift test green |
| S4 | todo | ⬜ **todo** | `agent9-run.ts` unchanged |
| S5 | done | ✅ **done** | MEASURED — single variant |
| S6 | todo | ⬜ **todo**, still unblocked | Back-edges remain removed |
| S7 | todo | 🔒 **blocked indefinitely** | Its unblocker is R4, which does not work. [§2.1](#21-r3--r4-the-schema-never-leaves-the-process-critical) |

**Health, MEASURED this pass:**

```
prompts-llm      1007 passed | 7 skipped      story-validation  430 passed
worker            418 passed                  llm-client         78 passed
web               174 passed                  api               green (count not captured)
preflight-dist-check: 14 buildable packages — all dists current
```

Nothing is red. **That is the finding, not the reassurance** — §2's three defects are all inside that green.

---

## 2. What did not work

### 2.1 R3 / R4 — the schema never leaves the process **(CRITICAL)**

**MEASURED.** `AzureOpenAIClient.chat` calls `getChatCompletions` and hands it `responseFormat: resolveResponseFormat(options)` ([client.ts:229](../packages/llm-client/src/client.ts#L229)). The installed SDK is `@azure/openai@1.0.0-beta.13`, and its chat-completions serializer builds the request body like this:

```js
// node_modules/@azure/openai/dist-esm/src/api/operations.js:136
response_format: !body.responseFormat ? undefined : { type: body.responseFormat?.["type"] },
```

It constructs a **new object carrying only `type`**. The `json_schema` payload — name, schema, `strict` — is discarded before the request is serialized. The SDK's own type union confirms this is not an oversight to route around: `ChatCompletionsResponseFormatUnion` is `text | json_object | { type: string }` (`types/openai.d.ts:508`). There is no `json_schema` member because the SDK predates the feature.

**A second, independent blocker.** `.env.local:27` pins `AZURE_OPENAI_API_VERSION=2024-02-15-preview`, which is also the client's hardcoded default ([client.ts:135](../packages/llm-client/src/client.ts#L135)). Structured outputs require `2024-08-01-preview` or later (INFERRED — vendor contract). Even with the payload intact, that endpoint would reject it.

> ⚠️ **CORRECTED 2026-08-03.** This paragraph is wrong, and the way it is wrong is instructive. `.env.local` is **not** the effective config: every entry point loads `.env` first and dotenv does not override, so **`.env` wins on any key both files define**. The effective api-version is **`2024-12-01-preview`** — comfortably past the `json_schema` floor. **The api-version was never a blocker; only the SDK strip was.** The finding above was derived by reading the losing file, which is the same class of defect as the rest of this document. `npm run flags:check` now reports shadowed keys (`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT_NAME`, `AZURE_OPENAI_API_VERSION`); see [REVIEW_03 §0m](REVIEW_03.md).

**So what happens if the owner runs the probe REVIEW_01 asks for?** With `AGENT7_STRUCTURED_OUTPUT=true`, Agent 7 sends `response_format: {"type":"json_schema"}` with no schema attached. That is a malformed request: a 400, which is not retryable, on the pipeline's **thirteenth** stage — after the full upstream spend. The never-abort gate protects the release decision, not stage 13. **The probe as written destroys the run it is measuring.**

**Why every existing check passed it.** [`structured-outputs.test.ts`](../packages/llm-client/src/__tests__/structured-outputs.test.ts) has twelve tests and every one of them exercises `resolveResponseFormat` — a **pure function** that returns an object. It asserts the object is well-formed. Nothing asserts the object survives serialization, and the project's own verification rule (*"a flag is verified only by finding its effect in `llm-prompts-full.jsonl`"*) **cannot be applied here at all**: MEASURED, the prompt log records messages and a prompt hash, never `response_format`. The one instrument that would have caught this is blind to the field.

**Recommended, in order of preference:**

1. **Fix the transport, and treat that as the real task.** `@azure/openai` beta.13 is a 2024-era package that cannot express or report 2026 features — see §2.2, which is the same root cause. The official `openai` npm package with `AzureOpenAI` (or a thin `fetch` against the deployment URL) carries `response_format` verbatim. Bump `AZURE_OPENAI_API_VERSION` in the same change. **One dependency change unblocks R3, R4, R8 and S7.**
2. **Until then, make the flag fail loudly at startup, not expensively at stage 13** — a guard that throws when `AGENT7_STRUCTURED_OUTPUT` is on and the transport cannot carry a schema. Cheap, and it converts a £1.40 run-killer into a one-line refusal.
3. **Log the resolved `response_format`** into `llm-prompts-full.jsonl`. The project's verification rule needs the field to be *in* the log to mean anything.

Do **not** delete the schema — [`agent7-narrative-schema.ts`](../packages/prompts-llm/src/agent7-narrative-schema.ts) is sound work and is the input the fixed transport will need. The defect is one layer below it.

**Consequence for the board:** S7 ("retire coercion sites proven dead by R4's counters") is blocked not by scheduling but by a transport that cannot run the experiment. Mark it 🔒, not ⬜.

### 2.2 R8 — the probe metric does not exist in this SDK

**MEASURED.** REVIEW_01 and [FLAG-AUDIT](FLAG-AUDIT.md) both set R8's acceptance as *"cached prompt tokens in `llm-prompts-full.jsonl` rising from chapter 2 onward."*

- The SDK's `CompletionsUsage` has exactly three fields — `completionTokens`, `promptTokens`, `totalTokens` (`types/openai.d.ts:801-808`). No `promptTokensDetails`, no `cachedTokens`.
- A repo-wide grep for `cachedTokens|cached_tokens|promptTokensDetails` across all source returns **zero hits**.

So the number the probe is defined against **is not read anywhere and cannot be, through this client**. UNVERIFIABLE, by construction.

The reordering itself is fine — [`prompt-builder.ts:1215`](../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1215) is a correct runtime getter, default-OFF, and stable-prefix-first is the right shape for automatic caching. **The code doesn't need backing out; the probe needs rewriting.** Two honest options:

- **Preferred:** fix the transport per §2.1 and read `usage.prompt_tokens_details.cached_tokens`, which the modern client exposes. The metric becomes real.
- **Interim:** re-specify acceptance as *Agent 9 cost per run at fixed chapter count*, which the existing `CostTracker` already measures. Weaker — it cannot separate a cache hit from a shorter prompt — but it is a number that exists.

### 2.3 Two more flags read by nothing — instances #4 and #5

FLAG-AUDIT closed with a strong finding: `AGENT9_MODEL_REGEN` was set in config and consulted by nothing, and it called that *"the third instance of the same defect shape in this document."* **The sweep that recorded it missed two more of the identical shape, one of which it created.**

**MEASURED.** `resolveStageModel` supports four stages (`generate | rewrite | regen | polish`, [model-tiering.ts:20](../packages/prompts-llm/src/agent9-prose/model-tiering.ts#L20)). Every call site in the repo:

```
agent9-run.ts:4203            resolveStageModel("regen",  proseDeployment)
post-pass-polish.ts:249,582   resolveStageModel("polish", args.model)
full-story-diagnostic.ts:260,385  resolveStageModel("polish", args.model)
```

`"generate"` and `"rewrite"` have **zero call sites**. Both are set in `.env.local` (`AGENT9_MODEL_GENERATE`, `AGENT9_MODEL_REWRITE`), so the config asserts a model choice for chapter generation that the generator never consults.

- `rewrite` is dead **because of** S1 — its only consumer was the critique-rewrite pass deleted on 2026-08-01. The deletion did not sweep the tier, the env entry, or the doc comment (`model-tiering.ts:10` still describes *"AGENT9_MODEL_REWRITE — critique→rewrite (strong)"*).
- `generate` predates that and is the more interesting one: it is the **premium** stage, and the config has been claiming to control it.

**Back out both.** Delete the `rewrite` stage and its env entry outright. For `generate`, either wire it at the generation call site or delete it — but do not leave a config line that reads as a decision and isn't one. That is what FLAG-AUDIT's lifecycle rule exists to prevent, three weeks after it was written.

---

## 3. What needs changing

### 3.1 R9 bypasses R5's resume gate

**MEASURED.** The orchestrator runs every stage through a `stage()` helper whose entire purpose is the resume skip:

```ts
// mystery-orchestrator.ts:980-991
const stage = async (field, run) => {
  if (skipTracker.shouldSkip(c, field)) { skippedStages.push(field); return; }
  await run(c);
};
```

The R9 parallel branch does not use it — it calls `runAgent2b/2c/2d` directly ([mystery-orchestrator.ts:1110](../apps/worker/src/jobs/mystery-orchestrator.ts#L1110)); only the `else` branch goes through `stage()`.

**Consequence.** With `AGENT_PROFILES_PARALLEL=true`, a resumed run **re-runs 2b/2c/2d even when their artifacts were restored** — three unnecessary LLM calls, restored artifacts overwritten with fresh ones, and `skippedStages` under-reporting what the run actually did. R5's own acceptance test ("kill at Agent 9, resume, confirm 0 LLM calls for stages 1–13") **fails whenever R9's flag is on**, and the failure looks like a resume bug rather than a flag interaction.

Neither flag is on today, so nothing is shipping broken — but they are two of the three probes queued next, and the natural thing is to run them in the same session. **Fix:** route the parallel branch through `stage()` (or consult `skipTracker` before spawning). Both-directions test: resumed + parallel must skip all three.

### 3.2 `AGENT9_PROSE_BATCH_SIZE` — the documented hard limit is not the coded one

**MEASURED.** FLAG-AUDIT states *"**Hard limit: 2** — a chapter is ~1,913 completion tokens against a 4,000 `maxTokens`."* The code accepts **1–10** and clamps to 10:

```ts
// agent9-run.ts:4222-4225, 4258
Number.isFinite(raw) && raw >= 1 && raw <= 10 ? Math.floor(raw) : undefined
const batchSize = Math.max(1, Math.min(effectiveProseBatchSize ?? 1, 10));
```

An operator who reads the reasoning as guidance and sets `3` gets JSON truncated mid-chapter against an unchanged `maxTokens` — the exact failure `agent7-narrative.ts` already carries a comment about. **Fix:** clamp to 2 with a warning, or scale `maxTokens` with the batch. A constraint that lives only in a markdown table is not a constraint.

### 3.3 `npm test` runs three of six suites

**MEASURED.** Root `test` is `npm run -w @cml/api test ; npm run -w @cml/worker test ; npm run -w @cml/web test`. The three packages holding **most of the remediation** — `prompts-llm` (1007 tests), `story-validation` (430), `llm-client` (78) — are not in it. That is ~1,500 of ~2,100 tests outside the default gate, including every test guarding structured outputs, the regen registry, and prefix ordering.

REVIEW_01 §2.3 asks for pre-merge quality gates. **The pre-merge gate for *code* is itself incomplete** — fix this before building one for prose. Add the three workspaces; ~25 s.

### 3.4 Housekeeping, all MEASURED

- **`package-lock.json` still declares the deleted workspace** (`"packages/utils": { "name": "@cml/utils" }`, line 9488). A clean `npm ci` resolves a workspace directory that no longer exists. Fix: `npm install`, commit the lock.
- **25 dangling doc links.** REVIEW.md was renamed to REVIEW_01.md; 25 source and doc references still point at `architecture/REVIEW_01.md` — including `agent7-run.ts`, `run-resume.ts`, `artifact-store.ts`, `story-output.ts`, `llm-client/src/types.ts`. Either restore the old name as the stable pointer or sweep the references. **Recommend the former:** stable filenames for things code links to, numbered files for boards.
- **`resume-run.ts` vs `run-resume.ts`.** Near-identical names, one directory, opposite roles — CLI entry point and hydration library. Rename the library to `resume-hydration.ts`.
- **Stale comments.** `model-tiering.ts:4,10` still describe the deleted critique→rewrite pass; `model-tiering.test.ts:9,23` still exercise `AGENT9_MODEL_REWRITE`.

---

## 4. Ranked — what to do next

| # | Action | Cost | Unblocks | Status |
|---|---|---|---|---|
| 1 | **Replace the LLM transport** + log `response_format` | ~half a day | R3, R4, R8's real metric, S7 | ✅ **done 08-02** — direct POST behind `LLM_HTTP_TRANSPORT`, no new vendor dep |
| 2 | Guard `AGENT7_STRUCTURED_OUTPUT` at startup until #1 lands | 30 min | stops a £1.40 run-killer | ✅ **done 08-02** — kept as a permanent capability check, not a stopgap |
| 3 | Route R9's parallel branch through `stage()` | 1 h | makes the R5 and R9 probes independent | ✅ **done 08-02** |
| 4 | Back out `rewrite` tier; resolve `AGENT9_MODEL_GENERATE` | 1 h | closes the flag class at #5 | ✅ **done 08-02** |
| 5 | Clamp batch size to 2; add three workspaces to `npm test`; `npm install`; sweep 25 links | 1 h | — | ✅ **done 08-02** |
| 6 | **`npm run eval:baseline`** — unchanged as the keystone | £4–8 | 11 deferred flags | ⬜ **owner's call — needs LLM spend** |
| 7 | **R7 judge calibration** 👤 | human | turns every eval delta into a claim about the external score | ◑ **instrument built** (§0d) — what remains is reading 6+ stories cold and filling the manifest |
| 8 | **Probe `LLM_HTTP_TRANSPORT`** — one run per arm | one run | R4's probe, R8's metric, then S7 | ⬜ **new** — fold into the next run rather than running it separately |
| 9 | Verdict the 39 unregistered flags | ~1 sitting per agent | `flags:check --strict` as a gate | ⬜ **new** (§0c) — needs the owner of each agent, not a code read |

**1–5 were all code, all cheap, and none of them needed LLM spend** — they were the price of the
remediation being trustworthy. They are done; §0b is the build record. What remains on this board is
exactly what it was before: **measurement that costs money, and one judgement that needs a human.**

---

## 5. What worked, and should be left alone

Stated deliberately, because §2 is loud and most of this work is good.

- **The A_71 measurement sweep is the highest-value work on either board.** Report finalization, the cast relationship-shape fix (quality 60 → 100 with no change to Agent 2), the red-herring floor, the content-filter tally. Each was verified against a real artifact, which is why none of them appears in §2.
- **R5's design is right, including its self-audit.** The contiguous-prefix rule and the `signals_unavailable` / `gates_fully_evaluated` reporting are the correct answers to problems that would have been invisible in a "did the run finish?" test. Its one defect (§3.1) was introduced by a *different* task.
- **R6 works.** `npm run eval:dry` assembles all four bundles, and the harness prints its own limits — the −9.5 internal bias and the upstream-pinned categories — on every scored run. That honesty is the reason to trust it.
- **R9's isolation design is careful and correct.** Private warning buffers, suppressed partial-save, deterministic merge order, explicit copy-back. Fix the `stage()` bypass and promote it on evidence.
- **S3 landed in production**, not just in a document: `finishRegenPass` / `regenPassDidNotRun` are imported by `regen-integration.ts`, and the registry↔code drift test is what keeps the catalogue honest.
- **Do not write more architecture documentation.** REVIEW_01 §8 was right and this pass confirms it: the gaps found here were all found by reading *code*, and none of them would have been prevented by another document.

---

## 6. Does any of this move the score toward 80?

**Still no — and the honest number is now slightly worse than REVIEW_01 reported.** Two of its ten remediation tasks do not function, so the reliability/measurement programme is 11/17 by capability. The craft position is unchanged and unmeasured since 2026-07-31:

| | |
|---|---|
| External (ChatGPT) mean | **73.25** — 6.75 short of 80 |
| Internal − external gap | **−9.5**, per-run −16 / −3 / −13 / −6 |
| Category floor | clues 5.31 · prose 5.44 · plot_structure 5.56 · pacing/ending 6.00 |
| Runs since the A_71 fixes | **none** — last run 2026-07-31 |
| `eval/golden/baseline.json` | does not exist |

The ledger's instruction — *"P5 (craft levers) is the critical path; do not spend more on reliability"* — has now been overrun twice: once by REVIEW_01's remediation, and once by this audit of it. **§4 items 1–5 are the last reliability work that should happen before a run.** They are cheap, and their purpose is narrow: to make sure the next £4–8 of measurement is spent on instruments that can actually carry a signal.

---

## 7. The through-line

REVIEW_01 graded the *loop around the pipeline* — recovery, evaluation, the LLM↔code interface — as its weakest dimension, and gave the interface a C−. That grade was right, and the remediation aimed at it landed in the one place the project has no instrument pointed: **the boundary where our object becomes someone else's HTTP body.**

Inside that boundary, this codebase is well defended — 2,100 tests, a dist-freshness preflight, both-directions discipline, a flag register with named blockers. Across it, there is nothing. The type system said the schema was there. The unit test said the object was well formed. The build said everything compiled. **A vendored serializer three dependencies down dropped the field, and every green check stayed green.**

> **The rule this pass adds: for anything crossing a process boundary, the test must assert what goes over the wire — the request body, not the object you handed the client.**

The cheapest instrument for it is the one the project already trusts for flags, extended by one field: put `response_format` in `llm-prompts-full.jsonl`, and the next defect of this class is visible the first time anyone greps a run.

---

## 8. Verification log

Everything marked MEASURED above came from one of these, run on 2026-08-02 against `redesign/agent-blue-sky` @ `e2073a44`, working tree clean:

```
npm test                                  → api/worker/web green (worker 418, web 174)
npm run -w @cml/prompts-llm test          → 1007 passed | 7 skipped
npm run -w @cml/llm-client test           → 78 passed
npm run -w @cml/story-validation test     → 430 passed
node scripts/preflight-dist-check.mjs     → 14 buildable packages — all dists current
npm run eval:dry                          → DRY complete — 4/4 bundles assembled a context
```

Plus source reads of: `@azure/openai@1.0.0-beta.13` (`dist-esm/src/api/operations.js:136`, `types/openai.d.ts:508,801`), `client.ts:63-135,229`, `mystery-orchestrator.ts:705-1122`, `run-resume.ts:185-215`, `model-tiering.ts:20-38` with a repo-wide `resolveStageModel(` call-site sweep, `agent9-run.ts:4210-4260`, `package-lock.json:9488`, `.env.local`.
