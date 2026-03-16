/**
 * Agent 3: CML Generator - Prompt building and generation
 * This is the CORE agent - the backbone of the mystery generation system
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CMLPromptInputs, CMLGenerationResult, PromptMessages } from "./types.js";
/**
 * Build the complete prompt for CML generation
 */
export declare function buildCMLPrompt(inputs: CMLPromptInputs, examplesDir?: string): PromptMessages;
/**
 * Generate CML with retry loop and validation
 */
export declare function generateCML(client: AzureOpenAIClient, inputs: CMLPromptInputs, examplesDir?: string, maxAttempts?: number): Promise<CMLGenerationResult>;
