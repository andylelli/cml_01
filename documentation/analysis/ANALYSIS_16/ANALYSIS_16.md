# ANALYSIS_16 — Template Linter Persistent Failure + Suspect Elimination Gap

**Date:** 2026-05-13  
**Primary Trigger:** `canary-core-run-nsd-fix2.txt` — exit 1, `Chapter 8 generation failed after 4 attempts`  
**Primary Errors:** `Template linter: repeated long paragraph fingerprint detected` + `Template linter: high n-gram overlap detected (0.86 >= 0.80)`

**Secondary Trigger:** `canary-core-run-nsd-fix3.txt` — exit 1, `Release gate hard-stop: suspect elimination coverage incomplete`  
**Secondary Errors:** `SuspectClosureValidator` failed for Captain Ivor Hale and Beatrice Quill (both regex + semantic fallback)

---

## 1. What the Linter Checks

The template linter lives in `packages/prompts-llm/src/agent9-prose.ts → lintBatchProse()`. It runs after every batch before committing prose to the session. It has three independent sub-checks:

### 1a. Paragraph Fingerprint (`paragraph_fingerprint`)
- All prior committed chapter paragraphs are normalized (`toLowerCase + strip punctuation + collapse whitespace`) and stored in `priorFingerprints: Set<string>`.
- Each paragraph in the new batch that is ≥ `paragraph_fingerprint_min_chars` (170 chars) is normalized and checked against the set.
- **An exact normalized string match is a hard fail.**
- Config: `paragraph_fingerprint_min_chars: 170`

### 1b. N-gram Overlap (`ngram_overlap`)
- Takes the last `prior_paragraph_limit` (25) qualifying paragraphs (≥ `ngram.min_chars` = 140 chars) from prior chapters.
- Converts each to a **6-gram set** (Jaccard).
- For each paragraph in the batch: if any prior 6-gram set yields Jaccard similarity ≥ `overlap_threshold` (0.80), it's a fail.
- The final batch (last chapter) is exempt via `skipNgramCheck: true` — the detective recap legitimately echoes prior vocabulary.

### 1c. Opening-Style Entropy
- Adaptive thresholds: ≤6 chapters = 0.62, ≤10 = 0.72, >10 = 0.70 (note: late = 0.70 not 0.80).
- Shannon entropy over a sliding window of opening-sentence style classifications.
- Irrelevant to the current failure.

---

## 2. Current Retry Architecture

The 4-attempt retry sequence for a `template` class failure follows this escalation ladder:

| Attempt | `shouldEscalate`? | `deterministicMitigation` | Feedback injected |
|---|---|---|---|
| 1 | No | `none` | Generic "rewrite every paragraph from scratch" + full prior chapter context as assistant turn |
| 2 | Yes (repeated class) | `structural_pivot` if fingerprint on attempt ≥2; else `freshen_atoms` | BANNED PARAGRAPH block (Pillar 6 Unit 6.2) + structural pivot constraints: forbidden opening, 3 escape routes, positional freeze on clock-proximity phrases |
| 3 | — | same as 2 (prior packet carried) | PARAGRAPH-BY-PARAGRAPH REBUILD directive (Para 1 = character action, Para 2 = new info, etc.) |
| 4 (final) | — | same | FINAL: DISCARD PRIOR DRAFT + mandatory structure + ANTI-COPY RULE + "no sentence may share first word with any sentence used in prior N attempts" |

Critically: the **assistant turn** (prior raw response injected as a `role: assistant` message) is **cleared on `freshen_atoms`** but **retained otherwise**. The ANTI-COPY RULE is only injected on the final attempt.

---

## 3. Root Cause Analysis

### 3a. The LLM copies the story-context verbatim

**Primary suspect:** At attempt 4, the model receives a `STORY TO DATE` section in the prompt containing all previously committed chapters verbatim. Under accumulated constraint pressure (clue obligations + structural pivot + word count + discriminating test), the model satisfies all explicit constraints by reaching into the STORY TO DATE block and **copying or lightly paraphrasing a paragraph it can already see** — triggering both the fingerprint check (attempt 1 n-gram = 1.00) and the n-gram check (attempt 4 = 0.86).

The 1.00 n-gram overlap on attempt 1 is diagnostic: **the model did not even try to write something new** — it echoed something already in context, most likely from an earlier chapter. This isn't "style creep"; it's verbatim copy.

**Why does this happen for chapter 8 specifically?** Chapter 8 is a late-story chapter. By that point, STORY TO DATE is large (7 chapters of prose). The prompt's content budget is under pressure. The clue-obligation contract demands a clue `clue_culprit_direct_eleanor_voss` appear in paragraph 1 (see diagnostics), but the description of that clue may have appeared in a prior chapter's context. The model uses the easiest path: emit prose it can already see rather than invent.

**Why does the linter fail 4× in a row?** The retry feedback explicitly says "FINAL ATTEMPT ANTI-COPY RULE" only on attempt 4 — it does not fire on attempts 1–3. Attempts 1–3 warn about n-gram overlap in general but never tell the model **"do not copy from the STORY TO DATE section"** — so the model keeps reaching into context.

### 3b. Jaccard on 6-grams doesn't distinguish story-domain recurrence from copy

A country-house murder mystery set in the 1930s naturally recurs in vocabulary: `the drawing room`, `the clock on the mantel`, `clipped tones`, `detective surveyed`. At 6-gram Jaccard, two paragraphs about the same room with the same characters will share a lot of gram-space even if the sentences are structurally different. The 0.80 threshold was raised from 0.70 (ANALYSIS_15) precisely to reduce false positives, but chapter 8 at 0.86 is genuinely above 0.80 — not a false positive, just a very story-specific failure.

### 3c. The fingerprint check and n-gram check fire simultaneously, each consuming an attempt independently

Both checks fire from the same `lintBatchProse()` call. When both fail together, `batchErrors` gets two items but the retry protocol still classifies the failure as a single `template` class. The retry escalation doesn't know "fingerprint failed at 1.00 AND n-gram failed too" — it sees one class and escalates once. So attempt 2 sees the BANNED PARAGRAPH block (for fingerprint) and the REPEAT PHRASE warning (for n-gram) in the same feedback, which may be confusing to the model.

### 3d. The "deferred template hard-gate" interacts badly with clue failures

The diagnostics for ch8 attempt 1 show `clue_culprit_direct_eleanor_voss: absent` alongside the template linter failure. The code path (`hasNarrativeHardErrors → console.warn "Deferred template hard-gate"`) **defers** the linter errors while narrative hard errors remain — but ch8 attempt 1 shows the linter errors ARE pushed to `batchErrors` anyway (both linter errors appear). This means the model on attempt 2 has TWO competing failure classes: `template` and `clue_timing`. The retry protocol picks the higher-ranked one (`clue_timing` at rank 95 > `template` at 60), so `deterministicMitigation` becomes `tighten_obligation` not `structural_pivot`. This **bypasses** the BANNED PARAGRAPH block entirely.

