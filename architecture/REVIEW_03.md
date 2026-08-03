# Architecture Review 03 — where the improvements actually stand

**Written:** 2026-08-02 · **Type:** a position statement, not an audit and not a plan. [REVIEW_01](REVIEW_01.md) proposed the remediation and recorded the build; [REVIEW_02](REVIEW_02.md) audited that build against the wire and fixed what it found. This says where the architecture *is* after both, in one place, with every number re-measured today rather than carried forward.

**Companion documents:** [README.md](README.md) describes the system as built · [FLAG-AUDIT.md](FLAG-AUDIT.md) is the flag register · [decisions/](decisions/) holds the 11 ADRs.

**Method marking, unchanged across three boards:** **MEASURED** · **INFERRED** · **UNVERIFIABLE**.

---

## 0. The position, in one paragraph

> The loop around the pipeline — recovery, evaluation, the LLM boundary, and the flag lifecycle — has gone from *"described"* to *"built, self-checking, and now exercised against Azure"*. Sixteen of seventeen R/S tasks are functionally complete; **five defects that would have destroyed or silently corrupted a live run were found and fixed**, two of them by the resume drill that was supposed to be a formality. The 2026-08-02 run **shipped** and every instrument built in the last three days returned a real number for the first time — including two that had never produced one at all. What did **not** change is the story: every behaviour lever is still flag-gated and default-OFF, so prose quality sits exactly where it did on 2026-07-31. **The architecture is materially better and the score is unmoved.** The remaining work is one paid measurement, one human read, and one act of authority.

*(Written 2026-08-02 before the run; revised the same day after it. §0b–§0i are the revisions; earlier
sections are left as written where a claim was superseded, with the correction stated in place —
editing a board's findings after the fact loses the evidence trail.)*

---

## 0b. THE RUN HAPPENED — 2026-08-02, `mystery-1785689662702`

**§3 was originally nine rows of "❌ never ran against Azure". Five of them are now ✅, and this is
where that came from.** One fresh run on the `LLM_HTTP_TRANSPORT=true` arm (transport only — mixing a second lever
would have confounded attribution). It **shipped**: release gate `passed`, 0 hard stops, 0 warnings,
14/14 phases, rubric 68 (raw 70), 15 clues, £0.75 reported.

**A three-call wire probe ran first**, for pennies, and settled what REVIEW_02 said only a run could:

| Question | Answer |
|---|---|
| Does the transport engage? | `transport: "http"` in the prompt log — and `azure-sdk` on the control call |
| Does `json_schema` reach Azure? | **yes** — `schemaSent: PRESENT`, reply `{"verdict":"yes","confidence":0.99}` |
| Is R8's cache metric real? | **yes** — identical 1,909-token prompt: `cached: 0`, then `cached: 1792` |
| Does the SDK path stay honest? | `cachedPromptTokens` **absent**, not 0 |

### What the full run measured

| Instrument | First real reading | Meaning |
|---|---|---|
| **Transport** | **49/56 calls `http`, 0 `azure-sdk`** | The other 7 are Anthropic polish calls, which carry no `transport` field — the split is exactly as designed |
| **`response_format` in the log** | present on all 49 | FLAG-AUDIT's verification rule now has a field to read. It never had one before |
| **`cachedPromptTokens`** (R8) | **18 cache hits, 134,144 cached prompt tokens** — Ch3 alone `24,521 prompt → 23,680 cached` (96.6%) | Automatic caching was **already** paying, invisibly, on every run this project has ever done. `AGENT9_PROMPT_PREFIX_ORDER` now has a baseline to beat rather than a metric to invent |
| **`deterministic_clearance_paste_count`** (A_71 §3) | **0** — and `paste_suspects: []` | A_71 wrote *"until that count comes back from a run, no lift figure for this lever should be quoted."* It came back. The clearance injector did not fire once |
| **Red herrings** (A_71 §4) | **2**, with the floor's regen visible in warnings (`1 red herring(s) overlap true-solution signals; regenerating`) | The 07-27 run produced **0**. The floor works on live data |
| **Report finalization** (A_71 §1) | `run_outcome: passed` · `phase_thresholds_met: true` · **14 phases incl. Prose Generation** · `release_gate_outcome.shipped: true` · no `in_progress` | The invariant fix holds end-to-end. This is a fully finalized report, which 7 of 9 on disk were not |
| **Judge identity** (R1/A_71 §7) | `judge_model: gpt-4.1-mini` · `judge_model_explicit: true` · `judge_model_source: RUBRIC_JUDGE_MODEL` | The judge names itself and reports that the choice was explicit, not inherited |
| **Content-filter refusals** (A_71 §5) | 0 — no warning fired (its condition is `total > 0`) | The 07-27 run took 10 |
| **`entity_pronoun_drift_count`** (A_71 §6) | **10** | Fourth post-boundary figure: 6, 19, 27, **10**. Still nonzero, still variable, n=4 |
| **t=0 flag preflight** | Emitted its cross-transport warning onto the run record | The guard is live and non-fatal on a valid config |

**Caps this run:** mechanism-explained-too-early (×2 → `plot_structure ≤ 6`, `pacing ≤ 6`) and
dual-value-no-contrast (→ `clues ≤ 6`). Both have built, default-OFF regen levers
(`AGENT9_REGEN_MECHANISM`, `AGENT9_REGEN_DUAL_VALUE`) — this run is evidence for probing them, not
for promoting them.

**What this run does NOT establish.** It is n=1 on a new transport. It says the transport works and
the instruments read; it says nothing about prose quality relative to the SDK arm, and 68 is one
sample from a distribution whose spread is ~13 points. Cross-transport A/B comparisons are flagged in
the run's own warnings for exactly this reason.

---

## 0c–0i. The rest of §6, worked

### 0e. R7 — five of the six pairs already existed

The corpus had never been mined for internal/external pairs. Five are recoverable **with
provenance**, and are now in `eval/results/external-read/manifest.json`: the four S0 reads
(ledger §1: 59/75, 66/69, 60/73, 70/76) and probe #1 (`7cda7440` internal 69 + `034f7972` external
78). `npm run eval:calibrate` **refuses at n=5**, which is the instrument working as designed.

