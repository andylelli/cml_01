# Fair Play Failure Analysis

**Date**: 14 February 2026  
**Scope**: Why generated mysteries fail the fair play audit — specifically **Information Parity** and **Logical Deducibility** — and what must change so they pass reliably.

---

## 1. The Symptom

The Agent 6 fair play audit consistently returns:

> *The mystery fails to meet several critical fair play standards, particularly regarding information parity and logical deducibility. The reader is not adequately equipped to deduce the solution based on the clues provided.*

This means that after the full CML → clues → fair-play-audit pipeline completes (including one retry with feedback), the auditor still concludes the reader cannot solve the mystery from the clues alone. The pipeline continues with warnings but the report stays `fail` or `needs-revision`.

---

## 2. How Fair Play Validation Works Today

### 2.1 The Chain

```
Agent 3 (CML Generator)
  └─ Creates: inference_path.steps[], constraint_space{}, 
     discriminating_test{}, fair_play{}, quality_controls{}
       │
Agent 5 (Clue Extractor)
  └─ Reads inference_path.steps[].observation as clue sources
  └─ Produces: clues[] with category/placement/criticality
  └─ Produces: redHerrings[]
       │
Deterministic Guardrails (orchestrator)
  └─ Checks: essential count ≥ min, no late essentials,
     early/mid/late minimums, no detective-only phrasing
       │
Agent 6 (Fair Play Auditor)
  └─ LLM audit (temp 0.3) against 9-point checklist
  └─ Returns: overallStatus, checks[], violations[]
       │
  If fail/needs-revision → regenerate clues with feedback → re-audit (max 2 tries)
```

### 2.2 The 9-Point Audit Checklist

| # | Rule | What It Checks |
|---|------|----------------|
| 1 | Clue Visibility | All essential clues revealed before discriminating test? |
| 2 | **Information Parity** | Reader = detective in knowledge? |
| 3 | Special Knowledge | Any specialized knowledge unexplained? |
| 4 | **Logical Deducibility** | Can reader follow inference path from clues alone? |
| 5 | Discriminating Test Timing | Crucial clue in Act II or early Act III? |
| 6 | No Withholding | Facts detective knows but reader doesn't? |
| 7 | Constraint Consistency | Clues align with constraint space? |
| 8 | False Assumption Support | Red herrings support the false assumption? |
| 9 | Solution Uniqueness | Clues point unambiguously to culprit? |

Rules 2, 4, and 6 are the critical ones flagged as failures.

### 2.3 What "Critical" Means in the Orchestrator

The orchestrator tracks four specific rule names as critical:
- **Clue Visibility**
- **Information Parity**
- **No Withholding**
- **Logical Deducibility**

If any violation touches these rules, the failure is flagged — but currently it only emits **warnings** and continues. It does not block the pipeline. The result is that the mystery ships with a known-bad fair play report.

---

## 3. Root Causes

### 3.1 The Inference Path → Clue Mapping Is Loose and One-Directional

**This is the core problem.**

The CML's `inference_path.steps[]` contains the detective's logical reasoning:

```yaml
inference_path:
  steps:
    - observation: "Everyone argues about access near death"
      correction: "Separate symptom onset from administration time"
      effect: "Alibis tied to late window lose decisiveness"
```

Agent 5 (clue extraction) is told:

> *Each step's "observation" is a potential clue source.*

But the prompt gives the LLM only the observation strings as a list — it doesn't explain *which observations are load-bearing* for the reader to make each correction. The LLM must infer which CML facts to surface as reader-visible clues, and it frequently:

1. **Omits essential inferential links** — an observation is surfaced as a clue, but the correction/effect that makes it meaningful is never made available to the reader.
2. **Creates clues that describe conclusions rather than observations** — e.g., "The timeline doesn't add up" instead of "The clock in the study showed 9:15 but the maid heard the crash at 9:45."
3. **Fails to make the false assumption's weakness observable** — the reader needs evidence that *contradicts* the false assumption, but the clues often only hint at the true explanation.

**Why this matters for Information Parity**: The detective has the full inference path (observation → correction → effect). The reader only gets the "observation" half, without the logical bridge. This is fundamentally an information gap.

**Why this matters for Logical Deducibility**: If the reader cannot see the evidence that supports each correction step, they cannot reproduce the detective's reasoning.

### 3.2 No Structural Validation That Clues Cover the Inference Path

