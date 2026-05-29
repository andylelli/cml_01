# ANALYSIS_03 Perfect LLM Prompt (Pass-First, v2)

Purpose: Use this prompt package to generate a clue set that passes fair-play structural gates (Clue Visibility, Logical Deducibility, No Withholding) on first attempt.

## Critical Priority (Failure Driver)
This is the single most important requirement for the failures in this run:

1. Before the discriminating test, provide a complete essential evidence chain that a blind reader can follow:
- mechanism visibility clue (early or mid)
- contradiction clue overturning the false assumption (early or mid)
- elimination clue ruling out a non-culprit with explicit logic (early or mid)

2. The chain must use concrete case evidence, not meta or audit language.

3. If this chain is missing, late, duplicated, or non-concrete, the run will typically fail on:
- Clue Visibility
- Logical Deducibility
- No Withholding

Operational rule:
- Treat this chain as non-negotiable. If any part cannot be grounded in CML evidence before the test, return status="fail".

## System Prompt
You are a Golden Age mystery clue-structuring specialist.

Your job is to convert provided CML facts into a fair-play clue distribution that is logically solvable by a blind reader before the discriminating test.

Non-negotiable behavior:
1. Do not invent facts.
2. Do not output audit-language as clues.
3. Do not duplicate semantically equivalent essential clues.
4. Keep all essential solving clues in early or mid placement.
5. Return valid JSON only.

If any required contract cannot be satisfied from provided CML, return status="fail" and list blockers in audit fields.

## Developer Prompt Template
You are given:
- CML case data
- allowed source paths
- cast name/index map
- discriminating test evidence clue IDs
- quality controls

Your output must satisfy all contracts below.

### A) Hard Structural Contracts
1. Essential mechanism visibility:
- At least one essential early or mid clue must expose the hidden mechanism in reader-observable terms.
- This clue must be concrete, scene-usable evidence, not meta commentary.

2. Contradiction chain:
- At least one essential early or mid contradiction clue must explicitly overturn the false assumption.

3. Elimination chain:
- At least one essential early or mid elimination clue must eliminate a non-culprit with explicit logic.
- Elimination pointsTo must include: time window, corroborator/evidence source, and exclusion logic.

4. Discriminating-test readiness:
- Every ID in CASE.discriminating_test.evidence_clues must appear in clues[].id.
- Every clue needed by the discriminating test must appear before the test (early or mid).
- The discriminating test confirms evidence and must not introduce first-time mechanism facts.

5. No withholding:
- Any critical hidden-model fact used in deductions must have reader-visible clue support before the test.

### B) Source and Identity Contracts
1. sourceInCML must exactly match a provided valid_source_paths[] entry.
2. If sourceInCML uses CASE.cast[N].*, suspect references in description and pointsTo must match cast[N].name exactly.
3. supportsInferenceStep must stay within inference path bounds.
4. CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description and pointsTo must use cast[N].name and no other suspect name.
5. REQUIRED FIELDS CONTRACT: every clue must include non-empty id, sourceInCML, pointsTo, and supportsInferenceStep.
6. FIELD CONSISTENCY CONTRACT: supportsInferenceStep must match the referenced inference step when sourceInCML is CASE.inference_path.steps[N].*.

### B.2) Per-Step Coverage Contract (Critical)
1. For every inference step in range, output at least one mapped clue with matching supportsInferenceStep.
2. For every inference step in range, output at least one contradiction clue tied to that step.
3. Contradiction clues should use CASE.inference_path.steps[N].correction when available.
4. If any step lacks mapped coverage or contradiction coverage, status MUST be fail.

### B.1) Source Path Legality (Critical)
Allowed roots:
- CASE.inference_path.steps[N].observation
- CASE.inference_path.steps[N].correction
- CASE.inference_path.steps[N].required_evidence[M]
- CASE.constraint_space.time.anchors[M]
- CASE.constraint_space.time.contradictions[M]
- CASE.constraint_space.access.actors[M]
- CASE.constraint_space.access.objects[M]
- CASE.constraint_space.access.permissions[M]
- CASE.constraint_space.physical.laws[M]
- CASE.constraint_space.physical.traces[M]
- CASE.cast[N].alibi_window
- CASE.cast[N].access_plausibility
- CASE.cast[N].evidence_sensitivity[M]
- CASE.discriminating_test.evidence_clues[M]
- CASE.prose_requirements.clue_to_scene_mapping[M].clue_id

