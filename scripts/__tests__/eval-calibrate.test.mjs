/**
 * R7 — tests for the calibration instrument.
 *
 * This tool decides whether every A/B verdict drawn from an internal delta is trustworthy, so its
 * own arithmetic has to be. Run against the real CLI rather than imported helpers: the failure this
 * project keeps paying for is a component that is right in isolation and wrong once wired.
 */

import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("../eval-calibrate.mjs", import.meta.url));
const workDir = mkdtempSync(join(tmpdir(), "cml-calibrate-"));
after(() => rmSync(workDir, { recursive: true, force: true }));

let seq = 0;
const run = (rows, extraArgs = []) => {
  const id = `${seq++}`;
  const manifest = join(workDir, `m-${id}.json`);
  const out = join(workDir, `out-${id}.json`);
  writeFileSync(manifest, JSON.stringify(rows), "utf8");
  let status = 0;
  let stdout = "";
  try {
    stdout = execFileSync(process.execPath, [SCRIPT, "--manifest", manifest, "--out", out, ...extraArgs], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    status = error.status ?? 1;
    stdout = `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }
  let result = null;
  try {
    result = JSON.parse(readFileSync(out, "utf8"));
  } catch {
    /* no output written — expected on the refusal paths */
  }
  return { status, stdout, result };
};

/** n scores, judge shifted by `bias`, order preserved. */
const aligned = (externals, bias = -9) =>
  externals.map((e, i) => ({ bundleId: `b${i}`, internalFinal: e + bias, externalFinal: e }));

describe("eval-calibrate", () => {
  it("REFUSES a verdict below the minimum n, and writes nothing", () => {
    const { status, stdout, result } = run(aligned([80, 70]));
    assert.equal(status, 1, "must exit non-zero so a thin sample cannot pass a gate");
    assert.match(stdout, /NOT ENOUGH DATA/);
    assert.equal(result, null, "no calibration record may be written from an under-powered sample");
  });

  it("ignores unlabelled rows rather than scoring them as zero", () => {
    const rows = [...aligned([82, 76, 71, 68, 64, 60]), { bundleId: "x", internalFinal: 70, externalFinal: null }];
    const { result } = run(rows);
    assert.equal(result.n, 6);
  });

  it("reports a constant offset as CALIBRATED with a usable offset", () => {
    const { result } = run(aligned([82, 76, 71, 68, 64, 60, 58], -9));
    assert.equal(result.calibrated, true);
    assert.equal(result.ranking.agreement, 1);
    assert.equal(result.bias, -9);
    assert.equal(result.spread, 0);
    assert.equal(result.offsetUsable, true);
  });

  it("condemns a judge that scrambles the ORDER even when its mean looks fine", () => {
    // Deliberately near-zero mean bias, ordering destroyed — the case an absolute-agreement metric
    // would wave through and every A/B in this project would then trust.
    const externals = [82, 76, 71, 68, 64, 60, 58];
    const scrambled = [60, 82, 58, 76, 68, 71, 64];
    const rows = externals.map((e, i) => ({ bundleId: `b${i}`, internalFinal: scrambled[i], externalFinal: e }));
    const { result } = run(rows);
    assert.equal(result.calibrated, false);
    assert.ok(result.ranking.agreement < 0.85);
    assert.equal(result.offsetUsable, false, "an erratic judge cannot be corrected by subtraction");
  });

  it("does not count pairs the HUMAN scored as a tie", () => {
    // Two stories one mark apart: the ground truth does not separate them, so neither judge answer
    // is adjudicable and the pair must not enter the denominator.
    const rows = aligned([82, 76, 71, 68, 64, 60]);
    rows.push({ bundleId: "tie", internalFinal: 90, externalFinal: 82.5 });
    const { result } = run(rows);
    assert.ok(result.ranking.ties >= 1);
    assert.equal(
      result.ranking.concordant + result.ranking.discordant + result.ranking.ties,
      (rows.length * (rows.length - 1)) / 2,
      "every pair must be accounted for exactly once",
    );
  });

  it("does not count pairs the JUDGE scored level against it", () => {
    // A judge that scores two stories equal has made no ordering claim. Marking that discordant
    // punishes it for declining to guess — the opposite of the behaviour we want. Two rows share an
    // internal mark while the human separates them.
    const rows = [
      ...aligned([82, 76, 71, 68, 64, 60]),
      { bundleId: "levelA", internalFinal: 55, externalFinal: 70 },
      { bundleId: "levelB", internalFinal: 55, externalFinal: 64 },
    ];
    const { result } = run(rows);
    assert.ok(result.ranking.ties >= 1, "the judge's own tie must land in ties, not discordant");
    assert.equal(
      result.ranking.concordant + result.ranking.discordant + result.ranking.ties,
      (rows.length * (rows.length - 1)) / 2,
    );
  });

  it("locates disagreement per category, ranked by magnitude", () => {
    const rows = aligned([82, 76, 71, 68, 64, 60]).map((r) => ({
      ...r,
      internalCategories: { prose: 5, clues: 5, ending: 7 },
      externalCategories: { prose: 8, clues: 6, ending: 7 },
    }));
    const { result } = run(rows);
    assert.equal(result.perCategory.prose.bias, -3);
    assert.equal(result.perCategory.clues.bias, -1);
    assert.equal(result.perCategory.ending.bias, 0);
  });

  it("honours --min-n", () => {
    assert.equal(run(aligned([82, 76, 71, 68, 64, 60]), ["--min-n", "10"]).status, 1);
  });
});
