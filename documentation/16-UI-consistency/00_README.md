# 16 — UI consistency, and personal preferences

**Written:** 2026-09-24 · **Trigger:** owner's request — *"review every page in the UI and look at
providing a consistent style for all pages. Think about font styles, font sizes, capitalisation,
adjustable and saveable column widths / column hiding / moving… Also consider personal configurations,
ie having a preferences option in the User section top right… Research online best practice here and
create all the necessary documentation to fully understand what we need to do here and create the
design and plan for implementing."*

**Type:** an AUDIT + DESIGN + PLAN. **Nothing has been built or changed in the app.** The folder exists
so the work can be decided and then done against measured numbers.

**Method note, load-bearing:** every claim is marked **MEASURED** (counted from the source tree on
2026-09-24; the script and its greps are described in [01](01_audit.md)), **SOURCED** (from the web
research in [02](02_best_practice_research.md), linked), or **INFERRED** (a judgement from those). The
one thing not done is a visual pass in the running app — plan item **P0.1** does that first, before any
change lands.

**Relationship to earlier work:** this extends [UI-001](../ui/UI-001-design-system.md) (the design
system — still the source for colour, brand and component intent) and absorbs the still-open items of
[UI-008](../ui/UI-008-consistency-review.md) (the last consistency review), none of which has moved
since it was written.

---

## 1. The headline

**The app has a design system, and half of it is not being used.** The colours are clean — every
component goes through tokens bar one chart. The type is not: **25 distinct font sizes** are in use
against 8 defined roles, 180 of them hand-typed (`text-[0.72rem]`, `text-[11px]`…), six of them within
1.3px of each other, and 48 in `px` so they ignore the reader's browser text size. The same eyebrow
label is **hand-copied 13 times** at two sizes and inconsistent letter-spacing, next to a `.t-eyebrow` class
that already does the job. The drift is concentrated in the **operator console**; the shopfront pages
mostly use the roles.

**Capitalisation is nearly right already** — sentence case is the majority — with six stray Title Case
labels and no written rule for the one real exception (section names like *Workshop* are proper nouns).

**Columns can't be adjusted because there are almost no tables.** The data that most needs columns —
the **LLM log**, nine fields compared down the page — is drawn as a stack of cards. Only the chapter
scores are real `<table>`s. So the column work is really *"give tabular data a table, then make that
table adjustable and remembered"*.

**There is no user menu, and no preferences.** Four storage keys (two of them repeated for every case) use two
naming styles, and three of them bypass the crash-safe wrapper UI-002 introduced. The one existing
personal setting, `mode`, can only be switched **on** — once you have opened the Workshop there is no
way back short of clearing site data.

---

## 2. Read in this order

| # | document | what it answers |
|---|---|---|
| 01 | [Audit](01_audit.md) | What is inconsistent today, page by page, with counts and file:line |
| 02 | [Best-practice research](02_best_practice_research.md) | What the field recommends, with sources, and what each finding means for CML |
| 03 | [Design standard](03_design_standard.md) | The rules: a 7-step size scale plus display, 3 weights, roles, capitalisation, radius, spacing, density, page anatomy, formats, enforcement |
| 04 | [Tables](04_data_tables.md) | The `DataTable` component — resize, hide, reorder, sort, persist, reset — and exactly which screens get which controls |
| 05 | [User preferences](05_user_preferences.md) | The top-right user menu, the preferences panel, fourteen choices, storage and migration |
| 06 | [Implementation plan](06_implementation_plan.md) | 35 items in 7 phases, dependencies, acceptance checks, risks, and the STATUS ledger |

---

## 3. Decisions needed before building

Each has a recommendation; none blocks writing the plan, all block the item that depends on it.

