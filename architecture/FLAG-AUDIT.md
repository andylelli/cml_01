# Agent 9 flag audit — S1

**Date:** 2026-08-01 · **Scope:** all `AGENT9_*` environment flags referenced in source (tests excluded).

> **Scope line corrected 2026-08-24 (A_73 §13.2).** This said "all 33". Source now carries **45**
> distinct `AGENT9_*` flags across both read idioms (`process.env.X` and the injected `env.X`), and
> the audit does in fact name every one of them — twelve arrived after 2026-08-01 and the count in
> the header was never updated. The number is deliberately no longer written here: a count in a
> heading is a third body that has to be kept in step with the code and the register, and
> `npm run flags:check` already compares those two.
>
> **Open, and outside this document's scope:** 22 default-OFF flags across Agents 1, 2, 2b, 2c, 2e,
> 3b, 4, 5, 6 and 7 have had no equivalent audit — including `AGENT6_BLIND_READER_BLOCKING`,
> `AGENT7_MECHANISM_GATE`, `AGENT7_PLANT_BEFORE_REVEAL`, `AGENT7_SCHEDULER_AUTHORITATIVE`,
> `AGENT5_STRICT_PROMPT_CONTRACTS` and `AGENT2_CONSTRAINED_CAST`. This audit's own method —
> *unset is not the same as off* — has never been pointed at them.
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
| `AGENT9_CULPRIT_INJECTION_IN_SCENE` | unset -> off | **PROBE NEXT RUN** | **A_74 §9.4 / X4, 2026-08-26.** `enforceCulpritEvidencePresence` writes a summary verdict, and the resolution lint forbids exactly that, so the pipeline records its own violation and ships it under ADR-0003. **MEASURED across the 18 archived runs carrying X4 telemetry: 5 injections, 10 violations — a 100% violation rate**, every one breaking both `verdict_closer.was_responsible` and `verdict_closer.beyond`. Three external readers have quoted the result back as *"generator residue"*. On: the floor emits an in-scene form instead. This is NOT REVIEW_05 §10.6's refuse-vs-stand choice — the sentence still injects, it just stops fighting a rule it never needed to fight, exactly as A_57 D4 did for `buildResolutionBackstopSentence`. Verified in tests against the REAL predicate and the REAL rule array: it satisfies `culpritEvidenceLinkInText` and trips no verdict-closer rule; its shape is registered in `INJECTED_SENTENCE_PATTERNS` so injector-retirement metrics stay sighted. Probe: one run — X4 violations should read 0 where they previously read 2, with `injections` unchanged. If injections drop to 0 instead, the floor stopped firing and the probe measured nothing. |
| `AGENT9_OPENING_FRESHNESS` | unset -> off | **PROBE NEXT RUN** | **A_72 A2a, 2026-08-23.** `opening_hook` has never scored 9 in 35 external reads and all seventeen of its 8s are the same sentence: an inventory of props followed by a compliment. X94 already showed the SHAPE of sentence one is not the lever. This names what the opening is MADE OF: measured over 184 archived openings, `scent` appears in 76%, `faint` 72%, `pressed` 63%, `sprawled` 54%. On: chapter 1 only, the prompt cites the measured share and asks for a detail only this case could produce. **Two subtractions make it safe and are tested** — words the grounding validator REQUIRES (X95) are never asked to be avoided, nor are words from this run's own location/title/device. Regenerate the corpus with `node scripts/build-opening-corpus.mjs --write`. Probe: does `opening_hook` move off 8, and does the sensory/atmosphere retry rate stay flat. If the probe never runs, delete the block — a steer nobody has measured is worse than none. |
| `AGENT9_CROSS_CHAPTER_ECHO` | unset -> off | **DEFER, deliberately** | **A_72 C3, 2026-08-23.** A sentence repeated verbatim in two chapters. The count is ALWAYS logged; this flag decides whether it also raises a lint issue. Default OFF for a measured reason: over 198 archived manuscripts cross-chapter repeats run a **median of 6 per book** (max 35) against intra-chapter's 0.56, and every lint issue becomes a `batchError` that drives a retry — so raising these unconditionally puts a retry on nearly every chapter of every run, which is the cost that kept `AGENT9_FOLD_SUSPECT_CLEARANCES` off for a month. What it counts is worth having regardless: sampling the corpus, they are catchphrases and verbatim alibi recitals (*"that's the only certainty we have"*, *"I was in the smoking room from eight fifty to nine thirty"*) — which is the reader's standing `dialogue` complaint, a category that has reached 8 exactly once in 35 reads. Promote only after the always-on count is known on a fixed build. |
| `AGENT9_SENSORY_PALETTE_ROTATION` | unset -> off | **PROBE NEXT RUN** | **X95, 2026-08-23.** The opening-grounding vocabulary is a CLOSED list of 18 sensory and 39 atmosphere words, shown identically on every chapter of every run and enforced by the validator -- so the model converges: `chill` opens 26% of the 35 archived manuscripts, `damp` 23%, `faint` 23%. `atmosphere` and `opening_hook` are two of the five categories no reader has ever given a 9, and their notes are interchangeable between manuscripts. On: the prompt leads with a rotating 8-of-18 and 12-of-39 subset per chapter per story, seeded by the case title. **It cannot add a retry class** -- the validator still accepts the full list, and a subset of an accepted list is still accepted. Its own flag rather than a rider on `AGENT9_OPENING_STYLE_PER_STORY`, because two levers aimed at one symptom must be attributable separately. Probe: one run; confirm the sensory_grounding and atmosphere retry counts do not rise, and that first sentences across two runs of different cases no longer share their vocabulary. If the probe never runs, delete the palette and keep the unification -- the one-list half is unconditional and needs no flag. |
| `AGENT9_OPENING_STYLE_PER_STORY` | unset -> off | **PROBE NEXT RUN** | **X94, 2026-08-23.** `OPENING_STYLE_ROTATION` is indexed `(chapterNumber - 1) % 6`, which rotates correctly WITHIN a book and is CONSTANT ACROSS BOOKS at chapter 1 -- and chapter 1 is the only chapter `opening_hook` reads. Every manuscript this project has produced opens in `character-action`. MEASURED over the 35 archived manuscripts with an external read: `opening_hook` max **8 in 34 reads, never 9**; `pressed` in 26% of first sentences, `chill` 26%, `stepped` 23%, `gloved` 23%. On: the rotation is offset by an FNV-1a hash of the case title -- deterministic, so a replay of the same case reproduces its openings, and different across stories (5/8/5/8/1/8 over the 35 archived titles, against 35/35 on one style today). Probe: one run, confirm ch1 opens in a style other than character-action and that no opening-grounding or sensory retry appears that did not appear before. If the probe never runs the branch is dead weight and the seed should be deleted, not left switched off. |
| `AGENT9_CLUE_LIST_GRAMMAR` | unset -> off | **PROBE NEXT RUN** | **A_75 §6.3 / P3.2, 2026-08-27.** The missing-clue floor renders its operands as a SUBJECT and a VERB COMPLEMENT, and those operands are token bags: `composeProseTermPhrase` reduces each clue to de-spoiled key terms on purpose, so no 12-word span of the spec survives. The result is ungrammatical *by construction* — *"Weighed against the rest, Victim last seen alive minutes past bent the trail toward Temporal conflict hale alibi."* — and no rewording fixes it, because **a token bag is grammatical in a list and nowhere else**. On: the same operands render after a colon (*"one detail told against the account: <terms>. What it pointed to: <terms>."*). Both shapes are registered in `INJECTED_SENTENCE_PATTERNS` in the same commit — a flag that changes an injected sentence without registering the new form blinds every checker the moment it is switched on, which is this file's property #2. **Tested on BOTH sides of the flag**, against the REAL model-bound rule array and the REAL character-lifecycle validator: abort class #6 (a cast name and clue key-terms in one sentence marked the DETECTIVE deceased and killed a run) stays closed with the flag ON. Probe: one run — grep the manuscript for `told against the account`; `prose` should stop carrying an ungrammatical injected line. Falsification: if the reader still names the clue paragraphs as residue, the problem is the INJECTION, not its grammar, and P3.3 (escalate instead of injecting) is the next increment rather than more rewording. |
| `AGENT9_FOLD_SUSPECT_CLEARANCES` | unset → off | **DEFER** | A_67 FIX-1 Change C. ~~Blocker: same probe as above~~ **2026-08-19: its guardrail hung off the closure FLOOR, so it was unreachable whenever the defect was present — emitted 0 times in the whole prompt log. Rewired to the X32 ceiling; stays OFF because any coverage issue drives an outline retry and 11 of 32 outlines exceed one clearance scene. REVIEW_05 §12.8** **REWIRED 2026-08-23 — the fold is now DETERMINISTIC, and the reason it was off is gone.** It raised `duplicate_suspect_closure_scenes`, which drives an outline RETRY, and 11 of 32 archived outlines allocate the job more than once — so the flag asked a third of all runs to re-roll their outline to fix a defect a re-roll may reproduce. The issue is no longer raised. On instead: `applySuspectClearanceGate` marks the ONE scene that owns the clearance job (the last closure scene at or before the reveal — the fold its name always described) and the prose prompt tells every other chapter not to re-argue it. No retry, no LLM call, inert unless the outline allocates the job more than once. Probe: `pacing` has never reached 9 in 34 external reads and four of the top eight name this defect — the falsification is a suppressed chapter coming back THIN, since REVIEW_15 measured ch10's 1,031 words as having no job but the third clearance pass. |
| `AGENT9_RUBRIC_IN_PROMPT` | unset → off | **PROBED 2026-08-17 — HOLD** | **The probe ran** (`mystery-1786999938275`, REVIEW_10 §10). The block reached the model — 519 tokens, verified in the live ch1 prompt — and was then **budget-dropped from chapters 8, 9 and 10** (X47), together with `craft_guide`. So the flag stays OFF and the promote/retire decision waits: the external cold read of this manuscript reads a book that carried the rubric for seven chapters of ten, and cannot settle §8's falsification either way. **Re-probe after X47.** Internal 70/100 recorded as the Goodhart check only. Original spec follows. **M6** (REVIEW_10 §2/§10). Adds one run-stable `judged_on` block naming the ten rubric categories in the WRITER's vocabulary — deliberately not `buildRubricSystemPrompt()`, which is a critic's text and would make the internal score measure its own echo. Weighted toward the six categories that have never moved (hook and atmosphere are 8 in five reads of five, with zero variance; dialogue has never exceeded 7). No flag list, no example sentences. **Owner:** whoever runs the next canary. **Probe:** one run, flag ON, read on the EXTERNAL cold read — hook, atmosphere, character clarity, dialogue, pacing, prose. The internal rubric number is not admissible evidence here and must be reported alongside as a Goodhart check, not as the result. **If it does not move a flat category, REVIEW_10 §8's falsification has arrived**: the ceiling is real, detectors and prompts have both been tried, and Move 4 (a frontier generation model) becomes the honest next step rather than a speculative one. **If the probe never runs:** the flag stays off, the prompt is byte-identical to today, and the flat six remain unexplained — the one outcome that leaves REVIEW_10 §1's thesis untested from either end |
| `AGENT9_PROMPT_BUDGET_CRAFT_FLOOR` | **`true` in `.env.local`** | **SETTLED ON 2026-08-19** | **X47** (REVIEW_11 §9/§12.7). Two changes to `applyPromptBudgeting`, one flag. (1) FUTILITY — on a 10-chapter book the fixed prefix climbs 8,472 → 23,622 tokens against a 24,000 ceiling, so chapters 8–10 ship 5,499 / 5,737 / 4,723 tokens of context into 2,585 / 2,191 / 378. The critical blocks alone already exceed what is available, so **no drop sequence can reach the budget** — and the loop dropped `craft_guide` and `judged_on` anyway. With the flag on, futility suppresses the drop TARGET, not the drop: every non-craft droppable block is still shed (the cost saving is real either way) and the loop stops at the craft floor. (2) VICTIM — within a priority class the loop takes blocks in ARRAY ORDER, and array order puts the flat six's own inputs first (`world_document`, `texture_pool`, `location_profiles`, `character_personality`, `character_contracts`, `craft_guide`, `judged_on`); a stable partition sends those seven last in their class. A preference, not immunity — with nothing else left, a craft block still goes. **Default OFF for the reason the same file already gives about `AGENT9_PROMPT_PREFIX_ORDER`**: changing which block dies under budget pressure is a behaviour change on every run, not a free optimisation. **Owner:** whoever runs the next canary. **Probe:** one run, flag ON, read on `dropped=[…]` in the per-chapter `PROMPT BUDGET SUMMARY` — `character_contracts` must survive past ch5 and `craft_guide`/`judged_on` past ch7, which is where they died on `mystery-1786999938275`. Then the EXTERNAL cold read on atmosphere, character clarity and dialogue, whose inputs those are. **Pairs with `AGENT9_RUBRIC_IN_PROMPT`**: M6's probe is unreadable until this lands, because the rubric block was itself budget-dropped from ch8–10, so the two are one experiment and not two. **The diagnosis is unconditional and does not need the flag** — the budget summary reports `available`, `critical`, `futile` and `craftFloor` on every call, so a run answers "was the squeeze futile, and what would the floor have kept?" whether or not this is on. **If the probe never runs:** the flag stays off, the prompt is byte-identical to today, and REVIEW_11 §9's demotion of X47 stands untested — X47 explains at most one of six reader complaints, so the cost of never settling it is bounded, which is why it sits below the unflagged fixes in §10's order. **SETTLED 2026-08-19 ([REVIEW_14 §11](REVIEW_14.md)).** REVIEW_13 §5 held it OFF on *"first evidence is against it"* — 11 retries on the one run with the floor ON. That is **n=1**, which this project's own canary rule refuses, and REVIEW_12 §2 was careful enough to WITHDRAW its hypothesis on exactly that evidence before REVIEW_13 hardened it into a reason to do nothing; REVIEW_12 §3 then located the retry cause elsewhere entirely (the case's vocabulary against validator wordlists). The row above already states the decisive fact: **the squeeze is FUTILE** — critical blocks alone exceed what is available, so no drop sequence can reach the ceiling — **and the loop deleted `craft_guide` and `judged_on` anyway.** The pipeline was paying the craft cost and getting nothing for it. Cost of ON is deterministic and small (ch9 ships 35,069 tokens), against a 24,000 ceiling that is self-imposed by three orders of magnitude on a gpt-4.1 context. **Consequence: M6's prerequisite is now met** — the rubric block survives to ch10, so `AGENT9_RUBRIC_IN_PROMPT` is readable for the first time. |
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
| `AGENT9_PROMPT_PREFIX_ORDER` | unset → off | **DEFER** | R8: cached prompt tokens rising from chapter 2 onward, with prose materially unchanged. Block order does influence the model, so a visible prose shift makes this a behaviour change, not an optimisation. **Precondition, added 2026-08-02: `LLM_HTTP_TRANSPORT=true`.** The metric this probe is defined against did not exist in any log — the beta SDK's `CompletionsUsage` has three fields and no `prompt_tokens_details`, so "cached tokens rising" was unobservable (REVIEW_02 §2.2). It is now read and logged as `cachedPromptTokens`, but only on the http transport; on the SDK path it is ABSENT rather than 0, so a run cannot mistake "not reported" for "no cache hit"  **ENABLED 2026-08-21 — PLAN-TO-90 Phase 0a.2.** Unblocked by 0a.1, not by new work: this was deferred because its probe (*"cached prompt tokens rising from chapter 2 onward"*) was unmeasurable, and the metric was unmeasurable because the transport was off. MEASURED on `mystery-1787167692140`: the longest common prefix across the twelve chapter prompts is **5%** of a mean prompt, against an order-independent ceiling of **29%** (~8,455 tokens/call) — the system message is 60K chars and 43% identical across chapters but only 9% of it is a usable prefix. Azure telemetry on the two runs that carry it corroborates the shape: 6-12% cached on a first attempt, 88-97% on a retry. Probe unchanged; it is now readable. |

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
| `AGENT9_REGEN_EDIT_LIST` | unset → off | **PROBE ANSWERED — promote with the aftermath pass** | Regen returns only changed paragraphs. Saves ~£0.14/run; the stronger argument is safety — untouched paragraphs are spliced from the source and cannot drift. **MEASURED 2026-08-07** on a real manuscript, same chapter, flag the only difference: **0 of 3 paragraphs repaired with it OFF, 2 of 3 with it ON, at a quarter of the cost** ($0.0161 → $0.0041). Every flag-off failure was `regen introduced` — the model re-emits the whole chapter and its incidental rewording of untargeted paragraphs trips the detector elsewhere, so the pass defeats itself. The stated probe ("success rate not below the flag-off arm") is not merely met; on a negative, whole-chapter-validated obligation this flag is the difference between the pass working and not. See [REVIEW_05 §36](REVIEW_05.md) |
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
| `LLM_HTTP_TRANSPORT` | unset → off | **DEFER** | REVIEW_02 §4.1 — chat calls bypass the `@azure/openai` SDK for a direct POST, because the SDK drops `json_schema` and cannot report `prompt_tokens_details`. Probe: one run per arm on a fixed premise; artifacts equivalent, no new error classes, and `cachedPromptTokens` present in the log. **It is the precondition for `AGENT7_STRUCTURED_OUTPUT` and for R8's real metric** — both were unrunnable without it  **ENABLED 2026-08-21 — PLAN-TO-90 Phase 0a.1.** Not as a structured-outputs prerequisite but as a MEASUREMENT one: `cachedPromptTokens` is populated only on this transport, and before the flip **110 of 1,503 logged calls carried the field — 93% of the pipeline was blind to its own cache behaviour**. That blindness is what left `AGENT9_PROMPT_PREFIX_ORDER` deferred, since its probe is defined against exactly this metric. Preflight WARNS rather than throws, and the warning is the right one: cross-transport A/B comparisons are not like-for-like, so runs before and after this date are not directly comparable on error surfaces. |

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

