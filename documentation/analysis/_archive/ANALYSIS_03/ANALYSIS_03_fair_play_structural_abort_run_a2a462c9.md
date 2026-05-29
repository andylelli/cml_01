# ANALYSIS_03 - Fair-Play Structural Abort (run_a2a462c9)

Date: 2026-04-24  
Scope: Root-cause analysis of pre-prose CML validation abort driven by fair-play structural violations  
Run: `run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4`

## 1) Exact Failure Statement

The pipeline stopped before prose generation because the CML fair-play gate remained structurally broken after retries.

Exact abort text (report and worker log):

- `CML validation failed before prose generation:`
- `Fair play audit failed with 3 structural violation(s) (Clue Visibility, Logical Deducibility, No Withholding) - prose cannot realize a broken mystery`
- `Fix CML structure before attempting prose generation.`

Evidence:
- `apps/api/data/reports/proj_fa4848dd-3d76-4258-8d9e-e28e5d4be3b0/run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4.json`
- `apps/worker/logs/run_20260424_a2a462c9.json`

## 2) Why these 3 violations became hard-stop blockers

The orchestrator intentionally maps only a structural subset of fair-play rules to pre-prose hard-stop behavior:

- Clue Visibility
- Logical Deducibility
- No Withholding

Implementation:
- Structural rule selection and filtering: `apps/worker/src/jobs/mystery-orchestrator.ts`
  - `deriveStructuralBlockingFairPlayViolations(...)`
  - `structurallyBlockingRules = ["clue visibility", "no withholding", "logical deducibility"]`
- Abort message assembly:
  - `Fair play audit failed with ${blockingViolations.length} structural violation(s) ...`
  - `... prose cannot realize a broken mystery`
- Final throw:
  - `CML validation failed before prose generation: ...`

Result: even if the auditor reports additional critical rules (for example Information Parity and Discriminating Test Timing), the orchestrator hard-stop is triggered by this structural trio.

## 3) LLM Prompt and Response Used at the Failing Decision Point

### 3.1 Agent 6 FairPlayAuditor (final blocking audit)

Request artifact:
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/18_Agent6-FairPlayAuditor_request.md`

Response artifact:
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/18_Agent6-FairPlayAuditor_response.md`

Key metadata:
- Model: `GPT-4o-mini`
- Prompt Hash: `0a156e5c34ac1dbe`
- Response Hash: `1050a9ae03c471d3`
- Prompt tokens: `3181`
- Completion tokens: `1080`

Prompt excerpt (what was asked):
- Checklist explicitly audits Clue Visibility, Information Parity, Logical Deducibility, Discriminating Test Timing, and No Withholding.
- Prompt demands JSON-only output and concrete references to clue IDs/CML locations.

Response excerpt (what was returned):
- `"overallStatus": "fail"`
- Critical violations included:
  - `"rule": "Clue Visibility"`
  - `"rule": "Information Parity"`
  - `"rule": "Logical Deducibility"`
  - `"rule": "Discriminating Test Timing"`
  - `"rule": "No Withholding"`

### 3.2 Agent 5 ClueExtraction retry signal feeding Agent 6 context

