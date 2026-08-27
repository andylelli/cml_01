# Run Debrief — story_20260613-2133
**Run ID:** run_52999c10-8f10-4a61-8310-338bb73257b2  
**Date:** 2026-06-13 20:23 UTC (run start)  
**Model:** Azure OpenAI endpoint (pipeline defaults)  
**Theme:** Country-house clock-tampering murder with soot-line, wax-seal, and temperature contradiction chain  
**Cast:** Ellen Lacy (detective), Felix Vautier, Phyllis Lisle, Ronald Somerville, Juliette Drury (culprit: Felix Vautier)  
**Victim:** Felix Vautier (as generated), estate steward

---

## 1. Run Summary

All pipeline agents completed and the story reached full 10-chapter output, but quality stability was weak: 8 chapter batches required retries, 3 chapters exhausted all 6 attempts and were forced through completion fallback, and the run ended with warning status. Structurally the system still reported high cumulative prose score (98/100), but the generated text contains a story-breaking continuity contradiction: Felix Vautier is presented as the body in Chapter 1 and then appears alive in later chapters, including as the culprit in the confession arc. This contradiction dominates reader impact and explains the low external quality assessment.

### Pipeline Timing

| Phase | Duration | Notes |
|---|---|---|
| Agents 1–8 (structure) | ~3.0 min | All major upstream phases passed; clue system used deterministic remediation mode and seeded discriminating evidence IDs |
| Agent 9 prose (10 ch.) | ~6.5 min | 8 chapter batches required retries; Ch3, Ch7, Ch9 exhausted all attempts and used fallback completion |
| Atmosphere/encoding repair | ~<30 sec | Auto-fixes applied for encoding issues in validation phase |
| Release gate | PASS (warning) | Run completed with warning status, not hard failure |

### Per-Chapter Data

| Ch | Title | Words | System Score |
|---|---|---|---|
| 1 | Discovery | 901 | 93/100 |
| 2 | Conflicting Times | 1380 | 94/100 |
| 3 | Signs of Tampering | 445 | 78/100 |
| 4 | Thermometer and Witnesses | 1103 | 93/100 |
| 5 | Felix's Opportunity | 1085 | 84/100 |
| 6 | Clearing the Others | 1120 | 90/100 |
| 7 | Red Herrings and Doubts | 332 | 84/100 |
| 8 | Preparing the Test | 1011 | 94/100 |
| 9 | Discriminating Test | 320 | 80/100 |
| 10 | Clearance and Confrontation | 922 | 93/100 |
| **Total** |  | **8619** | **Cumulative: 98/100** |

### Retry Log

| Ch | Attempt | Failure Type | Resolution |
|---|---|---|---|
| 1 | 1 | template linter opener repetition (ellen s) | Passed on attempt 2 |
| 3 | 1–6 | template linter opener repetition (ellen paused) | Retry exhausted, forced completion fallback |
| 4 | 1 | template linter opener repetition (ellen s) | Passed on attempt 2 |
| 5 | 1 | stage mode suspect_pressure violation (premature culprit resolution) | Passed on attempt 2 |
| 7 | 1–6 | stage mode suspect_pressure violation | Retry exhausted, forced completion fallback |
| 8 | 1 | scene cast coverage missing (Ellen Lacy absent by name) | Passed on attempt 2 |
| 9 | 1–6 | stage mode suspect_pressure violation (initially with 2 issues, then 1) | Retry exhausted, forced completion fallback |
| 10 | 1–2 | boundary integrity (unbalanced quotation marks) | Passed on attempt 3 |

---

## 2. Score Analysis — System vs External

| Measure | Value |
|---|---|
| System cumulative prose score | **98/100** |
| External review score | **53/100** |
| Gap | **45 points** |

The score gap is structural, not incidental. The internal score heavily rewards contract compliance, chapter-level validation, and formal clue scaffolding. The external score is dominated by reader-visible coherence and narrative trust. A single continuity collapse (dead victim later alive and then culprit) outweighs many internally valid signals. This run demonstrates that current internal scoring overestimates quality when identity continuity is broken.

---

## 3. Full Story Analysis

### 3.1 Strengths

- The physical mechanism chain is strong and memorable: soot line inside dial glass, wax-seal cooling asymmetry, and mantle thermometer readings create a forensic-style deduction path.
- The clue architecture is mostly fair-play in intent: contradictions are physically grounded, not purely confessional.
- Supporting cast has distinct social positions and can generate motive pressure in principle.
- The run preserves chapter progression and reaches full completion even under repeated retries/fallbacks.
- Several chapters (2, 4, 6) sustain atmosphere and investigative momentum well enough to show the pipeline can produce credible scene texture when not derailed by structural faults.

