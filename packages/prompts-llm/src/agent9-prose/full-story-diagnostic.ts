/**
 * agent9-prose/full-story-diagnostic.ts
 *
 * A_69 §5 Increment 3 — whole-story READ-ONLY diagnostic → per-chapter guarded edit.
 *
 * The problem: `runFullStoryRepetitionPolish` gives the pipeline its only cross-chapter view, but it is
 * driven by a deterministic repetition map — so it sees recurring n-grams and opening monotony, and
 * nothing else. Pacing drift, an escalation that never arrives, a motif abandoned after chapter 3, a
 * voice that slips register — no detector models these, and a per-chapter pass cannot see them by
 * construction.
 *
 * The shape (A_69 §3): the model reads GLOBALLY and writes LOCALLY.
 *   Pass 1  all chapters in (~20k tok), a small findings list out (~1.5k tok). ZERO prose emitted.
 *   Pass 2  each flagged chapter goes through a per-chapter guarded rewrite — same rollback discipline
 *           as the repetition polish (`hasRepetitionRewriteRegression`).
 *
 * Output is the expensive half of an LLM bill and the only half that can drift, so the diagnostic call
 * buys the whole-story view at input-token prices and never risks a word of prose.
 *
 * NON-NEGOTIABLE, mirroring the passes this sits beside:
 *  - ANCHORED FINDINGS ONLY. A finding whose `quote` is not present verbatim in the chapter it names is
 *    DISCARDED, not repaired. No unanchored global judgement is allowed to reach an edit — that is the
 *    difference between this and the one-shot whole-story rewrite the doc rejects.
 *  - The same self-contained rollback guard: locked values, cast names, number/time tokens, length.
 *  - Best-effort throughout. Any failure keeps the committed chapters. Never introduces abort risk
 *    (§2.8 never-abort release gate).
 *  - Flag-gated, default OFF, resolved through a RUNTIME getter (`module-const-flags-frozen-before-dotenv`).
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import { parseProseResponse } from "./sanitization.js";
import { hasRepetitionRewriteRegression } from "./post-pass-polish.js";
import { resolveStageModel } from "./model-tiering.js";
import type { ProseChapter } from "./types.js";

/**
 * The fixed finding vocabulary. A closed enum (rather than free text) is what makes the findings
 * routable and the shadow-mode telemetry countable; anything outside it is dropped at parse time.
 */
export const FULL_STORY_FINDING_CLASSES = [
  "pacing_drift",
  "tonal_escalation_missing",
  "motif_abandoned",
  "voice_inconsistency",
  "flat_reveal",
] as const;

export type FullStoryFindingClass = (typeof FULL_STORY_FINDING_CLASSES)[number];

export interface FullStoryFinding {
  /** 1-based chapter number the finding is anchored to. */
  chapter: number;
  /** Verbatim excerpt from that chapter. The anchor — an unmatched quote discards the finding. */
  quote: string;
  findingClass: FullStoryFindingClass;
  /** One line on what is wrong and what the chapter should do instead. */
  note: string;
}

export type FullStoryDiagnosticMode = "off" | "shadow" | "apply";

/**
 * Runtime getter — never a module const (`module-const-flags-frozen-before-dotenv`: a const would
 * freeze before dotenv populates the env and the lever would silently never fire).
 *
 * off (default) · shadow = run the diagnostic, log findings, change nothing · apply = also rewrite.
 * Any unrecognised value is treated as `off`; `true`/`1` map to `shadow`, deliberately NOT `apply` —
 * a lever this new should never start editing prose because someone set it to a boolean.
 */
export const resolveFullStoryDiagnosticMode = (): FullStoryDiagnosticMode => {
  const raw = String(process.env.AGENT9_FULLSTORY_DIAGNOSTIC ?? "").trim().toLowerCase();
  if (raw === "apply") return "apply";
  if (raw === "shadow" || raw === "true" || raw === "1") return "shadow";
  return "off";
};

const chapterFullText = (chapter: ProseChapter): string => (chapter.paragraphs ?? []).join("\n\n");

/**
 * Anchor-matching normalisation. The model re-types a quote rather than copying bytes, so straight vs
 * curly quotes, en/em dashes and collapsed whitespace are expected drift and must not fail an anchor —
 * while the WORDS still have to match, which is what makes this an anchor and not a vibe.
 */