**One more external read completes R7.** Two cautions for whoever does it: the S0 internals are
*capped* totals, so part of any disagreement measures cap policy rather than judgement; and the read
must be independent — an LLM read substituted for the ChatGPT reference would change the referent the
73.25 target is defined against, so I did not supply one.

### 0f. ADRs — prepared, not ratified

An agent cannot ratify. What it can do is remove every reason the owner would have to reconstruct
context: **ADR-0012** now records the transport decision with its reversal condition; **ADR-0003**
gained a scope boundary (the t=0 abort does not violate never-abort — *never abort a story that could
still ship; always abort a run that cannot*); and `decisions/README.md` carries a **per-record
ratification checklist** naming the one thing only the owner can confirm for each. Read two sections
per ADR, answer accept / correct / reject.

### 0g. The 39 flags — evidenced, and the finding is the same one this register opened with

All 39 resolved to their **default when unset**, by reading each resolution line. **Eight are active
in every run with nothing in `.env.local` recording it** — `AGENT4_GRACEFUL_DEGRADE`,
`AGENT5_DERIVE_SHADOW`, `AGENT5_RED_HERRING_FLOOR`, `AGENT5_STRICT_PROMPT_CONTRACTS`,
`AGENT7_MECHANISM_GATE`, `AGENT7_SCHEDULER_SHADOW` (all ON), `NOVELTY_SKELETON_JUDGE` and
`RUBRIC_SCORING_MODE` (shadow). FLAG-AUDIT opens by making exactly this correction about four
`AGENT9_*` flags; the same defect was twice as large upstream and undocumented.

**All eight are now written into `.env.local` at their current values.** That changes no behaviour —
it makes a run's behaviour reconstructable from its configuration, which is what every A/B assumes.
Promote/delete/defer verdicts still need each agent's owner (FLAG-AUDIT Addendum 5).

### 0h. S4 — two tranches, mechanically verified

