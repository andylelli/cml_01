# PROMPT_09 Analysis: Implementation Plan
## Run `run_35e536ce` — The Timeless Deception

Based on the detailed report in the user analysis. All items traced to exact file locations and function names.

---

## Root cause confirmed (matches PROMPT_08 pattern)

`clue_clock_time` (or any `clue_to_scene_mapping` entry whose `clue_id` has no matching entry in `clueDistribution.clues`) falls through to the bare fallback:

```
• clue_clock_time — include as concrete observable evidence on-page.
```

This is emitted by `buildChapterObligationBlock` (line 921 of `agent9-prose.ts`) when `clueMap.get(clueId)` returns undefined. The model gets an opaque internal ID with no prose-shaping guidance, and all 4 retry attempts fail identically.

The `delivery_method` field already exists on `clue_to_scene_mapping` entries in the CML (e.g., `"Direct observation of the clock."`). It is never read by any prompt-building code. That is where the description should come from.

---

## Change set plan

### P0 — Fix the fallback in `buildChapterObligationBlock`

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildChapterObligationBlock` (line 848)

**Problem:** When `clueMap.get(clueId)` is `undefined`, the fallback on line ~921:
```ts
lines.push(`    • ${clueId} — include as concrete observable evidence on-page.`);
```
emits just the raw ID.

**Fix:** Build a local `deliveryMethodMap` from `cmlCase.prose_requirements.clue_to_scene_mapping` inside `buildChapterObligationBlock`. When `clueMap.get(clueId)` is undefined, look up the mapping entry and use its `delivery_method` (if present) as the description, and infer `earlyFlag` from `act_number`/`scene_number` context.

```ts
// Build delivery-method fallback from clue_to_scene_mapping
const deliveryMethodMap = new Map<string, { delivery_method?: string; act_number?: number; scene_number?: number }>(
  ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
    .filter((e: any) => e?.clue_id)
    .map((e: any) => [String(e.clue_id), e]),
);
```

Then in the per-clue loop, replace the fallback branch:
```ts
// BEFORE (opaque):
lines.push(`    • ${clueId} — include as concrete observable evidence on-page.`);

// AFTER (prose-facing):
const mapping = deliveryMethodMap.get(clueId);
const fallbackDesc = mapping?.delivery_method
  ? mapping.delivery_method.trim()
  : `observable evidence relevant to the investigation`;
const isEarlyMapping = (mapping?.act_number === 1) || false; // Act 1 = early
const earlyFlagFallback = isEarlyMapping
  ? ' ⚠ EARLY PLACEMENT — write this in the first 25% of the chapter'
  : '';
lines.push(`    • ${fallbackDesc} [${clueId}]${earlyFlagFallback}`);
lines.push(`      Points to: what this observation reveals about the time or circumstances of the crime.`);
if (isEarlyMapping) {
  lines.push(`      ↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.`);
}
```

**Acceptance:** `buildChapterObligationBlock` must never emit a raw `clueId` as the primary description when `delivery_method` is available.

---

### P0 — Fix `validateChapterPreCommitObligations` error messages

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `validateChapterPreCommitObligations` (line 288)

**Problem:** When `clue` is `undefined` (no distribution entry), `clueDesc` = `"clue_early_1"`. The hard failure message contains only the raw ID. The retry builder (`buildRetryMicroPromptDirectives`) then extracts `"clue_early_1"` from that error string and echoes it back to the model.

**Fix:** Extend `ChapterRequirementLedgerEntry` to carry per-clue prose context:

```ts
// Add to ChapterRequirementLedgerEntry interface:
clueObligationContext?: Array<{
  id: string;
  description?: string;      // from Clue.description or delivery_method
  placement?: string;        // 'early' | 'mid' | 'late' or undefined
  deliveryMethod?: string;   // raw delivery_method from clue_to_scene_mapping
}>;
```

**In `buildChapterRequirementLedger`** (line ~220): for each required clue ID, resolve the description from `clueDistribution.clues` first, then fall back to `clue_to_scene_mapping.delivery_method`:

```ts
const clueObligationContext = requiredClueIds.map((id) => {
  const distClue = (clueDistribution?.clues ?? []).find(c => c.id === id);
  const mappingEntry = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
    .find((e: any) => String(e?.clue_id) === id);
  return {
    id,
    description: distClue?.description ?? mappingEntry?.delivery_method ?? undefined,
    placement: distClue?.placement ?? (mappingEntry?.act_number === 1 ? 'early' : undefined),
    deliveryMethod: mappingEntry?.delivery_method ?? undefined,
  };
});
```

**In `validateChapterPreCommitObligations`**: replace ID-only lookup with context lookup:

```ts
// BEFORE:
const clue = (clueDistribution?.clues ?? []).find((e) => String(e?.id || '') === clueId);
const clueDesc = clue?.description ? `"${clue.description.trim()}"` : `"${clueId}"`;

