# Score Improvement Plan
**Date:** 20 May 2026  
**Source documents:** `documentation/plan/90-score-remediation-plan-20260519.md`, `stories/story_20260520-1846/issues-review.md`  
**Target:** ChatGPT review score ≥ 90 / 100  
**Baseline:** 57/100 (Run B); current sessions had no review scoring  
**File to edit:** `packages/prompts-llm/src/agent9-prose.ts` unless otherwise stated

---

## Progress Tracker

| ID | Description | Effort | Score Impact | Status |
|---|---|---|---|---|
| Fix 1 | Expand `detectVictimAlive` verb list | Done | +3 Character clarity / Ending | ✅ Done |
| Fix 2 | `applyDeterministicPronounSweep` final pass | Done | +3 Prose/polish | ✅ Done |
| Fix 3 | Clock anchor in `buildContinuityContext` (Step 3.2) | Done | +2 Mystery clues | ✅ Done |
| Fix 4 | Location-boilerplate TEMPLATE_BLEED_CHECKS (patterns A + B) | Done | +2 Atmosphere | ✅ Done |
| Fix 5 | Interrogation differentiation in `buildChapterObligationBlock` | Done | +2 Pacing / Plot | ✅ Done |
| Fix 6 | 4 DEBUG_NOTE_PATTERNS (mechanism, purposes, recorded-as, exact-amount) | Done | +1 Prose/polish | ✅ Done |
| Fix 7 | Victim excluded from suspect clearance obligations | Done | — | ✅ Done |
| Fix 8 | Pronoun drift gate limited to `attempt < 4` | Done | — | ✅ Done |
| Fix 9 | Fingerprint/debug-note bypass at max attempts | Done | — | ✅ Done |
| Fix 10a | `until the investigator` debug-note patterns | Done | +1 Prose/polish | ✅ Done |
| Fix 10b | Report-obligation language patterns | Done | +1 Prose/polish | ✅ Done |
| Fix 10c | Victim-name hard gate for Chapter 1 | Done | +1 Character clarity | ✅ Done |
| **R1** | ~~Clock anchor → `liveNarrativeState.lockedFacts` seeding from Ch 1~~ — **deprioritized** (marginal over Fix 3) | — | — | ⏸ Deferred |
| **R2** | **Room-list preamble check (3+ room names in opening paragraph)** | Low | **+1 Atmosphere** | ✅ Done |
| **R3** | **Location-specific retry feedback message** | Low | **+1 Opening hook** | ✅ Done |
| **R4** | ~~Two missing DEBUG_NOTE patterns~~ — **SKIPPED** ("should be noted" has false-positive risk in period fiction) | — | — | ❌ Skipped |
| **A1** | ~~Cross-chapter n-gram threshold tuning (Issue 13)~~ — **INVALIDATED** | — | — | ❌ Removed |
| **A2** | **Discriminating-test gate: `foundTerms.length < 2` in chapter-validator.ts** | Trivial | **+2 Plot structure** | ✅ Done |
| **A3** | **Resolution causal-bridge: thread `murderMethod` into `resolutionCheck`** | Low | **+1 Ending/reveal** | ✅ Done |
| **A4** | **Estate name lock in `buildCaseOverview` Setting Lock** | Trivial | **+1 Prose/polish** | ✅ Done |
| **A5** | ~~Beatrice role-establishment obligation for Ch 1~~ — **deprioritized** (marginal over Fix 10a) | — | — | ⏸ Deferred |

---

## What Has Already Been Implemented

Cross-referenced against session history and current code state.

| Session Fix | Description | Plan Item | Status |
|---|---|---|---|
| Fix 1 | Expanded `detectVictimAlive` verb list (~40 verbs) | Plan Fix 1 (victim-alive gate) | ✅ Done (alternate mechanism) |
| Fix 2 | `applyDeterministicPronounSweep` final pass post-generation | Plan Fix 2 (pronoun repair-in-place) | ✅ Done (supplement to existing `repairChapterPronouns`) |
| Fix 3 | Clock anchor in `buildContinuityContext` (Step 3.2) | Plan Fix 3 Step 3.2 | ✅ Done |
| Fix 4 | Two TEMPLATE_BLEED_CHECKS patterns (location-formula A + B) | Plan Fix 4 Step 4.1 (A, B) | ✅ Done |
| Fix 5 | Interrogation differentiation in `buildChapterObligationBlock` | Plan Fix 5 | ✅ Done |
| Fix 6 | 4 DEBUG_NOTE_PATTERNS (mechanism, purposes, recorded-as, exact-amount) | Plan Fix 6 (4 of 6 patterns) | ✅ Done |
| Fix 7 | Victim excluded from suspect clearance obligations | Not in plan | ✅ Done |
| Fix 8 | Pronoun drift gate limited to `attempt < 4` | Not in plan | ✅ Done |
| Fix 9 | Fingerprint/debug-note-only failure bypass at max attempts | Not in plan | ✅ Done |
| Fix 10a | `until the investigator` debug-note patterns (Issue 6) | Not in plan | ✅ Done |
| Fix 10b | Report-obligation language patterns (Issue 7) | Not in plan | ✅ Done |
| Fix 10c | Victim-name hard gate for Chapter 1 (Issue 2) | Not in plan | ✅ Done this session |