`agent9-run.ts` **7,082 → 6,814**. Extracted: [`agent9/flags.ts`](../apps/worker/src/jobs/agents/agent9/flags.ts)
(the whole lever surface, 17 runtime getters — which is what makes `flags:check` and FLAG-AUDIT
enumerable) and [`agent9/prose-text.ts`](../apps/worker/src/jobs/agents/agent9/prose-text.ts) (pure
string sanitation). Exported symbols are re-exported from `agent9-run.ts`, so no import path moved.
The compiler caught the one missed dependency (`normalizeWrappedParagraphText`) immediately — which
is the argument for doing this in typed tranches rather than one sweep.

**Not attempted, deliberately:** the generate/ship/report seam *inside* `runAgent9`. That function is
~3,500 lines and splitting it means threading ~100 closure variables; the remaining helper groups
(temporal checks, deterministic injectors, pronoun/continuity, gate classifiers) are mechanical and
each needs its own typecheck-and-suite cycle. S6 stays sequenced after that.

### 0j. S6 — "unblocked" was wrong, and the blocker was mis-stated

REVIEW_01 §5.7 recorded removing two back-edges (`world-state.ts`, `story-bible.ts`) and concluded
*"the extraction is now a mechanical move."* Both halves of that need correcting.

**A third back-edge was still there.** `story-contract.ts:9` imported `MacroArcEntry` from
`./agent9-prose.js`. **Now removed** — it reads from the leaf `types/macro-arc.ts`, like the other
two. Typecheck clean. The direction is finally what the earlier board said it already was.

**And removing it does not make the extraction mechanical, because the back-edges were never the
binding constraint.** MEASURED today:

| | |
|---|---|
| Files in `agent9-prose/` | **27** |
| Imports **from** `agent9-prose/` **into** the package root | **61 sites across 16 distinct modules** — `agent5-clues`, `agent2-cast`, `agent7-narrative`, `story-bible`, `retry-protocol`, `asset-library`, `types/narrative-state`, `constants/arc-position`, … |
| `index.ts` re-exports of `agent9-prose` symbols | **6**, including `generateProse` — i.e. the package's public API |

Extracting `agent9-prose/` as `@cml/agent9-prose` makes it depend on `@cml/prompts-llm` for those 16
modules, while `@cml/prompts-llm` keeps exporting `generateProse` from it. **That is a package cycle
— the exact thing REVIEW_01 said had been broken.** Removing back-edges made `agent9-prose` a
non-cyclic *directory*; it did not make it a *leaf*, and only a leaf can be extracted.

**The two honest options, neither of which is a day's work:**

1. **Move the 16 dependencies with it** — at which point the extracted package is most of
   `prompts-llm`, and the honest name for the task is "split prompts-llm", not "extract agent9-prose".
2. **Extract the shared types/data into a third leaf package** (`@cml/prose-contracts`) that both
   depend on, then extract `agent9-prose` above it. Correct, and strictly larger than option 1's
   framing suggests.

**S6 stays `todo` with a corrected blocker: not "sequenced after S4" but "requires a decision between
those two shapes."** That decision is the owner's, and it should be made against what the boundary is
*for* — nobody has yet stated what breaks today because `agent9-prose` is a directory rather than a
package.

### 0k. S7 — its unblocker did not fire, on a run where it should have

S7's exit condition is R4's coercion counters reading zero across real runs. **The run produced no
counters at all.** MEASURED, four ways:

- `result.warnings` (30 entries) — no `[R4]`
- the report's `run_warnings` diagnostic (29 entries) — no `[R4]`
- no `agent7_coercion` diagnostic on the report
- no `R4` string anywhere in `logs/`

…on a run where `runAgent7` demonstrably completed (Agent-7 LLM calls in the prompt log, an outline
produced, `ctx.narrative` set, the run shipped). The emitter is **sound in isolation** — invoked
directly against the built `dist`, it pushes
`[R4] agent7 coercion telemetry: structured_output=false firings=0 …` — and its call site is
unconditional, three lines above `ctx.narrative = narrative`, with no early return or `try` between
(verified in the *dist*, not the source).

**So the counter exists, works when called, sits on the executed path, and produced nothing.** The
gap between the call and the artifact is unexplained and is the next thing to find.

This is worth stating in the counter's own words. Its header reads:

> *"Emitted even when every count is ZERO. A zero that is never written is indistinguishable from a
> telemetry path that never ran — which is precisely the defect class this counter exists to detect."*

