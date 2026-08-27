# Story Review Analysis — Run F30 (Aborted: 4 Story Validation Errors)

> **Note:** This run (`run_f5a57100`) was aborted after prose generation due to story validation
> failure. No story `.md` file was written to disk. Analysis is based entirely on the scoring
> report at `apps/api/data/reports/proj_0678f676-ff32-4b36-8855-cbb3435c5e8b/run_f5a57100-564b-48db-92cf-58fc2c635238.json`.

---

## Progress Table

### Shipped Fixes

| ID | Validator Error Targeted | Fix Summary | Fix Type | Status | Code Location |
|----|--------------------------|-------------|----------|--------|--------------|
| — | — | — | — | — | — |

### Backlog

| ID | Category | Issue Cluster | Proposed Fix | Status | Code Location |
|----|----------|--------------|--------------|--------|--------------|
| F30-1 | Generic | `detective_name_inconsistency` (CRITICAL abort) | Add a DETECTIVE NAME LOCK block to every chapter prompt alongside the pronoun lock — canonical form injected as a STATE block; story-validator post-generation gate already in place | STATE | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts` — extend `buildPronounAccuracyBlock` or add `buildDetectiveNameLockBlock` |
| F30-2 | Generic | `pronoun_gender_mismatch` ×3 (MAJOR abort) | Prose gate coverage gap — gate reports 0 drift, validator finds 3 errors. See `reviews/findings-20260529-run-f30.md` Finding 1 | GATE | `packages/story-validation/src/prose-consistency-validator.ts → checkPronounDrift` |
| F30-3 | Bug | Temporal Context scoring override bug | consistency=0 on one minor sub-test causes component_failure which overrides total=90 > threshold=70. See `reviews/findings-20260529-run-f30.md` Finding 2 | BUG FIX | `packages/story-validation/src/` (phase scoring logic) |
| F30-4 | Generic | Cast relationship density 0.0 | Relationships in Cast Design must cross-reference other cast members by name — add instruction to agent2 cast prompt | CONSTRAINT | `packages/prompts-llm/src/agent2-cast/` — strengthen relationship generation instruction |
| F30-5 | Generic | Location sensory richness 52% | Location Profiles failing sensory richness QC threshold — add sensory detail instruction to agent2c location prompt | CONSTRAINT | `packages/prompts-llm/src/agent2c-location-profiles/` — add multi-sense targeting instruction |

**Status key:** 🔴 Not started · 🟡 In progress · 🟢 Done · ⬛ Deferred

---

## Step 1 — Run Data

**Run ID:** `run_f5a57100-564b-48db-92cf-58fc2c635238`
**Project ID:** `proj_0678f676-ff32-4b36-8855-cbb3435c5e8b`
**Generated at:** 2026-05-29T21:30:22Z (22:30 local)
**Overall score:** 74 / 100 (Grade C)
**Outcome:** `aborted` — Story validation failed: 1 critical, 3 major issues
**Total cost:** $0.1902
**Total duration:** 711,140ms (~11.9 min)
**Phases passed:** 13 / 14 (92.9% pass rate)

**Story title:** Not recorded — run aborted before prose output was written. Working title inferred from chapter headings: *"The Double Chime"* (a seaside hotel mystery centred on a lobby clock wound back 40 minutes).

**Cast summary:**
- Victim: unnamed (role label "the victim" used throughout — same pattern as T29 run)
- Investigator: Janet Warenne (female) — name inconsistency (CRITICAL abort cause)
- Culprit: Robert Quincy (male) — pronoun error ×2 (MAJOR abort cause)
- Suspect: Michael Brabazon (male) — pronoun error ×1 (MAJOR abort cause)
- Suspect: Frederick Rochford (male) — no errors
- Suspect: Antoinette Mandeville (female) — no errors

**Key mechanism:** Lobby clock wound back exactly 40 minutes (canonical: "ten minutes past eleven" face reading; tamper amount: "forty minutes") to create a false time of death. Secondary evidence: victim's wristwatch, elevator log, receptionist's log.

---

## Step 2 — Phase Score Summary

| Phase | Agent | Score | Grade | Passed | Notes |
|-------|-------|-------|-------|--------|-------|
| Setting Refinement | agent1 | 100 | A | ✅ | Perfect |
| Cast Design | agent2 | 88 | B | ✅ | Two quality failures: relationship density 0.0/char; relationships don't reference cast members |
| Background Context | agent2e | 98 | A | ✅ | Constraints only 90% complete |
| Hard Logic Devices | agent4 | 100 | A | ✅ | Perfect |
| CML Generation | agent3 | 100 | A | ✅ | Perfect — no structural revision needed |
| Novelty Audit | agent8 | 100 | A | ✅ | Skipped (no novel audit conflict) |
| Clue Distribution | agent5 | 96 | A | ✅ | 21 clues; completeness at 80% (1 test fail) |
| Fair-play Audit | agent6 | 100 | A | ✅ | Perfect |
| Character Profiles | agent2b | 100 | A | ✅ | Perfect |
| Location Profiles | agent2c | 90 | A | ✅ | Sensory richness 52% (quality check failing) |
| **Temporal Context** | **agent2d** | **90** | **A** | **❌ FAILED** | **Scoring bug: total=90 > threshold=70, but consistency=0 triggers component_failure override — marked failed despite passing threshold** |
| World Builder | agent65 | 100 | A | ✅ | Perfect |
| Narrative Outline | agent7 | 100 | A | ✅ | Perfect |
| Prose Generation | agent9 | 100 | A | ✅ | 21/21 clues visible; fair play 85/100 (ch5 timing); 4 chapter underflows; 2 linter failures |

**Weakest phase:** Cast Design (quality failures, though not abort cause)
**Strongest phase:** Prose Generation (100/A despite being followed by abort)

### 2.1 Failing tests detail

**Temporal Context — consistency failures:**

| Test | Category | Passed | Score | Message |
|------|----------|--------|-------|---------|
| Season/weather consistency | consistency | ❌ | 0 | Season and weather patterns conflict; severity=minor |

All other temporal context tests passed at 100. Total score = 90. Phase threshold = 70. **Score exceeds threshold, yet phase fails.** This is a scoring system bug: `component_failures: ["consistency"]` is set when ANY consistency test scores 0, and the scoring logic treats this as an unconditional phase failure regardless of total score. A "minor" severity conflict in a single sub-test should not abort a phase scoring 90/100.

**Cast Design — quality failures:**

| Test | Category | Passed | Score | Message |
|------|----------|--------|-------|---------|
| Relationship density | quality | ❌ | 0 | Only 0.0 per character |
| Relationships reference cast | quality | ❌ | 0 | Relationships don't reference other cast members; severity=minor |

Cast Design still passed overall (88 > threshold). These are quality signal only — no abort contribution.

**Location Profiles — quality failures:**

| Test | Category | Passed | Score | Message |
|------|----------|--------|-------|---------|
| Sensory richness | quality | ❌ | 51.5 | Average: 52% |

Phase still passed overall (90 > threshold). Quality signal only.

---

## Step 3 — Story Validator Error Summary

Abort message: `"Story validation failed: 1 critical, 3 major issues"`

| # | Type | Severity | Scene | Message | Story-specific? |
|---|------|----------|-------|---------|-----------------|
| 1 | `pronoun_gender_mismatch` | MAJOR | 2 | Robert Quincy should use he/him/his but found: her | No — Generic |
| 2 | `pronoun_gender_mismatch` | MAJOR | 2 | Michael Brabazon should use he/him/his but found: her | No — Generic |
| 3 | `pronoun_gender_mismatch` | MAJOR | 9 | Robert Quincy should use he/him/his but found: her | No — Generic |
| 4 | `detective_name_inconsistency` | CRITICAL | — | Detective name switches between: Janet Warenne, Detective Warenne. Use ONE consistent name. | No — Generic |

**Critical observation on gate coverage gap:**
The prose-generation gate (`entity_pronoun_drift_count=0` in the diagnostic) reported ZERO pronoun drift events during generation. The story-validator found THREE. These are different checks:
- The prose gate runs during chapter generation and checks a local character→pronoun mapping
- The story-validator runs post-generation against the final prose using its own detection pattern

The gate missed "her" applied to Robert Quincy and Michael Brabazon. This is a prose gate coverage gap — likely because both characters are in the same chapter (ch2) and the detection window or character list handling had an edge case.

**Prose generation metrics (despite abort):**
- Chapters generated: 10 / 10
- Total words: ~10,466 (sum of per-chapter counts below)
- Fair play clue visibility: 21/21 (100%)
- Fair play component score: 85/100 — timing violation in ch5
- Template linter: 2/12 checks failed (1 opening style entropy, 1 paragraph fingerprint)
- Recurring phrases: 15 detected; 7 repair phrases applied
- Batches with retries: 2 of 10 (20% retry rate)
- No rewrite passes; no repair passes

**Per-chapter word counts:**

| Ch | Title (condensed) | Words | Note |
|----|-------------------|-------|------|
| 1 | Discovery + Clock Anomaly | 1,164 | ✅ |
| 2 | Initial Examination of Lobby Clock | 1,087 | ✅ — contains pronoun errors for Quincy and Brabazon |
| 3 | Witnesses Recall the Double Chime | 1,212 | ✅ |
| 4 | Victim's Wristwatch + Elevator Evidence | 1,201 | ✅ |
| 5 | Receptionist's Log + Quincy's Arrival | 1,036 | ✅ — fair play timing violation |
| 6 | Interrogation of Michael Brabazon | 989 | ⚠️ underflow |
| 7 | Interrogation of Rochford + Elevator Log | 859 | ⚠️ underflow (worst) |
| 8 | Interrogation of Mandeville + Reception Log | 947 | ⚠️ underflow |
| 9 | Discriminating Test: Timed Comparison Trap | 1,007 | ✅ — contains pronoun error for Quincy |
| 10 | Suspect Clearance + Culprit Confrontation | 964 | ⚠️ underflow |

Underflow chapters (6, 7, 8, 10) are all from the interrogation and resolution phases — same pattern as T29 run.

---

## Step 4 — Strategic Fixes (Generic Issues Only)

---

### FIX-F30-1: Detective Name Lock STATE block (CRITICAL abort fix)

**Problem:** The story-validator rejects the run because the detective is called both "Janet Warenne" and "Detective Warenne" across chapters. This is the critical abort cause.

**Root cause:** There is no canonical name lock for the detective in the chapter prompt. The pronoun accuracy block handles pronouns but not naming consistency. The LLM alternates between formal address ("Detective Warenne") and the character's full name based on narrative context, and neither form is designated canonical.

**Fix type:** STATE

**Why this is high-confidence:**
This is a data-wiring fix, not a persuasion fix. The character name is already in the cast — it just needs to be injected as a canonical lock that specifies EXACTLY which form to use, in the same spirit as the pronoun lock:

```
── DETECTIVE NAME LOCK (CANONICAL) ──
Detective: Janet Warenne
In prose, always address her as "Warenne" (after first introduction as "Janet Warenne").
⛔ NEVER use "Detective Warenne" as a standalone form — use the surname "Warenne" alone OR
   the full name "Janet Warenne". The title "Detective" is not part of the canonical name.
