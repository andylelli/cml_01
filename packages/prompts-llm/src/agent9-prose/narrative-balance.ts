/**
 * agent9-prose/narrative-balance.ts
 * Shared stage-mode narrative balance helpers used by prompt, retry, and polish flows.
 */
import { getGenerationParams } from "@cml/story-validation";
import { formatStageModeLabel } from "./clue-validation.js";
import type { StageModeKey } from "./clue-validation.js";
import type { ProseChapter } from "./types.js";

type CompositionRange = { min_pct: number; max_pct: number };

export interface StageModeProfile {
  required_outcomes: string[];
  forbidden_reveals: string[];
  balance_targets?: Record<string, CompositionRange>;
}

export interface NarrativeBalanceProfile {
  mode: StageModeKey;
  targets: Record<string, CompositionRange>;
}

export interface NarrativeBalanceAssessment {
  mode: StageModeKey;
  hints: string[];
  dominantFocus?: string;
  underrepresentedFocus?: string[];
}

const BALANCE_SIGNAL_LEXICON: Record<string, string[]> = {
  investigation: ["evidence", "witness", "alibi", "timeline", "question", "examine"],
  atmosphere: ["fog", "rain", "shadow", "lamp", "cold", "silence"],
  suspicion: ["suspect", "doubt", "fear", "nervous", "hesitation", "pressure"],
  inference: ["therefore", "implies", "inferred", "conclusion", "deduced", "reasoning"],
  exoneration: ["cleared", "ruled out", "innocent", "alibi", "could not have"],
  redirection: ["instead", "shifted", "next lead", "redirected", "another suspect"],
  reinterpretation: ["reframed", "actually meant", "new reading", "reinterpret", "recast"],
  test_execution: ["test", "comparison", "observed", "result", "experiment", "demonstration"],
  proof_chain: ["proved", "rules out", "because", "therefore", "evidence chain"],
  consequence: ["aftermath", "consequence", "fallout", "grief", "reckoning", "changed"],
  reflection: ["reflected", "realized", "regret", "accepted", "understood"],
};

const defaultStageModeProfiles: Record<StageModeKey, Omit<StageModeProfile, "balance_targets">> = {
  discovery_opening: {
    required_outcomes: [
      "Name the victim explicitly.",
      "Introduce investigator and major suspects with role relevance and latent tension.",
      "Plant the first clue without full mechanism explanation.",
    ],
    forbidden_reveals: [
      "No culprit reveal.",
      "No full murder mechanism explanation.",
    ],
  },
  early_investigation: {
    required_outcomes: [
      "Develop one or two clues through questioning, contradiction, or alibi pressure.",
      "Change the investigator's working theory by chapter end.",
    ],
    forbidden_reveals: [
      "No final culprit resolution.",
    ],
  },
  suspect_pressure: {
    required_outcomes: [
      "Reveal at least one new character pressure truth (fear, motive, lie, loyalty conflict, or secret).",
      "End with changed suspicion state (more suspicious, less suspicious, or more complex).",
    ],
    forbidden_reveals: [
      "No full murder confession unless the outline explicitly requires it.",
    ],
  },
  false_suspect_clearing: {
    required_outcomes: [
      "Show why the suspect looked guilty.",
      "Prove innocence using concrete evidence/alibi/logic.",
      "Shift suspicion to the next investigable target.",
    ],
    forbidden_reveals: [
      "Do not clear by assertion or convenience.",
    ],
  },
  clue_reinterpretation: {
    required_outcomes: [
      "State what an earlier clue seemed to mean.",
      "State what it now means and how the theory changes.",
    ],
    forbidden_reveals: [
      "No decisive new evidence from nowhere.",
    ],
  },
  discriminating_test: {
    required_outcomes: [
      "State competing theory/hypothesis paths.",
      "Run or reveal a concrete test with observable result.",
      "Explicitly state what the result proves and what it rules out.",
    ],
    forbidden_reveals: [
      "Do not merely restate existing evidence.",
    ],
  },
  final_reveal: {
    required_outcomes: [
      "Deliver motive, method of death, opportunity, and evidence chain.",
      "Distinguish murder method from concealment mechanism.",
      "State culprit mistake/trace and consequences.",
    ],
    forbidden_reveals: [
      "Do not end with mechanism-only confession.",
    ],
  },
  aftermath_consequence: {
    required_outcomes: [
      "Show emotional and social consequences after truth lands.",
      "Show changed order among surviving characters.",
    ],
    forbidden_reveals: [
      "Do not introduce decisive new mystery evidence.",
    ],
  },
};

export const formatCompositionLabel = (value: string): string =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

