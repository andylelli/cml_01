/**
 * Device library — deterministic feasibility gate (Agent 3b redesign §4.3 / §9.4).
 *
 * The core fix the current pipeline lacks: confirm a mechanism is actually possible in the story's
 * era BEFORE it grounds the proof. A device is feasible iff:
 *   - every capability it REQUIRES is available in the era (no DNA/CCTV/phone-records in 1931), and
 *   - no capability it FORBIDS is available in the era (else the era defeats the trick), and
 *   - it doesn't require something it also forbids (a malformed pattern).
 *
 * Pure and deterministic; the era oracle is injected (`makeStubOracle`, or period-kb later).
 */

import type { DevicePattern, EraCapabilityOracle, FeasibilityResult } from "./types.js";

export function checkFeasibility(pattern: DevicePattern, oracle: EraCapabilityOracle): FeasibilityResult {
  const { requires, forbids } = pattern.feasibility;

  const missingRequires = requires.filter((c) => !oracle.isAvailable(c));
  const defeatedByEra = forbids.filter((c) => oracle.isAvailable(c));
  const internalConflicts = requires.filter((c) => forbids.includes(c));

  const feasible = missingRequires.length === 0 && defeatedByEra.length === 0 && internalConflicts.length === 0;

  let reason: string;
  if (feasible) {
    reason = `feasible: all ${requires.length} required capabilit${requires.length === 1 ? "y is" : "ies are"} available and no forbidden capability is present.`;
  } else {
    const parts: string[] = [];
    if (missingRequires.length) parts.push(`era lacks required: ${missingRequires.join(", ")}`);
    if (defeatedByEra.length) parts.push(`era defeats the trick (provides forbidden): ${defeatedByEra.join(", ")}`);
    if (internalConflicts.length) parts.push(`pattern both requires and forbids: ${internalConflicts.join(", ")}`);
    reason = `infeasible — ${parts.join("; ")}.`;
  }

  return { feasible, missingRequires, defeatedByEra, internalConflicts, reason };
}
