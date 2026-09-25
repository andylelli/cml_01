# ANALYSIS_71 — the measurement layer, fixed at source

**Written:** 2026-07-31 · **Trigger:** owner's request — *"tell me what the current issues are"*, then *"implement them"*. · **Regime:** corpus era (A_63 §2.8) — behaviour levers ship flag-gated, probed before promotion; runtime env getters, never module consts; never-abort release gate.

**Type:** a BOARD plus the build record. Every item below was either fixed or measured; where a prior doc's conclusion turned out to point at the wrong code, this says so and names the right code.

**Method note, carried from A_70:** every claim is **MEASURED** (I ran the check and quote the output), **INFERRED** (follows from code reading), or **UNBASELINED** (a number with no comparison point). A_70 §7's own top item rested on a measurement taken on the wrong module — §3 — so the marking earns its keep again.

**A_70's through-line was:** *"four of the six are measurement problems, not craft problems."* **A_71's finding is that it was worse than that.** Three of the four defects fixed here were detectors and scorers reading paths that data never travelled — and each had been silently returning a confident, wrong number for weeks. Nothing was broken in the stories. The instruments were broken.

---

## 1. Report finalization — why 7 of 9 reports on disk are stranded partials

**A_70 §4 called this "the most valuable unanswered question on this board." It is answered.**

**MEASURED first — and A_70's headline needs one correction.** A_70 reported *"no run in this corpus has ever produced a finalized report."* That was true when written, but the check that produced it read `phases[].name`; the field is `phase_name`. Re-audited with the right key, **two runs since (07-31) DID finalize with 14 phases including Prose Generation**. Finalization is intermittent, not universally broken — which is what makes the cause findable.

| Report | Score | Outcome | in_progress | Phases | Prose phase |
|---|---|---|---|---|---|
| `mystery-1785507417070` | 94.86 | passed | — | 14 | **YES** |
| `mystery-1785512142695` | 95.5 | passed | — | 14 | **YES** |
| `mystery-1785175520689` | 96 | passed | true | 13 | no |
| `mystery-1785515565194` | 95.23 | passed | true | 13 | no |
| `mystery-1785521869768` | 74 | failed | true | 13 | no |
| 4 × `proj_*` | 74 | failed | true | 13 | no |

