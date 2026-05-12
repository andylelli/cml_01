# Agent 6 Fair Play Auditor — Overhaul Plan

**Date**: 2026-05-11  
**Run reference**: mystery-1778518410355  
**Status**: Draft — pending implementation

---

## 1. Problem Statement

Agent 6 (Fair Play Auditor) runs 4 times in a typical pipeline but **never produces a `pass`**. The system accepts the result anyway via a deterministic downgrade path, and prose generation proceeds. This means:

- 4 LLM calls are spent with near-zero direct pass signal
- The LLM's output is almost entirely decorative — the real structural repair is done deterministically by the backstop/parity-bridge injectors in `agent6-run.ts`
- Agent 6's violation list drives Agent 5 retry and Agent 4 CML revision, but those upstream agents are working against a flawed audit signal (hallucinated violations)

The core issue is **hallucination of missing clues**. Agent 6 consistently reports:

> "The scratch marks on the clock's winding mechanism are not in the clue distribution"

...when in fact no such clue exists in the CML at all. The model invents a specific physical clue, then marks the story as failing because that invented clue is absent. This pattern repeats identically across all 4 Agent 6 invocations in this run.

---

## 2. Root Cause Analysis

### 2.1 The hallucination loop

**Source**: The CML's `inference_path.steps[].required_evidence` lists raw strings like `"A faint scratch mark on the clock's winding mechanism"`. This appears in the Agent 6 context under `## Inference Path → Required evidence`. The model reads this as **a clue that must exist in the clue distribution**, but it is actually just a CML authoring note about what physical evidence the detective uses — not a clue ID that must appear in the clue list.

**Effect**: Agent 6 compares `required_evidence` items against the clue distribution's `description` fields and, finding no exact match, emits a `Clue Visibility` critical violation for a clue that doesn't formally exist. This then cascades into `Information Parity`, `Logical Deducibility`, `Discriminating Test Timing`, and `No Withholding` — all 5 structural rules fail from one hallucinated premise.

