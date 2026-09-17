# UI-003 — THE WORKSHOP: A REVIEW

**2026-09-17.** Every figure MEASURED in the running app at 1280×720 against a live API, or read from
source. Companion to [UI-001](UI-001-design-system.md) (the design system) and
[UI-002](UI-002-rebuild-plan.md) (the rebuild, now closed at 30/30).

---

## 0. THE COMPLAINT, AND WHAT IS ACTUALLY BEHIND IT

> *"The workshop design looks like the old design."*

Correct, and the reason is specific: **UI-002 item 27 remapped the palette, not the composition.**
1,088 class uses were moved from slate/blue onto the design tokens, so every colour is right and
every *shape* is unchanged — `text-sm font-semibold` labels over small grey body text, hairline
cards, no `t-section` headers, no step badges, no display serif. It is the old console wearing the
new colours.

That is the visible half. The measurements below found a structural problem underneath it that
matters more, and which a restyle alone would have preserved.

---

## 1. WHAT THE SCREEN IS ACTUALLY SPENDING ITSELF ON

MEASURED, Review tab, 1280×720:

| | share of viewport |
|---|---:|
| tab strips (three of them, stacked) | **23%** |
| sidebar | **19%** |
| workspace rail | **18%** |
| app header | 9% |
| **chrome total** | **68%** |
| content column | 32% |

**39 buttons on screen at once.** The content in that 32% was two sentences and an empty card.

This is not a styling problem. Two thirds of the window is navigation.

---

## 2. THREE NAVIGATION SYSTEMS, ONE SET OF DESTINATIONS

| system | items |
|---|---:|
| sidebar | 13 |
| main tabs | 6 |
| review sub-tabs | 8 |
| advanced sub-tabs | 6 |
| **total targets** | **33** |

**The sidebar navigates nothing of its own.** `setView()` sets `currentView`, and `currentView` is
read by exactly one thing — a watcher that sets `activeMainTab` and a sub-tab
(`useWorkshopState.ts:882`). Its 13 entries are aliases for tab + sub-tab pairs that are already on
screen, two inches to the right.

### 2.1 And the two systems watch each other

```
setView() ─────────────► currentView
                             │  watch(currentView)
                             ▼
              activeMainTab / activeReviewTab / activeAdvancedTab
                             │  watch(activeMainTab), watch(activeReviewTab), …
                             └──────────► setView()   ← back to the top
```

Four watchers in a cycle. It does not spin forever only because Vue skips a write when the value is
already equal — **it terminates on value equality, not by design.** Every hop calls `persistState()`
and `logActivity()`.

MEASURED with a single click on the sidebar's *Cast*, on a freshly loaded page:

| | |
|---|---:|
| POSTs to `/api/logs` | **2** |
| writes to `localStorage` | **3** |

For one click, on a control whose only job is to set a tab that was already visible.

> *Probe note.* The first measurement was taken with instrumentation applied twice over a previous
> wrap and reported 4 writes and 1 POST. Re-run on a clean page with a single wrap, the figures are
> above. A count from a probe you just wrote is a claim about the probe.

---

## 3. DO WE NEED ADVANCED AND EXPERT?

### Expert — **no.**

MEASURED: `isExpert` gates exactly **three** things, and all three are already inside the Advanced
tab, which is itself already gated:

1. a badge reading *"Expert Mode"*;
2. a `<details>` block, *"Raw Artifacts (Expert)"*, dumping artifact JSON — which the **Artifacts**
   sub-tab next to it already shows;
3. `<DebugPanel>`.

A whole third mode, a second checkbox and a branch in the state machine, for a badge and two panels
that could sit in the tab they are already in.

### Advanced — **the flag, yes. The toggle, no.**

`isAdvanced` gates 22 places and draws a real line: reader on one side, operator on the other. But
the *control* is now circular, and B13 made that visible:

**B15 — turning Advanced off while inside the Workshop strands you.** VERIFIED in the browser: the
nav drops to `Create · Inspiration · My Cases` while the Workshop is still the rendered view. You are
on a page the application no longer lists. Not a trap — the other three still work — but the state is
incoherent, and it is a direct consequence of sharing `mode` (B13). Fixing one bug exposed another.

**The Workshop is only reachable when advanced mode is on.** Being inside it therefore already means
advanced. The toggle inside is the thing that let you in.

---

## 4. THE CONSOLE NOW DUPLICATES THE CONSUMER VIEWS

UI-002 built Create, Inspiration, My Cases and the Case File. Several console panels became second
implementations of the same job. MEASURED by comparing which data each reads:

| data | console | consumer view | verdict |
|---|---|---|---|
| samples | Advanced ▸ Samples | **InspirationView** | duplicate; the consumer one is better |
| `characterProfilesData` | Review ▸ Cast | **CaseView** | duplicate |
| `locationProfilesData` | Review ▸ Locations | **CaseView** | duplicate |
| `temporalContextData` | Review ▸ Era & Culture | **CaseView** | duplicate |
| `proseData` | Review ▸ Prose | **CaseView** | **claim corrected on inspection — NOT a duplicate.** The *reading* is, but the panel also carries the PDF version selector (short/medium/long) and *Export all versions*, which are operator-only and have no equivalent anywhere else. Kept |
| story PDF | **Export ▸ *and* Review ▸ Prose** | CasesView, CaseView | the console duplicates *itself* |
| project list / load | Project tab | My Cases | overlapping |
| run progress | Generate tab | CaseView's `ProgressTrack` | overlapping |

**This is not an argument for deleting Review.** It is an argument for the two being *different
things*: CaseView is the **reader's** view of an artifact — prose, sensory detail, spoilers held
back. The console's job is the **operator's** view — the raw payload, the validation verdict, what
the LLM was asked and what it said. Today Review is a worse copy of the reader's view.

---

## 5. WHAT WORKS, AND MUST SURVIVE

Nothing below has an equivalent anywhere else in the app.

| | why it stays |
|---|---|
| **CML viewer** | the concealment model itself. Nothing else shows it |
| **Validation panel + fair-play + novelty audit** | the release gate's verdict, per artifact |
| **LLM logs** | what each agent was asked and what came back. The only window on prompt behaviour |
| **Run history / events** | what actually happened, in order, with failures |
| **Quality**: ScoreCard, PhaseBreakdownTable, ScoreTrendChart | the scoring report and its trend |
| **Raw artifact JSON** | when the rendered view is lying, this is how you find out |
| **The full spec** | axis, narrative style, `proseBatchSize` — a paid run's real parameters |
| **Regenerate one stage** | re-run Agent N without a fresh run |
| **Game-pack export** | the only place that produces it |
| **Workspace rail: status + validation** | genuinely useful beside the content |

---

## 6. WHAT DOES NOT WORK, OR IS NOT NEEDED

| | finding | call |
|---|---|---|
| **The sidebar** | 13 items, **0** destinations of its own; drives the watcher cycle in §2.1 | **cut** |
| **Expert mode** | gates a badge, a JSON dump the Artifacts tab duplicates, and DebugPanel | **cut the mode**, keep the two panels under Advanced |
| **The Advanced/Expert checkboxes** | raw, undesigned, and circular (§3, B15) | **cut from the Workshop**; entering the Workshop *is* the switch |
| **Advanced ▸ Samples** | duplicate of Inspiration | **cut** |
| ~~**Review ▸ Prose**~~ | ~~duplicate of CaseView's reader~~ | **WITHDRAWN — the premise was wrong.** Inspecting it before cutting found the PDF version selector and *Export all versions*, which exist nowhere else. Only the reading is duplicated. **Kept** |
| **`currentView` + `setView`** | a whole parallel state with one consumer, which is a watcher that writes back | **cut** |
| **Connection: Reconnect / Disconnect** | manual SSE controls. `useRunProgress` reconnects on its own and reports it | **cut** — INFERRED, see §9 |
| **Six main tabs** | Project/Spec/Generate are one workflow; Advanced holds six unrelated things | **merge to four** |

