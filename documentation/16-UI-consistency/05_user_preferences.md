# 16.05 — Personal preferences: the user menu, what it holds, and where it lives

**Written:** 2026-09-24 · **Type:** a DESIGN. Nothing here exists yet — MEASURED in
[01 §8](01_audit.md): there is no user menu, no preferences surface, and four browser-stored keys
in two naming styles, three of them outside the safe wrapper.

**Two rules from the research** ([02 §6](02_best_practice_research.md)) shape everything below:

1. **Defaults are the design.** Most people never open preferences, so the standard in
   [03](03_design_standard.md) has to be right with every preference at its default. A preference
   adjusts *within* the system (size, density, width); it never restyles it.
2. **Keep the list short.** About a dozen choices, grouped, most-used first — not a control panel.

---

## 1. The user menu — top right of the frame

There are no accounts, so the control cannot be an avatar with a name. It is an icon button at the
right-hand end of the green frame, after the nav:

```
[hat] MURDER IN MINUTES │ Classic crimes…        Create  Inspiration  My Cases  Workshop   (◐) ▾
```

- Glyph: a new `person` `AppIcon`; accessible name **"Your menu"**; on screens ≥1180px the label
  **"You"** shows beside it. On a phone it moves into the bottom tab bar as the last tab, so it is
  never behind a drawer (UI-008 A1/A2 delete the drawer).
- It is an `AppMenu` (Headless UI `Menu`): keyboard-open with Enter/Space/↓, Escape closes, focus
  returns to the button.

**Menu contents**, in order:

| item | does | shown |
|---|---|---|
| **Preferences…** | opens the preferences panel (§2) | always |
| **Show operator tools** | a checkbox item — the `mode` switch (§3.5) | always |
| **Keyboard shortcuts** | opens `KeyboardShortcutHelp`, which today only opens inside the Workshop | always |
| **Housekeeping** | the current Settings page (§5) | when operator tools are on |
| — separator — | | |
| app name · version | read-only line, from `design/brand.ts` + build version | always |

---

## 2. The preferences panel

A **slide-over panel from the right** (Headless UI `Dialog`, `rounded-lg`, `--surface`), not a page.
Reason: the Appearance choices are only judgeable against the page you are on — changing text size or
density while looking at the LLM log shows the result immediately behind the panel. A separate page
would show you the preferences page at the new size, which answers nothing.

- Changes **apply immediately and save immediately** — no Save button (these are low-stakes,
  reversible choices; a Save button would only add a way to lose them).
- Each group ends with its own **Reset** link; the panel footer has **Reset all preferences**, which
  asks for confirmation (it also clears every table layout).
- Width: `min(28rem, 100vw)`. At phone width it becomes full-screen.

---

## 3. What can be set

Fourteen choices in five groups. Every one of them is a value the app **already decides for the user
today** (MEASURED where noted) — nothing here introduces a new behaviour, only a choice over an
existing one.

### 3.1 Appearance

| preference | options | default | effect |
|---|---|---|---|
| Text size | Standard · Large · Larger | Standard | root `font-size` 100% / 112.5% / 125% — every `rem` follows ([03 §7](03_design_standard.md)) |
| Density | Comfortable · Compact | Comfortable | the `--pad-*` / `--row-h` variables ([03 §6](03_design_standard.md)) |
| Motion | Match my system · Reduce · Full | Match my system | `data-motion` on `<html>`; today motion follows the OS only |

### 3.2 Reading (the case file)

| preference | options | default | effect |
|---|---|---|---|
| Reading text size | Small · Standard · Large | Standard | `--reading-size`, the reader only |
| Line width | Narrow (60ch) · Standard (68ch) · Wide (76ch) | Standard | `--reading-measure`; all within the 45–80 range ([02 §5](02_best_practice_research.md)) |
| Spoilers | Hidden until I show them · Always shown | Hidden | the *default* for a new case. The per-case choice (today `cml_spoilers_<id>`, `CaseView.vue:66`) is still remembered and overrides it |