---

## Remaining Work — From 90-Score Remediation Plan

These items were specified in the plan but not yet implemented.

### R1 — Clock Anchor: Seed `liveNarrativeState.lockedFacts` from Chapter 1 prose
**Plan reference:** Fix 3, Step 3.3  
**Score impact:** +2 (Mystery clues category — clock oscillation eliminated)  
**Risk:** Low — runtime additive only  

After Chapter 1 commits (`batchSuccess = true`, `chapterStart === 1`), scan the chapter paragraphs for a clock-time phrase using `CLOCK_ANCHOR_RE` (already defined at line ~4502) and push a `LockedFact` entry into `liveNarrativeState.lockedFacts` if one is found and the `lockedFacts` array doesn't already contain a clock entry. This seeds the enforcement chain from prose instead of relying solely on upstream CML schema `locked_facts`.

```typescript
// After chapter 1 batch commit:
if (chapterStart === 1 && batchSuccess && liveNarrativeState) {
  const ch1Text = (chapters[0]?.paragraphs as string[] ?? []).join(' ');
  const clockMatch = ch1Text.match(CLOCK_ANCHOR_RE);
  if (clockMatch && !liveNarrativeState.lockedFacts.some(f => f.description?.toLowerCase().includes('clock'))) {
    liveNarrativeState.lockedFacts.push({
      id: 'runtime_clock_anchor',
      value: clockMatch[0],
      description: 'Exact time shown on the stopped clock face',
    });
    console.log(`[Agent 9] Runtime clock anchor locked from Chapter 1: "${clockMatch[0]}"`);
  }
}
```

**Where to insert:** After the `batchSuccess = true` assignment in the batch commit block, around line 7207.

**⚠ Scope issue:** `CLOCK_ANCHOR_RE` is currently defined INSIDE `buildContinuityContext` (local const, line ~4518). It must be moved to module level (before `buildContinuityContext`) so it is accessible from `generateProse`. This is a 1-line move, no functional change to the regex.

**⚠ Type check:** Verify `liveNarrativeState.lockedFacts` is a mutable array at the insertion point (not spread-immutable). If it is a `readonly` array, use `liveNarrativeState = { ...liveNarrativeState, lockedFacts: [...liveNarrativeState.lockedFacts, newFact] }` instead of `.push()`.

---

### R2 — Location Boilerplate: Room-List Preamble Check
**Plan reference:** Fix 4, Step 4.1 (Pattern C)  
**Score impact:** +1–2 (Atmosphere category — "three rooms listed then abandoned" pattern blocked)  
**Risk:** Low — false-positive risk is mitigated by scoping to first paragraph only  

Add a third entry to `TEMPLATE_BLEED_CHECKS` immediately after the two Fix 4 entries:

```typescript
// Fix 4c: Room-list preamble — first paragraph names 3+ distinct room types,
// signalling that the LLM is listing the manor's rooms as a set-piece opener
// rather than grounding the POV character in a specific scene.
// Scoped to first paragraph only (paragraph index 0).
// "The Servants' Hall... the Drawing Room... the Library..."
(p, pIdx) => {
  if (pIdx !== 0) return false;
  const roomMatches = p.match(/\b(?:Hall|Library|Study|Garden|Kitchen|Cellar|Parlour|Gallery|Pantry|Scullery|Drawing\s+Room|Morning\s+Room|Dining\s+Room|Servants['']?\s+(?:Hall|Quarters)|Smoking\s+Room|Billiard\s+Room)\b/gi);
  return (roomMatches?.length ?? 0) >= 3;
},
```

**Note:** The current `TEMPLATE_BLEED_CHECKS` callback signature is `(p: string) => boolean`. The paragraph index `pIdx` is NOT currently passed. You will also need to thread the paragraph index through the check loop at line ~1284:

```typescript
for (let pIdx = 0; pIdx < (chapter.paragraphs ?? []).length; pIdx++) {
  const paragraph = chapter.paragraphs![pIdx];
  for (const check of TEMPLATE_BLEED_CHECKS) {
    if (check(paragraph, pIdx)) { ... }
  }
  // similar change for DEBUG_NOTE_PATTERNS loop
}
```

Change the type: `Array<(p: string, pIdx: number) => boolean>` and update all existing checks (they ignore the second argument, so no functional change).

---

