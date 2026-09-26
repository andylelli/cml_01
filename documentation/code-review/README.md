# Code review — the agent code

**Written:** 2026-09-25 → 2026-09-26 · **Type:** a full refactoring audit of the pipeline's agents — how to
make the code cleaner and more efficient without changing what it does, and, where a behaviour change is the
right call, how to route it through ADR-0004 / ADR-0011. **Status: complete.**

**Scope:** 12 areas, 153 files, 73,556 lines (55,303 code lines), every line read against one
[RUBRIC](RUBRIC.md). **Companions:** [`areas/`](areas/) (the twelve reports, 190 findings) ·
[VERIFIED-BUGS.md](VERIFIED-BUGS.md) · [`data/`](data/) (the measured baseline) · [`tools/`](tools/)
(re-runnable metrics).

---

## Read this first: which code was reviewed

**Snapshot: commit `dd56e8ae`** (`main`, 2026-08-26). The review ran on a checkout of `main`, which was
444 commits behind the live line. Since the snapshot the audited scope has changed by **162 files,
+21,529 / −798 lines, 93 new files** — mostly the Agent 9 v2 engine; `agent9-run.ts` is now 8,827 lines
(7,602 reviewed).

- Very little reviewed code was deleted, so **most findings should still apply** —
  [VERIFIED-BUGS.md](VERIFIED-BUGS.md) re-checked 25 of the highest-impact ones on the latest line:
  **23 still live, 2 fixed**.
- **Line numbers have shifted**; search for the quoted code, not the line.
- **The Agent 9 v2 engine was not reviewed.**
- Execute the plan below on current code. The branches are consolidated: `main` contains the live line
  (2026-09-26). The findings are taken as they stand; no second verification pass is planned.

---

## 0. Tracker

**Progress: 3 / 34** · Last updated 2026-09-26 · `todo` · `wip` · `done` · `👤` owner decision

Each item names its headline findings. **[LEDGER.md](LEDGER.md) assigns every one of the 401 items** — 190
findings, 139 incidental defects, 72 owner questions — to exactly one row here, and carries its status and
commit. It is generated: edit `tools/ledger-state.tsv`, then run `node documentation/code-review/tools/build-ledger.mjs`
(`--check` fails on drift or an unassigned item). Standalone §9 defects go to CR-06 (cannot change prose) or
CR-07 (can). Its decision sheet lists the open questions in CR order. The area reports are authoritative on
*how*, this table on *state*. Risk: **R0** mechanical · **R1** behaviour-preserving, needs a characterisation check · **R2**
behaviour change, flag + probe per ADR-0004/0011.

