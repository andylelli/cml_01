# Actual Prompt Record

- Run ID: `mystery-1778792031869`
- Project ID: ``
- Timestamp: `2026-05-14T21:02:51.421Z`
- Agent: `Agent9-AtmosphereRepair-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `afce7d9d4bf300f8`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 4 overuses these phrases — provide one fresh alternative for each:
1. "s betrayal loomed large in her mind"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
