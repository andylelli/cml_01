/**
 * CR-14 (A34-01) — the CML normaliser: what a raw model reply becomes before validation.
 *
 * Agents 3 and 4 each carried one, nested in `generateCML` (561 lines) and `reviseCml` (386), with 185
 * identical lines between them and 23 of 25 probed fields handled differently. Step 1 (R1, this module):
 * both bodies moved here verbatim as two profiles, sharing the sections that are identical.
 * Step 2 — converging the divergent defaults — is the owner's (A34-Q01).
 */
import { getGenerationParams } from "@cml/story-validation";
import { isVictimArchetype } from "@cml/cml";
import type { CMLPromptInputs } from "../types.js";
import { groundDiscriminatingKnowledgeRevealed } from "../shared/grounding.js";
import { classifyDeathMethod, type DeathMethodKind } from "../shared/death-method-patterns.js";
import { orphanedMeansLinkTraces, provesTheAct } from "../agent3-means-link.js";
import { actWindowNote, deathMethodWoundSiteNote } from "../agent3-case-shape-notes.js";


export const ensureObject = (value: unknown) =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
export const ensureArray = (value: unknown) => (Array.isArray(value) ? value : []);
export const ensureString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

// ── profile "generate": Agent 3 (moved verbatim from generateCML) ────────────────────────────

// L1 (ANALYSIS_48 T1.1): map a crime classification to a physical manner of death, used as the
// fallback when the model didn't author CASE.death_method. Mirrors DEATH_METHOD_CANON in
// agent9-prose/prompt-builder and DEATH_METHOD_TOKENS in rubric-score/facts (kept local to avoid a
// cross-package coupling from Agent 3 into the prose layer; the three are unified in ANALYSIS_48 T3).
// ONE vocabulary, in shared/death-method-patterns.ts. This file used to keep its own copy and the
// two had drifted (see that module). Only the WORDING is local, because the two consumers want
// different registers.
const DEATH_METHOD_WORDING: Record<DeathMethodKind, string> = {
  stabbing: "stabbing",
  gunshot: "gunshot",
  strangulation: "strangulation",
  poisoning: "poisoning",
  blunt_force: "a blunt-force blow",
  drowning: "drowning",
  fall: "a fall",
  suffocation: "suffocation",
  electrocution: "electrocution",
  burning: "burning",
};

/** Returns a physical manner-of-death phrase from the crime subtype/category, or "" if none matches. */
export const deriveDeathMethodFromCrimeClass = (subtype: string, category: string): string => {
  const haystack = `${subtype} ${category}`;
  const kind = classifyDeathMethod(haystack);
  return kind ? DEATH_METHOD_WORDING[kind] : "";
};

