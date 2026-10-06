# Owner decisions — the code-review programme, 2026-09-30

The R1 work that needed no one's decision is done for CR-01–06, 08, 10, 11, 14, 18, 20–22, 24 and 25, and in part
for CR-12, 16, 19 and 33 (README §0). **Update 2026-10-01:** the owner answered the decisions below (STATUS table);
decisions 1 and 3–6 are done, the v1 engine is deleted and its 145 moot items withdrawn. The appendix (generated)
lists what is still open.

This document puts the decisions in the order that unblocks the most. Each has the evidence, the options, one
recommendation and what it releases. The appendix lists all 98 items by CR, generated from
`tools/ledger-state.tsv`, so nothing here is a hand-kept copy of the ledger.

Evidence labels follow CLAUDE.md: **MEASURED** was run this session; **INFERRED** is read from code.

---

## DECIDED 2026-09-30 (owner) — STATUS

The owner answered: **1 (b)** retire v1; **2 (b)** `@cml/cml` with an explicit `role` winning over the archetype;
**3** guard 2b, 2c and 4, leave 5 and 7; **4** make `CASE.death_method` legal; **5** A34-01's four convergences,
one section at a time; **the rest as recommended** (6–11 and §12). Work order is by what each unblocks, cheapest
first; the v1 retirement needs one paid recording, so it waits for its parameters to be approved.

| # | Decision | Status | Commit | Note |
|---|---|---|---|---|
| 4 | `CASE.death_method` a legal clue source | done | 79e6d803 | validator, strict whitelist and prompt agree; replay 5/5 MATCH |
| 3 | JSON guard at 2b, 2c, 4 | done | 79e6d803 | and the YAML fallback made lossless (loadYamlReply) — found applying it |
| 5 | Normaliser convergence, one section at a time | done | d5121540 · c7506ca7 · 37a248bf · 51664c31 | one commit per section; characterisation movement 133 / 167 / 6 / 26+1 rows |
| 6 | Discriminating evidence: ≥2, once, before Agent 6 | done | ec9904b2 | one floor in clue-contracts; the pre-prose gate reads only (it back-filled after the audit in 4/18 run logs) |
| 2 | One role predicate, `role` wins, shadow counter first | shadow | 5aeaf992 | `[identity-disagree]` at 8 sites, CML_IDENTITY_ROLE_WINS OFF; flip after N runs |
| 7 | A6-D01 true cost; delete the phase-score retry path | done | 03c4f5d3 | createRetryCostMeter; executeAndScore scores once; the meter itself went with Agent 6's retry arm (A6-Q01, `a2a0615c`) — nothing charges a retry budget now |
| 8 | `HONEST_SCORERS=enforce`, retire vanity scorers, 35/35/15/15, scorer owns caps, report when scoring off | done | 51f0d14a | honest = old enforce on 4 bundles x 10 phases; weights/caps moot (both copies deleted); 2b/2d/6.5 vanity until SCO-Q07 |
| 9 | One flag vocabulary, warn on anything else | done | 7cb43ad0 | readBooleanFlag (@cml/cml); 11 reads converted; .env.local unaffected |
| 10 | `castGenders` applied after Agent 2; one binary vocabulary | done | 2ad12d6c | applyCastGenders; 25/25 already obeyed, 0/689 non-binary |
| 11 | Refuse a second concurrent run at the API | done | a52a1365 | 409 from run-route.ts; slot freed when the pipeline settles |
| 12 | Owner CRs per §12 | done | `55448eb5`…`0ca80a5f` | CR-07/29 batch behind `CML_VERIFIED_FIXES` (OFF, read = A7-Q05); CR-30 retired; CR-32 override outranks tier; CR-28/34 deferred with reasons — DECISION-12.md |
| 1 | Retire v1 | done | d0f5b078 · 7be508d2 · 43b44336 · fd058f16 · 8631e31b | paid v2 recording (£0.95), fixtures re-based (0 synthetic), engine deleted in three verified stages; 145 v1 ledger items withdrawn as moot, 6 that review moved code stay open |