---

## 7. THE PROPOSAL

### 7.1 One navigation system, four tabs

| tab | holds | from |
|---|---|---|
| **Build** | project, the full spec, start a run | Project + Spec + Generate |
| **Review** | the eight artifact panels | unchanged |
| **Advanced** | CML, artifacts, logs, history, quality | unchanged, minus Samples |
| **Export** | game pack, artifact export | unchanged |

No sidebar. The workspace rail stays and is restyled.

**Revised while building.** The first draft proposed *Build · Inspect · Diagnose · Export*, folding
Review and Advanced into two new groupings and removing the sub-tab strips entirely. Only the Build
merge survived contact with the work, and it is the one with a reason beyond tidiness: opening a
project, configuring the spec and starting a run is one linear workflow, and three tabs meant hopping
between them to do a single thing.

Re-grouping Review and Advanced was dropped because it buys chrome and costs comprehension: an
operator comparing the cast against the clue list wants to switch between them, and stacked sections
make that a scroll. Renaming familiar groups to *Inspect* and *Diagnose* would also have cost the one
person who uses this console their muscle memory, for no measured gain.

### 7.2 Compose it like the rest of the app

The tokens are already right; the shapes are not. Apply what the boards actually specify:
`StepCard` with a badge and a `t-section` header, the display serif for panel titles, the generous
card rhythm, and `AppButton` instead of hand-rolled `rounded-md border` buttons.

**Density is still a feature** (UI-001 §8). A table of run events keeps its table. What changes is the
frame around it, not the information in it.

### 7.3 The state that goes with it

- delete `currentView`, `setView`, the `View` type and the four watchers of §2.1;
- delete `mode: "expert"`, `isExpert`, `expertChecked`, `handleExpertToggle`;
- the Workshop sets `mode = "advanced"` on entry and never offers to turn it off (fixes **B15**).

---

## 8. WHAT THIS CHANGED — PREDICTED, THEN MEASURED

Targets were written before building. Measured afterwards at the same 1280×720, same instrumentation.

| | before | target | **after** | |
|---|---:|---:|---:|---|
| navigation targets | 33 | 4 | **17** | ✗ — see below |
| chrome share of viewport | 68% | <40% | **31%** | ✓ |
| buttons on screen | 39 | <20 | **29** | ✗ |
| `localStorage` writes per navigation | 3 | 1 | **0** | ✓ beaten |
| `/api/logs` POSTs per navigation | 2 | 1 | **0** | ✓ beaten |
| modes | 3 | 2 | **2** | ✓ |
| sidebar share | 19% | 0% | **0%** | ✓ |
| tab strips share | 23% | — | **6%** | ✓ |
| headings in the view | 0 | ≥1 | **1** | ✓ |

**Two targets missed, and the targets were wrong rather than the work.**

*Navigation targets, 17 not 4.* The "4" counted only top-level tabs and quietly assumed the review's
8 sub-tabs would collapse into stacked sections. They should not: an operator comparing the cast
against the clue list wants to switch between them, not scroll past one to reach the other. Four
**tabs** was achieved — Build · Review · Advanced · Export — and 13 sub-tabs remain under Review and
Advanced by design. The honest figure is 4 tabs + 13 sections.

*Buttons, 29 not under 20.* The target was set by counting buttons on a near-empty screen and
assuming most were navigation. With the sidebar gone the remaining 29 are overwhelmingly **actions** —
Create project, Load, Regenerate, Export, Reconnect — not chrome. Counting buttons was the wrong
instrument; chrome share is the right one, and it more than met its target.

---

## 8b. DOES IT ACTUALLY WORK? A FUNCTIONAL PASS

§8 measured chrome and kept the tests green. Neither of those is the same as **using** it, so this is
a click-through of every panel against a real project — `proj_035fdeda`, 12 artifacts, live API.