// AFTER:
const clue = (clueDistribution?.clues ?? []).find((e) => String(e?.id || '') === clueId);
const ctx = (ledgerEntry.clueObligationContext ?? []).find(c => c.id === clueId);
const resolvedDesc = clue?.description ?? ctx?.description ?? null;
const clueDesc = resolvedDesc ? `"${resolvedDesc.trim()}"` : `"${clueId}"`;
const resolvedPlacement = clue?.placement ?? ctx?.placement ?? null;
```

This ensures the error message contains the `delivery_method` text (`"Direct observation of the clock."`) instead of `"clue_clock_time"`, which causes the retry builder to emit prose-facing repair language.

---

### P0 — Fix checklist for unresolved clue IDs

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildProsePrompt`, checklist section (line ~1597)

**Problem:** Early-clue checklist items are only emitted when `clue?.placement === 'early'`. For unresolved IDs (no distribution entry), `clue` is `undefined` and no checklist item is generated.

**Fix:** After building `earlyClueCheckItems` from the distribution, add a second pass using `clueObligationContext` from the ledger:

```ts
// After existing earlyClueCheckItems loop, add:
for (const ctx of (ledger.clueObligationContext ?? [])) {
  if (ctx.placement === 'early' && !clueMap.has(ctx.id)) {
    // Unresolved ID with early placement from mapping
    const desc = ctx.description ?? ctx.deliveryMethod ?? ctx.id;
    earlyClueCheckItems.push(
      `□ Chapter ${chapterNumber}: "${desc}" — place this observation in the first 25% of the chapter, followed immediately by an explicit inference or suspicion paragraph.`,
    );
  }
}
```

---

### P1 — Raise `estimatedWordCount` in sanitized scene output

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `sanitizeScenesCharacters` or the scene-JSON pipeline in `buildProsePrompt`

**Problem:** Scene outlines from agent7 carry `estimatedWordCount` of ~800–1000 for chapters where the generation target is 1450–1500. This acts as a model-level planning anchor that pulls output length down even when the checklist says higher.

**Fix:** In the function that serialises scenes into the user-prompt JSON body, override `estimatedWordCount` to `chapterTargetWords` when it is below that value:

```ts
// When constructing sanitizeScenesCharacters output or the JSON passed to the user message:
const sceneWithAdjustedEstimate = {
  ...scene,
  estimatedWordCount: Math.max(
    typeof scene.estimatedWordCount === 'number' ? scene.estimatedWordCount : 0,
    chapterTargetWords,
  ),
};
```

`chapterTargetWords` is already `preferredWords + 200` (line 1521). This aligns the outline estimate with the actual generation target. The validator minimum becomes less relevant because the model is planning from the correct number.

---

### P1 — Emit concrete two-paragraph block for early-placement clues in initial prompt

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildChapterObligationBlock` (line 848)

**Problem:** For early-placement clues, the current obligation block adds:
```
⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
↳ In the immediately following paragraph, include an explicit inference or suspicion that relates to what was just observed.
```
This is present but abstract. The analysis shows this is still insufficient: the model conflates the early-placement clue with the same fact it already rendered for a different clue ID.

**Fix:** For any clue with `placement === 'early'` (or inferred early from the mapping), after the `↳` inference line, emit a concrete two-paragraph structure block:

```ts
if (clue.placement === 'early' || isEarlyMapping) {
  lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear before the 25% mark):`);
  lines.push(`         Paragraph 1: The POV character physically approaches or directly observes this evidence.`);
  lines.push(`           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).`);
  lines.push(`         Paragraph 2 (immediately following): The detective or POV character explicitly reasons`);
  lines.push(`           about what this evidence implies — who it implicates, why it may be unreliable,`);
  lines.push(`           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.`);
}
```

This moves the two-paragraph structural requirement into the initial run, so it does not depend on retries to provide this guidance.

---

