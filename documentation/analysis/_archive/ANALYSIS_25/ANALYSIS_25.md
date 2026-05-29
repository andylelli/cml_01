# ANALYSIS_25 — gpt-4.1-mini Migration: Canary Failure Analysis & Remediation Plan

*Date: 2026-05-27 | Runs: mystery-1779908944815, mystery-1779909096008 | Model: gpt-4.1-mini-2025-04-14*

---

## 1. Context

These are the first two canary runs after switching from `GPT-4o-mini` to `gpt-4.1-mini`. Both failed, but for distinct reasons that have different root causes and remediation strategies. Neither failure is a fundamental model incompatibility — both are solvable schema/prompt contract issues where the new model's output shape diverged from what the pipeline's deterministic validators expected.

---

## 2. Failure Inventory

### 2.1 Run 1: mystery-1779908944815

**Stage:** Agent2 — Cast Design  
**Failure mode:** Pipeline abort  
**Error:**
```
Cast artifact failed schema validation (deterministic mode: schema retry disabled):
diversity.recommendations must be array, got string
```

**What happened:**  
The model returned `diversity.recommendations` as a single string (e.g., `"Characters avoid gender and age stereotypes; motives and roles are complex..."`) instead of a `string[]`. The schema at `schema/cast_design.schema.yaml` (line 90–95) declares `recommendations: { type: array, required: true, items: string }`. The validator in `packages/cml/src/artifact-validator.ts` correctly rejected it.

The abort path in `apps/worker/src/jobs/agents/agent2-run.ts` (line ~258) reads:
```ts
throw new Error(`Cast artifact failed schema validation (deterministic mode: schema retry disabled): ${errorSummary}`);
```

The schema retry branch (`if (!retriesEnabled)`) executed because `preAgent9LlmRetriesEnabled()` returned false in deterministic mode, so the repair retry never ran.

**Root cause:**  
`gpt-4.1-mini` collapses `string[]` fields to a single joined string when there is only one semantic thought to express. This is a known instruction-following difference between the two model families: `gpt-4o-mini` was more likely to emit a one-element array; `gpt-4.1-mini` returns a sentence instead.

The `normaliseCastOutput()` function in `agent2-run.ts` (lines 29–120) already coerces many structural variants (snake_case keys, bare relationship arrays, missing crimeDynamics arrays) but has **no coercion for `diversity.recommendations` being a string**.

---

### 2.2 Run 2: mystery-1779909096008

**Stage:** Agent9 — Prose Generator, Chapter 10  
**Failure mode:** Chapter 10 failed after 6 attempts  
**Error:**
```
Final chapter: no resolution event detected. Include a scene where Captain Ivor Hale confesses,
is arrested, or the detective explicitly names them as the murderer with evidence.

Clue obligation: suspect clearance missing for "Beatrice Quill". This chapter must include
a paragraph that (a) names "Beatrice Quill" explicitly, (b) contains a clearance phrase,
AND (c) contains an evidence connector.

Clue obligation: suspect clearance missing for "Eleanor Voss". [same requirement]
```

**What happened:**  
The run progressed all the way through setting, cast, world-building, novelty audit, and clue extraction, then failed in prose on Chapter 10 specifically. The chapter was generated but:
1. Did not contain a resolution event (confession/arrest) that the `RESOLUTION_RE` regex could match.
2. Did not contain co-located clearance sentences for `Beatrice Quill` and `Eleanor Voss` (suspect, not culprit) that pass all three gate conditions (name + clearance term + evidence connector in same paragraph).

The backstop `injectResolutionIfAbsent` (agent9-run.ts line 1231) and `enforceSuspectEliminationPresence` (line 1140) exist and run after generation, but these inject sentences using surnames only:
```ts
`${extractSurname(suspect)} was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime.`
```

The lint validator (`packages/prompts-llm/src/agent9-prose/lint.ts` line 307) checks for **full name** in the same paragraph:
```ts
const hasCoLocatedClearance = allParagraphs.some(
  (para) =>
    (suspectPattern.test(para) || surnamePattern.test(para)) &&
    CLEARANCE_TERMS.test(para) &&
    CLEARANCE_EVIDENCE_TERMS.test(para)
);
```

