# ANALYSIS_18 — Story Quality Code Audit

**Date**: 2026-05-14  
**Trigger**: User review of story generated in run #12 (`story_20260514-2150`)  
**Scope**: Full code audit of 7 story-quality issue classes found in the generated output  
**Status**: Findings documented; P0-A and P0-B already fixed in run #14 / #15

---

## Executive Summary

Seven issue classes were identified in the run #12 story output. Root causes span four files across three layers of the pipeline:

| Priority | ID | Issue | Root Cause Layer | Status |
|---|---|---|---|---|
| P0 | A18-P0-A | Victim gender pronoun inconsistency | Prompt (agent9-prose.ts) | Not yet fixed |
| P0 | A18-P0-B | `clue.pointsTo.trim()` crash on synthesized clues | Prompt builder bug | **Fixed in run #15** |
| P0 | A18-P0-C | Debug notes persisting in prose output | Architecture (order-of-ops) | Partially fixed (linter added) |
| P0 | A18-P0-D | Culprit admits tampering, not murder | Prompt + validation | Not yet fixed |
| P1 | A18-P1-A | Time-logic contradiction across locked facts | Architecture (no arithmetic gate) | Not yet fixed |
| P1 | A18-P1-B | Eleanor/Hale pronoun drift despite repair sweep | Repair + validator scope | Partially fixed (crossParagraph) |
| P2 | A18-P2-A | Scene-template openings in 7 of 10 chapters | Pattern coverage gap | Partially fixed (linter added) |

---

## A18-P0-A: Victim Gender Pronoun Inconsistency

### Symptom

Lord Voss (the victim) is referred to with both masculine and feminine pronouns within the same story. The text uses "her lifeless face", "she was agitated" and "his lifeless body", "he was" within adjacent chapters.

### Root Cause

**File**: `packages/prompts-llm/src/agent9-prose.ts`  
**Function**: `buildPronounAccuracyBlock()` (~line 2185)

The pronoun lock table is built only from the `cast[]` array. The victim appears in the CML as `CASE.victim` (not a cast member), so they are never added to the pronoun accuracy block in the system prompt.

```typescript
// CURRENT — victim excluded because they're not in cast[]
const knownGenderCast = cast.filter((c: any) => {
  const g = c.gender?.toLowerCase();
  return g === 'male' || g === 'female';
});
```

The LLM sees the victim's name in `victimIdentityRule` (line ~2997) but has no pronoun constraint for them. English name gender inference is unreliable for names like "Voss" (could be male or female).

Additionally, `applyDeterministicPronounSweep()` in `agent9-run.ts` only targets cast members. The victim is never included in the repair sweep.

### Proposed Fix

**Step 1 — Extend `buildPronounAccuracyBlock` to accept victim info:**

```typescript
// In agent9-prose.ts
export function buildPronounAccuracyBlock(
  cast: any[],
  victimInfo?: { name: string; gender: string }
): string {
  // ... existing cast pronoun table ...
  
  if (victimInfo && (victimInfo.gender === 'male' || victimInfo.gender === 'female')) {
    const p = victimInfo.gender === 'male'
      ? { subj: 'he', obj: 'him', poss: 'his', refl: 'himself', wrong: 'she/her/herself' }
      : { subj: 'she', obj: 'her', poss: 'her', refl: 'herself', wrong: 'he/him/his/himself' };
    pronounTable += `\n  • ${victimInfo.name} (victim): ALWAYS ${p.subj}/${p.obj}/${p.poss} — NEVER ${p.wrong}`;
  }
  return pronounTable;
}
```

**Step 2 — Add victim to deterministic repair sweep in `agent9-run.ts`:**

```typescript
// Add victim as a synthetic cast entry for the pronoun sweep
const victimCastEntry: CastEntry | null = cml.CASE?.victim_name && cml.CASE?.victim_gender
  ? { name: cml.CASE.victim_name, gender: cml.CASE.victim_gender }
  : null;

const sweepCast = victimCastEntry
  ? [...castDesign.characters, victimCastEntry]
  : castDesign.characters;

prose = applyDeterministicPronounSweep(prose, sweepCast as CastEntry[]);
```

