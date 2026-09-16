/**
 * A_96 F1 / F2 — THE BEAT SEQUENCE IS A SEQUENCE, AND ITS NAMES ARE NOT FOR THE READER.
 *
 * ── B6, MEASURED over 52 stored outlines ─────────────────────────────────────────────────────────
 *
 * **36 (69%) assign the same Golden-Age beat to more than one scene** — `revelation` twice in 21,
 * `final_trap` twice in 11. On seed 50862 scenes 8 AND 9 carried `final_trap`: the prose put the
 * test, the confession and the arrest in chapter 8, chapter 9 then cleared suspects of a confessed
 * crime while repeating chapter 8's elimination paragraph, and closed on a verbatim copy of chapter
 * 4's cliffhanger AFTER the arrest. A_94 R1 missed it because R1 inspects only the FINAL scene.
 *
 * ── B5, MEASURED ────────────────────────────────────────────────────────────────────────────────
 *
 * **8 of 10 chapter titles on that book are the outline's scene title verbatim**, two of them
 * carrying the beat name — "Chapter 6: False Solution: The Judge's Compass". Across 527 archived
 * scenes, 54 titles (10%) carry a beat name. Agent 7 titles for its own bookkeeping; Agent 9 prints
 * it for the reader; nobody owned the boundary.
 *
 * ── THE SHAPE OF THE FIX ────────────────────────────────────────────────────────────────────────
 *
 * Repairs, not gates. A gate firing on 69% of outlines is an off switch with extra steps (B1) and a
 * retry costs register points. Every repair here is loss-proof: a duplicate label is relabelled from
 * the canonical sequence, a clearance clause after the reveal is dropped and the rest of the purpose
 * kept, a beat-name prefix is removed and the remainder of the title kept.
 */

/** The canonical order. Mirrors GOLDEN_AGE_BEATS in agent7-narrative.ts; duplicated here so this
 *  module has no dependency on the prompt module. */
export const BEAT_ORDER = [
  "gathering",
  "crime",
  "first_enquiries",
  "motives",
  "alibis",
  "false_solution",
  "secrets",
  "pattern",
  "final_trap",
  "revelation",
] as const;

export const isBeatSequenceRepairEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT7_BEAT_SEQUENCE_REPAIR ?? "").trim());

export const isStripBeatTitlesEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_STRIP_BEAT_TITLES ?? "").trim());

/**
 * A beat name used as a title prefix: "False Solution: …", "The Final Trap — …", "Revelation: …".
 * Only a LEADING beat name followed by a separator is stripped; "The Judge's Compass" survives.
 */
const BEAT_TITLE_PREFIX_RE =
  /^\s*(?:the\s+)?(?:false\s+solution|final\s+trap|first\s+enquir(?:y|ies)|revelation|gathering|the\s+crime|motives|alibis(?:\s+(?:and|&)\s+contradictions)?|secrets(?:\s+beneath\s+secrets)?|(?:the\s+)?pattern(?:\s+emerges)?)\s*[:—–-]\s*/i;

/** Strip a leading beat-name prefix. Returns the original when nothing usable would remain. */
export const stripBeatPrefixFromTitle = (title: unknown): string => {
  const raw = String(title ?? "").trim();
  if (!raw) return raw;
  const stripped = raw.replace(BEAT_TITLE_PREFIX_RE, "").trim();
  return stripped.length >= 3 ? stripped : raw;
};

export interface BeatSequenceRepair {
  relabelled: Array<{ sceneNumber: number; from: string; to: string }>;
  clearancesStripped: Array<{ sceneNumber: number; dropped: string }>;
  titlesStripped: Array<{ sceneNumber: number; from: string; to: string }>;
}

const CLEARANCE_RE = /\b(?:alibis?|clear(?:s|ed|ing|ances?)?|eliminat\w*)\b/i;

/**
 * Drop clearance clauses/sentences from a scene's purpose and summary. Same shape as A_94 R1, and
 * the same loss-proof rule: nothing is dropped when nothing separable would remain.
 */
const stripClearanceText = (scene: any): string[] => {
  const dropped: string[] = [];
  for (const field of ["purpose", "summary"] as const) {
    const text = scene?.[field];
    if (typeof text !== "string" || !CLEARANCE_RE.test(text)) continue;
    const parts = text.split(/(?<=[.!?])\s+|;\s*/).map((x: string) => x.trim()).filter(Boolean);
    const kept = parts.filter((x: string) => !CLEARANCE_RE.test(x));
    if (kept.length === 0 || kept.length === parts.length) continue;
    dropped.push(...parts.filter((x: string) => CLEARANCE_RE.test(x)));
    const joined = kept.join(" ").trim();
    scene[field] = joined.charAt(0).toUpperCase() + joined.slice(1);
  }
  return dropped;
};

/**
 * Three repairs on one outline, in order:
 *   1. duplicate beats — the FIRST occurrence keeps its label; later duplicates take the canonical
 *      beat for their ordinal position if that beat is unused, else the first unused beat in order;
 *   2. clearances after the reveal — every scene AFTER the (first) `final_trap` loses its clearance
 *      clauses, as does the final scene whatever its beat;
 *   3. beat names as title prefixes — stripped from every scene title.
 */
export const repairBeatSequence = (narrative: unknown): BeatSequenceRepair => {
  const out: BeatSequenceRepair = { relabelled: [], clearancesStripped: [], titlesStripped: [] };
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return out;
  const scenes: any[] = acts.flatMap((a: any) => (Array.isArray(a?.scenes) ? a.scenes : []));
  if (scenes.length === 0) return out;

  // 1. duplicates
  const used = new Set<string>();
  scenes.forEach((scene, idx) => {
    const beat = String(scene?.beat ?? "").trim().toLowerCase();
    if (!beat) return;
    if (!used.has(beat)) { used.add(beat); return; }
    const positional = BEAT_ORDER[Math.min(idx, BEAT_ORDER.length - 1)];
    const replacement =
      positional && !used.has(positional) ? positional : BEAT_ORDER.find((b) => !used.has(b));
    if (!replacement) return;
    used.add(replacement);
    out.relabelled.push({ sceneNumber: Number(scene?.sceneNumber ?? idx + 1), from: beat, to: replacement });
    scene.beat = replacement;
  });

  // 2. clearances after the reveal
  const trapIdx = scenes.findIndex((s) => String(s?.beat ?? "").toLowerCase() === "final_trap");
  scenes.forEach((scene, idx) => {
    const afterReveal = trapIdx >= 0 ? idx > trapIdx : idx === scenes.length - 1;
    if (!afterReveal) return;
    for (const dropped of stripClearanceText(scene)) {
      out.clearancesStripped.push({ sceneNumber: Number(scene?.sceneNumber ?? idx + 1), dropped });
    }
  });

  // 3. titles
  scenes.forEach((scene, idx) => {
    if (typeof scene?.title !== "string") return;
    const to = stripBeatPrefixFromTitle(scene.title);
    if (to !== scene.title.trim()) {
      out.titlesStripped.push({ sceneNumber: Number(scene?.sceneNumber ?? idx + 1), from: scene.title, to });
      scene.title = to;
    }
  });
  return out;
};
