import { describe, it, expect } from "vitest";
import { repairMalformedSurfacing } from "../jobs/agents/agent9-run.js";

// A_57 D1 — clean a garbled evidence splice (a stray apostrophe joining two clauses with no space) into a
// grammatical separator, without touching valid possessives, contractions, or name particles.

describe("repairMalformedSurfacing (A_57 D1)", () => {
  it("rewrites the real run-09168377 splice into a clean separator", () => {
    const prose = {
      chapters: [
        {
          paragraphs: [
            "The estate's barometer settling on drizzle'the groundskeeper's entry noting silhouettes on the west lawn skies.",
          ],
        },
      ],
    };
    const out = repairMalformedSurfacing(prose);
    expect(out.repairCount).toBe(1);
    const text = out.prose.chapters[0].paragraphs[0];
    expect(text).toContain("drizzle; the groundskeeper's entry");
    expect(text).not.toMatch(/drizzle['’]the/);
  });

  it("does NOT touch possessives, contractions, or O'Brien/d'Arcy names", () => {
    const prose = {
      chapters: [
        {
          paragraphs: [
            "Mrs. O'Brien didn't open the manor's ledger; d'Arcy's alibi held, and they're certain it was ten o'clock.",
          ],
        },
      ],
    };
    const out = repairMalformedSurfacing(prose);
    expect(out.repairCount).toBe(0);
    expect(out.prose.chapters[0].paragraphs[0]).toBe(prose.chapters[0].paragraphs[0]);
  });

  it("repairs multiple splices across chapters and counts them", () => {
    const prose = {
      chapters: [
        { paragraphs: ["the rainfall tally noted by the manor groundskeeper'Eliza's entry stating shadows skies."] },
        { paragraphs: ["drizzle noted in the manor's official diary'security's entry marking shadows skies."] },
      ],
    };
    const out = repairMalformedSurfacing(prose);
    expect(out.repairCount).toBe(2);
    expect(out.prose.chapters[0].paragraphs[0]).toContain("groundskeeper; Eliza's entry");
    expect(out.prose.chapters[1].paragraphs[0]).toContain("diary; security's entry");
  });

  it("is a no-op on clean prose", () => {
    const prose = { chapters: [{ paragraphs: ["Arthur studied the stopped watch beneath the sundial."] }] };
    const out = repairMalformedSurfacing(prose);
    expect(out.repairCount).toBe(0);
  });
});
