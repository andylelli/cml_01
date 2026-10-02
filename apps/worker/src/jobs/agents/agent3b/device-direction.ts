/**
 * The clock's DIRECTION, repaired at source (owner request 2026-10-02, from the external read of seed 5670).
 *
 * A tampered clock that SHOWS an earlier time than the true one was set BACK; one that shows a later time was set
 * FORWARD. Agent 3b writes both the times (as locked facts) and the story of the tampering (as prose fields), and
 * nothing compared them. MEASURED over the 114 archived device artifacts (`data/store.json`): 7 have a false/true
 * clock pair AND a direction word, and 2 of the 7 contradict their own times — including run 5670's
 * ("a quarter to six" shown against a true "six o'clock" — set back — in a device that says "wound forward
 * exactly by thirty minutes"). The reader marked it: "If the true time is 6:00 and the foyer clock shows 5:45, then
 * the foyer clock has been set back fifteen minutes, not forward." The probe's control (every expectation
 * inverted) turns the other 5 into contradictions, so it reads direction words at all.
 *
 * The locked TIMES are the truth here (as X38 treats them); the direction words follow. Only sentences that talk
 * about a clock, watch, hands, dial or time are touched. Magnitude is X38's (declared derivations); this is
 * direction only.
 */

const FALSE_RE = /false|displayed|shown|clock_time|lobby_clock|apparent|staged/i;
const TRUE_RE = /actual|real|true_time|time_of_death|died/i;
const CLOCKISH = /\b(clock|watch|hands?|dial|time|timepiece|minute)\b/i;

type Fact = { id?: unknown; value?: unknown; description?: unknown };
export type Direction = "forward" | "back";

/** The false (displayed) and true clock facts, as A_80 F15 reads them. */
export function falseAndTrueClocks(
  facts: ReadonlyArray<Fact>,
  parseClock: (s: string) => number | null,
): { shown: number; truth: number; shownText: string; truthText: string } | null {
  const label = (f: Fact) => `${String(f.id ?? "")} ${String(f.description ?? "")}`;
  const clocks = facts
    .map((f) => ({ f, m: parseClock(String(f.value ?? "")) }))
    .filter((c): c is { f: Fact; m: number } => c.m !== null);
  const shown = clocks.find((c) => FALSE_RE.test(label(c.f)));
  const truth = clocks.find((c) => TRUE_RE.test(label(c.f)) && c.f.id !== shown?.f.id);
  if (!shown || !truth) return null;
  return { shown: shown.m, truth: truth.m, shownText: String(shown.f.value), truthText: String(truth.f.value) };
}

/** forward when the clock shows LATER than the truth, back when earlier (12-hour dial, shortest way round). */
export function expectedDirection(shownMinutes: number, trueMinutes: number): Direction | null {
  let s = (((shownMinutes - trueMinutes) % 720) + 720) % 720;
  if (s > 360) s -= 720;
  return s === 0 ? null : s > 0 ? "forward" : "back";
}

const VERB = "(?:wound|set|turned|moved|put|pushed|nudged|wind|set|turn|move|put|push|nudge|winding|setting|turning|moving|putting|pushing)";
const FWD_PHRASE = new RegExp(`\\b(${VERB}\\s+(?:[\\w’']+\\s+){0,3}?)(forward|ahead)\\b`, "gi");
const BACK_PHRASE = new RegExp(`\\b(${VERB}\\s+(?:[\\w’']+\\s+){0,3}?)(backwards?|back)\\b`, "gi");

/** Rewrite one sentence's direction words to `want`. Returns the sentence unchanged when it says nothing wrong. */
function fixSentence(sentence: string, want: Direction): string {
  if (!CLOCKISH.test(sentence)) return sentence;
  if (want === "back") {
    return sentence
      // a doubled phrase first ("advanced forward" — run canary_1788155622369), or it becomes "set back forward"
      .replace(/\badvanc(?:ed|es|ing|e)\s+(?:forward|ahead)\b/gi, (w) => (w[0] === "A" ? "Set back" : "set back"))
      .replace(FWD_PHRASE, (_m, lead: string) => `${lead}back`)
      .replace(/\badvanced\b/gi, (w) => (w[0] === "A" ? "Set back" : "set back"))
      .replace(/\badvances\b/gi, (w) => (w[0] === "A" ? "Sets back" : "sets back"))
      .replace(/\badvancing\b/gi, (w) => (w[0] === "A" ? "Setting back" : "setting back"))
      .replace(/\badvance\b/gi, (w) => (w[0] === "A" ? "Set back" : "set back"));
  }
  return sentence
    .replace(/\brewound\s+(?:back|backwards?)\b/gi, (w) => (w[0] === "R" ? "Wound forward" : "wound forward"))
    .replace(BACK_PHRASE, (_m, lead: string) => `${lead}forward`)
    .replace(/\brewound\b/gi, (w) => (w[0] === "R" ? "Wound forward" : "wound forward"))
    .replace(/\brewinds\b/gi, (w) => (w[0] === "R" ? "Winds forward" : "winds forward"))
    .replace(/\brewinding\b/gi, (w) => (w[0] === "R" ? "Winding forward" : "winding forward"));
}

/** Does this text state the OPPOSITE of `want` anywhere a clock is mentioned? */
export function contradictsDirection(text: string, want: Direction): boolean {
  return fixText(text, want) !== text;
}

/** Rewrite every clock sentence of `text` to `want`. Sentences are split on terminal punctuation. */
export function fixText(text: string, want: Direction): string {
  return text.replace(/[^.!?;]+[.!?;]*/g, (sentence) => fixSentence(sentence, want));
}

/**
 * Repair the direction words in a device's prose fields (every string, recursively; lockedFacts' values and ids
 * are never touched — only descriptions). Returns the fields that changed, as "field: before → after" snippets.
 */
export function repairDeviceDirection(device: Record<string, unknown>, want: Direction): string[] {
  const changed: string[] = [];
  const walk = (node: unknown, path: string): unknown => {
    if (typeof node === "string") {
      const fixed = fixText(node, want);
      if (fixed !== node) changed.push(`${path}: "${node.slice(0, 80)}" → "${fixed.slice(0, 80)}"`);
      return fixed;
    }
    if (Array.isArray(node)) return node.map((v, i) => walk(v, `${path}[${i}]`));
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        const here = path ? `${path}.${k}` : k;
        if (k === "lockedFacts" && Array.isArray(v)) {
          // A locked fact's value and id are the truth this repair reads; only its description is prose.
          out[k] = v.map((f, i) => (f && typeof f === "object"
            ? { ...(f as Record<string, unknown>), description: walk((f as Record<string, unknown>).description, `${here}[${i}].description`) }
            : f));
        } else {
          out[k] = walk(v, here);
        }
      }
      return out;
    }
    return node;
  };
  const repaired = walk(device, "") as Record<string, unknown>;
  for (const k of Object.keys(device)) delete device[k];
  Object.assign(device, repaired);
  return changed;
}

/** Does any prose string of the device (each on its own — never the JSON, whose "sentences" cross fields) contradict? */
export function deviceContradicts(device: unknown, want: Direction): boolean {
  if (typeof device === "string") return contradictsDirection(device, want);
  if (Array.isArray(device)) return device.some((v) => deviceContradicts(v, want));
  if (device && typeof device === "object") {
    return Object.entries(device as Record<string, unknown>).some(([k, v]) =>
      k === "lockedFacts" && Array.isArray(v)
        ? v.some((f) => deviceContradicts((f as Record<string, unknown> | null)?.description, want))
        : deviceContradicts(v, want));
  }
  return false;
}