### P1 — Remove bare retry header lines that add emotional noise

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildRetryMessage` (the outer function at line ~2270 that builds `feedback`)  

**Problem:** The retry banner currently says:
```
Attempt N/M — chapters X — N validation issue(s) to resolve:
```
And later:
```
Regenerate chapters X with the above corrections applied.
```

These lines are acceptable. There is no "this is your last chance before generation fails" line in the current P1 code. Confirm this is not present. If a prior version added it, remove it. The repair content in `buildRetryMicroPromptDirectives` already says `FINAL MANDATORY BLOCK` for attempt 4+.

**Verify:** Check lines 2270–2340 in `agent9-prose.ts` to confirm neither `"last chance"` nor `"Do NOT partially fix"` appears in the feedback string outside of the `REPAIR [...]` sections. The `QUALITY ERRORS` section (line ~2296) should not include emotional escalation language. If present, remove it.

---

### P2 — Per-attempt failure diagnostics

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Location:** The retry loop, near line ~2640–2700 (the `validateChapterPreCommitObligations` call and hard-failure branching)

**Problem:** Attempt 4 in PROMPT_08 collapsed to 693 words (below the 704 hard floor), which is suspicious given attempts 1–3 were climbing. No raw response / extraction data is logged to disambiguate a genuine generation failure from a parse/extraction failure.

**Fix:** After each failed attempt, log the following to `validationDetails.failureHistory` or to a new `attemptDiagnostics` array:

```ts
interface AttemptDiagnostic {
  attempt: number;
  chapterRange: string;
  rawResponseChars: number;        // raw model response string length
  parsedJsonSuccess: boolean;      // did JSON.parse / jsonrepair succeed?
  extractedChapterChars: number;   // paragraphs[].join('').length after extraction
  extractedWordCount: number;      // countWords() on extracted content
  lockedPhrasePresent: boolean[];  // one per lockedFact — was phrase found in output?
  lockedPhraseInEarlyQuarter: boolean[]; // was it found in first 25% of paragraphs?
  validationErrors: string[];
}
```

Log this for every failed attempt (not just final). Store in `ProseGenerationResult.validationDetails`.

This immediately answers the PROMPT_08/09 question: "Did the model produce short output, or did the parser lose content?"

---

### P2 — Refactor audit schema from ID-based to condition-based

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Location:** `developerWithAudit` string construction (line ~1545)

**Problem:** Current audit field:
```json
"required_clues_present": "clue_id: chapter N paragraph M | absent"
```
Encourages the model to think in internal IDs. For `clue_early_1` (or `clue_clock_time`) with no distribution entry, the model has no prose-grounded concept to audit against.

**Fix:** Generate the audit keys dynamically from the resolved obligation context. For each required clue with a `description`/`deliveryMethod`, emit a named condition key:

```ts
// Build audit condition keys from clueObligationContext
const auditKeys = resolvedObligations.map(ctx => {
  const key = ctx.deliveryMethod
    ? slugify(ctx.deliveryMethod)     // e.g. "direct_observation_of_the_clock"
    : slugify(ctx.description ?? ctx.id);
  return `    "${key}": "present in paragraph N | absent"`;
}).join(',\n');
```

Replace the static `"required_clues_present"` line with the dynamic keys:

```ts
// BEFORE:
'  "required_clues_present": "clue_id: chapter N paragraph M | absent"\n'

// AFTER:
`  "early_clock_observation": "present in paragraph N | absent",\n` +
`  "clock_time_phrase_present": "present in paragraph N | absent",\n` +
`  "clock_manipulation_inference_present": "present in paragraph N+1 | absent"\n`
```

For a general implementation, generate the key names from each `clueObligationContext` entry's description slug.

---

### P2 — Verify prompt budget tiers protect clue obligations

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Function:** `buildPromptContextBlocks` (line 1086)

**Current state (verified):**
```ts
{ key: 'clue_descriptions', content: sections.clueDescriptionBlock, priority: 'critical' },
```
`clue_descriptions` is already `critical` — it is never dropped. However, when the clue ID has no distribution entry, `buildClueDescriptionBlock` returns an empty string for that clue (it only iterates `cluesRevealed` and looks up the distribution). The block may be entirely empty for chapters where all required clues come only from `clue_to_scene_mapping`.

**Fix:** After P0 changes to `buildChapterObligationBlock` (which now uses `delivery_method`), also update `buildClueDescriptionBlock` to include mapping-only clues:

```ts
// In buildClueDescriptionBlock, after iterating scene.cluesRevealed:
// Add pass for mapping-only clues (those in clue_to_scene_mapping but not cluesRevealed)
const mappingEntries = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
  .filter((e: any) => 
    Number(e?.act_number) === Number(scene?.act) &&
    Number(e?.scene_number) === Number(scene?.sceneNumber) &&
    !relevantClues.some(c => c.id === String(e?.clue_id))
  );
