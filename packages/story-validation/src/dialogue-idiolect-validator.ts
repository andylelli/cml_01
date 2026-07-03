/**
 * A_61 RC5.3 — the deterministic dialogue-distinctiveness gate (D6 voice capsules reaching prose).
 *
 * Upstream (agent2b-voice-capsule) builds a VoiceCapsule per character whose most load-bearing marker is
 * its signature tic (speechTics[0]). This gate VERIFIES that idiolect in the generated prose, without an
 * LLM: (1) COVERAGE — each character with a signature tic uses it (or a speech tic) in ≥1 of their
 * attributed dialogue lines (warn-severity — dialogue attribution is heuristic, so a miss is a nudge, not
 * a failure); (2) LEAKAGE — no character's signature tic appears verbatim in ANOTHER character's attributed
 * line (error-severity — a verbatim tic in the wrong mouth is a strong voice-swap signal).
 *
 * Attribution is conservative: a quoted span is attributed only when exactly ONE capsule name appears in a
 * tight window around it next to an attribution verb; ambiguous spans are skipped, never misattributed —
 * so the gate can never fail good prose it merely cannot attribute. Pure; never throws.
 */

/** The slice of a VoiceCapsule this gate needs (kept local so story-validation stays acyclic). */
export interface DialogueVoiceCapsule {
  name: string;
  /** speechTics[0] is the signature tic; the rest are supporting tics. */
  speechTics: string[];
}

export interface DialogueIdiolectIssue {
  severity: "error" | "warn";
  type: "voice_tic_missing" | "voice_tic_leakage";
  message: string;
  speaker?: string;
}

export interface DialogueIdiolectResult {
  ok: boolean;
  issues: DialogueIdiolectIssue[];
  metrics: { speakersWithTic: number; ticLeakagePairs: number; distinctSignatures: number };
}

const ATTRIBUTION_VERB =
  /\b(said|asked|murmured|replied|whispered|continued|cried|called|added|began|insisted|admitted|declared|announced|exclaimed|muttered|snapped|observed|remarked|went\s+on|put\s+in)\b/i;

const normalizeQuotes = (s: string): string =>
  String(s ?? "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
const normalizeForMatch = (s: string): string => String(s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const surnameOf = (fullName: string): string => {
  const t = String(fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return t[t.length - 1] ?? "";
};

interface NameMatcher { name: string; re: RegExp; }
const buildNameMatchers = (capsules: ReadonlyArray<DialogueVoiceCapsule>): NameMatcher[] =>
  capsules
    .map((c) => String(c.name ?? "").trim())
    .filter(Boolean)
    .map((name) => {
      const surname = surnameOf(name);
      const alt = surname && surname.length >= 3 ? `${escapeRe(name)}|${escapeRe(surname)}` : escapeRe(name);
      return { name, re: new RegExp(`\\b(?:${alt})\\b`, "i") };
    });

interface AttributedSpan { speaker: string; text: string; }

/** Extract quoted spans attributed to exactly one capsule speaker (conservative; ambiguous → skipped). */
function attributedSpans(prose: string, matchers: NameMatcher[]): AttributedSpan[] {
  const text = normalizeQuotes(prose);
  const spans: AttributedSpan[] = [];
  const quoteRe = /"([^"]{1,600})"/g;
  let m: RegExpExecArray | null;
  while ((m = quoteRe.exec(text)) !== null) {
    const quote = m[1];
    // Bound the attribution window to the CURRENT sentence's tag clause, so it never bleeds into the next
    // sentence's speaker (which would make every span ambiguous). After: up to the next sentence stop or a
    // new quote (cap 45). Before: back to the previous stop or quote (cap 45).
    const afterFull = text.slice(m.index + m[0].length);
    const afterStop = afterFull.search(/[.!?"]/);
    const after = afterFull.slice(0, afterStop >= 0 ? Math.min(afterStop + 1, 45) : 45);
    const beforeFull = text.slice(0, m.index);
    const prevStop = Math.max(beforeFull.lastIndexOf("."), beforeFull.lastIndexOf("!"), beforeFull.lastIndexOf("?"), beforeFull.lastIndexOf('"'));
    const before = beforeFull.slice(prevStop >= 0 ? prevStop + 1 : Math.max(0, beforeFull.length - 45));
    const window = `${before}   ${after}`;
    if (!ATTRIBUTION_VERB.test(window)) continue;
    const named = matchers.filter((mm) => mm.re.test(window));
    if (named.length === 1) spans.push({ speaker: named[0].name, text: quote });
  }
  return spans;
}

/**
 * Verify dialogue idiolect in the assembled prose. `ok` is false only on LEAKAGE (a verbatim tic in the
 * wrong speaker's mouth). Missing coverage is warn-only. Empty capsules or prose → ok:true (nothing to gate).
 */
export function validateDialogueIdiolect(
  capsules: ReadonlyArray<DialogueVoiceCapsule>,
  prose: string,
): DialogueIdiolectResult {
  const issues: DialogueIdiolectIssue[] = [];
  const withTic = (capsules ?? []).filter((c) => c?.name && Array.isArray(c.speechTics) && normalizeForMatch(c.speechTics[0]).length >= 3);
  if (withTic.length === 0 || !String(prose ?? "").trim()) {
    return { ok: true, issues, metrics: { speakersWithTic: 0, ticLeakagePairs: 0, distinctSignatures: withTic.length } };
  }
  const matchers = buildNameMatchers(capsules);
  const spans = attributedSpans(prose, matchers);
  const bySpeaker = new Map<string, string>();
  for (const s of spans) {
    bySpeaker.set(s.speaker, `${bySpeaker.get(s.speaker) ?? ""}  ${normalizeForMatch(s.text)}`);
  }

  let speakersWithTic = 0;
  let ticLeakagePairs = 0;

  for (const cap of withTic) {
    const primaryTic = normalizeForMatch(cap.speechTics[0]);
    const anyTics = cap.speechTics.map(normalizeForMatch).filter((t) => t.length >= 3);
    const ownLines = bySpeaker.get(cap.name) ?? "";

    // COVERAGE (warn): the speaker uses their tic (or any supporting tic) in at least one attributed line.
    const covered = anyTics.some((t) => ownLines.includes(t));
    if (covered) speakersWithTic += 1;
    else if (ownLines) {
      // only nudge when we DID attribute lines to them (else we simply couldn't attribute — no signal)
      issues.push({ severity: "warn", type: "voice_tic_missing", speaker: cap.name, message: `${cap.name} does not use their signature tic in any attributed dialogue line.` });
    }

    // LEAKAGE (error): the primary tic appears verbatim in another speaker's attributed line.
    for (const [speaker, lines] of bySpeaker) {
      if (speaker === cap.name) continue;
      if (lines.includes(primaryTic)) {
        ticLeakagePairs += 1;
        issues.push({ severity: "error", type: "voice_tic_leakage", speaker, message: `${cap.name}'s signature tic appears in ${speaker}'s dialogue (voice-swap / cross-speaker leakage).` });
      }
    }
  }

  return {
    ok: ticLeakagePairs === 0,
    issues,
    metrics: { speakersWithTic, ticLeakagePairs, distinctSignatures: withTic.length },
  };
}