Artifact:
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/16_Agent5-ClueExtraction_retry1_response.md`

Key metadata:
- Model: `GPT-4o-mini`
- Prompt Hash: `ec4b1150aee60749`
- Response Hash: `4fa17d99fc6a3316`
- `"status": "fail"`
- `"missingDiscriminatingEvidenceIds": ["clue_early_1", "clue_early_2", "clue_early_3"]`

Interpretation:
- The clue set remained contract-incomplete for discriminating evidence timing/visibility, which directly increases likelihood of FairPlay critical failures.

## 4) How the Prompt Is Constructed

## 4.1 Agent 6 fair-play prompt construction

File: `packages/prompts-llm/src/agent6-fairplay.ts`

Construction flow:
1. `buildFairPlayPrompt(inputs)` builds a 3-message chat payload:
   - system: fair-play auditor role and Detection Club style rules
   - developer: full context serialization
   - user: explicit audit task + checklist + JSON schema
2. `buildDeveloperContext(caseData, clues)` serializes:
   - mystery overview
   - surface model vs hidden model
   - inference path and discriminating test
   - clue distribution and essential clue listing
   - constraint space and cast alibi/access/opportunity context
   - quality controls and clue-to-scene mapping
3. `buildUserRequest()` defines:
   - pass/fail checks
   - severity semantics
   - output schema requirements
4. `auditFairPlay(...)` executes model call in JSON mode and parses/repairs JSON output.

## 4.2 Agent 5 clue prompt construction (upstream dependency)

File: `packages/prompts-llm/src/agent5-clues.ts`

Construction flow:
1. `buildCluePrompt(inputs)` builds system/developer/user prompt bundle.
2. Prompt includes heavy contracts:
   - mandatory clue requirements
   - source path legality and cast-index coupling
   - retry correction targets
   - structured correction payload
   - hard retry contract
3. Output is expected to satisfy strict clue structure plus discriminating-test support coverage.

## 4.3 Agent 6 deterministic post-processing after LLM

File: `apps/worker/src/jobs/agents/agent6-run.ts`

Important deterministic edits:
- `ensureParityBridgeClue(...)`
  - can inject `Pre-test reader-visible mechanism clue: ...`
- `synthesizeAuditVisibilityClues(...)`
  - can inject `Reader-visible pre-test clue: ...` derived from audit-violation language
- `ensureCriticalFairPlayBackstopClues(...)`
  - injects additional essential clues tied to inference steps

These deterministic additions are intended as repair backstops before re-audit.

## 5) Why This Run Failed Repeatedly (Root Cause Chain)

1. Upstream clue generation remained unstable/incomplete:
- Agent 5 retry output still `status: fail` and reported missing discriminating evidence IDs.

2. Agent 6 re-audits a mixed clue set containing both natural clues and synthetic repair clues:
- Some synthetic clues are meta-descriptive (for example, clues about reader visibility itself), which can degrade narrative-natural evidence quality.

3. Final Agent 6 audit still returned critical failures on the structural trio:
- Clue Visibility
- Logical Deducibility
- No Withholding

4. Orchestrator pre-prose gate hard-stopped exactly on those structural rules.

5. Pipeline aborted before Agent 9 prose generation.

## 6) Weaknesses in the Current Prompt/Repair Design

## 6.1 Prompt complexity and contract overload

Agent 5 and Agent 6 prompts are both dense and highly constrained. Combined with retry overlays, this increases inconsistent compliance risk.

Symptoms:
- duplicate or semantically overlapping clues
- strict-format compliance with weaker semantic grounding
- incomplete discriminating-evidence timing despite large instruction payload

## 6.2 Repair strategy can inject meta-clues instead of diegetic evidence

Deterministic backstops may convert audit language into clue text (for example `Reader-visible pre-test clue: ...`). This can satisfy surface timing shape while weakening actual evidence realism and deductive quality.

## 6.3 LLM-to-LLM adjudication loop amplifies noisy inputs

One model generates/revises clues and another model judges fairness from serialized summaries. If clue semantics are noisy, subsequent audits may remain critical even after structural patching attempts.

## 6.4 Structural gate is correctly strict, but late in the pipeline

The hard-stop rule is valid for fair-play integrity, but many failures are only discovered after expensive generation/retry cycles. Earlier deterministic structural checks would reduce churn and failure loops.

## 7) High-Confidence Conclusion

The abort is not a single runtime bug. It is a structural quality failure loop:

- clue extraction/retry did not produce a robust pre-test evidence chain,
- deterministic repairs introduced synthetic/meta clues that did not reliably restore true deducibility parity,
- final fair-play audit remained critical on structural rules,
- orchestrator correctly blocked prose because a broken mystery should not be realized into narrative output.

## 8) Prevention-First Fix Direction (recommended)

1. Add deterministic pre-audit validators before Agent 6 LLM audit:
- required early/mid evidence for each inference step
- explicit discriminating-test dependency graph check
- no detective-only hidden fact usage check

2. Ban meta-audit prose from clue synthesis:
- do not generate clues from violation text templates
- only synthesize from concrete CML factual fields with traceable source paths

3. Split prompt contracts by responsibility:
- keep Agent 5 focused on evidence grounding and source legality
- keep Agent 6 focused on auditing already-stable evidence sets
- avoid piling retry-correction semantics into the same monolithic prompt when possible

4. Promote fail-fast structural checks earlier:
- reject/repair at clue-build stage before expensive downstream looping
- preserve hard-stop semantics at orchestrator gate

---

### Primary Evidence Files

- `apps/worker/logs/run_20260424_a2a462c9.json`
- `apps/api/data/reports/proj_fa4848dd-3d76-4258-8d9e-e28e5d4be3b0/run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4.json`
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/16_Agent5-ClueExtraction_retry1_response.md`
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/18_Agent6-FairPlayAuditor_request.md`
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/18_Agent6-FairPlayAuditor_response.md`
- `packages/prompts-llm/src/agent5-clues.ts`
- `packages/prompts-llm/src/agent6-fairplay.ts`
- `apps/worker/src/jobs/agents/agent6-run.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`