for (const entry of mappingEntries) {
  if (entry?.delivery_method) {
    lines.push(`\n• [${entry.clue_id}] ${entry.delivery_method}`);
    lines.push(`  Category: structural | Placement: early (Act ${entry.act_number})`);
    lines.push(`  Points to: what this observation reveals about the time or circumstances of the crime.`);
  }
}
```

Note: `buildClueDescriptionBlock` does not currently receive `cmlCase`. This requires adding `cmlCase` as a parameter — a small signature change, already passed at the `buildProsePrompt` call site.

---

## Acceptance criteria

| # | Criterion | Verified by |
|---|-----------|-------------|
| 1 | `buildChapterObligationBlock` never emits a raw clue ID as the primary description when `delivery_method` is available in `clue_to_scene_mapping` | Unit test: supply a clue_id with no distribution entry but with delivery_method; assert obligation text contains delivery_method, not the ID |
| 2 | `validateChapterPreCommitObligations` error messages use `delivery_method` text (not raw ID) when clue is absent from distribution | Unit test: supply ledger with `clueObligationContext`; assert hard failure contains delivery_method not raw ID |
| 3 | Checklist includes early-placement items for unresolved IDs when `delivery_method` indicates early/Act 1 placement | Unit test: verify checklist text contains delivery_method substring for unresolved early clue |
| 4 | Retry repair messages (attempt 2–4) reference delivery_method description, not raw ID | Follows from criterion 2: retry builder extracts description from error text |
| 5 | `estimatedWordCount` in serialized scene JSON is at least `chapterTargetWords` | Unit test or log inspection |
| 6 | Initial-run obligation block includes the mandatory two-paragraph structure note for early-placement clues | Unit test `buildChapterObligationBlock` with `placement === 'early'`; assert two-paragraph language present |
| 7 | Per-attempt diagnostics are present in `validationDetails` for each failed attempt | Integration test: force a clue miss; verify `attemptDiagnostics` has `rawResponseChars`, `parsedJsonSuccess`, `extractedWordCount` |
| 8 | No emotional escalation language ("last chance", "Do NOT partially fix") in the base retry feedback template | Code search: `grep -n "last chance\|Do NOT partially" agent9-prose.ts` returns no matches outside of the REPAIR block headers |

---

## File/function change index

| File | Function | Change |
|------|----------|--------|
| `packages/prompts-llm/src/agent9-prose.ts` | `buildChapterObligationBlock` | Add `deliveryMethodMap` from `clue_to_scene_mapping`; replace raw-ID fallback with prose-facing description |
| `packages/prompts-llm/src/agent9-prose.ts` | `ChapterRequirementLedgerEntry` (interface) | Add `clueObligationContext?: Array<{id, description?, placement?, deliveryMethod?}>` |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildChapterRequirementLedger` | Populate `clueObligationContext` for each required clue ID from distribution + mapping |
| `packages/prompts-llm/src/agent9-prose.ts` | `validateChapterPreCommitObligations` | Use `ctx.description ?? ctx.deliveryMethod` for `clueDesc` when `clue` is undefined |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildProsePrompt` (checklist) | Add second pass over `clueObligationContext` to emit early-placement checklist items for unresolved IDs |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildProsePrompt` (scene serialization) | Override `estimatedWordCount` to `chapterTargetWords` when below it |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildChapterObligationBlock` | Add mandatory two-paragraph structure note for all early-placement clues |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildClueDescriptionBlock` | Accept `cmlCase` parameter; include mapping-only clues (those in `clue_to_scene_mapping` but not `cluesRevealed`) |
| `packages/prompts-llm/src/agent9-prose.ts` | `buildProsePrompt` retry loop | Add `AttemptDiagnostic` logging per failed attempt |
| `packages/prompts-llm/src/agent9-prose.ts` | `developerWithAudit` string | Replace static `"required_clues_present"` with per-obligation condition keys from `clueObligationContext` |

---

## What is already implemented (do not re-implement)

The following were completed as P0/P1 in the previous session (PROMPT_08_ANALYSIS P0/P1):

- Escalating retry templates in `buildRetryMicroPromptDirectives` (attempt 2: concrete beats; attempt 3: Paragraph A/B; attempt 4: first-300-words mandatory block)
- `chapterTargetWords = preferredWords + 200` in `buildProsePrompt`
- Early-flag (`⚠ EARLY PLACEMENT`) + inference-paragraph guidance line in `buildChapterObligationBlock` for clues with `placement === 'early'` **when the clue IS found in the distribution**
- `critical` priority for `clue_descriptions` block in `buildPromptContextBlocks`

