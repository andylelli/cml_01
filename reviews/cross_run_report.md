# Cross-Run Failure Report

**Compiled:** 2026-03-08  
**Runs covered:** project_20, proj_7aa0771d, proj_60cfc60c, project_30 (run_a999b9a4), run_33 (run_f1cc0440), run_34 (run_eebf98f8), run_35 (run_2c17609e)  
**Scope:** All reviews in `reviews/` — early informal reviews in `run_reviews.md`, plus run_review_30.md, run_review_33.md, run_review_34.md, run_review_35.md

---

## Executive summary

We have been running since project_20. Every run has failed one or more gate checks. The pattern is not random — the same root causes repeat across every generation cycle regardless of the fixes applied. The core problem is a **structural disconnect between the storyline planning layer (CML, narrative outline) and the prose execution layer**. The planning layer produces near-perfect scores (95–100/A in every run). The prose layer consistently fails to honour those plans. Three fixes have been built, shipped, and confirmed active (P1-A through P1-F, P2-A) without changing the outcome at all. One root cause — P2-C (deterministic clue pre-assignment) — remains unimplemented and is responsible for three consecutive gate failures.

---

## Issue 1 — Clue visibility: 0/N in every run since run_33

**Severity:** S0 Critical — blocking gate failure  
**Runs affected:** run_33 · run_34 · run_35  
**Gate impact:** All three runs failed the prose quality gate on this check alone.

| Run | Required | Surfaced | Score |
|---|---|---|---|
| run_33 | 1 | 0 | 0 |
| run_34 | 1 | 0 | 0 |
| run_35 | 3 | 0 | 0 |

**Why it keeps failing:**

Every fix has targeted the plumbing between the clue data and the prose prompt, not the structural problem upstream. The actual cause is that the narrative outline consistently places clue anchors in only 25–38% of scenes (5/20, 4/18, 6/16 in runs 33–35), so the majority of critical clues have no scene anchor. When a clue has no anchor, `buildClueDescriptionBlock` (P1-B) cannot inject its description, and the prose agent never receives an instruction to surface it.

The pacing gate (P1-C) correctly detects this and retries `formatNarrative` with a count constraint. But the LLM ignores that constraint in every run. The retry has never once improved the clue count enough to pass the threshold.

**What was fixed:**
- P1-A: corrected `scene.actNumber → scene.act` field bug (structural fix, correct)
- P1-B: wired clue descriptions into the prose system prompt (structural fix, correct; only helps scenes that already have clue anchors)
- P1-C: added pacing gate with retry (gate fires correctly; retry is ineffective)
- P2-A: corrected the retry threshold computation (gate arithmetic is now right; retry still ineffective)

**What was not fixed:**
- **P2-C: deterministic clue pre-assignment** — the only fix that would actually work. When the pacing gate fails, skip the ineffective LLM retry and instead algorithmically distribute clue IDs across scenes using the `ClueDistributionResult` already in scope. This cannot fail the way the LLM retry does.

**Required action:** Implement P2-C before the next run. This has been the documented recommendation since run_34. Every run without it will produce 0/N clue visibility.

---

## Issue 2 — Month/season contradiction repeats in every run

**Severity:** S1 High — triggers chapter-level retries; caused a release gate hard-stop in run_34  
**Runs affected:** project_20 · run_34 · run_35 (and flagged in `run_reviews.md` for the earliest runs)

| Run | Contradiction observed | Gate impact |
|---|---|---|
| project_20 | "May evening" vs "english autumn" | Flagged, no hard-stop |
| run_34 | Ch.5: "february" vs "autumn" | Release gate hard-stop |
| run_35 | Ch.2: "april" vs "autumn"; Ch.9: "may" vs "autumn" | Chapter-level retries; near miss on release gate |

**Why it keeps failing:**

The temporal context agent (agent2d) correctly outputs the story's month and year. That temporal context is passed to the prose agent and is visible in the NSD block. But the prose system prompt contains no explicit instruction tying the month to a season. The LLM defaults to "autumn" in country-house settings because autumn is the genre default for Golden Age mysteries—it does not derive the correct season from the month supplied.

**What was fixed:** Nothing. The issue was identified in the project_20 review as "missing temporal contradiction validator at chapter level," confirmed in run_34, confirmed again in run_35.

**What was not fixed:**
- **P2-D: month/season guardrail in prose system prompt** — derive `season` from `month` programmatically (April → spring, February → winter) and inject a hard constraint sentence into the prose system prompt. This is a one-function, one-line-of-injection change. It has been on the plan since run_34.

