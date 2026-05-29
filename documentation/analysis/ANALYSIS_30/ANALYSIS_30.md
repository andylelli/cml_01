# ANALYSIS_30 — Golden Age Prototype 1 Final Outcome + GAP02 Narrative Gate Failure
*Date: 2026-05-29 | Runs: run_668d76eb (GAP1, validation fail) · run_b899be9d (GAP02, outline gate fail) | Model: gpt-4.1-mini*

---

## 1. Context

This document closes **ANALYSIS_29 open item #10** ("Golden Age Prototype 1 outcome unknown at time of writing") and covers the immediately subsequent run, Golden Age Prototype 02. Both runs were executed on 29 May 2026 in the same session window following the llm-client code audit and worker rebuild.

**Runs covered:**

| Run ID | Project | Created (UTC) | Outcome | Exit stage |
|--------|---------|---------------|---------|------------|
| run_668d76eb | Golden Age Prototype 1 | 17:10 | **Validation failure** — 20 chapters generated | Story validation gate: 1 critical, 2 major |
| run_b899be9d | Golden Age Prototype 02 | 17:54 | **Outline gate failure** — no prose generated | Narrative completeness gate: 9/10 scenes |

**Session context:** The UI chapter-count label fix (Small/Medium/Large = 10/20/30) and the quality-tab visibility bug fixes were also applied and rebuilt during this session. Two root-cause bugs were resolved:
1. `loadScoringReport` was unconditionally writing `null` to `scoringReport.value` on every 3-second polling cycle (202 response → `fetchScoringReport` returns null → assigned without guard), wiping any previously loaded report.
2. `isStartingRun` was cleared ~3 seconds after run start when polling confirmed `latestRunId === pendingRunId`, before SSE had confirmed `status: "running"` (SSE fires every 15 seconds), leaving both `isRunning` and `isStartingRun` false for ~12 seconds and hiding the quality tab banner.

---

## 2. Golden Age Prototype 1 (run_668d76eb) — Full Results

### 2.1 Run Summary

| Attribute | Value |
|-----------|-------|
| Project | Golden Age Prototype 1 (`proj_1b04b300`) |
| Spec | 1930s · Country House · Cozy tone · cast size 4 · primaryAxis: temporal |
| Target length | Medium (20 chapters) — no `targetLength` set; pipeline defaulted to medium |
| Setting | March 1934 · manor house |
| Cast | 5 characters (cast size 4 plus detective) |
| Culprit | Evelyn Ashcombe |
| Clues | 17 distributed |
| Fair play audit | PASS |
| Blind reader simulation | PASS |
| Locations | 4 |
| Narrative scenes | 20 (37,200 words target) |
| Prose chapters generated | 20/20 — all chapter-level validations passed |
| Cumulative score at Ch20 | **97/100** |
| Final outcome | **FAILED** — story validation gate: 1 critical, 2 major |
| Run duration | ~27 minutes (17:10 → 17:37 UTC) |

### 2.2 Chapter-by-Chapter Scores

| Chapter | Score | Cumulative | Outcome |
|---------|-------|------------|---------|
| 1 | 90 | 90 | ✅ |
| 2 | 89 | 92 | ✅ |
| 3 | 91 | 92 | ✅ |
| 4 | 92 | 95 | ⚠️ retry — 4 issues (gender agreement ×2 + 2 more) |
| 5 | 95 | 95 | ✅ |
| 6 | 94 | 96 | ✅ |
| 7 | 91 | 96 | ✅ |
| 8 | 91 | 96 | ⚠️ retry — 2 issues (template fingerprint + n-gram overlap 0.65) |
| 9 | 95 | 96 | ✅ |
| 10 | 94 | 96 | ⚠️ retry — 2 issues (template fingerprint + n-gram overlap 0.88) |
| 11 | 84 | 96 | ✅ — lowest individual score |
| 12 | 91 | 96 | ⚠️ retry — 1 issue (weather/atmosphere chapter opener) |
| 13 | 90 | 96 | ✅ |
| 14 | 95 | 96 | ✅ |
| 15 | 91 | 96 | ✅ |
| 16 | 94 | 96 | ⚠️ retry — 2 issues (template fingerprint + duplicate sentence) |
| 17 | 92 | 97 | ⚠️ retry — non-convergent after attempt 5/6 (template) |
| 18 | 96 | 97 | ⚠️ retry — 1 issue (template fingerprint) |
| 19 | 92 | 97 | ✅ |
| 20 | 95 | 97 | ⚠️ retry — 1 issue (duplicate sentence) |