| ID | Status | Phase | Task | Findings | Risk | Effort |
|---|---|---|---|---|---|---|
| CR-01 | done | 0 | Run the existing suites in CI; make the 3 environment-specific tests portable — `.github/workflows/ci.yml`; 4 Linux-only failures fixed; fresh-clone Linux run 5,146 tests green (`b794b376`) | — | R0 | S |
| CR-02 | todo | 0 | Size/complexity ratchet in `pretest` (no file or function may grow past its baseline) | A9W-19 | R0 | S |
| CR-03 | todo | 0 | **Record/replay harness**: golden bundle + recorded LLM responses → byte-identical prompts and outputs for `runAgent9`, `generateProse`, `generateMystery` | A9W-15, SCO-12 | R0 | M–L |
| CR-04 | done | 0 | Declare the undeclared dependencies (`prompts-llm` → `@cml/story-validation`, `js-yaml`) — 7 found by `npm run deps:check`, all declared; lockfile no longer needs a Font Awesome token (`fc6f52c7`) | A9V, A1X-D13 | R0 | S |
| CR-05 | done | 1 | Verify the highest-impact bugs on the latest line | [VERIFIED-BUGS.md](VERIFIED-BUGS.md) | — | — |
| CR-06 | todo | 1 | Fix the verified live bugs that cannot change prose (cost double-count, silent `.catch(()=>{})`, `ENABLE_SCORING=1`, uncapped retries, fair-play weights, thresholds, act-ratio check, flag register, `/s+/g`) | VERIFIED-BUGS #5, 14–18, 20, 22, 23 | R0/R1 | M |
| CR-07 | 👤 | 1 | Decide the verified live bugs whose fix changes a prompt, a chapter or a run outcome (`cml.CAST`, embargo on worker regens, curly-apostrophe floor, pronoun rule 11, Agent 6.5 feedback, Agent 7/8 case summaries, "Poisoned tea.", victim substring, abort swallow, Azure polish) | VERIFIED-BUGS #1–4, 6–13, 19 | R2 | M |
| CR-08 | todo | 2 | Delete compiler-proven dead code across the scope | A9W-14, A9G-12, A9V-13, A9R-11, A9P-16, A5-13, A34-13, ORC-09, SCO-11 | R0 | M |
| CR-09 | todo | 2 | Agent 9 helper layer (3,645 lines) → 12 modules behind re-export shims | A9W-12 | R0 | M |
| CR-10 | todo | 2 | Split `shared.ts`; break the type-only import cycles | ORC-06, A1X-13 | R0 | M |
| CR-11 | todo | 2 | Replace the root barrel with subpath exports (215 of 362 names never imported through it) | ORC-10 | R0 | S |
| CR-12 | todo | 3 | **One identity module**: victim / suspect / detective / culprit predicates (9 + 5 + 8 bodies today) | A9W-04, A1X-01, A34-02, A9R-04, A6-07 | R1→R2 | M |
| CR-13 | todo | 3 | **One typed case view** (`CaseData = any` today) and one `CaseBrief` for prompt summaries | A5-04, A7-03, A6-10, A6-18, A9P-13, A9W-05 | R1 | L |
| CR-14 | todo | 3 | **One CML normaliser** (two today, 185 identical lines, 23/25 fields diverge) | A34-01 | R1→R2 | L |
| CR-15 | todo | 3 | **One failure vocabulary**: typed issue codes instead of message strings re-classified by 11+ regexes | A9V-01, A9G-04, A5-06 | R1→R2 | L |
| CR-16 | todo | 3 | **One clue contract**: source paths, evidence namespace, matcher (gate vs scorer), synthesis | A5-02, A5-03, A5-08, A6-09, A9V-04, SCO-06 | R1→R2 | L |
| CR-17 | todo | 3 | One body each for season, arc position, locked facts, Story Bible facts | A9V-05, ORC-08, A7-13, A9G-09, A34-03, A9P-01, A9W-02/03 | R1→R2 | L |
| CR-18 | todo | 3 | One scoring engine; one run-outcome module; one threshold resolver | SCO-02, SCO-04, SCO-05, SCO-07 | R1 | M |
| CR-19 | todo | 3 | One definition of "cost of a call" | ORC-03, A1X-09, A5 §9.2 | R1 | M |
| CR-20 | todo | 4 | **`callLlmJson()`**: one parse ladder with one truncation policy for all 31 LLM call sites | ORC-04, A1X-03, A34-06 | R1 | M |
| CR-21 | todo | 4 | **`runStage()`** over `executeAgentWithRetry` for the 9 runners that fork on scoring | ORC-02, A1X-02 | R1 | M–L |
| CR-22 | todo | 4 | **`RunConfig`**: 82 env flags resolved once at run start, written into the report | ORC-05, A9G-08, A9P-14, A7-08 | R1 | M |
| CR-23 | todo | 4 | One regen runner and one chapter-rewrite engine (wrapper ×10, skeleton ×13, engines ×5) | A9W-06, A9R-01, A9R-05, A9R-06, A7-02 | R1 | L |
| CR-24 | todo | 5 | Decompose `runAgent7` (8 shared bindings — the cheapest, do first) and `runAgent3/3b` | A7-01, A34-04, A34-12 | R0→R1 | M |
| CR-25 | todo | 5 | Decompose `runAgent5`, `runAgent6`, `generateMystery` over explicit state | A5-01, A6-01, ORC-01 | R1 | L |
| CR-26 | todo | 5 | Decompose `generateProse` (74 outer variables) and `runAgent9` (78) — after CR-03 | A9G-01, A9W-01, A9G-05 | R1 | L |
| CR-27 | todo | 5 | Prompt builders and linter as tables: block interface, obligation block, `lintBatchProse` rule table, declarative scorers | A9P-02, A9P-05, A9P-06, A9V-02, SCO-03 | R1 | L |
| CR-28 | 👤 | 6 | Token budget: cap STORY TO DATE; fix the stale block caps; stop sending facts 2–10× | A9P-03, A9P-04, A9P-07, A9P-08, A9G-16 | R2 | M |
| CR-29 | 👤 | 6 | Failure-aware retries and polish that respects the validators | A6-02, A6-03, A5-11, A9R-03, A9R-08, A9G-06, A9G-07 | R2 | M |
| CR-30 | 👤 | 6 | Retire or restore: vanity scorers (−3,400), unreachable retry path (−1,050), patch engine (−560), unwired modules (−400) | SCO-01, A9G-03, A34-05, A9P-15 | R2 | S each |
| CR-31 | todo | 3 | **One body per detector**: floor templates vs the recognisers that should find them; clearance, disclosure, death-method, opening and leak predicates; the vocabulary/regex copies | A9R-02, A9V-03/06/07/08/09/10, A9W-07/09/11, A6-19, ORC-13 | R1→R2 | L |
| CR-32 | 👤 | 1 | Model routing: an explicit design model silences per-agent overrides; the clue regen runs on the prose tier; Agents 1, 4 and 6 routing | ORC-14, A9R-10, A9G-D02, A1X-D06, A34-D13 | R2 | S |
| CR-33 | todo | 4 | Per-run telemetry: one run-scoped store instead of module singletons; every floor, repair and fallback counted into the report; concurrent runs | ORC-12, A9R-07, A6-15, A7-11 | R1 | M |
| CR-34 | 👤 | 6 | Avoidable LLM calls: deterministic checks that could replace a call, re-validation that re-pays semantic fallbacks, independent calls made in sequence | A6-16, A9W-17 | R2 | M |

