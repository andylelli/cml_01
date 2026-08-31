# WF-002 — boundary audit, slices A / B / F

**Run:** `wf_8687739c-8e5` · **Date:** 2026-08-31
**Agents:** 13 · **Subagent tokens:** 1,603,555 · **Tool uses:** 581 · **Duration:** 35.6 min
**Script:** `boundary-audit-abf-wf_8687739c-8e5.js`
**Shape:** 3 tracers (pipelined) → 3 adversarial refuters each → synthesis

---

## Why sliced this way

Every significant bug found on 2026-08-29/30 lived at a **boundary**, not inside an agent: two
numbering schemes disagreeing, a prompt disagreeing with its gate, a validator disagreeing with its
injector, a flag disagreeing with its consumer. Chunking an audit by agent (1/2, 3/4) would
systematically miss that class — `cml` is referenced by 184 source files, `cast` by 125, `clues` by
105, so artifacts are read far outside the agent that produced them.

Slices run: **A** coordinate systems · **B** clearance lifecycle · **F** demand/enforcement pairs.

## Result: 9 findings adjudicated, 3 survived, 6 refuted

### THE HEADLINE — and it was a bug introduced the same day

**The clearance trim treated the CULPRIT as a clearable suspect.** The A_76 §5 call-site filter
excluded victims and detectives — and everyone except the murderer.

```
culprit present in the trim's cast list: 31/31 stored books
```

A sentence naming the murderer beside the word "cleared" was classified as a redundant clearance and
deleted. It reaches a real manuscript: `proj_035fdeda` ch9 loses *"The test had succeeded: the
mechanism revealed, the suspects cleared, Charles Fenwick exposed."*, stranding the contrast that
follows — and the warning emitted would have claimed the MURDERER was "already cleared earlier".

Nothing shipped (flag defaults off) but `AGENT9_CLEARANCE_TRIM` was **pre-registered ON for the next
paid run**. Fixed by reuse rather than a fifth filter: the call site now passes
`computeEliminationSuspects`, which already excludes culprits, detectives and victims and is the same
list the floor and regen pass consume. **Culprit in list 0/28; removals 7 → 6**, exactly the one bad
deletion.

### Surviving finding 2 — arc position is implemented four times

`agent7-run.ts:1209` (normalised float), two byte-identical copies in `prompt-builder.ts:205` and
`:1676` (`chapterStart-1`, 0-based), and `generate.ts:2450` (1-based anchor).

```
139 of 287 chapters (48.4%) get a different label from Agent 7 than from Agent 9
306 of 557 prompts carry both statements; 42 are flat contradictions
"REQUIRED ADVANCE (climax)" occurs 0 times in 557 prompts — climax is unreachable in 29/29 books
```

So `CHAPTER_TYPE_ADVANCE.climax` and the climax turningPoint authored in all 29 world documents are
consumed by nothing. **Not fixed** — should ship flag-gated, since collapsing to either formula
changes what chapter 9 is told it is.

### Surviving finding 3 — the floor and the gate read "suspect" from different artifacts

`computeEliminationSuspects` reads Agent 2's `castDesign` (where `roleArchetype: 'Outsider
Investigator'` outranks `role: 'suspect'`); `SuspectClosureValidator` reads `cml.CASE.cast` (where the
same person is `Suspect`). **5 of 31 runs disagree.** Latent today — output reach 0 of 197
manuscripts — but risk rises once `AGENT9_CLEARANCE_OWNERSHIP` narrows the demand and the floor
becomes the only backstop. **Not fixed.**

### Two residuals salvaged from refuted findings

- **The opening-style rotation and its classifier use different vocabularies.** 56 chapters assigned
  `time-anchor`, exactly 1 classified as such. ~55 mis-bucketed into `general-descriptive`, the
  largest shipped bucket — so `opening_style_repetition` is policing a vocabulary mismatch rather
  than repetition. Instrument-invalidating, no reader-visible effect.
- **The clearance paste glues `the ` onto a non-noun-phrase `clearance_method`.** ~5–8 of 124 stored
  values fail a head test; live firing is 0 of 28 runs today.

## THE MOST VALUABLE OUTPUT — the six refutations

> **Findings survived where a divergent computation feeds a WRITE — a deletion, an injection, a floor
> that must supply text — and were refuted where it feeds a PROMPT.**

Slice B (write-heavy) produced 2 survivors. Slice **F produced zero**: the prose prompt layer is so
over-specified and redundantly wired that a contradiction inside it is *absorbed rather than
expressed*, and in two cases a second channel carried the identical information. **Bugs in this
codebase do not live in prompt text.**

That test predicts all three survivors and all six refutations, and it is the triage rule for every
future slice: not *"do these two lists disagree?"* — they will — but *"does the divergent list feed a
write with no second channel behind it?"*

## The systemic cause

> An entity set that ought to be computed once and passed is instead **recomputed independently at
> each consumption site**. NINE components compute "who is a suspect". FOUR compute a chapter's arc
> position. Two live regexes share the name `CLEARANCE_EVIDENCE_RE` with inverted contents, one of
> them inside the file whose stated purpose is to be the single definition.
>
> *Each copy is locally correct and reviewable in isolation; the defect exists only in the gap between
> them* — which is why these survive code review, and why the ch9/ch10 roll-call survived three fixes.

## Methodological finding, and it cost six findings

**Measured code-path reach is not measured output reach, and the gap ran 100% in one direction — every
refuted finding overstated.** Multiple probes across all three slices returned FALSE NULLS from
harness bugs: heredocs collapsing backslash escapes, artifact payloads read without unwrapping, a
missing `parseClockTime` argument — each producing precisely the "nothing here" answer the prober was
hunting for.

**Rule for future slices:** no finding filed without an output-side measurement and a matched control.

## Expansion verdict

| slice | decision | reason |
|---|---|---|
| **E** role and identity | **RUN** | strongest prior — 6 of the 9 suspect-list computations remain unaudited; both surviving B findings live here |
| **D** time and mechanism | **RUN** | `parseClockTime` is the choke point for every temporal check and its vocabulary is a closed list; blast radius is a whole run |
| **C** clue lifecycle | **RUN**, narrowed to identifier joins | only 9 of 91 stored `supporting_clues` entries resolve to a clue id — the rest are prose labels |
| **G** flag integrity | **RUN** | cheap telemetry; already yielded three facts by accident |
| **H** information loss | **SKIP** | both known instances already recorded; prompt/report-shaped with no write-side consequence — the profile that produced F's three refutations |

## Operational item

`.env.local:142` holds a live-looking `ANTHROPIC_API_KEY`. The file is correctly gitignored and only
`.example` variants are tracked, but the value was read into an agent transcript during this audit.
**Rotating it is prudent.**

## Two hygiene items

- `obligation-block.ts:419` ships a dangling `MUST NOT contain: ` with an empty value in 45 of 557
  prompts.
- `deterministic-repair.ts:73` keeps a private `CLEARANCE_EVIDENCE_RE` whose own comment claims it is
  single-sourced from `shared/clearance-vocabulary.ts` while differing from it — a live drift against
  a stated invariant.
