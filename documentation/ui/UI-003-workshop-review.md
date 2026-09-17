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

### 7.1 One navigation system, four destinations

```
33 targets  →  4
```

| tab | holds | from |
|---|---|---|
| **Build** | project, the full spec, start a run, regenerate a stage | Project + Spec + Generate |
| **Inspect** | CML, validation, fair-play, novelty, raw artifact JSON | Review + Advanced ▸ CML/Artifacts |
| **Diagnose** | run history, LLM logs, quality and its trend | Advanced ▸ Logs/History/Quality |
| **Export** | game pack, artifact export | Export |

No sidebar. No sub-tab strips. The workspace rail stays and is restyled.

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

## 8. WHAT THIS IS EXPECTED TO CHANGE

Stated before building, so it can be checked afterwards.

| | before | target |
|---|---:|---|
| navigation targets | 33 | 4 |
| chrome share of viewport | 68% | under 40% |
| buttons on screen | 39 | under 20 |
| `localStorage` writes per navigation | 3 | 1 |
| `/api/logs` POSTs per navigation | 2 | 1 |
| modes | 3 | 2 (reader / operator) |

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
| W2 | Cut the sidebar, `currentView`/`setView` and the watcher cycle | not started | — |
| W3 | Cut expert mode; fold its two panels under Advanced | not started | — |
| W4 | Four tabs: Build · Inspect · Diagnose · Export | not started | — |
| W5 | Recompose panels onto `StepCard` / `t-section` / `AppButton` | not started | — |
| W6 | Cut the duplicate Samples and Prose panels; link to the consumer views | not started | — |
| W7 | Fix **B15** — entering the Workshop is the switch | not started | — |
| W8 | Re-measure §8 and record the result here | not started | — |

**Next item: W2.**
