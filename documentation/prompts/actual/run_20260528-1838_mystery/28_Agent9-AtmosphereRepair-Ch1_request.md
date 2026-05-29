# Actual Prompt Record

- Run ID: `mystery-1779993526746`
- Project ID: ``
- Timestamp: `2026-05-28T18:52:24.672Z`
- Agent: `Agent9-AtmosphereRepair-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `2dc7221103673c4d`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 1 overuses these phrases — provide one fresh alternative for each:
1. "the household runs smoothly when every cog"
2. "household runs smoothly when every cog does"
3. "showed quarter past three when the body"
4. "quarter past three when the body was"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
