# ANALYSIS_55 — Failure-run review: K2 = 0 ("Hard to follow as a story")

Status: **in progress — root-cause investigation running.** A review of a single **dev API-server run** (`node dist/index.js`, `@cml/api` on :3005) that produced a complete 10-chapter story but scored **K2 0/100** with the **mechanism-early-leak cap** firing. Purpose: identify the root causes, separate *already-fixed* (by A_53/A_54) from *open*, and propose holistic fixes.

> **Build provenance (important):** this run **predates the A_54 culprit-near-death fix** — the `enforceCulpritEvidencePresence` SKIP fired for the culprit "Margaret Finch" (a co-present, non-victim culprit), which the A_54 #1 fix now prevents. So several observed failures are *snapshot* artifacts of a stale `dist`, not the current code. Treat this as a **regression-surface map**, validating that the A_54 fixes target real failures.

---

## 0. Headline

**`[Rubric] 0/100 (Hard to follow as a story); raw 0; caps: mechanism explained too early (before the discriminating-test scene) → plot_structure ≤ 6; … → pacing ≤ 6`**

Two catastrophes stacked: (1) the **mechanism-early-leak structural cap** (the exact cap A_52 cleared) fired *despite* Agent 7 logging "full mechanism withheld in 8 pre-test scenes; reveal allowed from scene #9"; and (2) the **raw rubric is 0** ("hard to follow"), pointing to deep narrative incoherence beyond the cap — most likely the **victim/culprit lifecycle confusion** (victim Sir Reginald Harcourt narrated as alive after death; culprit Margaret Finch near a Ch1 death marker).

---

## 1. Observed timeline (from the cmd log)

- **Two run attempts in the log.** A first attempt (2026-06-28T12:53) ran Agent 1 → 2 → 2e → 3b → 3 → 5 then **stopped with no error line** (abandoned). A fresh full run started 2026-06-29T07:03 — the one analysed here.
- Agents 1–3b, 3, 5: validated first attempt. Agent 5: **20 clues, 20/20 map to a derived slot** (clue-spec shadow "100%"). Agent 6 fair-play + blind reader: ran. Agent 2b/2c/2d, 6.5, 7: ran.
- **Agent 7:** outline of **10 scenes**, grid @10 (3/5/2) coverage 90%, complete=true ordered=true. **Mechanism gate: "full mechanism withheld in 8 pre-test scene(s); reveal allowed from scene #9."**
- **Agent 9 prose (10 chapters), 3/10 batches required retry:**
  - **Ch4** — control-plane leakage: *"the web of obligation in the manor was as intricate as any **mechanism**"* (obligation_term) → passed attempt 2.
  - **Ch5** — boundary integrity: unbalanced quotation marks → failed 2 attempts → **completion-first fallback accepted** (degraded).
  - **Ch7** — **"Stage-mode outcome failed (suspect_pressure): no full culprit resolution is allowed in suspect-pressure mode"** + template linter "opening lists multiple named rooms as a location inventory" → failed all 3 attempts → **completion-first fallback accepted** (degraded).
  - **Ch9** — **G4 DT-scene scheduling gap**: discriminating-test scene has no fresh DT-evidence clue scheduled (needed clue_13 / clue_14 / clue_4).
- **Post-processing:** deterministic pronoun sweep 4 repairs; `applyLifecycleContinuityGuard` rewrote **2 ambiguous death-attribution sentences**; `enforceCulpritEvidencePresence` **SKIPPED** injection for culprit **Margaret Finch** ("near a death marker in Ch1; CML culprit assignment likely invalid"); `applyCanonicalVictimRescue` **reframed 6 active-victim sentences as recollection** for canonical victim **Sir Reginald Harcourt**.
- **Rubric: 0/100, raw 0, mechanism-early-leak cap.**

---

## 2. Root-cause analysis (per failure mechanism)

Investigated by a 4-agent code workflow (`wcy6z30u4`). **The single most important finding: the K2 = 0 is a FALSE ZERO from a scoring parser bug — the judge actually scored the story 73.**

