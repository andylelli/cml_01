# 16.03 — The consistency standard

**Written:** 2026-09-24 · **Type:** a DESIGN — the rules every page follows. It **extends**
[UI-001](../ui/UI-001-design-system.md) (tokens, colours, component vocabulary), which stays the
source for anything not restated here. Where this document and UI-001 disagree, this one is the newer
decision and UI-001 is updated in the same change (plan item P6.2).

**Status:** proposed. Four choices below are the owner's to confirm — marked **DECIDE**, and listed
together in [00 §3](00_README.md).

---

## 1. The principle

**Every page is assembled from the same named parts.** A page never picks a font size, a weight, a
radius or a date format; it picks a *role*, and the role decides. That is the whole standard — the
rest of this document is the list of roles.

Two things follow:

- **Adding a value is a design-system change, not a component change.** A size or radius that is not
  in the scale is added to `tokens.css` + `tailwind.config.cjs` + this document first, or not at all.
- **The console and the shopfront share one system.** UI-001 §8 lets the console keep a *denser
  layout*; it does not get its own type, buttons or casing. Density is a property of the layout (§6),
  not a licence for a second scale.

---

## 2. Type

### 2.1 The size scale — 25 sizes become 8

Every size is in **rem** (WCAG 1.4.4, and the text-size preference depends on it — [02 §4](02_best_practice_research.md)).
Pixel values at the default 16px root are shown for reference only.

