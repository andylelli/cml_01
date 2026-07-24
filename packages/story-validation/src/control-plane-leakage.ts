export type LeakageConfidence = 'hard' | 'contextual' | 'watch';

export interface LeakagePattern {
  code: string;
  pattern: RegExp;
  confidence: LeakageConfidence;
  severity: 'critical' | 'major' | 'moderate';
}

export interface LeakageFinding {
  code: string;
  confidence: LeakageConfidence;
  severity: 'critical' | 'major' | 'moderate';
  excerpt: string;
  index: number;
}

export const CONTROL_PLANE_LEAKAGE_PATTERNS: LeakagePattern[] = [
  { code: 'validator_term', pattern: /\bvalidator\b/i, confidence: 'hard', severity: 'critical' },
  { code: 'retry_term', pattern: /\bretry\b/i, confidence: 'hard', severity: 'critical' },
  { code: 'fallback_term', pattern: /\bfallback\b/i, confidence: 'hard', severity: 'critical' },
  { code: 'stage_mode_term', pattern: /\bstage\s+mode\b/i, confidence: 'hard', severity: 'critical' },
  {
    code: 'metadata_label',
    pattern: /^(?:Setting|Location|Atmosphere|Weather|Mood|Tone|Theme|Scene|Chapter\s*progress|Validation|Validator|Retry|Fallback)\s*:/im,
    confidence: 'hard',
    severity: 'critical',
  },
  { code: 'obligation_term', pattern: /\bobligation\b/i, confidence: 'contextual', severity: 'major' },
  // Scaffold "contract" only — qualified to the obligation/chapter/prose/request/scene/clue/story
  // contract terminology. The bare word /\bcontract\b/ false-fired on the ordinary English verb/noun
  // ("the walls seem to contract", "a marriage contract") — common in period prose.
  {
    code: 'contract_term',
    pattern: /\b(?:obligation|chapter|prose|request|scene|clue|story|generation)[\s-]?contract(?:s|ual)?\b|\bcontract\s+(?:term|block|gate|requirement|obligation)s?\b/i,
    confidence: 'contextual',
    severity: 'major',
  },
  { code: 'instruction_shape', pattern: /\b(?:must include|required to|ensure that)\b/i, confidence: 'contextual', severity: 'major' },
  // Schema / outline-reasoning leakage: clue.description and points_to fields are
  // authored as analytical conclusions ("Eliminates X because… narrowing the
  // solution toward Y", "Direct evidence links… to the mechanism access point …
  // excludes competing suspect timelines"). When the model transcribes these
  // verbatim they read like a solver's worksheet, not prose. These are kept at
  // 'contextual'/'major' so a hit forces a regeneration via the major→hardErrors
  // path rather than hard-aborting mid-generation. Deliberately NOT including a
  // bare /discriminating test/ pattern — that phrase legitimately appears in
  // denouement dialogue and would false-positive.
  { code: 'reasoning_leak_eliminates', pattern: /^\s*Eliminates\b/im, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_narrowing', pattern: /\bnarrowing the solution\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_competing_timelines', pattern: /\b(?:excludes|exclude|excluding)\s+competing\s+(?:suspect\s+)?timelines\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_competing_timelines_noun', pattern: /\bcompeting\s+suspect\s+timelines\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_access_point', pattern: /\bmechanism\s+access\s+point\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_mechanism_specific', pattern: /\bmechanism-specific\s+evidence\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_direct_evidence', pattern: /\bdirect\s+evidence\s+(?:links|ties)\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'reasoning_leak_false_assumption', pattern: /\boverturning the false assumption\b/i, confidence: 'contextual', severity: 'major' },
  // A_68 DT-validation-leakage family. The deterministic SOURCE of these (deterministic-repair.ts DT
  // templates) is now rewritten to in-scene prose, so the primary channel is closed at source. These
  // patterns are a SHADOW backstop for LLM-produced variants (the "ambiguity than of misdirection"
  // reasoning leak has no deterministic source at all). Kept at 'watch' — detected + available to
  // telemetry, but NOT gating (lint.ts forwards only 'hard') — per the log-first/promote-after
  // discipline. Promote to 'contextual' once a corpus pass confirms no false-fire on legit denouement.
  { code: 'dt_validation_proved_theory', pattern: /\bproved one theory and ruled out the other\b/i, confidence: 'watch', severity: 'major' },
  { code: 'dt_validation_behaved_tested', pattern: /\bthe evidence (?:behaved|failed)\b[^.]{0,40}\b(?:when tested directly|under direct comparison)\b/i, confidence: 'watch', severity: 'major' },
  { code: 'reasoning_leak_ambiguity_misdirection', pattern: /\b(?:issue|matter|question) of ambiguity (?:rather |more )?than (?:of )?(?:deliberate )?misdirection\b/i, confidence: 'watch', severity: 'major' },
];

