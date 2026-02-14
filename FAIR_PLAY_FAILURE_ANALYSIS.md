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
---

## 9. Comprehensive Remediation Plan

This section specifies every change needed to fix every fair play failure mode identified above. Each remediation targets a specific root cause from Section 3 and is cross-referenced to the recommendation it implements from Section 6. Changes are grouped into work packages that can be implemented sequentially; each package builds on the previous one.

### Work Package 1: Schema & Type Foundation

**Targets**: Root Cause 3.1 (loose inference-path→clue mapping), Root Cause 3.4 (abstract inference paths)  
**Implements**: Recommendation 6.1 (clue-specific inference path)  
**Risk**: Low — additive schema change, backward-compatible  

#### 1A. Extend the CML schema with `required_evidence` and `reader_observable`

**File**: `schema/cml_2_0.schema.yaml`  
**Section**: `inference_path.steps` (lines ~171–180)

Change the step schema from:

```yaml
fields:
  observation: { type: string, required: true }
  correction: { type: string, required: true }
  effect: { type: string, required: true }
```

To:

```yaml
fields:
  observation: { type: string, required: true }
  correction: { type: string, required: true }
  effect: { type: string, required: true }
  required_evidence:
    type: array
    required: true
    items: string
    description: >
      Specific CML facts the reader must see to make this correction.
      Each entry must reference a concrete, scene-level observation
      (e.g., "medicine bottle label shows Tuesday prescription",
       "clock in study stopped at 9:15 PM").
  reader_observable:
    type: boolean
    required: true
    description: >
      True if this observation can be directly witnessed by the reader
      in a scene. False if it requires detective-only reasoning.
      All steps SHOULD be reader_observable=true for fair play.
```

**Rationale**: This forces Agent 3 to think about *what evidence the reader needs* at CML design time, not as an afterthought during clue extraction. Each step now has a concrete evidence checklist that downstream agents can validate against.

#### 1B. Add `min_items` constraint to inference_path.steps

**File**: `schema/cml_2_0.schema.yaml`  
**Section**: `inference_path.steps`

```yaml
steps:
  type: array
  required: true
  min_items: 3
  items:
    type: object
    ...
```

**Rationale**: Currently an empty steps array passes validation. This closes the hole that lets `normalizeCml()` silently inject 3 hardcoded generic placeholder steps.

#### 1C. Add `supportsInferenceStep` to the Clue type

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `Clue` interface (line 29)

```typescript
export interface Clue {
  id: string;
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  description: string;
  sourceInCML: string;
  pointsTo: string;
  placement: "early" | "mid" | "late";
  criticality: "essential" | "supporting" | "optional";
  supportsInferenceStep: number;     // 1-indexed inference_path step this clue enables
  evidenceType: "observation" | "contradiction" | "elimination"; // what role the clue plays
}
```

**New fields**:
- `supportsInferenceStep` — which inference_path step (1-indexed) this clue provides evidence for. Every essential clue MUST have this field populated.
- `evidenceType` — classifies the clue's role:
  - `"observation"` — makes the step's observation reader-visible
  - `"contradiction"` — provides evidence that challenges the false assumption at this step
  - `"elimination"` — provides evidence that eliminates a suspect at this step

**Rationale**: This creates the structural link between clues and inference steps that is currently completely missing. Downstream guardrails can now programmatically verify coverage.

#### 1D. Add TypeScript interfaces for CML sub-structures

**File**: `packages/cml/src/index.ts`  
**Current state**: `export type CaseData = any;`

Add concrete types alongside the `any` export (for progressive typing):

```typescript
/** Typed inference path step — matches CML 2.0 schema */
export interface InferenceStep {
  observation: string;
  correction: string;
  effect: string;
  required_evidence: string[];
  reader_observable: boolean;
}

/** Typed inference path */
export interface InferencePath {
  steps: InferenceStep[];
}

/** Typed fair play block */
export interface FairPlayBlock {
  all_clues_visible: boolean;
  no_special_knowledge_required: boolean;
  no_late_information: boolean;
  reader_can_solve: boolean;
  explanation: string;
}

/** Helper to safely extract typed inference path from CaseData */
export function getInferencePath(cml: CaseData): InferencePath {
  const c = (cml as any)?.CASE ?? cml;
  const steps = c?.inference_path?.steps;
  return {
    steps: Array.isArray(steps) ? steps : [],
  };
}

// Keep backward-compatible `any` export
export type CaseData = any;
```

**Rationale**: Eliminates the `any`-everywhere problem for the most safety-critical sub-structures without breaking existing code. Functions can progressively adopt the typed helpers.

#### 1E. Update example CMLs with the new schema fields

**Files**: All YAML files in `examples/`  
**Action**: Add `required_evidence` and `reader_observable` to every inference_path step in every example.

Example transformation for `the_second_key.cml.yaml`:
```yaml
inference_path:
  steps:
    - observation: "Everyone argues about access near time of death"
      correction: "Separate symptom onset from administration time"
      effect: "Alibis tied to late window lose decisiveness"
      required_evidence:
        - "Toxicology report showing delayed-action poison"
        - "Dr. Carter's testimony about symptom onset timing"
        - "Housekeeper's account of access to medicine cabinet before dinner"
      reader_observable: true
```

**Rationale**: Seed CMLs are used by Agent 3 as structural inspiration. Updated examples teach the LLM the expected level of concreteness.

---

### Work Package 2: Agent 3 — CML Generator Hardening

**Targets**: Root Cause 3.4 (abstract inference paths), Root Cause 3.1 (loose mapping)  
**Implements**: Recommendations 6.1, 6.7  
**Risk**: Low — prompt-only changes + `normalizeCml()` fix  

#### 2A. Rewrite the inference_path section of the Agent 3 user prompt

**File**: `packages/prompts-llm/src/agent3-cml.ts`  
**Section**: User prompt, requirement #8 (line ~313)

Replace:
```
8. Build inference path with 3-5 logical steps
```

