/**
 * A_110 L6 — PROSE_V2_TAIL_FINDING. The body-part tail ends 28.7% of run bcc0d637's narration sentences and 0.44% of
 * the canon's; the canon's worst chapter holds at most 3 in 95% of books. ON: four or more in a chapter sends the editor
 * every one after the first three, at most twelve.
 */
import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { collectCheckerFindings } from "../findings.js";
import { completeProjects } from "./fixtures.js";

afterEach(() => {
  delete process.env.PROSE_V2_TAIL_FINDING;
});
const projects = completeProjects();
const tail = (i: number) => `Eleanor turned the page of the ledger number ${i}, her fingers steady on the edge of the desk.`;
const chapter = (n: number) => ({ number: 1, title: "One", paragraphs: Array.from({ length: n }, (_, i) => tail(i)) });

describe("A_110 L6 — the body-part tail", () => {
  it.runIf(projects.length > 0)("OFF: no finding however many", () => {
    const c = buildBookContract(projects[0]!.input);
    expect(collectCheckerFindings([chapter(10)], c, [1]).filter((f) => f.class === "body_tail")).toEqual([]);
  });

  it.runIf(projects.length > 0)("ON: three in a chapter are left alone (the canon's worst chapter reaches three)", () => {
    process.env.PROSE_V2_TAIL_FINDING = "1";
    const c = buildBookContract(projects[0]!.input);
    expect(collectCheckerFindings([chapter(3)], c, [1]).filter((f) => f.class === "body_tail")).toEqual([]);
  });

  it.runIf(projects.length > 0)("ON: past three, every one after the first three is a finding, at most twelve", () => {
    process.env.PROSE_V2_TAIL_FINDING = "1";
    const c = buildBookContract(projects[0]!.input);
    const five = collectCheckerFindings([chapter(5)], c, [1]).filter((f) => f.class === "body_tail");
    expect(five.map((f) => f.quote)).toEqual([tail(3), tail(4)]);
    expect(collectCheckerFindings([chapter(25)], c, [1]).filter((f) => f.class === "body_tail")).toHaveLength(12);
  });
});
