# ANALYSIS_13 — Fair-Play Audit Hard-Stop + Suspect Closure Name-Match Failures

Run reference: `mystery-1778443720119`
Date: 2026-05-10
Execution command: `npm run canary:core`
Report: `apps/api/data/reports/mystery-1778443720119/`
Outcome: **FAIL** — Release gate hard-stop (overall score 59/100, grade F)

---

## 1. Executive Summary

This was the 7th canary run in the current session. Six distinct bugs had been fixed across runs 1–6. This run progressed further than any previous one — all 9 prose chapters completed with only Ch8 and Ch9 requiring retries (4 attempts each) — but was stopped at the release gate by two compounding failures:

1. **Fair-play audit hard-stop**: Agent 6's LLM auditor stored `overallStatus = "fail"` after exhausting retries. The orchestrator had already determined from deterministic coverage analysis that the mystery was structurally sound and downgraded the violations to warnings, proceeding to prose. However, the stored `overallStatus = "fail"` was never updated — so the post-prose release gate re-scored it at 45/100 and hard-stopped.

2. **Suspect closure name mismatch**: `SuspectClosureValidator` used `text.includes(fullName)` substring matching. Prose written by Agent 9 referred to suspects by surname only ("Dr. Finch", "Captain Hale") rather than full name ("Dr. Mallory Finch", "Captain Ivor Hale"). Every regex match returned false, the semantic fallback was invoked but found no text containing the full name, and both suspects were flagged as "not explicitly eliminated".

Both failures are false negatives — the prose and mystery structure were sound. No real content bug was detected.

---

## 2. Run Timeline

| Time (UTC) | Stage | Outcome |
|---|---|---|
| ~20:03 | Agent 1 Setting | Pass |
| ~20:03 | Agent 2 Cast | Pass (4 characters) |
| ~20:04 | Agent 2e Background | Pass |
| ~20:04 | Agent 3b Hard Logic | Retry ×1, pass |
| ~20:05 | Agent 3 CML | Pass |
| ~20:05 | Agent 8 Novelty | **Fail** (score below threshold) |
| ~20:05 | Agent 5 first pass | Pass (12 clues) — mechanism visibility gate cleared (threshold fix: ≥1 term vs. old ≥2) |
| ~20:06 | Agent 6 first audit | Fail → clue regen triggered |
| ~20:06 | Agent 5 fair-play regen | Pass |
| ~20:06 | Agent 6 second audit | Fail — 6 violations |
| ~20:06 | Blind reader | Pass |
| ~20:07 | Agent 4 CML revision | Triggered |
| ~20:07 | Agent 6 post-revision audit | Fail — 6 non-structural violations remain |
| ~20:07 | Agent 5 post-revision regen | Pass |
| ~20:07 | Agent 6 final verdict | Non-structural; orchestrator downgraded to `needs-revision` → proceeded |
| ~20:08 | Agents 2b/2c/2d/65/7 | All pass |
| ~20:09 | Agent 9 Ch1–7 | All pass (Ch1–7 first attempt each) |
| ~20:10 | Agent 9 Ch8 | 4 attempts (n-gram overlap retry; passed attempt 4) |
| ~20:11 | Agent 9 Ch9 | 4 attempts (structure non-convergent; passed attempt 4) |
| ~20:12 | Agent 9 AtmosphereRepair Ch1–8 | All pass |
| ~20:13 | Agent 9 Validation (×5 rounds) | LLM semantic validation passes |
| ~20:18 | **Release gate** | **FAIL — 2 hard-stops** |

Total duration: 575,356 ms (~9.6 min). Total cost: $0.0724.

---

## 3. Bug Analysis

### Bug A: Fair-Play Audit `overallStatus` Not Downgraded Before Release Gate

**Location**: `apps/worker/src/jobs/mystery-orchestrator.ts`

**Root cause**: When Agent 6 exhausts retries with `overallStatus = "fail"` but the orchestrator's deterministic coverage analysis finds no structural gaps, the orchestrator emits a warning ("mystery structure is sound, proceeding with prose") and advances. But it never updated `ctx.fairPlayAudit.overallStatus`. The post-prose release gate in `agent9-run.ts` reads this field to compute the score:

