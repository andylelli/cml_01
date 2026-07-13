# ROADMAP TO 80

**Date:** 2026-07-12 (v2.1 — implementation pass complete) · **Branch:** `redesign/agent-blue-sky` · **Owner:** Agent-9 / pipeline

> **v2.1 (2026-07-12, same day):** every non-RUN step is now DONE. The S4b audit found BOTH
> conditional abort channels already closed (rows retired in §6); RC3.2's enforce path was already
> built (flipped to `shadow` for telemetry); RC5.3's enforce-with-repair was built this pass
> (`runVoiceLeakageRegenPass` + issue `tic`/`owner` fields + worker wiring, both-directions tested);
> the S11 harness gained `--agents 6,9` chain support so the Agent-6 lever is A/B-able; Phase B
> flags are ON in `.env.local`. All suites green (story-validation 364, prompts-llm 685, worker 292);
> `build:all` clean. **What remains is exclusively RUN work: S0/S5 batches → S10 batch → S12 A/B →
> S13/S14 decisions.**
**Companion:** [TARGET_80_LEDGER.md](TARGET_80_LEDGER.md) — the standing three-panel scoreboard §3 defines (created 2026-07-13, seeded with the smoke runs); plus the *Road to 80* HTML dashboard. · **Supersedes for planning:** the 2026-07-11 v1 of this document and the scattered "still blocks 80" tails of A_57–A_61 (those remain as history + detail).
**Grounded in:** A_50→A_61, `packages/rubric-score/src/{score,hard-caps,facts,types,bands}.ts`, runs `mystery-1783069748150` / `-1783162628179` / `-1783163491931`, **and a code audit at `4fa63a19`** — every State column below was verified against source, not copied from v1.

**What changed in v2 (audit findings):**
1. v1's three "LIVE GAP — needs new code" items are **all built and committed** (`6b90a9aa`…`4fa63a19`): the walk-on repair (`AGENT9_WALKON_REPAIR`, `agent9-run.ts:4972`), the cleared-culprit guard (construction + validator, unconditional), and the mechanism-too-early regen (`AGENT9_REGEN_MECHANISM`, `agent9-run.ts:4287`). The S11 A/B harness is also built (`exp-regen-clue-ab.mjs --flag <NAME>`, generalized to any lever).
2. Two historical run-killers were missing from the Reliability Ledger — the **template-bleed opener linter** and the **Agent-7 out-of-enum `scene.beat`** — added as rows with an audit step (S4b).
3. M1's acceptance was ambiguous (8 runs vs 4-run batches) — disambiguated: **8 consecutive scored runs *after* S1–S4b land; S0's baseline does not count.**
4. The `reportStyleClearance` cap row never named its lever — it is **`AGENT9_REGEN_SCAFFOLD`** (one pass covers deductive-scaffold *and* report-style clearance, RC1.2/RC1.3, `agent9-run.ts:186-193`).
5. The flag-load-order bug class (module-const freezing before dotenv) is **fixed**: every agent9-run.ts flag is now a runtime getter. The verify-by-label discipline stays (§8).
6. A total run budget is now stated (§10) so batch sizes don't get trimmed mid-plan — which is how the N≥4 A/B stayed deferred since A_54.

**Net effect: the plan is now almost purely flips-and-measurement — exactly what guardrail #2 demands.** The only unconditional new code left is two shadow→enforce promotions (§9); everything else is CONFIG + RUN.

---

## 0. TL;DR — the thesis in one paragraph

**The prose is already good enough.** Per-chapter craft scores **88–98**; one run (`run_33ecb4ad`) scored **94 uncapped**. What pins the *final* rubric at **60–74** is two finite, nameable things — and neither is craft:

1. **A short list of CAPS** clamps an otherwise-shippable draft (mechanism-too-early → plot/pacing ≤6; report-clearance → prose ≤6; role-collision → ceil 55–60; leakage/scaffold → ceil 65).
2. **~50% of runs HARD-FAIL** at validation *before they can be scored at all* (invented walk-ons, cleared-culprit, unbridged transitions, validator FPs).

The machinery to fix both is **built and tested** — including, as of `4fa63a19`, the three items v1 still called live gaps — and the floor levers are already flipped on in `.env.local`, awaiting their verification batch. What has *never actually happened*, per A_54, is the powered **N≥4 matched A/B**. So the plan is not "write more code" and not "write better prose." It is: **Floor (ship-rate → 100%) → Ceiling (extinguish the caps) → Prove (run the A/B, then flip defaults).**

---

