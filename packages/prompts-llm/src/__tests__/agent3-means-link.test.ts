import { describe, expect, it } from "vitest";
import { buildCMLPrompt } from "../agent3-cml.ts";

// A_102 §7 — THE MEANS-LINK. 48 of 56 archived cases (86%) proved the culprit was PRESENT and never
// that they struck the blow, and the external reader named exactly that in four consecutive reads.
//
// The block is four literal string shapes, and the shapes are the whole mechanism. Measured over 14
// harness cases: prose asking for the same facts WITHOUT a shape was obeyed 0/3 and 1/3; the same
// facts WITH a shape were obeyed 4/4 and 4/4. A future edit that keeps the paragraph and drops the
// shapes would read like a tidy-up and would silently restore the defect, so the shapes are pinned.

const baseInput = {
  decade: "1930s",
  location: "Yorkshire",
  institution: "manor house",
  tone: "classic",
  weather: "misty",
  socialStructure: "gentry and staff",
  theme: "deception",
  primaryAxis: "temporal" as const,
  castSize: 4,
  castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"],
  detectiveType: "inspector",
  victimArchetype: "industrialist",
  complexityLevel: "moderate" as const,
  mechanismFamilies: ["clockwork tampering"],
  runId: "run-test",
  projectId: "proj-test",
};

describe("agent3 MEANS-LINK requirement (A_102)", () => {
  // buildCMLPrompt returns { developer, user }; the block only has to reach the model, so both
  // halves are searched. Reading one half and finding nothing is how a probe reports a prompt
  // change as a no-op when it landed in the other message.
  const built = buildCMLPrompt(baseInput);
  const prompt = `${built.developer}
${built.user}`;

  it("carries the means-link block", () => {
    expect(prompt).toContain("THE MEANS-LINK");
  });

  it("asks for the keeper, the reach list and the disturbance in the three constraint_space slots", () => {
    expect(prompt).toContain("constraint_space.access.objects");
    expect(prompt).toContain("constraint_space.access.permissions");
    expect(prompt).toContain("constraint_space.physical.traces");
  });

  it("gives each of the three a literal shape with slots", () => {
    expect(prompt).toContain("kept by <cast member's full name>");
    expect(prompt).toContain("reachable by <the culprit's full name>");
    expect(prompt).toContain("<what was found> in <a room or place this case already names>");
  });

  it("names the culprit inside the reach-list shape, not in a sentence beside it", () => {
    // Draft 3 put "The culprit is one of the reachable names" AFTER the shape and the reach list
    // omitted the culprit in 1 of 4 cases. Moving it into a slot fixed it.
    const shape = prompt.slice(prompt.indexOf("WHO COULD REACH IT"), prompt.indexOf("WHAT ITS TAKING DISTURBED"));
    expect(shape).toContain("<the culprit's full name>");
  });

  it("sends prints on the implement to an innocent instead of forbidding them", () => {
    // Three wordings across two agents prohibited a fingerprint on the weapon; all three produced
    // one (A_101 §15, and drafts 1-2 here). Assigning it a job worked where the prohibition did not.
    expect(prompt).toContain("belongs to an INNOCENT suspect");
    expect(prompt).toContain("red_herrings");
  });

  it("names both objects and puts the murder weapon in the first slot of every shape (A_102 §8.2)", () => {
    // The paid run on seed 61062: death_method was a letter opener, the concealment a lounge clock,
    // and every shape was filled in about the CLOCK. "The implement named in death_method" was a
    // reference the model bound to the object the case is really about.
    expect(prompt).toContain("THE MURDER WEAPON is the object death_method names");
    expect(prompt).toContain("THE CONCEALMENT DEVICE is whatever hidden_model.mechanism tampers with");
    expect(prompt).toContain("this case's mechanism families: clockwork tampering");
    expect(prompt).toContain("fills none of these four entries");
    expect(prompt).toContain('"<the murder weapon, in death_method\'s own words>: <what was found> in');
    expect(prompt).toContain('"<the murder weapon, in death_method\'s own words> — kept by');
  });

  it("requires the step that uses the link to narrow the pool rather than name the culprit", () => {
    expect(prompt).toContain("NARROWS the pool");
    expect(prompt).toMatch(/effect is the culprit's name has put the answer before the discriminating test/);
  });
});
