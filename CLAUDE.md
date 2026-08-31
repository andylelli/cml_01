# CML — working instructions

A multi-agent Golden Age mystery pipeline. Agent 1 setting → 2 cast → 2b profiles → 2c locations →
2d temporal → 2e background → 3b devices → 3 CML → 4 revision → 5 clues → 6.5 world doc → 7 outline →
7.5 geometry → 8 novelty → 9 prose.

---

## Recording workflow findings — MANDATORY

**When a multi-agent workflow completes, write its findings to `documentation/workflow/` BEFORE acting on
them.** One file per run, `WF-NNN-<short-name>.md`, plus a row in `documentation/workflow/README.md`.

These runs cost ~1.4–1.6M subagent tokens each and their output is otherwise lost in a session
transcript. A workflow whose findings are not written down has to be paid for twice.

Record all of:

- run id, date, agent count, subagent tokens, duration, script filename
- the question it was asked
- findings that **SURVIVED** verification — file:line and measured reach
- findings that were **REFUTED, and why** — this half stops the same hypothesis being re-bought, and
  in WF-002 it was the most valuable output of the run
- what it could **NOT** determine
- any expand/skip recommendation

See `documentation/workflow/README.md` for the standing rules those runs established.

---

## Evidence standard

Every claim in an analysis document is labelled **MEASURED**, **INFERRED** or **ASSUMED**.

**A negative result from a probe you just wrote is a claim about the PROBE** until the probe is shown
to work against a known-positive. On 2026-08-29/30 this cost eight fixture errors and four "the flag
is broken" findings that were all the harness. Common shapes:

- heredocs collapsing backslash escapes — write the script to a file instead
- artifact payloads read without unwrapping (`{CASE: …}` vs the bare case)
- calling a function with the wrong arity or argument shape and reading the degenerate result as "no
  effect"

**Recompute every correlation against the external-read ledger with `words >= 8000`.** Eight of the
43 read manuscripts are truncated May/June failures that score badly on everything; they manufacture
relationships with anything length-related. Two claims died to this.

**Divergence triage (WF-002):** two components computing the same entity set will disagree. That is
harmful only where one copy is the sole input to a WRITE — a deletion, an injection, a floor that
must supply text. Where it feeds a prompt it is absorbed.

---

## Flags

Default OFF, registered in `architecture/FLAG-AUDIT.md`, env read at **call time** — never a module
const, which freezes before dotenv (ADR-0004). `npm run flags:check` and `npm run flags:runtime` must
both be clean.

**Verify a lever by its agent label in `logs/llm-prompts-full.jsonl`, not by grepping the module.**
Three flags were found to be no-ops on 2026-08-29 despite looking correctly wired.

**A check that fires on most runs is an off switch with extra steps** (B1). And a gate that drives
retries costs +2.43 register points on the retried chapter — measured — so prefer a prompt operation
or a post-pass to a lint gate.

---

## What predicts the score

The **machine-register rate** (`packages/prose-guard/src/machine-register.ts`) is the only validated
instrument: −0.697 against the headline and −0.444 against `prose` over the 36 non-truncated reads.
Nothing else survives a partial correlation against it.

**This model complies with OPERATIONS and ignores STATISTICS.** VoiceSpec asked for 22.0 words per
sentence and the book delivered 15.86, 0 of 10 chapters. Ask for countable things done, not rates hit.

A single external read carries ±3 marks and no judge separates an 86 from an 81, so **do not report a
sub-threshold delta as an effect**. Book-level A/B on chapter-level effects needs 250+ pairs.

---

## Repo conventions

- `npm run build:all` before anything that reads `dist` — the worker consumes dist, not src.
- Analyses live in `documentation/analysis/ANALYSIS_NN/`; boards in `architecture/`;
  workflow findings in `documentation/workflow/`.
- Update the live board (`architecture/PLAN-TO-90.md`) in the same commit as the code it describes.
- Never delete a tracked item — move it to recommended-against with the reason.
- Commit messages carry the measurement, not just the change.
