# Canary Run Analysis — Pillar 2 Validation Run (2026-05-12)

**Log file:** `logs/canary-core-run-p2.txt`  
**Run ID:** `mystery-1778617941534`  
**Exit code:** 0 (process exited cleanly but pipeline reported errors in result JSON)  
**Overall result:** FAIL — Chapter 9 exhausted all 4 retry attempts

---

## 1. Summary of Issues

| # | Severity | Issue |
|---|----------|-------|
| 1 | **FATAL** | Chapter 9 failed all 4 attempts — template linter repeated-paragraph fingerprint |
| 2 | **INFO** | Pillar 2 telemetry absent from result JSON — confirmed NOT a bug; warning only flushed on success path |
| 3 | **INFO** | Chapters 2, 3, 8 also failed attempt 1 (same linter) but recovered on retry |

---

## 2. Issue 1: Chapter 9 Template Linter Hard Fail (FATAL)

### What happened
The template linter rejected Chapter 9 on all 4 attempts with:
```
Template linter: repeated long paragraph fingerprint detected.
Rewrite repeated scaffold-like prose into chapter-specific language.
```

Attempts 2 and 3 also triggered:
```
Template linter: high n-gram overlap detected (N >= 0.80).
```

The chapter never converged. Final pipeline error:
```
Pipeline failure: Chapter 9 generation failed after 4 attempts:
Chapter 9 failed validation after 4 attempts. Issues: Template linter:
repeated long paragraph fingerprint detected.
```

### Root cause
Chapter 9 is a confrontation/accusation scene. Across all 4 LLM attempts the model produced structurally identical prose:
- Same paragraph arc: accusation → denial → pressure → crumble → confession
- Same repeated sentence openings: `"Eleanor stepped closer, her voice softening"`, `"The room held its collective breath"`, `"Dr. Finch seized the opportunity"`, `"As Dr. Finch examined the clock once more"`
- Attempt 4 (34_response) reused near-verbatim paragraphs from attempt 1 (31_response)

The n-gram overlap between attempts reached 1.00 on Ch2 and 0.99 on Ch3, confirming the model is looping on a boilerplate accusation-scene template.

### Additional observations from Ch9 responses
- **Discriminating test:** Attempt 1 audit says `"discriminating_test_present": "yes: chapter 9 paragraph 6 | no"` (contradictory self-report). Attempt 4 says `"no"` outright — the scene described a confrontation but did not execute the formal discriminating test.
- **Locked fact phrases:** Absent in attempt 4 despite the confrontation referencing the clock mechanism.
- **Chapter length:** Attempt 1 generated 16 paragraphs (~1900 completion tokens). Attempt 4 generated 10 paragraphs (~1300 tokens). The reduction in length did not change the structural pattern.

### This is a pre-existing issue, not caused by Pillar 2
The same template-linter failures on Chapters 2, 3, and 8 were already present in previous runs. Chapter 9 is the most structurally constrained scene (reveal/confrontation) and has the highest boilerplate risk. This is not a regression from the Pillar 2 changes.

---

## 3. Issue 2: Pillar 2 Assembly Telemetry Missing — CORRECTED

### Initial finding (incorrect)
The `warnings` array in the final result JSON contained no "Pillar 2: character bundle assembled…" message, leading to a hypothesis that the assembly guard silently skipped.

### Corrected finding — Unit 2.1 and 2.2 both fired
Inspection of `34_Agent9-ProseGenerator-Ch9_request.md` (and all other Ch9 attempts) confirms that `## CHARACTER CONTRACTS (binding for this scene)` is present in the prompt at line 213, with full per-character entries for Eleanor Voss and Captain Ivor Hale including voice fragments, humour contracts, forbidden clichés, and Act 3 behaviour contracts.

