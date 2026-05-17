# Actual Prompt Record

- Run ID: `mystery-1779006244131`
- Project ID: ``
- Timestamp: `2026-05-17T08:30:54.080Z`
- Agent: `Agent9-AtmosphereRepair-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.7`
- Max Tokens: `400`
- Attempt: `first`
- Prompt Hash: `6698c4406f4c2f59`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 2 overuses these phrases — provide one fresh alternative for each:
1. "the weight of their shared secrets pressing"
2. "weight of their shared secrets pressing down"
3. "of their shared secrets pressing down on"
4. "their shared secrets pressing down on them"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
