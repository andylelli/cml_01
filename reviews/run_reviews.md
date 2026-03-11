# CML Run Reviews & Remediation Tracker

## Purpose
Use this document to review each new generation run, capture defects, decide severity, and plan phased remediation.

## How to use
1. Add one new **Run Review** section per run.
2. Keep findings evidence-based (file path + line references where possible).
3. Split remediation into phases (P0/P1/P2) with measurable acceptance criteria.
4. Track status updates in-place (`NOT-STARTED`, `IN-PROGRESS`, `DONE`, `BLOCKED`).
5. Close the review only when all Definition-of-Done checks pass.

## Severity model
- **S0 Critical**: corrupted output, invalid exports, blocking logic failures.
- **S1 High**: major quality/coherence failures that degrade reader trust.
- **S2 Medium**: noticeable quality issues, but story remains usable.
- **S3 Low**: polish issues and minor style inconsistencies.

## Status model
- `NOT-STARTED`
- `IN-PROGRESS`
- `DONE`
- `BLOCKED`

## Standard review template

**Run ID:**  
**Date:**  
**Project:**  
**Story file:**  
**Reviewer:**  
**Overall assessment:** `PASS | DEGRADED | FAIL`

### Observed defects
- **[Severity] Defect title**  
  **Evidence:**  
  **Impact:**  
  **Root-cause hypothesis:**

### Phased remediation plan
#### P0 Containment (same day)
- **Action:**
- **Owner area:**
- **Status:**
- **Acceptance criteria:**

#### P1 Structural fixes (1–3 days)
- **Action:**
- **Owner area:**
- **Status:**
- **Acceptance criteria:**

#### P2 Hardening and regression (3–7 days)
- **Action:**
- **Owner area:**
- **Status:**
- **Acceptance criteria:**

### Validation and verification
- **Required tests:**
- **Required full-run checks:**
- **Export checks:**
- **Gate outcome:**

### Definition of done
- [ ] No critical encoding artifacts
- [ ] No unresolved continuity contradictions
- [ ] No repeated template leakage above threshold
- [ ] Release gate classification is healthy
- [ ] Regression tests added/updated

### Status update after hardening implementation
- Core validator/prompt/orchestrator tightening: `DONE`
- Full-run empirical confirmation: `IN-PROGRESS`
- Baseline closure: `IN-PROGRESS` (pending clean long-format confirmation)

---

## Run Review: project_20 (initial baseline)

**Run ID:** unknown (manual story inspection)  
**Date:** 2026-02-28  
**Project:** project_20  
**Story file:** stories/project_20.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL`

### Observed defects
- **[S0 Critical] Mojibake/encoding corruption in dialogue punctuation**  
  **Evidence:** malformed quote/apostrophe sequences observed repeatedly.  
  **Impact:** visible text corruption; reader-facing quality failure.  
  **Root-cause hypothesis:** sanitation order/map gaps or late-stage encoding drift.

- **[S1 High] Repeated atmosphere/template blocks**  
  **Evidence:** near-verbatim repeated location/sensory scaffold paragraphs.  
  **Impact:** immersion loss; obvious generation artifact.  
  **Root-cause hypothesis:** insufficient anti-duplication constraints + weak post-check repair.

- **[S1 High] Timeline inconsistency (month vs season framing)**  
  **Evidence:** "May evening" language appears alongside "english autumn" framing.  
  **Impact:** narrative coherence degradation.  
  **Root-cause hypothesis:** missing temporal contradiction validator at chapter level.

- **[S1 High] Investigator-role drift/coherence instability**  
  **Evidence:** framing alternates between amateur investigator and suspect-led authority.  
  **Impact:** reduced logical clarity in investigation arc.  
  **Root-cause hypothesis:** role continuity checks focus on names, not role-state transitions.

- **[S1 High] Incomplete denouement/closure quality**  
  **Evidence:** late suspect-clearing segments without a consistently strong final closure pattern.  
  **Impact:** weak ending confidence.  
  **Root-cause hypothesis:** release gate warns but does not hard-stop closure defects.

### Phased remediation plan
#### P0 Containment (same day)
- **Action:** block healthy completion when unresolved mojibake or duplicate scaffold spans remain.
- **Owner area:** apps/worker + packages/story-validation
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** failed runs clearly marked degraded; no silent healthy completion.

#### P1 Structural fixes (1–3 days)
- **Action:** strengthen prose prompt contracts for anti-template text, temporal consistency, and investigator-role ledger.
- **Owner area:** packages/prompts-llm
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** no month/season contradictions; reduced adjacent chapter similarity.

#### P2 Hardening and regression (3–7 days)
- **Action:** add deterministic validators + targeted chapter repair loop + regression tests for failure patterns.
- **Owner area:** packages/story-validation + apps/worker
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** 2 consecutive clean runs; regression suite green.

### Validation and verification
- **Required tests:** story-validation suite + new temporal/duplication/encoding tests.
- **Required full-run checks:** minimum 2 full runs (including 1 long format).
- **Export checks:** prose txt + PDF free of mojibake and unresolved duplicate boilerplate.
- **Gate outcome:** pending remediation.

### Definition of done
- [ ] No critical encoding artifacts
- [ ] No unresolved continuity contradictions
- [ ] No repeated template leakage above threshold
- [ ] Release gate classification is healthy
- [ ] Regression tests added/updated

---

## Run Review: project_proj_7aa0771d-e06b-4a8a-9f83-1d362988005f

**Run ID:** proj_7aa0771d-e06b-4a8a-9f83-1d362988005f  
**Date:** 2026-02-28  
**Project:** project (auto-generated id variant)  
**Story file:** stories/project_proj_7aa0771d-e06b-4a8a-9f83-1d362988005f.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL`

