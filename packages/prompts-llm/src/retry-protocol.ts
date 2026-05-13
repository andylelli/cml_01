export type RetryFailureClass =
  | "encoding"
  | "structure"
  | "clue_timing"
  | "continuity"
  | "completeness"
  | "template"
  | "tone_pacing"
  | "fair_play"
  | "unknown";

export interface RetryPacket {
  attempt: number;
  failureClass: RetryFailureClass;
  failedGates: string[];
  mustFix: string[];
  warningsToClear: string[];
  maxRetries: number;
  shouldEscalate: boolean;
  deterministicMitigation?: {
    type: "split_chapter" | "freshen_atoms" | "tighten_obligation" | "structural_pivot" | "none";
    params?: Record<string, unknown>;
  };
}

const classifySingle = (error: string): RetryFailureClass => {
  const e = error.toLowerCase();
  if (/mojibake|encoding|utf-8|control char/.test(e)) return "encoding";
  if (/template linter|opening-style entropy|ngram|paragraph fingerprint|prompt leakage/.test(e)) return "template";
  if (/chapter\.paragraphs|chapter\.title|\bstructure\b|\bformat\b|has only \d+ paragraph/.test(e)) return "structure";
  if (/clue timing|clue visibility|discriminating test|missing clue|revealed without evidence|evidence anchor/.test(e)) return "clue_timing";
  if (/pronoun|continuity|name mismatch|timeline/.test(e)) return "continuity";
  if (/word count|underflow|completeness|minimum words|hard floor/.test(e)) return "completeness";
  if (/tone|pacing|register/.test(e)) return "tone_pacing";
  if (/fair-play|discriminating|no withholding|spoiler/.test(e)) return "fair_play";
  return "unknown";
};

const rank: Record<RetryFailureClass, number> = {
  fair_play: 100,
  clue_timing: 95,
  completeness: 90,
  structure: 88,
  continuity: 80,
  encoding: 70,
  template: 60,
  tone_pacing: 50,
  unknown: 0,
};

export function classifyFailure(args: {
  validationErrors: string[];
  attempt: number;
  maxRetries: number;
  priorPackets: RetryPacket[];
}): RetryPacket {
  const { validationErrors, attempt, maxRetries, priorPackets } = args;

  const candidates = validationErrors.map(classifySingle);
  const hasTemplateSignals = candidates.includes("template");
  const hasClueTimingSignals = candidates.includes("clue_timing");
  // Pillar 6 (Unit 6.3): detect specifically a paragraph_fingerprint signal so we can
  // escalate to structural_pivot on the second consecutive fingerprint failure.
  const hasFingerprintSignals = validationErrors.some((e) => /paragraph fingerprint/i.test(e));
  const failureClass = candidates.sort((a, b) => rank[b] - rank[a])[0] ?? "unknown";

  const repeatedClass =
    priorPackets.length > 0 && priorPackets[priorPackets.length - 1].failureClass === failureClass;

  const shouldEscalate = attempt >= maxRetries || (repeatedClass && attempt >= 2);

  let deterministicMitigation: RetryPacket["deterministicMitigation"] = { type: "none" as const };
  if (shouldEscalate) {
    if (failureClass === "completeness" || failureClass === "structure") {
      deterministicMitigation = { type: "split_chapter" as const, params: { minParagraphs: 4 } };
    } else if (failureClass === "template") {
      // Pillar 6 (Unit 6.3): when a paragraph_fingerprint fires on attempt ≥ 2 (i.e. the
      // same fingerprint failure on consecutive attempts), escalate to structural_pivot so
      // agent9-prose.ts can inject forbidden-opening and positional-freeze constraints.
      if (hasFingerprintSignals && attempt >= 2) {
        deterministicMitigation = {
          type: "structural_pivot" as const,
          params: {},
        };
      } else {
        deterministicMitigation = {
          type: "freshen_atoms" as const,
          params: {
            tightenObligation: hasClueTimingSignals,
          },
        };
      }
    } else if (
      failureClass === "clue_timing"
      || failureClass === "continuity"
      || failureClass === "fair_play"
    ) {
      deterministicMitigation = {
        type: "tighten_obligation" as const,
        params: {
          freshenAtoms: hasTemplateSignals,
          diversifyStructure: hasTemplateSignals,
        },
      };
    }
  }

  const mustFix = [
    `Resolve ${failureClass} issues before accepting this batch.`,
    ...validationErrors.slice(0, 4),
  ];

  return {
    attempt,
    failureClass,
    failedGates: validationErrors.slice(0, 8),
    mustFix,
    warningsToClear: validationErrors.slice(4, 8),
    maxRetries,
    shouldEscalate,
    deterministicMitigation,
  };
}

export function buildRetryFeedback(packet: RetryPacket): string {
  const lines: string[] = [];
  lines.push(`RETRY CLASS: ${packet.failureClass}`);
  lines.push(`ATTEMPT: ${packet.attempt}/${packet.maxRetries}`);
  lines.push("MANDATORY FIXES:");
  for (const item of packet.mustFix) {
    lines.push(`- ${item}`);
  }
  if (packet.warningsToClear.length > 0) {
    lines.push("SECONDARY FIXES:");
    for (const warning of packet.warningsToClear) {
      lines.push(`- ${warning}`);
    }
  }
  if (packet.deterministicMitigation && packet.deterministicMitigation.type !== "none") {
    lines.push(`MITIGATION MODE: ${packet.deterministicMitigation.type}`);
  }
  return lines.join("\n");
}

export function shouldContinueRetry(packet: RetryPacket, priorPackets: RetryPacket[]): boolean {
  if (packet.attempt >= packet.maxRetries) return false;
  if (packet.shouldEscalate) return false;
  if (priorPackets.length < 1) return true;
  const previous = priorPackets[priorPackets.length - 1];
  if (previous.failureClass === packet.failureClass && packet.attempt >= 2) {
    return false;
  }
  return true;
}