## Addendum 6 — two corrections from the 2026-08-03 audit

### `.env` shadows `.env.local` — and this register was reading the losing file

> ✅ **FIXED 2026-08-03.** Every production loader now passes `{ override: true }` on `.env.local`, so the local file wins — what the filenames always implied. `.env.local`'s api-version was raised to `2024-12-01-preview` **before** the flip, so the change could not regress `json_schema` support. **Effective config now: `AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini`** (was `gpt-4o-mini`). Both endpoint hostnames were verified against the live API (HTTP 200, `gpt-4.1-mini` present on each) before switching. `flags:check` models the new precedence and reports remaining duplicate keys as hygiene, not as a defect. **This is a real behaviour change: every non-prose agent now runs on `gpt-4.1-mini`, and it has not yet been through a run.**

Every entry point calls `config({path: .env})` **before** `config({path: .env.local})`, and dotenv does not override a value already set. **`.env` therefore wins every conflict.** Three keys currently differ:

| Key | Effective (`.env`) | Ignored (`.env.local`) |
|---|---|---|
| `AZURE_OPENAI_DEPLOYMENT_NAME` | **`gpt-4o-mini`** | `gpt-4.1-mini` |
| `AZURE_OPENAI_API_VERSION` | `2024-12-01-preview` | `2024-02-15-preview` |
| `AZURE_OPENAI_ENDPOINT` | `…cognitiveservices.azure.com` | `…openai.azure.com` |