It was not written, and here we are unable to distinguish those two cases. **S7 is therefore blocked
on a measurement defect, not on a missing run** — the A_70 class exactly, in the instrument built to
prevent it. Running the `AGENT7_STRUCTURED_OUTPUT` arm before this is fixed would spend a run to
produce nothing readable.

### 0i. The resume drill found two defects, and the second is the serious one

Item 7 asked for a drill because R5 was unproven. It was worth doing.

1. **`artifact-store.ts` ignored `CML_JSON_DB_PATH`.** It resolved `<workspaceRoot>/data/store.json`
   unconditionally, while `.env.local` sets that variable — with a comment saying it exists "so the
   API uses the same store regardless of which working directory it is launched from." They point at
   the same file today, which is why nothing noticed. **The drill caught it because resume reported
   `prose` RESTORED from a store copy where I had deleted it — it had never opened the copy.** Point
   the config elsewhere and resume silently re-runs the whole pipeline at full cost, looking exactly
   like "the artifacts were never persisted." Now honours the variable.
2. **Canary runs were never resumable at all.** `canary-core.mjs` called `generateMystery` with a
   progress callback and **no `onArtifact`** — so nothing reached the store. R5 reads artifacts the
   API writes; every £1.50 batch run on this project goes through the canary path instead. The losses
   `resume-hydration.ts` cites in its own header — "a hung socket, a Windows process abort
   (0xC0000409), a laptop entering standby" — were all canary runs. **The capability existed and the
   runs that needed it could not use it**, one callback away. Now persisted, with failures swallowed
   so persistence can never abort a healthy run.

The dry drill on an API project restores all 13 stages and correctly refuses when there is nothing to
resume. **A real kill-and-resume on a canary run is now possible and has not been done** — it needs a
run to kill.

---

## 1. Scoreboard — three readings of the same tasks

Four columns, because a task can be complete in code and unproven in production — and this project
has been caught by exactly that gap twice. **"Verified live"** means the 2026-08-02 run produced the
evidence, not that the code compiles.

| ID | Task | REVIEW_01 | REVIEW_02 audit | **Status** | **Verified live?** |
|---|---|---|---|---|---|
| R1 | Pin the rubric judge model | done | ✅ done | ✅ **done** | ✅ `judge_model_source: RUBRIC_JUDGE_MODEL` on the report |
| R2 | Agent 2c undefined-narrative read | done | ✅ done | ✅ **done** | ✅ ran clean in-pipeline |
| R3 | `json_schema` in the client | done | ❌ **non-functional** | ✅ **done** | ✅ wire probe: schema sent, schema-valid reply |
| R4 | Structured outputs on Agent 7 | done | ❌ **non-functional** | ✅ **done** | ◑ transport proven; the **Agent-7 arm** is still unprobed |
| R5 | Production resume | done | ✅ done, 1 defect | ✅ **done** | ◑ dry drill passed; **2 defects found** (§0i); no live kill-resume yet |
| R6 | Golden-set eval harness | done | ✅ done | ✅ **done** | ❌ dry only — baseline held (owner) |
| R7 | Calibrate the judge | todo 👤 | todo 👤 | ◑ **instrument + 5/6 pairs** | ❌ needs one more cold read |
| R8 | Prefix-order Agent 9 prompts | done | ⚠️ probe impossible | ✅ **done** | ✅ **134,144 cached tokens measured**; the flag's own A/B still owed |
| R9 | Parallelise 2b/2c/2d | done | ⚠️ done, 1 defect | ✅ **done** | ❌ flag default-OFF; unprobed |
| R10 | Write the ADRs | done | ✅ done | ✅ **done + 0012** | 👤 ratification checklist ready |
| S1 | Flag audit | done | ⚠️ incomplete sweep | ✅ **done + extended** | ✅ `flags:check` **clean**; 39 documented, 8 defaults made explicit |
| S2 | Delete `@cml/utils` | done | ⚠️ not in the lock | ✅ **done** | ✅ lock pruned, 14 dists |
| S3 | Regen pass registry | done | ✅ done | ✅ **done** | ✅ ran in-pipeline |
| S4 | Split `agent9-run.ts` | todo | todo | ◑ **2 tranches** — 7,082 → 6,814 | ✅ typecheck + 6 suites green |
| S5 | Merge `enforceMonthSeasonLock*` | done | ✅ done | ✅ **done** | ✅ |
| S6 | Extract `agent9-prose/` | todo | todo, "unblocked" | ⬜ **todo — blocker corrected** | ❌ **not** mechanical: 61 forward edges over 16 modules; 3rd back-edge found + removed (§0j) |
| S7 | Retire dead coercion sites | todo | 🔒 blocked | 🔒 **blocked — on a defect, not a run** | ❌ the R4 counters **did not emit** on a run that reached their call site (§0k) |

