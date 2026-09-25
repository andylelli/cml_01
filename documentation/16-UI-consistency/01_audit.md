# 16.01 — Audit: how consistent the UI is today

**Written:** 2026-09-24 · **Type:** a MEASURED inventory. Nothing is changed by this document.

**Method.** A throwaway script read every `.vue` under `apps/web/src` (44 files, `__tests__` excluded)
and counted typographic and structural patterns per file; the rest is `grep` and reading. Every count
below is **MEASURED** from the tree on 2026-09-24 unless marked otherwise. **Not done:** a visual pass
in the running app — the counts are what the source *asks for*, not screenshots of what renders.
Plan item P0.1 closes that gap before any change lands.

**Yardstick.** Consistency is judged against the rules this repo already wrote down —
[UI-001](../ui/UI-001-design-system.md) (tokens, type roles, component vocabulary) and
[UI-008](../ui/UI-008-consistency-review.md) (the last review) — not against taste.

---

## 1. The pages

There is no router: `App.vue` switches six views on a `view` ref. The workshop is itself a rail plus
four panels.

| page | file | header pattern | notes |
|---|---|---|---|
| Create | `views/CreateView.vue` | `HeroBanner` + numbered `StepCard`s | the shopfront |
| Inspiration | `views/InspirationView.vue` | `HeroBanner` | |
| My Cases | `views/CasesView.vue` | `HeroBanner` + a card-per-row `<ul>` | the only list a non-operator sees |
| Case (reader) | `views/CaseView.vue` | `HeroBanner` | reading, narration, solution |
| Workshop | `views/WorkshopView.vue` + `workshop/WorkspaceRail.vue` + 5 panels | **its own header block, no `HeroBanner`** | the operator console |
| Settings | `views/SettingsView.vue` | `HeroBanner` + `StepCard`s | **housekeeping** (storage, logs), not preferences |

Overlays that appear on top of any page: `ErrorNotification`, `KeyboardShortcutHelp`, `DebugPanel`.

---

## 2. Type — 25 font sizes for 8 jobs

**The design system defines 8 type roles** (`styles.css`: `t-display`, `t-display-sm`, `t-section`,
`t-eyebrow`, `t-subtitle`, `t-label`, `t-script`, `t-quote`). **The templates use 25 distinct font
sizes.**

| source | distinct sizes | uses |
|---|---|---|
| Tailwind steps (`text-xs` … `text-2xl`) | 5 | 167 |
| hand-typed arbitrary values (`text-[0.72rem]`, `text-[11px]` …) | **20** | **180** |
| role classes (`t-*`) | 8 roles | 111 |

The 20 arbitrary values, by frequency: `11px` 44 · `0.72rem` 23 · `0.8rem` 22 · `0.9rem` 18 ·
`0.82rem` 18 · `0.85rem` 16 · `0.86rem` 9 · `0.88rem` 7 · `0.75rem` 5 · `0.78rem` 5 · `0.7rem` 4 ·
`10px` 4 · `0.92rem` 4 · `0.95rem` 4 · `1.05rem` 3 · `0.65rem` 1 · `0.68rem` 1 · `0.98rem` 1 ·
`1rem` 1 · `1.6rem` 1. _(`text-[--surface]`, 11 uses, is a colour and is excluded.)_

What that means in practice:

- **Near-duplicates nobody can tell apart.** `0.8rem`, `0.82rem`, `0.85rem`, `0.86rem`, `text-sm`
  (0.875rem) and `0.88rem` are six sizes within 1.3px of each other. INFERRED: each was typed to look
  right next to its neighbour, which is how a scale erodes.
- **px and rem are mixed.** `11px` and `10px` (48 uses) do not scale with the reader's browser text
  size; every rem value does. WCAG 1.4.4 needs text to survive 200% resize — px text technically
  zooms with page zoom but ignores the *text-size* setting ([02 §4](02_best_practice_research.md)).
- **Where it concentrates** (arbitrary + Tailwind sizes per file): `CaseView` 30 · `WorkshopView` 33 ·
  `PhaseBreakdownTable` 30 · `SettingsView` 22 · `ScoreCard` 23 · `NarrationPanel` 17 · `ProjectPanel` 16.
  The consumer pages (`CreateView` 12, `CasesView` 4) lean on the roles; the console mostly does not.
- **The reader uses the wrong serif.** `ProseReader.vue:87` and `:93` use Tailwind's stock
  `font-serif` (Georgia first) — the only place the brand display face (`--font-display`,
  Playfair Display) is bypassed. The one page people read for forty minutes is in a different typeface
  from every heading around it.