Consequences for this document: **every "SET" state recorded above was read from `.env.local` alone.** For the `AGENT9_*` flags that is harmless — none is set in `.env` — but the register's *method* was wrong, and `flags:check` inherited it. Both now read both files, apply the real precedence, and report shadowing as its own finding class.

This also corrects [REVIEW_02 §2.1](REVIEW_02.md): its "second, independent blocker" (api-version too old for `json_schema`) was derived from the losing file. The effective version is past the floor. **Only the SDK strip was ever real.**

### `AGENT5_RED_HERRING_FLOOR` is a detector, not a floor

> ✅ **FIXED 2026-08-03.** The regeneration was gated on `if (llmRetriesEnabled)`; it is now gated on `if (redHerringFloor.enabled)` — the flag A_71 gave it precisely so it would work at default config. Still exactly one bounded attempt, still no abort path, still no deterministic synthesis. **Unprobed: no run has yet exercised the repair.**

Recorded here because the register presents it as a repair lever, and it is not.

Its bounded regeneration sits inside `if (llmRetriesEnabled)`, and **`AGENT5_ENABLE_LLM_RETRIES` is default-OFF** ("deterministic remediation mode active — LLM retry loops disabled by default"). On run `mystery-1785694688534` the floor detected the shortfall, logged *"0 red herring(s) against a budget of 2"*, **attempted no repair, and the story shipped with no misdirection**.

