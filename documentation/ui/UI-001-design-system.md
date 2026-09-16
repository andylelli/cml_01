# UI-001 — THE DESIGN SYSTEM

**Source:** the two mood boards in `temp/` (2026-09-16). This document is the contract between them
and the code. Every token below exists in `apps/web/src/design/tokens.css`; nothing in a component
should hard-code a colour, a radius or a font.

---

## 1. WHAT THE BOARDS AGREE ON

The two boards carry different wordmarks — *Murder in Minutes* and *The Crime Builder* — and different
hero illustrations, but they are one design system. Everything below is common to both, which is why
it is safe to build against.

| | |
|---|---|
| **ground** | warm cream, never white. White is reserved for cards sitting on cream |
| **frame** | deep forest green — top nav, footer, and any full-height side panel |
| **accent** | a single brick red, used *only* for the primary action and the selected-state border |
| **badge** | tan/gold circles carrying step numbers or section icons |
| **type** | high-contrast serif for display, letterspaced small-caps serif for section headers, humanist sans for body and controls |
| **shape** | 10–12px radii, 1px warm borders, generous padding, almost no shadow |
| **rhythm** | numbered sections, each a card, each with one badge and one subtitle line |

**The single most important rule: red means one thing.** On both boards red appears on the primary
CTA, the active nav underline, and the selected option's border. Nothing else. A second red — an
error state, a destructive button — must not borrow it; use `--danger`, which is deliberately browner.

---

## 2. TOKENS

### 2.1 Colour

| token | value | used for |
|---|---|---|
| `--ground` | `#F5EFE0` | page background |
| `--ground-warm` | `#F9F4E8` | alternating bands, hero wash |
| `--surface` | `#FFFDF7` | cards sitting on ground |
| `--surface-sunken` | `#F2EADA` | inset wells, disabled fields |
| `--frame` | `#2E4034` | nav, footer, side panel |
| `--frame-deep` | `#233026` | frame hover, footer base |
| `--frame-tint` | `#3C5243` | frame borders and dividers |
| `--accent` | `#B03A2E` | primary CTA, selected border, active underline |
| `--accent-hover` | `#963126` | CTA hover |
| `--accent-wash` | `#F6E7E2` | selected tile fill |
| `--badge` | `#D9B978` | step-number and section-icon circles |
| `--badge-ink` | `#7A5A22` | text/icon inside a badge |
| `--ink` | `#2B2B28` | body text |
| `--ink-soft` | `#6B6257` | subtitles, helper text, labels |
| `--ink-faint` | `#9A9183` | placeholders, disabled text |
| `--line` | `#E3DAC6` | borders, dividers |
| `--line-strong` | `#CFC2A6` | input borders, focus ring base |
| `--danger` | `#8C3B1E` | errors and destructive actions — **browner than `--accent` on purpose** |
| `--ok` | `#4A6B4E` | success, "ready" states |
| `--warn` | `#A9791F` | warnings |

**On the frame** (green), text is `--ground` and muted text is `#B9C7BB`. Never put `--ink` on
`--frame`.

### 2.2 Type

| role | stack | weight / size |
|---|---|---|
| display | `"Playfair Display", Georgia, "Iowan Old Style", serif` | 600, clamp 2rem–3.25rem, line-height 1.1 |
| section header | same serif, **letterspaced small caps** | 600, 0.95rem, `letter-spacing: .14em`, `text-transform: uppercase` |
| eyebrow | body sans, uppercase | 600, 0.7rem, `letter-spacing: .18em` |
| body | `"Source Sans 3", system-ui, -apple-system, "Segoe UI", sans-serif` | 400, 0.95rem |
| control | same sans | 500, 0.9rem |
| script accent | `"Caveat", "Segoe Script", cursive` | 600, 1.35rem — decorative only, never load-bearing |

Fonts load from Google Fonts with `display=swap` and **the fallbacks above are real fallbacks, not
decoration**: this app runs on localhost against a local API and must be legible with no network.
Nothing in the layout may depend on a webfont's metrics.

### 2.3 Shape and motion

```
--radius-sm: 6px     inputs, small chips
--radius:    10px    cards, tiles, buttons
--radius-lg: 16px    hero panels, modals
--border:    1px solid var(--line)
--shadow-card: 0 1px 2px rgba(43,43,40,.04), 0 1px 12px rgba(43,43,40,.03)
--focus-ring: 0 0 0 3px rgba(176,58,46,.28)
```

Motion is 150ms `ease-out` on colour and border only. **No transform animations on controls** — the
boards are still, printed things, and bouncing tiles read as a different product. `prefers-reduced-motion`
disables the remaining transitions.

---

## 3. THE COMPONENT VOCABULARY

Eleven components carry both boards. Each lives in `apps/web/src/components/ui/`.

