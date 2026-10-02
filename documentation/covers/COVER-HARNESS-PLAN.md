# Book-cover harness — plan

**Status:** BUILDING (approved 2026-10-02). Live STATUS in §5; findings from building it in §6.
**Goal:** given a finished story in `stories/<id>/`, produce an original cover whose look derives from
the sample images in `temp/covers/`, reproducibly, and cheaply enough to compare several styles per book.

---

## 0. How to use it

**One-time setup — an image model.** Add ONE of these to `.env.local`:

```
OPENAI_API_KEY=sk-...            # gpt-image-2 via OpenAI direct (what evaria uses). Simplest.
```
or, for Azure, deploy an image model on a resource in an image region and set
`CML_COVER_IMAGE_PROVIDER=azure`, `CML_COVER_IMAGE_MODEL=<deployment>` and (if it is not the chat resource)
`AZURE_OPENAI_IMAGE_ENDPOINT` / `AZURE_OPENAI_IMAGE_API_KEY`. Optional: `CML_COVER_IMAGE_QUALITY=low|medium|high`,
`CML_COVER_LLM_PROVIDER=anthropic` to have Claude pick the anchors.

**Harness (any finished story):**
```
node scripts/covers/cover-harness.mjs --list-styles
node scripts/covers/cover-harness.mjs --latest 3 --styles all --dry-run          # briefs only, ~£0.01
node scripts/covers/cover-harness.mjs --story stories/<dir> --styles all          # 4 covers, paid
node scripts/covers/cover-harness.mjs --story stories/<dir> --styles deco-portrait+flat-travel-poster --variants 2
node scripts/covers/cover-harness.mjs --story stories/<dir> --reuse-anchors temp/covers/out/<dir>/<ts>/anchors.json --styles all
```
Output: `temp/covers/out/<story>/<timestamp>/index.html` — every cover side by side with its brief.

**In a run:** UI → Create → step 7 → *Book cover* (default *No cover*). Canary/CLI → `coverStyle: auto` (or a
card id) in the inputs YAML. `CML_COVER_GEN=true` makes `auto` the default for runs that do not choose.
**After a run:** open the case → *The Cover* → pick a style → *Make a cover*.

**New styles:** drop samples in `temp/covers/<anything>/`, run `node scripts/covers/analyse-samples.mjs`, and write
or edit a card in `library/cover-styles/cards/` from `samples.json`. A card is a list of operations — never
"in the style of" an artist.

## 1. What the samples are (MEASURED — each image viewed 2026-10-02)

15 images. The `1920s/` and `1930s/` folder labels do **not** match the images: five are modern
pastiches, the 1928 Vogue cover is filed under 1930s, and the 1933 *Lecturas* cover is filed under 1920s.
They group by **visual family** much better than by decade.

| File | What it is | Family |
|---|---|---|
| 1920s/image_01 | Modern painting: cloche-hat woman, red rose, cubist planes in gold outlines | A Deco portrait |
| 1920s/image_02 | Modern illustration: woman in green gown, sunburst arch, emerald and gold | A Deco portrait |
| 1920s/image_03 | *Lecturas* magazine, Sept 1933: stylised face, flat cobalt ground, pink flower | B Magazine illustration |
| 1920s/image_04 | 1920s fashion plate: five women in drop-waist dresses, interior, watercolour | B Magazine illustration |
| 1920s/image_05 | Modern acrylic: flapper in teal turban, black ground, gold stars | A Deco portrait |
| 1920s/image_06 | Modern advert pastiche: "Giggle Water" champagne, maroon, framed type | E Advert (weak fit) |
| 1930s/image_01 | Modern vector pastiche of Vogue: profile, teal sunburst, gold feathers, pearls | A Deco portrait |
| 1930s/image_02 | Vogue, Sept 1928 (Benito): elongated profile, yellow cloche, striped trees, falling leaves | B Magazine illustration |
| 1930s/image_03 | PLM travel poster (redrawn): bather in a shawl, Calvi citadel, flat blues and ochres | C Flat travel poster |
| 1930s/image_04 | Cunard poster: two liners, NY skyline, diagonal banner | D Painterly poster |
| 1930s/image_05 | Orient Line (Herbert Gwynn): domes and minarets in silhouette, orange border | C Flat travel poster |
| 1930s/image_06 | LNER (Greiwirth): train on a black headland, pink sky, red water | C Flat travel poster |
| 1930s/image_07 | LNER, "East Coast Joys" (Purvis): bathers and a white boat, flat blue sea | C Flat travel poster |
| 1930s/image_08 | WPA "See America": cave columns, two tiny figures, blue/white silkscreen | C Flat travel poster |
| 1930s/image_09 | LNER "Western Highlands": painterly loch and mountains | D Painterly poster |

