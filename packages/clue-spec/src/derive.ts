/**
 * `deriveClueSpec(cml)` — Stage A of the Agent 5 redesign (§4.1).
 *
 * The authoritative, typed promotion of today's `generateExplicitClueRequirements` (a *prompt hint*)
 * into the *source of truth*: read the frozen CML and emit the complete set of clue + red-herring
 * slots that must exist. Pure, deterministic, no LLM. Coverage is *constructed*, not audited — the
 * thing the 168 KB runner spends thousands of lines checking and backfilling becomes the input here.
 *
 * The mapping is the §4.1 table, with source paths in the `CASE.`-prefixed form the real corpus and
 * the deterministic synthesizers use (so a coverage diff against shipped runs is apples-to-apples):
 *
 *   inference_path.steps[i].observation  → one observation slot (essential)
 *   inference_path.steps[i].correction   → one contradiction slot (essential)
 *   hidden_model.mechanism.description    → one mechanism-visibility slot
 *   discriminating_test (evidence_clues / knowledge_revealed) → discriminating-evidence slot(s)
 *   culpability.culprits[*]               → one direct-evidence slot per culprit
 *   eligible non-culprit cast[*]          → one elimination slot per suspect
 *   false_solution.the_one_flaw           → the hinge clue the false solution can't explain
 *   false_solution.supporting_points[*]   → one red-herring slot each (§4.2)
 *   culprit's evidence_sensitivity[0]     → the CLINCHER slot (CS2, role: "clincher")
 */

import type {
  ClueCategory,
  ClueSlot,
  ClueSpec,
  CmlCaseForClues,
  RedHerringSlot,
} from "./types.js";

/** Accepts the CASE object directly or a `{ CASE: ... }` wrapper (both occur in the corpus). */
function unwrapCase(cml: unknown): CmlCaseForClues {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, unknown>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE as CmlCaseForClues;
    return obj as CmlCaseForClues;
  }
  return {};
}

/** kebab-ish slug for stable ids; deterministic. */
export function slug(name: string): string {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const COMMON_WORDS = new Set([
  "that", "this", "with", "from", "were", "have", "been", "they", "what", "when",
  "where", "which", "would", "could", "should", "their", "there", "about", "after", "before",
]);

/** A few salient terms for the render hint — not load-bearing for coverage. */
export function extractKeyTerms(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4 && !COMMON_WORDS.has(w))
    .slice(0, 3);
}

/** Coarse category guess from keywords; a render hint only. */
export function inferCategory(text: string | undefined): ClueCategory {
  const t = (text ?? "").toLowerCase();
  if (/\b(clock|time|hour|minute|chime|night|morning|noon|midnight|earlier|later|when)\b/.test(t)) return "temporal";
  if (/\b(room|door|window|passage|locked|distance|outside|inside|where|reach|access)\b/.test(t)) return "spatial";
  if (/\b(said|heard|saw|witness|claim|testi|recall|alibi|account)\b/.test(t)) return "testimonial";
  if (/\b(motive|fear|jealous|secret|plan|premedit|behav|nervous|lie|lied)\b/.test(t)) return "behavioral";
  return "physical";
}