With:
```
8. Build inference path with 3-5 logical steps. EACH step must satisfy ALL of:
   a. observation: A CONCRETE, SCENE-LEVEL fact the reader can witness
      (e.g., "Medicine bottle label shows Dr. Bauerstein's prescription filled on Tuesday")
      NOT abstract summaries (e.g., "Timeline discrepancies in witness accounts")
   b. correction: A conclusion the reader can DERIVE from the observation + one or more
      pieces of stated evidence — never a leap of logic
   c. effect: A TESTABLE narrowing of the suspect pool (name the suspect eliminated or the
      constraint that tightens)
   d. required_evidence: An array of 2-4 specific CML facts the reader must see to make this
      correction. Each entry must be a concrete observation witnessable in a scene.
   e. reader_observable: true (all steps must be reader-observable for fair play)
```

#### 2B. Add inference_path quality rules to the Agent 3 developer prompt

**File**: `packages/prompts-llm/src/agent3-cml.ts`  
**Section**: Developer prompt, after the `FAIR_PLAY_CHECKLIST` block (line ~196)

Append this block:

```
**Inference Path Construction Rules**:
1. Every observation must describe something the reader can WITNESS in a scene — 
   a physical object, a statement, a visible action, a document — NOT a conclusion
2. Every correction must follow from STATED EVIDENCE in constraint_space or cast, 
   not from detective intuition
3. Every effect must produce a NAMED consequence: "Eliminates [suspect]" or 
   "Narrows administration window to [time range]"
4. required_evidence must list 2-4 CML facts per step. These are the facts that 
   Agent 5 MUST surface as clues for the reader. If you can't list concrete evidence, 
   the observation is too abstract — rewrite it.
5. The constraint_space MUST contain at least one contradiction per inference step — 
   a pair of facts that create logical tension the reader can resolve
6. The discriminating_test.design MUST reference specific evidence the reader has 
   already seen in earlier inference steps
```

#### 2C. Make `fair_play.explanation` step-specific in the prompt