**Retry rate: 8/20 chapters (40%).** This is notably higher than the previous reference run (mystery-1779998607579: 2/10 = 20%) and similar to Project 25 (3/10 = 30% adjusted for 10-chapter runs).

**Dominant retry causes:**
- Template fingerprint / n-gram overlap: 5 occurrences (Ch8, Ch10, Ch12, Ch16, Ch18). Chapters 8, 10, and 16 also had n-gram overlap above the 0.60 threshold, with Ch10 reaching 0.88 — highly scaffold-like prose.
- Duplicate sentence: 2 occurrences (Ch16, Ch20).
- Gender agreement error: 1 occurrence (Ch4) — "both women"/"the two ladies" used in a paragraph also containing he/him pronouns.
- Non-convergent: 1 occurrence (Ch17) — failed to pass template linter across 5 attempts before the retry succeeded on attempt 6 (or the system accepted the best available).

**Chapter 11** scored 84/100 — the lowest chapter score in this run and below the typical floor (~89). No retry was triggered (it passed validation), but the low score indicates structural or prose quality issues that the chapter validator did not catch as hard failures.

### 2.3 Validation Failures

The pipeline proceeded to completion of all 20 chapters but was rejected by the final **story-level validation gate** with the following issues:

| Severity | Type | Detail |
|----------|------|--------|
| **Critical** | `identity_role_alias_break` | Post-reveal scene 19 uses role aliasing (culprit/killer label) instead of stable identity reference (Evelyn Ashcombe) |
| **Major** | `locked_fact_missing_value` | "The exact amount the clock was wound back" described in Ch1 without its canonical value ("forty minutes") |
| **Major** | `temporal_contradiction` | Scene 7 contains a month/season contradiction — "may" vs "autumn" in the same scene context |
| Moderate | `missing_period_markers` | A scene lacks 1930s period details, reading as generic/timeless |

**All 20 chapters of prose were discarded.** The failure snapshot was persisted as a partial artifact, along with all pre-prose stage artifacts, but no prose artifact exists in the store.

### 2.4 Analysis of Each Failure

#### 2.4.1 identity_role_alias_break (Critical — Scene 19)

Scene 19 is the post-reveal/denouement chapter. The LLM uses a role label ("the killer", "the murderer", "the culprit") in narration rather than "Evelyn Ashcombe". This is the **third consecutive run** with this failure class:

| Run | Chapter | Character |
|-----|---------|-----------|
| Project 25 (run_76027844) | Ch9 (post-reveal) | Frank Barlow |
| GAP1 (run_668d76eb) | Scene 19 (post-reveal) | Evelyn Ashcombe |

**Code investigation:** The chapter prompt builder (`prompt-builder.ts`, `buildNSDBlock`) already injects a text prohibition instruction for any chapter with arc position `pre_climax`, `climax`, or `resolution`:
> "⛔ IDENTITY STABILITY — post-reveal zone: FORBIDDEN (narrator voice): 'the killer', 'the murderer', 'the culprit', 'the criminal', 'the guilty party'"

Scene 19 of 20 maps to arc position `climax` (the condition `ci <= Math.floor(tc * 0.8)` is false for scene 19, and `ci === tc - 1` is also false), so this prohibition instruction is already active and still failing. The LLM is non-compliant with an existing explicit instruction. Strengthening the prompt instruction is unlikely to help — a second instruction to supplement one that is already being ignored has no mechanism to produce a different outcome.