### Every panel, with real data

| tab | panel | rendered | evidence |
|---|---|---|---|
| Review | Cast | ✓ | 7 named suspects |
| Review | Background | ✓ | 2,216 chars of backdrop |
| Review | Hard Logic | ✓ | 3 devices, each with its law |
| Review | Locations | ✓ | primary + 4 rooms |
| Review | Era & Culture | ✓ | 3,358 chars |
| Review | Clues | ✓ | 4,372 chars, with reveal chapters |
| Review | Outline | ✓ | 4,433 chars |
| Review | Prose | ✓ | 8,391 chars, chapter 1 of 10, nav works |
| Advanced | CML | ✓ | **21,778 chars** of real CML |
| Advanced | Artifacts | ✓ | status dashboard, View + Regenerate per artifact |
| Advanced | LLM Logs | ✓ | **134 calls**, with tokens and cost |
| Advanced | History | ✓ | 9,567 chars of run events, including a failure |
| Advanced | Quality | ✓ | per-phase scores, durations and costs |
| Export | Story PDF | ✓ | **135,216 bytes**, `application/pdf` |
| Export | Game pack | ✓ | correctly **disabled** — the artifact genuinely 404s |
| Export | Artifact JSON | ✓ | selectable list |

**Everything works.** No panel is broken, and the empty states that do appear are correct.

**Not exercised, deliberately:** *Generate* and *Regenerate* start paid pipeline runs. They were not
clicked. *Reconnect / Disconnect* remain unexercised for the reason in §9.

### FOUR PROBE ERRORS, ALL MINE, ALL CAUGHT BEFORE THEY BECAME FINDINGS

Recorded because the ratio is the point — I nearly reported three defects that did not exist.

1. **"No project has any artifact."** My survey called `/api/projects/:id/cast` instead of
   `…/cast/**latest**`. Every endpoint 404'd, and the conclusion was pure probe.
2. **"No CML, novelty audit or game pack in any of the 38."** The corrected survey fired 570
   concurrent fetches; some failed silently under the browser's connection limit. Re-run **serially**
   for one project, CML was there all along.
3. **"CML returns 403 — the endpoint is gated."** It is, but the client sends `x-cml-mode: advanced`
   and my raw `fetch` did not. Not a defect: my request was the thing that was wrong.
4. **"LLM Logs is broken — the API returns 5 entries and the panel shows zero."** Sampled 600ms after
   the click. Waiting properly: **134 calls**, loaded correctly. A panel is not broken because you
   read it too early.

### One thing the pass DID find

**`Expert` labels survived the mode.** A badge reading *Expert* on `DebugPanel`, a `Raw Artifacts
(Expert)` summary, *"Expert mode enables editing"* under the CML viewer, and `CML (Advanced/Expert)`
in the export list — all still on screen after the mode was removed. A badge naming a mode the
product no longer has is worse than no badge. Cleared.

### And one thing worth knowing about the mode

The CML endpoint is gated **server-side** — `ALLOWED_CML_MODES`, 403 otherwise — which is a **fourth**
gate on advanced mode beyond the three §3 removed. It is the one that should stay, and it is why
cutting the *flag* rather than only the *toggle* would have broken CML access.

But the client sends **`x-cml-mode: "advanced"` hard-coded** (`api.ts:157`), regardless of the user's
actual mode. So the gate exists and this client unconditionally defeats it. Not a security concern in
a local operator tool, but it is not doing what it looks like it is doing, and anyone reading the
server would reasonably assume otherwise.

### Useful to the user? — now with evidence rather than assertion

§5 justified each feature by what it *shows*. This pass checked whether it shows anything:

| verdict | |
|---|---|
| **Earns its place** | CML viewer (21K), LLM logs (134 calls, cost), History (a real failure recorded), Quality (per-phase cost and duration), Raw artifacts, Story PDF, the full spec |
| **Works, but thinner than the consumer view** | Review ▸ Cast lists 7 names; **CaseView** shows the same people with summary, public persona, voice and a spoiler gate. The console's version is the weaker one |
| **Correctly empty** | Game pack — no artifact exists for any project tested |
| **Still unproven** | Reconnect / Disconnect (§9) |