**16 / 17 functionally complete; 10 now carry live evidence.** The gap between those two numbers is
the honest state of this architecture: built and green is not the same as observed working, and the
column on the right is the one that has caught every expensive defect on the last four boards —
including, today, both of the two tasks that looked like simple scheduling.

**Neither S6 nor S7 was waiting on effort.** S6 was recorded as "unblocked, sequenced after S4" and is
actually blocked on an unmade architectural decision; S7 was recorded as "needs a live run" and is
actually blocked on a counter that does not reach any artifact. Both were re-derived from the code and
the run rather than from the board — which is the only reason either is now stated correctly.

---

## 2. What actually changed, by capability

Task IDs are how the work was tracked; capabilities are what the system gained.

### 2.1 The LLM boundary — the layer that had no instrument at all

This is where both audits found their worst defects, and it is the biggest change.

- **[`azure-http-transport.ts`](../packages/llm-client/src/azure-http-transport.ts)** — a direct POST to the deployment, behind `LLM_HTTP_TRANSPORT` (default OFF). It exists because `@azure/openai@1.0.0-beta.13` rebuilds `response_format` as `{type}` only, discarding any `json_schema` payload. **No new vendor dependency was taken:** retry, circuit breaker, rate limiting, deadline, cost accounting and content-filter tallying already live in our client, so the SDK was contributing an auth header and the defective serializer.
- **`response_format` and `transport` are now in `llm-prompts-full.jsonl`.** FLAG-AUDIT's rule — *"a flag is verified only by finding its effect in the log"* — was inapplicable to structured outputs because the field appeared nowhere in the log.
- **`cachedPromptTokens`** parsed from `usage.prompt_tokens_details`. On the SDK path it is **absent, not zero** — "not reported" must never render as "no cache hit".
- **[`flag-preflight.ts`](../apps/worker/src/jobs/flag-preflight.ts)** — an impossible flag combination now aborts at t=0 instead of taking a non-retryable 400 at stage 13 with ~£1.40 committed. It **throws rather than degrading**, because a silent fallback would let a probe report "flag ON" while running the control arm.

### 2.2 Durable execution

- Resume restores a **contiguous prefix** only, and names every derived signal it could not restore (`signals_unavailable`, `gates_fully_evaluated`), so a resumed run cannot be mistaken for equivalent evidence.
- `ResumeSkipTracker.selectPending()` extends that decision to a **concurrent** group — the fix for R9 bypassing the gate entirely.
- Known limitation, unchanged: the CLI does not write regenerated stages back to `data/store.json` (the API owns that writer), so a resumed run is not itself resumable.

### 2.3 Measurement

- **`npm run eval`** — replay 4 frozen bundles, rubric-score, diff against a baseline. Prints its own two limits on every scored run: the −9.5 internal bias, and that a frozen bundle cannot measure upstream craft.
- **`npm run eval:calibrate`** — R7's instrument. Leads with **decision agreement** (does the judge *order* stories as the reader does?) rather than absolute agreement, which a constant bias destroys. Refuses a verdict below 6 labelled pairs.
- **`npm run flags:check`** — compares *code reads · config sets · register documents*. Gates on the expensive class.

### 2.4 Simplification and hygiene

Regen pass registry with a drift test · `@cml/utils` gone from source **and** lockfile · dead `rewrite` model tier removed and `generate` wired · `AGENT9_PROSE_BATCH_SIZE` clamped to its documented limit · all six workspaces in `npm test` (they were three) · `resume-hydration.ts` no longer one letter from `resume-run.ts` · 26 doc links retargeted.

---

## 3. Built vs proven — the honest ledger

