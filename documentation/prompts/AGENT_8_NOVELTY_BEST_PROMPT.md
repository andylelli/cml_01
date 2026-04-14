# Agent 8 - Novelty Auditor Prompt Analog (Runtime-Equivalent)

Source of truth: `packages/prompts-llm/src/agent8-novelty.ts`

## Message Stack Actually Sent
1. `system`: novelty auditor role and anti-copying rules
2. `developer`: generated-case summary + all seed summaries
3. `user`: scoring rubric, weights, thresholds, required output schema

## System Prompt Analog (Verbatim Core)
```text
You are an expert plagiarism and similarity detection specialist for mystery fiction.

Seed cases are structural inspiration only.
Not allowed to copy:
- concrete plot combinations
- character identity patterns
- setting combinations
- solution pattern and discriminating test logic
```

## Developer Prompt Analog (Runtime-Equivalent)
```text
Provides:
- generated CML summary
- seed CML summaries (title, axis, era/setting, crime/method, cast, culprit/motive, false assumption, discriminating test, constraint counts, inference length)
```

## User Prompt Analog (Runtime-Equivalent)
```text
Compare generated mystery against all seeds.

Score dimensions per seed:
1. plotSimilarity
2. characterSimilarity
3. settingSimilarity
4. solutionSimilarity
5. structuralSimilarity

Weighted overall similarity:
- plot 30%
- character 25%
- setting 15%
- solution 25%
- structural 5%

Thresholds:
- pass: below similarityThreshold
- warning: threshold to threshold+delta
- fail: above threshold+delta

Return JSON:
{
  "status": "pass|warning|fail",
  "overallNovelty": number,
  "mostSimilarSeed": string,
  "highestSimilarity": number,
  "similarityScores": [...],
  "violations": [...],
  "warnings": [...],
  "recommendations": [...],
  "summary": "..."
}
```

## Runtime Gates
- JSON parse required
- similarity values clamped
- overall similarity recomputed from configured weights
- final status recomputed from runtime thresholds
