#!/usr/bin/env node
/**
 * D2 — ARE THE DURATIONS THE FLOOR PRINTS ACTUALLY CONSISTENT WITH THE CASE'S CLOCKS?
 *
 * The 1907 read caught arithmetic the pipeline did not: "3:20 to 5:45 is 2h25, not 1h55". D2 was
 * opened on the theory that free prose lines like "It had taken twenty minutes in all" are never
 * verified against the case.
 *
 * But DURATION_VARIANTS interpolates the LOCKED FACT'S OWN VALUE - it does not invent a number. So
 * the real question is whether the registry's own duration agrees with the registry's own clocks,
 * which is what `buildTemporalSpine` computes. Measure before building: if the spine already closes
 * these, D2 is covered and should be recommended-against like B1.2 and A2's rewrite.
 */
import { readFileSync, readdirSync } from "node:fs";
import { buildTemporalSpine } from "./packages/cml/dist/temporal-spine.js";

let files = 0, withShape = 0;
const status = new Map();
const failures = [];
for (const f of readdirSync("apps/worker/logs")) {
  if (!f.startsWith("locked-facts-") || !f.endsWith(".json")) continue;
  let j; try { j = JSON.parse(readFileSync("apps/worker/logs/" + f, "utf8")); } catch { continue; }
  const registry = (j.registry ?? []).filter((r) => r && r.value);
  if (!registry.length) continue;
  files += 1;
  const spine = buildTemporalSpine(registry);
  const instants = spine?.instants ?? [];
  const durations = spine?.durations ?? [];
  if (instants.length < 2 || durations.length < 1) continue;
  withShape += 1;
  for (const d of spine.findings ?? []) {
    status.set(d.status, (status.get(d.status) ?? 0) + 1);
    if (d.status !== "closes") failures.push(`${j.runId}  ${d.id}: ${d.status}`);
  }
  if ((spine.findings ?? []).length === 0) status.set("no derivation evaluated", (status.get("no derivation evaluated") ?? 0) + 1);
}

console.log("\nD2 — duration-vs-clock arithmetic across the archived registries\n");
console.log("  locked-fact files                    : " + files);
console.log("  with the shape (>=2 clocks, >=1 duration): " + withShape);
console.log("\n  derivation status:");
for (const [k, v] of [...status.entries()].sort((a, b) => b[1] - a[1])) console.log("    " + k.padEnd(26) + v);
if (failures.length) {
  console.log("\n  NOT closing:");
  for (const x of failures.slice(0, 12)) console.log("    " + x);
}
