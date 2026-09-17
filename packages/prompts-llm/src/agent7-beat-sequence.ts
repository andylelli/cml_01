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
 * A clause whose ACTION is the reveal — a confrontation, an accusation, a confession, an exposure,
 * an arrest — is kept even when it mentions an alibi: "confronts Charles Fenwick with the evidence of
 * clock tampering and his falsified alibi" is the culprit's alibi being broken, not an innocent being
 * cleared. MEASURED 2026-09-17 over the 65 stored outlines: without this guard the two strippers
 * dropped 120 clauses, 45 of them carrying reveal language, among them the confrontation clause of
 * more than one final scene. A kept clause costs a recap; a dropped reveal clause costs the reveal.
 */
const REVEAL_CLAUSE_RE = /\b(?:confront\w*|accus\w*|confess\w*|expos\w*|unmask\w*|arrest\w*|reveal\w*)\b/i;
const isClearanceClause = (clause: string): boolean => CLEARANCE_RE.test(clause) && !REVEAL_CLAUSE_RE.test(clause);

/**
 * Drop clearance clauses/sentences from a scene's purpose and summary. Same shape as A_94 R1, and
 * the same loss-proof rule: nothing is dropped when nothing separable would remain.
 *
 * Exported so `agent7-run.ts`'s final-scene stripper (A_94 R1) is the SAME body — it carried its own
 * copy of this loop and regex until 2026-09-17, which is the WF-002 shape this repo keeps paying for.
 */
export const stripClearanceText = (scene: any): string[] => {
  const dropped: string[] = [];
  for (const field of ["purpose", "summary"] as const) {
    const text = scene?.[field];
    if (typeof text !== "string" || !CLEARANCE_RE.test(text)) continue;
    const parts = text.split(/(?<=[.!?])\s+|;\s*/).map((x: string) => x.trim()).filter(Boolean);
    const kept = parts.filter((x: string) => !isClearanceClause(x));
    if (kept.length === 0 || kept.length === parts.length) continue;
    dropped.push(...parts.filter((x: string) => isClearanceClause(x)));
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
  /**
   * MEASURED 2026-09-17, before this was corrected, over the 65 stored outlines: the first cut kept
   * the FIRST occurrence of every beat and relabelled the later one — and `revelation` is the one
   * beat whose duplicate is the FINAL scene (21 of 52 outlines end `…, final_trap, revelation,
   * revelation`). It relabelled the final scene of 23 of 65 outlines to `pattern` or `secrets`,
   * which un-made the aftermath chapter (`isGoldenAgeAftermathFinalChapter` keys on the final beat
   * being `revelation`), handed chapter 10 the ISOLATION archetype under AGENT9_ARC_FROM_BEATS and
   * moved the reveal contract. So `revelation` is exempt — its earlier copy is the reveal and its
   * last is the aftermath, the exact shape A_89 B3 was built on — and the final scene is never
   * relabelled. A replacement is a beat NO scene carries: the positional one when free, else the
   * nearest free beat forward of that position, then backward. "First unused in order" could hand a
   * late scene `gathering`, and a beat some later scene already holds would only move the duplicate.
   */
  const used = new Set<string>();
  const present = new Set(scenes.map((scene) => String(scene?.beat ?? "").trim().toLowerCase()).filter(Boolean));
  const lastIdx = scenes.length - 1;
  const free = (b: string): boolean => b !== "revelation" && !present.has(b) && !used.has(b);
  scenes.forEach((scene, idx) => {
    const beat = String(scene?.beat ?? "").trim().toLowerCase();
    if (!beat) return;
    if (!used.has(beat)) { used.add(beat); return; }
    if (beat === "revelation" || idx === lastIdx) return;
    const at = Math.min(idx, BEAT_ORDER.length - 1);
    const replacement = BEAT_ORDER.slice(at).find(free) ?? [...BEAT_ORDER.slice(0, at)].reverse().find(free);
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
