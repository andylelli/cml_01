# Actual Prompt Record

- Run ID: `mystery-1779913343560`
- Project ID: ``
- Timestamp: `2026-05-27T20:33:35.507Z`
- Agent: `Agent9-AtmosphereRepair-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `720`
- Attempt: `first`
- Prompt Hash: `6066b58cd9fd8ce9`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 1 overuses these phrases — provide one fresh alternative for each:
1. "appearances often veil more than they reveal"
2. "reversed wear marks and an oil stain"
3. "wear marks and an oil stain on"
4. "an oil stain on the escapement lever"
5. "one must always remember that appearances often"
6. "must always remember that appearances often veil"
7. "always remember that appearances often veil more"
8. "remember that appearances often veil more than"
9. "that appearances often veil more than they"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
