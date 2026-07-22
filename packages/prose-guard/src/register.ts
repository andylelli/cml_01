/**
 * A_65 Phase 1.5 — the EVIDENTIARY-REGISTER guard. A MEASURE, permanently (A_65 §4: detectors
 * are measures, contracts are levers). The corpus reads as machine-made partly because clue
 * material renders in data-sheet narration ("witnesses report…", "analysis of the salt shaker
 * suggests…") — the census shows the family RISING across eras (21%→33%→40% of shipped stories).
 * The FIX is the withheld-inference contract; this detector only counts, feeding the F5
 * telemetry and the per-probe measures TSV.
 *
 * THE FAMILY IS FROZEN AT BIRTH (the Item-17 law): a rising count under NEW phrasings means the
 * generation contract failed — fix the contract, never grow this list. Narration-scope only:
 * a character SAYING "the witnesses all confirm it" is legal dialogue.
 */

export interface RegisterHit {
  fragment: string;
}

const EVIDENTIARY_REGISTER_FAMILY: ReadonlyArray<RegExp> = [
  /\bwitness(?:es)? (?:report|recall|remember|confirm)\w*\b[^.!?]{0,60}/gi,
  /\banalysis (?:of [^.!?]{0,40})?(?:shows|suggests|indicates|reveals)\b[^.!?]{0,60}/gi,
  /\bstatements? confirm\w*\b[^.!?]{0,60}/gi,
  /\brecords? indicat\w*\b[^.!?]{0,60}/gi,
  /\blogs? confirm\w*\b[^.!?]{0,60}/gi,
];

/** Strip quoted dialogue spans so only narration is measured. */
const stripDialogue = (prose: string): string =>
  String(prose ?? "")
    .replace(/"[^"]*"/g, " ")
    .replace(/[“][^”]*[”]/g, " ");

/** Count evidentiary-register narration in the prose. Empty array = clean. */
export function detectEvidentiaryRegister(prose: string): RegisterHit[] {
  const narration = stripDialogue(prose);
  const hits: RegisterHit[] = [];
  for (const re of EVIDENTIARY_REGISTER_FAMILY) {
    re.lastIndex = 0;
    for (const m of narration.matchAll(re)) {
      hits.push({ fragment: m[0].trim().slice(0, 120) });
    }
  }
  return hits;
}