**This is the most important table in this document — and the 2026-08-02 run rewrote half of it.**
Everything in §2 is built and tested; the right-hand column is what an actual run says.

*(As first written, this column read "❌ never" on all nine rows. Five now carry live evidence. The
four that do not are the four whose flags are still OFF — which is the correct reason to be unproven,
and a different thing from having no way to find out.)*

| Capability | Built | Unit-tested | **Against Azure** |
|---|---|---|---|
| Wire-capable transport | ✅ | ✅ 18 | ✅ **49/56 calls, 0 errors, whole pipeline** |
| `json_schema` reaching the API | ✅ | ✅ | ✅ **probe: schema sent, schema-valid reply** |
| Cached-token metric (R8) | ✅ | ✅ | ✅ **18 hits, 134,144 tokens** |
| `response_format` in the prompt log | ✅ | ✅ | ✅ present on all 49 http calls |
| Red-herring floor (A_71) | ✅ | ✅ | ✅ **2 red herrings + regen fired** (07-27 shipped 0) |
| Report finalization (A_71 §1) | ✅ | ✅ 7 | ✅ **14 phases, `shipped: true`, no `in_progress`** |
| Structured outputs on Agent 7 | ✅ | ✅ | ❌ flag OFF — the arm is the next probe |
| Prompt prefix ordering | ✅ | ✅ | ❌ flag OFF — but now has a **baseline to beat** |
| Parallel profile agents | ✅ | ✅ | ❌ flag OFF |
| Regen edit-list / batch size | ✅ | ✅ | ❌ flag OFF |
| Production resume | ✅ | ✅ | ◑ **dry drill passed, 2 defects found** (§0i); no live kill-resume |
| Eval harness | ✅ | ✅ dry | ❌ baseline **held by the owner** |
| Judge calibration | ✅ | ✅ 8 | ◑ **5 of 6 pairs assembled**; refuses to verdict at n=5 |

**The row that was called out as different behaved exactly as predicted.** `AGENT5_RED_HERRING_FLOOR`
is an off-*switch*, so it was the one piece of new behaviour a fresh run would exercise unasked — and
it did: 2 red herrings where the 07-27 run produced 0, with the bounded regeneration visible in the
warnings. Predicted and confirmed is the strongest form this table can take.

**What "unit-tested" is now worth.** REVIEW_02's finding was twelve green tests sitting on a schema
the SDK silently discarded. The tests added since assert the **serialized request body** — and the
wire probe then confirmed that body is what Azure actually accepts. That chain is now closed for the
transport. It is still open for everything with an OFF flag: green means the code does what we think,
and only an arm says the endpoint and the prose agree.

---

## 4. The instruments, and what each can and cannot tell you

| Command | Answers | Cannot answer |
|---|---|---|
| `npm run build:all` + `preflight-dist-check` | is the worker running the code I just wrote? | anything about behaviour |
| `npm test` (6 suites, 2,166 tests) | did I break a contract the code declares? | whether the contract matches the vendor's |
| `npm run eval:dry` | does the replay harness assemble every bundle? | any quality question — no LLM calls |
| `npm run eval` / `eval:baseline` | did the **internal judge's** view of prose move? | whether the **external** score moved (bias −9.5, spread 13) |
| `npm run eval:calibrate` | can internal deltas be trusted as direction? | anything, until 6+ stories are labelled |
| `npm run flags:check` | is a flag configured-but-unread, or read-but-unregistered? | whether a read flag is **reachable** — see below |
| `npm run resume <projectId>` | can a dead run be continued from disk? | still untested against a **real** crash |
| `npm run eval:external` → `eval:calibrate` | does the judge's ORDER match a reader's? | nothing yet — one read short of a verdict |

**Status 2026-08-02:** `flags:check` reports **clean** in both directions (76 read · 28 configured ·
79 registered), so `--strict` can be adopted as a pre-merge gate whenever you want it.

**The gap `flags:check` cannot close, stated plainly:** `AGENT9_MODEL_REGEN` was read by `resolveStageModel("regen", …)` — a function with **zero call sites**. It would pass this check. Reachability is settled by one thing only, and it is the rule FLAG-AUDIT already states: find the flag's effect in `llm-prompts-full.jsonl` on a real run.

