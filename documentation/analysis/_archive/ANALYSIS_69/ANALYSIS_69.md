# ANALYSIS_69 — The final-polish pass: what a frontier model on the whole story is worth, and how to spend it

**Written:** 2026-07-25 · **Trigger:** owner's question — *"how much would it cost to put the full final story through the most capable AI model once, asking it to polish but keep the content the same?"* · **Regime:** corpus era (A_63 §2.8) — behaviour levers ship flag-gated default-OFF, probed before promotion; runtime env getters, never module consts.

**Type:** decision + plan doc. The costing is measured from a real run; the plan is three increments, cheapest first, and one explicit non-goal. **Increments 2 and 3 built, tested, default-OFF (§8). One smoke probe run 2026-07-25 (§9) — it corrected the price by ~10×, exposed a placement bug now fixed, and surfaced a real shipping defect (raw clue IDs in the prose). The powered A/B is still unrun.**

---

## 1. What "the full story" actually is (measured, not estimated)

From run `477bb27a` (`documentation/prompts/actual/run_20260724-1715_477bb27a/`), parsing the accepted chapter JSON and counting `paragraphs` only:

| Sample | Net prose words | Net prose chars |
|---|---|---|
| Ch7 (`ProseGenerator_retry2`) | 1,204 | 7,432 |
| Ch10 (`ProseGenerator_retry1`) | 1,454 | 8,780 |

**~1,330 words/chapter × 10 chapters ≈ 13,300 words ≈ ~81,000 chars ≈ ~20k tokens.**

Two caveats on the measurement: the other eight chapters' newest artifacts are `AtmosphereRepair` patches (~100–160 words — deltas, not full chapters) or regen envelopes that don't parse to a `chapters[]` shape, so the per-chapter figure is an average over two clean samples, not a census. And chapter length is a live variable — `chapterWordCounts` / the underflow telemetry in `generate.ts` track hard-floor and preferred-target misses per run. Treat **13k words / 20k tokens** as the planning figure, ±15%.

**The load-bearing arithmetic:** a "polish but keep the content the same" pass returns the *whole text back*, so **output ≈ input ≈ 20k tokens**. Output is priced ~5× input across every current tier. **Output dominates the bill, and output is also where the risk lives.** Every decision below follows from that one line.

### 1.1 Cost of the naive one-shot

| Price tier (in / out per M tok) | Input 20k | Output 20k | **Total** |
|---|---|---|---|
| $15 / $75 (top flagship) | $0.30 | $1.50 | **~$1.80 (~£1.40)** |
| $5 / $25 (current flagship tier) | $0.10 | $0.50 | **~$0.60 (~£0.47)** |
| $3 / $15 (mid tier) | $0.06 | $0.30 | **~$0.36 (~£0.28)** |

> **ASSUMPTION — unconfirmed.** The per-M rates above are stated from tier shape, not from a checked price sheet (the pricing-reference lookup was declined mid-session). Confirm the live Azure per-M rates for whichever deployment gets chosen before budgeting on these. The *ratios* and the output-dominates conclusion hold regardless of the absolute numbers.
>
> Related: `report-total-cost-underreports-7x` — do **not** audit this from `report.total_cost`. Audit via `llm-prompts-full.jsonl` chars/4 × price.

**Anchor:** a full fresh pipeline run is ~£1.50 true cost. So a single whole-story polish pass is **at most comparable to a whole run, and likely a third of it**. This was never a budget question. It's a quality-and-risk question.

---

## 2. The finding the costing exposed

Checking which model the pipeline actually uses (`.env.local`) turned up the more interesting fact:

```
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini          # base: design, judges, classification
AZURE_OPENAI_DEPLOYMENT_NAME_PROSE=gpt-4.1         # Agent 9 prose
AGENT9_MODEL_GENERATE=gpt-4.1
AGENT9_MODEL_REWRITE=gpt-4.1
```

So: **every word of shipped prose is written by `gpt-4.1`, one chapter at a time.** No stage in the pipeline has ever seen all ten chapters at once, and no stage has ever run on anything stronger than 4.1.

That means the owner's question silently bundles **two independent axes**, and they have very different costs and very different risks:

| Axis | What it buys | What it costs | Risk |
|---|---|---|---|
| **(a) Model tier** — 4.1 → frontier | Sentence-level craft: diction, rhythm, period voice | Only on the tokens you route to it | **Low** — same call shape, same guards |
| **(b) Context breadth** — chapter → whole story | Cross-chapter: repetition, opening monotony, pacing drift, motif death | Only input tokens, *if* you keep output narrow | **High if you also widen output** |

Conflating them is what makes the one-shot look attractive and makes it dangerous. **Separate them and you can buy (a) almost for free and (b) for pennies.**

---

## 3. Why the naive one-shot is the wrong shape

Not because of the money. Three reasons:

1. **It bypasses every gate you own.** The validators, the pre-commit prose gate, the scaffold detectors, the pronoun sweep, the locked-fact presence checks — all of them are per-chapter. A 20k-token blob returned from one call has no gate it can be fed through as-is.
2. **20k tokens of generation drifts, and the drift is back-loaded.** Compression, dropped clue plants, tense and pronoun slippage in the last third — precisely the failure families A_68 §8 catalogues, and precisely what `hasRepetitionRewriteRegression` and `polishPassingChapter`'s rollback exist to catch. A one-shot has neither.
3. **It pays the expensive half of the bill for chapters that needed nothing.** You are buying 20k output tokens to change, realistically, four chapters.

**The principle:** *global reading is cheap and safe (input tokens, no drift). Global writing is what costs 5× and bypasses every gate.* Any middle path should keep the model's **eyes wide and its hands narrow**.

---

## 4. What already exists

The happy medium is not a thing to design. Most of it is built and switched off.