### Observed defects
- **[S1 High] Repeated scaffold/template leakage blocks**  
  **Evidence:** repeated near-identical location/sensory boilerplate appears multiple times in Chapters 2, 12, 14, and 19.  
  **Impact:** strong synthetic repetition; narrative credibility drops.  
  **Root-cause hypothesis:** anti-template suppression missed repeated scaffold variants.

- **[S2 Medium] Chapter title duplication artifacts**  
  **Evidence:** labels such as `Chapter 10: Chapter 10:` and `Chapter 15: Chapter 15:` appear.  
  **Impact:** visible formatting quality issue.  
  **Root-cause hypothesis:** chapter heading assembly duplicated at generation/post-process boundary.

### Validation and verification
- **Gate outcome:** failed quality target; remediation required before release.

---

## Run Review: project_proj_60cfc60c-1b9a-4976-8b75-affca01e9ae2

**Run ID:** proj_60cfc60c-1b9a-4976-8b75-affca01e9ae2  
**Date:** 2026-02-28  
**Project:** project (auto-generated id variant)  
**Story file:** stories/project_proj_60cfc60c-1b9a-4976-8b75-affca01e9ae2.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `DEGRADED`

### Observed defects
- **[S1 High] Placeholder/role-token leakage**  
  **Evidence:** forms such as `an inspector` / `a gentleman` appear in narrative dialogue and narration.  
  **Impact:** immersion and identity coherence are reduced.  
  **Root-cause hypothesis:** unresolved role-slot substitution in prose pass.

- **[S2 Medium] Arc closure weakness**  
  **Evidence:** culmination reaches culprit reveal but remains thin on post-reveal denouement.  
  **Impact:** ending confidence is weakened.  
  **Root-cause hypothesis:** closure-strength check not consistently elevating near-terminal quality.

### Validation and verification
- **Gate outcome:** degraded; allow only with warning policy (not healthy release).

---

## Run Review: project_proj_acf895e1-6f30-4cd3-bd90-85c749b537e6