### The five families, as rules a model can follow

- **A. Deco portrait.** One woman, head and shoulders or three-quarter length. Sunburst or arched
  geometry behind her. 2–3 jewel tones plus gold line-work. Glossy, stylised faces. *For mystery:* the
  femme-fatale or suspect cover. It carries no threat on its own.
- **B. Magazine illustration.** An elongated figure in profile and one seasonal motif (leaves, flowers).
  Big flat ground colour, simple outlines, soft gouache shading. *For mystery:* a society house, a single
  suspect, a quiet threat.
- **C. Flat travel poster (lithographic).** A place is the subject. Silhouettes, 3–5 flat inks, no
  gradients or only one, a strong diagonal or horizon, tiny human figures for scale, a framed type band at
  top and bottom. **The strongest fit**: the axis is often spatial, every book has a location preset, and
  silhouette plus shadow carries menace without gore.
- **D. Painterly poster.** As C but in gouache or oil, with depth, many colours and atmospheric light.
  Good for a landscape-led story; harder to make look original.
- **E. Advert pastiche.** Mostly lettering. Excluded as a base. Its **framed type band** is reused by
  the typography pass.

**What none of the samples have (INFERRED):** menace. They are fashion and travel images. Every family
therefore gets a mystery modifier: one clue object in the foreground, one long shadow or one figure
half out of frame, and an unlit window or doorway. The detail comes from the story, not the card.

### Copyright (INFERRED; the reason for the design in §2)

Several samples are probably still in copyright: the modern pastiches; Purvis (died 1957, so UK copyright
until 2027); Benito (died 1981). The WPA poster is public domain. The harness therefore **does not send the
sample images to the image model.** They are analysed once into written style cards, and only the cards
reach generation. This also follows the finding that the model obeys operations, not resemblance
(`prompts-move-operations-not-statistics`).

---

## 2. Design

```
temp/covers/<family>/*.jpg ──(1) analyse, vision LLM, once──▶ library/cover-styles/samples.json
                                                                 │ hand-curated into
                                                                 ▼
                                                     library/cover-styles/<family>.yaml  (A–D)
stories/<id>/run-params.json ─┐
stories/<id>/<title>.md ──────┼─(2) story extract ─▶ visual anchors (place, clue object, mood, era)
                              │
                              └─(3) art brief: anchors + 1–2 style cards ─▶ brief.json (text only)
                                                       │
                                     (4) image model ──▶ art.png (no lettering, top 28% left empty)
                                                       │
                                     (5) typography ───▶ cover.png (title, "A Mystery", type band)
                                                       │
                                     (6) contact sheet ▶ index.html: every cover side by side, with its brief
```

### Steps

1. **`scripts/covers/analyse-samples.mjs`**: a vision call per image (the existing Azure chat
   deployment accepts images). It writes a fixed-shape JSON per sample: palette (hex), medium,
   composition, subject, type treatment and family. It runs once, and again only when you add samples.
   I've already done this by eye for the 15 above, so the script exists for **future** samples and checks
   my hand classification against the model's.
2. **Style cards: `library/cover-styles/{deco-portrait,magazine-illustration,flat-travel-poster,painterly-poster}.yaml`**.
   Fields: `palette`, `medium`, `composition`, `motifs`, `figure_treatment`, `type_band`, `font`, `avoid`,
   `suits: {axis, tone, location}`, and `samples: [paths]` for provenance only. Each card is a list of
   countable operations ("3–5 flat inks", "one silhouette", "horizon in the lower third"), never "in the
   style of <artist>". No card names a real artist or publication.
3. **Story extract: `scripts/covers/extract-anchors.mjs`**. Input: `run-params.json` (title, era, location,
   tone, axis, angle, cast) plus chapter 1 and the final chapter of the manuscript. One LLM call with a fixed shape:
   `{ place, time_of_day, weather, clue_object, mood, figure? }`. It **must not reveal the culprit or the
   method on the cover.** The prompt asks for an object that appears in chapter 1, which is spoiler-safe by
   construction.