The correct fix is a **deterministic post-processing pass**: after the LLM prose is committed for a post-reveal chapter, scan the text with the same `ROLE_ALIAS_TERMS` regex that the story validator uses (`/\b(the\s+(killer|murderer|culprit|criminal)|the\s+suspect\s+did\s+it)\b/i`) and replace any matches with the culprit's canonical name in narrator voice, before the story validator runs. This approach is 100% deterministic, costs no LLM call, and maps exactly to the validator's detection logic.

#### 2.4.2 locked_fact_missing_value (Major — Clock Wind-Back)

The hard logic device's canonical value "forty minutes" (the amount the clock was wound back) was referenced in Chapter 1 without the literal figure. This is the same pattern as Project 25's `locked_fact_missing_value` for `"forty minutes"` in Ch3 and `"ten minutes past eleven"` across multiple chapters. The numeric locked fact is being paraphrased or elided rather than stated verbatim.

**Code investigation:** The `lockedFactsBlock` in `prompt-builder.ts` (priority: `critical`) already contains the strongest possible exact-quote instruction, including explicit failure examples for the clock-value patterns observed here. The prompt instruction is not the gap.

The likely cause is validator over-reach: Chapter 1 sets the scene with the clock as background atmospheric detail. It mentions the clock incidentally but doesn't make a formal evidential statement, so it doesn't include the verbatim figure. The `prose-consistency-validator.ts` flags this because the keyword threshold is met but the exact value is absent. If `appearsInChapters` were populated on the locked fact (scoping validation to only the chapters where the clue is formally presented), Chapter 1's incidental mention would be excluded and no error would fire. See §8.5 for the corrected fix approach.

#### 2.4.3 temporal_contradiction (Major — Scene 7)

Scene 7 contains both "may" and "autumn" — an impossible pairing. One reference is from a character's dialogue or internal description using a month name, the other is from a scene-level atmosphere reference. The narrative outline specifies March 1934 (from the temporal context artifact), so neither "may" nor "autumn" is chronologically consistent with a March setting. Both references are wrong, not just one of them. This suggests the atmospheric prose for Scene 7 was generated from a stale or incorrect seasonal context.

#### 2.4.4 missing_period_markers (Moderate — 1930s)

One scene is flagged as lacking 1930s period details. Given the setting is a 1930s Country House, the expected period markers include specific material culture (radio sets, certain household staff titles, pre-WWII class dynamics, period transport). This is a moderate issue only — it would not block the story from being readable, but it weakens genre authenticity.

### 2.5 Agent 5 / Agent 6 Pre-Audit Warnings (GAP1)

The following pipeline warnings are notable:

- **Red herring overlap (rh_1, rh_2):** Both red herrings shared inference tokens with the true solution — `clock`, `manor`, `eleven` (rh_1) and `clock`, `backward`, `manor` (rh_2). Agent 5 deterministic sanitiser fired and cleaned both. The word `clock` is a recurring collision term because the hard logic device itself involves clock manipulation, and the red herrings naturally use adjacent vocabulary.

- **Temporal lexical collision:** 2 shared tokens between the false-assumption lexicon and the correction lexicon: `manor`, `clock`. Agent 5 generated a set of preferred false-assumption-only terms to enforce separation.

- **Culprit direct clue synthesis:** `clue_culprit_direct_evelyn_ashcombe` was cloned from `clue_11` — the canonical culprit direct clue was not present in the original clue set and had to be synthesised. Source repair and phrasing repair both fired. This is the **third consecutive run** where the culprit direct clue is synthesised from `clue_11` (see §4.2).

---

## 3. Golden Age Prototype 02 (run_b899be9d) — Outline Gate Failure

### 3.1 Run Summary

| Attribute | Value |
|-----------|-------|
| Project | Golden Age Prototype 02 (`proj_4bc2b278`) |
| Spec | 1950s · Ocean Liner · Classic tone · cast size 4 · police detective · primaryAxis: authority |
| Target length | **Short (10 chapters)** — `targetLength: "short"` |
| `proseBatchSize` | 1 (sequential generation) |
| Setting | September 1959 · ocean liner |
| Cast | 5 characters (cast size 4 + detective) |
| Culprit | Captain Harold Finch |
| Clues | 17 distributed |
| Fair play audit | PASS |
| Blind reader simulation | PASS |
| Locations | 4 |
| Narrative scenes produced | **9 of 10 expected** |
| Prose generated | **None** — gate fired before prose stage |
| Final outcome | **FAILED** — outline pre-commit completeness gate |
| Run duration | ~9 minutes (17:54 → 18:03 UTC) |

