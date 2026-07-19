# Actual Prompt Record

- Run ID: `mystery-1784456621907`
- Project ID: ``
- Timestamp: `2026-07-19T10:34:24.524Z`
- Agent: `Agent9-AtmosphereRepair-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `b7f300ad49fbc883`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 3 overuses these phrases — provide one fresh alternative for each:
1. "she would never have left that valve"
2. "would never have left that valve open"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
