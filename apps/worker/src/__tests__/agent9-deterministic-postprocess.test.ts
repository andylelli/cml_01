/**
 * Regression tests for the deterministic post-processing that runs AFTER the LLM
 * and after validation in Agent 9 (run_1d55f7c7 shipped defects from this layer):
 *  - buildDeterministicGroundingLead injected raw setting/location/mood fields into
 *    a sentence template, producing the malformed Chapter-2 setting-metadata leak.
 *  - applyDeterministicPronounSweep flipped already-correct female pronouns to male
 *    via cross-paragraph inheritance on a split paragraph.
 */
import { describe, expect, it } from "vitest";
import {
  applyDeterministicProsePostProcessing,
  applyDeterministicPronounSweep,
} from "../jobs/agents/agent9-run.js";

describe("buildDeterministicGroundingLead (via applyDeterministicProsePostProcessing) — C4", () => {
  // The exact malformed profile fields from run_1d55f7c7.
  const locationProfiles = {
    primary: { name: "Wynthorpe Manor", place: "Wynthorpe Village", country: "Northumberland, England" },
    keyLocations: [
      {
        name: "Wynthorpe Manor - Library",
        sensoryDetails: {
          smells: ["old paper"],
          sounds: ["soft page rustling"],
          tactile: ["smooth oak desk surface"],
        },
      },
    ],
    atmosphere: {
      weather: "overcast with intermittent drizzle typical of english countryside",
      mood: "quiet tension underlies the cozy setting",
    },
  };

  it("does not emit a setting-metadata field dump when grounding a bland opening", () => {
    // A bland opening lacks sensory/atmosphere/anchor signals, so a grounding lead is prepended.
    const prose = {
      chapters: [
        { title: "Chapter 1: The Interview", paragraphs: ["The interview ended.", "Nothing more was said."] },
      ],
    };
    const result = applyDeterministicProsePostProcessing(prose, locationProfiles, [], false);
    const text = (result.chapters[0].paragraphs as string[]).join("\n\n");

    // The malformed mood phrase must never reach the prose.
    expect(text).not.toMatch(/underlies the cozy setting/i);
    // The verbose multi-clause weather must be replaced, not transcribed.
    expect(text).not.toMatch(/typical of english countryside/i);
    // The "Name - Sublocation" hyphen dump must be stripped.
    expect(text).not.toMatch(/Wynthorpe Manor\s*-\s*Library/i);
    // The full geographic chain must not be reproduced.
    expect(text).not.toMatch(/Northumberland, England/i);
  });
});

describe("applyDeterministicPronounSweep — C1/C3 (no female→male corruption)", () => {
  const cast = [
    { name: "Gerald Fox", gender: "male" },
    { name: "Charles Wynthorpe", gender: "male" },
    { name: "Margaret", gender: "female" },
  ];

  it("preserves a self-consistent female run inherited across a paragraph break", () => {
    const prose = {
      chapters: [
        {
          title: "Chapter 1: The Frozen Clock",
          paragraphs: [
            "Charles Wynthorpe slammed the door and stormed out into the rain.",
            // Orphaned female run — the old cross-paragraph inheritance flipped these to male.
            "Her gloves lay on the table, and her shawl was draped over the chair.",
          ],
        },
      ],
    };
    const result = applyDeterministicPronounSweep(prose, cast as any);
    const text = (result.chapters[0].paragraphs as string[]).join("\n\n");
    expect(text).toContain("Her gloves");
    expect(text).toContain("her shawl");
    expect(text).not.toMatch(/\bhis gloves\b/i);
    expect(text).not.toMatch(/\bhis shawl\b/i);
  });

  it("does not flip a perceived object's pronouns ('Fox saw her fingers')", () => {
    const prose = {
      chapters: [
        {
          title: "Chapter 1",
          paragraphs: ["Fox saw her fingers twist the edge of her apron, a small gesture of distress."],
        },
      ],
    };
    const result = applyDeterministicPronounSweep(prose, cast as any);
    const text = (result.chapters[0].paragraphs as string[]).join("\n\n");
    expect(text).toContain("her fingers");
    expect(text).not.toMatch(/\bhis fingers\b/i);
  });
});
