# ANALYSIS_26 — Locked Fact Value Omission & Pronoun Validator False Positives: Canary Failure Analysis & Remediation Plan
*Date: 2026-05-28 | Run: mystery-1779988420525 | Model: gpt-4.1-mini-2025-04-14*

---

## 1. Context

**Story:** "The Pendulum's False Hour"  
**Genre / Era:** Golden Age country-house murder, 1937  
**Method:** Mechanical clock-tampering — culprit advanced the grandfather clock by forty minutes to falsify time of death  
**Detective type:** Amateur (Eleanor Voss)  
**Cast:** Eleanor Voss (F, detective), Dr. Mallory Finch (F), Captain Ivor Hale (M, culprit), Beatrice Quill (F)  
**Location preset:** CountryHouse | **Target length:** Short | **Narrative style:** Classic

**Canary outcome:** FAILED — exit code 1  
**Validation summary:** 0 critical, 10 major, 13 moderate issues (23 total)  
**Prose quality:** All 10 chapters passed generation gate (scores 89–94/100, cumulative 95/100)  
**Pipeline abort point:** Final binding validation gate (post-atmosphere-repair)

**Key feature flags active this run:**
- `enableLockedFactRegistry: true` / `enableLockedFactGate: true`
- `enableCharacterBundle: true` / `enableBindingGates: true`
- `enableSurgicalFingerprintRetry: true` / `enableOutlineCompleteness: true`
- `pronoun_checking_enabled: false` ← repair pass **disabled**

**Locked facts established in CML:**

| Key | Canonical value |
|-----|-----------------|
| `clock_reading` | `"ten minutes past eleven"` |
| `tamper_amount` | `"forty minutes"` |
| `pendulum_length` | `"fourteen inches"` |
| `room_temperature` | `"seventy-two degrees Fahrenheit"` |

**Pre-prose gate results:**

| Gate | Result | Detail |
|------|--------|--------|
| Agent8-NoveltyAuditor | ✅ PASS | max similarity 0.46 (*The Mysterious Affair at Styles*) < 0.90 threshold |
| Agent6-FairPlayAuditor | ✅ PASS | |
| Agent6-BlindReader | ✅ PASS | |
| Agent2d-TemporalContext | ✅ PASS (retry) | attempt 2/2; "early spring" → "spring" enum normalisation |
| Agent2c-LocationProfiles | ✅ PASS | F5b warning: `estate_gardens` sensoryDetails verb bleed (non-blocking) |

---

## 2. Failure Inventory

### 2.1 Locked fact values missing from prose (`locked_fact_missing_value`)

**8 major errors** — two locked facts referenced in prose without their canonical values:

| Locked fact | Canonical value | Chapters missing value |
|-------------|----------------|------------------------|
| "Length of the pendulum rod measured after tampering" | `"fourteen inches"` | Ch1, Ch3, Ch6, Ch8 |
| "Recorded ambient temperature in the clock room at time of murder" | `"seventy-two degrees Fahrenheit"` | Ch3, Ch4, Ch6, Ch8 |

**Root cause:** The locked fact obligation block in Agent9's chapter prompt instructs prose generation to reference each locked fact but does **not** mandate that the exact canonical value string be present verbatim. The LLM correctly references the facts (e.g., "the pendulum's adjusted length", "the temperature of the clock room") without stating the numerical value. The locked fact gate at final validation checks for the canonical string — a check that passes in the LLM's obligation acknowledgement but fails in the generated prose.

This is a contract specificity gap: the obligation block says *reference the fact*, but the gate checks for *verbatim canonical value*.

### 2.2 Pronoun gender mismatch (`pronoun_gender_mismatch`) — ⚠️ VALIDATOR FALSE POSITIVES

**2 major errors reported** — post-run inspection of the actual prose confirms these are **validator false positives**. Captain Hale is correctly referred to with he/him/his throughout all 10 chapters.

**Triggering sentences and actual pronoun owners:**