### R3 — Location Boilerplate: Targeted Retry Feedback
**Plan reference:** Fix 4, Step 4.2  
**Score impact:** +1 (Opening hook category — faster convergence on correct chapter opening style)  
**Risk:** Very low — additive feedback only  

In `buildEnhancedRetryFeedback`, when `linterIssues` contains a `template_bleed` issue, inject location-specific feedback. 

**⚠ Simplification:** `buildEnhancedRetryFeedback` does not receive chapter content directly (`batchChapters` is not available in its signature). Do NOT check the opening paragraph text — just fire when the linter issue type is `template_bleed`:

```typescript
const hasLocationBleed = linterIssues.some(i => i.type === 'template_bleed');
if (hasLocationBleed) {
  feedback += `⛔ BANNED: Opening paragraph describes the room as a set piece.\n`;
  feedback += `You opened with a room or location name as a scene-setter. This is a template-bleed pattern.\n`;
  feedback += `REQUIRED: Open with a character action, reaction, or sensory observation specific to this moment.\n`;
  feedback += `WRONG: "The Library in Little Middleton held a tense weight..."\n`;
  feedback += `RIGHT: "She crossed the room before the last echo of footsteps had faded."\n`;
  feedback += `The first word must NOT be "The" followed by a room name, nor "Entering The".\n\n`;
}
```

---

### R4 — Two Missing DEBUG_NOTE_PATTERNS from Plan
**Plan reference:** Fix 6, patterns 4 and 6  
**Score impact:** +1 (Prose/polish — closes remaining report-note bleed vectors)  
**Risk:** None — additive only  

