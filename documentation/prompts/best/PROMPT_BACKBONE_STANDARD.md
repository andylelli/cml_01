# Prompt Backbone Standard (Production v2)

## Purpose
This document defines the mandatory prompt architecture used by all non-Agent-9 CML agents. Treat this as the source of truth for prompt quality, output reliability, and cross-agent consistency.

## Core Design Rules
1. Use three roles every time: `system`, `developer`, `user`.
2. Keep `system` stable and role-specific; keep hard contracts in `developer`; keep run-specific values in `user`.
3. Return one machine-parseable object only (JSON unless the runtime explicitly requires YAML).
4. Never emit markdown wrappers, commentary, or analysis outside the object.
5. Never invent entities or facts outside provided inputs.
6. Never change locked identifiers, names, or canonical values unless explicitly instructed.
7. Assume outputs will be validated by schema and deterministic gates.
8. Prevention over cure: encode known failure blockers directly in the request contract so invalid output is prevented upfront, not patched later.

## Standard Prompt Pack

### System Layer (Identity and Non-Negotiables)
Required content:
- Agent identity and responsibility in the pipeline.
- Scope boundary: what the agent must not do.
- Core quality doctrine: fair-play, coherence, traceability.
- Output mode: valid JSON only.

Template:
```text
You are [AGENT_NAME], responsible for [PRIMARY_ROLE].
You must optimize for [TOP_QUALITY_OBJECTIVES].
Hard boundaries:
- Do not [OUT_OF_SCOPE_ACTION_1]
- Do not [OUT_OF_SCOPE_ACTION_2]
- Do not introduce facts not present in provided artifacts unless explicitly requested.
Output valid JSON only.
```

### Developer Layer (Contracts and Gates)
Required content:
- Explicit output schema shape.
- Exact enum and formatting constraints.
- Quality gates tied to downstream validators.
- Anti-failure constraints learned from prior runs.
- Retry-repair behavior when prior errors are supplied.

Template sections:
1. `Output Contract`
2. `Field Constraints`
3. `Quality Gates (Must Pass)`
4. `Failure Patterns (Do Not Produce)`
5. `If Prior Errors Are Provided`

### User Layer (Run Data)
Required content:
- Inputs only, no policy.
- Concrete values injected from runtime.
- No repeated hard rules from developer layer.

Template:
```text
Generate [ARTIFACT] for this run.
Inputs:
- runId: {{runId}}
- projectId: {{projectId}}
- [otherInputs...]
Return JSON object matching the contract.
```

## Required Pre-Output Self-Check
Every agent prompt should instruct the model to silently verify:
1. All required keys exist and are non-empty where required.
2. All enums exactly match allowed values.
3. Cross-field consistency holds (names, IDs, timeline, culprit logic).
4. No contradictions with locked upstream artifacts.
5. Output is parseable JSON with no trailing text.

## Retry and Repair Protocol
When runtime passes validation errors from a prior attempt:
1. Fix only failing fields first.
2. Preserve already-valid content unless it causes a cross-field contradiction.
3. Re-run self-check before emitting.
4. Do not repeat previously rejected enum/value forms.
5. Include an explicit `Correction Targets` list in the retry request so fixes are prioritized and auditable.

## Global Failure Modes to Block
- Hallucinated names, IDs, or locations.
- Timeline drift (using clues before revelation).
- Causal leaps without evidence.
- Red-herring overlap with discriminating evidence.
- Empty placeholders that satisfy shape but not meaning.
- Non-canonical source paths or enum variants that break downstream parsing/coverage gates.
- Modern numeric time notation in narrative-facing fields when era voice requires period wording.

## Style Guidance for Reliability
- Prefer explicit constraints over abstract quality language.
- Use counted requirements where possible (`exactly N`, `at least N`).
- Name required keys explicitly.
- Keep examples minimal to avoid accidental pattern copying.

## Implementation Note
Each file in `documentation/prompts/AGENT_*_BEST_PROMPT.md` contains agent-specific contracts that extend this backbone. Keep this standard stable and tighten agent files when failure patterns recur.

