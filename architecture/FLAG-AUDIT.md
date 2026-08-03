# Agent 9 flag audit — S1

**Date:** 2026-08-01 · **Scope:** all 33 `AGENT9_*` environment flags referenced in source (tests excluded).
**Task:** [REVIEW_01.md §5.7 S1](REVIEW_01.md#57-simplification-tasks) — classify every flag as **promote**, **delete**, or **defer with a named blocker**.

---

## Correction to REVIEW §5.1

The review stated *"33 flags, 19 unset — every unset flag guards a branch that ships but has never run."* **That is wrong, and the audit is why it was worth doing.**

`unset` is not the same as `off`. Four flags are **default-ON**, so an unset value means the code is **live in every run**:

| Flag | Default when unset | Reality |
|---|---|---|
| `AGENT9_MUTATION_REVALIDATION` | `true` | Active on every run |
| `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | `true` (`!== "false"`) | Active — A_71 promoted it |
| `AGENT9_REDESIGN_V1` | `true` | Active on every run |
| `AGENT9_REGEN_PRONOUN` | `true` | Active on every run |

**Corrected picture:** 14 explicitly set · 4 unset-but-active · 15 genuinely dormant or mode-valued.

The dormant figure is **15, not 19** — and more importantly, four flags the review implied were untested are in fact the ones running in production with *no explicit configuration recording that choice*. That is the more interesting risk: a default-ON flag is invisible in `.env.local`, so the run's actual behaviour is not reconstructable from config alone.

A second correction: the review called `AGENT9_MODEL_POLISH` "superseded by `AGENT9_POLISH_PROVIDER`". It is not. They are **orthogonal axes** — `POLISH_PROVIDER` selects Azure vs Anthropic; `MODEL_POLISH` selects the Azure *tier* when the provider is Azure. Both are live.

---

## Register

**Legend.** `PROMOTE` — make the default, delete the flag · `DELETE` — remove flag and code · `DEFER` — keep, with a named blocker · `CONFIG` — not a behaviour lever (model/threshold selection), exempt from the lifecycle.

| Flag | State | Verdict | Evidence / blocker |
|---|---|---|---|
| `AGENT9_BIBLE_AUTHORITATIVE` | SET on | **PROMOTE** | A_61 RC-2 lever, on since 2026-07-03, ~13 boards without regression. Default is still `false` — the code's default contradicts production |
| `AGENT9_REGEN_CLUE` | SET on | **PROMOTE** | On since 2026-07-03, stable |
| `AGENT9_REGEN_SCAFFOLD` | SET on | **PROMOTE** | Already default-ON in code; the `.env.local` entry is redundant |
| `AGENT9_WALKON_REPAIR` | SET on | **PROMOTE** | Phase A floor lever, on since 2026-07-11 |
| `AGENT9_REGEN_TRANSITION` | SET on | **PROMOTE** | Phase A floor lever, on since 2026-07-11 |
| `AGENT9_CRITIQUE_REWRITE` | SET **off** | **DELETE** | **Probe complete, verdict negative.** A_63 P5.1, 4 matched fresh pairs: prose −1.00, rubric total −2.0. Off in config *and* in code default. 247 lines of dead code |
| `AGENT9_MODEL_CRITIQUE` | SET | **DELETE** | Only consumer is the critique-rewrite pass being deleted above |
| `AGENT9_REGEN_RESOLUTION` | SET on | **DEFER** | Phase B lever, flipped 2026-07-12; per-lever attribution never run |
| `AGENT9_REGEN_CULPRIT_EVIDENCE` | SET on | **DEFER** | Same Phase B batch — four levers flipped together, attribution outstanding |
| `AGENT9_REGEN_MECHANISM` | SET on | **DEFER** | Same Phase B batch |
| `AGENT9_REGEN_LOCKED_FACT` | SET on | **DEFER** | Ledger Item 15, on since 2026-07-14; no isolated probe |
| `AGENT9_REGEN_SUSPECT_ELIM` | SET on | **DEFER** | A_71 probe in flight. Blocker: `deterministic_clearance_paste_count` has not come back from a run yet |
| `AGENT9_POLISH_PROVIDER` | SET anthropic | **DEFER** | A_71, never A/B'd against the Azure path. Blocker: R6 |
| `AGENT9_MUTATION_REVALIDATION` | unset → **ON** | **PROMOTE** | Default-ON and never disabled. Make it explicit or drop the flag |
| `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | unset → **ON** | **PROMOTE** | A_71 promoted to default-ON with measured evidence (8 and 6 calls, rollback-guarded, no errors) |
| `AGENT9_REDESIGN_V1` | unset → **ON** | **PROMOTE** | Migration switch whose migration is complete. Nothing sets it to `false` anywhere |
| `AGENT9_REGEN_PRONOUN` | unset → **ON** | **PROMOTE** | Default-ON since the A_66 pronoun work; no off-path in use |
| `AGENT9_FULLSTORY_POLISH` | unset → off | **DEFER** | A_70 §8.2 proved the phrase path never executed; fixed 07-27 but **never re-probed**. Blocker: R6 |
| `AGENT9_FULLSTORY_DIAGNOSTIC` | unset → `off` | **DEFER** | Mode-valued (`off`/`shadow`/`apply`). Blocker: needs ≥3 shadow runs before `apply` |
| `AGENT9_AFTERMATH_FINAL_SIGNAL_FALLBACK` | unset → off | **DEFER** | A_68 FIX C. Blocker: pairs with `FOLD_SUSPECT_CLEARANCES`; needs zero-FP confirmation |
| `AGENT9_FOLD_SUSPECT_CLEARANCES` | unset → off | **DEFER** | A_67 FIX-1 Change C. Blocker: same probe as above |
| `AGENT9_POLISH_RETRIED_CHAPTERS` | unset → off | **DEFER** | A_68 §7.2. Blocker: R6 |
| `AGENT9_REGEN_DUAL_VALUE` | unset → off | **DEFER** | A_57 D2 family. Blocker: R6 |
| `AGENT9_REGEN_LEAKAGE` | unset → off | **DEFER** | A_62 Item 17 — detector, validator and instruction all ship; wiring exists. Blocker: R6 |
| `AGENT9_REVEAL_CITES_PLANTS` | unset → off | **DEFER** | A_67 FIX-3, designed and partly built. Blocker: R6 |
| `AGENT9_GROUNDING_LEAD` | unset → off | **DEFER** | Blocker: R6 |
| `AGENT9_BIBLE_GATES_BLOCKING` | unset → off | **DEFER** | **Deliberately held off** — blocking would make a residual unsound case abort, opposite of the ship-rate goal. Documented in `.env.local`. Keep as a documented non-goal |
| `AGENT9_VOICE_ENFORCE` | unset → `off` | **DEFER** | Mode-valued. Blocker: R6 |
| `AGENT9_MODEL_GENERATE` | SET | `CONFIG` | Model selection, not a behaviour lever |
| `AGENT9_MODEL_REWRITE` | SET | `CONFIG` | ” |
| `AGENT9_MODEL_REGEN` | SET | `CONFIG` | ” |
| `AGENT9_MODEL_POLISH` | unset | `CONFIG` | Azure polish tier. **Not** superseded by `POLISH_PROVIDER` — orthogonal axis |
| `AGENT9_POLISH_ANTHROPIC_MODEL` | unset | `CONFIG` | Anthropic model override; defaults to the client default |
| `AGENT9_PROMPT_TOKEN_CEILING` | unset | `CONFIG` | Numeric bound, not a branch |

**Totals:** 8 PROMOTE · 2 DELETE · 17 DEFER · 6 CONFIG.

---

## Addendum — flags created by the REVIEW_01.md remediation work (2026-08-01)

Registered at creation, per the lifecycle rule this document establishes. All three are default-OFF,
runtime-read, and unprobed; all three name the same blocker, which is now **built** (`npm run eval`)
rather than merely wished for.

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `AGENT7_STRUCTURED_OUTPUT` | unset → off | **DEFER** | R4: one run per arm, same premise. Promote when the flag-ON arm holds the `[R4]` coercion counters at zero with schema-valid outlines. Those counters are also the gate on S7 — no coercion site may be deleted until its counter reads zero across several runs |
| `AGENT_PROFILES_PARALLEL` | unset → off | **DEFER** | R9: same premise, sequential vs parallel; the three profile artifacts must be **byte-identical**. A difference means shared state, not a speedup — stop rather than accept it |
| `AGENT9_PROMPT_PREFIX_ORDER` | unset → off | **DEFER** | R8: cached prompt tokens rising from chapter 2 onward, with prose materially unchanged. Block order does influence the model, so a visible prose shift makes this a behaviour change, not an optimisation. **Precondition, added 2026-08-02: `LLM_HTTP_TRANSPORT=true`.** The metric this probe is defined against did not exist in any log — the beta SDK's `CompletionsUsage` has three fields and no `prompt_tokens_details`, so "cached tokens rising" was unobservable (REVIEW_02 §2.2). It is now read and logged as `cachedPromptTokens`, but only on the http transport; on the SDK path it is ABSENT rather than 0, so a run cannot mistake "not reported" for "no cache hit" |

**What happens if the probes never run.** Stated deliberately, because "flag with no exit condition"
is the failure this register exists to prevent:

- `AGENT7_STRUCTURED_OUTPUT` off → the coercion layer stays and S7 stays blocked. Safe.
- `AGENT_PROFILES_PARALLEL` off → runs stay a few minutes slower. No correctness cost.
- `AGENT9_PROMPT_PREFIX_ORDER` off → we keep paying full prompt price on every retry and regen. Cost
  only.

None of the three is load-bearing for correctness, which is the right shape for a flag whose probe
may be deferred indefinitely.

**Revised totals including the addendum:** 8 PROMOTE · 2 DELETE · **20 DEFER** · 6 CONFIG.

---

## Addendum 2 — Agent 9 cost levers (2026-08-01)

Added after a cost audit of run `mystery-1785521869768` (Agent 9 = £0.947 of £0.978). The diagnosis:
generation sends **22,292 prompt tokens to produce 1,913 completion tokens** per chapter, and roughly
two thirds of that prompt is identical for every chapter in the run.

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `AGENT9_REGEN_EDIT_LIST` | unset → off | **DEFER** | Regen returns only changed paragraphs. Saves ~£0.14/run; the stronger argument is safety — untouched paragraphs are spliced from the source and cannot drift, closing the `repair.ts:153` re-gendering class by construction. Probe: regen success rate not below the flag-off arm |
| `AGENT9_PROSE_BATCH_SIZE` | unset → 1 | **DEFER** | Chapters per generation call. 2 saves ~£0.11/run. **Hard limit: 2** — a chapter is ~1,913 completion tokens against a 4,000 `maxTokens`. Retries are per batch, so a high retry rate erodes the saving. Probe: cost down, chapter validator pass-rate flat |

### `AGENT9_MODEL_REGEN` — reclassified from CONFIG to **BUG (fixed)**

The register above listed it as `CONFIG` — "model selection, not a behaviour lever". That was wrong
in a way worth recording: it was set to `gpt-4.1-mini` in `.env.local` and **read by nothing**. All
ten `makeRegenFn` call sites in `agent9-run.ts` passed `proseDeployment` directly, so
`resolveStageModel("regen", …)` was never consulted and every regen ran on the premium deployment —
11 calls, £0.150, against ~£0.030 at the configured tier.

Now wired. Resolution is unchanged when the var is unset; setting it is what takes effect.

**This is the third instance of the same defect shape in this document** — after `AGENT9_FULLSTORY_POLISH`'s
phrase path (A_70 §8.2) and `AGENT9_CRITIQUE_REWRITE` being ON in config while its A/B assumed
otherwise. The lesson has been stated before and is restated here because it keeps recurring:
**a flag is not verified by reading the code that declares it — only by finding its effect in
`llm-prompts-full.jsonl`.** This one was caught exactly that way: the log showed
`Agent9-Regen-*` calls on `gpt-4.1`.

---

## Executed in this pass

**DELETE — `AGENT9_CRITIQUE_REWRITE` + `AGENT9_MODEL_CRITIQUE`.** The only entry with a completed probe and a negative verdict, recorded by the owner in `.env.local`: *"MEASURED 2026-07-19 (A_63 P5.1, 4 matched fresh pairs): targets flat (oh −0.50, dlg 0.00, pace 0.00), prose −1.00, rubric total −2.0 → OFF."* Off in config and in code default, so removal is a no-op at runtime.

**Not executed, deliberately:**

- **The 8 PROMOTEs are left alone.** Promoting means flipping a code default, which is a behaviour change on the flag-off path — exactly what the corpus regime says must be probed, not assumed. They are ready for R6 and should go as one batch once measurement is cheap.
- **All 17 DEFERs keep their flags.** Each now has a named blocker, and 11 of them resolve to the same one: **R6**. That is the strongest argument in this document for prioritising the eval harness — a single task unblocks two-thirds of the deferred backlog.

---

## Addendum 3 — the REVIEW_02 audit (2026-08-02)

The register above was written on 2026-08-01 and audited on 08-02 ([REVIEW_02 §2.3](REVIEW_02.md)).
**Two of its entries were wrong in the same way the document itself called "the third instance of
this defect"** — a configured model choice that no code reads.

| Flag | Was | Now | What changed |
|---|---|---|---|
| `AGENT9_MODEL_REWRITE` | `CONFIG` | **DELETED** | Its stage was the critique→rewrite pass this document deleted on 08-01. `resolveStageModel("rewrite", …)` had zero call sites; `.env.local` set it to `gpt-4.1` regardless. Stage, env var and doc comment removed together — a deleted pass must take its config surface with it |
| `AGENT9_MODEL_GENERATE` | `CONFIG` | **BUG (fixed)** | Same shape as `AGENT9_MODEL_REGEN`: set in `.env.local`, read by nothing. `resolveStageModel("generate", …)` had zero call sites and both `generateProse` calls took `proseDeployment` directly. Now wired at `agent9-run.ts`. The configured value equals `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE`, so behaviour is unchanged today — but the *most expensive stage in the pipeline* was not routable |

**Instance count for this defect shape is now five** (`AGENT9_FULLSTORY_POLISH`'s phrase path,
`AGENT9_CRITIQUE_REWRITE`, `AGENT9_MODEL_REGEN`, `AGENT9_MODEL_REWRITE`, `AGENT9_MODEL_GENERATE`) —
and instances #4 and #5 were sitting inside the sweep that declared #3 closed. **The generated
CI table proposed at the foot of this document is no longer a nice-to-have.** A grep for
`resolveStageModel("<stage>"` next to the stage table would have caught both in seconds.

### New flags registered at creation

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `LLM_HTTP_TRANSPORT` | unset → off | **DEFER** | REVIEW_02 §4.1 — chat calls bypass the `@azure/openai` SDK for a direct POST, because the SDK drops `json_schema` and cannot report `prompt_tokens_details`. Probe: one run per arm on a fixed premise; artifacts equivalent, no new error classes, and `cachedPromptTokens` present in the log. **It is the precondition for `AGENT7_STRUCTURED_OUTPUT` and for R8's real metric** — both were unrunnable without it |

**What happens if the probe never runs.** `LLM_HTTP_TRANSPORT` off → the pipeline keeps today's
transport, structured outputs stay refused at t=0 (loudly, not silently), and R8's cache metric stays
unreadable. Nothing regresses; two probes stay blocked. That is the same shape as the other three
addendum flags: not load-bearing for correctness.

### A correction to how this register is verified

Addendum 2 ended with: *"a flag is not verified by reading the code that declares it — only by
finding its effect in `llm-prompts-full.jsonl`."* **That rule could not be applied to
`AGENT7_STRUCTURED_OUTPUT`, because `response_format` was never written to that file.** The log
recorded messages, model, temperature and a prompt hash — everything except the field whose presence
was in question. The log now carries `responseFormat` and `transport` on every request, so the rule
has something to read.

---

## Addendum 4 — the check exists now, and it found a bigger register gap (2026-08-02)

This document's closing paragraph proposed *"a generated table: enumerate `AGENT9_*` from source,
resolve each default, diff against `.env.local`, and fail CI when a flag exists in neither the
register above nor the config."* REVIEW_02 §2.3 upgraded that from a nice-to-have to a requirement,
because the audit missed two instances of the defect it was auditing for. **It is built:**
`npm run flags:check` ([scripts/flag-register-check.mjs](../scripts/flag-register-check.mjs)).

It compares the three lists that have to agree — **what the code reads · what `.env.local` sets ·
what this register documents** — and reports two classes:

- **Set in config, read by no code** — a decision nobody honours. `AGENT9_MODEL_REGEN` / `_REWRITE` /
  `_GENERATE` were all this. **Gates immediately (exit 1); currently clean.**
- **Read by code, absent from this register** — a permanent branch with no exit condition. **39 of
  these exist.** Reported, not gated, until triaged; `--strict` turns it into a gate.

**Two heuristics were needed, and both were found the hard way.** A first pass that understood only
`process.env.X` reported `AGENT9_MODEL_GENERATE` as unread — it resolves through
`process.env[ENV_BY_STAGE[stage]]` — so a checker blind to indirection would have sent someone to
delete a live config line. Adding string-literal matching then produced seven phantoms from
`console.log("AGENT5_FAILURE_CLASS", …)` in the canary harness. The literal form is now consulted
only in files that actually index env dynamically, with `console.*` labels stripped. **An instrument
gets audited like anything else** — that is this document's own lesson applied to itself.

### The unregistered inventory

**This register only ever covered `AGENT9_*`.** Everything upstream — every gate, every retry budget,
every shadow mode on Agents 1 through 7 — has been running unregistered. Some are load-bearing
(`AGENT3B_PLAUSIBILITY_JUDGE`, `AGENT6_REVEAL_GATE`, `AGENT7_PLANT_BEFORE_REVEAL` are all SET in
`.env.local` today); several name a *mode* or a *retry ceiling* rather than a boolean lever.

| Group | Flags |
|---|---|
| **agent 1** | `AGENT1_PERIOD_KB_ENABLED` |
| **agent 2** | `AGENT2_CAST_CHECK` · `AGENT2_CONSTRAINED_CAST` |
| **agent 2B** | `AGENT2B_VOICE_CHECK` · `AGENT2B_VOICE_MAX_RETRIES` |
| **agent 2C** | `AGENT2C_SCENE_GATE` · `AGENT2C_SCENE_GATE_MAX_RETRIES` · `AGENT2C_SPINE_CHECK` |
| **agent 2E** | `AGENT2E_DERIVE_BACKGROUND` |
| **agent 3B** | `AGENT3B_PLAUSIBILITY_JUDGE` · `AGENT3B_PLAUSIBILITY_MAX_RETRIES` |
| **agent 4** | `AGENT4_GRACEFUL_DEGRADE` · `AGENT4_MAX_COST_USD` |
| **agent 5** | `AGENT5_DERIVE_SHADOW` · `AGENT5_ENABLE_LLM_RETRIES` · `AGENT5_RED_HERRING_FLOOR` · `AGENT5_STRICT_PROMPT_CONTRACTS` |
| **agent 6** | `AGENT6_BLIND_READER_BLOCKING` · `AGENT6_BLIND_READER_MAJORITY_K` · `AGENT6_DT_EVIDENCE_COMPLETENESS` · `AGENT6_REVEAL_GATE` |
| **agent 7** | `AGENT7_CLUE_JOB_AUTHORITY` · `AGENT7_DISCOVERY_TELL` · `AGENT7_MECHANISM_GATE` · `AGENT7_PLANT_BEFORE_REVEAL` · `AGENT7_SCHEDULER_AUTHORITATIVE` · `AGENT7_SCHEDULER_SHADOW` |
| **agent shared** | `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` · `AGENT_PRE9_ENABLE_LLM_RETRIES` |
| **novelty** | `NOVELTY_CROSS_RUN` · `NOVELTY_HARD_FAIL` · `NOVELTY_MODE` · `NOVELTY_SIMILARITY_THRESHOLD` · `NOVELTY_SKELETON_JUDGE` · `NOVELTY_SKELETON_MODEL` · `NOVELTY_SKIP` |
| **rubric** | `RUBRIC_JUDGE_MODEL` · `RUBRIC_SCORING_MODE` · `RUBRIC_STRUCTURAL_CAPS_A68` |

**Verdicts are not assigned from a code read** — that would be a register entry that looks like
evidence and is really a guess. What a code read CAN establish is each flag's **default when unset**,
and that is the fact this register's opening correction says matters most. Addendum 5 does exactly
that, and it found the same defect upstream.

---

## Addendum 5 — the unregistered 39, resolved to their defaults (2026-08-02)

**This document opens with a correction that turned out to be the most important thing in it:**
*"`unset` is not the same as `off`. Four flags are default-ON, so an unset value means the code is
**live in every run** … a default-ON flag is invisible in `.env.local`, so the run's actual behaviour
is not reconstructable from config alone."* That correction was made about `AGENT9_*`.

**MEASURED 2026-08-02, by reading the resolution line of all 39 upstream flags: the same defect is
larger upstream than it was in Agent 9.** Eight flags are active in every run with nothing in
`.env.local` recording the choice.

### Live in every run, unconfigured — the class this register exists to surface

| Flag | Resolution line | Default |
|---|---|---|
| `AGENT4_GRACEFUL_DEGRADE` | `!["0","false","off","disabled","no"].includes(…)` | **ON** — A_53 P2 made it ON deliberately (`graceful-degrade-default-off-kills-runs`) |
| `AGENT5_DERIVE_SHADOW` | `if (/^(0\|false\|no\|off)$/i.test(…)) return;` — comment says *"default on"* | **ON** |
| `AGENT5_RED_HERRING_FLOOR` | `!/^(0\|off\|false\|no)$/i.test(…)` | **ON** — A_71's floor; the one piece of new behaviour a fresh run exercises unasked |
| `AGENT5_STRICT_PROMPT_CONTRACTS` | early-return `false` on off-words, else `return true` | **ON** |
| `AGENT7_MECHANISM_GATE` | `!/^(0\|false\|no\|off)$/i.test(…)` | **ON** |
| `AGENT7_SCHEDULER_SHADOW` | `!/^(0\|false\|no\|off)$/i.test(…)` | **ON** (shadow — telemetry, no behaviour) |
| `NOVELTY_SKELETON_JUDGE` | `(… ?? "shadow")` | **shadow** |
| `RUBRIC_SCORING_MODE` | `(… ?? "shadow")` | **shadow** |

**None of these is necessarily wrong** — several are deliberate, and A_53's is documented at the site.
The defect is that **a run's behaviour cannot be reconstructed from its configuration**, which is the
premise every A/B on this project rests on. Two runs with identical `.env.local` files and different
code generations differ in ways nothing records.

### The remaining 31, by class

- **Default OFF, mode-valued** (unset → `off` via the file's own mapping; MEASURED at each site):
  `AGENT1_PERIOD_KB_ENABLED` · `AGENT2_CAST_CHECK` · `AGENT2_CONSTRAINED_CAST` · `AGENT2B_VOICE_CHECK` ·
  `AGENT2C_SCENE_GATE` · `AGENT2C_SPINE_CHECK` · `AGENT2E_DERIVE_BACKGROUND` · `AGENT5_ENABLE_LLM_RETRIES` ·
  `AGENT6_BLIND_READER_BLOCKING` · `AGENT6_REVEAL_GATE` · `AGENT7_CLUE_JOB_AUTHORITY` ·
  `AGENT7_SCHEDULER_AUTHORITATIVE` · `AGENT_PRE9_ENABLE_LLM_RETRIES` ·
  `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` · `NOVELTY_CROSS_RUN` · `NOVELTY_MODE` · `NOVELTY_SKIP` ·
  `RUBRIC_STRUCTURAL_CAPS_A68`
- **SET in `.env.local`, so at least the choice is recorded:** `AGENT3B_PLAUSIBILITY_JUDGE=shadow` ·
  `AGENT6_DT_EVIDENCE_COMPLETENESS=true` · `AGENT7_DISCOVERY_TELL=true` ·
  `AGENT7_PLANT_BEFORE_REVEAL=true` · `NOVELTY_HARD_FAIL=false` · `NOVELTY_SIMILARITY_THRESHOLD=1.0` ·
  `RUBRIC_JUDGE_MODEL=gpt-4.1-mini`
- **`CONFIG` — numeric bound or model selection, exempt from the lifecycle** (per this register's own
  legend): `AGENT2B_VOICE_MAX_RETRIES` · `AGENT2C_SCENE_GATE_MAX_RETRIES` ·
  `AGENT3B_PLAUSIBILITY_MAX_RETRIES` · `AGENT4_MAX_COST_USD` · `AGENT6_BLIND_READER_MAJORITY_K` ·
  `NOVELTY_SKELETON_MODEL`

### The one action this justifies without an owner's judgement

**Make the eight defaults explicit in `.env.local`.** That is not a behaviour change — it writes down
what is already happening — and it makes a run's behaviour reconstructable from its config, which is
the property every probe on this board assumes. Everything else (promote / delete / defer) still needs
whoever owns that agent.

---

## The lifecycle rule this establishes

Every new behaviour flag must record, at creation: **who owns it, what probe would settle it, and what happens if the probe never runs.** A flag with no exit condition is a permanent branch.

Concretely, the audit found the review's own framing was wrong because *nothing recorded a flag's default alongside its configured state*. The cheapest guard is a generated table: enumerate `AGENT9_*` from source, resolve each default, diff against `.env.local`, and fail CI when a flag exists in neither the register above nor the config. That is a natural follow-on once R6 exists.
