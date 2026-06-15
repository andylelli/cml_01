# 10 - Prose Story Stage Rules: Implementation Specification

Status: Design-ready implementation plan
Owner: Agent 9 prose pipeline
Scope: Stage-aware prompting, mode-specific validation, continuity hardening

---

## 1. Objective

Implement stage-aware prose generation that treats story facts as binding constraints and produces chapter batches with a clear mode, required investigation-state change, and mode-specific pass/fail checks.

This implementation extends the current Agent 9 architecture. It does not replace cast planning, clue planning, or existing hard constraints.

---

## 2. Non-goals

1. Replacing the cast planner.
2. Replacing CML structure or clue distribution design.
3. Changing the high-level multi-agent orchestration order.
4. Introducing free-form chapter modes chosen by the model.

---

## 3. Required Runtime Behavior

1. Every prose batch resolves to one active chapter mode.
2. The active mode controls chapter priorities, balance targets, required outcome, forbidden reveals, and mode-specific checklist gates.
3. Core story constraints remain hard and global:
   - cast identity and name consistency
   - pronoun lock
   - locked facts
   - timeline consistency
   - fair play
   - physical plausibility
   - continuity safety
   - no unsupported new facts
4. After Chapter 1, character writing is pressure-focused, not biography recap.
5. Final reveal must prove murder responsibility, not only mechanism manipulation.

---

## 4. Chapter Modes

Supported deterministic modes:

1. DiscoveryOpening
2. EarlyInvestigation
3. SuspectPressure
4. FalseSuspectClearing
5. ClueReinterpretation
6. DiscriminatingTest
7. FinalReveal
8. AftermathConsequence

Mode assignment is deterministic and computed in code from chapter range plus CML obligations and outline structure.

---

## 5. Data Contract Changes

## 5.1 Config schema (generation params)

Add explicit mode profiles under Agent 9 configuration.

Proposed section:

```yaml
agent9_prose:
  stage_modes:
    discovery_opening:
      balance_targets:
        setting: { min_pct: 15, max_pct: 20 }
        character_introductions: { min_pct: 35, max_pct: 40 }
        discovery_reactions: { min_pct: 25, max_pct: 30 }
        first_clue: { min_pct: 10, max_pct: 15 }
      required_outcomes:
        - victim_named
        - major_suspects_intro_with_tension
        - first_clue_planted
      forbidden:
        - no_culprit_reveal
        - no_full_method_explanation
    early_investigation:
      ...
    suspect_pressure:
      ...
    false_suspect_clearing:
      ...
    clue_reinterpretation:
      ...
    discriminating_test:
      ...
    final_reveal:
      ...
    aftermath_consequence:
      ...
```

Backward compatibility:

1. Keep existing chapter_composition_targets and map it to mode profiles as defaults.
2. If stage_modes is absent, use compiled defaults from code.

## 5.2 Type additions

Add types in story validation params module for:

1. StageModeKey
2. StageModeProfile
3. StageModeBalanceTarget
4. StageOutcomeTemplate
5. StageForbiddenReveal

Files:

1. packages/story-validation/src/generation-params.ts
2. apps/worker/config/generation-params.yaml

---

## 6. Prompt Assembly Changes

## 6.1 Active mode resolver

Implement deterministic resolver in prompt builder:

Inputs:

1. chapterStart, chapterEnd, totalScenes
2. scene metadata from outline
3. CML prose requirements
4. whether discriminating test scene is in current batch
5. whether this batch is final reveal or aftermath segment

Output:

1. activeMode: StageModeKey

Primary precedence:

1. FinalReveal if batch contains culprit reveal scene or final scene.
2. AftermathConsequence if batch is post-reveal consequence scene.
3. DiscriminatingTest if batch contains discriminating test scene.
4. FalseSuspectClearing if batch contains required suspect clearance scene.
5. ClueReinterpretation if outline scene purpose indicates reinterpretation pivot.
6. DiscoveryOpening for chapter 1.
7. SuspectPressure for scenes dominated by one suspect pressure line.
8. EarlyInvestigation fallback.

## 6.2 Stage mode contract block

Inject new critical block immediately after character and pressure contracts:

Header:

`## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)`

Must contain:

1. active mode name
2. required chapter outcome for this batch
3. allowed and forbidden reveal scope
4. mode-specific balance targets
5. pass/fail checklist for this mode

## 6.3 Required chapter outcome object

Build and inject a chapter outcome object per batch:

```text
Chapter outcome for this batch:
- Investigation state at start: <state>
- Must change by end: <state change>
- Primary suspect pressure shift: <name + direction>
- Required new information: <clue, reinterpretation, contradiction, or test result>
- Forbidden reveals in this mode: <list>
```

This is mandatory and validated after generation.

## 6.4 Mode-specific checklist message

Current generic checklist remains, but append a mode-specific section:

1. DiscoveryOpening checks
2. EarlyInvestigation checks
3. SuspectPressure checks
4. FalseSuspectClearing checks
5. ClueReinterpretation checks
6. DiscriminatingTest checks
7. FinalReveal checks
8. AftermathConsequence checks

---

## 7. Priority and Budgeting by Mode

Current block ordering remains global, but block token caps and retention priority become mode-aware.

## 7.1 Opening priority profile

Highest retention priority:

1. first_appearance_contracts
2. character_consistency
3. pronoun_accuracy
4. locked_facts
5. narrative_state
6. continuity_context
7. fair_play_contract

## 7.2 Suspect-pressure profile

Highest retention priority:

1. character_pressure_contract
2. character_consistency
3. character_personality
4. character_contracts
5. locked_facts
6. narrative_state
7. continuity_context
8. fair_play_contract
9. pronoun_accuracy

## 7.3 Technical test profile

Highest retention priority:

1. discriminating_test
2. locked_facts
3. clue_descriptions
4. physical_plausibility
5. fair_play_contract
6. narrative_state
7. continuity_context
8. character_pressure_contract
9. pronoun_accuracy

Implementation note:

Add a mode-aware perBlockTokenCap resolver in applyPromptBudgeting so low-value blocks are dropped first for that mode.

---

## 8. Validation and Gate Changes

## 8.1 New mode outcome gate

Add gate `stage_mode_outcome` in pre-commit validation.

Validation checks:

1. required outcome for active mode is present in prose
2. prohibited reveal patterns are absent for active mode
3. investigation state materially changes when mode requires it

## 8.2 Existing global gates remain hard

Keep hard failures for:

1. cast consistency and name drift
2. pronoun drift
3. victim alive after death (without explicit framing)
4. locked fact mismatch
5. timing contradictions
6. fair-play violations
7. malformed output

## 8.3 New final reveal completeness gate

Add gate `final_reveal_completeness`:

Required elements:

1. motive
2. method of death
3. concealment or misdirection mechanism
4. opportunity
5. clue chain
6. culprit mistake or trace
7. innocent suspect clearances
8. emotional consequence

Failure if confession includes only mechanism tampering without death responsibility.

## 8.4 New discriminating test gate

Add gate `discriminating_test_validity`:

Required structure:

1. competing theories stated
2. concrete test action
3. observable result
4. explicit prove and rule-out statements
5. changed suspect field or investigation state

Failure if chapter only re-explains known clue without new discriminatory result.

## 8.5 New anti-template leakage gate

Extend existing linter to hard-fail:

1. planning-note leakage
2. scene metadata leakage
3. placeholder labels
4. malformed sentence fragments
5. repeated stock atmospheric opening patterns

---

## 9. File-Level Implementation Plan

## 9.1 Prompt and contracts

1. packages/prompts-llm/src/agent9-prose/prompt-builder.ts
   - add StageModeKey resolver
   - add stage mode contract block builder
   - add chapter outcome block builder
   - add mode-specific checklist builder
   - add mode-aware block budgeting profile
2. packages/prompts-llm/src/agent9-prose/prompt-blocks.ts
   - add new fields to PromptSectionInputs:
     - stageModeContractBlock
     - chapterOutcomeBlock
     - modeChecklistBlock
3. packages/prompts-llm/src/agent9-prose/discriminating.ts
   - align discriminating checklist with concrete theory-test-result structure
4. packages/prompts-llm/src/agent9-prose/obligation-block.ts
   - include mode-forbidden reveal hints and required end-state markers

## 9.2 Validation

