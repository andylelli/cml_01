# Actual Prompt Record

- Run ID: `run_668d76eb-84ec-44e1-92c8-983847bfe020`
- Project ID: `proj_1b04b300-22bb-4793-9b2c-a2c7829205da`
- Timestamp: `2026-05-29T17:36:43.279Z`
- Agent: `Agent9-AtmosphereRepair-Ch6`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `560`
- Attempt: `first`
- Prompt Hash: `dbcc27283b92188d`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 6 overuses these phrases — provide one fresh alternative for each:
1. "the garden gate at half past ten"
2. "the drawing room between nine and eleven"
3. "face frozen at ten minutes past eleven"
4. "in the drawing room between nine and"
5. "drawing room between nine and eleven o"
6. "near the garden gate at half past"
7. "faint scent of beeswax polish mingled with"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