## 1. Where we want to be — the acceptance bar for "80"

"80" is not a single run reading. Define it precisely and hold the line:

| Criterion | Target | Why |
|---|---|---|
| **Mean external score (ChatGPT/human)** | **≥ 80** | The A_57 bar; the human-facing number is the real one. |
| **Internal − external gap** | **≤ 3** | Proves the internal rubric is *honest*, not blind-spotting (the A_57 lesson; already ~0 at A_59). |
| **Ship rate** | **100%** | A run that aborts can never score 80. Currently the bigger loss. |
| **Batch** | **≥ 4×4 matched**, diverse era/setting/cast/crime/mechanism | Single-run K2 is confounded (A_54); one reading is directional only. |

**How the score is built (the mechanics that define the bar):** ten equal categories, each `/10`, summed to `/100` (`types.ts`). To reach 80 you need **an average mark of 8.0 AND no overall ceiling below 80 may fire** (`hard-caps.ts`). The ceilings are the killers: role collision → **55–60**, material leakage/scaffold → **65**, pronoun instability → **69**, victim unnamed → **72**, weak murder method → **75**. Any *one* of these clamps the whole `/100` below 80 regardless of category marks.

---

## 2. Where we are — the two axes, not one number

- **Best honest score:** 74 (A_59, the run where internal = ChatGPT). Internal touched 80 once (A_57) but ChatGPT said 70 — a judge blind-spot, now closed.
- **This week:** re-measure 64, **run 1 hard-failed (7 majors)**, run 2 shipped **67**.
- **The ceiling is caps, not craft:** run 2's prose scored 88–98 per chapter, then the rubric returned 67 — "mechanism explained too early" clamped plot & pacing to ≤6.
- **The floor is reliability:** run 1 died on 5 invented walk-ons + cleared-culprit + an unbridged transition. Never scored. **All three now have live levers (§6) — unverified until S5.**

**Reframe:** stop tracking a rolling average. Track **ceiling** (best score when it ships) and **floor** (does it ship) separately. The dashboard does exactly this.

---

## 3. The tracking system — the "80 Ledger" (replaces the analysis-doc diary)

The A_50→A_61 cadence is a **linear diary**: one single-run post-mortem per iteration, which is why the same three lessons (confounded score, whack-a-mole, false gates) get re-derived every time. Replace it with a **standing scoreboard over a rolling batch of ≥4 matched runs**, three panels:

1. **Reliability Ledger** — the enumerable hard-fail majors, each mapped to its repair lever + state (§6). Target: every row → 0 occurrences. *The ledger must enumerate every abort channel in the pipeline, not just those seen in the last batch — v1 missed two (§6, last rows).*
2. **Cap Ledger** — every ceiling/clamp that fires on a *shipped* draft, ranked by impact × frequency, each mapped to a lever + state (§5). Target: every row → 0 frequency.
3. **Category Floor** — the ten rubric marks vs the 8.0 each needs; surfaces the 4 craft-limited categories (prose 5, dialogue 6, character 6, clues 7) as the *last* lift.

**Operational rule:** after every batch, update the three ledgers from the run reports (`apps/api/data/reports/*/`), not prose. "Reach 80" is done when all Reliability rows are 0, all Cap rows are 0, and the Category Floor averages ≥ 8 — a checklist, not a vibe.

> The dashboard's data arrays live in one block at the top of the HTML; re-point them at a real ≥4-run batch and it becomes the live scoreboard.

---

## 4. The plan — three moves, in strict order

### MOVE 1 — FLOOR: ship rate → 100%  *(cheapest, highest leverage, nobody's tracking it)*

A run that aborts scores nothing, so reliability dominates today. The failures are a known list; **every one now has a built lever** — the work is verification, not construction.

- [x] ~~Enable `AGENT9_REGEN_TRANSITION`~~ **Done** — RC3.3 built, validator aligned (`41e7fe02`), **already `=true` in `.env.local`**. Remaining: verify it fires — grep `Agent9-Regen-Ch*transition` in the prompt log on a disappearance→murder run (S1).
- [x] ~~Fix `illegal_named_walk_on`~~ **Built** (`6b90a9aa`, v1 called this a live gap): obligation + deterministic anonymise-repair behind `AGENT9_WALKON_REPAIR` (**already on in `.env.local`**). Runs **pre-validation** (`agent9-run.ts:4972`, before `validateCurrentProse`) — the safe side of the mutation-ordering rule. Common-word surnames (Mrs Green) covered by the RC4.4 class fixed in `ad43101e`. Remaining: confirm the run-1 fixture now reaches a score (S2).
- [x] ~~Fix `cleared_culprit_conflict`~~ **Built** (`6b90a9aa`, unconditional — no flag): `computeLiveCulprits` names excluded from clearance targets construction-side + validator precision, with both-directions tests (`cleared-culprit-window-s3.test.ts`). Remaining: confirm gone from reports (S3).
- [ ] **Keep the soundness repair unconditional, blocking OFF** — `repairCaseSoundness` runs always (RC2.5, `f0818052`); `AGENT9_BIBLE_GATES_BLOCKING` stays commented out in `.env.local` (S4).
- [ ] **Audit the two unledgered abort channels** — template-bleed openers + Agent-7 beat enum (S4b, new in v2).