**Step 3 — Add CML schema assertion before prose generation:**

```typescript
if (!cml.CASE?.victim_gender || cml.CASE.victim_gender === 'unknown') {
  ctx.warnings.push(`Victim "${cml.CASE?.victim_name}" has no locked gender — pronoun drift likely.`);
}
```

---

## A18-P0-B: `clue.pointsTo.trim()` Crash on Synthesized Clues

### Symptom

Run #14 failed on all 6 attempts for Chapter 4 with:
```
Cannot read properties of undefined (reading 'trim')
```

### Root Cause

**File**: `packages/prompts-llm/src/agent9-prose.ts`, line 1889–1890  
**Function**: `buildClueObligationBlock()` (or equivalent in the clue section builder)

```typescript
// BEFORE (crashes when clue.pointsTo is undefined)
lines.push(`    • ${clue.description.trim()} [${clueId}]${earlyFlag}`);
lines.push(`      Points to: ${clue.pointsTo.trim()}`);
```

Agent 5 synthesizes "late optional slot" clues (`clue_late_optional_slot_1`) as structural scaffolding for the inference step. These synthesized clues are added to `CASE.clues[]` but may lack a `pointsTo` field if Agent 5's synthesis template only populates `description` and `placement`.

When the chapter generation prompt builder encounters the synthesized clue in `clueMap`, it calls `.trim()` on `undefined`, crashing all 6 attempts of that chapter.

### Fix Applied (run #15)

```typescript
// AFTER — null-safe
lines.push(`    • ${String(clue.description ?? '').trim()} [${clueId}]${earlyFlag}`);
lines.push(`      Points to: ${String(clue.pointsTo ?? '').trim()}`);
```

**Status**: Fixed. Build verified clean. Active in run #15.

### Prevention

Agent 5 should validate synthesized clues have all required fields before writing them to the CML. Add to `agent5-run.ts`:

```typescript
// Validate synthesized clue completeness
const validateSynthesizedClue = (clue: any, clueId: string): void => {
  if (!clue.description) {
    throw new Error(`Synthesized clue ${clueId} missing 'description' field`);
  }
  if (!clue.pointsTo) {
    clue.pointsTo = `${clue.description} — points to the culprit's method`;
    ctx.warnings.push(`Synthesized clue ${clueId} had no 'pointsTo'; auto-filled.`);
  }
};
```

---

## A18-P0-C: Debug Notes Persisting in Prose Output

### Symptom

Sentences like "The detail is explicit: forty minutes." appear in the final prose output, breaking the reader's immersion.

### Root Cause

**Architecture flaw — order-of-operations:**

```
Timeline of injections vs linting:
1. generateProse() → lintBatchProse() catches "The detail is explicit:" → NOT FOUND
2. generateProse() returns approved chapters
3. enforceLockedFactValuePresence() → INJECTS "The detail is explicit: forty minutes."
4. applyDeterministicProsePostProcessing() runs
5. applyDeterministicPronounSweep() runs
6. NO FINAL LINTING — debug marker goes straight to output ✗
```

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`, line ~688:
```typescript
// CURRENT — injects unremovable debug annotation
updatedParagraphs[bestIdx] = `${updatedParagraphs[bestIdx].trim()} The detail is explicit: ${canonical}.`;
```

The linter was added (ANALYSIS_17 fix) to catch this pattern during prose generation, but `enforceLockedFactValuePresence()` runs AFTER `generateProse()`, making the linter blind to injected markers.

### Proposed Fixes

**Fix 1 (Immediate) — Remove debug annotation from injection:**

```typescript
// AFTER — inject canonical value WITHOUT metadata markers
updatedParagraphs[bestIdx] = `${updatedParagraphs[bestIdx].trim()} ${canonical}.`;
```

The "The detail is explicit:" prefix adds no reader value and is purely a debug artifact.

**Fix 2 (Architectural) — Post-processing linting pass:**