The gap this plan closes: **all of the above only activates when the clue ID has a distribution entry**. The `clue_clock_time` / `clue_early_1` pattern — where the ID is in `clue_to_scene_mapping` but NOT in `clueDistribution.clues` — bypasses every existing guard. This plan addresses exactly that path.

---

## Priority order

| Priority | Change | Estimated risk |
|----------|--------|----------------|
| P0 | `buildChapterObligationBlock` fallback fix | Low — localised fallback branch |
| P0 | `ChapterRequirementLedgerEntry` + `buildChapterRequirementLedger` extension | Low — additive field |
| P0 | `validateChapterPreCommitObligations` description resolution | Low — uses new ledger field |
| P0 | Checklist early-placement items for unresolved IDs | Low — additive loop |
| P1 | `estimatedWordCount` override in scene serialisation | Low — single Math.max |
| P1 | Mandatory two-paragraph structure note in initial obligation block | Low — additive text in existing early-placement branch |
| P1 | `buildClueDescriptionBlock` signature + mapping-only clue pass | Medium — adds parameter, changes call site |
| P2 | Per-attempt diagnostics (`AttemptDiagnostic`) | Medium — new data structure and logging |
| P2 | Audit schema condition keys | Low — string template change |

Start with all P0 changes (they are tightly coupled and must all ship together), then P1, then P2.

---

# Report: Prompt/validator mismatch in Agent9 prose generation, with implementation instructions

## Executive summary

The Chapter 3 failure is not primarily a "bad retry wording" problem. It is a prompt architecture problem:

- the model is being asked to satisfy an internal validator concept (`clue_early_1`) that is not expressed as a concrete narrative requirement
- the chapter-length target is misaligned across multiple prompt layers
- the retry prompts are too abstract and too repetitive
- the prompt is overloaded and partially truncated, which increases the chance that the most important Chapter 3 requirement gets lost

The run shows a stable pattern:

- Ch1 and Ch2 are "clean" but both underperform on density/grounding
- Ch3 fails all 4 times on the same missing clue
- word count rises a bit, but retries never become specific enough to repair the actual validator failure

This should be fixed in code by changing how requirements are represented and compiled into prompts.

---

## What the latest run proves

### 1) `clue_early_1` is the core failure, not a random miss

Across all 4 Chapter 3 attempts:

- `clue_early_1` is always missing
- `clue_1` and `clue_2` are narratively present in the outline and likely conceptually addressed
- retries do not repair the missing early clue

This strongly indicates that `clue_early_1` is not being understood by the model as a distinct prose obligation.

### 2) The model is likely conflating `clue_early_1` with `clue_1`

Prompt says:

- `clue_1`: the clock shows 11:10 PM
- `clue_2`: the clock was manipulated
- `clue_early_1`: direct observation of the stopped clock in Act 1, Scene 3

To the validator these are different requirements. To the prose model, `clue_early_1` looks like a duplicate or metadata wrapper around the same clock material.

So the model likely thinks: *"I already covered the clock clue"* — while the validator thinks: *"You did not perform the required early observation beat in the required form."*

### 3) The retries are not converting validator logic into prose logic

The retry messages say:

- missing required clue obligation for `clue_early_1`
- add an on-page clue observation moment
- add a detective processing line in separate paragraphs

That is still too indirect. The model needs concrete story instructions, such as:

- Beatrice crosses the library to the clock
- she looks at it directly
- the prose explicitly says it reads "ten minutes past eleven"
- in the next paragraph she explicitly reasons that it may have been manipulated and may mislead them

Without that, retries are just repeating validator language.

### 4) Length control is inconsistent across the prompt stack

The run shows conflicting length signals:

- system requirement: hard floor 704, preferred target 1300+, "1500 preferred"
- Chapter 1 outline estimate: 800
- Chapter 2 outline estimate: 800
- Chapter 3 outline estimate: 1000
- retry target: "raise to at least 1300"

This is incoherent from the model's perspective. The outline estimate is especially important because it acts like a planning anchor. If the scene says 1000, many models will generate around 800–1000 even if later text says 1300+.

### 5) Prompt budget pressure is real and probably hurting reliability

The system prompt shows: dropped guides, truncated sections, repeated accumulated constraints, heavy fixed token load.

This matters. The most important Chapter 3 requirement is currently expressed in one short line:

> `clue_early_1` must appear in Act 1, Scene 3 via Direct observation of the stopped clock