| component | the board element | notes |
|---|---|---|
| `AppShell` | green nav + cream body + green footer | holds the wordmark, nav, and the search pill |
| `NavLink` | Create / Inspiration / My Cases | active state is a 2px `--accent` underline, not a fill |
| `HeroBanner` | the illustrated band under the nav | takes a slot for art; degrades to a flat `--ground-warm` wash with no art |
| `StepCard` | a numbered section card | `number` **or** `icon`, title, subtitle, default slot |
| `OptionTile` | the illustrated selectable tiles (Era, Setting, Tone) | selected = `--accent` border + `--accent-wash` fill. Renders as a real `<input type=radio>` group |
| `FieldSelect` | bordered select with a leading icon | icon sits in its own bordered cell, per board 2 |
| `FieldNumber` | the − 6 + stepper | board 1, step 4 |
| `PrimaryButton` | brick-red CTA with dice icon | one per view, maximum |
| `QuotePanel` | the dark green pull-quote column | board 1 only; optional on wide screens |
| `FeatureRow` | line icon + two-line description | inside `QuotePanel` |
| `ScriptNote` | the handwritten line | decorative, `aria-hidden` |

### 3.1 States, defined once

Every control shares these, and they are the only states:

| state | treatment |
|---|---|
| rest | `--line` border, `--surface` fill |
| hover | `--line-strong` border |
| focus-visible | `--focus-ring`, border `--accent` |
| selected | `--accent` border, `--accent-wash` fill, label `--ink` at 600 |
| disabled | `--surface-sunken` fill, `--ink-faint` text, no border change on hover |
| invalid | `--danger` border + a message below; **never colour alone** |

---

## 4. ILLUSTRATION

The boards lean on bespoke art this repo does not have and should not fake. The rule:

- **Hero art is a slot, not a requirement.** `HeroBanner` renders a typographic hero over
  `--ground-warm` when no art is supplied, and that state is a designed state, not a fallback.
- **Option tiles use flat inline SVG glyphs**, not illustrations — a house, a lamp-post, a liner, a
  proscenium. They live in `components/ui/icons/` as Vue components so they inherit `currentColor`.
- No raster asset ships in `apps/web/public/` unless a designer supplies one. A placeholder JPEG of a
  country house is worse than a good glyph.

---

## 5. ACCESSIBILITY, AND WHERE THE BOARDS NEEDED CHANGING

The boards are beautiful and two of their choices do not survive contact with a11y. Both are noted
here so nobody "fixes" the code back to the board.

1. **Selected option tiles are indicated by border colour alone on the board.** Colour alone fails
   WCAG 1.4.1. The build adds a check glyph in the tile's top-right corner on selection, and the tile
   is a real radio input so the state is exposed to assistive tech.
2. **The board's muted subtitle grey on cream is roughly 3.4:1.** `--ink-soft` (`#6B6257`) is darkened
   from the board to clear 4.5:1 on both `--ground` and `--surface`. It is visibly close to the board
   and legible, which the board's own value is not.

Beyond that: every control has a `<label>`, the step sections are `<section>` with an `aria-labelledby`
pointing at their heading, the nav is a `<nav>` with `aria-current="page"`, and focus order follows
the numbered sections. Contrast for `--accent` on `--surface` is 5.9:1; `--ink` on `--ground` is 12.1:1.

---

## 6. RESPONSIVE

Three widths, matching the boards:

| | |
|---|---|
| `< 768px` | single column; `QuotePanel` hidden; later step cards collapse to accordion rows (board 2's phone); bottom tab bar replaces top nav (board 1's phone) |
| `768–1180px` | single column, full-width cards, top nav, no quote panel |
| `> 1180px` | two columns — form at `minmax(0, 1fr)`, `QuotePanel` at a fixed `clamp(280px, 24vw, 340px)` |

Option tile rows are `grid-template-columns: repeat(auto-fit, minmax(128px, 1fr))` so a five-tile row
wraps to 3+2 rather than scrolling. **No horizontal page scroll at any width** — wide content
(tables in the operator console) scrolls inside its own container.

---

## 7. THE WORDMARK

The boards show two names. The build ships **Murder in Minutes** with the tagline *"Classic crimes.
New stories."*, both in `src/design/brand.ts` as a single object. Changing the product name is a
one-line edit there and touches nothing else — no component embeds the string.

---

## 8. WHAT THIS SYSTEM DOES NOT COVER

The operator console (CML inspection, validation panels, phase breakdown, LLM logs, scoring) has no
representation on either board. It inherits the tokens above — same ground, same frame, same type —
but keeps its dense table layout, because it is an instrument and the boards are a shopfront. Its
rules are in [UI-002 §6](UI-002-rebuild-plan.md).
