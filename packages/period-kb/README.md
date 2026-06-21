# @cml/period-kb

A curated, versioned, year-keyed **Period Knowledge Base** + binder (`EraOracle`) and a
deterministic **anachronism linter**.

This is **Phase 0** of the Agent 1 redesign — see
[`documentation/12_system_redesign/01_agent_1_era_setting.md`](../../documentation/12_system_redesign/01_agent_1_era_setting.md)
(§9 Implementation Plan). It implements the smallest shippable, fully reversible increment:
the KB skeleton, the oracle, the linter, the strict schemas, and the §6 audit-set golden tests.

> **Status: NOT wired into the pipeline.** Nothing in `apps/` or the other `packages/` imports
> this yet. It is pure, tested, and reversible — exactly the Phase 0 contract. Phases 1–5
> (binding `era.*`/`location.*` deterministically, the constrained atmosphere call, deleting
> the run-killing realism gate, fixing scoring, exposing the oracle to Agents 6/6.5) come later
> and are gated on platform work (constrained decoding) and the Agent 3 keystone.

## Why it exists

Agent 1 today pays an LLM call to *paraphrase* period facts that are already hardcoded in
[`buildEraConstraints`](../prompts-llm/src/shared/constraints.ts), then asks the same model to
certify its own work anachronism-free — a self-audit that **hard-kills the whole run** if it's
honest. The bet of this redesign: *period facts are reference data, not creative work.* "What
forensics existed in 1931" has a correct answer that does not change between runs. So we make
that the deterministic, reviewable, improvable part — fix one line of YAML and every future
mystery inherits the correction — and keep the LLM only for atmosphere (a later phase).

## What's here

```
packages/period-kb/
  eras/<year>.yaml        # year-keyed period facts (forensics, comms, policing, transport, lighting…)
  places/<archetype>.yaml # per-archetype affordances (access points, isolation, observability…)
  schema/era.schema.yaml  # strict JSON-Schema (ajv) — a typo'd key fails the load
  schema/place.schema.yaml
  src/
    oracle.ts             # bindEra / bindPlace / checkAvailability / pickNearestYear
    loader.ts             # YAML load + strict ajv validation + caching
    anachronism-linter.ts # deterministic checker (strips, never invents) with a backstop
    legacy-projection.ts  # Phase 1/2 bridge: reproduces the old era.*/location.* shapes
    internal.ts           # shared term normalization + availability resolution
    types.ts
    index.ts
```

## Usage

```ts
import { bindEra, bindPlace, checkAvailability, isAvailable, lint, loadEraEntry } from "@cml/period-kb";

// Bind authoritative period facts (deterministic, provenance-tagged).
const era = bindEra(1931);            // { entry, exact: true, provenance: "kb:v0.1.0/1931", … }
const place = bindPlace("country_manor");

// Unseeded years/archetypes fall back to the NEAREST anchor WITH A WARNING — never a silent default.
bindEra(1907);                        // warns: nearest anchor 1931 (Δ24y); exact: false

// The shared fairness oracle: "was X a means available in year Y?"
isAvailable(1931, "fingerprinting");  // true
isAvailable(1931, "DNA swab");        // false
checkAvailability(1931, "telephone"); // { available: true, caveat: "party lines… no records", … }

// The anachronism linter (checker, not generator): flags, and in strip mode only ever removes.
lint("The fluorescent light hummed.", loadEraEntry(1931)).violations; // [{ term: "fluorescent_lighting", … }]
```

`bindEra`/`bindPlace`/`checkAvailability` accept `{ onWarn }` to capture fallback warnings
instead of writing to `console.warn`.

## Adding a year or archetype

1. Add `eras/<year>.yaml` (or `places/<archetype>.yaml`) following an existing file.
2. `npm test` — `kb-data.test.ts` validates it against the strict schema, and
   `audit-set.golden.test.ts` ensures it doesn't regress the period-accuracy golden.
3. Cite your facts in `sources:` so the entry is auditable and defensible.

## Build & test

```bash
npm run -w @cml/period-kb test         # vitest (52 tests)
npm run -w @cml/period-kb type-check   # tsc --noEmit
npm run -w @cml/period-kb build        # tsc → dist/ (gitignored)
```

## Known limitations / deferred decisions

These are the open questions from the redesign plan (§9.6), intentionally **not** answered in
Phase 0 because they only matter once the package is wired in:

- **Year resolution.** The brief gives a *decade* today; the KB is *year*-keyed. Phase 1 decides
  whether to ask upstream for a year or pick a representative year per decade.
- **KB versioning.** `KB_VERSION` is pinned per-call into provenance (`kb:v0.1.0/1931`). Whether
  runs pin the KB version for reproducibility vs. always-latest is a Phase 1 decision.
- **Coverage.** Only `1931` and `country_manor` are seeded — enough to stand up and test the
  machinery. Broadening coverage is data work, not code work, by design.
