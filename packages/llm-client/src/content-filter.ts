/**
 * A_71 (A_70 §5) — Azure content-filter refusals: detection + tally.
 *
 * MEASURED on the 07-27 run: 10 refusals, every one on an `Agent9-Regen-Ch*-missing_clue` prompt.
 * The blocked prompt carried the pipeline's OWN generated prose — *"a brass candlestick, its base
 * stained with something dark."* The pipeline generated content that its next call refused to
 * accept. One of three chapter-validation failures that run is attributable to it; two are not.
 *
 * The never-abort gate held and the story shipped, so the system degraded correctly. The problem is
 * that the class is INVISIBLE: no detector, no telemetry, no count — it exists only in raw logs.
 * It is premise-dependent (blunt-force weapon + staining), so it recurs on that story family and
 * silently injects unmodelled variance into any A/B whose replays regenerate that prose.
 *
 * This module does detection and counting only. Per A_70 §9 item 5 the class "needs telemetry
 * before it needs a fix" — a softening/retry policy is a separate, flag-gated increment that should
 * be designed against the counts this produces, not guessed at now.
 */

/**
 * Azure surfaces the refusal as a 400 whose message names the content management policy. Matching
 * is deliberately narrow: `content_filter` alone also appears in ordinary `finish_reason` telemetry
 * and in successful responses' filter-results blocks, so keying on that alone would over-count.
 */
const CONTENT_FILTER_PATTERNS: RegExp[] = [
  /content management policy/i,
  /response was filtered due to the prompt triggering/i,
  /\bResponsibleAIPolicyViolation\b/i,
  /\bcontent_filter\b.*\bprompt\b/i,
];

export function isContentFilterRefusal(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof (error as { message?: unknown }).message === "string"
          ? String((error as { message: string }).message)
          : "";
  if (!message) return false;
  return CONTENT_FILTER_PATTERNS.some((pattern) => pattern.test(message));
}

export interface ContentFilterRefusal {
  /** Agent label from the log context, e.g. `Agent9-Regen-Ch2-missing_clue`. */
  agent: string;
  model: string;
  message: string;
  timestamp: string;
}

export interface ContentFilterSummary {
  total: number;
  byAgent: Record<string, number>;
  /**
   * The agent-label prefix up to the chapter marker, e.g. `Agent9-Regen-missing_clue`. Chapter
   * numbers vary run to run; the FAMILY is what recurs and what a fix would target.
   */
  byFamily: Record<string, number>;
  refusals: ContentFilterRefusal[];
}

/** Strip the `-Ch<N>` segment so Ch2/Ch5/Ch6 refusals aggregate into one comparable family. */
export function contentFilterFamily(agent: string): string {
  return agent.replace(/-Ch\d+/gi, "").trim() || "unlabelled";
}

export class ContentFilterTracker {
  private refusals: ContentFilterRefusal[] = [];

  /** Records a refusal. Returns true when the error was a refusal (and was recorded). */
  record(error: unknown, agent: string | undefined, model: string): boolean {
    if (!isContentFilterRefusal(error)) return false;
    const message = error instanceof Error ? error.message : String(error);
    this.refusals.push({
      agent: agent && agent.length > 0 ? agent : "unlabelled",
      model,
      // Bounded: the useful signal is which call was refused, not the provider's full prose.
      message: message.slice(0, 400),
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  getSummary(): ContentFilterSummary {
    const byAgent: Record<string, number> = {};
    const byFamily: Record<string, number> = {};
    for (const refusal of this.refusals) {
      byAgent[refusal.agent] = (byAgent[refusal.agent] ?? 0) + 1;
      const family = contentFilterFamily(refusal.agent);
      byFamily[family] = (byFamily[family] ?? 0) + 1;
    }
    return {
      total: this.refusals.length,
      byAgent,
      byFamily,
      refusals: [...this.refusals],
    };
  }

  getTotal(): number {
    return this.refusals.length;
  }

  reset(): void {
    this.refusals = [];
  }
}
