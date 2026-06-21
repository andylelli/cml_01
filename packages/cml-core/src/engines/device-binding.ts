/**
 * Device-binding checker (§4.4 of the Agent 3b redesign).
 *
 * Agent 3b chooses a hard-logic device; today it hands Agent 3 prose advice and NOTHING verifies the
 * produced CML actually honored it (the §3.2 / §4.4 "polite request, not a constraint" gap). This
 * checker closes that gap deterministically. Given the chosen device, the `grounding` block Agent 3
 * emits (device → CML elements), and the typed CML, it proves the map is real:
 *
 *   1. the grounding is about THIS device,
 *   2. the named discriminating test exists and discriminates on the device's *principle*
 *      (a timing device is resolved by correcting time, a spatial-routing one by proving access
 *      impossible, an identity/authority one by a unique-capability elimination),
 *   3. every required clue archetype is realized by a clue that actually exists, and
 *   4. the device's locked facts appear in the prose of the CML's clues.
 *
 * "Did the CML use the device" stops being unknowable and becomes a checked property — the §4.4
 * thesis (*logic is a proof; verify it with a checker, not another LLM*) applied to grounding.
 *
 * This is the redesign's "highest-value step" (§7.4): it works while 3b is still a standalone agent.
 * It is a *pure structural* check — the deeper semantic question ("does this discriminating test
 * truly discriminate on THIS principle, not merely use the right rule-kind") is the narrow LLM-judge
 * §9.6 leaves open. Here we verify the binding a deterministic checker CAN decide.
 */

import type { InferenceRule, TypedCml } from "../types.js";

/**
 * The projection of a chosen device that the binding checker needs. A device-library `DevicePattern`
 * is a structural superset of the fields read here — project one with {@link boundDeviceFromPattern}.
 * Kept local so the keystone core takes no build dependency on `@cml/device-library`: the device
 * travels in as a typed value, exactly the §4.4 "typed constraint object".
 */
export interface BoundDevice {
  /** The chosen device's id (a device-library `pattern_id`, or a per-run recombination id). */
  deviceId: string;
  /** Mechanism family — selects which inference rule the discriminating test must use. */
  family: string;
  /** CML axes the device can ground (informational; `family` drives the rule check). */
  axes: string[];
  /** Observable traces the device MUST leave — each needs a realizing clue in the CML (§4.4). */
  requiredClueArchetypes: string[];
  /** Concrete period-locked values (`clock_tamper = "forty minutes"`); each must appear in a clue. */
  lockedFacts?: string[];
}

/**
 * Project a device-library pattern (or any structurally-compatible record) into a {@link BoundDevice}.
 * The parameter is the structural subset of `DevicePattern` the checker reads, so callers can pass a
 * real `DevicePattern` directly without `@cml/cml-core` importing the device-library package.
 */
export function boundDeviceFromPattern(
  pattern: { pattern_id: string; family: string; axes: string[]; clue_archetypes: string[] },
  lockedFacts: string[] = [],
): BoundDevice {
  return {
    deviceId: pattern.pattern_id,
    family: pattern.family,
    axes: [...pattern.axes],
    requiredClueArchetypes: [...pattern.clue_archetypes],
    lockedFacts: lockedFacts.length ? [...lockedFacts] : undefined,
  };
}

/**
 * Agent 3's grounding block: the asserted map from the chosen device to the CML elements that
 * realize it (§4.4). The checker verifies the assertion rather than trusting it.
 */
export interface GroundingMap {
  /** Must equal the chosen device's id, or the CML grounded on a different device. */
  deviceId: string;
  /** Id of the inference edge that resolves the device's illusion (the "discriminating test"). */
  discriminatingTestEdgeId: string;
  /** device archetype → the id of the clue (observation) that realizes it. */
  clueRealizations: Array<{ archetype: string; clueId: string }>;
}