**Weights:** 4 in use — `font-semibold` 130 · `font-medium` 45 · `font-bold` 7 · `font-normal` 4.
UI-001 names three (400 body, 500 control, 600 display/labels); the 7 `font-bold` are off-system
(e.g. the wordmark at `AppShell.vue:74`, the reader's chapter title at `ProseReader.vue:87`).

### 2.1 The eyebrow label, hand-copied 13 times

`.t-eyebrow` exists (0.7rem, 600, uppercase, `.18em` tracking). Instead, the console writes it out by
hand — `text-xs font-semibold uppercase tracking-wide text-ink-soft` — at
`ErrorNotification.vue:130`, `KeyboardShortcutHelp.vue:59`, `PhaseBreakdownTable.vue:222/267/287/303/392/481`,
`ProseReader.vue:65`, `RunHistory.vue:88` and `ExportTab.vue:54/73/121`.
The copies disagree with each other and with the role: **two sizes** (`text-xs` = 0.75rem and
`text-[11px]`), and **two or three letter-spacings** (`tracking-wide` = .025em, none at all in
`ProseReader`/`RunHistory`/`ErrorNotification`, against the role's .18em). These 13 are most of the
20 ad-hoc `uppercase` uses in the app; the rest are badges and the wordmark (§3).

---

## 3. Capitalisation — mostly sentence case, with a handful of strays

Headings, role labels and button text were classified automatically (single-word labels excluded as
uninformative):

| | sentence case | Title Case | mixed |
|---|---|---|---|
| headings | 6 | 1 | 0 |
| role labels (`t-section`/`t-eyebrow`/`t-label`) | 31 | 2 | 1 |
| buttons | 23 | 3 | 5 |

**The house style is already sentence case** — the strays are the exceptions:

| string | where | should be |
|---|---|---|
| "Generate My Mystery" | `CreateView.vue:371` | "Generate my mystery" |
| "Debug Panel" | `DebugPanel.vue:57` | "Debug panel" |
| "The Solution" | `CaseView.vue:503` | "The solution" |
| "Open Outline" | `ProjectPanel.vue:65` | "Open outline" |
| "Open CML Viewer" | `ProjectPanel.vue:72` | "Open CML viewer" (CML is an acronym, stays) |
| "Open Clue board" | `ProjectPanel.vue:59` | "Open clue board" |

"Open the Workshop", "Change in Create" are **correct**: Create, Inspiration, My Cases, Workshop and
Settings are section names — proper nouns in this product — and keep their capital. That rule is not
written down anywhere yet, which is why the tally flags them.

**CSS uppercase** is legitimate where a *role* asks for it (`t-section`, `t-eyebrow`). It is also
applied ad hoc 20 times with the `uppercase` utility — mostly the §2.1 copies, plus a category chip in
`WorkshopView.vue:335` and state badges in `InspirationView.vue:121` / `WorkspaceRail.vue:164,190`.

**Empty-state wording** is inconsistent in punctuation and shape: "No log entries." vs "No quality
report available" (no full stop) vs "No clues yet. Generate to create them." vs "No activity yet. Run
generation to see entries." — four patterns in five messages.

---

## 4. Shape, spacing and colour

- **Radii: 5 in use against 3 tokens.** Tokens are `sm` 6px, default 10px, `lg` 16px.
  Uses: `rounded` 84 · `rounded-lg` 63 · `rounded-full` 39 · `rounded-md` 17 · `rounded-sm` 10 ·
  `rounded-xl` 2. `rounded-md` is Tailwind's untouched default (6px) — the **same** as `sm` under a
  second name — and `rounded-xl` (12px) is off-scale. UI-001 reserves 16px (`rounded-lg`) for "hero
  panels, modals"; **63 uses** means it is being used for ordinary cards (INFERRED from the count;
  the P0.1 visual pass should confirm).
- **Padding**: 12+ distinct card/row paddings (`px-3 py-2` 33, `p-6` 25, `p-5` 15, `p-4` 15,
  `px-3 py-2.5` 8, `px-4 py-2` 7 …). No spacing scale is written down for components.
- **Colour** is the healthy part: every component goes through tokens except `ScoreTrendChart.vue`
  (9 raw hex, still open from UI-008 B4).

---

## 5. Buttons, icons, controls

- **Buttons:** `<AppButton>` 37 · raw `<button>` 49. The raw ones cluster in the console
  (`WorkshopView` 6, `ProjectPanel` 6) and re-derive the states by hand — UI-008 B2, still open.
- **Icons: two systems**, still. `AppIcon` everywhere, `font-awesome-icon` 13 uses; the three
  `@fortawesome/*` packages remain in `package.json` — UI-008 B1, still open.
- **Loading states: three kinds.** `ContentSkeleton` (1 use), an `animate-spin` glyph (9 uses), and
  `AppButton`'s own `busy` state. No rule says which to use when.

---

## 6. Tables and lists — the column question

The brief asks for adjustable, saveable column widths, hiding and moving. **The app has almost no
tables to apply that to — the tabular data is mostly drawn as cards.**

| data | component | drawn as | columns it actually has |
|---|---|---|---|
| **LLM log entries** | `InspectPanel.vue:225-248` | a card per entry with the fields as inline spans | agent · operation · model · tokens · cost · timestamp · project · run · error |
| **My Cases** | `CasesView.vue:136+` | a card per case | name · status · created · narration length · actions |
| Run history | `RunHistory.vue:77+` | a card per event | step · message (+ status icon) |
| Error log | `ErrorLogPanel.vue:102+` | list items | severity · scope · message · time |
| Chapter scores | `PhaseBreakdownTable.vue:306, 395` | **real `<table>`s** (the only two) | chapter · individual · cumulative · V · Q · C · Co · bar |
| Validation / novelty | `ValidationPanel`, `NoveltyAudit` | nested lists | not tabular — grouped findings |

INFERRED: the LLM log is the one screen where the card layout actively fights the data — nine fields
per row, compared down the page (cost by agent, tokens by model), which is exactly the "compare data"
task tables exist for ([02 §3](02_best_practice_research.md)). Numbers there are not right-aligned
and not tabular figures, so costs cannot be scanned down a column.

**Nothing in the app persists a column layout today** — there is no column layout to persist.

---

## 7. Formats — dates and numbers eight ways

| call | uses |
|---|---|
| `toLocaleString()` with no options | 7 |
| `toLocaleTimeString(...)` in three different option shapes | 3 |
| `toLocaleDateString(undefined, { month: "short", day: "numeric" })` | 1 |
| `toFixed(0 / 1 / 2 / 3 / 4 / 6)` — six precisions | 10 |

`toLocaleString()` with no options renders in the **browser's** locale and 12/24-hour convention, so
two screens can show the same instant differently, and the LLM log prints `entry.timestamp`
unformatted (`InspectPanel.vue:243` — INFERRED to be an ISO string from the log writer; the P0.1
visual pass confirms). Costs are shown at 4 decimals in one place (`InspectPanel.vue:240`) and 2 in
others.

---

## 8. What is stored in the browser today

Four keys (two repeated for every case), two naming styles (`cml_snake_case` and `narration-pos:<id>`), two access patterns:

| key | owner | uses the safe wrapper? |
|---|---|---|
| `cml_ui_state` | `useUiState.ts` (view, mode, spec) | **yes** — versioned, never throws (UI-002 B7/B8/B10) |
| `cml_workshop_state` | `useWorkshopState.ts:306` | no — raw `localStorage` |
| `cml_spoilers_<projectId>` | `CaseView.vue:66` | no — raw `window.localStorage` |
| `narration-pos:<projectId>` | `AudioPlayer.vue:45` | no — raw `localStorage` |

The raw ones are the exact pattern UI-002 B7 fixed once already: `setItem` throws on quota and in
Safari private browsing. Any preferences store must not add a third naming style or a fourth raw caller.

**Mode is a preference without a control.** `mode` (`user` / `advanced` / `expert`) is persisted, but
MEASURED: nothing in the UI sets it except `revealWorkshop()` (`App.vue:160`) and
`enterOperatorMode` (`useWorkshopState.ts:217`), which only ever move it *up*. Once someone has opened
the Workshop, Workshop and Settings stay in their nav **for good** — there is no way back to `user`
short of clearing site data. `expert` is unreachable from the UI (`useWorkshopState.ts:131` records
why it was retired).

**There is no user menu.** The header right side is the nav (`AppShell.vue:87`). The app has no
accounts — the API has no user table and is single-user on localhost (UI-001 §2.2) — so "the user
section top right" is a new element, and anything it stores is per-browser unless a server table is
added ([05](05_user_preferences.md) §4).

---

## 9. Still open from UI-008

Re-measured today; none of these has moved since UI-008 was written. They are folded into the plan
([06](06_implementation_plan.md)) rather than restated.

| UI-008 | finding | today |
|---|---|---|
| A1/A2 | two phone navs, both `aria-label="Sections"`; Settings unreachable on a phone | drawer still present (`menuOpen`, 6 refs) |
| A5 | wordmark is a fake skip link (`href="#main"`) | still present |
| A6 | dead search pill (`showSearch`) | still present |
| B1 | Font Awesome for five shapes | 13 uses, 3 packages |
| B3 | blob-download written seven times | no `saveBlob` helper |
| B4 | `ScoreTrendChart` in Tailwind stock hex | 9 raw hex |
| D2 | Workshop has no `HeroBanner`, undecided | undecided |

---

## 10. What is already consistent — keep it

- **Colour tokens** (bar one chart). **Focus ring** — one treatment, defined once (`tokens.css`).
- **Motion** — colour/border only, `prefers-reduced-motion` honoured globally.
- **`StepCard`** — used the same way on every consumer page.
- **Sentence case** is already the majority style; this is a clean-up, not a rewrite.
- **The consumer pages** use role classes far more than the console does — the inconsistency is
  mostly **console vs shopfront**, which is where the plan concentrates.
