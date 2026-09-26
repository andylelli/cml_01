# Verified bugs — and which are still live on current code

**Written:** 2026-09-26 · **Method:** each claim re-checked by the coordinating reviewer against the
reviewed snapshot (`dd56e8ae`), then looked up on the latest line (`claude/hopeful-babbage-jime9j`,
444 commits newer) with `git show <ref>:<path> | grep`. No LLM calls, no pipeline runs.

The area reports list about 120 incidental defects between them. This file covers the ~30 with the most
impact on every run or on the reliability of a number. The rest are in each report's §9, with the
reviewer's own evidence and confidence.

**Evidence key:** **code** = the defect is visible in the source at the cited line · **measured** = the
area reviewer reproduced it on built code or archived artifacts · **inferred** = follows from reading.

## Still live on the latest line

| # | Bug | Where (snapshot) | Evidence | Area |
|---:|---|---|---|---|
| 1 | The StoryContract is built from `cml.CAST`, a key the CML does not have: the victim resolves to `fallback_unknown` on every run, and the Story Bible's culprit placement is always empty | `agent9-run.ts:4491` (4 reads of `cml.CAST` on latest) | code + measured (62/62 archived artifacts) | 01, 03 |
| 2 | 11 worker-side regens pass `{...worldState, beatSheet: []}`, so no culprit or mechanism embargo applies to them | `agent9-run.ts` (11 sites on latest) | code | 01 |
| 3 | The `o['']clock` character class holds two straight apostrophes, so a locked time written "eleven o’clock" (curly) is never floor-injected | `agent9-run.ts:1124` | code (bytes) + measured | 01 |
| 4 | Pronoun rule 11 (`castCompositionRule`) is defined but never inserted into the prompt; rules 9–10 are cut by the block cap | `prompt-blocks.ts` (one reference: the definition) | code + measured (40/40 prompts) | 03 |
| 5 | Agent 5 adds the client's running cost total after every call, so any retry double-counts earlier calls | `agent5-run.ts:3496, 3584, 3688, 3776…` | code; cumulative return inferred | 06, 11 |
| 6 | Agent 6.5 discards its retry feedback: the callback's parameter is `_retryFeedback` and is never used | `agent65-run.ts:26` (file unchanged) | code | 07, 11 |
| 7 | Agent 6.5's break-moment picker filters on `member.role`, but the cast carries `role_archetype`, so the detective can be chosen | `agent65-world-builder.ts:731–742` (file unchanged) | code + measured (4 golden casts) | 07 |
| 8 | Agent 7's case summary prints "Victim: Unknown" / "Unknown motive" and lists the culprit as a witness | `agent7-narrative.ts` | code + measured (125/125 archived prompts) | 08 |
| 9 | Agent 3's normaliser still falls back to hard-coded story content (`"Poisoned tea."`); the fix that removed these (A_53 P1) reached Agent 4 only | `agent3-cml.ts:1000` | code | 09 |
| 10 | Any cast member whose archetype contains "victim" — "Friend of the victim" — is forced innocent, overriding the model's "Guilty" | `agent3-cml.ts:~890` (`roleIncludes(…, ["victim"])`) | code + measured | 09 |
| 11 | Agent 2 designates the victim by substring, so "Friend of the victim" can become the victim and the real victim a suspect | `agent2-run.ts:481, 500` | code + measured (probe) | 10 |
| 12 | Agent 8's summary reads legacy CML 1.x paths (`legacy.setup?.crime?.victim`), so every summary says "Victim: Unknown" | `agent8-novelty.ts:~154` | code + measured (14/14 seeds) | 10 |
| 13 | `executeAgentWithRetry`'s abort-on-exhausted-retries is thrown inside a `try` whose `catch` logs "Scoring failed … continuing without retry" and returns, so no phase can abort through it | `shared.ts:~767 / 802` (function unchanged) | code + measured (stub probe) | 11 |
| 14 | 14 artifact saves end in `.catch(() => {})`: a failed write — including the resume checkpoint — leaves no trace | `mystery-orchestrator.ts:1197–1593` (14 on latest) | code | 11 |
| 15 | `ENABLE_SCORING` accepts only the string `"true"`, so `ENABLE_SCORING=1` silently disables scoring | `mystery-orchestrator.ts:918` (latest) | code | 11 |
| 16 | `AGENT2B_VOICE_MAX_RETRIES` has no upper bound; a large value or `Infinity` gives an unbounded LLM regeneration loop | `agent2b-run.ts:99` | code | 11 |
| 17 | The fair-play diagnostic weighs 40/40/20 while the fair-play scorer weighs 35/35/15/15: the same input scores 100 in one and 85 in the other | `agent9-run.ts:5260–5263` | code + measured | 12 |
| 18 | `agent3b-hard-logic` is missing from the scoring thresholds, so with `HONEST_SCORERS=enforce` its pass bar silently drops 85→75 while the report shows 85 | `scoring/thresholds.ts` (file unchanged) | code + measured | 12 |
| 19 | The polish pass rolls back only on Anthropic's `max_tokens`/`refusal`; Azure's `length`/`content_filter` pass through, so a truncated Azure polish is accepted | `post-pass-polish.ts:286`; `llm-client/src/client.ts:401` | code (only when polish runs on Azure) | 05 |
| 20 | Act ratios are clamped individually but never as a sum, so a config inside the bounds can make act 3 negative and hang the scene-count rebalance | `generation-params.ts:1147–1148` (file unchanged) | code; low likelihood | 08 |
| 21 | `prompts-llm` imports `@cml/story-validation` in ~27 files without declaring it — it works only through workspace hoisting | `packages/prompts-llm/package.json` | code | 04, 10 |
| 22 | The flag register is wrong in two places: `CML_REPAIR_MODE` is unregistered, and `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` is listed as default-off while the code defaults on | `architecture/FLAG-AUDIT.md`; `shared.ts:697–705` | code | 09, 12 |
| 23 | `agent2c-run.ts` uses `/s+/g` (the letter s) where `/\s+/g` was meant | `agent2c-run.ts:79` | code; no behaviour impact today | 10 |

## Fixed on the latest line since the snapshot

| Bug | Snapshot | Latest |
|---|---|---|
| Agent 5's AM/PM guard contained literal backspace bytes where `\b` was meant, so it never fired (A5 §9.1) | `agent5-run.ts:1971` | The byte-corrupted regex is gone; the time patterns use proper `\b` |
| `checkLockedFactTimeAlignment` ran before `ctx.cml` was set and always returned nothing (A34 §9.1) | `agent3-run.ts:247` vs `:318` | A second call now runs after the CML is set (`agent3-run.ts:536`) |

## Reported but not re-checked here

Everything else in the area reports' §9 sections. Several were **measured** by the area reviewer and are
worth re-checking first, because they affect prose on every run:

- The season repairer rewrites "broken spring fragment" as "broken autumn fragment" (04).
- The scaffold detector misses 3 of 5 clue-floor shapes and all 3 clearance frames (05); the latest line
  changed `prose-guard` for a different residue, so re-check against current templates.
- 17 of 42 validation message templates are credited to the wrong gate in the report (04).
- `proseSurfacesDeathMethod` passes prose that never names the death (04).
- Stale per-block caps truncate the season-lock rules in every prompt (03).
