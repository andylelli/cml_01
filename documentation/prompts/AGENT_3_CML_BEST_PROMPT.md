# Agent 3 - CML Generator Prompt Analog (Runtime-Equivalent)

Source of truth: `packages/prompts-llm/src/agent3-cml.ts`

## Message Stack Actually Sent
1. `system`: combined `system + "\n\n# Technical Specifications\n\n" + developer + "\n\n" + requiredSkeleton`
2. `user`: full CML generation request

## System Prompt Analog
```text
{{CML_SPECIALIST_SYSTEM}}

{{MYSTERY_EXPERT_SYSTEM}}
```

## Developer Prompt Analog (Runtime-Equivalent)
```text
Includes, in order:
1. CML 2.0 schema summary
2. Primary axis descriptions
3. Seed structural patterns (if examples loaded)
4. Novelty constraints block (if provided)
5. Uniqueness seed (`{{runId}}-{{projectId}}`)
6. Era constraints
7. Location constraints
8. Setting lock
9. Hard-logic section (modes + difficulty)
10. Background-context grounding section
11. Hard-logic ideation grounding section
12. Fair-play checklist and inference quality rules

`requiredSkeleton` then appends mandatory CML keys and expected sub-structure.
```

## User Prompt Analog (Runtime-Equivalent)
```text
Create a complete mystery case in CML 2.0 format with these exact specifications:

Setting and Era:
- Decade: {{decade}}
- Location: {{location}}
- Institution: {{institution}}
- Weather: {{weather}}
- Social Structure: {{socialStructure}}
- Tone: {{tone}}
- Theme: {{themeOrNone}}

Cast requirements:
- Cast size: {{castSize}}
- Exact names: {{castNames}}
- Gender map: {{castGendersIfAny}}
- Detective type: {{detectiveType}}
- Victim archetype: {{victimArchetype}}

Mystery logic:
- Primary axis: {{primaryAxis}}
- Complexity: {{complexityLevel}}
- Mechanism families: {{mechanismFamilies}}
- Hard-logic modes: {{hardLogicModes}}
- Difficulty: {{difficultyMode}}

Hard requirements include:
- strict 3-5 inference steps with observation/correction/effect/required_evidence/reader_observable
- discriminating test traceability to prior evidence
- fair-play explanation specificity
- prose_requirements population

Output format:
- JSON only
- start with CML_VERSION 2.0 object
- no extra keys outside schema
```

## Runtime Gates
- `client.chatWithRetry(..., jsonMode: true)`
- parse/repair fallback
- normalization and schema validation
- optional Agent 4 revision pass on failures
