# Record / replay harness (CR-03)

**Written:** 2026-09-29 · **Status:** v2 prose stage covered; v1 prose, the full pipeline and the scoring
characterisation still to add (tracker row CR-03).

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
| Add a fixture from a past run | `node scripts/replay-fixture.mjs --name <name> --project <projectId> --run <runId>` |
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
| Containment | `git status` identical before and after every sandboxed replay |

## Incidents found while building it

- **Two unsandboxed replays (before `replay-stage.mjs`) wrote into the working tree**: a novelty-ledger entry
  (reverted from git), three run files and two scoring-log lines under `apps/worker/logs` (removed), and the
  v2 checkpoint for `proj_cdad5315…`. That checkpoint matched the *current* contract hash, so the next paid
  `RESUME_REDO=prose` on that project would have reused replayed drafts instead of calling the writer. It was
  deleted: the original it replaced carried the 2026-09-25 contract hash and would have been ignored by
  today's code, so deleting restores the same behaviour. `CML_AGENT9_CHECKPOINT_PATH` now keeps a replay's
  checkpoint in its sandbox.

## Still to do (CR-03)

- A v1 prose fixture (`PROSE_ENGINE=v1`) — v1 stays runnable by owner decision, so its refactor proofs need one.
- A full-pipeline fixture (`generateMystery`, all agents) from a fresh run whose responses are logged.
- SCO-12: the scoring characterisation over the committed golden bundles.
- Optionally, one paid recording (~£0.45, `RESUME_REDO=prose`) to replace the two synthetic editor failures
  with real replies.