**Why it persists across retries**: The same `required_evidence` text appears in every subsequent Agent 6 call (it's in the developer context, not the user message). The feedback loop never resolves the hallucination because the model cannot distinguish CML authoring notes from clue obligations.

### 2.2 The prompt does not distinguish CML schema roles

The current developer context presents:
- `## Inference Path → Required evidence: A faint scratch mark...`
- `## Clue Distribution → Early Clues: [list of actual clues]`

The model treats `required_evidence` as a clue obligation. There is no labelling in the prompt to clarify that `required_evidence` is an authoring scaffold — the clue coverage is what matters, not name-matching individual evidence strings.

### 2.3 The evaluation criteria are ambiguous

The 7-rule system prompt defines "Clue Visibility" as "all clues must be revealed to the reader before the solution". The model applies this to `required_evidence` strings literally, rather than to the actual clue IDs. The prompt does not tell Agent 6 what it should check against — the clue distribution is the ground truth, but this is not stated explicitly.

### 2.4 The orchestrator's response to failure is entirely deterministic

The `shouldEscalateStructuralCmlRevision()` function escalates on `inference_path_abstract` or `clue_coverage` — and `classifyFairPlayFailure()` returns `inference_path_abstract` whenever `discriminating test timing` + `information parity` are both critical. Since the model always emits both, escalation always fires. But the real deterministic fixes (`ensureParityBridgeClue`, `ensureCriticalFairPlayBackstopClues`) would patch the gaps whether or not Agent 6 raised them.

**Conclusion**: Agent 6 as currently written is a noise source, not a signal source. Its violation list is mostly hallucinated. The deterministic backstop is doing the real work.

### 2.5 The downgrade path is opaque

The `'Fair-play: downgraded uncorroborated Logical Deducibility critical flag'` warning in the log shows the orchestrator is already second-guessing Agent 6's output. But the downgrade logic is buried in orchestrator code and not reflected back to Agent 6 — so the agent never learns its output is being overridden.

---

## 3. What Is Working (Preserve)

| Component | Assessment |
|---|---|
| `buildFairPlayPrompt` — surface model, hidden model, clue timeline | Good context, well-structured |
| `classifyFairPlayFailure` | Correct classification logic; the failure class is right even when Agent 6's signal is wrong |
| `ensureParityBridgeClue` | Reliable backstop — should stay |
| `ensureCriticalFairPlayBackstopClues` | Per-step contradiction coverage — should stay |
| `enforceAgent5DeterministicContracts` called post-Agent-6 | Core correctness gate — should stay |
| Blind reader simulation (Agent 6b) | Good independent signal, passes reliably — preserve |
| `deriveRetryTargetedClueIds` / `deriveRetryPreserveClueIds` | Correct targeting logic |

---

## 3b. Strategic Critique of the Original Approach

The changes in section 4 (prompt labelling, ID manifest, structured checklist) improve Agent 6, but they remain **tactical**: they ask the LLM to do data verification more accurately. That is the wrong frame.

### The misuse of LLMs in structural verification

Every structural violation that fired in the current run was answerable by deterministic code:

- "Is clue_4 in the mid distribution?" → `clues.find(c => c.id === 'clue_4' && ['early','mid'].includes(c.placement))`
- "Does inference step 2 have an essential early/mid clue?" → filter + count over structured data
- "Are all `evidence_clues` IDs present?" → set intersection

These are **database query tasks**. Language models are probabilistic text predictors — they cannot perform set membership lookups reliably regardless of how well the prompt is written. Improving the prompt makes the LLM *less wrong*, not *reliable*. The structured checklist (4.2) still asks the model to answer "does clue_4 exist in mid?" — a better-constrained version of the same misuse.

The violations Agent 6 genuinely *cannot* be replaced by code for are:

- "Is the discriminating test a genuine logical test, or a narrative coincidence?"
- "Does the false assumption feel convincingly planted?"
- "Is the solution discoverable without external knowledge the reader can't be expected to have?"

Those are **judgment calls**. That is where LLM capability is real. Agent 6 should be doing only those checks.

### The correct division of labour

```
Structural verification  →  deterministic code  (100% reliable, free, instant)
Narrative quality        →  LLM judgment        (probabilistic but suited to the task)
```

Currently Agent 6 does both, and does the first one badly. The strategic fix is to make this split explicit in the architecture — not to improve how the LLM performs the structural half.

---

## 3c. Holistic Target Architecture

```
BEFORE any Agent 6 LLM call:

  Step A — Deterministic Structural Audit (new, no LLM)
    ├─ Check all discriminating_test.evidence_clues IDs exist in early|mid placement
    ├─ Check each inference step has ≥1 essential early|mid clue
    ├─ Check each non-culprit has ≥1 clue pointing away from them
    └─ Output: StructuralAuditResult { passed: boolean, gaps: Gap[] }

  Step B — Apply backstops immediately (currently runs POST-Agent-6)
    ├─ ensureParityBridgeClue()
    └─ ensureCriticalFairPlayBackstopClues()

  Step C — Re-run Structural Audit on patched clue set
    ├─ If passes: proceed to Agent 6 LLM with VERIFIED STRUCTURAL FACTS
    └─ If still has gaps: escalate to Agent 4 directly (LLM add no value here)

Agent 6 LLM (reframed role — narrative quality only):

  Developer context includes:
    "STRUCTURAL STATUS (system-verified): PASS
     - All 3 inference steps have essential early/mid coverage ✓
     - All evidence_clues IDs (clue_4, clue_fp_...) present in mid ✓
     - 4 cast members, 3 non-culprits each have eliminating clues ✓
     DO NOT re-derive structural facts. They are verified. Assess only:"

  Audit tasks (LLM-appropriate):
    1. Is the discriminating test a genuine inferential test, or does it rely on
       coincidence/confession/authority?
    2. Does the false assumption feel convincingly planted across the clue trail?
    3. Is the solution discoverable by a reader who has not read the solution?
    4. Does the clue trail feel fair (evidence before deduction) or like a trick
       (revelation withheld arbitrarily)?

Escalation policy (reframed):

  StructuralAuditResult.passed = false  →  deterministic backstop → re-audit → Agent 4 if still failing
  Agent 6 narrative fail               →  flag for Agent 9 / story notes; do NOT revise CML
  Agent 6 narrative pass               →  proceed to prose
```

### Why this is different from prompt-fixing

| Dimension | Tactical (sections 4.1–4.3) | Strategic (3c) |
|---|---|---|
| Root cause addressed | Bad prompt framing | LLM doing a computer's job |
| Reliability of structural check | "Less wrong" LLM | Deterministic — 100% reliable |
| Agent 6 role | Same (structural + narrative) | Narrowed: narrative only |
| Backstop timing | Post-Agent-6 (current) | Pre-Agent-6 (LLM sees patched state) |
| Escalation trigger | LLM's `structuralGaps` flag | Deterministic audit result |
| Agent 6 calls | Still 2–3 possible | 1 (or skipped for clean CMLs) |
| CML revision (Agent 4) triggers | LLM-driven (unreliable) | Deterministic-only |

### Implementation split

**Phase 1** (prompt changes, 4.1–4.3 below): Low-risk, delivers partial improvement immediately. Still leaves Agent 6 doing structural verification but makes it less wrong.

**Phase 2** (architectural split, 4.5 and 4.6 revised): Adds the pre-LLM deterministic auditor and moves backstops to run before the LLM call. This is the structural change that makes reliability a property of the system rather than of the LLM.

Phase 2 is the correct end state. Phase 1 is a safe stepping stone to validate the prompt changes before committing to the larger refactor.

---

## 4. Proposed Changes

### 4.1 — Fix the `required_evidence` confusion in the prompt (HIGH IMPACT, LOW RISK)

**Problem**: `required_evidence` items in the inference path are presented to Agent 6 without context about their schema role, causing hallucinated Clue Visibility violations.

**Fix**: In `buildDeveloperContext()` in `agent6-fairplay.ts`, rename and annotate the `required_evidence` block:

```
## Inference Path (Detective's Logic)
...
1. **The clock shows nine-thirty**: The clock was stopped to mislead. → Eliminates clock reliability
   **Detective's required evidence (authoring notes — NOT clue IDs)**:
   - The clock had stopped just before the murder was discovered.
   - A faint scratch mark on the clock's winding mechanism.
   ↑ These are CML authoring notes. Your audit scope is the Clue Distribution section below.
```

Add a bolded instruction in the developer context:

```
> ⚠️ AUDIT SCOPE: Only validate clues listed in the "## Clue Distribution" section. 
> The "required_evidence" items in the Inference Path are CML authoring notes, not formal clue IDs.
> Do NOT report violations for evidence strings that do not appear as formal clues — only report
> violations when required clue IDs listed in "## Essential Clues" or "discriminating_test.evidence_clues" 
> are missing from the Early or Mid distribution.
```

**Expected outcome**: Eliminates the core hallucination. Agent 6 stops inventing scratch-mark clues.

---

### 4.2 — Replace open-ended violation report with a structured checklist (HIGH IMPACT, MEDIUM RISK)

**Problem**: The current system prompt asks Agent 6 to "perform a rigorous fair play audit" against 7 abstract rules. This is maximally open-ended — the model is free to invent failures it can't actually verify.

**Fix**: Replace the open-ended audit task with a structured binary checklist. The model answers YES/NO + evidence for each check, based only on what is in the context. Each check references a specific field:

```
AUDIT CHECKLIST — answer each with YES/NO and cite the specific clue ID or evidence:

1. CLUE COVERAGE: Does the Clue Distribution contain ≥1 essential early clue, 
   ≥1 essential mid clue, and ≥1 essential late clue?
   [answer with counts from the distribution]

2. DISCRIMINATING TEST SUPPORT: Do all IDs listed under discriminating_test.evidence_clues 
   appear in the Early or Mid clue distribution?
   [list each ID and state present/absent]

3. INFERENCE CHAIN: Is there at least one essential early/mid clue for each inference step 
   (step 1, step 2, step 3)? List the clue ID for each step.

4. ELIMINATION COVERAGE: Is there ≥1 essential clue that explicitly eliminates each 
   non-culprit suspect by name?
   [list each non-culprit and the clue ID that eliminates them]

5. READER SOLVABILITY: Based ONLY on the Early + Mid clues listed, can a reader execute 
   observation → correction → elimination before Act III?
   [brief yes/no with the clue IDs that form the chain]

6. DISCRIMINATING TEST TIMING: Does the discriminating test appear in Act III and rely 
   only on clues introduced before it?
   [cite the timing field from quality_controls]

7. NO NEW INFORMATION: Does the discriminating test introduce any fact not present in 
   Early/Mid clues?
   [yes = violation, no = pass]
```

This constrains the model to answer from context rather than reasoning about what "should" exist.

---

### 4.3 — Add an explicit clue ID manifest to the developer context (MEDIUM IMPACT, LOW RISK)

**Problem**: The model receives clue descriptions in prose form but must check whether specific IDs are present. It often fails to connect description text to discriminating_test.evidence_clues IDs.

**Fix**: Add a compact ID manifest section to `buildDeveloperContext()`:

```markdown
## Clue ID Manifest (audit reference)

**discriminating_test.evidence_clues** (must be essential early|mid):
- clue_4
- clue_fp_contradiction_step_3_2

**All clue IDs in distribution** (early | mid | late):
Early: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_1, ...
Mid:   clue_2, clue_3, clue_4, clue_5, clue_core_elimination_chain, ...
Late:  clue_fp_late_texture_1

**Essential clues by inference step**:
- Step 1: clue_mechanism_visibility_core (early), clue_core_contradiction_chain (early)
- Step 2: clue_2 (mid), clue_culprit_direct_... (mid)
- Step 3: clue_3 (mid), clue_4 (mid)
```

This gives Agent 6 machine-readable ground truth to check against instead of prose matching.

---

### 4.4 — Add a `passed_checks` field to the output schema (LOW IMPACT, LOW RISK)

**Problem**: The orchestrator receives an `overallStatus: "fail"` even when 6/8 checks pass. The pass/fail binary triggers escalation even for marginal failures.

**Fix**: Add a `passed_checks` count and `structural_gaps` boolean to the output schema. The orchestrator uses `structural_gaps: false` to skip CML revision even when `overallStatus: "fail"`.

Update `FairPlayAuditResult`:
```typescript
passedCheckCount: number;
failedCheckCount: number;
structuralGaps: boolean; // true only if discriminating_test evidence_clues or essential chain is broken
```

The orchestrator's `shouldEscalateStructuralCmlRevision()` should check `structuralGaps` instead of `hasCriticalViolations()`. This avoids triggering a full CML revision + Agent 4 call for marginal non-structural failures.

---

### 4.5 — Pre-LLM deterministic structural auditor (Phase 2 — STRATEGIC, HIGH IMPACT)

**Problem**: The current architecture treats deterministic fixing as a fallback after Agent 6 fails. Backstops (`ensureParityBridgeClue`, `ensureCriticalFairPlayBackstopClues`) are 100% reliable but run *after* the LLM has already returned a violation list based on the un-patched state. The LLM audits a stale picture, then the system silently corrects the gaps the LLM flagged.

**Fix** (see section 3c for the full architecture):

1. **Move backstops to before the first Agent 6 LLM call** in `agent6-run.ts`
2. **Add a new `runDeterministicStructuralAudit(cml, clues)` function** that checks:
   - All `discriminating_test.evidence_clues` IDs exist in early|mid placement
   - Each inference step has ≥1 essential early|mid clue (`supportsInferenceStep` match)
   - Each non-culprit suspect has ≥1 clue that eliminates them
   - Returns `StructuralAuditResult { passed: boolean, gaps: StructuralGap[] }`
3. **Pass the structural audit result into the Agent 6 developer context** as verified facts:
   ```
   STRUCTURAL STATUS (system-verified — do not re-derive):
   ✓ All 3 inference steps have essential early/mid coverage
   ✓ All evidence_clues IDs present in early/mid distribution
   ✓ All non-culprits have eliminating clues
   → Your task: assess narrative quality only (see below)
   ```
4. **Only escalate to Agent 4 if `runDeterministicStructuralAudit` returns gaps** after backstops have been applied — not based on LLM opinion
5. **Reframe Agent 6's LLM task** to narrative quality only (see section 3c)

This inverts the authority hierarchy: the deterministic gate is the guard rail, Agent 6 is the narrative quality signal.

---

### 4.6 — Collapse 4 Agent 6 calls to 1 (Phase 2 — EFFICIENCY)

**Problem**: Agent 6 currently runs 4 times per pipeline, always failing, consuming ~50 seconds of wall time and triggering unnecessary Agent 4 + Agent 5 calls.

**Fix**: Once Phase 2 is implemented:
- Deterministic structural audit runs pre-LLM → if it passes, no structural escalation
- Agent 6 LLM runs once for narrative quality
- If narrative quality passes → proceed to prose (no re-run)
- If narrative quality fails → note for Agent 9 / retry prose, do NOT revise CML
- Only trigger Agent 6 re-run after Agent 4 revision if `runDeterministicStructuralAudit` found real gaps that Agent 4 was asked to fix

Target: **1 Agent 6 LLM call** for structurally sound CMLs. The blind reader (Agent 6b) remains as a second narrative opinion. Combined target: 2 LLM calls for the entire fair-play phase, down from 4.

---

## 5. Implementation Sequence

### Phase 1 — Prompt fixes (low risk, immediate partial improvement)

| # | Change | File | Risk | Impact |
|---|---|---|---|---|
| 1 | Label `required_evidence` as authoring notes in prompt | `packages/prompts-llm/src/agent6-fairplay.ts` | Low | High |
| 2 | Add audit scope boundary notice to developer context | `packages/prompts-llm/src/agent6-fairplay.ts` | Low | High |
| 3 | Add clue ID manifest section | `packages/prompts-llm/src/agent6-fairplay.ts` | Low | Medium |
| 4 | Replace open-ended user task with structured checklist | `packages/prompts-llm/src/agent6-fairplay.ts` | Medium | High |

Deliver Phase 1 as a single change. Run canary:core to measure reduction in hallucinated violations before proceeding to Phase 2.

### Phase 2 — Architectural split (higher risk, correct end state)

| # | Change | File | Risk | Impact |
|---|---|---|---|---|
| 5 | Add `runDeterministicStructuralAudit()` function | `apps/worker/src/jobs/agents/agent6-run.ts` | Medium | High |
| 6 | Move backstop injectors to before first Agent 6 LLM call | `apps/worker/src/jobs/agents/agent6-run.ts` | Medium | High |
| 7 | Pass `StructuralAuditResult` into Agent 6 developer context | `packages/prompts-llm/src/agent6-fairplay.ts` | Medium | High |
| 8 | Reframe Agent 6 user task as narrative quality only | `packages/prompts-llm/src/agent6-fairplay.ts` | Medium | High |
| 9 | Drive escalation policy from `StructuralAuditResult`, not LLM | `apps/worker/src/jobs/agents/agent6-escalation-policy.ts` | High | High |
| 10 | Collapse retry loop: 1 Agent 6 call for clean CMLs | `apps/worker/src/jobs/agents/agent6-run.ts` | High | Medium |

Phase 2 should not be implemented until Phase 1 canary results confirm the prompt changes are stable.

---

## 6. Success Criteria

### After Phase 1 (prompt fixes only)

| Metric | Current | Target |
|---|---|---|
| Hallucinated violations (invented clue names) | Present every run | Zero |
| Agent 6 `overallStatus: pass` on first call | 0% | ≥40% for structurally correct CMLs |
| Agent 6 calls per run | 4 | ≤3 |

### After Phase 2 (architectural split)

| Metric | After Phase 1 | Target |
|---|---|---|
| Agent 6 `overallStatus: pass` on first call | ≥40% | ≥90% for structurally correct CMLs |
| Agent 6 LLM calls per run | ≤3 | 1 |
| CML revision (Agent 4) triggered unnecessarily | Rare | Never (only when deterministic audit finds real gaps) |
| Downstream Agent 5 retry from false Agent 6 signal | 0–1 | 0 |
| Pipeline wall time for fair-play phase | ~50s | ≤15s |
| Structural verification reliability | LLM-dependent (probabilistic) | Deterministic (100%) |

---

## 7. Risk Assessment

### Phase 1 — Prompt changes (4.1–4.4)
**Risk**: Low. Worst case: the model returns a different hallucination pattern. Current baseline is 0 passes, so any improvement is additive. Prompt changes cannot break deterministic backstops.

### Phase 2 — Architectural split (4.5–4.6, steps 5–10)
**Risk**: Medium–High. Moving backstops to pre-LLM changes the order of operations. The `runDeterministicStructuralAudit` function must be verified to catch the same gaps that the current system catches (just earlier). Key invariants to preserve:

- All existing backstop injectors (`ensureParityBridgeClue`, `ensureCriticalFairPlayBackstopClues`) must continue running
- The escalation to Agent 4 must still fire when real structural gaps exist that the backstops cannot close
- The blind reader simulation (Agent 6b) must still run and can still independently trigger re-work

**Mitigation**: Implement `runDeterministicStructuralAudit` alongside the existing code first (dual-run), compare results against current Agent 6 outputs for several canary runs, then remove the LLM structural checks once parity is confirmed.

---

## 8. What NOT to Change

- Do not remove Agent 6 entirely — narrative checks (false assumption plausibility, solution uniqueness, test fairness) are not deterministically verifiable and require LLM judgment
- Do not remove the blind reader simulation (Agent 6b) — it provides an independent narrative signal and currently passes reliably; it is the closest thing to a genuine pass signal in the current system
- Do not change Agent 6 temperature (0.3) — appropriate for structured audit tasks
- Do not alter `enforceAgent5DeterministicContracts` — most reliable gate in the pipeline
- Do not let narrative quality failures from Agent 6 trigger CML revision — that is not a structural problem and Agent 4 cannot fix it