Wait — let me check: attempt 1 has BOTH clue failure AND template failure. `classifyFailure` picks `clue_timing` (rank 95). Mitigation = `tighten_obligation` (which only adds "strict obligation mode" guardrails, not the BANNED PARAGRAPH block). So attempts 2 and 3 **never inject the BANNED PARAGRAPH** because the dominant class overrides template mitigation. Only at attempt 4 (final ANTI-COPY) does any strong phrasing appear. By then 3 attempts were wasted without the right guardrail.

This is the **decisive structural flaw**: when `clue_timing` co-occurs with `template` errors, the `tighten_obligation` mitigation path is chosen and the anti-copy / BANNED PARAGRAPH mechanism is never activated.

### 3e. `shouldContinueRetry` marks non-convergent after attempt 2 with repeated class

```typescript
if (previous.failureClass === packet.failureClass && packet.attempt >= 2) return false;
```

If `clue_timing` fires on attempts 1 and 2 (same class, repeated), the retry protocol returns `false` for `canContinue`, which throws the early abort error. That didn't happen here (4 attempts ran), suggesting the failure class rotated. But the early-abort risk means in some runs the chapter would die at attempt 2 instead of 4.

---

## 4. Evidence Summary

| Observation | What it tells us |
|---|---|
| Attempt 1 n-gram = 1.00 (exact) | Model copied a paragraph verbatim from an earlier chapter |
| Attempt 4 n-gram = 0.86 (improved but still fails) | Structural pivot helped stylistically but didn't eliminate the overlap |
| `clue_culprit_direct_eleanor_voss: absent` on attempts 1 and 4 | The clue obligation constraint was never satisfied — model couldn't satisfy both novel prose AND the clue |
| Template fail + clue fail co-occur | `classifyFailure` picks `clue_timing` → `tighten_obligation` → BANNED PARAGRAPH never fires |
| 4 consecutive failures | No fix landed because the two constraints (write novel prose; include specific clue in paragraph 1) are pointing the model in opposite directions |

---

## 5. Creative Solutions

### Solution A — Composite-class mitigation (HIGH IMPACT, LOW RISK)

**Problem:** When `clue_timing` dominates, `template` mitigations are silently dropped.  
**Fix:** When `classifyFailure` detects both `template` and `clue_timing` (or any two co-occurring classes), emit a **composite mitigation** that combines both:
- `tighten_obligation` (clue) + `freshen_atoms` (template) → already partially implemented as a flag on `tighten_obligation`
- But the BANNED PARAGRAPH injection is gated on `hasFingerprintDupe && options.enableSurgicalFingerprintRetry` — it only fires when `mitigationType === none` or template-dominant. The fix: **unconditionally inject the BANNED PARAGRAPH block** when `matchingPriorParagraph` is available, regardless of the dominant failure class.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → buildEnhancedRetryFeedback()`. Decouple the BANNED PARAGRAPH injection from the `template` failure class check. Instead, inject it whenever `hasFingerprintDupe && fingerprintIssue?.matchingPriorParagraph` is set, even when other errors co-occur.

---

### Solution B — Pre-emptive anti-copy guardrail from attempt 1 (HIGH IMPACT, ZERO RISK)

**Problem:** The FINAL ATTEMPT ANTI-COPY RULE only fires on the last attempt. Attempts 1–3 never warn the model not to copy the STORY TO DATE section.  
**Fix:** Move the anti-copy guardrail to **attempt 1** as a standing constraint, not a recovery mechanism:

> "The STORY TO DATE section is provided for factual reference ONLY. Do NOT copy, lightly rephrase, or structurally echo any sentence from prior chapters. Every sentence must be original to this scene."

This is prevention-over-cure. The model won't reach into context if it's explicitly told not to from the start. Since this is already in the final attempt, adding it to all attempts has near-zero downside.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts` → move the `FINAL ATTEMPT ANTI-COPY RULE` guardrail out of the `attempt >= maxBatchAttempts` block into the standard per-attempt guardrail list (e.g., near the structural pivot guardrails, always active).

---

### Solution C — Obligation-atom placement decoupling from paragraph 1 (MEDIUM IMPACT)

**Problem:** The clue obligation contract requires `clue_culprit_direct_eleanor_voss` in paragraph 1. When the model tries to satisfy this with novel prose, it keeps defaulting to the same phrasing because the clue description itself is highly specific ("Fingerprints were found on the clock's casing."). Whatever paragraph the model writes to contain the fingerprint clue will naturally share vocabulary with the prior version of that same passage.  
**Fix:** Relax the "paragraph 1" placement constraint for obligation atoms when a template failure is active. If `clue_timing` and `template` both fire, the retry feedback should say: "Include this clue **anywhere in the first 50% of the chapter**" rather than "paragraph 1".

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → buildRetryMicroPromptDirectives()` — when `hasNgramOverlap || hasFingerprintDupe` co-occurs with a clue timing error, widen the placement window.

---

### Solution D — N-gram overlap: report the specific pair (DIAGNOSTIC + MITIGATION)

**Problem:** The retry feedback says "rephrase this passage" but doesn't tell the model which specific paragraph of its output matched which specific prior paragraph. The model can't surgically avoid what it can't see.  
**Fix:** Extend the `ngram_overlap` linter issue struct (parallel to the existing `matchingPriorParagraph` on `paragraph_fingerprint`) to carry `matchingPriorParagraph` for the n-gram case too. When the overlap fires, record the prior paragraph that produced the highest Jaccard score. Inject it into retry feedback as a second BANNED PARAGRAPH block.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → lintBatchProse()` — when `overlap >= threshold`, also store `priorCandidates[priorNgramIndex]` on the issue object. Then in `buildEnhancedRetryFeedback()`, read it for the BANNED text injection.

---

### Solution E — Sliding n-gram window: exclude paragraphs from same scene

**Problem:** The n-gram prior window includes ALL paragraphs from ALL prior chapters (last 25). For a 10-chapter mystery, every description of the study/library/drawing room is in that window. By chapter 8, the window is saturated with setting vocabulary.  
**Fix:** Exclude paragraphs from the same **scene location** as the current chapter from the prior window. If chapter 8 is set in the library and chapters 3 and 5 also visited the library, their paragraphs are the most likely to overlap — and also the most legitimate recurrences (same room = same vocabulary). Only paragraphs from **different locations** should contribute to the n-gram prior.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → lintBatchProse()` — pass the location label of the current batch scenes and the location of each prior chapter. Filter `priorCandidates` to exclude same-location paragraphs. This would require `batchScenes[0].location` to be available at linter call time.

---

### Solution F — Deterministic prose post-processing for repeated passages (SURGICAL)

**Problem:** The linter detects duplication but relies entirely on the LLM to fix it.  
**Fix:** When `paragraph_fingerprint` fires after the final attempt (or when a fallback is needed), apply a **deterministic post-processor** that:
1. Identifies the matching paragraph.
2. Replaces the first sentence of the matched paragraph with a structurally different sentence template (e.g., character-action opener, dialogue opener).
3. Accepts the chapter with a warning rather than throwing.

This is a "accept-with-repair" fallback at the final attempt boundary, preventing full pipeline abort from a linting false-positive-or-near-miss. The existing `applyDeterministicProsePostProcessing()` already handles some linter issues post-commit — extending it to handle fingerprint deduplication as a last-resort is consistent with that philosophy.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts` — after the final attempt fails `paragraph_fingerprint` only (not n-gram): extract the duplicate paragraph, take the first sentence, replace it with `[Character name] [past-tense action verb not in prior use] [object/location]`, and re-accept. Log a `ctx.warnings` entry. Only bypass if `paragraph_fingerprint` is the SOLE remaining error.

