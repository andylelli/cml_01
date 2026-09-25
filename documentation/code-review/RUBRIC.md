# Code review rubric — how each area was audited

**Written:** 2026-09-25 · **Used by:** every file in [`areas/`](areas/) · **Companion:** [README.md](README.md)
(the synthesis and the tracker).

This is the instruction every area reviewer followed, kept with the audit so the next one can be
run the same way and its results compared like-for-like.

---

## 1. The lens: refactoring, not bug-hunting

The question is **how to make the agent code cleaner and more efficient without changing what it
does** — and, where a change in behaviour is the right call, to say so and route it through the
project's own evidence rules.

This is a different lens from the bug audits that came before it
([A_73](../analysis/ANALYSIS_73/ANALYSIS_73.md), [CODE-AUDIT-BACKLOG](../../architecture/CODE-AUDIT-BACKLOG.md),
REVIEW_01–15), and it deliberately does not redo them. Their most useful conclusion carries straight
over: *almost every confirmed defect was "a boundary where one concept existed twice and only one copy
was observable."* In this codebase **duplication is not a tidiness problem — it is the defect class.**
Every merge of two bodies of one concept is defect-class removal.

Bugs noticed along the way are recorded in their own section (§9 of the template) and are not the
point of the exercise.

## 2. Ground rules

1. **Read every line of every file in the area.** Use offset/limit chunks for large files. Skimming
   finds the obvious and misses the two-body duplicates, which only show up when both bodies have
   been read.
2. **Cite everything** as `path/to/file.ts:LINE`. A finding without a location is not a finding.
3. **Mark evidence the way the boards do:** **MEASURED** (you ran a command or counted, and can quote
   the output) · **INFERRED** (follows from reading the code) · **UNVERIFIABLE** (needs a live run or
   artifacts not in the repo).
4. **Do not modify source.** The only file a reviewer writes is its own `areas/NN-*.md`.
5. **No pipeline runs, canaries, or anything that calls an LLM or spends money**
   (`.github/copilot-instructions.md`: *"Don't run canary runs without user telling you to"*).
6. **Verify dead-code claims across the whole repo** — `apps/`, `packages/`, `scripts/`, tests —
   including dynamic and string references, before calling anything unused.
7. **Prefer a few high-value findings to a long list of nits.** Typically 8–20 per area. Group repeated
   small instances into one finding with a count and two or three examples. If a lens finds nothing,
   say so in a line: a negative result tells the next audit where not to look.
8. **Quantify.** Lines removed, functions split, cyclomatic complexity reduced, bodies merged, prompt
   characters saved, calls avoided. "Cleaner" is not a benefit; "the 3,957-line function becomes a
   300-line coordinator over seven phases with explicit inputs" is.

## 3. The constraints every proposal must respect

These are ratified decisions ([`architecture/decisions/`](../../architecture/decisions/)). A proposal
that contradicts one must say so explicitly and argue it, not slip past it.

| ADR | What it means for a refactor |
|---|---|
| [0002](../../architecture/decisions/0002-sequential-prompt-chaining.md) | The fixed stage sequence is deliberate. Do not propose an autonomous agent loop. Concurrency *within* independent stages is fair game (R9 already parallelised 2b/2c/2d behind a flag). |
| [0003](../../architecture/decisions/0003-never-abort-release-gate.md) | Deterministic injection floors are deliberate. Catch-and-continue around a repair is often policy, not sloppiness — check before calling it an error-handling defect. |
| [0004](../../architecture/decisions/0004-flag-gated-default-off.md) | Behaviour changes ship flag-gated, default OFF. **Exempt:** a change "provably unable to affect prose (a pure rename, a type-only refactor)". The test: could any byte of any prompt or any shipped chapter differ? |
| [0005](../../architecture/decisions/0005-story-bible-freeze.md) | Derived facts are computed once and dereferenced. A second derivation of the same fact is a violation, and a merge target. |
| [0007](../../architecture/decisions/0007-repair-ladder-ordering.md) | LLM rungs first, deterministic floor last, and the floor stays. |
| [0011](../../architecture/decisions/0011-measurement-before-promotion.md) | **Deletions need evidence too.** Only code with no caller, no export and no flag may be deleted on the compiler's word. Removing a flag branch, a coercion site or a pass is a behaviour change. |

