# ANALYSIS_27 — Post-Validator-Improvement Canary: Pipeline + Prose Quality Review
*Date: 2026-05-28 | Run: mystery-1779993526746 | Model: gpt-4.1-mini-2025-04-14*

---

## 1. Context

**Story:** "The Pendulum's False Hour" (continued from ANALYSIS_26 seed)
**Genre / Era:** Golden Age country-house murder, February 1935
**Method:** Mechanical clock-tampering — culprit reversed pendulum swing and wound clock backward by forty minutes to falsify time of death
**Detective type:** Amateur (Eleanor Voss)
**Cast:** Eleanor Voss (F, detective), Dr. Mallory Finch (F), Captain Ivor Hale (M, culprit), Beatrice Quill (F)
**Location preset:** CountryHouse — Wychwood Heath | **Target length:** Short | **Narrative style:** Classic

**Canary outcome:** WARNING — exit code 0 ✅ (improved from FAILED in ANALYSIS_26)
**Full-story validation:** needs review — **4 major issues** (down from 10 in ANALYSIS_26)
**Prose quality (ChatGPT review):** **72/100** — "solid draft" territory
**Pipeline abort:** None — run completed to story save

**Key feature flags active this run:**
- `enableLockedFactRegistry: true` / `enableLockedFactGate: true`
- `enableCharacterBundle: true` / `enableBindingGates: true`
- `enableSurgicalFingerprintRetry: true` / `enableOutlineCompleteness: true`
- `pronoun_checking_enabled: false` — repair pass disabled
- `pronoun_validation_enabled: false` — pronoun validator suppressed

**Locked facts established in CML:**

| Key | Canonical value |
|-----|-----------------|
| `clock_reading` | `"ten minutes past eleven"` |
| `tamper_amount` | `"forty minutes"` |

**Note:** This run reduced to 2 locked facts vs 4 in ANALYSIS_26 (`pendulum_length` and `room_temperature` not established). The `enforceLockedFactValuePresence` pass injected 2 + 1 = 3 canonical value mentions post-generation.

**Pre-prose gate results:**

| Gate | Result | Detail |
|------|--------|--------|
| Agent8-NoveltyAuditor | ✅ PASS | max similarity 0.42 (*The Mysterious Affair at Styles*) < 0.90 threshold |
| Agent6-FairPlayAuditor | ✅ PASS | |
| Agent6-BlindReader | ✅ PASS | |
| Agent2d-TemporalContext | ✅ PASS (attempt 1/2) | February 1935 |
| Agent2c-LocationProfiles | ✅ PASS (attempt 1/3) | 4 locations |
| Agent2b-CharacterProfiles | ✅ PASS (attempt 1/3) | 4 profiles |
| Agent3b-HardLogicDeviceGenerator | ✅ PASS (attempt 1/3) | 5 devices |
| Agent5-ClueExtraction | ✅ PASS | 16 clues distributed; canonical DT evidence: clue_11, clue_mechanism_visibility_core, clue_1 |
| Agent65-WorldBuilder | ✅ PASS | World document complete |
| Agent7-NarrativeFormatter | ✅ PASS | 10 scenes structured, 19,800 words target |

---

## 2. Pipeline: Chapter Generation Results

**Chapter-level prose scores:**

| Chapter | Title | Score | Attempts | Retry reason |
|---------|-------|-------|----------|--------------|
| Ch1 | Discovery | 90/100 | 1 | — |
| Ch2 | Suspicious Clockwork | 91/100 | 1 | — |
| Ch3 | The Clockmaker's Manual | 92/100 | 1 | — |
| Ch4 | The Winding Key | 91/100 | 1 | — (DT scheduling gap: outline-level, non-blocking) |
| Ch5 | Gardener's Testimony | 87/100 | **2** | Template linter (Group A): weather/atmosphere preamble opening |
| Ch6 | Financial Records and Motive | 91/100 | 1 | — |
| Ch7 | Eliminating Other Suspects | 91/100 | **2** | Template linter: location inventory opening |
| Ch8 | Preparing the Trap | 91/100 | 1 | — |
| Ch9 | The Discriminating Test | 92/100 | 1 | — |
| Ch10 | Clearing the Innocent and Culprit's Confrontation | 92/100 | **2** | SuspectClosureValidator: clearance missing for Beatrice Quill + Eleanor Voss |

