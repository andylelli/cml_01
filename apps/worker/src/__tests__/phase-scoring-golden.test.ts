import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { checkCast } from "@cml/prompts-llm";
import { scoreRealCml } from "@cml/story-validation";
import {
  scoreBackgroundPhase,
  scoreCastPhase,
  scoreCharacterProfilesPhase,
  scoreHardLogicPhase,
  scoreLocationsPhase,
  scoreNarrativePhase,
  scoreSettingPhase,
  scoreTemporalContextPhase,
  scoreWorldDocumentPhase,
} from "../jobs/agents/phase-scoring.js";

/**
 * SCO-12 (code review CR-03) — characterise every wired upstream phase score on the committed golden
 * bundles, so a refactor of an adapter, a vanity scorer or an honest scorer (SCO-02/03/04/05/09/10/11)
 * is proven byte-for-byte or shows as a snapshot diff. Since owner decision 8 (2026-10-01) phases 1, 2, 2c, 2e,
 * 3b and 7 are scored by their honest scorer alone (HONEST_SCORERS retired); since SCO-Q07 (2026-10-02) 2b, 2d and
 * 6.5 are too — their vanity scorers and adapters are deleted. Golden totals then: 2b 100 → 100 and 2d 100 → 100 on
 * all four bundles; 6.5 100 → 98 on 6b91b4b1 and eb1251aa (a location register names another season), 100 elsewhere.
 *
 * The phase functions are the runners' own scoring bodies (`phase-scoring.ts`), called with the
 * bundle's stored artifacts the way each runner passes them. `adapted` is pinned by digest: its full
 * JSON is ~10× the score and adds nothing a digest does not catch.
 *
 * Not covered: Agent 3's vanity score (built from run counters, not from an artifact — its honest
 * `scoreRealCml` is covered) and Agent 9 (the bundles carry no prose).
 */

const GOLDEN = join(__dirname, "..", "..", "..", "..", "eval", "golden");
const bundles = readdirSync(GOLDEN).filter((f) => /^bundle-.*\.json$/.test(f)).sort();

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v ?? null)).digest("hex").slice(0, 16);

async function scoreBundle(file: string) {
  const b = JSON.parse(readFileSync(join(GOLDEN, file), "utf8"));
  const a = b.artifacts;
  const spec = b.spec ?? {};
  const setting = a.setting.setting;
  const cast = a.cast.cast;
  const castSize = spec.castNames?.length || (spec.castSize || 6) + 1;
  const phases: Record<string, () => Promise<{ adapted: unknown; score: unknown }>> = {
    agent1_setting: () => scoreSettingPhase(setting, []),
    agent2_cast: () => scoreCastPhase(cast, setting, castSize, checkCast, []),
    agent2b_profiles: () => scoreCharacterProfilesPhase(a.character_profiles.profiles, cast, a.cml),
    agent2c_locations: () => scoreLocationsPhase(a.location_profiles, setting, a.background_context, []),
    agent2d_temporal: () => scoreTemporalContextPhase(a.temporal_context, setting, a.background_context),
    agent2e_background: () => scoreBackgroundPhase(a.background_context, setting, cast, []),
    agent3b_hard_logic: () => scoreHardLogicPhase(a.hard_logic_devices.devices, setting, cast, a.background_context, []),
    agent65_world: () => scoreWorldDocumentPhase(a.world_document, a.cml),
    agent7_narrative: () => scoreNarrativePhase(a.outline, a.cml, cast, spec.targetLength, []),
    agent3_cml_honest: async () => ({ adapted: null, score: scoreRealCml(a.cml) }),
  };
  const out: Record<string, unknown> = {};
  for (const [name, run] of Object.entries(phases)) {
    const { adapted, score } = await run();
    out[name] = { adaptedDigest: digest(adapted), score };
  }
  return out;
}

describe("phase scoring on the golden bundles (SCO-12)", () => {
  it("finds the committed bundles", () => {
    expect(bundles.length).toBeGreaterThanOrEqual(4);
  });

  for (const file of bundles) {
    it(file, async () => {
      expect(await scoreBundle(file)).toMatchSnapshot();
    });
  }
});