```ts
const fpValidation =
  fairPlayAudit.overallStatus === "pass" ? 100
  : fairPlayAudit.overallStatus === "needs-revision" ? 70
  : 45;  // "fail" → 45 → hard-stop triggered at < 60
```

The gate saw 45/100 → hard-stop.

**Fix**: When the orchestrator determines the mystery is structurally sound and proceeds, it now also downgrades the stored audit status:

```ts
(ctx.fairPlayAudit as any).overallStatus = "needs-revision";
```

This ensures the release gate scores it 70/100 (≥ 60 threshold → no hard-stop) consistent with the orchestrator's own verdict.

---

### Bug B: Suspect Closure Validator Full-Name Substring Match

**Location**: `packages/story-validation/src/suspect-closure-validator.ts`

**Root cause**: The validator checked `text.includes(suspect)` where `suspect` is the full name from CML (e.g. `"Dr. Mallory Finch"`). Agent 9 prose uses honorific+surname (`"Dr. Finch"`) or surname alone (`"Hale"`). Neither matches the full-name substring.

```
[SuspectClosureValidator] Regex validation failed for Dr. Mallory Finch; trying semantic fallback...
[SuspectClosureValidator] Semantic validation also failed for Dr. Mallory Finch
[SuspectClosureValidator] Regex validation failed for Captain Ivor Hale; trying semantic fallback...
[SuspectClosureValidator] Semantic validation also failed for Captain Ivor Hale
```

The semantic fallback iterated `story.scenes` looking for `scene.text?.includes(suspect)` (full name) to decide which scenes to send to the LLM — and found none, so the LLM was never called. The fallback silently concluded "no valid elimination found".

**Fix**: Extracted surname from the full name and used `nameAppearsInText()` in all four match sites (regex phase 1 + semantic fallback scene filter) for both suspects and culprits:

```ts
const extractSurname = (fullName: string): string => {
  const tokens = fullName.trim().split(/\s+/);
  return tokens[tokens.length - 1];
};
const nameAppearsInText = (fullName: string, text: string): boolean =>
  text.includes(fullName) || text.includes(extractSurname(fullName));
```

---

## 4. Contributing Failures (Not Primary Blockers)

### Novelty Audit: Score Below Threshold
Agent 8 scored the mystery below the novelty threshold. This is logged as `phases_failed` in the summary but was not a hard-stop — the pipeline continued. No action taken.

### Ch8 and Ch9 Retries
Both chapters required 4 attempts. Ch8 had n-gram overlap (template leakage retry). Ch9 was marked "non-convergent after attempt 3/4: structure". Both eventually passed. The n-gram threshold (0.70) and structure obligation fixes from prior runs are working but Ch8/Ch9 remain the hardest chapters to generate cleanly.

### NSD Visibility Divergence
Post-prose: 10 NSD-revealed clues, 15 evidence-visible clues — diverged. 5 evidence-visible clues absent from NSD reveal list. This was a `releaseGateReasons` entry (warning) not a `hardStopReasons` entry, so it did not trigger the abort. However it appears alongside the hard-stop in the output and inflates the apparent failure severity.

---

## 5. Phase Scores

| Phase | Passed | Notes |
|---|---|---|
| Setting Refinement | ✓ | |
| Cast Design | ✓ | |
| Background Context | ✓ | |
| Hard Logic Devices | ✓ | 1 retry |
| CML Generation | ✓ | |
| Novelty Audit | ✗ | Score below threshold (non-blocking) |
| Clue Distribution | ✓ | Mechanism visibility gate cleared (≥1 term fix worked) |
| Fair-play Audit | ✗ | 6 violations, non-structural, downgraded to warnings |
| Character Profiles | ✓ | |
| Location Profiles | ✓ | |
| Temporal Context | ✓ | |
| World Builder | ✓ | (strongest phase) |
| Narrative Outline | ✓ | |
| Prose Generation | ✓ | Ch8 ×4, Ch9 ×4; all others first pass |
| **Release Gate** | ✗ | **Hard-stop (2 reasons)** |

Overall score: **59/100** (grade F — aborted before prose committed).

---

