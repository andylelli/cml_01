import { describe, expect, it } from "vitest";
import { isFilterSoftenEnabled, softenViolentWording } from "../jobs/agents/agent9-v2/filter-soften.js";

// A_108 — arm B of the engine pair: all three v2 writer drafts were refused (violence: medium) on a
// stabbing case the v1 writer wrote without a refusal. One softened retry, content-filter refusals only.
describe("softenViolentWording", () => {
  it("softens the case's graphic words and keeps the facts", () => {
    const r = softenViolentWording("The dead: Katherine Quayle, stabbed with a fencing foil. A fencing foil with fresh blood lies in her room. Stabbed the victim with the fencing foil.");
    expect(r.text).toBe("The dead: Katherine Quayle, killed with a fencing foil. A fencing foil with fresh stains lies in her room. Killed the victim with the fencing foil.");
    expect(r.replaced).toBe(3);
  });

  it("leaves text with nothing graphic untouched", () => {
    const t = "Frances opened the clock's glass face.";
    expect(softenViolentWording(t)).toEqual({ text: t, replaced: 0 });
  });

  it("does not touch words that merely contain a graphic stem", () => {
    expect(softenViolentWording("She stabilised the table and took a bloodhound's patience.").replaced).toBe(0);
  });
});

describe("isFilterSoftenEnabled", () => {
  it("is off unless set", () => {
    expect(isFilterSoftenEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isFilterSoftenEnabled({ AGENT9_V2_FILTER_SOFTEN: "true" } as NodeJS.ProcessEnv)).toBe(true);
  });
});
