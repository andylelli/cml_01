# ANALYSIS_03 Agent5 Direct Harness Usage

This note documents the operational direct LLM harness in worker and its two prompt modes.

## Script

- `npm run -w @cml/worker harness:agent5:direct -- --cml <path-to-cml.json> [options]`
- `npm run -w @cml/worker harness:agent5:direct:help`

## Mode A: Generated Prompt (default)

Prompt is built with `buildCluePrompt` from CML + optional fair-play feedback.

Example:

```bash
npm run -w @cml/worker harness:agent5:direct -- \
  --cml documentation/analysis/ANALYSIS_03_fair_play_structural_abort_run_a2a462c9/cml_from_last_run.json \
  --density minimal \
  --redHerrings 2
```

## Mode B: Captured Prompt Replay (`--promptFile`)

Prompt messages are loaded from a markdown file containing:

- `Message 1 (system)`
- `Message 2 (developer)`
- `Message 3 (user)`

Each message must contain a fenced code block (` ```text ... ``` `).

Example:

```bash
npm run -w @cml/worker harness:agent5:direct -- \
  --cml documentation/analysis/ANALYSIS_03_fair_play_structural_abort_run_a2a462c9/cml_from_last_run.json \
  --promptFile documentation/prompts/actual/run_20260424-1809_a2a462c9/16_Agent5-ClueExtraction_retry1_request.md \
  --runId replay_run_a2a462c9 \
  --projectId proj_fa4848dd-3d76-4258-8d9e-e28e5d4be3b0
```

## Required Environment

- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`

Recommended:

- `AZURE_OPENAI_DEPLOYMENT_NAME`
- `AZURE_OPENAI_API_VERSION`

## Output Artifact

Default output path:

- generated mode: `apps/worker/logs/agent5-direct-harness-<runId>.json`
- replay mode: `apps/worker/logs/agent5-direct-harness-replay-<runId>.json`

The artifact includes:

- model prompt and raw response
- parsed/normalized clues
- `applyClueGuardrails` result
- deterministic contract result
- Agent6 coverage snapshot
- final `pass` boolean
