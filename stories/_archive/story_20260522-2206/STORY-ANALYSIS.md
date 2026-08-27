# Story Review Analysis

## Progress Table

### Shipped Fixes

| ID | Validator Error Targeted | Fix Summary | Fix Type | Status | Code Location |
|----|--------------------------|-------------|----------|--------|--------------|
| A22-1 | `agent8_novelty` pipeline kill | Anti-Styles/inheritance-dispute hard exclusion in CML generation prompt | CONSTRAINT | Done | `agent3-cml.ts` |
| A22-2 | `identity_role_alias_break` (CRITICAL) | Identity stability NSD block for pre_climax/climax/resolution bans role-alias narrator drift | CONSTRAINT | Done | `prompt-builder.ts -> buildNSDBlock` |
| A22-3 | `cml_test_not_realized` (MAJOR) | DT fallback reminder injected for pre_climax/climax when DT scene is defined | CONSTRAINT | Done | `obligation-block.ts -> buildChapterObligationBlock` |
| A22-4 | `pronoun_drift` (MODERATE) | Competitor check narrowed from full paragraph to +/-200-char window | GATE | Done | `prose-consistency-validator.ts -> checkPronounDrift` |
| A22-5 | `opening_style_repetition` (MODERATE) | Rotation slot 6 changed from soft general-descriptive to hard expository setup | CONSTRAINT | Done | `context-management.ts -> OPENING_STYLE_ROTATION` |

### Backlog

| ID | Category | Issue Cluster | Proposed Fix | Status | Code Location |
|----|----------|--------------|--------------|--------|--------------|
| S2206-1 | Identity consistency | Victim unnamed and gender drift | Add victim identity lock in CML and chapter obligation block | Not started | `agent3-cml.ts`, `obligation-block.ts` |
| S2206-2 | Timeline logic | Incompatible times (10:20 vs 11:10 vs 11:50) | Add deterministic timeline equation contract and contradiction gate | Not started | `agent3-cml.ts`, `validation-pipeline.ts` |
| S2206-3 | Ending completeness | Confrontation without final proof/arrest/confession | Add resolution completion gate for final chapter | Not started | `agent9-validation.ts` |
| S2206-4 | Style quality | Template leakage and note-like lines in prose | Add micro-regeneration for note-like evidence lines and high n-gram blocks | Not started | `agent9-prose-generator.ts` |
| S2206-5 | Evidence coherence | Contradictory suspect clearance statements | Add suspect-clearance contract normalization with contradiction blocking | Not started | `obligation-block.ts`, `agent9-validation.ts` |
| S2206-6 | CML role integrity | Culprit assignment instability between CML and prose | Add culprit-role integrity gate and pre-prose lock verification | Not started | `agent3-cml.ts`, `agent9-validation.ts` |
| S2206-7 | Pronoun integrity | Persistent role-pronoun drift after retries | Add deterministic role-pronoun normalization pre-commit and reject residual mismatches | Not started | `agent9-prose-generator.ts`, `prose-consistency-validator.ts` |
| S2206-8 | Reveal logic completeness | Weak motive-means-opportunity proof chain | Add structured evidence-chain compiler for final reveal paragraph and gate for missing links | Not started | `agent9-validation.ts`, `obligation-block.ts` |

Status key: Not started, In progress, Done, Deferred

---

## Step 1 - Source Review

Source story: `stories/story_20260522-2206/`
Review file: `stories/story_20260522-2206/chatgpt-review.txt`
Review date: 2026-05-23
Score: 61 / 100

Cast summary:
- Victim: unnamed in draft (identity instability flagged)
- Investigator: Beatrice Quill (female)
- Culprit target: Captain Ivor Hale (male)
- Other principals: Eleanor Voss, Dr. Mallory Finch

Key mechanism:
- A tampered study clock creates a false timeline; the victim watch vs clock mismatch is the discriminating evidence path.

---

## Step 2 - Issue Triage by Scoring Category

### 2.1 Premise / concept (score: 7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Core mechanism is good, but motive details for Hale remain underdeveloped | 5, 9 | Story-specific |

### 2.2 Opening hook (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Strong setup (body, storm, stuck clock), but opening includes awkward wording and unclear victim identity | 1 | Story-specific |