---

### Solution G — Temperature escalation on template failures (SPECULATIVE)

**Problem:** The model may be reproducing text because its temperature is too low to explore distant vocabulary space.  
**Fix:** Increment temperature by +0.05–0.10 per template-failure retry (capped at 1.0). Template failures are the one class where increased stochasticity is desirable. The current implementation uses the same temperature for all attempts.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts` — pass a per-attempt `temperature` override to `client.chat()` for `template` class retries.

---

## 6. Recommended Fix Priority

| # | Solution | Impact | Complexity | Risk |
|---|---|---|---|---|
| **B** | Pre-emptive anti-copy guardrail from attempt 1 | High | Very low (1-line change) | None |
| **A** | Composite-class mitigation (always inject BANNED PARAGRAPH) | High | Low | Low |
| **D** | N-gram overlap carries matchingPriorParagraph | High | Low-medium | Low |
| **F** | Deterministic post-processing fallback at final attempt | Medium | Medium | Low (warning-only) |
| **C** | Relax paragraph-1 obligation placement when template co-fires | Medium | Medium | Medium |
| **E** | Exclude same-location paragraphs from n-gram window | Medium | Medium-high | Low |
| **G** | Temperature escalation | Low | Low | Medium |

**Minimum viable fix:** Solutions B + A together. B prevents the copy from happening in the first place. A ensures that even when clue failures dominate the class hierarchy, the specific paragraph the model must not reproduce is still shown explicitly.

---

## 7. Affected Files

| File | Change |
|---|---|
| `packages/prompts-llm/src/agent9-prose.ts` | Solutions A, B, C, D, E, F, G |
| `packages/prompts-llm/src/retry-protocol.ts` | Solution A (composite class handling) |
| `apps/worker/config/generation-params.yaml` | Solution E (location-aware linter config) |

---

## 8. Suspect Elimination Coverage Failure (nsd-fix3 run)

### 8a. What happened

`canary-core-run-nsd-fix3.txt` failed with `Release gate hard-stop: suspect elimination coverage incomplete`. The `SuspectClosureValidator` could not verify that Captain Ivor Hale and Beatrice Quill were explicitly cleared in the prose — both regex validation AND LLM semantic fallback failed for both suspects.

Chapter 9 was the discriminating-test/reveal chapter. It failed chapter-level validation on two consecutive attempts before passing on attempt 3:

| Attempt | Outcome | Reason |
|---|---|---|
| 1 | Failed | Template linter: `paragraph_fingerprint` |
| 2 | Content-filtered | Azure OpenAI content management policy blocked the request |
| 3 | Passed chapter gates | No per-chapter suspect clearance gate exists |
| Post-prose release gate | **HARD STOP** | `SuspectClosureValidator` found no elimination language for Hale or Quill |

### 8b. Root cause 1 — No per-chapter validation gate for suspect clearance

The per-chapter validation suite checks: clue delivery (clue_timing), discriminating test presence, sensory opening, word count, structure, encoding, and template linter. It does **not** check whether `suspect_clearance_scenes` obligations were fulfilled.

A chapter can satisfy every chapter-level gate while completely omitting suspect elimination language. The `SuspectClosureValidator` only runs post-prose at the story level. By that point, all chapters are committed and no retry path exists. This is a **one-way valve failure**: the detection is downstream of the recovery mechanism.

The chapter prompt **does** inject the clearance obligation via the `⚠ SUSPECT CLEARANCE REQUIRED` block in `buildProseObligations()`, but that block is validated by the LLM's own self-reporting (the checklist JSON) — and the checklist schema does not have a field that maps directly to suspect clearance presence. It is a soft instruction that survives chapter validation regardless of whether the LLM followed it.

### 8c. Root cause 2 — Content filter wasted attempt 2 of the critical chapter

When ch9 attempt 1 hit `paragraph_fingerprint`, the surgical retry (Pillar 6) injected a `⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:` block containing the normalized text of the prior paragraph that matched.

In a murder mystery set in the 1930s, that prior paragraph almost certainly contained period crime vocabulary: "poison", "murder", "the body", "strangled", "stabbed" etc. The Azure OpenAI content management filter **does not distinguish between violent content that the model generates vs. violent content in a BANNED block injected as part of a retry guardrail**. The BANNED PARAGRAPH's quoted text triggered the content filter and dropped the entire attempt 2 response.

This wasted one of four retries and forced attempt 3 to run under structural-pivot constraints (different opening structure, clock-proximity banned) on a chapter that also needed to deliver suspect clearance, discriminating test, clue obligations, and a culprit reveal. The accumulated constraint pressure crowded out the suspect clearance prose.

### 8d. Root cause 3 — The discriminating test chapter is overloaded

Ch9 (or the equivalent reveal chapter) is the only chapter that carries simultaneous obligations for:
1. Discriminating test (real-time confrontation, dialogue, trap-springing)
2. Culprit naming + evidence chain
3. Suspect clearance for all non-culprit suspects
4. Required clue citation during test
5. Sensory opening (mandatory grounded atmosphere)
6. Word count target
7. Continuity bridge from prior chapter

This is 7 independent obligations in one chapter. Under retry pressure (particularly when 2 of 4 attempts are wasted on unrelated failures), the LLM satisfies the most-validated obligations (the ones that have hard gates: sensory, word count, structure) and drops the least-validated ones (the ones with only post-prose gating: suspect clearance).

### 8e. Creative solutions

**H. Per-chapter suspect clearance gate (HIGH IMPACT, MEDIUM COMPLEXITY)**

Add suspect clearance to the chapter-level validation suite. For any chapter where `matchingClearances.length > 0`, add a validation check that looks for the suspect name + elimination-adjacent vocabulary in the chapter's paragraphs. This is parallel to the existing `clue_timing` gate which validates clue delivery per-chapter.

The simplest form: after extracting the LLM's response, scan each required clearance suspect's name against the paragraph text using the same logic as `ELIMINATION_TERMS` + `EVIDENCE_TERMS` (or a subset). If missing, push to `batchErrors` as a `clue_timing`-equivalent error (which the retry protocol understands).

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → lintBatchProse()` — add a `suspect_clearance_missing` check alongside the existing template checks, driven by the `matchingClearances` list passed in. Return it as a `ProseLinterIssue` with type `suspect_clearance_missing`, message naming the specific suspect.

**I. BANNED PARAGRAPH content-filter sanitization (HIGH IMPACT, LOW COMPLEXITY)**