**File**: `packages/prompts-llm/src/agent3-cml.ts`  
**Section**: User prompt requirements (add as requirement #16)

Add:
```
16. The fair_play.explanation field must NOT be a generic statement like "All evidence 
    supports the solution." It MUST specifically name which evidence supports each 
    inference step, e.g.: "Step 1: The poison timing report (early) and housekeeper's 
    testimony (mid) let the reader separate symptom onset from administration. 
    Step 2: Dr. Bauerstein's hospital alibi (mid) eliminates him. Step 3: Mary's 
    contradictory medicine account (discriminating test) identifies her as culprit."
```

#### 2D. Fix `normalizeCml()` to reject placeholder inference paths

**File**: `packages/prompts-llm/src/agent3-cml.ts`  
**Section**: `normalizeCml()` function (line ~379)

Replace the silent placeholder injection:
```typescript
inferencePath.steps = Array.isArray(inferencePath.steps) && inferencePath.steps.length
  ? inferencePath.steps
  : [
      { observation: "Symptom onset", correction: "Poison delay", effect: "Alibi weakens" },
      { observation: "Access log", correction: "Hidden entry", effect: "Access narrowed" },
      { observation: "Motive clue", correction: "Blackmail reveal", effect: "Suspect isolated" },
    ];
```

With:
```typescript
if (!Array.isArray(inferencePath.steps) || inferencePath.steps.length < 3) {
  throw new Error(
    `CML generation produced ${Array.isArray(inferencePath.steps) ? inferencePath.steps.length : 0} inference_path steps (minimum 3 required). ` +
    `The LLM must produce concrete inference steps — placeholder injection is no longer supported.`
  );
}
// Ensure each step has required_evidence array
for (const step of inferencePath.steps as any[]) {
  if (!Array.isArray(step.required_evidence)) {
    step.required_evidence = [];
  }
  if (typeof step.reader_observable !== "boolean") {
    step.reader_observable = true;
  }
}
```

**Rationale**: The placeholder fallback silently produces inference steps that are completely disconnected from the actual mystery. This was a major source of garbage-in → garbage-out in the clue extraction pipeline. Now the system fails fast and the orchestrator can retry Agent 3 instead of proceeding with garbage data.

#### 2E. Update the required YAML skeleton to show the new fields

**File**: `packages/prompts-llm/src/agent3-cml.ts`  
**Section**: `requiredSkeleton` (line ~200)

Update the inference_path section of the skeleton from:
```yaml
  inference_path:
    steps: []
```

To:
```yaml
  inference_path:
    steps:
      - observation: "Concrete scene-level observation"
        correction: "Conclusion derivable from evidence"
        effect: "Named suspect eliminated or constraint tightened"
        required_evidence:
          - "Specific CML fact the reader must witness"
          - "Another specific CML fact"
        reader_observable: true
```

---

### Work Package 3: Agent 5 — Clue Extraction Strengthening

**Targets**: Root Cause 3.1 (loose mapping), Root Cause 3.2 (no coverage check)  
**Implements**: Recommendation 6.4  
**Risk**: Low — prompt changes + output schema update  

#### 3A. Rewrite the inference_path section of the Agent 5 developer prompt

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `buildCluePrompt()`, inference path instructions (lines ~115–125)

Replace:
```typescript
developer += `**Inference Path Observations**:\n`;
caseData.inference_path.steps.forEach((step: any, i: number) => {
  developer += `${i + 1}. ${step.observation || "N/A"}\n`;
});
```

With a comprehensive step dump that includes observation, correction, effect, AND required_evidence:

```typescript
developer += `**Inference Path Steps (MUST be fully covered by clues)**:\n`;
developer += `Each step below MUST have at least one essential clue that makes its observation `;
developer += `reader-visible, AND at least one supporting clue that provides evidence for the correction.\n\n`;
caseData.inference_path.steps.forEach((step: any, i: number) => {
  developer += `**Step ${i + 1}**:\n`;
  developer += `  - Observation: ${step.observation || "N/A"}\n`;
  developer += `  - Correction: ${step.correction || "N/A"}\n`;
  developer += `  - Effect: ${step.effect || "N/A"}\n`;
  if (Array.isArray(step.required_evidence) && step.required_evidence.length > 0) {
    developer += `  - Required evidence (MUST become clues):\n`;
    step.required_evidence.forEach((ev: string) => {
      developer += `    • ${ev}\n`;
    });
  }
  developer += `\n`;
});
```

#### 3B. Add mandatory coverage instructions to the Agent 5 prompt

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `buildCluePrompt()`, after the inference path section

Append:
```typescript
developer += `## MANDATORY: Inference Step Coverage\n\n`;
developer += `For EVERY inference step above, you MUST produce:\n`;
developer += `1. At least ONE essential clue with evidenceType="observation" that makes the step's `;
developer += `observation directly witnessable by the reader in a scene\n`;
developer += `2. At least ONE clue (essential or supporting) with evidenceType="contradiction" that `;
developer += `provides evidence challenging the false assumption at this step\n`;
developer += `3. If the step's effect eliminates a suspect, at least ONE clue with `;
developer += `evidenceType="elimination" providing the evidence for that elimination\n\n`;
developer += `Set supportsInferenceStep to the step number (1-indexed) for each clue.\n`;
developer += `A clue may support multiple steps — use the MOST RELEVANT step number.\n\n`;
developer += `**FAILURE MODE TO AVOID**: Do not produce abstract clues like "Timeline `;
developer += `discrepancies in witness accounts." Instead produce: "Mrs. Whitmore says she `;
developer += `heard the crash at 9:45, but the library clock stopped at 9:15."\n\n`;
```

#### 3C. Update the Agent 5 output JSON schema in the prompt

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `buildCluePrompt()`, output schema block (lines ~290–310)

Update the clue schema to include the new fields:
```json
{
  "id": "clue_001",
  "category": "temporal|spatial|physical|behavioral|testimonial",
  "description": "Concrete, specific observation (NOT abstract summaries)",
  "sourceInCML": "CML path (e.g., 'constraint_space.time.contradictions[0]')",
  "pointsTo": "What it reveals without spoiling",
  "placement": "early|mid|late",
  "criticality": "essential|supporting|optional",
  "supportsInferenceStep": 1,
  "evidenceType": "observation|contradiction|elimination"
}
```

#### 3D. Add post-extraction validation in `extractClues()`

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `extractClues()`, after JSON parsing (line ~400)

Add validation:
```typescript
// Validate supportsInferenceStep is present on essential clues
for (const clue of clueData.clues) {
  if (clue.criticality === "essential" && !clue.supportsInferenceStep) {
    clue.supportsInferenceStep = 0; // Flag as unmapped for guardrail to catch
  }
  if (!clue.evidenceType) {
    clue.evidenceType = "observation"; // Default
  }
}
```

#### 3E. Fix the hardcoded `noNewFactsIntroduced: true`

**File**: `packages/prompts-llm/src/agent5-clues.ts`  
**Section**: `extractClues()`, fair play checks (line ~420)

Replace:
```typescript
noNewFactsIntroduced: true, // Assume true unless validation fails
```

With an actual check:
```typescript
noNewFactsIntroduced: clueData.clues.every(
  (c: Clue) => c.sourceInCML && c.sourceInCML.trim() !== "" && c.sourceInCML !== "N/A"
),
```

**Rationale**: The current hardcoded `true` defeats the purpose of the check entirely. This verifies every clue has a non-empty CML source reference.

---

### Work Package 4: Deterministic Guardrails — Inference Path Coverage Gate

**Targets**: Root Cause 3.2 (no structural validation)  
**Implements**: Recommendations 6.2, 6.3  
**Risk**: Medium — new guardrail logic in orchestrator, but follows established pattern  

#### 4A. Add `checkInferencePathCoverage()` function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After `applyClueGuardrails()` function (line ~350)

New function:

```typescript
interface InferenceCoverageResult {
  issues: ClueGuardrailIssue[];
  coverageMap: Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>;
  uncoveredSteps: number[];
  hasCriticalGaps: boolean;
}

const checkInferencePathCoverage = (
  cml: CaseData,
  clues: ClueDistributionResult
): InferenceCoverageResult => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  
  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({
      severity: "critical",
      message: "No inference_path steps found in CML — fair play audit will always fail",
    });
    return { issues, coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: true };
  }

  // Build coverage map: for each step, track which evidence types have covering clues
  const coverageMap = new Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>();
  for (let i = 0; i < steps.length; i++) {
    coverageMap.set(i + 1, { observation: false, contradiction: false, elimination: false });
  }

  // Check each clue's supportsInferenceStep mapping
  for (const clue of clues.clues) {
    const stepNum = clue.supportsInferenceStep;
    if (stepNum && coverageMap.has(stepNum)) {
      const coverage = coverageMap.get(stepNum)!;
      const evidenceType = clue.evidenceType || "observation";
      coverage[evidenceType] = true;
    }
  }

  // Also do fuzzy matching: if a clue's description contains keywords from a step's
  // observation or required_evidence, count it as covering that step
  for (const clue of clues.clues) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNum = i + 1;
      const coverage = coverageMap.get(stepNum)!;
      
      const clueText = (clue.description + " " + clue.sourceInCML).toLowerCase();
      const obsText = (step.observation || "").toLowerCase();
      
      // Check if clue text overlaps meaningfully with step observation
      const obsWords = obsText.split(/\s+/).filter((w: string) => w.length > 4);
      const matchCount = obsWords.filter((w: string) => clueText.includes(w)).length;
      if (obsWords.length > 0 && matchCount >= Math.ceil(obsWords.length * 0.4)) {
        coverage.observation = true;
      }

      // Check against required_evidence entries
      if (Array.isArray(step.required_evidence)) {
        for (const ev of step.required_evidence) {
          const evWords = (ev as string).toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          const evMatch = evWords.filter((w: string) => clueText.includes(w)).length;
          if (evWords.length > 0 && evMatch >= Math.ceil(evWords.length * 0.4)) {
            coverage.observation = true;
          }
        }
      }
    }
  }

  // Identify uncovered steps
  const uncoveredSteps: number[] = [];
  for (const [stepNum, coverage] of coverageMap) {
    if (!coverage.observation) {
      uncoveredSteps.push(stepNum);
      const step = steps[stepNum - 1];
      issues.push({
        severity: "critical",
        message: `Inference step ${stepNum} ("${step.observation}") has NO covering clue — ` +
                 `the reader cannot witness this observation`,
      });
    }
    if (!coverage.contradiction) {
      // Warning, not critical — some steps may not need explicit contradiction clues
      issues.push({
        severity: "warning",
        message: `Inference step ${stepNum} has no contradiction clue — ` +
                 `the reader may not have evidence to challenge the false assumption at this step`,
      });
    }
  }

  return {
    issues,
    coverageMap,
    uncoveredSteps,
    hasCriticalGaps: uncoveredSteps.length > 0,
  };
};
```

#### 4B. Add `checkContradictionPairs()` function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After `checkInferencePathCoverage()`

```typescript
const checkContradictionPairs = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepNum = i + 1;
    
    // Find all clues mapped to this step
    const stepClues = clues.clues.filter(c => c.supportsInferenceStep === stepNum);
    const evidenceTypes = new Set(stepClues.map(c => c.evidenceType || "observation"));
    
    // A valid contradiction pair requires at least:
    // - One observation clue (what the reader sees)
    // - One contradiction or elimination clue (what challenges the assumption)
    if (stepClues.length >= 2 && evidenceTypes.has("observation") && 
        (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination"))) {
      continue; // Has a valid contradiction pair
    }
    
    if (stepClues.length < 2) {
      issues.push({
        severity: "warning",
        message: `Inference step ${stepNum} ("${step.observation}") has only ${stepClues.length} ` +
                 `mapped clue(s) — insufficient for a contradiction pair. The reader needs both ` +
                 `an observation AND contradicting evidence to reason through this step.`,
      });
    } else if (!evidenceTypes.has("contradiction") && !evidenceTypes.has("elimination")) {
      issues.push({
        severity: "warning",
        message: `Inference step ${stepNum} has clues but no contradiction/elimination evidence — ` +
                 `the reader has facts but no reasoning fuel for this step.`,
      });
    }
  }

  return issues;
};
```

#### 4C. Add `checkFalseAssumptionContradiction()` function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After `checkContradictionPairs()`

```typescript
const checkFalseAssumptionContradiction = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const falseAssumption = caseBlock?.false_assumption?.statement || "";
  
  if (!falseAssumption) {
    issues.push({
      severity: "critical",
      message: "No false_assumption.statement in CML — fair play requires a false assumption the reader can challenge",
    });
    return issues;
  }

  // Check that at least one clue explicitly contradicts the false assumption
  const contradictionClues = clues.clues.filter(c => c.evidenceType === "contradiction");
  if (contradictionClues.length === 0) {
    issues.push({
      severity: "critical",
      message: `No clue with evidenceType="contradiction" found. The reader needs at least one ` +
               `clue that explicitly challenges the false assumption: "${falseAssumption}"`,
    });
  }

  // Check that red herrings actually support the false assumption (not the true solution)
  const suspiciousRedHerrings = clues.redHerrings.filter(rh => {
    const desc = (rh.description + " " + rh.supportsAssumption).toLowerCase();
    // Red herrings should NOT contain words from the correction/effect of inference steps
    return caseBlock?.inference_path?.steps?.some((step: any) => {
      const corrWords = (step.correction || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 5);
      return corrWords.some((w: string) => desc.includes(w));
    });
  });

  if (suspiciousRedHerrings.length > 0) {
    issues.push({
      severity: "warning",
      message: `${suspiciousRedHerrings.length} red herring(s) may accidentally support the true solution ` +
               `rather than the false assumption — review for logical direction`,
    });
  }

  return issues;
};
```

#### 4D. Add `checkDiscriminatingTestReachability()` function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After `checkFalseAssumptionContradiction()`

```typescript
const checkDiscriminatingTestReachability = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  
  if (!discrimTest?.design) {
    issues.push({
      severity: "critical",
      message: "No discriminating_test.design in CML — mystery has no definitive proof moment",
    });
    return issues;
  }

  // Check that the discriminating test references evidence that appears in the clue set
  const designText = (discrimTest.design || "").toLowerCase();
  const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
  const combinedTestText = designText + " " + knowledgeText;

  // Find clues that relate to the discriminating test
  const relevantClues = clues.clues.filter(c => {
    const clueText = c.description.toLowerCase();
    const testWords = combinedTestText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });

  if (relevantClues.length === 0) {
    issues.push({
      severity: "critical",
      message: `Discriminating test ("${discrimTest.design.substring(0, 80)}...") references no evidence ` +
               `found in the clue set — the reader cannot verify the test's conclusion`,
    });
  }

  // Check that at least one relevant clue is in early/mid placement (not late)
  const earlyMidRelevant = relevantClues.filter(c => c.placement === "early" || c.placement === "mid");
  if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
    issues.push({
      severity: "warning",
      message: "All clues related to the discriminating test are in late placement — " +
               "the reader hasn't seen the supporting evidence before the test",
    });
  }

  return issues;
};
```

#### 4E. Add `checkSuspectElimination()` function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After `checkDiscriminatingTestReachability()`

```typescript
const checkSuspectElimination = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = caseBlock?.culpability?.culprits ?? [];
  
  // Get non-culprit suspects (eligible for elimination)
  const suspects = cast.filter((c: any) => 
    c.culprit_eligibility === "eligible" && !culprits.includes(c.name)
  );

  if (suspects.length === 0) return issues;

  // For each non-culprit suspect, check if there's a clue that could eliminate them
  const allClueText = clues.clues.map(c => c.description.toLowerCase()).join(" ");
  
  const uneliminable = suspects.filter((suspect: any) => {
    const name = (suspect.name || "").toLowerCase();
    const nameWords = name.split(/\s+/);
    // Check if any clue mentions this suspect
    return !nameWords.some((w: string) => w.length > 2 && allClueText.includes(w));
  });

  if (uneliminable.length > 0) {
    issues.push({
      severity: "warning",
      message: `${uneliminable.length} suspect(s) (${uneliminable.map((s: any) => s.name).join(", ")}) ` +
               `are never referenced in any clue — the reader has no basis to eliminate them`,
    });
  }

  return issues;
};
```

#### 4F. Integrate new guardrails into the orchestrator pipeline

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Section**: After the existing `applyClueGuardrails()` call (line ~1024)

After the existing guardrail call and auto-fix logic, add:

```typescript
// --- Inference path coverage gate ---
const coverageResult = checkInferencePathCoverage(cml, clues);
const contradictionIssues = checkContradictionPairs(cml, clues);
const falseAssumptionIssues = checkFalseAssumptionContradiction(cml, clues);
const discrimTestIssues = checkDiscriminatingTestReachability(cml, clues);
const eliminationIssues = checkSuspectElimination(cml, clues);