```

The exact canonical form depends on the story setting — Victorian? 1940s? If she's a professional detective, "Miss Warenne" or "Inspector Warenne" may be appropriate. The fix is to define ONE canonical form in the character's CML entry or generation config, and inject it into the chapter prompt.

**Alternative simpler fix:** Update the story-validator to accept surname-only + title+surname as equivalent forms (i.e., treat "Warenne" and "Detective Warenne" as the same canonical reference). This is a validator tolerance fix rather than a generation fix. Lower confidence that this is the right semantic choice.

**Code location:**
- **Preferred:** `packages/prompts-llm/src/agent9-prose/prompt-builder.ts` — extend `buildPronounAccuracyBlock` (or create `buildDetectiveNameLockBlock`) to inject canonical detective name form into every chapter prompt
- **Alternative:** `packages/story-validation/src/story-validator.ts` (or equivalent) — add name-form equivalence rules to `detective_name_inconsistency` check

**Validator signal:** `detective_name_inconsistency` — expected to drop to zero; run no longer aborts for this reason

---

### FIX-F30-2: Prose gate coverage alignment for male→female pronoun errors (MAJOR abort fix ×3)

> Full analysis in `reviews/findings-20260529-run-f30.md` — Finding 1.

`entity_pronoun_drift_count=0` during prose generation; story-validator found 3 pronoun gender mismatches in the same prose. The gate has a coverage gap — most likely character candidate list capped or filtered for multi-male-character chapters.

**Fix type:** GATE (coverage expansion)  
**Code location:** `packages/story-validation/src/prose-consistency-validator.ts → checkPronounDrift`  
**Validator signal:** `pronoun_gender_mismatch` — all 3 cases caught at generation time before abort

---

### FIX-F30-3: Temporal Context scoring — component failure overrides passing total score (BUG)

> Full analysis in `reviews/findings-20260529-run-f30.md` — Finding 2.

Phase total=90, threshold=70 — should pass. `consistency_score=0` from one minor sub-test triggers `component_failures: ["consistency"]` which unconditionally sets `passed:false`. The severity field on the failing test (`"minor"`) is never read by the scoring logic.

**Fix type:** BUG FIX  
**Code location:** Phase scoring logic in `packages/story-validation/src/`  
**Validator signal:** Temporal Context no longer fails on minor consistency sub-test when total score exceeds threshold

---

### FIX-F30-4: Cast relationship cross-referencing (quality improvement)

**Problem:** Cast Design scores 88/100 but fails two quality tests: relationship density 0.0/character and relationships that don't reference other cast members by name. Characters exist as isolated profiles without connecting tissue.

**Root cause:** The agent2 cast prompt generates character descriptions and individual character relationships (e.g., "friend of Robert") but doesn't require that relationship descriptions name specific other cast members from the generated list.

**Fix type:** CONSTRAINT

**Fix description:**
In the cast generation prompt, add an explicit instruction:

```
Each character's "relationships" field MUST name at least two other members of this cast by
their full name. Example: "Known to Frederick Rochford as a fellow hotel guest; on chilly but
civil terms with Antoinette Mandeville since the Tuesday incident."
⛔ Generic relationship descriptors ("a fellow guest", "a business acquaintance") that do not
name another cast member are not acceptable.
```

**Code location:** `packages/prompts-llm/src/agent2-cast/` (cast design prompt) — add relationship cross-reference instruction

**Validator signal:** `cast_relationship_density` and `relationships_reference_cast` — both pass

---

### FIX-F30-5: Location sensory richness (quality improvement)

**Problem:** Location Profiles average sensory richness is 52% against a QC threshold of ~60%. Locations are visually described but lack sound, smell, texture, and temperature detail.

**Root cause:** Location profile generation prompt does not explicitly require multi-sensory coverage. Visual description is the default for most LLMs.

**Fix type:** CONSTRAINT

**Fix description:**
Add a sensory checklist to the agent2c location profile prompt:

```
For each location, include at least one specific detail for each of these senses:
  • SIGHT — light quality, colour, visual focal point
  • SOUND — ambient noise, echoes, silence quality
  • SMELL — distinctive scent, neutral/stale/fresh air
  • TEXTURE / TOUCH — surfaces, air temperature, humidity