### 3.3 Listening

| preference | options | default | effect |
|---|---|---|---|
| Playback speed | the player's existing steps | 1× | today the player resets to 1× on every load — `rate = ref(1)`, `AudioPlayer.vue:38` (MEASURED) |
| Remember where I stopped | On · Off | On | today always on (`narration-pos:<id>`, `AudioPlayer.vue:45`) |

### 3.4 Dates and times

| preference | options | default | effect |
|---|---|---|---|
| Clock | Match my browser · 24-hour · 12-hour | Match my browser | every time through `services/format.ts` ([03 §9](03_design_standard.md)) |
| Date style | 24 Sep 2026 · 24/09/2026 · 2026-09-24 | 24 Sep 2026 | same |
| Times in lists | "2 min ago" · exact time | "2 min ago" | `formatRelative` vs `formatDateTime`; the other is always the tooltip |

### 3.5 Workspace

| preference | options | default | effect |
|---|---|---|---|
| Show operator tools | On · Off | Off | **this is `mode`**: Off = `user`, On = `advanced`. Today it can only be switched *on*, by entering the Workshop — MEASURED, no way back ([01 §8](01_audit.md)). It becomes a normal two-way switch, also reachable from the menu (§1) |
| Open on | Create · My Cases · Where I left off | Where I left off | today always "where I left off" (`App.vue` `onMounted`) |
| My Cases as | Cards · Table | Cards | only if D5 in [04](04_data_tables.md) is accepted |

**Tables** have no per-row preferences here: column layouts are saved by using the table
([04 §3.6](04_data_tables.md)). The panel carries one action, **Reset all table layouts**.

### Deliberately **not** preferences

| not offered | why |
|---|---|
| Dark theme | UI-001 §1 makes cream-not-white a brand rule; a dark palette is a design job with its own contrast checks, not a toggle. Recorded as a possible later item, not in this plan |
| Accent / brand colour | "Red means one thing" (UI-001 §1) cannot survive a user-chosen accent |
| Font family | the two families *are* the brand; text size and reading size cover the legibility need |
| Per-page layouts | NN/g: rarely used, and each one is a way for the app to look different to two people describing it to each other |

---

## 4. Where preferences are stored

### 4.1 One store, one key, the safe wrapper

- **`services/storage.ts`** — the `storage()` probe and never-throw read/write from
  `useUiState.ts` extracted so every caller uses it. The three raw `localStorage` users
  (`useWorkshopState.ts:306`, `CaseView.vue:66`, `AudioPlayer.vue:45`) move onto it — the UI-002 B7
  crash pattern, closed everywhere rather than once.
- **`stores/preferences.ts`** — a Pinia store (Pinia is already a dependency; `projectStore.ts` is the
  precedent), holding a typed `Preferences` object, persisted under **one** key, `cml_prefs`.
- **Versioned and coerced**, the UI-002 B8/B10 lesson: `{ version: 1, ...prefs }`; on read, every
  field goes through `coercePreferences()` — an unknown value falls back to its default, an unknown
  field is dropped, an unknown version is discarded (not half-applied). A broken preference must never
  be able to break a page.

```ts
interface Preferences {
  version: 1
  appearance: { textSize: "standard" | "large" | "larger"; density: "comfortable" | "compact"; motion: "system" | "reduce" | "full" }
  reading:    { size: "small" | "standard" | "large"; measure: "narrow" | "standard" | "wide"; spoilersDefault: "hidden" | "shown" }
  listening:  { rate: number; rememberPosition: boolean }
  formats:    { clock: "browser" | "24h" | "12h"; dateStyle: "medium" | "dmy" | "iso"; listTimes: "relative" | "absolute" }
  workspace:  { operatorTools: boolean; openOn: "create" | "cases" | "last"; casesView: "cards" | "table" }
  tables:     Record<string, { widths: Record<string, number>; order: string[]; hidden: string[]; sort?: { id: string; dir: "asc" | "desc" } }>
}
```

