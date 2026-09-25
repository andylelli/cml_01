/**
 * A_109 step 6 — THE FALSE SOLUTION, ARGUED BEFORE IT IS REFUTED. Flag `PROSE_V2_FALSE_LEAD`, off.
 *
 * The case carries a rival accusation for every book: `false_solution.accused_suspect`, its
 * `supporting_points` ("the chain of evidence that makes this wrong solution look convincing", the
 * schema's own words) and the chapter that refutes it. MEASURED on the four golden contracts before
 * this was built:
 *   - the supporting points are listed in the bible for every chapter and OWNED BY NONE — no chapter
 *     is asked to show a single one, so the accusation arrives with nothing behind it;
 *   - the accused is CLEARED IN CHAPTER 5, one chapter before the false-solution chapter (6) accuses
 *     them — 4 of 4. The case does it: `suspect_clearance_scenes` puts every innocent's clearance at
 *     the alibis scene, and `refuted_in_chapter` says 6. The contract copied both.
 * Readers name the result: "the false solution would be stronger if one clue genuinely points to her
 * before being overturned" (two reads of 2026-07-24), "the false solution is not very strong", "give him
 * one stronger red herring", "a false solution is stronger when it also has a physical clue" — 7 of 72
 * reviews — and praise it where a book had one ("the false accusation gives it a real turning point",
 * 11 of 72). And once: "the false solution works, but the wrong people are present".
 *
 * So, from the case's own fields and nothing else:
 *   1. each supporting point is OWNED by one chapter after the crime and before the false-solution
 *      chapter — one the accused is on the page in when there is one — and asked for as a thing found
 *      or said (the ownership pattern: clues, stock lines, shared histories);
 *   2. the accused's clearance, when the case schedules it before the accusation, moves to the chapter
 *      that refutes the false solution (`refuted_in_chapter` when it falls from the false-solution
 *      chapter to before the reveal; else the false-solution chapter itself);
 *   3. the false-solution chapter is told which chapters it argues from, and has the accused on its page.
 *
 * NOT here, and why: moving the CULPRIT's clues to the test (A_109 §12's design) piles 7–8 clues into
 * one chapter and leaves no evidence against the culprit before it — withdrawn for harm; showing the
 * culprit's clues without their conclusion — "culprit obvious" is in 1 of 72 reviews, and its effect in
 * the reader model is only the constant assumed for it.
 */
import type { ContractCore, SceneContract } from "./types.js";

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const pointText = (point: unknown): string =>
  typeof point === "string"
    ? text(point)
    : text((point as Record<string, unknown> | null)?.point ?? (point as Record<string, unknown> | null)?.description);

const load = (scene: SceneContract): number => scene.mustSurface.length + (scene.falseLeads?.length ?? 0);

/** Mutates `core.scenes`; returns notes for the run report. Pure otherwise; never throws. */
export const applyFalseLead = (caseBlock: Record<string, unknown>, core: ContractCore): string[] => {
  const fs = (caseBlock.false_solution ?? {}) as Record<string, unknown>;
  const accused = text(fs.accused_suspect ?? fs.accusedSuspect);
  const points = asArray(fs.supporting_points ?? fs.supportingPoints).map(pointText).filter(Boolean);
  const fsChapter = core.roles.falseSolution;
  if (!accused || points.length === 0) return ["false lead: the case names no accused or no supporting points — nothing scheduled"];
  if (core.fairPlay.culprits.includes(accused)) return [`false lead: the accused (${accused}) is a culprit — nothing scheduled`];
  if (fsChapter === null) return ["false lead: the outline has no false_solution chapter — nothing scheduled"];

  const scenes = [...core.scenes].sort((a, b) => a.chapter - b.chapter);
  const crime = scenes.find((s) => s.beat === "crime")?.chapter ?? scenes[0]?.chapter ?? 1;
  const barred = new Set([core.roles.reveal, core.roles.discriminatingTest].filter((c): c is number => c !== null));
  const candidates = scenes.filter((s) => s.chapter > crime && s.chapter < fsChapter && !barred.has(s.chapter));
  const notes: string[] = [];

  // 1 — each point owned by one chapter: the accused's own chapters first, the least loaded first,
  // one point a chapter while chapters remain; then the points in the case's order, chapter by chapter.
  const byLoad = (list: SceneContract[]) => [...list].sort((a, b) => load(a) - load(b) || a.chapter - b.chapter);
  const theirs = byLoad(candidates.filter((s) => s.present.includes(accused)));
  const others = byLoad(candidates.filter((s) => !s.present.includes(accused)));
  const order = [...theirs, ...others];
  const shownIn: number[] = [];
  if (order.length === 0) {
    notes.push(`false lead: no chapter between the crime (${crime}) and the false solution (${fsChapter}) — the points stay unowned`);
  } else {
    const chosen = points.map((_, i) => order[i % order.length]!).map((s) => s.chapter).sort((a, b) => a - b);
    points.forEach((point, i) => {
      const scene = core.scenes.find((s) => s.chapter === chosen[i])!;
      scene.falseLeads = [...(scene.falseLeads ?? []), { accused, point }];
    });
    shownIn.push(...new Set(chosen));
  }

  // 2 — the accused is not cleared before they are accused.
  const refuted = Number(fs.refuted_in_chapter ?? fs.refutedInChapter);
  const exists = (c: number): boolean => core.scenes.some((s) => s.chapter === c);
  const brokenIn = Number.isInteger(refuted) && refuted >= fsChapter && refuted < core.roles.reveal && exists(refuted) ? refuted : fsChapter;
  for (const scene of core.scenes) {
    if (scene.chapter >= fsChapter) continue;
    const found = scene.eliminationsAllowed.find((e) => e.name === accused);
    if (!found) continue;
    scene.eliminationsAllowed = scene.eliminationsAllowed.filter((e) => e !== found);
    const target = core.scenes.find((s) => s.chapter === brokenIn)!;
    if (!target.eliminationsAllowed.some((e) => e.name === accused)) target.eliminationsAllowed = [...target.eliminationsAllowed, found];
    notes.push(`false lead: ${accused}'s clearance moved from chapter ${scene.chapter} to ${brokenIn} — after the accusation, not before it`);
  }

  // 3 — the false-solution chapter argues from what was shown, with the accused in the room: MEASURED,
  // the outline left them off that chapter's page in 2 of 4 golden cases, and the contract then cleared
  // an absent person "carrying one human beat".
  const fsScene = core.scenes.find((s) => s.chapter === fsChapter);
  if (fsScene && shownIn.length > 0) {
    fsScene.falseCase = { accused, shownIn, brokenIn };
    if (!fsScene.present.includes(accused)) {
      fsScene.present = [...fsScene.present, accused];
      notes.push(`false lead: ${accused} put on the page in chapter ${fsChapter}, the chapter that accuses them`);
    }
  }
  return notes;
};
