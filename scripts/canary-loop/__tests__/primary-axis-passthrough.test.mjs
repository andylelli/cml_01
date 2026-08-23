/**
 * The axis a run asks for must be the axis the agents receive. Nothing may re-spell it in between.
 *
 * WHAT THIS EXISTS TO STOP COMING BACK. `canary-input-overrides.mjs` carried a reverse alias map:
 *
 *     PRIMARY_AXIS_ALIAS_MAP = { identity: "social", behavioral: "psychological", authority: "mechanical" }
 *
 * It rewrote the canonical five INTO the retired spellings on the way in, one file away from
 * `canary-core-inputs.yaml`'s own comment asserting that no such mapping exists (that comment checked
 * `canary-core.mjs`, which indeed has no reference to primaryAxis — the map was in the loader it calls).
 *
 * Measured end to end on 2026-08-21, against the live `normalizePrimaryAxis`:
 *
 *     yaml says     loader emitted    agent received
 *     identity   -> social         -> authority      <- a different kind of mystery, silently
 *     authority  -> mechanical     -> THROWS         <- X70 made "mechanical" fatal; the run dies
 *     behavioral -> psychological  -> behavioral     <- correct only by coincidence
 *
 * One of the three axes X70 was supposed to unlock actually worked. A live run requesting `identity`
 * produced an `authority` case, and no artifact recorded the substitution.
 *
 * AND IT EXPLAINS THE CORPUS. Before X70, `normalizePrimaryAxis` ended `default: return "temporal"`, so
 * every spelling this map produced collapsed to temporal — the actual reason **23 of 23 archived cases
 * are temporal**. X70 removed the downstream default and left the upstream translation, so the coercion
 * outlived its own fix and only changed destination. A test at either end alone would have passed:
 * the loader round-tripped its own vocabulary, and the normaliser was correct for every input it was
 * given. Only the two composed are wrong, which is why this test spans both.
 *
 * THE RULE: the axis vocabulary has exactly one owner (`normalizePrimaryAxis`, which accepts the
 * canonical five and the retired spellings). Anything that rewrites the vocabulary before the owner
 * sees it is the one-vocabulary-two-places defect this codebase keeps producing.
 */

import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { loadCanaryInputOverrides } from "../canary-input-overrides.mjs";
import { normalizePrimaryAxis } from "../../../apps/worker/dist/jobs/agents/shared.js";

const AXES = ["temporal", "spatial", "identity", "behavioral", "authority"];
const ROOT = process.cwd();

/** A minimal inputs file — `theme` is the only field the loader requires. */
const configFor = (axis) => {
  const dir = mkdtempSync(join(tmpdir(), "axis-passthrough-"));
  const path = join(dir, "inputs.yaml");
  writeFileSync(path, `theme: "A closed-circle murder."\nprimaryAxis: ${axis}\n`, "utf8");
  return path;
};

const axisReaching = async (axis) => {
  process.env.CANARY_CORE_INPUTS_YAML = configFor(axis);
  const cfg = await loadCanaryInputOverrides({ workspaceRoot: ROOT });
  // The second hop: what the orchestrator hands every agent.
  return normalizePrimaryAxis(cfg.inputs.primaryAxis, () => {});
};

for (const axis of AXES) {
  test(`primaryAxis "${axis}" survives the loader and the normaliser unchanged`, async () => {
    assert.equal(await axisReaching(axis), axis);
  });
}

test("the loader does not re-spell the axis it was given", async () => {
  // The narrower half: even before normalisation, the value must be what the file said. This is the
  // assertion the removed map broke, and the one a loader-only test would have caught.
  for (const axis of AXES) {
    process.env.CANARY_CORE_INPUTS_YAML = configFor(axis);
    const cfg = await loadCanaryInputOverrides({ workspaceRoot: ROOT });
    assert.equal(cfg.inputs.primaryAxis, axis, `loader rewrote "${axis}" to "${cfg.inputs.primaryAxis}"`);
  }
});

test("all five axes land on five DISTINCT values", async () => {
  // The property the corpus violated for 23 runs. Any collapse — to temporal, or of identity onto
  // authority — shows up here as a duplicate, whatever the mechanism.
  const reached = [];
  for (const axis of AXES) reached.push(await axisReaching(axis));
  assert.equal(new Set(reached).size, AXES.length, `axes collapsed: ${reached.join(", ")}`);
});

test("an unrecognised axis throws rather than being quietly rewritten", async () => {
  // "mechanical" is the case that matters: it used to mean identity, which is a different book.
  process.env.CANARY_CORE_INPUTS_YAML = configFor("mechanical");
  const cfg = await loadCanaryInputOverrides({ workspaceRoot: ROOT });
  assert.equal(cfg.inputs.primaryAxis, "mechanical", "the loader must pass it through, not repair it");
  assert.throws(() => normalizePrimaryAxis(cfg.inputs.primaryAxis, () => {}));
});