Add a `lintProsePostProcessing()` function after `enforceLockedFactValuePresence()`:

```typescript
// In agent9-run.ts, after enforceLockedFactValuePresence()
prose = enforceLockedFactValuePresence(prose, annotatedLockedFacts);
prose = stripDebugAnnotations(prose);   // NEW

function stripDebugAnnotations(prose: any): any {
  const DEBUG_STRIP_PATTERNS: Array<[RegExp, string]> = [
    [/\bThe detail is explicit:[^.]+\./g, ''],
    [/\bThis detail added[^.]+texture[^.]+\./g, ''],
    [/\bwithout changing the essential deduction chain[^.]+\./g, ''],
    [/\[locked fact\][^.]*\./gi, ''],
  ];
  // Apply to all paragraphs in all chapters
  return {
    ...prose,
    chapters: prose.chapters.map((ch: any) => ({
      ...ch,
      paragraphs: ch.paragraphs.map((p: string) => {
        let result = p;
        for (const [pattern, replacement] of DEBUG_STRIP_PATTERNS) {
          result = result.replace(pattern, replacement).trim();
        }
        return result;
      }),
    })),
  };
}
```

---

## A18-P0-D: Culprit Admits Tampering, Not Murder

### Symptom

In the revelation chapter, Captain Hale confesses to tampering with the clock but says "I didn't kill him." Eleanor treats this as a murder confession. The prose is internally contradictory and the mystery resolution fails.

### Root Cause

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Function**: `enforceCulpritEvidencePresence()` (~line 830)