const allCoverageIssues = [
  ...coverageResult.issues,
  ...contradictionIssues,
  ...falseAssumptionIssues,
  ...discrimTestIssues,
  ...eliminationIssues,
];

// Log all issues as warnings
allCoverageIssues.forEach(issue => {
  warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`);
});

// If critical gaps exist, retry Agent 5 with targeted feedback
if (coverageResult.hasCriticalGaps || 
    falseAssumptionIssues.some(i => i.severity === "critical") ||
    discrimTestIssues.some(i => i.severity === "critical")) {
  
  warnings.push("Inference coverage gate: critical gaps found; regenerating clues with coverage feedback");
  
  const coverageFeedback = {
    overallStatus: "fail" as const,
    violations: allCoverageIssues
      .filter(i => i.severity === "critical")
      .map(i => ({
        severity: "critical" as const,
        rule: "Inference Path Coverage",
        description: i.message,
        suggestion: "Ensure every inference step has at least one clue that makes its observation " +
                     "reader-visible. Map each clue to a specific step via supportsInferenceStep.",
      })),
    warnings: allCoverageIssues
      .filter(i => i.severity === "warning")
      .map(i => i.message),
    recommendations: [
      "Every inference step needs at least one observation clue and one contradiction clue",
      "Set supportsInferenceStep on every essential clue",
      "Include at least one clue that explicitly contradicts the false assumption",
      `Uncovered steps: ${coverageResult.uncoveredSteps.join(", ")}`,
    ],
  };

  clues = await extractClues(client, {
    cml,
    clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
    redHerringBudget: 2,
    fairPlayFeedback: coverageFeedback,
    runId,
    projectId: projectId || "",
  });

  // Re-run existing guardrails on the regenerated clues
  const postCoverageGuardrails = applyClueGuardrails(cml, clues);
  if (postCoverageGuardrails.fixes.length > 0) {
    postCoverageGuardrails.fixes.forEach(fix => warnings.push(`Post-coverage guardrail auto-fix: ${fix}`));
  }
}
```

---

### Work Package 5: Agent 6 — Fair Play Audit Overhaul

**Targets**: Root Cause 3.3 (LLM audit sees solution, non-deterministic)  
**Implements**: Recommendation 6.5 (reader model blind simulation)  
**Risk**: Medium — adds a new LLM call, increases cost by ~$0.01–0.03 per run  

#### 5A. Add blind reader simulation function

**File**: `packages/prompts-llm/src/agent6-fairplay.ts`  
**Location**: New export after `auditFairPlay()`

```typescript
export interface BlindReaderResult {
  suspectedCulprit: string;
  reasoning: string;
  confidenceLevel: "certain" | "likely" | "uncertain" | "impossible";
  missingInformation: string[];
  cost: number;
  durationMs: number;
}

export async function blindReaderSimulation(
  client: AzureOpenAIClient,
  clues: ClueDistributionResult,
  falseAssumption: string,
  castNames: string[],
  inputs: { runId?: string; projectId?: string }
): Promise<BlindReaderResult> {
  const startTime = Date.now();

  const system = `You are a careful reader of Golden Age detective fiction. You are reading a mystery ` +
    `and trying to deduce who committed the crime. You will be given ONLY the clues presented in the ` +
    `story — you do NOT know the solution, the inference path, or the detective's reasoning. ` +
    `You must work it out from the clues alone.`;

  const clueList = clues.clues
    .sort((a, b) => {
      const order = { early: 0, mid: 1, late: 2 };
      return order[a.placement] - order[b.placement];
    })
    .map((c, i) => `${i + 1}. [${c.placement}] ${c.description}`)
    .join("\n");

  const redHerringList = clues.redHerrings
    .map((rh, i) => `${i + 1}. ${rh.description}`)
    .join("\n");

  const user = `Here are all the clues you've encountered while reading this mystery:\n\n` +
    `${clueList}\n\n` +
    (redHerringList ? `Additional observations:\n${redHerringList}\n\n` : "") +
    `The suspects are: ${castNames.join(", ")}\n\n` +
    `The initial assumption is: "${falseAssumption}"\n\n` +
    `Based ONLY on these clues, who do you think committed the crime and why? ` +
    `If you cannot determine the culprit, explain what information is missing.\n\n` +
    `Return JSON: { "suspectedCulprit": "name", "reasoning": "step by step", ` +
    `"confidenceLevel": "certain|likely|uncertain|impossible", ` +
    `"missingInformation": ["what you'd need to know"] }`;

  const response = await client.chat({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
    maxTokens: 1500,
    jsonMode: true,
    logContext: {
      runId: inputs.runId || "unknown",
      projectId: inputs.projectId || "unknown",
      agent: "Agent6-BlindReader",
    },
  });

  const durationMs = Date.now() - startTime;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent6-BlindReader"] || 0;

  const result = JSON.parse(response.content);
  return { ...result, cost, durationMs };
}
```

#### 5B. Integrate blind reader simulation into the orchestrator

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Section**: After the Agent 6 audit loop (line ~1156), before the outline section

```typescript
// --- Blind reader simulation ---
const caseBlock = (cml as any)?.CASE ?? cml;
const castNames = (caseBlock?.cast ?? []).map((c: any) => c.name).filter(Boolean);
const falseAssumptionStatement = caseBlock?.false_assumption?.statement || "";
const culpritName = caseBlock?.culpability?.culprits?.[0] || "";

if (castNames.length > 0 && falseAssumptionStatement && culpritName) {
  reportProgress("fairplay", "Running blind reader simulation...", 73);
  
  const blindResult = await blindReaderSimulation(
    client, clues, falseAssumptionStatement, castNames,
    { runId, projectId: projectId || "" }
  );

  agentCosts["agent6_blind_reader"] = blindResult.cost;
  agentDurations["agent6_blind_reader"] = blindResult.durationMs;

  const readerGotItRight = blindResult.suspectedCulprit.toLowerCase().includes(culpritName.toLowerCase()) ||
    culpritName.toLowerCase().includes(blindResult.suspectedCulprit.toLowerCase());

  if (readerGotItRight && (blindResult.confidenceLevel === "certain" || blindResult.confidenceLevel === "likely")) {
    reportProgress("fairplay", "Blind reader simulation: PASS — reader can identify culprit", 74);
  } else {
    warnings.push(
      `Blind reader simulation: reader suspected "${blindResult.suspectedCulprit}" ` +
      `(confidence: ${blindResult.confidenceLevel}), actual culprit is "${culpritName}"`
    );
    if (blindResult.missingInformation.length > 0) {
      warnings.push(`Blind reader missing info: ${blindResult.missingInformation.join("; ")}`);
    }

    // If blind reader completely failed, this is strong evidence of information parity failure
    if (blindResult.confidenceLevel === "impossible" || !readerGotItRight) {
      warnings.push(
        "CRITICAL: Blind reader cannot identify culprit — information parity failure is confirmed. " +
        "The clue set does not contain enough evidence for deduction."
      );
      
      // Retry clue generation one more time with blind reader feedback
      reportProgress("clues", "Regenerating clues based on blind reader feedback...", 60);
      clues = await extractClues(client, {
        cml,
        clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
        redHerringBudget: 2,
        fairPlayFeedback: {
          overallStatus: "fail",
          violations: [{
            severity: "critical",
            rule: "Information Parity",
            description: `A blind reader using only the clues suspected "${blindResult.suspectedCulprit}" ` +
                          `instead of the actual culprit "${culpritName}". Reasoning: ${blindResult.reasoning}`,
            suggestion: `Add clues that make the following deducible: ${blindResult.missingInformation.join("; ")}`,
          }],
          warnings: [],
          recommendations: blindResult.missingInformation.map(info => `Provide evidence for: ${info}`),
        },
        runId,
        projectId: projectId || "",
      });

      // Re-run guardrails
      applyClueGuardrails(cml, clues);
    }
  }
}
```

---

### Work Package 6: Bidirectional Feedback — CML Repair on Structural Failure

**Targets**: Root Cause 3.5 (retry can't fix upstream), Root Cause 3.6 (no bidirectional check)  
**Implements**: Recommendation 6.6  
**Risk**: High — adds CML regeneration retry, increases latency and cost  

#### 6A. Add failure classification function

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Location**: After the new guardrail functions

```typescript
type FairPlayFailureClass = "clue_coverage" | "inference_path_abstract" | "constraint_space_insufficient" | "clue_only";

const classifyFairPlayFailure = (
  coverageResult: InferenceCoverageResult,
  fairPlayAudit: FairPlayAuditResult | null,
  cml: CaseData
): FairPlayFailureClass => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  // Check if inference path steps are too abstract (short observations, no required_evidence)
  const abstractSteps = steps.filter((s: any) => {
    const obs = (s.observation || "").trim();
    const hasEvidence = Array.isArray(s.required_evidence) && s.required_evidence.length > 0;
    // Too abstract if observation is under 30 chars or has no required_evidence
    return obs.length < 30 || !hasEvidence;
  });

  if (abstractSteps.length >= Math.ceil(steps.length * 0.5)) {
    return "inference_path_abstract";
  }

  // Check if constraint_space is sparse
  const cs = caseBlock?.constraint_space ?? {};
  const totalConstraints = [
    ...(cs.time?.contradictions ?? []),
    ...(cs.time?.anchors ?? []),
    ...(cs.access?.actors ?? []),
    ...(cs.physical?.traces ?? []),
  ].length;

  if (totalConstraints < 4) {
    return "constraint_space_insufficient";
  }

  // If inference path coverage has critical gaps, it's a coverage problem
  if (coverageResult.hasCriticalGaps) {
    return "clue_coverage";
  }

  return "clue_only";
};
```

#### 6B. Add CML-level retry in the orchestrator

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Section**: After the Agent 6 audit loop, when `hasCriticalFairPlayFailure` is true

When the failure is classified as `inference_path_abstract` or `constraint_space_insufficient`, retry Agent 3/4 instead of just Agent 5:

```typescript
if (hasCriticalFairPlayFailure && fairPlayAudit) {
  const failureClass = classifyFairPlayFailure(coverageResult, fairPlayAudit, cml);
  
  if (failureClass === "inference_path_abstract" || failureClass === "constraint_space_insufficient") {
    warnings.push(
      `Fair play failure classified as "${failureClass}" — retrying CML generation (Agent 3/4) ` +
      `to fix upstream structural problems`
    );
    
    // Build targeted revision instructions
    const revisionInstructions = failureClass === "inference_path_abstract"
      ? "The inference_path steps are too abstract. Rewrite each step with: " +
        "(1) a concrete, scene-level observation the reader can witness, " +
        "(2) a correction that follows from stated evidence, " +
        "(3) an effect that names the suspect eliminated, " +
        "(4) required_evidence listing 2-4 specific facts."
      : "The constraint_space is too sparse. Add: " +
        "(1) at least one temporal contradiction, " +
        "(2) at least 2 access constraints, " +
        "(3) at least 2 physical traces. " +
        "Each constraint must be concrete enough to become a reader-visible clue.";

    // Use Agent 4 (revision) to fix the CML rather than regenerating from scratch
    reportProgress("revision", "Revising CML to fix structural fair play issues...", 55);
    const revisionStart = Date.now();
    
    const revisedCml = await reviseCml(client, {
      originalCml: cml,
      validationErrors: [{
        path: failureClass === "inference_path_abstract" ? "inference_path" : "constraint_space",
        message: revisionInstructions,
        severity: "error",
      }],
      runId,
      projectId: projectId || "",
    });

    agentCosts["agent4_fairplay_revision"] = revisedCml.cost;
    agentDurations["agent4_fairplay_revision"] = Date.now() - revisionStart;

    // Replace CML and re-run Agent 5 + 6
    // (Only if revision produced a structurally different result)
    const revisedSteps = (revisedCml as any)?.CASE?.inference_path?.steps ?? [];
    if (revisedSteps.length >= 3) {
      cml = revisedCml;
      warnings.push("CML revised — re-running clue extraction and fair play audit");

      // Re-extract clues from revised CML
      clues = await extractClues(client, {
        cml,
        clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
        redHerringBudget: 2,
        runId,
        projectId: projectId || "",
      });
      applyClueGuardrails(cml, clues);

      // Re-audit
      fairPlayAudit = await auditFairPlay(client, {
        caseData: cml,
        clues,
        runId,
        projectId: projectId || "",
      });
    }
  }
}
```

---

### Work Package 7: Shared System Prompt Enhancements

**Targets**: Root Causes 3.1, 3.4 (loose guidance across all agents)  
**Implements**: Cross-cutting prompt quality  
**Risk**: Very low — constant string changes  

#### 7A. Strengthen `FAIR_PLAY_CHECKLIST`

**File**: `packages/prompts-llm/src/shared/system.ts`  
**Section**: `FAIR_PLAY_CHECKLIST` constant

Replace the current checklist with a more rigorous version:

```typescript
export const FAIR_PLAY_CHECKLIST = `Fair-Play Requirements:
✓ All clues available before solution reveal
✓ Load-bearing clues appear early (first 1/3 of story)
✓ No deus ex machina or last-minute revelations
✓ Detective uses only publicly available information
✓ Reader has same information as detective (INFORMATION PARITY)
✓ Solution follows logically from presented clues (LOGICAL DEDUCIBILITY)
✓ No supernatural elements or impossible coincidences
✓ Murderer's identity determinable through deduction
✓ Every inference step has reader-visible evidence (no detective-only reasoning)
✓ At least one clue must CONTRADICT the false assumption
✓ Each non-culprit suspect can be ELIMINATED using available clues
✓ The discriminating test references evidence the reader has already seen`;
```

#### 7B. Add `INFERENCE_PATH_QUALITY` constant

**File**: `packages/prompts-llm/src/shared/system.ts`  
**Location**: New export

```typescript
export const INFERENCE_PATH_QUALITY = `Inference Path Quality Standard:
Each step MUST have:
1. OBSERVATION: A concrete, scene-level fact (object, document, statement, physical evidence) 
   that the reader can WITNESS — not an abstract summary
2. CORRECTION: A conclusion that follows from the observation PLUS other stated evidence — 
   not a logical leap
3. EFFECT: A named consequence ("eliminates [suspect]" or "narrows [constraint] to [range]")
4. REQUIRED_EVIDENCE: 2-4 specific facts from the CML that the reader needs to see

Anti-patterns to avoid:
✗ "Timeline discrepancies" → ✓ "Clock in study shows 9:15, witness heard crash at 9:45"
✗ "Access patterns suggest hidden entry" → ✓ "Mud on library windowsill matches garden soil, but window was locked from inside"
✗ "Behavioral tells indicate deception" → ✓ "Mrs. Harrison claims she was reading, but the library lamp was cold when checked at 10 PM"`;
```

---

### Work Package 8: Orchestrator Architecture — Hard Stops and Retry Topology

**Targets**: Root Cause 3.5 (retry can't fix upstream), overall pipeline robustness  
**Implements**: Making fair play a hard gate, not a warning  
**Risk**: Medium — changes pipeline flow control  

#### 8A. Make critical fair play failure a hard stop (with CML retry escape hatch)

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Section**: After the Agent 6 audit loop (line ~1140)

Currently, critical fair play failure only produces warnings and continues. Change to:

```typescript
if (fairPlayAudit.overallStatus === "fail" && hasCriticalFairPlayFailure) {
  // Attempt CML-level repair (Work Package 6)
  // ... (repair logic from 6B above) ...
  
  // After repair attempt, if still failing, this is now a hard stop
  if (fairPlayAudit.overallStatus === "fail") {
    const criticalViolations = fairPlayAudit.violations
      .filter(v => v.severity === "critical" || criticalFairPlayRules.has(v.rule))
      .map(v => `${v.rule}: ${v.description}`)
      .join("; ");
    
    throw new Error(
      `Fair play audit failed on critical rules after CML revision and clue regeneration: ${criticalViolations}. ` +
      `The mystery cannot proceed with unresolvable information parity or logical deducibility failures.`
    );
  }
}
```

**Rationale**: Currently the system ships mysteries with known-bad fair play reports. After implementing all the upstream fixes (better prompts, coverage gate, blind reader, CML revision), a persistent failure indicates a genuinely unsolvable mystery that should not be presented to the reader.

#### 8B. Define the complete retry topology

The final retry topology after all work packages:

```
Agent 3 (CML Generation)
  → normalizeCml() — HARD STOP if < 3 inference steps (WP 2D)
  → Agent 4 (CML Revision) if validation errors
    │
    ├── If inference_path steps < 3: retry Agent 3 (max 1)
    │
