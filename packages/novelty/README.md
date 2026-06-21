# @cml/novelty

Novelty as **abstract structural fingerprints** + an **explainable verdict**. First increment of the
Agent 8 redesign in
[`documentation/12_system_redesign/14_agent_8_novelty_auditor.md`](../../documentation/12_system_redesign/14_agent_8_novelty_auditor.md).

> **The fact that matters most (§2):** today's Agent 8 is an expensive, seed-only, magic-number gate
> that runs *after* the costliest artifact in the pipeline — and in production it is **switched off**
> by a `similarity_threshold_default: 1.1` that can never fire (`1.1 ≥ 1` → skip). The most elaborate
> novelty machinery in the pipeline is dark code.

The redesign replaces it with novelty as a *generation-time constraint*: distill the seeds into an
abstract "do-not-reproduce" ledger, check novelty on a cheap **structural skeleton** before any full
CML is elaborated, compare *abstract structure* (not surface text) against the seeds **and** a
genre-cliché ledger **and** a cross-run store, and return an explainable `distinct / variation /
clone` verdict — not a weighted decimal crossing an arbitrary line.

This package is the **offline foundation** — pure, no LLM, **NOT wired into the pipeline**. The LLM
fingerprint extractor + structural judge (§4.3) and the live `NOVELTY_MODE` flag (§9.7) are gated
later phases.

## What it provides

- **The `Fingerprint` schema** ([`schema/novelty_fingerprint.schema.yaml`](../../schema/novelty_fingerprint.schema.yaml))
  — *"the schema the whole redesign is built on"*: axis, mechanism family, false-assumption pattern,
  discriminating-test shape, inference shape. ajv-strict.
- **Two reference ledgers** ([data/](data/)) — abstract fingerprints for the **14 seed CMLs** plus a
  hand-authored **genre-cliché ledger** (butler-did-it, evil-twin, secret-will, detective-did-it,
  it-was-staged, séance-fakery, spare-key-relock, rehearsed-alibi) — the §4.4 corpus a seed-only
  check is blind to.
- **`judgeNovelty(skeleton, corpus)`** ([compare.ts](src/compare.ts)) — the deterministic structural
  compare → an explainable `NoveltyVerdict`. A mystery's identity lives in the *false-assumption
  pattern* + the *trick* (mechanism / inference), so sharing the belief **and** a trick element →
  `clone`; the belief alone, or two trick elements → `variation`; only coarse overlap → `distinct`.
- **`NoveltyStore`** ([store.ts](src/store.ts)) — the append-only cross-run store that catches mode
  collapse (run #200 resembling run #50) — the guard the seed-only design structurally cannot have.

## The spike (§9.1), and its result

[`scripts/agent8-novelty-spike.mjs`](../../scripts/agent8-novelty-spike.mjs) — both parts offline,
no LLM:

- **Part 1 — confirm the bug.** Reads the live `generation-params.yaml` and reproduces the exact skip
  logic: `similarity_threshold_default = 1.1`, `shouldSkipNovelty = (1.1 ≥ 1) = true`. **The audit
  never runs.** Confirmed dark.
- **Part 2 — the structural signal.**
  - **14/14** seed-clones caught at the cheap skeleton stage (before any 8000-token elaboration).
  - **Cliché catch rate — seed-only (today): 4/8 (50%); with the cliché ledger: 8/8 (100%).** The
    four the seed-only check is blind to — `butler_did_it`, `evil_twin`, `the_detective_did_it`,
    `rehearsed_alibi` — are caught only with the ledger. (The other four genuinely *are* seed tricks,
    e.g. séance-fakery = *The Hound*, spare-key = *The Second Key* — an honest result: the cliché
    ledger's job is both to catch the seed-invisible tropes *and* to name the ones that overlap.)
  - Cross-run collision flagged `clone` against a `prior_run`, not a seed.
  - Every non-`distinct` verdict carries a nearest neighbour, the shared structure, and a concrete
    `divergence_directive` — zero unexplained numeric rejections.

```bash
node scripts/agent8-novelty-spike.mjs
```

## Tests (12)

The §9.4 invariants: ledgers load + schema-validate (unique ids, malformed rejected); **a seed-clone
skeleton is ALWAYS flagged** (every seed fed back ≠ `distinct`); a deliberate *Big Bow Mystery*
paraphrase is caught from the skeleton alone; the cliché ledger catches what the seed-only check
misses; cross-run mode collapse detected; the verdict is explainable; `judgeNovelty` is deterministic.

```bash
npm run -w @cml/novelty test         # vitest (12 tests)
npm run -w @cml/novelty type-check   # tsc --noEmit
npm run -w @cml/novelty build        # tsc → dist/ (gitignored)
```

## What's next on the §9.3 ladder (gated)

1. **Turn the light on** — the live `NOVELTY_MODE = off|shadow|active` flag in `agent3-run.ts`,
   decoupling "is the audit on" from `threshold ≥ 1`; default `shadow`.
2. **LLM extractor** (§4.3 spike 2) — Opus emits the five-field fingerprint from a CML/skeleton under
   structured output, replacing the hand-authored seed ledger.
3. **Skeleton stage in Agent 3** — emit + gate on the fingerprint *before* full CML elaboration.
4. **LLM structural judge** on near neighbours; activate on `clone`.
5. **Delete the dead numbers** — `similarity_threshold_default`, `fail_delta`, the five-way weights.