## 9) Last Actual Prompt Request (Verbatim)

Source artifact:
- `documentation/prompts/actual/run_20260424-1809_a2a462c9/18_Agent6-FairPlayAuditor_request.md`

```text
# Actual Prompt Record

- Run ID: `run_a2a462c9-9818-4f7d-b7c1-a6b7b41898e4`
- Project ID: `proj_fa4848dd-3d76-4258-8d9e-e28e5d4be3b0`
- Timestamp: `2026-04-24T18:13:42.253Z`
- Agent: `Agent6-FairPlayAuditor`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.3`
- Max Tokens: `2500`
- Attempt: `first`
- Prompt Hash: `0a156e5c34ac1dbe`

## Message 1 (role=system)

You are an expert mystery fiction fair play auditor. Your role is to rigorously validate that a detective mystery follows the classic "fair play" rules established by the Detection Club:

1. **All clues must be revealed to the reader** before the solution
2. **No special knowledge** required (obscure poisons, rare languages, etc.) unless explained
3. **No information withheld** from reader that the detective knows
4. **The solution must be logically deducible** from the clues provided
5. **The discriminating test** (the crucial clue that reveals the culprit) must appear at the proper time
6. **No supernatural solutions** or deus ex machina
7. **The detective must not commit crimes** or use illegal methods to solve the case

You audit the mystery by analyzing the CML structure (which defines the logical proof) and the clue distribution (which shows how that proof is revealed to the reader).

Your goal is to ensure a reader, armed with the clues, can deduce the solution using logical reasoning-exactly as the detective does.

## Message 2 (role=developer)

# Fair Play Audit Context

## Mystery Overview
**Title**: The Clockwork Deception
**Primary Axis / False Assumption Type**: temporal
**Crime**: suspicious death
**Culprit**: Auberon Warenne

---

## Surface Model (What the Reader Is Meant to Believe)
**Narrative**: During a charity event at a grand manor house, Leon Vautier is found dead, leading his acquaintance Claire Courtenay to uncover a web of motives and deception rooted in family ties and financial interests.

### Accepted Facts (reader takes these as given)
- Leon Vautier was found dead in the library.
- A clock in the library was found wound back.

### Inferred Conclusions (reader draws these from accepted facts)
- The time of death was obscured by tampering with the clock.

---

## Hidden Model (What Is Actually True)
**Mechanism**: A clock was deliberately wound back to obscure the actual time of Leon's murder, misleading witnesses and investigators about when the crime occurred.

### Delivery Path
1. The clock was found showing ten minutes past eleven.
2. Witnesses reported hearing a scream coinciding with the clock reading.
3. The clock showed signs of recent tampering.

**Outcome**: The true time of death was shortly after the clock was reset.

---

## False Assumption
**Statement**: The murder must have occurred before the clock was reset.
**Why it seems reasonable**: Witnesses all agreed the clock indicated a specific time when they heard the scream.
**What it hides**: The actual time of the murder was just after the clock was wound back.

---

## Inference Path (Detective's Logic)
The detective follows these logical steps to reach the solution:

1. **The clock in the library shows ten minutes past eleven.**: The clock's time indicates it was tampered with before the murder. -> Narrows the time of death to just after the clock was reset.
   **Required evidence**: The clock shows ten minutes past eleven; Witnesses report hearing a scream coinciding with the clock reading; The clock was found in the library; The clock shows signs of tampering
2. **Witness testimonies about the time of the scream vary.**: The varied testimonies indicate confusion about the actual timeline. -> Eliminates the possibility that the murder happened before the clock was reset.
   **Required evidence**: Witnesses report different times they heard the scream; The clock shows signs of tampering; Witnesses were present during the charity event; The clock was last wound before the event
