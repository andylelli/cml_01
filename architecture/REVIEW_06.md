# Architecture Review 06 — the to-do list

**Written:** 2026-08-06 · **Type:** a working tracker, not an assessment. [REVIEW_05](REVIEW_05.md) is
the analysis; this is what is left of it plus everything it opened. Read REVIEW_05 for *why*; read
this for *what next*.

**Budget rule for this board (owner instruction, 2026-08-06): ONE RUN PER TEST.** Every item below is
costed in runs, every run carries as many ride-alongs as it can, and nothing asks for a second run of
the same thing.

---

## 1. The list

`☐` not started · `◑` part done · `👤` needs you · `⛔` decided against

### Free — no run, no spend

| # | Do this | Status | Where |
|---|---|---|---|
| F1 | Sign off the 12 ADRs. Brief is written: 11 ratifiable as-is, ADR-0012 stays `Proposed`. ~15 min | 👤 | [R05 §25](REVIEW_05.md) |
| F2 | Find the five missing calibration manuscripts, or rebuild the pairs. Corpus is 2 of 7 | 👤 | [R05 §28.4](REVIEW_05.md) |
| F3 | Finish REVIEW_05's consistency pass: stale R6/M6 gating, §26.3, §11.4 Track A, the "done this session" line | ☐ | §5 below |

### Cheap — judge calls only, no pipeline run

| # | Do this | Cost | Status |
|---|---|---|---|
| C1 | **M1c — is one rubric score stable?** Score one story 3× through the same judge. If the total moves by marks, every single-scored number in this project has an error bar nobody has drawn | ~£0.04 | ☐ |

**C1 goes first.** Everything paid below is judged by that instrument, and M1b showed the ledger's own
numbers do not reproduce. Three calls on one story is the cheapest question on the board.

### Run 1 + Run 2 — the N6 pair

One run per arm. Same premise, matched.

| # | Do this | Arm | Status |
|---|---|---|---|
| R1 | **N6 — promote `beat-scheduler`.** `AGENT7_SCHEDULER_AUTHORITATIVE=false` | control | ☐ |
| R2 | **N6 — treatment.** `AGENT7_SCHEDULER_AUTHORITATIVE=true` | treatment | ☐ |

**Rides along free on both** (nothing to enable except where noted):

| # | Reads | Settles it in one run? |
|---|---|---|
| A1 | X8 — which model answered (`model` per call in `llm-prompts-full.jsonl`) | **yes** — it is a string |
| A2 | S7 — `[R4] … firings=` coercion counters | **yes** if non-zero; 4 zeros to retire the sites |
| A3 | R5 — kill run 2 mid-flight, resume it. 0 LLM calls for restored stages | **yes** — binary |
| A4 | M3 — `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` (already set) finding count + class mix | **yes** for "does it emit"; no for "is `apply` worth it" |
| A5 | X6 — red-herring floor fires and repairs (`restored N red herring(s)`) | **yes** if it fires |
| A6 | N1 — `met_by_injection_count` on the report | **yes** — it is a count |
| A7 | N4 — reveal-binding note; X11 — `manuscript_disclosure` verdict | **yes** — both are printed |
| A8 | X4 — injector-vs-lint counters (`injections=`, `violations=`) | **yes** — emitted even at zero |

**Everything in REVIEW_05 that has never executed is on this list.** The instruments were verified
offline only; these two runs are the first time any of them meets a live pipeline.

### Runs 3–6 — one each

| # | Do this | Cost | Needs first | Status |
|---|---|---|---|---|
| R3 | **N7 — culprit-evidence regen on the edit-list channel.** Set `AGENT9_REGEN_EDIT_LIST=true` | 1 run | R1/R2 done (channel must not debut on the reveal) | ☐ |
| R4 | **N8 — phase-2 geometry contract** (`AGENT9_GEOMETRY_CONTRACT`) | 1 run | D1 decided | ☐ |
| R5 | **CS1 — promote `@cml/clue-spec` out of shadow.** CS2's clincher slot is inert until this | 1 run | — | ☐ |
| R6 | **M6 — give Agent 9 the real rubric in its prompt** | 1 run | C1 (needs a judge worth reading) | ☐ |