**Cumulative prose score:** 96/100  
**Atmosphere repair:** ran on Ch1–Ch8 (8 chapters)  
**Pronoun sweep:** 34 deterministic repairs across 10 chapters (no LLM involvement)

**Validator behaviour — new validators confirmed working:**

| Validator | Observation |
|-----------|-------------|
| `SuspectClosureValidator` | ✅ Correctly caught Ch10: Beatrice Quill and Eleanor Voss clearances lacked required (name + clearance phrase + evidence connector) co-occurrence. Retry succeeded on attempt 2 with actionable error message. |
| `EraAuthenticityValidator` | ✅ Zero anachronism errors for 1930s run; era preamble (obligation-block) active and effective. |
| `DiscriminatingTestValidator` | ✅ No validator rejections. Ch4 DT scheduling gap logged as outline-level info warning only (non-blocking by design). |
| `NarrativeContinuityValidator` | ✅ No CaseTransition errors (CaseTransitionValidator removal confirmed benign). |

**Clue audit result:**
```json
{
  "missingDiscriminatingEvidenceIds": [],
  "weakEliminationSuspects": [],
  "invalidSourcePaths": []
}
```

---

## 3. Full-Story Validation Issues (4 Major)

**Only one issue was explicitly logged to terminal:**

### Issue 3.1: [G6-Q1] Culprit full-name never appears in prose

**Reported:** `[G6-Q1] Culprit name "Captain Ivor Hale" never appears in the prose — the reader cannot identify the murderer.`

**Assessment: Likely a validator false positive.**

The actual prose consistently uses "Captain Hale", "Hale", and "the captain Hale" throughout all 10 chapters. Chapter 10 contains an explicit arrest scene: *"Captain Hale, you are under arrest for the murder and the deliberate tampering of the manor's grand clock."* The culprit is unambiguously identified to the reader.

**Root cause hypothesis:** The G6-Q1 gate checks for the exact three-word string `"Captain Ivor Hale"` verbatim. The story generated by the LLM consistently uses the two-word form "Captain Hale" or the bare surname "Hale" — both unambiguous, but neither matching the full-name gate string.

**Severity:** False positive — no prose change needed; gate string check needs loosening.

### Issues 3.2–3.4: Unknown (3 major issues)

The remaining 3 major issues were not individually logged in the visible terminal output. The CLUE_AUDIT passed clean, ruling out discriminating test and suspect elimination failures. The 3 unknown issues are most likely in the narrative quality / prose completeness category rather than structural. See §6 (Secondary Observations) for hypotheses.

---

## 4. ChatGPT Prose Quality Review

**Overall score: 72/100** — "solid draft" territory; first draft to cross this threshold.

| Area | Score | Notes |
|------|-------|-------|
| Premise / concept | 8/10 | Backward-running clock is a strong, distinctive locked-room-style clue |
| Opening hook | 6/10 | Atmospheric but victim unnamed |
| Plot structure | 8/10 | Discovery → clock → manual → key → gardener → motive → clearing → trap → test → arrest: strong shape |
| Character clarity | 6/10 | Pronoun slips; "the captain Hale / the doctor Finch" wording hurts clarity |
| Dialogue | 6/10 | More controlled, but some lines cut off or over-formal |
| Atmosphere / setting | 7/10 | Wychwood Heath, winter drizzle, clock tower, manor rooms: cohesive and moody |
| Mystery clues | 8/10 | Pendulum dust + manual + key oil + gardener + ledger form a real evidence chain |
| Pacing | 7/10 | Mostly purposeful; Ch8 and Ch9 overlap |
| Ending / reveal | 7/10 | Hale exposed and arrested; motive clearer than before |
| Prose / polish | 5/10 | Generated phrasing, pronoun errors, report-like exposition; unfinished sentences |