### 2.1 🔴 CRITICAL — `raw = 0` is a rubric-score parser bug (judge scored 73)
The judge (gpt-4.1-mini) returned `categories` as an **object map** keyed by category name (`{"premise":{…}, "opening_hook":{…}, …}`, with its own `total: 73`) instead of the schema's **array**. `parseJudgeResult` (`packages/rubric-score/src/llm-judge.ts:80`) does `const rawCats = Array.isArray(obj.categories) ? obj.categories : []` → for an object that is `[]` → `categories=[]` → `hard-caps.ts:90` computes `rawTotal` by reducing the **empty** array → **0**. The judge's own `obj.total: 73` is discarded; its `overall_view` was glowing ("A well-crafted Golden Age mystery…"). Compounding: `createLLMRubricJudge` (`llm-judge.ts:39-48`) sets `jsonMode:true` but **never passes `RUBRIC_SCHEMA` to the chat() call**, so the model's wrong shape is never rejected — the lossy parser silently zeroes the score instead of erroring/retrying. **This can silently zero ANY run whose judge returns the object-map shape.** (It stayed dark in A_54 because those runs happened to get array-shaped output — raw 63, 70.) **OPEN — not in A_53 or A_54.**

### 2.2 Mechanism-early-leak cap fired despite the gate — the gate is *advisory*
Independent of 2.1, the **cap is correct** (a real leak). Agent 7's mechanism gate is, by its own comment, a "pure metadata stamp + prompt hint — it does not reorder scenes or move clues" (`agent7-run.ts:246-273`); Agent 9 **ignored the hint and fully explained the heat-expansion mechanism in Chapter 3**. The rubric's verifier `resolveMechanismExplainedChapter` (`structural-verifiers.ts:210-232`) measured the *finished prose* (mechanism @ Ch3, test @ Ch10) → the CONFIRM branch (`score.ts:129-132`) set `mechanismExplainedTooEarly=true`, **overriding the judge's `false`** → `hard-caps.ts:64-67` clamped plot_structure/pacing ≤ 6. So the gate-log and the cap are *not* contradictory: the gate is advisory at outline time; the verifier audits the prose. **This is the A_52 cap working as designed (a fresh leak), not a regression — but the gate needs ENFORCEMENT, not just a hint. OPEN.**

### 2.3 K2 narrative-coherence drag — victim/culprit lifecycle confusion
Two run-predating defects: **(1)** the culprit "Margaret Finch" SKIP is the **OLD ±250-char co-presence false positive** (`enforceCulpritEvidencePresence`, stale-dist `agent9-run.ts:1998-2018`) — in a manor opening every suspect is near the body, so Finch (≠ the victim Sir Reginald Harcourt) trips it; the gate wrongly declared the valid culprit "likely invalid" and **suppressed the culprit-evidence injection** → guilt never clarified in prose. **This is exactly A_54 §3.4 #1, which I already FIXED — this run predates it.** **(2)** the victim **did** read as active-after-death — `applyCanonicalVictimRescue` reframed **6** sentences (Sir Reginald Harcourt with active/confession predicates after his death chapter) and `applyLifecycleContinuityGuard` rewrote **2** more. The rescues patch it post-hoc, but the LLM produced genuinely confused lifecycle prose. **PARTIALLY addressed (culprit fixed; victim-active-after-death is an open generation issue).**

