/**
 * Shared CML 2.0 builder — used by corpus-encode.mjs and corpus-repair.mjs.
 *
 * The model emits JSON against a flat contract; this builds the nested CML 2.0 document from it.
 * A_77 §16.3 measured that every first-attempt gate failure was a FIELD NAME, so field names are
 * not the model's problem — they are the script's, and living in one place is how the script stops
 * getting them wrong in two places differently.
 */
export const buildCml = (d, meta) => ({
  CML_VERSION: 2.0,
  CASE: {
    meta: {
      title: meta.title, author: meta.author, license: meta.license,
      era: { decade: d.decade, realism_constraints: d.realism_constraints },
      setting: { location: d.location, institution: d.institution },
      crime_class: { category: d.crime_category, subtype: d.crime_subtype },
    },
    cast: d.cast.map((c) => ({
      name: c.name, age_range: c.age_range,
      role_archetype: c.role !== "detective" ? String(c.role_archetype).replace(/detective/gi, "investigating") : c.role_archetype,
      relationships: c.relationships ?? [], public_persona: c.public_persona,
      private_secret: c.private_secret, motive_seed: c.motive_seed, motive_strength: c.motive_strength,
      alibi_window: c.alibi_window, access_plausibility: c.access_plausibility,
      opportunity_channels: c.opportunity_channels ?? [], behavioral_tells: c.behavioral_tells ?? [],
      stakes: c.stakes, evidence_sensitivity: c.evidence_sensitivity ?? [],
      culprit_eligibility: ["eligible", "ineligible", "locked"].includes(c.culprit_eligibility)
        ? c.culprit_eligibility
        : (c.role === "victim" || c.role === "detective" ? "ineligible" : "eligible"),
      culpability: c.culpability,
      gender: c.gender, role: c.role, moral_complexity: c.moral_complexity,
    })),
    // The schema allows 1 or 2 culprits. A model that lists a gang emits 4; clamp rather than fail,
    // keeping the named principals in order.
    culpability: { culprit_count: Math.min(2, Math.max(1, d.culprits.length)), culprits: d.culprits.slice(0, 2) },
    surface_model: {
      narrative: { summary: d.surface_summary },
      accepted_facts: d.accepted_facts, inferred_conclusions: d.inferred_conclusions,
    },
    hidden_model: {
      mechanism: { description: d.mechanism_description, delivery_path: d.delivery_path.map((s) => ({ step: s })) },
      outcome: { result: d.outcome_result },
    },
    false_assumption: d.false_assumption,
    false_solution: d.false_solution,
    red_herrings: d.red_herrings,
    closed_circle: d.closed_circle,
    constraint_space: {
      time: { anchors: d.constraint_space.time_anchors, windows: d.constraint_space.time_windows },
      access: { actors: d.constraint_space.access_actors, objects: d.constraint_space.access_objects },
      social: { trust_channels: d.constraint_space.trust_channels, authority_sources: d.constraint_space.authority_sources },
    },
    inference_path: { steps: d.inference_path.map((s) => ({ ...s, reader_observable: true })) },
    discriminating_test: d.discriminating_test,
    fair_play: {
      all_clues_visible: true, no_special_knowledge_required: true,
      no_late_information: true, reader_can_solve: true, explanation: d.fair_play_explanation,
    },
    quality_controls: {
      inference_path_requirements: { min_steps: 6, max_steps: 7, require_observation_correction_effect: true },
      clue_visibility_requirements: {
        essential_clues_min: 5, essential_clues_before_test: true,
        early_clues_min: 2, mid_clues_min: 2, late_clues_min: 1,
      },
      discriminating_test_requirements: { timing: "mid_act3", must_reference_inference_step: true },
    },
  },
});
