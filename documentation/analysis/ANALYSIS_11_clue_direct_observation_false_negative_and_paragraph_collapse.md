# ANALYSIS_11: Clue "Direct Observation" Retry Directive Unhelpful; Duplicate Clue Error; Attempt-4 Single-Paragraph Collapse

## Overview

Three interacting failure modes in the same Ch3 run, all four attempts failed, aborting the chapter:

| # | Error | Attempts affected | Outcome |
|---|-------|-------------------|---------|
| A | Retry directive uses delivery-method genre label `"Direct observation"` as prose instruction — model cannot interpret it as actionable content | 1, 2, 3 | Hard fail — clue genuinely absent; retry directive fails to fix it |
| B | Same error emitted twice per attempt | 1, 2, 3 | Retry directive over-repeated; no extra signal |
| C | Attempt 4 delivers all prose as one paragraph block (4867 chars, 806 words) | 4 | Hard fail — paragraph structure checks block acceptance |

---

## Error A — `clue evidence "Direct observation" is absent` — retry directive carries genre label, not prose content

### What the model and validator both report

The model's own audit self-check (from the diagnostic `raw tail`) on attempts 1–3 reads:

```json
"required_clues_present": "clue_1: chapter 3 paragraph 1, clue_2: chapter 3 paragraph 4, clue_3: chapter 3 paragraph 3 | absent",
"early_observation_present": "clock in the study shows the time as 10:10 PM: chapter 3 paragraph 1 | absent"
```

Both `early_observation_present` and the validator independently report the clue as absent on each of attempts 1–3. The model itself self-reports `| absent` — confirming the clock observation was not written into the prose. **The validator is correct.** The chapter genuinely does not contain this clue on these attempts.

### What the validator checks

`chapterMentionsRequiredClue` tokenises the clue's `description` and `pointsTo` fields via `tokenizeForClueObligation`:

```typescript
const tokens = Array.from(new Set([
  ...tokenizeForClueObligation(String(clue.description ?? "")),
  ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
])).slice(0, 10);
```

For a clue whose `description` is `"Direct observation"` and `pointsTo` contains content-rich tokens (e.g. `"cannot be trusted to indicate the time of death"`), the combined token pool would include both delivery-method tokens (`"direct"`, `"observation"`) and content tokens (`"trusted"`, `"indicate"`, `"time"`, `"death"`). The 40% match threshold across the full pool gives the validator a reasonable signal.

If `pointsTo` is populated, the validator works. The uncertainty is whether this particular clue's `pointsTo` field contains prose-matchable content tokens.

### Why the retry fails (attempts 2 and 3)

This is the real problem. When `validateChapterPreCommitObligations` builds the error string, it sets:

```typescript
const resolvedDesc = clue?.description?.trim() ?? ctx?.description?.trim() ?? null;
const clueDesc = resolvedDesc ? `"${resolvedDesc}"` : `"${clueId}"`;
```

For this clue, `resolvedDesc = "Direct observation"`, so `clueDesc = '"Direct observation"'`. The error message becomes:

```
Chapter 3: clue evidence "Direct observation" is absent.
Include an on-page observation of "Direct observation" in the first quarter of the chapter,
followed immediately by an explicit inference paragraph.
```

`buildRetryMicroPromptDirectives` then calls `extractQuoted()` on these error strings and builds a directive around `"Direct observation"`. The directive instructs the model to write something carrying the phrase "Direct observation" — a genre label, not a narrative description.

The model receives the instruction, interprets "Direct observation" as a prose-writing technique instruction ("use the technique of direct observation"), and regenerates a chapter with the same structural pattern. Since nothing in the retry directive tells the model *what* was observed (the clock, the specific time), the model never writes about the clock. Attempts 2 and 3 produce nearly identical chapters (1102 / 1099 words) with identical failures.

### Root cause

The error string construction in `validateChapterPreCommitObligations` uses only `clue.description` as the human-readable label in the error message. For clues where `description` is a content-rich phrase (e.g. `"the monogrammed handkerchief"`, `"the stopped clock face"`), this works — the retry directive contains actionable prose content. When `description` is a delivery-method genre label (`"Direct observation"`, `"Hearsay"`, `"Written record"`), the error message contains no actionable narrative content — the model cannot infer from it *what specific thing* to write about.

The fix is not to weaken the validator (which is accurate) but to enrich the error string with the clue's `pointsTo` field, which carries the investigative significance and is more likely to contain prose-matchable content.

