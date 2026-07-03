import { describe, expect, it, afterEach } from "vitest";
import { __testables } from "../jobs/agents/agent6-run.js";

// A_61 RC3.4 — guarantee every discriminating-test evidence clue is mapped strictly BEFORE the DT scene,
// even if the clue is absent from clues.clues (the Agent-5 soft-repair gap).

const { synchronizeClueTraceabilityFromCurrentClues } = __testables as any;

const makeCml = (evidenceIds: string[], mapping: any[] = []) => ({
  CASE: {
    discriminating_test: { evidence_clues: evidenceIds },
    prose_requirements: {
      discriminating_test_scene: { act_number: 3, scene_number: 3 },
      clue_to_scene_mapping: mapping,
    },
  },
});

const mappingOf = (cml: any) => cml.CASE.prose_requirements.clue_to_scene_mapping;
const entryFor = (cml: any, id: string) => mappingOf(cml).find((e: any) => e.clue_id === id);

describe("synchronizeClueTraceabilityFromCurrentClues — RC3.4 DT-evidence completeness", () => {
  const orig = process.env.AGENT6_DT_EVIDENCE_COMPLETENESS;
  afterEach(() => { process.env.AGENT6_DT_EVIDENCE_COMPLETENESS = orig; });

  it("maps an evidence clue absent from clues.clues to a pre-test scene (flag on)", () => {
    process.env.AGENT6_DT_EVIDENCE_COMPLETENESS = "1";
    const cml = makeCml(["clue_3"]); // clue_3 is NOT in clues.clues below
    const clues = { clues: [{ id: "clue_other", placement: "early", criticality: "essential" }] };
    synchronizeClueTraceabilityFromCurrentClues(cml, clues);
    const e = entryFor(cml, "clue_3");
    expect(e).toBeTruthy();
    const key = Number(e.act_number) * 100 + Number(e.scene_number);
    expect(key).toBeLessThan(3 * 100 + 3); // strictly before the DT scene
  });

  it("reschedules an evidence clue mapped AT/AFTER the DT scene to before it", () => {
    process.env.AGENT6_DT_EVIDENCE_COMPLETENESS = "1";
    const cml = makeCml(["clue_3"], [{ clue_id: "clue_3", act_number: 3, scene_number: 4 }]);
    const clues = { clues: [] };
    synchronizeClueTraceabilityFromCurrentClues(cml, clues);
    const e = entryFor(cml, "clue_3");
    const key = Number(e.act_number) * 100 + Number(e.scene_number);
    expect(key).toBeLessThan(303);
  });

  it("NEGATIVE: an evidence clue already before the DT scene is not moved", () => {
    process.env.AGENT6_DT_EVIDENCE_COMPLETENESS = "1";
    const cml = makeCml(["clue_3"], [{ clue_id: "clue_3", act_number: 1, scene_number: 2, delivery_method: "Seen" }]);
    const clues = { clues: [] };
    synchronizeClueTraceabilityFromCurrentClues(cml, clues);
    const e = entryFor(cml, "clue_3");
    expect(e.act_number).toBe(1);
    expect(e.scene_number).toBe(2);
    expect(e.delivery_method).toBe("Seen");
  });

  it("flag OFF → the backstop is a no-op (unmapped evidence stays unmapped)", () => {
    process.env.AGENT6_DT_EVIDENCE_COMPLETENESS = "";
    const cml = makeCml(["clue_3"]);
    const clues = { clues: [] };
    synchronizeClueTraceabilityFromCurrentClues(cml, clues);
    expect(entryFor(cml, "clue_3")).toBeUndefined();
  });
});