---

## 1. The v1 engine rule — 147 items wait on it

**Decision.** Does the v1 prose engine (runAgent9's body below the v2 early return, `generateProse`,
`agent9-prose/`) stay bug-fixes-only?

**Evidence.** Since 2026-09-25 v2 is the engine (chapter per call). v1 is still the engine in four of the five replay
fixtures (only `v2-prose-cdad5315` runs v2) and holds most of the review's Agent 9 findings: CR-15, 17, 23, 26, 27 and 31 are 61–100% v1 items.

**Options.**
- (a) Keep the rule. The 147 items stay open until v1 is retired.
- (b) Retire v1: delete the engine behind `PROSE_ENGINE=v1`. Most of the 147 close as moot.
- (c) Lift the rule for R0/R1 moves only; replay pins v1 byte for byte.

**Recommendation: (b), after one matched pair confirms v2 on the v1 fixture's seed.** Keeping over 7,000 lines alive
for bug fixes costs every future change a v1 path to keep compiling. (c) spends effort on code with no future.
Retiring v1 means first rebasing the full-pipeline fixtures (`full-d0ee7b26`, its `-noscore` variant and
`from-clues-d0ee7b26`) onto v2, or they stop replaying.

**Disclosed.** Some v1 files were touched before this rule was set. Unused imports and locals in `generate.ts` and
`agent9-run.ts`, the `BatchCallbackFailure` fix and the `buildRetryPacketFeedback` rename were all replay-proven.
This session added two v1 bug fixes and nothing else:
- SCO-D06: the prose rescore drops the fallback trust cap. One line, `1db19ec1`.
- CANARY_REPLAY_FAIRPLAY_ADVISORY was registered in the flag checker. No v1 code changed (`ec4665c2`).

## 2. One role predicate — A34-02, A1X-01, A1X-Q01 (CR-12)

**Evidence, MEASURED.** `scripts/role-predicate-disagreement.mjs` runs all 2,502 archived cast members through each
old site predicate and the `@cml/cml` one. The members come from 109 Agent 2 casts and 103 CMLs in
`data/store.json`, 137 library cases, and the replay stores. **577 disagreements.**
- Most are the old sites reading `role_archetype` only, while `roleTextsOf` also reads `role`. There the new
  predicate is right: "innocent heiress" with role "victim".
- Some old verdicts are wrong: "Actress and victim's former mentee" is counted as the victim.
- But the new detective predicate also marks members whose `role` is "suspect" as detectives. Examples:
  "Outsider Investigator" and "police inspector, official authority". Agent 9 then never clears them.

**Options.**
- (a) `@cml/cml` as is.
- (b) `@cml/cml`, but an explicit `role` field wins over the archetype.
- (c) Keep the per-site predicates.

**Recommendation: (b).** The `role` enum is the one field that answers the question (X50). It fixes the "Outsider
Investigator" class and keeps the gains. Ship it behind a shadow counter (`[identity-disagree]`, A1X-01) for N runs,
then flip.

**Releases:** A34-02, A1X-01 step 2, A6-07 (the suspect list), A6-D04, A9W-04, A9R-04.

## 3. The JSON guard at the unguarded boundaries — ORC-Q03, A34-D07, A9V-Q06 (CR-20)

**Evidence, MEASURED.**
- Unguarded, jsonrepair turns text that is not JSON into a value: prose becomes a string, YAML becomes an array.
  That value then fails a shape check with the wrong error.
- **At Agent 4 a well-formed YAML reply of a valid CML degrades.** jsonrepair's array means the YAML fallback never
  runs (`agent4-revise-characterisation`, "a YAML reply"). Agent 3 is guarded, so its fallback works.
- The guard reads only the tail character, so a payload cut just after an inner `}` passes it.

