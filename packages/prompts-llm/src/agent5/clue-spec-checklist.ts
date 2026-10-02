/**
 * A5-15 / A5-Q07 — Agent 5's "Mandatory Clue Requirements" checklist as a PROJECTION of `@cml/clue-spec`.
 *
 * Two components derive the same requirement set: `generateExplicitClueRequirements` (agent5-clues.ts, the
 * prompt hint) and `deriveClueSpec` (packages/clue-spec, the authoritative slot set the worker runs in
 * shadow). Over the 69 archived CMLs they agreed on slot COUNT in 7, and their two `inferCategory` bodies
 * disagree on a third of the slots they share. Behind AGENT5_CLUE_SPEC_CHECKLIST (default OFF) the checklist
 * is rendered from `deriveClueSpec(cml).clueSlots`, one numbered line per required slot, in the format
 * `buildMandatoryRequirementsList` already prints — so the model reads the same kind of instruction.
 *
 * What the projection takes from the slot: evidenceType, criticality, suggestedPlacement, category (clue-spec's,
 * where the two derivations disagree — that is the point of the promotion), supportsInferenceStep and keyTerms.
 * Only the requirement SENTENCE is composed here, from the CML text the slot's `sourceInCML` names; where a slot
 * corresponds to one of the old requirements its sentence is the old sentence, word for word.
 */
import { deriveClueSpec, slug, type ClueSlot } from "@cml/clue-spec";
import { deathMethodTellHints } from "../shared/clue-observable.js";
import type { RequirementLine } from "./clue-prompt-sections.js";

export interface ClueSpecChecklistLine extends RequirementLine {
  /** The clue-spec slot this line renders (deterministic; never printed in the prompt). */
  slotId: string;
  sourceInCML: string;
}

/** `{ CASE: ... }` or the bare CASE — both occur, and `deriveClueSpec` accepts both. */
function caseOf(cml: unknown): Record<string, any> {
  if (cml && typeof cml === "object") {
    const obj = cml as Record<string, any>;
    if (obj.CASE && typeof obj.CASE === "object") return obj.CASE;
    return obj;
  }
  return {};
}

/** The string at a `CASE.a.b[2].c` path, or "" when it is absent or not a string. */
function textAt(caseData: Record<string, any>, sourcePath: string): string {
  const segments = sourcePath.replace(/^CASE\./, "").match(/[^.[\]]+/g) ?? [];
  let cursor: any = caseData;
  for (const segment of segments) {
    if (cursor == null || typeof cursor !== "object") return "";
    cursor = cursor[/^\d+$/.test(segment) ? Number(segment) : segment];
  }
  return typeof cursor === "string" ? cursor : "";
}

const STEP_SLOT_RE = /^slot_(obs|contra)_step(\d+)$/;

function requirementFor(slot: ClueSlot, caseData: Record<string, any>): string {
  const step = slot.id.match(STEP_SLOT_RE);
  if (step) {
    const text = textAt(caseData, slot.sourceInCML);
    return step[1] === "obs"
      ? `Generate a clue that makes the reader directly observe: "${text.substring(0, 100)}..."`
      : `Generate a clue that provides evidence for: "${text.substring(0, 100)}..."`;
  }

  if (slot.id === "slot_mechanism_visible") {
    const mechanism = textAt(caseData, slot.sourceInCML);
    return `Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "${mechanism.substring(0, 140)}..."`;
  }

  if (slot.id === "slot_method_evidence") {
    const deathMethod = String(caseData.death_method ?? "").trim();
    const tellHints = deathMethodTellHints(deathMethod);
    return `Generate one essential EARLY clue giving a concrete, fair-play indicator of the manner of death (${deathMethod}) observable at the body-discovery scene — e.g. ${tellHints.examples}. Do NOT name or explain the concealment trick; only the physical tell a witness could see at the scene.`;
  }

  if (slot.sourceInCML === "CASE.discriminating_test.evidence_clues" || slot.id === "slot_discrim_evidence") {
    const dt = caseData.discriminating_test ?? {};
    const evidence = String(dt.design || dt.knowledge_revealed || "");
    const lead = slot.id === "slot_discrim_evidence"
      ? "Generate a clue"
      : `Generate the clue with id ${slot.id}, which the discriminating test cites,`;
    return `${lead} that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "${evidence.substring(0, 100)}..."`;
  }

  const culprits: string[] = Array.isArray(caseData.culpability?.culprits) ? caseData.culpability.culprits : [];
  const cast: Array<Record<string, any>> = Array.isArray(caseData.cast) ? caseData.cast : [];

  if (slot.id.startsWith("slot_culprit_direct_")) {
    const name = culprits.find((c) => `slot_culprit_direct_${slug(c)}` === slot.id) ?? culprits[0] ?? "the culprit";
    return `Generate one essential mid-story clue whose description or pointsTo explicitly names ${name} and states the unique trace, preparation detail, or mechanism link that points to ${name} rather than any non-culprit.`;
  }

  if (slot.id.startsWith("slot_eliminate_")) {
    const name = cast.find((c) => c?.name && `slot_eliminate_${slug(c.name)}` === slot.id)?.name ?? slot.keyTerms[0] ?? "this suspect";
    return `Generate a clue that explicitly eliminates suspect ${name} using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates ${name} because ...").`;
  }

  if (slot.id === "slot_flaw") {
    const flaw = textAt(caseData, slot.sourceInCML);
    const accused = String(caseData.false_solution?.accused_suspect ?? "").trim();
    return `Generate one essential mid-story clue that the false solution cannot explain${accused ? ` — the flaw in the case against ${accused}` : ""}. It must be reader-visible before the discriminating test: "${flaw.substring(0, 140)}..."`;
  }

  if (slot.id === "slot_clincher") {
    const source = textAt(caseData, slot.sourceInCML);
    const culprit = culprits[0] ?? "the culprit";
    return `Generate one essential EARLY clue that is the clincher — the one physical trace that ties ${culprit} to the act, planted well before the reveal relies on it: "${source.substring(0, 140)}..."`;
  }

  // A slot kind added to clue-spec after this projection: still one requirement per slot, never dropped.
  const text = textAt(caseData, slot.sourceInCML);
  return `Generate one ${slot.criticality} ${slot.evidenceType} clue rendering ${slot.sourceInCML}${text ? `: "${text.substring(0, 140)}..."` : "."}`;
}

/** One checklist line per `deriveClueSpec(cml).clueSlots` entry, in slot order. Red-herring slots are not
 *  clue requirements — the red-herring section owns them — so they are not projected. */
export function buildClueSpecChecklist(cml: unknown): ClueSpecChecklistLine[] {
  const caseData = caseOf(cml);
  return deriveClueSpec(cml).clueSlots.map((slot) => ({
    slotId: slot.id,
    sourceInCML: slot.sourceInCML,
    requirement: requirementFor(slot, caseData),
    evidenceType: slot.evidenceType,
    criticality: slot.criticality,
    suggestedPlacement: slot.suggestedPlacement,
    category: slot.category,
    supportsInferenceStep: slot.supportsInferenceStep,
    keyTerms: slot.keyTerms,
  }));
}
