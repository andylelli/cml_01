/**
 * Agent 7: Narrative Formatter
 *
 * Transforms validated CML + clues into a scene-by-scene narrative outline.
 * Acts as bridge between logical structure (CML) and prose generation.
 *
 * - Organizes scenes by three-act structure
 * - Places clues naturally within scenes
 * - Creates dramatic pacing and tension
 * - Shows character interactions and development
 * - Sets up reveals, twists, and false assumptions
 * - Provides scene descriptions for prose generation
 *
 * Temperature: 0.5 (moderate - creative scene structuring grounded in CML)
 * Max Tokens: 4000 (larger - detailed scene descriptions)
 * Output Format: JSON (structured scene list)
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "./agent5-clues.js";
import type { PromptComponents } from "./types.js";
export interface NarrativeFormattingInputs {
    caseData: CaseData;
    clues: ClueDistributionResult;
    targetLength?: "short" | "medium" | "long";
    narrativeStyle?: "classic" | "modern" | "atmospheric";
    detectiveType?: 'police' | 'private' | 'amateur';
    qualityGuardrails?: string[];
    runId?: string;
    projectId?: string;
}
export interface Scene {
    sceneNumber: number;
    act: 1 | 2 | 3;
    title: string;
    setting: {
        location: string;
        timeOfDay: string;
        atmosphere: string;
    };
    characters: string[];
    purpose: string;
    cluesRevealed: string[];
    dramaticElements: {
        conflict?: string;
        tension?: string;
        revelation?: string;
        misdirection?: string;
        microMomentBeats?: string[];
    };
    summary: string;
    estimatedWordCount: number;
}
export interface ActStructure {
    actNumber: 1 | 2 | 3;
    title: string;
    purpose: string;
    scenes: Scene[];
    estimatedWordCount: number;
}
export interface NarrativeOutline {
    acts: ActStructure[];
    totalScenes: number;
    estimatedTotalWords: number;
    pacingNotes: string[];
    cost: number;
    durationMs: number;
}
export declare function buildNarrativePrompt(inputs: NarrativeFormattingInputs): PromptComponents;
export declare function formatNarrative(client: AzureOpenAIClient, inputs: NarrativeFormattingInputs): Promise<NarrativeOutline>;
