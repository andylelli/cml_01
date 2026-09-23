/**
 * A_101 §14.4 — THE CLUE THAT TIES THE CULPRIT TO THE WEAPON.
 *
 * MEASURED on seed 50862: fourteen essential clues, the weapon at the scene ("visible head wound and
 * bloodied heavy paperweight"), the culprit tied to the ledger and the compass ("Nora's exclusive
 * access and knowledge"), and NOTHING tying her to the thing that killed him. The reader said so
 * twice and scored `clues` 7/10 while every category around it reached 8.
 *
 * Slot 2b already offered "the unique trace, preparation detail, or mechanism link" — a disjunction,
 * and the model took the abstract branch. This slot asks for the physical branch and nothing else.
 */
import { describe, expect, it } from "vitest";

import { buildCluePrompt } from "../agent5-clues.js";

const caseOf = (overrides: Record<string, unknown> = {}) => ({
  CASE: {
    title: "The Judge's Tilt",
    death_method: "struck with a heavy paperweight",
    culpability: { culprit_count: 1, culprits: ["Nora Quayle"] },
    victim: { name: "Montague Gaunt" },
    cast: [
      { name: "Nora Quayle", role_archetype: "suspect", motive_seed: "he threatened to expose her" },
      { name: "Bertram Norbury", role_archetype: "detective" },
      { name: "Gwendolyn Vance", role_archetype: "suspect" },
      { name: "Montague Gaunt", role_archetype: "victim" },
    ],
    hidden_model: { mechanism: { description: "the judge's habitual tilting of the compass casing gave a fifteen-degree offset" } },
    inference_path: { steps: [{ observation: "the compass reading places her on the beach", correction: "held level it points at the office door" }] },
    discriminating_test: { design: "tilt the compass on the windowsill and read the bearing" },
    ...overrides,
  },
});

const promptOf = (cml: Record<string, unknown>): string => {
  const built = buildCluePrompt({ cml, clueDensity: "moderate", redHerringBudget: 1 });
  return [built.system, built.developer, built.user].filter(Boolean).join("\n");
};

describe("the weapon-link slot", () => {
  it("KNOWN-POSITIVE: the prompt asks for a physical trace tying the culprit to the means of death", () => {
    const prompt = promptOf(caseOf());
    expect(prompt).toMatch(/PHYSICAL trace connecting Nora Quayle to the means of death itself \(struck with a heavy paperweight\)/);
    expect(prompt).toMatch(/Access, knowledge, opportunity and presence do NOT satisfy this slot/);
  });

  it("KNOWN-NEGATIVE: the slot gives no example clue, so there is nothing to reproduce (A_67)", () => {
    const prompt = promptOf(caseOf());
    const start = prompt.indexOf("PHYSICAL trace connecting");
    expect(start).toBeGreaterThan(-1);
    const slot = prompt.slice(start, prompt.indexOf("usable by the reader before the reveal", start) + 40);
    expect(slot).not.toMatch(/e\.g\.|for example|such as|for instance/i);
  });

  it("a case with no recorded death method gets no weapon slot rather than an empty one", () => {
    expect(promptOf(caseOf({ death_method: "" }))).not.toMatch(/PHYSICAL trace connecting/);
  });

  it("one slot per culprit, and it names that culprit", () => {
    const two = promptOf(caseOf({ culpability: { culprit_count: 2, culprits: ["Nora Quayle", "Gwendolyn Vance"] } }));
    expect((two.match(/PHYSICAL trace connecting/g) ?? []).length).toBe(2);
    expect(two).toMatch(/PHYSICAL trace connecting Gwendolyn Vance/);
  });
});