export interface DeviceBindingResult {
  deviceId: string;
  /** true ⇔ every binding check below passes. The single property §4.4 makes provable. */
  honored: boolean;
  /** The grounding map names a different device than the one chosen. */
  deviceMismatch: boolean;
  /** The named discriminating-test edge is absent from the inference path. */
  missingDiscriminatingTest: boolean;
  /** The discriminating-test edge exists but its rule doesn't discriminate on this family. */
  discriminatingTestWrongRule?: { edgeId: string; rule: InferenceRule; expected: InferenceRule[] };
  /** Required clue archetypes with no realizing clue (a dropped trace — the run is steered, §9.4). */
  unrealizedArchetypes: string[];
  /** Clue ids the grounding map references that don't exist in the CML. */
  danglingClueRefs: string[];
  /** Locked facts that don't appear in the prose of any clue. */
  missingLockedFacts: string[];
  /** Human-readable diagnosis of every failed check (empty ⇔ honored). */
  reasons: string[];
}

/**
 * Which inference rules legitimately "discriminate on" a given mechanism family. A timing device is
 * resolved by correcting the time; a spatial-routing device by proving access impossible; an
 * identity/authority/behavioral device by a unique-capability (or alibi) elimination.
 */
const FAMILY_DISCRIMINATING_RULES: Record<string, InferenceRule[]> = {
  timing: ["time_correction"],
  spatial_routing: ["access_impossible"],
  identity: ["unique_capability"],
  authority: ["unique_capability"],
  behavioral: ["unique_capability", "alibi_contradiction"],
};

export function checkDeviceBinding(
  cml: TypedCml,
  device: BoundDevice,
  grounding: GroundingMap,
): DeviceBindingResult {
  const reasons: string[] = [];

  // 1. The grounding map must be about THIS device.
  const deviceMismatch = grounding.deviceId !== device.deviceId;
  if (deviceMismatch) {
    reasons.push(`grounding names device "${grounding.deviceId}" but the chosen device is "${device.deviceId}".`);
  }

  // 2. The named discriminating test must exist and discriminate on the device's principle.
  const edge = cml.inferencePath.find((e) => e.id === grounding.discriminatingTestEdgeId);
  let missingDiscriminatingTest = false;
  let discriminatingTestWrongRule: DeviceBindingResult["discriminatingTestWrongRule"];
  if (!edge) {
    missingDiscriminatingTest = true;
    reasons.push(`discriminating test "${grounding.discriminatingTestEdgeId}" is not in the inference path.`);
  } else {
    const expected = FAMILY_DISCRIMINATING_RULES[device.family] ?? [];
    if (!expected.includes(edge.rule)) {
      discriminatingTestWrongRule = { edgeId: edge.id, rule: edge.rule, expected };
      reasons.push(
        `discriminating test "${edge.id}" uses rule "${edge.rule}", which does not discriminate on a ` +
          `${device.family} device (expected ${expected.join(" | ") || "—"}).`,
      );
    }
  }

  // 3. Every required clue archetype must be mapped to a clue that actually exists in the CML.
  const clueIds = new Set(cml.clues.map((c) => c.id));
  const realizedArchetypes = new Set<string>();
  const danglingClueRefs: string[] = [];
  for (const { archetype, clueId } of grounding.clueRealizations) {
    if (!clueIds.has(clueId)) {
      danglingClueRefs.push(clueId);
      continue; // a dangling ref cannot realize its archetype
    }
    realizedArchetypes.add(archetype);
  }
  const unrealizedArchetypes = device.requiredClueArchetypes.filter((a) => !realizedArchetypes.has(a));
  for (const a of unrealizedArchetypes) reasons.push(`required clue archetype "${a}" has no realizing clue.`);
  for (const c of danglingClueRefs) reasons.push(`grounding maps to clue "${c}" which is not in the CML.`);

  // 4. Every locked fact must appear in the prose of some clue (present + consistent).
  const haystack = cml.clues.map((c) => c.worded.toLowerCase());
  const missingLockedFacts = (device.lockedFacts ?? []).filter(
    (fact) => !haystack.some((w) => w.includes(fact.toLowerCase())),
  );
  for (const f of missingLockedFacts) reasons.push(`locked fact "${f}" does not appear in any clue.`);

  const honored =
    !deviceMismatch &&
    !missingDiscriminatingTest &&
    !discriminatingTestWrongRule &&
    unrealizedArchetypes.length === 0 &&
    danglingClueRefs.length === 0 &&
    missingLockedFacts.length === 0;

  return {
    deviceId: device.deviceId,
    honored,
    deviceMismatch,
    missingDiscriminatingTest,
    discriminatingTestWrongRule,
    unrealizedArchetypes,
    danglingClueRefs,
    missingLockedFacts,
    reasons,
  };
}