| Flag | Recorded state | Corrected state |
|---|---|---|
| `AGENT5_RED_HERRING_FLOOR` | default-**ON** repair lever (A_71 §4) | default-ON **detector**; its repair is unreachable at default config |
| `AGENT5_ENABLE_LLM_RETRIES` | listed as "default OFF, mode-valued" | **gates A_71's red-herring repair** — the dependency was undocumented |

The earlier run's 2 red herrings were the model's own output, not a repair. **The floor has never repaired anything.** Either enable the retry path for this one case, or the flag should be renamed to what it does.

---

## The lifecycle rule this establishes

Every new behaviour flag must record, at creation: **who owns it, what probe would settle it, and what happens if the probe never runs.** A flag with no exit condition is a permanent branch.

Concretely, the audit found the review's own framing was wrong because *nothing recorded a flag's default alongside its configured state*. The cheapest guard is a generated table: enumerate `AGENT9_*` from source, resolve each default, diff against `.env.local`, and fail CI when a flag exists in neither the register above nor the config. That is a natural follow-on once R6 exists.

---

## Addendum 7 — Agent 7.5, the Story Geometry compiler (2026-08-03)

Design: [GEOMETRY-AGENT-DESIGN.md](GEOMETRY-AGENT-DESIGN.md) · concept: [STORY-GEOMETRY.md](STORY-GEOMETRY.md) · motivation: [THINK_01.md](THINK_01.md)