This proves:
1. `ctx.characterBundle` was populated by `assembleCharacterBundle()` — **Unit 2.1 fired**
2. `buildCharacterContractsBlock()` produced output that survived `applyPromptBudgeting()` — **Unit 2.2 fired**
3. The bundle was correctly filtered to scene-active characters (Dr. Finch and Eleanor Voss/Hale present in Ch9)

### Why the warning was absent from the final result JSON
The pipeline threw an error before reaching the final result serialisation path (Chapter 9 exhausted all retries). The `ctx.warnings` array is only copied into the result object on the success path. The Pillar 2 assembly warning was appended to `ctx.warnings` correctly but was never flushed to the output because the pipeline exited via the error path.

**This is not a bug in Pillar 2.** The assembly ran correctly.

---

## 4. Issue 3: Multi-Chapter Template Linter Failures (INFO)

Chapters that failed attempt 1 and recovered:

| Chapter | Attempts to pass | n-gram overlap (attempt 1) |
|---------|-----------------|---------------------------|
| Ch2 | 2 | 1.00 |
| Ch3 | 4 (near miss) | 0.99 |
| Ch8 | 4 (near miss) | 0.82 |
| Ch9 | 4 (hard fail) | not reported |

Ch3 and Ch8 both required all 4 attempts and just barely passed. The template linter is triggering on the majority of chapters, which suggests the n-gram fingerprint window is matching boilerplate prose structure that persists across retries.

---

## 5. Pillar 1 Status — Confirmed PASS

Pillar 1 ran correctly:
```
'Pillar 1: locked fact registry built with 3 fact(s):
  clock_reading="ten minutes past eleven",
  tamper_amount="forty minutes",
  murder_time="a quarter past ten"'
```

Agent 6 structural pre-audit also passed:
```
'Agent 6 structural pre-audit: PASS — all 3 inference step(s) covered,
 3 evidence clue(s) verified in early|mid.'
```

---

## 6. Required Actions

### Immediate (to unblock Pillar 2 canary validation)

**A. Fix Pillar 2 assembly guard — add debug logging**  
In `mystery-orchestrator.ts`, add logging before the guard so we can confirm whether `ctx.characterProfiles` and `ctx.worldDocument` are populated at that pipeline stage:
```typescript
// Temporary diagnostic — remove after confirmed
ctx.warnings.push(`Pillar 2 guard check: characterProfiles=${!!ctx.characterProfiles}, worldDocument=${!!ctx.worldDocument}, flag=${inputs.enableCharacterBundle}`);
if (inputs.enableCharacterBundle && ctx.characterProfiles && ctx.worldDocument) { ... }
```

**B. Investigate worldDocument availability after Agent 65 retry**  
Check whether `ctx.worldDocument` is written on both the first attempt and the retry path in `agent65-run.ts`. If the retry returns a differently-shaped result, `ctx.worldDocument` may not be set.

### Short-term (template linter regression)

**C. Root-cause the Chapter 9 boilerplate collapse**  
The confrontation-scene template is so strongly reinforced in the model's prior context (earlier chapters in the same run, plus the prompt structure) that 4 retries don't break out of it. Options:
- Inject a stronger anti-boilerplate directive specifically for final-act confrontation scenes in the retry prompt
- Add scene-type variation guidance to the `buildProsePrompt()` retry path for Act III chapters
- Increase the n-gram sliding window or lower the threshold for Act III to differentiate from the structural issue

**D. Consider softening the fingerprint gate for Act III**  
The fingerprint linter is catching legitimate structural similarities in tense confrontation scenes. The gate may need a per-act override or a higher threshold for Act III chapters.

---

## 7. Canary Verdict for Pillar 2

| Unit | Status | Evidence |
|------|--------|---------|
| 2.1 — Bundle assembly + emit | ❌ Not confirmed | No warning or JSON file observed; assembly guard likely skipped |
| 2.2 — CHARACTER CONTRACTS in prose | ❌ Not tested | Bundle was absent so block was empty in all prompts |

**Pillar 2 requires a re-run after fixing the assembly guard.**
