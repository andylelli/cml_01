# Agent 9 flag audit — S1

**Date:** 2026-08-01 · **Scope:** all 33 `AGENT9_*` environment flags referenced in source (tests excluded).
**Task:** [REVIEW.md §5.7 S1](REVIEW.md#57-simplification-tasks) — classify every flag as **promote**, **delete**, or **defer with a named blocker**.

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

## Addendum — flags created by the REVIEW.md remediation work (2026-08-01)

Registered at creation, per the lifecycle rule this document establishes. All three are default-OFF,
runtime-read, and unprobed; all three name the same blocker, which is now **built** (`npm run eval`)
rather than merely wished for.

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `AGENT7_STRUCTURED_OUTPUT` | unset → off | **DEFER** | R4: one run per arm, same premise. Promote when the flag-ON arm holds the `[R4]` coercion counters at zero with schema-valid outlines. Those counters are also the gate on S7 — no coercion site may be deleted until its counter reads zero across several runs |
| `AGENT_PROFILES_PARALLEL` | unset → off | **DEFER** | R9: same premise, sequential vs parallel; the three profile artifacts must be **byte-identical**. A difference means shared state, not a speedup — stop rather than accept it |
| `AGENT9_PROMPT_PREFIX_ORDER` | unset → off | **DEFER** | R8: cached prompt tokens in `llm-prompts-full.jsonl` rising from chapter 2 onward, with prose materially unchanged. Block order does influence the model, so a visible prose shift makes this a behaviour change, not an optimisation |

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

## The lifecycle rule this establishes

Every new behaviour flag must record, at creation: **who owns it, what probe would settle it, and what happens if the probe never runs.** A flag with no exit condition is a permanent branch.

Concretely, the audit found the review's own framing was wrong because *nothing recorded a flag's default alongside its configured state*. The cheapest guard is a generated table: enumerate `AGENT9_*` from source, resolve each default, diff against `.env.local`, and fail CI when a flag exists in neither the register above nor the config. That is a natural follow-on once R6 exists.
