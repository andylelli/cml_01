# Agent 2e - Background Context Prompt Analog (Runtime-Equivalent)

Source of truth: `packages/prompts-llm/src/agent2e-background-context.ts`

## Message Stack Actually Sent
1. `system`: combined `system + "\n\n" + developer`
2. `user`: background-context request

## System Prompt (Verbatim)
```text
You are a narrative grounding specialist for Golden Age mystery design.
Generate a concise, canonical background-context artifact that explains why this cast is here, what social backdrop binds them, and how setting context should shape scene grounding.
Output valid JSON only.
```

## Developer Prompt Analog (Runtime-Equivalent)
```text
Return JSON exactly:
{
  "status": "ok",
  "backdropSummary": "...",
  "era": {"decade": "...", "socialStructure": "..."},
  "setting": {"location": "...", "institution": "...", "weather": "..."},
  "castAnchors": ["..."],
  "theme": "..."
}

Requirements:
- backdropSummary is one concise sentence
- socialStructure includes class/institution pressure
- castAnchors contains 4-8 existing cast names only
- no mechanism design, culprit hints, or hard-logic details
- retry feedback block when present: {{validationFeedback}}
```

## User Prompt Analog (Runtime-Equivalent)
```text
Generate background context for this mystery setup.

Theme: {{themeOrDefault}}
Tone: {{toneOrDefault}}
Era decade: {{eraDecade}}
Social norms: {{socialNorms}}
Location description: {{locationDescription}}
Institution type: {{institutionType}}
Weather: {{weather}}
Mood: {{mood}}
Geographic isolation: {{geographicIsolation}}
Access control: {{accessControl}}

Cast anchors (exact names only):
{{castAnchorsNumbered}}

Return JSON only.
```

## Runtime Gates
- `withValidationRetry(...)` schema loop for `background_context`
- required checks: `status=ok`, non-empty `backdropSummary`, non-empty `castAnchors`
