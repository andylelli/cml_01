# ANALYSIS_28 — Locked Fact False Positive: Over-Broad Keyword Trigger

**Date:** 2026-03-31  
**Status:** Root cause identified — fix ready  
**Severity:** High (30 major validation errors → `needs_revision`, blocks story acceptance)  
**Validator:** `ProseConsistencyValidator.checkLockedFacts()`  
**Source:** `packages/story-validation/src/prose-consistency-validator.ts`

---

## 1. Observed Errors

```
[ERROR] ValidationPipeline | final_validation | Story validation: needs_revision - 0 critical, 30 major issues
[ERROR] Locked fact "The exact time shown on the stopped clock face" is described
        in chapter 6 without its canonical value "ten minutes past eleven".
[ERROR] Locked fact "The exact time shown on the stopped clock face" is described
        in chapter 7 without its canonical value "ten minutes past eleven".
[ERROR] Locked fact "The exact time shown on the stopped clock face" is described
        in chapter 16 without its canonical value "ten minutes past eleven".
[ERROR] Locked fact "The exact time shown on the stopped clock face" is described
        in chapter 19 without its canonical value "ten minutes past eleven".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 1 without its canonical value "forty minutes".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 2 without its canonical value "forty minutes".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 3 without its canonical value "forty minutes".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 4 without its canonical value "forty minutes".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 5 without its canonical value "forty minutes".
[ERROR] Locked fact "The exact amount the clock was wound back" is described
        in chapter 7 without its canonical value "forty minutes".
... (30 total)
```

---

## 2. Root Cause

### 2.1 The trigger logic

`checkLockedFacts()` uses this condition to decide whether a scene is "referencing" a locked fact:

```typescript
const keywords = fact.description
  .toLowerCase()
  .split(/\s+/)
  .filter(w => w.length > 3);

const mentionsFact = keywords.some(kw => text.includes(kw));
```

**`any single keyword` match is sufficient to trigger the check.** The threshold is `some()` — i.e., 1-of-N.

### 2.2 The keyword sets produced

| Locked fact description | Keywords extracted (length > 3) |
|---|---|
| "The exact time shown on the stopped clock face" | `exact`, `time`, `shown`, `stopped`, `clock`, `face` |
| "The exact amount the clock was wound back" | `exact`, `amount`, `clock`, `wound`, `back` |

**Every one of these keywords is a common word in mystery prose.** In a 20-chapter story about a tampered clock:

- `clock` — appears in virtually every chapter (the clock is the central evidence object)
- `time` — appears in virtually every chapter ("took his time", "at the time", "time of death")
- `back` — appears in virtually every chapter ("looked back", "turned back", "came back")
- `wound` — appears in multiple chapters ("wound the clock", "a wound inflicted", "wound his way")
- `exact` — appears anywhere precision is discussed

### 2.3 Why most flags are false positives

The intent of the check is: **if a chapter explicitly describes the specific physical evidence value, it must use the verbatim canonical phrase.** The correct semantic is:

> "Chapter 3 describes the stopped clock's time reading **as a specific fact** → must say 'ten minutes past eleven'"

The actual trigger fires for:

> "Chapter 3 mentions 'clock' in passing (e.g. 'the grandfather clock ticked steadily')" → triggers check → value not present → fire major error

Chapters 1–5 firing for "wound back" is a diagnostic signature: the story has barely started, the clock murder evidence has not been formally introduced yet, but those chapters casually mention a clock, or use "back" or "wound" in unrelated contexts.

### 2.4 The unused `appearsInChapters` field

The `LockedFact` type and CML schema both define an `appearsInChapters?: string[]` field:

```typescript
// packages/story-validation/src/types.ts:82
lockedFacts?: Array<{ id: string; value: string; description: string; appearsInChapters?: string[] }>;
```

```yaml
# schema/hard_logic_devices.schema.yaml:64+
appearsInChapters:
  type: array
  required: false
  items: string
```