Prior simplification work (REVIEW_01 §5.7, status per REVIEW_03): S1 flag audit ✅, S2 ✅, S3 regen
registry ✅, S5 ✅; **S4 split `agent9-run.ts` ◑ two tranches** (and the file has since grown from
6,814 back to 7,602 lines); **S6 extract `agent9-prose/` ⬜ blocked on an owner decision** (61 forward
edges into the package root); **S7 retire coercion sites 🔒 blocked** (the R4 counters do not emit).
Do not re-propose finished work; do build on the blocked items.

## 4. The ten lenses

**A. Responsibilities and boundaries.** List the distinct responsibilities in each large file and
function: LLM call, parsing and coercion, validation, deterministic repair, scoring, persistence,
telemetry. Where is the natural seam? Is code in the right package — the worker is orchestration and
I/O, `prompts-llm` is prompt construction and generation? Are there layering inversions?

**B. Size and control-flow complexity.** For every function over 150 lines or cyclomatic complexity
over 30: what are its phases? Can each phase become a named function with explicit inputs and
outputs? **How much closure state do the phases share** — the variables that would have to become
an explicit state object? Long parameter lists (over five) or option bags that signal a missing type?
Nesting over four levels that guard clauses would flatten?

**C. Duplication.** (1) Literal clones — see [`data/duplication.md`](data/duplication.md). (2) Semantic
duplicates — one concept implemented twice: two regexes for one thing, two normalisers for one
artifact, two ways to find "the culprit", two copies of one vocabulary, parallel scorer families. For
each, is the divergence deliberate? (3) Boilerplate repeated across agents — LLM call → JSON parse →
coerce → validate → retry → score → persist.

**D. Dead, vestigial and flag-gated code.** No callers (verified repo-wide); exported but used only in
its own file (un-export it when the file is split); parameters and fields never read; commented-out
code. For each flag read in the area: its default, its [FLAG-AUDIT](../../architecture/FLAG-AUDIT.md)
status, and whether its branches distort the code's structure. Per ADR-0011 only compiler-provable dead
code is R0; removing a flag branch is R2.

**E. Types and contracts.** `any` and cast hotspots (counts in [`data/metrics.md`](data/metrics.md)).
LLM JSON typed `any` and flowing deep into logic — parse it at the boundary into a typed shape; reuse
the repo's existing boundary patterns (`shared/json-boundary.ts`, `agent7-narrative-schema.ts`) before
inventing one. One artifact with different shapes in different agents. Strings that should be unions.

**F. Errors, retries and failure semantics.** Catch-and-continue sites: deliberate degradation
(ADR-0003) or accident? How many independent retry loops exist, and is failure classification
duplicated? Do errors carry enough context to diagnose from the report (ADR-0010)?

**G. State and side effects.** Module-level mutable state. Functions that mix I/O (file writes,
logging, artifact saves) with pure logic — extract the pure core. Input objects mutated in place.
Ordering dependencies nothing enforces.

**H. Compute efficiency.** Repeated full-text scans of prose or CML inside loops; regexes built per call
from constant data; chapters × clues × paragraphs × sentences matching; `JSON.parse(JSON.stringify())`
deep clones of large objects; synchronous file I/O on hot paths. **Estimate the magnitude against LLM
latency and say honestly when it is negligible** — in an LLM pipeline CPU is rarely the bottleneck, and
a finding that saves 40 ms per run is P3 at best.

**I. LLM and token efficiency.** For each LLM call site: purpose, model tier, rough prompt size, retry
behaviour. Look for calls whose output could be computed deterministically; retries a deterministic
pre-check or post-fix would prevent; prompt content duplicated across blocks; volatile content ahead of
stable content (defeats prefix caching); oversized context; independent calls made in sequence. Known
work — cite it rather than re-deriving it: [REVIEW_12](../../architecture/REVIEW_12.md) (retries are 37%
of prose prompt volume), R8 prefix ordering (`AGENT9_PROMPT_PREFIX_ORDER`), the polish pass rolling back
4 of 4 (HANDOVER §5.2), rework ≈ 30% of a run.