That line is easy for the model to underweight relative to all the surrounding style, continuity, anti-repetition, era-authenticity, morality, and schema instructions.

### 6) The audit schema is not helping enough

The output schema includes an audit object:

```
required_clues_present: clue_id: chapter N paragraph M | absent
```

But the prompt does not give the model enough concrete logic to self-audit `clue_early_1` successfully. The audit field likely reinforces the internal-ID framing instead of helping the model realize what exact paragraph pattern is required.

---

## Main problems to fix

### Problem A: Internal clue IDs are leaking directly into prose prompts

**Why this is bad**

IDs like `clue_early_1` are validator abstractions. They are meaningful to code, not to a prose generator.

The model should never be asked to "include `clue_early_1`." It should be asked to perform a narrative action.

**What to implement**

Introduce a prompt-compilation layer: validator uses internal IDs; prompt builder converts IDs into human-readable prose obligations.

**Required change**

For Chapter 3, do not emit:

```
Required clue IDs: clue_early_1, clue_1, clue_2
```

Instead emit something like:

```
In the first quarter of the chapter, Beatrice Barton must directly observe the stopped clock in the library.
During that observation, the text must explicitly state that it reads "ten minutes past eleven."
In the immediately following paragraph, Beatrice must explicitly reason that the clock may have been manipulated and may mislead them about the time of death.
```

That is what the model can act on.

---

### Problem B: Placement constraints are being mislabeled as clues

**Why this is bad**

`clue_early_1` is not actually a clue fact. It is a structural visibility rule: what is observed, by whom, when in the chapter, in what narrative form. This should be a separate type in your generation contract.

**What to implement**

Split "required clues" into at least these categories: `required_observations`, `required_facts`, `required_inferences`, `placement_constraints`.

**Example representation**

```json
{
  "required_observations": [
    {
      "id": "clock_direct_observation_early",
      "actor": "Beatrice Barton",
      "object": "stopped clock in the library",
      "must_occur_by": "first_25_percent"
    }
  ],
  "required_facts": [
    {
      "id": "clock_reads_11_10",
      "text_requirement": "\"ten minutes past eleven\""
    }
  ],
  "required_inferences": [
    {
      "id": "clock_may_be_manipulated",
      "description": "Beatrice explicitly reasons that the clock may have been manipulated and may mislead the time of death."
    }
  ]
}
```

Then compile that into prose-facing instructions.

---

### Problem C: The Chapter 3 initial prompt is too vague about the failing requirement

**Why this is bad**

The initial Chapter 3 prompt spends a lot of tokens on general quality and continuity, but the actual validator-critical requirement is under-specified.

**What to implement**

Make the initial Chapter 3 prompt more concrete than the retries. Do not wait until retry 2 to specify the structure.

**Required initial-run instruction**

Add a mandatory early two-paragraph clue block to the initial prompt:

- Paragraph 1: Beatrice physically approaches or studies the stopped clock in the library and directly observes it. That paragraph explicitly states the clock reads "ten minutes past eleven."
- Paragraph 2: In the immediately following paragraph, Beatrice explicitly reasons that the clock may have been manipulated and may mislead them about the time of death.

This should appear in the first quarter of the chapter. That one change likely fixes most of the `clue_early_1` failures.

---

### Problem D: The outline word-count estimate is sabotaging the validator target

**Why this is bad**

For Chapter 3:

- outline estimated word count = 1000
- validator preferred target = 1300
- system says 1500 preferred

The model is receiving contradictory planning signals.

**What to implement**

Use a single derived generation target:

```
generator_min_words = validator_preferred_min + buffer
```

Recommended buffer: +150 to +250 words.

**For this run:** if validator preferred minimum is 1300, generator target should be 1450–1500. Outline `estimatedWordCount` should also be 1450 or 1500, not 1000.

**Instruction to coder:** Whenever `estimatedWordCount < preferredTarget`, automatically raise it in the prompt-compiled scene plan.

---

### Problem E: Retry prompts are repetitive, emotional, and underspecified

**Why this is bad**

The retries currently: repeat "this is your last chance"; repeat the same validator error text; repeat generic quality advice; do not force the exact missing narrative structure.

This adds noise but not enough repair signal.

**What to implement**

Replace current retries with a strict escalation ladder.

**Attempt 2 repair prompt**

