# Record / replay harness (CR-03)

**Written:** 2026-09-29 · **Status:** the whole pipeline is covered — v2 prose, v1 prose, from-clues (Agents 5 → 9) and full
(Agents 1 → 9 through `generateMystery`), 4 fixtures, all MATCH; the scoring characterisation (SCO-12)
runs in the worker suite. Open: ORC-07's replay-rubric question (owner) and an optional paid recording.

## What it is for

`runAgent9`, `generateProse`, `generateMystery` and the v2 prose engine have 0% unit coverage. A refactor of
them could be proven only by a paid run, which proves nothing anyway because the model's output varies. A
replay runs the **same code** offline: each LLM call is answered from a recording (a *cassette*), and a call
whose prompt differs by one byte from the recording fails, naming the agent and the byte. "This refactor
changed nothing" becomes a free, exact check. No credentials, no network, no cost; ~7 s per stage.

## Use it

| To | Run |
|---|---|
| Prove nothing changed (CI does this) | `npm run build:all && npm run replay:check` |
| Re-baseline after a **deliberate** prompt change | `node scripts/replay-fixture.mjs --name v2-prose-cdad5315 --rebase`, then commit the cassette — its diff is the list of prompts your change altered |
| Add a fixture from a past run | `node scripts/replay-fixture.mjs --name <name> --project <projectId> --run <runId> [--stage prose|clues|setting] [--set FLAG=value]` |
| Replay one stage by hand | `node scripts/replay-stage.mjs --cassette <c> --project <p> [--store <s>] [--rebase <out>] [--keep]` |

`replay:check` failing means one of: a prompt differs (the message names the agent and the first differing
byte), a recorded call was never requested, or the prose digest moved.

## How it works

- **Where it sits.** `buildClient()` in `apps/worker/src/jobs/cli-runtime.ts` returns a `ReplayClient`
  (`packages/llm-client/src/replay.ts`) when `LLM_REPLAY_CASSETTE` is set, so the code under test is the real
  `resume-run` a paid resume would run.
- **The cassette** is the attempt log the client already writes: every request to `llm-prompts-full.jsonl`,
  every outcome to `llm.jsonl`, joined by run id and prompt hash (`scripts/cassette-from-logs.mjs`). Any
  logged run is a free recording.
- **Identity of a call** = agent label + prompt hash. The v2 engine sends a segment's three drafts in parallel
  with identical prompts, told apart only by label; matched by hash alone, draft 1 was served draft 2's reply
  and every later prompt differed (MEASURED).
- **Retries.** An error followed by another attempt with the same prompt was swallowed by the client's retry
  loop, so replay skips it; an error that is the last attempt of its prompt is re-thrown. The recording
  decides, not the error text (a text rule re-threw a 429 and changed the book — MEASURED).
- **Rebase.** Matches by label and call order, serves the recorded reply, and records the prompt the current
  code sends. Attempts the code no longer makes are dropped; a call the recording never made is stored as a
  failure marked `synthetic` (the pipeline handles it as a failed call). Rebase never invents a response; a
  paid recording replaces the synthetic entries.
- **Sandbox.** `scripts/replay-stage.mjs` points the store, stories folder, novelty ledger, Agent 9 checkpoint
  and LLM logs at a temp folder, snapshots what has no override (`apps/worker/logs`, …) and puts it back;
  it fails if anything it cannot restore changed.

## Measured (2026-09-29)

| | |
|---|---|
| Fixture | `eval/replay/v2-prose-cdad5315` — the v2 prose stage of `resume-1790356483365` (seed project `proj_cdad5315…`), 1.1 MB |
| Rebase to current code | 39 of 46 calls had a changed prompt since the recording (2026-09-25); 5 recorded third drafts no longer requested; 2 editor calls new → synthetic |
| Strict replay | MATCH, 46 calls, 52 attempts; ~7 s; prose digest `8312428c1259b1d3`, identical across repeated runs and from the 0.2 MB store extract |
| Known positive | one character added to the writer system prompt → NO MATCH at byte 29 of `Agent9v2-Writer-S0-D1`, exit 5; reverted → MATCH |
| Fixture 2 | `eval/replay/v1-prose-d0ee7b26` — the v1 prose stage of the fresh run `run_7b1ec2ef` (2026-09-18), `PROSE_ENGINE=v1` override, 1.4 MB. Rebase: 38 calls with a changed prompt, 2 synthetic regen failures. Strict: MATCH, 75 calls, 105 attempts, ~60 s, digest `23e066747bc53699` |
| Fixture 3 | `eval/replay/from-clues-d0ee7b26` — `RESUME_REDO=clues` on the same run: Agents 5, 6, 6.5, 7, 7.5 and 9 through `generateMystery`, `PROSE_ENGINE=v1` and `AGENT65_OMIT_RUN_TELEMETRY=true` overrides, 1.5 MB. Rebase: 43 calls with a changed prompt, 13 recorded attempts no longer made (Agents 1–3b are not re-run on a clue redo), 2 synthetic regen failures. Strict: MATCH, 83 calls, 113 attempts, ~46 s, digest `23e066747bc53699` — the same prose as fixture 2, as it should be: both serve the run's recorded Agent 9 replies |
| Fixture 4 | `eval/replay/full-d0ee7b26` — `RESUME_REDO=setting` on the same run: nothing restored, all of Agents 1, 2, 2b–2e, 3b, 3, 4, 5, 6, 6.5, 7, 7.5, 9 re-run on the project's recorded spec. Rebase: 46 calls with a changed prompt, 6 recorded Agent 9 attempts no longer made, 2 synthetic. Strict: MATCH, 90 calls, 120 attempts, digest `23e066747bc53699`. Two rebases identical |
| Environment | each fixture records 146 flags read through the pipeline's own `loadEnvFiles` (credentials and endpoints dropped); `replay:check` ignores `.env.local`, as CI does |
| Containment | `git status` identical before and after every sandboxed replay |