Append to `DEBUG_NOTE_PATTERNS` in `lintBatchProse` (and to `DEBUG_NOTE_STRIP_PATTERNS` in Fix 9's bypass block):

```typescript
// Plan Fix 6 pattern 4: meta-commentary ("it should be noted that", "it is worth noting")
/\b(?:it|this) (?:should be noted|is worth noting|is notable) that\b/i,
// Plan Fix 6 pattern 6: clue/evidence ID reference annotations
/\b(?:clue|evidence)\s+(?:id|identifier|reference)[:\s]+[a-z_0-9]+\b/i,
```

---

## Additional Work — From Issues Review

These items come from `issues-review.md` and are not in the 90-score plan. All require investigation before commitment.

### A1 — Cross-Chapter Duplicate Detection (Issue 13) ❌ INVALIDATED
**Description:** Chapter 7 reproduces ~60% of Chapter 6's paragraphs verbatim (Eleanor at fireplace, fingerprint confrontation, financial motive, garden recollection). Original plan was to lower the n-gram threshold.

**Validation finding:** The n-gram check measures Jaccard similarity of token n-grams — i.e., literal text overlap. The overlap in Issue 13 is NARRATIVE BEAT repetition: the same plot events (Eleanor confronted at fireplace, fingerprint evidence raised, financial motive discussed) retold with different wording. Jaccard similarity for paraphrased repetition is near 0, so lowering the threshold to 0.5 or 0.15 would NOT catch the actual problem. It would only increase false positives on legitimate mystery formula phrases that repeat across chapters ("the clock", "the study", "the inspector").

**Root cause already addressed:** Fix 5 (interrogation differentiation in `buildChapterObligationBlock`) prevents the same interrogation scene obligation from being assigned to consecutive chapters. This is the correct fix.

**Action required:** None. Remove from todo list. If the issue recurs in a new run after Fix 5, investigate scene ledger state to confirm Fix 5 fires correctly.

---

### A2 — Discriminating-Test Chapter Gate: Strengthen Existing Weak Check (Issue 8)
**Description:** A gate ALREADY EXISTS in `packages/story-validation/src/chapter-validator.ts` at `checkDiscriminatingTest()` (line 187). It fires as `severity: 'major'` (→ `hardError`) for chapters in the final 15% of the story if zero key terms from `discriminating_test.design` appear in the chapter text.

**Validation finding:** The existing gate is too permissive. It extracts the top 5 non-stopword words from the test design description and requires ANY ONE to appear in the chapter. Since mystery vocabulary (clock, wound, evidence, suspect, killer) appears naturally in most chapters, the gate almost never fires even when the actual discriminating-test scene is absent.

**Correct fix (low effort, in `chapter-validator.ts`):**
1. In `checkDiscriminatingTest()`, change `foundTerms.length === 0` to `foundTerms.length < 2` — require at least 2 design key terms, not just 1.
2. Also add a secondary check: the chapter must contain at least one action verb from `{trap, demonstrate, test, reenact, prove, reveal, expose, confront, stage}` (discriminating-test action verbs).
3. Fire `severity: 'major'` if EITHER condition fails (fewer than 2 key terms, OR no action verb).

**File to edit:** `packages/story-validation/src/chapter-validator.ts`, method `checkDiscriminatingTest()`

**Risk:** Low — the existing check is already in the hardError pipeline; this just makes it stricter.

---

### A3 — Resolution Causal-Bridge Gate (Issue 9)
**Description:** Eleanor's confession of clock-tampering must be connected to a murder charge — but the pipeline only validates that a culprit is "named and charged," not that the confession includes a causal link.

**Validation finding:** The resolution 5-item checklist at line 2501 already includes `Method: State exactly how [murderMethod] was used — specific, not vague`. There is ALSO an existing `resolutionCheck` in `lintBatchProse` (line ~916) that validates the culprit surname appears in the final chapter.

**What is missing:** No linter gate validates the committed final-chapter prose for murder-method language near the culprit name. The prompt obligation exists but a hard GATE does not.

**Correct fix:** Extend the existing `resolutionCheck` (or add a companion check) in `lintBatchProse`:
- When `isLastChapter` AND culprit name is present AND `murderMethod` is non-empty:
- Check that `murderMethod` words (or synonyms like `killed/murder/death/poisoned/struck/strangled`) appear within 300 characters of the culprit name.
- If not, push to `hardErrors` with message: `Resolution must explicitly connect ${culpritName} to the murder method: "${murderMethod}"`.

**File to edit:** `packages/prompts-llm/src/agent9-prose.ts`, `lintBatchProse()` resolution check block.

**Risk:** Low-medium — the LLM usually includes this; the gate forces a retry only when the ending is ambiguous.

---

### A4 — Estate/Setting Name Consistency (Issue 10)
**Description:** Both "Little Middleton" and "Caldwell Manor" appear. The LLM invents a manor name that isn't in the CML data.

**Validation finding:** The existing `buildCaseOverview()` at line 1759 already emits:
```
Setting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type.
```
The lock exists but only prohibits a "different location TYPE" — it does NOT prohibit inventing a proper name for the estate within that location type.

**Correct fix (trivial, 1 line in `buildCaseOverview`):**
Change the Setting Lock sentence to:
```
Setting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type, and do not invent a house or estate name. The property has no additional name beyond the setting location above — do not write "Caldwell Manor", "the estate", or any invented proper name.
```

**File to edit:** `packages/prompts-llm/src/agent9-prose.ts`, `buildCaseOverview()` function.

**Risk:** Very low — single sentence change in existing Setting Lock prompt.

---

### A5 — Beatrice Role Establishment (Issue 11)
**Description:** Chapters 1–8 refer to "the investigator" who "will arrive" even though Beatrice IS the investigator. This is partially addressed by Fix 10a (pattern blocks the phrase). The remaining gap: no positive obligation in Chapter 1 forces Beatrice to establish her detective role with a direct statement.  
**Action required:**
1. In `buildChapterObligationBlock` for `chapterNumber === 1`, if the detective character is in the cast, add an obligation: "The detective must establish their role in this chapter — either explicitly ('I intend to investigate this myself') or implicitly through a decisive investigative action (examining the body, taking statements, refusing to wait for police)."
2. Validate in the existing `contentValidation` stage.

**Risk:** Low — obligation injection only.

---

## Priority Order

| Priority | Item | Effort | Score Impact |
|---|---|---|---|
| 1 | R4 — Two missing DEBUG_NOTE patterns | Trivial (2 lines) | +1 Prose/polish |
| 2 | R2 — Room-list preamble check | Low (update callback signature + add check) | +2 Atmosphere |
| 3 | R3 — Location retry feedback | Low (10 lines) | +1 Opening hook |
| 4 | R1 — Clock anchor → lockedFacts seeding | Low (15 lines) | +2 Mystery clues |
| 5 | A4 — Estate name lock | Low (requires tracing setting data flow) | +1 Prose/polish |
| 6 | A5 — Beatrice role establishment obligation | Low-Medium | +1 Character clarity |
| 7 | ~~A1 — Cross-chapter n-gram threshold~~ — REMOVED (invalid) | — | — |
| 8 | A2 — Strengthen existing DT check in `chapter-validator.ts` | Low (2–3 line change) | +2 Plot structure |
| 9 | A3 — Resolution causal-bridge gate (extend `resolutionCheck`) | Low-Medium | +1 Ending/reveal |

**Quick wins (R4 + R2 + R3 + R1) total impact: ~+6 points. Implement in one pass.**  
**Medium items (A1–A5) total impact: ~+7 additional points if all succeed.**

---

## Build and Verify

After each implementation batch:
```powershell
cd c:\CML ; npm run -w @cml/prompts-llm build ; npm run -w @cml/worker build
```

After all items complete, run 5 consecutive canary core passes:
```powershell
cd c:\CML ; npm run canary:core ; Write-Host "PIPELINE_EXIT_CODE: $LASTEXITCODE"
```

Then submit a generated story for ChatGPT review to measure score improvement.