Agent 5 (Clue Extraction)
  → applyClueGuardrails() — auto-fix + retry if critical (existing)
  → checkInferencePathCoverage() — NEW (WP 4A)
  → checkContradictionPairs() — NEW (WP 4B)
  → checkFalseAssumptionContradiction() — NEW (WP 4C)
  → checkDiscriminatingTestReachability() — NEW (WP 4D)
  → checkSuspectElimination() — NEW (WP 4E)
    │
    ├── If critical coverage gaps: retry Agent 5 with feedback (WP 4F)
    │
Agent 6 (Fair Play Audit) — max 2 attempts (existing)
    │
    ├── If fail: retry Agent 5 with audit feedback (existing)
    │
Blind Reader Simulation — NEW (WP 5A)
    │
    ├── If reader can't identify culprit: retry Agent 5 (WP 5B)
    │
Failure Classification — NEW (WP 6A)
    │
    ├── If "inference_path_abstract": retry Agent 4 → Agent 5 → Agent 6 (WP 6B)
    ├── If "constraint_space_insufficient": retry Agent 4 → Agent 5 → Agent 6 (WP 6B)
    ├── If still failing after CML revision: HARD STOP (WP 8A)
    │
Agent 7 (Outline) + Outline Quality Gate (existing)
Agent 9 (Prose) + Prose Repair Retry (existing)
Story Validation (existing)
```

#### 8C. Cost guardrails for the expanded retry topology

**File**: `apps/worker/src/jobs/mystery-orchestrator.ts`

Add a running cost accumulator with a circuit breaker:

```typescript
const MAX_FAIR_PLAY_RETRY_COST = 0.15; // USD - prevent runaway retries
let fairPlayRetryCost = 0;

