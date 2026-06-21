/**
 * Timeline / alibi consistency engine (§4.3 engine 1).
 *
 * Decides the cheap structural facts: the crime window is non-empty, and no person is placed in
 * two different locations during overlapping intervals. Interval arithmetic — sub-millisecond,
 * deterministic, no opinions.
 */

import type { PresenceObservation, TimelineResult, TypedCml } from "../types.js";
import { capabilityClues, fmtInterval, intervalsOverlap, presenceClues } from "../util.js";

export function checkTimeline(cml: TypedCml): TimelineResult {
  const violations: string[] = [];

  if (cml.crime.window.end < cml.crime.window.start) {
    violations.push(
      `crime window is empty (start ${cml.crime.window.start} > end ${cml.crime.window.end}).`,
    );
  }

  const byPerson = new Map<string, PresenceObservation[]>();
  for (const fact of presenceClues(cml.clues)) {
    const list = byPerson.get(fact.person) ?? [];
    list.push(fact);
    byPerson.set(fact.person, list);
  }

  for (const [person, facts] of byPerson) {
    for (let i = 0; i < facts.length; i++) {
      for (let j = i + 1; j < facts.length; j++) {
        if (
          facts[i].location !== facts[j].location &&
          intervalsOverlap(facts[i].interval, facts[j].interval)
        ) {
          violations.push(
            `${person} is in two places at once: ${facts[i].location} ${fmtInterval(facts[i].interval)} ` +
              `and ${facts[j].location} ${fmtInterval(facts[j].interval)}.`,
          );
        }
      }
    }
  }

  // A person cannot both have and lack the same capability.
  const capByPerson = new Map<string, Map<string, Set<boolean>>>();
  for (const c of capabilityClues(cml.clues)) {
    const perCap = capByPerson.get(c.person) ?? new Map<string, Set<boolean>>();
    const vals = perCap.get(c.capability) ?? new Set<boolean>();
    vals.add(c.has);
    perCap.set(c.capability, vals);
    capByPerson.set(c.person, perCap);
  }
  for (const [person, perCap] of capByPerson) {
    for (const [capability, vals] of perCap) {
      if (vals.has(true) && vals.has(false)) {
        violations.push(`${person} is shown both to have and to lack the capability "${capability}".`);
      }
    }
  }

  return { consistent: violations.length === 0, violations };
}