export function normalizeCmlForGeneration(raw: Record<string, unknown>, inputs: CMLPromptInputs, normalizationNotes: string[], config: ReturnType<typeof getGenerationParams>["agent3_cml"]["params"]) {
  const cml = ensureObject(raw);
  cml.CML_VERSION = 2.0;

  const caseBlock = ensureObject(cml.CASE);
  cml.CASE = caseBlock;

  const meta = ensureObject(caseBlock.meta);
  caseBlock.meta = meta;
  meta.title = ensureString(meta.title, "Untitled Mystery");
  meta.author = ensureString(meta.author, "CML Generator");
  meta.license = ensureString(meta.license, "CC-BY-4.0");

  const era = ensureObject(meta.era);
  meta.era = era;
  era.decade = ensureString(era.decade, inputs.decade);
  era.realism_constraints = ensureArray(era.realism_constraints);

  const setting = ensureObject(meta.setting);
  meta.setting = setting;
  setting.location = ensureString(setting.location, inputs.location);
  setting.institution = ensureString(setting.institution, inputs.institution);

  const crimeClass = ensureObject(meta.crime_class);
  meta.crime_class = crimeClass;
  crimeClass.category = ensureString(crimeClass.category, "murder");
  crimeClass.subtype = ensureString(crimeClass.subtype, "poisoning");

  const castArray = Array.isArray(caseBlock.cast) ? caseBlock.cast : [];
  const names = inputs.castNames?.length ? inputs.castNames : castArray.map((c) => (c as any)?.name).filter(Boolean);
  const normalizedCast = (names.length ? names : castArray.map((c) => (c as any)?.name).filter(Boolean)).map((name, index) => {
    const existing = ensureObject(castArray[index]);
    const eligibility = ensureString(existing.culprit_eligibility, "eligible");
    const normalizedEligibility = ["eligible", "ineligible", "locked"].includes(eligibility)
      ? eligibility
      : "eligible";
    const culpability = ensureString(existing.culpability, "unknown");
    const normalizedCulpability = ["guilty", "innocent", "unknown"].includes(culpability)
      ? culpability
      : "unknown";
    return {
      name: ensureString(existing.name, name || `Suspect ${index + 1}`),
      age_range: ensureString(existing.age_range, "adult"),
      role_archetype: ensureString(existing.role_archetype, "suspect"),
      relationships: ensureArray(existing.relationships),
      public_persona: ensureString(existing.public_persona, "reserved"),
      private_secret: ensureString(existing.private_secret, "keeps a secret"),
      motive_seed: ensureString(existing.motive_seed, "inheritance"),
      motive_strength: ensureString(existing.motive_strength, "moderate"),
      alibi_window: ensureString(existing.alibi_window, "evening"),
      access_plausibility: ensureString(existing.access_plausibility, "medium"),
      opportunity_channels: ensureArray(existing.opportunity_channels),
      behavioral_tells: ensureArray(existing.behavioral_tells),
      stakes: ensureString(existing.stakes, "reputation"),
      evidence_sensitivity: ensureArray(existing.evidence_sensitivity),
      culprit_eligibility: normalizedEligibility,
      culpability: normalizedCulpability,
      gender: existing.gender || inputs.castGenders?.[name] || undefined,
    };
  });

  const roleIncludes = (role: unknown, tokens: string[]) => {
    const text = String(role ?? "").toLowerCase();
    return tokens.some((token) => text.includes(token));
  };

  // Wave 1 integrity lock: when a victim archetype is supplied, force the matching cast
  // entry to victim role and make them ineligible as culprit.
  const victimHint = String(inputs.victimArchetype ?? "").trim().toLowerCase();
  if (victimHint) {
    const hintedVictim = normalizedCast.find((member) => String(member.name ?? "").trim().toLowerCase() === victimHint
    );
    if (hintedVictim) {
      hintedVictim.role_archetype = "victim";
      hintedVictim.culprit_eligibility = "ineligible";
      hintedVictim.culpability = "innocent";
    }
  }

  // Any character explicitly marked victim in the cast must remain ineligible and innocent.
  for (const member of normalizedCast) {
    if (roleIncludes(member.role_archetype, ["victim"])) {
      member.culprit_eligibility = "ineligible";
      member.culpability = "innocent";
    }
  }

  caseBlock.cast = normalizedCast;

  const culpability = ensureObject(caseBlock.culpability);
  caseBlock.culpability = culpability;
  const detectiveNameSet = new Set(
    normalizedCast
      .filter((member) => roleIncludes(member.role_archetype, ["detective", "investigator", "inspector"]))
      .map((member) => String(member.name ?? "").trim().toLowerCase())
  );
  const victimNameSet = new Set(
    normalizedCast
      .filter((member) => roleIncludes(member.role_archetype, ["victim"]))
      .map((member) => String(member.name ?? "").trim().toLowerCase())
  );

  const rawCulprits = ensureArray(culpability.culprits)
    .map((name) => String(name ?? "").trim())
    .filter(Boolean);

  const validCulprits = rawCulprits.filter((name) => {
    const lowered = name.toLowerCase();
    if (victimNameSet.has(lowered) || detectiveNameSet.has(lowered)) return false;
    const castEntry = normalizedCast.find((member) => String(member.name ?? "").trim().toLowerCase() === lowered);
    if (!castEntry) return false;
    return castEntry.culprit_eligibility === "eligible";
  });

  /**
   * THE FALLBACK THAT DECIDES THE MYSTERY, and until 2026-08-03 it did so silently and positionally.
   *
   * MEASURED (run_20260802-1654, external 80/100): the model returned `culprits: []` — it never
   * decided who did it — and this fallback took the FIRST culprit-eligible cast member. That was
   * Captain Ivor Hale, who is also `false_solution.accused_suspect`. The story therefore staged its
   * deliberate wrong accusation against the actual murderer, and the external reviewer's complaint
   * was verbatim: "Chapter 6 accuses Hale, but Hale is guilty."
   *
   * Two changes, and both matter:
   *   1. PREFERENCE ORDER, not position. A cast member the model actually marked guilty, or locked
   *      as the culprit, is a real answer; first-in-array is a coin toss the reader can feel.
   *   2. THE FALSELY ACCUSED IS EXCLUDED. Picking them is self-contradictory by construction — and
   *      it is the one wrong answer the genre punishes hardest.
   *
   * The fabrication is still permitted (removing it outright would convert a recoverable defect
   * into an abort, which ADR-0003 forbids and which 1-in-2 observed runs would have hit), but it is
   * now RECORDED in `normalizationNotes`, and `validateCml` independently rejects a culprit who is
   * the accused — so Agent 4 gets a chance to replace the guess with a decision.
   */
  const accusedKey = String(
    ensureObject(caseBlock.false_solution).accused_suspect ?? ""
  ).trim().toLowerCase();
  const isCandidate = (member: any, allowAccused: boolean): boolean => {
    const lowered = String(member?.name ?? "").trim().toLowerCase();
    if (!lowered) return false;
    if (victimNameSet.has(lowered) || detectiveNameSet.has(lowered)) return false;
    if (!allowAccused && accusedKey && lowered === accusedKey) return false;
    return member.culprit_eligibility === "eligible" || member.culprit_eligibility === "locked";
  };
  const fallbackCulprit = normalizedCast.find((m) => m.culpability === "guilty" && isCandidate(m, true)) ??
    normalizedCast.find((m) => m.culprit_eligibility === "locked" && isCandidate(m, true)) ??
    normalizedCast.find((m) => isCandidate(m, false)) ??
    normalizedCast.find((m) => isCandidate(m, true));

  const normalizedCulprits = validCulprits.length > 0
    ? [validCulprits[0]]
    : fallbackCulprit
      ? [String(fallbackCulprit.name)]
      : [normalizedCast[0]?.name ?? "Unknown"].filter(Boolean);

  if (validCulprits.length === 0) {
    // A run must never be readable as "the model chose this culprit" when this code did.
    normalizationNotes.push(
      `Agent 3 returned no usable culprit (culprits=[${rawCulprits.join(", ")}]); normalization ` +
      `assigned "${normalizedCulprits[0] ?? "(none)"}" from the cast. The case did not decide its own answer.`
    );
  }

  culpability.culprits = normalizedCulprits;
  culpability.culprit_count = normalizedCulprits.length;

  const normalizedCulpritSet = new Set(normalizedCulprits.map((name) => name.toLowerCase()));
  for (const member of normalizedCast) {
    const lowered = String(member.name ?? "").trim().toLowerCase();
    if (!lowered) continue;
    if (normalizedCulpritSet.has(lowered)) {
      member.culpability = "guilty";
      member.culprit_eligibility = "eligible";
    } else if (member.culpability === "guilty") {
      member.culpability = "unknown";
    }
  }

  const surface = ensureObject(caseBlock.surface_model);
  caseBlock.surface_model = surface;
  const surfaceNarrative = ensureObject(surface.narrative);
  surface.narrative = surfaceNarrative;
  surfaceNarrative.summary = ensureString(surfaceNarrative.summary, "A mystery unfolds.");
  surface.accepted_facts = ensureArray(surface.accepted_facts);
  surface.inferred_conclusions = ensureArray(surface.inferred_conclusions);

  const hidden = ensureObject(caseBlock.hidden_model);
  caseBlock.hidden_model = hidden;
  const hiddenMechanism = ensureObject(hidden.mechanism);
  hidden.mechanism = hiddenMechanism;
  hiddenMechanism.description = ensureString(hiddenMechanism.description, "Poisoned tea.");
  hiddenMechanism.delivery_path = ensureArray(hiddenMechanism.delivery_path);
  // A_71 — false-time direction fields. Default to "" (not a placeholder time): an absent time must
  // read as "this concealment does not fake a time", which checkTimelineDeception treats as
  // nothing-to-check. Inventing a default here would fabricate a coherence claim the case never made.
  hiddenMechanism.actual_time_of_death = ensureString(hiddenMechanism.actual_time_of_death, "");
  hiddenMechanism.apparent_time_of_death = ensureString(hiddenMechanism.apparent_time_of_death, "");
  const hiddenOutcome = ensureObject(hidden.outcome);
  hidden.outcome = hiddenOutcome;
  hiddenOutcome.result = ensureString(hiddenOutcome.result, "Victim poisoned.");

  // L1 (ANALYSIS_48 T1.1): guarantee a PHYSICAL manner of death so the prose resolveDeathMethod chain
  // and the rubric weak-murder-method grader always have a token to enforce. Prefer the model's
  // authored value; else derive from the crime classification; else a neutral physical default. Kept
  // separate from hidden_model.mechanism (the concealment trick) — the reveal must name the killing.
  const authoredDeathMethod = ensureString(caseBlock.death_method, "").trim();
  caseBlock.death_method =
    authoredDeathMethod ||
    deriveDeathMethodFromCrimeClass(
      ensureString(crimeClass.subtype, ""),
      ensureString(crimeClass.category, "")
    ) ||
    "poisoning";

  const falseAssumption = ensureObject(caseBlock.false_assumption);
  caseBlock.false_assumption = falseAssumption;
  falseAssumption.statement = ensureString(falseAssumption.statement, "Death was natural.");
  falseAssumption.type = ensureString(falseAssumption.type, inputs.primaryAxis);
  falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Symptoms mimic illness.");
  falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Poisoning timeline.");

  // SWEEP A — normalise the Golden Age genre structures so they are always present and
  // schema-valid. Defaults are derived from existing CASE data; the LLM is asked to author
  // richer versions (see prompt). The genre validator enforces quality (≥2 herrings with
  // innocent explanations, a false solution with a flaw, culprit inside the closed circle).
  const castEntries: any[] = Array.isArray(caseBlock.cast) ? (caseBlock.cast as any[]) : [];
  const culpritNamesForGenre: string[] = Array.isArray((caseBlock.culpability as any)?.culprits)
    ? ((caseBlock.culpability as any).culprits as any[]).map((n) => String(n).trim()).filter(Boolean)
    : [];
  const roleOf = (entry: any) => String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase();
  const suspectNamesForGenre: string[] = castEntries
    .filter((e) => !roleOf(e).includes("detective") && !isVictimArchetype(roleOf(e)))
    .map((e) => String(e?.name ?? "").trim())
    .filter(Boolean);
  const innocentSuspect = suspectNamesForGenre.find((n) => !culpritNamesForGenre.includes(n));

  // Chapter-pointer fields are optional numbers; the LLM often emits strings ("Chapter 6", "6").
  // Coerce to an integer chapter number, or undefined when no number is present (validator skips
  // undefined optional fields). Prevents "must be number" validation failures.
  const coerceChapter = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
    if (typeof value === "string") {
      const match = value.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    return undefined;
  };

  // closed_circle
  const closedCircle = ensureObject(caseBlock.closed_circle);
  caseBlock.closed_circle = closedCircle;
  const declaredCircle = ensureArray(closedCircle.suspects).map((n) => String(n).trim()).filter(Boolean);
  closedCircle.suspects = declaredCircle.length > 0
    ? Array.from(new Set(declaredCircle))
    : Array.from(new Set(suspectNamesForGenre));
  closedCircle.rationale = ensureString(
    closedCircle.rationale,
    "The suspects are bound together by the central situation and none could have come from outside it."
  );

  // false_solution
  const falseSolution = ensureObject(caseBlock.false_solution);
  caseBlock.false_solution = falseSolution;
  falseSolution.accused_suspect = ensureString(
    falseSolution.accused_suspect,
    innocentSuspect || suspectNamesForGenre[0] || "an innocent member of the circle"
  );
  falseSolution.supporting_points = ensureArray(falseSolution.supporting_points);
  if ((falseSolution.supporting_points as any[]).length === 0) {
    falseSolution.supporting_points = [
      ensureString(falseAssumption.why_it_seems_reasonable, "Their motive and opportunity look strongest on the surface."),
    ];
  }
  falseSolution.the_one_flaw = ensureString(
    falseSolution.the_one_flaw,
    ensureString(falseAssumption.what_it_hides, "It cannot account for the one physical fact the detective fixes on.")
  );
  const refutedChapter = coerceChapter(falseSolution.refuted_in_chapter);
  if (refutedChapter === undefined) {
    delete falseSolution.refuted_in_chapter;
  } else {
    falseSolution.refuted_in_chapter = refutedChapter;
  }

  // red_herrings — coerce to a well-formed array; guarantee an innocent_explanation per entry.
  const rawHerrings = ensureArray(caseBlock.red_herrings) as any[];
  caseBlock.red_herrings = rawHerrings.map((h, idx) => {
    const obj = (h && typeof h === "object") ? h as Record<string, unknown> : {};
    return {
      id: ensureString(obj.id, `red_herring_${idx + 1}`),
      description: ensureString(obj.description, "A suspicious circumstance that draws the eye."),
      points_at_suspect: typeof obj.points_at_suspect === "string" ? obj.points_at_suspect : undefined,
      innocent_explanation: ensureString(
        obj.innocent_explanation,
        "It has an innocent explanation unrelated to the crime, revealed before the solution."
      ),
      resolved_in_chapter: coerceChapter(obj.resolved_in_chapter),
    };
  });

  const constraintSpace = ensureObject(caseBlock.constraint_space);
  caseBlock.constraint_space = constraintSpace;

  // A_102 §8 — does the case connect the culprit to the ACT? The only copy of this check lived in
  // the harness, and the paid run on seed 61062 shipped a means-link trace naming a suspect the
  // same case marks innocent with nothing noticing. NOTE ONLY: no retry, no abort — a gate that
  // drives retries costs +2.43 register points on the retried chapter (B1). The run log carries it
  // under this label so a paid run is judged by the instrument that scored the harness.
  {
    const meansLink = provesTheAct(caseBlock);
    normalizationNotes.push(`[A_102 means-link] ${meansLink.verdict}: ${meansLink.detail.replace(/\s+/g, " ")}`);
    // 17-hitting-90 P3.1 / P3.2 — two more shapes the readers asked the case for, as notes only.
    for (const note of [deathMethodWoundSiteNote(caseBlock.death_method), actWindowNote(caseBlock)]) {
      if (note) normalizationNotes.push(note);
    }
    if (validCulprits.length === 0) {
      const orphaned = orphanedMeansLinkTraces(caseBlock, rawCulprits.map(String), normalizedCulprits);
      if (orphaned.length > 0) {
        normalizationNotes.push(
          `[A_102 means-link] ORPHANED: normalization reassigned the culprit to "${normalizedCulprits[0]}" but ` +
          `${orphaned.length} trace(s) still name the model's original culprit: ` +
          `${orphaned.map((t) => `"${t}"`).join("; ")}. Those traces now point at an innocent.`
        );
      }
    }
  }
  const constraintTime = ensureObject(constraintSpace.time);
  constraintSpace.time = constraintTime;
  constraintTime.anchors = ensureArray(constraintTime.anchors);
  constraintTime.windows = ensureArray(constraintTime.windows);
  constraintTime.contradictions = ensureArray(constraintTime.contradictions);
  const constraintAccess = ensureObject(constraintSpace.access);
  constraintSpace.access = constraintAccess;
  constraintAccess.actors = ensureArray(constraintAccess.actors);
  constraintAccess.objects = ensureArray(constraintAccess.objects);
  constraintAccess.permissions = ensureArray(constraintAccess.permissions);
  const constraintPhysical = ensureObject(constraintSpace.physical);
  constraintSpace.physical = constraintPhysical;
  constraintPhysical.laws = ensureArray(constraintPhysical.laws);
  constraintPhysical.traces = ensureArray(constraintPhysical.traces);
  const constraintSocial = ensureObject(constraintSpace.social);
  constraintSpace.social = constraintSocial;
  constraintSocial.trust_channels = ensureArray(constraintSocial.trust_channels);
  constraintSocial.authority_sources = ensureArray(constraintSocial.authority_sources);

  const inferencePath = ensureObject(caseBlock.inference_path);
  caseBlock.inference_path = inferencePath;
  const originalStepCount = Array.isArray(inferencePath.steps) ? inferencePath.steps.length : 0;
  if (originalStepCount < 3) {
    // A_53 P2 (repair-not-abort): synthesize the missing steps from THIS case's own constraint
    // anchors + mechanism (never a fixed plot), pad to the floor of 3, and warn — so Agent 4 sees a
    // structurally-valid artifact instead of the run dying inside normalize. Evidence on synthesized
    // steps is repaired downstream by repairInferenceRequiredEvidence.
    const steps: any[] = Array.isArray(inferencePath.steps) ? [...inferencePath.steps] : [];
    const anchors = [
      ...ensureArray(constraintTime.anchors),
      ...ensureArray(constraintTime.windows),
      ...ensureArray(constraintTime.contradictions),
      ...ensureArray(constraintAccess.actors),
      ...ensureArray(constraintAccess.objects),
      ...ensureArray(constraintAccess.permissions),
      ...ensureArray(constraintPhysical.laws),
      ...ensureArray(constraintPhysical.traces),
      ...ensureArray(constraintSocial.trust_channels),
      ...ensureArray(constraintSocial.authority_sources),
    ]
      .map((entry) => ensureString(entry, "").trim())
      .filter((entry) => entry.length > 0);
    const mechanismHint = ensureString(
      ensureObject(ensureObject(caseBlock.hidden_model).mechanism).description,
      ""
    ).trim();
    while (steps.length < 3) {
      const i = steps.length;
      const anchor = anchors[i % Math.max(anchors.length, 1)];
      steps.push({
        observation: anchor && anchor.length > 0
          ? anchor
          : `Observation ${i + 1}: a concrete scene-level detail is established on the page.`,
        correction: mechanismHint
          ? `Re-read against the established mechanism (${mechanismHint}), this detail revises the surface sequence.`
          : `Correction ${i + 1}: the surface reading of this detail is revised by the on-page evidence.`,
        effect: "The set of viable explanations narrows toward a single testable hypothesis.",
        required_evidence: [],
        reader_observable: true,
      });
    }
    inferencePath.steps = steps;
    console.warn(
      `[agent3-cml] inference_path had ${originalStepCount} step(s); synthesized ${3 - originalStepCount} ` +
      `from this case's constraint anchors to reach the floor of 3 (repair-not-abort).`
    );
  }
  // Ensure each step has required_evidence array and reader_observable
  for (const step of inferencePath.steps as any[]) {
    if (!Array.isArray(step.required_evidence)) {
      step.required_evidence = [];
    }
    if (typeof step.reader_observable !== "boolean") {
      step.reader_observable = true;
    }
  }

  const discriminatingTest = ensureObject(caseBlock.discriminating_test);
  caseBlock.discriminating_test = discriminatingTest;
  const method = ensureString(discriminatingTest.method, "trap");
  discriminatingTest.method = [
    "reenactment",
    "trap",
    "constraint_proof",
    "administrative_pressure",
  ].includes(method)
    ? method
    : "trap";
  discriminatingTest.design = ensureString(discriminatingTest.design, "Confront with evidence");
  discriminatingTest.knowledge_revealed = ensureString(discriminatingTest.knowledge_revealed, "Access window");
  discriminatingTest.pass_condition = ensureString(discriminatingTest.pass_condition, "Culprit reacts");
  discriminatingTest.evidence_clues = ensureArray(discriminatingTest.evidence_clues)
    .map((id) => String(id ?? "").trim())
    .filter((id) => id.length > 0);

  // Deterministic pre-check: keep knowledge_revealed grounded in reader-visible
  // inference evidence before schema/fair-play validation.
  groundDiscriminatingKnowledgeRevealed(caseBlock);

  const fairPlay = ensureObject(caseBlock.fair_play);
  caseBlock.fair_play = fairPlay;
  fairPlay.all_clues_visible = typeof fairPlay.all_clues_visible === "boolean" ? fairPlay.all_clues_visible : true;
  fairPlay.no_special_knowledge_required =
    typeof fairPlay.no_special_knowledge_required === "boolean" ? fairPlay.no_special_knowledge_required : true;
  fairPlay.no_late_information = typeof fairPlay.no_late_information === "boolean" ? fairPlay.no_late_information : true;
  fairPlay.reader_can_solve = typeof fairPlay.reader_can_solve === "boolean" ? fairPlay.reader_can_solve : true;
  fairPlay.explanation = ensureString(fairPlay.explanation, "All clues provided before reveal.");

  const qualityControls = ensureObject(caseBlock.quality_controls);
  caseBlock.quality_controls = qualityControls;
  const inferenceRequirements = ensureObject(qualityControls.inference_path_requirements);
  qualityControls.inference_path_requirements = inferenceRequirements;
  inferenceRequirements.min_steps = typeof inferenceRequirements.min_steps === "number" ? inferenceRequirements.min_steps : 3;
  inferenceRequirements.max_steps =
    typeof inferenceRequirements.max_steps === "number"
      ? inferenceRequirements.max_steps
      : config.inference_requirements.default_max_steps;
  inferenceRequirements.require_observation_correction_effect =
    typeof inferenceRequirements.require_observation_correction_effect === "boolean"
      ? inferenceRequirements.require_observation_correction_effect
      : true;

  const clueVisibility = ensureObject(qualityControls.clue_visibility_requirements);
  qualityControls.clue_visibility_requirements = clueVisibility;
  clueVisibility.essential_clues_min = typeof clueVisibility.essential_clues_min === "number" ? clueVisibility.essential_clues_min : 3;
  clueVisibility.essential_clues_before_test =
    typeof clueVisibility.essential_clues_before_test === "boolean" ? clueVisibility.essential_clues_before_test : true;
  clueVisibility.early_clues_min = typeof clueVisibility.early_clues_min === "number" ? clueVisibility.early_clues_min : 2;
  clueVisibility.mid_clues_min = typeof clueVisibility.mid_clues_min === "number" ? clueVisibility.mid_clues_min : 2;
  clueVisibility.late_clues_min = typeof clueVisibility.late_clues_min === "number" ? clueVisibility.late_clues_min : 1;

  const discriminatingRequirements = ensureObject(qualityControls.discriminating_test_requirements);
  qualityControls.discriminating_test_requirements = discriminatingRequirements;
  const timing = ensureString(discriminatingRequirements.timing, "early_act3");
  discriminatingRequirements.timing = ["late_act2", "early_act3", "mid_act3"].includes(timing)
    ? timing
    : "early_act3";
  discriminatingRequirements.must_reference_inference_step =
    typeof discriminatingRequirements.must_reference_inference_step === "boolean"
      ? discriminatingRequirements.must_reference_inference_step
      : true;

  // ── Deterministic suspect_clearance_scenes gap-fill ──────────────────────
  // Agent 3 LLM frequently omits one or more non-culprit suspects from
  // prose_requirements.suspect_clearance_scenes.  When a suspect is missing,
  // no clearance obligation is ever injected into prose prompts, and the
  // SuspectClosureValidator release gate fails even though the clues exist.
  // This patch ensures EVERY non-culprit, non-detective suspect has an entry.
  const proseRequirements = ensureObject(caseBlock.prose_requirements);
  caseBlock.prose_requirements = proseRequirements;
  const existingClearances: any[] = ensureArray(proseRequirements.suspect_clearance_scenes);

  // Identify which suspects already have a clearance entry (by name).
  const clearedNames = new Set<string>(
    existingClearances
      .filter((e: any) => e && typeof e.suspect_name === "string")
      .map((e: any) => (e.suspect_name as string).trim().toLowerCase())
  );

  // Derive culprit and detective sets from the normalized cast.
  const culpritSet = new Set<string>(
    ensureArray(culpability.culprits)
      .filter((n: unknown) => typeof n === "string")
      .map((n: unknown) => (n as string).trim().toLowerCase())
  );
  const detectiveRoles = new Set(["detective", "investigator", "inspector"]);
  const detectiveCastNames = new Set<string>(
    (normalizedCast as any[])
      .filter((c: any) => {
        const ra = String(c.role_archetype ?? c.role ?? "").toLowerCase();
        return [...detectiveRoles].some((r) => ra.includes(r));
      })
      .map((c: any) => (c.name as string).trim().toLowerCase())
  );

  // A_50 §9: drop any LLM-authored clearance for the CULPRIT (or detective) — the gap-fill below
  // already skips them on ADD, but the LLM's original list was written back UNFILTERED, leaving a
  // culprit-clearance that causes cleared_culprit_conflict. Remove them at the source.
  for (let i = existingClearances.length - 1; i >= 0; i -= 1) {
    const n = String(existingClearances[i]?.suspect_name ?? "").trim().toLowerCase();
    if (n && (culpritSet.has(n) || detectiveCastNames.has(n))) existingClearances.splice(i, 1);
  }

  // Determine a sensible default scene for gap-filled clearances:
  // one scene before the culprit revelation scene (which is late Act 3).
  /**
   * A_87 P3 — the `|| 3` / `|| 6` defaults were a SECOND BODY of the prompt's worked example.
   *
   * A ref the model omitted was silently invented as act 3 / scene 6 — the identical fiction the
   * prompt supplied, so an absent ref and a copied one were indistinguishable downstream.
   *
   * The constants are KEPT: a gap-filled clearance still needs some coordinate, and there is no
   * better one available here (Agent 7 has not run, so no real scene namespace exists yet). What
   * changes is that their use is now AUDIBLE instead of silent — which is the whole defect.
   *
   * MEASURED: no archived run omits this field, so this branch is a no-op on all 45 — which is
   * exactly why it could carry a wrong constant for the life of the project unnoticed.
   */
  const revealRefRaw = (typeof proseRequirements.culprit_revelation_scene === "object" &&
    proseRequirements.culprit_revelation_scene !== null)
    ? (proseRequirements.culprit_revelation_scene as any)
    : null;
  const revealActNum: number = Number(revealRefRaw?.act_number) || 3;
  const revealSceneNum: number = Number(revealRefRaw?.scene_number) || 6;
  if (!revealRefRaw) {
    // eslint-disable-next-line no-console
    console.warn(
      "[A_87] culprit_revelation_scene absent from the case; clearance scenes fall back to " +
      "act 3 / scene 6, which resolves against no outline. The clearance coordinates for this " +
      "run are guesses."
    );
  }
  const clearanceActNum = revealActNum;
  // A_67 FIX-1(c): fold gap-filled clearances INTO the reveal / discriminating-test scene (where the
  // reveal already eliminates non-culprits on-page) instead of stamping them all onto a dedicated
  // pre-reveal scene — the structural root of the duplicate "clearance chapter" the probe reads flag.
  // Default-off (probe before default-on); when off, the historical (reveal − 1) coordinate is kept.
  const foldSuspectClearances = process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "true" || process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "1";
  const clearanceSceneNum = foldSuspectClearances ? revealSceneNum : Math.max(1, revealSceneNum - 1);

  // Build a lookup of clue IDs that appear to eliminate each suspect.
  const clueToSceneMapping: any[] = ensureArray(proseRequirements.clue_to_scene_mapping);
  const suspectEliminationClues: Map<string, string[]> = new Map();
  for (const clueEntry of clueToSceneMapping) {
    if (!clueEntry || typeof clueEntry !== "object") continue;
    const clueId = String(clueEntry.clue_id ?? "").trim();
    if (!clueId) continue;
    // Look for any cast name mentioned in this clue entry.
    const entryText = JSON.stringify(clueEntry).toLowerCase();
    for (const castMember of normalizedCast as any[]) {
      const nameLower = String(castMember.name ?? "").trim().toLowerCase();
      if (!nameLower || culpritSet.has(nameLower) || detectiveCastNames.has(nameLower)) continue;
      const surname = nameLower.split(" ").pop() ?? nameLower;
      if (entryText.includes(nameLower) || entryText.includes(surname)) {
        if (!suspectEliminationClues.has(nameLower)) suspectEliminationClues.set(nameLower, []);
        suspectEliminationClues.get(nameLower)!.push(clueId);
      }
    }
  }

  // Add missing entries.
  for (const castMember of normalizedCast as any[]) {
    const nameLower = String(castMember.name ?? "").trim().toLowerCase();
    if (!nameLower) continue;
    if (culpritSet.has(nameLower) || detectiveCastNames.has(nameLower)) continue;
    if (clearedNames.has(nameLower)) continue;

    // Derive clearance method from the suspect's alibi_window if available.
    const alibiWindow = ensureString(castMember.alibi_window, "");
    const clearanceMethod = alibiWindow
      ? `Alibi confirmed: ${alibiWindow}`
      : "Alibi confirmed by corroborating witness";

    existingClearances.push({
      suspect_name: castMember.name,
      act_number: clearanceActNum,
      scene_number: clearanceSceneNum,
      clearance_method: clearanceMethod,
      supporting_clues: suspectEliminationClues.get(nameLower) ?? [],
    });
  }

  proseRequirements.suspect_clearance_scenes = existingClearances;


  return cml;
}