The injected sentence uses ambiguous "responsible" language:
```typescript
// CURRENT — "responsible" is ambiguous; doesn't require murder admission
`${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt.`
```

**File**: `packages/story-validation/src/suspect-closure-validator.ts`, line ~11  
The validator uses the same weak regex pattern:
```typescript
const CULPRIT_TERMS = /\b(culprits?|killers?|murderers?|responsible|did\s+it)\b/i;
```

"Responsible" matches even for tampering-without-murder.

**Root cause in the prompt**: The prose system prompt instructs the LLM to reveal the culprit but does not explicitly require that the revelation include:
- (a) murder admission (not just tampering)
- (b) mechanism by which tampering caused/enabled the murder

### Proposed Fix

**Fix 1 — Strengthen `enforceCulpritEvidencePresence` injection:**

```typescript
// AFTER — inject murder-specific language
const murderAdmission = `${surname} had committed the murder. The mechanism was clear: the evidence of the stopped clock, the tampered winding, and the means of access all pointed irrefutably to ${surname} as the one who had killed the victim and attempted to conceal the time of death.`;
paragraphs[lastIdx] = `${paragraphs[lastIdx].trim()} ${murderAdmission}`;
```

**Fix 2 — Strengthen validator pattern:**

```typescript
// In suspect-closure-validator.ts
const CULPRIT_MURDER_TERMS = /\b(kill(?:ed|er|ers)?|murder(?:ed|er|ers)?|commit(?:ted)?\s+(?:the\s+)?murder|guilty\s+of\s+(?:the\s+)?murder|took\s+(?:the\s+)?(?:victim|his|her)\s+life)\b/i;
```

The validator should require BOTH `CULPRIT_TERMS` AND `CULPRIT_MURDER_TERMS` to satisfy the culprit evidence gate.

**Fix 3 — Prose prompt contract:**

Add to `buildFairPlayContractBlock()` or equivalent:
```
CULPRIT REVELATION MANDATORY CONTRACT:
When the culprit is revealed, the revelation chapter MUST include:
(a) EXPLICIT MURDER ADMISSION — state that the culprit killed the victim (not just "tampered" or "knew")
(b) MECHANISM — how the method caused or enabled the victim's death
(c) MOTIVE — why the culprit committed the crime
(d) MEANS — how the culprit had physical access to the murder method

❌ FORBIDDEN: "I tampered with the clock but I didn't kill him" — do not let the culprit deny murder
✓ REQUIRED: "It was [Culprit] who killed [Victim] — the clock manipulation was the method"
```

---

## A18-P1-A: Time Logic Contradictions

### Symptom

The story contains these incompatible timestamps:
- Clock reads "ten minutes past eleven" (11:10)
- Tamper amount: "forty minutes" (clock set back 40 min)
- Real murder time implied: 11:10 − 40min = 10:30
- Chapter 9 references "ten fifty in the morning" (10:50) — inconsistent

The reader cannot reconstruct a coherent deduction chain from these facts.

### Root Cause

**Architecture**: Locked facts are enforced as TEXT PRESENCE only — not as arithmetic relationships.

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Function**: `enforceLockedFactValuePresence()` (~line 640)

```typescript
// CURRENT — only checks canonical text appears verbatim
if (chapterTextLower.includes(canonical.toLowerCase())) {
  continue;  // Already present
}
```

No validation that `clock_reading + tamper_amount = murder_time`.

The "ten fifty" reference is likely from an earlier draft or template bleed (a clue description mentioning "10:50 train") being reproduced verbatim.

### Proposed Fix

**Fix 1 — Temporal anchor block in prose prompt:**

In the chapter-building prompt, inject all time-locked facts together with their computed relationship:

```
⏰ TEMPORAL ANCHOR (LOCKED — do not deviate):
• Clock stopped at: ten minutes past eleven (11:10 AM)
• Clock tampered by: forty minutes (set back)
• Therefore real murder time: thirty minutes past ten (10:30 AM)

ARITHMETIC CHECK: 11:10 − 40 min = 10:30 ✓ These must be internally consistent.
Never reference any time that contradicts this chain (e.g. "ten fifty" or "eleven forty").
```

**Fix 2 — Locked-fact arithmetic validation (long-term):**

Add `validateLockedFactArithmetic()` in the CML validation pipeline (Agent 6 or post-Agent 5):

```typescript
function validateLockedFactArithmetic(lockedFacts: AnnotatedLockedFact[]): ValidationError[] {
  const timeFacts = lockedFacts.filter(f => /time|clock|reading|tamper|murder_time/i.test(f.id));
  const clockReading = timeFacts.find(f => f.id === 'clock_reading');
  const tamperAmount = timeFacts.find(f => f.id === 'tamper_amount');
  const murderTime = timeFacts.find(f => f.id === 'murder_time');
  
  if (clockReading && tamperAmount && murderTime) {
    const clock = parseWordFormTime(clockReading.canonical);
    const tamper = parseWordFormDuration(tamperAmount.canonical);
    const murder = parseWordFormTime(murderTime.canonical);
    if (clock && tamper && murder) {
      const expectedMinutes = (clock.hour * 60 + clock.minute) - tamper.minutes;
      const actualMinutes = murder.hour * 60 + murder.minute;
      if (Math.abs(expectedMinutes - actualMinutes) > 1) {
        return [{ type: 'locked_fact_arithmetic_error', severity: 'critical',
          message: `Time arithmetic mismatch: ${clockReading.canonical} - ${tamperAmount.canonical} ≠ ${murderTime.canonical}` }];
      }
    }
  }
  return [];
}
```

---

## A18-P1-B: Pronoun Drift Despite Repair Sweep

### Symptom

Eleanor Voss (female, detective) has she/her → he/him transitions within chapters. Captain Hale (male) has he/his → she/her transitions in some chapters. The `applyDeterministicPronounSweep` reports 10–18 repairs per chapter but some mismatches still reach the validator.

### Root Cause

Three contributing factors:

**1. Validator Guard 3 suppression** (`packages/story-validation/src/character-validator.ts` ~line 305):

When both male and female characters appear in nearby text, Guard 3 suppresses pronoun mismatch detection to avoid false positives. This means Hale's wrong pronouns can survive validation when Eleanor is also in the same scene.

**2. Context window boundary** (~line 279):

The `crossParagraphInheritance` option (added this session) extends repair across paragraph boundaries. But the underlying context window is sentence-based (±10 sentences before/after). In longer scenes, a character established 20+ sentences earlier may not anchor correctly.

**3. Pronoun repair runs before scoring, not after all injections**:

The deterministic sweep in `agent9-run.ts` runs at line ~2460. But `enforceSuspectEliminationPresence` (added this session) injects new sentences AFTER the sweep. Those injected sentences always use the template "X was thoroughly cleared" which is gender-neutral — low risk but worth noting.

### Proposed Fix

**Fix 1 — Run pronoun sweep after ALL injections:**

```typescript
// In agent9-run.ts post-processing chain, move pronoun sweep to the END:
prose = enforceLockedFactValuePresence(prose, annotatedLockedFacts);
prose = enforceCulpritEvidencePresence(prose, cml);
prose = enforceSuspectEliminationPresence(prose, cml);
prose = stripDebugAnnotations(prose);                     // NEW (A18-P0-C fix)
prose = applyDeterministicPronounSweep(prose, sweepCast); // LAST
```

**Fix 2 — Disable Guard 3 for high-risk characters:**

Add a "pronoun-strict" mode for characters who have had prior validated mismatches in any chapter of the current run. Track mismatch history and apply stricter validation to those characters.

**Fix 3 — Expand context window for `crossParagraphInheritance`:**

In `pronoun-repair.ts`, `repairPronouns()` with `crossParagraphInheritance: true` should use chapter-level (not sentence-level) context for the "last single character" tracking. The current sentence window resets too often.

---

## A18-P2-A: Scene-Template Openings

### Symptom

Seven of ten chapters (3, 4, 6, 7, 8, 9, 10) begin with location-profile template text such as:
- "The Library in Little Middleton, England carried overcast..."
- "clung to coats and curtains"
- "seemed to signal a tense and foreboding, a sense of underlying secrets amidst the grandeur"

### Root Cause

**File**: `packages/prompts-llm/src/agent9-prose.ts`  
**Constant**: `TEMPLATE_BLEED_PATTERNS` (~line 1039)

The patterns were added in ANALYSIS_17 but are too literal. The story shows variants not caught:
- ✓ "clung to coats and curtains" — caught by existing pattern
- ✗ "The Library in Little Middleton, England carried overcast" — NOT caught (no pattern for location-intro + weather verb)
- ✗ "seemed to signal a tense and foreboding, a sense of underlying secrets amidst the grandeur" — NOT caught (pattern matches "tense and brooding" but not "tense and foreboding")

Even when caught, the linter triggers a retry, but after 6 retries, the chapter is committed with the template text intact.

### Proposed Fixes

**Fix 1 — Expand patterns (more resilient regex):**

```typescript
const TEMPLATE_BLEED_PATTERNS: RegExp[] = [
  // Existing patterns
  /\bmet them with\b/i,
  /\bthreaded through the scene\b/i,
  /\bclung to coats and curtains\b/i,
  /\bleft the room feeling\b/i,
  /\bseemed to signal a\b.{0,40}\bturn in events\b/i,
  /\bsharpened the\b.{0,40}\btension\b/i,
  /^by the time they reached\b/im,
  /\b(felt sharply|carried overcast|met them with overcast)\b/i,
  /affecting outdoor activities/i,
  /tense and brooding,? with an underlying sense of unease among the guests/i,
  
  // NEW — broader mood/atmosphere scaffolds
  /\bseemed to signal\b.{0,60}\b(foreboding|tension|dread|unease|ominous)\b/i,
  /\bsense of\b.{0,50}\b(underlying|underlying secrets|grandeur|foreboding)\b/i,
  /\btense and (foreboding|ominous|brooding|charged)\b/i,
  
  // NEW — location-intro + weather verb pattern
  /^the\s+\w[\w\s]{0,30},\s+\w[\w\s]{0,20},?\s+\w[\w\s]{0,20}\s+(carried|felt|seemed|appeared)\s+\w/im,
  
  // NEW — weather/atmosphere scaffolds
  /\bcarried\s+(overcast|weather|atmosphere|gloom|tension)\b/i,
];
```

**Fix 2 — Deterministic opening-stripper (post-processing):**

When a chapter's first paragraph matches a template pattern, replace the opening sentence with the first non-template sentence rather than retrying:

```typescript
function stripTemplateOpenings(prose: any): any {
  return {
    ...prose,
    chapters: prose.chapters.map((ch: any) => {
      if (!Array.isArray(ch.paragraphs) || ch.paragraphs.length === 0) return ch;
      const firstPara = ch.paragraphs[0];
      const hasTemplateOpening = TEMPLATE_BLEED_PATTERNS.some(p => p.test(firstPara));
      if (!hasTemplateOpening) return ch;
      // Find first sentence that isn't template-like and use it
      const sentences = firstPara.match(/[^.!?]+[.!?]+/g) ?? [];
      const cleanSentences = sentences.filter(s => !TEMPLATE_BLEED_PATTERNS.some(p => p.test(s)));
      if (cleanSentences.length > 0) {
        return { ...ch, paragraphs: [cleanSentences.join(' '), ...ch.paragraphs.slice(1)] };
      }
      return ch; // Can't strip; leave for human review
    }),
  };
}
```

---

## Cross-Cutting Architecture Issue: Post-Generation Injection Bypass

All P0 issues (except P0-A) share a common root cause: **deterministic post-processing functions inject content that was never seen by the linter**.

```
Current pipeline:
generateProse() → [lintBatchProse] → approved chapters
enforceLockedFactValuePresence()  → INJECTS debug notes ← not linted
enforceCulpritEvidencePresence()  → INJECTS responsibility sentence ← not linted
enforceSuspectEliminationPresence() → INJECTS elimination sentence ← not linted
applyDeterministicPronounSweep()  → repairs pronouns ← sees injected text ✓
```

**Systemic Fix**: Run a final post-processing lint pass after all injections:

```typescript
// In agent9-run.ts, after all enforceXxx() calls:
prose = stripDebugAnnotations(prose);       // A18-P0-C
prose = stripTemplateOpenings(prose);       // A18-P2-A  
prose = applyDeterministicPronounSweep(prose, sweepCast);
// validatePostProcessingQuality(prose);    // Future: re-run linter on final text
```

---

## Implementation Priority

| Order | Fix | Effort | Impact |
|---|---|---|---|
| 1 | **A18-P0-B** (clue.pointsTo crash) | 1 line | Critical — blocks generation |
| 2 | **A18-P0-C, step 1** (remove "The detail is explicit:" string) | 1 line | Critical — visible to readers |
| 3 | **A18-P0-D, Fix 1** (strengthen culprit injection) | 5 lines | Critical — breaks mystery resolution |
| 4 | **A18-P2-A, Fix 1** (expand TEMPLATE_BLEED_PATTERNS) | 10 lines | High — prose quality |
| 5 | **A18-P0-C, Fix 2** (stripDebugAnnotations post-processor) | 20 lines | High — catches injected markers |
| 6 | **A18-P1-A, Fix 1** (temporal anchor prompt block) | 15 lines | High — puzzle coherence |
| 7 | **A18-P0-A** (victim pronoun locking) | 30 lines | High — immersion breaking |
| 8 | **A18-P1-B** (pronoun sweep ordering) | 5 lines | Medium — reduces drift risk |
| 9 | **A18-P0-D, Fix 3** (prompt contract) | 20 lines | Medium — prevention |
| 10 | **A18-P1-A, Fix 2** (arithmetic validation) | 60 lines | Low (rare failure mode) |

---

## Files to Modify

| File | Issues | Priority |
|---|---|---|
| `packages/prompts-llm/src/agent9-prose.ts` | P0-B ✅, P0-C, P0-D, P1-A, P2-A | P0 |
| `apps/worker/src/jobs/agents/agent9-run.ts` | P0-A, P0-C, P0-D, P1-B | P0 |
| `packages/story-validation/src/suspect-closure-validator.ts` | P0-D | P1 |
| `packages/story-validation/src/character-validator.ts` | P1-B | P1 |
| `apps/worker/src/jobs/agents/agent5-run.ts` | P0-B prevention | P2 |