| Chapter | Sentence that fires the error | Actual owner of she/her |
|---------|-------------------------------|-------------------------|
| Ch3 s40 | `Beatrice shifted uneasily in her seat, casting a furtive glance at Captain Hale.` | Beatrice Quill ("her seat") |
| Ch8 s26 | `"...Eleanor observed...She glanced toward Captain Hale, whose jaw tightened..."` | Eleanor Voss |
| Ch8 s57 | `Eleanor turned once more to Captain Hale, her voice calm but resolute.` | Eleanor Voss ("her voice") |

**Root cause — validator bug in `findIncorrectPronouns` (`character-validator.ts`):**

The `buildCharacterManifest` function generates character aliases as full name (`"eleanor voss"`) and surname (`"voss"`) only — **first names are never added as aliases**. The female competitor guard checks a ±10-sentence window for any female label to suppress false alarms. `femaleLabels` for this run = `["eleanor voss", "voss", "dr. mallory finch", "finch", "beatrice quill", "quill"]`.

Throughout the prose, Eleanor, Beatrice, and Mallory are predominantly referenced by first name only ("Eleanor noted", "Beatrice shifted"). These first-name forms do not match any entry in `femaleLabels`. When a sentence contains both a male character label (e.g., "Captain Hale") and a nearby female pronoun that belongs to Eleanor or Beatrice, the guard fails to suppress the error, producing a false positive `pronoun_gender_mismatch` for Hale.

### 2.3 Moderate validation issues (13 total) — all pronoun drift, all false positives

All 13 moderate issues are `pronoun_drift` errors caused by the same validator bug as §2.2:

| Character | Chapters | Trigger |
|-----------|----------|---------|
| Eleanor Voss | Ch1, Ch2, Ch3, Ch4, Ch5, Ch6, Ch8, Ch10 | Hale's he/him/his nearby; "Eleanor" not in male competitor labels |
| Captain Ivor Hale | Ch6, Ch10 | Eleanor/Beatrice she/her nearby; their first names not in female competitor labels |
| Beatrice Quill | Ch3, Ch8 | Hale's he/him/his nearby; "Beatrice" not in male competitor labels |

The `ProseConsistencyValidator.checkPronounDrift` similarly uses aliases built without first names, making it blind to first-name-only character references in the ±200-char prose window.

### Chapter-level prose scores

| Chapter | Title | Score | Attempts |
|---------|-------|-------|----------|
| Ch1 | Discovery of the Victim | 91/100 | 1 |
| Ch2 | Suspicious Clockwork | 91/100 | 1 |
| Ch3 | Witness Testimony and Clock Oddities | 91/100 | 1 |
| Ch4 | Stable Lantern Contradictions | 89/100 | 1 |
| Ch5 | Sundial and Time Discrepancies | 89/100 | 1 |
| Ch6 | Linking Evidence to Captain Hale | 89/100 | 1 |
| Ch7 | Alibi Cross-Checks | 90/100 | **3** |
| Ch8 | The Discriminating Test | 90/100 | 1 |
| Ch9 | Clearing the Innocent | 90/100 | 1 |
| Ch10 | Confrontation and Confession | 94/100 | 1 |

**Atmosphere repair** ran on: Ch1, Ch3, Ch4, Ch6, Ch8, Ch9, Ch10 (7 chapters).  
**Ch7 retry cause:** Opening paragraph location inventory failure (attempt 1 and 2 failed; passed on attempt 3).

---

## 3. Priority Classification

| ID | Failure class | Severity | Volume | Blocking? | Priority |
|----|---------------|----------|--------|-----------|----------|
| FIX-1 | Locked fact value omission | Major | 8 errors across 2 facts, 8 chapters | ✅ Yes | **P0** |
| FIX-2 | Validator false positive: pronoun alias incompleteness | Major (validator bug) | 2 major + 13 moderate, all false positives | ✅ Yes (blocks release gate) | **P1** |
| OBS-1 | Agent2d "early spring" enum retry | Minor | 1 occurrence (recurring) | ❌ No | P2 (track) |
| OBS-2 | Agent2c F5b sensoryDetails verb bleed | Warning | 1 location | ❌ No | P2 (track) |
| OBS-3 | Ch7 opening location inventory retry | Minor | 1 chapter, 2 extra attempts | ❌ No | P2 (track) |