1. packages/prompts-llm/src/agent9-prose/clue-validation.ts
   - add mode outcome and reveal scope checks
   - add final reveal completeness checks
   - add discriminating test validity checks
2. packages/prompts-llm/src/agent9-prose/lint.ts
   - add planning-note leakage and malformed fragment detection
   - tighten repeated atmospheric scaffold detection
3. packages/prompts-llm/src/agent9-prose/generate.ts
   - wire new gate failures into retry classification and feedback
   - persist active mode and outcome audit in batch telemetry

## 9.3 Worker orchestration and params

1. packages/story-validation/src/generation-params.ts
   - add stage mode config parsing, merge, clamp defaults
2. apps/worker/config/generation-params.yaml
   - add stage mode profiles and balance targets
3. apps/worker/src/jobs/agents/agent9-run.ts
   - include mode gate outcomes in release audit and run report

---

## 10. Retry Policy Adjustments

Failure category to retry strategy mapping:

1. stage_mode_outcome failure
   - targeted retry with mode outcome delta instructions
2. discriminating_test_validity failure
   - force structured theory A vs theory B framing on retry
3. final_reveal_completeness failure
   - force explicit death-method sentence and evidence chain reconstruction
4. suspect pressure weak or biography drift
   - force pressure-only rewrite constraints for affected chapter
5. continuity and pronoun failures
   - keep hard fail and immediate repair as today

Retry limits remain bounded and deterministic.

---

## 11. Telemetry and Reporting

Record in batch commit record:

1. active stage mode
2. expected chapter outcome
3. mode checklist pass/fail breakdown
4. global checklist pass/fail breakdown
5. gate failures by category and retry count

Expose in final report:

1. per-chapter mode
2. per-chapter required change
3. per-chapter outcome observed
4. unresolved validation warnings

---

## 12. Test Plan

## 12.1 Unit tests

1. mode resolver chooses correct mode for chapter ranges and CML markers
2. mode block builder outputs required fields
3. mode-specific checklist selection and rendering
4. final reveal completeness parser and failure detection
5. discriminating test validity parser and failure detection
6. anti-template leakage detector

## 12.2 Integration tests

1. opening batch yields victim naming + suspect-shape intros before deep mechanism explanation
2. suspect pressure batch yields new pressure reveal and state change without premature confession
3. false suspect clearing batch proves innocence through evidence, not assertion
4. discriminating test batch performs real test and narrows suspect field
5. final reveal batch states death method plus concealment mechanism plus motive chain

## 12.3 Canary acceptance checks

Run canary suite with at least one scenario per mode profile and verify:

1. no victim-alive violations
2. no pronoun drift
3. locked timing consistency preserved
4. stage_mode_outcome gate pass rate at or above target
5. final reveal completeness pass on all full stories

---

## 13. Rollout Plan

Phase 1:

1. add config and prompt assembly blocks behind feature flag `agent9_stage_mode_contract_enabled`
2. collect telemetry only, no hard fail

Phase 2:

1. enable soft gate warnings for mode outcome and discriminating validity
2. keep existing hard gates unchanged

Phase 3:

1. promote stage_mode_outcome, discriminating_test_validity, and final_reveal_completeness to hard gates
2. remove flag after stable canary pass window

Rollback:

1. disable flag and fallback to current generic checklist path
2. keep telemetry schema backward compatible

---

## 14. Definition of Done

1. Every chapter batch has deterministic active mode and explicit chapter outcome.
2. Prompt contains both global hard constraints and mode-specific mandatory contract.
3. Mode-specific checklist is enforced and reported.
4. Final reveal cannot pass unless death responsibility is explicit and complete.
5. Discriminating test cannot pass unless it truly separates theories and changes investigation state.
6. Post-Chapter-1 character writing is pressure-oriented and state-changing, not biography recap.
7. Canary runs show stable continuity, pronouns, timing, and mode-outcome compliance.

---

## 15. Notes on Existing Alignment

The current codebase already has partial foundations:

1. phase-aware composition targeting
2. post-Chapter-1 pressure contract block
3. first appearance contract block
4. broad pre-commit lint and continuity gates

This specification completes the missing pieces:

1. explicit chapter mode contract
2. explicit chapter outcome contract
3. mode-specific validation gates
4. mode-aware token priority
5. reveal completeness guarantees