const normalizeForAnchor = (value: string): string =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

/** Shortest quote we will accept as an anchor — below this, a match proves nothing. */
const MIN_ANCHOR_CHARS = 12;

export interface ParsedFullStoryFindings {
  findings: FullStoryFinding[];
  /** Entries dropped for a malformed shape or an unknown class, before anchoring. */
  malformed: number;
}

/**
 * Tolerant parse of the diagnostic response. Accepts `{findings:[...]}` or a bare array; drops any
 * entry that is not a well-formed finding over the closed class enum. Never throws.
 */
export const parseFullStoryFindings = (raw: string): ParsedFullStoryFindings => {
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    const match = String(raw ?? "").match(/[[{][\s\S]*[\]}]/);
    if (!match) return { findings: [], malformed: 0 };
    try {
      payload = JSON.parse(match[0]);
    } catch {
      return { findings: [], malformed: 0 };
    }
  }

  const rows: unknown[] = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { findings?: unknown })?.findings)
      ? ((payload as { findings: unknown[] }).findings)
      : [];

  const findings: FullStoryFinding[] = [];
  let malformed = 0;
  for (const row of rows) {
    const entry = row as Record<string, unknown> | null;
    if (!entry || typeof entry !== "object") {
      malformed += 1;
      continue;
    }
    const chapter = Number(entry.chapter);
    const quote = String(entry.quote ?? "").trim();
    const findingClass = String(entry.findingClass ?? entry.class ?? "").trim().toLowerCase();
    const note = String(entry.note ?? "").trim();
    if (
      !Number.isInteger(chapter)
      || chapter < 1
      || quote.length < MIN_ANCHOR_CHARS
      || !FULL_STORY_FINDING_CLASSES.includes(findingClass as FullStoryFindingClass)
    ) {
      malformed += 1;
      continue;
    }
    findings.push({ chapter, quote, findingClass: findingClass as FullStoryFindingClass, note });
  }
  return { findings, malformed };
};

export interface AnchoredFindings {
  anchored: FullStoryFinding[];
  /** Findings whose quote was absent from the chapter they named — the hallucination channel. */
  discarded: FullStoryFinding[];
}

/**
 * Discard any finding whose quote is not present in the chapter it names. This is the load-bearing
 * guard of the whole increment: it converts a global judgement into a claim about a specific span of
 * text that either exists or does not.
 */
export const anchorFullStoryFindings = (args: {
  findings: ReadonlyArray<FullStoryFinding>;
  chapters: ReadonlyArray<ProseChapter>;
}): AnchoredFindings => {
  const normalizedChapters = args.chapters.map((chapter) => normalizeForAnchor(chapterFullText(chapter)));
  const anchored: FullStoryFinding[] = [];
  const discarded: FullStoryFinding[] = [];
  for (const finding of args.findings) {
    const body = normalizedChapters[finding.chapter - 1];
    const needle = normalizeForAnchor(finding.quote);
    if (body && needle.length >= MIN_ANCHOR_CHARS && body.includes(needle)) {
      anchored.push(finding);
    } else {
      discarded.push(finding);
    }
  }
  return { anchored, discarded };
};