### 2.3 Plot structure (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Investigation pipeline exists (alibis, cross-check, confrontation) but no complete final reveal arc | 7-9 | Generic |
| Final chapter ends at accusation pressure, not solved proof chain | 9 | Generic |

### 2.4 Character clarity (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Victim remains unnamed and gender usage drifts | 1, 6 | Generic |
| Pronoun drift for Beatrice and Hale damages readability and role clarity | 2, 5, 7, 9 | Generic |

### 2.5 Dialogue (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Dialogue often becomes explanatory plot dump instead of character-driven exchange | 2, 5, 9 | Generic |

### 2.6 Atmosphere / setting (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Repetitive generated location lead-ins and pasted setting fragments | 2, 3, 5, 7, 8 | Generic |

### 2.7 Mystery clues / evidence logic (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Clock math is inconsistent across chapters (10:20, 11:10, 11:50, 11:15) | 3, 4, 6, 8, 9 | Generic |
| Discriminating test is present but under-specified in mechanism details | 7 | Generic |
| Some clue statements appear as planning notes rather than narrative evidence | 6 | Generic |

### 2.8 Pacing (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Repetition of same clock contradiction and suspect-clearing beats slows momentum | 3-9 | Generic |

### 2.9 Ending / reveal (score: 4/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| No confession/arrest/final proof sequence; reveal is incomplete | 9 | Generic |
| Suspect-clearing language conflicts with accusation target | 8-9 | Generic |

### 2.10 Prose / polish (score: 4/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Pronoun slips and awkward phrasing remain after retries | 2, 5, 7, 9 | Generic |
| Template-like line reuse and note-like declarative artifacts remain | 3, 6, 9 | Generic |

---

## Step 3 - Validator Error Summary

Run context used for mapping:
- canary core run ending in `RUN_ID mystery-1779481632117`
- `CANARY_STATUS warning`
- prose generation required retries in 6/9 chapter batches

| Error type | Severity | Count | Scoring category | Story-specific? |
|------------|----------|-------|-----------------|-----------------|
| `pronoun_drift` | MODERATE | 3+ chapter batches flagged | Character clarity, Prose | Generic |
| `chapter_opening_weak_sensory_grounding` | MODERATE | 3 chapter batches flagged | Opening hook, Atmosphere | Generic |
| `template_linter_repeated_fingerprint` | MODERATE | 2 chapter batches flagged | Prose / polish, Pacing | Generic |
| `template_linter_high_ngram_overlap` | MODERATE | 1 chapter batch flagged | Prose / polish | Generic |
| `final_chapter_no_resolution_event` | MAJOR | 1 | Ending / reveal | Generic |
| `clue_obligation_suspect_clearance_missing` | MAJOR | 3 suspect obligations in one batch | Mystery clues / evidence logic | Generic |
| `chapter_non_convergent_template_or_continuity` | MAJOR | 2 | Plot structure, Prose | Generic |
| `inference_coverage_missing_discriminating_evidence_ids` | CRITICAL warning gate | 1 | Mystery clues / evidence logic | Generic |
| `cml_culprit_assignment_likely_invalid` | MAJOR warning | 1 | Plot structure, Ending / reveal | Story-specific |

---

## Step 4 - Strategic Fixes (Generic Issues Only)

### FIX-S2206-1: Victim Identity Lock

Problem:
- Victim name and gender are unstable, causing clarity breaks and downstream pronoun confusion.

Root cause:
- CML and chapter obligation prompts do not enforce immutable victim identity tokens in every chapter.

Fix type:
- STATE + GATE

Fix description:
- Add immutable victim identity block injected into every chapter prompt.
- Add post-chapter gate that rejects chapter text if victim identity token mismatches canonical value.

Code location:
- `agent3-cml.ts`, `obligation-block.ts`, `prose-consistency-validator.ts`

Validator signal:
- Reduces identity/pronoun drift and victim-reference inconsistency.

### FIX-S2206-2: Timeline Equation Contract

Problem:
- Clock math contradicts itself across chapters.

Root cause:
- Timeline facts are expressed as natural language fragments without a deterministic conversion contract.

