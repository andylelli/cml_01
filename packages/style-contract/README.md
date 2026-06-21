# @cml/style-contract

The **Style Contract** — tone as an upstream contract signed once at grounding, plus the
deterministic usability signal that replaces Agent 6.5's word-count gate. First increment of the
Agent 6.5 redesign in
[`documentation/12_system_redesign/12_agent_65_world_builder.md`](../../documentation/12_system_redesign/12_agent_65_world_builder.md).

> **Thesis (§4):** voice, register, humour, and emotional arc are not late-stage synthesis problems
> to author at step 90 and gate on hitting 200 words — they are *upstream commitments* fixed once as
> a small canonical contract the user signs at spec time, and threaded into every generative agent.
> *"The voice is an axiom stated up front, not a theorem discovered at step 90."*

This package is the **offline, additive Phase-0 foundation** — pure, no LLM, **NOT wired into the
pipeline**. It does not delete anything: the live runner's `worldDocument`, length floors,
`FALLBACK_PARAGRAPHS` padders, and `applyWorldFirstSceneEnrichment` all still run. It only builds the
zero-risk core the later phases depend on.

## What it provides

- **The schema** — [`schema/style_contract.schema.yaml`](../../schema/style_contract.schema.yaml):
  the canonical voice artifact (register, comparables, narrative distance, humour ceiling, hard
  `proseConstraints`, conditioning exemplars), ajv-strict (`additionalProperties: false`).
- **`deriveStyleContract(spec)`** ([sign.ts](src/sign.ts)) — the **deterministic** signing pass.
  User-supplied enums win; where the user is silent it derives defaults from the free-text premise/
  theme/era (`§4.1: "most of it is a choice, not a generation"`). Pure — same spec → byte-identical
  contract. Exemplar *generation* is the one part that needs a model, so it is left empty here (the
  gated live phase, §4.2). `validateStyleContract` / `assertStyleContract` enforce the schema.
- **The usability signal** ([usability.ts](src/usability.ts)) — the deterministic half of §4.3 that
  replaces the length floors:
  - `themeIsAClaim(theme)` — a theme is a *claim* (subject + predicate), not a noun-phrase title.
    Accepts *"How ambition corrupts loyalty"*, rejects *"A Country House Murder"*.
  - `checkArcCoverage(arc, beats)` — pass/fail on whether the arc references every structural beat,
    **not** on word count. A tight excellent arc PASSES; a bloated generic one that never reaches the
    climax FAILS — the §6 proof the gate now means something (inverting today's behavior).
- **The contract→agent accessor** ([accessor.ts](src/accessor.ts)) — `readStyleContract(cml)` (one
  typed read, so no agent re-derives voice from raw JSON, the §3.D wound) plus
  `sameContract` / `contractFingerprint` backing the §9.4 load-bearing invariant: *every agent
  receives the byte-identical contract signed at grounding.*

## Tests (19)

- **Signing heuristics & purity** — premise → register/humour/diction/rhythm; user choice overrides
  derivation and is excluded from `derivedDefaults`; same spec → identical contract; every signed
  contract is schema-valid.
- **Spike A (§9.1) — expressibility** — two distinct premises ("wry country-house Sayers", "cold
  psychological Highsmith") hand-authored end-to-end and validated; the schema rejects bad enums,
  missing `proseConstraints`, unknown keys, out-of-range humour, and a 5th exemplar.
- **Usability gate-inversion** — `themeIsAClaim` accepts claims / rejects titles; `checkArcCoverage`
  passes the tight complete arc and fails the bloated incomplete one; the same-contract invariant.

```bash
npm run -w @cml/style-contract test         # vitest (19 tests)
npm run -w @cml/style-contract type-check   # tsc --noEmit
npm run -w @cml/style-contract build        # tsc → dist/ (gitignored)
```

## What's next on the §9.3 ladder (gated, deliberately not built here)

1. **Phase 1 — prove it late (Agent 9 first).** Thread the contract into Agent 9 prose conditioning
   (exemplars + hard constraints), behind `STYLE_CONTRACT_CONDITIONING`, with the §9.1 blind-compare
   as acceptance — the live, highest-leverage test.
2. **Phase 2 — swap the gate.** Replace the length floors + `FALLBACK_PARAGRAPHS` padders + force-set
   `validationConfirmations` with this usability signal + the voice-distinctiveness / contract-
   conformance LLM-judges.
3. **Phase 3 — thread upstream** into Agents 2 / 2b / 2c / 7 so cast, mannerisms, and locations are
   authored *in voice*.
4. **Phase 4 — retire the World Document.**

Phases 1–2 need P2 structured output + a live model; this package is the contract they bind to.
