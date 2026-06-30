# ANALYSIS_58 — Run-review: *Edith Langley / Reggie Harcourt* (2026-06-30)

Status: **run-review.** Scope is deliberately narrow — **only the concrete issues surfaced in this one run log**, not the A_57 strategic program (that lives in [ANALYSIS_57](../ANALYSIS_57/ANALYSIS_57.md)). Several items below overlap A_57 levers; cross-refs are noted but no A_57 work is folded in here.

**Run:** 10-chapter mystery, victim **Edith Langley**, culprit **Reggie Harcourt**, manor/estate setting (gardens, sundial/thermal mechanism). No run ID in the log; identified by cast + timestamp `2026-06-30T08:28–08:44Z`.

**Outcome:** the run **completed** — no hard abort. Completion-first mode + the deterministic fallbacks (`injectResolutionIfAbsent`, `applyCanonicalVictimRescue`, `enforceLockedFactValuePresence`, the pronoun sweep) absorbed the failures. But the final gate read **`needs_revision — 0 critical, 9 major issues`**, and **5/10 prose batches required a retry**. So: it shipped, but degraded, and the most important chapter (the reveal) only came together via deterministic injection.

---

## Issue catalogue (grounded in the log)

### P0 — the run shipped a degraded story

**1. Chapter 10 (the reveal) never converged — resolution was injected, not generated.**
- Symptom:
  - `Batch ch10 validation failed (attempt 1/3): Final chapter: no resolution event detected …` + `Resolution chapter must close with an in-scene moment … not a summary verdict sentence.`
  - `Completion-first mode: ch10 marked non-convergent at attempt 2/3; routing directly to deterministic fallback`
  - `Best-effort commit for ch10 … 1 residual issue(s) downgraded to warnings: … no resolution event detected`
  - then `injectResolutionIfAbsent: injected resolution paragraph for "Reggie Harcourt".`
- Where: the "no resolution event" / "close in-scene" checks in [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts); the deterministic backstop `injectResolutionIfAbsent` in [agent9-run.ts](../../apps/worker/src/jobs/agents/agent9-run.ts).
- Read: the LLM could not produce a fair-play reveal (name culprit + evidence chain) that also ends *in-scene*, across 3 attempts. The deterministic injection guarantees a resolution *exists*, but an injected paragraph is exactly the template-prose risk (A_57 D4). **This is the headline defect of the run.**

**2. The dead victim was written as active 10 times.**
- Symptom: `applyCanonicalVictimRescue: reframed 10 active-victim sentence(s) as recollection for 1 canonical victim(s): Edith Langley.`
- Where: `applyCanonicalVictimRescue` in [agent9-run.ts](../../apps/worker/src/jobs/agents/agent9-run.ts).
- Read: 10 reframes is high — the prose repeatedly animates Edith Langley despite her being the victim. The rescue caught them post-hoc, but the generator keeps producing them, so the underlying victim-lifecycle obligation isn't landing in the prompt.