---

## 5. Corrections to the earlier boards

Recorded because both were used to plan, and one still is.

- **REVIEW_01's tracker read 13/17.** By capability it was 11/17 — R3 and R4 could not function. Now 16/17, of which 10 carry live evidence (§1).
- **S4's stated size is wrong, and it is the figure anyone would plan from.** REVIEW_01 reads *"6,512 lines today (was 7,078)"*, implying S3 removed ~566 lines from `agent9-run.ts`. MEASURED across the commit range: `fb73aeb0` 6,936 → `4d94f686` 7,043 → `3d0dd9fd` **7,078** → `e2073a44` **7,050** → today **7,082**. The file never measured 6,512; that number is approximately its *non-blank* count (6,549 at `e2073a44`), so the cell **mixes two counting methods** and reads as a 20× larger reduction than the 28 lines actually removed. **S3 did not shrink this file** — it removed twelve wrapper bodies in `prompts-llm`, which was never the same file. S4 is a ~7,100-line job, not a ~6,500-line one.
- **FLAG-AUDIT's register was 33 flags because it scoped itself to `AGENT9_*`.** The real inventory of behaviour flags is 76; 39 are unregistered (Addendum 4).

---

## 6. What remains

Ordered by what unblocks the most. **Nothing here is blocked on code.**

| # | Item | Who | Cost | Status after 2026-08-02 |
|---|---|---|---|---|
| 1 | **One fresh run with `LLM_HTTP_TRANSPORT=true`** | owner | ~£1.50 | ✅ **DONE** — shipped, every instrument read (§0b) |
| 2 | **`npm run eval:baseline`** | owner | £4–8 | ⏸ **HELD** at the owner's instruction — the only item left that costs money |
| 3 | **R7 — 6+ cold reads** | 👤 human | ~2 h | ◑ **5 of 6 pairs assembled** from the corpus with provenance; needs **one** more read (§0e) |
| 4 | **Ratify the ADRs** | 👤 owner | ~1 h | ◑ **prepared** — ADR-0012 added, 0003 scoped, per-record ratification checklist written (§0f) |
| 5 | Verdict the 39 unregistered flags | agent owners | ~1 sitting each | ◑ **evidenced** — all 39 resolved to their defaults; **8 were live in every run, unconfigured**, now explicit (§0g) |
| 6a | S4 — split `agent9-run.ts` | agent | ~1 day | ◑ **two tranches done** — 7,082 → 6,814, typecheck + all suites green (§0h); 4 groups left |
| 6b | S6 — extract `agent9-prose/` | 👤 **owner decides shape** | 2–5 days | 🔒 **not mechanical** — 61 forward edges; needs a choice between "split prompts-llm" and "extract a third leaf package" (§0j) |
| 6c | S7 — retire dead coercion sites | agent | 1 h to diagnose | 🔒 **blocked on a telemetry defect** — the R4 counters did not emit on a run that reached them (§0k). Fix before spending a run on the arm |
| 7 | A kill-and-resume drill | agent + owner | one run | ✅ **DONE, and it found two defects** (§0i) |

**On S4 — the earlier caution, and what actually happened.** This section originally said the
helper-layer extraction was "not the seam REVIEW_01 named" and that shipping it as S4 would be scope
substitution. That still stands, and it is why §0h says *two tranches*, not *done*: the
generate/ship/report seam **inside** `runAgent9` is untouched, because splitting a ~3,500-line
function means threading ~100 closure variables past tests that would not catch a scope slip. What
was delivered is the helper layer, in typed tranches — and the compiler caught a missed dependency on
the second one, which is the argument for continuing that way rather than in one sweep.

**Remaining S4 groups**, each mechanical and each needing its own typecheck-and-suite cycle: temporal
checks · deterministic injectors · pronoun/continuity repairs · gate classifiers. S6 after those.

---

## 7. Does any of this move the score toward 80?

**No — and after two boards of remediation that answer deserves to be uncomfortable.**