**Run ID:** proj_acf895e1-6f30-4cd3-bd90-85c749b537e6  
**Date:** 2026-02-28  
**Project:** project (auto-generated id variant)  
**Story file:** stories/project_proj_acf895e1-6f30-4cd3-bd90-85c749b537e6.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL`

### Observed defects
- **[S1 High] Victim identity drift / naming inconsistency**  
  **Evidence:** opening summary references Dorothy Beaumont while body text switches to Dorothy Delacroix.  
  **Impact:** major continuity breach.  
  **Root-cause hypothesis:** entity binding drift across chapter pipeline.

- **[S1 High] Inspector/name placeholder instability**  
  **Evidence:** malformed constructions such as `an inspector` and `a woman Delacroix`.  
  **Impact:** narrative readability and trust degradation.  
  **Root-cause hypothesis:** late-stage token replacement failure.

### Validation and verification
- **Gate outcome:** failed; blocked for release.

---

## Run Review: project_proj_c01b9c50-8cf0-45b2-83c2-77b54b603f37

**Run ID:** proj_c01b9c50-8cf0-45b2-83c2-77b54b603f37  
**Date:** 2026-02-28  
**Project:** project (auto-generated id variant)  
**Story file:** stories/project_proj_c01b9c50-8cf0-45b2-83c2-77b54b603f37.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `DEGRADED`

### Observed defects
- **[S2 Medium] Heading duplication and formatting artifacts**  
  **Evidence:** chapter labels include duplicated prefixes (e.g., `Chapter 13: Chapter 13:`).  
  **Impact:** visible polish defect.  
  **Root-cause hypothesis:** repeated heading template emission.

- **[S2 Medium] Residual generic prose-pattern repetition**  
  **Evidence:** recurring boilerplate-style sensory setup patterns recur across multiple chapters.  
  **Impact:** stylistic sameness and reduced novelty perception.  
  **Root-cause hypothesis:** anti-duplication threshold not strict enough for medium-distance repeats.

### Validation and verification
- **Gate outcome:** degraded; acceptable only as non-release diagnostic output.

---

## Run Review: project_proj_344e2686-8b2b-4ab4-9f79-64f27c0099f1 (post-fix verification)

**Run ID:** run_404a9f99-a859-4197-8010-77d727e974dc  
**Date:** 2026-02-28  
**Project:** PostFix-Medium-Verification (`proj_344e2686-8b2b-4ab4-9f79-64f27c0099f1`)  
**Story file:** stories/project_proj_344e2686-8b2b-4ab4-9f79-64f27c0099f1.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL`

### Observed defects
- **[S1 High] Large repeated scaffold blocks still leak into prose**  
  **Evidence:** repeated template-style environmental paragraphs appear in Chapters 5, 7, 10, 11, and 12 (same pattern family seen in prior failing runs).  
  **Impact:** major readability degradation and obvious generation artifacting.  

---

  **Root-cause hypothesis:** template-suppression gate is still too permissive for long repeated “At The …” scene scaffold variants.

- **[S2 Medium] Placeholder leakage persists in role labels**  
  **Evidence:** forms like `an inspector` appear in chapter narration/headings despite role normalization hardening.  
  **Impact:** identity polish is reduced and immersion is broken.  
  **Root-cause hypothesis:** unresolved article+role substitutions are still entering final prose path.

### Validation and verification
- **Gate outcome:** failed (post-fix medium verification did not meet release quality).

### Status update after hardening implementation
- Core validator/prompt/orchestrator tightening: `DONE`
- Full-run empirical confirmation: `IN-PROGRESS` (medium verification executed, still failing)
- Baseline closure: `IN-PROGRESS`
- Long-format confirmation run: `BLOCKED` (API process instability interrupted follow-up long run launch in-session)

---

## Run Review: project_24 "Shadows of Time" (post-encoding-fix verification)

**Run ID:** unknown (manual inspection after text file encoding fix)  
**Date:** 2026-02-28  
**Project:** project_24  
**Story file:** stories/project_24.txt  
**Reviewer:** Copilot session review  
**Overall assessment:** `DEGRADED`

### Observed defects