// Before each retry:
if (fairPlayRetryCost > MAX_FAIR_PLAY_RETRY_COST) {
  warnings.push(`Fair play retry cost limit reached ($${fairPlayRetryCost.toFixed(3)}) — proceeding with best result`);
  break; // or continue to next stage
}

// After each retry:
fairPlayRetryCost += (clues.cost + (fairPlayAudit?.cost ?? 0));
```

---

### Work Package 9: CML Validator Enhancement

**Targets**: Schema enforcement  
**Implements**: Stronger validation at the CML level  
**Risk**: Low — additive validation  

#### 9A. Add inference_path quality validation to `validateCml()`

**File**: `packages/cml/src/validate.ts`

Add a validation pass that checks:
1. Each inference step has `observation.length >= 20` (rejects abstractions like "Timing clue")
2. Each step has `required_evidence` with at least 1 entry
3. All steps have `reader_observable: true` (warn if false)
4. No two steps have identical `observation` text

#### 9B. Add cross-reference validation

**File**: `packages/cml/src/validate.ts`

New validation:
1. Each `required_evidence` entry should fuzzy-match something in `constraint_space` or `cast.evidence_sensitivity` — warn if orphaned
2. `discriminating_test.design` should reference at least one concept from `inference_path.steps` — warn if disconnected
3. `fair_play.explanation` should mention at least N step numbers or step observations, where N = number of inference steps — warn if generic

---

### Work Package 10: Testing & Validation

**Risk**: None — testing only  

#### 10A. Unit tests for new guardrail functions

**File**: `apps/worker/src/__tests__/guardrails.test.ts` (new)

Test cases:
1. `checkInferencePathCoverage()` — fully covered clue set → no critical issues
2. `checkInferencePathCoverage()` — step with no covering clue → critical issue
3. `checkContradictionPairs()` — step with observation + contradiction → no issues
4. `checkContradictionPairs()` — step with only observations → warning
5. `checkFalseAssumptionContradiction()` — at least one contradiction clue → no issues
6. `checkFalseAssumptionContradiction()` — no contradiction clues → critical issue
7. `checkDiscriminatingTestReachability()` — test references evidence in clues → no issues
8. `checkSuspectElimination()` — all suspects referenced in clues → no issues

#### 10B. Integration test for blind reader simulation

**File**: `packages/prompts-llm/__tests__/blind-reader.test.ts` (new)

Test that the blind reader function:
1. Returns valid JSON with all required fields
2. Does NOT receive the inference path or culprit identity
3. Returns `impossible` when given only red herrings (no real clues)

#### 10C. End-to-end validation with example CMLs

Run the complete pipeline against each updated example CML and verify:
1. Coverage gate passes (all steps covered)
2. Blind reader identifies correct culprit (or at least `likely`)
3. Fair play audit passes

---

## 10. Implementation Sequence

The work packages have dependencies that determine execution order:

```
Phase A (Foundation — no dependencies):
  WP 1: Schema & Type Foundation
  WP 7: Shared System Prompt Enhancements