| | |
|---|---|
| External (ChatGPT) mean | **73.25** — 6.75 short of 80 |
| Internal rubric | median 61–64 |
| Internal − external gap | **−9.5** (per-run −16 / −3 / −13 / −6) |
| Category floor | clues 5.31 · prose 5.44 · plot_structure 5.56 · pacing/ending 6.00 |
| **2026-08-02 run** | rubric **68** (raw 70), 3 caps, shipped — *n=1, and the distribution's spread is ~13* |
| Craft levers promoted in the last three days | **0** |

**The one run this board produced does not change the answer, and it would be easy to pretend
otherwise.** 68 is a single sample against a spread wider than the distance to the target; the run's
purpose was to prove the transport and read the instruments, and it did both. Its three caps —
mechanism-explained-too-early ×2 and dual-value-no-contrast — are craft signals with built,
default-OFF levers already waiting (`AGENT9_REGEN_MECHANISM`, `AGENT9_REGEN_DUAL_VALUE`). That is
evidence for **probing** them, not for promoting them.

The ledger's instruction — *"P5 (craft levers) is the critical path; do not spend more on
reliability"* — has now been overrun three times: by REVIEW_01's remediation, by REVIEW_02's audit of
it, and by this round's instruments. **That was defensible each time and stops being defensible
now.** Two of REVIEW_01's tasks were inert, and finding that out required the audit; the instruments
built since are what stop the next £4–8 being spent through a broken gauge. But the gauges are built
and, as of today, four of them have been read against a real run. **The next unit of work should
produce prose, not tooling.**

---

## 8. The through-line, across four boards

| Board | The rule it added |
|---|---|
| A_68 | A craft fix without a **detector** doesn't stick |
| A_70 | A detector without a verified **read path** is worse than no number |
| A_71 | A read path must be verified against **real data**, not the declared contract |
| REVIEW_02 | An **outbound** path must be verified against the **wire**, not the type system |
| **REVIEW_03** | **The instrument is not exempt from the rule it enforces** |

The last one was earned twice in a single afternoon. `flags:check` v1 understood only `process.env.X` and declared `AGENT9_MODEL_GENERATE` unread — it resolves through `process.env[ENV_BY_STAGE[stage]]` — so a checker blind to indirection would have sent someone to delete a live config line. Adding string-literal matching then invented seven flags out of `console.log("AGENT5_FAILURE_CLASS", …)`. Both were caught by running the tool and *reading its output against the code*, which is the same move that found every defect on the last three boards.

There is a version of this project that keeps building better instruments forever. The instruments are now good enough. What they are pointed at is 6.75 points short.

---

## 9. Verification log

Re-run on 2026-08-02 **after** the pipeline run and the S4 tranches, against
`redesign/agent-blue-sky`, 54 modified/new paths uncommitted:

```
npm run build:all                    ✅ 15 packages
node scripts/preflight-dist-check    ✅ 14 buildable packages — all dists current
npm test                             ✅ api 27 · worker 431 · web 174 · llm-client 96
                                        prompts-llm 1008 (+7 skipped) · story-validation 430
npm run test:eval-calibrate          ✅ 8
npm run eval:dry                     ✅ 4/4 bundles assembled a context
npm run flags:check                  ✅ CLEAN both ways — 76 read · 28 configured · 79 registered
npm run eval:calibrate               ⛔ refuses at n=5 (by design; needs 6)
```

**Live, against Azure:**

```
transport wire probe                 ✅ 3 calls — http engaged, json_schema accepted, cache reported
canary run mystery-1785689662702     ✅ SHIPPED — gate passed, 14/14 phases, rubric 68 (raw 70)
                                        49/56 calls http · 134,144 cached prompt tokens
                                        clearance pastes 0 · red herrings 2 · refusals 0
resume dry drill (API project)       ✅ 13 stages restored; correctly refuses a complete run
resume drill (crash-at-Agent-9 sim)  ⛔ EXPOSED 2 defects — both fixed (§0i)
```

**2,166 unit tests + 8 script tests.** 39 are new since 2026-07-31: 18 on the wire, 13 on the t=0
guard and concurrent resume, 8 on calibration.

Line counts and commit-range figures in §5 were taken with `git show <commit>:<path> | wc -l`; every
run figure above was read from `logs/llm-prompts-full.jsonl`, `logs/llm.jsonl` or
`apps/api/data/reports/mystery-1785689662702/`, never from a prior document.