---

## Error B — duplicate `"Direct observation"` error on each attempt

### What is emitted

Each of attempts 1–3 reports exactly two copies of the same error:

```
- Chapter 3: clue evidence "Direct observation" is absent. Include an on-page observation...
- Chapter 3: clue evidence "Direct observation" is absent. Include an on-page observation...
```

### Why it is duplicated

`validateChapterPreCommitObligations` loops over `ledgerEntry.requiredClueIds`. If two distinct clue IDs in that array both resolve to the same `clue.description` value (e.g., `"Direct observation"`), the error generation code produces two structurally identical error strings:

```typescript
const clueDesc = resolvedDesc ? `"${resolvedDesc}"` : `"${clueId}"`;
// ...
hardFailures.push(
  `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is absent. ${repair}`
);
```

Both use the same `resolvedDesc` → same `clueDesc` → identical error message. The retry-feedback mechanism, `buildRetryMicroPromptDirectives`, then emits one directive per error string. Because the strings are identical, the directive is repeated verbatim — providing no additional signal to the model and increasing noise in the prompt.

This is confirmed by attempt-4's audit, which shows three separate clues placed (`clue_1`, `clue_2`, `clue_3`) — so there are at least three distinct clue IDs in the ledger. Two of them share the `"Direct observation"` description.

### Impact on retry quality

Sending the same directive twice does no meaningful harm on its own, but it contributes to overall prompt bloat in the retry call. In a heavily penalty-loaded retry (clue × 2 + entropy), the directive section becomes long, and on attempt 4 the model appears to have responded to the directive overload by collapsing structure (see Error C).

---

## Error C — attempt-4 single-paragraph collapse (1 paragraph / 4867 chars)

### What changes on attempt 4

On attempt 4 the model resolves both the clue placement and the entropy issues:

```json
"required_clues_present": "clue_1: chapter 3 paragraph 1 | clue_2: chapter 3 paragraph 5 | clue_3: chapter 3 paragraph 3"
"early_observation_present": "description: chapter 3 paragraph 1 (first 25%) | present"
```

All clues are correctly placed and the early observation is marked present. The entropy error also disappears (a different opening style was chosen). However, the model delivers the entire chapter as a single JSON paragraph string of 4867 chars (~806 words), causing:

```
Chapter 3: Chapter 3 has only 1 paragraph(s) (Chapters should have at least 3+ meaningful paragraphs...)
Chapter 3: Chapter 3 contains an overlong paragraph block (4867 chars) (Split dense paragraph blocks...)
```

The chapter is 806 words vs ~1100 on prior attempts — also shorter despite a longer total response (5841 chars vs 5420–5532), because the JSON overhead includes the full embedded audit.

### Cause: directive overload → structure collapse

The attempt-3 retry prompt carries five simultaneous directives:

1. `REPAIR [opening_style]`: strict instruction about the first sentence  
2. `REPAIR [clue_obligation]`: two-paragraph block for the observation + inference (first 300 words)  
3. A second `REPAIR [clue_obligation]`: identical to #2 (from the duplicated error — see Error B)  
4. Clue validation error narrative  
5. Entropy violation narrative  

The `REPAIR [clue_obligation]` directive instructs the model to place a specific "two-paragraph block" in the first 300 words. The `REPAIR [opening_style]` directive forbids a general descriptive opening. Under this constraint set, the model on attempt 4:

- Correctly opens with a non-descriptive sentence (entropy pass)
- Correctly embeds the observation + inference in the first paragraph (clue pass)
- Collapses the rest of the chapter into the same paragraph block rather than splitting prose across multiple paragraphs

The collapse is a **load-shedding behaviour**: with multiple tight structural directives active simultaneously, the model prioritises the explicitly-stated constraints and abandons implicit prose formatting requirements (paragraph splitting). The paragraph-count and overlong-paragraph validators were not violated on attempts 1–3 because the model had free structural latitude; on attempt 4 the directive load consumed that latitude.

### Why this is a hard abort

`checkProseQuality` in `chapter-validator.ts` emits `severity: 'major'` for both:

- `paragraphs.length < 3` → "only 1 paragraph(s)"
- `maxParagraphLength > 2400` → "overlong paragraph block (4867 chars)"

Both are classified as `major` violations and are therefore included in the `hardErrors` set in `evaluateCandidate`. Attempt 4 was the last attempt — the chapter generation fails with a pipeline abort.