The `surnamePattern` is tested, so injection sentences using surname *should* pass. The issue is more likely that:
- The injected sentence ends up in the wrong chapter (not Chapter 10), OR  
- The final validation pass runs on the *pre-injection* prose output (i.e., the validator that counts failures is the one that produces the error message, and it runs before post-processing is applied to the stored result), OR
- The `enforceSuspectEliminationPresence` injection targets the final chapter but the lint validator also requires the resolution to be in the **same** chapter as the clearances, and if they span two different chapters, the gate fails.

**Root cause (primary):**  
`gpt-4.1-mini` is tighter on instruction following but appears to **distribute narrative content more efficiently across chapters**. Chapter 10 was being generated without explicit mandatory clearance instructions for non-culprit suspects — it treated suspect clearances as already handled in earlier chapters (they were, for Chapters 8 or 9), and wrote Chapter 10 as a pure resolution chapter naming only the culprit. This means the clearance gate on Chapter 10 fails because the clearances aren't *re-stated* in that chapter.

**Root cause (secondary):**  
The backstop injectors run post-generation but the failure is reported as if validation still fails after injection. This suggests the final validation report (in `clue-validation.ts`) is running on the prose *before* `applyDeterministicProsePostProcessing` / `enforceSuspectEliminationPresence` completes, or the injected sentences are not reaching the validator's chapter text. This needs code tracing to confirm but the symptom is consistent across earlier runs (ANALYSIS_12, ANALYSIS_19).

---

### Run 2 Actual Phase Scores (`mystery-1779909096008`)

| Phase | Agent key | Score | Threshold | Passed |
|-------|-----------|-------|-----------|--------|
| Setting Refinement | agent1_setting | 100 | 75 | ✓ |
| Cast Design | agent2_cast | 88 | 75 | ✓ |
| Character Profiles | agent2b_profiles | 100 | 75 | ✓ |
| Location Profiles | agent2c_location_profiles | 90 | 75 | ✓ |
| Temporal Context | agent2d_temporal_context | 100 | 70 | ✓ |
| Background Context | agent2e_background_context | 98 | 70 | ✓ |
| CML Generation | agent3_cml | 100 | — | ✓ |
| Hard Logic | agent3b_hard_logic_devices | 96 | 85 | ✓ |
| World Builder | agent65_world_builder | 100 | — | ✓ |
| Novelty Audit | agent8_novelty | 80 | 75 | ✗ |
| Clue Distribution | agent5_clues | 96 | — | ✓ |
| Fair-play Audit | agent6_fairplay | 100 | — | ✓ |
| Narrative Outline | agent7_narrative | 100 | 75 | ✓ |
| Prose Generation | agent9_prose | 95 | 80 | ✓ |
| **Reported overall** | | **74** | — | **aborted** |

Raw phase average = (100+88+100+90+100+98+100+96+100+80+96+100+100+95) / 14 = **~96**.  
The abort penalty drops the reported score to **74** (~22 pts lost). All phase content is high quality — the failures are purely contract/gate issues.

---

## 3. Priority Classification

| # | Issue | Severity | Runs Affected |
|---|-------|----------|---------------|
| P0 | `diversity.recommendations` string → array coercion missing in `normaliseCastOutput` | Critical | Run 1 (instant abort) |
| P1 | Chapter 10 not including suspect clearances for non-culprit characters | Critical | Run 2 (6-retry exhaustion) |
| P2 | Backstop injectors not preventing final lint gate failure | High | Run 2 (injectors ineffective) |

---

## 3.5 Score Impact Estimates

**Baseline:**
- Run 1 (`mystery-1779908944815`): abort at cast → estimated score ~40–50 (abort penalty applied, minimal phases completed)
- Run 2 (`mystery-1779909096008`): abort at prose Chapter 10 → reported **74** (abort penalty applied despite ~96 raw phase average)

| Fix | Addresses | Score before | Expected score after | Delta | % lift |
|-----|-----------|-------------|---------------------|-------|--------|
| **FIX-1** | Run 1 class (cast abort) | ~45 aborted | ~90–96 completed | **+45–51 pts** | **+100–113%** |
| **FIX-2** | Run 2 class (Ch10 abort) | 74 aborted | ~92–96 completed | **+18–22 pts** | **+24–30%** |
| **FIX-3** | Injector ordering (diagnostic) | 74 aborted | 74–79 (reduces noise) | **+0–5 pts** | **+0–7%** |
| **FIX-1 + FIX-2 combined** | Both run classes | ~59 avg aborted | ~92–96 completed | **+33–37 pts** | **+56–63%** |