**3. Outline-level G4 gap on the discriminating-test scene — "prose generation cannot repair".**
- Symptom: `G4 DT-scene scheduling gap ch10: discriminating-test scene references none of its DT evidence clues in the outline (needed one of: clue_mechanism_visibility_core, clue_4, clue_1).`
- Where: logged in [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts); root is the Agent 7 outline (the DT scene's clue scheduling).
- Read: structural — the outline never schedules the DT scene's own evidence clues into it, so the reveal can't cite them. Explicitly unrepairable downstream; must be fixed at Agent 7. (Recurs from prior analyses' "G4 gap".)

### P1 — correctness / probable false positives

**4. `VICTIM ALIVE` fired on Agnes Fairchild — who is not the canonical victim.**
- Symptom (ch6, attempt 1): `VICTIM ALIVE: "Agnes Fairchild's eyes shone with sudden tears … 'I have nothing to hide, Mr. Dryde'"`. But the canonical victim is **Edith Langley** (per the rescue line).
- Where: [character-lifecycle-validator.ts](../../packages/story-validation/src/character-lifecycle-validator.ts).
- Read: needs investigation — either (a) Agnes is mis-tagged as a victim in the CML cast, or (b) the lifecycle validator's victim set over-matches a non-victim. If (b), it's a false-positive that cost a retry. **Check the run's CML cast roles for Agnes.**

**5. Novelty skeleton-judge silently skipped — schema ENOENT.**
- Symptom: `[Novelty skeleton-judge SHADOW] skipped: ENOENT … open 'C:\CML\node_modules\schema\novelty_fingerprint.schema.yaml'`
- Where: schema-path resolution in [loader.ts](../../packages/novelty/src/loader.ts).
- Read: the path resolves to `node_modules\schema\…` (the package loaded via a node_modules symlink, so `packageRoot()/../..` lands in node_modules, not the repo root). The shadow judge never runs → no novelty telemetry. **A `findUp`-based fix already exists in the working tree but is uncommitted and its dist is not rebuilt** — rebuild `@cml/novelty` dist (and commit the fix) to close it.

**6. Agent 2c F5b sensory-bleed false positive.**
- Symptom: `F5b: sensoryDetails full-sentence bleed detected … [estate_gardens].sensoryVariants[morning_rain].sights: "rain-speckled rose petals" (contains verb)`
- Where: the F5b "contains verb" detector in [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts) (run over Agent 2c output).
- Read: `"rain-speckled rose petals"` is a noun phrase with a participial **adjective** ("rain-speckled"), not a verb/full sentence. The detector treats `-ed`/participle as a verb → false positive. Low harm (it's a warning), but it erodes trust in the bleed signal and may suppress legitimate sensory detail.

### P2 — retry cost & noise (system mostly self-corrected)

**7. 5/10 prose batches needed a retry.** `Prose generation: 5/10 batch(es) required retry`. Per-chapter, attempt-1 failures that passed on retry:
- **ch3** — `the concealment mechanism is explained before the discriminating-test scene` (mechanism spoiler embargo).
- **ch5** — `Template linter: opening paragraph lists multiple named rooms as a location inventory`.
- **ch6** — four at once: `Stage-mode outcome failed (suspect_pressure): no full culprit resolution` ; the VICTIM ALIVE above ; location-inventory opening (again) ; `Boundary integrity failure … unbalanced quotation marks`.
- **ch7** — `clue evidence "rh_2" is absent`.
- Read: these are the retry mechanism working as designed, but two patterns repeat (the **location-inventory opening** in ch5 *and* ch6; mechanism/stage leaks) — candidates for a stronger up-front prompt obligation so they don't cost a retry each.

**8. Agent 2b emits `signatureTic`, which the schema rejects (×6).** `profiles[0..5].signatureTic is not defined in schema (unexpected field)`. Where: [agent2b-character-profiles.ts](../../packages/prompts-llm/src/agent2b-character-profiles.ts) / [agent2b-voice-capsule.ts](../../packages/prompts-llm/src/agent2b-voice-capsule.ts). Read: prompt/schema drift — the model is asked for (or volunteers) a `signatureTic` voice field the profile schema doesn't declare, so all 6 profiles warn. Either add the field to the schema or stop requesting it. (Adjacent to A_57 D6 voice-capsule work.)

**9. Locked-fact omissions required 6 deterministic injections.** `enforceLockedFactValuePresence: injected … 4` then `… 2`. Read: the prose dropped canonical locked-fact values, so the backstop injected them — again the template-prose risk (A_57 D1/D4). Indicates the locked-fact obligation isn't fully landing in-scene.

**10. 11 pronoun repairs across 10 chapters.** `Deterministic pronoun sweep: 11 repair(s) across 10 chapter(s)` — with `pronoun_policy=off`, so only the sweep/parity ran. Read: persistent low-level pronoun drift (≈1/chapter). (A_57 D5 territory.)

**11. Ch7 trailing-whitespace padding (minor output hygiene).** ch7 attempt-1 `raw tail (last 300 chars)` is ~50 blank lines. The model padded the response with newlines. Harmless here but wastes tokens and could confuse truncation heuristics.

---

## Summary table

| # | Sev | Issue | Where | Disposition |
|---|---|---|---|---|
| 1 | P0 | Ch10 reveal non-convergent → resolution injected | generate.ts / agent9-run.ts | generation gap; injection is a band-aid |
| 2 | P0 | Dead victim animated ×10 (Edith Langley) | agent9-run.ts (rescue) | obligation not landing |
| 3 | P0 | G4 DT-scene clue-scheduling gap (outline) | agent7 outline | unrepairable downstream — fix at Agent 7 |
| 4 | P1 | `VICTIM ALIVE` on non-victim Agnes | character-lifecycle-validator.ts | verify CML role vs detector FP |
| 5 | P1 | Novelty schema ENOENT (judge skipped) | novelty/loader.ts | fix exists, uncommitted; rebuild dist |
| 6 | P1 | F5b flags "rain-speckled" as a verb | generate.ts | detector false positive |
| 7 | P2 | 5/10 batches retried (mech/location/quotes/clue) | generate.ts linters | repeated patterns → strengthen prompt |
| 8 | P2 | `signatureTic` not in 2b schema (×6) | agent2b-* | schema/prompt drift |
| 9 | P2 | 6 locked-fact injections | agent9-run.ts | obligation not landing |
| 10 | P2 | 11 pronoun sweep repairs | story-validation sweep | low-level drift |
| 11 | P2 | Ch7 trailing-whitespace padding | LLM output | minor hygiene |

---

## Suggested order (cheapest-correct first)

1. **#5 novelty ENOENT** — the fix is already written; rebuild `@cml/novelty` dist + commit. Zero design work, restores novelty telemetry.
2. **#4 Agnes `VICTIM ALIVE`** — one CML-cast check decides FP-vs-mis-tag; either a one-line role fix or a validator scoping fix. Low effort, removes a retry and a possible major-issue.
3. **#6 F5b false positive** — tighten the "contains verb" heuristic so participial adjectives (`rain-speckled`) don't trip it.
4. **#3 G4 outline gap** + **#1 reveal convergence** — the two structural quality blockers; both need Agent 7 (clue scheduling into the DT scene) and the Agent 9 reveal obligation. Highest value, most work.
5. **#2 / #9 / #10** — victim-lifecycle, locked-fact, and pronoun obligations all show the same shape (deterministic backstop firing because the in-prompt obligation didn't land); worth treating together.
6. **#7 / #8 / #11** — retry-cost and noise; address once the above are clear.

> **Relationship to A_57:** #1/#9 (injected/template resolution & locked facts) touch D4; #2 touches victim-lifecycle; #6/#10 touch D5; #8 touches D6. A_58 records them **as observed in this run only** — fixes belong to whichever track picks them up.

---

## Fix plan

**Guiding principles**
- **Confirm before fixing a suspected false positive.** #4 and #6 read as detector over-matches; a wrong "fix" that loosens a real guard is worse than the FP. Each FP fix lands *with a both-directions test* (the FP case passes; a genuine defect still fires).
- **Fix structural defects upstream, not in prose.** #3 (and likely #1) are outline-level; patching them in Agent 9 can't work (the log says so). Repair at Agent 7.
- **Deterministic backstops stay backstops.** #1/#2/#9 all show the same shape — a backstop firing because the in-prompt obligation didn't land. The fix is to make the obligation land; the backstop is the safety net, not the intended path. Where a backstop must fire, its output should be in-scene/dramatized (A_57 D4), not a verdict.
- **Each fix carries a log/test acceptance signal**, so the next run proves it closed.

### Phase 0 — investigate (decides the shape of two fixes)

- **#4 — is Agnes a victim?** *Resolved.* The run's CML cast has **Edith Langley `role_archetype: "victim"`** and **Agnes Fairchild `role_archetype: "Daughter"`** — so `resolveVictimName` correctly returns Edith, and `detectVictimAlive(chapter, "Edith Langley")` requires the full name "Edith Langley" in the sentence. The "Agnes" in the log is a **misleading diagnostic, not a false positive**: `detectVictimAlive` returns whole **paragraphs**, and the caller logs `paragraph.slice(0,120)` under a variable misnamed `offendingSentence` — the paragraph merely *starts* with Agnes; the real victim-alive hit is an active-**Edith** sentence later in the same paragraph. So #4 collapses into **#2** (the victim is genuinely written active). Fix #4 as a diagnostic accuracy fix (surface the matching sentence); do not loosen the detector.

### Phase 1 — cheap & safe (no design risk)

- **#5 Novelty ENOENT.** The `findUp`-based schema-path fix already exists in the working tree ([loader.ts](../../packages/novelty/src/loader.ts)); it is just uncommitted and its dist isn't built.
  - *Change:* rebuild `@cml/novelty` dist; commit `loader.ts`.
  - *Acceptance:* next run logs a `NoveltySkeletonJudge` verdict, no `skipped: ENOENT`.
  - *Risk:* ~none. Sanity-check `findUp` resolves from both the real package path and a `node_modules` symlink.
- **#11 Whitespace padding.** Trim trailing blank lines from each chapter's raw LLM output before validation/commit (output hygiene; also de-noises truncation heuristics).
  - *Where:* the chapter post-parse step in [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts).
  - *Acceptance:* ch-N raw tails no longer show runs of blank lines; no behaviour change otherwise.
  - *Risk:* low — trim only leading/trailing whitespace, never interior.
- **#8 `signatureTic` schema drift.** Decide one of: (a) add `signatureTic` to the Agent 2b character-profiles schema (if it's a wanted idiolect field — aligns with A_57 D6), or (b) drop it from the prompt and strip it pre-validation.
  - *Where:* [agent2b-character-profiles.ts](../../packages/prompts-llm/src/agent2b-character-profiles.ts) / [agent2b-voice-capsule.ts](../../packages/prompts-llm/src/agent2b-voice-capsule.ts) and the profile schema.
  - *Acceptance:* 0 `unexpected field` warnings for all profiles.
  - *Risk:* low. Prefer (a) if D6 will use it, so the data isn't thrown away.

### Phase 2 — detector precision (the false positives)

- **#6 F5b "contains verb" FP.** Refine the heuristic so a noun phrase with a **participial adjective** (`rain-speckled rose petals`) is not treated as a full-sentence bleed. The bleed signal should require a **finite verb with a subject** (a clause), not any `-ed`/`-ing` token.
  - *Where:* the F5b detector in [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts).
  - *Acceptance (both directions):* `"rain-speckled rose petals"` and `"sun-bleached gravel"` pass; `"rain speckled the petals"` / `"the petals were speckled with rain"` still flag. Add unit tests.
  - *Risk:* medium — loosening can admit real bleed; the both-direction tests are the guard.
- **#4 `VICTIM ALIVE` FP (if Phase 0 shows over-match).** Scope the lifecycle validator's victim set to the canonical victim(s) resolved from `CASE` (role/culpability), and require a tight name match so a non-victim's emotional/dialogue line is never read as a live victim.
  - *Where:* [character-lifecycle-validator.ts](../../packages/story-validation/src/character-lifecycle-validator.ts).
  - *Acceptance:* a non-victim speaking with emotion does not trip `VICTIM ALIVE`; a genuine dead-victim-acts-alive sentence still does. Regression test with a non-victim + an actual victim in one cast.
  - *Risk:* medium — under-scoping could miss a real reappearance; cover both in tests.

### Phase 3 — structural P0s (Agent 7 outline, then the reveal)

- **#3 G4 DT-scene clue-scheduling gap.** Ensure the outline's discriminating-test scene schedules ≥1 of `discriminating_test.evidence_clues` into itself, so the reveal can cite already-planted evidence.
  - *Where:* Agent 7 outline build / clue→scene mapping (the scheduler that the `[Agent 7 scheduler shadow]` line reports); the G4 check is logged from [generate.ts](../../packages/prompts-llm/src/agent9-prose/generate.ts).
  - *Acceptance:* the `G4 DT-scene scheduling gap` line does not fire; the DT scene's outline entry lists ≥1 DT evidence clue. Add a deterministic outline check + test.
  - *Risk:* medium — touches scheduling; verify it doesn't starve other scenes of clues.
- **#1 Reveal convergence (likely downstream of #3).** Two parts:
  1. *Obligation:* sharpen the final-chapter prompt — name the culprit + evidence chain **and end inside the scene** (dialogue/action/sensation), explicitly forbidding a summary-verdict close. Cite the DT clues now scheduled by #3.
  2. *Backstop:* make `injectResolutionIfAbsent` emit an **in-scene** resolution (dramatized confession/arrest beat), so when it must fire it doesn't itself fail the "close in-scene" check (A_57 D4 alignment).
  - *Where:* final-chapter obligation in [obligation-block.ts](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts); `injectResolutionIfAbsent` in [agent9-run.ts](../../apps/worker/src/jobs/agents/agent9-run.ts).
  - *Acceptance:* ch10 converges within attempts on a rerun; if injection fires, the injected paragraph passes both the resolution-event and close-in-scene checks.
  - *Risk:* prompt change low; backstop rewrite moderate (test the injected paragraph against both checks).
  - *Dependency:* do **#3 first** — if the DT clues aren't in the outline, the reveal cannot cite them, which is a plausible root cause of the non-convergence.

### Phase 4 — "obligation didn't land" cluster (#2, #9, and #10)

These three share a root shape: the in-prompt obligation under-fires, so a deterministic backstop fires instead (10 victim reframes, 6 locked-fact injections, 11 pronoun repairs). Treat together.
- **#2 Victim animated ×10.** Audit why the per-chapter "DECEASED — past-tense only, does not speak/act" obligation isn't landing (is it present in every chapter prompt, prominent, and naming Edith Langley?). Strengthen/relocate it.
  - *Where:* victim-identity rule in [prompt-builder.ts](../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts); rescue in [agent9-run.ts](../../apps/worker/src/jobs/agents/agent9-run.ts).
  - *Acceptance:* active-victim reframes drop to ≤2 on a rerun.
- **#9 Locked-fact omissions (6 injections).** Same diagnosis for the locked-fact obligation; ties to A_57 D1. *Acceptance:* `enforceLockedFactValuePresence` injection count drops.
- **#10 Pronoun drift (11 repairs).** Already mitigated by the sweep + the A_57 D5 re-validate guard; no new A_58 action beyond confirming the count trends down once D5 is in the run. *Acceptance:* sweep repair count trends down; no `mutation-revalidation … reverted` on the sweep.
- *Risk:* prompt-obligation changes are additive/low-risk; measure the backstop-fire counts as the signal.

### Phase 5 — retry-cost reduction (#7)

Two attempt-1 patterns repeated and each cost a retry: the **location-inventory opening** (ch5 and ch6) and **mechanism/stage leaks** (ch3 mechanism-early; ch6 suspect-pressure resolution). Strengthen the up-front obligations so attempt 1 passes:
- a sharper "do not open on a tour of named rooms" rule, and a louder mechanism-embargo + suspect-pressure "no resolution yet" reminder in the relevant chapters.
- *Where:* opening/embargo/stage-mode obligations in [obligation-block.ts](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts).
- *Acceptance:* batches-requiring-retry drops below 5/10 on a rerun; these specific messages don't recur at attempt 1.
- *Risk:* low (additive prompt text). Also fold in the ch6 **unbalanced-quotes** boundary failure if it recurs — that's a punctuation-integrity repair, not a prompt issue.

### Implementation status (landed this pass — deterministic fixes; verified by suites, not yet by a run)

| # | Fix landed | Where |
|---|---|---|
| 5 | novelty schema-path `findUp` fix built into dist (was uncommitted) | `packages/novelty/src/loader.ts` (+ dist) |
| 11 | trim trailing whitespace in the diagnostic `rawTail` (display only; stored response untouched) | `generate.ts` |
| 8 | `signatureTic` added to the character-profiles schema (wanted D6 field) | `schema/character_profiles.schema.yaml` |
| 6 | `isFullSentenceBleed` — verb **and** clause-length guard kills the "rose" homograph FP | `agent2c-run.ts` |
| 4 | `detectVictimAlive` returns the matching **sentence** (accurate diagnostic; not a detector loosening) | `generate.ts` |
| 2 | victim-identity obligation hardened: recollection-framed references only; explicit WRONG/RIGHT examples | `prompt-builder.ts` |
| 7 | global per-chapter "no room-inventory opening" obligation (was only caught post-hoc) | `prompt-builder.ts` |
| 1 | reveal obligation gains explicit RESOLUTION-EVENT + CLOSE-IN-SCENE rules; **backstop rewritten** to a dramatized confession+arrest beat that matches `RESOLUTION_RE` but no `VERDICT_CLOSER_RE` | `obligation-block.ts`, `clue-validation.ts` |
| 3 | **reframed during implementation** — not an outline gap. The DT scene (ch9) *did* cite its evidence; the loose DT-matcher double-matched the resolution chapter (ch10) and re-fired the gap. Guard: suppress when the DT evidence was already revealed in a prior scene | `generate.ts` |
| 9 / 10 | no new A_58 change — covered by A_57 D1 (locked-fact split) and D5 (pronoun re-validate); monitor the backstop-fire counts | — |

Tests: `a58-prose-fixes.test.ts` (#4, #1), `a58-sensory-bleed.test.ts` (#6), reusing the A_55 victim-gate goldens. Suites green: prompts-llm 577, worker 261, novelty 18, rubric-score 62.

### Sequencing & validation

1. **Phase 1** (commit-ready, no risk) → 2. **Phase 0 investigation** → 3. **Phase 2** FPs (with tests) → 4. **Phase 3** (#3 then #1) → 5. **Phase 4** cluster → 6. **Phase 5** noise.
- Phases 1–2 and 4–5 are mostly deterministic/prompt work, unit-testable in isolation.
- Phases 3 is the highest-value/highest-effort (structural reveal quality).
- **End-to-end signal:** rerun the same inputs and confirm the log shows: no ENOENT, no `VICTIM ALIVE` on non-victims, no F5b FP, no G4 gap, ch10 converges, and batch-retry + backstop-fire counts down. Then confirm on a powered N≥4 set (single-run deltas are confounded — `canary-k2-single-run-confounded`).