---

## Relationship between the three errors

```
A (retry directive carries genre label — model can't interpret what to write)
  ↓ clue genuinely absent on attempts 2 and 3, same error emitted twice each time
B (duplicate identical error strings)
  ↓ directive repeated twice × entropy directive = 5 constraints on attempt 4
C (structure collapse under directive overload)
```

Error A is the origin. Without A, attempts 1–3 would pass (the model would receive actionable prose content to write), the duplicate error would not appear, and attempt 4's structure collapse under directive overload would never occur.

---

## Solutions

### Error A: Enrich the retry error string with `clue.pointsTo` content

The validator is correct — do not weaken it. The fix is in how the error string is constructed in `validateChapterPreCommitObligations`. Currently the error carries only `clue.description` as the human-readable label. When `description` is a delivery-method genre label, the retry directive has no actionable narrative content.

**A1 — Append `pointsTo` to the error string when description is a genre label**

In `validateChapterPreCommitObligations`, when building the absent-clue error push, also include `clue.pointsTo` if it is non-empty and distinct from `description`:

```typescript
const clueDesc = resolvedDesc ? `"${resolvedDesc}"` : `"${clueId}"`;
const pointsToHint = clue?.pointsTo?.trim();
const extraHint = pointsToHint && pointsToHint !== resolvedDesc
  ? ` (this clue reveals: ${pointsToHint})`
  : '';

hardFailures.push(
  `Chapter ${ledgerEntry.chapterNumber}: clue evidence ${clueDesc} is absent.${extraHint} ${repair}`
);
```

This propagates directly into `buildRetryMicroPromptDirectives` → `extractQuoted()` and the directive text, because the retry builder operates on raw error strings. The model now receives a directive like:

```
REPAIR [clue_visibility]: chapters 3 are missing: Direct observation.
Near the beginning of the chapter:
• Paragraph 1: A character directly observes or discovers the missing evidence.
  Be specific and sensory — describe what is seen, touched, or heard.
  Include any exact required phrase verbatim.
...
```

With the `(this clue reveals: ...)` suffix present in the clue-obligation-failures section, the model understands the investigative significance and is more likely to write prose that contains the expected tokens.

**A2 — Upstream fix: Agent 4/5 should populate `description` with observable content, not delivery method** *(long-term)*

When Agent 5 writes `ClueDistributionResult`, `description` should be the *observable, specific thing the detective notices* (e.g. `"the study clock stopped at 10:10 PM"`) and `delivery_method` from the CML mapping should remain a separate field. This keeps the validator's token-match reliable for all clues without requiring special-case handling.

---

### Error B: Deduplicate identical retry error strings

In `buildRetryMicroPromptDirectives` and in the clue-absent directive block, deduplicate error strings before building directives:

```typescript
const uniqueClueAbsentErrors = [...new Set(clueAbsentErrors)];
```

This prevents sending the same repair instruction twice. The deduplication should also happen at the `hardFailures` accumulation point in `validateChapterPreCommitObligations` — if two clue IDs share the same description AND the same chapter, a single combined error message is more useful than two identical ones.

---

### Error C: Prevent single-paragraph collapse under directive load

**C1 — Add explicit paragraph-structure reminder to retry prompt**

When the retry prompt carries ≥ 3 active directive blocks (clue + entropy + any other), append a structural guardrail that is always emitted:

```
STRUCTURAL REMINDER: Output the chapter as multiple separate paragraph strings in the JSON
"paragraphs" array. Each paragraph is a separate array element. Do NOT put the entire chapter
in one paragraph element. Aim for 5–8 paragraphs of roughly equal length.
```

**C2 — Post-generation deterministic paragraph splitting**

In the prose extraction layer, before committing a chapter, detect the `paragraphs.length === 1 && paragraphs[0].length > 2400` case and apply sentence-boundary paragraph splitting deterministically:

```typescript
function splitOverlongParagraph(text: string, maxChars = 2400): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text];
  const paragraphs: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChars && current.length > 0) {
      paragraphs.push(current.trim());
      current = '';
    }
    current += sentence;
  }
  if (current.trim()) paragraphs.push(current.trim());
  return paragraphs;
}
```

This is a **deterministic safety net** that fires before the chapter is presented to the validators. It guarantees the paragraph-count check and overlong-paragraph check never fail due to a formatting collapse, without wasting an attempt.

