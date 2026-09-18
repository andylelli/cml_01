# UI-008 — CONSISTENCY REVIEW

A full pass over the web app against [UI-001](UI-001-design-system.md), which is the yardstick used
throughout: where this document says something is inconsistent, it means inconsistent with the system
this repo already wrote down, not with a reviewer's taste.

Nothing here is applied. Every item is a recommendation with its evidence.

Method: read UI-001 §3 and §5 for the stated rules, then audited the source and drove the running app
at desktop (1100px) and mobile (375px) widths. Counts are MEASURED from the tree at review time.

---

## THE HEADLINE

**Three navigation bars draw "you are here" three different ways, and two of them are visible at the
same time on a phone.** That is what you noticed. It is one component (`AppShell.vue`) containing
three separate `<nav>` blocks that were each styled on their own.

| nav | where | active state | items |
|---|---|---|---|
| top bar | `AppShell.vue:87` | accent underline | 5 |
| drawer | `AppShell.vue:128` | `bg-frame-deep` **fill** (`:134`) | 5 |
| bottom tabs | `AppShell.vue:162` | `text-badge` **gold text** (`:169`) | 4 |

UI-001 §3 is explicit: *"active state is a 2px `--accent` underline, **not a fill**"*. The top bar
obeys it. The other two each invented their own.

---

## A. NAVIGATION

### A1 — Two navs on screen at once, both called "Sections" · HIGH

MEASURED at 375px with the menu open: two visible `<nav>` elements, both `aria-label="Sections"`,
with different contents (5 items vs 4) and different active styling. `aria-label="Sections"` appears
**three times** in `AppShell.vue` (`:87`, `:128`, `:162`).

A screen-reader user gets three identically-named navigation landmarks and, on a phone, two live ones
disagreeing about what exists.

**Recommend:** keep the bottom tab bar as the phone navigation and delete the hamburger drawer
(`AppShell.vue:56-65` button, `:128-145` drawer, plus `menuOpen`). Give the three remaining bars
distinct labels — "Primary", "Sections". One phone nav, not two.

### A2 — Settings is unreachable on a phone without the drawer · HIGH

`phoneTabs` (`AppShell.vue:37-41`) takes four items. With Workshop and Settings both present the list
is five, so Settings never appears in the tab bar — MEASURED: bottom tabs showed
`Create, Inspiration, My Cases, Workshop`.

The comment above it (`:26-34`) says the slice was fixed so that "where you are is always reachable
and always indicated". That is true for the *current* section, but it cannot help a section you have
never been able to reach: Settings can only become current by being navigated to, and on a phone the
only route is the drawer A1 proposes deleting.

**Recommend:** fix this before or with A1. Either the tab bar carries an overflow "More" tab, or —
simpler and better — see A3.

### A3 — The nav changes length from 3 to 6 · MEDIUM

`App.vue:67-92`. Base three, plus the open case when one exists, plus Workshop and Settings when
`mode !== "user"` — the same condition written twice (`:90`, `:91`).

This is the deeper reason the bar feels inconsistent: it is a different bar on different visits, and
two of its entries are invisible until a mode is flipped somewhere else. A user who cannot find
Workshop is not missing a button, they are in the wrong mode — which the UI never says.

**Recommend:** settle on a fixed shape. Suggested: Create · Inspiration · My Cases as permanent,
the open case as a distinct affordance rather than a nav item (see A4), and Workshop + Settings
folded into one "Console" entry that is always present but explains itself in user mode instead of
vanishing. Collapse the duplicate condition either way.

### A4 — The open case duplicates Inspiration's icon · LOW

`App.vue:70` and `:87` both use `icon: "book"`. In the drawer and tab bar, which render the icon,
two entries are the same picture. The case label is also truncated at 18 characters (`:86`), so the
nav's width shifts per case.

**Recommend:** give the open case its own glyph (`bookmark` is taken by My Cases; `fingerprint` or
`spectacles` are free), or adopt A3 and drop it from the nav.

### A5 — The wordmark pretends to be a skip link · MEDIUM

`AppShell.vue:68`: `href="#main"` with `@click.prevent` that navigates to Create instead. It
announces "skip to main content" and does something else entirely. There is **no real skip link** in
the app — this is the only `#main` reference.

