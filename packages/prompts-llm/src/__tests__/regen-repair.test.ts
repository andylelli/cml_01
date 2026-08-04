import { describe, expect, it, vi } from "vitest";
import { noScaffoldValidator, allOf } from "@cml/prose-guard";
import type { ValidatorResult } from "@cml/prose-guard";
import {
  runRegenRepair,
  regenThenValidate,
  type ProseDefect,
  type RegenRequest,
} from "../agent9-prose/regen-repair.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// First-principles LLD §6.4 / P3 — the scoped regen-repair loop. Pure orchestration: the LLM is a
// mock so we test the verify→regen→re-verify→rollback semantics deterministically.

const chapterOf = (...paras: string[]): ProseChapter => ({ title: "Ch", paragraphs: paras });
const text = (c: ProseChapter): string => (c.paragraphs ?? []).join(" ");

// a validator that requires a clue token to be present (presence guarantee) AND no scaffold
const cluePresentValidator = (token: string) => (c: ProseChapter): ValidatorResult => {
  const present = text(c).toLowerCase().includes(token.toLowerCase());
  return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`missing_clue:${token}`] };
};
const scaffoldValidator = (c: ProseChapter): ValidatorResult => noScaffoldValidator(text(c));
const composed = (token: string) => (c: ProseChapter): ValidatorResult => {
  const a = cluePresentValidator(token)(c);
  const b = scaffoldValidator(c);
  return { ok: a.ok && b.ok, score: a.score + b.score, violations: [...a.violations, ...b.violations] };
};

const defect: ProseDefect = {
  chapter: 3,
  paragraphIndex: 1,
  kind: "missing_clue",
  detail: "the cold tea clue is absent",
  obligationRef: "clue_cold_tea",
  severity: "hard",
};
const buildRequest = (chapter: ProseChapter, d: ProseDefect): RegenRequest => ({
  chapter,
  paragraphIndex: d.paragraphIndex,
  instruction: `plant ${d.obligationRef} here as an in-scene observation`,
  constraints: { lockedFacts: [], pronouns: {}, mustNotReveal: [] },
  defect: d,
});

describe("runRegenRepair — dramatizes a missing element and keeps it only if it broke nothing", () => {
  it("a good regen that plants the clue in-scene is accepted", async () => {
    const start = chapterOf("Evelyn entered the study.", "Nothing seemed amiss.");
    const goodRegen = vi.fn(async () =>
      chapterOf("Evelyn entered the study.", "The cold tea sat untouched, a skin forming on its surface."),
    );
    const res = await runRegenRepair(start, [defect], buildRequest, goodRegen, composed("cold tea"));
    expect(res.outcomes[0].applied).toBe(true);
    expect(res.unresolved).toEqual([]);
    expect(text(res.chapter)).toMatch(/cold tea/);
    expect(goodRegen).toHaveBeenCalledOnce();
  });

  it("a regen that injects deductive SCAFFOLD is rolled back (the whole point)", async () => {
    const start = chapterOf("Evelyn entered the study.", "Nothing seemed amiss.");
    // satisfies clue presence but reintroduces the A1 scaffold the inversion exists to kill
    const scaffoldRegen = vi.fn(async () =>
      chapterOf(
        "Evelyn entered the study.",
        "She weighed the cold tea, and the trail bent toward the gardener.",
      ),
    );
    const res = await runRegenRepair(start, [defect], buildRequest, scaffoldRegen, composed("cold tea"));
    expect(res.outcomes[0].applied).toBe(false);
    expect(res.outcomes[0].reverted).toBe(true);
    expect(res.unresolved).toContain(defect);
    expect(text(res.chapter)).toBe(text(start)); // untouched original ships
  });

  it("retries then reports unresolved with a reason; onUnresolved is called (logged, never silent)", async () => {
    const start = chapterOf("Evelyn entered the study.");
    const failRegen = vi.fn(async () => chapterOf("Evelyn entered the study.")); // never plants the clue
    const onUnresolved = vi.fn();
    const res = await runRegenRepair(start, [defect], buildRequest, failRegen, composed("cold tea"), {
      maxAttemptsPerDefect: 3,
      onUnresolved,
    });
    expect(failRegen).toHaveBeenCalledTimes(3);
    expect(res.unresolved).toContain(defect);
    expect(onUnresolved).toHaveBeenCalledWith(defect, expect.stringMatching(/score|invalid|empty/i));
  });

  it("a regen that throws is treated as a failed attempt, not a crash", async () => {
    const start = chapterOf("Evelyn entered the study.");
    const throwRegen = vi.fn(async () => {
      throw new Error("LLM timeout");
    });
    const res = await runRegenRepair(start, [defect], buildRequest, throwRegen, composed("cold tea"), {
      maxAttemptsPerDefect: 1,
    });
    expect(res.outcomes[0].applied).toBe(false);
    expect(res.outcomes[0].reason).toMatch(/regen threw: LLM timeout/);
    expect(text(res.chapter)).toBe(text(start));
  });

  it("hard defects are repaired before soft defects", async () => {
    const order: string[] = [];
    const start = chapterOf("Plain text.");
    const soft: ProseDefect = { ...defect, kind: "absent_character" as any, severity: "soft", obligationRef: "soft1" };
    const hard: ProseDefect = { ...defect, severity: "hard", obligationRef: "hard1" };
    const regen = vi.fn(async (req: RegenRequest) => {
      order.push(req.defect.obligationRef ?? "");
      return start; // no-op so both go unresolved, but order is what we assert
    });
    await runRegenRepair(start, [soft, hard], buildRequest, regen, composed("never"), { maxAttemptsPerDefect: 1 });
    expect(order[0]).toBe("hard1");
  });
});

