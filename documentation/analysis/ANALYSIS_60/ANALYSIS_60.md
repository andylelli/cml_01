# ANALYSIS_60 — run-review: *The Sundial's Shadow*

**Run:** `run_0d45c651-e0ce-4503-8d6f-00c97c7d82d3` · project `proj_e89c6a56` · 2026-07-01 11:45.
**Outcome:** `aborted` at story validation — **overall 74 / C**, `passed: false`, **0 critical / 11 major**. Full pipeline completed (all 10 chapters generated); the abort is a *release-gate* decision, not a generation crash.
**Case:** sundial-trap murder — victim Eleanor Braithwaite, culprit Charles Hargreaves; weapon a **spring-loaded blade trap** at the base of the gnomon; month **August** (the prose correctly establishes *"midsummer sun"*).

## Thesis

Two headlines:

1. **The Phase-0 beat-abort fix is validated in a live run.** Agent 7 emitted a clean 10-scene outline and the pipeline ran end-to-end with no schema abort (contrast `run_01150a9f`, which died at Agent 7). Beat coercion is working in production.
2. **The abort is a single dominant FALSE POSITIVE.** The weapon is a *spring-loaded blade*; the temporal validator's mechanical-spring stripper doesn't cover that vocabulary, so `august vs spring` false-fires on every chapter naming the weapon, is **structurally unrepairable** (the season-lock correctly *protects* mechanical springs, so it can never converge), and accounts for the majority of the 11 majors. **The prose contains no seasonal "spring" and even says "midsummer sun."** Absent this one FP class, this is a releasable draft.

Everything else in the log is either (a) known recurring prose-layer debt the LLD P3–P5 work targets, absorbed this run by retries + the deterministic injector layer, or (b) a known issue whose prior fix silently fell short. Catalogue below, **by agent → type → known-issue linkage → where the previous fix fell short.**

---

## Issue catalogue

### Agent 7 — Narrative outline

