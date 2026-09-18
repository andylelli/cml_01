# UI-009 — THE WORKSHOP, REDESIGNED

The console had **three stacked navigation strips and eighteen tab controls**. This cuts it to one
strip and three tabs by asking one question of every section: *what can you DO here that you cannot
do somewhere better?*

---

## WHAT WAS MEASURED

On the Review tab: 17 navigation controls before any content — app nav (5) + main tabs (4) +
sub-tabs (8). Advanced is the same shape with 6.

**The same artifacts are presented three times.**

| presentation | where | for |
|---|---|---|
| A reader's dossier | `CaseView` | reading the case |
| Rendered per artifact | Workshop ▸ Review, 8 sub-tabs | — |
| Raw JSON per artifact | Workshop ▸ Advanced ▸ Artifacts, 11 blocks | diagnosing |

The middle row is the one with no answer. MEASURED: 8 of the 10 artifacts Review renders also appear
in `CaseView`, and all 11 appear as raw JSON under Advanced ▸ Artifacts.

**Only 2 of Review's 8 sections do anything.** `clues` has a red-herring filter and a play mode;
`prose` has a version picker and downloads. The other six — cast, locations, background, method,
period, outline — only display.

And the app already says so. Review ▸ Prose's own description reads:

> *"To read it properly — chapter by chapter, spoilers held back — open the case under My Cases."*

A tab that tells you to go somewhere else to use it is not a tab.

---

## THE DESIGN

The Workshop is where you **operate the pipeline**. Reading the story is `CaseView`'s job. So three
tabs, no sub-tabs:

| tab | what you do there |
|---|---|
| **Run** | Open a project, see the spec it will use, start a run, watch it |
| **Inspect** | Is it any good, and what went wrong — validation, quality, clues, raw artifacts, logs, history |
| **Export** | PDF, JSON, audiobook |

Long pages get a jump bar. That is not a new invention: the Run tab already merged three tabs this
way, and its own comment states the trade — *"Merging three tabs into one made the page long... A
jump bar pays for it."*

### What is deleted

- **The Review tab**, and `ReviewPanel.vue` (601 lines). Its six display-only sections go entirely —
  the readable form is `CaseView`, the diagnosable form is the raw artifact, and both already exist.
- **Both sub-tab strips** and their state: `reviewTabs`, `advancedTabs`, `activeReviewTab`,
  `activeAdvancedTab`, `handleReviewTabChange`, `handleAdvancedTabChange`, `reviewTabStatuses`,
  `advancedTabStatuses` — ~63 references across four files.
- **The duplicate story-PDF control.** It existed in both Review ▸ Prose and Export. Export keeps it.

### What moves rather than dies

- **Clues**, with its red-herring filter and play mode — the one genuinely diagnostic view. Into Inspect.
- **Prose version picker and download-all-versions** — into Export, beside the other downloads.
- **The two operator spec fields** (axis, batch size) — into Run, where the spec they configure lives.
- **CML viewer** — it is an artifact; it joins the artifact list in Inspect.

### `TabBar` is fixed while only one row remains

- **ARIA.** 12 `role="tab"` buttons with **zero** `role="tablist"` and **zero** `aria-controls`. An
  orphan tab role is invalid. Now a real tablist, with each tab owning its panel.
- **Emoji.** Status showed `✅ ❌ 🔵 🔒`, rendered from the OS font, in an app whose UI-001 §4
  mandates bespoke line glyphs. Replaced with `AppIcon`.
- **A fourth active-tab style.** `border-line-strong` here, accent underline in the top nav, a fill
  in the drawer, gold in the phone tabs (UI-008 §A). Now the accent underline, like the top nav.

---

## STATUS

All nine items are done in one commit; the console does not work half-migrated.

| # | Item | State |
|---|------|-------|
| 1 | `mainTabs` → Run · Inspect · Export; sub-tab state deleted | DONE |
| 2 | `AdvancedPanel` → `InspectPanel`: one page, jump bar, no sub-tab conditionals | DONE |
| 3 | Clues section moved from Review into Inspect | DONE |
| 4 | Prose version picker + download-all moved into Export | DONE |
| 5 | Operator spec fields moved into Run | DONE |
| 6 | `ReviewPanel.vue` deleted | DONE |
| 7 | `WorkshopView`: two sub-`TabBar`s removed | DONE |
| 8 | `TabBar`: tablist, aria-controls, glyphs, accent underline | DONE |
| 9 | Tests | DONE — 390 pass |

---

## MEASURED AFTER

Driven in the running app, not inferred:

| | before | after |
|---|---|---|
| tab rows on screen | 2 | **1** |
| tab controls | 12 on Review, 10 on Advanced | **3** |
| `role="tablist"` wrappers | 0 | **1** |
| tabs carrying `aria-controls` | 0 | **3 of 3** |
| emoji in the tab strip | 4 kinds | **0** |

**1,214 deletions against 663 insertions.** `ReviewPanel.vue` (601 lines) and `AdvancedPanel.vue`
(290 lines) are gone.

## THREE THINGS THE MERGE EXPOSED

Sub-tabs hide defects, because only the active one is ever in the DOM. Merging the pages put every
section on screen at once and three things surfaced immediately:

1. **An unlabelled `<select>`** in `ErrorLogPanel` — the a11y test had never reached it, because it
   only rendered when you clicked Advanced ▸ Logs. Now labelled.
2. **The "Fix →" button** on every failing validation row navigated to a `spec` tab that has not
   existed since UI-006 and scrolled to `field-*` ids that exist nowhere in the app. It set
   `activeMainTab` to a value no panel matches, so it **blanked the console's content area**.
   Removed with its emit and handler.
3. **`ValidationPanel` was also emoji** — `✅ ❌ ⚠️` for status and `▼ ▶` for expansion. Same
   treatment as `TabBar`: `AppIcon` glyphs with an `aria-label` each, so colour is never the only
   signal.
