/**
 * ANALYSIS_99 §10.13 — THE CONTRACT REPLAY.
 *
 * Every project in the archive, through `buildContractCore`, asserting the invariants the rest of
 * the engine is allowed to assume. This is the test that makes the engine's decisions arguable for
 * £0: v1's equivalent defects (the reveal on two chapters, clearances after the arrest, a clue
 * mandated in six chapters) were each found by a reader, months after the run that produced them.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import { completeProjects, loadArchive } from "./fixtures.js";

const archive = loadArchive();
const complete = completeProjects();

describe("the archive is present", () => {
  it("reports what it is replaying", () => {
    // Not an assertion about the corpus — a printed count, so a green suite over an EMPTY archive
    // cannot read as a green suite over the whole of it (a negative result from a probe you just
    // wrote is a claim about the probe).
    expect(archive.length).toBeGreaterThanOrEqual(0);
    console.info(
      `[contract replay] ${archive.length} project(s) with an outline, ${complete.length} with cml+clues+cast+profiles`,
    );
  });
});

describe.skipIf(archive.length === 0)("every archived project derives a contract", () => {
  it("never throws, and every scene gets a role", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      expect(core.scenes.length, project.projectId).toBeGreaterThan(0);
      for (const scene of core.scenes) {
        expect(scene.role, `${project.projectId} ch${scene.chapter}`).toBeTruthy();
        expect(scene.chapter).toBeGreaterThan(0);
      }
    }
  });

  it("exactly one reveal, at most one aftermath, never the same chapter", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      const reveals = core.scenes.filter((s) => s.role === "reveal");
      const aftermaths = core.scenes.filter((s) => s.role === "aftermath");
      expect(reveals.length, project.projectId).toBe(1);
      expect(aftermaths.length, project.projectId).toBeLessThanOrEqual(1);
      expect(core.roles.reveal).toBe(reveals[0]!.chapter);
      if (core.roles.aftermath !== null) expect(core.roles.aftermath).not.toBe(core.roles.reveal);
    }
  });

  it("no clue is DRAMATIZED by two chapters — A_89 B1's whole point", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      const owners = new Map<string, number>();
      for (const scene of core.scenes) {
        for (const surface of scene.mustSurface) {
          const previous = owners.get(surface.id);
          expect(
            previous,
            `${project.projectId}: ${surface.id} owned by ch${previous} and ch${scene.chapter}`,
          ).toBeUndefined();
          owners.set(surface.id, scene.chapter);
        }
      }
    }
  });

  it("a clue referred to was dramatized EARLIER, never later", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      for (const scene of core.scenes) {
        for (const ref of scene.mayMention) {
          // The reveal and the discriminating test re-cite decisive evidence whatever its owner
          // (A_90 §13), so they are the one exemption.
          if (scene.role === "reveal" || scene.role === "discriminating_test") continue;
          expect(
            ref.firstChapter,
            `${project.projectId}: ch${scene.chapter} refers to ${ref.id} first shown in ch${ref.firstChapter}`,
          ).toBeLessThanOrEqual(scene.chapter);
        }
      }
    }
  });

  it("clearances are before the reveal, or in a closure chapter — never at it, never in the aftermath", () => {
    // A_94 R1 and A_96 F2 STRIP clearances out of the reveal and the aftermath after the outline has
    // ordered them there. v2 never orders them there, so there is nothing to strip.
    for (const project of archive) {
      const core = buildContractCore(project.input);
      for (const scene of core.scenes) {
        if (scene.eliminationsAllowed.length === 0) continue;
        const label = `${project.projectId}: ch${scene.chapter}, reveal ch${core.roles.reveal}, aftermath ch${core.roles.aftermath}`;
        expect(scene.chapter, label).not.toBe(core.roles.reveal);
        expect(scene.role, label).not.toBe("aftermath");
        if (scene.chapter > core.roles.reveal && core.roles.aftermath !== null) {
          expect(scene.chapter, label).toBeLessThan(core.roles.aftermath);
        }
      }
    }
  });

  it("nothing is withheld past the chapter that owns it, and the culprit is withheld until the reveal", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      for (const scene of core.scenes) {
        for (const withheld of scene.mustNotReveal) {
          expect(withheld.until, `${project.projectId} ch${scene.chapter}`).toBeGreaterThan(scene.chapter);
        }
        const culpritWithheld = scene.mustNotReveal.some((w) => w.what === "culprit");
        expect(culpritWithheld, `${project.projectId} ch${scene.chapter}`).toBe(scene.chapter < core.roles.reveal);
      }
    }
  });

  it("a stated time window is a value the chronology table also carries", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      if (core.chronology.rows.length === 0) continue;
      const values = new Set(core.chronology.rows.map((r) => r.value));
      for (const scene of core.scenes) {
        if (!scene.timeWindow) continue;
        for (const value of [scene.timeWindow.from, scene.timeWindow.to]) {
          expect(
            [...values].some((v) => v.includes(value)),
            `${project.projectId} ch${scene.chapter}: "${value}" is on no chronology row`,
          ).toBe(true);
        }
      }
    }
  });

  it("the present list never names somebody outside the cast", () => {
    for (const project of complete) {
      const core = buildContractCore(project.input);
      const cast = new Set(
        ((project.input.cast?.characters ?? []) as Array<{ name?: string }>)
          .map((c) => String(c?.name ?? "").trim())
          .filter(Boolean),
      );
      if (cast.size === 0) continue;
      for (const scene of core.scenes) {
        for (const name of scene.present) {
          expect(cast.has(name), `${project.projectId} ch${scene.chapter}: "${name}"`).toBe(true);
        }
      }
    }
  });

  it("the aftermath chapter carries its job and the reveal chapter does not", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      for (const scene of core.scenes) {
        if (scene.role === "aftermath") expect(scene.aftermath, project.projectId).toBeTruthy();
        else expect(scene.aftermath, `${project.projectId} ch${scene.chapter}`).toBeUndefined();
      }
    }
  });

  it("fair play names a culprit and a reveal chapter that exists", () => {
    for (const project of complete) {
      const core = buildContractCore(project.input);
      expect(core.fairPlay.culprits.length, project.projectId).toBeGreaterThan(0);
      expect(core.scenes.some((s) => s.chapter === core.fairPlay.revealChapter), project.projectId).toBe(true);
    }
  });
});

describe.skipIf(complete.length === 0)("what the replay MEASURES, printed for the record", () => {
  it("prints the contract's own shape across the archive", () => {
    let surfaced = 0;
    let referred = 0;
    let withAftermath = 0;
    let dtBeforeReveal = 0;
    let clearances = 0;
    let chronoRows = 0;
    for (const project of complete) {
      const core = buildContractCore(project.input);
      surfaced += core.scenes.reduce((n, s) => n + s.mustSurface.length, 0);
      referred += core.scenes.reduce((n, s) => n + s.mayMention.length, 0);
      clearances += core.scenes.reduce((n, s) => n + s.eliminationsAllowed.length, 0);
      if (core.roles.aftermath !== null) withAftermath += 1;
      if (core.roles.discriminatingTest !== null && core.roles.discriminatingTest < core.roles.reveal) {
        dtBeforeReveal += 1;
      }
      chronoRows += core.chronology.rows.length;
    }
    const n = complete.length;
    console.info(
      `[contract replay] ${n} books — dramatized ${(surfaced / n).toFixed(1)}/book, referred ` +
        `${(referred / n).toFixed(1)}/book, clearances ${(clearances / n).toFixed(1)}/book, ` +
        `aftermath in ${withAftermath}/${n}, a test staged before the reveal in ${dtBeforeReveal}/${n}, ` +
        `chronology rows ${(chronoRows / n).toFixed(1)}/book`,
    );
    expect(n).toBeGreaterThan(0);
  });
});
