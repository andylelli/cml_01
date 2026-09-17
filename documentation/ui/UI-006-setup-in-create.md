# UI-006 — ONE VALUE, ONE EDITOR: SETUP MOVES TO CREATE

**2026-09-17.** Verified in the running app at 1280×900 as well as by test. Companion to
[UI-001](UI-001-design-system.md)–[UI-005](UI-005-story-angle.md).

Commit: `3a6b76df`.

---

## 0. THE INSTRUCTION

> *"Make sure the Create page has angle and theme and describes the difference. Also remove Project
> setup and Story specification from workshop. The workshop is to track progress and review all the
> story component information and post-generation actions. The story set up should all be under
> Create."*

---

## 1. WHAT WAS ACTUALLY WRONG

The console held a **full editable copy of the spec form**. A story was configured in Create, and
then the same twelve fields appeared again under the workshop's Build tab.

They were never out of sync — `spec` is a module singleton shared by both (`useSessionState.ts:24`,
B13) — but **nothing on screen said so.** Two editors for one value, with no indication which one
the run had used, is an invitation to change the wrong one. And the workshop's copy was the only
place three of those fields existed at all.

---

## 2. CREATE — WHAT IT GAINED

### 2a. Step 6, "The World"

The angle gets a **step of its own** rather than another field inside Extra Details, for one
reason: it is the field most easily mistaken for the theme. Separating them by a step is itself part
of the explanation.

| | **the theme** | **the story angle** |
|---|---|---|
| | the **crime** | the **world the crime happens in** |
| example | "a locked study, and an inheritance nobody wanted" | "a racing stable in the weeks before a classic" |
| steers | the mechanism and what conceals it | the place, the cast's occupations, the motive |

The copy on the page says it in the user's words — *"The crime is one thing; the world it happens in
is another… It is never the murder method."* — and the theme field's own note points back:
*"Not to be confused with the story angle in step 6."*

### 2b. The theme is named

It was labelled **"Anything else (optional)"**, which described neither what it is nor what it does,
and which is why the difference from the angle could not have been explained: one of the two had no
name. It now reads **"The theme"**.

### 2c. The preview does not lie

`onSubmit` replaces `theme` with `composedTheme` — the flavour fields folded into one string. The
angle is deliberately **not** folded in there, because the API appends it itself
([UI-005 §2](UI-005-story-angle.md)); composing it twice would send it twice. So the preview shows it
as its own line, with what actually happens to it:

> *Goes to the setting and cast directly, and is added to the text above as background.*

`CreateView.angle.test.ts` pins the trap directly: submit with both set, and assert `theme` does
**not** contain the angle.

---

## 3. THE WORKSHOP — WHAT IT LOST

| | |
|---|---|
| **Build → Run** | open a project, watch it being written, re-run a stage |
| `SpecPanel.vue` | **deleted** |
| Project setup | **removed** — name, Create project |
| Clear all persistence | **moved** to Advanced ▸ Operator |

The tab **id stays `build`**. It is persisted in `localStorage`, read by the keyboard shortcuts and
written to the activity log. This is the same call UI-003 made when `hardLogic` kept its id under the
label "Method": rename the label, never the key.

### 3a. Read-only, not absent

`SpecSummary.vue` replaces the form with the same values, read only, and one **Change in Create**
button. Removing it altogether would have been wrong: reviewing what the pipeline produced is
meaningless without knowing what it was asked for.

### 3b. Project setup was a second front door

Creating a project already belonged to Create, as part of setting a story up. The button here made an
**empty** project with no story attached, which the user then had to configure in the duplicate form
next to it. What remains is opening one — by name, or by id for an operator working from a log line.

---

## 4. THE TWO FIELDS THAT DID NOT MOVE, AND WHY

Deleting `SpecPanel` would have stranded three fields that existed nowhere else. `storyAngle` went to
Create with the rest. The other two did not:

| field | where it went | why not Create |
|---|---|---|
| `primaryAxis` | Advanced ▸ Operator | **Documented operator-only** (`vocabulary.ts:127`): a craft decision, and the one spec field whose bad value **throws at pipeline init** rather than degrading silently — after the project is made, the spec saved, and the run has begun costing money (X60). |
| `proseBatchSize` | Advanced ▸ Operator | Chapters per LLM call. Throughput, not craft. |

Moving `primaryAxis` onto a reader-facing page would have overturned a deliberate, documented
decision to satisfy a tidiness rule. Leaving either of them behind would have made it unreachable —
**which is precisely the defect found twice in the last two days** (`humourLevel` A_92, `storyAngle`
UI-005): wired end to end in the pipeline, with nothing able to send it.

The advanced gate does not strand them: the console calls `enterOperatorMode()` on mount.

---

## 5. ONE ERROR WORTH RECORDING

The Operator blurb was inserted into the middle of a `v-if` / `v-else-if` chain and the first branch
demoted to `v-else-if`, leaving the chain headless. **`vue-tsc` passed.** The test suite caught it,
as a *suite-level* failure — the SFC would not compile at all, so four unrelated test files failed to
load and reported nothing about their own subjects.

Third instance this week of the same class: the typecheck is not a template checker
([UI-004 §2a](UI-004-case-file-and-progress.md), and the `<script setup>` component-registration
failure in UI-002). Mount it or it is not verified.

---

## 6. STATUS

| item | state | commit |
|---|---|---|
| angle on Create, with all 107, Surprise me, free text | done | `3a6b76df` |
| the difference between theme and angle stated on the page | done | `3a6b76df` |
| theme named rather than "Anything else" | done | `3a6b76df` |
| preview shows the angle without double-sending it | done, test-pinned | `3a6b76df` |
| Build → Run | done | `3a6b76df` |
| `SpecPanel` deleted, replaced by read-only summary | done | `3a6b76df` |
| Project setup removed; loader kept | done | `3a6b76df` |
| `primaryAxis` / `proseBatchSize` / danger zone → Advanced ▸ Operator | done | `3a6b76df` |
| **dead members still exported by `useWorkshopState`** | **outstanding** — `handleCreateProject`, `isCreatingProject`, `handleSuggestTheme`, `castNamesInput`, `themeSuggestions` have no consumer now. Removed from `WorkshopView`'s destructure; still in the composable. Belongs with UI-002 §11, which already tracks trimming it | — |
| **a paid run through the new setup path** | **outstanding** | — |

377 tests pass; `npm run typecheck` clean.