**Notes:**
- FIX-1 score estimate for Run 1 is based on Run 2's actual phase quality. The same model at the same canary inputs produces ~96 raw average once it gets past cast.
- FIX-2 delta is the abort penalty recovery (74 → ~94). The novelty phase (80) remains the only below-threshold phase and accounts for a small residual drag.
- FIX-3 is capped at +5 because even if the injectors work correctly the pipeline still shows the same aborted `run_outcome` — the underlying prose content issue requires FIX-2 to resolve.
- Scores assume deterministic mode (no LLM retries). In a future run with retries enabled, FIX-2 scores would trend higher (more chances to self-correct before the gate).

**Additional improvement scores (beyond FIX-1/2/3):**

| Improvement | Expected delta | Notes |
|-------------|---------------|-------|
| Novelty canary input diversification (axis + preset variation) | **+3–8 pts** | Removes the -16pt novelty drag; changes canary input not code |
| Generic string→array coercion in `normaliseCastOutput` (all schema array fields) | **+2–5 pts** | Prevents future model-drift aborts on other `string[]` fields |
| Clearance template sentences in obligation block (fill-in pattern) | **+3–6 pts** | Stacks with FIX-2; makes first-attempt success more likely, fewer retries |
| JSON example for `diversity` in Agent2 prompt | **+1–3 pts** | Prevention-first; avoids needing FIX-1 coercion at all |
| Shorter/imperative Chapter 10 retry messages | **+1–4 pts** | Reduces 6-attempt exhaustion risk if FIX-2 obligation block misses edge cases |

---

## 4. Remediation Plan

### FIX-1 (P0): Coerce `diversity.recommendations` string to array in `normaliseCastOutput`

**File:** `apps/worker/src/jobs/agents/agent2-run.ts`  
**Where:** Inside `normaliseCastOutput()`, after the `relationships` block  
**What:** Add a coercion guard for `diversity.recommendations` and `diversity.stereotypeCheck` that wraps a string in an array.

**Change:**
```typescript
// After the relationships normalisation block, before the function ends:

// --- diversity: coerce string fields to string[] ---
const div = castRaw.diversity;
if (div !== null && typeof div === 'object') {
  const divObj = div as Record<string, unknown>;
  if (typeof divObj.recommendations === 'string') {
    divObj.recommendations = divObj.recommendations
      ? [divObj.recommendations]
      : [];
  } else if (!Array.isArray(divObj.recommendations)) {
    divObj.recommendations = [];
  }
  if (typeof divObj.stereotypeCheck === 'string') {
    divObj.stereotypeCheck = divObj.stereotypeCheck
      ? [divObj.stereotypeCheck]
      : [];
  } else if (!Array.isArray(divObj.stereotypeCheck)) {
    divObj.stereotypeCheck = [];
  }
}
```

**Why this is safe:** The schema declares both fields as `string[]`. A non-empty string answer is valid content that should survive rather than abort the run. Empty string → empty array is also correct. `stereotypeCheck` gets the same treatment defensively since it's used in the hard-fail guard immediately after normalisation.

**Verification:** After applying, re-run the cast schema validator test in `packages/story-validation/src/__tests__/artifact-contract-drift.test.ts` and add a case with `recommendations` as a string.

---

### FIX-2 (P1): Inject mandatory suspect clearance instructions into Chapter 10 obligation block

**File:** `packages/prompts-llm/src/agent9-prose/obligation-block.ts`  
**Where:** In the final chapter (`RESOLUTION`) obligation block generation  
**What:** When building the Chapter 10 obligation block, append an explicit per-suspect clearance requirement for every non-culprit suspect. This mirrors the same pattern that succeeds in earlier chapters when the clearance chapter is explicitly instructed.

Look at where the `⛔ MANDATORY RESOLUTION` block is written (line ~477) and add after it:

```typescript
// Append mandatory clearance callouts for final chapter
if (isLastChapter && suspects.length > 0) {
  lines.push(`\n⛔ MANDATORY SUSPECT CLEARANCE (same chapter, same paragraph as clearance phrase):`);
  for (const suspect of suspects) {
    lines.push(
      `  • ${suspect}: Name them explicitly + clearance phrase (e.g. "cleared", "alibi confirmed", "could not have") ` +
      `+ evidence connector (e.g. "because", "therefore", "which proves", "alibi") — all in ONE paragraph.`
    );
  }
}
```

The `suspects` list should be derived the same way `enforceSuspectEliminationPresence` derives it: cast minus culprits minus detective.

**Why Chapter 10 specifically:**  
`gpt-4.1-mini` correctly does not repeat clearances unless instructed. If clearances were handled in Chapter 8/9, it treats Chapter 10 as resolution-only. The fix is to make clearance re-confirmation mandatory in the final chapter's obligation contract when clearances must be present.

---

### FIX-3 (P2): Verify backstop injector order vs. final lint pass

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`  
**Where:** Around line 3005 where injectors are called  
**What:** Confirm that the lint pass that produces the chapter failure report does **not** run again after the post-processing injectors. The current order is:

```ts
// Line ~3005
prose = injectResolutionIfAbsent(prose, cml);
prose = enforceSuspectEliminationPresence(prose, cml, castDesign);
```

If the final lint result used to populate `ctx.errors` or the failure message is captured *before* these lines, then the injectors are cosmetic and the reported failure is correct. Check that the error message in the canary log (`Chapter 10 generation failed after 6 attempts`) originates from the **retry loop** (inside generation) rather than from post-processing.

If the injector runs *after* the error is recorded, move the lint validation to *after* post-processing, or make the post-processing count as a "pass" for the relevant checks so that the pipeline does not abort on a condition that was deterministically repaired.

**Concrete investigation step:** Search for where `Chapter X generation failed after 6 attempts` is assembled and confirm it captures the pre-injection prose state.

---

## 5. Expected Post-Fix Behaviour

After FIX-1 alone:
- Run 1-class failures (cast schema abort) should not occur. The coercion makes `gpt-4.1-mini`'s compressed `recommendations` strings valid.
- **Score uplift: ~+45–51 pts** (from ~45 aborted to ~90–96 completed).

After FIX-2:
- Chapter 10 should contain explicit suspect clearance paragraphs on first attempt or early retries, reducing the 6-attempt exhaustion to 0–2 retries.
- **Score uplift: ~+18–22 pts** (from 74 aborted to ~92–96 completed).

After FIX-3 (investigation complete):
- Backstop injectors that already fire successfully should not produce a false failure report.
- **Score uplift: +0–5 pts** (diagnostic only — injectors don't change the underlying prose quality gate).

After FIX-1 + FIX-2 combined (full remediation):
- Both run classes should complete without abort. Expected score **~92–96**, run_outcome `passed`.
- **Combined uplift from ~59 avg baseline: +33–37 pts (+56–63%)**.

---

## 6. Secondary Observations (non-blocking, track for next run)

| Observation | Notes |
|-------------|-------|
| Novelty warning: structural similarity 0.70 with *The Mysterious Affair at Styles* | Not a failure — `blocking: false` — but worth watching if it trends higher |
| Run 2 had 8 batch retries (matching the story title) but ultimately produced full prose up to Ch9 | The pipeline is reaching depth — the failures are late-stage, not early |
| `injectResolutionIfAbsent` fired for Run 2 (suspect: Captain Ivor Hale) | Injector ran but subsequent validation still counted it as failed — reinforces FIX-3 priority |
| Cost delta vs. `gpt-4o-mini` visible in agent costs (setting: $0.001234, cast, temporal, world-builder all listed) | Higher per-token cost is confirmed from actuals; no throughput/latency issues observed |

---

## 7. Implementation Order

1. **FIX-1** — add 8 lines to `normaliseCastOutput` in `agent2-run.ts`. Low risk, no prompt changes. Implement and test immediately.
2. **FIX-2** — modify `obligation-block.ts` to append clearance requirements to Chapter 10. Medium scope, prompt-layer change. Test with one targeted canary.
3. **FIX-3** — investigation only in this iteration. Trace the lint-vs-injector ordering before writing any code.

---

*Document created from canary runs mystery-1779908944815 and mystery-1779909096008 on 2026-05-27.*
