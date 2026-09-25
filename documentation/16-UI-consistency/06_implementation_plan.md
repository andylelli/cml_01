# 16.06 — Implementation plan

**Written:** 2026-09-24 · **Type:** a PLAN. Nothing below is built. Each item has a measurable
acceptance check so "done" is a fact, not a feeling, and the STATUS table at the end is the resumable
ledger — the commit that closes an item goes in its row (CLAUDE.md, *Long tasks*).

**Order is not arbitrary.** Three dependencies fix it:

1. **The scale before the preferences.** A text-size preference works by scaling the root `rem`; with
   48 `px` sizes in the tree ([01 §2](01_audit.md)) it would scale some text and not the rest.
2. **The spacing variables before density.** Density is only a one-switch preference if padding is
   expressed through variables ([03 §4.2](03_design_standard.md)).
3. **The safe storage module before any new stored value.** Otherwise the preferences store becomes
   a third naming style and the fourth raw `localStorage` caller ([01 §8](01_audit.md)).

Effort: **S** ≤ half a day · **M** ≤ 2 days · **L** > 2 days (INFERRED estimates).

---

## P0 — Baseline and decisions

| id | item | effort | acceptance |
|---|---|---|---|
| P0.1 | **Visual baseline.** Screenshot every page and panel at 1280px and 375px, and at browser text size 200%: Create, Inspiration, My Cases (empty + populated), Case (reading, narration, solution), Workshop (rail + Project / Generate / Inspect / Export), Settings, and the three overlays. Store under `documentation/16-UI-consistency/baseline/`. Record the rendered size of the reader's line length and the LLM-log timestamp format ([01 §7](01_audit.md), [02 §5](02_best_practice_research.md)). | M | every page has a before-image; the two open INFERRED points in 01 are settled |
| P0.2 | **Owner decisions D1–D8** ([00 §3](00_README.md)). | — | each marked accepted/changed in 00 |

## P1 — The type and shape foundation

| id | item | effort | depends | acceptance |
|---|---|---|---|---|
| P1.1 | Define the 7-step size scale (`text-2xs` … `text-xl`) in `tailwind.config.cjs → theme.fontSize` (replacing stock) and as `--text-*` in `tokens.css`; remove `font-bold`, `rounded-md`, `rounded-xl` from the theme | S | P0.2 (D1) | `vite build` passes; tokens test green |
| P1.2 | Role classes: add `t-title`, `t-meta`, `t-code`; re-base `t-eyebrow`/`t-label`/`t-subtitle`/`t-section` on the scale | S | P1.1 | each role's computed size equals its row in [03 §2.4](03_design_standard.md) (unit test on `styles.css`) |
| P1.3 | **Codemod** every arbitrary size (`text-[0.72rem]`, `text-[11px]` …) and stock size per the mapping table in [03 §2.1](03_design_standard.md) — a script, not hand edits, committed with its output counts. The 11 `text-[--surface]` (a colour, not a size) become `text-surface` in the same pass | M | P1.1 | no `text-[` left in `src` (was 180 sizes + 11 colours) |
| P1.4 | Replace the 13 hand-copied eyebrows ([01 §2.1](01_audit.md)) and other size+weight+uppercase stacks with roles | S | P1.2 | `uppercase`/`tracking-*` appear only in `styles.css` (was 20 + 15) |
| P1.5 | Radius review: 63 `rounded-lg` → modal/hero keep 16px, cards to `rounded`; `rounded-md` → `rounded-sm` | S | P1.1 | only `sm`/default/`lg`/`full` remain |
| P1.6 | Component spacing variables `--pad-card`, `--pad-row-*`, `--gap-stack` + four classes; move cards/rows/chips onto them | M | — | the 12+ padding combinations in [01 §4](01_audit.md) reduce to the four in [03 §4.2](03_design_standard.md) |
| P1.7 | Reader typeface per D2 (`font-serif` → `font-display` or `--font-reading`), and `max-w-prose` on `ProseReader` | S | P0.1, D2 | no `font-serif` in `src` |