export const buildFullStoryDiagnosticPrompt = (args: {
  chapters: ReadonlyArray<ProseChapter>;
}): string => {
  const lines: string[] = [];
  lines.push("WHOLE-STORY DIAGNOSTIC — READ ONLY");
  lines.push("You are reading a complete mystery novella end to end. You are a diagnostician, not an editor.");
  lines.push("DO NOT rewrite, polish, or reproduce ANY prose. Emit findings only.");
  lines.push("");
  lines.push("Report only defects that require reading the WHOLE story to see — a per-chapter editor");
  lines.push("has already passed over each chapter alone, so anything visible inside a single chapter is");
  lines.push("out of scope. Classify each finding as exactly one of:");
  lines.push("- pacing_drift — a stretch that slackens or rushes relative to the story's own established rhythm");
  lines.push("- tonal_escalation_missing — tension that should have tightened here but reads flat against earlier chapters");
  lines.push("- motif_abandoned — an image, object, or refrain established earlier and then silently dropped");
  lines.push("- voice_inconsistency — narration or a character's register that departs from how it reads elsewhere");
  lines.push("- flat_reveal — a disclosure that lands without the weight the preceding chapters set up");
  lines.push("");
  lines.push("ANCHORING — MANDATORY");
  lines.push("Every finding MUST quote a span of at least a dozen characters copied VERBATIM from the chapter");
  lines.push("it names. A finding whose quote does not appear in that chapter is discarded automatically, so an");
  lines.push("approximate or remembered quote is worse than no finding at all. Quote what is on the page.");
  lines.push("");
  lines.push("Report at most 12 findings, strongest first. Fewer is better than padded — if the story holds");
  lines.push("together on an axis, say nothing about that axis. An empty list is a valid and useful answer.");
  lines.push("");
  lines.push("OUTPUT — JSON only, no commentary:");
  lines.push('{"findings":[{"chapter":<int>,"quote":"<verbatim excerpt>","findingClass":"<one of the five>","note":"<one line: what is wrong and what the chapter should do instead>"}]}');
  lines.push("");
  lines.push("STORY");
  for (let i = 0; i < args.chapters.length; i += 1) {
    const chapter = args.chapters[i];
    lines.push("");
    lines.push(`--- CHAPTER ${i + 1}: ${chapter?.title ?? ""}`);
    lines.push(chapterFullText(chapter));
  }
  return lines.join("\n");
};

export interface FullStoryDiagnosticResult {
  mode: FullStoryDiagnosticMode;
  findings: FullStoryFinding[];
  discarded: FullStoryFinding[];
  malformed: number;
  /** True when the diagnostic call itself failed — distinct from "ran and found nothing". */
  failed: boolean;
}

/**
 * Pass 1 — one whole-story call that emits findings and no prose. Never throws.
 */
export const runFullStoryDiagnostic = async (args: {
  chapters: ReadonlyArray<ProseChapter>;
  client: AzureOpenAIClient;
  model?: string;
  runId?: string;
  projectId?: string;
  mode: FullStoryDiagnosticMode;
}): Promise<FullStoryDiagnosticResult> => {
  const empty: FullStoryDiagnosticResult = {
    mode: args.mode,
    findings: [],
    discarded: [],
    malformed: 0,
    failed: false,
  };
  if (args.mode === "off" || args.chapters.length === 0) return empty;

  let content: string;
  try {
    const response = await args.client.chat({
      messages: [
        {
          role: "system",
          content: "Diagnose cross-chapter craft defects in a finished novella. Emit JSON findings only — never prose.",
        },
        { role: "user", content: buildFullStoryDiagnosticPrompt({ chapters: args.chapters }) },
      ],
      // Read-only stage: the whole story goes IN, a short findings list comes OUT. The low token
      // ceiling is the guardrail that keeps it from ever emitting a rewritten chapter.
      model: resolveStageModel("polish", args.model),
      temperature: 0.2,
      maxTokens: 2000,
      jsonMode: true,
      logContext: {
        runId: args.runId ?? "",
        projectId: args.projectId ?? "",
        agent: "Agent9-FullStoryDiagnostic",
        retryAttempt: 1,
      },
    });
    content = String(response?.content ?? "");
  } catch {
    return { ...empty, failed: true };
  }

  const parsed = parseFullStoryFindings(content);
  const { anchored, discarded } = anchorFullStoryFindings({
    findings: parsed.findings,
    chapters: args.chapters,
  });
  return {
    mode: args.mode,
    findings: anchored,
    discarded,
    malformed: parsed.malformed,
    failed: false,
  };
};

export const buildDiagnosticRepairPrompt = (args: {
  chapter: ProseChapter;
  findings: ReadonlyArray<FullStoryFinding>;
  lockedValues: ReadonlyArray<string>;
}): string => {
  const lines: string[] = [];
  lines.push("CROSS-CHAPTER CRAFT REPAIR");
  lines.push("A whole-story read flagged the specific spans below in THIS chapter. Address each one where it");
  lines.push("appears, and change nothing else in the chapter.");
  lines.push("Preserve every named character, clue, alibi, clearance, number, time, and date exactly.");
  lines.push("Do not shorten the chapter, reorder events, add facts, or alter who is implicated or cleared.");
  lines.push("");
  lines.push("FLAGGED SPANS");
  for (const finding of args.findings.slice(0, 6)) {
    lines.push(`- [${finding.findingClass}] "${finding.quote}"`);
    if (finding.note) lines.push(`  → ${finding.note}`);
  }
  if (args.lockedValues.length > 0) {
    lines.push("");
    lines.push("MANDATED — reproduce these EXACT phrases verbatim; never vary them:");
    for (const value of args.lockedValues.slice(0, 12)) lines.push(`- "${value}"`);
  }
  lines.push("");
  lines.push("OUTPUT RULES");
  lines.push("- Return full corrected JSON for exactly one chapter, same title.");
  lines.push("- Preserve the narrative voice and period register — this is a craft repair, not a re-voicing.");
  lines.push("- If addressing a span would risk any factual or logical change, keep the original wording.");
  return lines.join("\n");
};