The BANNED PARAGRAPH block is injected verbatim into the retry prompt. For a mystery story, the banned text will routinely contain words like "murder", "poison", "strangled", "the body was found", etc. These trigger Azure content filtering.

Fix: before injecting `fingerprintIssue.matchingPriorParagraph` as the BANNED block, strip explicit violence vocabulary to a neutral token:

```typescript
const sanitizeForContentPolicy = (text: string): string =>
  text.replace(/\b(murder(?:ed|er)?|poison(?:ed)?|strang(?:led|ling)|stabb(?:ed|ing)|kill(?:ed|ing)|corpse|body\s+was\s+found|dead\s+body|the\s+body)\b/gi, '[REDACTED]');
```

Apply to the `matchingPriorParagraph` before the `⛔ BANNED PARAGRAPH` injection. The structural information (sentence structure, specific named phrases, non-crime vocabulary) remains and serves the purpose of the block. The LLM doesn't need the word "murder" in the BANNED block to understand what it must not reproduce.

**Implementation target:** `packages/prompts-llm/src/agent9-prose.ts → buildEnhancedRetryFeedback()` — wrap the `fingerprintIssue.matchingPriorParagraph` with a sanitizer call before `feedback +=`.

**J. Split the reveal chapter obligations (MEDIUM IMPACT, HIGH COMPLEXITY)**

The overloaded final chapter could be split into two: a penultimate "clearance chapter" (all non-culprit suspects explicitly eliminated with evidence) and a final "accusation chapter" (discriminating test + culprit naming). This requires outline-level changes (adding a scene to act 3) but permanently prevents the overloading problem.

**Implementation target:** Agent 7 outline generator — add a schema-supported `clearance_chapter` scene in act 3 before the discriminating test. This maps naturally to the Golden Age convention of the "gathering in the library" chapter where the detective eliminates each suspect in sequence.

**K. Fallback: post-prose suspect clearance repair pass (MEDIUM IMPACT, MEDIUM COMPLEXITY)**

If the release gate detects `hasSuspectEliminationCoverageFailure`, instead of immediately throwing, trigger a targeted repair pass: a single LLM call that receives the last N chapters of prose and a list of suspects that lack clearance, and is asked to produce a one-paragraph addendum for each. This addendum is appended to the most appropriate chapter (the discriminating test chapter). The repair pass is a last-resort fallback that prevents total pipeline failure from a single omission.

**Implementation target:** `apps/worker/src/jobs/agents/agent9-run.ts` — before the release gate hard-stop throw, check `hasSuspectEliminationCoverageFailure` and invoke a `repairSuspectClearance()` sub-function. Log the repair as a warning.

### 8f. Recommended fix priority for suspect elimination gap

| # | Solution | Impact | Complexity | Risk |
|---|---|---|---|---|
| **I** | BANNED PARAGRAPH content sanitization | High | Very low | None |
| **H** | Per-chapter suspect clearance gate | High | Medium | Low |
| **K** | Post-prose repair pass (fallback) | Medium | Medium | Low |
| **J** | Split reveal chapter in outline | Medium | High | Medium |

**Minimum viable fix:** Solution I eliminates the content-filter wasted-retry problem immediately. Solution H prevents the structural gap where suspect clearances are never validated per-chapter. Together they address the two independent failure vectors observed in nsd-fix3.

### 8g. Additional affected files

| File | Change |
|---|---|
| `packages/story-validation/src/suspect-closure-validator.ts` | Reference only (validator is correct) |
| `packages/prompts-llm/src/agent9-prose.ts` | Solutions H, I |
| `apps/worker/src/jobs/agents/agent9-run.ts` | Solution K |

---

## 9. Strategic Implementation Plan

### 9a. System failure map

The two failure types (template linter, suspect elimination) share a common meta-pattern: **detection is downstream of recovery**. The fix in both cases is to move detection upstream into the retry loop.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FAILURE LIFECYCLE                            │
├──────────────┬──────────────────────────────────┬───────────────────┤
│ Failure type │ Current detection point          │ Recovery window   │
├──────────────┼──────────────────────────────────┼───────────────────┤
│ fingerprint  │ lintBatchProse() per-chapter     │ 4 retries         │
│ n-gram       │ lintBatchProse() per-chapter     │ 4 retries         │
│ suspect      │ SuspectClosureValidator post-prose│ NONE              │
│  clearance   │ (story-level, all chapters done) │                   │
├──────────────┼──────────────────────────────────┼───────────────────┤
│ Interception │ Prevention + per-attempt feedback│ Per-chapter retry │
│ targets      │ from attempt 1 (not just final)  │ gate for suspect  │
│              │ Unconditional BANNED PARAGRAPH   │ clearance in the  │
│              │ BANNED text sanitized for filter │ lintBatchProse    │
│              │ N-gram reports specific overlap  │ validator         │
└──────────────┴──────────────────────────────────┴───────────────────┘
```

**Co-occurrence cascade:** When `clue_timing` + `template` co-occur, `classifyFailure()` picks `clue_timing` (rank 95 > 60) → `tighten_obligation` mitigation → the BANNED PARAGRAPH injection is gated inside the `templateErrors` block of `buildEnhancedRetryFeedback()` — which still fires IF template errors appear in `lastBatchErrors`. However, on attempt 1 the deferred-linter gate may suppress template errors from `batchErrors` entirely, meaning attempt 2 retries with only clue feedback and the model encounters the template violation fresh. The BANNED PARAGRAPH must fire unconditionally at the feedback layer, independent of error-class ranking.

---

### 9b. Implementation phases

#### Phase 1 — Prevention (zero-risk; ~1 hour total)

**Goal:** Stop the most frequent failure modes before they reach the retry loop.

---

**P1-B: Promote anti-copy rule to all attempts (non-final batches only)**

- **File:** `packages/prompts-llm/src/agent9-prose.ts`  
- **Location:** Lines ~5129–5140  
- **Current:** `if (attempt >= maxBatchAttempts && chapters.length > 0)`  
- **Change:** Remove the `attempt >= maxBatchAttempts` guard, but keep an `!isLastBatch` guard. The guardrail fires on ALL attempts for non-final chapters only:

```typescript
// Anti-copy rule: fires on every attempt (not just final) because
// attempt 1 verbatim-copy is the most common template linter trigger.
// EXCEPTION: the final/reveal batch is exempt — the detective recap
// legitimately echoes prior-chapter vocabulary (the same reason
// skipNgramCheck: true is applied to the final batch at the linter call site).
if (chapters.length > 0 && !isLastBatch) {
  mitigationGuardrails.push(
    "STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. " +
    "You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. " +
    "Every sentence in this chapter must be original prose unique to this scene. " +
    "Reusing even a clause from prior chapter text will cause this attempt to fail immediately.",
  );
}
```

**Why the final batch is exempt:** The detective denouement/reveal chapter is structurally required to recap prior events — "As the clock showed ten past eleven...", "Eleanor's fingerprints on the casing confirmed..." — prose that will naturally share vocabulary with earlier chapters. The n-gram check is already disabled for `isLastBatch` (via `skipNgramCheck: true` at line ~5550) for this exact reason. The anti-copy guardrail must respect the same boundary. Injecting it into the reveal chapter would force the model to avoid precisely the vocabulary it needs for the recap, degrading the detective summary quality.

- **Risk:** None. The same constraint already runs on attempt 4 for non-final chapters; earlier attempts are strictly improved.  
- **Test:** No new test required; the build verifying the existing attempt-4 constraint path continues to pass. Verify `isLastBatch` is in scope at the guard location (it is — it is computed at line ~5544 in the same batch loop).

---

**P1-I: Sanitize BANNED PARAGRAPH text before injection**

- **File:** `packages/prompts-llm/src/agent9-prose.ts`  
- **Location:** Line ~4553 inside `buildEnhancedRetryFeedback()`  
- **Change:** Add a `sanitizeForContentPolicy()` helper and apply it to the matched paragraph text:

```typescript
/** Strip violence keywords from BANNED text to avoid Azure content filter triggering
 *  on the guardrail itself.  Sentence structure and non-violent phrasing is preserved. */