**State.** Each boundary is now one word: `parseLlmJson(raw, { guard })`. The unguarded boundaries are 2b, 2c, 4, 5
and 7, plus the v1 prose parser.

**Recommendation: guard 2b, 2c and 4 now; leave 5 and 7.**
- Agent 5 flags truncation itself and retries.
- Agent 7 refuses on `finishReason` first.

Then decide separately whether the guard should check the parsed shape rather than the tail character.

**Cost.** A payload repaired today would be refused and retried: one extra call, only when the model truncates.

## 4. Is `CASE.death_method` a legal clue source? — A5-Q01, A5-D03 (CR-16)

**Evidence, MEASURED in the review.** The Agent 5 prompt demands a clue sourced at `CASE.death_method` (A_67 FIX-2).
The worker's validator rejects that path and rewrites the clue to `steps[0].observation`. In all four golden bundles
the tell never sits on `death_method`.

**State.** It is one field now: `workerLegal` in `@cml/cml` `source-paths.ts` (`ec47208f`).

**Recommendation: make it legal.** That was FIX-2's intent. The prompt and the validator stop contradicting each
other on every run.

## 5. The two CML normalisers' divergent defaults — A34-Q01, A34-D16, A34-D05 (CR-14)

**State.** Both normalisers now sit side by side in `cml/normalize.ts` as two profiles. A characterisation snapshot
covers 137 library cases plus 8 kinds of damage. **23 of 25 probed fields still differ** (A34-01's table).
Examples:
- Agent 3 defaults a missing mechanism to "Poisoned tea." — a phrase its own prompt bans.
- Agent 3 drops the schema's `role` and `moral_complexity` on every run (A34-D16).
- Its last-resort culprit can be the detective (A34-D05).

**Recommendation (A34-01's):**
- neutral defaults;
- preserve schema fields;
- case-insensitive enums;
- culprit integrity on both paths.

Do it one section at a time. The snapshot shows exactly what each convergence moves.

## 6. One discriminating-evidence policy — A5-Q05 (CR-16)

**Evidence.** Three policies rewrite `discriminating_test.evidence_clues`:
- "≥1 only when empty" (Agent 5);
- "back-fill to 3" (the pre-prose gate);
- "≥2" (Agent 9).

The field changes after the fair-play audit has read it.

**State.** The scoring behind all three is now one function (`04e0bc58`).

**Recommendation:** ≥2, applied once, before Agent 6 audits the case. Later stages then read it and never write it
(ADR-0005).

## 7. Retries and cost — A6-D01, SCO-Q02, ORC-Q01 (CR-19, CR-18)

**Evidence.**
- Agent 6's retry budget never charges the first retry of each cost source (A6-D01).
- Per-call cost on `ChatResponse` (CR-19) would fix that, and would therefore make some runs abort that pass today.
- Separately, phase-score retries are off by default (`AGENT_PRE9_ENABLE_LLM_RETRIES`), and their abort path is
  unreachable (ORC-11).
- **Premise found false this session:** the ledger said per-agent costs were correct since CR-06. They were not for
  2b, 2c, 2d, 2e and 3b: `withValidationRetry` summed running totals. Fixed in `07898bd0`; telemetry only.

**Recommendation.**
- Take A6-D01, charging the true cost. The budget then means what its number says.
- Delete the phase-score retry path and its abort (ADR-0003), rather than restoring it. It has not run at default
  since the deterministic mode.

**Releases:** CR-19's core, SCO-08, SCO-Q02, ORC-Q01, A6-Q01, A5-Q06.

## 8. Scoring honesty — SCO-Q01, SCO-Q06, SCO-07, SCO-Q08 (CR-18, CR-30)

**Evidence.** The vanity scorers are about 3,400 lines. `HONEST_SCORERS` has run in shadow.
- The fair-play diagnostic weights 40/40/20; the scorer weights 35/35/15/15. MEASURED: 100 against 85 on one input.
- The trust cap is 88 in the adapter and 85 in the scorer.
- The expected clue set is derived three ways.

**Recommendation.**
- Promote `HONEST_SCORERS=enforce` and retire the vanity scorers (CR-30).
- 35/35/15/15 everywhere.
- The scorer's table owns the caps.
- Write the report when scoring is off (SCO-Q08). The run's raw flag record (`2d009a33`) already writes regardless.

## 9. Flag vocabularies — ORC-Q05 (CR-22)

**State.**
- Every run now records the raw flag environment it saw, in `logs/run-config-<runId>.json` and the report's
  `run_config`. The names are generated and checked by `flags:check`.
- The worker's two boolean idioms are one helper each.
- **Still eight vocabularies.** Examples: `AGENT7_STRUCTURED_OUTPUT=on` reads OFF, and some flags accept `y` where
  others do not.

**Recommendation.** One vocabulary: `1|true|yes|on` and `0|false|no|off`. Log a warning on any other value. The raw
record makes the change auditable run by run.

## 10. Gender — A1X-Q03, the Agent 2 re-roll (CR-12, CR-21)

**Evidence.**
- Agent 2's schema-repair re-roll has never passed the user's `castGenders`. It is now an explicit
  `characterGenders: undefined`.
- `designCast` normalises gender to binary; the worker's `normaliseCastOutput` still accepts "non-binary".

**Recommendation.**
- Apply `castGenders` deterministically after Agent 2 (A1X-Q03).
- One binary vocabulary, as the rest of the pipeline already assumes (A_73 §40).

## 11. Concurrency — ORC-Q06 (CR-33)

**State.** The shutdown flush is now per run (`ba1b5496`). The API still starts a run per request with no guard. A
timed-out run keeps executing in the background, and the prose repair counters are module state (v1).

**Recommendation: refuse a second concurrent run at the API.** Making the pipeline concurrency-safe means reaching
the v1 module state (decision 1).

## 12. The six owner CRs

| CR | Decision | Recommendation |
|---|---|---|
| CR-07 | 19 verified live bugs whose fix changes a prompt, chapter or outcome (VERIFIED-BUGS #1–4, 6–13, 19) | Batch the ones in non-v1 agents behind one flag and read one matched pair |
| CR-28 | Token budget: cap STORY TO DATE, fix stale block caps, stop sending facts 2–10× | Decide STORY TO DATE first (A9P-Q01); it decides whether the rest matters. v1 (decision 1) |
| CR-29 | Failure-aware retries; polish that respects the validators | Follows decision 7 |
| CR-30 | Retire or restore: vanity scorers, unreachable retry path, patch engine, unwired modules | Retire all four (decisions 7 and 8; the patch engine after its offline replay, A34-Q03) |
| CR-32 | Model routing: design model silences per-agent overrides; Agents 1, 4, 6 routing | Per-agent overrides outrank the tier (ORC-Q07) |
| CR-34 | Avoidable LLM calls | After CR-29 |

## 13. Not started — stopped here at your request

These are R1 and need no decision. They were not started because the session stopped after CR-16:
- **CR-16:** DONE 2026-09-30 (`12131e7c`, `6d13cdf7`, `9af9b5fd`). Three R2 findings came out of it, now in
  the appendix: A6-04 (WP8A's backstop-first ordering differs from the pre-LLM one in 65/65 planted cases),
  A5-08's remainder, A6-D09.
- **CR-13:** typed case view — 8 non-v1 items.
- **CR-17:** season, arc position and locked facts — 8 non-v1 items.
- **CR-27:** 4 non-v1 items.
- **CR-31:** 5 non-v1 items.

---

## Appendix — every open owner item

<!-- GENERATED by documentation/code-review/tools/owner-decisions-appendix.mjs from tools/ledger-state.tsv; do not edit by hand -->

**0 open items.**