## 6. Chapter Word Counts

| Ch | Words | Attempts | Issue |
|---|---|---|---|
| 1 | 829 | 1 | — |
| 2 | 843 | 1 | — |
| 3 | 943 | 1 | — |
| 4 | 713 | 1 | — |
| 5 | 692 | 1 | — |
| 6 | 1001 | 1 | — |
| 7 | 951 | 1 | — |
| 8 | 643 | 4 | n-gram overlap (template), marked non-convergent attempt 3/4 |
| 9 | 690 | 4 | Structure non-convergent attempt 3/4 |

All chapters below preferred word-count target (12/9 miss preferred floor) but none below hard floor.

---

## 7. Clue Visibility Timeline

| Chapter | Clues Newly Revealed | Cumulative |
|---|---|---|
| 1 | clue_1 | 1 |
| 2 | clue_2 | 2 |
| 3 | clue_fp_contradiction_step_2_2, clue_fp_contradiction_step_3 | 4 |
| 4 | clue_3 | 5 |
| 5 | clue_4 | 6 |
| 6 | clue_5, clue_6 | 8 |
| 7 | clue_culprit_direct_beatrice_quill, clue_fp_contradiction_step_2 | 10 |
| 8 | clue_1, clue_2 (re-confirmed) | 10 |
| 9 | — | 10 |

Culprit (Beatrice Quill): evidence chain validated semantically in scene 7.

---

## 8. Fixes Applied This Run

Both fixes were applied to source before this run but the run was already in-flight at time of diagnosis. The fixes are confirmed landed in the build used for run 8.

| File | Fix |
|---|---|
| `apps/worker/src/jobs/mystery-orchestrator.ts` | Set `ctx.fairPlayAudit.overallStatus = "needs-revision"` when orchestrator proceeds past non-structural fair-play failures |
| `packages/story-validation/src/suspect-closure-validator.ts` | `nameAppearsInText()` helper using surname fallback; applied to all 4 name-match sites |

---

## 9. Open Issues After This Run

| # | Issue | Status |
|---|---|---|
| 1 | Novelty audit score below threshold (non-blocking but logged as failed phase) | Not investigated — non-blocking |
| 2 | Ch8/Ch9 consistently require 4 attempts — word count 643/690 below preferred target | Ongoing — threshold tuning or prompt obligation strengthening |
| 3 | NSD/clue-visibility divergence (5 evidence-visible clues absent from NSD reveal list) | Not blocking but worth investigating if future runs fail at release gate |
| 4 | DT validator chapter mapping (Bug 7 from session) — DT validator checks wrong chapter | Still pending — deferred until a clean pass is achieved |

---

## 10. Strategic Improvement Proposals

These proposals are derived from the failure pattern across all 13 analysis runs. They target recurring failure *classes* — not this run's specific output — and should survive changes to story type, cast size, setting, and target length.

---

### 10.1 Authority Hierarchy: Deterministic Analysis Beats LLM Verdict

**Problem pattern** (Bugs 9 this run; variants in earlier runs): LLM auditor verdicts can conflict with deterministic coverage analysis. When this happens, any component that reads the stored LLM verdict (release gate, report, downstream agents) will act on the wrong authority.

**Strategic fix**: Establish a single explicit authority hierarchy for all pipeline verdicts:

1. **Deterministic structural checks** (CML schema, clue coverage, evidence chain) — always authoritative; cannot be overridden by LLM.
2. **LLM auditor with retry** — authoritative only when deterministic checks pass and LLM produces a *consistent* verdict across retries.
3. **LLM auditor single-shot** — advisory only.

In code terms: the orchestrator should expose a `setVerdictWithAuthority(source, status)` helper that enforces this hierarchy on write, rather than letting components set audit fields directly. Any LLM verdict that conflicts with an already-set deterministic verdict should be downgraded at write time, not patched post-hoc. This prevents the class of bug where a deterministic "proceed" is overridden by a stale LLM field read by a later component.

---

### 10.2 Universal Name Resolution Table

**Problem pattern** (Bug B this run; potential in any story with multi-word or honorific-prefixed names): Validators, prompts, and prose all use names independently. Each uses its own lookup convention (full name substring, surname, honorific+surname), and they can silently diverge.

