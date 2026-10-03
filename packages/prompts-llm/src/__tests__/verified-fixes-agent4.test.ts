import { afterEach, describe, expect, it } from "vitest";
import { buildRevisionPrompt } from "../agent4-revision.js";

/** A34-08 (owner decision 12, CML_VERIFIED_FIXES): the "Mystery Axis" line prints the axis, not 200 chars of Agent 3's prompt. */
const inputs = {
  originalPrompt: { system: "s", developer: "d", user: "Create a complete mystery case in CML 2.0 format with these exact specifications: **Setting & Era**: Decade 1930s" },
  invalidCml: "CASE: {}",
  validationErrors: ["x"],
  attempt: 1,
  primaryAxis: "spatial",
};
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("A34-08 — Agent 4's Mystery Axis line", () => {
  it("OFF: the first 200 characters of Agent 3's user prompt (unchanged)", () => {
    expect(buildRevisionPrompt(inputs).developer).toContain(`**Mystery Axis**: ${inputs.originalPrompt.user.substring(0, 200)}...`);
  });
  it("ON: the case's primary axis", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    expect(buildRevisionPrompt(inputs).developer).toContain("**Mystery Axis**: spatial\n");
  });
  it("ON without an axis: falls back to the old line", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    expect(buildRevisionPrompt({ ...inputs, primaryAxis: undefined }).developer).toContain("**Mystery Axis**: Create a complete");
  });
});
