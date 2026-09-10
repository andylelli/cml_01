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

## Reporting a run — MANDATORY

**Before launching any paid run, state its full parameters in the reply.** Not a summary, not "a
random run" — the seed and every field that shapes the story, plus the flags that differ from the
last run and what the run is expected to settle.

State, every time:

- **seed**, and the exact command to reproduce it
- **axis · era · location · tone · target length · detective type · narrative style · cast size**
- **the cast**, by name — a name collision is invisible in a summary and has cost two reads; and
  the **fresh-names exclusion** the generator prints (which recent runs' names were avoided) — the
  reviewer reads consecutively, and 24 of 28 consecutive books shared a full cast name before
  `--fresh-names` (A_84 #2, default 3; `--fresh-names 0` replays a pre-2026-09-07 file exactly)
- **the story angle** (`storyAngle` in the yaml) — it is drawn last so old seeds still reproduce, and it
  reaches Agents 1, 2, 2e, 3b and 3; `--no-angle` is the pre-angle baseline
- **any flag flipped since the previous run**, with what it is expected to change
- **what the run is expected to SETTLE**, as a checkable prediction rather than a hope

Why this is a rule and not a habit: a run costs ~£1.15 and roughly 40 minutes, and its parameters are
the only thing that makes it comparable to any other. A run whose parameters were never written down
cannot be paired, cannot be replayed, and cannot be argued from — it is £1.15 of anecdote. Seeded
parameters live in `scripts/generated/run-params-<seed>.yaml`; **that file is the provenance record of
a run that happened and must never be overwritten** (regenerating a seed rewrites it — copy it aside
first, and see the sweep note in `run-params.mjs`).

Afterwards, report the run id, project id, cost, release-gate verdict, and every prediction that was
made — including the ones that failed.

---

## Long tasks — finish, or hand off cleanly

A task with many items (a list, an audit, a migration) runs until **every** item is resolved.
Resolved means built and verified, explicitly deferred with a reason, or withdrawn as wrong — never
"started". Do not stop to report progress, and do not ask whether to continue. Commit per coherent
group and keep going.

The only legitimate early stops are: a destructive or outward-facing action needing approval, a
genuine scope decision only the user can make, and the context budget.

**Because the context budget is a real stop, make the work resumable from the FIRST item, not the
last.** Every item carries its status inline in the task's own document, and a STATUS table names the
commit for each. A fresh session must be able to read that table and continue without re-deriving
anything.

When context runs short, spend what is left on: committing what is green, updating the ledger, and
one line naming the next item — never on a summary of what was already committed.

**Still surface, in the final message:** anything deferred or withdrawn *because building it would
have caused harm* (A_86 item 8 would have doubled the request rate against a shared quota), and any
item whose premise turned out to be false. Those are findings, not progress.

---

## Context economy on long tasks

- Read a file once. Patch with a script, not by re-reading.
- `npm run build:changed` between items; `build:all` once per group.
- Test the touched package between items; the full suite once per group.
- Do not re-verify what a passing test already pins.
- Prefer one measurement that settles an item to three that describe it.

---

## Spending a run, and spending a read — A_86 §K

A run is ~£0.60 and ~40 minutes; an external read is the only instrument that has ever moved this
project, and it carries ±3 marks. Both are scarcer than the work that precedes them.

- **Prefer the matched pair to the fresh run.** `RESUME_REDO=prose` re-runs ONE stage against a
  byte-identical persisted upstream (~£0.45). A fresh run settles nothing about a prose-side lever,
  because everything upstream moved too.
- **Never spend a read on a book with a fallback chapter.** A deterministic-fallback chapter is
  machine-assembled scaffold; a read of it measures the fallback, not the pipeline. The run log says
  `forced to deterministic fallback` / `forced to completion fallback`. Resume that chapter first.
- **Bundle levers that touch different chapters** so one read scores several by category (the A_85
  series touched ch1, ch8-10 and the timeline). One read, several answers.
- **Choose the next seed by AXIS, not at random**, until every axis has three reads. Authority,
  spatial and behavioural have 0-1 each; a mark on an unread axis is worth more than a fifth
  temporal mark.
- **When a read names no injector, the injector audit is over.** The last four reads listed only our
  own template sentences (A_84, A_85). Until a read stops quoting them, a read is an injector audit
  and should be scored as one — not as evidence about prose quality.

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
