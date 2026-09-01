/**
 * A_64 §2 F2 — the scaffold SHIP-CHECK composition.
 *
 * Mechanism B of the 7.5-pool autopsy: `enforceCulpritEvidencePresence` (and its injector siblings)
 * run AFTER the scaffold regen pass, so their templates ship straight into the rubric's facts.ts
 * recheck — v_tide_enforce's B5 sentence was written 17 seconds before scoring, in no LLM call.
 * The ship-check re-runs the ship-time detector after the last injector and de-templates
 * deterministically. This test pins the composition contract:
 *   inject → detect (B5 fires) → floor → detector-clean AND the injector's own gate predicate
 *   still holds (no re-injection, and the critical culprit-evidence gate stays satisfied).
 */
import { describe, expect, it } from "vitest";
import { culpritEvidenceLinkInText } from "@cml/prompts-llm";
import { enforceCulpritEvidencePresence } from "../jobs/agents/agent9-run.js";
import { detectScaffoldNotProse } from "@cml/prose-guard";
import { applyScaffoldExhaustionFloor } from "@cml/prompts-llm";

const cml: any = {
  CASE: {
    culpability: { culprits: ["Captain Ivor Hale"] },
    cast: [{ name: "Edmund Voss", role: "victim" }],
  },
};

const mkProse = () => ({
  chapters: [
    { title: "Ch1", paragraphs: ["Edmund Voss lay dead in the study, the tide chart still in his hand."] },
    { title: "Ch2", paragraphs: ["Captain Ivor Hale stood by the window and said nothing."] },
  ],
});

describe("A_64 F2 — ship-check floors the post-repair B5 injection", () => {
  it("the injector pastes the B5 template into the reveal chapter (the autopsy's Mechanism B)", () => {
    const injected = enforceCulpritEvidencePresence(mkProse(), cml);
    const ch2 = injected.chapters[1].paragraphs.join(" ");
    expect(ch2).toContain("was responsible, and the evidence placed the matter beyond all reasonable doubt");
    expect(detectScaffoldNotProse(ch2).map((h) => h.rule)).toContain("B5:beyond_reasonable_doubt");
  });

  it("the floor de-templates it into a detector-clean, gate-satisfying form", () => {
    const injected = enforceCulpritEvidencePresence(mkProse(), cml);
    const { chapter: floored, floored: rules } = applyScaffoldExhaustionFloor(injected.chapters[1]);
    expect(rules).toEqual(["B5:beyond_reasonable_doubt"]);
    const text = floored.paragraphs.join(" ");
    expect(detectScaffoldNotProse(text)).toEqual([]); // the rubric's ship-time recheck cannot cap this
    expect(text).toContain("Captain Ivor Hale");
    // A_80 item 3 — the floor now rewrites into the compliant in-scene form. The two assertions here
    // used to be /responsible/i and /evidence/i, which were PROXIES for CULPRIT_TERMS_RE and
    // CULPRIT_EVIDENCE_RE. The in-scene form satisfies both through different words, so the predicate
    // itself is asserted rather than one wording of it — a proxy that pins a string cannot tell a
    // rewrite from a regression.
    expect(culpritEvidenceLinkInText("Captain Ivor Hale", text)).toBe(true);
    // And the thing that made this worth changing: the old replacement was itself registered
    // generator residue, quoted back by external readers four times.
    expect(text).not.toMatch(/allowed no other reading/i);
    expect(text).not.toMatch(/beyond all reasonable doubt/i);
  });

  it("the floored form does NOT re-trigger the injector (no ping-pong across the composition)", () => {
    const injected = enforceCulpritEvidencePresence(mkProse(), cml);
    const flooredProse = {
      ...injected,
      chapters: injected.chapters.map((ch: any) => applyScaffoldExhaustionFloor(ch).chapter),
    };
    const again = enforceCulpritEvidencePresence(flooredProse, cml);
    expect(again.chapters[1].paragraphs.join(" ")).toBe(flooredProse.chapters[1].paragraphs.join(" "));
  });
});
