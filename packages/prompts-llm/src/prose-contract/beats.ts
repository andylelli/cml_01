/**
 * The wit and depth beat rotation, and the trait-only reduction of a character note.
 *
 * Moved out of the v1 engine's `agent9-prose/obligation-block.ts` by owner decision 1 (2026-09-30), which deleted that
 * engine; these are the declarations the v2 engine, Agent 7 or scoring still read (with every helper they
 * reference, moved by `scripts/move-declarations.mjs --closure`). Nothing in them changed.
 */

export interface BeatCandidate {
  name: string;
  humourStyle?: string;
  humourLevel?: number;
  formativeIncident?: string;
}

/** Stable, dependency-free rotation: the same chapter always draws the same character. */
const rotate = <T>(pool: T[], chapterNumber: number): T | undefined =>
  pool.length === 0 ? undefined : pool[(Math.max(1, chapterNumber) - 1) % pool.length];

/**
 * Who carries this chapter's wit beat. Only characters the profile actually made funny are eligible,
 * and the detective is deliberately eligible — the guide's own rule is that the detective delivers
 * one mild remark per major scene, not that they never speak.
 */
export const selectWitBeat = (
  profiles: ReadonlyArray<BeatCandidate>,
  chapterNumber: number,
): BeatCandidate | undefined =>
  rotate(
    (profiles ?? []).filter(
      (p) => p?.name && p.humourStyle && p.humourStyle !== "none" && Number(p.humourLevel ?? 0) > 0,
    ),
    chapterNumber,
  );

/** Who shows their formative trait in this chapter. Offset by one so it is rarely the wit-beat character. */
export const selectDepthBeat = (
  profiles: ReadonlyArray<BeatCandidate>,
  chapterNumber: number,
): BeatCandidate | undefined =>
  rotate(
    (profiles ?? []).filter((p) => p?.name && String(p.formativeIncident ?? "").trim().length > 12),
    chapterNumber + 1,
  );

const ORIGIN_CONNECTOR_RE =
  /\s+(?:ever since|since|after|because|when|following|owing to|from the (?:day|night|year|moment)|at (?:age|the age of)|in 1[89]\d\d|which)\b|\s*[—–]\s*|,\s+(?:which|a legacy|the result|born of)\b/i;

export const traitOnly = (incident: unknown): string => {
  const text = String(incident ?? "").trim();
  if (!text) return "";
  const m = ORIGIN_CONNECTOR_RE.exec(text);
  const head = m && m.index > 0 ? text.slice(0, m.index) : text.split(/(?<=[.!?])\s+/)[0]!;
  const clause = head.trim().replace(/[.,;:]+$/, "");
  return clause.split(/\s+/).length >= 3 ? clause : text.split(/(?<=[.!?])\s+/)[0]!.trim();
};
