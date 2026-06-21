import { describe, expect, it } from "vitest";
import { judgeNovelty, sharedFields } from "../compare.js";
import { loadSeedFingerprints, loadClicheLedger, loadReferenceCorpus, validateFingerprint } from "../loader.js";
import { NoveltyStore, judgeAgainstAll } from "../store.js";
import type { Fingerprint, Skeleton } from "../types.js";

const asSkeleton = (fp: Fingerprint): Skeleton => ({
  id: fp.id,
  axis: fp.axis,
  mechanism_family: fp.mechanism_family,
  false_assumption_pattern: fp.false_assumption_pattern,
  discriminating_test_shape: fp.discriminating_test_shape,
  inference_shape: fp.inference_shape,
  premise: fp.premise,
});

describe("ledgers load and validate (§9.4 determinism floor)", () => {
  it("loads ≥14 seed fingerprints, all schema-valid, with unique ids", () => {
    const seeds = loadSeedFingerprints();
    expect(seeds.length).toBeGreaterThanOrEqual(14);
    expect(new Set(seeds.map((s) => s.id)).size).toBe(seeds.length);
    for (const s of seeds) expect(validateFingerprint(s), s.id).toBe(true);
  });

  it("loads the genre-cliche ledger (the corpus the seed-only design is blind to)", () => {
    const cliches = loadClicheLedger();
    expect(cliches.length).toBeGreaterThanOrEqual(6);
    expect(cliches.every((c) => c.corpus === "cliche")).toBe(true);
  });

  it("rejects a malformed fingerprint (bad enum, unknown key, missing field)", () => {
    const good = loadSeedFingerprints()[0];
    expect(validateFingerprint({ ...good, axis: "chronological" })).toBe(false);
    expect(validateFingerprint({ ...good, surprise: 1 })).toBe(false);
    const noTest: Record<string, unknown> = { ...good };
    delete noTest.discriminating_test_shape;
    expect(validateFingerprint(noTest)).toBe(false);
  });
});

describe("THE load-bearing invariant (§9.4): a seed-clone skeleton is ALWAYS flagged", () => {
  it("every seed, fed back as its own skeleton, returns clone/variation — never distinct", () => {
    const seeds = loadSeedFingerprints();
    for (const seed of seeds) {
      const v = judgeNovelty(asSkeleton(seed), seeds);
      expect(v.verdict, `${seed.id} must not read distinct`).not.toBe("distinct");
      expect(v.nearest?.id).toBe(seed.id);
    }
  });

  it("a deliberate paraphrase of The Big Bow Mystery is caught from the skeleton alone (spike 3)", () => {
    const paraphrase: Skeleton = {
      id: "candidate_locked_study",
      axis: "spatial",
      mechanism_family: "locked_room_timing",
      false_assumption_pattern: "the_body_died_before_the_room_opened",
      discriminating_test_shape: "timetable_contradiction",
      inference_shape: "reframe_access_at_discovery",
      premise: "Lord stabbed in a locked study; the discoverer struck as he 'broke in'.",
    };
    const v = judgeNovelty(paraphrase, loadSeedFingerprints());
    expect(v.verdict).toBe("clone");
    expect(v.nearest?.id).toBe("the_big_bow_mystery");
    expect(v.shared_structure).toContain("mechanism_family");
    expect(v.shared_structure).toContain("false_assumption_pattern");
  });
});

describe("cliche catch (§6: catch rate > 0 — seed-only catches ZERO)", () => {
  const cliches = loadClicheLedger();
  const seeds = loadSeedFingerprints();

  it("every cliche skeleton is flagged against the reference corpus (seeds + cliches)", () => {
    const ref = loadReferenceCorpus();
    for (const c of cliches) {
      const v = judgeNovelty(asSkeleton(c), ref);
      expect(v.verdict, `${c.id}`).not.toBe("distinct");
    }
  });

  it("the butler-did-it cliche is INVISIBLE to a seed-only check but caught with the ledger", () => {
    const butler = asSkeleton(cliches.find((c) => c.id === "butler_did_it")!);
    // seed-only: not in any seed → distinct (the §3c blindness)
    expect(judgeNovelty(butler, seeds).verdict).toBe("distinct");
    // with the cliche ledger: caught
    const v = judgeAgainstAll(butler, { seeds, cliches });
    expect(v.verdict).not.toBe("distinct");
    expect(v.nearest?.corpus).toBe("cliche");
  });
});

describe("cross-run mode collapse (§4.4) — the guard the seed-only design cannot have", () => {
  it("flags run #N when it collides with a prior shipped run, not a seed", () => {
    const store = new NoveltyStore();
    const run50: Skeleton & { id: string } = {
      id: "run_050",
      axis: "behavioral",
      mechanism_family: "alibi_fabrication",
      false_assumption_pattern: "the_grieving_widow_is_above_suspicion",
      discriminating_test_shape: "behavioral_tell",
      inference_shape: "expose_rehearsed_grief",
    };
    store.append(run50);
    const run200: Skeleton = { ...run50, id: "run_200", premise: "a different surface, the same shape" };
    const v = store.judge(run200, 20);
    expect(v.verdict).toBe("clone");
    expect(v.nearest?.corpus).toBe("prior_run");
    expect(v.nearest?.id).toBe("run_050");
  });

  it("a genuinely fresh idea reads distinct against seeds, cliches, and prior runs", () => {
    const fresh: Skeleton = {
      id: "fresh",
      axis: "authority",
      mechanism_family: "information_leak",
      false_assumption_pattern: "the_signature_proves_the_signer",
      discriminating_test_shape: "behavioral_tell",
      inference_shape: "trace_forged_authority_to_a_clerk",
    };
    const v = judgeAgainstAll(fresh, { seeds: loadSeedFingerprints(), cliches: loadClicheLedger() });
    expect(v.verdict).toBe("distinct");
  });
});

describe("the verdict is EXPLAINABLE (§4.5) — zero unexplained numeric rejections", () => {
  it("every non-distinct verdict carries a nearest, shared_structure, and a divergence_directive", () => {
    const v = judgeNovelty(asSkeleton(loadClicheLedger()[0]), loadReferenceCorpus());
    expect(v.nearest).not.toBeNull();
    expect(v.shared_structure.length).toBeGreaterThan(0);
    expect(v.divergence_directive.length).toBeGreaterThan(0);
    expect(v.nearest!.relation).toMatch(/shares/);
  });

  it("sharedFields is symmetric-ish and identifies the right axes", () => {
    const seeds = loadSeedFingerprints();
    const bigBow = seeds.find((s) => s.id === "the_big_bow_mystery")!;
    const shared = sharedFields(asSkeleton(bigBow), bigBow);
    expect(shared).toEqual(["axis", "mechanism_family", "false_assumption_pattern", "discriminating_test_shape", "inference_shape"]);
  });

  it("judgeNovelty is deterministic — same inputs, identical verdict", () => {
    const sk = asSkeleton(loadSeedFingerprints()[3]);
    expect(JSON.stringify(judgeNovelty(sk, loadReferenceCorpus()))).toBe(JSON.stringify(judgeNovelty(sk, loadReferenceCorpus())));
  });
});
