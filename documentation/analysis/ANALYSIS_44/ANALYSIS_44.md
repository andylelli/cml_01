# ANALYSIS_44 — Why run `70ac132d` "didn't show much improvement": the ANALYSIS_43 fixes held, but the run died at Ch4 on the template linter before they could matter

Status: **investigation complete; root cause identified (per-chapter `template_bleed` opener gate is the new run-killer); ANALYSIS_43 A–D confirmed holding; G/H/I confirmed never exercised; fixes recommended (open)**
Run reviewed: `run_70ac132d-484a-49dc-abaf-998c66284533` (project `proj_75a9d294`, story "Hawthorne Manor", 2026-06-19T06:54).
Sources: report `apps/api/data/reports/proj_75a9d294…/run_70ac132d….json` (frozen `in_progress`, upstream-only); trace `documentation/prompts/actual/run_20260619-0654_70ac132d/` (50 files, INDEX); checkpoint `logs/agent9-checkpoint-run_70ac132d….json`; prompt log `logs/llm-prompts-full.jsonl` (25 request entries).
Predecessor: **ANALYSIS_43** (landed Layers A–D for run `1d55f7c7`, then Phases 0–3 / recs G/H/I for run `5411ba7f`).

---

## 0. TL;DR

The last run did not "fail to improve" in the way the previous ones failed — it **failed earlier and more silently**, so none of the visible 1d55f7c7/5411ba7f defects could even be measured.

1. **The ANALYSIS_43 A–D fixes worked.** The three chapters that committed (Ch1–3) contain **zero** verbatim schema/clue leakage, **zero** setting-metadata dump, **zero** premature reveal, and **no** deterministic-pronoun corruption. The D2 reasoning-leak gate even **caught** a residual "mechanism access point" phrase in Ch3 and forced a clean rewrite. These are doing their job.
2. **The ANALYSIS_43 G/H/I fixes were never exercised.** They were flag-enabled (`pronoun_gate_parity_enabled`, `victim_alive_repair_enabled`, `repairable_abort_softening_enabled` all `true`) but they operate at the **final story-validation gate**. This run **died during per-chapter prose generation at Chapter 4 of 10** and never reached final validation. The 5411ba7f→70ac132d comparison therefore **cannot validate G/H/I** — they sat behind a door the run never opened.
3. **The actual run-killer is a different, older problem: the template linter's `template_bleed` "repeated content opener" gate** (an unaddressed T7 / Phase-5 item that ANALYSIS_43 explicitly deferred). It fired on **every single chapter**, consuming the full 3-attempt retry budget each time, and at Ch4 the run terminated with **no story produced** and the report frozen at the pre-prose `in_progress` snapshot.

Net: the pipeline regressed in *completion* (5411ba7f produced a full 10-chapter story to review at 74/C; 70ac132d produced 3 committed chapters and no story) while quietly *improving* in *content hygiene*. The improvement is real but invisible, because there is no finished artifact to review.

---

## 1. What the run actually did (timeline)

| Time (UTC) | Event |
|------------|-------|
| 06:54:32 → 07:00:43 | Agents 1–7 (upstream) run; all 13 phases pass. |
| 07:01:24 | Report written: `in_progress: true`, overall **97.85/A**, `total_cost $0.0572`, **no prose phase**. This is a pre-prose snapshot and was never overwritten. |
| 07:01:25 → 07:02:13 | **Ch1**: attempt 1 → retry1 → retry2. Converges on attempt 3; **committed**. |
| 07:02:36 → 07:03:03 | **Ch2**: 3 attempts; **committed**. |
| 07:03:25 → 07:04:14 | **Ch3**: 3 attempts; **committed**. |
| 07:04:37 | Checkpoint saved: `completedChapters: 3`. |
| 07:04:37 → 07:05:12 | **Ch4**: attempt 1 → retry1 → retry2 request sent at 07:05:12. **No response logged. No Ch5. No final report.** |
| ~08:05 | API server still serving HTTP status polls (`activity.jsonl` tail); worker no longer issuing LLM calls. |

