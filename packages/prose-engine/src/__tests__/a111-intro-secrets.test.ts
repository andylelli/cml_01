import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * A_111 — an introduction may not give away the newcomer's secret (PROSE_V2_OPENING). The relation came from the cast's
 * pair sentence, which is written for the plot: Marguerite Selwyn's chapter-1 facts said she was "embezzling manor
 * funds". MEASURED before the fix: 70 of 90 relations in the stored contracts shared two or more distinctive words with
 * the member's privateSecret or motiveSeed; after it, 0 of 10 share any (probes/intro-relations.mjs).
 */
afterEach(() => {
  delete process.env.PROSE_V2_OPENING;
  delete process.env.CML_A110_UPSTREAM;
});

type Member = Record<string, unknown> & { name: string };
type Pair = { character1: string; character2: string; relationship: string };

/** A stored case with a non-culprit newcomer introduced, and its relation re-written per case. */
const subject = (() => {
  process.env.PROSE_V2_OPENING = "1";
  for (const p of completeProjects()) {
    const c = buildBookContract(p.input);
    const intro = c.scenes.flatMap((s) => s.opening?.introductions ?? []).find((i) => !c.fairPlay.culprits.includes(i.name));
    if (intro) return { input: p.input, name: intro.name, victim: c.fairPlay.victim };
  }
  throw new Error("no stored case introduces a non-culprit");
})();

const introduce = (relationship: string, member: Partial<Member> = {}, whyHere?: string) => {
  process.env.PROSE_V2_OPENING = "1";
  const input = structuredClone(subject.input) as ContractInput;
  const cast = input.cast as unknown as { characters: Member[]; relationships?: { pairs?: Pair[] } };
  const characters = cast.characters.map((m) => (m.name === subject.name ? { ...m, publicPersona: "Quiet and exact", privateSecret: "", motiveSeed: "", ...member } : m));
  const others = (cast.relationships?.pairs ?? []).filter((p) => ![p.character1, p.character2].includes(subject.name) || ![p.character1, p.character2].includes(subject.victim));
  input.cast = { ...cast, characters, relationships: { pairs: [...others, { character1: subject.name, character2: subject.victim, relationship }] } } as unknown as ContractInput["cast"];
  if (whyHere !== undefined) {
    process.env.CML_A110_UPSTREAM = "1";
    const profiles = (input.profiles as { profiles?: Array<Record<string, unknown>> } | undefined)?.profiles ?? [];
    input.profiles = { ...(input.profiles as object), profiles: [...profiles.filter((p) => p.name !== subject.name), { name: subject.name, whyHere }] } as ContractInput["profiles"];
  }
  return buildBookContract(input).scenes.flatMap((s) => s.opening?.introductions ?? []).find((i) => i.name === subject.name)!;
};

describe("A_111 — an introduction says who somebody is, never what they hide", () => {
  const { name, victim } = subject;

  it("the known positive's shape: an action sentence about the dead is the plot, and gives no relation", () => {
    const i = introduce(`${name} manipulated ${victim} through feigned affection while embezzling the household funds.`, { privateSecret: "Has been embezzling the household funds" });
    expect(i.relation).toBeUndefined();
  });

  it("a description after the copula is given, cut before its first clause", () => {
    expect(introduce(`${name} was the cousin of ${victim}, who had cut the family off.`).relation).toBe(`the cousin of ${victim}`);
  });

  it("a description that carries a word of the member's secret is not given — unless the persona already says it", () => {
    const secret = { privateSecret: "Forged entries in the parish ledger to hide a debt" };
    expect(introduce(`${name} was the keeper of the parish ledger.`, secret).relation).toBeUndefined();
    expect(introduce(`${name} was the keeper of the parish ledger.`, { ...secret, publicPersona: "Keeps the parish ledger, fussily" }).relation).toBe("the keeper of the parish ledger");
  });

  it("the word 'secret' is never given; 'secretary' is an occupation and is", () => {
    expect(introduce(`${name} was the secret fiancée of ${victim}.`).relation).toBeUndefined();
    expect(introduce(`${name} was the secretary of the regatta committee.`).relation).toBe("the secretary of the regatta committee");
  });

  it("the dead named first: '<victim> was X's godfather' is given as '<victim> was her/his/their godfather'", () => {
    const i = introduce(`${victim} was ${name}'s godfather, and paid for the schooling.`, { gender: "female" });
    expect(i.relation).toBe(`${victim} was her godfather`);
  });

  it("an appositive after the name is the description, and 'her' in it is the dead's", () => {
    expect(introduce(`${name}, her stepdaughter, quarrelled with ${victim} over the house.`).relation).toBe(`${victim}'s stepdaughter`);
  });

  it("why-here goes through the same rule", () => {
    const secret = { privateSecret: "Came to recover the compromising photographs" };
    expect(introduce(`${name} quarrelled with ${victim}.`, secret, "To recover the compromising photographs before the will is read.").whyHere).toBeUndefined();
    expect(introduce(`${name} quarrelled with ${victim}.`, secret, "Invited for the anniversary dinner.").whyHere).toBe("Invited for the anniversary dinner.");
  });
});
