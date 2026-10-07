/**
 * A_111 F-1 — THE RED HERRINGS, NOTICED AND THEN EXPLAINED. Flag `PROSE_V2_HERRINGS`, off.
 *
 * The case carries `red_herrings`: a detail that seems to point at somebody (`description`, `points_at_suspect`), the
 * innocent truth of it (`innocent_explanation`) and the chapter that resolves it (`resolved_in_chapter`). MEASURED: 40 of
 * 40 distinct stored CMLs carry them, 80 in all, every one with an explanation — and the v2 contract owned none. They
 * sat in the bible under "Details that look wrong and are not", identical in chapters 1–9, so no chapter was asked to
 * show one. On arm D of seed 82094 (read 89) neither herring nor its explanation reached the page; the writer gave the
 * pointed-at suspect the weapon to handle as stage business and then made it evidence, and the reader's first fix was
 * "clarify the letter-opener prints: hers are old/innocent".
 *
 * So, from the case's own fields and nothing else — the false-lead pattern (`false-lead.ts`):
 *   1. each herring is EXPLAINED in one chapter: its own `resolved_in_chapter` when that falls after the crime and no
 *      later than the reveal; else the chapter that clears the person it points at; else the test; else the reveal;
 *   2. each herring is NOTICED in one chapter after the crime and before that one — one the pointed-at person is on the
 *      page in when there is one, the least loaded first; the crime chapter itself only when nothing else is free.
 */
import type { ContractCore, SceneContract } from "./types.js";

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const rec = (value: unknown): Record<string, unknown> => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

const load = (scene: SceneContract): number =>
  scene.mustSurface.length + (scene.falseLeads?.length ?? 0) + (scene.herrings?.length ?? 0) + (scene.herringsExplained?.length ?? 0);

/** Mutates `core.scenes`; returns notes for the run report. Pure otherwise; never throws. */
export const applyRedHerrings = (caseBlock: Record<string, unknown>, core: ContractCore): string[] => {
  const herrings = asArray(caseBlock.red_herrings ?? caseBlock.redHerrings).map(rec);
  if (herrings.length === 0) return [];
  const scenes = [...core.scenes].sort((a, b) => a.chapter - b.chapter);
  const crime = scenes.find((s) => s.beat === "crime")?.chapter ?? scenes[0]?.chapter ?? 1;
  const reveal = core.roles.reveal;
  const test = core.roles.discriminatingTest;
  const exists = (c: number): boolean => scenes.some((s) => s.chapter === c);
  const notes: string[] = [];

  for (const herring of herrings) {
    const detail = text(herring.description ?? herring.detail);
    const explanation = text(herring.innocent_explanation ?? herring.innocentExplanation);
    const pointsAt = text(herring.points_at_suspect ?? herring.pointsAtSuspect);
    if (!detail || !explanation) continue;

    // 1 — where it is explained.
    const resolved = Number(herring.resolved_in_chapter ?? herring.resolvedInChapter);
    const cleared = scenes.find((s) => s.chapter > crime && s.chapter <= reveal && s.eliminationsAllowed.some((e) => e.name === pointsAt))?.chapter;
    const explainIn = [resolved, cleared, test, reveal].find(
      (c): c is number => typeof c === "number" && Number.isInteger(c) && c > crime && c <= reveal && exists(c),
    );
    if (explainIn === undefined) {
      notes.push(`red herring: no chapter after the crime (${crime}) and by the reveal (${reveal}) to explain "${detail.slice(0, 60)}" — left in the bible`);
      continue;
    }

    // 2 — where it is noticed.
    const barred = new Set([reveal, test].filter((c): c is number => c !== null));
    const open = scenes.filter((s) => s.chapter > crime && s.chapter < explainIn && !barred.has(s.chapter));
    const byLoad = (list: SceneContract[]) => [...list].sort((a, b) => load(a) - load(b) || a.chapter - b.chapter);
    const order = [...byLoad(open.filter((s) => s.present.includes(pointsAt))), ...byLoad(open.filter((s) => !s.present.includes(pointsAt)))];
    const noticed = order[0] ?? scenes.find((s) => s.chapter === crime && crime < explainIn);
    if (!noticed) {
      notes.push(`red herring: no chapter before ${explainIn} to notice "${detail.slice(0, 60)}" — left in the bible`);
      continue;
    }
    const noticedScene = core.scenes.find((s) => s.chapter === noticed.chapter)!;
    noticedScene.herrings = [...(noticedScene.herrings ?? []), { detail, pointsAt }];
    const explainScene = core.scenes.find((s) => s.chapter === explainIn)!;
    explainScene.herringsExplained = [...(explainScene.herringsExplained ?? []), { detail, explanation, noticedIn: noticed.chapter }];
    notes.push(`red herring: "${detail.slice(0, 60)}" noticed in chapter ${noticed.chapter}, explained in chapter ${explainIn}`);
  }
  return notes;
};