### 3.2 Issues by Chapter

**Chapter 1** — Strong atmosphere and clue hook, but fatal setup bug: Felix is declared the victim body. This invalidates later arc logic.

**Chapter 2** — Felix appears alive and is questioned, directly contradicting Chapter 1. Also shows pronoun instability and repeated over-explanation of the clock contradiction.

**Chapter 3** — Extremely short (445 words), retry-exhaustion fallback artifact, and explicit prompt/validator leakage language appears in prose. Narrative voice collapses into report mode.

**Chapter 4** — Better evidence integration (thermometer + witness consistency), but repetition remains heavy and the Felix-as-victim contradiction persists underneath all deductions.

**Chapter 5** — Strong suspect-pressure concept and ledger motive pressure, but the chapter still relies on a character who was already established as dead. Stage-mode compliance needed retry.

**Chapter 6** — Functional suspect clearing chapter with decent evidentiary sequencing; still carries pronoun slips and timeline exposition repetition.

**Chapter 7** — Severely underlength (332 words), retry-exhaustion fallback, and obvious meta leakage in prose. This reads as scaffold residue rather than finished chapter content.

**Chapter 8** — Better length and setup intent, but still drifts toward recap instead of staging the discriminating test physically. Required cast-coverage retry.

**Chapter 9** — Severely underlength (320 words), retry-exhaustion fallback, and fails to execute a full discriminating test scene despite chapter role.

**Chapter 10** — Confession function is present and clearer than mid-run chapters, but narrative logic remains invalid because culprit identity conflicts with Chapter 1 victim declaration. Boundary-integrity quote issues required retries.

### 3.3 Global Prose Issues

- **Victim-Culprit Identity Collapse:** Felix is corpse in Chapter 1, then active suspect, then culprit confession source. This is the run-breaking defect.
- **Prompt/Validation Leakage:** Multiple chapters include system-contract phrasing in narrative text, especially in fallback-heavy chapters.
- **Retry-Exhaustion Short Chapters:** Chapters 3, 7, and 9 are far below target length and read like compressed recovery outputs.
- **Stage-Mode Noncompliance Recurrence:** suspect_pressure mode repeatedly tries to resolve culprit too early (Ch5/Ch7/Ch9).
- **Pronoun and Reference Instability:** Character pronouns and references drift, reducing clarity and trust.
- **Scoring-Report Integrity Warning:** nsd_revealed_clues_missing_evidence_anchors warning indicates mismatch between revealed clue IDs and anchor trace completeness.

---

## 4. Improvement Proposals

Target: raise external score from 53 to 75.  
Realistic ceiling with current architecture: 76–80 if identity continuity and leakage controls are fixed.

### Type A — Structural / Outline Changes (pre-prose, Agent 3/7)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| A1 | Add hard mutual-exclusion invariant: victim name cannot appear in active cast scenes after death confirmation | 10/10 | Must fail-fast before prose generation when violated |
| A2 | Add chapter-role contract for Ch8 and Ch9 (test setup vs test execution) with strict non-overlap | 8/10 | Prevents recap-only Ch8 and empty Ch9 |

### Type B — Prose Prompt Constraints (Agent 9)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| B1 | Enforce anti-leakage post-filter for known scaffold phrases before commit | 9/10 | Blocks lines like chapter progress/meta validation prose |
| B2 | Add minimum-content fallback floor for forced completion chapters (hard minimum 850 words for short mode) | 8/10 | Reduces collapsed fallback artifacts |
| B3 | Add explicit suspect_pressure no-resolution clause in obligations and final-attempt packet | 8/10 | Recurring failure class in this run |

### Type C — Scoring / Validation

| # | Change | Likelihood | Notes |
|---|---|---|---|
| C1 | Add identity continuity gate to weighted score (hard penalty to <=60 if corpse reappears alive) | 10/10 | Aligns system score with reader reality |
| C2 | Keep NSD anchor parity synthetic backstop, but log anchor quality class in report | 7/10 | Preserves invariants while exposing weaker evidence extraction |

### Type D — Atmosphere / Polish

| # | Change | Likelihood | Notes |
|---|---|---|---|
| D1 | Add chapter-level anti-repetition lexical pressure for recurring mechanism phrasing | 6/10 | Useful but secondary to continuity hard-fix |

---

## 5. Realistic Path to 75/100

The fastest path is not stylistic tuning; it is continuity hardening. As long as identity continuity can break, any prose gains are non-durable and external scoring remains capped.