**C3 — Deduplicate clue directives before building prompt** (overlaps with B)

Deduplicating identical directives (Error B fix) directly reduces the directive load seen by attempt 4, reducing the probability of the model collapsing structure.

---

## Ch19 Pipeline Abort — Late-Chapter Entropy Exhaustion and Sensory-Grounding Regression (Errors D and E)

### Overview

A follow-on run of a 19-chapter story surfaces two further compounding failures. Chapters 11–18 each exhaust all four retry attempts on the entropy check before being accepted via bypass (no abort). Chapter 19 fails all four attempts and aborts the pipeline — the run does not complete.

The root mechanisms extend directly from patterns documented above: retry directive loading degrades quality that was passing before the directive arrived.

| # | Error | Chapters affected | Outcome |
|---|-------|-------------------|---------|
| D | Late-chapter entropy threshold (0.78) structurally unreachable once the prior window is dominated by `general-descriptive` entries; model ignores opening-style directive | 11–18 | Bypass fires on attempt 4; accepted with warning; ~24 wasted LLM calls |
| E | Entropy retry directive on attempt 3 causes model to change opening style on attempt 4 — new opening loses sensory-grounding markers; `isEntropyOnlyFailure` blocked | 19 | Pipeline abort (attempt 4/4; two hard failures) |

---

## Error D — Entropy threshold 0.78 structurally unreachable; model ignores REPAIR [opening_style]

### What the log shows

From Ch11 onwards, every chapter triggers the entropy warning on every attempt until the bypass fires:

```
opening-style entropy too low (0.59 < 0.78). Vary chapter openings and avoid repeated style buckets.
```

The entropy value is consistently **0.59** across all retries for Ch11–Ch18. Retrying does not change it.

### Why the value is fixed

The entropy is computed over a sliding window:

```typescript
const openingWindow = [
  ...priorOpeningStyles.slice(-entropyConfig.opening_styles_prior_window),   // last 6 accepted chapters
  ...candidateOpeningStyles,                                                   // current batch (1 chapter)
].slice(-entropyConfig.opening_styles_total_window);                          // cap at 8
```

With `opening_styles_prior_window: 6` and `opening_styles_total_window: 8`, the window for a single-chapter batch is the last **6 accepted styles** plus **1 current** = 7 elements.

If the prior 6 accepted chapters contain 4 `general-descriptive` and 2 other buckets, and the current chapter is again `general-descriptive`:

```
window = [gd, gd, gd, gd, X, Y, gd]  →  [5 gd, 2 non-gd]
Shannon entropy (nats) = -(5/7 × ln(5/7) + 2/7 × ln(2/7)) = 0.598 ≈ 0.59
```

The REPAIR [opening_style] directive tells the model to use one of five named alternative styles on the next attempt. However, the model generates another `general-descriptive` opening on every retry. The directive is present and phrased correctly, but the model deprioritises first-sentence format when balancing competing requirements (clue placement, atmosphere grounding, sensory markers, word count). The window's distribution therefore does not change between attempts.

**Structural unfixability at 0.78:** To reach 0.78 with a 7-element window and the current chapter being `general-descriptive`, the prior 6 would need only 3 `general-descriptive` entries. Once earlier chapters lock in their styles, this cannot be achieved by retrying the current chapter. The threshold penalises chapters not for what the current chapter does, but for the accumulated pattern of all prior chapters.

The entropy bypass (`isEntropyOnlyFailure && attempt >= maxBatchAttempts`) correctly saves Ch11–Ch18 from aborting, but consumes three LLM calls per chapter before doing so (4 attempts × 8 chapters ≈ 24 wasted calls).

### Root cause

`late_threshold: 0.78` overshoots the value achievable by single-chapter retries when the window is already dominated by `general-descriptive` entries. The `mid_threshold: 0.70` reflects the practical ceiling with moderate prior diversity. By escalating further to 0.78 for chapters > 10, the check becomes more likely to trigger as a run grows longer — the opposite of the intended effect.

---

## Error E — Ch19 attempt-4 compound failure: opening-style directive causes sensory-grounding regression

### What the log shows

Attempts 1–3 for Ch19 fail with a single error — entropy (0.00 and 0.59 < 0.78). Sensory grounding passes on all three. On attempt 4, **both errors appear simultaneously**:

```
[Agent 9] Batch ch19 validation failed (attempt 4/4):
  - Chapter 19: Chapter 19 opening block has weak sensory grounding (1 sensory markers found)
    (Include at least two sensory cues (sound/smell/tactile/visual) in the opening block)
  - Template linter: opening-style entropy too low (0.59 < 0.78). Vary chapter openings
    and avoid repeated style buckets.
```

Because `isEntropyOnlyFailure` requires ALL batch errors to be entropy:

```typescript
const isEntropyOnlyFailure =
  batchErrors.every((error) => error.startsWith("Template linter: opening-style entropy too low"));
```

The sensory-grounding `severity: 'major'` error (pushed into `hardErrors` by `evaluateCandidate`) blocks the bypass. The pipeline aborts on the last chapter of a 19-chapter story.

### Why attempt 4 introduces a failure that attempts 1–3 did not

On attempt 3, REPAIR [opening_style] is appended to the retry prompt. On attempt 4, the model follows this directive and changes its opening sentence to a non-`general-descriptive` style. The new opening (e.g., a character-action or temporal-subordinate sentence) discards the naturally sensory-descriptive words that `general-descriptive` openers carry by default (e.g., "The cold wind swept through...", "The dim corridor lay silent..."). The sensory-marker count drops from ≥2 to 1.

The `weak sensory grounding` check in `chapter-validator.ts` counts specific vocabulary terms across the opening block (first two paragraphs). A `general-descriptive` opening naturally contains atmosphere/sensory words; when the model substitutes "Constable Higgs crossed the threshold into the parlour" (character-action), those naturally-sensory words disappear.

This is the same structural pattern as **Error C** from the original ANALYSIS_11: a directive that repairs one failing check inadvertently degrades a check that was previously passing. Here, directive compliance in one dimension (opening style) causes regression in another (sensory grounding). The entropy warning would have been bypassed — but the bypass is blocked because a second hard failure is now present.

### Relationship between Errors D and E

```
D (entropy threshold 0.78 unreachable; model ignores directive on Ch11–Ch18)
  ↓ bypass saves Ch11–Ch18, but directive fires again on attempt 3 for Ch19
E (opening-style directive on attempt 3 triggers sensory regression on attempt 4)
  ↓ non-entropy hard error present; bypass cannot fire; pipeline abort on Ch19
```

Error D is the necessary precondition. If the entropy threshold were reachable or the directive were not emitted on the final attempt, Error E could not occur.

---

## Solutions

### Error D: D1 — Cap `late_threshold` at 0.70

In `apps/worker/config/generation-params.yaml`, reduce `late_threshold` to match `mid_threshold`:

```yaml
# was: late_threshold: 0.78
late_threshold: 0.70
```

Rationale: The 0.70 mid-threshold already enforces meaningful style diversity. The escalation to 0.78 was intended to tighten quality for longer stories but overshoots the achievable window distribution under realistic model behaviour. With `late_threshold: 0.70`, the entropy check remains active and meaningful throughout the run without consuming all four retry attempts — it becomes a productive check rather than one that always hits the bypass.

---

### Error E: E2 — Suppress REPAIR [opening_style] on the final attempt

`buildRetryMicroPromptDirectives` is a nested function inside `buildEnhancedRetryFeedback`, which receives `maxAttempts` via its parameter list. The nested function's `attemptNum` parameter corresponds directly to the outer `attempt` variable.

On the final attempt (`attemptNum >= maxAttempts`), the entropy bypass will fire anyway if entropy is the only error — the directive cannot help because there are no further attempts after this one. Worse, as shown above, it actively causes regression by mandating a structural change to the opening sentence that strips sensory vocabulary.

**Change in `buildRetryMicroPromptDirectives`:** gate the entropy directive on `attemptNum < maxAttempts`:

```typescript
// Before:
const entropyError = rawErrors.find((e) => /opening-style entropy too low/i.test(e));
if (entropyError) {
  directives.push(`REPAIR [opening_style]: ...`);
}

// After:
const entropyError = rawErrors.find((e) => /opening-style entropy too low/i.test(e));
if (entropyError && attemptNum < maxAttempts) {
  directives.push(`REPAIR [opening_style]: ...`);
}
```

On the final attempt, entropy-only failures are accepted by bypass; entropy-plus-other-failure batches are aborted regardless. In both cases the directive provides no benefit. Suppressing it on the last attempt removes the regression risk without affecting acceptance behaviour.