**Acceptance (M1):** **8 consecutive scored runs *after* S1–S4b land** (two sequential 4-run batches; S0's baseline batch does not count) — 0 hard-aborts, each reaches a scored release-gate (`passed` or `needs_review`, never `aborted`/`failure`).

### MOVE 2 — CEILING: extinguish the top caps  *(lift the shipped score from ~67 toward the mid-70s)*

Each cap maps to a built lever. Enabling a flag makes the machinery *active* — but note a gate/embargo alone does not fix a cap; the **inject→regen** passes are what actually remove the offending prose. Work top of the Cap Ledger (§5) down.

- [ ] **Verify the on-levers fire (RC-1):** `AGENT9_REGEN_CLUE` + `AGENT9_REGEN_SCAFFOLD` are on in `.env.local` — confirm they fire and clear `deductive-scaffold` **and** `report-style clearance` (same lever covers both). Verify via `Agent9-Regen-*` labels + falling cap frequency (S6).
- [ ] **Enable the mechanism-too-early regen** — v1's "cap with a gate but no repair" is **built** (S8 pass, `AGENT9_REGEN_MECHANISM`, `agent9-run.ts:4287`, keyed off `chapterFullyExplainsMechanism` + the Bible `discriminatingTestChapter`). Now a CONFIG flip + verify (S8).
- [ ] **Enable resolution + culprit-evidence regen** — `AGENT9_REGEN_RESOLUTION`, `AGENT9_REGEN_CULPRIT_EVIDENCE` (RC1.4, built, off) (S7).
- [ ] **Enable DT-evidence completeness** — `AGENT6_DT_EVIDENCE_COMPLETENESS` (RC3.4, built + tested, off) so every discriminating-test clue is mapped strictly before its reveal scene (S9).

**Acceptance (M2):** on the M1 batch, Cap Ledger shows the top-4 caps at ≤1 occurrence across ≥4 runs; median shipped score ≥ 73.

### MOVE 3 — PROVE: run the N≥4 matched A/B — *finally*  *(the move deferred since A_54)*

- [x] ~~Build the matched harness~~ **Built** (`4fa63a19`): `scripts/exp-regen-clue-ab.mjs --flag <NAME>` replays Agent 9 over a prior run's hydrated upstream artifacts twice (control/treatment), so each pair is **matched by construction** on chapter count + opening-naming — the two confounders the canary-k2 lesson names. Mode-valued flags supported (`--treatmentValue enforce`). Remaining: select the ≥4 diverse run set (S11).
- [ ] **Run the A/B and read the deltas honestly:** one flag per replay — never two retry-bearing gates at once. Accept a lever only if its target category/cap moved and nothing regressed. Grade-band quantization (60/63/70) exaggerates a few points — use the raw score + cap frequencies, not the band (S12).
- [ ] **Flip defaults** for every lever that wins; **delete the injector layer** (LLD P7) once every RC-1 pass is validated-on (S13).
- [ ] **Then, and only then, the craft lift (RC-5):** A/B `AGENT9_CRITIQUE_REWRITE` + model tiering + `AGENT9_VOICE_ENFORCE`. Note these are **already on in the standing `.env.local`** (see §10 snapshot) — the A/B harness overrides per-arm, so the standing config needn't change; the *default flip* decision waits on the A/B. This is the last 74→80 push and only reads true once caps are off and measurement is powered. The category floor (prose 5, dialogue 6, character 6, clues 7) is the target here (S14).

**Acceptance (M3 = target 80):** mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship rate 100%, over ≥4×4 matched.

---

## 5. The Cap Ledger  *(the finite ceiling list — each row must reach 0 frequency; State audited 2026-07-12 @ `4fa63a19`)*

| Cap (`facts` trigger) | Clamps | Impact | Fix / lever | State |
|---|---|---|---|---|
| `mechanismExplainedTooEarly` | plot_structure ≤6, pacing ≤6 | high (fired run 2) | RC2.4 embargo + **S8 regen `AGENT9_REGEN_MECHANISM`** (`agent9-run.ts:4287`) | built · **ON in `.env.local` (2026-07-12)** · verify on batch (S10) |
| `scaffoldHits` (deductive-scaffold) | prose ≤4, ceil 65 (≥2) | high | RC1.1/1.3 · `AGENT9_REGEN_SCAFFOLD` | on in `.env.local` · verify it fires (S6) |
| `reportStyleClearance` | prose ≤6, ending ≤7 | med-high | RC1.2 · **same lever: `AGENT9_REGEN_SCAFFOLD`** (one pass covers both shapes, `agent9-run.ts:186-193`) | on · verify it fires (S6) |
| `revealUsesUnplantedEvidence` | ending ≤5 | med | RC3.4 · `AGENT6_DT_EVIDENCE_COMPLETENESS` | built · **ON in `.env.local` (2026-07-12)** · verify on batch (S10) |
| `templateLeakageHits` | prose ≤4, ceil 65 (≥2) | high | RC1.x · inject→regen (`AGENT9_REGEN_CLUE`) | on · verify (S6) |
| `culpritIsVictim` / `deadVictimIsCulprit` | **ceil 55–60** (killer) | catastrophic when it fires | RC2.5 · `repairCaseSoundness` (unconditional) + warn-level gate | **repair live** · blocking stays off (S4) |
| `pronounsUnstable` | ceil 69, prose ≤5 | med | RC2.2 · Bible pronoun-lock (`AGENT9_BIBLE_AUTHORITATIVE`) | on in `.env.local` · verify |
| `malformedEvidenceSurfacing` | prose ≤5, ceil 70 (≥3) | med | A_57 D1 (landed) | fixed |
| `victimUnnamed` | ceil 72 | med | RC4.4 alias matcher incl. common-word surnames (`ad43101e`) | **fixed** |
| `dualValueNoContrast` | clues ≤6 | med | A_57 D2 (landed) | fixed |
| `weakMurderMethod` | ending ≤6, ceil 75 | med | RC3.5 death-method tell | tell built · off |

---

## 6. The Reliability Ledger  *(every abort channel, not just last batch's — each must reach 0; State audited 2026-07-12)*

| Hard-fail major | Seen (recent) | Fix / lever | State |
|---|---|---|---|
| `illegal_named_walk_on` | 5× (run 1) | Obligation + deterministic anonymise-repair · `AGENT9_WALKON_REPAIR` (`agent9-run.ts:4972`, **pre-validation**) | **built (`6b90a9aa`) · ON in `.env.local` · verify (S2)** |
| `cleared_culprit_conflict` | 1× | Culprit excluded from clearance targets (construction) + validator precision — unconditional, no flag | **built (`6b90a9aa`) · verify (S3)** |
| `missing_case_transition_bridge` | 2× | RC3.3 · `AGENT9_REGEN_TRANSITION` (validator aligned `41e7fe02`) | built · **ON in `.env.local` · verify (S1)** |
| season/mechanism FP (`august vs spring`) | 1× (A_60) | RC2.3/RC4.1 case-derived vocab | **fixed · live** |
| Agent-5 coverage abort | (A_61) | RC3.1 repair-not-abort | fixed |
| reveal never converges | (A_58) | RC1.3 resolution→regen · `AGENT9_REGEN_RESOLUTION` | built · **ON in `.env.local` (2026-07-12)** · verify (S5/S10) |
| **template-bleed opener linter** *(v1 omission)* | historical (killed runs mid-prose) | Backstop **LIVE**: completion-first exhaustion fallback (`preferCompletionOnFailure` defaults true, no caller passes false — both throw sites dead by default) + accept-after-exhaustion bypasses for opener/entropy/fingerprint (`generate.ts:3254-3344`, `opener_exhaustion_bypass_enabled` default on) | **audited 2026-07-12 · row closed** |
| **Agent-7 out-of-enum `scene.beat`** *(v1 omission)* | historical (interrogation/resolution/discovery/reflection) | Both halves **LIVE**: deterministic coercion (`coerceNarrativeSceneBeats`, synonym-map or drop, BEFORE schema validation on first attempt AND retry, `agent7-run.ts:1396,1441`) + failing outline persisted (`ctx.failedNarrative` → partial-artifact snapshot, `mystery-orchestrator.ts:1423`) | **audited 2026-07-12 · row closed** |
| **Truncated Agent-5 JSON → jsonrepair phantom clue** *(NEW — first seen run `a3c2973f`, 2026-07-12 smoke run)* | 1× (aborted the run at the release gate: a fabricated `{id:"clue_"}` entered the timeline/outline/NSD ledger; validation was clean, all 20 real clues visible) | Three-part fix (2026-07-12): `parseClueJsonContent` flags completion-limit truncation + ONE fresh retry; `dropMalformedParsedClues` removes non-canonical-id / description-less entries at the parse boundary (surfaced as `Agent 5: parse boundary:` warnings); `agent5_clues.max_tokens` 3000→6000 (the payload genuinely outgrew the budget). Companion fix: `release_gate_outcome.status` now reads `failed` whenever a hard stop fires (was contradictorily `passed` on this run). | **fixed · built + tested · verify on next batch** |

---

## 7. Milestones

- **M1 — Floor:** ship rate 100% (8/8 post-change runs reach a score). *Enables scoring on the ~50% currently lost.*
- **M2 — Ceiling:** top-4 caps ≤1 occurrence across the batch; median shipped ≥ 73.
- **M3 — Target:** validated 80 (mean ChatGPT ≥80, gap ≤3, ship 100%) on ≥4×4 matched. Flip defaults; delete injector layer; ship craft lift.

---

## 8. Guardrails — the five mistakes, do NOT repeat them

1. **Never conclude from n=1 or n=2.** Every A/B is ≥4×4 matched on chapter count. (A_54, confirmed again this week.)
2. **Stop building; start flipping-and-measuring.** As of `4fa63a19` this is literally true: every ledger row has a built lever; the bottleneck is a **measurement debt**, not a code debt. New code only for the two shadow→enforce promotions (§9) or where the S4b audit proves a live abort path.
3. **Track reliability as a first-class axis.** A 67 that ships and a run that aborts are both "not 80" for opposite reasons; the averaged score hides the abort rate.
4. **Caps ≠ craft.** Four runs in a row died on validator false-negatives on 94%-quality prose. Check the Cap/Reliability ledgers before ever concluding "the prose needs work."
5. **Keep the scoreboard, not the diary.** Update the three ledgers per batch. A new `ANALYSIS_NN` is for a genuinely new finding — not a routine run post-mortem.

**And the standing law (A_59/A_61):** *deterministic code may VERIFY and GUARANTEE; it must never WRITE. Validators/repairers dereference the frozen Bible fact — never re-derive it from prose.* No new per-mechanism regex, no per-template reword, no new deterministic prose injector.

**On flags:** the module-const load-order bug (flags frozen at import before dotenv read `.env.local`) is **fixed** — every agent9-run.ts flag is now a runtime getter (`grep '^const .* = parseBooleanEnv' agent9-run.ts` returns nothing). The discipline it taught stays: **confirm a lever actually fired by grepping its agent label in `logs/llm-prompts-full.jsonl` — never assume a flag took.**

---

## 9. Genuine remaining build work (not just flips)

**None (v2.1).** Every item below is resolved; the remaining work is RUN-only.

- ~~**RC3.2 Agent-3b plausibility enforce path**~~ — was ALREADY BUILT (v2 was stale on this too): `AGENT3B_PLAUSIBILITY_JUDGE` off|shadow|enforce with bounded regen retries + judge feedback + the theme-coherence guard (`agent3b-run.ts:174-295`). Flipped to **`shadow`** in `.env.local` so the batches collect judge telemetry; `enforce` is the Phase C A/B treatment value.
- ~~**RC5.3 regen-on-leakage**~~ — **built 2026-07-12**: `runVoiceLeakageRegenPass` (`regen-integration.ts`, per-tic validation so multi-leak chapters don't thrash, same-tic-two-mouths grouped into one obligation), the idiolect validator now carries `tic`/`owner` on leakage issues, and the worker's `enforce` mode repairs-then-re-verifies (unresolved leaks still warn, never abort). Both-directions + rollback + grouping tests in `regen-integration.test.ts`.
- ~~**Template-bleed backstop** (conditional)~~ — S4b audit: already live (§6 row closed). Not built — nothing to build.
- ~~**Agent-7 beat coercion** (conditional)~~ — S4b audit: already live, including failed-outline persistence (§6 row closed). Not built — nothing to build.

*(v1 listed the walk-on repair, cleared-culprit guard, and mechanism regen here — all built as of `6b90a9aa`…`4fa63a19`.)*

---

## 10. Step-by-step implementation plan

Ordered, dependency-sequenced, PR-sized steps. Work top to bottom. Each step tags its **kind** — `CONFIG` (flag in `.env.local`, no build), `CODE` (build + both-directions test + dist rebuild), `RUN` (canary batch, ~£1–1.5 each), `VERIFY` (grep/report check, no run of its own) — and a **verify** you can check before moving on. Flags live in `.env.local` (git-ignored, worker-loaded); code-default flips wait for Move 3.

**Run budget (state it so it doesn't get trimmed):** S0 (4) + S5 (8) + S10 (4) + S12 (≥16 arms) + S14 A/Bs (~8) ≈ **40 runs ≈ £40–60 total**. Trimming batch sizes mid-plan is exactly how the powered A/B stayed deferred since A_54 — the budget is the plan.

> Golden rules baked in: change **one lever per measured replay**; every `CODE` step ships with a both-directions test and a `npm run build:all` (worker consumes dist); confirm a lever actually fires by grepping its agent label in `logs/llm-prompts-full.jsonl` — never assume a flag took.

**Standing `.env.local` snapshot (2026-07-12, post-v2.1 flips) — this is what S0 baselines:**

| On | Off (default) |
|---|---|
| `AGENT9_BIBLE_AUTHORITATIVE`, `AGENT9_REGEN_CLUE`, `AGENT9_REGEN_SCAFFOLD`, `AGENT9_REGEN_TRANSITION`, `AGENT9_WALKON_REPAIR`, `AGENT9_CRITIQUE_REWRITE`, `AGENT9_MODEL_*` tiering, **`AGENT9_REGEN_RESOLUTION`, `AGENT9_REGEN_CULPRIT_EVIDENCE`, `AGENT9_REGEN_MECHANISM`, `AGENT6_DT_EVIDENCE_COMPLETENESS` (Phase B, flipped 2026-07-12), `AGENT3B_PLAUSIBILITY_JUDGE=shadow`** | `AGENT9_VOICE_ENFORCE` (repair half built — flip to `enforce` is an S14 A/B decision), `AGENT9_BIBLE_GATES_BLOCKING` (commented — Move-3 quality decision) |

> Phase B levers were flipped together (implement-now / run-later). The M2 gate (caps clear, median ≥73)
> reads fine jointly; per-lever attribution comes from the Phase C harness per-arm overrides. Comment
> some out in `.env.local` if you prefer staged per-batch verification.

> Note the craft levers (`CRITIQUE_REWRITE`, model tiering) are already in the standing config even though their *default-flip decision* is Phase C — the baseline therefore measures the standing config, and S14's A/B isolates them per-arm via the harness. Do not read S0 numbers as "pre-craft-lift".

### Phase A — FLOOR (→ M1: ship rate 100%)

**S0 · Baseline the ledgers** · `RUN`
Run a 4-run canary batch on the standing flags (`node scripts/canary-core.mjs` ×4, sequential). Parse each `apps/api/data/reports/<runId>/*.json` into the three ledgers (§3). This is the starting scoreboard and proves the tracking loop works.
*Verify:* 4 reports on disk; ship-rate, cap-frequency, category-floor recorded. *Exit:* baseline row in the dashboard.

**S1 · Verify the transition-bridge regen fires** · `VERIFY` *(v1: CONFIG — the flag is already on)*
`AGENT9_REGEN_TRANSITION=true` is set; the validator/regen condition was aligned in `41e7fe02`.
*Verify:* on a disappearance→murder run, `grep "Agent9-Regen-Ch.*transition" logs/llm-prompts-full.jsonl` returns a hit and `missing_case_transition_bridge` is absent from the report.

**S2 · Verify the walk-on repair** · `VERIFY` *(v1: CODE — built in `6b90a9aa`, on in `.env.local`)*
The pass anonymises out-of-cast titled walk-ons to role nouns **pre-validation** (`agent9-run.ts:4972`, upstream of `validateCurrentProse`) and never touches cast names; common-word surnames are covered by the RC4.4 class (`ad43101e`); both-directions tests exist (`walkon-repair-s2.test.ts`).
*Verify:* on the S0/S5 batches, `illegal_named_walk_on` never aborts a run; when the repair fires, the report carries `[Agent 9] walk-on repair: anonymised …` and the run still reaches a score. If any out-of-cast name slips both the obligation and the repair, treat as a bug in `anonymiseNamedWalkOns` coverage — fix there, don't add a new layer.

**S3 · Verify the cleared-culprit guard** · `VERIFY` *(v1: CODE — built in `6b90a9aa`, unconditional)*
`computeLiveCulprits` names are excluded from clearance targets at construction (`suspect_clearance_scenes` filter, `agent9-run.ts:1454`) and the validator asserts the culprit is never cleared; both-directions tests exist (`cleared-culprit-window-s3.test.ts`).
*Verify:* `cleared_culprit_conflict` absent from every batch report; a genuine (non-culprit) suspect still gets cleared in the prose.

**S4 · Confirm the soundness repair runs — keep blocking OFF** · `VERIFY`
The repair hook (`repairCaseSoundness`) runs **unconditionally** — it fixes culprit=victim, unknown-gender, missing/eliminated culprit at source, which is the reliability win. **Do NOT enable `AGENT9_BIBLE_GATES_BLOCKING` in this phase:** blocking makes a residual (unrepairable) unsound case *abort* (`agent9-run.ts:3473,3511` throw), which is the opposite of the ship-rate goal. Blocking is a Move-3 **quality** decision (an unsound case shouldn't *ship* at 80), gated on the N≥4 A/B — not a floor lever.
*Verify:* the repair fires (`[Agent 9] case-soundness:` in warnings) and no run aborts on the soundness gate (it stays warn-level).

**S4b · Audit the two unledgered abort channels** · `VERIFY` · ✅ **DONE 2026-07-12 — both channels already closed, no conditional code needed**
  1. **Template-bleed openers** — exhaustion path traced: cosmetic accept-after-exhaustion bypasses (opener/entropy/fingerprint/debug-note, `generate.ts:3254-3344`) fire first; anything residual falls to the completion-first best-attempt/fallback commit. The only throw sites are gated on `preferCompletionOnFailure === false`, which defaults true and **no caller in the repo ever passes false**. No abort by default.
  2. **Agent-7 `scene.beat`** — `coerceNarrativeSceneBeats` (synonym-map or drop) runs BEFORE schema validation on both the first attempt and the retry (`agent7-run.ts:1396,1441`); a still-failing outline is captured (`ctx.failedNarrative`) into the partial-artifact snapshot (`mystery-orchestrator.ts:1423`).
*Both §6 rows closed. The remaining check is empirical: the S5 batches should show zero aborts from either class.*

**S5 · M1 gate** · `RUN`
Run **two sequential 4-run batches** with S1–S4b in place. **Exit M1: 8/8 consecutive post-change runs** reach a scored release-gate (0 `aborted`/`failure`). S0's baseline runs do **not** count toward the 8 — they ran before the levers were verified. Update the Reliability Ledger — all rows should read 0.

### Phase B — CEILING (→ M2: caps ≤1, median shipped ≥73)

**S6 · Confirm the on-levers actually fire** · `VERIFY`(reuse S5 batches) + `CODE`(if broken)
On the M1 batches, grep `Agent9-Regen-*` labels. `AGENT9_REGEN_CLUE`/`_SCAFFOLD` are on — confirm they fire and clear `deductive-scaffold` **and** `report-style clearance` (the scaffold pass owns both shapes). If a label is absent on a run whose report shows the cap, the wiring is broken → fix. (The historical cause — module-const flags freezing before dotenv — is fixed; all flags are runtime getters now. If it recurs, look for a *new* module-level `process.env` read.)
*Verify:* every fired cap in a report has a corresponding regen attempt in the prompt log.

**S7 · Enable resolution + culprit-evidence regen** · `CONFIG` · ✅ **SET 2026-07-12** (`AGENT9_REGEN_RESOLUTION=true`, `AGENT9_REGEN_CULPRIT_EVIDENCE=true`)
*Verify (on the batch):* `Agent9-Regen-Ch*-missing_resolution` / `-culprit_unlinked` labels appear; the "It was me… I confess" / "beyond all reasonable doubt" templates no longer ship.

**S8 · Enable + verify the mechanism-too-early regen** · `CONFIG` · ✅ **SET 2026-07-12** (`AGENT9_REGEN_MECHANISM=true`; pass at `agent9-run.ts:4287`)
*Verify (on the batch):* `Agent9-Regen-*mechanism*` label appears when the cap would have fired; `mechanismExplainedTooEarly` gone from batch reports. (Both-directions tests already green.)

**S9 · Enable DT-evidence completeness** · `CONFIG` · ✅ **SET 2026-07-12** (`AGENT6_DT_EVIDENCE_COMPLETENESS=true`, RC3.4)
*Verify (on the batch):* `findUnplantedDiscriminatingClues` reports empty post-Agent-6; the `ending ≤5` cap gone.

**S10 · M2 gate** · `RUN`
Re-run a 4-run batch. **Exit M2:** top-4 Cap-Ledger rows at ≤1 occurrence across ≥4 runs; median shipped score ≥ 73.

### Phase C — PROVE (→ M3: validated 80)

**S11 · Assemble the matched A/B run set** · `VERIFY`/config · ✅ **HARNESS COMPLETE 2026-07-12 — only pool selection remains**
`scripts/exp-regen-clue-ab.mjs --flag <NAME> --runIds R1,R2,R3,R4` replays Agent 9 over each prior run's hydrated upstream artifacts twice (control/treatment via `canary-agent-boundary.mjs`), so every pair is **matched by construction** on chapter count + opening-naming. Mode-valued flags supported (`--treatmentValue enforce --controlValue off`). The v2 caveat is RESOLVED: `canary-agent-boundary.mjs` now accepts `--agent 6,9` chains (chain members run fresh in pipeline order; everything else — including the Agent-7 outline — stays hydrated, so pairs remain matched), the harness passes it through as `--agents 6,9`, and it REJECTS an `AGENT6_*` flag whose chain never runs Agent 6 fresh (both arms would be identical). Diversity comes from *choosing* the run pool: pick ≥4 runs diverse on era/setting/cast/crime/mechanism (rotate `CANARY_THEME` when generating fresh pool runs).
*Verify:* the harness emits paired, chapter-count-matched run sets; one flag toggled per arm; no `SYNTHESIZING_CODE 7` warnings.

**S12 · Run the A/B and decide flips** · `RUN`(the big one, ≥16 arms)
One flag per replay — never two retry-bearing gates at once. Read raw scores + cap frequencies (not the grade band; 60/63/70 quantization exaggerates). Accept a lever only if its target category/cap moved and nothing regressed.
*Verify:* a per-lever accept/reject table with deltas (`exp-regen-clue-analyze.mjs`).

**S13 · Flip defaults + delete the injector layer** · `CODE`
For each winning lever, flip its code default (the runtime getter's fallback) from `false`→`true`. Once every RC-1 regen is validated-on, delete the deterministic injectors it replaced (LLD P7); keep only guarded normalizers + the logged emergency floor.
*Verify:* full suite green; a run with an empty `.env.local` behaves like the validated config.

**S14 · Craft lift A/B + final validation** · `RUN`
`AGENT9_CRITIQUE_REWRITE` + `AGENT9_MODEL_*` are already in the standing config — S14 is where they get their **powered verdict**: A/B each in isolation via the harness (per-arm override), plus `AGENT9_VOICE_ENFORCE=enforce` (vs `off`). Target the category floor (prose 5, dialogue 6, character 6, clues 7 → 8s). Their code-default flips ride on the S12/S14 verdicts, not on the standing `.env.local`.
**Exit M3 (target 80):** mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship rate 100%, over ≥4×4 matched.

### Sequencing at a glance

```
Phase A  FLOOR     S0 baseline(RUN) → S1–S4 verify-on-batch → S4b ✅done → S5(RUN×8) ✅ ship 100% (8/8 post-change)
Phase B  CEILING   S6 verify-fires-on-batch → S7 ✅set → S8 ✅set → S9 ✅set → S10(RUN×4) ✅ caps≤1, median≥73
Phase C  PROVE     S11 ✅harness done, pick pool → S12 A/B(RUN, ≥16 arms) → S13 flip defaults + delete injectors → S14 craft-lift A/B → M3 ✅ validated 80
```

**Critical path / dependencies (v2.1):** **all CODE and CONFIG steps are done** — S4b closed both conditional channels without code, RC3.2 was already built, RC5.3 is built and tested. The critical path is now purely: S0 batch → S5 batches (M1 gate) → S10 batch (M2 gate) → S12 A/B arms → the S13/S14 *decisions* (the only remaining non-RUN work, and both are gated on S12's data). Do **not** start Phase C before Phase A's ship-rate is 100% — an aborting run pollutes every A/B cell.

---

*Prev roadmaps: `documentation/analysis/_archive/ANALYSIS_47/ROADMAP_TO_80.md` and v1 of this file (2026-07-11, superseded in place). Root-cause detail: `documentation/analysis/ANALYSIS_61/ANALYSIS_61.md`. First-principles design: `documentation/plan/agent9-first-principles-LLD.md`.*
