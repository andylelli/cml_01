# Prompt Templates - Production Backbone

This folder contains production prompt templates for all active non-Agent-9 pipeline agents.

## Backbone Standard
Read this first:
- `documentation/prompts/PROMPT_BACKBONE_STANDARD.md`

It defines:
- Role layering (`system` / `developer` / `user`)
- Output and validation contracts
- Self-check and retry-repair protocol
- Global failure modes to block

## Agent Template Map
- Agent 1: `documentation/prompts/AGENT_1_SETTING_BEST_PROMPT.md`
- Agent 2: `documentation/prompts/AGENT_2_CAST_BEST_PROMPT.md`
- Agent 2b: `documentation/prompts/AGENT_2B_CHARACTER_PROFILES_BEST_PROMPT.md`
- Agent 2c: `documentation/prompts/AGENT_2C_LOCATION_PROFILES_BEST_PROMPT.md`
- Agent 2d: `documentation/prompts/AGENT_2D_TEMPORAL_CONTEXT_BEST_PROMPT.md`
- Agent 2e: `documentation/prompts/AGENT_2E_BACKGROUND_CONTEXT_BEST_PROMPT.md`
- Agent 3: `documentation/prompts/AGENT_3_CML_BEST_PROMPT.md`
- Agent 3b: `documentation/prompts/AGENT_3B_HARD_LOGIC_DEVICES_BEST_PROMPT.md`
- Agent 4: `documentation/prompts/AGENT_4_CML_VALIDATOR_BEST_PROMPT.md`
- Agent 5: `documentation/prompts/AGENT_5_CLUES_BEST_PROMPT.md`
- Agent 6: `documentation/prompts/AGENT_6_FAIRPLAY_BEST_PROMPT.md`
- Agent 7: `documentation/prompts/AGENT_7_NARRATIVE_BEST_PROMPT.md`
- Agent 8: `documentation/prompts/AGENT_8_NOVELTY_BEST_PROMPT.md`
- Agent 65: `documentation/prompts/AGENT_65_WORLD_BUILDER_BEST_PROMPT.md`

## Integration Guidance
When updating runtime prompt builders in `packages/prompts-llm/src/*.ts`:
1. Keep each agent's `system` identity stable.
2. Move strict output rules and enums into `developer` prompt.
3. Keep `user` prompt input-only and run-specific.
4. Keep JSON-only output requirement explicit.
5. Reflect known validator failures as hard constraints, not soft suggestions.

## Scope Note
Agent 9 is intentionally excluded from this template set.

