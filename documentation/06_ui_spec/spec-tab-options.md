# Spec Tab — Field Reference

All configurable fields in the **Spec** tab of the CML UI, with available options and defaults.

---

## Decade

Controls the historical era of the story.

| Option | Notes |
|--------|-------|
| 1930s | Default |
| 1940s | |
| 1950s | |

**Default:** `1930s`

---

## Location Preset

Sets the physical environment for the mystery.

| Option | Description |
|--------|-------------|
| CountryHouse | English country manor / estate | Default |
| SeasideHotel | Coastal hotel or resort |
| Village | Small English village |
| Liner | Ocean liner / cruise ship |
| Theatre | Theatre or music hall |

**Default:** `CountryHouse`

---

## Tone

Controls the overall mood and register of the prose.

| Option | Description |
|--------|-------------|
| Cozy | Light, warm, gentle humour | Default |
| Classic | Straight golden-age detective fiction |
| Dark | Darker, more serious atmosphere |

**Default:** `Cozy`

---

## Theme (optional)

A free-text prompt that adds a thematic angle to steer the mystery (e.g. *"A charity gala with hidden rivalries"*). Leave blank for a generic plot.

- **Type:** free text  
- **Default:** empty

A **Suggest theme** button calls the LLM to propose a theme automatically.

---

## Cast Size

Number of suspects and witnesses. The detective is always added as an extra character on top of this number.

- **Type:** integer  
- **Range:** 4 – 12  
- **Default:** `6`

---

## Detective Type

Determines the archetype of the investigator.

| Value | Label |
|-------|-------|
| `police` | Police Inspector / Detective — Default |
| `private` | Private Investigator |
| `amateur` | Amateur / Layperson (AI invents the role freely) |

**Default:** `police`

---

## Cast Names (optional)

Comma-separated list of character names to use for the cast (e.g. `Avery, Blair, Casey, Dana`). If left blank the AI generates names automatically.

- **Type:** comma-separated text  
- **Default:** empty

---

## Primary Axis

The core logical puzzle mechanic around which the mystery is structured.

| Option | Description |
|--------|-------------|
| temporal | Alibi / timeline contradiction |
| spatial | Location / movement impossibility |
| identity | Who is who / hidden identity |
| behavioral | Character behaviour inconsistency |
| authority | Power / access / authority motive |

**Default:** `temporal`

---

## Story Length

Controls scene count and narrative pacing.

| Value | Label | Approximate word count |
|-------|-------|------------------------|
| `short` | Short | 15 000 – 25 000 words |
| `medium` | Medium — Default | 40 000 – 60 000 words |
| `long` | Long | 70 000 – 100 000 words |

**Default:** `medium`

---

## Prose Batch Size

Number of chapters generated per LLM call.

- **Type:** integer  
- **Range:** 1 – 10  
- **Default:** `1`  
- Higher values mean fewer API calls but coarser retry granularity if a chapter fails.
