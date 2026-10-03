/**
 * Deterministic clue guardrails (Agents 5 and 6).
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type { CaseData } from "@cml/cml";
import type {
  ClueDistributionResult,
} from "@cml/prompts-llm";
import { checkPointsToDistinctness } from "@cml/prompts-llm";

export type ClueGuardrailIssue = {
  severity: "critical" | "warning";
  message: string;
};

export interface InferenceCoverageResult {
  issues: ClueGuardrailIssue[];
  coverageMap: Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>;
  uncoveredSteps: number[];
  hasCriticalGaps: boolean;
}

// ============================================================================
// Clue guardrail helpers — shared by Agent 5 and Agent 6 run files
// ============================================================================

const getCaseQualityControls = (cml: CaseData) => {
  const legacy = cml as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  return cmlCase.quality_controls?.clue_visibility_requirements ?? {};
};

const normalizeClueTimeline = (clues: ClueDistributionResult) => {
  clues.clueTimeline = {
    early: clues.clues.filter((c) => c.placement === "early").map((c) => c.id),
    mid: clues.clues.filter((c) => c.placement === "mid").map((c) => c.id),
    late: clues.clues.filter((c) => c.placement === "late").map((c) => c.id),
  };
};

export const applyClueGuardrails = (cml: CaseData, clues: ClueDistributionResult) => {
  const requirements = getCaseQualityControls(cml);
  const issues: ClueGuardrailIssue[] = [];
  const fixes: string[] = [];

  const essential = clues.clues.filter((c) => c.criticality === "essential");
  const essentialMin = Number(requirements?.essential_clues_min ?? 3);

  if (essential.length < essentialMin) {
    issues.push({
      severity: "critical",
      message: `Essential clue count ${essential.length} is below required minimum ${essentialMin}`,
    });
  }

  const essentialLate = essential.filter((c) => c.placement === "late");
  if (essentialLate.length > 0) {
    essentialLate.forEach((clue, index) => {
      clue.placement = index % 2 === 0 ? "mid" : "early";
    });
    fixes.push(`Repositioned ${essentialLate.length} essential clue(s) from late to early/mid placement`);
  }

  const earlyMin = Number(requirements?.early_clues_min ?? 1);
  const midMin = Number(requirements?.mid_clues_min ?? 1);
  const lateMin = Number(requirements?.late_clues_min ?? 1);

  const counts = {
    early: clues.clues.filter((c) => c.placement === "early").length,
    mid: clues.clues.filter((c) => c.placement === "mid").length,
    late: clues.clues.filter((c) => c.placement === "late").length,
  };

  if (counts.early < earlyMin) {
    issues.push({
      severity: "critical",
      message: `Early clue count ${counts.early} is below required minimum ${earlyMin}`,
    });
  }
  if (counts.mid < midMin) {
    issues.push({
      severity: "critical",
      message: `Mid clue count ${counts.mid} is below required minimum ${midMin}`,
    });
  }
  if (counts.late < lateMin) {
    issues.push({
      severity: "warning",
      message: `Late clue count ${counts.late} is below preferred minimum ${lateMin}`,
    });
  }

  const detectiveOnlyPattern = /(detective[-\s]?only|only\s+the\s+detective|private\s+insight|withheld\s+from\s+reader)/i;
  const detectiveOnlyClues = clues.clues.filter(
    (c) => detectiveOnlyPattern.test(c.description) || detectiveOnlyPattern.test(c.pointsTo),
  );

  if (detectiveOnlyClues.length > 0) {
    issues.push({
      severity: "critical",
      message: `Detected ${detectiveOnlyClues.length} clue(s) implying detective-only/private information`,
    });
  }

  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const clue of clues.clues) {
    if (seenIds.has(clue.id)) {
      duplicateIds.add(clue.id);
    }
    seenIds.add(clue.id);
  }
  if (duplicateIds.size > 0) {
    issues.push({
      severity: "critical",
      message: `Duplicate clue IDs detected: ${Array.from(duplicateIds).join(", ")}`,
    });
  }

  // A_56 5-A (P1.2 distinctness): no two SOLVING clues should resolve to the SAME implication —
  // redundant "points to X" essentials are a top cause of a flabby, repetitive middle. Repair-not-abort:
  // when a collision group has >1 essential clue, keep ONE as the anchor and DEMOTE the extras to
  // "supporting" (never delete the clue; never drop the total essential count below the required
  // minimum). Holistic — keyed off `pointsTo` only, no story-specific terms. Groups with a single
  // essential (one essential + supporting echoes) are left untouched; only redundant essentials demote.
  const distinct = checkPointsToDistinctness(clues.clues);
  if (!distinct.ok) {
    const byId = new Map(clues.clues.map((c) => [c.id, c]));
    let essentialCount = clues.clues.filter((c) => c.criticality === "essential").length;
    let demoted = 0;
    for (const collision of distinct.collisions) {
      const essentialsInGroup = collision.clueIds
        .map((id) => byId.get(id))
        .filter((c): c is NonNullable<typeof c> => !!c && c.criticality === "essential");
      // Keep essentialsInGroup[0] as the anchor; demote the rest while the minimum is preserved.
      for (let i = 1; i < essentialsInGroup.length; i++) {
        if (essentialCount <= essentialMin) break;
        essentialsInGroup[i].criticality = "supporting";
        essentialCount -= 1;
        demoted += 1;
      }
    }
    if (demoted > 0) {
      fixes.push(
        `Demoted ${demoted} redundant essential clue(s) to supporting (P1.2 distinctness — shared "points to" implication)`,
      );
    }
    issues.push({
      severity: "warning",
      message:
        `Detected ${distinct.collisions.length} clue group(s) sharing a 'points to' implication: ` +
        distinct.collisions.map((c) => `"${c.normalized}" (${c.clueIds.join(", ")})`).join("; "),
    });
  }

  normalizeClueTimeline(clues);

  return {
    issues,
    fixes,
    hasCriticalIssues: issues.some((i) => i.severity === "critical"),
  };
};
