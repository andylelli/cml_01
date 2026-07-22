# Campaign data archive (Target-80)

Snapshots of the gitignored raw run data, preserved per the 2026-07-20 owner decision: the
campaign moves to a data-first regime after A_63 §7.9 — future analysis works off THIS corpus,
with only singular LLM runs periodically; no more multi-run batches.

- `llm-prompts-full.<date>.jsonl.gz` — every LLM request with full message bodies (the
  authoritative token/spend record; the reports' `total_cost` under-reports ~7×, see A_63 §3).
- `llm.<date>.jsonl.gz` — request/response event log with full response bodies.
- `activity.<date>.jsonl.gz` — orchestrator activity events.
- `stories.<date>.tar.gz` — every generated story markdown (the prose corpus).

Structured per-run views of the same material live in `documentation/prompts/actual/<run>/`
and `apps/api/data/reports/<run>/`. Refresh procedure: gzip the live files from `logs/` and
`stories/` with a new date stamp; never overwrite an existing snapshot.

Snapshot coverage:
- `20260720` — through the 7.2 dual-value era (the ~70-run corpus at archive creation).
- `20260722` — FINAL batch-era snapshot (A_63 §7.9 close-out): adds the 7.2 final arms, the full
  7.3 voice A/B, the A_64 probe (`mystery-1784662295274`), and the M3 batch (4 runs, 2026-07-21
  evening) — 93 stories total. The batch era ends here; the §2.8 regime (corpus analysis +
  singular probes only) is in effect from this point.