- **[S0 Critical] Fair play audit FAIL - 45/100 score with 2 violations**  
  **Evidence:** 
  - **Clue Visibility (0/100):** "The crucial clue regarding Kenneth's manipulation of the clock is revealed during the discriminating test rather than before."
  - **Information Parity (0/100):** "The detective knows Kenneth's premeditation but does not share this information with the reader until the confrontation."
  **Impact:** Story violates fundamental mystery genre contract. Reader cannot solve the mystery alongside the detective because critical clues are withheld until the reveal. This is the classic "detective pulls evidence from thin air" failure that breaks reader trust.  
  **Root-cause hypothesis:** Narrative structure allows detective to discover and immediately confront with evidence in same chapter, giving reader no opportunity to process clues. The pendulum note (Chapter 6) hints at clock tampering, but the discriminating test mechanism and Kenneth's specific premeditation are not revealed to reader before Amelie uses them in confrontation (Chapter 9). Prose generation doesn't enforce "clue revelation → reader processing time → detective uses clue" sequence.

- **[S1 High] Massive repeated scaffold/template leakage blocks**  
  **Evidence:** The infamous "At The [Location] in Hampstead, England, the smell of..." template appears verbatim or near-verbatim in multiple chapters:
  - Chapter 8: "The Trap is Set" - full scaffold block (lines 557-564)
  - Chapter 12: "The Culprit Revealed" - full scaffold block (lines 695-702)
  Both instances use identical structure: "At The Drawing Room/Greenhouse in Hampstead, England, the smell of [sensory details] mixed with [sound details], while overcast with occasional rain showers..."  
  **Impact:** Catastrophic immersion break. Reader immediately identifies synthetic generation. This is the most severe template leakage observed in any reviewed run.  
  **Root-cause hypothesis:** Anti-duplication validator is completely ineffective against location scaffold variants. The pattern likely originates from location_profiles or setting_refinement and is not being suppressed during prose generation.

- **[S1 High] Unclear victim identity**  
  **Evidence:** The story opens with "the body of an unknown victim is discovered" (line 7) and maintains this anonymity throughout. The victim is only referred to as "the victim" or "our dear friend" - never named.  
  **Impact:** Critical mystery failure. The murder has no emotional weight because the victim is a cipher. Violates "The Murder Must Mean Something" principle - no one truly loved this person because we never knew them.  
  **Root-cause hypothesis:** CML victim entity may have been undefined or name not propagated to prose. Alternatively, deliberate ambiguity was requested but creates a hollow center.

- **[S1 High] Weak, hollow character voices**  
  **Evidence:** All dialogue follows the same clinical pattern:
  - "I was in the garden, tending to the roses" (Helen)
  - "I was in the library, reading" (Bernard)
  - "I was in the kitchen, preparing tea" (Jacqueline)
  No subtext, no emotion leaking, no personality differentiation.  
  **Impact:** Characters feel like interchangeable mannequins. Violates "Let Emotion Leak Into Dialogue" and "Give Every Suspect a Wound" principles.  
  **Root-cause hypothesis:** Prose prompts prioritize plot mechanics over character voice. No guardrails for emotional texture or personality differentiation in dialogue.

- **[S1 High] Mechanical, plot-only pacing**  
  **Evidence:** Every chapter is pure plot advancement:
  - "Amelie examines X"
  - "Amelie questions Y"
  - "Amelie discovers Z"
  No pauses, no micro-moments, no character breathing room.  
  **Impact:** Story feels like a procedural checklist. Violates "Add Moments That Don't Advance the Plot" principle.  
  **Root-cause hypothesis:** Narrative outline likely structured as pure investigation steps without emotional beats. Prose generation optimizes for forward movement.

- **[S2 Medium] Generic atmospheric repetition**  
  **Evidence:** Beyond the blatant scaffold leakage, nearly every chapter opens with:
  - Overcast skies/rain/dim light
  - Heavy/thick air
  - Tension/silence pressing against walls
  - Scent of polished wood + tobacco
  - Ticking clock
  Same sensory palette recycled 15+ times.  
  **Impact:** Atmosphere becomes wallpaper. No sensory variety or evolving mood.  
  **Root-cause hypothesis:** Location profiles provide fixed sensory templates that prose generation draws from repeatedly without variation guidance.

- **[S2 Medium] Weak denouement/aftermath**  
  **Evidence:** Final chapter "Aftermath" (lines 819-852) is entirely contemplative dialogue with no action, no emotional catharsis, no consequences shown. Jacqueline confessed to murder but faces no justice, no grief, no reckoning.  
  **Impact:** Ending feels unfinished and emotionally flat. Violates "Make the Reveal Hurt" principle.  
  **Root-cause hypothesis:** Closure-strength validator may flag weakness but doesn't trigger repair. No guardrails for consequences or emotional resolution.