Five flags, registered at creation as the lifecycle rule requires: **who owns it, what probe would
settle it, and what happens if the probe never runs.**

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `AGENT75_GEOMETRY` | unset → **`shadow`** | **PROBE** | Mode-valued (`off` / `shadow` / `gate`). `shadow` derives the manuscript contract, checks its closure against the outline, and reports — it costs no LLM call and changes no behaviour, which is why it is the default rather than `off`: a checker that ships dark is the exact failure this whole line of work exists to stop. `gate` additionally applies bounded, additive outline repair. **Probe:** the closure diagnostic on ≥4 runs — does it flag the defects the external reviewers flagged? Then `gate` vs `shadow` on outline-repair rate and first-pass chapter success |
| `AGENT75_GEOMETRY_RESOLVE` | unset → off | **DEFER** | The one LLM call (§6): which trace is the clincher, whom the false solution accuses. Default OFF because the deterministic selection is complete without it — the call is an improvement, never a prerequisite. ~£0.002/run on the cheap deployment against ~£0.24/run of repair. **Probe:** clincher `source=llm` vs `derived` on matched runs, read on the external clue mark |
| `AGENT9_GEOMETRY_CONTRACT` | unset → off | **DEFER** | Phase 2 — lets the contract bind the prose prompt (four blocks; three run-stable, so they land in the cached prefix). **Probe:** first-pass chapter success against the 64%/71% baseline, plus generation-side cost. **If it does not move, the thesis is wrong and the stage should stop at shadow** |
| `AGENT9_GEOMETRY_ACCEPTANCE` | unset → **`shadow`** | **PROBE** | Mode-valued (`off` / `shadow` / `apply`). `shadow` re-checks the contract against the committed manuscript and records every constraint's outcome — **including the satisfied ones** (the A_70/A_71 rule). Deterministic, free, and the cheapest measurement this design has. `apply` routes chapter-scoped violations into the regen ladder. **Probe:** violation rate at ship across ≥4 runs; promote to `apply` only once the violations are real |
| `AGENT9_REGEN_REVEAL_MODIFY` | unset → off | **PROBE** | **N7** (REVIEW_08 §3/§8). Routes the three reveal codes (`reveal_culprit_not_named`, `reveal_method_absent`, `reveal_motive_absent`) off `runInsertionRegenPass` — whose `preserveOriginalParagraphsValidator` rejected the correct repair three times on the 08-07 run, because a reveal is not something a chapter can be given one more paragraph of — and onto `runRevealRepairRegenPass`, which MAY rewrite. Insertion-only is traded for four deterministic guards: the real detector re-run, locked-fact preservation, a length floor, and "no NEW violation anywhere" against a baseline read at pass time. Pins the edit-list channel itself, so it needs no second flag. **Probe:** `reveal_culprit_not_named` at ship, and `repaired` on the geometry diagnostic, flag-on vs flag-off on a manuscript that carries the defect — rehearsed offline first (`probe:reveal-repair`, pennies). **If it never runs:** the reveal defect keeps detecting and keeps failing to repair, which is the state REVIEW_08 §3 measured |
| `AGENT9_REGEN_AFTERMATH_REPEAT` | unset → off | **DEFER** | The thirteenth regen pass, and the first NEGATIVE one — nothing else in the registry can express "must not contain". Rewrite family, guarded by the detector, locked-fact preservation and a length floor (deleting the paragraph is the cheapest wrong answer). Best run over the `AGENT9_REGEN_EDIT_LIST` channel, whose stronger argument — safety, untouched paragraphs cannot drift — is exactly this pass's argument. **Probe:** `aftermath_repeat` violations at ship, flag-on vs flag-off. **The `EDIT_LIST` half is now measured** (0/3 vs 2/3 — §36): this pass must not be probed with that channel off, or the result is the channel's failure and not the pass's. |