const sentenceAround = (text: string, index: number): string => {
  const start = Math.max(
    0,
    text.lastIndexOf('.', index - 1) + 1,
    text.lastIndexOf('!', index - 1) + 1,
    text.lastIndexOf('?', index - 1) + 1,
    text.lastIndexOf('\n', index - 1) + 1,
  );
  const sentenceEnds = ['.', '!', '?', '\n']
    .map((mark) => text.indexOf(mark, index + 1))
    .filter((pos) => pos >= 0);
  const end = sentenceEnds.length > 0 ? Math.min(...sentenceEnds) + 1 : Math.min(text.length, index + 180);
  return text.slice(start, end).replace(/\s+/g, ' ').trim().slice(0, 240);
};

export function detectControlPlaneLeakage(text: string): LeakageFinding[] {
  const findings: LeakageFinding[] = [];
  const source = String(text ?? '');
  if (!source.trim()) return findings;

  for (const entry of CONTROL_PLANE_LEAKAGE_PATTERNS) {
    const flags = entry.pattern.flags.includes('g') ? entry.pattern.flags : `${entry.pattern.flags}g`;
    const pattern = new RegExp(entry.pattern.source, flags);
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(source)) !== null) {
      const index = match.index;
      findings.push({
        code: entry.code,
        confidence: entry.confidence,
        severity: entry.severity,
        excerpt: sentenceAround(source, index),
        index,
      });
      if (match[0].length === 0) pattern.lastIndex += 1;
    }
  }

  return findings;
}

export function hasHardControlPlaneLeakage(text: string): boolean {
  return detectControlPlaneLeakage(text).some((finding) => finding.confidence === 'hard');
}

// ---------------------------------------------------------------------------
// Verbatim field-echo detector
//
// Agent9 is fed schema fields (clue.description, clue.pointsTo,
// discriminating_test.design) as "mandatory prose to surface". The model
// frequently transcribes these analytical sentences VERBATIM into the prose
// (e.g. "A controlled reenactment demonstrates the grandfather clock's spring
// tension and hand positions under normal winding versus tampered winding
// conditions, using the found winding key and clock mechanism"). The existing
// pattern-based leakage detector cannot catch these because the wording varies
// per story. This detector is name-agnostic and data-driven: it flags any
// chapter that reproduces a long CONTIGUOUS span of a fed field verbatim.
//
// A run of >= minRun consecutive words shared with a fed field is effectively
// never produced by legitimate paraphrase, while short locked facts ("ten
// minutes past eleven", "forty minutes") fall under the threshold and are not
// flagged — so the gate does not fight the locked-fact / clue-presence rules.
// ---------------------------------------------------------------------------

export interface FieldEchoFinding {
  /** A short label for the fed field that was echoed. */
  source: string;
  /** The verbatim span (in normalized words) found in the prose. */
  span: string;
  /** Number of consecutive words in the matched span. */
  wordCount: number;
}

const echoTokens = (value: unknown): string[] =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

export function detectVerbatimFieldEcho(
  prose: string,
  fedStrings: Array<string | null | undefined>,
  minRun = 12,
): FieldEchoFinding[] {
  const proseJoined = ` ${echoTokens(prose).join(' ')} `;
  if (proseJoined.trim().length === 0) return [];

  const findings: FieldEchoFinding[] = [];
  const seenSpans = new Set<string>();

  for (const raw of fedStrings) {
    const fieldTokens = echoTokens(raw);
    if (fieldTokens.length < minRun) continue;

    for (let i = 0; i + minRun <= fieldTokens.length; i++) {
      const window = fieldTokens.slice(i, i + minRun).join(' ');
      if (proseJoined.includes(` ${window} `)) {
        // Extend the matched run as far as it stays verbatim, to report the full span.
        let j = i + minRun;
        while (
          j < fieldTokens.length &&
          proseJoined.includes(` ${fieldTokens.slice(i, j + 1).join(' ')} `)
        ) {
          j++;
        }
        const span = fieldTokens.slice(i, j).join(' ');
        if (!seenSpans.has(span)) {
          seenSpans.add(span);
          findings.push({
            source: String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, 70),
            span,
            wordCount: j - i,
          });
        }
        break; // one finding per fed string is enough to force a rewrite
      }
    }
  }

  return findings;
}
