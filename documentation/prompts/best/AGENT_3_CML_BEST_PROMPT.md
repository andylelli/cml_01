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

Quality bar:
- Each section must be operationally usable by downstream agents (clues, fair-play, narrative, prose).
- Prefer concrete contradictions and named evidence over generic mystery filler.
- Keep strict axis coherence between false assumption, mechanism, and discriminating test.

Hard constraints learned from failures:
- Keep required setting fields non-empty, including `CASE.meta.setting.institution`.
- Use canonical enum vocabulary consistently (no ad-hoc variant labels).
- Ensure `discriminating_test.evidence_clues` is non-empty and every clue ID is mirrored in `prose_requirements.clue_to_scene_mapping`.
- Ensure each inference step has concrete `required_evidence` that Agent 5 can directly convert into clues.
- Require narrative-facing time references in evidence text to be era-appropriate and worded (for example, "ten minutes to eleven" rather than numeric clock strings).
- Ensure each inference `effect` is logically consistent with final culprit assignment (no self-contradictory eliminations).

Micro-exemplars:
- Weak inference observation: "Witness accounts conflict."
- Strong inference observation: "Porter log shows Dr. Vale boarding the twelve minutes past eight service while his alibi places him at the manor at ten past eight."
- Weak effect: "Narrows suspects."
- Strong effect: "Eliminates Hartwell by proving key access ended at twenty minutes to eight, forty minutes before symptom onset."

Silent checklist before return:
- all required top-level keys present
- each inference step has required_evidence
- discriminating test uses prior evidence only
- fair_play explanation is specific
- prose_requirements clue IDs traceable to scene mapping
- `institution` and other required setting fields are non-empty
- discriminating-test clue IDs are concrete and reusable downstream
- time references in narrative-facing evidence are worded for era voice
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
- non-empty required setting values (including institution)
- canonical enum/value forms only
- era-style worded time references in narrative-facing fields

Output format:
- JSON only
- start with CML_VERSION 2.0 object
- no extra keys outside schema

Retry mode (when prior errors are supplied):
- Start with a `Correction Targets` block and resolve listed failures first.
- Preserve already-valid sections unless they conflict with target fixes.
- Re-run checklist and avoid reintroducing rejected value forms.
```

## Runtime Gates
- `client.chatWithRetry(..., jsonMode: true)`
- parse/repair fallback
- normalization and schema validation
- optional Agent 4 revision pass on failures
