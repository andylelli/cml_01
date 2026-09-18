# CML — working instructions

A multi-agent Golden Age mystery pipeline. Agent 1 setting → 2 cast → 2b profiles → 2c locations →
2d temporal → 2e background → 3b devices → 3 CML → 4 revision → 5 clues → 6.5 world doc → 7 outline →
7.5 geometry → 8 novelty → 9 prose.

**This file is loaded into every session. Keep it to rules.** The evidence behind a rule lives in
`documentation/analysis/`; cite it, do not restate it here.

---

## Reporting a run — MANDATORY

**Before launching any paid run, state its full parameters in the reply** — not a summary:

- **seed**, and the exact command to reproduce it
- **axis · era · location · tone · target length · detective type · narrative style · cast size**
- **the cast by name**, and the **fresh-names exclusion** the generator prints (`--fresh-names`,
  default 3; `--fresh-names 0` replays a pre-2026-09-07 file exactly)
- **the story angle** (`storyAngle`); `--no-angle` is the pre-angle baseline
- **any flag flipped since the last run**, and what it should change
- **what the run should SETTLE**, as a checkable prediction

Afterwards report run id, project id, cost, release-gate verdict, and **every** prediction — including
the ones that failed.

A run is ~£1.15 and ~40 min; its parameters are the only thing making it comparable to another run.
`scripts/generated/run-params-<seed>.yaml` is the provenance of a run that happened and **must never
be overwritten** — copy it aside before regenerating a seed.

---

## Spending a run, and spending a read

An external read is the only instrument that has ever moved this project, and carries ±3 marks.

- **Prefer the matched pair.** `RESUME_REDO=prose` re-runs ONE stage against byte-identical upstream
  (~£0.45). A fresh run settles nothing about a prose-side lever.
- **Never read a book with a fallback chapter** — the log says `forced to deterministic fallback`.
  That measures the fallback, not the pipeline. Resume the chapter first.
- **Never read a book whose SHIP-CHECK says WORTH A LOOK.** Run 31372 went to a reader at 29.8× the
  repetition median with the instrument saying so; the read cost 7 marks and settled nothing. A
  matched pair first (A_94).
- **Read the book yourself before spending a reader.** Twenty minutes and £0 on seed 50862 found nine
  defects, four of which no instrument reports — a banned phrase used 10 times, beat names printed as
  chapter titles, clearances after the arrest, a mechanism whose key actor is not in the cast. It
  PASSED its release gate (A_96).
- **Bundle levers that touch different chapters** so one read scores several by category.
- **Choose the next seed by AXIS** until every axis has three reads. Spatial and behavioural have 0–1.
- **When a read names no injector, the injector audit is over.** Until then a read is an injector
  audit and should be scored as one, not as evidence about prose quality.

---

## Evidence standard

Label every claim in an analysis **MEASURED**, **INFERRED** or **ASSUMED**.

**A negative result from a probe you just wrote is a claim about the PROBE** until it is shown to
work against a known-positive. Recurring shapes: heredocs collapsing backslashes (write the script to
a file); payloads read without unwrapping (`{CASE:…}` vs the bare case); wrong arity or argument
shape read as "no effect"; a filter that returns 0 rows reported as "none exist".

**Recompute every correlation against the external-read ledger with `words >= 8000`** — eight
truncated May/June manuscripts manufacture relationships with anything length-related.

**Divergence triage (WF-002):** two components computing the same set will disagree. That is harmful
only where one copy is the sole input to a WRITE. Feeding a prompt, it is absorbed.

---

## Answering a direct question

**Answer the question asked, and only that, in the first sentence.** A question about the benefit
gets the benefit. A question about the cost gets the cost. A question about what to do gets one
recommendation. No caveats, hedges, "but" clauses or balancing paragraphs in the answer to a direct
question. Confidence is stated, not performed: say what is true, say it plainly, and stop.

Caveats have a home and it is not the answer. They go in the analysis document, the commit message,
or a later reply if asked. The evidence standard above governs those places, where every claim
carries its label; it does not licence hedging in conversation.

The rules that require stating something before acting — run parameters before a paid run, the
scope call on a destructive change — are unchanged. Those are not caveats; they are the answer.

---

## Flags

Default OFF, registered in `architecture/FLAG-AUDIT.md`, env read at **call time** — never a module
const, which freezes before dotenv (ADR-0004). `npm run flags:check` and `flags:runtime` must be clean.

**Verify a lever by its agent label in `logs/llm-prompts-full.jsonl`, not by grepping the module.**

**A check that fires on most runs is an off switch with extra steps** (B1). A gate that drives retries
costs +2.43 register points on the retried chapter — prefer a prompt operation or a post-pass.

---

## What predicts the score

**Machine-register rate** (`packages/prose-guard/src/machine-register.ts`) is the only validated
instrument: −0.697 against the headline, −0.444 against `prose`, over 36 non-truncated reads.

**This model complies with OPERATIONS and ignores STATISTICS.** Ask for countable things done, not
rates hit — VoiceSpec asked for 22.0 words/sentence and got 15.86, 0 of 10 chapters.

**Do not report a sub-threshold delta as an effect.** Book-level A/B on chapter-level effects needs
250+ pairs.

---

## Long tasks — finish, or hand off cleanly

A task with many items runs until **every** item is resolved: built and verified, explicitly deferred
with a reason, or withdrawn as wrong — never "started". Do not stop to report progress or ask whether
to continue. Commit per coherent group.

Legitimate early stops: a destructive or outward-facing action needing approval, a scope decision only
the user can make, and the context budget.

**Make the work resumable from the FIRST item.** Status lives inline in the task's own document, with
a STATUS table naming the commit per item. When context runs short, spend what is left on committing
what is green, updating the ledger, and one line naming the next item — never on a summary.

**Always surface in the final message:** anything deferred or withdrawn *because building it would
have caused harm*, and any item whose premise turned out to be false. Those are findings, not progress.

---

## Context economy

- Read a file once. Patch with a script, not by re-reading.
- `grep -v '^WARNINGS '` before any other grep of a run log — that line is one 16 KB JSON blob
  (~4,000 tokens) and `grep`/`tail` cannot get past it.
- Prefer a count, a path, or a head to a dump. Never print an array you already have.
- `npm run build:changed` between items; `build:all` once per group. Test the touched package between
  items; the full suite once per group.
- Do not re-verify what a passing test already pins.
- Prefer one measurement that settles an item to three that describe it.

---

## Recording workflow findings — MANDATORY

When a multi-agent workflow completes, write findings to `documentation/workflow/WF-NNN-<name>.md`
**before acting on them**, plus a row in that folder's README. These runs cost ~1.4–1.6M subagent
tokens; unrecorded, they are paid for twice.

Record: run id, date, agent count, tokens, duration, script; the question asked; findings that
**SURVIVED** verification with file:line and measured reach; findings **REFUTED and why** (in WF-002
this was the most valuable half); what it could **NOT** determine; expand/skip recommendation.

---

## Repo conventions

- `npm run build:all` before anything that reads `dist` — the worker consumes dist, not src.
- Analyses in `documentation/analysis/ANALYSIS_NN/`; boards in `architecture/`; workflow findings in
  `documentation/workflow/`.
- Update `architecture/PLAN-TO-90.md` in the same commit as the code it describes.
- Never delete a tracked item — move it to recommended-against with the reason.
- Commit messages carry the measurement, not just the change.
