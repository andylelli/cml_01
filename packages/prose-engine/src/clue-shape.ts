/**
 * A clue's observable, shaped so it cannot be pasted in as narration (owner request 2026-10-02).
 *
 * MEASURED over the 25 v2 runs in logs/llm-prompts-full.jsonl: 71 of 459 clue lines in the writer's brief (15.5%)
 * reappear in the finished book as an 8-word verbatim span — 7 of 19 in run 5670, whose read flagged "Kenneth
 * Ingram was seen accessing…" as reading "like notes, not narration" (17 of 26 in run 98dec72a). The probe's
 * control (one clue line planted per book) raises the count by 26, so it sees copying.
 *
 * This model copies spans of seven words or more, and moves on a requirement's SHAPE where a prohibition does not
 * steer it (memory: voice fragments are copied, not matched; give a requirement a shape). So with CML_VERIFIED_FIXES
 * on, an observable of 8+ words is given as fragments of at most 6 words, split at clause boundaries and joined with
 * " / " — every word kept, in order; the ready-made sentence is gone.
 */

const MAX_WORDS = 6;
const BOUNDARY = /\s+(?=(?:where|with|while|which|that|after|before|because|whose|when|and|but|showing|suggesting|indicating|revealing)\b)/i;

const words = (s: string): string[] => s.trim().split(/\s+/).filter(Boolean);

/** Split a long observable into ≤6-word fragments at clause boundaries; a short one comes back unchanged. */
export function fragmentObservable(text: string): string {
  const clean = String(text ?? "").trim();
  if (words(clean).length < 8) return clean;
  const body = clean.replace(/[.!]+$/, "");
  const pieces: string[] = [];
  for (const clause of body.split(/\s*[,;:]\s*|\s+[—–]\s+/).filter(Boolean)) {
    for (const part of clause.split(BOUNDARY).filter(Boolean)) {
      const w = words(part);
      for (let i = 0; i < w.length; i += MAX_WORDS) pieces.push(w.slice(i, i + MAX_WORDS).join(" "));
    }
  }
  return pieces.join(" / ");
}

