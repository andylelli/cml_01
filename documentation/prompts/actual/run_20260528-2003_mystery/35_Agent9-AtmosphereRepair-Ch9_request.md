# Actual Prompt Record

- Run ID: `mystery-1779998607579`
- Project ID: ``
- Timestamp: `2026-05-28T20:17:24.997Z`
- Agent: `Agent9-AtmosphereRepair-Ch9`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `1040`
- Attempt: `first`
- Prompt Hash: `aa10a351d5327456`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 9 overuses these phrases — provide one fresh alternative for each:
1. "in the village from half past ten"
2. "attending to a patient in the village"
3. "a patient in the village from half"
4. "patient in the village from half past"
5. "the village from half past ten to"
6. "village from half past ten to a"
7. "from half past ten to a quarter"
8. "half past ten to a quarter to"
9. "past ten to a quarter to midnight"
10. "s stopped time of ten minutes past"
11. "stopped time of ten minutes past eleven"
12. "scent of beeswax polish mingled with the"
13. "lips pressed into a thin line"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