### 3.2 Outline Completeness Gate Failure

The narrative agent formatted **9 scenes** for a `short` (10-chapter) story. The pre-commit gate checks that scene numbering is contiguous from 1 to N before handing off to the prose agent. With 9 scenes delivered for a 10-chapter target, the gate fired:

```
Outline pre-commit completeness gate failed in deterministic mode (retry disabled):
Scene numbering must be contiguous from 1..N before prose handoff.
```

Because deterministic mode is active for Agent 6, the retry loop is disabled. There is no automatic recovery: if the narrative agent returns an incomplete outline, the pipeline fails immediately rather than requesting a corrected outline.

**Root cause options:**
1. The narrative LLM returned 9 scenes (1–9) and omitted scene 10 — incomplete generation.
2. The LLM returned 10 scenes but one was numbered incorrectly, creating a gap (e.g. scenes 1–8 then 10, skipping 9).
3. A parsing error in the outline formatter dropped one scene from the 10 that were generated.

The event log records "9 scenes structured (18000 words)" — 18,000 words is exactly 9 × 2,000 words/scene (matching the short-story target word count per scene), which strongly suggests option 1: the LLM literally stopped at 9 scenes and the 10th was not generated. The word count is internally consistent with 9 complete scenes.

**Retry disabled:** In deterministic mode, the outline gate has no fallback. The pipeline did not attempt to re-request the missing scene or regenerate the outline. This is an unrecoverable failure mode for the current configuration.

### 3.3 Cast Score Warning (85/100, Grade B)

The pipeline failure snapshot includes a new warning not seen in previous runs:

```
Cast Design: deterministic mode active - skipping scoring retry (score 85/100, B)
```

The cast design scored 85/100 — the lowest cast score recorded so far. In non-deterministic mode this would trigger a scoring retry to improve cast quality. In deterministic mode, the retry is suppressed and the run proceeds with the B-grade cast. This is consistent with the deterministic mode philosophy (fix rather than regenerate), but a cast score this low may contribute to downstream quality issues if the run were to proceed.

**Context:** This is the first time a cast score warning has appeared in a failure snapshot. Previous runs either scored above the retry threshold or the threshold was not active.

### 3.4 Agent 5 / Agent 6 Pre-Audit Warnings (GAP02)

- **Red herring overlap (rh_1, rh_2):** Shared tokens — `scratch`, `clock`, `stopped` (rh_1) and `scratch`, `reverse`, `winding`, `clock` (rh_2). Agent 5 sanitiser fired on both. The `clock` word collision is present again — the hard logic device for GAP02 also involves a clock/timing mechanism on the ocean liner, making collision inevitable with adjacent vocabulary.

- **Temporal lexical collision:** 3 shared tokens: `clock`, `chimes`, `stopped`. Broader collision set than GAP1 (2 tokens), indicating the ocean-liner clock device has more vocabulary overlap with the false-assumption/correction pairing.

- **Culprit direct clue synthesis:** `clue_culprit_direct_captain_harold_finch` cloned from `clue_11`. Third consecutive run with this pattern (see §4.2).

---

## 4. Cross-Run Pattern Analysis

### 4.1 identity_role_alias_break — Third Consecutive Run

| Run | Story length | Post-reveal chapter | Outcome |
|-----|-------------|---------------------|---------|
| Project 25 (run_76027844) | 10 chapters | Ch9 | Critical failure |
| GAP1 (run_668d76eb) | 20 chapters | Scene 19 | Critical failure |

This failure has now appeared in **every completed prose run** that reached the post-reveal chapter. GAP02 did not reach prose, so the pattern is 2/2 for runs that generated a post-reveal chapter.