The prompt log (`llm-prompts-full.jsonl`) contains **exactly 25 request entries**: 13 upstream + (Ch1–Ch4 × 3 attempts). The last entry is Ch4 retry2 at 07:05:12. The worker made **no LLM call after that** — no Chapter 5, no repair pass, no final-validation pass. The run produced **no `story_*` directory** and **no reviewable prose file**.

**Outcome: incomplete / dead. 3 of 10 chapters committed; the run stopped at Chapter 4.**

---

## 2. What worked — the ANALYSIS_43 A–D fixes are holding

Evidence comes from the three committed chapters (Ch1–3, final attempts) and the per-chapter gate feedback.

- **T1 verbatim schema/clue/test leakage — 0 matches.** Grepping the committed Ch1–3 responses for the 1d55f7c7 killers (`Eliminates … because`, `narrowing the solution`, `mechanism access point`, `excludes competing`, `controlled reenactment`) returns **zero**.
- **D2 reasoning-leak gate actively caught a residual.** Ch3 attempt 2 produced *"…near the **mechanism access point**, her gloved hand hovering just above the brass latch."* The gate flagged it as `reasoning_leak_access_point` and forced a TARGETED_REBUILD; the committed Ch3 no longer contains it. **This is the ANALYSIS_43 D2 detector doing exactly what it was built to do.** (It also shows the model still *reaches* for that phrasing — the A1/A2 prompt reframing reduced but did not eliminate the impulse; the gate is the safety net.)
- **T2 setting-metadata dump — 0 matches.** No `… - … in …, …, England;` / "underlies the cozy setting" markers in committed prose.
- **T3/C deterministic pronoun corruption — not observed.** No chapter's blocking failure was a pronoun-gender mismatch; the committed chapters use correct pronouns for the female cast (Lady Beatrice Hawthorne, Miss Eleanor Smythe).
- **T4 premature reveal — not flagged.** No spoiler/early-reveal gate fired on the committed chapters.

The per-chapter gates are firing and the model **can** converge on them — Ch1's committed openers are diverse (Inspector Malcolm Hargreaves / Hargreaves / Lady Beatrice / George Langley / Charles Wentworth / The air / Outside / A brief moment). The A–D layer is not the problem.

---

## 3. What didn't move the needle — G/H/I were never reached

ANALYSIS_43 §10.10 landed Phases 0–3 to convert the 5411ba7f *terminal abort* (victim-alive + male→female pronoun) into a completed, repaired story. All three flags are enabled in `generation-params.yaml` (`pronoun_gate_parity_enabled: true`, `victim_alive_repair_enabled: true`, `repairable_abort_softening_enabled: true`).

**But all three operate at or after the final `StoryValidationPipeline` gate in the worker** (`agent9-run.ts` post-generation validate→repair→re-validate→status, around `:4101–4444`). This run **never reached that code** — it terminated inside per-chapter prose generation (`packages/prompts-llm/src/agent9-prose/generate.ts`), four chapters in. Consequences:

- **G (canonical-victim-alive repair + identity lock):** not triggered. (Incidentally, this run's cast had a single clean victim and no Eleanor-Shaw/Edward-Langford-style dual-identity, so the R1 class may not even have been present — but we cannot confirm, because no full story was assembled.)
- **H (pronoun-gate parity + post-mutation re-repair):** not triggered. The final-validator pronoun pass never ran.
- **I (repairable-abort softening):** not triggered. The softening branch sits *before the final-gate throw*; the run aborted upstream of it.

**Therefore the 5411ba7f→70ac132d comparison is null for G/H/I.** They remain **unverified**, not disproven. Validating them requires a run that actually completes all 10 chapters and reaches final validation — which §4 explains is currently blocked.

---

## 4. Root cause — the `template_bleed` repeated-opener gate is the new run-killer

Every chapter's blocking failure was the **template linter**, dominated by `template_bleed` ("repeated content opener detected"):

| Chapter | Attempt feedback (primary class → subcode) | Specific failure |
|---------|--------------------------------------------|------------------|
| Ch1 | template → `template_bleed_openers` (1/3, 2/3, 3/3) | repeated opener `"lady beatrice"` |
| Ch2 | template → `template_bleed_openers`, then plain `template` | repeated opener `"lady beatrice"`; then "opening paragraph lists multiple named rooms (location inventory)" |
| Ch3 | template → `template_bleed_openers`, then `control_plane_leakage` | repeated opener `"lady beatrice"`; then `reasoning_leak_access_point` (see §2 — caught + fixed) |
| Ch4 | template → `template_bleed_openers` (TARGETED_REBUILD → FULL_REBUILD) | repeated opener `"george langley"` → then `"miss eleanor"` |

### 4.1 The gate (tight, second-occurrence trigger)

`packages/prompts-llm/src/agent9-prose/lint.ts:258–286` — the deterministic paragraph-opener uniqueness gate emits a `template_bleed` issue when **either**:
- two paragraphs in a chapter share the same **two-word** meaningful opener (`firstTwoWordsSeen.has(firstTwoWords)` — fires on the **2nd** occurrence), **or**
- 3+ paragraphs share the same meaningful **first word** (`currentFirstWordCount >= 3`).

Because the cast are referred to by full name and the model habitually opens consecutive paragraphs with a prominent character ("Lady Beatrice …"), this gate is tripped on essentially every first draft.

### 4.2 The whack-a-mole

The retry feedback (`generate.ts:538, 608`) names **one** offending opener phrase per attempt. The model removes that one and lands on **another** character-name opener — Ch4 went `"george langley"` (retry1) → `"miss eleanor"` (retry2). This is the exact "whack-a-mole" the code comments already acknowledge for fingerprints (`generate.ts:3189`), but the opener gate has no equivalent accumulation/"all openers must differ" deterministic mitigation.

### 4.3 No exhaustion backstop for `template_bleed`

There are three "accept-after-max-attempts" backstops in `generate.ts`, and **none covers `template_bleed`**:
- `isEntropyOnlyFailure` (`:3049`) — only `opening_style_entropy`.
- `isLinterOnlyFingerprintOrNoteFailure` (`:3075`) — only `paragraph_fingerprint` / `debug_note_bleed`.
- `isResolutionOnlyFailure` (`:3116`) — only "no resolution event".

So a chapter whose only residual is a repeated opener has **no graceful accept path**. At `attemptsExhausted` (`:3285`) it falls to the terminal branch: `!preferCompletionOnFailure` → **`throw abortErr`** (`:3305`); else best-effort commit from `bestAttemptChapters` (`:3316`).

### 4.4 Why the run stopped at Ch4 — the abort-save never completed

`preferCompletionOnFailure` defaults to `true` (`generate.ts:1892`), which *should* best-effort-commit Ch4 and proceed to Ch5. Yet there is **no Ch5 request** and **no final report**, and — decisively — **the report was never re-saved after 07:01:24**: it still has `in_progress: true`, **no `agent9_prose` phase**, and **no `agent9_prose_post_generation_summary` diagnostic**.

That last fact is the discriminator. The orchestrator wraps prose in a `try/catch` (`mystery-orchestrator.ts:1042`) with two graceful abort handlers — `aborted_after_chapter` for an abort after ≥1 chapter (`:1098`) and a zero-chapter handler (`:1121`) — and **both register an `agent9_prose` diagnostic/phase**. A cleanly-thrown-and-caught abort would therefore have produced an `agent9_prose` 0/F phase tagged `prose_generation_aborted`. It is absent. So the `throw` was **never caught** — the worker process died (or a second exception fired inside the abort handler, e.g. an `assertGenerationReportInvariants` failure, which the `:1156` comment explicitly notes "leaves the prior in_progress=true partial snapshot on disk").

Refined conclusion (supersedes the earlier two-hypothesis framing): **the graceful abort-save did not complete** — most consistent with a hard process crash/kill around the Ch4 retry2 call (07:05:12), not a clean caught abort. A valid 3-chapter resume checkpoint (`loadAgent9ResumeCheckpoint`, `:3218`) was written at 07:04:37 but sat unused because resume is opt-in. Either way the outcome is identical: the run died at Chapter 4, produced no story, and never reached the final-validation stage where G/H/I live. And the structural defect underneath — `template_bleed` having no completion bypass, so an unconverged opener can hard-block a chapter — is real regardless of which terminal mechanism fired.

---

## 5. Secondary findings

- **The report is a pre-prose snapshot, and that is itself a reporting bug.** `in_progress: true`, `overall 97.85`, no `agent9_prose` phase, `$0.0572` cost. A consumer glancing at this run sees a green **97.85/A** for a run that produced **no story**. The frozen-snapshot-on-prose-death behavior should write a terminal "prose incomplete" status rather than leaving a green upstream snapshot as the run's final record.
- **`evidence_clue_backfill` still firing (Agent 3/3b).** Diagnostic `agent3_cml_evidence_clue_backfill` injected 2 clues (`clue_11`, `clue_soot_line`) because `discriminating_test.evidence_clues` was missing essential IDs. This is the same Agent 3/3b gap flagged in ANALYSIS_43 §9.2 / Phase 4 (F) — still deferred, still firing.
- **Cast Design 88/B and Location Profiles 93/A remain the weakest upstream phases** — exactly the Agent 2 / Agent 2c data-hygiene targets ANALYSIS_43 deferred to Phase 4 (F). Untouched.
- **Per-chapter generation is the wall-clock and budget sink.** ~4 minutes of prose got 4 chapters in, each burning 3 attempts. With a 3-attempt budget and a gate that trips every first draft, the run spends its budget thrashing rather than progressing.

---

## 6. Recommendations — fleshed out and validated (Pass 1)

The previous two analyses optimized the **final-validation gate** (A–D, then G/H/I). This run shows the binding constraint moved **upstream to per-chapter generation**, specifically the `template_bleed` opener gate. Fix that first, or G/H/I can never be observed. Each recommendation below is specified to the function/line and validated against the current code; §7 (Pass 2) re-examines each adversarially and carries the final verdict.

### R1 (P0) — Report ALL colliding openers, not just the first (drives convergence)
- **Problem (validated):** the opener gate `break`s at the first duplicate — `lint.ts:277 break openerUniquenessLoop` — emitting a single `template_bleed` issue. The feedback builders then extract exactly one phrase via `.find(Boolean)` (`generate.ts:537–539`, `607–609`). The model fixes that one opener and the next pre-existing duplicate surfaces on the following attempt — the whack-a-mole that burned Ch4's budget (`"george langley"` → `"miss eleanor"`).
- **Change:** remove the `break`; collect every offending opener (both the `firstTwoWords` 2nd-occurrence hits at `lint.ts:271` and the `>=3` first-word hits) and emit **one `template_bleed` issue per offending opener** (preserves the existing singular message + the feedback regex). Then change `buildRetryRewriteActions`/`buildRetrySuccessChecklist` from `.find(Boolean)` to `.filter(Boolean)` so the retry lists them all.
- **Files:** `lint.ts:258–286`, `generate.ts:537–539, 562–564, 607–609, 625–626`.
- **Risk:** low. **Test:** a chapter with 3 distinct repeated openers emits 3 issues and the retry action names all three.

### R2 (P0) — Fix the success-checklist threshold that contradicts the gate (drives convergence)
- **Problem (validated):** `generate.ts:626` tells the model "**No more than two** paragraphs begin with the repeated opener pattern related to X." But the two-word-opener rule (`lint.ts:271 firstTwoWordsSeen.has`) fails on the **2nd** occurrence — so the checklist describes a *passing* state that actually **fails the gate**. It also conflates the 2-word rule with the `>=3` first-word rule.
- **Change:** reword to "Every paragraph must begin with a different **name or meaningful word** — no two paragraphs may share the same opening name/word (pronouns and articles like *she/the/a* are fine)." Drop the numeric "two." Mirror the same wording in the rewrite action (`:562–563`).
- **Files:** `generate.ts:562–563, 625–626`.
- **Risk:** trivial. **Test:** snapshot of the generated checklist string.

### R3 (P0) — Add a `template_bleed` opener exhaustion backstop (stops the run-kill)
- **Problem (validated):** the three accept-after-max-attempts backstops cover only `opening_style_entropy` (`:3055`), `paragraph_fingerprint`/`debug_note_bleed` (`:3075`), and resolution (`:3116`). An opener-only residual has no graceful accept, so at exhaustion (`:3285`) it can `throw` (`:3305`).
- **Change:** mirror `isEntropyOnlyFailure` (`:3049–3066`) with an `isOpenerOnlyFailure`, **scoped by message string, not type** (the `template_bleed` type is shared with the location-inventory check at `lint.ts:528/530`, which must stay blocking):
  ```ts
  const isOpenerOnlyFailure =
    batchErrors.length > 0 &&
    precommitLinterIssues.length > 0 &&
    precommitLinterIssues.every((i) => i.type === "template_bleed") &&
    batchErrors.every((e) => e.startsWith("Template linter: repeated content opener detected"));
  if (isOpenerOnlyFailure && attempt >= maxBatchAttempts) {
    proseLinterStats.openerBypasses = (proseLinterStats.openerBypasses ?? 0) + 1;
    console.warn(`[Agent 9] Batch ch${batchLabel} exhausted opener retries; accepting with repeated-opener warning to avoid false hard-stop.`);
    batchErrors = [];
  }
  ```
  Place the block immediately after the entropy bypass (`:3066`). After `batchErrors = []` the loop falls through to commit, identical to entropy.
- **Files:** `generate.ts` (~`:3066`); `proseLinterStats` type (+`openerBypasses`); flag `opener_exhaustion_bypass_enabled` in `generation-params.yaml`/`generation-params.ts` (default enabled, per the ANALYSIS_43 rollout convention so it is rollback-able).
- **Risk:** low–medium (accepts one cosmetic repeat in the worst case; never accepts a co-occurring real defect — the `every(...)` guards). **Test:** a chapter that never fixes its opener commits with a warning after `maxBatchAttempts` instead of throwing; a chapter with an opener **and** a location-inventory issue still blocks.

### R4 (P1) — Surface the resolved `preferCompletionOnFailure` (diagnostic only)
- **Problem (validated):** `preferCompletionOnFailure = inputs.preferCompletionOnFailure !== false` (`:1892`) defaults true but can be passed false by the harness; when false, exhaustion throws (`:3305`). R3 removes the throw for opener-only residuals regardless of this flag, so R4 is no longer a fix — just observability.
- **Change:** log the resolved `preferCompletionOnFailure` once at prose start so future post-mortems can tell which terminal branch was live.
- **Risk:** none.

### R5 (P1) — The abort-save never completed: add stale-run finalization + checkpoint auto-resume
- **Problem (validated):** §4.4 — the report was never re-saved after prose started; both orchestrator abort handlers (`:1098`, `:1121`) would have registered an `agent9_prose` diagnostic, and it is absent → the abort-save did not complete (crash, or a throw inside the handler per the `:1156` comment). A green `in_progress` 97.85/A is left as the run's final on-disk record, and a valid 3-chapter checkpoint (`:3218`) is discarded because resume is opt-in.
- **Change (two parts):**
  - **(a) Stale-run finalizer:** when an `in_progress: true` report is read for a run that is no longer active, finalize it to a terminal `aborted`/`prose_incomplete` record. `apps/api/src/server.ts:1438` already special-cases the `in_progress` status response — extend it (or a worker watchdog) to rewrite a truly-dead run's report so it cannot read as green.
  - **(b) Auto-resume from checkpoint:** on worker restart, if a checkpoint with N completed chapters exists for an interrupted run, resume from chapter N+1 (`loadAgent9ResumeCheckpoint` already exists; make it fire automatically for an interrupted run rather than only on explicit request).
- **Risk:** medium (watchdog correctness; resume idempotency). **Test:** kill a run mid-prose → report finalizes to `aborted`; restart → resumes from the checkpoint, not chapter 1.

### R6 (P2, conditional) — Deterministic opener diversification (only if R1–R3 prove insufficient)
- **Rationale:** R1–R3 already (a) drive convergence and (b) guarantee no run-kill, so a deterministic rewrite is no longer load-bearing. Sentence reordering risks breaking causal/temporal flow and the original §6 "demote a name to a pronoun" idea collides with the ANALYSIS_43 C pronoun-gender work. **Deferred** — see §7 Pass 2 for the drop verdict. If revisited, prefer a bounded single-paragraph LLM micro-repair over a deterministic reorder.

### R7 (P2) — Resume the deferred upstream hygiene (ANALYSIS_43 Phase 4 / F)
- Agent 3/3b emit complete `discriminating_test.evidence_clues` (kills the `evidence_clue_backfill` diagnostic still firing this run); Agent 2 name-trim + victim-role uniqueness; Agent 2c short adjective mood/weather. Independent of R1–R5; ship piecemeal.

---

## 7. Pass 2 — adversarial validation & refinement

For each recommendation I tried to break it (interactions, ordering, false accepts) and checked the cited lines still hold.

- **R1 (report all openers).** *Interaction risk found:* if R1 changed the message to a plural list, the feedback regex `/repeated content opener detected \("([^"]+)"\)/i` (`:538, 608`) would silently stop matching and the feedback would lose the openers. **Refinement adopted:** keep the message singular and emit **multiple issues** (one per opener), flipping the feedback builders to `.filter(Boolean)`. *Stats check:* `proseLinterStats.failedChecks` increments once per attempt (`:3008`), not per issue, so emitting N issues does not skew counters. **Verdict: adopt (multi-issue form).**
- **R2 (checklist threshold).** *Adversarial:* could "no two paragraphs share an opener" wrongly flag legitimate `"She … / She …"` openings? No — `isMeaningfulOpenerToken` (`lint.ts:58`) excludes pronouns/articles, so the gate only ever fires on meaningful words; the reworded checklist must say "name/meaningful word (pronouns/articles fine)" to match. **Verdict: adopt (reworded as above).**
- **R3 (exhaustion backstop).** *False-accept:* the `every(type==='template_bleed')` **and** `every(startsWith opener-prefix)` guards mean any co-occurring non-opener error (including the location-inventory `template_bleed`, whose message is "opening paragraph lists multiple named rooms…") skips the bypass → stays blocking. Validated against the identical entropy precedent. *Deferral interaction:* when narrative hard errors remain at the final attempt, `batchErrors` holds non-opener entries → bypass correctly does not fire. *Placement:* adjacent to the entropy block keeps precedence consistent. **Verdict: adopt — strongest single fix; converts the run-killer into a warning.**
- **R4.** Superseded by R3 as a *fix*; retained only as a one-line diagnostic. **Verdict: downgrade to diagnostic.**
- **R5 (crash/stale resilience).** *Adversarial on the "crash" claim:* the only non-crash path that also leaves both the partial `in_progress` report and a missing `agent9_prose` diagnostic is a **second throw inside the abort handler** (e.g. `assertGenerationReportInvariants`, per `:1156`). So the precise, defensible claim is "the abort-save did not complete," not "definitely an OS-level kill." R5a (finalizer) + R5b (resume) fix both sub-cases. **Verdict: adopt; wording softened in §4.4.**
- **R6 (deterministic diversification).** *Adversarial:* deterministic sentence reordering can invert a reveal ("He opened the box. Inside lay the knife." → reordered, the reveal leaks early); detecting a "safe" reorder deterministically is unreliable, and the marginal benefit is purely cosmetic once R3 guarantees no run-kill. **Verdict: DROP for now; revisit only if post-R1–R3 telemetry shows openers still failing often, and then via a single-paragraph LLM micro-repair, not a deterministic reorder.**
- **R7.** Independent, low-risk, unchanged. **Verdict: keep (P2).**

### Final prioritized set (post Pass 2)
1. **R3** — opener exhaustion backstop (flag `opener_exhaustion_bypass_enabled`, default on). *Stops the run-kill.*
2. **R1** — emit all offending openers as multiple issues; feedback `.filter(Boolean)`. *Drives convergence.*
3. **R2** — fix the contradictory success-checklist threshold. *Drives convergence.*
4. **R5** — stale-run finalizer (a) + checkpoint auto-resume (b). *Honest reporting + crash recovery.*
5. **R4** — log resolved `preferCompletionOnFailure`. *Diagnostic only.*
6. **R7** — upstream hygiene (F). *Independent, piecemeal.*
7. ~~R6~~ — **dropped** (coherence risk > cosmetic benefit).

R1–R3 are small, local, unit-testable changes in `lint.ts` + `generate.ts` that together (a) make the opener gate converge within budget and (b) guarantee it can never again zero a run. They are the **minimum to get a completing run** — the precondition for finally validating the ANALYSIS_43 G/H/I fixes. R5 is the larger, separable reliability fix so a future crash neither lies in the report nor discards a good checkpoint.

---

## 8. Verification plan / status

- ✅ Confirmed: committed Ch1–3 have 0 A–D leakage markers; D2 reasoning-leak gate caught + cleared a Ch3 residual.
- ✅ Confirmed: all three G/H/I flags enabled; final-validation path never reached (prompt log ends at Ch4 retry2; no story; report frozen `in_progress`).
- ✅ Confirmed: every chapter's blocking failure was the template linter (`template_bleed` opener), and that class has no exhaustion bypass.
- ⏳ Pending: land **R1–R3** (then **R5**); re-run; confirm (a) all 10 chapters commit, (b) the run reaches final validation, (c) G/H/I telemetry actually fires, (d) the report records a real prose phase + grade. Watch logs for `[Agent 9] Batch … accepted with repeated-opener warning` (R3 fired), `openerBypasses` telemetry, and the `story_validation_softened` diagnostic (rec I) — the last should now finally be reachable once completion is fixed.

---

## 8b. Implementation status (landed this session)

All packages typecheck clean and all suites are green: **story-validation 232, prompts-llm 310 (+7 skipped), worker 167, api 27**. Dist rebuilt for story-validation → prompts-llm → worker → api (restart the process to pick up the new dist).

- **R1 — landed.** `lint.ts` opener gate no longer `break`s at the first duplicate; it collects every distinct repeated opener and emits one issue per opener. The retry feedback builders (`generate.ts`) now `.filter(Boolean)` across all reported openers. Tests: two-distinct-openers ⇒ 2 issues; one opener ×3 ⇒ 1 (deduped).
- **R2 — landed.** The success-checklist no longer says "no more than two paragraphs"; it now requires distinct meaningful openers (pronouns/articles exempt). Covered by the `buildSinglePassRetryPrompt` test asserting the new wording and the absence of the old.
- **R3 — landed.** `isOpenerOnlyFailure` exhaustion backstop added beside the entropy bypass, message-scoped to `"Template linter: repeated content opener detected"` (location-inventory `template_bleed` stays blocking), gated by the new `opener_exhaustion_bypass_enabled` flag (type+default+merge in `generation-params.ts`, `generation-params.yaml`, the prose `rolloutFlags`). New `proseLinterStats.openerBypasses` counter surfaced as `template_linter_opener_bypasses` telemetry.
- **R4 — landed.** Prose start logs the resolved `preferCompletionOnFailure`.
- **R5a — landed.** `server.ts` now serves a terminal **aborted** view (`passed:false`, `run_outcome:"aborted"`, `incomplete:true`, `scoring_outcome.passed_threshold:false`) for an `in_progress` report whose run is no longer active — both on the direct read and the partial-fallback path — so a dead run can no longer read as a green 97.85/A. New api test covers the no-completed-report case.
- **R5b — deferred (rationale).** The pipeline runs in-process and the checkpoint is keyed by `runId`; true crash-restart resume needs a startup reconciliation job that re-invokes the run under its original `runId`. That is a larger, riskier change than fits this change-set; tracked as follow-up.
- **R6 — dropped** (Pass 2). **R7 — not started** (independent upstream hygiene; ship piecemeal).

---

## 9. Decision summary

- The ANALYSIS_43 **A–D content-hygiene fixes are working** and should be kept; the visible 1d55f7c7 killers did not recur.
- The ANALYSIS_43 **G/H/I run-unblockers are untested**, because the run died upstream of where they operate. Do not draw conclusions about them from this run.
- The **binding constraint moved**: it is no longer the final-validation gate (victim/pronoun) but **per-chapter generation tripping `template_bleed` on every chapter**, with no completion backstop for that class. That is the next thing to fix, and it must be fixed before G/H/I can be observed at all.
- A degraded but completing run (best-effort accept of cosmetic opener repetition) is strictly more useful than a "clean" run that produces nothing — exactly the ANALYSIS_43 Phase-3 philosophy, now needed one layer earlier.