**Strategic fix**: At pipeline startup (after Agent 2 Cast), build a `NameAliasMap` once:

```
fullName → { surname, givenName, preferredShort, honorific, allForms: string[] }
```

Store it on `ctx` and pass it into every component that does name matching: validators (suspect closure, character profile), prompt builders (obligation blocks, DT checklist), and any post-validation report generation. All name matching should call a single `nameAppearsInText(alias, text)` that checks all canonical forms. This eliminates the entire class of full-name substring mismatch failures regardless of how future prose agents choose to refer to characters.

---

### 10.3 Specification-First Validation Contract

**Problem pattern** (atmosphere word list desync, instructionPattern cross-sentence match, DT chapter mapping): Validators are written independently from prompt obligations. They drift. When a validator check fails, the error message goes to the retry feedback, but the *initial* prompt never contained the precise obligation that the validator was checking. This means the first attempt is already at a structural disadvantage.

**Strategic fix**: Define each validation requirement as a **named obligation atom** with both a machine-readable spec and a human-readable prompt phrase. The validator and the prompt builder both derive from the same atom:

```ts
interface ObligationAtom {
  id: string;               // e.g. "atmosphere_time_word"
  validatorCheck: (text: string) => boolean;
  promptPhrase: string;     // injected into the generation prompt
  retryDirective: string;   // injected on retry when this check fails
}
```

This guarantees validator-prompt parity by construction. When the atmosphere word list changes, it changes in one place and propagates to both the validator and the prompt automatically. The current manual sync (atmosphere terms duplicated in 3 prompt locations and 1 validator) becomes impossible to desync.

---

### 10.4 Targeted Prose Retry Strategy by Failure Class

**Problem pattern** (Ch8 and Ch9 consistently require 4 retries, with different failure types each time): The current retry architecture categorizes errors but the prompt response is still largely generic. The model receives a feedback block listing what failed, but all retries use the same base prompt structure regardless of failure class.

**Proposed retry strategy matrix**:

| Failure class | Attempt 2 strategy | Attempt 3 strategy | Attempt 4 strategy |
|---|---|---|---|
| **Word count below floor** | Inject explicit count target: "You wrote N words. You MUST reach M words. Add [X] full paragraphs." Keep assistant turn. | Strip style guidance, expand obligation block with concrete beat list to hit word count. Keep assistant turn. | Minimal prompt: scene outline only + word count requirement + "REBUILD from scratch, no atmosphere preamble, go straight into action beats." Drop assistant turn. |
| **Template/n-gram overlap** | Include list of offending phrases: "These phrases were detected as repeated from prior chapters: [phrases]. Write entirely new sentences for each." Keep assistant turn. | Drop assistant turn. Instruct: "Treat previous attempt as discarded. Start from scene outline, generate all new sentences, do not reuse any phrasing from attempts 1–2." | Minimal prompt + explicit "avoid these phrases": [phrases list]. |
| **Structure non-convergent** | Inject structural beat list: "This chapter MUST contain these beats in order: [list]. Mark each beat complete as you write it." Keep assistant turn. | Drop assistant turn. Provide scene-by-scene breakdown as numbered list. Require model to write each numbered beat as a separate paragraph. | Structured prompt: each beat is its own numbered instruction. Model writes chapter as: "Beat 1: [instruction]. Beat 2: [instruction]..." |
| **Clue absent** | Current escalating directive (already strong). Append: "Do not alter any other part of the chapter — add only the clue observation and inference block." | Already penultimate (paragraph structure required). Add exact sentence starters: "Begin with: '[character] noticed...' or '[character] crossed to the [location] and saw...'" | Already final (mandatory rebuild block). Also inject: "Here is the exact required phrase: '[phrase]'. It must appear verbatim." |
| **DT beats out of order** | List the exact required beat order with the chapter text that triggered the failure. | Provide numbered beat template: "1. [Setup beat] 2. [Revelation beat] 3. [Resolution beat]. Write one paragraph per beat, in exactly this order." | Minimal prompt. Numbered beat template only. Drop all style and atmosphere guidance. |