**What is working well:**
- Clock mechanism evidence chain is the best yet: reversed pendulum dust → clockmaker's manual → winding key residue → backward 40-minute shift → false alibi
- Culprit chain is clear: Hale near clock tower → gardener confirms → key has fresh oil → financial motive → dust on clothing → test proves mechanism → confession
- Plot structure has clean mystery shape across all 10 chapters

**ChatGPT-identified defects:**

| ID | Defect | Severity | Location |
|----|--------|----------|----------|
| P-1 | Victim has no name — referred to as "the figure", "the victim", "the corpse", "him" | High | Ch1 (and throughout) |
| P-2 | Captain Hale assigned female pronouns in multiple passages | High | Ch1, Ch4, and scattered |
| P-3 | Unfinished sentences: "proceed with", "as the figure was", "the time in", "easily", "idle" | High | Ch1, Ch2, Ch3, Ch5 |
| P-4 | Ch8 and Ch9 structurally overlap (trap setup + test performed twice) | Medium | Ch8, Ch9 |
| P-5 | Motive stated but not sharpened — victim's leverage over Hale not explicit | Medium | Ch6, Ch10 |
| P-6 | Title case inconsistency: "the captain Hale", "the doctor Finch" (lowercase article + title) | Low | Ch1, scattered |
| P-7 | Clock time inconsistency: Beatrice's "3:15" vs "ten minutes past eleven" are both used | Low | Ch1 vs later chapters |

**Fastest fixes to reach 80/100 (per ChatGPT):**
1. Name the victim in Chapter 1 (e.g., *Lord Alistair Vale lay near the hearth…*)
2. Fix all pronoun errors (Hale = he/him; Eleanor = she/her; Finch = she/her; Quill = she/her)
3. Choose one displayed clock time and keep it consistent
4. Merge/reduce Chapters 8 and 9
5. Add one clear motive sentence: *"Hale killed him because the victim was going to expose his financial wrongdoing."*

---

## 5. Priority Classification

| ID | Source | Failure class | Severity | Volume | Blocking? | Priority |
|----|--------|---------------|----------|--------|-----------|----------|
| FIX-1 | Pipeline | [G6-Q1] Culprit full-name gate false positive | Major (validator bug) | 1 error | ✅ Yes (holds at warning) | **P0** |
| FIX-2 | ChatGPT + Pipeline | Unfinished sentences in prose (generation artifacts) | High prose | ~5 occurrences | ❌ No (prose quality) | **P1** |
| FIX-3 | ChatGPT | Victim unnamed throughout | High prose | All chapters | ❌ No | **P1** |
| FIX-4 | ChatGPT | Pronoun slippage (Hale = she/her in several passages) | High prose | Ch1, Ch4+ | ❌ No (validator suppressed) | **P1** |
| FIX-5 | ChatGPT | Ch8/Ch9 structural overlap | Medium prose | 2 chapters | ❌ No | **P2** |
| FIX-6 | ChatGPT | Motive not explicit enough | Medium prose | Ch6, Ch10 | ❌ No | **P2** |
| OBS-1 | Pipeline | DT scheduling gap in Ch4 outline | Info warning | 1 chapter | ❌ No | P3 (track) |
| OBS-2 | Pipeline | 3 unknown major validation issues | Unknown | Unknown | ⚠️ Partial | P1 (investigate) |

---

## 6. Score Impact Estimates

### Baseline (this run)
| Metric | Value |
|--------|-------|
| CANARY_STATUS | warning |
| Exit code | 0 |
| Major validation issues | 4 |
| ChatGPT prose score | 72/100 |
| Per-chapter prose scores | 87–92/100 |
| Cumulative prose score | 96/100 |

