# Actual Prompt Record

- Run ID: `mystery-1779913343560`
- Project ID: ``
- Timestamp: `2026-05-27T20:33:38.737Z`
- Agent: `Agent9-AtmosphereRepair-Ch2`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `640`
- Attempt: `first`
- Prompt Hash: `5ad0d68580db08cf`

## Message 1 (role=system)

```text
You are a prose variety assistant for mystery fiction. You will be given a list of overused phrases. For each phrase provide one fresh, scene-specific alternative of similar length and register. Output JSON only — no explanation, no prose outside the JSON.
```

## Message 2 (role=user)

```text
Chapter 2 overuses these phrases — provide one fresh alternative for each:
1. "appearances often veil more than they reveal"
2. "one must always remember that appearances often"
3. "must always remember that appearances often veil"
4. "always remember that appearances often veil more"
5. "remember that appearances often veil more than"
6. "that appearances often veil more than they"
7. "between quarter past ten and quarter to"
8. "quarter past ten and quarter to eleven"

Return exactly this schema (one entry per phrase, same order):
{"replacements":[{"original":"...","replacement":"..."}]}
Only return the JSON payload.
```
