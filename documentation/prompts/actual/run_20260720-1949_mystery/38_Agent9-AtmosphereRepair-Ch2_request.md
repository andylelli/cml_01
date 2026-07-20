# Actual Prompt Record

- Run ID: `mystery-1784576986525`
- Project ID: ``
- Timestamp: `2026-07-20T20:03:19.706Z`
- Agent: `Agent9-AtmosphereRepair-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `4cc99361c59c944d`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 2 overuses these phrases — provide one fresh alternative for each:
1. "seen alive at a quarter past twelve"
2. "high tide at ten minutes past twelve"
3. "on the landing at a quarter past"
4. "the landing at a quarter past twelve"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