### After FIX-1 (G6-Q1 culprit name gate loosening)
- Matching loosened to accept surname + title form ("Captain Hale") in addition to full three-word form
- 1 major error removed; run status upgrades from `warning` to `passed` (pending other 3 unknowns)
- No prose change required

### After FIX-2 + FIX-3 + FIX-4 (prose quality fixes)
- Unfinished sentences completed: +3–4 points prose polish
- Victim named: +1–2 opening hook; +1 character clarity
- Pronouns corrected: +1–2 character clarity
- ChatGPT score estimate: **78–80/100** (up from 72)

### After FIX-5 + FIX-6 (structure + motive sharpening)
- Ch8/Ch9 merged or reduced: +1 pacing
- Explicit motive sentence: +1 ending/reveal
- ChatGPT score estimate: **80–83/100** target reached

### After all fixes (FIX-1 through FIX-6)
| Metric | Expected |
|--------|----------|
| Major validation issues | 0 (pending 3 unknown — investigate separately) |
| Run outcome | `passed` |
| ChatGPT score estimate | **80–85/100** |
| Expected canary score | 92–96/100 |

---

## 7. Remediation Plan

### FIX-1 (P0): Loosen G6-Q1 culprit full-name gate

**File:** Locate the validation check that implements the G6-Q1 culprit name presence test.  
**Symptom:** Gate checks for exact three-word string `"Captain Ivor Hale"`; LLM always generates two-word form "Captain Hale" or bare "Hale".  
**Fix:** Change the name presence check to also accept any unambiguous subset: rank + surname, or first name + surname, in addition to the full three-word form.

```typescript
// Loosen from exact full-name match to accept any of:
//   "Captain Hale", "Ivor Hale", or "Captain Ivor Hale"
const culpritNameVariants = buildNameVariants(culpritFullName);
// buildNameVariants("Captain Ivor Hale") → ["captain ivor hale", "captain hale", "ivor hale", "hale"]
const proseLC = prose.toLowerCase();
const found = culpritNameVariants.some(v => proseLC.includes(v));
```

**Scope risk:** Low — purely additive loosening. Does not suppress true negatives (a story with no mention of any Hale form would still fail).

---

### FIX-2 (P1): Complete unfinished sentences at generation level

**Root cause:** Obligation block content causes the LLM to stop mid-sentence when reaching token limits or when a chapter is compressed. The sentences that trail off ("proceed with", "easily", "idle") are dialogue or narrative that was truncated.

**Fix options (in order of preference):**

1. **Obligation block**: Add a sentence-completeness rule — *"Every sentence must be syntactically complete. Do not end dialogue or narration mid-phrase."*
2. **Post-generation lint**: Add a regex lint rule for unfinished dialogue patterns: lines ending in a verb/adverb inside quotes without closing punctuation.
3. **Template linter extension**: Add a Group B rule detecting sentences that end in common incomplete-sentence patterns (e.g., `/"[^"]{0,20}"\s*$` with only a bare verb before closing quote).

---

### FIX-3 (P1): Inject victim name into Chapter 1 obligation block

**File:** `packages/prompts-llm/src/agent9-prose/obligation-block.ts`  
**Fix:** For Chapter 1 specifically, inject a named-victim constraint:

```typescript
if (chapterIndex === 0) {
  const victimName = cmlCase?.victim?.name ?? null;
  if (victimName) {
    lines.push(`  - VICTIM IDENTITY: name the victim "${victimName}" explicitly in this chapter. ` +
               `Use their name within the first three paragraphs.`);
  }
}
```

This ensures the victim name appears before the investigation advances.

---

### FIX-4 (P1): Investigate and fix pronoun slippage for Captain Hale