---

## 1. The verdict

> **The agent code is not badly written line by line — it is organised by accretion.** Six functions
> over 1,000 lines hold 22% of all function code, and they are exactly the six that no unit test reaches
> (0% coverage). Around them, almost every concept the pipeline depends on — who the victim is, what a
> clue's source is, whether a suspect is cleared, what a chapter's arc position is, what a call cost —
> exists in two to nine hand-written bodies that have already drifted apart. The prior audits'
> conclusion holds here too: **duplication is the defect class.** Most of the 23 live bugs in
> [VERIFIED-BUGS.md](VERIFIED-BUGS.md) are one copy of a concept that was fixed while another was not.

The single most valuable change is not a refactor at all: **CR-03, a record/replay harness** that runs the
orchestration functions offline against recorded LLM responses and fails on any byte of prompt drift.
Without it, every R1 change to the 0%-coverage functions can be proven only by a paid run; with it, the
whole plan below becomes mechanical.

## 2. The numbers (MEASURED on the snapshot)

| | |
|---|---|
| Agent scope | 126 files, 65,284 lines, 49,258 code lines, 3,732 functions ([metrics](data/metrics.md)) |
| Mega-functions | 15 over 500 lines hold 36% of top-level function lines; 6 over 1,000 hold 22% |
| Largest | `runAgent9` 3,957 lines, cyclomatic 605 · `generateProse` 2,661, cc 350 · `generateMystery` 1,164, cc 160 |
| Shared state inside them | `runAgent9` 78 cross-phase bindings · `generateProse` 74 · `generateMystery` 35 · `runAgent6` 30 · `runAgent5` 17 · `runAgent7` 8 |
| Unit coverage | 52% of statements overall; **0%** for `runAgent9`, `generateProse`, `generateMystery`, `runAgent5`, `runAgent7`, `runAgent3` ([coverage](data/coverage.md)) |
| Types | 1,635 explicit `any`, 1,273 casts (`strict` is on — every one is a choice) |
| Literal duplication | 3.58% repo-wide ([duplication](data/duplication.md)) — low; the duplication that matters is semantic |
| Dead code | small: ~360 lines unreferenced; 190 exports used only in their own file ([export usage](data/export-usage.md)) |
| Growth | agent code 5.7× in six months; `agent9-run.ts` ~+1,000 lines/month to July, and S4's split lost to it ([history](data/history.md)) |
| Guards | no CI (added by CR-01), no linter; ~3,175 tests, 3 fail only on a fresh Linux checkout |
| Coupling | the `prompts-llm` barrel is edited in 68% of the commits that touch `agent9-run.ts` |

## 3. What the twelve areas have in common

