# Agent 5 - Clue Extraction Prompt Analog (Runtime-Equivalent)

Source of truth: `packages/prompts-llm/src/agent5-clues.ts`

## Message Stack Actually Sent
1. `system`: clue extraction role with fair-play rules
2. `developer`: CML-derived clue requirement checklist + schema contract
3. `user`: density and red-herring constrained extraction request

## System Prompt Analog (Verbatim Core)
```text
You are a clue extraction specialist for Golden Age mystery fiction. Extract clues only from existing CML facts and organize them for fair play presentation.

Rules:
- No new facts
- Every clue must be traceable to CML
- Reader-observable clues
- Essential clues must appear before solution
```

## Developer Prompt Analog (Runtime-Equivalent)
```text
Includes runtime-generated sections:
- CML summary (title, crime, axis, cast)
- Mandatory clue requirements from `generateExplicitClueRequirements(cml)`
  - observation clues per inference step
  - contradiction clues per inference step
  - discriminating-test prerequisite clues
  - premeditation visibility clues
  - suspect elimination clues
- Constraint-space context
- Density and red-herring budget directives
- Optional fair-play feedback block

Output schema:
{
  "clues": [{"id":"...","category":"temporal|spatial|physical|behavioral|testimonial","description":"...","sourceInCML":"...","pointsTo":"...","placement":"early|mid|late","criticality":"essential|supporting|optional","supportsInferenceStep":1,"evidenceType":"observation|contradiction|elimination"}],
  "redHerrings": [{"id":"...","description":"...","supportsAssumption":"...","misdirection":"..."}]
}
```

## User Prompt Analog (Runtime-Equivalent)
```text
Extract and organize clues from this mystery CML.

Generate {{densityRange}} clues and {{redHerringBudget}} red herrings.

Hard rules:
- No invented facts
- Essential clues must be early or mid (never late)
- Discriminating-test-enabling clues must be early/mid
- Premeditation evidence must be reader-visible before confrontation
- Return valid JSON matching schema
```

## Runtime Gates
- Post-parse timeline computation (`early/mid/late`)
- fairPlayChecks generation
- normalization for `supportsInferenceStep` / `evidenceType`