⛔ A location description covering fewer than 3 of these 4 senses will fail quality validation.
```

**Code location:** `packages/prompts-llm/src/agent2c-location-profiles/` — add sensory checklist instruction

**Validator signal:** `sensory_richness` — target 80%+ average

---

## Step 5 — Fix Improvement Probability Assessment

### 5.1 — Per-Fix Probability Table

| Fix ID | Error Targeted | % chance resolves issue | Expected impact | Confidence | Reasoning |
|--------|---------------|------------------------|-----------------|------------|-----------|
| F30-1 | `detective_name_inconsistency` (CRITICAL) | 85–95% | Removes CRITICAL abort cause | 🔵 High | STATE fix — canonical name injection is deterministic once defined. Only uncertainty: what canonical form is correct for this story's register. |
| F30-2 | `pronoun_gender_mismatch` ×3 (MAJOR) | 70–85% | Removes 3 MAJOR abort causes | 🟡 Medium | Gate coverage fix — depends on correctly diagnosing WHY ch2 was missed. If it was a set-size bug, fix is straightforward. If it's an architectural gap, harder. |
| F30-3 | Temporal Context scoring bug | 90–98% | Removes 1 phase failure per minor consistency conflict | 🔵 High | Code bug, clearly identified. Single-line change to component failure logic. Risk: side-effects on phases that deliberately use component failure as an override (e.g., missing required fields). Scope fix tightly. |
| F30-4 | Cast relationship density | 75–85% | Improves Cast Design from 88 → 92–95 | 🔵 High | Constraint fix — naming specific cast members is a clear, verifiable rule. LLM compliance with explicit enumeration constraints is high. |
| F30-5 | Location sensory richness | 70–80% | Improves Location Profiles quality from 52% → 70%+ | 🔵 High | Multi-sense checklist is a well-established prompt technique. Main risk: LLM adds token-minimal sense references ("a hint of salt in the air") that satisfy the check formally but don't add real richness. |

### 5.2 — Abort Prevention Assessment

If F30-1 and F30-2 are both fixed, this run's abort is prevented. The 74 → effective outcome becomes approximately:

| Scenario | Conditions | Expected overall score |
|----------|------------|----------------------|
| **Abort prevented (baseline)** | F30-1 + F30-2 deployed; Temporal Context still wrongly fails | ~80–84 (one phase failure removed at scoring level, but temporal context still fails) |
| **Abort prevented + F30-3 bug fix** | F30-1 + F30-2 + F30-3 deployed; all phase failures corrected | ~85–90 (14/14 phases pass; prose 100/A; weakest is Cast Design 88) |
| **Full wave (F30-1 through F30-5)** | All fixes deployed | ~88–93 (Cast and Location scores improve; prose unchanged) |

**Note:** The abort itself is caused by the story-validator (not the scoring phases). Even if F30-3 fixes the temporal context scoring bug, the story-validator abort would still occur without F30-1 and F30-2. Priority order: **F30-1 → F30-2 → F30-3 → F30-4, F30-5**.

### 5.3 — Run Comparison: T29 vs. F30

| Dimension | T29 Run (story_20260529-2124) | F30 Run (this run) |
|-----------|-------------------------------|---------------------|
| Overall score | 67 / 100 | 74 / 100 |
| Abort? | No (completed) | Yes (story validation) |
| Phase failures | 0 / 14 | 1 / 14 (Temporal Context scoring bug) |
| Story validator errors | 0 | 4 (1 critical, 3 major) |
| Prose / polish | Poor (reviewer: 4/10) | Strong (system: 100/A) |
| Pronoun errors | Caught by reviewer | Caught by story-validator |
| Primary fix priority | Prose quality, pronoun gate | Detective name lock, pronoun gate coverage |

The F30 run represents an improvement in prose quality but a regression in story validator compliance. The pronoun gate coverage gap (F30-2) is a new failure mode not present in T29 — it should be investigated before any further runs.

---

## Step 6 — New Fixes

Ordered by implementation priority. Fixes marked 🔴 caused the abort and must ship before the next run.

| # | ID | Fix | Type | File(s) | Priority | Likelihood |
|---|-----|-----|------|---------|----------|------------|
| 1 | F30-1 | **Detective name lock** — inject canonical detective name form into every chapter prompt (`buildDetectiveNameLockBlock` or extend `buildPronounAccuracyBlock`) | STATE | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts` | 🔴 Abort fix | 85–95% |
| 2 | F30-2 | **Prose gate coverage gap** — `checkPronounDrift` misses male characters in multi-male chapters; align candidate list and detection window with story-validator scope | GATE | `packages/story-validation/src/prose-consistency-validator.ts` | 🔴 Abort fix | 70–85% |
| 3 | F30-3 | **Temporal Context scoring bug** — component failure overrides passing total score; respect `severity: "minor"` on failing sub-tests | BUG FIX | `packages/story-validation/src/` (phase scoring logic) | 🟡 Bug | 90–98% |
| 4 | F30-4 | **Cast relationship cross-referencing** — require relationships to name at least 2 cast members by full name in the agent2 cast prompt | CONSTRAINT | `packages/prompts-llm/src/agent2-cast/` | 🔵 Quality | 75–85% |
| 5 | F30-5 | **Location sensory richness** — add 4-sense checklist (sight / sound / smell / touch) to agent2c location profile prompt | CONSTRAINT | `packages/prompts-llm/src/agent2c-location-profiles/` | 🔵 Quality | 70–80% |

**Priority key:** 🔴 Abort fix (blocks next run) · 🟡 Bug (non-blocking but scored) · 🔵 Quality (score improvement)

Full analysis for F30-2 and F30-3: `reviews/findings-20260529-run-f30.md`