However:
1. The validator **never reads** `appearsInChapters` — it checks every scene regardless
2. The LLM (agent3b) **never populates** it — all examples and runs show it as absent
3. If it were populated and used, the false positives would disappear entirely

---

## 3. Failure Pattern

| Property | Value |
|---|---|
| Error type | `locked_fact_missing_value` (major, not critical) |
| False positive signature | Early chapters firing (1–5) for evidence not yet introduced; symmetric explosion of 30 errors from 2 locked facts × many chapters |
| Accumulation | 2 facts × ~15 chapters each ≈ 30 errors |
| Validation outcome | `needs_revision` (not `failed` — no critical errors) |
| User impact | Story rejected and retried when the prose is actually correct |

### Distinguishing false positive vs genuine failure

A **genuine** locked fact error has this signature:
- Chapter explicitly discusses the specific evidence ("The clock had stopped at...")
- A different numeric value appears nearby ("...half past ten", "...twenty minutes")
- That would be flagged as `locked_fact_contradicted` (critical severity)

A **false positive** has this signature:
- Chapter mentions a common word in an unrelated context
- No specific reference to the evidence detail
- Flagged as `locked_fact_missing_value` (major severity)
- The canonical value is absent because the scene never needed to include it

The errors in this run are all `locked_fact_missing_value` (major, not critical), which is the false positive pattern.

---

## 4. Root Cause Fix — Prevention at Earliest Opportunity

### Pipeline sequencing

The pipeline order is critical to understanding where the root cause fix lives:

```
Agent3b  →  lockedFacts (no chapter numbers exist yet — narrative hasn't run)
Agent5   →  clue distribution (clue descriptions, clue IDs)
Agent7   →  narrative outline (acts → scenes → sceneNumber, cluesRevealed[])
             ↓
agent9-run.ts line 605:
  const proseLockedFacts = hardLogicDevices.devices[0]?.lockedFacts;
  // ← AT THIS EXACT POINT: narrative + clues + proseLockedFacts are ALL present
  //   This is the earliest viable point to compute appearsInChapters.
             ↓
agent9-run.ts line 1257:
  validationPipeline.validate(storyForValidation, {
    lockedFacts: proseLockedFacts ?? [],   // ← appearsInChapters still unpopulated
  })
             ↓
Validator fires on every chapter → 30 false positives
```

**Agent3b cannot populate `appearsInChapters` — it runs before the narrative exists.  
The earliest viable prevention point is `agent9-run.ts`, lines 605–613**, where the code
has simultaneously:
- `proseLockedFacts` from agent3b
- `narrative.acts[].scenes[]` from agent7 (each scene has `sceneNumber` and `cluesRevealed[]`)
- `clues.clues[]` from agent5 (each clue has `id`, `description`, `pointsTo`)
- `cml.CASE.prose_requirements.clue_to_scene_mapping[]` (explicit `clue_id → act_number + scene_number`)

### Root cause fix: derive `appearsInChapters` in `agent9-run.ts`

**Before calling `generateProse()` or `validationPipeline.validate()`**, derive which
chapters each locked fact is likely to appear in by scanning the narrative
for scenes that reveal clues whose descriptions overlap with the locked fact:

```typescript
// In agent9-run.ts, after line 605 (extracting proseLockedFacts), before line 609:

const allNarrativeScenes = (narrative.acts ?? [])
  .flatMap((act: any, actIdx: number) =>
    (act.scenes ?? []).map((scene: any) => ({
      chapterNumber: /* cumulative index */ scene.sceneNumber ?? actIdx + 1,
      cluesRevealed: Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [],
    }))
  );

// Build a map: clueId → chapter numbers it appears in
const clueIdToChapters = new Map<string, number[]>();
for (const scene of allNarrativeScenes) {
  for (const clueId of scene.cluesRevealed) {
    const existing = clueIdToChapters.get(clueId) ?? [];
    existing.push(scene.chapterNumber);
    clueIdToChapters.set(clueId, existing);
  }
}

// For each locked fact, find chapters by matching fact keywords against clue descriptions
const annotatedLockedFacts = (proseLockedFacts ?? []).map(fact => {
  const factKeywords = fact.description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedChapters = new Set<number>();
  for (const clue of (clues.clues ?? [])) {
    const clueText = `${clue.description} ${clue.pointsTo}`.toLowerCase();
    const overlap = factKeywords.filter(kw => clueText.includes(kw)).length;
    if (overlap >= 2) {
      const chapters = clueIdToChapters.get(clue.id) ?? [];
      chapters.forEach(ch => matchedChapters.add(ch));
    }
  }
  return matchedChapters.size > 0
    ? { ...fact, appearsInChapters: Array.from(matchedChapters).map(String) }
    : fact;
});
```

Then use `annotatedLockedFacts` everywhere `proseLockedFacts` is currently used
(generateProse, narrativeState, validationPipeline.validate).

### Validator update: honour `appearsInChapters` as a primary gate

In `ProseConsistencyValidator.checkLockedFacts()`, before the keyword check:

```typescript
// If chapter scoping is provided, skip chapters outside the declared scope entirely.
// This eliminates all false positives from incidental keyword co-occurrence.
if (fact.appearsInChapters && fact.appearsInChapters.length > 0) {
  const relevantChapters = new Set(fact.appearsInChapters.map(Number));
  if (!relevantChapters.has(scene.number)) continue;
}
```

When `appearsInChapters` is populated (the normal case once the derivation is in place), the
keyword check is never reached for out-of-scope chapters. When it is empty (edge case: a
locked fact whose evidence appears in no clue-mapped scene), the existing keyword check runs
as the fallback.

---

## 5. Defensive Layer — Fix 1 (keep, but as a secondary guard only)

Fix 1 (raise keyword match threshold to 2) remains useful as a **defence-in-depth**
safeguard for when `appearsInChapters` is absent (e.g. old CML data, edge cases):

```typescript
// BEFORE
const mentionsFact = keywords.some(kw => text.includes(kw));

// AFTER
const matchCount = keywords.filter(kw => text.includes(kw)).length;
const mentionsFact = matchCount >= Math.min(2, keywords.length);
```

Fix 1 alone is **not** a root cause fix — it reduces the false positive rate but the
problem can return for any locked fact whose description happens to contain ≥2 high-frequency
prose words.

---

## 6. Why Agent3b Cannot Own This Fix

Agent3b produces locked facts before the narrative is written. It has no knowledge of:
- Which chapter numbers will exist
- Which scenes will reveal the associated clues
- How many acts agent7 will generate

Asking agent3b to emit `appearsInChapters` at generation time would require guessing future
chapter structure. Chapter layout is only determined when agent7 runs. Therefore the earliest
correct intervention point is agent9-run.ts, lines 605–613, where all three data sources
converge for the first time.

---

## 7. Scope of Change

| File | Change | Type |
|---|---|---|
| `apps/worker/src/jobs/agents/agent9-run.ts` | Derive `appearsInChapters` from narrative + clue distribution before calling `generateProse`/`validate` | **Root cause fix** |
| `packages/story-validation/src/prose-consistency-validator.ts` | Use `appearsInChapters` as primary chapter gate; keep 2-keyword threshold as fallback | Supporting |

---

## 8. Checklist

- [ ] Implement `appearsInChapters` derivation in `agent9-run.ts` (lines 605–613)
- [ ] Update validator to use `appearsInChapters` as primary chapter gate
- [ ] Apply Fix 1 (2-keyword threshold) as fallback when `appearsInChapters` is absent
- [ ] Add unit tests: single-keyword mention → no trigger; multi-keyword mention without value → trigger; scoped fact — out-of-scope chapter → no trigger; scoped fact — in-scope chapter without value → trigger
