/**
 * X4 (architecture/REVIEW_05.md §10.6) — the injector-vs-linter class.
 *
 * `lint.ts` forbids the model from closing a resolution chapter with a summary verdict. The
 * deterministic floors write exactly that shape and are not subject to the rule. On run
 * `mystery-1785870981757` the manuscript's only sentence naming its murderer was a machine's, and it
 * matched the forbidden pattern.
 *
 * §10.6 chooses Option 2 — record, do not refuse — because refusing means shipping without the
 * obligation, which ADR-0003 forbids for a repairable defect. So the bar these tests hold is:
 *
 *   1. the standard is ONE registry, and the injector's real output is measured against it — not a
 *      second copy of the regexes that can drift from the linter's;
 *   2. recording never alters what ships;
 *   3. a zero is EMITTED, because "no telemetry" and "no violations" must not look the same.
 */

import { describe, expect, it } from "vitest";

import {
  buildCulpritEvidenceSentence,
  buildSuspectClearanceSentence,
  findModelBoundRuleViolations,
} from "@cml/prompts-llm";

import {
  emitAgent9InjectorLintTelemetry,
  enforceCulpritEvidencePresence,
  recordAgent9Injection,
} from "../jobs/agents/agent9-run.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

const ctxWithWarnings = (): OrchestratorContext =>
  ({ warnings: [] as string[] }) as unknown as OrchestratorContext;

describe("findModelBoundRuleViolations", () => {
  it("catches the culprit-evidence injector's own sentence", () => {
    // THE FINDING, as an assertion. If this ever goes green-by-passing (no violations), either the
    // injector stopped writing verdict prose or the rule was weakened — both worth a failed test.
    const violations = findModelBoundRuleViolations(buildCulpritEvidenceSentence("Captain Ivor Hale"));
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.map((v) => v.id)).toContain("verdict_closer.beyond");
  });

  it("catches the laundered form the B5 scaffold floor rewrites it into", () => {
    // The shipped sentence was not the injector's — it was the floor's rewrite of it. A check that
    // only knew the original would have found nothing on the run that produced this whole review.
    const shipped = "Captain Ivor Hale was responsible; the evidence allowed no other reading.";
    expect(findModelBoundRuleViolations(shipped).map((v) => v.id)).toContain(
      "verdict_closer.was_responsible",
    );
  });

  it("does not fire on ordinary prose, or on the clearance sentence", () => {
    expect(findModelBoundRuleViolations("She set the lamp down and did not look at him again.")).toEqual([]);
    expect(findModelBoundRuleViolations("")).toEqual([]);
    expect(findModelBoundRuleViolations(buildSuspectClearanceSentence("Ellsworth"))).toEqual([]);
  });
});

describe("recordAgent9Injection", () => {
  it("records the contradiction and lets the injection stand", () => {
    const ctx = ctxWithWarnings();
    const prose = {
      chapters: [
        { paragraphs: ["Captain Ivor Hale said nothing, and the room waited."] },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Captain Ivor Hale"] } } };

    const after = enforceCulpritEvidencePresence(prose, cml, recordAgent9Injection(ctx));

    // Option 2, in one assertion: the sentence SHIPPED.
    const text = (after.chapters[0].paragraphs as string[]).join(" ");
    expect(text).toContain(buildCulpritEvidenceSentence("Captain Ivor Hale"));

    expect(ctx.agent9InjectorLint?.injections).toBe(1);
    expect(ctx.agent9InjectorLint?.violations).toBeGreaterThan(0);
    expect(Object.keys(ctx.agent9InjectorLint?.byRule ?? {})).toContain(
      "enforceCulpritEvidencePresence:verdict_closer.beyond",
    );
    expect(ctx.warnings.join("\n")).toMatch(/\[X4\] injector-vs-lint: enforceCulpritEvidencePresence/);
  });

  it("counts an injection that violates nothing as an injection, not as a violation", () => {
    // The ratio is the point — a floor firing constantly while writing acceptable prose is a
    // different decision from one writing forbidden prose, and Move 5 needs to tell them apart.
    const ctx = ctxWithWarnings();
    recordAgent9Injection(ctx)({
      injector: "enforceSuspectEliminationPresence",
      target: "Ellsworth",
      chapterIndex: 8,
      sentence: buildSuspectClearanceSentence("Ellsworth"),
    });

    expect(ctx.agent9InjectorLint).toMatchObject({ injections: 1, violations: 0, byRule: {} });
    expect(ctx.warnings).toEqual([]);
  });

  it("does not fire when the prose already links the culprit — no injection, no record", () => {
    const ctx = ctxWithWarnings();
    const prose = {
      chapters: [
        {
          // The predicate the floor gates on (`culpritEvidenceLinkInText`) wants three things in one
          // chapter: the name, a culprit term, and an evidence term. All three, written as prose.
          paragraphs: [
            "The evidence was plain enough: Captain Ivor Hale was the killer, because the tide log put him at the boathouse when he swore he was ashore.",
          ],
        },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Captain Ivor Hale"] } } };

    enforceCulpritEvidencePresence(prose, cml, recordAgent9Injection(ctx));
    expect(ctx.agent9InjectorLint?.injections).toBe(0);
  });
});

describe("emitAgent9InjectorLintTelemetry", () => {
  it("emits a zero when no injector fired", () => {
    const ctx = ctxWithWarnings();
    emitAgent9InjectorLintTelemetry(ctx);

    expect(ctx.warnings.join("\n")).toContain(
      "[X4] agent9 injector-vs-lint telemetry: injections=0 violations=0",
    );
  });

  it("names the rules that fired, so an analyser needs no regex over prose", () => {
    const ctx = ctxWithWarnings();
    recordAgent9Injection(ctx)({
      injector: "enforceCulpritEvidencePresence",
      target: "Captain Ivor Hale",
      chapterIndex: 9,
      sentence: buildCulpritEvidenceSentence("Captain Ivor Hale"),
    });
    emitAgent9InjectorLintTelemetry(ctx);

    const line = ctx.warnings.find((w) => w.includes("injector-vs-lint telemetry")) ?? "";
    expect(line).toContain("injections=1");
    expect(line).toContain("enforceCulpritEvidencePresence:verdict_closer.beyond=1");
  });
});