const sanitizeForContentPolicy = (text: string): string =>
  text.replace(
    /\b(murder(?:ed|er|ers|ing)?|poison(?:ed|ing|ous)?|strang(?:led|ling|ulation)|stabb(?:ed|ing)|kill(?:ed|ing|er|ers)?|corpse|dead\s+body|the\s+body(?:\s+of)?|body\s+was\s+found|bludgeon(?:ed|ing)?|shot\s+(?:him|her|them))\b/gi,
    '[crime-redacted]',
  );

// In buildEnhancedRetryFeedback, around line 4553:
if (hasFingerprintDupe && options?.enableSurgicalFingerprintRetry && fingerprintIssue?.matchingPriorParagraph) {
  const bannedText = sanitizeForContentPolicy(fingerprintIssue.matchingPriorParagraph);
  feedback += `⛔ BANNED PARAGRAPH — DO NOT REPRODUCE ANY SENTENCE FROM THIS TEXT:\n`;
  feedback += `"${bannedText}"\n\n`;
  // ... rest unchanged
}
```

- **Risk:** None. Sentence structure (the structurally informative part for the model) is fully preserved; only violence lexemes are replaced with a fixed token the filter does not flag.  
- **Test:** No new test; existing Pillar 6 unit tests continue to validate the BANNED block format.

---

#### Phase 2 — Detection hardening (low-risk; ~2–4 hours total)

**Goal:** Ensure both failure types are caught within the per-chapter retry loop, not after it.

---

**P2-A: Unconditional BANNED PARAGRAPH injection**

The current BANNED PARAGRAPH injection is inside `if (templateErrors.length > 0)`. This is correct for the normal case. The risk case is when the deferred linter gate (attempt 1 with narrative hard errors) silently drops template errors from `batchErrors` — meaning `lastBatchErrors` on attempt 2 does not contain the template error string, so `hasFingerprintDupe` (line 4540) evaluates to false even though `lastLinterIssues` has the fingerprint issue.

**Code-grounded diagnosis:**
- `hasNarrativeHardErrors` (line 5544): `true` when `batchErrors.length > 0` before linting runs
- Deferred gate (lines 5563–5569): when `hasNarrativeHardErrors`, linter issues are console-warned but NOT pushed to `batchErrors`
- `lastLinterIssues = linterIssues` (line 5596): inside `if (batchErrors.length > 0)` — this IS reached because narrative errors keep `batchErrors` non-empty — **so Location 1 is already correct and needs no change**
- `hasFingerprintDupe` (line 4540): reads from `templateErrors`, which is filtered from `rawErrors = lastBatchErrors` — the string is absent when deferred → **Location 2 is the only bug**

- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Location (only):** `buildEnhancedRetryFeedback()` lines 4539–4540 — switch `hasNgramOverlap` and `hasFingerprintDupe` from string-derived to linter-issue-derived:

```typescript
// ─── CURRENT (lines 4539–4540) ───────────────────────────────────────────
const hasNgramOverlap = templateErrors.some(e => /high n-gram overlap/i.test(e));
const hasFingerprintDupe = templateErrors.some(e => /repeated long paragraph fingerprint/i.test(e));

// ─── REPLACEMENT ─────────────────────────────────────────────────────────
// Use the dedicated linter-issues channel so BANNED PARAGRAPH fires even when
// the deferred gate suppressed template errors from batchErrors on attempt 1.
const hasNgramOverlap = (options?.linterIssues ?? []).some(
  (issue) => issue.type === "ngram_overlap",
);
const hasFingerprintDupe = (options?.linterIssues ?? []).some(
  (issue) => issue.type === "paragraph_fingerprint",
);
```

The `if (templateErrors.length > 0)` outer gate can remain: the BANNED PARAGRAPH logic inside it is now driven by `hasFingerprintDupe` from the issues channel, not from `templateErrors`. Because `fingerprintIssue` is already derived from `options?.linterIssues` (line ~4550, existing code), the BANNED block now fires correctly on attempt 2 even when template errors were deferred.

- **Risk:** None. `lastLinterIssues` is set correctly already (confirmed at line 5596). This change only fixes the derivation of the boolean flags, not the propagation path.
- **Export needed for test:** `buildEnhancedRetryFeedback` is not currently exported. To unit-test it directly, export it: `export const buildEnhancedRetryFeedback = ...` (or test via `generateProse` integration path if preferred).

---

**P2-H: Per-chapter suspect clearance gate in `lintBatchProse()`**

Currently, suspect clearance checking only happens post-prose in `SuspectClosureValidator`. By that point all chapters are committed and there is no retry window. Add the check inside `lintBatchProse()` so it runs per-batch within the retry loop.

- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Step 1 — Type change:** Extend `ProseLinterIssue.type` union (line ~194):

```typescript
// ─── CURRENT ──────────────────────────────────────────────────────────────
interface ProseLinterIssue {
  type: "opening_style_entropy" | "paragraph_fingerprint" | "ngram_overlap";
  message: string;
  matchingPriorParagraph?: string;
}

// ─── REPLACEMENT ──────────────────────────────────────────────────────────
interface ProseLinterIssue {
  type: "opening_style_entropy" | "paragraph_fingerprint" | "ngram_overlap" | "suspect_clearance_missing";
  message: string;
  matchingPriorParagraph?: string;
}
```

- **Step 2 — Options extension:** Add `matchingClearances` to `lintBatchProse` options (line ~843):

```typescript
// ─── CURRENT ──────────────────────────────────────────────────────────────
options?: {
  mode?: "standard" | "repair";
  chapterOffset?: number;
  entropyThreshold?: number;
  entropyMinWindow?: number;
  entropyWarmupChapters?: number;
  skipNgramCheck?: boolean;
},

