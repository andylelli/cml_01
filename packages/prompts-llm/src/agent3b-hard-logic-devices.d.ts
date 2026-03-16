/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Generates novel, contradiction-driven mechanism concepts before CML generation.
 * This ensures the final CML is grounded in explicitly generated novel devices,
 * not only keyword-derived directives.
 */
import type { AzureOpenAIClient, Message } from "@cml/llm-client";
import type { HardLogicDeviceIdea } from "./types.js";
export interface HardLogicDeviceInputs {
    runId: string;
    projectId: string;
    decade: string;
    location: string;
    institution: string;
    tone: string;
    theme?: string;
    primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
    mechanismFamilies?: string[];
    hardLogicModes?: string[];
    difficultyMode?: "standard" | "increase" | "extreme";
    noveltyConstraints?: {
        divergeFrom: string[];
        areas: string[];
        avoidancePatterns: string[];
    };
}
export interface HardLogicDeviceResult {
    status: "ok";
    overview: string;
    devices: HardLogicDeviceIdea[];
    rawResponse: string;
    attempt: number;
    latencyMs: number;
    cost: number;
}
export declare function buildHardLogicDevicePrompt(inputs: HardLogicDeviceInputs, previousErrors?: string[]): {
    system: string;
    developer: string;
    user: string;
    messages: Message[];
};
export declare function generateHardLogicDevices(client: AzureOpenAIClient, inputs: HardLogicDeviceInputs, maxAttempts?: number): Promise<HardLogicDeviceResult>;
