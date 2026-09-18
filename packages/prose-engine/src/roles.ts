/**
 * PROSE ENGINE v2 — WHICH CHAPTER HOLDS WHICH ROLE (ANALYSIS_99 §10.2.1).
 *
 * ── WHAT THIS REPLACES, AND WHY ──────────────────────────────────────────────────────────────────
 *
 * v1 answers "is this the reveal chapter?" by resolving a CML coordinate against the outline and
 * falling back through a keyword, a beat and a trap rule — five mechanisms, three flags
 * (`AGENT9_SCENE_REF_ARBITRATION`, `AGENT9_REVEAL_ON_DT_CHAPTER`, `AGENT9_EARLIEST_TRAP_WINS`) and,
 * as this week's bug check found, two of them disagree when a third is off (A_96 §5.7 #6).
 *
 * It is all downstream of one measured fact: **`culprit_revelation_scene` resolves by coordinate on
 * 0 of 45 archived runs**, because Agent 3 writes the coordinate before Agent 7 creates the scene
 * namespace (A_87). A join that never resolves is not a join; the keyword fallback IS the
 * implementation, and it was never written down as one.
 *
 * So v2 does not join. It reads the outline's own beats and positions, which are the only thing that
 * has ever actually decided this, and states the rule as a table. One owner (L6), no flags, no
 * coordinate.
 *
 * ── THE RULE ─────────────────────────────────────────────────────────────────────────────────────
 *
 *   aftermath            the LAST scene, iff its beat is `revelation` AND an earlier scene carries
 *                        `final_trap`. (A_89 B3's own predicate, kept.)
 *   reveal               the LAST `revelation` scene that is not the aftermath; else the LAST
 *                        `final_trap`; else the last non-aftermath scene.
 *   discriminating_test  the last `final_trap` strictly before the reveal; else the last `pattern`
 *                        before it that stages a test; else the reveal chapter itself.
 *
 * ── THE RULE'S FIRST CUT WAS WRONG, AND THE ARCHIVE SAID SO BEFORE A RUN DID ─────────────────────
 *
 * It read "reveal = the FIRST `final_trap`", taking A_96 F10 — *the prose confesses at the earliest
 * trap* — as the general rule. MEASURED against v1's live arbitration over 53 archived outlines
 * (`scripts/probe-v2-role-agreement.mjs`): **agreement 19 of 53 (36%)**, and every disagreement was
 * the same shape, the commonest arc this project produces:
 *
 *     …, secrets, final_trap(8), revelation(9), revelation(10)
 *
 * Scene 8 is the TRAP, scene 9 NAMES the culprit, scene 10 is the aftermath. F10's finding holds only
 * where the outline carries two traps and no revelation between them to name anybody — 11 of 52
 * outlines — and generalising it moved the reveal contract one chapter EARLIER than the confession on
 * 34 books, which is the mirror image of the defect F10 fixed.
 *
 * ── AND A SECOND CORRECTION, FROM THE SAME PROBE: A_96 F10 IS NOT A ROLE RULE ────────────────────
 *
 * The first correction still read "else the FIRST `final_trap`", which is A_96 F10 — *the prose
 * confesses at the earliest trap*. Agreement rose to 40 of 53, and the remaining 13 were all the
 * two-trap shape `…, final_trap(8), final_trap(9), revelation(10)`, where v2 named the culprit at 8
 * and left chapter 9 with no job between the reveal and the aftermath.
 *
 * F10 is a real measurement (run 50862 confessed at chapter 8 while the contract said 9) about a
 * v1 defect v2 does not have. In v1 the trap chapter and the reveal chapter both received partial,
 * overlapping contracts, so the only lever was to move the reveal to where the prose was already
 * confessing. v2 gives them DISJOINT contracts — the trap stages the demonstration and the culprit
 * is in that chapter's `mustNotReveal` until the reveal chapter — which says where NOT to confess,
 * a thing v1 could not say. So the role rule takes the LAST trap (the naming), the one before it
 * becomes the discriminating test, and no chapter is orphaned between the reveal and the aftermath.
 *
 * ── AND A THIRD: WHAT A CHAPTER BETWEEN THE REVEAL AND THE AFTERMATH IS FOR ──────────────────────
 *
 * Two outlines still disagree at **51 of 53**, and reading them settled a question the design had
 * left open. Both are the same shape — trap at 8, a chapter at 9, aftermath at 10 — and in both the
 * outline gives scene 10 BOTH jobs (*"Reveal Ambrose Rutherford as the culprit through confrontation
 * with evidence; show emotional and social aftermath"*), so there is no scene that is purely the
 * reveal. v1 resolves that by putting the kill statement on chapter 9, whose purpose is *"Officially
 * clear all innocent suspects"* and *"Reinforce innocence"* — the culprit named in the chapter that
 * clears the innocent, which is A_96 B6's defect arriving from a new direction. **v2 disagrees on
 * purpose, and both disagreements are asserted by name in `roles.test.ts`.**
 *
 * v2 names the culprit at the trap and gives the chapter between the reveal and the aftermath the
 * `clearances` role. That chapter is not orphaned and it is not a second reveal: its suspects are
 * already cleared by the arrest, so what it owes is CLOSURE, not a legal walk-back. This is the
 * distinction the highest-scoring read this project has ever had drew for us — *"Chapter 9's
 * clearances are acceptable because they give Gerald, Harriet and Halloway emotional closure, not
 * just legal clearance"* (A_86 item 5, the 85/100 book) — and the brief asks for the human beat
 * rather than the alibi whenever a clearance chapter follows the reveal.
 *   false_solution       the `false_solution` scene.
 *   clearances           every `alibis` scene, plus the scene immediately before the reveal when the
 *                        outline gives it an elimination.
 *   opening              scene 1.
 *   investigation        everything else.
 *
 * Precedence is the order above. Chapter 1's OPENING obligations do not depend on this role — the
 * brief keys them on `chapter === 1` — so a scene 1 that is somehow an `alibis` scene still gets its
 * hook. That is why the table can be flat and the prose still correct.
 */

