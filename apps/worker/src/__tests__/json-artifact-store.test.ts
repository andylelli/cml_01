/**
 * The ONE json-store writer used by every path that runs outside the API (`canary-core.mjs`,
 * `resume-run.ts`). It had no tests, and the defect below is what that cost.
 *
 * Every reader of this store takes the LAST row for a project and type, so an appended empty row is
 * a silent delete of the run it lands on. Measured 2026-09-18: two `PROSE_V2_DRY=1` dry runs, which
 * make no LLM call, appended two 0-chapter `prose` rows over seed 50862's 10-chapter book.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { latestArtifact, loadArtifactStore } from "../jobs/artifact-store.js";
import { isEmptyArtifactPayload, makeJsonArtifactPersister } from "../jobs/json-artifact-store.js";

let root: string;
let dbPath: string;
const failures: Array<{ type: string; message: string }> = [];

const persist = (projectId = "p1") =>
  makeJsonArtifactPersister({
    workspaceRoot: root,
    projectId,
    dbPath,
    onError: (type, message) => failures.push({ type, message }),
  });

const rows = () => JSON.parse(readFileSync(dbPath, "utf8")).artifacts as unknown[];

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "cml-persist-"));
  dbPath = join(root, "data", "store.json");
  failures.length = 0;
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("the writer appends, and the last row wins", () => {
  it("writes an artifact into a store that does not exist yet", async () => {
    await persist()("prose", { chapters: [{ title: "One" }] });
    expect(rows()).toHaveLength(1);
    expect(latestArtifact(loadArtifactStore(root), "p1", "prose")).toEqual({
      chapters: [{ title: "One" }],
    });
  });

  it("a regenerated stage supersedes the one before it — the reason appending is right", async () => {
    const write = persist();
    await write("prose", { chapters: [{ title: "first" }] });
    await write("prose", { chapters: [{ title: "second" }] });
    expect(rows()).toHaveLength(2);
    expect(latestArtifact(loadArtifactStore(root), "p1", "prose")).toEqual({
      chapters: [{ title: "second" }],
    });
  });
});

describe("an empty artifact never lands on a full one", () => {
  it("KNOWN-POSITIVE: the dry run's 0-chapter prose is refused, and the book survives", async () => {
    const write = persist();
    await write("prose", { chapters: [{ title: "One" }, { title: "Two" }] });
    await write("prose", { chapters: [] });

    expect(rows()).toHaveLength(1);
    expect(failures[0]?.type).toBe("prose");
    expect(failures[0]?.message).toMatch(/refused to append an empty 'prose'/);
    const kept = latestArtifact(loadArtifactStore(root), "p1", "prose") as {
      chapters: unknown[];
    };
    expect(kept.chapters).toHaveLength(2);
  });

  it("KNOWN-POSITIVE: the same shape for a bare array, which is how `cast` is stored", async () => {
    const write = persist();
    await write("cast", [{ name: "Nora Quayle" }]);
    await write("cast", []);
    expect(rows()).toHaveLength(1);
  });

  it("a FIRST empty artifact still writes — the guard blocks erasure, not emptiness", async () => {
    await persist()("prose", { chapters: [] });
    expect(rows()).toHaveLength(1);
    expect(failures).toEqual([]);
  });

  it("another project's full artifact does not block this project's empty one", async () => {
    await persist("p1")("prose", { chapters: [{ title: "One" }] });
    await persist("p2")("prose", { chapters: [] });
    expect(rows()).toHaveLength(2);
  });

  it("an empty artifact of a DIFFERENT type is unaffected", async () => {
    const write = persist();
    await write("prose", { chapters: [{ title: "One" }] });
    await write("clues", { clues: [] });
    expect(rows()).toHaveLength(2);
  });

  it("reads the row spellings the API writes, not only its own", async () => {
    // The API writes `project_id` / `artifact_type` / `payload_json`; this writer writes camelCase.
    // A guard that only understood its own spelling would wave the erasure through on any store the
    // API had touched — which is every real one.
    mkdirSync(join(root, "data"), { recursive: true });
    writeFileSync(
      dbPath,
      JSON.stringify({
        artifacts: [
          {
            project_id: "p1",
            artifact_type: "prose",
            payload_json: JSON.stringify({ chapters: [{ title: "One" }] }),
          },
        ],
      }),
      "utf8",
    );
    await persist()("prose", { chapters: [] });
    expect(rows()).toHaveLength(1);
    expect(failures[0]?.message).toMatch(/refused/);
  });
});

describe("isEmptyArtifactPayload only judges the shapes it knows", () => {
  it("calls the content-bearing shapes empty when they are", () => {
    expect(isEmptyArtifactPayload([])).toBe(true);
    expect(isEmptyArtifactPayload({ chapters: [] })).toBe(true);
    expect(isEmptyArtifactPayload({ acts: [] })).toBe(true);
    expect(isEmptyArtifactPayload({ clues: [] })).toBe(true);
  });

  it("calls everything it cannot judge NOT empty, so nothing real is dropped", () => {
    expect(isEmptyArtifactPayload({ chapters: [{}] })).toBe(false);
    expect(isEmptyArtifactPayload({ setting: { decade: "1930s" } })).toBe(false);
    expect(isEmptyArtifactPayload({})).toBe(false);
    expect(isEmptyArtifactPayload(null)).toBe(false);
    expect(isEmptyArtifactPayload("text")).toBe(false);
  });
});