### Decisions after the runs

| # | Decide | After | Status |
|---|---|---|---|
| D1 | Are geometry phases 2–4 still worth their cost? (REVIEW_04 §11.4 D2) | R1/R2 | 👤 |
| D2 | X4 Option 1 — refuse an injection that violates a model-bound rule? | R3 | 👤 |
| D3 | P4 — retire `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence` | 4 runs at zero firings | ☐ |
| D4 | M5 — delete the deterministic injectors | injector firing rate near zero | ☐ |
| D5 | X1 step 2 — does the phase-2 contract move `false_solution_absent` too? | R4 | ☐ |

### Held

| # | Item | Why |
|---|---|---|
| H1 | R6 — `eval:baseline` (£4–8) | Was "after M1". M1 landed and did not repair the judge. Now gated on C1 **and** F2 — baselining against a 2-of-7 corpus buys noise |
| H2 | M2 · R4 · R9 · S4/S6 · GF | Recommended against in [R05 §11.1](REVIEW_05.md); reasons unchanged |

---

## 2. What one run can and cannot settle

Recorded because the budget rule and [ADR-0004](decisions/0004-flag-gated-default-off.md) disagree,
and the disagreement is narrower than it looks.

**One run is enough** for anything that reads as a fact: a flag took effect, a counter emitted, a
model name, a stage resumed without re-calling the LLM, a floor fired, an artifact exists. Most of the
ride-along list above is this kind. A second run tells you nothing you did not already know.

**One run is not enough** for anything that reads as a quality delta — *did the prose get better?*
Chapter count and opening-naming dominate rubric variance, so a single pair measures those and not the
lever. ADR-0004's N≥4 exists for exactly this, and REVIEW_05's own board records a single-run canary
that was confounded.

**So R1/R2 will answer "does the scheduler work and does everything emit" and will NOT answer "is the
story better".** That is worth stating before the money is spent rather than after: the honest output
of the pair is a *mechanism* verdict, and D1 should be decided on that plus cost, not on a rubric
delta from n=1. If a quality answer is wanted later it needs two more runs, and that is a separate
decision.

---

## 3. Before any run

Non-negotiable, both learned the expensive way in REVIEW_05.

1. **`npm run build:all` immediately before launching.** The worker consumes `@cml/*` through `dist`
   and Node caches modules at process start, so a run started before the build measures none of it.
   `npm test` now does this via `pretest`, but a commit after the build re-stales it.
2. **Verify the lever through its agent label in `llm-prompts-full.jsonl` on the first run.** X9 was a
   lever that could not be set at all, and it survived a code-read audit. Do not trust four runs to a
   flag nobody watched take effect on run one.

Also: `.env.local` currently has `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` set and
`AGENT7_SCHEDULER_AUTHORITATIVE` present-but-commented, deliberately — it alternates by arm.

---

## 4. Order

```
C1  M1c — is one score stable?                    ~£0.04, no run
     ↓
R1  N6 control          ─┐
R2  N6 treatment         ├─ + 8 ride-alongs, all free
     ↓                   ┘
D1  geometry phases 2–4 worth it?                  free, yours
     ↓
R3  N7 edit-list        →  D2
R4  N8 phase-2 contract →  D5
R5  CS1 clue-spec
R6  M6 rubric-in-prompt (after C1)
     ↓
H1  R6 eval:baseline — only once C1 and F2 are done
```

**Six runs, ~£9, plus four pence.** F1 and F2 are yours and block nothing except H1.

---

## 5. F3 — the REVIEW_05 consistency pass

Small, free, and listed so it is not lost. REVIEW_05's tracker rows are current; four framing
statements are not:

- the `Done this session, for context:` line still describes 2026-08-04 only;
- **R6**'s row reads *"after M1, not before"* and **M6**'s *"only readable after M1"* — M1 has landed
  and did not repair the judge, so C1/F2 are the real gates;
- §26.3's superseded note still says the board is "two moves wide: M1b and N6" — M1b is done;
- §11.4's merged order still opens Track A with *"Move 1 — rewrite the judge"*.

A `Status — 2026-08-06` block was added at the top of REVIEW_05 and is accurate; these four are what
it does not reach.