4. **Art brief: `scripts/covers/write-brief.mjs`**. Anchors plus the chosen card(s), giving one prompt of about 120–180
   words built from a template (shape, not prose): *subject → composition → palette → medium → mystery
   modifier → empty type band → negatives*. Blending rule when two cards are given: palette and medium
   from card 1, composition from card 2.
5. **Image call**: an image deployment on the same Azure resource. `1024×1536`, quality `medium` by
   default, `high` with a flag. The prompt is sent exactly as written in `brief.json`.
6. **Typography**: `sharp` composites an SVG type band over `art.png`, using the card's `type_band`
   (framed band at top, or full-bleed top) and an OFL font from Google Fonts held in `library/cover-styles/fonts/`.
   The title and author line are typeset by code, never by the model.
7. **Contact sheet**: `index.html` in the output folder, a grid of covers, each captioned with its
   styles and brief, so styles are compared by eye in one view.

### Command line

```
node scripts/covers/cover-harness.mjs --story stories/story_20261002-1855 \
     --styles flat-travel-poster,magazine-illustration --variants 2 [--dry-run] [--quality high]
node scripts/covers/cover-harness.mjs --story <dir> --all-styles      # one cover per card
node scripts/covers/cover-harness.mjs --batch 3 --all-styles          # latest 3 stories × 4 cards
```

- `--dry-run` writes the anchors and briefs and makes **no image call**. That's the free inspection step.
- Output: `temp/covers/out/<story-id>/<timestamp>/` holding `anchors.json`, `brief-<n>.json`, `art-<n>.png`,
  `cover-<n>.png` and `index.html`. Each `brief.json` holds the full prompt, the card ids and the model
  settings, enough to reproduce the cover.
- This is a harness under `scripts/`, not a pipeline stage. Wiring it into the pipeline as an Agent 10
  stage, behind an OFF flag, is a later decision once one style family is clearly winning.

---

## 3. Cost (ASSUMED — list prices, to be checked against the first real call)

| Item | Per call | First test matrix |
|---|---|---|
| Anchor extract + brief (chat) | <£0.01 | 3 stories → ~£0.02 |
| Image, medium quality, 1024×1536 | ~£0.05 | 3 stories × 4 cards = 12 → ~£0.60 |
| Image, high quality | ~£0.20 | only for finalists |
| Sample analysis (vision, once) | <£0.01 per image | 15 → ~£0.10 |

The first full matrix costs under **£1**, which is less than one book run.

---

## 4. What I need from you before building

1. **An image deployment.** `.env.local` has no image model. Deploy `gpt-image-1` (preferred: it follows
   long prompts and leaves an empty band when told to) or `dall-e-3` on the Azure resource, and give me the
   deployment name. It will be read as `AZURE_OPENAI_IMAGE_DEPLOYMENT`.
2. **Permission to add `sharp`** as a root devDependency (typography), and to download two or three OFL
   fonts from Google Fonts (e.g. Limelight, Poiret One, Josefin Sans) into `library/cover-styles/fonts/`.
3. **A yes for the first paid matrix** (§3, under £1), after I've shown you the `--dry-run` briefs.

## 5. Build order and STATUS

| # | Item | Status | Commit |
|---|---|---|---|
| 1 | Sample analysis by eye (§1) | DONE | (this doc) |
| 2 | Style cards A–D: `library/cover-styles/cards/*.yaml` | DONE | see git log `feat(covers)` |
| 3 | `@cml/covers` package: cards, selection, anchors, brief, image client, typeset, contact sheet, orchestrator, 22 tests | DONE | `feat(covers)` |
| 4 | Harness `scripts/covers/cover-harness.mjs` with `--dry-run`, `--no-llm`, `--reuse-anchors`, `--into-story` | DONE | `feat(covers)` |
| 5 | Image provider: OpenAI direct (gpt-image-2) **or** Azure deployment | BUILT — needs `OPENAI_API_KEY` in `.env.local`, or an Azure image deployment | `feat(covers)` |
| 6 | Typography: `@napi-rs/canvas` + 4 OFL fonts (`library/cover-styles/fonts/`) | DONE (verified by render) | `feat(covers)` |
| 7 | Flags registered: `CML_COVER_*` (FLAG-AUDIT addendum; flag checker taught the prefix) | DONE | `feat(covers)` |
| 8 | Pipeline post-pass: API run (spec `coverStyle`, after `pipeline_complete`, never awaited) + canary (`coverStyle` input, `COVER_SAVED`/`COVER_SKIPPED`); `runCoverPostPass` never throws | DONE | `feat(covers): wire` |
| 9 | UI: "Book cover" select on Create (default **No cover**); "The Cover" card on a finished case with style picker + make/remake; routes `GET /api/cover-styles`, `GET/POST /api/projects/:id/cover`, `GET …/cover.png` | DONE — verified in the browser with no key (disabled, reason shown) | `feat(covers): wire` |
| 10 | Vision analysis `scripts/covers/analyse-samples.mjs` → `library/cover-styles/samples.json` | DONE — 12/15 agree with §1 | `feat(covers): samples` |
| 11 | First paid matrix: 3 stories × 4 cards at medium | **needs owner yes** | |