## P2 — One of each component

| id | item | effort | acceptance |
|---|---|---|---|
| P2.1 | **Font Awesome out** (UI-008 B1): add `info` + spinner glyphs to `icons.ts`, swap 13 uses, drop 3 packages | S | `@fortawesome` absent from `package.json` |
| P2.2 | Console raw buttons → `AppButton size="sm"` (UI-008 B2) | M | raw `<button>` only in nav, steppers, the audio scrub row (documented exceptions) |
| P2.3 | `ScoreTrendChart` onto tokens (UI-008 B4) | S | 0 raw hex outside `design/` |
| P2.4 | `saveBlob()` in `services/` replacing seven copies (UI-008 B3) | S | one implementation, keeps CaseView's frame delay |
| P2.5 | New `EmptyState`, `StatusChip`, `FieldText`, `AppMenu` | M | each has a component test and replaces its ad-hoc versions |
| P2.6 | `HeroBanner size="compact"` on the Workshop (D3, closes UI-008 D2) | S | every page renders a `HeroBanner` |

## P3 — Words and formats

| id | item | effort | acceptance |
|---|---|---|---|
| P3.1 | The six casing fixes in [01 §3](01_audit.md); write the capitalisation rules ([03 §3](03_design_standard.md)) into UI-001 | S | re-run of the audit's casing tally shows 0 Title-Case non-proper-noun labels |
| P3.2 | Empty states onto `EmptyState` with one wording pattern | S | the four patterns in [01 §3](01_audit.md) become one |
| P3.3 | `services/format.ts` (eight named formatters, [03 §9](03_design_standard.md)); replace the 7 `toLocaleString()`, 3 `toLocaleTimeString`, 1 `toLocaleDateString` and 10 display `toFixed` calls across `src` (MEASURED over `.vue` + `.ts`) | M | none remain outside `services/format.ts` (a `toFixed` used for arithmetic, not display, is kept and commented) |

## P4 — Tables

| id | item | effort | depends | acceptance |
|---|---|---|---|---|
| P4.1 | `useColumnLayout(tableId, columns)` — widths/order/hidden/sort, repair of stale layouts, persistence through the preferences store | M | P5.1, P5.2 | unit tests: stale column dropped, new column appended, width clamped, reset |
| P4.2 | `DataTable` per [04 §3–§4](04_data_tables.md), hand-built (D6) | L | P4.1, P1.6 | the a11y checklist in [04 §6](04_data_tables.md) passes as component tests |
| P4.3 | LLM log → `DataTable`, full column controls | M | P4.2, P3.3 | resize/hide/reorder survive a reload; costs right-aligned, tabular |
| P4.4 | Chapter scores (×2) → `DataTable`, no reorder | S | P4.2 | both tables share one `tableId` layout |
| P4.5 | Run history, error log → `DataTable`, no column controls | S | P4.2 | |
| P4.6 | My Cases Cards/Table switch (D5) | M | P4.2, P5.3 | choice remembered; table sorts by date and status |

## P5 — Storage, preferences, and the shell

| id | item | effort | depends | acceptance |
|---|---|---|---|---|
| P5.1 | `services/storage.ts` — extract the safe probe from `useUiState`; move the three raw `localStorage` callers onto it | S | — | `localStorage` referenced only in `services/storage.ts` |
| P5.2 | `stores/preferences.ts` — typed, versioned, coerced; the migration in [05 §4.3](05_user_preferences.md); `cml_case_memory` | M | P5.1 | the tests in [05 §7](05_user_preferences.md) |
| P5.3 | `applyPreferences()` before mount; `data-density`, `data-motion`, reading variables in `tokens.css` | S | P1.1, P1.6, P5.2 | "Larger" grows a `rem` element; no flash of default size on reload |
| P5.4 | **User menu** in `AppShell` + phone tab (no decision needed) | M | P2.5 (`AppMenu`) | keyboard-operable; reachable at 375px |
| P5.5 | **Preferences panel** — the fourteen choices in [05 §3](05_user_preferences.md), live-applying | M | P5.3, P5.4 | each choice changes what it says it changes (one test per group) |
| P5.6 | Operator tools as a two-way switch replacing the one-way `mode` escalation | S | P5.2 | switching off returns an open Workshop to Create and hides it from the nav |
| P5.7 | Settings → **Housekeeping**, moved into the user menu (D8) | S | P5.4 | nav is 3 items (+ open case, + Workshop for operators) |
| P5.8 | Nav clean-up from UI-008: delete the drawer (A1/A2), a real skip link (A5), delete the dead search pill (A6), distinct `aria-label`s | S | P5.4 | one phone nav; one `#main` skip link that skips |

