# 0010 — The report is the durable record; chain logs are ephemeral

**Status:** Accepted · **Decided:** A_64 §2 F5, after the 7.5-pool autopsy · **Ratified:** 2026-08-06 (owner)

## Context

A run emits diagnostic information in two places: the terminal (progress lines, chain logs, warnings
as they happen) and the persisted scoring report.

The 7.5-pool autopsy found 67 scaffold-regen calls with **zero artifact trace**. They had been logged
— to a terminal that had since been closed. The information existed at the moment it mattered and was
gone by the time anyone asked. This is a recurring family in the boards: forensic blindness, where the
defect is not the bug but the inability to see it afterwards.

## Decision

**Anything that will be needed to explain a run must reach the report. Terminal output is a
convenience, never the record.**

Concretely: `ctx.warnings` is captured wholesale into a `run_warnings` diagnostic, banded into
`info` (telemetry/status) and `warn` (defect/floor firings). Anything a future investigation would
want — a lever firing, a floor firing, a coercion count, a resumed stage — pushes a line there and,
where it has structure worth querying, also upserts its own diagnostic.

## Consequences

- **Every new lever needs a telemetry line, not just a code path.** This is why R4's coercion counters
  emit even when every count is zero: a zero that is never written is indistinguishable from a
  telemetry path that never ran.
- **Warnings are load-bearing, not noise.** They are banded rather than filtered, so the full array
  survives for forensics while status accounting counts only `warn`.
- **The report is large.** Accepted cost. A large report that answers the question beats a small one
  that does not.
- **A partial report is written on failure too.** A run that dies still persists what it knew — which
  is what makes a resumed run (R5) reconstructable rather than merely restartable.
- **`report.total_cost` is not part of this contract.** It under-reports by ~7x. Cost auditing reads
  `llm-prompts-full.jsonl`. A durable-record decision does not make every field in the record correct.

## What would change our mind

- Nothing about the principle. The open question is *structure*: warnings-as-strings requires regex to
  query, which is why structured diagnostics are preferred for anything an analyser will read. The
  direction of travel is more structure, not less durability.
