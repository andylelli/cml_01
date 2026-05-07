import { describe, expect, it } from "vitest";
import { groundDiscriminatingKnowledgeRevealed } from "../shared/grounding.js";

describe("groundDiscriminatingKnowledgeRevealed", () => {
  it("rewrites ungrounded knowledge_revealed using reader-visible inference evidence", () => {
    const caseBlock: Record<string, unknown> = {
      inference_path: {
        steps: [
          {
            observation: "Clock arbor scratches line up with reverse winding marks.",
            correction: "The clock was rewound to fake the time of death.",
            required_evidence: [
              "Maintenance ledger records altered winding sequence.",
              "Witness heard second chime after the supposed stop time.",
            ],
            reader_observable: true,
          },
        ],
      },
      discriminating_test: {
        knowledge_revealed: "Only the culprit reacts nervously during confrontation.",
      },
    };

    groundDiscriminatingKnowledgeRevealed(caseBlock);

    const updated = (caseBlock.discriminating_test as Record<string, unknown>).knowledge_revealed as string;
    expect(updated).toMatch(/revealed facts/i);
    expect(updated).toMatch(/clock|arbor|scratch|wound|alter/i);
    expect(updated).not.toMatch(/reacts nervously/i);
  });

  it("rewrites mechanism and discriminating-test text when only character names overlap with the evidence corpus", () => {
    const caseBlock: Record<string, unknown> = {
      cast: [
        { name: "Dr. Mallory Finch" },
      ],
      hidden_model: {
        mechanism: {
          description: "A carefully orchestrated murder uses Dr. Finch's false timeline.",
        },
      },
      inference_path: {
        steps: [
          {
            observation: "The study clock shows ten past eleven when it should have chimed midnight.",
            correction: "The clock was wound back before the body was found.",
            effect: "This false timing narrows the murder window.",
            required_evidence: [
              "Tampering marks sit beside the clock face.",
              "Witnesses heard the clock chime at midnight.",
              "Footprints leave the study for the back garden.",
            ],
            reader_observable: true,
          },
        ],
      },
      discriminating_test: {
        design: "A controlled environment is set up where Dr. Finch is asked to recreate the evening.",
        knowledge_revealed: "The manipulation of the clock and the false timeline established by Dr. Finch.",
      },
    };

    groundDiscriminatingKnowledgeRevealed(caseBlock);

    const mechanism = ((caseBlock.hidden_model as Record<string, unknown>).mechanism as Record<string, unknown>).description as string;
    const discriminatingTest = caseBlock.discriminating_test as Record<string, unknown>;

    expect(mechanism).toMatch(/clock|midnight|tamper|footprint|garden/i);
    expect(mechanism).not.toMatch(/carefully orchestrated murder/i);
    expect(String(discriminatingTest.design)).toMatch(/compares/i);
    expect(String(discriminatingTest.design)).toMatch(/clock|midnight|tamper|footprint|garden/i);
    expect(String(discriminatingTest.design)).not.toMatch(/asked to recreate/i);
    expect(String(discriminatingTest.knowledge_revealed)).toMatch(/revealed facts/i);
    expect(String(discriminatingTest.knowledge_revealed)).not.toMatch(/Dr\. Finch/i);
  });

  it("keeps knowledge_revealed unchanged when it is already grounded", () => {
    const original = "Clock arbor scratches and altered winding sequence reveal the staged timeline.";
    const caseBlock: Record<string, unknown> = {
      inference_path: {
        steps: [
          {
            observation: "Clock arbor scratches are visible beneath the latch.",
            correction: "The winding sequence was altered before discovery.",
            required_evidence: [
              "Ledger lists the altered winding sequence.",
              "Scratches on the arbor match reverse winding.",
            ],
            reader_observable: true,
          },
        ],
      },
      discriminating_test: {
        knowledge_revealed: original,
      },
    };

    groundDiscriminatingKnowledgeRevealed(caseBlock);

    const updated = (caseBlock.discriminating_test as Record<string, unknown>).knowledge_revealed as string;
    expect(updated).toBe(original);
  });
});