**Conservative scenario (A1, B1, C1):**  
- Block victim/culprit identity contradictions before prose  
- Remove obvious system leakage from generated text  
- Penalize continuity collapse in internal scoring so regressions are visible immediately  
Estimated improvement: +14 to +18 points. New range: **67–71/100**.

**Optimistic scenario (above + A2, B2, B3, C2):**  
- Stabilize Ch8-Ch9 test flow  
- Prevent short fallback collapse from shipping as final chapter quality  
- Reduce recurrent stage-mode violations and preserve report reliability telemetry  
Estimated improvement: +20 to +27 points. New range: **73–80/100**.

The optimistic path is achievable in one focused cycle if changes are implemented as deterministic gates rather than optional prompt hints.

---

## 6. Difficulties and Limitations

**6.1 Contract Following Under Retry Stress**  
When retries accumulate, the model increasingly defaults to compressed, meta, or scaffold-like language. Prompt instructions alone are insufficient to guarantee narrative purity under exhaustion.

**6.2 Internal Score Misalignment**  
A structurally invalid story can still score very highly when formal chapter gates pass. Without continuity-weighted penalties, internal metrics are not trustworthy for release quality.

**6.3 Stage-Mode Drift**  
suspect_pressure chapters repeatedly trend toward premature resolution unless constraints are reinforced both in obligations and retry packets.

**6.4 Fallback Quality Collapse**  
Current completion-first fallback protects throughput but can produce chapters too short to carry narrative function, especially in middle-late acts.

**6.5 Evidence Trace vs Evidence Presence**  
A clue can be marked revealed without robust quote extraction in the same batch, creating report integrity friction unless parity backstops are explicit.

**6.6 Realistic Ceiling**  
With current architecture, 90+ external quality is unrealistic without stronger base generation fidelity and larger structural planning context. 76–80 is a practical near-term ceiling.

---

## 7. Novel Approaches to the Improvement Process

**7.1 Identity Ledger with Immutable State Transitions**  
Introduce an entity-state ledger where each named character has lifecycle states (alive, deceased, unknown, cleared, culprit) and state transitions are one-way where appropriate. Prose generation must query this ledger per chapter. If a chapter proposes a contradictory state, generation is rejected pre-commit. Cost is moderate (new shared state object + validators), benefit is very high because it removes an entire class of catastrophic continuity failures.

**7.2 Dual-Pass Narrative Compiler (Logic then Style)**  
First pass emits a compact logic script (scene beats, who appears, clue acts, constraints). Second pass renders literary prose from the locked script. This separates brittle logic from stylistic variance. Cost is medium-high (new intermediate artifact and prompts), benefit is high for consistency and stage-mode compliance.

**7.3 Failure-Class Specific Retry Models**  
Instead of one generic retry packet, route by failure type to targeted micro-prompts (identity continuity, stage-mode, quote integrity, opener diversity). Maintain per-class memory and decayed penalties. Cost is medium, benefit high for reducing repeated same-class retries and exhausting loops.

**7.4 Dynamic Fallback Expansion Pass**  
When fallback is triggered, run a deterministic expansion pass that injects required scene actions and dialogue anchors to reach chapter floor with coherent structure. This avoids shipping 300–450 word collapse chapters. Cost is medium, benefit high for reader continuity.

**7.5 Reader-Trust Sentinel Score**  
Add a separate trust score based on high-impact defects: identity contradictions, impossible timelines, unresolved cast placeholders, and meta leakage. Make release status depend on both structural score and trust score. Cost is low-medium, benefit very high because it aligns deployment decisions with human perception.

---

## 8. Summary of Priorities

| Priority | Change | Type | Likelihood |
|---|---|---|---|
| 1 | Hard victim/cast continuity gate with fail-fast | Validation | 10/10 |
| 2 | Continuity-aware scoring penalty and release block | Scoring/Validation | 10/10 |
| 3 | Anti-leakage narrative sanitizer before commit | Prompt/Validation | 9/10 |
| 4 | suspect_pressure explicit prohibition in obligation + retry final-attempt packet | Prompt | 8/10 |
| 5 | Ch8/Ch9 chapter-role split contract with deterministic checks | Outline/Validation | 8/10 |
| 6 | Fallback minimum chapter floor with expansion pass | Validation/Generation | 8/10 |
| 7 | NSD anchor quality class in report diagnostics | Validation/Reporting | 7/10 |
| 8 | Mechanism phrase anti-repetition pressure | Prompt/Polish | 6/10 |

**Implementation status:** Debrief created from run evidence and review signals. No additional code changes applied in this debrief step.