## The scoring characterisation (SCO-12)

`apps/worker/src/__tests__/phase-scoring-golden.test.ts` scores the 4 committed `eval/golden` bundles through
every wired upstream phase — Agents 1, 2, 2b, 2c, 2d, 2e, 3b, 6.5, 7, plus Agent 3's honest `scoreRealCml` —
under both `HONEST_SCORERS=off` (the vanity scores production reports) and `enforce`, and snapshots each
`PhaseScore` with a digest of the adapter's output. The phase bodies were closures inside each runner; they
are now `apps/worker/src/jobs/agents/phase-scoring.ts`, moved verbatim, and the runners call them (the
from-clues replay, which scores 6.5 and 7, still MATCHes). MEASURED: vanity grades A in 40/40 cells; honest
grades Agent 7 C on all 4 bundles and Agent 3b B on one. Not covered: Agent 3's vanity score (built from run
counters) and Agent 9 (the bundles carry no prose; a prose fixture from a replay store is the next step).

## Nondeterminism the harness found

A replay must produce the same prompts twice from the same input. Two sources broke that:

- **Agent 2d dates the story from the run id** (`generateSpecificDate(decade, runId || projectId)`), and
  `resume-run` names each run `resume-<epoch ms>`. MEASURED: 1935 May recorded, 1933 April on the next replay.
  Beyond the harness this means **every resume that re-runs Agent 2d re-dates the story** while keeping
  upstream artifacts written for the original date (ledger A1X-08 / A1X-Q04). The harness pins the id with
  `RESUME_RUN_ID`; the pipeline behaviour is unchanged and is the owner's call.
- **Agent 6.5's prompt carried wall-clock telemetry.** It serialises TEMPORAL_CONTEXT and BACKGROUND_CONTEXT
  whole, and both artifacts carry their own `cost` and `durationMs` at the root (4 fields; no other agent's
  prompt carries any — the same probe finds none in the v2 prose cassette). Two rebases of the from-clues
  replay differed at exactly one byte range: `"durationMs": 8` against `5` (MEASURED). Fixed behind
  `AGENT65_OMIT_RUN_TELEMETRY` (default OFF, ADR-0004; FLAG-AUDIT addendum 2026-09-29), which drops those two
  ROOT keys — nested `cost` is story content. The from-clues fixture replays with it ON; with it OFF the
  same fixture fails at `Agent65-WorldBuilder` byte 79,779 (known positive). In production the flag-off
  prompt sends the model a real LLM latency, which is noise, not harm; promoting it is the owner's call.

## Pinned inputs

A fixture pins everything a replay reads that can change after it was made:

- **the store rows** (`<name>.store.json.gz`) and **the flag environment** (`<name>.expected.json`);
- **the novelty ledger** (`<name>.ledger.json.gz`). `data/novelty-ledger.json` is tracked and every paid run
  appends to it, and Agent 3b prompts with prior runs from it. MEASURED: one record removed → NO MATCH at
  `Agent3b-HardLogicDeviceGenerator` byte 1,620. Unpinned, the full fixture would have failed after the next
  paid run. `--rebase` keeps a fixture's ledger; a new fixture pins today's.

The entry point for Agents 1–4 is `resume-run` with `RESUME_REDO=setting`: it keeps nothing and re-runs the
pipeline on the project's recorded spec. It used to be refused — the "enough upstream to be worth resuming"
check looked for a CML the redo had already dropped; it now checks what the run PRODUCED.

## Incidents found while building it

- **Two unsandboxed replays (before `replay-stage.mjs`) wrote into the working tree**: a novelty-ledger entry
  (reverted from git), three run files and two scoring-log lines under `apps/worker/logs` (removed), and the
  v2 checkpoint for `proj_cdad5315…`. That checkpoint matched the *current* contract hash, so the next paid
  `RESUME_REDO=prose` on that project would have reused replayed drafts instead of calling the writer. It was
  deleted: the original it replaced carried the 2026-09-25 contract hash and would have been ignored by
  today's code, so deleting restores the same behaviour. `CML_AGENT9_CHECKPOINT_PATH` now keeps a replay's
  checkpoint in its sandbox.
- **A replay with the run id pinned overwrote the recorded run's quality report**,
  `apps/api/data/reports/proj_d0ee7b26…/run_7b1ec2ef….json` (gitignored; keyed by run id; no path override).
  The sandbox check caught it and failed, but the file had no backup, so **the original 2026-09-18 report is
  lost**; the file now holds the replay's report (left in place by owner decision). The run's phase scores
  survive in `apps/worker/logs/scoring.jsonl` (20 lines) and its run log is intact. `replay-stage.mjs` now
  backs up all of `apps/api/data`; verified: the report is byte-identical after a replay.

## Still to do (CR-03)

- ORC-07 / ORC-Q02: the old `agent9-replay.ts` scores with its own rubric copy (different judge, no
  structural verifiers); moving it onto the live rubric changes its scores — the owner's call.
- Optionally, one paid recording (~£0.45, `RESUME_REDO=prose`) to replace the two synthetic editor failures
  with real replies.