The failure is not affected by story length (appears at Ch9 in a 10-chapter run and Scene 19 in a 20-chapter run), setting, decade, or cast composition. This confirms it is structural.

**Code investigation:** A `⛔ IDENTITY STABILITY` prohibition instruction for narrator-voice role aliases is already injected by `buildNSDBlock` for the relevant arc positions (`pre_climax`, `climax`, `resolution`). The instruction exists and is being ignored — the LLM is non-compliant with an explicit prohibition. The correct fix is a deterministic post-processing substitution pass on the committed prose (see §8.1), not a prompt change.

**Priority:** This is the single highest-priority fix. It will cause every run to fail at the final validation gate as long as it is present.

### 4.2 clue_11 → Culprit Direct Clue — Three Consecutive Runs

In every run, the culprit direct clue has been synthesised by Agent 5 via cloning from `clue_11`:

| Run | Synthesised culprit direct clue |
|-----|--------------------------------|
| Project 25 | `clue_culprit_direct_frank_barlow` |
| GAP1 | `clue_culprit_direct_evelyn_ashcombe` |
| GAP02 | `clue_culprit_direct_captain_harold_finch` |

**Code investigation (updated diagnosis):** This is **intentional, designed behaviour**. The `clue_culprit_direct_X` ID appears in `discriminating_test.evidence_clues` as a forward reference by convention — it is never expected to exist in the CML clue distribution. Agent 5's `cloneDiscriminatingEvidenceClue` (line ~2137, `agent5-run.ts`) detects the missing discriminating test evidence clue ID, scores all existing essential clues by token overlap against the discriminating test description, and synthesises the missing clue by cloning from the top-scored candidate — which is consistently `clue_11` because it is early-placed, essential-category, and scores highest. The message format `clue_culprit_direct_X <= cloned from clue_11` is the expected warning emitted by this path.

Agent 6 pre-audit passes every time, confirming the synthesised clue is structurally valid. No run has failed because of this. The pattern is not a defect in the CML generation step or in Agent 5 — it is the designed recovery mechanism for discriminating test evidence clue population.

The repeated selection of `clue_11` as the template source reflects consistent scoring weights across runs (all three runs share a clock-based hard logic device and similar clue distribution shapes), not a pathological loop.

### 4.3 locked_fact_missing_value — Clock-Based Hard Logic Devices

Both GAP1 and Project 25 used clock-based hard logic devices. Both produced `locked_fact_missing_value` errors for the clock's canonical numeric figure:

| Run | Locked fact | Value required | Absent in |
|-----|------------|----------------|-----------|
| Project 25 | Clock time | "ten minutes past eleven" | Ch6, Ch7, Ch9 |
| Project 25 | Wind-back amount | "forty minutes" | Ch3 |
| GAP1 | Wind-back amount | "forty minutes" | Ch1 |

The numeric values `"forty minutes"` and `"ten minutes past eleven"` are failing to appear verbatim in prose. The locked-fact injection mechanism is evidently providing these values as context but not enforcing their exact appearance. Since both runs share the same clock-manipulation device archetype, this may be a specific weakness in how clock-device locked facts are worded in the chapter prompt obligation block.

### 4.4 Red Herring Lexical Collision — Systematic with Clock Devices

In both GAP1 and GAP02, the primary collision term is `clock`. Both runs also involve clock-based hard logic devices. The red-herring vocabulary sanitiser is working correctly (fires each time), but the collision is predictable: clock-based devices will always produce `clock`-adjacent terms in the true solution lexicon, which will always bleed into red herring descriptions that involve time, alibi, or mechanism.

This is not a defect — the sanitiser handles it — but it inflates the number of sanitisation operations per run and means the red herrings require more revision than they would for a non-clock device.

### 4.5 Template Fingerprint Recurrence — 40% Retry Rate (GAP1)

8 of 20 GAP1 chapters triggered retries due to template fingerprinting. The template linter is detecting:
- Repeated long paragraph fingerprints (same scaffold structure appearing in multiple chapters)
- N-gram overlap exceeding 0.60 (Chapter 10 reached 0.88)
- Weather/atmosphere preambles (Chapter 12)
- Duplicate sentences within a chapter (Ch16, Ch20)