**J. Testability and the safety net.** Which tests cover the area (grep the `__tests__` directories for
imports of its modules)? Which large functions have no direct test? What characterisation test must
exist before an R1 refactor can be proven behaviour-preserving? Are the replay harnesses
(`apps/worker/src/jobs/agent9-replay.ts`, the fixed-seed benchmark) usable as a net?

## 5. Classifying a finding

**Priority.** **P1** removes a defect class, unblocks other refactors, or substantially shrinks a
hotspot (see the churn × size table in [`data/metrics.md`](data/metrics.md)) — do first. **P2** a clear
improvement of moderate value. **P3** opportunistic — do it when the file is open anyway.

**Risk class** — this decides what evidence a change needs before it merges:

| Class | What it covers | Evidence required |
|---|---|---|
| **R0 — mechanical** | Moves, renames, extracting a function without changing its logic, type-only changes, un-exporting, deleting compiler-proven-unreachable code | Typecheck + existing tests + `build:all` + `preflight-dist-check`. ADR-0004's exemption applies. |
| **R1 — behaviour-preserving logic change** | Restructuring control flow, merging two implementations believed equivalent, replacing ad-hoc parsing with a shared helper, resolving flags once instead of per call | R0 **plus** a characterisation test or a before/after byte-equality check of prompts and outputs on fixed inputs |
| **R2 — behaviour change** | Deleting a live or flag-gated path, changing retry policy, changing prompt text, promoting or removing a flag | ADR-0004 / 0011: flag + probe, or a counter at zero. **The owner decides.** |

**Effort.** **S** ≤ 2 hours · **M** ≤ 1 day · **L** more than a day (give days).

## 6. Output template — `areas/NN-<slug>.md`

```markdown
# NN — <Area name>

**Scope:** <files, lines, code lines> · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** <CODE> · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does
A navigable map in ≤ 30 lines: phases, entry points, data in and out.

## 2. Verdict
3–6 sentences: overall health, where the complexity really comes from, the single most valuable change.

## 3. Findings
| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|

### <CODE>-01 — <title>
- **P1 · lens B · R1 · M**
- **Evidence (MEASURED | INFERRED):** file:line citations; short quotes (≤ 10 lines) where they help.
- **Proposal:** the concrete target — new function and module names, what moves, what merges.
- **Benefit:** quantified.
- **Verification:** how to prove it safe.
- **Relates to:** other IDs, in this area or others.

## 4. Target structure
The module layout after refactoring, with approximate sizes.

## 5. Suggested sequence
Ordered steps, each independently shippable and verifiable.

## 6. Flags in this area
| Flag | Default | Read at | FLAG-AUDIT status | Structural note |

## 7. Safety net
Tests that pin this area, the gaps, and the characterisation tests to write first.

## 8. What NOT to refactor
Load-bearing oddities, and why they stay.

## 9. Incidental defects
Bugs noticed while reading, outside the lens: evidence and confidence. Not fixed.

## 10. Cross-area observations
Patterns shared with other agents, for the synthesis.

## 11. Open questions for the owner
```

## 7. Data every reviewer had

| File | What it is | Regenerate with |
|---|---|---|
| [`data/metrics.md`](data/metrics.md) | Per-file and per-function size, complexity, types, coupling, churn and hotspots for the agent scope | `node documentation/code-review/tools/agent-metrics.mjs --churn` |
| [`data/metrics-scoring.md`](data/metrics-scoring.md) | The same for the scoring layer | `… agent-metrics.mjs --churn packages/story-validation/src/scoring apps/worker/src/jobs/scoring-adapters` |
| [`data/export-usage.md`](data/export-usage.md) | Exports with no production user outside their own file (a lower bound) | `node documentation/code-review/tools/export-usage.mjs` |
| [`data/duplication.md`](data/duplication.md) | Literal clones, by file pair | `npx jscpd@4 --min-tokens 35 --min-lines 5 --format typescript apps/worker/src apps/api/src packages` |
