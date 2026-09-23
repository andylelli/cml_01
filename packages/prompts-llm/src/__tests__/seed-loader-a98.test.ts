/**
 * A_98 — the seed corpus has ONE home, and a stale caller must not silently get zero.
 *
 * Before this, `examples/` and `library/works/` both held cases: nine byte-identical pairs, no
 * derivation direction between them, the API reading one and the generator reading the other. The
 * visible symptom was the Archive view reporting "14 cases on file" while the library held 166 works.
 *
 * These tests pin the two properties that stop it recurring. They are deliberately about BEHAVIOUR
 * under a wrong or outdated input, because the failure mode here was never an exception — it was a
 * confident empty list.
 */
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadSeedCMLFiles } from "../utils/seed-loader.js";

/** A library with one verified work, one legacy-only work, and one work with no encoding at all. */
const makeLibrary = () => {
  const root = mkdtempSync(join(tmpdir(), "cml-a98-"));
  const works = join(root, "library", "works");

  const write = (slug: string, file: string, title: string) => {
    mkdirSync(join(works, slug), { recursive: true });
    writeFileSync(
      join(works, slug, file),
      `CML_VERSION: 2.0\nCASE:\n  meta:\n    title: "${title}"\n  false_assumption:\n    type: identity\n`,
      "utf-8",
    );
  };

  write("verified_work", "case.cml2.yaml", "Verified Work");
  write("legacy_work", "case.legacy.yaml", "Legacy Work");
  mkdirSync(join(works, "text_only_work"), { recursive: true });
  writeFileSync(join(works, "text_only_work", "provenance.yaml"), "slug: text_only_work\n", "utf-8");

  return { root, works };
};

describe("A_98 — one source of truth for the seed corpus", () => {
  it("reads the library when handed the library", () => {
    const { root, works } = makeLibrary();
    try {
      const loaded = loadSeedCMLFiles(works);
      expect(loaded.map((e) => e.filename).sort()).toEqual(["legacy_work.yaml", "verified_work.yaml"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  /**
   * Every historical call site passes `<workspace>/examples`, a directory A_98 deleted. That path is
   * still in `apps/worker/src/jobs/runtime-paths.ts` and in the canary. If a non-existent hint
   * returned nothing, deleting the directory would have emptied the seed corpus for every run while
   * every test still passed — the exact shape of the bug this analysis was about.
   */
  it("still finds the corpus when handed the deleted examples/ path", () => {
    const { root, works } = makeLibrary();
    try {
      const viaDeadPath = loadSeedCMLFiles(join(root, "examples"));
      expect(viaDeadPath.length).toBe(loadSeedCMLFiles(works).length);
      expect(viaDeadPath.length).toBeGreaterThan(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  /**
   * A work with a verified re-encode and a legacy file beside it must be read at the re-encode. The
   * legacy encodings are not merely older: A_77 §3.2 found four of them materially wrong about their
   * own plots, one naming a character who does not appear in the book.
   */
  it("prefers the verified encoding over the legacy one for the same work", () => {
    const root = mkdtempSync(join(tmpdir(), "cml-a98-pref-"));
    const dir = join(root, "library", "works", "both");
    try {
      mkdirSync(dir, { recursive: true });
      const cml = (title: string) =>
        `CML_VERSION: 2.0\nCASE:\n  meta:\n    title: "${title}"\n  false_assumption:\n    type: identity\n`;
      writeFileSync(join(dir, "case.cml2.yaml"), cml("The Verified One"), "utf-8");
      writeFileSync(join(dir, "case.legacy.yaml"), cml("The Legacy One"), "utf-8");

      const loaded = loadSeedCMLFiles(join(root, "library", "works"));
      expect(loaded).toHaveLength(1);
      expect(loaded[0].cml.CASE.meta.title).toBe("The Verified One");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  /** A_103 B5: a hint ending in a separator must resolve to the same corpus. The regex that stripped
   *  it lost its backslash twice; this pins the Windows shape that exposed it. */
  it("resolves a hint with a trailing backslash or slash", () => {
    const { root, works } = makeLibrary();
    try {
      const n = loadSeedCMLFiles(works).length;
      expect(n).toBeGreaterThan(0);
      expect(loadSeedCMLFiles(works + "\\").length).toBe(n);
      expect(loadSeedCMLFiles(works + "/").length).toBe(n);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  /** A work with no encoding contributes nothing — it has a text and a provenance, not a case. */
  it("skips works that have no encoding at all", () => {
    const { root, works } = makeLibrary();
    try {
      expect(loadSeedCMLFiles(works).map((e) => e.filename)).not.toContain("text_only_work.yaml");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