export const getStageModeProfile = (mode: StageModeKey): StageModeProfile => {
  const cfg = (getGenerationParams().agent9_prose as any)?.stage_modes?.[mode];
  const fallback = defaultStageModeProfiles[mode] ?? defaultStageModeProfiles.early_investigation;
  return {
    required_outcomes: Array.isArray(cfg?.required_outcomes) && cfg.required_outcomes.length > 0
      ? cfg.required_outcomes.map((value: unknown) => String(value))
      : [...fallback.required_outcomes],
    forbidden_reveals: Array.isArray(cfg?.forbidden_reveals) && cfg.forbidden_reveals.length > 0
      ? cfg.forbidden_reveals.map((value: unknown) => String(value))
      : [...fallback.forbidden_reveals],
    balance_targets: cfg?.balance_targets && typeof cfg.balance_targets === "object"
      ? cfg.balance_targets
      : undefined,
  };
};

export const getNarrativeBalanceProfile = (mode: StageModeKey): NarrativeBalanceProfile | null => {
  const targets = getStageModeProfile(mode).balance_targets;
  if (!targets || typeof targets !== "object") {
    return null;
  }
  return {
    mode,
    targets,
  };
};

const formatBalanceTargets = (targets: Record<string, CompositionRange>): string =>
  Object.entries(targets)
    .map(([name, range]) => {
      const minPct = Number(range?.min_pct);
      const maxPct = Number(range?.max_pct);
      if (!Number.isFinite(minPct) || !Number.isFinite(maxPct)) return "";
      const pct = minPct === maxPct ? `${minPct}%` : `${minPct}-${maxPct}%`;
      return `- ${formatCompositionLabel(name)}: ${pct}`;
    })
    .filter(Boolean)
    .join("\n");

export const buildNarrativeBalanceBlock = (mode: StageModeKey): string => {
  const profile = getNarrativeBalanceProfile(mode);
  if (!profile) return "";
  const balanceLines = formatBalanceTargets(profile.targets);
  if (!balanceLines) return "";
  return [
    "Mode-specific narrative balance targets:",
    balanceLines,
  ].join("\n");
};

export const assessNarrativeBalanceSignals = (
  chapter: ProseChapter,
  mode: StageModeKey,
): NarrativeBalanceAssessment => {
  const profile = getNarrativeBalanceProfile(mode);
  if (!profile) {
    return { mode, hints: [] };
  }

  const text = Array.isArray(chapter?.paragraphs)
    ? chapter.paragraphs.join(" ").toLowerCase()
    : "";
  if (!text.trim()) {
    return {
      mode,
      hints: ["Chapter text is sparse; keep edits focused on the active stage outcomes and evidence-linked beats."],
    };
  }

  const signalCounts = Object.entries(profile.targets).map(([focus, range]) => {
    const lexicon = BALANCE_SIGNAL_LEXICON[focus] ?? [focus.replace(/_/g, " ")];
    const hits = lexicon.reduce((count, token) => {
      const normalized = token.trim().toLowerCase();
      if (!normalized) return count;
      if (text.includes(normalized)) return count + 1;
      return count;
    }, 0);
    return {
      focus,
      minPct: Number(range?.min_pct),
      maxPct: Number(range?.max_pct),
      hits,
    };
  });

  const totalHits = signalCounts.reduce((sum, entry) => sum + entry.hits, 0);
  const dominant = signalCounts.reduce<typeof signalCounts[number] | null>((best, entry) => {
    if (!best || entry.hits > best.hits) return entry;
    return best;
  }, null);
  const dominantFocus = dominant && dominant.hits > 0 ? dominant.focus : undefined;

  const underrepresented = signalCounts
    .filter((entry) => {
      if (!Number.isFinite(entry.minPct)) return false;
      if (totalHits === 0) return true;
      const observedPct = (entry.hits / totalHits) * 100;
      return observedPct < Math.max(5, entry.minPct * 0.5);
    })
    .map((entry) => entry.focus);

  const hints: string[] = [];
  if (underrepresented.length > 0) {
    hints.push(
      `Add one concise beat emphasizing ${underrepresented.slice(0, 2).map((name) => formatCompositionLabel(name)).join(" and ")} while preserving existing facts.`,
    );
  }
  if (dominant && Number.isFinite(dominant.maxPct) && totalHits > 0) {
    const dominantPct = (dominant.hits / totalHits) * 100;
    if (dominantPct > dominant.maxPct + 15) {
      hints.push(
        `Trim over-concentration on ${formatCompositionLabel(dominant.focus)} and rebalance with one additional stage-appropriate evidence or consequence beat.`,
      );
    }
  }

  return {
    mode,
    hints,
    dominantFocus,
    underrepresentedFocus: underrepresented.length > 0 ? underrepresented : undefined,
  };
};

export const buildStageModeContractBlock = (
  activeMode: StageModeKey,
): string => {
  const profile = getStageModeProfile(activeMode);
  const narrativeBalanceBlock = buildNarrativeBalanceBlock(activeMode);
  const lines = [
    "\n\n## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)",
    `Active chapter mode: ${formatStageModeLabel(activeMode)}.`,
    "Mode required outcomes:",
    ...profile.required_outcomes.map((item) => `- ${item}`),
    "Forbidden at this stage:",
    ...profile.forbidden_reveals.map((item) => `- ${item}`),
  ];
  if (narrativeBalanceBlock) {
    lines.push(narrativeBalanceBlock);
  }
  return lines.join("\n");
};