| # | Type | Detail | Known issue | Status / where prior work stands |
|---|---|---|---|---|
| 7.1 | *(resolved)* | Beat-enum abort did **not** recur. Outline scenes=10, scheduler grid complete/ordered, mechanism gate withheld full mechanism in 8 pre-test scenes (reveal from scene #9). | `run_01150a9f` beat abort; memory `agent7-beat-enum-no-deterministic-coercion` | **Fixed this session** (deterministic `coerceNarrativeSceneBeats` + example gating). This run is the confirmation. No new Agent-7 issue. |

### story-validation / temporal — the run-blocker

| # | Type | Detail | Known issue | Where the prior fix fell short |
|---|---|---|---|---|
| **V.1** | **False-positive validator, unrepairable** | `month/season contradiction (august vs spring)` fires on **ch1, ch3, ch8, ch10 + scene-10** (≈15 occurrences in the report — the plurality of the 11 majors). Every "spring" in the prose is **mechanical**: *"a spring or a blade"*, *"a spring, perhaps, or a blade"*, *"spring-loaded blade"*, *"mechanical spring-loaded blade trap"*. The prose establishes *"midsummer sun"* — there is **no seasonal spring**. Because the Agent-9 season-lock (correctly) protects mechanical springs, the rewriter won't touch them, so the chapter **can never converge** → burns all retries → best-effort commit → still flagged at final validation → abort. | Season-lock keystone (A_50: "season-lock killers did not recur"; origin A_28/A_49). The `SPRING_MECHANICAL_RE` stripper ([temporal-consistency.ts:56](../../packages/story-validation/src/temporal-consistency.ts#L56)) exists **precisely** for this clock-spring collision. | **The stripper covers clockwork springs but not this weapon's vocabulary.** Two concrete gaps: (a) line 61 uses `springs?\s+(?:…loaded…)` — **whitespace only**, so hyphenated **"spring-loaded"** is never stripped; (b) **"a spring or a blade"** (bare mechanical spring) matches no branch. A *sundial/blade-trap* mechanism was outside the clock-centric seed vocabulary. This is a **regression of the exact false-positive class the stripper was built to prevent**, on a new mechanism family. |

### Agent 3b / Agent 3 — mechanism plausibility

| # | Type | Detail | Known issue | Where the prior fix fell short |
|---|---|---|---|---|
| M.1 | Implausible hard-logic physics | Core mechanism/clue: *"thermal expansion in a tightly fitted brass catch on the sundial's gnomon in early afternoon"* triggers the trap and *"contradicts the assumption the trap could have triggered before noon."* A brass catch's thermal expansion producing a decisive timing shift is physically marginal. | **A_59 #5 / P1** ("implausible sundial physics — brass expansion → 10-min shift"); LLD **P0.5** (Agent 3b magnitude-plausibility check). | **P0.5 is planned, not landed** (LLD tracker: lives outside the Agent-9 prose scope, `AGENT3B_PLAUSIBILITY_JUDGE` not built). The same implausible thermal-expansion device recurs verbatim. |

### Agent 9 — prose generation (known prose-layer debt; LLD P3–P5 targets)

| # | Type | Detail | Known issue | Where the prior fix stands |
|---|---|---|---|---|
| P.1 | Verbatim schema transcription | **ch6** copied the clue descriptions verbatim — **32 consecutive words** from the thermal-expansion clue and **21 words** from *"Charles Hargreaves showed premeditation … sundial maintenance logs."* First attempt had the clue **absent**; the model then **over-corrected into transcription** (missing ⇄ verbatim oscillation). | **A_59 #1/#4, A_57 D4** (injection/verbatim leakage); verbatim-echo detector. | Detector fired (good) but there is no in-scene repair — **LLD P3 `AGENT9_REGEN_CLUE`** is the intended replacement and is **default-off** (not exercised here). The N≥4 A/B for it is staged (`scripts/exp-regen-clue-*`), not yet run. |
| P.2 | Fair-play sequencing | **ch8**: *"concealment mechanism explained before the discriminating-test scene."* Recovered on retry 2. | Mechanism-reveal gate (Agent 7 gate + Agent 9). | Gate caught it; cost = one extra LLM retry. Working as designed, but generation keeps producing early reveals. |
| P.3 | Clearance presence (injector) | **ch9**: suspect clearance missing for **Thomas Grey** → `Deterministic clearance patch applied … inserted 1 suspect-clearance paragraph`. Also a `false clearance` advisory. | LLD **A3/B7** clearance injectors; **P0.4** (route A3/B7 through micro-regen). | The **deterministic injector shipped a clearance paragraph** — exactly the inject-prose behavior P0.4/P4 converts to regen. Not yet converted. |
| P.4 | Resolution presence (injector) | **ch10**: *"no resolution event detected"* on attempt 1 → recovered via best-effort. | LLD **B6** resolution injection/backstop; **A_58 P0** (ch10 reveal non-convergent). | Recurs; B6 backstop remains the safety net. Same class A_58 flagged; still generation-fragile. |
| P.5 | Pronoun drift | `Deterministic pronoun sweep: 21 repair(s) across 10 chapters` — high. Note `pronoun_policy=off` disables the *inline* repair, yet the whole-object sweep still made 21 fixes. | **A_57 D5 / A_59 #2**; memory `canary-k2-single-run-confounded`. | Sweep is load-bearing; 21 repairs signals substantial generation-time gender instability the Bible-locked pronouns (LLD P1) are meant to remove at source. |
| P.6 | Locked-fact injection | `enforceLockedFactValuePresence: injected canonical locked-fact value mention(s): 6` (×2); `repairWordFormLockedFacts` digit→word ×1–2. | LLD **B3 / B2** injectors. | Injection layer active as designed; another inject-prose site slated for P4 conversion. |
| P.7 | Retry burden / masking | `6/10 batches required retry`; completion-first best-effort commits on ch1, ch3, ch6, ch10 **downgraded residual issues to warnings**. | Completion-first severity (A_55/A_58). | Best-effort correctly prevents a hard death, but it **masks the V.1 season FP as a warning per-chapter** while it still counts at final validation → abort. The masking hides how much of the 11 majors is one FP class. |

### Agent 3 / Novelty — shadow telemetry

| # | Type | Detail | Known issue | Where the prior fix fell short |
|---|---|---|---|---|
| N.1 | Path resolution / stale dist | `[Novelty skeleton-judge SHADOW] skipped: ENOENT … 'C:\CML\node_modules\schema\novelty_fingerprint.schema.yaml'`. `loadReferenceCorpus()` resolves the schema against `packageRoot()/../../` = `C:\CML\node_modules\schema\…` (wrong base) instead of `C:\CML\schema\…`. Guarded skip — non-fatal, but the shadow judge **never runs → no telemetry**. | **A_58 #5** (identical symptom); memory `novelty-judge-needs-skeleton-extractor` (promote only after shadow telemetry tracks the LLM audit). | **A_58 declared this fixed** — the `findUp` schema-path fix was written in [loader.ts](../../packages/novelty/src/loader.ts) src, "just rebuild `@cml/novelty` dist + commit." **The dist was never rebuilt** (memory `worker-consumes-cml-packages-via-dist`) — the worker still runs the old throwing version, so it *still* ENOENTs on the exact same path. A_58's acceptance ("next run logs a NoveltySkeletonJudge verdict, no `skipped: ENOENT`") is **unmet**. The src fix is real; the delivery step (dist rebuild) fell through. |

---

## Cross-cutting patterns

- **The mechanism family drives three separate issues.** A *spring-loaded blade on a sundial gnomon* causes: V.1 (season FP on "spring"), M.1 (implausible thermal-expansion timing), and P.1 (verbatim transcription of the awkward mechanism clue). A more plausible, more nameable mechanism (P0.5) would reduce all three.
- **"Fix written ≠ fix shipped" recurs.** N.1 is the second time (A_58 → A_60) a *src-level* novelty fix hasn't reached the running dist — the `worker-consumes-cml-packages-via-dist` trap. Any @cml/* src fix needs a dist rebuild in the same change to actually take effect.
- **Best-effort masking obscures triage.** Per-chapter, the season FP is downgraded to a warning; only at final validation does it aggregate into the 11 majors. The run log makes the story look broadly broken when it is one unrepairable FP class plus known prose debt.

## What actually blocks release (ranked)

1. **V.1 season false positive** — the *only* new, run-aborting defect. Deterministic, well-scoped fix (extend `SPRING_MECHANICAL_RE` for `spring-loaded` (hyphen) + `spring … blade` trap vocab, with tests guarding against over-stripping real seasonal "spring"). Highest value: converts this run from `aborted` toward release.
2. **N.1 novelty dist** — one rebuild (`@cml/novelty`) restores shadow telemetry; unblocks the memory's promotion path. Trivial.
3. **M.1 sundial physics (P0.5)** — reduces V.1/M.1/P.1 at the source; medium effort (Agent 3b plausibility judge).
4. **P.1–P.7** — the standing prose-layer debt; owned by the LLD P1 (Bible-locked pronouns/facts) and P3–P5 (inject→regen) migration, already designed and staged.

*No issue in this run is attributable to the Phase-0 beat fix or the AGENT9_REGEN_CLUE staging.*

---

## Root-cause reframe — pre-resolution works; the leak is *re-derivation*

A tempting reading of V.1 is "resolve the season before prose." But the season **is** already resolved before prose and locked in the prompt: a **`## Season Lock (mandatory)`** block ([prompt-builder.ts:322](../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L322)) derives the season from `specificDate`, states *"Season: summer"*, and hands the model an allowed-vocabulary list. It **worked** — the prose wrote *"midsummer sun."* Pronouns have the same treatment (the pronoun-lock block); locked facts are handed verbatim.

So the failing layer is not pre-resolution. **It is the checkers and repairers that re-derive a fact from raw prose instead of dereferencing the frozen value the generator already used:**

- The **season validator** re-derives season from prose text and guesses at a *hand-maintained regex* of mechanical-spring exceptions ([`SPRING_MECHANICAL_RE`, temporal-consistency.ts:56](../../packages/story-validation/src/temporal-consistency.ts#L56)). It knows clockwork vocabulary; it does **not** know *this* case's mechanism is a "spring-loaded blade," so it mis-reads the machine part as the season. Every new mechanism family reopens the hole → whack-a-mole.
- The **pronoun sweep** (21 repairs) and **locked-fact injector** (×6) repair generation drift *after* the fact rather than the model being fully rail-locked to the frozen Bible up front.

**The governing rule for all of this (season, pronouns, locked facts) is one line:**

> **Deterministic checkers and repairers must dereference the frozen Bible fact — never re-derive it from the prose.**

This is LLD §6.1's rule ("the Bible must be the *only* dereference; anything that re-derives re-introduces drift") — today applied to prompts but **not to the validators**. The "super-easy" mechanism the mystery already owns: it *declares its own mechanism vocabulary* (hard-logic devices, the discriminating-test object, weapon nouns). Feed that to the season checker and "spring" adjacent to a declared mechanism object is mechanical **by construction** — no per-mechanism regex ever again. Pronoun/locked-fact churn falls the same way once the checkers read `bible.voices`/`bible.clock` instead of scraping prose.

---

## Phased fix plan — test-run after each phase

Three phases, each independently shippable and **test-runnable with one full `npm run canary:core`**. Each phase removes a visible class of lines from the run log. Aligns with the existing LLD phases (P0 stopgaps → P1 Bible → P0.5/P3/P4), not a competing scheme.

> **Note on "test run after each phase":** a single run is a **smoke test** — it confirms the change works and the targeted log line is gone. The *statistical* validation for the flag-flips in Phases 2–3 (`AGENT9_BIBLE_AUTHORITATIVE`, `AGENT9_REGEN_CLUE`) is the separate **N≥4** gate via the staged `scripts/exp-regen-clue-*` harness (memory `canary-k2-single-run-confounded`) before they go default-on.

### Phase 1 — Unblock & restore telemetry *(deterministic; no generation-behaviour change; lowest risk)*

**Closes:** V.1 (the abort), N.1 (novelty telemetry), P.7 (triage masking).

| Change | Where | Detail |
|---|---|---|
| Fix the season false positive | [temporal-consistency.ts:56](../../packages/story-validation/src/temporal-consistency.ts#L56) | (a) extend `SPRING_MECHANICAL_RE`: allow hyphen (`spring-loaded`) and add trap qualifiers (`blade`/`trap`/`catch`/`latch`/`lever`/`loaded`); (b) add an adjacency rule — a bare "spring" within ~6 words of a mechanism/trap noun is mechanical. Unit tests both directions: mechanical "spring" stripped; a genuine seasonal "spring"/"vernal"/"in the spring air" still flagged. |
| Rebuild the novelty dist | `packages/novelty` (dist) | The `findUp` src fix from A_58 exists but the worker runs stale dist. `npm run -w @cml/novelty build`; verify `packageRoot()` → `findUp` resolves `C:\CML\schema\…`. |
| De-mask season warnings in triage | Agent 9 best-effort commit logging | Tag season-lock warnings distinctly so a run log shows "N of the majors are one season-FP class," not an undifferentiated 11. |

**Acceptance (next run log):** no abort on `august vs spring`; `NoveltySkeletonJudge` logs a verdict (no `skipped: ENOENT`); season-FP count = 0 on the spring-loaded-blade case; a genuine spring-season fixture still flags. Rerun the *same* sundial case → expect completion (release gate no longer season-blocked).

### Phase 2 — Freeze & dereference *(the principle; flip `AGENT9_BIBLE_AUTHORITATIVE`)*

**Closes / reduces:** P.5 (pronoun drift), P.6 (locked-fact injection), P.2 (early mechanism reveal); makes V.1's Phase-1 fix *principled* rather than heuristic.

| Change | Where | Detail |
|---|---|---|
| Season becomes a first-class Bible fact | [story-bible.ts](../../packages/prompts-llm/src/story-bible.ts) + temporal-consistency | Add `bible.season` (from `specificDate`); the Season Lock **and** the validator both dereference `bible.season`; the validator's mechanical-exclusion set is **derived from the case's mechanism vocabulary** (hard-logic devices + DT object + weapon nouns) — the data-driven version of Phase 1. No more per-mechanism regex. |
| Flip Bible-authoritative | `AGENT9_BIBLE_AUTHORITATIVE=true` | Pronouns (`bible.voices`/gender), locked facts (`bible.clock`/facts), clock, season all read from the one frozen object; the pronoun sweep and locked-fact injector become rare backstops, not routine passes. |
| Validators dereference, don't re-derive | pronoun + locked-fact + temporal checkers | Apply the governing rule: check prose against the Bible value, never a prose re-scrape. |

**Acceptance (next run log):** `Deterministic pronoun sweep: N repair(s)` drops materially (target ≪ 21); `enforceLockedFactValuePresence: injected … N` drops toward 0; season checked against `bible.season`. Then run the **N≥4** matched set before flipping the flag default-on.

### Phase 3 — Regen + mechanism plausibility *(the craft/quality debt; flip `AGENT9_REGEN_CLUE` + P4 regen; land P0.5)*

**Closes:** M.1 (implausible physics), P.1 (verbatim clue), P.3 (clearance injector), P.4 (resolution injector).

| Change | Where | Detail |
|---|---|---|
| Agent 3b magnitude-plausibility (P0.5) | Agent 3b + `AGENT3B_PLAUSIBILITY_JUDGE` | Reject "thermal expansion → decisive timing shift"; prefer a believable chain (loosened/tilted gnomon). Reduces V.1/M.1/P.1 at the *source* (a nameable mechanism is neither implausible nor awkward-to-transcribe). |
| Inject→regen for clue surfacing (P3) | `AGENT9_REGEN_CLUE=true` | The A1 replacement — dramatize the missing clue in-scene instead of transcribing/injecting. N≥4 harness already staged (`scripts/exp-regen-clue-*`). Directly kills P.1's verbatim transcription. |
| Inject→regen for clearance + resolution (P4) | `AGENT9_REGEN_<pass>` | Convert the A3/B7 clearance and B6 resolution injectors to `runInsertionRegenPass` (already built) so the shipped paragraph is dramatized, not templated. |

**Acceptance (next run log):** no `copied verbatim` validation failures; no A1/clearance/resolution injector scaffold in shipped prose; Agent 3b mechanism carries a plausibility chain. Each flag flip validated on its **N≥4** matched set before default-on.

### Coverage check (every A_60 issue is in a phase)

| A_60 issue | Phase |
|---|---|
| 7.1 beat abort | already fixed (Phase 0, this session) |
| V.1 season FP | **1** (heuristic) → **2** (principled, Bible-sourced) |
| N.1 novelty ENOENT | **1** |
| P.7 best-effort masking | **1** |
| P.5 pronoun drift · P.6 locked-fact injection · P.2 early reveal | **2** |
| M.1 sundial physics · P.1 verbatim clue · P.3 clearance · P.4 resolution | **3** |

---

## Alignment with A_58 / A_59 — no tangents

Every item in the phased plan maps to an existing A_58 or A_59 workstream. Nothing here is new scope; it re-sequences the prior plans around what *this* run surfaced.

| A_60 phase item | Maps to | Kind |
|---|---|---|
| P1 · novelty dist | **A_58 #5** (its Phase 1, "cheap & safe") | prescribed, unshipped |
| P1 · season FP | **A_58 Phase 2 "detector precision"** (#4/#6 FP class); **A_59 §B** ("verifiers must never regress") | verifier-precision maintenance |
| P1 · triage de-mask | A_58 #7 (retry-cost/noise) hygiene | hygiene |
| P2 · Bible-authoritative + season→Bible | **A_59 P1 / P1.3** (Story Bible = the single dereference source); LLD migration step 1 | core strategic |
| P2 · pronoun/locked-fact from Bible | **A_58 Phase 4 cluster** (#2/#9/#10 "obligation didn't land") resolved at source | core strategic |
| P3 · Agent 3b plausibility | **A_59 P1 #5** / LLD P0.5 | core |
| P3 · `AGENT9_REGEN_CLUE` | **A_59 P0 #1/#4** → the inject→regen inversion (A_59's *"biggest single jump"*) / LLD P3 | core strategic |
| P3 · clearance/resolution regen | **A_59 P0 #3** + **A_58 P0 #1** / LLD P4 | core strategic |

**Two guardrails so it stays on-principle:**

1. **The Phase-1 season regex is a labelled throwaway, not the fix.** A_59 is explicit: *"stop adding per-template detectors and rewords — that is the whack-a-mole, confirmed three times."* A hand-maintained per-mechanism regex is that same anti-pattern on the **validator** side. It is justified only as a fast unblock; the on-principle fix is **Phase 2's Bible-vocabulary-derived exclusion** (the validator dereferences the case's own declared mechanism terms — no regex per mechanism ever again). **If we ship Phase 1 and stop, we have added a mole — Phase 2 is what closes it properly.**
2. **"Done by suites" ≠ "done" — the novelty #5 lesson.** A_58 marked #5 landed ("`findUp` fix built into dist," suites green); A_60's run proves it *still* `ENOENT`s — the `worker-consumes-cml-packages-via-dist` trap (vitest uses src; the worker runs dist; green tests masked a stale/ineffective dist). So Phase 1's novelty item is **not "rebuild and assume"** — it must verify `findUp` actually resolves at the worker's `node_modules`-symlink runtime **and confirm by a run** (no `skipped: ENOENT`). The plan's own **test-run-after-each-phase** discipline is precisely the correction to the process gap that let A_58 #5 slip.

**Net:** the plan *is* the A_59 core (Bible → inject→regen → rewrite) with A_58's tactical items (novelty, detector-precision, the obligation-didn't-land cluster) folded into the phase where each naturally lands. The only tangent-risk is the season regex, and it is contained by making Phase 2 its principled successor.
