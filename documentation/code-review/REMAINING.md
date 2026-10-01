# The items outside decision 12 — audit and plan (2026-10-01)

A read-only agent re-checked the 64 open ledger items outside decision 12 against current src (~231k tokens, 106 tool
uses). **12 moot, 26 behaviour-preserving (R0/R1), 11 behaviour changes, 15 owner questions.**

**Correction found:** the ledger's "still applies after the v1 deletion" note (written in this programme) was wrong for
five of the six Agent 9 items — A9W-05, A9P-05, A9R-02, A9R-05, A9R-D02 describe deleted v1 code. All 12 moot items are
withdrawn with their evidence in the ledger.

## Plan

1. **R0/R1, small first:** A6-19, A5-14 + ORC-13 (one clue-id module), ORC-15, A7-14, ORC-08 (two importer-less
   modules), A1X-08, SCO-D10, A34-11 (type), SCO-Q03 (stale threshold keys only), A1X-07.
2. **R0/R1, medium:** A6-10 + A7-03 (one CML prompt view, byte-equal), A6-11, A5-09, A7-09 (section builders behind byte
   snapshots), A5-04 / A6-18 / A7-04 (typed case view), A9V-04 (one clue-term matcher, today's policies), A5-06
   (typed gate errors, today's labels), A34-03 (registry to @cml/cml), A1X-09 / ORC-03 (per-call cost), A1X-12, SCO-03.
3. **Behaviour changes:** into the `CML_VERIFIED_FIXES` batch where they are verified defects (A5-D06, A5-D07, A7-07,
   A7-D04); wait for decision 2's flip (A34-02, A1X-01, A6-07, A6-D04, A6-D07); A7-02 step 2; A34-D09 waits on A6-Q01.
4. **Owner questions with no recommendation:** listed in the final report, not decided here.

## STATUS

| Item | Class | Status | Commit | Note |
|---|---|---|---|---|
| A6-19 | a | done | 55448eb5 | Agent 6 imports rubric-score's DEATH_METHOD_TOKENS (was a byte copy) |
| A5-14 | a | done | ecb12773 | CANONICAL_CLUE_ID_RE and escapeRegExp once in @cml/cml |
| ORC-13 | a | done | ecb12773 | clue-id ×5 and escape ×2 → @cml/cml; grade ladder ×3 → calculateGrade; simpleHash ×2 → temporal-anchor (agent1's differs: kept, renamed simp |
| ORC-15 | a | done | 55448eb5 | reportProgress stage, initialHardLogicDirectives and noveltyConstraints typed |
| A7-14 | a | done | ecb12773 | three casts removed |
| ORC-08 | a | done | 55448eb5 | the two importer-less arc/obligation modules deleted; one live formula remains (agent7/world-first.ts) |
| A1X-08 | a | done | 55448eb5 | one month→season table (story-validation); Agent 2d keeps its exact-name lookup and "fall" |
| SCO-D10 | a | done | 55448eb5 | web report type mirrors in_progress, scoring_enabled, phase_thresholds_met |
| A34-11 | a | done | 0ca80a5f | discriminated RevisionResult on a required degraded |
| SCO-Q03 | a/c | todo | | stale threshold keys (a); modes (c) |
| A1X-07 | a | done | ecb12773 | unreachable buildLocationFallback deleted; ignoreAtoms is NOT a no-op (non-Latin room names) — kept |
| A6-10 | a | done | ecb12773 | one CML prompt view (shared/cml-prompt-view.ts) for Agents 6/7/8; per-agent differences kept as policy; 0 diffs / 25,320 |
| A7-03 | a | done | ecb12773 | CaseBrief = projectCaseForPrompt (with A6-10); the A7-D01 fix is behind CML_VERIFIED_FIXES |
| A6-11 | a | done | ecb12773 | derive + render, one formatClueLine; duplicate "Essential Clues" listing left (prompt change) |
| A5-09 | a | done | ecb12773 | buildCluePrompt split into section builders + retry-feedback normaliser; MEASURED 0 diffs / 9,240 comparisons, flag off and on |
| A7-09 | a | done | ecb12773 | section builders, text moved verbatim; the duplicated prose-requirements / pacing rules left (prompt changes) |
| A5-04 | a | done | 0ca80a5f | caseOf/CaseView in @cml/cml; any 241→80 in Agent 5/6 + clue-contracts. Harness normaliser NOT unified: matches production on 0/101 archived  |
| A6-18 | a | done | 0ca80a5f | typed via caseOf (with A5-04); remaining any are the raw payload, feedback objects and client |
| A7-04 | a | done | 87ae5547 | any 151→14; stamps typed; caseOf at 7 unwraps; JS identical but for those. Found: case-read fallbacks disagree; keyTerms/isDeathMethodTell r |
| A9V-04 | a | done | ecb12773 | keyTermHits names the selector's stemmed and the gate's substring rule; thresholds unchanged. Found: tokenMatchesText is not word-bounded |
| A5-06 | a | done | ecb12773 | typed Agent5GateError at 11 sites; every label pinned unchanged (regex fallback for untyped) |
| A34-03 | a | done | ecb12773 | pure locked-fact helpers in @cml/cml; numberToWordsSmall vs spellMinuteCount differ on 0 and 100-999 (not unified) |
| A1X-09 | a | todo | | with ORC-03 |
| ORC-03 | a | todo | | |
| A1X-12 | a | done | ecb12773 | one resolveNoveltyPolicy (identical under fail_delta 0.1); summariser fix is A1X-D03 behind the flag. Remaining clamp/rounding differences r |
| SCO-03 | a | withdrawn | 51f0d14a | MOOT in substance: the 129 pass/partial ternaries were in the vanity scorers deleted by decision 8; the seven honest scorers (~1,000 lines)  |
| A5-D06 | b | done | ecb12773 | behind CML_VERIFIED_FIXES: memo caches invalidated after the remap |
| A5-D07 | b | done | ecb12773 | behind CML_VERIFIED_FIXES: gates read the facts the prompt sent (raw device facts when it sent none) |
| A7-07 | b | done | ecb12773 | behind CML_VERIFIED_FIXES: rescoreNarrative uses scoreNarrativePhase (scene-count gate) |
| A7-D04 | b | done | ecb12773 | behind CML_VERIFIED_FIXES: clue-pacing rescoring on adoption |
| A7-02 | b | done | 0ca80a5f | behind CML_VERIFIED_FIXES: adoptOutlineCandidate at all 10 adoption points (normalise + warn-only schema) |
| A34-D09 | b | done | 0ca80a5f | a degraded/invalid revision is refused in Agent 6's structural retry (an OFF-by-default arm) |
