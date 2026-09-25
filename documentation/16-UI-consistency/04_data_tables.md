# 16.04 — Tables: one component, adjustable and remembered columns

**Written:** 2026-09-24 · **Type:** a DESIGN for the `DataTable` component and where it applies.
Builds on [01 §6](01_audit.md) (what tables exist) and [02 §3](02_best_practice_research.md) (what the
field recommends).

---

## 1. The problem in one line

The app's tabular data is drawn as **cards** (LLM log, My Cases, run history, error log) or as two
**hand-styled tables** (chapter scores), so there is no consistent table look to begin with, and nothing
to resize, hide, move or remember. MEASURED in [01 §6](01_audit.md).

---

## 2. Where it applies — and where it does not

| screen | today | becomes | column controls | why |
|---|---|---|---|---|
| **LLM log** (`InspectPanel`) | card per entry, 9 fields inline | `DataTable` | **full** — resize, hide, reorder, sort, persist | nine fields compared down the page: the *compare* task. The operator lives here during a run |
| **Chapter scores** (`PhaseBreakdownTable` ×2) | two hand-styled `<table>`s | `DataTable` | resize + hide + sort, persist; **no reorder** | fixed 8 columns with a natural order (chapter first, bar last) |
| **Run history** (`RunHistory`) | card per event | `DataTable` | sort by time; no column controls | 2–3 columns; controls would be ceremony |
| **Error log** (`ErrorLogPanel`) | list items | `DataTable` | sort + filter by severity; no column controls | 4 columns |
| **My Cases** (`CasesView`) | card per case | **cards stay the default**; a *Table* view is offered | in table view: resize + hide + sort, persist | a consumer screen of a handful of rows (UI-001 §8); the table view is for someone with 40 cases |
| Validation, novelty audit | grouped lists | **unchanged** | — | grouped findings, not rows |

**DECIDE D5** (listed in [00 §3](00_README.md)): whether My Cases gets the optional table view at all.
Recommended **yes, behind a Cards/Table switch remembered per browser**, because the case list only
grows and a table is the only view that sorts by date or status.

---

## 3. Features, and the rules for each

Every rule is the same on every table — that is the point of one component.

### 3.1 Look
- Header row: `t-label` text (sentence case, **not** uppercase — column headers are read, not
  glanced at), `--surface-sunken` fill, a 1px `--line-strong` bottom border, **sticky** inside its
  scroll region.
- Rows: `text-sm`, row padding from the density variables ([03 §4.2](03_design_standard.md)), 1px
  `--line` separators, hover `--ground-warm`. No zebra striping (the cream ground already carries
  enough texture — INFERRED; revisit in P0.1 if long logs prove hard to track).
- **Numbers right-aligned in `tabular-nums`**, and their header right-aligned to match. Money,
  tokens, counts, durations, scores. Text left-aligned. Status is a `StatusChip`.
- Wide tables scroll **inside** their own region (`.scroll-x`), never the page (UI-001 §6).
- The first column may be **pinned** (sticky left) when the table scrolls sideways.

### 3.2 Resize
- Drag the right edge of a header cell. The handle is a 6px hit area, visible on header hover and on
  keyboard focus.
- **Keyboard:** focus the handle, `←`/`→` resize by 16px, `Shift` for 64px — resizing must not be
  mouse-only.
- **Double-click** the handle: fit the column to its widest *visible* cell.
- Each column declares `minWidth` (default 64px) and `maxWidth` (default 640px); widths are clamped.
- Widths are stored in **rem**, not px, so they scale with the text-size preference instead of
  truncating at 125%.