**Recommend:** make the wordmark a plain button (it is a navigation action, not a link to `#main`),
and add a genuine visually-hidden skip link as the first focusable element.

### A6 — The search pill is dead code · MEDIUM, easy win

`showSearch` (`AppShell.vue:19`, `:111`) is **never passed by any caller** — MEASURED: zero matches
outside the component. The form, the `query` ref, the `search` emit and `brand.searchPlaceholder`
can never render.

UI-001 lists the search pill as part of `AppShell`, so this is a documented feature that was never
wired up rather than an accident.

**Recommend:** delete it, and remove the row from UI-001 §3. If search is wanted later it will need
designing against real content anyway. ~20 lines out.

---

## B. TWO OF EVERYTHING

### B1 — Two icon systems, one of them for five shapes · HIGH, biggest single win

| | files | uses |
|---|---|---|
| `AppIcon` (bespoke, `icons.ts`) | 14 | 27 |
| `font-awesome-icon` | 7 | 24 |

The split is clean — Font Awesome appears only in the console (`WorkshopView`, the workshop panels,
`ExportPanel`, `ErrorNotification`) and `AppIcon` everywhere else. But look at what it renders:

- `spinner` — 15 uses
- `circle-check` / `circle-info` — 8 uses, all the same ternary in `WorkshopView.vue`
- whatever `ErrorNotification` picks

**Three packages and 14 MB of `node_modules` for five icon shapes.** Of the six registered in
`main.ts:16-23`, `circle-notch` is never rendered at all, and `circle-xmark` and
`triangle-exclamation` are used once each.

The replacement already exists in the codebase: `AppButton.vue:70` spins `<AppIcon name="gear">` for
its busy state. `icons.ts` already has `check`.

**Recommend:** add two glyphs (`info`, and a spinner ring), swap 24 call sites, drop
`@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons` and
`@fortawesome/vue-fontawesome`. One icon system, three fewer dependencies.

### B2 — The console re-implements the button · MEDIUM

`<AppButton>` 34 uses; raw `<button class="…">` 63. The raw ones cluster in the console —
`GeneratePanel` 8, `ProjectPanel` 6, `WorkshopView` 6 — each carrying its own copy of
`rounded-md border border-line bg-surface px-3 py-1.5 text-xs … disabled:opacity-60`.

UI-001 §3.1 defines six states *once*. These re-derive them by hand, and they do not match:
`disabled:opacity-60` is not the documented disabled treatment (`--surface-sunken` fill,
`--ink-faint` text).

Some raw buttons are legitimate — nav items, the audio scrub row, `FieldNumber`'s steppers are not
`AppButton`s. The console ones are not.

**Recommend:** convert the console's raw buttons to `<AppButton size="sm">`. UI-001 §8 grants the
console its own *layout*, not its own button.

### B3 — The blob-download dance is written seven times · MEDIUM

`ExportPanel.vue:70`, `ScoreCard.vue:48`, `CasesView.vue:83`, `CaseView.vue:124`,
`useWorkshopState.ts:1157`, `:1185`, `:1220` — each creates an object URL, builds an anchor, clicks
it, removes it, revokes. They do not all revoke the same way; `CaseView.vue:131` waits a frame with
a comment explaining why, and the others do not.

**Recommend:** one `saveBlob(blob, filename)` in `services/`, keeping CaseView's frame-delay
(it is the one with the reasoning attached). Seven copies to one.

---

### B4 — One component is painted in a different product's palette · MEDIUM

`ScoreTrendChart.vue` is the only component in the app carrying raw hex colours — nine of them, at
`:108`, `:116`, `:129`, `:137`, `:156`, `:168`, `:179`, `:193`. They are not off-brand shades of the
brand; they are **Tailwind's stock defaults**: slate `#94a3b8`, amber `#f59e0b`, indigo `#6366f1`,
rose `#f43f5e`.

So the one chart in the product is drawn in indigo and rose inside an app whose entire palette is
cream, forest green and brick red. It is live, not dead code — `AdvancedPanel.vue:222` renders it
whenever there are two or more scoring runs.

Every other component in the tree goes through the Tailwind scale with no stray hex. This one
component is the exception.

