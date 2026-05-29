## Findings — Run F30 (2026-05-29)

**Run ID:** `run_f5a57100-564b-48db-92cf-58fc2c635238`  
**Date:** 2026-05-29  
**Status:** New — no implementation plan yet

Three systemic findings surfaced from the F30 run abort. Two are infrastructure bugs. One is a new failure type (detective naming) that joins the existing type taxonomy.

---

## Finding 1 — Prose gate / story-validator discrepancy (pronoun coverage gap)

### What happened

The prose-generation gate reported `entity_pronoun_drift_count=0` for all 10 chapters. The story-validator then found **3 pronoun gender mismatches** in the same prose:

| Character | Chapter | Error |
|-----------|---------|-------|
| Robert Quincy (male) | 2 | "her" used |
| Michael Brabazon (male) | 2 | "her" used |
| Robert Quincy (male) | 9 | "her" used |

Two characters in the same chapter (ch2), both male, both getting "her". The gate reported zero drift for the chapter.

### Root cause hypothesis

The prose gate and the story-validator run different detection algorithms against the same text and are getting different answers. The most likely cause is that the prose gate's character candidate list for ch2 was incomplete or capped, causing Quincy and Brabazon to fall outside the drift-check scope.

Three candidates to investigate:

**Candidate A — Character set size limit.** If the prose gate checks drift for at most N characters per chapter (to keep the check fast), and ch2 happens to have more than N named characters, some candidates are dropped. The dropped candidates are not checked.

**Candidate B — Chapter participation filter.** The prose gate may only check pronouns for characters who "appear" in the chapter according to the outline's `charactersPresent` list. If the outline's ch2 entry lists characters differently from how they appear in the prose, Quincy or Brabazon could be filtered out before the check runs.

**Candidate C — Detection window mismatch.** The prose gate may use a proximity window (e.g., "her" must be within N tokens of the character's name in the same sentence). The story-validator may use a full-paragraph or full-chapter scan. If the offending "her" is far from the name in ch2, the gate misses it and the validator catches it.

### Significance

This is more concerning than a simple pronoun error. The gate's *purpose* is to catch these cases before the story-validator. If the gate consistently under-reports and the story-validator consistently over-reports, every run is one story-validator call away from an abort that the gate could have prevented. The gate is not a reliable safety net.

### Investigation steps

1. Read `prose-consistency-validator.ts → checkPronounDrift` — identify the exact algorithm: character list source, detection window, skip conditions
2. Read the story-validator's `pronoun_gender_mismatch` detection — identify its algorithm
3. Construct the exact ch2 prose segment (from the checkpoint) and run both checks manually against it to confirm the divergence
4. Fix the gate to match or exceed the story-validator's detection scope

---

## Finding 2 — Temporal Context scoring: component failure overrides passing total score (bug)

### What happened

Temporal Context phase result:

| Metric | Value |
|--------|-------|
| validation_score | 100 |
| quality_score | 100 |
| completeness_score | 100 |
| consistency_score | 0 |
| **total** | **90** |
| threshold | 70 |
| passed | **false** ← bug |
| component_failures | ["consistency"] |
| Failing test | Season/weather consistency |
| Failing test severity | **minor** |

Total score = 90. Threshold = 70. 90 > 70. Phase should pass. Phase fails.

The phase fails because `component_failures: ["consistency"]` triggers an unconditional override that sets `passed = false` regardless of total score.

### Root cause

The consistency score is the average of consistency sub-tests. One sub-test (`Season/weather consistency`) scored 0. This pulls the consistency_score to 0. The scoring logic interprets `consistency_score = 0` as a component failure and sets `passed = false`.

But the **contribution** of this single test to the total score is small. With 13 tests passing at 100 and 1 test failing at 0, weight=1, the total correctly computes as 90. The component override then ignores that 90 and fails the phase.

This is made worse by the test's severity being **"minor"**. The severity field is returned in the test result but never read by the phase scoring logic. A minor severity sub-test has the same failure consequence as a critical one.

### Impact

This phase failure cost the run 1 of its 14 phases and put the summary in "1 phase failed" territory. Without this bug, the run would report 14/14 phases passed (with the abort still occurring due to story validation errors, but the scoring picture would be cleaner).

### Fix options

**Option A (preferred) — respect severity:** Only raise `component_failures` when a failing consistency test has severity `"major"` or `"critical"`. Minor failures accumulate into the score but don't trigger the override.

**Option B — score-gated override:** Only apply the `component_failures` override when `total < threshold`. If total passes, accept the phase regardless of component breakdown.

**Option C — make component_failures advisory:** Remove the override entirely. `component_failures` becomes a diagnostic label, not a pass/fail determiner. The threshold remains the sole arbiter.

Option A is the most targeted and least likely to have side effects. Option B is a one-line safety valve. Option C is the most principled but requires verifying no phase relies on component_failures as an intentional hard gate.

---

## Finding 3 — Detective name inconsistency as a new failure type

### What happened

The story-validator found a critical error:

> "Detective name switches between: Janet Warenne, Detective Warenne. Use ONE consistent name."

This aborted the run. The two forms `Janet Warenne` and `Detective Warenne` are semantically the same person. The validator treats them as inconsistent names.

### New failure type

This is a new category alongside the existing taxonomy:

| Type | Description | First observed |
|------|-------------|----------------|
| Type 1 | Victim identity continuity (victim treated as alive) | 2026-05-18 |
| Type 2 | Pronoun drift (wrong gender pronoun for character) | 2026-05-18 |
| **Type 3** | **Detective name inconsistency (name form varies across chapters)** | **2026-05-29** |

Type 3 is distinct from Type 2. Type 2 is a pronoun error. Type 3 is a name-form consistency error — the same person is addressed by multiple equivalent but textually-distinct forms.

### Root cause

Two causes operating together:

**Cause A — No canonical name form defined.** The character's name is "Janet Warenne" but no instruction specifies which form to use in prose. The LLM varies between formal (`Detective Warenne`, `Inspector Warenne`) and full-name (`Janet Warenne`) forms based on local narrative register. Both forms are natural English. Neither is wrong in isolation.

**Cause B — Story-validator uses exact-string matching.** The validator's `detective_name_inconsistency` check detects when more than one distinct name string is used for the detective. It does not apply equivalence rules (surname-only ≡ full-name, title+surname ≡ full-name). Any variation from a single canonical string is rejected.

### Solution space

**Prevention (preferred):** Inject a DETECTIVE NAME LOCK into every chapter prompt specifying exactly which form to use. The pronoun accuracy block already does this for pronouns — the same pattern applies to name form.

**Validator tolerance (alternative):** Update the story-validator to accept a configurable set of equivalent forms for the detective (e.g., `["Janet Warenne", "Warenne", "Miss Warenne"]`). Flag an inconsistency only when a form outside the accepted set appears, or when more than 2 distinct forms are used.

**Both together (belt-and-suspenders):** Prevention reduces generation of non-canonical forms; validator tolerance prevents false-positive aborts for acceptable formal variation.

### See also

`reviews/solution-ideas-type3-detective-name.md` — to be created when an implementation plan is ready.