**Required action:** Implement P2-D before the next run. Run_34 got a release gate hard-stop from this. Run_35 was a near-miss (retries succeeded, but the "critical continuity issue detected" warning suggests residual season language may have survived into later passes). The third consecutive failure will almost certainly also produce this.

---

## Issue 3 — Narrative outline scene/chapter count consistently below target

**Severity:** S2 Medium — reduces word count, chapter count, and scope for clue distribution  
**Runs affected:** run_30 · run_33 · run_34 · run_35

| Run | Expected chapters | Generated chapters | Reduction |
|---|---|---|---|
| run_30 | 12 | 17 (overrun) | +5 |
| run_33 | 20 | 20 | 0 |
| run_34 | 20 | 18 | −2 |
| run_35 | 20 | 16 | −4 |

**Why it keeps failing:**

The pre-prose outline quality gate re-runs `formatNarrative` to fix CML coverage gaps. Each retry returns fewer scenes (18 → 16 across runs 34–35). The pacing gate also re-runs `formatNarrative`, and again may return different counts. There is no floor on scene count and no constraint on the retry prompt to maintain the original chapter count. The scene count reduction directly reduces the clue distribution opportunity (fewer scenes → fewer available anchors for the pacing gate to satisfy).

**What was fixed:** Nothing directly — run_30's overrun had its own dynamics (no ceiling enforced then either).

**Required action:** Add a `targetScenes` constraint to all `formatNarrative` retry prompts. When retrying for coverage gaps or pacing, preserve the original scene count or enforce a minimum of the originally agreed count. This is a prompt-level change in the narrative retry call.

---

## Issue 4 — Template/scaffold leakage and prose duplication

**Severity:** S0 Critical (when causing release gate hard-stop) / S1 High (when caught internally)  
**Runs affected:** project_20 · proj_7aa0771d · run_30 · run_34

| Run | Form | Gate impact |
|---|---|---|
| project_20 | Repeated atmosphere/template blocks | Flagged |
| proj_7aa0771d | Repeated near-identical scaffold boilerplate in 4 chapters | Failed gate |
| run_30 | Raw location context transcript in "Initial Interviews" chapter | Quality degraded |
| run_34 | 2 duplicate long blocks in repair retry | Release gate hard-stop |

**Why it keeps failing:**

Leakage takes two forms. The first — raw context data transcribed verbatim — was addressed by `stripLocationParagraphs` (Sprint 2/P1) and has not reappeared in runs 33–35. The second — duplicate structural blocks across chapters — persists because the repair retry regenerates all chapters under a constrained guardrail prompt that pushes the LLM toward structural repetition. With no "descriptions already used" state between chapters, repetitive openings and closings are generated by the stateless multi-chapter generation.

**What was fixed:**
- Sprint 2/P1: `stripLocationParagraphs` / context hygiene — eliminates raw template injection
- P1-F: `cluesRevealedToReader` wiring — anti-re-revelation (not directly related to leakage)

**What was not fixed:**
- **P2-E: prose repair retry leakage prevention** — add a prose guardrail for the repair retry: "Each chapter must open and close with different phrasing — never reuse sentences, transitions, or descriptive blocks from other chapters." This was identified in run_34 but not implemented. No debug logging is in place to identify which specific blocks are duplicated.

---

## Issue 5 — Character identity, pronoun, and role-drift instability

**Severity:** S1 High  
**Runs affected:** project_20 · proj_60cfc60c · run_30 · run_35

| Run | Form | Impact |
|---|---|---|
| project_20 | Investigator role drift (amateur ↔ authority) | Coherence degraded |
| proj_60cfc60c | Role-token leakage: "an inspector", "a gentleman" | Immersion broken |
| run_30 | Pronoun instability (he → they, she → they) across 3 characters | Consistency score 78.1 |
| run_35 | Role-alias drift: canonical names → generic roles | Full prose regeneration triggered |

**Why it keeps failing:**

Character generation is stateless across chapters. The prose agent re-derives character references from its system prompt in each chapter call. Early fix (Sprint 1 pronoun chain) addressed gender stability for the pronoun field. But the underlying issue — that the LLM defaults to generic role labels and pronouns when under context pressure — was not addressed at the system-prompt level. The identity continuity guard (post-Sprint 1) correctly detects and retriggers prose generation, but at full 16-chapter cost.

**What was fixed:**
- Sprint 1: Explicit pronoun field in character profiles; pronoun chain injected per chapter
- Sprint 1–3: `lockedFacts`, NSD — provide identity anchoring across chapters