import type { ChapterRole, ChapterRoles } from "./types.js";

/** The one place a scene's beat is read, so a stray casing or space cannot fork the answer. */
export const beatOf = (scene: unknown): string =>
  String((scene as { beat?: unknown } | null)?.beat ?? "")
    .trim()
    .toLowerCase();

const chapterOf = (scene: unknown, index: number): number => {
  const n = Number((scene as { sceneNumber?: unknown } | null)?.sceneNumber);
  return Number.isFinite(n) && n > 0 ? n : index + 1;
};

/** Does this scene's job field say a test happens here? Only `pattern` scenes are asked. */
const carriesTest = (scene: unknown): boolean => {
  const s = scene as Record<string, unknown> | null;
  const blob = `${String(s?.purpose ?? "")} ${String(s?.summary ?? "")} ${String(s?.title ?? "")}`.toLowerCase();
  return /\b(test|experiment|demonstrat\w*|reconstruct\w*|controlled comparison)\b/.test(blob);
};

const hasElimination = (scene: unknown): boolean => {
  const s = scene as Record<string, unknown> | null;
  const blob = `${String(s?.purpose ?? "")} ${String(s?.summary ?? "")}`.toLowerCase();
  return /\b(alibis?|clear(?:s|ed|ing|ances?)?|eliminat\w*|rule[sd]? out)\b/.test(blob);
};

export interface RoleAssignment {
  roles: ChapterRoles;
  /** chapter number → role, for every scene in the outline. */
  byChapter: Map<number, ChapterRole>;
  notes: string[];
}

/**
 * Assign a role to every scene. Pure, total, and never throws: an outline with no beats at all
 * still gets a reveal (the last scene) and an opening, which is the behaviour a beatless arc needs.
 */