| token (Tailwind) | rem | px | job |
|---|---|---|---|
| `text-2xs` | 0.6875 | 11 | the floor. Badges, tab-bar labels, table footnotes. **Nothing smaller.** |
| `text-xs` | 0.75 | 12 | captions, meta lines (time · project · run), eyebrows |
| `text-sm` | 0.8125 | 13 | dense console text: table cells, log rows, labels |
| `text-md` | 0.875 | 14 | controls: buttons, inputs, selects, nav items |
| `text-base` | 0.95 | 15.2 | body copy (UI-001's body size, unchanged) |
| `text-lg` | 1.0625 | 17 | card and panel titles |
| `text-xl` | 1.3 | 20.8 | page titles inside the console; the reader's chapter heading |
| display | `clamp(…)` | — | `t-display` / `t-display-sm` only, unchanged |

`text-xs`, `text-sm`, `text-base`, `text-lg` and `text-xl` **redefine** Tailwind's stock values in
`tailwind.config.cjs → theme.fontSize` (not `extend`), so the stock steps stop existing and an old
class cannot silently keep its old size. `text-2xl`+ are removed from the theme; the two current
uses become `text-xl` or a display role.

**Mapping from what is in the tree today** (the codemod in plan P1.3 applies this table, and nothing
else):

| today | becomes |
|---|---|
| `text-[10px]`, `text-[0.65rem]`, `text-[0.68rem]`, `text-[11px]`, `text-[0.7rem]`, `text-[0.72rem]` | `text-2xs` |
| `text-xs`, `text-[0.75rem]`, `text-[0.78rem]` | `text-xs` |
| `text-[0.8rem]`, `text-[0.82rem]`, `text-[0.85rem]`, `text-[0.86rem]` | `text-sm` |
| `text-sm` (was 0.875), `text-[0.88rem]`, `text-[0.9rem]` | `text-md` |
| `text-[0.92rem]`, `text-[0.95rem]`, `text-[0.98rem]`, `text-base`, `text-[1rem]` | `text-base` |
| `text-[1.05rem]`, `text-lg` | `text-lg` |
| `text-2xl`, `text-[1.6rem]` | `text-xl` |

INFERRED consequence: text in `0.72rem`→`0.6875rem` and `0.86rem`→`0.8125rem` shrinks by under 1px;
`0.9rem`→`0.875rem` by 0.4px. No step moves by more than ~1.3px. P0.1's before/after screenshots are
the check that nothing reads as a regression.

**DECIDE D1 — the reference size.** The scale above keeps UI-001's 0.95rem body. The alternative is a
clean 1rem body with the steps shifted up; it is simpler arithmetic and slightly larger text
throughout, at the cost of re-checking every consumer layout. Recommended: **keep 0.95rem** — the
shopfront was designed and reviewed at it.

### 2.2 Weights — three

| weight | Tailwind | job |
|---|---|---|
| 400 | `font-normal` | body, table cells, helper text |
| 500 | `font-medium` | controls, nav, row titles |
| 600 | `font-semibold` | headings, labels, emphasis |

`font-bold` (7 uses) is removed from the theme and each use mapped to 600. The wordmark keeps its
look through its own class in `AppShell`, not a general weight.

### 2.3 Families — as UI-001, with one correction

`--font-display` for display and section roles, `--font-body` for everything else, `--font-mono` for
code, IDs, run ids and JSON only, `--font-script` decorative only. **Correction:** the prose reader's
`font-serif` (`ProseReader.vue:87, 93`) becomes `font-display`, so the book is set in the same face as
every heading around it — or, if the display face proves too high-contrast for forty minutes of
reading, a reading face is added as a named token (`--font-reading`) rather than borrowed from
Tailwind's stock stack. **DECIDE D2**, recommended: try `font-display` in P0.1's screenshots first.

### 2.4 Roles — the only way a template sets type

The existing `t-*` classes stay and become the **complete** list. New: `t-title` (panel/card title:
`text-lg`, 600, body family), `t-meta` (captions/meta lines: `text-xs`, `--ink-soft`), `t-code`
(mono, `text-sm`). `t-eyebrow` is fixed at `text-xs` (0.75rem, was 0.7rem) so it matches the scale,
and every hand-copied eyebrow in [01 §2.1](01_audit.md) is replaced by it.

| role | size | weight | family | case | colour |
|---|---|---|---|---|---|
| `t-display` / `t-display-sm` | clamp | 600 | display | sentence | ink |
| `t-section` | `text-base` | 600 | display | CSS uppercase, `.14em` | ink |
| `t-title` | `text-lg` | 600 | body | sentence | ink |
| `t-eyebrow` | `text-xs` | 600 | body | CSS uppercase, `.18em` | ink-soft |
| `t-label` | `text-sm` | 600 | body | sentence | ink-soft |
| `t-subtitle` | `text-md` | 400 | body | sentence | ink-soft |
| `t-meta` | `text-xs` | 400 | body | sentence | ink-soft |
| `t-code` | `text-sm` | 400 | mono | as-is | ink |
| body (no class) | `text-base` | 400 | body | sentence | ink |

**Rule:** a template may combine a *role* with layout utilities (margin, width, alignment), and with a
*colour* utility where state requires it (`text-danger` on an error label). It may not add a size,
weight, family, `uppercase` or `tracking-*` utility on top of a role — that is how the eyebrow drifted
into three sizes.

---

## 3. Capitalisation

1. **Sentence case** for everything a person reads: page titles, headings, buttons, menu items, tab
   labels, column headers, field labels, tooltips, empty states, errors.
2. **Section names are proper nouns** and keep their capitals wherever they appear in running text or
   labels: *Create, Inspiration, My Cases, Case file, Workshop, Settings, Preferences*. ("Open the
   Workshop", "Change in Create" are correct.)
3. **Acronyms and product names** keep their own form: CML, LLM, JSON, PDF, MP3, Azure,
   *Murder in Minutes* (the wordmark, from `design/brand.ts`).
4. **Uppercase is a role, never an edit.** Only `t-section` and `t-eyebrow` render uppercase, via CSS.
   The source string is always written in sentence case, so screen readers and copy-paste get normal
   text.
5. **No full stop** on a label, button, heading or single-phrase empty state. **Full stops** on any
   message of more than one sentence — then on every sentence.
6. **Buttons are verbs**: "Generate my mystery", "Open outline", "Download", "Reset columns".

The six strays in [01 §3](01_audit.md) are the whole fix-list.

---

## 4. Shape and spacing

### 4.1 Radius — three, as UI-001 says

| token | px | for |
|---|---|---|
| `rounded-sm` | 6 | inputs, chips, badges, table cells with a fill |
| `rounded` | 10 | cards, tiles, buttons, list rows |
| `rounded-lg` | 16 | modals, hero panels, the preferences panel |
| `rounded-full` | — | avatars, dots, pills |

`rounded-md` (a second name for 6px) and `rounded-xl` (off-scale 12px) are removed from the theme.
The 63 `rounded-lg` uses are reviewed in P1.4: modals/heroes keep it, cards drop to `rounded`.

### 4.2 Spacing — a component scale

Page layout keeps Tailwind's 4px grid. **Components** use four named paddings, one per density
(§6 changes the whole set at once):

| part | comfortable (default) | compact |
|---|---|---|
| card / panel | `p-5` | `p-4` |
| list row, table cell | `px-3 py-2` | `px-2.5 py-1.5` |
| chip / badge | `px-2 py-0.5` | `px-1.5 py-0` |
| gap between cards | `gap-4` | `gap-3` |

Implemented as CSS variables (`--pad-card`, `--pad-row-x`, `--pad-row-y`, `--gap-stack`) set on
`<html>` by the density preference, used through four component classes. That is the only way density
can be a one-switch preference rather than an edit to every file.

---

## 5. Page anatomy — every page has the same skeleton

```
AppShell (frame: wordmark · nav · user menu)
└─ page header      title · one-line subtitle · primary action (max one) · secondary actions
└─ page body        StepCards (shopfront) | panels (console)
└─ page footer      (AppShell)
```

- **Page header.** Shopfront pages keep `HeroBanner`. The Workshop gets a **compact** `HeroBanner`
  variant (`size="compact"`: title + subtitle, no art) instead of its own header block — this closes
  UI-008 D2. **DECIDE D3**; recommended compact banner, because narration now brings non-operators
  into the Workshop.
- **One primary action per page** (`AppButton variant="primary"`, the accent). Everything else is
  `secondary` or `ghost`.
- **Page width.** Shopfront: `max-w-shell` (1240px). Console: full width inside `max-w-shell` plus a
  scrolling region for wide tables. Reading: `max-w-prose` (or the reading-width preference).
- **Section header inside a page:** `t-section` + optional `t-subtitle`, always an `<h2>` with the
  section `aria-labelledby` it (UI-001 §5 — already the pattern).

---

## 6. Density

Two densities, **comfortable** (default everywhere) and **compact**. Density changes the component
spacing variables (§4.2) and row height only — **never font size**, which is the text-size
preference's job (§7). Keeping the two separate means a user who wants more rows on screen does not
also get smaller text, and vice versa.

The console may *default* to compact while the shopfront defaults to comfortable (UI-001 §8 already
grants the console density). **DECIDE D4** — recommended: comfortable everywhere by default, compact as
a preference, because a per-area default is one more thing to explain.

---

## 7. How preferences reach the standard

Preferences ([05](05_user_preferences.md)) only ever move **variables**, never classes:

| preference | variable on `<html>` | effect |
|---|---|---|
| text size | `font-size: 100% / 112.5% / 125%` | every `rem` scales — the scale in §2.1 holds its proportions |
| density | `--pad-*`, `--row-h` | §4.2 |
| reduced motion | `data-motion="reduce"` | the existing reduced-motion rules apply regardless of OS |
| reading width / size | `--reading-measure`, `--reading-size` | reader only |

This is why the scale must be in `rem` and the spacing in variables *before* preferences are built.

---

## 8. Components — one of each

| need | component | status |
|---|---|---|
| button | `AppButton` (`primary` / `secondary` / `ghost` / `danger`, `sm` / `md`) | exists; console's 49 raw buttons move onto it (UI-008 B2) |
| icon | `AppIcon` | exists; Font Awesome removed (UI-008 B1) |
| text input, select, number | `FieldText` (new), `FieldSelect`, `FieldNumber` | `FieldText` is new — 26 raw `<input>`s today |
| data table | `DataTable` | new — [04](04_data_tables.md) |
| empty state | `EmptyState` (icon · one sentence · optional action) | new — replaces the four wordings in [01 §3](01_audit.md) |
| loading | `ContentSkeleton` for regions, `AppButton busy` for actions, `AppIcon name="spinner"` inline only | rule, not a new component |
| status chip | `StatusChip` (`ok` / `warn` / `danger` / `neutral` / `running`) | new — the ad-hoc uppercase badges in `WorkspaceRail` and `InspirationView` |
| menu / popover | `AppMenu` on Headless UI `Menu` | new — needed by the user menu and the column menu |
| page header | `HeroBanner` (+ `compact`) | exists |

---

## 9. Formats — one module

`services/format.ts` exports the only formatters; templates never call `toLocaleString`/`toFixed`.

| name | output (en-GB example) | for |
|---|---|---|
| `formatDateTime` | 24 Sep 2026, 07:12 | lists, run starts |
| `formatDate` | 24 Sep 2026 | dates without a time |
| `formatTime` | 07:12:03 | logs, where seconds matter |
| `formatRelative` | 2 min ago | status lines — always with `formatDateTime` in the `title` |
| `formatDuration` | 41 min 12 s | run length, narration length |
| `formatMoney` | $0.0142 · $1.44 | 4 decimals under $0.01, 2 otherwise — one rule |
| `formatCount` | 12,408 | tokens, words |
| `formatPercent` | 87% | scores |

Locale and 12/24-hour come from the Formats preference ([05](05_user_preferences.md)), defaulting to
the browser. Numbers in tables use `tabular-nums` and right alignment (§ [04](04_data_tables.md)).

---

## 10. Enforcement

A standard nobody checks drifts — UI-001 is the evidence (UI-008 D1). Two tests, added in P6:

1. **A source guard** (vitest, over `src/**/*.vue`): fails on `text-[`, `font-bold`, `rounded-md`,
   `rounded-xl`, raw hex, `toLocaleString(`, `toFixed(` in templates, `uppercase`/`tracking-*` outside
   `styles.css`, and `font-awesome-icon`. Each hit names the file and line.
2. **The existing tokens test** (`design/__tests__/tokens.test.ts`) extended to check the font-size
   scale matches between `tokens.css`, `tailwind.config.cjs` and this document's §2.1.
