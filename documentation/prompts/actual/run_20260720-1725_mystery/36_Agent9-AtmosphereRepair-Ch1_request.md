# Actual Prompt Record

- Run ID: `mystery-1784568348619`
- Project ID: ``
- Timestamp: `2026-07-20T17:38:29.880Z`
- Agent: `Agent9-AtmosphereRepair-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.7`
- Max Tokens: `480`
- Attempt: `first`
- Prompt Hash: `502df588accf1878`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 1 overuses these phrases — provide one fresh alternative for each:
1. "as if she feared being drawn too"
2. "if she feared being drawn too close"
3. "she feared being drawn too close to"
4. "feared being drawn too close to the"
5. "being drawn too close to the heart"
6. "drawn too close to the heart of"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