export function deriveClueSpec(cml: unknown): ClueSpec {
  const caseData = unwrapCase(cml);
  const steps = caseData.inference_path?.steps ?? [];
  const culprits = caseData.culpability?.culprits ?? [];
  const cast = caseData.cast ?? [];

  const clueSlots: ClueSlot[] = [];
  const redHerringSlots: RedHerringSlot[] = [];

  // 1. Per inference step: one observation + one contradiction slot (the spine of fair play).
  steps.forEach((step, idx) => {
    const stepNum = idx + 1;
    const placement = stepNum <= 2 ? "early" : "mid";
    clueSlots.push({
      id: `slot_obs_step${stepNum}`,
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: `CASE.inference_path.steps[${idx}].observation`,
      supportsInferenceStep: stepNum,
      category: inferCategory(step.observation),
      keyTerms: extractKeyTerms(step.observation),
      suggestedPlacement: placement,
    });
    clueSlots.push({
      id: `slot_contra_step${stepNum}`,
      evidenceType: "contradiction",
      criticality: "essential",
      sourceInCML: `CASE.inference_path.steps[${idx}].correction`,
      supportsInferenceStep: stepNum,
      category: inferCategory(step.correction),
      keyTerms: extractKeyTerms(step.correction),
      suggestedPlacement: placement,
    });
  });

  // 2. Mechanism visibility — the core trick must be reader-visible before the test.
  const mechanism = caseData.hidden_model?.mechanism?.description;
  if (mechanism) {
    clueSlots.push({
      id: "slot_mechanism_visible",
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.hidden_model.mechanism.description",
      category: inferCategory(mechanism),
      keyTerms: extractKeyTerms(mechanism),
      suggestedPlacement: "early",
    });
  }

  // 2b. Method-evidence (A_67 FIX-2) — the PHYSICAL manner of death (CASE.death_method) must be
  //     reader-visible EARLY, as its own fair-play tell, DISTINCT from the concealment mechanism above
  //     (which is the alibi/cover-up device, not how the victim died). Guarded on death_method presence
  //     so empty/minimal CMLs emit no method slot. No supportsInferenceStep: it is planted early and
  //     cited at the reveal, not bound to a mid/late inference step.
  const deathMethod = caseData.death_method;
  if (typeof deathMethod === "string" && deathMethod.trim()) {
    clueSlots.push({
      id: "slot_method_evidence",
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.death_method",
      category: "physical",
      keyTerms: extractKeyTerms(deathMethod),
      suggestedPlacement: "early",
    });
  }

  // 3. Discriminating-test evidence — the clue(s) the test turns on, which it must NOT introduce.
  const dt = caseData.discriminating_test;
  if (dt) {
    const declared = (dt.evidence_clues ?? [])
      .map((ec) => (typeof ec === "string" ? ec : ec?.id))
      .filter((id): id is string => Boolean(id));
    if (declared.length > 0) {
      // Reuse the CML-declared evidence-clue ids verbatim — these are exactly what the
      // discriminating-evidence synthesizer backfills when missing.
      for (const id of declared) {
        clueSlots.push({
          id,
          evidenceType: "observation",
          criticality: "essential",
          sourceInCML: "CASE.discriminating_test.evidence_clues",
          category: inferCategory(dt.knowledge_revealed ?? dt.design),
          keyTerms: extractKeyTerms(dt.knowledge_revealed ?? dt.design),
          suggestedPlacement: "mid",
        });
      }
    } else if (dt.knowledge_revealed || dt.design) {
      clueSlots.push({
        id: "slot_discrim_evidence",
        evidenceType: "observation",
        criticality: "essential",
        sourceInCML: "CASE.discriminating_test.knowledge_revealed",
        category: inferCategory(dt.design),
        keyTerms: extractKeyTerms(dt.knowledge_revealed ?? dt.design),
        suggestedPlacement: "mid",
      });
    }
  }

  // 4. Direct-evidence slot per culprit — the unique trace tying them to the mechanism.
  culprits.forEach((name) => {
    const idx = cast.findIndex((c) => c?.name === name);
    clueSlots.push({
      id: `slot_culprit_direct_${slug(name)}`,
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: idx >= 0 ? `CASE.cast[${idx}].access_plausibility` : "CASE.culpability.culprits[0]",
      category: "behavioral",
      keyTerms: [name],
      suggestedPlacement: "mid",
    });
  });

  // 5. Elimination slot per eligible non-culprit suspect — clears them, narrowing to the culprit.
  cast.forEach((c, idx) => {
    if (c?.culprit_eligibility === "eligible" && c.name && !culprits.includes(c.name)) {
      clueSlots.push({
        id: `slot_eliminate_${slug(c.name)}`,
        evidenceType: "elimination",
        criticality: "essential",
        sourceInCML: `CASE.cast[${idx}].alibi_window`,
        category: "testimonial",
        keyTerms: [c.name],
        suggestedPlacement: "mid",
      });
    }
  });

  // 6. The hinge — a clue the false solution cannot explain (§4.4 worked example `clue_flaw`).
  const flaw = caseData.false_solution?.the_one_flaw;
  if (flaw) {
    clueSlots.push({
      id: "slot_flaw",
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.false_solution.the_one_flaw",
      category: inferCategory(flaw),
      keyTerms: extractKeyTerms(flaw),
      suggestedPlacement: "mid",
    });
  }

  // 6b. CS2 — THE CLINCHER. The one physical trace that ties the culprit to the act, declared as a
  //     slot so geometry binds its plant-before-payoff obligation to a clue the pipeline is OBLIGED
  //     to place, instead of scoring the available clues and landing on an `optional` one (§5).
  //
  //     Source, in order: the culprit's own `evidence_sensitivity[0]` — the evidence that specific
  //     person is vulnerable to, which is what "unique to the culprit" means in CML terms — then the
  //     discriminating test's `knowledge_revealed`, which is what the test proves and therefore what
  //     the clincher must show. **If neither exists, NO SLOT IS EMITTED.** Deriving a clincher from
  //     nothing would be inventing a clue, which is the one thing this stage must never do.
  //
  //     Deliberately NOT the method tell: the manner of death is a separate obligation, and geometry
  //     scores `isDeathMethodTell` DOWN for exactly this reason. Collapsing the two loses one of them.
  const clincherCulprit = culprits[0];
  if (clincherCulprit) {
    const idx = cast.findIndex((c) => c?.name === clincherCulprit);
    const sensitivity = (idx >= 0 ? cast[idx]?.evidence_sensitivity ?? [] : []).filter(
      (s): s is string => typeof s === "string" && s.trim().length > 0,
    );
    const fromSensitivity = sensitivity[0];
    const source = fromSensitivity ?? caseData.discriminating_test?.knowledge_revealed;
    if (source && source.trim()) {
      clueSlots.push({
        id: "slot_clincher",
        evidenceType: "observation",
        // Essential BY CONSTRUCTION. This is the whole of CS2: the criticality mismatch geometry
        // records in `clincher.sourceCriticality` cannot arise from a slot that is essential here.
        criticality: "essential",
        sourceInCML: fromSensitivity
          ? `CASE.cast[${idx}].evidence_sensitivity[0]`
          : "CASE.discriminating_test.knowledge_revealed",
        category: "physical",
        keyTerms: extractKeyTerms(source),
        // Geometry plants the clincher by chapter 3 at the latest (`plantByChapter`). "early" is the
        // placement vocabulary's way of saying the same thing, in the slot set, where Agent 5 reads it.
        suggestedPlacement: "early",
        role: "clincher",
      });
    }
  }

  // 7. Red herrings derived from false_solution.supporting_points (§4.2) — cannot reinforce the
  //    true solution by construction, since each points at the innocent accused's supporting point.
  const supportingPoints = caseData.false_solution?.supporting_points ?? [];
  supportingPoints.forEach((pt, i) => {
    redHerringSlots.push({
      id: `slot_rh_${i + 1}`,
      supportsAssumption: String(pt),
      sourceInCML: `CASE.false_solution.supporting_points[${i}]`,
    });
  });

  return { clueSlots, redHerringSlots };
}