3. **The clock shows signs of recent tampering.**: The clock was wound back to obscure the actual time of death. -> Narrows the suspect pool based on access to the clock.
   **Required evidence**: The clock shows signs of tampering; Witness testimonies about the scream; The clock was found in the library; The time of the scream is inconsistent with the clock

### Discriminating Test
**Method**: trap
**Design**: Compare the clock's time with the witnesses' varied statements about when they heard the scream to show the contradiction between the clock's time and the actual time of death.
**Reveals**: The tampering with the clock reveals the actual time of death.

---

## Clue Distribution
The mystery distributes 18 clues to the reader:

### Early Clues (Act I) - 4 clues
- [essential] temporal ->step1 (observation): The clock in the library shows ten minutes past eleven.
- [essential] temporal ->step2 (observation): Witness testimonies about the time of the scream vary.
- [essential] temporal ->step2 (observation): Witness testimonies about the time of the scream vary.
- [essential] temporal ->step1 (observation): Reader-visible pre-test clue: The reader cannot follow a logical deduction path due to the timing of essential clues..

### Mid Clues (Act II) - 14 clues
- [essential] testimonial ->step3 (elimination): Eliminates Yvette Brabazon because she was seen in the garden at the time of the murder.
- [essential] temporal ->step2 (observation): The clock shows signs of recent tampering.
- [essential] temporal ->step2 (contradiction): The clock was wound back to obscure the actual time of death.
- [essential] temporal ->step2 (observation): Compare the clock's time with the witnesses' varied statements about when they heard the scream.
- [essential] behavioral ->step3 (observation): Auberon Warenne was seen near the clock shortly before the murder.
- [essential] behavioral ->step3 (observation): Auberon Warenne had a motive related to the inheritance.
- [essential] testimonial ->step3 (elimination): Eliminates Alison Waldegrave because she was attending a meeting at the time of the murder.
- [essential] testimonial ->step2 (observation): Witnesses reported hearing a scream at different times.
- [essential] physical ->step3 (observation): The library door was locked from the inside.
- [essential] physical ->step3 (observation): The window was found ajar, suggesting someone could have entered or exited.
- [essential] temporal ->step3 (observation): The clock was last checked at a quarter past ten.
- [essential] temporal ->step3 (observation): The clock was found to have been adjusted shortly before the murder.
- [essential] temporal ->step2 (observation): Compare the clock's time with the witnesses' varied statements about when they heard the scream.
- [essential] temporal ->step2 (contradiction): The clock was wound back to obscure the actual time of death.

### Late Clues (Act III) - 0 clues
None

### Essential Clues (per inference step)
- The clock in the library shows ten minutes past eleven. (early, step 1)
- Witness testimonies about the time of the scream vary. (early, step 2)
- Eliminates Yvette Brabazon because she was seen in the garden at the time of the murder. (mid, step 3)
- The clock shows signs of recent tampering. (mid, step 2)
- The clock was wound back to obscure the actual time of death. (mid, step 2)
- Compare the clock's time with the witnesses' varied statements about when they heard the scream. (mid, step 2)
- Auberon Warenne was seen near the clock shortly before the murder. (mid, step 3)
- Auberon Warenne had a motive related to the inheritance. (mid, step 3)
- Eliminates Alison Waldegrave because she was attending a meeting at the time of the murder. (mid, step 3)
- Witnesses reported hearing a scream at different times. (mid, step 2)
- The library door was locked from the inside. (mid, step 3)
- The window was found ajar, suggesting someone could have entered or exited. (mid, step 3)
- The clock was last checked at a quarter past ten. (mid, step 3)
- The clock was found to have been adjusted shortly before the murder. (mid, step 3)
- Compare the clock's time with the witnesses' varied statements about when they heard the scream. (mid, step 2)
- Witness testimonies about the time of the scream vary. (early, step 2)
- The clock was wound back to obscure the actual time of death. (mid, step 2)
- Reader-visible pre-test clue: The reader cannot follow a logical deduction path due to the timing of essential clues.. (early, step 1)

### Red Herrings
- The murder must have occurred before the clock was reset, as the clock shows a different time. (supports: The murder must have occurred before the clock was reset.)
- Witnesses claim they heard a scream before the clock was adjusted. (supports: The murder must have occurred before the clock was reset.)

---

## Constraint Space
The mystery establishes these constraints:

### Temporal Constraints
- The clock's last known accurate time
- Witnesses' statements about the scream
- Time frame around the charity event
- Time frame of when the clock was last wound
- The clock shows ten minutes past eleven, but witnesses heard the scream at different times.

### Access Constraints
- Household staff
- Guests at the event
- The clock
- The library
- Guests allowed in the library after the event.

### Physical Evidence
- Time is absolute and cannot be altered
- Tampering evidence on the clock

### Social Constraints
- Family trust
- Social connections among guests
- Household staff reports
- Witness testimonies

---

## Cast - Alibi, Access & Evidence Sensitivity
- **Leon Vautier**: alibi="None" | access="high" | opportunities: Household staff; Family members | evidence_sensitivity: Financial records, Personal correspondence
- **Auberon Warenne**: alibi="At the event" | access="high" | opportunities: Household access | evidence_sensitivity: Alibi witnesses, Political connections
- **Yvette Brabazon**: alibi="At the event" | access="medium" | opportunities: Social gatherings | evidence_sensitivity: Witness testimonies, Event schedules
- **Alison Waldegrave**: alibi="At the event" | access="medium" | opportunities: Event access | evidence_sensitivity: Art supplies, Financial records
- **Claire Courtenay**: alibi="None" | access="high" | opportunities: Investigative access | evidence_sensitivity: Investigation logs, Witness statements

---

## CML Fair Play Declarations
all_clues_visible: true
no_special_knowledge_required: true
no_late_information: true
reader_can_solve: true
explanation: Step 1: The clock's time and witness statements establish a conflict. Step 2: Witness variations highlight confusion around the actual timeline. Step 3: Tampering evidence reveals the obscured time of death.

---

## Quality Controls
**Discriminating test must appear**: early_act3
**Essential clues minimum**: 3 | before discriminating test: true
**Clues per act minimum**: early=2, mid=2, late=1

---

## Clue-to-Scene Mapping (when present)
- clue clue_early_1: Act 1, Scene 3 (Direct observation)
- clue clue_early_2: Act 1, Scene 3 (Witness statement)
- clue clue_early_3: Act 1, Scene 3 (Physical evidence)

## Message 3 (role=user)

# Fair Play Audit Task

Perform a rigorous fair play audit of this mystery. Analyze whether the reader can logically deduce the solution from the clues provided.

## Audit Checklist

1. **Clue Visibility**: Are all essential clues revealed before the discriminating test, including at least one essential early/mid mechanism-visibility clue (not late)?
2. **Information Parity**: Does the reader have the same information as the detective?
3. **Special Knowledge**: Is any specialized knowledge required? If so, is it explained?
4. **Logical Deducibility**: Can the reader follow an observation -> correction -> elimination chain using only clues that are essential and placed early/mid before Act III?
5. **Discriminating Test Timing**: Does the discriminating test scene appear at the timing specified in the Quality Controls section above, and do all clues the test relies on appear in earlier scenes before it (the test must confirm evidence, not introduce it)?
6. **No Withholding**: Are there any facts the detective knows but the reader doesn't? Cross-reference the Hidden Model and the cast alibi/access/opportunity data against the clue set.
7. **Constraint Consistency**: Do the clues align with the constraint space (time, access, physical evidence, social trust channels)?
8. **False Assumption Support**: Do the red herrings effectively support the false assumption?
9. **Solution Uniqueness**: Do the clues point unambiguously to the culprit, with at least one essential elimination clue ruling out a non-culprit before reveal?

## Quality Bar
- Findings must cite concrete clue IDs, inference steps, or CML fields.
- Distinguish critical fairness breaks from moderate craft issues.
- Recommendations must be actionable and minimally invasive.
- Treat semantically equivalent clues as valid even when wording differs; fail only when evidence role, placement timing, or deduction ordering is missing.

## Micro-exemplars
- Weak violation: "Fair play is weak."
- Strong violation: "Critical Information Parity breach: step 3 relies on purchase receipt absent from any early/mid clue; add reader-visible clue before discriminating test."

## Silent Pre-Output Checklist
- every failed check cites exact clue IDs or CML locations
- severity matches impact on solvability
- recommendations are concrete and minimally invasive
- JSON only, no markdown fences

## Output Format

Return a JSON object with this structure:

{
  "overallStatus": "pass" | "fail" | "needs-revision",
  "checks": [
    {
      "rule": "Clue Visibility",
      "status": "pass" | "fail" | "warning",
      "details": "Description of what was checked and the result",
      "recommendations": ["Optional suggestions for improvement"]
    }
  ],
  "violations": [
    {
      "severity": "critical" | "moderate" | "minor",
      "rule": "Information Parity",
      "description": "Specific violation found",
      "location": "Where in the CML/clues",
      "suggestion": "How to fix it"
    }
  ],
  "warnings": ["Non-critical issues that could improve fair play"],
  "recommendations": ["General suggestions to strengthen the mystery"],
  "summary": "Overall assessment of the mystery's fair play compliance"
}

Be thorough and specific. If you find violations, explain exactly what's wrong and how to fix it.
```

## 10) Prompt Parts Most Likely Causing the Failures

This section pinpoints the exact request-context fragments that are creating failure pressure.

### 10.1 Synthetic meta-clue text injected as if it were evidence

Problematic fragment in the request context:
- `Reader-visible pre-test clue: The reader cannot follow a logical deduction path due to the timing of essential clues..`

Why this causes issues:
- This is an audit diagnosis sentence, not diegetic case evidence.
- It pollutes the clue pool with meta-language instead of observable facts.
- It directly reinforces Logical Deducibility and Clue Visibility failures because the clue states the failure rather than supplying missing mechanism evidence.

### 10.2 Duplicate essential clues in the same prompt context

Problematic fragments in the request context:
- `Witness testimonies about the time of the scream vary.` appears multiple times.
- `The clock was wound back to obscure the actual time of death.` appears multiple times.
- `Compare the clock's time with the witnesses' varied statements...` appears multiple times.

Why this causes issues:
- Duplicates inflate clue count without increasing evidence coverage.
- The prompt can look structurally dense while still missing distinct pre-test mechanism evidence.
- This contributes to false confidence in coverage and persistent No Withholding / Clue Visibility findings.

### 10.3 Internal contract contradiction: clue minimums vs provided clues

Problematic fragments in the request context:
- `### Late Clues (Act III) - 0 clues`
- `Clues per act minimum: early=2, mid=2, late=1`

Why this causes issues:
- The same prompt declares a late clue minimum of 1 while providing 0 late clues.
- This creates a built-in contract violation inside the audit input itself.
- It increases probability of Discriminating Test Timing and general fair-play failure outcomes.

### 10.4 ID and traceability mismatch inside the same prompt package

Problematic fragments in the request context:
- Clue-to-scene mapping references `clue_early_1`, `clue_early_2`, `clue_early_3`.
- Clue distribution bullets are mostly textual and not consistently ID-grounded.

Corroborating downstream signal:
- Agent 5 retry output reports `missingDiscriminatingEvidenceIds: ["clue_early_1", "clue_early_2", "clue_early_3"]` with `status: fail`.

Why this causes issues:
- The audit checklist asks for concrete clue IDs/CML locations, but the context mixes ID-based and text-only clue representations.
- This weakens deterministic traceability of discriminating evidence and drives repeated visibility/parity failures.

### 10.5 Inference-step semantic mismatch (step intent vs supporting evidence)

Problematic fragment in the request context:
- Step 3 says it "narrows the suspect pool based on access to the clock," but listed supporting clues are largely timeline/tampering restatements, with weaker explicit access-elimination linkage.

Why this causes issues:
- The observation -> correction -> elimination chain is under-grounded for the step's stated objective.
- This contributes to Logical Deducibility failures even when many clues are present.

### 10.6 Conflicting guidance in user instruction block

Problematic fragment in the request context:
- `Treat semantically equivalent clues as valid even when wording differs...`

Why this causes issues:
- In this run, the clue set already contains repeated near-equivalents.
- This instruction can mask low-diversity evidence coverage and make duplicates look acceptable, delaying hard detection of missing unique mechanism evidence.

## 11) Bottom-line Causality

The failing prompt is not weak because it is too short; it is weak because it is internally noisy and partially contradictory:

- meta-audit language appears as clue evidence,
- duplicate clues substitute for distinct evidence,
- declared quality minima conflict with provided clue inventory,
- clue ID traceability is inconsistent.

Those specific prompt-context defects align directly with the observed critical failures (Clue Visibility, Logical Deducibility, No Withholding) and the pre-prose hard-stop.