// ── profile "revise": Agent 4 (moved verbatim from reviseCml) ───────────────────────────────

export function normalizeCmlForRevision(raw: Record<string, unknown>, config: ReturnType<typeof getGenerationParams>["agent4_cml_validator"]["params"]) {
  const normalizeEnum = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => {
    const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
    const match = allowed.find((item) => item.toLowerCase() === normalized);
    return match ?? fallback;
  };

  /**
   * A_73 §40 — WAS: anything unrecognised fell through to `return "non-binary"`.
   *
   * That made a garbled or missing gender silently produce a character the pronoun pipeline cannot
   * check at all: `normalizePronounGender` drops non-binary from the drift scan and
   * `detectAttributionFlips` matches only /(he|she)/. A parse failure became an invisible character.
   *
   * The cast is binary by design — 1930s-1950s Golden Age novels, presented as that period's
   * fiction presents. An unrecognised value is a DATA DEFECT, so it is warned about rather than
   * absorbed, and resolves to a gender the validators can actually check.
   */
  const normalizeGenderEnum = (value: unknown): "male" | "female" => {
    const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
    if (normalized === "male" || normalized === "m" || normalized === "man" || normalized === "boy") return "male";
    if (normalized === "female" || normalized === "f" || normalized === "woman" || normalized === "girl") return "female";
    console.warn(
      `[agent4-revision][A_73] gender ${JSON.stringify(value)} is neither male nor female — ` +
      `resolving to "female" so the character stays visible to the pronoun detectors. ` +
      `The upstream cast artifact is wrong; fix it there.`
    );
    return "female";
  };
  const cml = ensureObject(raw);
  cml.CML_VERSION = 2.0;

  const caseBlock = ensureObject(cml.CASE);
  cml.CASE = caseBlock;

  const meta = ensureObject(caseBlock.meta);
  caseBlock.meta = meta;
  meta.title = ensureString(meta.title, "Untitled");
  meta.author = ensureString(meta.author, "CML Generator");
  meta.license = ensureString(meta.license, "CC-BY-4.0");

  const era = ensureObject(meta.era);
  meta.era = era;
  era.decade = ensureString(era.decade, "1930s");
  if (era.specific_year !== undefined && typeof era.specific_year !== "number") {
    delete era.specific_year;
  }
  if (era.specific_month !== undefined && typeof era.specific_month !== "string") {
    delete era.specific_month;
  }
  if (era.wartime !== undefined && typeof era.wartime !== "boolean") {
    delete era.wartime;
  }
  era.realism_constraints = ensureArray(era.realism_constraints);

  const setting = ensureObject(meta.setting);
  meta.setting = setting;
  setting.location = ensureString(setting.location, "Unknown location");
  setting.institution = ensureString(setting.institution, "Unknown institution");

  const crimeClass = ensureObject(meta.crime_class);
  meta.crime_class = crimeClass;
  crimeClass.category = normalizeEnum(crimeClass.category, ["murder", "theft", "disappearance", "fraud"], "murder");
  // A_53 P1 (holistic): neutral placeholder, never a concrete method ("poisoning") that would
  // inject a specific plot into an unrelated case if the LLM omitted the subtype.
  crimeClass.subtype = ensureString(crimeClass.subtype, "unspecified");

  caseBlock.cast = Array.isArray(caseBlock.cast)
    ? caseBlock.cast.map((member, index) => {
      const existing = ensureObject(member);
      const normalizedEligibility = normalizeEnum(existing.culprit_eligibility, ["eligible", "ineligible", "locked"], "eligible");
      const normalizedCulpability = normalizeEnum(existing.culpability, ["guilty", "innocent", "unknown"], "unknown");
      const normalizedRole = existing.role === undefined
        ? undefined
        : normalizeEnum(existing.role, ["detective", "victim", "culprit", "suspect", "witness", "bystander"], "suspect");
      const normalizedGender = existing.gender === undefined
        ? undefined
        : normalizeGenderEnum(existing.gender);
      const normalizedMember: Record<string, unknown> = {
        ...existing,
        name: ensureString(existing.name, `Suspect ${index + 1}`),
        age_range: ensureString(existing.age_range, "adult"),
        role_archetype: ensureString(existing.role_archetype, "suspect"),
        relationships: ensureArray(existing.relationships),
        public_persona: ensureString(existing.public_persona, "reserved"),
        private_secret: ensureString(existing.private_secret, "keeps a secret"),
        // A_53 P1 (holistic): generic motive placeholder, never a concrete motive ("inheritance")
        // that would assert a specific plot for every motive-less suspect.
        motive_seed: ensureString(existing.motive_seed, "a personal stake in the outcome"),
        motive_strength: ensureString(existing.motive_strength, "moderate"),
        alibi_window: ensureString(existing.alibi_window, "evening"),
        access_plausibility: ensureString(existing.access_plausibility, "medium"),
        opportunity_channels: ensureArray(existing.opportunity_channels),
        behavioral_tells: ensureArray(existing.behavioral_tells),
        stakes: ensureString(existing.stakes, "reputation"),
        evidence_sensitivity: ensureArray(existing.evidence_sensitivity),
        culprit_eligibility: normalizedEligibility,
        culpability: normalizedCulpability,
      };

      if (normalizedRole !== undefined) {
        normalizedMember.role = normalizedRole;
      }
      if (normalizedGender !== undefined) {
        normalizedMember.gender = normalizedGender;
      }
      if (existing.moral_complexity !== undefined) {
        normalizedMember.moral_complexity = ensureString(existing.moral_complexity, "complex motivations");
      }

      return normalizedMember;
    })
    : [];

  const culpability = ensureObject(caseBlock.culpability);
  caseBlock.culpability = culpability;
  const culpritCount = typeof culpability.culprit_count === "number" ? culpability.culprit_count : 1;
  culpability.culprit_count = culpritCount === 2 ? 2 : 1;
  culpability.culprits = ensureArray(culpability.culprits);

  const surface = ensureObject(caseBlock.surface_model);
  caseBlock.surface_model = surface;
  const surfaceNarrative = ensureObject(surface.narrative);
  surface.narrative = surfaceNarrative;
  surfaceNarrative.summary = ensureString(surfaceNarrative.summary, "Unknown");
  surface.accepted_facts = ensureArray(surface.accepted_facts);
  surface.inferred_conclusions = ensureArray(surface.inferred_conclusions);

  const hidden = ensureObject(caseBlock.hidden_model);
  caseBlock.hidden_model = hidden;
  const hiddenMechanism = ensureObject(hidden.mechanism);
  hidden.mechanism = hiddenMechanism;
  hiddenMechanism.description = ensureString(hiddenMechanism.description, "Unknown");
  hiddenMechanism.delivery_path = ensureArray(hiddenMechanism.delivery_path);
  const hiddenOutcome = ensureObject(hidden.outcome);
  hidden.outcome = hiddenOutcome;
  hiddenOutcome.result = ensureString(hiddenOutcome.result, "Unknown");

  const falseAssumption = ensureObject(caseBlock.false_assumption);
  caseBlock.false_assumption = falseAssumption;
  falseAssumption.statement = ensureString(falseAssumption.statement, "Unknown assumption");
  falseAssumption.type = normalizeEnum(falseAssumption.type, ["temporal", "spatial", "identity", "behavioral", "authority"], "temporal");
  falseAssumption.why_it_seems_reasonable = ensureString(falseAssumption.why_it_seems_reasonable, "Unknown");
  falseAssumption.what_it_hides = ensureString(falseAssumption.what_it_hides, "Unknown");

  const constraintSpace = ensureObject(caseBlock.constraint_space);
  caseBlock.constraint_space = constraintSpace;
  const constraintTime = ensureObject(constraintSpace.time);
  constraintSpace.time = constraintTime;
  constraintTime.anchors = ensureArray(constraintTime.anchors);
  constraintTime.windows = ensureArray(constraintTime.windows);
  constraintTime.contradictions = ensureArray(constraintTime.contradictions);
  const constraintAccess = ensureObject(constraintSpace.access);
  constraintSpace.access = constraintAccess;
  constraintAccess.actors = ensureArray(constraintAccess.actors);
  constraintAccess.objects = ensureArray(constraintAccess.objects);
  constraintAccess.permissions = ensureArray(constraintAccess.permissions);
  const constraintPhysical = ensureObject(constraintSpace.physical);
  constraintSpace.physical = constraintPhysical;
  constraintPhysical.laws = ensureArray(constraintPhysical.laws);
  constraintPhysical.traces = ensureArray(constraintPhysical.traces);
  const constraintSocial = ensureObject(constraintSpace.social);
  constraintSpace.social = constraintSocial;
  constraintSocial.trust_channels = ensureArray(constraintSocial.trust_channels);
  constraintSocial.authority_sources = ensureArray(constraintSocial.authority_sources);

  // A_53 P1 (holistic): evidence anchors derived from THIS document's own constraint space — used
  // both to synthesize fallback inference steps and to repair required_evidence below. Hoisted here
  // (from its later definition) so the step fallback can reference it.
  const evidenceAnchors = [
    ...ensureArray(constraintTime.anchors),
    ...ensureArray(constraintTime.windows),
    ...ensureArray(constraintTime.contradictions),
    ...ensureArray(constraintAccess.actors),
    ...ensureArray(constraintAccess.objects),
    ...ensureArray(constraintAccess.permissions),
    ...ensureArray(constraintPhysical.laws),
    ...ensureArray(constraintPhysical.traces),
    ...ensureArray(constraintSocial.trust_channels),
    ...ensureArray(constraintSocial.authority_sources),
  ]
    .map((entry) => ensureString(entry, "").trim())
    .filter((entry) => entry.length > 0)
    .slice(0, 20);
  // A_53 integration: exclude the normalizer's literal "Unknown" default so the fallback step never
  // reads "Re-read against the established mechanism (Unknown)" — fall back to the generic phrasing.
  const mechanismHintRaw = ensureString(hiddenMechanism.description, "").trim();
  const mechanismHint = mechanismHintRaw.toLowerCase() === "unknown" ? "" : mechanismHintRaw;

  // A_53 P1 (holistic): when a CML loses ALL its inference steps, synthesize the minimum floor
  // from the document's OWN anchors/mechanism — never inject a fixed teacup/poisoning plot that
  // would then pass validation as canon for an unrelated case.
  const buildFallbackInferenceSteps = (): Array<Record<string, string>> => {
    const steps: Array<Record<string, string>> = [];
    for (let i = 0; i < 3; i += 1) {
      const anchor = evidenceAnchors[i % Math.max(evidenceAnchors.length, 1)];
      const observation = anchor && anchor.length > 0
        ? anchor
        : `Observation ${i + 1}: a concrete scene-level detail is established on the page.`;
      const correction = mechanismHint
        ? `Re-read against the established mechanism (${mechanismHint}), this detail revises the surface sequence.`
        : `Correction ${i + 1}: the surface reading of this detail is revised by the on-page evidence.`;
      steps.push({
        observation,
        correction,
        effect: "The set of viable explanations narrows toward a single testable hypothesis.",
      });
    }
    return steps;
  };

  const inferencePath = ensureObject(caseBlock.inference_path);
  caseBlock.inference_path = inferencePath;
  inferencePath.steps = Array.isArray(inferencePath.steps) && inferencePath.steps.length
    ? inferencePath.steps
    : buildFallbackInferenceSteps();

  const isAbstractEvidence = (text: string) => {
    const normalized = text.toLowerCase();
    const abstractMarkers = [
      "timeline discrepancy",
      "suspicious behavior",
      "hidden motive",
      "detective insight",
      "something was wrong",
      "inconsistency",
      "general contradiction",
    ];
    return abstractMarkers.some((marker) => normalized.includes(marker));
  };

  // A_53 P6 (silent-evidence-truncation-and-synthesis): synthesize required_evidence ONLY from the
  // document's own constraint anchors, falling back to step-derived (observation/correction) lines —
  // never a fixed free-text template ("A dated document …") that reads as an unplantable fair-play clue.
  const fallbackEvidence = (index: number, observation: string, correction: string): string[] => {
    const out: string[] = [];
    const anchorCount = evidenceAnchors.length;
    if (anchorCount > 0) {
      out.push(evidenceAnchors[index % anchorCount]);
      if (anchorCount > 1) out.push(evidenceAnchors[(index + 1) % anchorCount]);
    }
    out.push(`${observation} is directly visible to witnesses in-scene.`);
    out.push(`${correction} follows from the concrete records without private knowledge.`);
    return out.filter((s) => s.trim().length > 0);
  };

  const inferenceSteps = ensureArray(inferencePath.steps);
  inferencePath.steps = inferenceSteps.map((step, index) => {
    const stepObj = ensureObject(step);
    const existingRequiredEvidence = ensureArray(stepObj.required_evidence)
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0)
      .filter((item) => !isAbstractEvidence(item));
    const observation = ensureString(stepObj.observation, `Observation ${index + 1}`);
    const correction = ensureString(stepObj.correction, `Correction ${index + 1}`);

    // Keep model-provided concrete evidence when present; otherwise synthesize
    // concrete anchors to avoid abstract fair-play failures.
    const requiredEvidenceCandidates = existingRequiredEvidence.length > 0
      ? existingRequiredEvidence
      : fallbackEvidence(index, observation, correction);

    const requiredEvidence = requiredEvidenceCandidates.slice(0, 4);
    while (requiredEvidence.length < 2) {
      const fallback = fallbackEvidence(index + requiredEvidence.length, observation, correction)[0];
      if (!requiredEvidence.includes(fallback)) {
        requiredEvidence.push(fallback);
      } else {
        break;
      }
    }

    return {
      observation: observation.length >= 20 ? observation : `${observation} is grounded in a concrete scene-level fact.`,
      correction,
      effect: ensureString(stepObj.effect, `Effect ${index + 1}`),
      required_evidence: requiredEvidence,
      reader_observable: typeof stepObj.reader_observable === "boolean" ? stepObj.reader_observable : true,
    };
  });

  const discriminatingTest = ensureObject(caseBlock.discriminating_test);
  caseBlock.discriminating_test = discriminatingTest;
  discriminatingTest.method = normalizeEnum(
    discriminatingTest.method,
    ["reenactment", "trap", "constraint_proof", "administrative_pressure"],
    "trap"
  );
  discriminatingTest.design = ensureString(discriminatingTest.design, "Confront with evidence");
  discriminatingTest.knowledge_revealed = ensureString(discriminatingTest.knowledge_revealed, "Access window");
  discriminatingTest.pass_condition = ensureString(discriminatingTest.pass_condition, "Culprit reacts");

  // Deterministic pre-check: force knowledge_revealed to stay grounded in
  // reader-visible inference evidence before re-validation.
  groundDiscriminatingKnowledgeRevealed(caseBlock);

  // Keep discriminating-test evidence references canonical so Agent 5 does not
  // need heuristic reseeding that can pick late-only clues.
  const proseRequirements = ensureObject(caseBlock.prose_requirements);
  caseBlock.prose_requirements = proseRequirements;
  const mappedClueIds = ensureArray(proseRequirements.clue_to_scene_mapping)
    .map((entry) => ensureObject(entry))
    .map((entry) => ({
      clue_id: ensureString(entry.clue_id, ""),
      act_number: typeof entry.act_number === "number" ? entry.act_number : 99,
      scene_number: typeof entry.scene_number === "number" ? entry.scene_number : 99,
    }))
    .filter((entry) => /^clue_[a-z0-9_-]+$/i.test(entry.clue_id))
    .sort((a, b) => a.act_number - b.act_number || a.scene_number - b.scene_number)
    .map((entry) => entry.clue_id);

  const rawDiscriminatingEvidenceIds = ensureArray(discriminatingTest.evidence_clues)
    .map((value) => ensureString(value, ""))
    .filter(Boolean);
  const canonicalDiscriminatingEvidenceIds = rawDiscriminatingEvidenceIds
    .filter((id) => /^clue_[a-z0-9_-]+$/i.test(id));

  if (canonicalDiscriminatingEvidenceIds.length > 0) {
    discriminatingTest.evidence_clues = canonicalDiscriminatingEvidenceIds;
  } else if (mappedClueIds.length > 0) {
    discriminatingTest.evidence_clues = mappedClueIds.slice(0, 3);
  }

  const fairPlay = ensureObject(caseBlock.fair_play);
  caseBlock.fair_play = fairPlay;
  fairPlay.all_clues_visible = typeof fairPlay.all_clues_visible === "boolean" ? fairPlay.all_clues_visible : true;
  fairPlay.no_special_knowledge_required =
    typeof fairPlay.no_special_knowledge_required === "boolean" ? fairPlay.no_special_knowledge_required : true;
  fairPlay.no_late_information = typeof fairPlay.no_late_information === "boolean" ? fairPlay.no_late_information : true;
  fairPlay.reader_can_solve = typeof fairPlay.reader_can_solve === "boolean" ? fairPlay.reader_can_solve : true;
  const rawFairPlayExplanation = ensureString(fairPlay.explanation, "");
  if (rawFairPlayExplanation && /step\s*\d+/i.test(rawFairPlayExplanation)) {
    fairPlay.explanation = rawFairPlayExplanation;
  } else {
    const synthesizedExplanation = ensureArray(inferencePath.steps)
      .map((step, index) => {
        const stepObj = ensureObject(step);
        const evidence = ensureArray(stepObj.required_evidence)
          .map((entry) => ensureString(entry, ""))
          .filter(Boolean)
          .slice(0, 2)
          .join("; ");
        return `Step ${index + 1}: ${evidence || "Concrete evidence is shown before deduction."}`;
      })
      .join(" ");
    fairPlay.explanation = synthesizedExplanation || "Step 1: Concrete evidence is shown before deduction.";
  }

  const qualityControls = ensureObject(caseBlock.quality_controls);
  caseBlock.quality_controls = qualityControls;
  const inferenceRequirements = ensureObject(qualityControls.inference_path_requirements);
  qualityControls.inference_path_requirements = inferenceRequirements;
  inferenceRequirements.min_steps = typeof inferenceRequirements.min_steps === "number" ? inferenceRequirements.min_steps : 3;
  inferenceRequirements.max_steps =
    typeof inferenceRequirements.max_steps === "number"
      ? inferenceRequirements.max_steps
      : config.inference_requirements.default_max_steps;
  inferenceRequirements.require_observation_correction_effect =
    typeof inferenceRequirements.require_observation_correction_effect === "boolean"
      ? inferenceRequirements.require_observation_correction_effect
      : true;

  const clueVisibility = ensureObject(qualityControls.clue_visibility_requirements);
  qualityControls.clue_visibility_requirements = clueVisibility;
  clueVisibility.essential_clues_min = typeof clueVisibility.essential_clues_min === "number" ? clueVisibility.essential_clues_min : 3;
  clueVisibility.essential_clues_before_test =
    typeof clueVisibility.essential_clues_before_test === "boolean" ? clueVisibility.essential_clues_before_test : true;
  clueVisibility.early_clues_min = typeof clueVisibility.early_clues_min === "number" ? clueVisibility.early_clues_min : 2;
  clueVisibility.mid_clues_min = typeof clueVisibility.mid_clues_min === "number" ? clueVisibility.mid_clues_min : 2;
  clueVisibility.late_clues_min = typeof clueVisibility.late_clues_min === "number" ? clueVisibility.late_clues_min : 1;

  const discriminatingRequirements = ensureObject(qualityControls.discriminating_test_requirements);
  qualityControls.discriminating_test_requirements = discriminatingRequirements;
  discriminatingRequirements.timing = normalizeEnum(
    discriminatingRequirements.timing,
    ["late_act2", "early_act3", "mid_act3"],
    "early_act3"
  );
  discriminatingRequirements.must_reference_inference_step =
    typeof discriminatingRequirements.must_reference_inference_step === "boolean"
      ? discriminatingRequirements.must_reference_inference_step
      : true;

  return cml;
}
