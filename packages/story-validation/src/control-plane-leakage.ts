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
  { code: 'contract_term', pattern: /\bcontract\b/i, confidence: 'contextual', severity: 'major' },
  { code: 'instruction_shape', pattern: /\b(?:must include|required to|ensure that)\b/i, confidence: 'contextual', severity: 'major' },
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