**What happens if the probes never run.** The two `shadow` defaults keep reporting and changing
nothing — the contract is derived, its closure is on the report, and the acceptance test says which
constraints the shipped manuscript met. The three deferred flags stay off, so the prompt, the outline
and the repair ladder are byte-identical to today. Nothing regresses; the measurement accrues anyway.
That is the point of defaulting the read-only halves to `shadow` rather than `off`: this project's
recurring failure is not that it builds the wrong checkers, it is that checkers get built and never
wired.

**One flag this work does NOT add, deliberately.** §8.2 lists a fifth prompt block,
`geometry_feedback` (stability `attempt`). It has no reachable producer — §8.9 requires the
chapter-level acceptance test to run on the committed chapter, strictly after the retry loop that
would consume it — so it is not built. A prompt branch nothing can populate is the
`AGENT9_MODEL_REGEN` defect in a different costume. Geometry violations reach the model through the
regen instruction instead.

---

## Addendum 8 — the device/case time binding (2026-08-04)

Found by the first live geometry run and recorded in [REVIEW_04](REVIEW_04.md) §4.4: **the pipeline
carries two contradictory time models.** Agent 3b designs the hard-logic device, locks its facts, and
the prose injector prints them verbatim. Agent 3 authors
`hidden_model.mechanism.{apparent,actual}_time_of_death` from a prompt that has never seen them.

On `mystery-1785860662362` the case said "quarter past eight" / "quarter past seven" and the
manuscript printed "a quarter to four" (5x) and "ten minutes past four" (6x). **Neither of the case's
two anchors appeared anywhere in the finished story** — so the geometry contract,
`checkCaseTimelineDeception` and the rubric were all measuring a timeline the book does not have.

| Flag | State | Verdict | Probe that would settle it |
|---|---|---|---|
| `AGENT3_DEVICE_TIME_BINDING` | unset → off | **PROBE** | Passes the device's locked facts into the CML prompt and requires `apparent_time_of_death` to equal the locked displayed time, with the true time and every alibi window on the same clock. Default OFF because it changes a prompt, which the corpus regime probes rather than assumes. Self-gating twice over: no locked facts, or `enableLockedFactRegistry` off, and the prompt is byte-identical. **Probe:** one matched pair; `checkLockedFactTimeAlignment` findings drop to zero, and the case's anchors start appearing in the manuscript at all. **2026-08-20 — this flag now also carries X38-at-source's second half, and gained a cheaper prediction that does not need a pair** ([REVIEW_05 §12.12](REVIEW_05.md)). `buildDeviceArithmeticRule` adds the device's arithmetic as a number the model can check itself against — *"exactly D apart, and one of the two must BE this value"* — for the case that locks one clock and one duration. That is **four of the ten archived devices**, all of which fail today, and none of which can be repaired downstream because the second anchor is authored here. **Read it on a SINGLE run, before the prose:** `[X38]` must be absent from the Agent 7.5 warnings. That is deterministic, costs no comparison arm, and settles half of a 100%-failure defect; the manuscript-side reads remain the reason for the pair. **If the probe never runs:** the prompt is byte-identical, and those four failures stand — the other six are already repaired unflagged at Agent 3b |