describe("regenThenValidate — async revert-on-regression analog of mutateThenValidate", () => {
  it("keeps an improvement, reverts a regression", async () => {
    const start = chapterOf("a quiet room");
    const improve = await regenThenValidate(
      start,
      () => buildRequest(start, defect),
      async () => chapterOf("a quiet room with cold tea"),
      composed("cold tea"),
      2,
    );
    expect(improve.applied).toBe(true);

    const regress = await regenThenValidate(
      chapterOf("a quiet room with cold tea"),
      (c) => buildRequest(c, defect),
      async () => chapterOf("a quiet room"), // drops the clue
      composed("cold tea"),
      2,
    );
    expect(regress.reverted).toBe(true);
  });
});

/**
 * X2 (architecture/REVIEW_05.md §12.2) — the UNRESOLVED reason has to be readable.
 *
 * The 08-04 run reported `regen-mechanism UNRESOLVED ch6: regen did not improve the targeted
 * property (score 200)`. That bare sum was read as the MAXIMUM of a two-check validator, which
 * would mean the pass had judged a chapter clean that its own detector had just judged defective —
 * a detector/validator disagreement that does not exist. `composeChapterValidator` silently
 * prepends `noScaffoldValidator`, so the mechanism pass scores out of three checks and 200 is one
 * of them still failing.
 *
 * The pass was honest; only its message was not. This pins the message.
 */
describe("the reason an unresolved defect gives (X2)", () => {
  const threeChecks = (c: ProseChapter): ValidatorResult => {
    const stillExplains = text(c).toLowerCase().includes("because the pendulum was suspended");
    return {
      ok: !stillExplains,
      score: (stillExplains ? 0 : 100) + 100 + 100, // mechanism + scaffold + locked facts
      violations: stillExplains ? ["mechanism_explained_too_early"] : [],
    };
  };

  it("names the failing check and both scores, not a bare sum", async () => {
    const chapter = chapterOf("The clock stopped because the pendulum was suspended.");
    const regen = vi.fn(async () => chapterOf("It stopped because the pendulum was suspended, plainly."));

    const result = await regenThenValidate(
      chapter,
      (c) => ({ chapter: c, paragraphIndex: 0, instruction: "withhold the mechanism" }) as RegenRequest,
      regen,
      threeChecks,
      2,
    );

    expect(result.applied).toBe(false);
    // 200 of a possible 300 — the number alone said neither of those things.
    expect(result.reason).toMatch(/score 200, was 200/);
    expect(result.reason).toMatch(/still failing: mechanism_explained_too_early/);
  });

  it("stays silent about failing checks when there are none to name", async () => {
    const clean = chapterOf("The clock stopped. Nobody said why.");
    const regen = vi.fn(async () => chapterOf("The clock stopped. Nobody said why at all."));
    const result = await regenThenValidate(
      clean,
      (c) => ({ chapter: c, paragraphIndex: 0, instruction: "no-op" }) as RegenRequest,
      regen,
      threeChecks,
      1,
    );
    expect(result.reason).toMatch(/score 300, was 300/);
    expect(result.reason).not.toMatch(/still failing/);
  });
});