The deterministic guardrails check:
- ✅ Essential clue count ≥ minimum
- ✅ No essential clues in late placement
- ✅ Early/mid/late distribution meets minimums
- ✅ No detective-only phrasing
- ✅ No duplicate clue IDs

They do **not** check:
- ❌ Whether every inference_path step has at least one supporting clue
- ❌ Whether the clues collectively allow the reader to make each correction
- ❌ Whether the false assumption's weakness has an observable contradiction in the clue set
- ❌ Whether the discriminating test conclusion is reachable from the evidence presented
- ❌ Whether each suspect can be eliminated using available clues

This means the system can produce a clue set that *looks* complete (enough count, good placement) but is *logically incomplete* (missing the evidence chain needed for deduction).

### 3.3 The Fair Play Audit Is LLM-Based and Non-Deterministic

Agent 6 is an LLM audit at temperature 0.3. It receives:
- The CML structure (inference path, constraints, cast, etc.)
- The full clue distribution (descriptions, placements, criticality)

It then *judges* whether the clues support the inference path. But:

1. **It can see the inference path** — so it knows the answer. An LLM auditing with the solution in front of it is biased toward finding the clues "close enough" even when they aren't.
2. **It has no ground truth reader model** — it doesn't simulate a reader who only sees the clues and must independently arrive at the conclusion.
3. **When it does flag failures, the only remedy is regenerating clues** — but if the underlying CML inference path is too abstract or the constraint space too sparse, no amount of clue reorganization will make the mystery solvable.

### 3.4 The CML Inference Path Itself Is Often Too Abstract

The CML generation prompt (Agent 3) asks for inference steps as `observation → correction → effect` triples. But it provides only generic guidance:

> *Build inference path with 3-5 logical steps*

It doesn't enforce that:
- Each observation must be *physically witnessable* by the reader in a scene
- Each correction must follow from *stated evidence*, not just logical reasoning
- Each effect must produce a *testable* narrowing of suspects

The result: inference paths are often written at a meta-narrative level ("Everyone argues about access" → "Separate symptom from administration") rather than a *clue-level* specification ("The medicine bottle label shows Dr. Bauerstein's prescription filled on Tuesday" → "But Mrs. Cavendish says medicine was changed on Monday" → "Administration window shifts 12 hours earlier").

### 3.5 The Retry Loop Can't Fix Upstream Design Problems

The current retry architecture:

```
Agent 5 produces clues
  → Agent 6 audits → FAIL
  → Agent 5 regenerates clues with feedback
  → Agent 6 re-audits → still FAIL (or marginal pass)
```

The retry *regenerates clues* — but the problem isn't the clue *packaging*. The problem is:
1. The CML inference path may not specify observable evidence
2. The constraint space may not contain enough concrete contradictions
3. The false assumption may not have a reader-discoverable weakness

Regenerating clues from the same CML is like rewording answers to a test where the questions are wrong.

### 3.6 No Bidirectional Consistency Check Between CML and Clues

After clues are generated, nothing verifies:
- Every `clue.sourceInCML` actually references a real CML path
- Every inference step's observation has a corresponding clue
- The clue set, taken alone (without the CML), uniquely identifies the culprit
- Red herrings don't accidentally provide more support for the true solution than for the false assumption

---

## 4. What "Information Parity" Actually Requires

For the reader to have parity with the detective, every link in this chain must be reader-accessible:

```
FALSE ASSUMPTION ← Reader sees this (red herrings reinforce it)
         │
    OBSERVATION 1 ← Reader must see this (clue in early/mid placement)
         │
    CONTRADICTION ← Reader must see this (evidence that challenges assumption)  
         │
    CORRECTION 1  ← Reader must be able to infer this from observation + contradiction
         │
    OBSERVATION 2 ← Reader must see this (next clue)
         │
    CORRECTION 2  ← Reader must infer this
         │
       ...
         │
DISCRIMINATING TEST ← Reader must witness this (late Act II / early Act III)
         │
    SOLUTION ← Reader should be able to derive culprit identity
```

Currently, the system provides the observations (as clues) but not necessarily the contradictions or the evidence that enables each correction. The detective "just knows" the corrections from the CML; the reader is left with observations that don't quite connect.

---

## 5. What "Logical Deducibility" Actually Requires

The reader must be able to:

1. **Start from the false assumption** (which red herrings reinforce)
2. **Encounter evidence that doesn't fit** the false assumption
3. **Reason through each correction** using only presented clues
4. **Narrow suspects** by applying constraints from evidence
5. **Arrive at the culprit** through elimination, not revelation

