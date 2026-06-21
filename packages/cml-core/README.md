# @cml/cml-core

A **typed logical core for CML** + three deterministic **fair-play engines** (timeline,
deducibility, uniqueness) and a `certify()` function that turns them into a `FairPlayCertificate`.

This is the **keystone (P1)** of the Agent 3 redesign — see
[`documentation/12_system_redesign/07_agent_3_cml_generator.md`](../../documentation/12_system_redesign/07_agent_3_cml_generator.md)
(§4.2–§4.5, §9). It is the §9.1 **go/no-go spike**: prove that a deterministic deducibility +
uniqueness checker can be written over a typed CML and reproduce the §4.6 worked example.

> **Status: pure, zero external deps, NOT wired into the pipeline.** Nothing in `apps/` or other
> `packages/` imports this yet. The remaining steps (tool-call loop, constrained-decoding emission,
> flipping the exit condition, deleting `normalizeCml`/backfill) require the structured-output
> platform (P2) and live-model work and are deliberately deferred. The library earns trust
> touching nothing first (§7 of the redesign).

## The bet

A fair-play whodunit is a small theorem: the clues must **entail the solution, and entail it
uniquely.** Today Agent 3 asks one LLM to hold that whole proof in its head and checks only that
the *schema* is valid; the actual "does it solve, and uniquely?" question is deferred to downstream
LLM auditors who can only sample. This package makes the question **decidable**:

```
propose (LLM)  →  certify (these engines)  →  counterexample  →  repair (LLM)  →  certify  → …
                                            └── until: consistent ∧ deducible ∧ unique
```

## The engines

| Engine | Decides |
|---|---|
| [`checkTimeline`](src/engines/timeline.ts) | crime window non-empty; no person in two places at once; no one both has and lacks a capability |
| [`checkDeducibility`](src/engines/deducibility.ts) | every elimination is justified by its premises; no clue used before the reader has it; the path singles out the named culprit |
| [`checkUniqueness`](src/engines/uniqueness.ts) | exactly one suspect survives the clue set, and it is the named culprit |

A suspect is **eliminable** for either reason: **opportunity** (their precluding presence covers the
crime window) or **capability/access** (a clue proves they lack a capability the crime required — a
key to the locked room, the knowledge to dose the poison). This covers the genre's two load-bearing
elimination structures — alibi-timing *and* locked-room / unique-means.

## Coverage (broadened fixtures)

| Fixture | Structure | Broken → Repaired |
|---|---|---|
| [clock-set-fast](src/fixtures/clock-set-fast.ts) | temporal (clock fast; "boarded ≠ departed") | `{Carrow, Vale}` → `{Carrow}` |
| [locked-study](src/fixtures/broadened.ts) | capability (who held a key) | `{Reeve, Dunmore}` → `{Reeve}` |
| [unique-means](src/fixtures/broadened.ts) | capability (pharmacological knowledge) | `{Voss, Calloway}` → `{Voss}` |
| [large-circle](src/fixtures/broadened.ts) | 6 suspects, temporal alibis + capability mixed | `UNIQUE {Marsh}` |

The live propose→verify→repair loop has converged in one turn against the real model on **both** a
temporal case (`extend_presence`, gpt-4o-mini + gpt-4.1) and a capability case
(`establish_capability`, gpt-4.1) — see
[agent3-certify-loop-spike-result.md](../../documentation/12_system_redesign/agent3-certify-loop-spike-result.md).

`certify(cml)` runs all three and returns `{ ok, timelineConsistent, deducible, unique, uniqueAmong, failures[] }`.

## The executable spec (§4.6)

The [clock-set-fast fixture](src/fixtures/clock-set-fast.ts) is the worked example, hand-authored
as a typed CML in two states — and the [golden test](src/__tests__/clock-set-fast.golden.test.ts)
asserts the whole thesis in one line:

```ts
certify(clockSetFastBroken()).ok    // false — SOLUTION_NOT_UNIQUE: {Carrow, Vale}
certify(clockSetFastRepaired()).ok  // true  — UNIQUE: {Carrow}
```

The "boarded ≠ departed" bug — Vale's porter-log boarding at a single instant does **not** cover the
08:00–08:12 administration window, so the clues cannot rule him out — is caught **deterministically,
every time, before any prose exists.** That is exactly the gap the current system's
`evidence_clue_backfill_threshold` counts *after the fact* and hopes Agent 6's blind reader catches.

## Usage

```ts
import { certify, checkUniqueness, type TypedCml } from "@cml/cml-core";

const cert = certify(myTypedCml);
if (!cert.ok) {
  // cert.failures gives the exact, model-readable counterexample to repair against, e.g.
  // "uniqueness: SOLUTION_NOT_UNIQUE: {carrow, vale} … The reader cannot rule out vale."
}
```

## What this is *not* (yet)

Per §9.6, the engine deliberately uses a small, decidable logic — interval constraints over a single
timeline plus boolean capability/access facts — which now covers the genre's two main elimination
structures (alibi-timing and locked-room / unique-means). Richer mechanisms (multi-step
substitution, identity swaps, quantifiers) and a SAT/SMT backend for very large circles remain open
questions, not yet built. Still ahead on the §7 ladder: emitting the typed core alongside the prose
under constrained decoding, then flipping the exit condition to the certificate. The LLM tool-call
loop (§4.4) is proven live; the corpus shadow-run (§9.5) is done
([findings](../../documentation/12_system_redesign/agent3-corpus-shadow-findings.md)).

## Build & test

```bash
npm run -w @cml/cml-core test         # vitest
npm run -w @cml/cml-core type-check   # tsc --noEmit
npm run -w @cml/cml-core build        # tsc → dist/ (gitignored)
```