export interface FullStoryDiagnosticApplyResult {
  chapters: ProseChapter[];
  editedChapters: number[];
  rolledBackChapters: number[];
}

/**
 * Pass 2 — per-chapter guarded rewrite driven by the anchored findings. Only runs in `apply` mode.
 *
 * Cost bound: at most `maxChapters` chapters are edited (default 5), chapters carrying the most
 * findings first — so a diagnostic that flags every chapter cannot fan out into a whole-story rewrite
 * through the back door.
 */
export const applyFullStoryDiagnosticFindings = async (args: {
  chapters: ProseChapter[];
  findings: ReadonlyArray<FullStoryFinding>;
  client: AzureOpenAIClient;
  model?: string;
  runId?: string;
  projectId?: string;
  lockedValues: ReadonlyArray<string>;
  castNames: ReadonlyArray<string>;
  maxChapters?: number;
}): Promise<FullStoryDiagnosticApplyResult> => {
  const chapters = [...args.chapters];
  const editedChapters: number[] = [];
  const rolledBackChapters: number[] = [];
  if (args.findings.length === 0) return { chapters, editedChapters, rolledBackChapters };

  const byChapter = new Map<number, FullStoryFinding[]>();
  for (const finding of args.findings) {
    const list = byChapter.get(finding.chapter) ?? [];
    list.push(finding);
    byChapter.set(finding.chapter, list);
  }

  const cap = Math.max(1, args.maxChapters ?? 5);
  const targets = Array.from(byChapter.entries())
    .filter(([chapterNumber]) => chapterNumber >= 1 && chapterNumber <= chapters.length)
    .sort((a, b) => b[1].length - a[1].length || a[0] - b[0])
    .slice(0, cap)
    .sort((a, b) => a[0] - b[0]);

  for (const [chapterNumber, findings] of targets) {
    const index = chapterNumber - 1;
    const original = chapters[index];
    if (!Array.isArray(original?.paragraphs) || original.paragraphs.length === 0) continue;

    let candidate: ProseChapter | undefined;
    try {
      const response = await args.client.chat({
        messages: [
          {
            role: "system",
            content: "Repair flagged craft defects in one chapter without changing any story fact, name, number, or logic.",
          },
          {
            role: "user",
            content: `${buildDiagnosticRepairPrompt({
              chapter: original,
              findings,
              lockedValues: args.lockedValues,
            })}\n\nSOURCE CHAPTER JSON\n${JSON.stringify({ status: "draft", chapters: [original] }, null, 2)}`,
          },
        ],
        model: resolveStageModel("polish", args.model),
        temperature: 0.3,
        maxTokens: 5000,
        jsonMode: true,
        logContext: {
          runId: args.runId ?? "",
          projectId: args.projectId ?? "",
          agent: `Agent9-FullStoryDiagnosticRepair-Ch${chapterNumber}`,
          retryAttempt: 1,
        },
      });
      candidate = parseProseResponse(response.content).chapters?.[0];
    } catch {
      candidate = undefined;
    }

    if (!candidate || !Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
      rolledBackChapters.push(chapterNumber);
      continue;
    }
    // Same self-contained guard the repetition polish uses: locked values, cast names, number/time
    // tokens and length all survive, or the chapter reverts to its committed text.
    if (
      hasRepetitionRewriteRegression({
        original,
        rewritten: candidate,
        lockedValues: args.lockedValues,
        castNames: args.castNames,
      })
    ) {
      rolledBackChapters.push(chapterNumber);
      continue;
    }
    chapters[index] = candidate;
    editedChapters.push(chapterNumber);
  }

  return { chapters, editedChapters, rolledBackChapters };
};
