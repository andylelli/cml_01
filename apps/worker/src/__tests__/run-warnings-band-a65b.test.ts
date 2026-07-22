import { describe, expect, it } from "vitest";
import { classifyRunWarning, bandRunWarnings } from "../jobs/run-warnings.js";

// A_65b Ph2 — the warning-channel split, fixtured on the A_64 probe's ACTUAL 37-warning artifact
// (mystery-1784662295274). The banding contract: telemetry/status reads `info`; defect signals
// and deterministic floor/synthesis firings read `warn`; unknown lines default to `warn`.

const PROBE_INFO = [
  "Scoring system enabled - tracking quality metrics and retries",
  "Cross-run novelty: diverging from 20 recent run(s)",
  "[agent3b-plausibility][shadow] gate=shadow score=20 ran=true",
  'Pillar 1: locked fact registry built with 3 fact(s): tide_schedule="seven feet"',
  "[Novelty skeleton-judge SHADOW] variation vs the_big_bow_mystery: Keep what is distinctive",
  "Agent 5: deterministic remediation mode active (LLM retry loops disabled by default)",
  "Agent 6: deterministic remediation mode active (pre-Agent9 retries disabled by default)",
  "Clue-spec (shadow): 14 required slots; 100% of shipped clues map to one.",
  "Agent 6 structural pre-audit: PASS — all 3 inference step(s) covered, 3 evidence clue(s) verified",
  "Final-story rubric (shadow): 63/100 — Promising but rough",
];

const PROBE_WARN = [
  '[agent2-victim][repair] designated Eleanor Voss as the named victim (was "Cultural Insider").',
  "[agent2-victim][repair] removed the victim Eleanor Voss from possibleCulprits (a victim cannot also be a suspect).",
  "Inference coverage: [warning] Inference step 1 has no contradiction clue",
  "Inference coverage: [warning] 1 red herring(s) may accidentally support the true solution (rh_1)",
  "Agent 5: 1 red herring(s) overlap true-solution signals; regenerating for separation",
  "Agent 5 red-herring deterministic sanitizer: rh_1: sanitized overlap terms in description/misdirection",
  "Agent 5 culprit-evidence deterministic synthesis: clue_culprit_direct_1: synthesized direct culprit evidence",
  "Agent 5 strict mapping contract synthesis: clue_culprit_direct_dr_mallory_finch <= cloned from clue_4",
  "Agent 5 strict late clue slot repair: synthesized clue_late_optional_slot_1",
  "Agent 5 strict-step deterministic synthesis: added clue_fp_contradiction_step_1 as early essential contradiction clue",
  "CML gate: back-filled evidence_clues with 1 clue(s): clue_id_1",
  "[Agent 9] regen-scaffold UNRESOLVED ch10 scaffold_ch10_p2: exhausted (cap may still apply).",
  "[Agent 9] scaffold SHIP-CHECK floored [B5:beyond_reasonable_doubt] in ch10 — template re-introduced after the regen pass",
];

describe("classifyRunWarning — A_65b Ph2 banding contract", () => {
  it("telemetry/status lines band as info (the ~40% channel pollution)", () => {
    for (const w of PROBE_INFO) expect(classifyRunWarning(w), w).toBe("info");
  });

  it("defect signals and deterministic floor/synthesis firings band as warn", () => {
    for (const w of PROBE_WARN) expect(classifyRunWarning(w), w).toBe("warn");
  });

  it("designed contract stamps are info; deficiency-response repairs are warn", () => {
    // the plant stamp = design doing its job on a healthy outline → info
    expect(classifyRunWarning("[Agent 7 plant-before-reveal] clue_11→scene 1 (reveal 3)")).toBe("info");
    // the discovery-tell line fires only when the tell was MISSING → a floor firing → warn
    expect(
      classifyRunWarning('[Agent 7 discovery-tell] body-discovery scene referenced no cause-of-death tell; added tell clue "c1"'),
    ).toBe("warn");
  });

  it("unknown lines default to warn (conservative — unclassified keeps the old accounting)", () => {
    expect(classifyRunWarning("Some brand new warning nobody classified")).toBe("warn");
  });

  it("bandRunWarnings preserves every line across exactly two bands", () => {
    const all = [...PROBE_INFO, ...PROBE_WARN];
    const { info, warn } = bandRunWarnings(all);
    expect(info.length + warn.length).toBe(all.length);
    expect(info).toHaveLength(PROBE_INFO.length);
    expect(warn).toHaveLength(PROBE_WARN.length);
  });
});