**What was not fixed:**
- **P3-B: targeted identity fix** — when drift is detected, re-generate only the drifted chapters rather than all. Currently a full 16-chapter regeneration costs ~$0.06 extra. The identity continuity checker identifies which chapters drifted; a targeted re-generation would cost a fraction.
- **Root issue: character name anchoring strength** — the prose system prompt could be strengthened to explicitly list all canonical character names at the top of every chapter call with an injunction "Never use a role label — always use the canonical name."

---

## Issue 6 — Suspect closure and denouement structural incompleteness

**Severity:** S0 Critical (when causing release gate hard-stop) / S1 High  
**Runs affected:** project_20 · proj_60cfc60c · run_35

| Run | Form | Gate impact |
|---|---|---|
| project_20 | Incomplete denouement; release gate warns but does not hard-stop | Degraded |
| proj_60cfc60c | Thin post-reveal denouement | Degraded |
| run_35 | Suspect elimination coverage incomplete | Release gate hard-stop, pipeline aborted |

**Why it keeps failing:**

With 0/N clue visibility and reduced chapter counts (16 instead of 20), the prose agent has less structural space to execute suspect-clearing scenes. Act III bears the full cost of structural compression: fewer chapters = clearing and reveal scenes collapse. The repair retry builds guardrails from known validation error types, but the `suspect_elimination_coverage_incomplete` error type may not map to any of the current guardrail cases (B7 — not yet confirmed).

**What was fixed:** Nothing directly in runs 33–35 (the Sprint 1–3 systems pre-date the hard-stop; they did not target this failure mode).

**What was not fixed:**
- **P3-A: suspect elimination guardrail alignment** — audit the error type produced at the release gate (`suspect_elimination_coverage_incomplete`) and ensure it maps to a repair guardrail case. If no mapping exists, add one.
- **Indirect fix needed:** once clue visibility is fixed (P2-C) and chapter counts are maintained (Issue 3 fix), Act III will have more structural space and the likelihood of suspect-clearing scenes being present increases.

---

## Issue 7 — Temporal context optional field completeness (minor, persistent)

**Severity:** S3 Low — does not fail any gate; phase scores 91–95/A  
**Runs affected:** run_33 · run_34 · run_35

**Pattern:** `Substantial content: 50 — 2/4 fields detailed` in every run. The temporal context agent (agent2d) provides core fields but leaves optional richness fields thin.

**Why it persists:** The agent2d prompt does not require substance in optional temporal context fields. No fix is planned or prioritised. The scorer docks points but the phase passes.

**Required action:** Low priority. Add stronger optional field requirement to agent2d prompt. Can be done opportunistically alongside other prompt work (e.g., P2-D).

---

## Issue 8 — Cast role diversity (minor, persistent)

**Severity:** S3 Low — does not fail any gate; cast phase scores 98/A  
**Runs affected:** run_34 · run_35

**Pattern:** `Role diversity: 60 — only 3 archetypes for 5 characters` in both runs. With a 5-character cast on a behavioral axis at `short` target length, the LLM reuses archetypes.

**Why it persists:** The cast agent prompt does not hard-require 4+ distinct archetypes for casts of 5+. No fix is planned or prioritised.

**Required action:** Low priority. Add archetype diversity constraint to agent2_cast prompt: "For a cast of 5 or more, generate at least 4 distinct archetypes. Never reuse an archetype across two suspects."

---

## Issue 9 — Fair-play compliance borderline (compound symptom of Issue 1)

**Severity:** S2 Medium  
**Runs affected:** run_30 · run_33 · run_34

**Pattern:** Prose fair-play compliance scores 60/100 in runs 33 and 34. CML-level fair-play audit scores 100/A in both. The gap (CML 100 vs prose 60) is a structural artefact of Issue 1: with 0/N clues surfaced, the detective knows things the reader cannot see, producing exactly the "off-page inference" pattern the fair-play scorer penalises.

**Why it persists:** This is not an independent failure — it is a downstream consequence of Issue 1 (clue visibility 0/N). Once P2-C is implemented and clue visibility reaches N/N, fair-play compliance should recover without a dedicated fix.

**Required action:** None independent — resolve Issue 1 first.

---

## What we have fixed (confirmed working)