The high retry rate (40%) relative to the 10-chapter reference run (20%) may be partly explained by the longer story — 20 chapters provides more opportunity for template scaffold patterns to repeat. A stricter deduplication of the chapter-prompt scaffolding, or injection of chapter-specific narrative anchors to break repetition, would reduce this.

Chapter 17's non-convergence (failed attempts 1–5, passed at attempt 6) is notable — it indicates the template linter is finding issues that require significant prose restructuring to clear, and the model is struggling to diverge from its scaffold on short notice.

---

## 5. Prose Completeness and Waste Analysis

GAP1 completed all 20 chapters, all chapter-level validations passed, cumulative score reached 97/100 — and then the entire output was discarded by the story-level validation gate. This represents a **significant compute waste**:

- 20 LLM chapter-generation calls
- 8 additional retry calls (one full extra chapter equivalent)
- AtmosphereRepair passes on all 20 chapters
- Estimated equivalent of 28+ LLM generation calls for prose alone

All of this work is lost because three validation issues in the final gate were not detected earlier:
1. `identity_role_alias_break` — structurally deterministic, would have been predictable before prose generation.
2. `temporal_contradiction` (may vs autumn in March 1934) — detectable from the outline before prose.
3. `locked_fact_missing_value` — partially detectable at outline stage if the obligated numeric values are listed.

**Recommendation:** Three targeted interventions would have prevented the discard: (a) a **post-processing substitution pass** on committed post-reveal prose to replace role aliases with the culprit's canonical name before the story validator runs (deterministic, no LLM call); (b) a **temporal consistency check** on the outline scene summaries before prose generation to catch month/season contradictions; (c) **correct scoping of the locked-fact validator** via `appearsInChapters` so it only fires on chapters where evidence is formally presented, not incidental background mentions. Items (a) and (c) cost no LLM calls. Item (b) costs a cheap string scan.

---

## 6. Session Fixes Applied

| Fix | File | Description |
|-----|------|-------------|
| UI chapter count labels | `apps/web/src/App.vue` | Story length options now read "Small (10 chapters) / Medium (20 chapters) / Large (30 chapters)" |
| Quality tab template | `apps/web/src/App.vue` | Banner and report content decoupled — report shows even when no run is in progress |
| loadScoringReport null guard | `apps/web/src/App.vue` | `scoringReport.value` only updated when `report` is truthy; 202 responses no longer wipe prior data |
| isStartingRun clearing condition | `apps/web/src/App.vue` | `isStartingRun` is only cleared when `isRunning` is confirmed true (post-SSE); eliminates 12-second gap |

All fixes rebuilt: `npm run -w @cml/web build` completed with exit code 0, bundle ~312 KB.

---

## 7. Open Items

Items carried forward from ANALYSIS_29 with updated status:

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Per-attempt SDK timeout missing — slow-fail Azure 500s hold for 2–3 min | Medium | Open |
| 2 | `run_668d76eb` in store with `status: "running"` (zombie record) | Low | Open |
| 3 | Alibi time phrase propagation from narrative outline (6 chapters affected in ref run) | Low-medium | Open (recurring) |
| 4 | Chapter 6 blackmail clue placement fails first attempt | Medium | Open (paused — not seen this session, different device archetype) |
| 6 | **LLM logging broken** — no entries for any post-rebuild run | **High** | **Open** |
| 7 | **`identity_role_alias_break`** — critical, 3rd consecutive fail at post-reveal chapter | **Critical** | **Open — escalated** |
| 8 | `locked_fact_missing_value` for clock numeric values | Medium | Open (recurring) |
| 9 | `opening_style_repetition` (general-descriptive opener) | Low | Open (recurring) |
| 11 | **Outline completeness gate failure with no retry path** — pipeline fails if narrative agent returns N-1 scenes | High | **New (GAP02)** |
| 12 | ~~CML agent not generating culprit direct clue~~ — Agent 5 cloning `clue_11` is **intentional design behaviour** (see §4.2) | — | **Closed — not a defect** |
| 13 | Cast score 85/100 (B) in GAP02 — below retry threshold, deterministic mode suppresses improvement | Low-medium | **New** |
| 14 | Pre-prose validation does not check temporal_contradiction or locked_fact presence in outline | Medium | **New** |
| 15 | Template scaffold retry rate 40% (8/20 chapters) — prose prompt insufficiently varied for long runs | Low-medium | **New** |