For this to work, the clue set must contain not just "facts" but **logical bridges** — pairs of evidence that create contradictions the reader can resolve.

### Example of a Working Chain

```
Clue 1 (early): "The library clock stopped at 9:15 PM"  
Clue 2 (early): "Mrs. Whitmore says she heard the crash at 9:45 PM"  
→ Reader can see: 30-minute gap between clock and witness → false assumption about timing is weakened

Clue 3 (mid): "Only Dr. Bauerstein and Mary had access to the medicine cabinet before dinner"
Clue 4 (mid): "The prescription label shows the medicine was refilled Tuesday — but the housekeeper changed it Monday"
→ Reader can see: Someone swapped the medicine between Monday and dinner → administration window narrows

Clue 5 (mid): "Dr. Bauerstein was at the hospital Tuesday from 3 PM to midnight"
→ Reader can see: Dr. Bauerstein couldn't have swapped the medicine → eliminated

Discriminating Test: "Poirot asks Mary to repeat exactly when she 'changed the medicine' — her account contradicts the pharmacy records"
→ Reader can see: Only Mary has the timeline knowledge to lie about this → Mary is the culprit
```

### Example of a Failing Chain (What We Produce Now)

```
Clue 1 (essential, early): "Behavioral observations suggest hidden tensions"
Clue 2 (essential, mid): "Timeline discrepancies in witness accounts"  
Clue 3 (supporting, mid): "Physical evidence contradicts surface narrative"
→ Reader cannot deduce anything specific from these abstract clues

Discriminating Test: "Detective demonstrates that only the culprit could have known X"
→ Reader has no way to verify this because X was never made specific in the clues
```

---

## 6. Recommendations

### 6.1 Upstream Fix: Make Inference Path Steps Clue-Specific (Agent 3)

**Priority: CRITICAL**

The CML's `inference_path.steps[]` should each specify:
- `observation`: What the reader will see (must be a concrete, scene-level observation)
- `correction`: What conclusion the reader can draw (must follow from observable evidence)
- `effect`: How this narrows the suspect pool (must be testable)
- **NEW** `required_evidence`: What specific CML facts the reader needs to see to make this correction
- **NEW** `reader_observable`: Boolean — can this observation be witnessed in a scene?

This change would need:
1. Schema update to `cml_2_0.schema.yaml` adding `required_evidence` and `reader_observable` fields to inference_path steps
2. Agent 3 prompt update requiring concrete, scene-level observations
3. Agent 3 prompt update with explicit instruction: *"Each observation must describe something the reader can witness, not a conclusion the detective draws"*

### 6.2 Add Deterministic Inference-Path Coverage Gate (Orchestrator)

**Priority: CRITICAL**

After Agent 5 generates clues, add a deterministic check:

```
For each inference_path.step:
  - Does at least one clue reference this step's observation?
  - Is there a clue that provides evidence for the correction?
If any step has zero covering clues → flag as critical gap
```

This is the **clue-to-inference alignment check** that is currently completely missing. It would catch the case where the clue set "looks good" (enough count, proper placement) but doesn't actually cover the logical reasoning.

### 6.3 Add Contradiction Pair Detection (Deterministic Guardrail)

**Priority: HIGH**

For each inference step, verify the clue set contains at least one *contradiction pair*: two clues that create a logical tension the reader can resolve. For example:
- Clue A: "The clock says 9:15"
- Clue B: "The witness says 9:45"
→ These form a contradiction pair for the timing correction

Without contradiction pairs, the reader has facts but no *reasoning fuel*.

### 6.4 Strengthen the Agent 5 Prompt with Explicit Coverage Requirements

**Priority: HIGH**

The current Agent 5 prompt says:

> *Each step's "observation" is a potential clue source.*

This should be changed to:

> *Each inference_path step MUST have at least one essential clue that makes its observation reader-visible, AND at least one supporting clue that provides the evidence needed for the reader to make the correction. Cite the exact step number each clue supports.*

Add a new field to the `Clue` type:
```typescript
interface Clue {
  // ...existing fields...
  supportsInferenceStep?: number;  // Which inference path step this clue enables
}
```

### 6.5 Add a "Reader Model" Simulation Step

**Priority: MEDIUM**

Instead of asking the LLM to audit with the full solution visible, add a two-pass audit:

1. **Blind pass**: Give the LLM only the clues and false assumption (no inference path, no culprit identity). Ask: "Who do you think did it, and why?" If the LLM cannot reach the right answer, the mystery is provably unsolvable from the clue set.