**ROOT CAUSE, MEASURED.** `FileReportRepository.save()` asserts report invariants ([report-repository.ts:64](../../../packages/story-validation/src/report-repository.ts#L64)) — so an invariant violation does not warn, it means **the report is never written at all**.

And one invariant contradicts the design it is supposed to protect. **A_65b Ph1.3 redefined `run_outcome`**: it derives from the RELEASE GATE (gate ∈ {passed, warning} = the story SHIPPED ⇒ `'passed'`), and the phase-threshold verdict was demoted to its own field, `phase_thresholds_met`. `failed_phase_signal_cannot_have_passed_outcome` predates that change and still asserts *phases-failed ⇒ cannot be `passed`*.

So **"shipped, but a phase missed its threshold" — a designed, honest state — threw.** And per A_70 §6, Cast Design misses its threshold on essentially every run. That is the whole mechanism:

> the gate says shipped → `run_outcome: passed` → a phase failed → invariant throws → `save()` fails → the last `savePartialReport()` snapshot survives as the only record, reading **96 / A / passed** for a run that scored 66.

The two runs that finalized are exactly the two with `phases_failed: 0`. Causal, and it predicts the corpus.

### 1.1 Fixed — three changes, at the layer that owns each problem

- **The invariant now matches the design.** Failed phase signals under `run_outcome: passed` are a violation only when the report *also* claims `phase_thresholds_met: true` — an actual self-contradiction. When it is `false`, the report is telling the truth and saves. A report with no `phase_thresholds_met` field is pre-Ph1.3 and keeps the old conservative reading, so nothing historical is reinterpreted.
- **E1 exempts live snapshots.** `missing_post_generation_summary` fired on `in_progress` partials written mid-prose, where the phase legitimately exists before its summary diagnostic does. Since `savePartialReport` swallows save errors, that throw left the run with **no artifact at all**. E1 still binds every final report — the record it was written to protect.
- **Partials are honest at write time, not at cleanup time.** A_70 §4 fixed ONE exit path (`markStaleInProgressReport`, when finalization throws). Every other way a run ends — a crash, a hard-stop whose own save fails, the `0xC0000409` process abort of A_70 §8.5, a power cut — left the partial exactly as written. `savePartialReport` now stamps `run_outcome: "in_progress"`, `passed: false`, `incomplete: true` and a reason **as it writes**. `in_progress` deliberately stays `true` so the repository keeps excluding it from listings.

`in_progress` is now a first-class `RunOutcome`. `ScoreCard.vue` renders it as *"◷ In Progress"* rather than borrowing the verdict of whichever phases happened to finish. `scripts/target80-ledger-row.mjs` already refused `in_progress || stale || incomplete` and needs no change.

### 1.2 Also fixed — the two definitions of SHIPPED

A_70 §4 noted the same run reading "shipped" via `run_outcome` and "not shipped" via `release_gate_outcome.status: unknown`. `scripts/canary-core.mjs` re-derived P0.2 by hand; the aggregator derived `run_outcome` separately. **Two copies of a definition drift; one field cannot.** `release_gate_outcome.shipped` is now computed once at report time and canary-core reads it, re-deriving only for pre-A_71 reports. And when `run_outcome: passed` comes from the phase-threshold fallback with an `unknown` gate, `run_outcome_reason` now says so — the silence is what made a documented fallback look like a contradiction.

---

## 2. Cast Design was never the weakest phase — the scorer was reading a field that has never existed

**A_70 §6, MEASURED and closed:** *"Cast Design is the weakest phase in all three reports, failing on `quality_score ≈ 49` while validation/completeness/consistency all score 100. One phase fails the same way every run and nothing acts on it."*

**There was nothing to act on.** The cast was never the problem.

**MEASURED — the two tests that fail are the only two that fail, in every report:**

```
quality | Character depth              100
quality | Motive strength variety      100
quality | Relationship density           0    "Only 0.0 per character"
quality | Relationships reference cast   0    "Relationships don't reference other cast members"
```

**MEASURED — the relationships were there the whole time.** Parsing the raw Agent-2 responses from three runs:

| Run | `relationships` shape | Pairs |
|---|---|---|
| `run_20260727-2048` | bare **array** | 15 |
| `run_20260731-1632` | bare **array** | 9 |
| `run_20260731-1817` | bare **array** | 10 |

Each pair fully formed: `character1`, `character2`, `relationship`, `tension`, `sharedHistory`.

**The declared contract is `{ pairs: [...] }`**, and every reader guarded on `Array.isArray(relationships.pairs)` — which is `undefined` on a bare array. Two things therefore did nothing on every run since the contract was written:

1. `adaptCastForScoring` built an **empty** relationship list for each character → both quality tests scored 0 → Cast Design has read as the pipeline's weakest phase in every report ever generated.
2. `normalizeRelationshipTension` **never ran**, so tension values were never coerced to their enum.

This is the `cast-field-camelcase-vs-snakecase-trap` class exactly: a shape assumption that **no-ops instead of failing**, so it survives indefinitely and reads as a content defect.

**Fixed at the source** — `normalizeRelationshipWeb` coerces bare array → `{pairs}` right where the cast is parsed, so every reader is fixed at once and the tension normalizer starts working. The scoring adapter also accepts both shapes, because A/B replays hydrate stored artifacts that hold the raw form.

**MEASURED after the fix, on real run data** (`run_20260731-1817`):

```
before:  relationships.pairs → EMPTY   → density 0.0, reciprocal refs 0   → both tests 0
after:   20 relationships, avg 3.3/char, 20 reciprocal refs               → both tests PASS
```

Cast Design quality goes **60 → 100** on that run with no change to Agent 2 at all.

---

## 3. The clearance prose has a source, and it is a second injector in a second package

**A_70 §2 left this open:** *"Finding the actual source of report-style clearance prose is open work."*

**MEASURED — A_70's number is confirmed and now stronger.** `enforceSuspectEliminationPresence`'s exact template (*"…was thoroughly cleared by the evidence; the alibi confirmed…"*) appears **0 times across all four 07-31 stories** as well — **0/18 shipped stories**. A_70 §2 was right about that injector.

**MEASURED — but the prose the reviewers quoted comes from a different one.** Both 2026-07-31 external reviews named the injected clearance template as the top prose-polish drag. It is written by `buildDeterministicClearanceParagraph` / `applyDeterministicClearancePatch` in [`deterministic-repair.ts`](../../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts) — a different body, in a different package. A_70 §2 measured one injector and cleared both.

That is A_70 §3's pattern one level up. §3 catalogued *fixes aimed at a layer that runs too early*; this is a *measurement aimed at one of two bodies* — the same trap as `probe-validity-process-start-vs-dist-build` ("the A_66 vandal had 3 bodies across 2 packages").

**Consequence for the live probe.** `AGENT9_REGEN_SUSPECT_ELIM=true` is set in `.env.local` as an A_71 probe, and that is the right call — it gates more than A_70 credited, including the generate.ts pre-retry clearance shortcut, which is a real path into shipped prose. **But two of the three `applyDeterministicClearancePatch` call sites are not gated by it at all** (`repairChapterDeterministically`, `applyDeterministicStagePatches`), so the flag alone cannot remove the class.

**Fixed — the probe now has a read path.** `deterministic_clearance_paste_count` (+ the suspect names) is tallied at the **shared choke point every call site crosses**, not at any one of them — counting at one site would reproduce precisely the mistake that made A_70 §2 point at the wrong code. It is reset per run so a replay harness cannot carry one run's count into the next.

**Until that count comes back from a run, no lift figure for this lever should be quoted.**

---

## 4. Red herrings — the budget was a ceiling with no floor

**A_70 §6, MEASURED:** the 07-27 run produced **0 red herrings** where all three 07-24 runs produced 2; the same run scored `clues: 5/10`.

**ROOT CAUSE.** `redHerringBudget` was only ever enforced as a maximum — `redHerringsDontBreakLogic: redHerrings.length <= budget` — and **zero satisfies that**. Every other Agent-5 shortfall (suspect coverage, clue coverage, discriminating-test coverage) has a floor. Misdirection did not, so a response that simply omitted the array shipped unchallenged.

**Fixed**, following the suspect-coverage precedent in the same file: one bounded regeneration with feedback naming the shortfall, then continue with a loud warning either way. Deliberately **not** a deterministic synthesis — a fabricated red herring is exactly the template-injection class A_67/A_68 spent two boards removing from prose. No abort path (§2.8). Off-switch `AGENT5_RED_HERRING_FLOOR=false`, read at call time.

`fairPlayChecks` also gains `redHerringBudgetMet`, so "returned none" is no longer indistinguishable from "returned exactly what was asked for" in the artifact. `2` is now the named constant `RED_HERRING_BUDGET` rather than a literal repeated at seven call sites — which is how the same number could be honoured as a ceiling everywhere and as a floor nowhere.

---

## 5. Azure content-filter refusals — now counted

**A_70 §5, MEASURED:** 10 refusals on the 07-27 run, all on `Agent9-Regen-Ch*-missing_clue` prompts carrying the pipeline's own prose (*"a brass candlestick, its base stained with something dark"*). The never-abort gate held and the story shipped — the system degraded correctly. The problem was that the class was **invisible outside raw logs**, premise-dependent, and injects unmodelled variance into any A/B whose replays regenerate that prose.

**Instrumented, not "fixed"** — A_70 ranked it *"needs telemetry before it needs a fix"*, and that is right: the refusal is not retryable (the same prompt earns the same refusal), so a softening policy is a separate increment that should be designed against real counts rather than guessed at now.

`ContentFilterTracker` counts at the one choke point every call passes through (`AzureOpenAIClient.chat`'s error path), aggregating by agent label **and by family** — `-Ch<N>` is stripped, because chapter numbers vary run to run and the family is what recurs. The tally reaches `ctx.warnings` and a `content_filter_refusals` report diagnostic. Detection is deliberately narrow: matching a bare `content_filter` token would also catch successful calls' `finish_reason` telemetry and inflate the class into meaninglessness — there is a test pinning exactly that.

---

## 6. `entity_pronoun_drift_count` — baselined, and the comparison is confounded

A_70 §6 reported 19 and wrote, correctly: *"UNBASELINED … deserves a comparison against the 07-24 runs before anyone calls it a regression. **I am not calling it one.**"* Here is the comparison — `node scripts/pronoun-drift-baseline.mjs`:

```
2026-07-13  pre    0   s0-acoustic / s0-identity / s0-poison / s0-tide
2026-07-31  post  27   mystery-1785507417070
2026-07-31  post   6   mystery-1785512142695
   ── boundary: c1c686a5  2026-07-23 — A_66 pronoun validator rewrite ──
   pre  : n=4 mean=0.0 median=0  [0, 0, 0, 0]
   post : n=2 mean=16.5 median=27 [6, 27]
```

**The rise is not evidence of worse prose, and must not be quoted as such.** `c1c686a5` (A_66, 2026-07-23) rewrote the pronoun validator — parity-obeys-policy, the positional rule, the high-precision guard — **after** the S0 baseline. The two groups are not the same measurement. A validator that now sees more will report more.

What can be said: post-boundary counts are **6, 19, 27** — nonzero, variable, and n=3. The metric is *residual* `pronoun_drift` + `pronoun_gender_mismatch` errors surviving every deterministic repair, i.e. **what shipped**. Zero is the target and we are not at it. Getting a within-group comparison is open work; the script exists so the next person derives it rather than hand-tallying (the A_62 lesson).

---

## 7. The rubric judge now names itself on the artifact

A_70 §6 measured the judge running on `gpt-4o-mini` — the cheapest deployed model gating and capping the whole pipeline — and filed it under A_67 §3.2's open *"internal-judge sensitivity unproven"*.

**The lever already exists**: `RUBRIC_JUDGE_MODEL` (K2 §3). It is unset, so the judge silently inherits `AZURE_OPENAI_DEPLOYMENT_NAME` — today `gpt-4.1-mini`, on 07-27 `gpt-4o-mini`. **Changing the base model therefore retunes the scale that gates the pipeline, with nothing on the artifact recording that it moved**, while every cross-run rubric comparison in the ledger assumes a fixed judge.

The rubric diagnostic now carries `judge_model`, `judge_model_explicit` and `judge_model_source`, and an unset flag emits an info-band warning naming the inherited model. **Choosing a stronger judge is a spend decision and stays the owner's** — this makes the current choice visible and every past comparison auditable.

---

## 8. Verification

Typecheck clean: story-validation, llm-client, prompts-llm, worker, api, web. Dists rebuilt for the three changed packages (`worker-consumes-cml-packages-via-dist`).

New tests: report finalization + `in_progress` invariants (7), content-filter detection and tally (11), red-herring floor (7), relationship-web shape at the source (4) and through the adapter (5).

**Not done — needs LLM spend, which is the owner's call:**

- **Re-run the `AGENT9_FULLSTORY_POLISH` A/B.** A_70 §8.2's needle/haystack bug is fixed (and A_71 fixed the same bug again in AtmosphereRepair), but `results/ab-agent9_fullstory_polish/` is still dated 07-27 — the craft question the probe was built to answer is still unanswered. ~£4–8, pool built, harness proven.
- **A fresh run + external read.** Everything in §1–§5 above changes what the artifacts *say*; only a run shows whether the A_71 prose work moved the mark. ~£1.50. It would also return the first `deterministic_clearance_paste_count` and a third post-boundary pronoun-drift figure.

---

## 9. The through-line

A_68 concluded every craft fix needs a detector or it doesn't stick. A_70 extended it: every detector needs a verified read path, or the number it produces is worse than no number. **A_71 adds the third turn of the same screw:**

> **A detector's read path must be verified against real data, not against the declared contract.**

Every defect in §1–§3 was a reader guarding on a shape or a rule that the data has never satisfied — a `phase_thresholds_met` rule written before the field existed, a `.pairs` key the model has never emitted, an injector template that ships from a different module. All three failed **silently and confidently**: no error, no warning, just a number that was wrong in a stable direction for weeks. Cast Design "failed" 100% of runs. The reports "passed" at 96.

The cheapest guard against the whole class is the one this doc used throughout: **before trusting a metric, open one real artifact and check the value is actually there.**