| id | decision | recommended | where |
|---|---|---|---|
| **D1** | Body size: keep UI-001's 0.95rem, or move the scale to a 1rem base | **Keep 0.95rem** — the shopfront was designed and reviewed at it | [03 §2.1](03_design_standard.md) |
| **D2** | Reader typeface: the brand display serif, or a dedicated reading face | **Try the display face in P0.1's screenshots first**; add `--font-reading` only if forty minutes of Playfair proves tiring | [03 §2.3](03_design_standard.md) |
| **D3** | Give the Workshop a compact `HeroBanner`, or record that the console has no hero | **Compact banner** — narration now brings non-operators into the Workshop (closes UI-008 D2) | [03 §5](03_design_standard.md) |
| **D4** | Density default: comfortable everywhere, or compact in the console | **Comfortable everywhere**, compact as a preference | [03 §6](03_design_standard.md) |
| **D5** | Offer a Table view of My Cases (Cards stay the default) | **Yes**, remembered per browser — the list only grows, and only a table sorts | [04 §2](04_data_tables.md) |
| **D6** | Tables: hand-built component, or TanStack Table | **Hand-built** — 5 small tables; UI-008 is removing dependencies. The stored layout shape matches TanStack's, so it can be swapped later without losing users' layouts | [04 §5](04_data_tables.md) |
| **D7** | Preferences stored in the browser only, or also on the API | **Browser only for now** — single user on localhost; a one-row server table is an easy later step | [05 §4.4](05_user_preferences.md) |
| **D8** | Rename Settings to **Housekeeping** and move it into the user menu | **Yes** — "Settings" next to "Preferences" misleads, and it shortens the nav (UI-008 A3) | [05 §5](05_user_preferences.md) |

---

## 4. The plan on one screen

| phase | what | items |
|---|---|---|
| **P0** | Screenshots of every page (before), and the decisions above | 2 |
| **P1** | The 7-step size scale, 3 weights, roles, radii, spacing variables — the codemod that removes all 180 hand-typed sizes | 7 |
| **P2** | One of each component: Font Awesome out, console buttons onto `AppButton`, chart retokened, `EmptyState`, `StatusChip`, `FieldText`, `AppMenu`, compact banner | 6 |
| **P3** | Six casing fixes, one empty-state pattern, one `format.ts` for dates/times/money | 3 |
| **P4** | `useColumnLayout` + `DataTable`; LLM log, chapter scores, run history, error log onto it; My Cases table view | 6 |
| **P5** | Safe storage module, preferences store + migration, `applyPreferences`, **user menu**, **preferences panel**, two-way operator switch, Housekeeping, UI-008's nav fixes | 8 |
| **P6** | A guard test that fails on the patterns that caused the drift; UI-001 brought up to date; after-screenshots | 3 |

**Why this order:** the text-size preference only works once every size is in `rem` (P1 before P5);
density only works once padding is in variables (P1.6 before P5.3); and no new stored value is added
before the safe storage module exists (P5.1 first in P5). Full reasoning in [06](06_implementation_plan.md).

---

## 5. What is deliberately **not** proposed

- **A dark theme.** Cream-not-white is a UI-001 brand rule; a dark palette is a design job with its own
  contrast work, not a preference toggle. Recorded as a possible later item.
- **User-chosen colours or fonts.** "Red means one thing" (UI-001 §1) cannot survive a chosen accent;
  the two families are the brand. Text size and reading size cover legibility.
- **Column controls on every list.** Only where people work in the data (NN/g, [02 §3](02_best_practice_research.md)):
  the LLM log and chapter scores get them; run history and the error log get a table's *look* but not
  its knobs; validation and novelty stay grouped lists.
- **Server-side preferences** — until D7 is revisited.

---

## 6. STATUS

The item-level ledger is in [06 §STATUS](06_implementation_plan.md). Folder-level:

| deliverable | status | note |
|---|---|---|
| Audit (01) | ✅ written | MEASURED from source; visual confirmation is P0.1 |
| Research (02) | ✅ written | sources linked inline |
| Design standard (03) | ✅ written | proposed; D1–D4 open |
| Tables design (04) | ✅ written | proposed; D5–D6 open |
| Preferences design (05) | ✅ written | proposed; D7–D8 open |
| Implementation plan (06) | ✅ written | 0 of 35 items started |
