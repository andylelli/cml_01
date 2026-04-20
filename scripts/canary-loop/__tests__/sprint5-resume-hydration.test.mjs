import test from "node:test";
import assert from "node:assert/strict";
import { buildHydrationBundle } from "../hydrate.mjs";
import {
  applyQuickRunPreset,
  buildDefaultRequest,
  shouldResetIterationAfterTerminalMajorRework,
} from "../controller.mjs";
import { parseJsonText, stripUtf8Bom } from "../json.mjs";

function makeArtifactBundle(records) {
  return {
    runId: "run_test_123",
    runFolder: "C:/tmp/run_test_123",
    runState: {
      records,
    },
  };
}

test("hydration bundle resolves required upstream artifacts for start boundary", () => {
  const artifactBundle = makeArtifactBundle([
    { sequence: 1, agent: "Agent1-SettingRefiner", responseFile: "01_a1_response.md" },
    { sequence: 2, agent: "Agent2-CastDesigner", responseFile: "02_a2_response.md" },
    { sequence: 3, agent: "Agent2e-BackgroundContext", responseFile: "03_a2e_response.md" },
    { sequence: 4, agent: "Agent3b-HardLogicDeviceGenerator", responseFile: "04_a3b_response.md" },
    { sequence: 5, agent: "Agent3-CMLGenerator", responseFile: "05_a3_response.md" },
  ]);

  const result = buildHydrationBundle({
    artifactBundle,
    startFromAgentCode: "5",
    selectedAgentCode: "5",
    hydratePriorFromRun: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.bundle.upstreamAgents.length, 5);
  assert.deepEqual(result.bundle.missingRequiredArtifacts, []);
});

test("hydration bundle fails when start boundary is downstream of selected agent", () => {
  const result = buildHydrationBundle({
    artifactBundle: makeArtifactBundle([]),
    startFromAgentCode: "6",
    selectedAgentCode: "5",
    hydratePriorFromRun: true,
  });

  assert.equal(result.ok, false);
  assert.match(result.errors[0], /downstream/i);
});

test("hydratePriorFromRun=false is rejected when upstream dependencies exist", () => {
  const result = buildHydrationBundle({
    artifactBundle: makeArtifactBundle([]),
    startFromAgentCode: "5",
    selectedAgentCode: "5",
    hydratePriorFromRun: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.errors[0], /unsupported/i);
});

test("legacy run layout downgrades missing 2b/2c/2d for downstream hydration", () => {
  const artifactBundle = makeArtifactBundle([
    { sequence: 1, agent: "Agent1-SettingRefiner", responseFile: "01_a1_response.md" },
    { sequence: 2, agent: "Agent2-CastDesigner", responseFile: "02_a2_response.md" },
    { sequence: 3, agent: "Agent2e-BackgroundContext", responseFile: "03_a2e_response.md" },
    { sequence: 4, agent: "Agent3b-HardLogicDeviceGenerator", responseFile: "04_a3b_response.md" },
    { sequence: 5, agent: "Agent3-CMLGenerator", responseFile: "05_a3_response.md" },
    { sequence: 6, agent: "Agent5-ClueExtraction", responseFile: "06_a5_response.md" },
    { sequence: 7, agent: "Agent6-FairPlay", responseFile: "07_a6_response.md" },
    { sequence: 8, agent: "Agent4-Revision", responseFile: "08_a4_response.md" },
  ]);

  const result = buildHydrationBundle({
    artifactBundle,
    startFromAgentCode: "7",
    selectedAgentCode: "7",
    hydratePriorFromRun: true,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.bundle.missingRequiredArtifacts, []);
  assert.match(result.warnings[0], /Legacy run layout detected/i);
});

test("default request includes resume and shared-edit policy flags", () => {
  const request = buildDefaultRequest({ runId: "latest", agent: "Agent5-ClueExtraction" });
  assert.equal(request.hydratePriorFromRun, true);
  assert.equal(request.quickRun, false);
  assert.equal(request.confirmSharedEdits, false);
  assert.equal(request.partialRollbackEnabled, true);
  assert.equal(request.enableMajorRework, true);
});

test("quick run preset enforces hydration-first fast defaults", () => {
  const request = buildDefaultRequest({
    runId: "latest",
    agent: "Agent6-FairPlay",
    quickRun: true,
    startFromAgent: "Agent1-SettingRefiner",
    hydratePriorFromRun: false,
    autoExpandUpstreamScope: true,
    enableMajorRework: true,
    testScope: "full",
    maxUnchanged: 4,
  });

  const quick = applyQuickRunPreset(request);
  assert.equal(quick.startFromAgent, "Agent6-FairPlay");
  assert.equal(quick.hydratePriorFromRun, true);
  assert.equal(quick.autoExpandUpstreamScope, false);
  // Quick-run preset defaults to shallow retries; CLI may explicitly override this.
  assert.equal(quick.enableMajorRework, false);
  assert.equal(quick.testScope, "targeted");
  assert.equal(quick.maxUnchanged, 1);
});

test("terminal major rework reset triggers on terminal safety stops", () => {
  assert.equal(
    shouldResetIterationAfterTerminalMajorRework({
      terminalMajorReworkTriggered: true,
      failureDecision: {
        decision: "stop",
        stopReason: "Reached max iterations (5).",
      },
    }),
    true
  );

  assert.equal(
    shouldResetIterationAfterTerminalMajorRework({
      terminalMajorReworkTriggered: true,
      failureDecision: {
        decision: "stop",
        stopReason: "Signature remained unchanged for 2 iterations (maxUnchanged=1).",
      },
    }),
    true
  );

  assert.equal(
    shouldResetIterationAfterTerminalMajorRework({
      terminalMajorReworkTriggered: true,
      failureDecision: {
        decision: "stop",
        stopReason: "Low confidence output signature (0.45 < 0.6).",
      },
    }),
    false
  );
});

test("stripUtf8Bom removes BOM only when present", () => {
  const withBom = "\uFEFF{\"ok\":true}";
  const withoutBom = "{\"ok\":true}";
  assert.equal(stripUtf8Bom(withBom), withoutBom);
  assert.equal(stripUtf8Bom(withoutBom), withoutBom);
});

test("parseJsonText parses BOM-prefixed JSON", () => {
  const payload = parseJsonText("\uFEFF{\"runId\":\"run_x\"}");
  assert.equal(payload.runId, "run_x");
});