## P6 — Keep it consistent

| id | item | effort | acceptance |
|---|---|---|---|
| P6.1 | **Source guard test** ([03 §10](03_design_standard.md)): fails on `text-[`, `font-bold`, `rounded-md`/`xl`, raw hex, `toLocaleString(`/`toFixed(` in templates, `uppercase`/`tracking-*` outside `styles.css`, `font-awesome-icon`, direct `localStorage` | S | test fails on a planted violation, passes on the tree |
| P6.2 | UI-001 updated to this standard (sizes, roles, casing, radius, spacing, density, preferences, the real component list — closes UI-008 D1); UI-008 rows marked with the commits that closed them | S | UI-001 §3 lists exactly the components that exist |
| P6.3 | **After images** at the same viewports as P0.1, side by side | M | reviewed by the owner; every visible difference is intended |

---

## Risks

| risk | mitigation |
|---|---|
| The codemod shifts text by up to ~1.3px and something reads as a regression | P0.1 before/after images; the mapping is one table, so a bad row is one edit |
| Migrating stored values loses someone's open case or spec | migration is additive then deletes; a version mismatch discards rather than half-applies; tests in [05 §7](05_user_preferences.md) |
| Density/text-size combinations clip a table row | rows use min-heights, not heights ([04 §6](04_data_tables.md)); P6.3 includes 200% text |
| The guard test blocks unrelated work | it names file and line; the fix is always "use the role/token" |
| Scope creep into dark mode / theming | recorded as out of scope in [05 §3](05_user_preferences.md) |

---

## STATUS

| id | status | commit | note |
|---|---|---|---|
| P0.1 | ⬜ | | |
| P0.2 | ⬜ | | awaiting owner: D1–D8 |
| P1.1 | ⬜ | | |
| P1.2 | ⬜ | | |
| P1.3 | ⬜ | | |
| P1.4 | ⬜ | | |
| P1.5 | ⬜ | | |
| P1.6 | ⬜ | | |
| P1.7 | ⬜ | | |
| P2.1 | ⬜ | | = UI-008 B1 |
| P2.2 | ⬜ | | = UI-008 B2 |
| P2.3 | ⬜ | | = UI-008 B4 |
| P2.4 | ⬜ | | = UI-008 B3 |
| P2.5 | ⬜ | | |
| P2.6 | ⬜ | | = UI-008 D2 |
| P3.1 | ⬜ | | |
| P3.2 | ⬜ | | |
| P3.3 | ⬜ | | |
| P4.1 | ⬜ | | |
| P4.2 | ⬜ | | |
| P4.3 | ⬜ | | |
| P4.4 | ⬜ | | |
| P4.5 | ⬜ | | |
| P4.6 | ⬜ | | only if D5 accepted |
| P5.1 | ⬜ | | |
| P5.2 | ⬜ | | |
| P5.3 | ⬜ | | |
| P5.4 | ⬜ | | |
| P5.5 | ⬜ | | |
| P5.6 | ⬜ | | |
| P5.7 | ⬜ | | only if D8 accepted |
| P5.8 | ⬜ | | = UI-008 A1/A2/A5/A6 |
| P6.1 | ⬜ | | |
| P6.2 | ⬜ | | = UI-008 D1 |
| P6.3 | ⬜ | | |