- **[S2 Medium] No personal stake for detective**  
  **Evidence:** Amelie Paynter investigates because "she feels compelled" but has no personal connection, no past failure echoing this case, no internal conflict.  
  **Impact:** Detective feels like an empty vessel. Violates "The Detective Needs a Personal Stake" principle.  
  **Root-cause hypothesis:** Character profiles don't include internal conflicts or personal history that could create stakes.

- **[S2 Medium] No moral complexity**  
  **Evidence:** Jacqueline kills because "I loved them too much to see them with anyone else" (line 793). This is presented as pure jealous crime with no nuance, no complicating factors, no gray areas.  
  **Impact:** Reveal is morally simple and uninteresting. Violates "Raise Moral Complexity" principle.  
  **Root-cause hypothesis:** Motive design in CML may not include complexity layers or moral ambiguity guidance.

### What worked well

- **Clean text encoding:** No mojibake or "â" artifacts in the generated .txt file (encoding fix successful).
- **Logical timeline:** No month/season contradictions or temporal inconsistencies detected.
- **Clear investigation structure:** Amelie systematically gathers evidence, questions suspects, stages tests - the procedural backbone is sound.
- **Suspect alibi web:** Helen, Bernard, Jacqueline, and Lucien all have interlocking alibis that get verified/cleared methodically.
- **Evidence-based reveal:** The pendulum note (Chapter 6) provides a concrete clue that narrows suspects to Bernard and Jacqueline before the final confession.

### Phased remediation plan

#### P0 Containment (same day)
- **Action 1:** HARD-BLOCK any run that scores <60/100 on fair play audit. Fair play violations are release-blocking.
- **Owner area:** apps/worker orchestrator + packages/story-validation
- **Status:** `DONE`
- **Acceptance criteria:** Worker aborts with clear "FAIR_PLAY_VIOLATION" error if audit score <60 or any individual dimension scores 0. Run marked as FAIL, not DEGRADED.

- **Action 2:** Add strict anti-duplication validator that flags any repeated text block >150 characters with >85% similarity as CRITICAL FAILURE. Abort prose generation if scaffold leakage detected.
- **Owner area:** packages/story-validation + apps/worker orchestrator
- **Status:** `DONE`
- **Acceptance criteria:** No run completes "healthy" if repeated scaffold blocks are present. Worker logs clear "SCAFFOLD_LEAKAGE_DETECTED" failure.

#### P1 Structural fixes (1–3 days)
- **Action 1:** Fair play clue sequencing enforcement - modify narrative outline prompts to require explicit scene separation between clue revelation and clue usage. Add prose guardrails to prevent within-chapter violations.
- **Owner area:** packages/prompts-llm (Agent 7 narrative + Agent 9 prose)
- **Status:** `DONE`
- **Acceptance criteria:** Agent 7 prompt includes explicit clue sequencing rules: minimum 1 scene between revelation and usage, clue revelation in Act I/early Act II, discriminating test in late Act II/early Act III, confrontation at least 1-2 scenes after test. Agent 9 guardrails prevent combining clue discovery and detective deduction in same chapter. Fair play audit scores >60/100 on test runs.

- **Action 2:**
- **Action 1:** Victim identity enforcement - ensure victim name is always defined in CML and propagated to all prose chapters. Add validator that checks victim is named (not "the victim") in Discovery chapter.
- **Owner area:** apps/worker orchestrator + packages/prompts-llm (prose agent)
- **Status:** `DONE` — buildContextSummary includes victim name; prose system prompt has VICTIM IDENTITY rule; ChapterValidator.checkVictimNaming() validates chapter 1; 4 new tests added.
- **Acceptance criteria:** Victim has proper name in opening chapter and is referenced by name throughout.