| Fix | Run confirmed | Effect |
|---|---|---|
| P1-A: `actNumber → act` field bug | run_33 (post) | Clue injection loop now executes per scene |
| P1-B: ClueDistributionResult wired into prose prompt | run_33 (post) | Descriptions injected for clue-bearing scenes |
| P1-C: Pacing gate + retry | run_33 (post) | Gate fires correctly; retry infrastructure correct |
| P1-D: Dead `selectSensoryPaletteForChapter` removed | run_33 (post) | No impact (dead code) |
| P1-E: Sensory variant field names fixed | run_33 (post) | Palette cycling and context-matching active |
| P1-F: `cluesRevealedToReader` wired | run_33 (post) | Anti-re-revelation guard active |
| P2-A: Pacing gate threshold uses retry scene count | run_35 | Threshold correctly `ceil(16×0.6)=10` for 16-scene outline |
| P2-B: Quality tab 3s refresh | run_35 | Quality tab updates on same cycle as History tab |
| P2-F: Repair chapter scores in Quality tab | run_35 | repair_chapter_scores present and rendered |
| Sprint 1–3: pronoun chain, lockedFacts, context hygiene | run_33+ | No pronoun drift, no context leakage, no factual contradiction in runs 33–35 |

All the above are working. The failures we still see are not regressions — they are distinct unimplemented items.

---

## What we have failed to fix (in priority order)

| Priority | Issue | ID | First observed | Still failing | Status |
|---|---|---|---|---|---|
| **1 — BLOCKING** | Clue visibility 0/N — deterministic pre-assignment not implemented | P2-C | run_33 | run_35 | NOT-STARTED |
| **2 — HIGH** | Month/season contradiction in prose — guardrail not added | P2-D | project_20 | run_35 | NOT-STARTED |
| **3 — HIGH** | Suspect elimination guardrail alignment in repair retry | P3-A | run_35 | run_35 | NOT-STARTED |
| **4 — MEDIUM** | Narrative outline scene count shrinks on retry | (no ID) | run_34 | run_35 | NOT-STARTED |
| **5 — MEDIUM** | Prose repair retry leakage prevention | P2-E | run_34 | not triggered in run_35 | NOT-STARTED |
| **6 — MEDIUM** | Targeted identity fix (reduce full regen to chapter-level) | P3-B | run_35 | run_35 | NOT-STARTED |
| **7 — LOW** | Temporal context optional field thinness | (no ID) | run_33 | run_35 | NOT-STARTED |
| **8 — LOW** | Cast role diversity constraint | (no ID) | run_34 | run_35 | NOT-STARTED |

---

## Root-cause pattern analysis

Reading across all runs, there is one consistent structural diagnosis:

**The planning pipeline (CML → clue distribution → narrative outline) is excellent. The prose pipeline does not reliably execute the plan.**

Specifically:
1. The narrative outline agent (agent7) ignores explicit count constraints and habitually under-distributes clue anchors.
2. The prose agent ignores temporal context (month → season) unless explicitly constrained at the system prompt level.
3. The prose agent exhibits identity/role drift under context pressure without strong name anchoring.
4. Repair retries are structurally identical to first passes — they apply guardrails to the same stateless LLM calls and produce either the same failure or introduce new ones (leakage, suspect closure).

The fixes implemented to date have been **correct plumbing fixes**: wiring data that was already computed but not delivered to the prompts that needed it. Those plumbing fixes are necessary and they are working. But they cannot overcome a prompt that the LLM ignores (pacing count constraint) or a temporal constraint that was never in the prompt in the first place (month/season).

The next generation of fixes must be **deterministic or injective, not advisory**:
- P2-C assigns clues to scenes mathematically — no LLM discretion
- P2-D derives season from month in code and injects a prohibition — no LLM discretion
- P3-A maps an error type to a guardrail in code — no LLM discretion

The advisory approach (instructing the LLM to distribute clues evenly, to check the season) has been tried and has failed across multiple runs and multiple prompt variants.

---

## Recommended implementation sequence

1. **P2-C now** — deterministic clue pre-assignment in `mystery-orchestrator.ts`. After pacing gate fires and any retry, post-process the outline: spread `ClueDistributionResult` clue IDs mathematically across scenes. At least 60% of scenes must carry ≥1 ID. This is a ~30-line code change with no LLM calls. It blocks all further progress.

2. **P2-D now** — month/season guardrail in `packages/prompts-llm/src/agent9-prose.ts`. Derive season programmatically; inject one prohibition sentence. ~10 lines. Without this, every run wastes LLM calls on chapter retries and risks a release gate hard-stop.

3. **P3-A before next run** — audit error type mapping in the repair guardrail switch; add `suspect_elimination_coverage_incomplete` case if missing. This prevents the same release gate abort from run_35 recurring.

4. **Scene count floor (Issue 3) alongside P2-C/D** — add `targetScenes` to retry prompts in `mystery-orchestrator.ts`. One or two lines added to the retry call arguments. Prevents outline shrinkage from compounding the clue distribution problem.

5. **P3-B and P2-E** — once the above four are in place and producing clean runs, implement targeted identity fix (cost optimisation) and repair retry leakage prevention.
