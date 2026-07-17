/**
 * A_62 P4.4 (partial) — the injector/detector arms race, ended by contract.
 *
 * History: A_47 renamed the locked-fact time injection ("The time was recorded as…" → "The hour
 * stood at…") specifically to dodge that era's detectors; the Item-15 era correctly re-listed the
 * new phrase, and that ONE fixed string became the campaign's most frequent cap (21 verbatim
 * occurrences; Item 17 at 19/39 runs). This test pins the new contract: EVERY injection-template
 * output, across representative values, matches NO deterministic leakage/scaffold detector. If a
 * future detector re-listing catches an injector phrase, this test fails and the collision becomes
 * a conscious decision instead of a silent cap.
 */
import { describe, expect, it } from "vitest";
import { INJECTION_TEMPLATES } from "../jobs/agents/agent9-run.js";
import { detectTemplateLeakage, detectScaffoldNotProse } from "@cml/prose-guard";

const SAMPLE_VALUES: Record<string, Array<[string, string]>> = {
  time: [
    ["the staged time", "half past three"],
    ["the dinner hour", "seven o'clock"],
    ["the tide turn", "ten minutes past eleven"],
    ["the last sighting", "a quarter to eight"],
  ],
  duration_minutes: [
    ["the crossing", "twenty minutes"],
    ["the walk", "a quarter of an hour"],
  ],
  weight: [["the paperweight", "three pounds"]],
  length: [
    ["the corridor", "thirty feet"],
    ["the drop", "twelve feet"],
  ],
};

describe("injection templates × deterministic detectors — non-membership contract", () => {
  for (const [kind, cases] of Object.entries(SAMPLE_VALUES)) {
    it(`'${kind}' variants trip neither template-leakage nor scaffold detectors`, () => {
      const template = (INJECTION_TEMPLATES as any)[kind];
      for (const [desc, value] of cases) {
        const sentence = template(desc, value);
        if (!sentence) continue; // 'generic' is deliberately empty
        expect(detectTemplateLeakage(sentence), `leakage on: ${sentence}`).toEqual([]);
        expect(detectScaffoldNotProse(sentence), `scaffold on: ${sentence}`).toEqual([]);
      }
    });
  }

  it("the retired fixed string WOULD be caught — proving the detectors police this class", () => {
    expect(detectTemplateLeakage("The hour stood at half past three.").length).toBeGreaterThan(0);
  });

  it("variant selection is deterministic per value (reproducible runs)", () => {
    const t = (INJECTION_TEMPLATES as any).time;
    expect(t("d", "half past three")).toBe(t("d", "half past three"));
  });

  it("different values can select different variants (the 21-identical-sentences problem)", () => {
    const t = (INJECTION_TEMPLATES as any).time;
    const outputs = new Set(
      ["half past three", "seven o'clock", "ten minutes past eleven", "a quarter to eight", "noon", "six o'clock"]
        .map((v) => t("d", v).replace(v, "{v}")),
    );
    expect(outputs.size).toBeGreaterThan(1);
  });
});
