import { describe, expect, it } from "vitest";
import { formatProvisionalScoringFeedbackBlock } from "../src/agent9-prose.js";
describe("Agent 9 provisional scoring feedback", () => {
    it("formats rolling corrective directives for the next chapter prompt", () => {
        const block = formatProvisionalScoringFeedbackBlock([
            {
                fromChapter: 1,
                score: 88,
                deficits: ["paragraph structure too thin", "scene grounding weakness"],
                directives: [
                    "Use at least 4-5 substantial paragraphs with varied rhythm and one strong scene transition.",
                    "Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.",
                ],
            },
        ]);
        expect(block).toContain("PROVISIONAL CHAPTER SCORE FEEDBACK");
        expect(block).toContain("From Chapter 1: score 88/100");
        expect(block).toContain("paragraph structure too thin");
        expect(block).toContain("Required corrections:");
        expect(block).toContain("Do not repeat the same deficits in the next chapter.");
    });
    it("keeps only the latest two feedback entries", () => {
        const block = formatProvisionalScoringFeedbackBlock([
            { fromChapter: 1, score: 90, deficits: ["d1"], directives: ["x1"] },
            { fromChapter: 2, score: 91, deficits: ["d2"], directives: ["x2"] },
            { fromChapter: 3, score: 92, deficits: ["d3"], directives: ["x3"] },
        ]);
        expect(block).not.toContain("From Chapter 1");
        expect(block).toContain("From Chapter 2");
        expect(block).toContain("From Chapter 3");
    });
});
//# sourceMappingURL=agent9-provisional-feedback.test.js.map