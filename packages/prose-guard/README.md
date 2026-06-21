# @cml/prose-guard

Agent 9's **prose-safety laws** — the flagship rebuild's Phase A. First increment of the redesign in
[`documentation/12_system_redesign/15_agent_9_prose_generator.md`](../../documentation/12_system_redesign/15_agent_9_prose_generator.md).

> Agent 9's job is the *easiest* in the pipeline — render a proof that's already been proven — yet it
> became the largest (a **5,185-line runner**), costliest (**~96% of run tokens** are prose retries),
> and most defect-prone component by trying to *judge prose with regexes* and *repair prose with
> string edits*. This package makes its three worst shipped defects **structurally impossible**, with
> **no upstream dependency** — it ships against today's architecture.

Pure, no LLM, **NOT wired into the pipeline** (nothing deleted yet). The LLM critic (§4.3), whole-book
long-context write (§4.4), and the live deletions land *behind* these laws (§7).

## The three safety laws

| Shipped defect | Law | API |
|---|---|---|
| **§3.1** a cosmetic repeated opener exhausts the retry budget and **hard-aborts the run — no story, report green** | the **universal best-draft backstop**: always retain the best-scored draft; on budget exhaustion ship it with a warning, never abort | `generateWithBackstop`, `BestDraftTracker` |
| **§3.2** the grounding-lead "repair" **dumped location metadata into a chapter's first line** (`"Wynthorpe Manor - Library in …"`) | **validation-gated mutation**: no deterministic pass ships text it didn't re-validate; revert on any regression | `mutateThenValidate` |
| **§3.3** the pronoun sweep **flipped a correct female pronoun run to male** | same law — the mutation that raises wrong-gender pronouns is reverted | `mutateThenValidate` + `pronounConsistencyValidator` |

And the §4.1 **chapter-as-contract** that makes fidelity a *machine property* instead of a regex
grab-bag:

- **`deriveChapterContracts(scenes, opts)`** — generates the exact per-chapter `must_surface` /
  `must_not_reveal` / `present` / `eliminations_allowed` spec straight from the CML + Agent 7 plan.
  The fair-play ordering falls out: a clue revealed in chapter K is `must_not_reveal` in every chapter
  before K; the culprit is `must_not_reveal` until the reveal chapter.
- **`checkContractFidelity(prose, contract)`** — the one machine-checkable question that replaces the
  completeness / clue_timing / continuity / fair_play retry families. `must_surface` misses and
  `must_not_reveal` leaks are **hard** (never cosmetic); absent characters are **soft**.

## Tests (18) — the shipped defects as permanent regression goldens

- **§3.2 golden**: a clean opening the injector would corrupt is kept untouched (`mutateThenValidate`
  reverts the metadata dump); a lossless mutation still ships.
- **§3.3 golden**: a correct female pronoun run is not flipped; the misgender counter rises under the
  buggy sweep and the mutation is reverted.
- **§3.1 golden**: a chapter that *always* trips a cosmetic "repeated opener" check still ships the
  best draft (`best_draft_backstop`), never empty; only an all-empty generator (a real upstream
  failure) throws.
- **§4.1**: contract derivation computes the fair-play ordering; fidelity passes clean prose and fails
  hard on a missing clue, a leaked future clue, or an early culprit unmasking.

```bash
npm run -w @cml/prose-guard test         # vitest (18 tests)
npm run -w @cml/prose-guard type-check   # tsc --noEmit
npm run -w @cml/prose-guard build        # tsc → dist/ (gitignored)
```

## §7.1 shadow — derive the contract over the real corpus

[`scripts/agent9-contract-shadow.mjs`](../../scripts/agent9-contract-shadow.mjs) derives the
chapter-as-contract from each shipped run's CML + outline + clues and validates it (pure
observability, zero behavior change). Over **12 shipped runs**:

- **fair-play ordering: 12/12** — every future clue is correctly `must_not_reveal` in earlier chapters.
- **culprit hidden until the reveal chapter: 12/12.**
- **clue coverage: 10/12** — two runs ship clues in the distribution that *no outline scene ever
  places* (e.g. `clue_audit_visibility_*`). The explicit contract surfaces a real upstream gap the
  implicit flow silently shipped — exactly the §4.1 divergence the redesign closes.

```bash
node scripts/agent9-contract-shadow.mjs                    # live data/store.json
node scripts/agent9-contract-shadow.mjs a.json b.json …    # wider corpus
```

## What's next (gated)

- **Phase A live wiring** — wrap today's deterministic mutations in `mutateThenValidate` and the batch
  loop in `generateWithBackstop`, behind `mutation_revalidation_enabled` / `best_draft_backstop_enabled`.
- **The LLM critic in shadow** (§4.3) — replace the regex linter battery; promote when non-inferior.
- **Delete deterministic prose mutation** (grounding lead, pronoun sweep) once critic + backstop trusted.
- **Whole-book long-context write** (§4.4), behind a flag, canaried on quality + token + fidelity.
- **Chapter-as-contract as authoritative input** once Agents 5/7 emit per-scene obligations (they now
  can — `@cml/clue-spec` and `@cml/beat-scheduler` exist).