- **Action 2:** Character voice differentiation - add guardrails to prose prompt requiring:
  - Each character has distinct speech patterns/vocabulary
  - Dialogue includes subtext (what they're NOT saying)
  - Emotional leakage in dialogue (hesitations, tone shifts, contradictions between words and body language)
- **Owner area:** packages/prompts-llm (prose agent)
- **Status:** `DONE` — CHARACTER PERSONALITIES, VOICES & HUMOUR context block injected in prose prompt; WHODUNNIT CRAFT GUIDELINES includes character voice differentiation and emotional leakage guidance.
- **Acceptance criteria:** Sample dialogues show clear personality differentiation; at least 30% of dialogue exchanges include subtext or emotional complexity.

- **Action 3:** Emotional beat injection - modify narrative outline schema to include non-plot "micro-moment" beats in chapter structure. Require at least 2 pauses per 5 chapters.
- **Owner area:** schema/narrative_outline.schema.yaml + packages/prompts-llm (narrative agent)
- **Status:** `DONE` — Schema field `microMomentBeats` added to `narrative_outline.schema.yaml` and `Scene.dramaticElements` TypeScript interface. Agent 7 prompt instructs at least 1 emotional pause beat per 5 scenes, with `microMomentBeats` in each scene's dramaticElements. Agent 9 writing guidance instructs writers to reference character personalStakeInCase at least twice.
- **Acceptance criteria:** Narrative outlines include labeled emotional beats (e.g., "Moment: suspect breaks down," "Pause: detective reflects on personal loss").

#### P2 Hardening and regression (3–7 days)
- **Action 1:** Atmospheric variety enforcement - location profiles should include 3-5 distinct sensory palettes per location. Prose generation should cycle through variants, never repeating same palette in consecutive chapters.
- **Owner area:** apps/worker (setting/location generation) + packages/prompts-llm (prose agent)
- **Status:** `DONE` — evaluateSensoryVariety() added to mystery-orchestrator.ts; flags phrases in >40% of chapters as release gate warning. ANTI-REPETITION prose guardrail strengthened to require full rephrasing of any prior-chapter sensory phrase.
- **Acceptance criteria:** No sensory phrase (e.g., "air thick with tension") appears in more than 40% of chapters.

- **Action 2:** Detective personal stake - add character_profiles field for "internal_conflict" and "personal_stake_in_case." Inject into prose generation for detective introspection moments.
- **Owner area:** schema/character_profiles.schema.yaml + packages/prompts-llm (character + prose agents)
- **Status:** `DONE` — Schema fields `internalConflict` and `personalStakeInCase` added to `character_profiles.schema.yaml` and `CharacterProfileOutput` TypeScript interface. Agent 2b prompt requires both fields for the detective and recommends them for all characters. Agent 9 character personality context now surfaces these fields in the prose system prompt; writing guidance instructs personal stake to manifest at least twice across the story.
- **Acceptance criteria:** Detective character has explicit personal stake described in at least 2 chapters.

- **Action 3:** Moral complexity layers - hard_logic_devices should include "moral_ambiguity" field describing why the crime has gray areas. Inject into reveal/aftermath prose.
- **Owner area:** schema/hard_logic_devices.schema.yaml + packages/prompts-llm (prose agent)
- **Status:** `DONE` — Schema field `moralAmbiguity` added to `hard_logic_devices.schema.yaml`, `HardLogicDeviceIdea` TypeScript interface, agent 3b normalizer, and agent 3b prompt (6th user instruction). The first device's `moralAmbiguity` is extracted in the orchestrator and passed as `moralAmbiguityNote` to all `generateProse` calls. Agent 9 system prompt includes a dynamic MORAL COMPLEXITY REQUIREMENT when the note is present, or a generic fallback rule when not.
- **Acceptance criteria:** Culprit reveal includes at least one complicating moral factor that makes reader uncomfortable (per "Raise Moral Complexity" principle).

- **Action 4:** Denouement strength enforcement - add quality guardrail requiring aftermath to show:
  - Consequences for culprit (justice/grief/reckoning)
  - Emotional resolution for detective
  - Changed relationships between survivors
- **Owner area:** packages/prompts-llm (prose agent) + packages/story-validation
- **Status:** `DONE` — DENOUEMENT REQUIREMENT rule added to prose system prompt specifying culprit fate, changed relationships, detective personal resolution.
- **Acceptance criteria:** Story validation flags weak closures; prose repair retry triggered if aftermath lacks emotional resolution.

### Validation and verification
- **Required tests:** 
  - Anti-duplication validator unit tests (>150 char, >85% similarity = fail)
  - Victim identity propagation test
  - Character voice differentiation scoring
  - Atmospheric variety scoring
- **Required full-run checks:** 
  - 1 medium-length run (10-12 chapters)
  - 1 long-length run (15+ chapters) to stress-test template suppression
- **Export checks:** 
  - No scaffold leakage blocks in .txt export
  - Vi**Fair play audit score ≥60/100 with no 0-score dimensions** (RELEASE BLOCKER)
- [ ] No critical scaffold/template leakage (>150 char repeated blocks)
- [ ] Victim identity established and maintained
- [ ] Character dialogue shows personality differentiation and subtext
- [ ] Narrative includes non-plot emotional beats (pauses, micro-moments)
- [ ] Atmospheric descriptions vary across chapters (no repeated sensory palette >40%)
- [ ] Detective has explicit personal stake described
- [ ] Culprit reveal includes moral complexity
- [ ] Aftermath shows consequences and emotional resolution
- [ ] 2 consecutive clean runs (1 medium, 1 long) pass all checks
- [ ] Regression tests added for fair play enforcement andary across chapters (no repeated sensory palette >40%)
- [ ] Detective has explicit personal stake described
- [ ] Culprit reveal includes moral complexity
- [ ] Aftermath shows consequences and emotional resolution
- [ ] 2 consecutive clean runs (1 medium, 1 long) pass all checks
- [ ] Regression tests added for scaffold leakage detection

### Soul audit (per "What Makes a Good Whodunnit" criteria)

**1. The Murder Must Mean Something:** ❌ FAIL  
Victim is unnamed and unknown. No one grieves. Murder is purely mechanical plot device.

**2. Give Every Suspect a Wound:** ❌ FAIL  
Suspects are defined only by alibis and surface motives. No private longings, contradictions, or vulnerabilities unrelated to crime.

**3. The Detective Needs a Personal Stake:** ❌ FAIL  
Amelie has no internal conflict, no past failure, no personal connection to case or victim.

**4. Add Moments That Don't Advance the Plot:** ❌ FAIL  
Every scene is pure plot progression. No pauses, trembling hands, jokes at wrong time, staring at photos.

**5. Let Emotion Leak Into Dialogue:** ❌ FAIL  
All dialogue is clinical information exchange. No subtext, no hands betraying fear, no contradictions between words and body language.

**6. Raise Moral Complexity:** ❌ FAIL  
Culprit motive is simple jealousy. No moral ambiguity, no uncomfortable nuance, no tension between justice and mercy.

**7. Add Sensory Atmosphere:** ⚠️ PARTIAL PASS  
Atmosphere exists but is repetitive and generic (overcast skies, thick air, tobacco scent recycled endlessly). Lacks variety and recurring unique anchors.

**8. Let Someone Break:** ⚠️ PARTIAL PASS  
Jacqueline's confession shows emotional breakdown, but it's the only crack. Others remain composed throughout.

**9. Make the Reveal Hurt:** ❌ FAIL  
ReFair play audit: `COMPLETE` - **45/100 CRITICAL FAIL** (2 violations with 0-scores)
- Soul audit: `COMPLETE` (catastrophic failure across 8/9 dimensions)
- Remediation planning: `COMPLETE` (P0/P1/P2 actions defined)
- Implementation: `NOT-STARTED`
- Re-run verification: `BLOCKED` (awaiting P0-P2 implementation)

---

## Run Review: project_proj_d0af6453-7200-4c17-b3ac-fba5923582c3 (latest run)

**Run ID:** run_d61170b3-4a95-44e3-9e07-c51db8c72829  
**Date:** 2026-03-10  
**Project:** project (`proj_d0af6453-7200-4c17-b3ac-fba5923582c3`)  
**Story file:** not produced (run aborted during prose)  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL`

### Observed defects
- **[S1 High] Prose generation abort caused by opening-style entropy guardrail**  
  **Evidence:** run event `pipeline_error` reports: `Chapter 5 failed validation after 2 attempts. Issues: Template linter: opening-style entropy too low (0.72 < 0.80).`  
  **Impact:** pipeline stops mid-story; no complete prose artifact is available for downstream review/export.  
  **Root-cause hypothesis:** entropy threshold and chapter-opening diversity constraints are too brittle for early chapter windows under current generation behavior.

- **[S2 Medium] Temporal contradiction persists under retry flow**  
  **Evidence:** Chapter 1 retry warning: `month/season contradiction (april vs autumn)` before succeeding on retry.  
  **Impact:** indicates temporal consistency is still unstable and dependent on retry luck rather than first-pass robustness.  
  **Root-cause hypothesis:** temporal grounding directives are not sufficiently hard-constrained in chapter prompts and first-pass validation feedback loops.

- **[S2 Medium] Report diagnostics missing despite prose phase scoring**  
  **Evidence:** report file exists with `PHASE_COUNT=13` including `Prose Generation | 75 | C | False`, but `HAS_DIAGNOSTICS=False`.  
  **Impact:** weak observability for failure triage; post-generation forensic detail (including fair-play telemetry fields) is unavailable in report payloads.  
  **Root-cause hypothesis:** diagnostics are not reliably upserted prior to failure path report generation, or are overwritten by later partial report saves.

### Phased remediation plan
#### P0 Containment (same day)
- **Action:** ensure aborted prose runs still persist `post_generation_summary` diagnostics before report write on failure paths.
- **Owner area:** `apps/worker` + `packages/story-validation`
- **Status:** `IN-PROGRESS`
- **Acceptance criteria:** failed/aborted prose runs include non-empty `diagnostics` with `post_generation_summary` in report JSON.

#### P1 Structural fixes (1–3 days)
- **Action:** refine chapter-opening entropy policy (repair-mode warmup/threshold profile) to reduce false aborts while preserving anti-template guarantees.
- **Owner area:** `packages/prompts-llm` + `apps/worker`
- **Status:** `IN-PROGRESS`
- **Acceptance criteria:** at least 2 consecutive runs complete prose without entropy hard-fail in first 30% of chapters.

#### P2 Hardening and regression (3–7 days)
- **Action:** add regression tests for (a) month/season contradiction retries and (b) diagnostics persistence on aborted prose runs.
- **Owner area:** `apps/worker/src/__tests__` + `packages/story-validation`
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** targeted tests pass and prevent silent diagnostics loss on future failures.

### Validation and verification
- **Required tests:** worker test suite plus new diagnostics-persistence regression tests.
- **Required full-run checks:** one aborted-run verification (diagnostics present) and one successful full prose run (diagnostics + fair-play fields present).
- **Export checks:** aborted runs clearly marked with actionable reason; successful runs produce prose output artifact.
- **Gate outcome:** failed due prose abort and missing diagnostics payload.

### Definition of done
- [ ] Aborted prose runs include diagnostics in report payload
- [ ] No recurrent opening-style entropy abort in early chapters
- [ ] Temporal month/season contradictions reduced to zero critical failures
- [ ] Successful run includes fair-play component telemetry in post-generation diagnostics
- [ ] Regression tests added/updated

### Critical Note
**This run is RELEASE-BLOCKED due to fair play violations.** Even if all soul/quality issues were fixed, this story cannot be released without fair play score ≥60/100. Fair play is the foundational contract of mystery fiction - readers must be able to solve the mystery alongside the detective. Current score of 45/100 with two 0-score dimensions (Clue Visibility and Information Parity) indicates the detective is withholding critical information from the reader, which breaks genre trust.
### Status update after review
- Encoding fix validation: `DONE` (no mojibake artifacts detected)
- Soul audit: `COMPLETE` (catastrophic failure across 8/9 dimensions)
- Remediation planning: `COMPLETE` (P0/P1/P2 actions defined)
- Implementation: `NOT-STARTED`
- Re-run verification: `BLOCKED` (awaiting P0-P2 implementation)