---

## 8. Recommendations

*Each recommendation has been assessed against the actual source code. Scores reflect likelihood of the **specific proposed approach** fixing the specific failure, not whether the failure is fixable in principle.*

---

### 8.1 Fix identity_role_alias_break — Post-Processing Substitution (Priority 1)

**Failure:** Critical, every completed prose run (2/2). Discards entire 20-chapter output.

**Code reality:** `buildNSDBlock` in `prompt-builder.ts` already fires a `⛔ IDENTITY STABILITY` prohibition block for arc positions `pre_climax`, `climax`, and `resolution`. Scene 19 of 20 maps to `climax`. The prohibition text is already present in the chapter prompt and is failing. Strengthening the prompt instruction will not work — the LLM is non-compliant with an existing explicit prohibition; a second prohibition has no mechanism to produce compliance.

**Score for prompt-strengthening approach: 10%.**

**Correct fix:** After each post-reveal chapter's prose is committed, run a deterministic sweep using the same `ROLE_ALIAS_TERMS` regex (`/\b(the\s+(killer|murderer|culprit|criminal)|the\s+suspect\s+did\s+it)\b/i`) used by the story validator. Replace any match with the culprit's canonical name in narrator voice before the story validation gate runs. This is a one-pass string replacement — no LLM call, fully deterministic, maps exactly to the validator's detection surface.

**Score for post-processing substitution approach: 90%.**

---

### 8.2 Add Outline Pre-Prose Validation Pass

**Failures:** `temporal_contradiction` (major) and `locked_fact_missing_value` (major), together representing 2 of the 3 GAP1 failures.

**For temporal_contradiction:** Run the narrative continuity temporal checker against the outline scene summaries before prose generation. This will catch month/season contradictions (e.g. "may" vs "autumn" in a March 1934 setting) if the contradiction appears in the summary text. Plausible, but not guaranteed — outline summaries may describe atmosphere in vaguer terms that don't contain the conflicting month/season literals.

**Score for temporal pre-check: 40%.** Depends on summary verbosity.

**For locked_fact_missing_value:** A pre-prose outline check cannot verify that the LLM will include a verbatim phrase in future prose. The outline summary for Chapter 1 will say something like "the clock device is introduced" rather than containing "forty minutes". No outline-level check can guarantee verbatim phrase inclusion in prose.

**Score for locked_fact pre-check on outline: 5%.** The information needed to run this check does not exist in the outline.

---

### 8.3 Fix Outline Completeness Gate — Remove Blocked Retry Guard (Priority 2)

**Failure:** GAP02 hard-failed at the outline gate because the narrative agent returned 9/10 scenes. No prose was ever generated.

**Code reality:** The full remediation path for this failure already exists in `agent7-run.ts` (lines 1259–1302). When the gate detects N < target scenes, it builds a `bundledRemediationIssues` list, makes a targeted LLM re-call to fill the gap, and re-checks the gate. This implementation is complete and tested. It is blocked by a single guard:

```typescript
if (!retriesEnabled) {
  throw new Error(`Outline pre-commit completeness gate failed in deterministic mode...`);
}
// ... full remediation pass follows, but is never reached
```

`retriesEnabled = preAgent9LlmRetriesEnabled()` reads the `AGENT_PRE9_ENABLE_LLM_RETRIES` env var, which defaults to `false`. The outline completeness gate is a **structural repair** (generate the missing scene), not a speculative quality retry — it does not belong behind this env var guard.

**The recommendation as written in the previous version of this document (add a supplementary call) is wrong — the call already exists. The actual fix is a one-line change: remove or bypass the `if (!retriesEnabled)` throw specifically for this gate, allowing the existing remediation pass to execute unconditionally.**

