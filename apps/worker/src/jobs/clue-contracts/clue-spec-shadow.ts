/**
 * Agent 5 clue-spec shadow (10_agent_5_clues_red_herrings.md §4.1 / §9.1). Moved from mystery-orchestrator.ts
 * (A5-15 / A5-Q07, 2026-10-02) so the orchestrator does not grow.
 *
 * deriveClueSpec computes the AUTHORITATIVE required-clue set from the frozen CML (the redesign's
 * "coverage is constructed, not audited"). In shadow it logs how many of Agent 5's shipped clues map
 * to a derived slot — the §9.1 coverage signal — and, since A5-Q07, which required slots NO shipped clue
 * covers. It never changes the live clue set or any prompt (promotion waits for the A7-Q05 read). Never
 * throws. Set AGENT5_DERIVE_SHADOW=0 to silence.
 */
import { deriveClueSpec, type ClueSlot } from "@cml/clue-spec";

const stripCase = (s: unknown): string => String(s ?? "").replace(/^CASE\./i, "").trim();
const stepEvidenceKey = (step: unknown, evidenceType: unknown): string =>
  step != null && evidenceType ? `${step}:${evidenceType}` : "";

/**
 * A5-Q07: the required slots no shipped clue covers. A slot is covered by a clue on the same match the
 * mapped-clue count uses, read from the slot's side: same id, same CML source path, or same
 * (inference step, evidence type).
 */
export function uncoveredClueSpecSlots(slots: ClueSlot[], shipped: any[]): ClueSlot[] {
  const ids = new Set(shipped.map((c) => String(c?.id ?? "")).filter(Boolean));
  const sources = new Set(shipped.map((c) => stripCase(c?.sourceInCML)).filter(Boolean));
  const stepEv = new Set(shipped.map((c) => stepEvidenceKey(c?.supportsInferenceStep, c?.evidenceType)).filter(Boolean));
  return slots.filter((slot) => {
    if (ids.has(slot.id)) return false;
    const src = stripCase(slot.sourceInCML);
    if (src && sources.has(src)) return false;
    const key = stepEvidenceKey(slot.supportsInferenceStep, slot.evidenceType);
    return !(key && stepEv.has(key));
  });
}

export function runClueSpecShadow(args: { cml: unknown; clues: unknown; warnings: string[] }): void {
  if (/^(0|false|no|off)$/i.test(process.env.AGENT5_DERIVE_SHADOW ?? "")) return; // default on
  try {
    const caseData = (args.cml as any)?.CASE ?? args.cml;
    const spec = deriveClueSpec(caseData);
    const shipped = ((args.clues as any)?.clues ?? []) as any[];
    const derivedIds = new Set(spec.clueSlots.map((s) => s.id));
    const derivedSources = new Set(spec.clueSlots.map((s) => stripCase(s.sourceInCML)));
    const derivedStepEv = new Set(
      spec.clueSlots.filter((s) => s.supportsInferenceStep != null).map((s) => `${s.supportsInferenceStep}:${s.evidenceType}`),
    );
    let covered = 0;
    for (const c of shipped) {
      const src = stripCase(c?.sourceInCML);
      const stepEv = c?.supportsInferenceStep != null && c?.evidenceType ? `${c.supportsInferenceStep}:${c.evidenceType}` : "";
      if (derivedIds.has(c?.id) || (src && derivedSources.has(src)) || (stepEv && derivedStepEv.has(stepEv))) covered++;
    }
    const pct = shipped.length ? Math.round((100 * covered) / shipped.length) : 0;
    console.info(
      `[Agent 5 clue-spec shadow] deriveClueSpec: ${spec.clueSlots.length} required slots + ${spec.redHerringSlots.length} red-herring slots; ` +
        `${shipped.length} shipped clues, ${covered}/${shipped.length} (${pct}%) map to a derived slot.`,
    );
    args.warnings.push(`Clue-spec (shadow): ${spec.clueSlots.length} required slots; ${pct}% of shipped clues map to one.`);

    // A5-Q07 — the other direction: required slots no shipped clue covers. One line, always written (an
    // empty list is a measurement too).
    const uncovered = uncoveredClueSpecSlots(spec.clueSlots, shipped);
    const shown = uncovered
      .slice(0, 12)
      .map((s) => `${s.id} (${stripCase(s.sourceInCML)}${s.supportsInferenceStep != null ? `, step ${s.supportsInferenceStep}` : ""}, ${s.evidenceType})`);
    const line =
      `[clue-spec shadow] uncovered: ${uncovered.length}/${spec.clueSlots.length} required slots` +
      (uncovered.length > 0 ? ` — ${shown.join("; ")}${uncovered.length > shown.length ? `; +${uncovered.length - shown.length} more` : ""}` : "");
    console.info(line);
    args.warnings.push(line);
  } catch (e) {
    args.warnings.push(`Clue-spec shadow skipped: ${e instanceof Error ? e.message : String(e)}`);
  }
}
