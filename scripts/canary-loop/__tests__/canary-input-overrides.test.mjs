import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { loadCanaryInputOverrides } from "../canary-input-overrides.mjs";

async function makeTempWorkspace() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "cml-canary-inputs-"));
  await fs.mkdir(path.join(root, "scripts", "canary-loop"), { recursive: true });
  return root;
}

test("loadCanaryInputOverrides uses canary-core-inputs as baseline", async () => {
  const workspaceRoot = await makeTempWorkspace();
  const corePath = path.join(workspaceRoot, "scripts", "canary-core-inputs.yaml");
  await fs.writeFile(
    corePath,
    [
      'theme: "Baseline Theme"',
      "targetLength: short",
      "primaryAxis: behavioral",
      "castSize: 4",
    ].join("\n"),
    "utf8"
  );

  const previousCorePath = process.env.CANARY_CORE_INPUTS_YAML;
  const previousQuickRun = process.env.CANARY_QUICK_RUN;
  const previousQuickRunPath = process.env.CANARY_QUICKRUN_REQUEST_YAML;

  try {
    delete process.env.CANARY_CORE_INPUTS_YAML;
    process.env.CANARY_QUICK_RUN = "false";
    delete process.env.CANARY_QUICKRUN_REQUEST_YAML;

    const result = await loadCanaryInputOverrides({ workspaceRoot, quickRun: false });
    assert.equal(result.inputs.theme, "Baseline Theme");
    assert.equal(result.inputs.targetLength, "short");
    assert.equal(result.inputs.primaryAxis, "psychological");
    assert.equal(result.inputs.castSize, 4);
    assert.equal(result.sources.quickRunEnabled, false);
  } finally {
    if (previousCorePath === undefined) delete process.env.CANARY_CORE_INPUTS_YAML;
    else process.env.CANARY_CORE_INPUTS_YAML = previousCorePath;
    if (previousQuickRun === undefined) delete process.env.CANARY_QUICK_RUN;
    else process.env.CANARY_QUICK_RUN = previousQuickRun;
    if (previousQuickRunPath === undefined) delete process.env.CANARY_QUICKRUN_REQUEST_YAML;
    else process.env.CANARY_QUICKRUN_REQUEST_YAML = previousQuickRunPath;
  }
});

test("quickrun request overrides canary-core baseline inputs", async () => {
  const workspaceRoot = await makeTempWorkspace();
  const corePath = path.join(workspaceRoot, "scripts", "canary-core-inputs.yaml");
  const quickPath = path.join(workspaceRoot, "scripts", "canary-loop", "request.quickrun.rework.yaml");

  await fs.writeFile(
    corePath,
    [
      'theme: "Baseline Theme"',
      "targetLength: short",
      "narrativeStyle: classic",
      "proseBatchSize: 1",
    ].join("\n"),
    "utf8"
  );

  await fs.writeFile(
    quickPath,
    [
      "quickRun: true",
      "canaryInputOverrides:",
      "  targetLength: long",
      "  narrativeStyle: atmospheric",
      "  proseBatchSize: 3",
    ].join("\n"),
    "utf8"
  );

  const previousCorePath = process.env.CANARY_CORE_INPUTS_YAML;
  const previousQuickRun = process.env.CANARY_QUICK_RUN;
  const previousQuickRunPath = process.env.CANARY_QUICKRUN_REQUEST_YAML;

  try {
    delete process.env.CANARY_CORE_INPUTS_YAML;
    process.env.CANARY_QUICK_RUN = "true";
    process.env.CANARY_QUICKRUN_REQUEST_YAML = quickPath;

    const result = await loadCanaryInputOverrides({ workspaceRoot, quickRun: true });
    assert.equal(result.inputs.theme, "Baseline Theme");
    assert.equal(result.inputs.targetLength, "long");
    assert.equal(result.inputs.narrativeStyle, "atmospheric");
    assert.equal(result.inputs.proseBatchSize, 3);
    assert.equal(result.sources.quickRunEnabled, true);
    assert.equal(result.sources.quickRunRequestPath, quickPath);
  } finally {
    if (previousCorePath === undefined) delete process.env.CANARY_CORE_INPUTS_YAML;
    else process.env.CANARY_CORE_INPUTS_YAML = previousCorePath;
    if (previousQuickRun === undefined) delete process.env.CANARY_QUICK_RUN;
    else process.env.CANARY_QUICK_RUN = previousQuickRun;
    if (previousQuickRunPath === undefined) delete process.env.CANARY_QUICKRUN_REQUEST_YAML;
    else process.env.CANARY_QUICKRUN_REQUEST_YAML = previousQuickRunPath;
  }
});
