# Actual Prompt Record

- Run ID: `mystery-1778790488020`
- Project ID: ``
- Timestamp: `2026-05-14T20:33:54.398Z`
- Agent: `Agent9-AtmosphereRepair-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `560`
- Attempt: `first`
- Prompt Hash: `0a8030ff0499abac`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 2 overuses these phrases — provide one fresh alternative for each:
1. "eleanor felt the weight of their collective"
2. "felt the weight of their collective anxiety"
3. "the weight of their collective anxiety pressing"
4. "weight of their collective anxiety pressing down"
5. "of their collective anxiety pressing down on"
6. "their collective anxiety pressing down on her"
7. "his gravelly voice cutting through the tension"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
