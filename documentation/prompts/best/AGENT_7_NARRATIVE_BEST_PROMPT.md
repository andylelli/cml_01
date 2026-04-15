# Agent 7 - Narrative Formatter Prompt Analog (Runtime-Equivalent)

Source of truth: `packages/prompts-llm/src/agent7-narrative.ts`

## Message Stack Actually Sent
1. `system`: narrative architect role
2. `developer`: CML + clue + prose-requirement context
3. `user`: strict scene-outline generation directive

## System Prompt Analog (Verbatim Core)
```text
You are an expert mystery fiction narrative architect.
Transform validated CML and clue structure into scene-by-scene outline:
- three-act pacing
- fair-play clue placement
- dramatic progression
- character and atmosphere integration
Output JSON outline for prose generation.
```

## Developer Prompt Analog (Runtime-Equivalent)
```text
Runtime context includes:
- Mystery overview (title, era, setting lock, crime, culprit)
- false assumption and reveal context
- cast summary
- inference path and discriminating test
- clue distribution by act
- key constraints
- prose_requirements block extracted from CML

Quality bar:
- Scene purpose must be specific and progression-driving.
- Clue reveal and clue usage must be temporally separated.
- Character presence should align to motive/access constraints.

Micro-exemplars:
- Weak scene purpose: "Investigation continues."
- Strong scene purpose: "Force two alibis into contradiction by replaying dining-room timing under servant testimony."
- Weak dramatic element: "Tension rises."
- Strong dramatic element: "Detective notices wet cuff links despite suspect claiming no outdoor movement during rain window."

Silent checklist before return:
- exact scene count and act distribution
- clue reveal precedes usage
- discriminating test after supporting clues
- exact cast names in scene character arrays
- JSON only, no markdown fences
```

## User Prompt Analog (Runtime-Equivalent)
```text
Create full scene-by-scene outline.

Hard controls:
- exact scene total from story-length target
- exact Act I / II / III scene counts
- detective-type-specific entry constraints
- fair-play sequence rules:
  - clue reveal before clue usage
  - discriminating test only uses prior clues
  - separation between clue reveal and confrontation
- clue density minimum across scenes
- exact cast names only in scene character arrays
- include mandatory prose_requirements scene placements

Return JSON with acts/scenes/pacing notes.
```

## Runtime Gates
- `jsonMode: true`
- abort on truncation (`finish_reason=length`)
- parse/repair fallback and computed `totalScenes` correction