### 3.3 Show / hide
- A **Columns** button in the table toolbar opens an `AppMenu` of checkboxes in current order.
- Columns marked `required` (e.g. the row's name) cannot be hidden and show a disabled checkbox with a
  tooltip saying why.
- Hiding the last visible optional column is allowed; hiding a required one is not possible.

### 3.4 Reorder
- In the Columns menu: each row has **Move up / Move down** buttons — the accessible path, and the
  only one needed. Header drag-and-drop is a later enhancement, not the requirement (INFERRED: drag
  reorder in a header is hard to make keyboard-accessible and CML's tables have ≤9 columns).
- Pinned and `required` columns can be marked `fixedPosition`.

### 3.5 Sort
- Clicking a sortable header cycles **ascending → descending → none**; `aria-sort` reflects it.
- Only one sort key. Default sort is declared per table (LLM log: time, newest first).
- **Non-sortable headers are plain text** — no button, no pointer, no `aria-sort`.

### 3.6 Persist, and reset
- Stored per table under the preferences store ([05 §4](05_user_preferences.md)):
  `tables.<tableId> = { widths, order, hidden, sort }`, with `tableId` a stable string declared by
  each usage (`"llm-log"`, `"chapter-scores"`, `"my-cases"`).
- Written on change, debounced 300ms. Read once on mount.
- **Stale layouts are repaired, not trusted** (the UI-002 B8 lesson): a stored column id that no
  longer exists is dropped; a new column not in the stored order is appended; a width outside the
  column's min/max is clamped.
- **Reset columns** in the Columns menu restores this table; **Reset all table layouts** lives in
  Preferences.

### 3.7 Empty, loading, error
- Empty: `EmptyState` in the table body, one sentence, with the action that fills it.
- Loading: `ContentSkeleton` rows at the current density's height.
- Error: `EmptyState` in `danger` tone with a retry.

---

## 4. The API

```ts
// components/ui/DataTable.vue
interface Column<Row> {
  id: string                         // stable — it is the persistence key
  header: string                     // sentence case
  cell: (row: Row) => string | VNode
  align?: "start" | "end"            // "end" ⇒ numeric: right-aligned, tabular-nums
  sortBy?: (row: Row) => string | number
  defaultWidth?: number              // rem
  minWidth?: number                  // rem
  maxWidth?: number                  // rem
  required?: boolean                 // cannot be hidden
  fixedPosition?: boolean            // cannot be reordered
  defaultHidden?: boolean
}

props: {
  tableId: string                    // persistence key
  columns: Column<Row>[]
  rows: Row[]
  rowKey: (row: Row) => string
  defaultSort?: { id: string; dir: "asc" | "desc" }
  loading?: boolean
  emptyText: string
  columnControls?: "full" | "no-reorder" | "none"
}
```

State lives in a composable, `useColumnLayout(tableId, columns)`, which returns
`{ widths, order, hidden, sort, reset }` and reads/writes through the preferences store — so the
persistence and repair rules are written once and unit-tested without mounting a table.

---

## 5. Library or hand-built — **DECIDE D6**

| | TanStack Table (Vue) | hand-built `DataTable` + `useColumnLayout` |
|---|---|---|
| what it gives | headless state for sizing, ordering, visibility, pinning, sorting, filtering, grouping | exactly §3, nothing else |
| size | a dependency, and a model (column defs, table instance, state slices) to learn | ~300–400 lines + tests (INFERRED from the feature list) |
| fit | built for many large, filterable, virtualised grids | CML has **5** tables, the largest ~9 columns, a few hundred rows |
| risk | version churn (v8 → v9 changed state ownership) | we own the bugs |

**Recommended: hand-built.** UI-008 B1 is removing three dependencies for five icons; adding one for
five small tables runs the other way, and the feature list in §3 is short and fully specified. The
decision reverses cleanly: `useColumnLayout`'s stored shape (`widths/order/hidden/sort`) is the same
shape TanStack's state uses, so a later swap keeps users' saved layouts.

---

## 6. Accessibility checklist (the component's tests)

- Real `<table>`, `<thead>`, `<th scope="col">`; a `<caption>` (visually hidden where the section
  heading already names it).
- `aria-sort` on sortable headers only; sort buttons are `<button>`s inside the `<th>`.
- Resize handles are focusable (`role="separator"`, `aria-orientation="vertical"`,
  `aria-valuenow` = width) and keyboard-operable (§3.2).
- The Columns menu is a Headless UI `Menu` with checkbox items; Move up/down are labelled with the
  column name ("Move Cost up").
- At 200% text size nothing clips: rows have a minimum height, not a fixed one.
