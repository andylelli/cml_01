# Actual Prompt Record

- Run ID: `mystery-1778789193419`
- Project ID: ``
- Timestamp: `2026-05-14T20:14:17.905Z`
- Agent: `Agent9-AtmosphereRepair-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `c1981cf7debf268e`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 3 overuses these phrases — provide one fresh alternative for each:
1. "the kind of motive that could drive"
2. "kind of motive that could drive someone"
3. "of motive that could drive someone to"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