---

## 3.5 Score Impact Estimates

### Baseline (this run)
| Metric | Value |
|--------|-------|
| Per-chapter prose scores | 89–94/100 |
| Cumulative prose score | 95/100 |
| Final run outcome | **FAILED** (pipeline abort) |
| Run score (canary) | 0 (aborted) |

### After FIX-1 (locked fact value enforcement)
- The 8 `locked_fact_missing_value` errors eliminated
- Does NOT unlock the gate alone — FIX-2 false positives are also blocking
- Apply alongside FIX-2 for full remediation

### After FIX-2 (validator alias completeness fix)
- All 15 false-positive pronoun errors (2 major + 13 moderate) eliminated
- No prose change needed — the LLM output is already correct
- Combined with FIX-1: run passes cleanly

### After both fixes
| Metric | Expected |
|--------|----------|
| Major errors | 0 |
| Moderate errors | 0 (all were false positives) |
| Run outcome | **passed** |
| Expected canary score | **90–95** |

---

## 4. Remediation Plan

### FIX-1 (P0): Enforce verbatim canonical value in locked fact obligation block

**File:** `apps/worker/src/jobs/agents/agent9-run.ts` (or the obligation-block builder it calls)  
**Symptom:** LLM references the fact concept but omits the canonical value string  
**Goal:** Make the obligation block explicitly mandate that the exact canonical value phrase appears in the prose

**Locate** the section that builds locked fact obligations in the chapter prompt. It will look something like:

```typescript
// Current (permissive — fact reference only):
lines.push(`• LOCKED FACT — ${fact.key}: Reference this fact in this chapter.`);
lines.push(`  Established value: "${fact.canonicalValue}"`);
```

**Change to (strict — verbatim enforcement):**

```typescript
// Updated (strict — verbatim value required):
lines.push(`• LOCKED FACT — ${fact.key}: You MUST include the EXACT phrase "${fact.canonicalValue}" ` +
           `verbatim in this chapter's prose when referring to ${fact.description}. ` +
           `Do NOT paraphrase the value. Write it exactly as given.`);
