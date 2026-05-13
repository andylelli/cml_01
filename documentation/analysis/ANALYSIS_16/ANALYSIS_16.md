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