**Why a prompt change and not a deterministic repair.** Exactly one correspondence is safe to write
mechanically — `false_time_displayed` IS the apparent time. `resumption_time` is when the mechanism
restarted, not when anyone died, and deriving `actual_time_of_death` from it would fabricate the
coherence claim the case failed to make, which is the failure `timeline-deception.ts` warns about in
its own header. The model knows the device's story and can author both consistently; a mapping
cannot. `checkLockedFactTimeAlignment` (agent3-run) remains as the detector either way, and reports
the split on every run regardless of this flag.

**What happens if the probe never runs.** The flag stays off, the two models stay divergent, the
detector keeps reporting it on every run — and **REVIEW_04 §5 stays true: phase 2 of the geometry
build sequence remains blocked**, because `AGENT9_GEOMETRY_CONTRACT` would put the mechanism's times
into the prose prompt as a hard contract while the locked-fact layer injects two different ones.

---

## Addendum 9 — the logging keys (2026-08-04, X3)

Found by [REVIEW_05](REVIEW_05.md) §12.3 and closed the same day. These eight keys were outside
`flags:check`'s scope entirely, which is how the defect below survived: **four separate parsers, three
of which accepted only the literal string `true`.** Setting `LOG_FULL_PROMPTS_TO_FILE=1` — the form
every gated flag in this pipeline accepts — read as FALSE and silently disabled full-prompt logging.

The failure mode is losing the evidence for a run that has already been paid for, and the loss looks
exactly like the run having never been made. `logs/llm-prompts-full.jsonl` is the only cost
measurement this project trusts (`report-total-cost-underreports-7x`), and the audits that read it —
prompt overlap, temperature, prompt size — see a run with logging off as absent rather than as
unlogged.

All four call sites now use `parseEnvBool` and `buildLlmLogger` from `@cml/worker`
(`jobs/cli-runtime.ts`). The truthy set is `1|true|yes|on`; an empty value takes the default, because
`LOG_TO_FILE=` in a dotenv file is an unset key rather than an instruction to stop logging.

**These are `CONFIG`, not behaviour levers** — they select where evidence is written, not what the
pipeline does — so the promote/delete lifecycle does not apply. They are registered so that a change
to one is visible, which is the property that was missing.

| Flag | State | Verdict | Notes |
|---|---|---|---|
| `LOG_LEVEL` | SET (`info`) | **CONFIG** | Verbosity only |
| `LOG_TO_CONSOLE` | SET on | **CONFIG** | |
| `LOG_TO_FILE` | SET on | **CONFIG** | Gates `logs/llm.jsonl` |
| `LOG_FILE_PATH` | SET (`./logs/llm.jsonl`) | **CONFIG** | The agent-loop copy defaulted to a relative `apps/api/logs/llm.jsonl`; unified to `<workspaceRoot>/logs/llm.jsonl`. Never observed, because the key is set |
| `LOG_FULL_PROMPTS_TO_FILE` | unset → **ON** | **CONFIG** | Default-on. Gates the cost-audit surface — the key the defect was found on |
| `FULL_PROMPT_LOG_FILE_PATH` | unset → `<root>/logs/llm-prompts-full.jsonl` | **CONFIG** | |
| `LOG_ACTUAL_PROMPT_DOCS_TO_FILE` | unset → **ON** | **CONFIG** | Default-on. Gates `documentation/prompts/actual/`, which is what replay hydration reads (N5) |
| `ACTUAL_PROMPT_DOCS_DIR` | unset → `<root>/documentation/prompts/actual` | **CONFIG** | |

Two of the eight are **default-ON and unset**, which is the class Addendum 1's correction was about:
the run's actual behaviour is not reconstructable from `.env.local` alone. They stay unset — a
default-on evidence surface is the right default — but they are now written down.

---

## Addendum — A_73 flags, registered 2026-08-25

Five levers added by [ANALYSIS_73](../documentation/analysis/ANALYSIS_73/ANALYSIS_73.md) Parts II–V.
`flag-register-check.mjs` flagged all five as read-by-code-but-undocumented, which is the check
working; this is the entry it asked for. Every one is **default OFF** and every one has a named
settling probe, because the lifecycle rule is that a flag with no exit condition is a permanent branch.

| Flag | Owner | What it changes | Settling probe | If the probe never runs |
|---|---|---|---|---|
| `AGENT9_CLEARANCE_AT_END` | A_73 §34 | Appends clearance paragraphs near the chapter end instead of splicing all of them in at paragraph 2 | Step 2a run + one external read; **prose** should move off 6 | DELETE. The 08-25 reader quoted this injector's output as the single largest polish drag; if moving it changes nothing, position was not the problem and the flag is noise. |
| `AGENT9_LOCKED_FACT_ALIASES` | A_73 §2 (C4) | Canonical locked-fact value stated verbatim once per chapter that turns on it; natural reference thereafter | Same run; **dialogue** should move off 7 | DELETE. The story validator never required per-mention repetition, so if relaxing the prompt does not move dialogue, §5.1's inference is wrong. |
| `AGENT9_CONTINUITY_SPAN` | A_73 §30 | Chapter summaries sampled across the chapter, all three key events rendered instead of `keyEvents[0]` | Same run; **pacing/ending**, and the "proof repeated after the confession" complaint | PROMOTE ANYWAY or delete deliberately. Recording one sentence per chapter is defensible only if a read shows it costs nothing. |
| `AGENT9_CRITICAL_BLOCK_CAPS` | A_73 §31 | Caps the 7 growing CRITICAL prompt blocks so the critical floor stops outgrowing the budget | Its OWN run — it changes which context survives under pressure, so it cannot be attributed alongside prose levers | Keep gated. X47's futility measurement stands either way; this is the mechanism fix and needs its own read. |
| `AGENT9_OPENING_IDEATION` | A_73 Part V / A_72 §10.1 | A2b — five divergent candidate opening SITUATIONS in one design-tier call, winner committed as a chapter-1 contract | Requires `RECENT_OPENING_SITUATIONS` to be regenerated where the archive lives; then one run, reading **opening_hook** | This is A_72 §10.1's own falsification: if it ships and `opening_hook` stays at 8 with a props inventory, §2's distinctiveness thesis is wrong and the generation-model question reopens with evidence. |