| Machinery | Where | Status |
|---|---|---|
| Per-chapter validator-gated LLM line-edit, with rollback | `polishPassingChapter` (`post-pass-polish.ts`) | **ACTIVE**, gated to provisional<95 chapters |
| Polish on retried chapters regardless of attempt | `AGENT9_POLISH_RETRIED_CHAPTERS` ([generate.ts:3129](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3129)) | built, **default-OFF** |
| Polish on high-leakage chapters, bypassing the <95 gate | `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` ([generate.ts:3139](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3139)) | built, **default-OFF** |
| **Whole-story repetition map → per-chapter guarded rewrite** | `runFullStoryRepetitionPolish` ([post-pass-polish.ts:374](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L374)), `AGENT9_FULLSTORY_POLISH` ([generate.ts:4355](../../packages/prompts-llm/src/agent9-prose/generate.ts#L4355)) | built (586cb270), **default-OFF** |
| Per-stage model router | `resolveStageModel` (`model-tiering.ts`) — stages `generate` / `rewrite` / `critique` / `regen` | **ACTIVE** |

> **Correction to A_68 §8.4:** it lists the full-story cross-chapter polish as *"Deferred (designed, not built)"*. It was built and committed the same day (586cb270). That line is stale.

**`AGENT9_FULLSTORY_POLISH` is already the read-globally/write-locally shape**, and it is more disciplined than anything sketched from scratch:

- Detection is **deterministic and free** — `detectRecurringPhrases` + `buildRepeatedOpenings` sweep all ten chapters for zero tokens. That is where the whole-story view comes from.
- Rewriting is **per-chapter calls**, only for chapters carrying a hit ([post-pass-polish.ts:396-410](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L396-L410)); each call sees one chapter and only its local phrases.
- Cost is **explicitly bounded** — `maxChaptersPerPhrase` defaults to 2, so a phrase in six chapters fans out to two calls, not six.
- `hasRepetitionRewriteRegression` guards locked values, cast names, number/time tokens and length, with **rollback to committed text**; the whole thing is try/catch'd so a failure keeps the originals.

**Its limit:** it only covers *repetition* — recurring n-grams and opening-shape monotony. It cannot see pacing drift, tonal escalation, or a motif that dies in chapter 6. That gap is Increment 3.

---

## 5. The plan

### Increment 1 — Flip what is already built *(zero new code)*

Probe `AGENT9_FULLSTORY_POLISH=1` together with `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS=1`, on a matched premise.

Rationale: this is the cross-chapter axis, already guarded, already cost-bounded. Nothing to review, nothing to merge. If it moves the prose mark, the rest of the plan is a refinement rather than a bet.

**Cost:** ~4 targeted chapters × (~2.8k tok in, ≤5k tok out per `maxTokens`) ≈ **£0.25–0.75** at 4.1 rates. Also worth running with `AGENT9_POLISH_RETRIED_CHAPTERS=1` per A_68 §7.2 if the run has retried chapters.

### Increment 2 — Add a `polish` stage to the model router *(small, flag-shaped, highest quality-per-pound)* — **BUILT**

Add `polish` to `Agent9Stage` in `model-tiering.ts` → `AGENT9_MODEL_POLISH`, and route `polishPassingChapter` + `runFullStoryRepetitionPolish` through `resolveStageModel("polish", inputs.model)`. Both call sites already take a `model` argument and thread it into `logContext` — this is a resolution change, not a plumbing change.

*Built as described.* Resolution happens **inside `post-pass-polish.ts`**, mirroring `critique-rewrite.ts` — so a future polish call site picks the tier up automatically rather than having to remember to.

**Why this is the best lever in the doc:** it buys axis (a) — frontier craft — *only on polish output*, which is a small fraction of total generation output. Generation stays on `gpt-4.1`; the reliability profile of the run is untouched. The router already falls back to the caller's default when unset, so an unset flag is a guaranteed no-op.

**Prerequisite:** a frontier deployment must exist on the Sweden resource (`openai-ds1sweden`). Today only `gpt-4o-mini` / `gpt-4.1-mini` / `gpt-4.1` are configured. **This is the one hard blocker in the plan** — Increment 2 is untestable until a deployment is provisioned, so the code can land flag-gated but the probe waits.

**Cost:** ~4 chapters × (~2.8k in / ~2.5k out) at frontier rates ≈ **£0.30–0.95**.

### Increment 3 — Whole-story read-only diagnostic → per-chapter guarded edit *(new, flagged, `AGENT9_FULLSTORY_DIAGNOSTIC`)* — **BUILT**

Closes the gap Increment 1 leaves — the cross-chapter axes no deterministic detector models.

1. **One whole-story call, read-only.** All ten chapters in (~20k tok), a **findings list** out (~1.5k tok), each finding anchored to `{chapter, quote, class}` over a fixed enum: `pacing_drift`, `tonal_escalation_missing`, `motif_abandoned`, `voice_inconsistency`, `flat_reveal`. **The model emits zero prose.** Output is tiny, so this is the cheap half — ~£0.14–0.40 even at top-tier rates.
2. **Route findings into the existing per-chapter path.** Each flagged chapter goes through `polishPassingChapter` with its findings appended to the polish prompt — same validator, same rollback, same guards. Chapters with no finding are never touched.

Design constraints, non-negotiable, matching the existing pass:
- Anchored findings only — a finding whose `quote` is not found verbatim in the named chapter is **discarded**, not repaired. No unanchored global judgement reaches an edit.
- Reuse `hasRepetitionRewriteRegression`-class guards: locked values, cast names, number/time tokens, length.
- Best-effort try/catch; any failure keeps committed chapters. **Never introduces abort risk** (§2.8 never-abort release gate).
- Default-OFF, runtime env getter — `module-const-flags-frozen-before-dotenv`; verify the lever by its agent label in `llm-prompts-full.jsonl`, not by grep.

### Non-goal — explicitly not building

**One-shot whole-story regeneration.** For §3's three reasons. If it is ever wanted, it belongs behind its own flag as a *comparison arm in a probe*, never on a shipping path.

*Built as described, with one addition:* `AGENT9_FULLSTORY_DIAGNOSTIC` is **mode-valued** (`off` | `shadow` | `apply`) rather than boolean, following the `AGENT9_VOICE_ENFORCE` precedent — and `true`/`1` deliberately map to **`shadow`, not `apply`**, so a lever this new can never start editing prose because someone set it to a boolean. Reaching `apply` requires typing the word.

---

## 6. Cost summary

| Increment | New code | Cost/run | Buys |
|---|---|---|---|
| 1 — flip existing flags | none | £0.25–0.75 | cross-chapter repetition + opening monotony |
| 2 — `AGENT9_MODEL_POLISH` | ~small | £0.30–0.95 | frontier sentence craft, generation untouched |
| 3 — read-only diagnostic | new pass | £0.15–0.40 diag + per-chapter edits | pacing / tone / motif / voice |
| *(rejected)* one-shot | — | £0.28–1.40 | everything, ungated, drift-prone |

All three together land in the same band as the rejected one-shot — **and are gated, bounded and reversible.** That is the whole argument.

> **These are per-run *feature* costs, not *probe* costs.** Proving a flag costs far more than running it: one A/B is 4 matched pairs × 2 arms = **8 Agent-9 replays**. See §7.3.

---

## 7. Probe plan

### 7.1 The probe surface already exists

`scripts/exp-regen-clue-ab.mjs` — despite the name, it was generalized (roadmap S11) to **any single Agent-9/6 flag** via `--flag <NAME>`. It replays Agent 9 over a prior run's hydrated upstream artifacts **twice**, control then treatment, through `canary-agent-boundary.mjs`. Because the hydrated Agent-7 outline is identical across arms, **each pair is matched by construction on chapter count + opening-naming** — precisely the two factors `canary-k2-single-run-confounded` says dominate. It warns and marks the pair invalid if Agent 7 had to be re-synthesised.

```
node scripts/exp-regen-clue-ab.mjs --runIds R1,R2,R3,R4 \
    --flag AGENT9_FULLSTORY_POLISH --treatmentValue true --controlValue false \
    --agents 9 --out results/ab-agent9_fullstory_polish
node scripts/exp-regen-clue-analyze.mjs --in results/ab-agent9_fullstory_polish
```

**No fresh full-pipeline run is needed per arm** — Agent-9-only replay. That is what makes this affordable.

### 7.2 Correction to §5 Increment 1 — two A/Bs, not one bundled flip

The harness enforces **one flag toggled per arm, never two**, and it is right to: bundling `AGENT9_FULLSTORY_POLISH` with `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` would reintroduce the exact confound §2 warns about, one layer down. **Increment 1 is therefore two sequential single-flag A/Bs**, `AGENT9_FULLSTORY_POLISH` first (it is the cross-chapter axis the whole doc is about).

### 7.3 Blocker — the replay pool is N=3

The harness hard-requires **≥4 runIds**. Only three hydratable run folders exist:

| Run | Agent7 outline | Hydratable |
|---|---|---|
| `run_20260724-1226_e68c8118` | ✓ (2) | yes |
| `run_20260724-1634_6dc1ee3a` | ✓ (1) | yes |
| `run_20260724-1715_477bb27a` | ✓ (1) | yes |

So **one fresh full run must be generated first** to reach N=4. Do not weaken the ≥4 requirement — it encodes the canary-k2 lesson and is the reason these results would be trustworthy.

**Probe cost, honestly:**

| Step | Work | Est. cost |
|---|---|---|
| Build pool to N=4 | 1 fresh full pipeline run | ~£1.50 |
| A/B `AGENT9_FULLSTORY_POLISH` | 8 Agent-9 replays | ~£4–8 |
| A/B `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | 8 Agent-9 replays | ~£4–8 |
| **Total Increment 1 probe** | | **~£10–18** |

### 7.4 Sequence

1. **Rebuild before every arm.** `probe-validity-process-start-vs-dist-build` — Node caches modules at startup; a mid-run rebuild never reaches the run. `worker-consumes-cml-packages-via-dist` — green vitest ≠ current dist. *(Done 2026-07-25: `@cml/clue-spec` dist was stale by ~1 min against src; rebuilt clean. All other package dists current.)*
2. **Flag read-time verified** *(done)*: both levers are inline `process.env` reads inside function bodies ([generate.ts:4355](../../packages/prompts-llm/src/agent9-prose/generate.ts#L4355), [generate.ts:3139](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3139)) — not module consts, so `module-const-flags-frozen-before-dotenv` does not apply. Still confirm the lever fired by its agent label (`Agent9-FullStoryRepetitionPolish-Ch<N>`) in `llm-prompts-full.jsonl`, not by grep.
3. Generate run #4 → run A/B #1 → analyze → run A/B #2 → analyze.
4. **Acceptance:** prose mark up; **zero rollbacks firing on locked values, cast names, number/time tokens or length**; no new `locked_fact_absent` regens downstream; no pair invalidated by a re-synthesised Agent 7.
5. **Increment 2** once a frontier deployment exists. Same pool, only `AGENT9_MODEL_POLISH` differs. Acceptance: prose mark up at ≤2× polish-stage cost, generation telemetry unchanged.
6. **Increment 3** shadow-first — run the diagnostic, log findings, **apply nothing**. Read them by hand across ≥3 runs. Promote to applying only once the anchored-finding discard rate and false-finding rate are known.
7. Audit real cost from `llm-prompts-full.jsonl`, never `report.total_cost`.

---

## 8. Implementation status + verification *(2026-07-25)*

Increments 2 and 3 built. **Every lever default-OFF; an unset env is a guaranteed no-op.** No probe run, no LLM spend.

| Change | File | Flag | Default |
|---|---|---|---|
| `polish` model-router stage | `agent9-prose/model-tiering.ts` | `AGENT9_MODEL_POLISH` | unset → caller's prose deployment |
| Polish passes routed to that tier | `agent9-prose/post-pass-polish.ts` (both call sites) | — | inherits above |
| Whole-story diagnostic + guarded repair | `agent9-prose/full-story-diagnostic.ts` (new) | `AGENT9_FULLSTORY_DIAGNOSTIC` | `off` |
| Diagnostic wiring at the **ship layer** | `apps/worker/.../agent9-run.ts`, after every rewrite pass and after the hard-stop throw (see §9.2 — it was in `generate.ts` and that was wrong) | — | gated by above |
| Cross-chapter polish telemetry | `generate.ts` `phraseTelemetry` + `canary-agent-boundary.mjs` dump | — | always recorded |

**Design notes worth carrying forward:**
- The diagnostic emits **no prose** — `maxTokens: 2000` is the structural guardrail, not just a cost bound.
- **Anchored findings only.** `anchorFullStoryFindings` discards any finding whose quote is absent from the chapter it names, after normalising curly quotes, dashes and whitespace (the model re-types quotes; the *words* must still match). Discards are counted separately in telemetry — that count **is** the hallucination rate, and it is the number to read before ever promoting to `apply`.
- Repair reuses `hasRepetitionRewriteRegression` — locked values, cast names, number/time tokens, length — with rollback to committed text.
- Cost bound: at most 5 chapters repaired, most-flagged first, so a diagnostic that flags everything cannot become a whole-story rewrite through the back door.
- Both passes best-effort try/catch; **no path introduces abort risk** (§2.8 never-abort release gate).
- Telemetry lands on `validationDetails.fullStoryDiagnostic`: mode, finding count, discarded count, malformed count, per-class breakdown, edited and rolled-back chapters.

**Verification:** typecheck clean (prompts-llm, worker). **prompts-llm 874** (+33 new), **worker 361**, both green; `@cml/clue-spec` and `@cml/prompts-llm` dists rebuilt. New tests pin: mode resolution incl. `true`→shadow-not-apply; tolerant parse and the closed class enum; anchoring incl. quote-drift tolerance, absent quote, right-quote-wrong-chapter, out-of-range chapter; diagnostic no-call when off, failure without throwing, polish-tier routing; repair rollback on dropped locked value / dropped cast name / unparseable response, and the `maxChapters` cap picking the most-flagged chapter.

## 9. Smoke probe *(2026-07-25)* — one Agent-9 replay, both levers on

**Not the A/B.** One unmatched replay of run `477bb27a` (`--agent 9`, `AGENT9_FULLSTORY_POLISH=true`, `AGENT9_FULLSTORY_DIAGNOSTIC=shadow`). It cannot say whether the prose mark moved; it says whether the levers fire, what they produce, and whether the wiring is right. It answered all three, and the third answer was "no".

**Ran clean:** exit 0, `CANARY_STATUS success`, 10 chapters, **14,124 words**, 12.2 min, `gpt-4.1`.

### 9.1 The §1 estimate held; the §6 price did not

Predicted ~13,300 words / ~20k tokens. Measured: 14,124 words, and the diagnostic call billed **18,874 prompt + 734 completion tokens** in 6.9s.

But §6 priced frontier tiers, and **the pipeline runs `gpt-4.1`**. At gpt-4.1 list ($2/M in, $8/M out):

| | Tokens | Cost |
|---|---|---|
| Read-only diagnostic (measured) | 18.9k in / 0.7k out | **~$0.04 (~£0.03)** |
| One-shot whole-story polish | ~19k in / ~19k out | **~$0.19 (~£0.15)** |

So the original question — *"put the full final story through the model once"* — costs about **15p**, not the £0.28–1.40 of §1.1. The 4:1 output-dominance holds; the absolute figure is an order of magnitude smaller. The logged `estimatedCost` was $0.0083 against $0.0436 at list — a **5.2× under-report**, consistent with `report-total-cost-underreports-7x`. Do not budget from it.

### 9.2 The placement bug — the probe's real payload

The diagnostic was wired into `generate.ts`. **Prose keeps changing after `generate.ts` returns:** `Agent9-Regen-Ch9-scaffold_not_prose` ran **twice, after the diagnostic**, and replaced chapter 9 wholesale. Two of five findings therefore pointed at text that never shipped. Measured against the final output the anchor rate was **3/5 (60%)**.

The guard caught it unaided — it exists to catch hallucination and caught *staleness* instead, discarding both dead findings rather than acting on them. Same mechanism, a failure mode the design hadn't anticipated.

**Fixed:** the pass now lives at the end of `agent9-run.ts`, after every rewrite layer (scaffold regen, leakage regen, the deterministic injectors, NSD-anchor planting, pronoun sweeps) and **after the hard-stop throw** — so a story that will never ship never costs a diagnostic call.

**Verified empirically** (one diagnostic call against the final shipped chapters, ~£0.03, no regeneration): **4 findings, 0 discarded — 100% anchor rate**, up from 60%. The 60% was staleness, not hallucination.

### 9.3 The diagnostic found a real shipping defect

Among the anchored findings, ch4 `motif_abandoned`: *"The cryptic 'rh_1' and 'rh_2' notations are introduced as significant clues but are never explicitly resolved."*

**`rh_1` is a red-herring clue ID.** It appears verbatim twice in the shipped prose, dramatized as story content:

> *"The phrase 'rh_1' was scribbled in the margin, as if meant to draw attention. In a remembered moment, He could not help but wonder if this 'rh_1' pointed toward a threat within the household…"*

The run warned `NSD batch 4-4: clue(s) marked revealed but no prose evidence anchor found: rh_1, rh_2` — but nothing stopped the identifier reaching the page. (The same sentence also carries the `"in a remembered moment"` filler A_68 §8.4 names, plus a mid-sentence capitalisation break.) **No existing detector caught this; the diagnostic did, on its first run.** A raw-identifier linter is the obvious cheap follow-up and is its own increment.

### 9.4 The repetition polish fired and its edits shipped

Targeted **Ch4 and Ch10**, and both rewrites **survived the rollback guard into the final output**. It caught that both chapters opened on the same shape and varied them:

> Ch4 *"Ticking from the grandfather clock echoed…"* · Ch10 *"A measured chime from the grandfather clock resonated…"*

Honest read: it varied the *words* and not the *image* — both chapters still open on the grandfather clock. The detector works on n-grams, so that is the ceiling of what it can fix. Worth knowing before reading too much into a prose-mark delta.

### 9.5 Telemetry gap — fixed

Neither full-story lever reached the prose dump: `runFullStoryRepetitionPolish` returned `editedChapters` and `generate.ts` discarded it, and the diagnostic telemetry landed on `validationDetails`, which the boundary dump did not carry. **Every number in §9 above had to be reconstructed from `logs/llm.jsonl` by hand** — which does not scale to the 8 arms of an A/B. Both now surface as `fullStoryDiagnostic` and `fullStoryPolish` in the dump payload (`canary-agent-boundary.mjs`), and the anchoring-discard count is also pushed to `ctx.warnings`.

## 10. Open questions for the owner

1. **Which model is "most capable" in this stack?** The pipeline is Azure OpenAI end-to-end. A frontier Azure deployment keeps one provider and one client; anything else means a second client path in `packages/llm-client`. This decision gates Increment 2.
2. **Is the polish budget per-run or per-release?** If a story is only externally scored once, Increment 3's diagnostic could be a **release-time** pass over the final story rather than an in-pipeline stage — same code, different call site, and it would then run on maybe one story in five rather than every run.
3. **Start at 1, or 1+2 together?** Recommendation: **1 alone first.** It is free, it is already built, and it isolates the context-breadth axis from the model-tier axis — which is exactly the confound §2 warns about.
