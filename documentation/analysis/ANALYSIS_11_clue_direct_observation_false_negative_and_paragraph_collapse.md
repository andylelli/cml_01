# ANALYSIS_11: Clue "Direct Observation" False-Negative; Duplicate Clue Error; Attempt-4 Single-Paragraph Collapse

## Overview

Three interacting failure modes in the same Ch3 run, all four attempts failed, aborting the chapter:

| # | Error | Attempts affected | Outcome |
|---|-------|-------------------|---------|
| A | Clue evidence `"Direct observation"` is absent (validator false-negative) | 1, 2, 3 | Hard fail — clue check blocks acceptance |
| B | Same error emitted twice per attempt | 1, 2, 3 | Retry directive over-repeated; no extra signal |
| C | Attempt 4 delivers all prose as one paragraph block (4867 chars, 806 words) | 4 | Hard fail — paragraph structure checks block acceptance |

---

## Error A — `clue evidence "Direct observation" is absent` (validator false-negative)

### What the model produces

The model's own audit self-check (from the diagnostic `raw tail`) reads:

```json
"required_clues_present": "clue_1: chapter 3 paragraph 1 | clue_2: chapter 3 paragraph 5 | clue_3: chapter 3 paragraph 3"
"early_observation_present": "clock in the study shows the time as 10:10 PM: chapter 3 paragraph 1 | absent"
```

On attempts 1–3 `early_observation_present` ends with `| absent` — the model self-reports that the observation is missing. Yet the required_clues audit lists placement locations for all three clues. The external validator independently confirms the clue IS absent after prose extraction.

### What the validator actually checks

`chapterMentionsRequiredClue` tokenises the clue's `description` field via `tokenizeForClueObligation`:

```typescript
const tokens = Array.from(new Set([
  ...tokenizeForClueObligation(String(clue.description ?? "")),
  ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
])).slice(0, 10);
```

`tokenizeForClueObligation("Direct observation")` produces:

- `"direct"` — kept (length 6, not a stopword)
- `"observation"` — kept (length 11, not a stopword)

Total tokens: 2. Required to match: `Math.max(2, Math.ceil(2 × 0.4)) = 2` — **both tokens must be present** in the chapter text (directly or via stem stripping).

`tokenMatchesText("observation", text)` strips the `"ation"` suffix → root `"observ"` (6 chars ≥ 4) → matches `"observed"`, `"observing"`, `"observable"` etc.

`tokenMatchesText("direct", text)` → matches `"directly"`, `"directed"`, `"direction"`.

### Why this fails

The clue description `"Direct observation"` is a **delivery-method genre label**, not the narrative content of the clue. The actual content of this clue, per the audit trail, is:

> *clock in the study shows the time as 10:10 PM*

When the model writes prose for this clue it naturally writes something like:

> *"The clock on the study mantelpiece stood at ten past ten."*

The prose contains neither `"direct"` nor any stem of `"observ"`. The validator's token-match check requires both tokens from the description, but the description describes the delivery *method*, not the clue *content*. The two systems are misaligned: the validator was designed for content-rich descriptions like `"the stopped clock face"` or `"the monogrammed handkerchief"`, not genre labels like `"Direct observation"` or `"Hearsay"`.

### Why the retry also fails (attempts 2 and 3)

The retry directive injected into the prompt is:

```
Chapter 3: clue evidence "Direct observation" is absent.
Include an on-page observation of "Direct observation" in the first quarter of the chapter,
followed immediately by an explicit inference paragraph.
```

This directive literally tells the model to include "Direct observation" as prose — a meaningful phrase in an English sentence. The model interprets this as a stylistic instruction ("write using the technique of direct observation") rather than as a magic token it must embed literally. Even if the model correctly interprets the clue, the validator still requires both `"direct"` and `"observ*"` to appear. In a realistic prose sentence, "directly observed" would satisfy the match — but the retry directive doesn't tell the model to use those specific words.

Attempts 2 and 3 produce essentially identical chapter word counts (1102 / 1099 words) and identical diagnostics — the model is regenerating in the same pattern with the same failure.

### Deeper root cause

The clue description field in the CML schema is being populated with delivery-method labels (`"Direct observation"`, `"Hearsay"`, `"Written record"` etc.) in addition to — or instead of — narrative content descriptions. The validator was written assuming descriptions contain the *observable content* of the clue (the thing the detective sees/hears/reads). When the description is a label rather than content, the token-match produces false negatives.

The `clueId`-literal fallback check (`lowered.includes(clueId.toLowerCase())`) would only save this if the clue's ID happened to be a prose word, which it typically is not.

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
A (false-negative)
  ↓ triggers identical-string retry directive × 2
B (duplicate error)
  ↓ directive sent twice × clue × entropy = 5 constraints on attempt 4
C (structure collapse under directive overload)
```

Error A is the origin. Without A, attempts 1–3 would pass (the model is correctly placing the clue content), and attempt 4's collapse would never occur.

---

## Solutions

### Error A: Fix the token-match false-negative for delivery-method clue descriptions

**A1 — `pointsTo` and `delivery_method` as tiebreaker content source**

The clue object has a `delivery_method` field (e.g., `"Direct observation"`) and typically a `pointsTo` field containing the actual investigative significance (e.g., `"cannot be trusted to indicate the time of death"`, `"the victim knew their attacker"`). The validator already includes `pointsTo` tokens:

```typescript
tokenizeForClueObligation(String(clue.pointsTo ?? ""))
```

If `pointsTo` is populated with meaningful content, adding its tokens raises the total pool so that the 40% threshold is more easily satisfied even if `description` tokens are sparse. Review whether `pointsTo` fields in practice contain content-rich tokens.

**A2 — Detect delivery-method-only descriptions and skip token-match**

Before running the token-match, check whether `description` consists only of a known delivery label:

```typescript
const DELIVERY_METHOD_LABELS = new Set([
  'direct observation', 'hearsay', 'written record', 'physical evidence',
  'deduction', 'inference', 'testimony', 'documentary',
]);

function isDeliveryMethodLabel(desc: string): boolean {
  return DELIVERY_METHOD_LABELS.has(desc.trim().toLowerCase());
}
```

If the description is a delivery label, skip the description's token contribution and rely entirely on `pointsTo` tokens. If `pointsTo` is also empty/uninformative, emit a **warning** rather than a hard failure (i.e., downgrade to `preferredMisses`).

**A3 — Downgrade unresolvable clue descriptions to preferred miss**

When `tokenizeForClueObligation` produces fewer than 3 meaningful tokens from the combined description + pointsTo, the check is too weak to be reliable. In these cases downgrade the violation from `hardFailures` to `preferredMisses`:

```typescript
const tokens = Array.from(new Set([
  ...tokenizeForClueObligation(String(clue.description ?? "")),
  ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
])).slice(0, 10);

if (tokens.length < 3) {
  // Description too sparse to check reliably — warn, don't hard-fail
  preferredMisses.push(`Chapter ${ledgerEntry.chapterNumber}: cannot verify clue ${clueDesc} — description too sparse to match in prose`);
  continue;
}
```

**A4 — Enrich `delivery_method` clue descriptions in Agent 4 or 4b prompt**

The longer-term fix is upstream: when Agent 4 maps clues to scenes and writes the `clueDistribution`, ensure `description` is always populated with a prose-matchable content phrase (what the detective observes) and the delivery method is stored in a **separate** `delivery_method` or `type` field. This is a prompt/schema change.

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