```
CRITICAL REPAIR FOR CHAPTER 3

Your previous output failed because the early clock clue was not explicit enough on-page and the chapter was too short.

Regenerate Chapter 3 with these mandatory repairs:

- In the first quarter of the chapter, include a paragraph in which Beatrice Barton physically goes to the stopped clock in the library and looks at it directly.
- In that paragraph, explicitly state that the clock reads "ten minutes past eleven".
- In the immediately following paragraph, Beatrice must explicitly say or think that the clock may have been manipulated and may mislead them about the time of death.
- These two paragraphs must be separate.

Length requirement:
- Make the chapter at least 1450 words.
- Expand using room detail, movement, reactions, pauses, and inference-relevant dialogue.
- Do not add filler recap.

Return valid JSON only.
```

**Attempt 3 repair prompt**

```
FINAL REPAIR PRIORITY FOR CHAPTER 3

The early clock clue is still not explicit enough and the chapter is still too short.

Regenerate Chapter 3 with this exact early structure:

Paragraph A:
- Beatrice Barton crosses the library to the stopped clock and examines it directly.
- The prose explicitly states that it reads "ten minutes past eleven".

Paragraph B:
- In the next paragraph, Beatrice explicitly reasons that the clock may have been tampered with or manipulated.
- She explicitly reasons that the displayed time may mislead them about the true time of death.

These two paragraphs must appear in the first quarter of the chapter.

Length requirement:
- Chapter must be at least 1450 words.
- Expand through action, gesture, silence, facial reactions, discomfort, challenge, and clue-relevant dialogue.

Return valid JSON only.
```

**Attempt 4 repair prompt**

```
MANDATORY LAST-CHANCE REPAIR FOR CHAPTER 3

Regenerate the full chapter. Rebuild it so these requirements are unmistakably present.

Within the first 300 words, include this two-paragraph clue block:

Paragraph 1 requirements:
- Beatrice Barton is in the library.
- She physically approaches or stands beneath the stopped clock.
- She looks at it directly.
- The narration or dialogue explicitly states that the clock reads "ten minutes past eleven".

Paragraph 2 requirements:
- Beatrice explicitly reasons that the clock may have been manipulated.
- She explicitly reasons that the displayed time may mislead them about the time of death.

Length requirement:
- The chapter content must be at least 1500 words.

Safe expansion:
- library atmosphere and sensory detail
- close inspection of room and clock
- Basil's discomfort
- Joan's questions
- Reginald's reactions
- pauses, silence, gesture, tension
- reasoning tied to the 10:30 PM noise and the misleading 11:10 display

Return valid JSON only.
```

---

### Problem F: The checklist is too generic

**Why this is bad**

Current pre-checklist asks mostly general questions: hard floor, locked phrase, allowed seasonal words, valid JSON. It does not explicitly ask: did Beatrice directly observe the clock early? did the text explicitly say "ten minutes past eleven"? is the inference in a separate next paragraph?

**What to implement**

Generate a chapter-specific checklist from the validator contract. For Chapter 3, it should explicitly include:

- the chapter opens in the library
- before major dialogue: 2+ sensory cues and 1+ atmosphere marker
- in the first quarter: Beatrice directly observes the stopped clock
- exact phrase "ten minutes past eleven"
- next paragraph contains explicit suspicion of manipulation / misleading time
- content length at least 1450 words

---

### Problem G: The audit schema needs to become prose-facing

**Why this is bad**

Current audit field: `required_clues_present: clue_id: chapter N paragraph M | absent`

This encourages the model to think in IDs, but the model does not know how to map `clue_early_1` to a precise narrative shape.

**What to implement**

Change audit generation instructions so the model audits narrative requirements, not IDs. Instead of:

```
clue_early_1: chapter 3 paragraph 2
```

Use:

```
early_clock_observation: present in paragraph N
clock_reads_ten_minutes_past_eleven: present in paragraph N
clock_may_be_misleading: present in paragraph N+1
```

This will improve self-check behavior.

---

### Problem H: Prompt overload and truncation are likely harming compliance

**Evidence from run**

Every system prompt is carrying: character whitelist, pronoun enforcement, anti-invention rules, era authenticity, physical plausibility, template leakage bans, denouement rules, moral complexity rules, victim identity rules, amateur detective constraints, seasonal constraints, locked fact phrases, scene grounding rules, score feedback, continuity summary, output schema, word count contract, prompt budget truncation.

**What to implement**

Refactor prompt assembly into tiers:

- **Tier 1 — non-negotiable hard constraints:** output JSON only; name whitelist; pronouns; locked phrases; chapter-specific clue obligations; word count minimum; forbidden words
- **Tier 2 — current chapter grounding:** location anchor; atmosphere; prior-chapter anti-repetition only if necessary; continuity summary
- **Tier 3 — soft craft guidance:** varied sentence structure; sensory richness; show-don't-tell; sophistication