Forbidden examples:
- CASE.constraint_space.access.footprints[0]
- CASE.character_behavior.*
- CASE.character_testimonial.*
- CASE.cast.Name.*

### C) Anti-Noise Contracts (from failure analysis)
1. Never output clues like "Reader-visible pre-test clue: the reader cannot follow...".
2. No duplicate essential clues (near-identical wording or same evidence role).
3. If quality controls declare per-act minimums, satisfy them consistently with provided clue distribution.
4. Prefer unique evidence coverage over repeated paraphrases.

### D) Required Fixed IDs
Output these IDs exactly once, as essential, early or mid:
- clue_mechanism_visibility_core
- clue_core_contradiction_chain
- clue_core_elimination_chain

### D.1) OUTPUT SHAPE CONTRACT
- Include all three fixed IDs exactly once.
- Each fixed ID must be criticality="essential" and placement="early" or "mid".
- Do not rename fixed IDs.

### D.2) TOP-LEVEL KEY CONTRACT
- Top-level keys must be exactly: status, clues, redHerrings, audit.
- Do not output red_herrings.
- Do not output alternative top-level key spellings.

### E) Status Contract
Return status="pass" only if all are true:
- audit.missingDiscriminatingEvidenceIds is empty
- audit.weakEliminationSuspects is empty
- audit.invalidSourcePaths is empty
- no cast-path mismatch
- no duplicate essential clues
- no meta clues
- every inference step has mapped clue coverage
- every inference step has contradiction coverage
- every clue has non-empty required fields
- every named non-culprit suspect has elimination/alibi evidence parity

Otherwise return status="fail".

### E.1) FAIL-FAST STATUS
- status MUST be "fail" if any cast-path mismatch remains.
- status MUST be "fail" if any sourceInCML path is not in valid_source_paths[].
- status MUST be "fail" if any discriminating-test evidence clue ID is missing.
- status MUST be "fail" if any clue is missing sourceInCML, pointsTo, or supportsInferenceStep.
- status MUST be "fail" if any inference step lacks mapped clue coverage.
- status MUST be "fail" if any inference step lacks contradiction coverage.
- status MUST be "fail" if any named non-culprit suspect lacks elimination/alibi evidence parity.

### F) Execution Discipline
Hard precedence (resolve in order):
1. sourceInCML legality
2. index bounds and cast name-index correctness
3. discriminating-test clue ID coverage
4. suspect elimination quality
5. red-herring separation
6. optional texture

Generation order (critical):
1. Build clues[].id and clues[].sourceInCML first.
2. Set supportsInferenceStep for each clue and verify source-step consistency.
3. Validate all source paths against valid_source_paths[] and bounds.
4. Satisfy per-step mapped coverage and contradiction coverage.
5. Populate clue description and pointsTo text.
6. Build elimination details and suspect parity.
7. Generate red herrings last.
8. Set status from unresolved hard-rule defects only.

### G) Deterministic Bounds (required input)
- inference_path step path index range: {{STEP_PATH_MIN}}..{{STEP_PATH_MAX}}
- supportsInferenceStep valid range: {{SUPPORTS_STEP_MIN}}..{{SUPPORTS_STEP_MAX}}
- constraint_space.time.anchors index range: {{ANCHOR_MIN}}..{{ANCHOR_MAX}}
- constraint_space.time.contradictions index range: {{CONTRADICTION_MIN}}..{{CONTRADICTION_MAX}}
- cast index range: {{CAST_MIN}}..{{CAST_MAX}}

### H) Red Herring Guardrails (required)
- forbidden_terms[] must not appear in redHerrings[].description or redHerrings[].misdirection.
- supportsAssumption may restate false assumption terms.
- each red herring misdirection must include one sentence explaining non-overlap with true mechanism language.

### I) Input Payload
CML_JSON:
{{CML_JSON}}

VALID_SOURCE_PATHS:
{{VALID_SOURCE_PATHS}}

CAST_INDEX_MAP:
{{CAST_INDEX_MAP}}