export const assignChapterRoles = (scenes: ReadonlyArray<unknown>): RoleAssignment => {
  const notes: string[] = [];
  const list = Array.isArray(scenes) ? scenes : [];
  const chapters = list.map((s, i) => chapterOf(s, i));
  const beats = list.map(beatOf);
  const byChapter = new Map<number, ChapterRole>();

  if (list.length === 0) {
    return {
      roles: { reveal: 1, discriminatingTest: null, aftermath: null, falseSolution: null, clearances: [] },
      byChapter,
      notes: ["no scenes: the reveal defaults to chapter 1"],
    };
  }

  const lastIdx = list.length - 1;

  // ── aftermath ──────────────────────────────────────────────────────────────────────────────────
  const earlierTrap = beats.slice(0, lastIdx).includes("final_trap");
  const aftermathIdx = beats[lastIdx] === "revelation" && earlierTrap ? lastIdx : null;

  // ── reveal ─────────────────────────────────────────────────────────────────────────────────────
  // The chapter that NAMES the culprit. A `revelation` beat that is not the aftermath is exactly
  // that; the trap is where a case with no such scene does its naming (A_89 B3's premise).
  let revealIdx = -1;
  for (let i = lastIdx; i >= 0; i -= 1) {
    if (beats[i] === "revelation" && i !== aftermathIdx) {
      revealIdx = i;
      break;
    }
  }
  if (revealIdx < 0) {
    // No revelation scene to name anybody, so a trap does it — the LAST one, with any earlier trap
    // becoming the demonstration below. See the F10 note in the header for why v2 takes the last
    // where v1 had to take the first.
    revealIdx = beats.lastIndexOf("final_trap");
  }
  if (revealIdx < 0) {
    revealIdx = aftermathIdx !== null && lastIdx > 0 ? lastIdx - 1 : lastIdx;
    notes.push(
      `no final_trap and no non-aftermath revelation beat: the reveal falls to chapter ${chapters[revealIdx]}`,
    );
  }

  // ── discriminating test ────────────────────────────────────────────────────────────────────────
  // The trap proves; the reveal names. Where the outline has no trap before the reveal, a `pattern`
  // scene that stages a test is the demonstration; where it has neither, the reveal does both.
  let dtIdx: number | null = null;
  for (let i = revealIdx - 1; i >= 0; i -= 1) {
    if (beats[i] === "final_trap") {
      dtIdx = i;
      break;
    }
  }
  if (dtIdx === null) {
    for (let i = revealIdx - 1; i >= 0; i -= 1) {
      if (beats[i] === "pattern" && carriesTest(list[i])) {
        dtIdx = i;
        break;
      }
    }
  }
  if (dtIdx === null) dtIdx = revealIdx;

  // ── false solution ─────────────────────────────────────────────────────────────────────────────
  const fsIdx = beats.indexOf("false_solution");

  // ── clearances ─────────────────────────────────────────────────────────────────────────────────
  const clearanceIdx = new Set<number>();
  beats.forEach((b, i) => {
    if (b === "alibis") clearanceIdx.add(i);
  });
  const beforeReveal = revealIdx - 1;
  if (beforeReveal >= 0 && beforeReveal !== aftermathIdx && hasElimination(list[beforeReveal])) {
    clearanceIdx.add(beforeReveal);
  }
  // Every chapter BETWEEN the reveal and the aftermath. See the header's third correction: it owes
  // closure for the people the arrest has already cleared, and it is the one place a clearance after
  // the reveal is not the walk-back the reader has objected to in 8 of the last 16 reviews.
  const aftermathEnd = aftermathIdx ?? list.length;
  for (let i = revealIdx + 1; i < aftermathEnd; i += 1) {
    clearanceIdx.add(i);
    notes.push(
      `chapter ${chapters[i]} sits between the reveal and the aftermath: it owes closure, not a clearance`,
    );
  }

  // ── assignment, in precedence order ────────────────────────────────────────────────────────────
  list.forEach((_scene, i) => {
    const chapter = chapters[i]!;
    let role: ChapterRole = "investigation";
    if (i === aftermathIdx) role = "aftermath";
    else if (i === revealIdx) role = "reveal";
    else if (i === dtIdx) role = "discriminating_test";
    else if (i === fsIdx) role = "false_solution";
    else if (clearanceIdx.has(i)) role = "clearances";
    else if (i === 0) role = "opening";
    byChapter.set(chapter, role);
  });

  // The reveal and the discriminating test share a chapter whenever no earlier `pattern` scene
  // stages a test. That is not a collision — it is the Golden-Age shape, one chapter that proves and
  // then names — and v2 states it once here instead of arbitrating it per obligation (A_95 M3).
  const dtChapter = dtIdx === null ? null : chapters[dtIdx]!;
  if (dtChapter !== null && dtChapter === chapters[revealIdx]) {
    notes.push(`the discriminating test and the reveal are chapter ${dtChapter} — one chapter proves and names`);
  }

  return {
    roles: {
      reveal: chapters[revealIdx]!,
      discriminatingTest: dtChapter,
      aftermath: aftermathIdx === null ? null : chapters[aftermathIdx]!,
      falseSolution: fsIdx < 0 ? null : chapters[fsIdx]!,
      clearances: [...clearanceIdx].sort((a, b) => a - b).map((i) => chapters[i]!),
    },
    byChapter,
    notes,
  };
};