When token pressure is high: preserve Tier 1; preserve only the minimal necessary subset of Tier 2; drop Tier 3 first. Do not allow chapter-critical clue instructions to be shorter or weaker than soft craft advice.

---

## Engineering instructions

### 1. Introduce a prompt compiler

Implement a module that converts internal story/validator data into model-facing prose requirements.

**Input:** internal schema with clue IDs, placement rules, locked phrases, chapter targets, continuity.

**Output:** a model-facing chapter prompt containing concrete narrative obligations, exact phrase requirements, paragraph/position requirements, word target, chapter-specific checklist.

**Requirement:** never pass validator-only IDs like `clue_early_1` directly unless accompanied by a concrete prose rendering.

### 2. Split clue semantics from placement semantics

Implement separate fields for: observable clue fact; interpretive clue fact; placement/visibility rule. This should exist both in your planner and your validator contract.

### 3. Raise prompt-side word targets above validator minimum

Implement this rule:

```
prompt_min_words = max(preferred_target + 150, scene_estimate_adjusted)
```

For Chapter 3: validator minimum = 1300; prompt minimum = 1450 or 1500. Update system prompt, outline `estimatedWordCount`, checklist, and retry prompts to all use the same target family.

### 4. Replace retry message generation

Attempt 2: concrete beat repair. Attempt 3: Paragraph A / Paragraph B explicit template. Attempt 4: first-300-words required clue block + rebuild language. Do not include repeated emotional lines like "This is your last chance" or "Do not partially fix" unless for UI/debugging — they should not dominate the repair message.

### 5. Generate chapter-specific checklists automatically

For each chapter, compile the validator requirements into a short explicit self-check list. For Chapter 3, include: early direct clock observation; exact time phrase; separate next-paragraph inference; minimum content length; location anchor and sensory opening.

### 6. Refactor the audit schema

Change the output audit instructions from clue-ID reporting to prose-condition reporting.

Suggested audit keys: `early_clock_observation`, `clock_time_phrase_present`, `clock_manipulation_inference_present`, `season_words_used`, `forbidden_season_words_present`, `content_word_count_estimate`.

### 7. Add validation diagnostics

For every failed attempt, log: raw response char count; parsed JSON success/failure; extracted `chapters[0].paragraphs` total char count; extracted word count; audit field presence; whether the required phrase "ten minutes past eleven" appeared; whether the phrase appeared in the first 25% of output; whether manipulation-language appeared in the next paragraph window.

This will help distinguish: true generation failure; parse failure; extraction failure; validator mismatch.

---

## Acceptance criteria

The implementation is successful when:

- Chapter 3-style requirements are expressed to the model as concrete narrative obligations, not just clue IDs.
- Retry prompts escalate in structural specificity.
- Prompt-side length targets are consistently above validator minima.
- The generated checklist and audit explicitly mention the early clock observation sequence.
- The validator no longer depends on the prose model understanding internal labels like `clue_early_1`.
- Failures become diagnosable through raw-output and extracted-content logs.

---

## Direct instruction block for the coder

1. **Stop passing validator-only clue IDs directly into prose prompts.** Add a translation layer that turns each internal clue/placement requirement into concrete narrative instructions.

2. **For Chapter 3, replace `clue_early_1` with a mandatory early two-paragraph prose block:**
   - paragraph 1: Beatrice directly approaches and observes the stopped clock in the library; text explicitly states "ten minutes past eleven"
   - paragraph 2: Beatrice explicitly reasons that the clock may have been manipulated and may mislead the apparent time of death

3. **Unify and raise generation length targets.** If validator wants 1300, prompt the model for 1450–1500. Update outline estimates to match.

4. **Replace current retries with escalating repair templates** that specify exact paragraph-level obligations and, by attempt 4, require the clue block within the first 300 words.

5. **Generate chapter-specific pre-submit checklists** from the actual validator contract, including the early clock observation requirement.

6. **Refactor the audit schema** so the model reports prose conditions rather than internal clue IDs.

7. **Add detailed failure diagnostics** for parse, extraction, phrase presence, and early-position checks.

---

## Bottom line

The latest run confirms that the system is currently asking the prose model to solve a validator-shaped problem with insufficient prose-shaped instructions. The fix is not "try harder" messaging. The fix is to compile validator requirements into concrete narrative beats, enforce them from the initial run, and make retries structural rather than abstract.