Fix type:
- SCHEMA + GATE

Fix description:
- Add structured timeline fields: displayed_clock_time, offset_minutes, true_time, discovery_time.
- Validate each chapter against equation: true_time = displayed_clock_time +/- offset_minutes.

Code location:
- `agent3-cml.ts`, `agent9-validation.ts`

Validator signal:
- Eliminates incompatible time statements and contradiction churn.

### FIX-S2206-3: Resolution Completion Gate

Problem:
- Final chapter often ends with confrontation but not solved proof closure.

Root cause:
- Final chapter acceptance criteria do not require all reveal components.

Fix type:
- GATE

Fix description:
- Require final chapter to include all four: culprit naming, motive, means/opportunity linkage, and legal/social outcome (confession/arrest/formal accusation with evidence).

Code location:
- `agent9-validation.ts`

Validator signal:
- Eliminates `final_chapter_no_resolution_event` failures.

### FIX-S2206-4: Anti-Template Micro-Regeneration

Problem:
- Repeated scaffold lines and note-like evidence lines persist.

Root cause:
- Current retries regenerate whole sections but do not force targeted replacement of template artifacts.

Fix type:
- MICRO-REGEN + GATE

Fix description:
- Add sentence-level detector for note-like patterns (for example "Eliminates X because...").
- Replace only offending lines with diegetic observation/dialogue alternatives.

Code location:
- `agent9-prose-generator.ts`, `template-linter.ts`

Validator signal:
- Reduces n-gram overlap, repeated fingerprint, and planning-note leakage.

### FIX-S2206-5: Suspect-Clearance Contract Normalization

Problem:
- Clearance obligations are sometimes injected in unnatural or contradictory form.

Root cause:
- Obligation contract enforces literal tokens but does not enforce narrative coherence constraints.

Fix type:
- CONSTRAINT + GATE

Fix description:
- Keep obligation IDs, but require coherent local context: suspect cleared only if not the final culprit and statement aligns with chapter role.
- Add contradiction check between "cleared" lines and culprit target in same chapter.

Code location:
- `obligation-block.ts`, `agent9-validation.ts`

Validator signal:
- Reduces contradictory suspect-clearance artifacts and retry loops.

### FIX-S2206-6: Culprit Role Integrity Gate

Problem:
- CML culprit identity can drift or conflict with prose-stage suspect clearances.

Root cause:
- There is no hard pre-prose integrity check that enforces one canonical culprit and blocks clearance text for that actor.

Fix type:
- SCHEMA + GATE

Fix description:
- Add canonical culprit lock (name, role, gender) at handoff from CML to prose.
- Reject chapters that mark canonical culprit as cleared or ineligible.

Code location:
- `agent3-cml.ts`, `agent9-validation.ts`

Validator signal:
- Reduces culprit-assignment instability and endgame contradiction failures.

### FIX-S2206-7: Deterministic Pronoun Integrity Sweep

Problem:
- Pronoun drift remains in multiple chapters even after retries.

Root cause:
- Pronoun correction is currently partially heuristic and can regress during later regeneration attempts.

Fix type:
- STATE + GATE

Fix description:
- Build per-character immutable pronoun map from cast metadata.
- Apply deterministic replacement pass constrained by named-entity windows.
- Reject chapter output if any cast pronoun violation remains after sweep.

Code location:
- `agent9-prose-generator.ts`, `prose-consistency-validator.ts`

Validator signal:
- Eliminates recurring `pronoun_drift` loops and improves character clarity/polish.

### FIX-S2206-8: Final Reveal Evidence-Chain Compiler

Problem:
- Final reveal scenes can name a suspect without delivering a fully coherent proof chain.

Root cause:
- The final chapter prompt does not force explicit assembly of motive, means, opportunity, and clock-test linkage in one connected block.

Fix type:
- CHAIN + GATE

Fix description:
- Compile a structured reveal card before final chapter generation:
	- motive fact
	- means fact
	- opportunity window
	- discriminating test result
	- culprit-specific contradiction
- Require final chapter to include all reveal-card elements with evidence connectors.

Code location:
- `agent9-validation.ts`, `obligation-block.ts`