**Context:** `pronoun_validation_enabled: false` suppresses the validator, so pronoun errors are not caught at generation time. The deterministic sweep fixed 34 issues but the ChatGPT review still found he→she errors for Hale. This means either:
- (a) The deterministic sweep misses some patterns, or
- (b) The swap occurs in a structure the sweep doesn't match

**Fix option A (preferred):** Re-enable `pronoun_validation_enabled` once the false-positive alias bug from ANALYSIS_26 FIX-2 is applied. The validator then catches genuine errors without false positives.

**Fix option B (immediate):** Extend the deterministic sweep to cover additional Hale reference patterns (e.g., possessive cases where "her voice" follows a sentence that ends on "Hale").

---

### FIX-5 (P2): Resolve Ch8/Ch9 structural overlap

**Approach:** Update the outline obligation for Ch8 to limit it to trap preparation only (no test execution), and ensure Ch9's obligation explicitly triggers the full discriminating test demonstration. This is an Agent7 narrative structure issue — the current outline may schedule overlapping scene beats.

**File:** Review `apps/worker/src/jobs/agents/agent7-narrative.ts` prompt construction and check whether the scene beat allocation for the penultimate chapters allows the model to generate both setup and execution in Ch8.

---

## 8. Improvement vs ANALYSIS_26

| Metric | ANALYSIS_26 (run mystery-1779988420525) | ANALYSIS_27 (run mystery-1779993526746) | Delta |
|--------|----------------------------------------|-----------------------------------------|-------|
| Exit code | 1 (FAILED) | 0 (WARNING) | ✅ +1 |
| CANARY_STATUS | `needs_revision` | `warning` | ✅ improved |
| Major issues | 10 | 4 | ✅ −6 |
| Moderate issues | 13 | 0 (pronoun validator suppressed) | ✅ −13 (suppressed) |
| Total issues | 23 | 4 | ✅ −19 |
| CLUE_STATUS | — | pass | ✅ new pass |
| Locked fact injections | 0 (8 failures) | 3 auto-injected | ✅ improved |
| ChatGPT prose score | ~68/100 (est. prior) | 72/100 | ✅ +4 |
| Ch10 suspect clearance | Not caught | Caught + fixed by retry | ✅ new gate working |
| Era anachronism errors | Not caught (era unrecognised) | 0 errors (1930s now active) | ✅ new gate working |

**Changes that drove the improvement (this session):**
1. `suspect-closure-validator.ts` — broadened regex, now catching clearance co-occurrence failures
2. `discriminating-test-validator.ts` — broadened regex, fewer false rejections
3. `era-validator.ts` — 8 new decade entries; 1930s now active
4. `pipeline.ts` — `CaseTransitionValidator` removed (redundant with NarrativeContinuityValidator)
5. `obligation-block.ts` — era forbidden-terms preamble + post-reveal naming constraint injected

---

## 9. Secondary Observations

| Observation | Detail | Trend | Action |
|-------------|--------|-------|--------|
| DT scheduling gap Ch4 | Outline placed discriminating-test scene in Ch4 with no fresh DT evidence clue scheduled; logged as info, non-blocking | First occurrence | Monitor: if recurring, update Agent7 to guarantee a DT evidence clue is scheduled in the DT scene beat |
| Atmosphere repair coverage | 8/10 chapters required atmosphere repair (vs 7/10 in ANALYSIS_26) | Slight increase | Monitor: if repair coverage continues rising, investigate whether obligation block changes are triggering more stock phrases |
| Pronoun sweep volume | 34 repairs across 10 chapters | High | Indicates the LLM still produces significant pronoun errors; FIX-4 should be prioritised once alias bug is fixed |
| Ch5/Ch7 template linter retries | Both retries were structure violations (weather preamble, room inventory) — not content failures | Recurring class | Consider adding explicit opening-line constraint to obligation block for Ch5+ to reduce first-attempt failures |
| G6-Q1 false positive | Full-name gate requires exact three-word string; LLM never generates it | Structural | FIX-1 (P0) — loosen gate to accept rank+surname variants |