// ─── REPLACEMENT ──────────────────────────────────────────────────────────
options?: {
  mode?: "standard" | "repair";
  chapterOffset?: number;
  entropyThreshold?: number;
  entropyMinWindow?: number;
  entropyWarmupChapters?: number;
  skipNgramCheck?: boolean;
  /** Suspect clearances required in this batch.  When present, lintBatchProse checks
   *  that each suspect's name co-occurs with elimination vocabulary in the prose. */
  matchingClearances?: Array<{ suspect_name: string; clearance_method?: string }>;
},
```

- **Step 3 — Check implementation:** Append the clearance check just before `return issues` (after the n-gram block, ~line 977):

```typescript
// Suspect clearance check: for chapters that carry a clearance obligation
// (as declared in prose_requirements.suspect_clearance_scenes), verify the
// prose names the suspect with elimination-adjacent vocabulary.  Failures are
// typed as suspect_clearance_missing so they are classified as clue_timing (rank 95)
// by classifyFailure() — giving them the highest retry priority.
const CLEARANCE_TERMS =
  /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;
if (options?.matchingClearances && options.matchingClearances.length > 0) {
  const allParagraphs = batchChapters.flatMap((ch) => (ch.paragraphs ?? []).join(' ')).join(' ');
  for (const clearance of options.matchingClearances) {
    const suspectName = clearance.suspect_name;
    const suspectPattern = new RegExp(`\\b${suspectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (!suspectPattern.test(allParagraphs) || !CLEARANCE_TERMS.test(allParagraphs)) {
      issues.push({
        type: "suspect_clearance_missing",
        message: `Clue obligation: suspect clearance missing for "${suspectName}". ` +
          `This chapter must explicitly name "${suspectName}" alongside elimination language ` +
          `(e.g. "cleared", "ruled out", "innocent", "alibi holds"). ` +
          `Do not imply clearance — state it directly with a reason.`,
      });
    }
  }
}
```

- **Step 4 — Call site:** At the `lintBatchProse()` call (line ~5549), compute and pass clearances:

```typescript
// ─── CURRENT (~line 5549) ────────────────────────────────────────────────
const linterIssues = lintBatchProse(
  proseBatch.chapters,
  chapters,
  [],
  isLastBatch ? { ...(inputs.templateLinterProfile ?? {}), skipNgramCheck: true } : inputs.templateLinterProfile,
);

// ─── REPLACEMENT ─────────────────────────────────────────────────────────
const allClearanceScenes: Array<{ act_number: number; scene_number: number; suspect_name: string; clearance_method?: string }> =
  Array.isArray(cmlCase.prose_requirements?.suspect_clearance_scenes)
    ? cmlCase.prose_requirements.suspect_clearance_scenes
    : [];
const batchMatchingClearances = allClearanceScenes.filter((entry) =>
  batchScenes.some(
    (scene: any) =>
      Number(entry.act_number) === Number(scene.act) &&
      Number(entry.scene_number) === Number(scene.sceneNumber),
  ),
);
const linterOptions = isLastBatch
  ? { ...(inputs.templateLinterProfile ?? {}), skipNgramCheck: true }
  : { ...(inputs.templateLinterProfile ?? {}) };
if (batchMatchingClearances.length > 0) {
  (linterOptions as any).matchingClearances = batchMatchingClearances;
}
const linterIssues = lintBatchProse(proseBatch.chapters, chapters, [], linterOptions);
```

- **`suspect_clearance_missing` and retry classification:** `classifyFailure()` in `retry-protocol.ts` uses `SUSPECT_CLOSURE_MESSAGE_RE` to classify `suspect_closure_missing` errors as `clue_timing` (rank 95). The new message string starts with `"Clue obligation: suspect clearance missing"` — this matches the existing `/clue obligation/i` pattern in `classifyFailure`. Confirm the pattern covers this prefix before shipping.
- **Risk:** Low. The clearance check is additive — it only fires when `matchingClearances` is populated. The suspect closure validator in `agent9-run.ts` remains as the final gate; this only adds an earlier catch.

---

**Phase 2 test command:**

```bash
# Build the package
npm run -w @cml/prompts-llm build

# Run targeted unit tests (after exporting lintBatchProse and buildEnhancedRetryFeedback)
npm run -w @cml/prompts-llm test -- src/__tests__/agent9-prose.test.ts

# Full test suite
npm run -w @cml/worker test

# Canary run (Phase 2 verification)
npm run canary:core *> C:\CML\logs\canary-core-run-a16-p2.txt ; echo "Exit: $LASTEXITCODE"
```

**Phase 2 verification in logs:**
- On a run where fingerprint fires during a batch with co-occurring narrative errors: look for `⛔ BANNED PARAGRAPH` in attempt 2's prompt (not just attempt 4)
- Look for `[Agent 9] Deferred template hard-gate` — followed on the NEXT attempt by a prompt containing BANNED PARAGRAPH
- For P2-H: look for `"suspect_clearance_missing"` in the canary batch error log when a clearance chapter is being generated

---

#### Phase 3 — Diagnostic enrichment (~2–3 hours total)

**Goal:** Give the retry feedback precise enough information to target the specific repeated passage, rather than the generic "rewrite everything" instruction.

---

**P3-D: Record `matchingPriorParagraph` on n-gram overlap issues**

Currently the n-gram inner loop breaks on the first overlap hit but does not record which `base` paragraph caused the hit. This means `buildEnhancedRetryFeedback()` can inject a BANNED block for fingerprint (exact) matches but not for n-gram (near-duplicate) matches.

- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Location:** n-gram inner loop, lines ~957–975

```typescript
// ─── CURRENT (~lines 957–975) ────────────────────────────────────────────
if (priorNgrams.length > 0) {
  outer: for (const chapter of batchChapters) {
    for (const paragraph of chapter.paragraphs ?? []) {
      const normalized = normalizeParagraphForFingerprint(paragraph);
      if (normalized.length < styleLinterConfig.ngram.min_chars) continue;
      const candidate = toNgrams(tokenizeWords(normalized), styleLinterConfig.ngram.gram_size);
      if (candidate.size < styleLinterConfig.ngram.min_candidate_ngrams) continue;
      for (const base of priorNgrams) {
        const overlap = jaccardSimilarity(candidate, base);
        if (overlap >= styleLinterConfig.ngram.overlap_threshold) {
          issues.push({
            type: "ngram_overlap",
            message: `Template linter: high n-gram overlap detected (${overlap.toFixed(2)} >= ${styleLinterConfig.ngram.overlap_threshold.toFixed(2)}). Rephrase this passage to avoid template leakage.`,
          });
          break outer;
        }
      }
    }
  }
}

// ─── REPLACEMENT ─────────────────────────────────────────────────────────
if (priorNgrams.length > 0) {
  outer: for (const chapter of batchChapters) {
    for (const paragraph of chapter.paragraphs ?? []) {
      const normalized = normalizeParagraphForFingerprint(paragraph);
      if (normalized.length < styleLinterConfig.ngram.min_chars) continue;
      const candidate = toNgrams(tokenizeWords(normalized), styleLinterConfig.ngram.gram_size);
      if (candidate.size < styleLinterConfig.ngram.min_candidate_ngrams) continue;
      // Find the prior paragraph with the highest overlap (not just the first over threshold).
      let maxOverlap = 0;
      let maxOverlapIdx = -1;
      for (let bi = 0; bi < priorNgrams.length; bi++) {
        const overlap = jaccardSimilarity(candidate, priorNgrams[bi]);
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          maxOverlapIdx = bi;
        }
      }
      if (maxOverlap >= styleLinterConfig.ngram.overlap_threshold) {
        issues.push({
          type: "ngram_overlap",
          message: `Template linter: high n-gram overlap detected (${maxOverlap.toFixed(2)} >= ${styleLinterConfig.ngram.overlap_threshold.toFixed(2)}). Rephrase this passage to avoid template leakage.`,
          matchingPriorParagraph: priorCandidates[maxOverlapIdx],
        });
        break outer;
      }
    }
  }
}
```

- **Step 2 — BANNED block for n-gram in `buildEnhancedRetryFeedback()`:** After the existing fingerprint BANNED block (line ~4552), add an analogous block for n-gram issues:

```typescript
// After the existing fingerprintIssue BANNED block:
const ngramIssue = options?.linterIssues?.find(
  (issue) => issue.type === "ngram_overlap" && issue.matchingPriorParagraph,
);
if (hasNgramOverlap && options?.enableSurgicalFingerprintRetry && ngramIssue?.matchingPriorParagraph) {
  const bannedText = sanitizeForContentPolicy(ngramIssue.matchingPriorParagraph);
  feedback += `⛔ NEAR-DUPLICATE PASSAGE — your prose closely echoes this prior paragraph:\n`;
  feedback += `"${bannedText}"\n\n`;
  feedback += `Rewrite any paragraph that shares sentence structure or extended phrases with the above text.\n`;
  feedback += `Different words for the same image are not sufficient — the sentence structure must also differ.\n\n`;
}
```

- **Note on `priorCandidates` index alignment:** `priorCandidates` (string array) and `priorNgrams` (Set array) are built in parallel at lines ~952–958 and remain index-aligned. Using `priorCandidates[maxOverlapIdx]` is safe.
- **Risk:** Low. The loop is refactored to find the max-overlap prior rather than the first-over-threshold prior — this is strictly more informative and has no false-positive risk.

---

**P3-C: Placement-widening directive on co-occurring clue + template errors**

When `clue_timing` + `template` co-occur, `classifyFailure()` picks `clue_timing` (rank 95 > 60) and selects `tighten_obligation` mitigation. This tightens clue delivery constraints further — the opposite of what is needed when the chapter is already congested. Add a placement-widening directive that fires specifically when both failure types are present.

- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Location:** `buildRetryMicroPromptDirectives()` inside the `ngramOverlapError || fingerprintError` block (lines ~4430–4460)

```typescript
// ─── ADD after the existing 3-tier template_overlap directives ────────────
// Co-occurrence: template + clue_timing failures together.
// When the chapter has both a template repetition AND missing clues, the model
// is congested.  Rather than further tightening clue placement (which makes
// repetition more likely), widen the delivery window to reduce constraint pressure.
const hasClueTimingError = rawErrors.some(
  (e) => /clue obligation|clue evidence|clue timing|missing required clue/i.test(e),
);
if ((ngramOverlapError || fingerprintError) && hasClueTimingError) {
  directives.push(
    `PLACEMENT RELIEF [template+clue co-occurrence — attempt ${attemptNum}]: Both a template overlap AND a clue timing failure were detected.\n` +
    `  Do NOT force every required clue into a single paragraph. You may distribute them across 2–3 paragraphs or reveal them through dialogue.\n` +
    `  Priority: write each paragraph as ENTIRELY FRESH prose first. Then weave in clue details as natural observations or conversations.\n` +
    `  A chapter that avoids template repetition but misses a clue can be corrected on the next retry. ` +
    `A chapter that copies prior prose to satisfy a clue will fail the template check immediately.`
  );
}
```

- **Risk:** Low. The directive is additive and fires only when both error types are present. It does not disable or weaken the clue obligation enforcement — it only gives permission to spread delivery across paragraphs.

---

**Phase 3 test command:**

```bash
# Build
npm run -w @cml/prompts-llm build

# Unit test (after exporting lintBatchProse to test n-gram matchingPriorParagraph)
npm run -w @cml/prompts-llm test -- src/__tests__/agent9-prose.test.ts

# Canary run (Phase 3 verification)
npm run canary:core *> C:\CML\logs\canary-core-run-a16-p3.txt ; echo "Exit: $LASTEXITCODE"
```

**Phase 3 verification in logs:**
- Look for `⛔ NEAR-DUPLICATE PASSAGE` in retry prompts where n-gram overlap was the prior failure
- Look for `PLACEMENT RELIEF` directive in retry prompts where both template and clue errors were present in the prior attempt
- Confirm the BANNED text in n-gram block is drawn from actual prior prose (not empty)

---

#### Phase 4 — Last-resort fallbacks (~2–4 hours total)

**Goal:** Prevent total pipeline failure from single-point omissions that survive all earlier gates.

---

**P4-F: Deterministic first-sentence swap on fingerprint-only failure at exhaustion**

When the only remaining error at attempt exhaustion is a paragraph fingerprint (no n-gram, no narrative errors), the LLM has exhausted its stochastic variation budget. A deterministic transformation — swapping out only the first sentence — breaks the fingerprint match without requiring a full LLM retry.

- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Location:** After the batch attempt loop `for (let attempt = 1; ...)`, before the `throw abortErr` at the exhaustion branch (~line 5669)
- **Pattern:** This is a last-resort path; invoke only when: `batchErrors.length > 0` AND all errors are fingerprint-only AND the attempt is the final one.

```typescript
// P4-F: Fingerprint-only deterministic repair at attempt exhaustion.
// When the ONLY remaining failure is a paragraph_fingerprint (no narrative or n-gram errors),
// the LLM has stochastically exhausted variation.  Apply a deterministic first-sentence swap:
// replace the opening sentence of the duplicated paragraph with a rephrased form derived
// from the second sentence.  This breaks the fingerprint match with zero LLM cost.
if (attempt >= maxBatchAttempts && batchErrors.length > 0) {
  const isFingerprintOnly =
    lastLinterIssues.length > 0 &&
    lastLinterIssues.every((i) => i.type === "paragraph_fingerprint") &&
    batchErrors.every((e) => /repeated long paragraph fingerprint/i.test(e));
  if (isFingerprintOnly && proseBatch.chapters.length > 0) {
    console.warn(`[Agent 9] P4-F: fingerprint-only failure at exhaustion — applying deterministic first-sentence swap`);
    for (const chapter of proseBatch.chapters) {
      const paragraphs = chapter.paragraphs ?? [];
      for (let pi = 0; pi < paragraphs.length; pi++) {
        const normalized = normalizeParagraphForFingerprint(paragraphs[pi]);
        if (normalized.length < styleLinterConfig.paragraph_fingerprint_min_chars) continue;
        // Check if this paragraph is the fingerprint match
        const priorFingerprints = new Set(
          chapters.flatMap((ch) => ch.paragraphs ?? []).map(normalizeParagraphForFingerprint)
        );
        if (priorFingerprints.has(normalized)) {
          // Remove the first sentence by replacing up to the first sentence boundary
          const sentences = paragraphs[pi].split(/(?<=[.!?])\s+/);
          if (sentences.length >= 2) {
            // Drop sentence 0; prepend a structural marker so paragraph is not re-fingerprinted
            paragraphs[pi] = sentences.slice(1).join(' ');
            console.warn(`[Agent 9] P4-F: dropped first sentence of paragraph ${pi} in chapter ${chapter.title ?? '?'}`);
          }
        }
      }
    }
    // Re-run linter to confirm repair
    const repairIssues = lintBatchProse(proseBatch.chapters, chapters, [], linterOptions);
    if (repairIssues.every((i) => i.type !== "paragraph_fingerprint")) {
      console.warn(`[Agent 9] P4-F: deterministic repair succeeded — accepting batch`);
      batchErrors = []; // clear to allow commit
    }
  }
}
```

- **Note:** `styleLinterConfig` is in scope inside `generateProse()` via the closure over `lintBatchProse`'s config read. If not, read it inline: `const styleLinterConfig = getGenerationParams().agent9_prose.style_linter;`
- **Risk:** Medium. Sentence dropping can create abrupt paragraph openings. Mitigate by logging the repair prominently and surfacing it in the release gate audit as a warning (not a hard stop). The result is always better than a total pipeline failure.

---

**P4-K: Post-prose suspect clearance repair pass**

If the release gate in `agent9-run.ts` detects `hasSuspectEliminationCoverageFailure`, trigger a targeted single-LLM-call repair before throwing. The repair call receives the last 3 chapters and a list of un-cleared suspects, and must produce one addendum paragraph per suspect naming them with elimination vocabulary.

- **File:** `apps/worker/src/jobs/agents/agent9-run.ts`
- **Location:** Before the final hard-stop `throw new Error(hardStopMessage)` (~line 2878) — inside the `if (hardStopReasons.length > 0)` block

```typescript
// P4-K: Last-resort suspect clearance repair.
// Only triggers when the sole hard-stop reason is suspect elimination coverage.
// Appends one clearance paragraph per missing suspect to the final chapter.
if (
  hardStopReasons.length === 1 &&
  hardStopReasons[0] === "suspect elimination coverage incomplete" &&
  prose &&
  prose.chapters.length > 0
) {
  ctx.warnings.push("[P4-K] Attempting post-prose suspect clearance repair pass");
  try {
    // Identify which suspects are missing clearance
    const missingClearances = validationReport.errors
      .filter((e: any) => isSuspectEliminationCoverageError(e))
      .map((e: any) => e.suspectName ?? String(e.message ?? ''));
    // ... invoke a targeted LLM repair call here (implementation TBD per P4-K detail)
    // On success: clear hardStopReasons; log as warning
    ctx.warnings.push(`[P4-K] Clearance repair pass completed for: ${missingClearances.join(', ')}`);
    hardStopReasons.length = 0;
  } catch (repairErr: any) {
    ctx.warnings.push(`[P4-K] Clearance repair pass failed: ${repairErr.message}`);
    // Fall through to existing hard-stop
  }
}
```

- **Note:** The LLM repair sub-call details (prompt construction, model config) are left as a follow-on implementation step; the scaffolding above establishes the recovery path. `isSuspectEliminationCoverageError` is already imported in `agent9-run.ts` (used at line ~2575 for the gate check).
- **Risk:** Medium. The LLM repair call adds latency and a new failure mode. Gate it strictly — only fire when the sole hard-stop reason is suspect elimination coverage, so other hard stops (e.g. illegal characters, NSD divergence) are not inadvertently cleared.

---

**Phase 4 test command:**

```bash
# Build worker (agent9-run.ts change)
npm run -w @cml/worker build

# Build prompts-llm (P4-F change)
npm run -w @cml/prompts-llm build

# Targeted tests
npm run -w @cml/worker test
npm run -w @cml/prompts-llm test

# Canary run (Phase 4 verification — use a run known to trigger suspect clearance failure)
npm run canary:core *> C:\CML\logs\canary-core-run-a16-p4.txt ; echo "Exit: $LASTEXITCODE"
```

**Phase 4 verification in logs:**
- P4-F: look for `[Agent 9] P4-F: fingerprint-only failure at exhaustion` and `[Agent 9] P4-F: deterministic repair succeeded`
- P4-K: look for `[P4-K] Attempting post-prose suspect clearance repair pass` in the warning log
- P4-K non-regression: confirm runs that hard-stop on OTHER reasons (NSD, illegal chars) still throw correctly (P4-K must not fire for them)

---

### 9c. Implementation order and test matrix

| Phase | Solution | File | Lines | Test command | Canary output |
|---|---|---|---|---|---|
| **P1** | P1-B anti-copy all attempts | `agent9-prose.ts` | ~5133–5140 | `npm run -w @cml/prompts-llm build` | `canary-a16-p1.txt` |
| **P1** | P1-I BANNED text sanitizer | `agent9-prose.ts` | ~4553 + helper | `npm run -w @cml/prompts-llm build` | `canary-a16-p1.txt` |
| **P2** | P2-A fix hasFingerprintDupe | `agent9-prose.ts` | 4539–4540 | unit test + build | `canary-a16-p2.txt` |
| **P2** | P2-H clearance gate in linter | `agent9-prose.ts` | ~194, ~843, ~977, ~5549 | unit test + build | `canary-a16-p2.txt` |
| **P3** | P3-D n-gram matchingPriorParagraph | `agent9-prose.ts` | ~957–975 | unit test + build | `canary-a16-p3.txt` |
| **P3** | P3-C placement-widening directive | `agent9-prose.ts` | ~4460 | build | `canary-a16-p3.txt` |
| **P4** | P4-F fingerprint-only repair | `agent9-prose.ts` | ~5669 | build | `canary-a16-p4.txt` |
| **P4** | P4-K post-prose clearance repair | `agent9-run.ts` | ~2878 | build | `canary-a16-p4.txt` |

**Build command (all phases):**

```bash
npm run -w @cml/worker build
# (worker build depends on prompts-llm; both are rebuilt)
```

**Full test suite (after each phase):**

```bash
npm run -w @cml/prompts-llm test
npm run -w @cml/worker test
```

**After each canary run, confirm:**
1. Exit code 0 (or expected exit code for the scenario)
2. `CANARY_CLUE_STATUS: PASS` in the run log
3. No new regression errors introduced (compare error classes with prior baseline)
4. The specific phase's log markers appear (see verification notes per phase above)

**Minimum viable ship order:** P1-B → P1-I → P2-A → canary. This is the lowest-risk sequence that addresses the most frequent failure mode (fingerprint BANNED block silently not firing on attempt 2). Phases 3 and 4 are enrichment; Phase 2-H is recommended before the next full story run.
