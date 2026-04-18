# Agent 5 Best Prompt (Lightweight, Strong, Purpose-Built)

Purpose: extract fair-play clues from an existing CML case with strict traceability and minimal prompt bloat.

Design principle (airplane model):
- Super light: no repeated rules, no decorative prose.
- Very strong: hard constraints are explicit and machine-checkable.
- Specific purpose: clue extraction only, not validation theater.

Source of truth for runtime implementation: `packages/prompts-llm/src/agent5-clues.ts`

## 1) Mission
Use existing CML facts to produce clues and red herrings that let a reader solve the case before reveal.

Non-negotiable:
- No invented facts.
- Every clue is traceable to CML.
- Essential clues are early or mid, never late.
- Return valid JSON only.

## 2) Minimal Message Stack
1. `system`: role + immutable rules (short)
2. `developer`: case-derived requirements + hard bounds + schema
3. `user`: request + retry deltas (only when needed)

## 3) System Prompt (Lean)
```text
You are a clue extraction specialist for Golden Age mystery fiction.
Extract clues only from existing CML facts.
Do not invent facts.
Keep clues reader-observable and fair-play ordered.
Return valid JSON only.
```

## 4) Developer Prompt (Structural Strength)
Always include these sections, once each.

### A. Case Snapshot
- title, crime category, axis, cast count

### B. Mandatory Requirements (Generated from CML)
For each inference step:
- one observation clue requirement
- one contradiction clue requirement

Also require:
- discriminating-test prerequisite clue(s)
- culprit premeditation visibility clue(s), if applicable
- elimination clue(s) for eligible non-culprit suspects

### C. Deterministic Bounds
- inference step path index range
- supportsInferenceStep valid range
- time anchors range
- time contradictions range
- cast index range
- cast name->index map

### D. Source Path Contract
- Allowed roots are explicitly listed.
- `sourceInCML` must match an allowed root and be in range.
- No synthesized path families.

### E. Red-Herring Contract (when enabled)
- Red herrings must support false assumption only.
- Forbidden overlap terms are explicit (`forbidden_terms[]`).
- Preferred assumption terms are explicit (`preferred_terms[]`).
- Forbidden terms cannot appear in `description` or `misdirection`.

### F. Output Schema
Single JSON object with:
- `status`
- `clues[]`
- `redHerrings[]`
- `audit`

## 5) User Prompt (Execution Contract)
```text
Extract and organize clues from this CML.

Hard rules:
- No invented facts.
- Essential clues must be early/mid only.
- Every CASE.discriminating_test.evidence_clues ID must appear as clues[].id.
- Elimination clues must include time window, corroborator, and explicit exclusion logic.
- sourceInCML must use legal roots and valid indices.
- Use era-appropriate worded time references.
- No digit-based clock notation in description/pointsTo.
- Return valid JSON matching schema.
```

## 6) Generation Order (Critical)
1. Build `clues[].id` and `clues[].sourceInCML`.
2. Validate all source paths against allowed roots and bounds.
3. Populate clue text fields.
4. Build elimination details.
5. Generate red herrings last.
6. Set `status` based on unresolved hard-rule defects.

## 7) Retry Contract (Delta Only)
In retry mode, add only unresolved failures and explicit correction payload:
- `must_fix[]`
- `forbidden_terms[]`
- `preferred_terms[]`
- `required_replacements[]`

Retry scope rule:
- Rewrite only targeted red herring IDs (or only targeted clues). Keep unaffected IDs and text stable unless a dependency forces a change.

Hard retry rules:
- `must_fix[]` is mandatory.
- `forbidden_terms[]` are absolute bans in red-herring text.
- If compliance is impossible, return `status="fail"` and list blockers in `audit.invalidSourcePaths`.

## 8) Failure-Mode Hardening (Pass-First)
Use these rules to prevent the exact recurring failures seen in runs.

### A. Source Path and Index Drift
- Prefer runtime-provided `valid_source_paths[]` exact matching when available.
- If `valid_source_paths[]` is not provided, enforce allowed-root + bounds checks before writing clue text.
- Never use name tokens inside brackets (for example, `CASE.cast[Philip Slater]` is illegal).

### B. Cast Name/Path Mismatch
- If `sourceInCML` is `CASE.cast[N].*`, clue suspect references must match cast index `N` exactly.
- For elimination clues, the suspect named in `pointsTo` must match the same cast index source.

### C. Discriminating-Test ID Coverage
- Compute required IDs from `CASE.discriminating_test.evidence_clues` first.
- Guarantee each required ID exists in `clues[].id`.
- Required IDs must be `criticality: essential` and `placement: early|mid`.

### D. Weak Elimination Clues
- Every elimination clue must include:
  - explicit alibi window text
  - corroborator/evidence source
  - exclusion statement beginning with `Eliminates <name> because ...`

### E. Red-Herring Overlap Recurrence
- Apply forbidden terms only to `redHerrings[].description` and `redHerrings[].misdirection`.
- `redHerrings[].supportsAssumption` may restate the false assumption in plain form.
- Do not echo inference correction wording in description/misdirection.

### F. Status/Audit Consistency
- Set `status="pass"` only when all three computed sets are empty:
  - missing discriminating IDs
  - weak elimination suspects
  - invalid source paths
- Otherwise set `status="fail"`.

### G. Time-Notation Drift
- Description and `pointsTo` must use worded time expressions.
- Never use digit-based clock notation in clue prose.

## 9) Canonical Output Schema
```json
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "...",
      "sourceInCML": "...",
      "pointsTo": "...",
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "...",
      "supportsAssumption": "...",
      "misdirection": "..."
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}
```

## 10) Optional Strict Extension (Use Only If Needed)
Add only when retry traceability is required:
- `redHerringRewrites[]` with `id`, `oldPhrase`, `newPhrase`, `reason`
- `audit.blockingTerms[]`
- `audit.pathViolations[]`

Do not include this extension in first-attempt runs unless required by active failure mode.

## 11) Runtime Ownership Boundary
Prompt responsibilities:
- generation behavior
- explicit contracts

Runtime responsibilities (deterministic, outside prompt):
- source path validation
- bounds checks
- audit consistency checks
- overlap scoring and hard gates

Keep runtime logic out of model-facing instruction text unless it changes output behavior.