2. **Full pass**: The current Agent 6 audit with all context, checking for structural fair play compliance.

This would be a much stronger test of information parity — if the LLM can't solve it blind, neither can the reader.

### 6.6 Make the Fair Play Feedback Loop Bidirectional

**Priority: MEDIUM**

Currently, when Agent 6 fails, the feedback only goes back to Agent 5 (regenerate clues). But if the problem is in the CML itself (too-abstract inference path, missing constraints), clue regeneration can't fix it.

Add a secondary feedback path:

```
Agent 6 FAIL → classify failure type
  If "clue coverage" → retry Agent 5 (current behavior)
  If "inference path too abstract" → retry Agent 3/4 (strengthen CML)
  If "constraint space insufficient" → retry Agent 3/4 (add constraints)
```

This is more expensive (CML regeneration costs more than clue regeneration) but would address the root cause.

### 6.7 Add Fair Play Pre-Checks to CML Generation

**Priority: HIGH**

In Agent 3's prompt, add explicit validation rules:

1. *Every inference_path observation must describe something the reader can witness in a scene*
2. *The constraint_space must contain at least one concrete contradiction per inference step*
3. *The discriminating_test.design must reference specific evidence the reader has already seen*
4. *The fair_play.explanation must specifically name which clues support each inference step*

The current `fair_play.explanation` field is typically a generic statement like *"All evidence supports the solution."* It should be forced to be specific: *"Clues about the medicine timing (early) and pharmacy records (mid) allow the reader to narrow the administration window. The butler's hospital alibi (mid) eliminates him. Mary's contradictory account of the medicine change (discriminating test) identifies her as the culprit."*

---

## 7. Implementation Priority Order

| # | Fix | Effort | Impact | Dependencies |
|---|-----|--------|--------|-------------|
| 1 | Deterministic inference-path coverage gate (6.2) | Medium | High | None — can add to existing guardrails |
| 2 | Strengthen Agent 5 prompt with coverage requirements (6.4) | Low | High | None — prompt-only change |
| 3 | Add `supportsInferenceStep` to Clue type (6.4) | Low | Medium | Needs schema + type update |
| 4 | Strengthen Agent 3 prompt for concrete observations (6.7) | Low | High | None — prompt-only change |
| 5 | Make fair_play.explanation step-specific (6.7) | Low | Medium | Agent 3 prompt change |
| 6 | Add contradiction pair detection (6.3) | Medium | High | Needs inference-path + clue cross-referencing |
| 7 | Reader model blind simulation (6.5) | High | Very High | New LLM call, significant cost |
| 8 | Schema update for required_evidence (6.1) | Medium | High | Schema + validator + prompt changes |
| 9 | Bidirectional feedback to CML (6.6) | High | Very High | Orchestrator architecture change |

### Quick Wins (Prompt-Only, No Code Structure Changes)

Items 2, 4, and 5 are prompt-only changes that can be shipped immediately:
- Tell Agent 5 to explicitly map clues to inference steps
- Tell Agent 3 to write concrete, scene-level observations
- Tell Agent 3 to make fair_play.explanation cite specific clues per step

### Medium-Term (Deterministic Guardrails)

Items 1, 3, and 6 add deterministic validation that catches logical gaps before the LLM audit:
- Check every inference step has at least one covering clue
- Track which inference step each clue supports
- Detect contradiction pairs that enable reader reasoning

### Longer-Term (Architecture Changes)

Items 7, 8, and 9 require deeper changes:
- Blind reader simulation would be the strongest possible test
- Schema changes need validator updates and example CML migrations
- Bidirectional feedback would let the system fix CML-level problems

---

## 8. Summary

The fair play failure is not a clue packaging problem — it's a **logical completeness problem**. The system generates clues that look adequate (enough count, proper placement) but don't actually provide the reader with the evidence chain needed to reproduce the detective's reasoning. 

The core gap: **nothing validates that the clue set covers the inference path**. The CML describes abstract logical corrections, clues are extracted as surface-level observations, and no check verifies that the reader can get from one to the other.

The fix requires working from both ends:
1. **Upstream**: Make the CML's inference path more concrete (scene-level observations, not meta-narrative summaries)
2. **Midstream**: Add deterministic checks that verify clue-to-inference-path coverage
3. **Downstream**: Strengthen the audit with a blind reader simulation

The fastest path to improvement is items 1–5 from the priority table: prompt changes to Agent 3 and Agent 5, plus a deterministic inference-path coverage gate in the orchestrator guardrails.