**Recommend:** map the nine to tokens — grid to `--line`, labels to `--ink-faint`, the series to
`--accent` and `--frame`, pass/fail to `--ok`/`--danger`, which is the pairing the rest of the app
already uses. Pure find-and-replace, no layout change. If a chart palette is genuinely needed beyond
the brand tokens, it belongs in `design/` as named values rather than inline in one component.

---

## C. THE RULE THAT IS ALREADY BROKEN

### C1 — "Red means one thing" · MEDIUM — decide, then enforce

UI-001 §1 calls this *"the single most important rule"*: accent is for the primary action and the
selected-state border. MEASURED, `bg-accent` also fills **progress bars** in four places:
`ProgressTrack.vue`, `WorkspaceRail.vue`, and — added by me last week —
`AudioPlayer.vue` and `NarrationPanel.vue`.

I should flag my own contribution here: two of the four are mine, and I added them without checking
§1. The pre-existing two mean this was already a de-facto pattern rather than something I broke.

**Recommend:** amend the rule rather than the code. Progress is not an action and never competes with
the CTA for attention, so "accent marks the primary action, the selected state, and progress" is an
honest description of what the app actually does. If the rule is to be kept as written instead, all
four need a new token — but then a red-free progress bar has to be designed, and that is a larger
change than it sounds.

---

## D. DOCUMENT AND BUILD HAVE DRIFTED

### D1 — Four of eleven documented components do not exist · LOW, but corrosive

UI-001 §3 names eleven. `NavLink`, `OptionTile`, `PrimaryButton` and `FeatureRow` are absent from
`components/ui/` and referenced nowhere in the source. Meanwhile `AppIcon`, `AppButton` and
`ProgressTrack` ship and are undocumented.

The `NavLink` absence is not cosmetic — it is *why* section A exists. Because there is no NavLink
component, three navs were styled separately and drifted.

**Recommend:** update §3 to the eleven that exist. Extracting a real `NavLink` would fix A1's styling
divergence structurally rather than by three matching edits.

### D2 — The Workshop is the only view with no HeroBanner · LOW

Every view imports and renders `HeroBanner` except `WorkshopView`, which has its own header block.
Defensible under UI-001 §8 (the console is an instrument), but it is the reason the Workshop reads as
a different product — and it is now also where narration lives, which a non-operator will visit.

**Recommend:** either give it a compact `HeroBanner` for continuity, or state in UI-001 §8 that the
console deliberately has no hero. Right now it is neither decided nor written down.

---

## SUGGESTED ORDER

Ranked by benefit per unit of risk.

| # | Item | Effort | Why first |
|---|---|---|---|
| 1 | A6 delete dead search | trivial | Pure removal, nothing can regress |
| 2 | B1 one icon system | small | Three dependencies and 14 MB gone |
| 3 | A1 + A2 one phone nav | small | Fixes the reported problem and a real a11y defect |
| 4 | A5 real skip link | trivial | Currently actively misleading |
| 5 | B3 one saveBlob | small | Seven copies to one |
| 5= | B4 retoken the chart | trivial | Find-and-replace; the only off-palette component |
| 6 | C1 settle the red rule | none | A decision, then the doc |
| 7 | D1 correct UI-001 §3 | trivial | Stops the drift compounding |
| 8 | B2 console buttons | medium | Largest diff; do it once the rest is settled |
| 9 | A3 + A4 fix the nav's shape | medium | Needs a product decision, not just a patch |
| 10 | D2 decide on the console hero | small | Blocked on 9 |

---

## WHAT IS ALREADY CONSISTENT

Worth recording so it is not "fixed" later:

- **Tokens.** Every component except `ScoreTrendChart` (B4) goes through the Tailwind scale — no
  stray hex anywhere else in the tree.
- **No dead components.** Every `.vue` in `components/` and `components/ui/` is imported somewhere.
- **The wordmark.** Lives only in `design/brand.ts`, exactly as UI-001 §7 requires — no component
  embeds the string.
- **`StepCard`.** Used uniformly across all five consumer views, `number` or `icon`, never both.
- **Accessibility groundwork.** Sections are `<section aria-labelledby>`, nav items carry
  `aria-current="page"`, controls have labels. The defects found above are specific, not systemic.
