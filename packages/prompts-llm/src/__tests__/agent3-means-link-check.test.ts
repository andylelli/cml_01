import { describe, expect, it } from "vitest";
import { instrumentWords, orphanedMeansLinkTraces, provesTheAct, textNamesAnyOf } from "../agent3-means-link.ts";

// A_102 §8 — the paid run on seed 61062, reduced to the four traces and the two names that mattered.
// death_method was a ceremonial letter opener; the concealment was a tampered lounge clock. Agent 3
// listed Katherine Bellamy as culprit while marking her innocent in its own cast; normalization
// reassigned to Ferdinand Jardine; the means-link trace was left naming Katherine.
const seed61062 = {
  death_method: "stabbed with a ceremonial letter opener",
  culpability: { culprits: ["Ferdinand Jardine"] },
  discriminating_test: {
    design: "Dr. Merrow re-runs the clock's hour hand under observation",
    knowledge_revealed: "the hand was unlatched and moved three hours",
    pass_condition: "the displayed time is shown to be false, eliminating the alibi",
  },
  constraint_space: {
    physical: {
      traces: [
        "Smudged fingerprints on clock face near hour hand — Neville Underhill",
        "Clock hour hand showing ninety degrees displacement — measurable physical misalignment",
        "Missing smudge on letter opener handle — indicates careful handling",
        "Displaced clock casing screws — by Katherine Bellamy",
      ],
    },
  },
};

describe("provesTheAct — the A_102 classifier, one copy for the harness and the pipeline", () => {
  it("scores the seed 61062 case TRACE ONLY: the one trace on the weapon names nobody", () => {
    const v = provesTheAct(seed61062);
    expect(v.verdict).toBe("TRACE ONLY");
    expect(v.weaponTracesNamingNobody).toEqual(["Missing smudge on letter opener handle — indicates careful handling"]);
    expect(v.linkingTraces).toEqual([]);
  });

  it("takes the instrument from what follows 'with', never the verb (A_102 §7.3 defect 4)", () => {
    expect(instrumentWords("stabbed with a ceremonial letter opener")).toEqual(["ceremonial", "letter", "opener"]);
    expect(instrumentWords("strangled")).toEqual([]);
    // "reveals Nora's presence when Gaunt was stabbed" must not count as naming the means.
    const v = provesTheAct({
      ...seed61062,
      death_method: "stabbed with a hunting knife",
      discriminating_test: { design: "", knowledge_revealed: "", pass_condition: "reveals Nora's presence near the dunes when Montague Gaunt was stabbed" },
      constraint_space: { physical: { traces: [] } },
    });
    expect(v.verdict).toBe("PRESENCE ONLY");
  });

  it("matches any name token of the culprit, as a whole word (defects 1 and A_103 B71)", () => {
    expect(textNamesAnyOf("Fingerprints on dagger trace to Gwendolyn", ["Gwendolyn Vance"])).toBe(true);
    expect(textNamesAnyOf("the rope in the proper place", ["Rope Everard"])).toBe(false);
    expect(textNamesAnyOf("Eve was there", ["Eve Everard"])).toBe(true);
  });

  it("scores every weapon trace, not the first (defect 2), and surfaces culprit traces without the weapon noun (defect 3)", () => {
    const v = provesTheAct({
      ...seed61062,
      culpability: { culprits: ["Gwendolyn Vance"] },
      death_method: "stabbed with a hunting dagger",
      constraint_space: {
        physical: {
          traces: [
            "Fingerprints of Nora Quayle on hunting dagger pommel",
            "Hunting dagger sheath with Gwendolyn Vance's initials",
            "Sand and blood stains on Gwendolyn Vance's clothing — hotel room and dunes",
          ],
        },
      },
    });
    expect(v.verdict).toBe("PROVES THE ACT");
    expect(v.linkingTraces).toEqual(["Hunting dagger sheath with Gwendolyn Vance's initials"]);
    expect(v.culpritTracesWithoutWeapon).toEqual(["Sand and blood stains on Gwendolyn Vance's clothing — hotel room and dunes"]);
  });
});

describe("orphanedMeansLinkTraces — the slot filled with a name normalization then overruled (A_102 §8.3)", () => {
  it("finds the trace still naming the model's original culprit after reassignment", () => {
    const orphaned = orphanedMeansLinkTraces(seed61062, ["Katherine Bellamy"], ["Ferdinand Jardine"]);
    expect(orphaned).toEqual(["Displaced clock casing screws — by Katherine Bellamy"]);
  });

  it("reports nothing when normalization kept the model's culprit", () => {
    expect(orphanedMeansLinkTraces(seed61062, ["Ferdinand Jardine"], ["Ferdinand Jardine"])).toEqual([]);
  });

  it("does not flag an innocent's print the requirement deliberately assigns (rule 8b.d)", () => {
    // Neville's smudges are misdirection by design; he was never listed as the culprit.
    const orphaned = orphanedMeansLinkTraces(seed61062, ["Katherine Bellamy"], ["Ferdinand Jardine"]);
    expect(orphaned).not.toContain("Smudged fingerprints on clock face near hour hand — Neville Underhill");
  });
});