Validator signal:
- Reduces incomplete reveal outcomes and raises ending/reveal score reliability.

---

## Step 5 - Fix Improvement Probability Assessment

Probability method:
- Baseline chance = current estimate with existing implementation.
- Hardened chance = estimate after adding deterministic gating and contradiction blocking.
- Target is to maximize score-improvement reliability, not only peak upside.

Two additional passes completed in this revision:
- Pass A (Reliability hardening): S2206-7 added and Wave 1 reprioritized around deterministic consistency gates.
- Pass B (Score amplification): S2206-8 added to force a complete, evidence-linked final reveal.

### 5.1 Per-Fix Probability Table

| Fix ID | Scoring category affected | Baseline chance improves score | Hardened chance improves score | Expected point gain (if it fires) | Confidence after hardening | Uplift strategy |
|--------|--------------------------|--------------------------------|--------------------------------|-----------------------------------|----------------------------|----------------|
| S2206-1 | Character clarity, Prose | 75-90% | 90-96% | +3 to +6 | High | Hard fail on victim-name/gender mismatch per chapter |
| S2206-2 | Mystery clues, Plot structure | 70-85% | 88-95% | +4 to +8 | High | Deterministic timeline equation check with chapter-level rejection |
| S2206-3 | Ending / reveal | 65-80% | 85-92% | +4 to +7 | High | Force final-chapter reveal schema with mandatory proof-chain slots |
| S2206-4 | Prose / polish, Pacing | 60-75% | 78-88% | +2 to +5 | Medium | Sentence-level micro-regen for n-gram and note-like artifacts |
| S2206-5 | Mystery clues, Ending consistency | 60-75% | 82-90% | +2 to +4 | Medium-High | Block suspect-clearance lines that contradict canonical culprit |
| S2206-6 | Plot structure, Ending consistency | 45-60% | 80-90% | +3 to +6 | Medium-High | Pre-prose culprit-role lock and contradiction gate in validation |
| S2206-7 | Character clarity, Prose | 65-78% | 90-96% | +3 to +5 | High | Deterministic cast-pronoun map with post-sweep hard reject |
| S2206-8 | Ending / reveal, Mystery clues | 50-68% | 84-92% | +4 to +7 | Medium-High | Reveal-card chain ensures motive-means-opportunity-test linkage |

### 5.2 Combined Scenario Forecast

Baseline score (review): 61/100

| Scenario | Fixes firing | Score delta | Resulting score |
|----------|-------------|-------------|-----------------|
| Pessimistic | S2206-1 + S2206-2 + S2206-7 (partial) | +7 to +11 | 68 to 72 |
| Central | S2206-1 + S2206-2 + S2206-3 + S2206-6 + S2206-7 | +15 to +23 | 76 to 84 |
| Optimistic | All fixes S2206-1 through S2206-8 | +22 to +31 | 83 to 92 |

### 5.3 Post-Run Actuals

| Metric | Pre-fix baseline | Post-fix (canary YYYY-MM-DD) | Delta |
|--------|-----------------|------------------------------|-------|
| Overall score | 61/100 | TBD | TBD |
| `pronoun_drift` count | multi-chapter recurring | TBD | TBD |
| `final_chapter_no_resolution_event` count | 1 | TBD | TBD |
| `template_linter` issues | recurring | TBD | TBD |
| `culprit_assignment_or_clearance_conflict` count | recurring warning pattern | TBD | TBD |
| `final_reveal_chain_missing_link` count | recurring soft failure pattern | TBD | TBD |
| Pipeline survival rate (N runs) | warning pass in latest run | TBD | TBD |

---

## Step 6 - Implementation Waves

| Wave | Fix IDs | Target score gain | Effort | Dependency |
|------|---------|-------------------|--------|------------|
| Wave 1 | S2206-1, S2206-2, S2206-6, S2206-7 | +13 to +20 | Medium | None |
| Wave 2 | S2206-3, S2206-5, S2206-8 | +7 to +12 | Medium | Wave 1 complete |
| Wave 3 | S2206-4 | +2 to +5 | Low-Med | Wave 2 complete |

Target:
- Raise story quality from 61 toward 82+ with deterministic identity/timeline consistency and a fully evidenced final reveal.