### 2.4 Completion-first fallback masks STRUCTURAL chapter failures (count-only)
Ch7 hard-failed the **stage-mode contract** ("suspect_pressure: no full culprit resolution allowed" — the prose resolved the culprit too early, `clue-validation.ts:935-942/1065-1069`) **plus** a location-inventory template-bleed, across all 3 attempts; ch5 failed on unbalanced quotes twice. The completion-first fallback then committed both as "success". Root cause: **best-attempt is selected by raw error COUNT only** (`generate.ts:3241-3244`, `if (batchErrors.length < bestAttemptErrorCount)`) — no severity weighting, so a chapter with one *structural* break can be "better" than one with two *cosmetic* nits, and a structurally-broken chapter ships unflagged with no score-feedback. **PARTIALLY (A_54 #5 describes the same mechanism but only for the final-chapter resolution). OPEN for the general case.**

### 2.5 G4 DT-scene gap — a beat-scheduler invariant contradiction (root mechanism found)
A_54 #4 documented the G4 gap as pre-existing/intermittent; the **root mechanism** is now identified. The beat-scheduler emits the DT's `evidence_clues` (clue_13/14/4) **both** as the `discriminating_test` obligation's `supportingClues` **and** as independent `reveal_clue` obligations (`collect.ts:38-45/85-92/117`). Any `essential` evidence clue is then **forced to first-reveal strictly BEFORE the test slot** (`schedule.ts:122` `if (essential && idx >= testIdx) return false`; `invariants.ts:92-93` hard-fails an essential reveal at/after `testIdx`), so the DT slot receives **zero fresh `cluesRevealed`** — yet `isClueBearing` returns true for it via the `discriminating_test && supportingClues.length>0` branch (`invariants.ts:144`), so coverage/ordering self-checks pass and the clue-spec shadow reports "100% slots mapped", **masking the gap**. The G4 detector (Agent 9) then correctly flags it. **OPEN.** (The abandoned first run-attempt at 12:53 — stopped cleanly after Agent 5 with no error — was not conclusively explained; most likely a manual restart / client disconnect, not a pipeline abort.)

---

## 3. Already-fixed vs open

| Finding | Severity | Status |
|---|---|---|
| 2.1 `raw=0` parser bug (judge gave 73) | 🔴 critical | **OPEN** — not in A_53/A_54; **fixed in this pass** (see §4) |
| 2.2 mechanism gate is advisory → real leak → cap | high | **OPEN** — gate needs enforcement |
| 2.3a culprit-near-death SKIP false positive | high | **FIXED (A_54 #1)** — this run predates it; needs the API/dist rebuilt |
| 2.3b victim narrated active-after-death | high | partially (post-hoc rescues exist); generation-side OPEN |
| 2.4 completion-first fallback masks structural failures (count-only) | high | partially (A_54 #5, final chapter only); OPEN for the general case |
| 2.5 G4 DT-scene gap (scheduler invariant contradiction) | high | OPEN (A_54 #4 documented the symptom; root mechanism now found) |

## 4. Conclusions & recommendations

**Conclusion.** The headline "K2 = 0" is **not a story-quality collapse — it is a scoring-infrastructure bug**: the judge scored the story **73** and the parser zeroed it. The *real* quality issues are second-order (a genuine mechanism leak that the advisory gate didn't prevent, victim-lifecycle confusion, and a structurally-broken Ch7 that the count-only fallback shipped). One of the surfaced issues (the culprit-near-death SKIP) is **already fixed in the working tree (A_54)** and this run simply predates it — confirming that fix targets a real, recurring failure.

**Recommendations (priority order):**
1. **🔴 Fix the rubric-score parser (DONE in this pass).** `parseJudgeResult` now accepts the object-map `categories` shape, falls back to the judge's own `total`, and **never silently zeroes** a present-but-malformed payload (it flags parse-failure for retry instead). This protects *all* scoring telemetry. *(Implemented + tested; see the A_55 follow-up commit.)*
2. **Rebuild + redeploy** so the API/dev server picks up the A_54 culprit-near-death fix (2.3a) and the worker dist. The stale-dist `±250-char` gate is still live in that build.
3. **Enforce the mechanism gate (2.2).** Promote Agent 7's withhold flag to a deterministic Agent-9 pre-commit validator: run `resolveMechanismExplainedChapter` against each pre-test chapter and rewrite/fail any chapter that fully explains the mechanism before the discriminating-test scene — so the cap becomes a backstop, not the first line of defence. (Parameter-driven on test-scene index.)
4. **Make the completion-first fallback severity-aware (2.4).** Classify validation errors into a config-driven STRUCTURAL vs COSMETIC set; rank best-attempt by `structuralCount*W + cosmeticCount` (W from generation-params), not raw length, so a structurally-broken chapter is never preferred over a cosmetically-flawed one, and surface a quality signal when a structural failure ships.
5. **Fix the G4 scheduler contradiction (2.5).** Reserve ≥1 DT-evidence clue to first-reveal **at** `testIdx`: relax the `essential-before-test` invariant for exactly the DT-evidence reveals (or add a `reveal_clue` to `slots[testIdx]`), so the DT scene has fresh evidence and `isClueBearing`/the G4 detector see a real reveal.
6. **Address victim-active-after-death at generation (2.3b)** rather than only via post-hoc rescue — a pre-commit lifecycle linter that fails a chapter narrating the canonical victim with active predicates after their death chapter.