## 6. Findings from building it

- **MEASURED — "chapters 1–2 are spoiler-safe by construction" was FALSE.** First real anchor run, 3 stories: the
  model picked the victim's bedroom and the WEAPON on 2 of 3 ("letter opener with smeared handle", "hunting knife
  with scratched blade"). The opening contains the discovery. Reshaping the request (the place is the setting seen
  from outside; the object belongs to the place) left 1 of 3. Final shape: three candidate objects + a code
  backstop (`CRIME_OBJECT_RE` / `CRIME_PLACE_RE`) that takes the first non-crime candidate and records rejections in
  `anchors.json`. Re-run: 0 of 3 chosen objects are weapons; the backstop fired once ("bloodstained letter opener").
- **INFERRED — a residual spoiler class remains:** an object that IS the clue but is not a weapon ("wristwatch stopped
  at six o'clock" on a clock-deception book). Titles in this pipeline usually name the device already, so it is low
  harm; a fix would need the CML's clue list, which the harness does not read.
- **MEASURED — the flag checker could not see the new flags** (`CML_COVER_*` matched no prefix) and reported clean.
  Prefix added; it then listed all 7.
- **MEASURED — first two real covers (2026-10-02, seed story_20261002-1855, gpt-image-2 via OpenAI, medium,
  reused anchors).** Both returned in ~38 s; 1,372 image-output tokens each (~$0.04 each at an ASSUMED $30/M).
  Predictions: (1) API works — YES; (2) top band left calm — YES on both; (3) no weapon, no lettering in the art —
  YES; (4) which reads as a mystery jacket — the Deco portrait (figure, gesture, mood); the "flat travel poster"
  did NOT follow its card: an interior with modelled shading rather than an exterior in flat silhouette inks.
  **New spoiler class, MEASURED:** both pictures paint the hidden wall panel and the disturbed carpet patch —
  they came from `place_details` ("stone walls with a hidden panel", "heavy carpet with disturbed patch"), which
  the crime filter does not inspect and which pulled the scene indoors. Fix: ask for details of the place AS SEEN
  FROM OUTSIDE and run the filter over them too.
- **MEASURED — the vision pass agrees with the hand classification on 12/15.** Disagreements: *Lecturas* (A vs
  hand B) and both painterly posters read as C — family D may be too thin to keep as its own card.
- **MEASURED (one model's opinion, not a reader's) — it contradicts §1's "C is the strongest fit".** gpt-4.1-mini
  rates mystery fit 4–5 for the Deco portraits (A) and 2 for every flat travel poster (C). §1's ranking was
  INFERRED. The first paid matrix (item 11) is what settles it; until then `auto` keeps ranking by axis/location/tone.
- **MEASURED — the anchor call is verifiable by label**: one harness dry run added 1 line tagged
  `Agent10-CoverAnchors` to `logs/llm-prompts-full.jsonl` (0 → 1). The API path passes the same logger.
- **MEASURED — Azure must not be inferred from the chat resource.** The first `/api/cover-styles` reported
  `azure/gpt-image-2` as configured because the chat endpoint+key were present; that resource has no image
  deployment, so every button press would have 404'd. Azure is now chosen only by `CML_COVER_IMAGE_PROVIDER=azure`
  or an `AZURE_OPENAI_IMAGE_ENDPOINT`.
- **MEASURED — `coverStyle` would have been dropped by the canary input allowlist** (`canary-input-overrides.mjs`
  is a silent filter). Added; a YAML with `coverStyle: deco-portrait` now reaches canary-core (probe run).
- **MEASURED — a heredoc-patched regex shipped with literal backspace characters** (`` → U+0008) and let
  "letter opener" through; the new crime-filter test caught it.