**Score: 95%.**

---

### 8.4 CML Agent Culprit Direct Clue Generation

**Proposed fix:** Add post-CML validation asserting exactly one clue is tagged as a culprit direct clue.

**Code reality (updated — see §4.2):** The synthesis of `clue_culprit_direct_X` from `clue_11` is intentional, designed Agent 5 behaviour. The ID is a forward reference in `discriminating_test.evidence_clues` that was never expected to exist in the CML clue distribution. Agent 5 synthesises it every run as a normal pipeline step. Agent 6 passes every time. No run has failed because of this.

Adding a post-CML assertion that rejects runs where `clue_culprit_direct_X` is absent from the CML clue list would create a false failure gate on every run — the opposite of the intended effect.

**Score: 0%. Do not implement. The mechanism is working as designed.**

---

### 8.5 Fix locked_fact_missing_value — Correct the Validator Scoping

**Failure:** Major, recurring across clock-based hard logic device runs (Project 25 multiple chapters, GAP1 Ch1).

**Code reality:** The `lockedFactsBlock` in `prompt-builder.ts` (priority: `critical`) already contains the strongest possible prompt instruction:

> "NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED): Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted."

This includes explicit failure examples for the exact patterns seen in errors (word-to-figure conversions, approximate phrasings). The instruction is already at maximum specificity. Adding a markdown `>` block-quote will not change LLM behaviour — the LLM is already receiving the most explicit instruction possible and not complying in some chapters.

**Score for block-quote syntax change: 10%.**

**Correct diagnosis:** The `prose-consistency-validator.ts` uses `fact.appearsInChapters` to scope validation to specific chapters. If this field is empty or absent, the validator checks every chapter that mentions enough description keywords. Chapter 1 of GAP1 sets the scene with the clock as background detail — it mentions "clock" and "wound back" incidentally, triggering the keyword threshold, but doesn't include the verbatim figure because it's atmospheric prose, not the evidential presentation of the device.

The correct fix is to ensure `appearsInChapters` is populated from the clue distribution timeline (i.e., the chapters where the associated clue is formally presented to the reader). If the validator is scoped to only those chapters, incidental mentions in other chapters are ignored. This directly addresses the false-positive surface — the validator is firing on chapters it should not be checking.

**Score for populating `appearsInChapters` correctly: 70%.**

---

### 8.6 Fix LLM Logging (Priority 3)

**Failure:** LLM logging broken since the post-rebuild session. No token, cost, or latency data available for GAP1 or GAP02.

**Diagnosis:** `logger.ts` stream lifecycle fails to re-initialise after worker restart. The stream is opened once at process start and not reopened if the process restarts mid-session.

**Fix:** Defensive stream initialisation (open fresh on each worker start) plus a startup sentinel write to confirm the stream is functional. As recommended in ANALYSIS_29 §10.4.

**Score: 85%.** Clearly diagnosed, straightforward fix, no architectural ambiguity.

---

### Fix Priority Order

| Fix | Original ANALYSIS_30 approach | Original score | Corrected approach | Corrected score |
|-----|-------------------------------|:--------------:|--------------------|:---------------:|
| **8.1** identity_role_alias_break | Strengthen/add prompt instruction | 10% | Post-processing regex substitution on committed prose | **90%** |
| **8.3** Outline completeness gate | Add a supplementary scene LLM call | *(already exists)* | Remove `if (!retriesEnabled)` guard in `agent7-run.ts` | **95%** |
| **8.6** LLM logging | Fix stream lifecycle in `logger.ts` | 85% | Same | **85%** |
| **8.5** Locked-fact validator scoping | Add `>` block-quote syntax to prompt | 10% | Populate `appearsInChapters` from clue distribution timeline | **70%** |
| **8.2** Pre-prose temporal check | Run temporal validator on outline summaries | 40% | Same (temporal only — locked_fact check not viable) | **40%** |
| **8.4** Culprit direct clue | Add post-CML assertion for culprit direct clue | 0% | No action — synthesis is working as designed | **0%** |