### 4.2 Per-case memory is not a preference

Whether spoilers are showing *for case X* and where you stopped *in case X's narration* are state,
not preferences. They move to one key, **`cml_case_memory`**, `{ version: 1, spoilers: { [id]: bool },
narrationPos: { [id]: seconds } }`, capped at the 200 most recently touched cases so it cannot grow
without bound (today each case adds two keys forever — INFERRED from the per-id key naming).

### 4.3 The resulting keys

| key | holds | owner |
|---|---|---|
| `cml_ui_state` | view, open project, spec (as today, **minus `mode`**) | `useUiState` |
| `cml_prefs` | §3 | `stores/preferences` |
| `cml_case_memory` | §4.2 | `useCaseMemory` |
| `cml_workshop_state` | as today, moved onto the safe wrapper | `useWorkshopState` |

Four keys, one naming convention, one access path. **Migration** (one-off, on first load of the new
build): `cml_ui_state.mode` → `prefs.workspace.operatorTools`; every `cml_spoilers_<id>` and
`narration-pos:<id>` → `cml_case_memory`, then the old keys are removed. `cml_ui_state` moves to
version 3.

### 4.4 Browser or server — **DECIDE D7**

The app has no user accounts (MEASURED, [01 §8](01_audit.md)), so preferences are **per browser**. A
server copy would need only a single-row `ui_preferences` table in the API's SQLite (`db.ts`) and
`GET/PUT /api/preferences`, and would make them follow you between browsers on the same machine.
**Recommended: browser only for now.** CML is single-user on localhost; the server table is a small,
additive later step that the typed, versioned store makes easy, and nothing in §3 is painful to set
twice.

---

## 5. Settings is housekeeping — rename it — **DECIDE D8**

Today's **Settings** page is storage and log housekeeping (`SettingsView.vue`: "The case store",
"Live logs", "Archived logs", "Test-suite leftovers", "Clear everything"). Next to a new **Preferences**
panel, "Settings" invites the wrong expectation.

**Recommended:** rename it **Housekeeping**, and move it **out of the nav into the user menu** (shown
when operator tools are on). This also shortens the nav — UI-008 A3's complaint that the bar grows from
3 to 6 items — to Create · Inspiration · My Cases (+ the open case, + Workshop for operators).

---

## 6. Applying preferences

One function, `applyPreferences(prefs)`, runs on load (before first paint, so there is no flash of
default size — it is called from `main.ts` before `app.mount`) and on every change:

| preference | applied as |
|---|---|
| text size | `document.documentElement.style.fontSize` |
| density | `data-density="compact"` on `<html>` → the `--pad-*` variables in `tokens.css` |
| motion | `data-motion="reduce"` on `<html>`; `tokens.css` gains a `[data-motion="reduce"]` block beside the existing media query, and `[data-motion="full"]` opts out of it |
| reading size / measure | `--reading-size`, `--reading-measure` on `<html>`, read by `.reader` |
| formats | read by `services/format.ts` from the store |
| everything else | read by the component that owns it |

Nothing reads `localStorage` directly after this; nothing sets a class to express a preference.

---

## 7. Tests the store must carry

- `coercePreferences` — every field falls back on a bad value; unknown fields dropped; wrong version
  discarded.
- **A write failure never throws** (storage blocked, quota) — the B7 regression test.
- Migration: an old `cml_ui_state` with `mode: "advanced"` + two `cml_spoilers_*` keys produces the
  new keys and removes the old ones; running it twice changes nothing.
- `applyPreferences` sets the root size and attributes; a component test asserts a `rem`-sized element
  grows at "Larger".
- Operator tools **off** hides Workshop from the nav and returns an open Workshop view to Create.