---

## 8c. THE FIVE THINGS STILL NOT INTUITIVE — AND WHAT HAPPENED TO THEM

Raised after §8b, when the question was whether the console is *intuitive* rather than merely
smaller. Four were built; one was withdrawn on inspection.

| | finding | outcome |
|---|---|---|
| **1** | The story is readable in **two** places — Review ▸ Prose and the case file — and nothing said which was which | **Built.** The panel now says it is the version and export tool, and points at My Cases for reading |
| **2** | ~~Review ▸ Cast is the weaker twin of the case file's people view~~ | **WITHDRAWN — premise wrong.** The 399-character reading was the COLLAPSED state. Expanded, it is **17,819 characters across 7 disclosures, including motive, private secret and alibi** — more than the case file shows, and correct for an operator. My fifth probe error of the session, caught before acting |
| **3** | Sub-tabs speak pipeline: *Hard Logic*, *Era & Culture* | **Built.** Labels only — **ids unchanged**, so logs, artifact names and every watcher keep matching. *Hard Logic → Method*, *Era & Culture → Period*. Their descriptions repeated the term rather than explaining it ("Inspect generated hard-logic devices"); both rewritten to say what the panel is for |
| **4** | Build is a long scroll after the three-tab merge | **Built.** A *Jump to* bar — Project · Spec · Generate — with `scroll-mt` so a heading lands clear of the sticky tab strip. The length is the price of the merge; this pays it |
| **5** | A disclosure inside a disclosure: *Validation details* card with a *Show details* link beside the title | **Built.** The whole header is now the control, with one chevron and `aria-expanded` |

**On #3, the rule applied:** a label is what the operator reads; an id is what the system matches on.
Renaming both would have been a refactor with a vocabulary change hidden inside it.

---

## 9. WHAT THIS REVIEW COULD NOT DETERMINE

- **Whether anyone uses the sidebar.** `logActivity` records `view_change` with the view name, but
  not which control caused it — and the tab watchers call `setView` too, so every tab click is
  recorded as a view change as well. The log cannot separate them. The case for cutting it rests on
  it having no destinations of its own, not on usage.
- **Whether Reconnect/Disconnect are ever needed.** INFERRED that they are not, because
  `useRunProgress` handles reconnect and reports it in the status line. Not proven: no run has been
  started from the rebuilt UI, so the reconnect path has not been exercised live. **Cut it last, and
  after a real run.**
- **Whether the quality panels are read.** They are kept on the strength of what they show, not on
  evidence of use.

---

## 10. STATUS

| # | item | status | commit |
|---|---|---|---|
| W1 | This review | **DONE** | — |
| W2 | Cut the sidebar, `currentView`/`setView` and the watcher cycle | **DONE** — 0 log POSTs and 0 storage writes per click, from 2 and 3 | `266b48dc` |
| W3 | Cut expert mode; fold its two panels under Advanced | **DONE** — and a THIRD gate on the same flag removed | `266b48dc` |
| W4 | Four tabs — **Build** · Review · Advanced · Export | **DONE** — the Inspect/Diagnose regroup was dropped, §7.1 | `e8f86c9a` |
| W5 | Recompose panels onto the design system | **DONE** — 107 shape remaps | `b4d04b9f` |
| W6 | Cut the panels the consumer views duplicate | **partial** — Samples cut; **Prose WITHDRAWN**, the premise was wrong (§4) | `b4d04b9f` |
| W7 | Fix **B15** — entering the Workshop is the switch | **DONE** — verified in the browser | `266b48dc` |
| W8 | Re-measure §8 and record the result | **DONE** — 7 of 9 met or beaten; both misses were wrong targets | `e8f86c9a` |

**The board is closed.** What remains is in §9 — the three things this review could not determine.
