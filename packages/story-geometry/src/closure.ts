/**
 * Closure — can this contract be satisfied at all?
 *
 * Checked against the OUTLINE, where repair is free and no prose tokens have been spent (§7, the
 * pattern ADR-0002 defends). A geometry that cannot be closed is an outline defect, not a prose
 * defect.
 *
 * THE PRECISION THAT MATTERS. This is a repair trigger with a warning, not a hard gate. An
 * unclosable geometry must never abort a run (ADR-0003); it buys bounded outline repair before the
 * expensive stage and nothing more. Calling it a gate would claim an enforcement strength it
 * deliberately does not have — so `repairable` is a field here, and the caller decides.
 */

import type { GeometryClosure, GeometryUnmet, StoryGeometry } from "./types.js";

/**
 * Cases that legitimately resolve on testimony or a logical trap rather than physical evidence
 * (§11 Q3). Required by default, waivable by an explicit `resolution_kind` on the case — but never
 * silently absent.
 */
const NON_PHYSICAL_RESOLUTION = /^(testimony|logical_trap|confession|deduction_only)$/i;

export const checkGeometryClosure = (geometry: StoryGeometry, caseData: any): GeometryClosure => {
  const unmet: GeometryUnmet[] = [];
  const waived: Array<{ field: string; reason: string }> = [];
  const notes: string[] = [];
  const push = (field: string, code: string, message: string, repairable: boolean) =>
    unmet.push({ field, code, message, repairable });

  // ── time_model ────────────────────────────────────────────────────────────
  const { trueTime, apparentTime, directionViolations } = geometry.timeModel;
  if (!trueTime || !apparentTime) {
    push(
      "time_model",
      "time_missing",
      `The case does not state both temporal anchors (actual="${trueTime ?? ""}", apparent="${apparentTime ?? ""}"). ` +
        `Without both, nothing binds the manuscript to a two-time model and a third time cannot be detected.`,
      false,
    );
  } else if (trueTime === apparentTime) {
    push(
      "time_model",
      "times_identical",
      "The staged time and the real time of death are the same string, so the concealment hides nothing.",
      false,
    );
  }
  for (const violation of directionViolations) {
    push("time_model", violation.code, violation.message, false);
  }

  // ── clincher ──────────────────────────────────────────────────────────────
  const resolutionKind = String(caseData?.resolution_kind ?? "").trim();
  if (!geometry.clincher) {
    if (NON_PHYSICAL_RESOLUTION.test(resolutionKind)) {
      waived.push({ field: "clincher", reason: `resolution_kind=${resolutionKind}` });
    } else {
      push(
        "clincher",
        "clincher_absent",
        "No clue in the set reads as a physical trace unique to the culprit. Both external reviewers asked " +
          "for one by name. Either an existing clue must be selectable as the clincher, or the case must " +
          "declare a non-physical resolution_kind.",
        false,
      );
    }
  } else {
    if (geometry.clincher.plantByChapter >= geometry.clincher.payoffChapter) {
      push(
        "clincher",
        "clincher_plant_not_before_payoff",
        `The clincher would be planted in chapter ${geometry.clincher.plantByChapter} and produced in ` +
          `chapter ${geometry.clincher.payoffChapter} — a plant must precede its payoff.`,
        true,
      );
    }
    if (!geometry.clincher.uniqueToCulprit) {
      push("clincher", "clincher_no_culprit", "The case names no culprit, so no trace can be unique to them.", false);
    }
    /**
     * The clincher's weakest assumption, stated rather than left implicit.
     *
     * MEASURED across three runs (1810, 1936, 08-04): the best available physical trace was every
     * time a clue the set marks `optional` — on the 08-04 run, `clue_late_optional_slot_1`. The
     * SELECTION is right on content (it is the only physical trace present, and it is the "torn
     * fabric" both external reviewers asked for by name). The problem is that geometry then binds a
     * load-bearing obligation to a clue every other stage is free to drop, so nothing but geometry is
     * working to put it on the page — which is exactly why 1936 failed both `clincher_not_planted`
     * and `clincher_absent_at_payoff`.
     *
     * This does not block closure: the contract is satisfiable, it is just resting on sand. The real
     * fix is upstream — §5's missing slot type, "no slot type is 'the single decisive physical
     * trace'" — and belongs to `clue-spec` when it comes out of shadow.
     */
    const criticality = geometry.clincher.sourceCriticality;
    if (criticality && criticality !== "essential") {
      notes.push(
        `clincher: drawn from clue ${geometry.clincher.clueId ?? "(unmapped)"}, which the clue set marks ` +
          `"${criticality}" — no other stage is obliged to place it, so the plant and payoff rest on geometry alone`,
      );
    }
  }

  // ── method_signature ──────────────────────────────────────────────────────
  if (!geometry.methodSignature) {
    push(
      "method_signature",
      "method_absent",
      "The case states no `death_method`, so the manuscript has no physical signature to plant in chapter 1.",
      false,
    );
  } else {
    if (geometry.methodSignature.keyTerms.length === 0) {
      push(
        "method_signature",
        "method_unrecognised",
        `The death method "${geometry.methodSignature.method}" matches no known physical-signature family, so ` +
          `its presence in chapter 1 cannot be checked. The contract is stated but not enforceable.`,
        false,
      );
    }
    if (geometry.methodSignature.plantChapter !== 1) {
      push("method_signature", "method_plant_not_chapter_one", "The method signature must be planted in chapter 1.", true);
    }
  }

  // ── chapter_contract ──────────────────────────────────────────────────────
  const reveal = geometry.chapterContract.find((c) => c.role === "reveal");
  const aftermath = geometry.chapterContract.find((c) => c.role === "aftermath");
  if (!reveal) {
    push("chapter_contract", "no_reveal_chapter", "The outline has no chapter that discloses the solution.", false);
  } else if (!aftermath && geometry.chapterCount > 1) {
    // THE §8bis DEFECT, stated as a contract failure. `the_clock_s_deception` shipped 9 chapters with
    // the clearances AND the reveal in chapter 9, and delivered neither properly; `the_clockwork_deceit`
    // shipped 10 with `final_trap` and `revelation` separate, and scored 12 points higher. Not
    // repairable here — geometry does not assign scenes or add chapters (§3). It is exactly the signal
    // an authoritative `beat-scheduler` would remove upstream.
    push(
      "chapter_contract",
      "reveal_is_final_chapter",
      `The reveal is the last chapter (${reveal.chapter} of ${geometry.chapterCount}), so nothing separates ` +
        `disclosure from aftermath. The Golden-Age arc names \`final_trap\` and \`revelation\` as distinct beats; ` +
        `collapsing them is the shape of the 68-scoring run.`,
      false,
    );
  }

  // ── false_solution ────────────────────────────────────────────────────────
  if (!geometry.falseSolution.accused) {
    push("false_solution", "no_accused", "The case names no falsely accused suspect.", false);
  } else if (geometry.culprit && geometry.falseSolution.accused === geometry.culprit) {
    // Prompt-only enforcement of a hard constraint is exactly what a contract is for: agent3-cml.ts
    // already instructs "The accused_suspect MUST NOT be the real culprit", and story 1810's chapter 6
    // accused the actual murderer anyway.
    push(
      "false_solution",
      "accused_is_culprit",
      `The false solution accuses ${geometry.falseSolution.accused}, who is the culprit. A false solution that ` +
        `names the murderer is not misdirection.`,
      false,
    );
  }

  // `revealBindingUncertain` is not decidable here — it compares the bound chapter against the
  // OUTLINE's own words, which `checkRevealBinding` owns. Stated false and set by the caller, rather
  // than left optional: an absent flag and a false one must not be the same value to a consumer.
  return { closed: unmet.length === 0, unmet, waived, notes, revealBindingUncertain: false };
};