**T1 — Mega-functions over hidden state.** Every large runner is one closure whose phases share dozens of
variables (§2). The phases are real and nameable; the obstacle REVIEW_03 named ("threading ~100 closure
variables") is measured and mostly smaller than feared — `runAgent7` has 8. Decompose into a short
coordinator over typed state objects, cheapest first (CR-24 → CR-26).

**T2 — Two bodies of one concept.** The CML normaliser ×2 (23/25 fields diverge; A_53's fix reached one);
victim/detective predicates in 9 + 5 + 8 places; "suspect cleared" ×5; clue source paths ×5; clue matchers
gate vs scorer; season detector vs repairer ("broken spring fragment" → "broken autumn fragment"); arc
position ×7 with 4 formulas; fair-play weights ×2 (100 vs 85 on one input); failure vocabularies ×4 read by
11 classifiers; the CML case summary ×6; floor templates vs the recognisers that should find them. Each merge
is defect-class removal (CR-12 → CR-19).

**T3 — The untyped boundary.** `CaseData = any` and LLM JSON flowing untyped into logic cause most of the
`any` and most of the "read the old path and the new path" code. Four parse ladders, three truncation
policies; the shared `guardedJsonrepairParse` has no production caller, and four boundaries have no
truncation guard (CR-13, CR-20).

**T4 — No shared stage skeleton.** Call → parse → validate → retry → score → cost → persist exists as 14
hand-written variants; the scoring fork ×9; the regen wrapper ×10 and its skeleton ×13; five chapter-rewrite
engines; retry feedback reaches prompts through six channels (CR-20 → CR-23).

**T5 — Feedback that ignores the failure** (where the money goes). Agent 6's retry feedback carries none of
the violations to Agent 5 (0 of 12 lines); Agent 6.5 discards its feedback; retries drop the locked facts;
regen retries resend a byte-identical prompt; the polish prompt tells the model to cut the words the
validators require; ~1,050 lines of retry escalation never run at the live budget. The HANDOVER §5.4 defect
was one instance of a pattern (CR-29, CR-30).

**T6 — The prompt budget.** STORY TO DATE (the full text of every prior chapter) sits outside the budget and
reaches ~59% of the chapter-10 prompt; it is what forces other blocks out. Stale caps cut three blocks in
every prompt, facts are rendered 2–10×, one contract twice, and budget drops defeat the R8 prefix cache
(CR-28).

**T7 — Numbers that are not what they say.** Default scorers grade adapter-padded data (A in 36/36 golden
cells) while the honest ones sit behind a flag; per-agent cost double-counts on every retry; `ENABLE_SCORING=1`
means off; `executeAgentWithRetry` swallows its own abort; the flag register has wrong defaults; 17 of 42
validation messages are credited to the wrong gate. Measurement is the project's discipline, so these rank
high even when small (CR-06, CR-15, CR-18, CR-19, CR-22).

**T8 — Nothing stops regrowth.** No CI, no linter, no size budget; the orchestration functions are exercised
only by paid runs (CR-01 → CR-03).

**CPU is not a lever.** Measured where it mattered: lint ~31 ms per call (~2 s per run), the clue-evidence
matcher ~0.2 s per call. Against LLM latency, negligible — every efficiency gain worth having is in T5/T6.

## 4. How much it removes

The area reviewers' estimates for their P1+P2 findings on the R0/R1 path sum to **roughly 11,000 lines
(~15% of the audited 73,556)** — an upper bound, since some cross-area items (cost, case summary, identity)
are counted in more than one report. Owner decisions (CR-30) could remove up to ~5,400 more. The larger win
is shape: the largest function goes from cyclomatic 605 to ~40, and no function stays above ~400 lines.

## 5. How to prove each step safe

| Risk | Evidence before merge |
|---|---|
| R0 | typecheck · all suites · `build:all` · `preflight-dist-check` · re-run [`tools/agent-metrics.mjs`](tools/) and confirm the ratchet moved the right way |
| R1 | R0 plus a characterisation check: CR-03's replay produces byte-identical prompts and outputs on the golden bundles, before and after |
| R2 | ADR-0004 / 0011: behind a flag, default off, promoted on a probe; a deletion needs its counter at zero or a negative probe |

REVIEW_01's warning applies doubly to a refactor: *"green tests, stale dist"* — a pure refactor produces no
behaviour change to notice if the worker is running yesterday's `dist/`.

## 6. What not to do

- **Don't collapse the fixed stage order** into an agent loop (ADR-0002). A data-driven stage table keeps
  the order and removes the 1,164-line function.
- **Don't remove the deterministic floors** (ADR-0003/0007) — make them share one body and one recogniser.
- **Don't delete flag branches, scorers or passes on belief** (ADR-0011) — that is CR-30's job, with evidence.
- **Don't force Agents 2b–2e into one template where they genuinely differ** (area 10 §8).
- **Don't move prompt text unless the bytes are identical** — CR-03 is the check.
- **Don't chase CPU.**

## 7. Relationship to the existing boards

- **S4** (split `agent9-run.ts`): superseded by CR-09 + CR-26, with the growth guard CR-02 that S4 lacked.
- **S3** (regen registry): done, but it never reached the worker's 11 hand-written passes (A9R-01) — CR-23.
- **S6** (extract `agent9-prose/`): still the owner's decision; new evidence — 67 forward edges (16 dead,
  25 type-only), a fourth back-edge, and the barrel co-change figure above (A9G-15, ORC-10).
- **S7** (retire coercion sites): its blocker is gone (A7-11), but the counters cover 2 of ≥15 sites — add
  per-site counters before deleting anything.
- **CODE-AUDIT-BACKLOG §3** (the two-body sweep): this audit is that sweep for the agents; T2 is the result.

## 8. Area reports

| Area | Headline |
|---|---|
| [01 — Agent 9 worker](areas/01-agent9-worker.md) | `runAgent9` as a coordinator over ~14 phases; `cml.CAST`; 11 regens without the embargo |
| [02 — Agent 9 generation core](areas/02-agent9-generation.md) | ~1,050 lines of retry escalation unreachable at the live budget; `generateProse` depends on 74 outer variables |
| [03 — Agent 9 prompts](areas/03-agent9-prompts.md) | STORY TO DATE outside the budget; stale caps truncate pronoun and season rules in every prompt |
| [04 — Agent 9 validation](areas/04-agent9-validation.md) | Issues flattened to strings and re-classified (17/42 misattributed); `lintBatchProse` is ~21 rules |
| [05 — Agent 9 repair & polish](areas/05-agent9-repair.md) | Polish fights the validators; the regen registry is read only by tests |
| [06 — Agent 5 clues](areas/06-agent5-clues.md) | Five diverged copies of the legal clue source paths; seven writers of `evidence_clues` |
| [07 — Agents 6 & 6.5](areas/07-agent6-fairplay-worldbuilder.md) | Failure-agnostic retry feedback in both agents; 30 shared bindings in `runAgent6` |
| [08 — Agents 7 & 7.5](areas/08-agent7-narrative-geometry.md) | Agent 7's case summary is wrong on every run; eight hand-copied candidate paths |
| [09 — Agents 3, 3b & 4](areas/09-agent3-cml-agent4-revision.md) | Two CML normalisers; hard-coded story defaults survive in Agent 3 |
| [10 — Agents 1, 2–2e & 8](areas/10-agents1-2-8-context.md) | Identity checked in 5+ places; one runner for six agents |
| [11 — Orchestration & shared](areas/11-orchestration-shared.md) | 14 skeleton variants; cost double-counting; 82 flags through 8+ parsers |
| [12 — Scoring layer](areas/12-scoring-layer.md) | Vanity vs honest scorers; one engine copied 11 times |

## 9. Method

Each area was read line by line by one reviewer against [RUBRIC.md](RUBRIC.md); claims are marked
**MEASURED** / **INFERRED** / **UNVERIFIABLE** as in the boards. The coordinating reviewer spot-checked each
report's headline claims against source and re-checked the bugs in [VERIFIED-BUGS.md](VERIFIED-BUGS.md) on
the latest line. Two defects in this audit's own tooling were caught by the area reviewers and corrected
before use: jscpd's default skipped every file over 1,000 lines, and the export-usage script treated a barrel
that also *calls* a name as a pure re-export. No pipeline run, canary or LLM call was made to produce any
finding. Baseline data: [metrics](data/metrics.md) · [scoring metrics](data/metrics-scoring.md) ·
[coverage](data/coverage.md) · [duplication](data/duplication.md) · [export usage](data/export-usage.md) ·
[history](data/history.md) — re-run [`tools/`](tools/) against current code before quoting a number.