```

**Why this works:** The gate checks for the exact canonical string. The obligation block currently provides the value as context but does not make verbatim inclusion an explicit instruction. Changing `Reference this fact` to `include the EXACT phrase "${fact.canonicalValue}" verbatim` aligns the obligation contract with what the gate actually checks.

**Verification:** After the fix, run one targeted canary with the same locked facts active. Confirm that Ch1, Ch3, Ch6, Ch8 contain "fourteen inches" and Ch3, Ch4, Ch6, Ch8 contain "seventy-two degrees Fahrenheit".

**Scope risk:** Low — this is a prompt-only change within the locked fact obligation block. No structural changes to validation, scoring, or retry logic.

---

### FIX-2 (P1): Fix validator alias incompleteness — add first names to character labels

**File:** `packages/story-validation/src/character-validator.ts`  
**Function:** `buildCharacterManifest`  
**Symptom:** Female competitor guard in `findIncorrectPronouns` doesn't recognise first-name-only references to female characters ("Eleanor", "Beatrice"), causing false positive `pronoun_gender_mismatch` and `pronoun_drift` errors for co-located male characters.  
**Goal:** Add character first names to the alias map so the competitor guard fires correctly.

**Where:** The `buildCharacterManifest` function currently calls `addAlias(char.name)` (full name) and `addAlias(surname)` (surname). Add a first-name alias:

```typescript
// After the existing surname alias block:
const nameParts = char.name.trim().split(/\s+/);
// Skip leading titles; take the first non-title word as the first name
const firstName = nameParts.find(
  (part) => !/^(Dr|Mr|Mrs|Miss|Captain|Inspector|Sir)\.?$/i.test(part)
);
if (firstName && firstName.length >= 2) {
  addAlias(firstName, char.name);
}
```

For `"Captain Ivor Hale"` → first name = `"Ivor"` (skips "Captain")  
For `"Eleanor Voss"` → first name = `"Eleanor"`  
For `"Dr. Mallory Finch"` → first name = `"Mallory"` (skips "Dr.")  
For `"Beatrice Quill"` → first name = `"Beatrice"`

With this change, `femaleLabels` gains `"eleanor"`, `"mallory"`, `"beatrice"`. The competitor guard will correctly suppress all three triggering sentences (Ch3 s40, Ch8 s26, Ch8 s57) and the 13 drift errors.

**Verification:** Run `packages/story-validation` unit tests. Confirm the three false-positive sentences no longer fire `pronoun_gender_mismatch`, and that genuine pronoun errors (actual he→she swap) still fire correctly.

---

## 5. Expected Post-Fix Behaviour

### After FIX-1 only
- 8 `locked_fact_missing_value` errors removed
- Ch1, Ch3, Ch4, Ch6, Ch8 prose will contain verbatim canonical values
- Binding gate passes unless other major issues present
- Run still fails if FIX-2 not applied (pronoun errors remain)

### After FIX-2 only
- All 15 false-positive pronoun errors eliminated (0 major, 0 moderate)
- Run still fails if FIX-1 not applied (locked fact errors remain)

### After FIX-1 + FIX-2 (full remediation)
- 0 major errors
- 0 moderate errors (all were false positives)
- Binding gate passes
- Expected per-chapter scores unchanged (89–94 range; prose quality not impacted)
- Expected canary score: **90–95 / 100**
- Run outcome: `passed`

### Regression risks
- FIX-1 makes obligation block more prescriptive — monitor for cases where the verbatim value phrase is awkward in prose flow. If LLMs resist the instruction, add `(you may integrate this into a natural sentence)` as a softening qualifier.
- FIX-2 adds first names as aliases — verify that first names shared between characters don't create cross-character false suppression. For this cast, all first names are unique.

---

## 6. Secondary Observations

| Observation | Detail | Trend | Action |
|-------------|--------|-------|--------|
| Agent2d "early spring" → "spring" enum retry | Temporal context generation produced a non-enum season value on first attempt; self-healed on attempt 2 | Recurring (seen in ANALYSIS_24, ANALYSIS_25) | Consider adding season enum values to the Agent2d prompt to prevent first-attempt failures |
| Agent2c F5b warning: `estate_gardens` sensoryDetails verb bleed | Non-blocking warning; location profile for estate_gardens mixes verbs into sensoryDetails field | Recurring | Low priority — no test impact; consider a schema coercion pass if frequency increases |
| Ch7 opening location inventory retry (3 attempts) | First two attempts failed the opening paragraph location inventory check; passed on attempt 3 | Occasional | The retry mechanism is working correctly; no immediate fix needed |
| Atmosphere repair on 7 of 10 chapters | Ch1, Ch3, Ch4, Ch6, Ch8, Ch9, Ch10 required atmosphere repair | Similar to ANALYSIS_25 | Atmosphere repair pass is functioning as intended; worth tracking if the list grows |
| All pre-prose gates clean on first pass | NoveltyAuditor, FairPlay, BlindReader all passed immediately | Positive | Story concept quality is high; the two failure classes are validator bugs + LLM fact omission |
| Pronoun validator false positives | This run: 15 total (2 major + 13 moderate). Same bug likely explains pronoun errors in earlier runs | Recurring | FIX-2 (alias completeness) eliminates this class permanently across all casts |

---

## 7. Implementation Order

1. **FIX-2** (P1) — Add first names as aliases in `buildCharacterManifest` (`packages/story-validation/src/character-validator.ts`). Pure validator code change — no LLM prompt changes, no canary run required. Eliminates 15 false-positive errors immediately. Unit test is sufficient to verify. Implement first so the next canary run is not polluted by false positives.

2. **FIX-1** (P0) — Modify the locked fact obligation block in `agent9-run.ts` to mandate verbatim canonical value inclusion. Prompt-only change. Implement after FIX-2 so the next canary run cleanly verifies only the locked fact fix.

3. **OBS-1 investigation** — Trace the Agent2d "early spring" enum failure; consider adding season enum values to the Agent2d prompt (P2, next sprint).

---

*Document created from canary run mystery-1779988420525 on 2026-05-28.*
