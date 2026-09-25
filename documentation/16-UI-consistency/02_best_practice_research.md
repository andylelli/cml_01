# 16.02 — Best practice: what the field says, and what it means here

**Written:** 2026-09-24 · **Type:** research notes. Each section gives the finding, its source, and the
consequence for CML. Findings from sources are **SOURCED**; the "for CML" lines are **INFERRED** from
those sources plus the audit in [01](01_audit.md).

---

## 1. Type scale — a small, named set, not a range

**Finding.** Design systems define a fixed type scale as named tokens and select from it; they do not
let components pick sizes. Material Design 3 publishes its scale as tokens (display/headline/title/
body/label × large/medium/small) and states that *no single product uses every style* — products pick
the subset they need. Primitive tokens exist to *"limit variance and eliminate the accidental
introduction of new fonts or weights at the level of individual components."* One reported audit cut
an organisation's styles to 18 "sufficient for 99% of cases".

Sources: [Material Design 3 — type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens) ·
[The Type Founders — tokens, styles and usage rules](https://thetypefounders.com/world-of-type/typography-in-your-design-system-tokens-styles-and-usage-rules/) ·
[UX Collective — semantic typography tokens](https://uxdesign.cc/mastering-typography-in-design-systems-with-semantic-tokens-and-responsive-scaling-6ccd598d9f21) ·
[Medium — implementing typography tokens](https://medium.com/@slava.karablikov/implementing-design-tokens-typography-47091602abf8)

**For CML.** The roles already exist (`t-*`). What is missing is (a) a *size scale* underneath them
that the console can use directly, and (b) a rule that makes an arbitrary `text-[…]` a review failure.
25 sizes should become ~8 ([03 §2](03_design_standard.md)).

---

## 2. Capitalisation — sentence case, with a written rule for proper nouns

**Finding.** Google (Material), Microsoft (Fluent), IBM (Carbon) and Red Hat (PatternFly) all default
to **sentence case** for UI text — buttons, menu items, navigation, dialog titles. Apple is the
exception, using title case for some navigation titles and menus. Sentence case reads faster and keeps
proper nouns distinguishable from common ones. The shared lesson is less the choice than the
discipline: each system *states* when each case applies and applies it uniformly.

Sources: [Carbon — writing style](https://carbondesignsystem.com/guidelines/content/writing-style/) ·
[PatternFly — capitalization](https://www.patternfly.org/ux-writing/capitalization/) ·
[USAGov — making the case for sentence case](https://blog.usa.gov/making-the-case-for-sentence-case) ·
[Every Interaction — title vs sentence case in UI](https://www.everyinteraction.com/articles/title-case-vs-sentence-case-in-ui/) ·
[CodeAva — when each format is correct](https://www.codeava.com/blog/sentence-case-vs-title-case-ui-standards)

**For CML.** Keep sentence case (it is already the majority — [01 §3](01_audit.md)), and write down
the one exception the app genuinely has: **section names are proper nouns** (Create, Inspiration,
My Cases, Workshop, Settings, and the new Preferences). Acronyms stay upper (CML, LLM, JSON, PDF).
CSS `uppercase` is a *role* decision (`t-section`, `t-eyebrow`), never a per-element one.

---

## 3. Data tables — build the features only where people live in the table

**Finding.** NN/g identifies four table tasks: **find** records matching criteria, **compare** data,
**view/edit** a single row, and **take actions** on records. Resizable, reorderable and hideable
columns serve those tasks — but practitioners are blunt about when they are worth building: *a daily
workspace earns all three; a table someone opens twice a month does not.* Where they are built, the
layout should **persist** (widths, order, visibility), to localStorage or better to the account so it
follows the user; resizing needs **minimum and maximum widths**; a **reset** is expected. Sticky
headers on tall tables and frozen first columns on wide ones are standard.

Numbers in tables should be **right-aligned in tabular figures** (`font-variant-numeric:
tabular-nums`) — proportional digits give a ragged left edge, so a column of costs cannot be scanned.
The font must actually contain `tnum` glyphs or the property silently does nothing.

Sources: [NN/g — Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/) ·
[Pencil & Paper — enterprise data table UX patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables) ·
[Setproduct — data table UI design reference 2026](https://www.setproduct.com/blog/data-table-ui-design) ·
[UX Design World — data table best practices](https://uxdworld.com/data-table-design-best-practices/) ·
[Handsontable — persist column widths and order](https://handsontable.com/docs/angular-data-grid/recipes/performance/persist-column-layout/) ·
[Stéphanie Walter — resources for complex data tables](https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/) ·
[MDN — font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric) ·
[DEV — tabular numbers vs monospace hacks](https://dev.to/alanwest/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks-25cn)

**For CML.** Apply the full column toolkit to the **operator's data** — the LLM log first (nine
fields, compared down the page: the "compare" task) and the chapter-score tables. **My Cases** is a
consumer list of a handful of rows; it gets a consistent table *style* but column customisation there
is optional and goes behind a preference ([04 §2](04_data_tables.md)). Source Sans 3 ships tabular
figures (INFERRED from the family's published OpenType features; P1 verifies with a rendered test),
so `tabular-nums` will work.

### 3.1 Library or hand-built

**Finding.** TanStack Table is headless and has first-class Vue support; column **sizing**,
**ordering**, **visibility** and **pinning** are built-in features whose state can be owned by the
application and persisted outside the table.

Sources: [TanStack — column sizing](https://tanstack.com/table/v8/docs/api/features/column-sizing) ·
[column ordering (Vue)](https://tanstack.com/table/latest/docs/framework/vue/guide/column-ordering) ·
[column visibility](https://tanstack.com/table/v8/docs/guide/column-visibility) ·
[table state (Vue)](https://tanstack.com/table/latest/docs/framework/vue/guide/table-state)

**For CML.** A real choice, given UI-008 spent effort *removing* dependencies. See
[04 §5](04_data_tables.md) — the recommendation is hand-built for the number of tables CML has.

---

## 4. Accessibility constraints the standard must respect

**Finding.** **WCAG 1.4.4 (AA)** — text must resize to 200% without loss of content or function.
Relative units (`rem`) respect the user's browser text-size setting as well as zoom; `px` respects
only zoom. **WCAG 1.4.12 (AA)** — content must survive user-set line height (1.5), paragraph spacing
(2×), letter spacing (.12em) and word spacing (.16em). **WCAG 1.4.10** — reflow at 320 CSS px.

Sources: [Eric Eggert — Resize Text and Reflow](https://yatil.net/blog/resize-text-reflow) ·
[DigitalA11Y — Understanding 1.4.4](https://www.digitala11y.com/understanding-sc-1-4-4-resize-text/) ·
[Accessibility.build — 200% zoom](https://accessibility.build/wcag/1-4-4) ·
[AAArdvark — 1.4.4 in plain English](https://aaardvarkaccessibility.com/wcag-plain-english/1-4-4-resize-text/)

**For CML.** (1) Every size token is `rem` — the 48 `px` sizes go. (2) A "text size" preference must
work by scaling the **root** size, so every `rem` follows; that only works once (1) is done, which is
why the type scale lands before the preference. (3) Table rows must not have fixed heights that clip
text at 200%.

---

## 5. Reading comfort

**Finding.** 45–75 characters per line (≈66 ideal), line height 1.4–1.6 for body text, measured in
`ch` rather than pixels. Novice readers do better near 45; practised readers tolerate 80.

Sources: [Baymard — optimal line length](https://baymard.com/blog/line-length-readability) ·
[UXPin — the 50–75 character rule](https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/) ·
[Kickpoint — line length and type size](https://kickpoint.ca/the-readability-formula-making-your-website-easy-to-read/)

**For CML.** The Tailwind config defines `max-w-prose` = `68ch` — inside the range — and the case
page's reading blocks use it (`CaseView.vue:356, 375, 442, 481`, MEASURED). `ProseReader`, which
renders the chapters themselves, does **not** apply it (MEASURED: no `max-w` in the file), so its line
length depends on the container; P0.1 measures what it renders at. Offer **reading width** (narrow 60ch / standard 68ch / wide 76ch) and **reading text size** as
preferences on the reader specifically, since a forty-minute manuscript is where comfort matters.

---

## 6. Personal preferences — defaults matter more than options

**Finding.** NN/g's research on customisation: companies invest heavily in customisation and find
*users rarely, if ever, customise*; what users say they want diverges from what they do; and **defaults
are left untouched** by most people, so the default *is* the design for the majority. Settings belong
in the account/profile area, reached from an avatar or "Account" control, grouped by category, most
used first, with destructive actions last and visually distinct.

Sources: [NN/g — Customization of UIs and Products](https://www.nngroup.com/articles/customization-of-uis-and-products/) ·
[NN/g — Customization Features report](https://www.nngroup.com/reports/customization-features/) ·
[NN/g — Personalization vs Customization](https://www.nngroup.com/videos/personalization-customization/) ·
[Toptal — settings UX](https://www.toptal.com/designers/ux/settings-ux) ·
[Setproduct — why users can't find settings](https://www.setproduct.com/blog/settings-ui-design) ·
[LogRocket — designing settings screens](https://blog.logrocket.com/ux-design/designing-settings-screen-ui/)

**For CML.** Two consequences. (1) **Consistency is not delegated to preferences** — the defaults have
to be right and uniform for everyone; preferences only adjust within the system (size, density,
width), never re-style it. (2) Keep the preferences list **short** — a dozen well-chosen items, not a
control panel. [05](05_user_preferences.md) applies both.

---

## 7. Respect the operating system first

**Finding.** `prefers-reduced-motion`, `prefers-color-scheme` and `prefers-contrast` expose the user's
OS settings; the established pattern for an in-app setting is a three-way **System / On / Off** (or
System / Light / Dark) where *System* is the default and follows the OS live.

Sources: [Smashing — persisting colour-scheme preferences](https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/) ·
[LogRocket — adapting to motion and theme preferences](https://blog.logrocket.com/adapting-user-motion-theme-preferences-css-javascript/) ·
[A11y Quest — preferences, settings and in-page controls](https://a11yquest.com/blog/2024-08-29-preferences-and-settings/) ·
[tempertemper — prefers-contrast](https://www.tempertemper.net/blog/using-the-increased-contrast-mode-css-media-query) ·
[MDN — User Preferences API](https://developer.mozilla.org/en-US/docs/Web/API/User_Preferences_API)

**For CML.** Reduced motion is already honoured globally from the OS (`tokens.css`); the preference
adds an explicit override, defaulting to **System**. A **dark theme is out of scope**: UI-001 makes
cream-not-white a brand rule, and a dark palette is a design job, not a toggle ([05 §6](05_user_preferences.md)).

---

## 8. Formats

**Finding (standard practice, INFERRED rather than sourced to one guideline).** Format dates, times
and numbers through `Intl.DateTimeFormat` / `Intl.NumberFormat` from **one module** with named
formats, so a display decision is made once. Show absolute time where it is data (logs) and relative
time where it is status ("2 min ago"), with the absolute value in a tooltip.

**For CML.** One `format.ts` replacing the eight shapes in [01 §7](01_audit.md), honouring the
date/time preferences in [05](05_user_preferences.md).
