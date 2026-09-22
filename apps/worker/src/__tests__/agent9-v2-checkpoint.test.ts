/**
 * A checkpoint is reusable only for the SAME ASK.
 *
 * The identity used to be structure alone. A brief change leaves the structure identical, so drafts
 * written to the OLD wording would have been restored under the NEW one, and the run bought to test
 * the new wording would have made zero writer calls. Found on 2026-09-22, the morning the reworded
 * brief was about to be run for the first time.
 */
import { describe, expect, it } from "vitest";

import { hashContract, readCheckpoint, emptyCheckpoint, writeCheckpoint } from "../jobs/agents/agent9-v2/checkpoint.js";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const structure = { chapters: 10, reveal: 9, aftermath: 10, clueIds: ["clue_a", "clue_b"] };

describe("the checkpoint hash covers the ask, not only the structure", () => {
  it("KNOWN-POSITIVE: the same structure with a different brief is a different hash", () => {
    const before = hashContract({ ...structure, prompt: "6 paragraphs in each chapter open on a line somebody speaks." });
    const after = hashContract({ ...structure, prompt: "6 paragraphs in each chapter begin with a spoken line." });
    expect(before).not.toBe(after);
  });

  it("the same ask hashes the same, so a genuinely resumed run still restores", () => {
    const a = hashContract({ ...structure, prompt: "identical" });
    const b = hashContract({ ...structure, prompt: "identical" });
    expect(a).toBe(b);
  });

  it("clue order does not matter; clue identity does", () => {
    expect(hashContract({ ...structure, clueIds: ["clue_b", "clue_a"], prompt: "x" })).toBe(hashContract({ ...structure, prompt: "x" }));
    expect(hashContract({ ...structure, clueIds: ["clue_c"], prompt: "x" })).not.toBe(hashContract({ ...structure, prompt: "x" }));
  });

  it("end to end: a checkpoint written under the old ask is not read under the new one", () => {
    const dir = mkdtempSync(join(tmpdir(), "cml-cp-"));
    const path = join(dir, "cp.json");
    try {
      const oldHash = hashContract({ ...structure, prompt: "old wording" });
      writeCheckpoint(path, emptyCheckpoint("p", "r", oldHash));
      expect(readCheckpoint(path, oldHash)).not.toBeNull();
      expect(readCheckpoint(path, hashContract({ ...structure, prompt: "new wording" }))).toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