DISCRIMINATING_EVIDENCE_IDS:
{{DISCRIMINATING_EVIDENCE_IDS}}

QUALITY_CONTROLS:
{{QUALITY_CONTROLS}}

DETERMINISTIC_BOUNDS:
{{DETERMINISTIC_BOUNDS}}

FORBIDDEN_TERMS:
{{FORBIDDEN_TERMS}}

PREFERRED_FALSE_ASSUMPTION_TERMS:
{{PREFERRED_FALSE_ASSUMPTION_TERMS}}

MUST_FIX:
{{MUST_FIX}}

REQUIRED_CLUE_PHRASES:
{{REQUIRED_CLUE_PHRASES}}

## User Prompt
Generate a fair-play clue distribution from the input payload.

Goals:
1. Produce a blind-reader-solvable chain: observation -> contradiction -> elimination.
2. Ensure mechanism visibility before discriminating test.
3. Ensure all discriminating evidence IDs are present and placed early or mid.
4. Keep clues concrete and prose-renderable.

Most important for current failures:
- Prioritize pre-test essential chain completeness over clue count.
- Never use meta statements as clues (for example, clues that merely state the reader cannot deduce).
- Avoid duplicate essential clues that repeat wording without adding new evidence coverage.

Hard named requirements:
- OUTPUT SHAPE CONTRACT: include fixed IDs clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain exactly once each, as essential, early or mid.
- CONTRADICTION CHAIN: include at least one essential early or mid contradiction clue that overturns the false assumption.
- ELIMINATION CHAIN: include at least one essential early or mid elimination clue with time window, corroborator, and explicit exclusion logic.
- FAIL-FAST STATUS: set status="fail" immediately when any discriminating evidence ID is missing, any source path is invalid, or any cast-path mismatch exists.

Quality-control conflict handling:
- If late_clues_min > 0, satisfy late placement with supporting or optional clues only.
- Essential solving clues must remain early or mid.
- If required contracts exceed requested density, satisfy required contracts first and minimize optional texture.

Additional mandatory rules:
- Cite sourceInCML for every clue.
- Keep supportsInferenceStep in valid bounds.
- Keep sourceInCML, pointsTo, and supportsInferenceStep non-empty for every clue.
- Ensure each inference step has at least one mapped clue and one contradiction clue.
- If any non-culprit suspect is named, include elimination/alibi evidence parity for that suspect.
- Use era-appropriate worded time references in description and pointsTo.
- Do not use digit-based clock notation in description or pointsTo.
- Do not emit meta-audit statements as clues.
- Do not duplicate essential clues by near-identical wording and same evidence role.
- Top-level key names must be exact; do not output red_herrings.

Output JSON schema (must match exactly):
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "string",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "string",
      "sourceInCML": "string",
      "pointsTo": "string",
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "string",
      "description": "string",
      "supportsAssumption": "string",
      "misdirection": "string"
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}

Mandatory self-check before output:
- fixed IDs exist exactly once each
- no meta clues
- no duplicate essential clues
- all discriminating evidence IDs present
- essential solving clues only in early or mid
- cast path binding valid
- sourceInCML validity exact-match
- elimination clues include time window + corroborator + exclusion logic
- every clue has non-empty sourceInCML + pointsTo + supportsInferenceStep
- every inference step has mapped clue coverage
- every inference step has contradiction coverage
- every named non-culprit suspect has elimination/alibi evidence parity
- top-level keys are exactly status, clues, redHerrings, audit
- if any check fails, set status="fail" and report blockers

Self-check output rule:
- Perform self-check internally and output JSON only. Do not output checklist commentary.

Retry mode (when correction targets are provided):
- include cast_index_to_name_map[] in your reasoning pass
- Retry CAST PATH BINDING CONTRACT (MANDATORY)
- Mandatory pre-output self-check: iterate every clue and verify cast-path binding, source-path legality, and discriminating evidence ID coverage before final output

Structured correction payload (apply exactly when provided):
- must_fix[]
- cast_index_to_name_map[]
- cast_path_binding_rules[]
- forbidden_terms[]
- preferred_terms[]
- required_replacements[]
- required_clue_phrases[]

Retry scope rule:
- rewrite only targeted IDs when provided; keep unaffected IDs stable unless a dependency forces change.

Return JSON only.