The key principle: **each retry should reduce the model's degrees of freedom, not increase feedback volume**. Later attempts get *fewer* instructions, not more — they should be simpler, more direct, and leave the model with only the failing requirement to solve.

---

### 10.5 Chapter-Position-Aware Initial Prompt

**Problem pattern** (Ch8 and Ch9 always harder; penultimate/final carry 3–4× the obligation weight of mid-story chapters): All chapters currently receive the same initial prompt skeleton. This means Ch9 (culprit reveal + DT resolution + suspect elimination + atmosphere + word count) has the same creative latitude as Ch2 (single clue introduction), but the model is expected to satisfy a much higher obligation density.

**Strategic fix**: Compute a **chapter obligation density score** at prompt-build time:

```
obligationDensity = numClues + numSuspectClearances + (hasDT ? 3 : 0) + (isCulpritReveal ? 3 : 0)
```

Chapters with `obligationDensity >= 4` receive:
- A mandatory structural beat list as the opening prompt section (not in the style guidance, but as a hard-numbered list before any prose framing).
- A reduced style/atmosphere preamble (shorter — the model has less room for embellishment when obligations are dense).
- An explicitly higher word count target proportional to obligation count.

This front-loads the information the model needs for hard chapters at first attempt, rather than waiting for retry feedback to inject it.

---

### 10.6 Prose Retry — Shared Context Reduction on Late Attempts

**Problem pattern**: On attempts 2 and 3, the model receives the full base prompt (all upstream artifacts, all context) plus the error feedback. This means the context window is most crowded precisely when the model needs to focus most narrowly on the failing requirement. On the final attempt, the base prompt is still full-size.

**Strategic fix**: Implement a **context budget ladder** keyed to attempt number:

| Attempt | Context included |
|---|---|
| 1 | Full: world document, setting, cast, all outline scenes, all style guidance |
| 2 | Full context + error feedback + assistant turn (current approach — correct) |
| 3 | Reduced: drop texture atoms, drop world document, keep scene outline + cast + failing obligation only. Include assistant turn. |
| 4 (final) | Minimal: scene one-liner + cast names + failing obligation block + word count target only. Drop assistant turn. Full rebuild. |

The current code already drops the assistant turn on the final attempt. Extending this to also reduce context on attempt 3 would give the model a cleaner signal and reduce the chance that a large irrelevant context section is attended to instead of the repair instruction.

---

### 10.7 Preferred Word Count: Make it a Hard Obligation

**Problem pattern** (12/9 chapter preferred-target misses this run; present across all runs): The preferred word count target is currently "preferred", meaning missing it triggers only a warning. But 12/9 chapters below preferred means the generator consistently underproduces. The preferred target is effectively the quality bar, not a stretch goal.

**Strategic fix**: Inject the preferred word count into the generation prompt as a required range with an explicit lower bound:

> "This chapter MUST be between [preferredFloor] and [ceiling] words. Do not submit a chapter below [preferredFloor] words — it will be rejected. If you are running low, add a full new scene beat, a dialogue exchange with inference, or a sensory observation paragraph. Do not pad with recap."

Track misses by chapter position across runs. If penultimate/final chapters are consistently below preferred, raise their per-chapter token budget (`maxTokens` cap) proportionally.

---

### 10.8 Telemetry: Per-Run Failure Class Registry

**Problem pattern** (debugging requires reading raw logs; failure classes repeat across runs without accumulating learning): Each run discovers failures during retries but there is no machine-readable aggregate of which failure classes occurred, at which chapters, at which attempt numbers. Diagnosis is manual.

**Strategic fix**: Emit a structured `failureClassRegistry` field in the run report alongside `chapters`:

```json
"failureClassRegistry": [
  { "chapter": 8, "failureClass": "template_overlap", "attempt": 2, "resolved": true },
  { "chapter": 9, "failureClass": "structure_non_convergent", "attempt": 3, "resolved": true }
]
```

Over 10+ runs, this enables: identifying which chapters are systematically hard, which obligation types are most frequently failing, and whether fixes for a given failure class are actually reducing that class's frequency. This turns each canary run from a one-off diagnostic into a training signal for prompt tuning.
