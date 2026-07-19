# Actual Prompt Record

- Run ID: `mystery-1784456621907`
- Project ID: ``
- Timestamp: `2026-07-19T10:34:35.022Z`
- Agent: `Agent9-AtmosphereRepair-Ch8`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `27e9b8f5e2d9ac1a`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 8 overuses these phrases — provide one fresh alternative for each:
1. "the faint imprint of a gloved hand"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
