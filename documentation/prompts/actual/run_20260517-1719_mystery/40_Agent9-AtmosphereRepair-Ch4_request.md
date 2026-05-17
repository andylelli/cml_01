# Actual Prompt Record

- Run ID: `mystery-1779038378456`
- Project ID: ``
- Timestamp: `2026-05-17T17:27:36.545Z`
- Agent: `Agent9-AtmosphereRepair-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `42bd45da6a98a9c0`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 4 overuses these phrases — provide one fresh alternative for each:
1. "if you know something that could help"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