Phase B (Prompt Quality — depends on WP 1 types):
  WP 2: Agent 3 CML Generator Hardening
  WP 3: Agent 5 Clue Extraction Strengthening

Phase C (Deterministic Gates — depends on WP 1 types + WP 3 output schema):
  WP 4: Inference Path Coverage Gate
  WP 9: CML Validator Enhancement

Phase D (LLM Quality Gates — depends on WP 4 guardrails):
  WP 5: Blind Reader Simulation
  WP 6: Bidirectional CML Feedback

Phase E (Pipeline Hardening — depends on all above):
  WP 8: Hard Stops and Retry Topology

Phase F (Validation — depends on all above):
  WP 10: Testing
```

### Estimated Effort

| Work Package | Files Changed | New Code (lines) | Risk | Effort |
|---|---|---|---|---|
| WP 1: Schema & Types | 4 files + examples | ~120 | Low | 2–3 hours |
| WP 2: Agent 3 Hardening | 1 file | ~80 | Low | 1–2 hours |
| WP 3: Agent 5 Strengthening | 1 file | ~100 | Low | 1–2 hours |
| WP 4: Coverage Gate | 1 file | ~250 | Medium | 3–4 hours |
| WP 5: Blind Reader | 2 files | ~150 | Medium | 2–3 hours |
| WP 6: Bidirectional Feedback | 1 file | ~120 | High | 2–3 hours |
| WP 7: System Prompts | 1 file | ~30 | Very Low | 30 min |
| WP 8: Pipeline Hardening | 1 file | ~50 | Medium | 1–2 hours |
| WP 9: CML Validator | 1 file | ~80 | Low | 1–2 hours |
| WP 10: Testing | 3 files | ~200 | None | 2–3 hours |
| **Total** | **~12 files** | **~1,180 lines** | | **16–24 hours** |

### Expected Outcome

After all work packages are implemented:

1. **Information Parity**: Every inference step has verified reader-visible evidence. The blind reader simulation confirms the clue set is sufficient for deduction.
2. **Logical Deducibility**: Contradiction pairs ensure the reader has reasoning fuel at every step. The inference-path coverage gate catches gaps before the LLM audit.
3. **False Assumption Handling**: At least one clue explicitly contradicts the false assumption. Red herrings are checked for accidental truth-support.
4. **Discriminating Test**: Verified to reference evidence the reader has already encountered.
5. **Suspect Elimination**: Every non-culprit suspect is referenced in at least one clue.
6. **No Placeholder Inference Paths**: `normalizeCml()` rejects empty/placeholder steps instead of silently injecting garbage.
7. **Hard Stop on Failure**: After all retries (clue regeneration, CML revision, blind reader feedback), a persistent critical failure stops the pipeline instead of shipping a broken mystery.

The system moves from "hope the LLM gets it right" to "verify at every stage with deterministic checks, then confirm with a blind reader simulation." Fair play compliance becomes a structural property of the pipeline, not a probabilistic outcome.