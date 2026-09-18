/**
 * PROSE ENGINE v2 — TELEMETRY (ANALYSIS_99 §10.12).
 *
 * One block per run. Its first line is the assertion that makes v2 v2 — `deterministic writes: 0` —
 * because a law nobody checks is a comment, and this project has the receipts: A_84 traced every
 * reader-named "generated line" to one of our own passes, and the clue paste fired on 8 of 10
 * chapters of the last completed run while every flag said the pipeline was behaving.
 */

import { summariseEdits } from "./edits.js";
import { summariseFindings } from "./findings.js";
import { summariseSelection } from "./selector.js";
import type { ScoredDraft } from "./selector.js";
import type { BookContract, EditOutcome, Finding, SegmentPlan } from "./types.js";

export interface RunTelemetry {
  contract: BookContract;
  plan: SegmentPlan;
  selections: Array<{ segment: number; scored: ScoredDraft[]; chosen: ScoredDraft | null }>;
  findings: { anchored: Finding[]; discarded: Finding[]; criticMalformed: number };
  edits: EditOutcome[];
  deterministicWrites: number;
  costByRole: Record<string, number>;
  wallMs: number;
}

export const buildTelemetryBlock = (t: RunTelemetry): string[] => {
  const lines: string[] = [];
  lines.push(`[Agent 9 v2] deterministic writes: ${t.deterministicWrites}`);
  lines.push(
    `[Agent 9 v2] contract: ${t.contract.book.chapters} chapters, reveal ch${t.contract.roles.reveal}, ` +
      `test ch${t.contract.roles.discriminatingTest ?? "-"}, aftermath ch${t.contract.roles.aftermath ?? "-"}, ` +
      `bible ${t.contract.bible.tokens} tokens, brief ${t.contract.brief.tokens}`,
  );
  if (t.contract.notes.length > 0) {
    lines.push(`[Agent 9 v2] contract notes: ${t.contract.notes.slice(0, 6).join("; ")}`);
  }
  lines.push(`[Agent 9 v2] plan: ${t.plan.kind} — ${t.plan.reason}`);
  for (const selection of t.selections) {
    lines.push(`[Agent 9 v2] segment ${selection.segment} drafts:`);
    for (const line of summariseSelection(selection.scored, selection.chosen).split("\n")) {
      if (line.trim()) lines.push(`  ${line}`);
    }
  }
  lines.push(
    `[Agent 9 v2] findings: ${summariseFindings(t.findings.anchored, t.findings.discarded)}` +
      (t.findings.criticMalformed > 0 ? ` (critic malformed ${t.findings.criticMalformed})` : ""),
  );
  lines.push(`[Agent 9 v2] edits: ${summariseEdits(t.edits)}`);
  const cost = Object.entries(t.costByRole)
    .sort((a, b) => b[1] - a[1])
    .map(([role, usd]) => `${role} $${usd.toFixed(3)}`)
    .join(", ");
  lines.push(`[Agent 9 v2] cost: ${cost || "(unmeasured)"} in ${(t.wallMs / 60_000).toFixed(1)} min`);
  return lines;
};
