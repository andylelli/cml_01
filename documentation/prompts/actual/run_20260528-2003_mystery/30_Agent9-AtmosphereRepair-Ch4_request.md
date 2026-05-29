# Actual Prompt Record

- Run ID: `mystery-1779998607579`
- Project ID: ``
- Timestamp: `2026-05-28T20:17:11.280Z`
- Agent: `Agent9-AtmosphereRepair-Ch4`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `560`
- Attempt: `first`
- Prompt Hash: `6fb7acf61a08b994`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 4 overuses these phrases — provide one fresh alternative for each:
1. "in the village from half past ten"
2. "attending to a patient in the village"
3. "a patient in the village from half"
4. "patient in the village from half past"
5. "s stopped time of ten minutes past"
6. "stopped time of ten minutes past eleven"
7. "lips pressed into a thin line"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
