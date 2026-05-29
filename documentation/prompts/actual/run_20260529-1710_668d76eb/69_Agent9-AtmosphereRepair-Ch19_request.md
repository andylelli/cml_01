# Actual Prompt Record

- Run ID: `run_668d76eb-84ec-44e1-92c8-983847bfe020`
- Project ID: `proj_1b04b300-22bb-4793-9b2c-a2c7829205da`
- Timestamp: `2026-05-29T17:37:15.236Z`
- Agent: `Agent9-AtmosphereRepair-Ch19`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `496ab95530a65f38`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 19 overuses these phrases — provide one fresh alternative for each:
1. "the garden gate at half past ten"
2. "face frozen at ten minutes past eleven"
3. "near the garden gate at half past"
4. "the scratch marks on the winding key"
5. "lips pressed into a thin line"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