**One caution on the last row, from the 08-25 run.** Cross-run novelty ran for the first time that
day (the A_73 §12.1 ledger fix) and the case it produced scored *lower* on `premise` — 8, down from
9 — with the reader saying the mechanism was simpler than the pendulum and tide drafts. The ledger
holds seven clock-family cases, so "diverge from these" moved it to another clock trick.
**Divergence from a monoculture stays inside the monoculture**, and A2b inherits that risk directly.

---

## Addendum — A_74 §8 distinctiveness-engine flags, registered 2026-08-26

Two levers added by [ANALYSIS_74 §8](../documentation/analysis/ANALYSIS_74/ANALYSIS_74.md).
`flag-register-check.mjs` flagged both, which is the check working. Both are **default OFF** and both
have a named settling probe.

The context these two live in, because it is unusual: A_74 §8 found that the distinctiveness engine
had **never been in a position to act**. `canary-core-inputs.yaml` pins `primaryAxis: temporal` and
names *"clock-tampering"* in the theme; `MECHANISM_FAMILY_KEYWORDS.clock` matches it,
`selectThemeCoherentPrimary` enforces it, and Agent 3b's prompt forbids swapping family "for novelty"
by name — while `divergeFrom` is a prompt line arguing with a hard selector. Measured on the shipped
ledger the day these flags landed: **`axis` H=0.00 (1 distinct of 6), `mechanismFamily` H=0.00
(1 distinct of 14), `crimeSubtype` and `deathMethod` H=1.00 (7 distinct of 7, free text)**. So the
probes below are not testing whether these levers *improve* a mark. They are testing whether the
engine can move the pipeline out of one cell at all — a question no prior run could answer.

| Flag | Owner | What it changes | Settling probe | If the probe never runs |
|---|---|---|---|---|
| `NOVELTY_CELL_SCHEDULER` | A_74 §8 DE5 | `off` \| `shadow` \| `on`. Computes the stalest feasible `(axis, mechanism_family, discriminating_test_shape)` cell from the cross-run ledger, requiring ≥2 coordinates to differ from the previous run, and emits it as a **positive assignment** rather than an avoidance line. `shadow` logs the choice and changes nothing. The assignment is applied at the INPUT layer by `scripts/schedule-run.mjs`, not inside the orchestrator. | **Rung 2 of A_74 §8.6's ablation ladder, and it needs NO external read**: run the generated config and check the log — did `primaryAxis` change, did Agent 3b emit a non-clock primary, did `[DE3 cell]` report depth 0? A failure here is visible without a reader. Rung 4 (does an unused cell read better?) is a separate, later question. | Keep gated, and record that the corpus stayed at H=0.00. The scheduler is the only mechanism in the repo that can raise axis dispersion; without it the ledger's "diverge from recent runs" continues to mean "pick a different noun in the same cell". |
| `AGENT3B_DEVICE_LIBRARY` | A_74 §8 DE8 | Retrieves up to 4 era-feasible patterns from `@cml/device-library` (11 curated patterns, `usage_log`-decayed novelty ranking) and renders them into Agent 3b's prompt as **raw material to recombine**, explicitly not as a menu. Emits nothing — not a wrong block — when the assigned family has no library coverage. | Same run as DE5. Read Agent 3b's response: the primary device should be recombinant (principle of one pattern, trace-pattern of another), not a listed pattern with the nouns changed. | DELETE the wiring, keep the package. The library was built, schema-validated, golden-tested and then imported by no pipeline code for its whole life; leaving it unwired is the status quo ante and costs nothing. |

**The failure mode to watch, stated in advance.** Handing a model eleven worked examples risks a NEW
and smaller monoculture — the DE5 defect re-created one layer down. If DE9's read calls the scheduled
case derivative, **`AGENT3B_DEVICE_LIBRARY` is the first suspect and must be ablated before
`NOVELTY_CELL_SCHEDULER` is**, because the scheduler only chooses a cell whereas the library supplies
the sentences.
